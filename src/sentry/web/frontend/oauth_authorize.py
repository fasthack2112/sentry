import logging
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from django.conf import settings
from django.db import IntegrityError, transaction
from django.http import HttpRequest, HttpResponse
from django.utils import timezone
from django.utils.safestring import mark_safe

from sentry.models import ApiApplication, ApiApplicationStatus, ApiAuthorization, ApiGrant, ApiToken
from sentry.web.frontend.auth_login import AuthLoginView

logger = logging.getLogger("sentry.api")


class OAuthAuthorizeView(AuthLoginView):
    auth_required = False

    def get_next_uri(self, request: HttpRequest):
        return request.get_full_path()

    def redirect_response(self, response_type, redirect_uri, params):
        if response_type == "token":
            return self.redirect(
                "{}#{}".format(
                    redirect_uri,
                    urlencode([(k, v) for k, v in params.items() if v is not None]),
                )
            )

        parts = list(urlparse(redirect_uri))
        query = parse_qsl(parts[4])
        for key, value in params.items():
            if value is not None:
                query.append((key, value))
        parts[4] = urlencode(query)
        return self.redirect(urlunparse(parts))

    def error(
        self,
        request,
        response_type,
        redirect_uri,
        name,
        state=None,
        client_id=None,
        err_response=None,
    ):
        logging.error(
            "oauth.authorize-error",
            extra={
                "error_name": name,
                "response_type": response_type,
                "client_id": client_id,
                "redirect_uri": redirect_uri,
            },
        )
        if err_response:
            return self.respond(
                "sentry/oauth-error.html",
                {"error": mark_safe(f"Missing or invalid <em>{err_response}</em> parameter.")},
                status=400,
            )

        return self.redirect_response(response_type, redirect_uri, {"error": name, "state": state})

    def respond_login(self, request: HttpRequest, context, application, **kwargs):
        context["banner"] = f"Connect Sentry to {application.name}"
        return self.respond("sentry/login.html", context)

    def get(self, request: HttpRequest, **kwargs) -> HttpResponse:
        response_type = request.GET.get("response_type")
        client_id = request.GET.get("client_id")
        redirect_uri = request.GET.get("redirect_uri")
        scopes = request.GET.get("scope")
        state = request.GET.get("state")
        force_prompt = request.GET.get("force_prompt")

        if not client_id:
            return self.error(
                request=request,
                client_id=client_id,
                response_type=response_type,
                redirect_uri=redirect_uri,
                name="unauthorized_client",
                err_response="client_id",
            )

        try:
            application = ApiApplication.objects.get(
                client_id=client_id, status=ApiApplicationStatus.active
            )
        except ApiApplication.DoesNotExist:
            return self.error(
                request=request,
                client_id=client_id,
                response_type=response_type,
                redirect_uri=redirect_uri,
                name="unauthorized_client",
                err_response="client_id",
            )

        if not redirect_uri:
            redirect_uri = application.get_default_redirect_uri()
        elif not application.is_valid_redirect_uri(redirect_uri):
            return self.error(
                request=request,
                client_id=client_id,
                response_type=response_type,
                redirect_uri=redirect_uri,
                name="invalid_request",
                err_response="redirect_uri",
            )

        if not application.is_allowed_response_type(response_type):
            return self.error(
                request=request,
                client_id=client_id,
                response_type=response_type,
                redirect_uri=redirect_uri,
                name="unsupported_response_type",
                err_response="client_id",
            )

        if scopes:
            scopes = scopes.split(" ")
            for scope in scopes:
                if scope not in settings.SENTRY_SCOPES:
                    return self.error(
                        request=request,
                        client_id=client_id,
                        response_type=response_type,
                        redirect_uri=redirect_uri,
                        name="invalid_scope",
                        state=state,
                    )
        else:
            scopes = []

        payload = {
            "rt": response_type,
            "cid": client_id,
            "ru": redirect_uri,
            "sc": scopes,
            "st": state,
            "uid": request.user.id if request.user.is_authenticated else "",
        }
        request.session["oa2"] = payload

        if not request.user.is_authenticated:
            return super().get(request, application=application)

        if not force_prompt:
            try:
                existing_auth = ApiAuthorization.objects.get(
                    user_id=request.user.id, application=application
                )
            except ApiAuthorization.DoesNotExist:
                pass
            else:
                # if we've already approved all of the required scopes
                # we can skip prompting the user
                if all(existing_auth.has_scope(s) for s in scopes):
                    return self.approve(
                        request=request,
                        application=application,
                        scopes=scopes,
                        response_type=response_type,
                        redirect_uri=redirect_uri,
                        state=state,
                    )

        payload = {
            "rt": response_type,
            "cid": client_id,
            "ru": redirect_uri,
            "sc": scopes,
            "st": state,
            "uid": request.user.id,
        }
        request.session["oa2"] = payload

        permissions = []
        if scopes:
            pending_scopes = set(scopes)
            matched_sets = set()
            for scope_set in settings.SENTRY_SCOPE_SETS:
                for scope, description in scope_set:
                    if scope_set in matched_sets and scope in pending_scopes:
                        pending_scopes.remove(scope)
                    elif scope in pending_scopes:
                        permissions.append(description)
                        matched_sets.add(scope_set)
                        pending_scopes.remove(scope)

            if pending_scopes:
                raise NotImplementedError(f"{pending_scopes} scopes did not have descriptions")

        context = {
            "user": request.user,
            "application": application,
            "scopes": scopes,
            "permissions": permissions,
        }
        return self.respond("sentry/oauth-authorize.html", context)

    def post(self, request: HttpRequest, **kwargs) -> HttpResponse:
        try:
            payload = request.session["oa2"]
        except KeyError:
            return self.respond(
                "sentry/oauth-error.html",
                {
                    "error": "We were unable to complete your request. Please re-initiate the authorization flow."
                },
            )

        try:
            application = ApiApplication.objects.get(
                client_id=payload["cid"], status=ApiApplicationStatus.active
            )
        except ApiApplication.DoesNotExist:
            return self.respond(
                "sentry/oauth-error.html",
                {"error": mark_safe("Missing or invalid <em>client_id</em> parameter.")},
            )

        if not request.user.is_authenticated:
            response = super().post(request, application=application, **kwargs)
            # once they login, bind their user ID
            if request.user.is_authenticated:
                request.session["oa2"]["uid"] = request.user.id
                request.session.modified = True
            return response

        if payload["uid"] != request.user.id:
            return self.respond(
                "sentry/oauth-error.html",
                {
                    "error": "We were unable to complete your request. Please re-initiate the authorization flow."
                },
            )

        response_type = payload["rt"]
        redirect_uri = payload["ru"]
        scopes = payload["sc"]

        op = request.POST.get("op")
        if op == "approve":
            return self.approve(
                request=request,
                application=application,
                scopes=scopes,
                response_type=response_type,
                redirect_uri=redirect_uri,
                state=payload["st"],
            )

        elif op == "deny":
            return self.error(
                request=request,
                client_id=payload["cid"],
                response_type=response_type,
                redirect_uri=redirect_uri,
                name="access_denied",
                state=payload["st"],
            )
        else:
            raise NotImplementedError

    def approve(self, request: HttpRequest, application, **params):
        try:
            with transaction.atomic():
                ApiAuthorization.objects.create(
                    application=application, user_id=request.user.id, scope_list=params["scopes"]
                )
        except IntegrityError:
            if params["scopes"]:
                auth = ApiAuthorization.objects.get(
                    application=application, user_id=request.user.id
                )
                for scope in params["scopes"]:
                    if scope not in auth.scope_list:
                        auth.scope_list.append(scope)
                auth.save()

        if params["response_type"] == "code":
            grant = ApiGrant.objects.create(
                user_id=request.user.id,
                application=application,
                redirect_uri=params["redirect_uri"],
                scope_list=params["scopes"],
            )
            return self.redirect_response(
                params["response_type"],
                params["redirect_uri"],
                {"code": grant.code, "state": params["state"]},
            )
        elif params["response_type"] == "token":
            token = ApiToken.objects.create(
                application=application,
                user_id=request.user.id,
                refresh_token=None,
                scope_list=params["scopes"],
            )

            return self.redirect_response(
                params["response_type"],
                params["redirect_uri"],
                {
                    "access_token": token.token,
                    "expires_in": int((timezone.now() - token.expires_at).total_seconds()),
                    "expires_at": token.expires_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                    "token_type": "bearer",
                    "scope": " ".join(token.get_scopes()),
                    "state": params["state"],
                },
            )
