from urllib.parse import parse_qs

import responses
from django.conf import settings
from django.db import router
from django.test import override_settings
from django.urls import re_path
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from sentry.api.base import control_silo_endpoint, region_silo_endpoint
from sentry.api.bases.organization import OrganizationEndpoint
from sentry.models.organizationmapping import OrganizationMapping
from sentry.silo import unguarded_write
from sentry.testutils import APITestCase
from sentry.types.region import Region, RegionCategory, clear_global_regions
from sentry.utils import json

SENTRY_REGION_CONFIG = [
    Region(
        name="region1",
        snowflake_id=1,
        address="http://region1.testserver",
        category=RegionCategory.MULTI_TENANT,
    ),
]


@control_silo_endpoint
class ControlEndpoint(OrganizationEndpoint):
    permission_classes = (AllowAny,)

    def get(self, request, organization):
        return Response({"proxy": False})


@region_silo_endpoint
class RegionEndpoint(OrganizationEndpoint):
    permission_classes = (AllowAny,)

    def get(self, request, organization):
        return Response({"proxy": False})


urlpatterns = [
    re_path(
        r"^organizations/(?P<organization_slug>[^\/]+)/control/$",
        ControlEndpoint.as_view(),
        name="control-endpoint",
    ),
    re_path(
        r"^organizations/(?P<organization_slug>[^\/]+)/region/$",
        RegionEndpoint.as_view(),
        name="region-endpoint",
    ),
]


def verify_request_body(body, headers):
    """Wrapper for a callback function for responses.add_callback"""

    def request_callback(request):
        if request.headers["content-type"] == "application/json":
            assert json.loads(request.body) == body
        else:
            assert request.body == body
        assert (request.headers[key] == headers[key] for key in headers)
        return 200, {}, json.dumps({"proxy": True})

    return request_callback


def verify_request_headers(headers):
    """Wrapper for a callback function for responses.add_callback"""

    def request_callback(request):
        assert (request.headers[key] == headers[key] for key in headers)
        return 200, {}, json.dumps({"proxy": True})

    return request_callback


def verify_request_params(params, headers):
    """Wrapper for a callback function for responses.add_callback"""

    def request_callback(request):
        request_params = parse_qs(request.url.split("?")[1])
        assert (request.headers[key] == headers[key] for key in headers)
        for key in params:
            assert key in request_params
            if len(request_params[key]) > 1:
                assert request_params[key] == params[key]
            else:
                assert request_params[key][0] == params[key]
        return 200, {}, json.dumps({"proxy": True})

    return request_callback


def verify_file_body(file_body, headers):
    """Wrapper for a callback function for responses.add_callback"""

    def request_callback(request):
        assert file_body in request.body or file_body in request.body.read()
        assert (request.headers[key] == headers[key] for key in headers)
        return 200, {}, json.dumps({"proxy": True})

    return request_callback


def provision_middleware():
    middleware = list(settings.MIDDLEWARE)
    if "sentry.middleware.api_gateway.ApiGatewayMiddleware" not in middleware:
        middleware = ["sentry.middleware.api_gateway.ApiGatewayMiddleware"] + middleware
    return middleware


@override_settings(SENTRY_REGION_CONFIG=SENTRY_REGION_CONFIG, ROOT_URLCONF=__name__)
class ApiGatewayTestCase(APITestCase):
    def setUp(self):
        super().setUp()
        clear_global_regions()
        responses.add(
            responses.GET,
            "http://region1.testserver/get",
            body=json.dumps({"proxy": True}),
            content_type="application/json",
            adding_headers={"test": "header"},
        )
        responses.add(
            responses.GET,
            "http://region1.testserver/error",
            body=json.dumps({"proxy": True}),
            status=400,
            content_type="application/json",
            adding_headers={"test": "header"},
        )

        with unguarded_write(using=router.db_for_write(OrganizationMapping)):
            OrganizationMapping.objects.get(organization_id=self.organization.id).update(
                region_name="region1"
            )

        # Echos the request body and header back for verification
        def return_request_body(request):
            return (200, request.headers, request.body)

        # Echos the query params and header back for verification
        def return_request_params(request):
            params = parse_qs(request.url.split("?")[1])
            return (200, request.headers, json.dumps(params).encode())

        responses.add_callback(
            responses.GET, "http://region1.testserver/echo", return_request_params
        )

        responses.add_callback(
            responses.POST, "http://region1.testserver/echo", return_request_body
        )

        self.middleware = provision_middleware()
