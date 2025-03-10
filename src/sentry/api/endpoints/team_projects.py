from typing import List

from django.db import IntegrityError, transaction
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import serializers, status
from rest_framework.request import Request
from rest_framework.response import Response

from sentry import audit_log
from sentry.api.base import EnvironmentMixin, region_silo_endpoint
from sentry.api.bases.team import TeamEndpoint, TeamPermission
from sentry.api.paginator import OffsetPaginator
from sentry.api.serializers import ProjectSummarySerializer, serialize
from sentry.api.serializers.models.project import OrganizationProjectResponse, ProjectSerializer
from sentry.apidocs.constants import RESPONSE_BAD_REQUEST, RESPONSE_FORBIDDEN
from sentry.apidocs.examples.project_examples import ProjectExamples
from sentry.apidocs.examples.team_examples import TeamExamples
from sentry.apidocs.parameters import CursorQueryParam, GlobalParams, ProjectParams
from sentry.apidocs.utils import inline_sentry_response_serializer
from sentry.constants import ObjectStatus
from sentry.models import Project
from sentry.signals import project_created
from sentry.utils.snowflake import MaxSnowflakeRetryError

ERR_INVALID_STATS_PERIOD = "Invalid stats_period. Valid choices are '', '24h', '14d', and '30d'"


class ProjectPostSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=50, required=True)
    slug = serializers.RegexField(r"^[a-z0-9_\-]+$", max_length=50, required=False, allow_null=True)
    platform = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    default_rules = serializers.BooleanField(required=False, initial=True)

    def validate_platform(self, value):
        if Project.is_valid_platform(value):
            return value
        raise serializers.ValidationError("Invalid platform")


# While currently the UI suggests teams are a parent of a project, in reality
# the project is the core component, and which team it is on is simply an
# attribute. Because you can already change the team of a project via mutating
# it, and because Sentry intends to remove teams as a hierarchy item, we
# allow you to view a teams projects, as well as create a new project as long
# as you are a member of that team and have project scoped permissions.


class TeamProjectPermission(TeamPermission):
    scope_map = {
        "GET": ["project:read", "project:write", "project:admin"],
        "POST": ["project:write", "project:admin"],
        "PUT": ["project:write", "project:admin"],
        "DELETE": ["project:admin"],
    }


@extend_schema(tags=["Teams"])
@region_silo_endpoint
class TeamProjectsEndpoint(TeamEndpoint, EnvironmentMixin):
    public = {"GET", "POST"}
    permission_classes = (TeamProjectPermission,)

    @extend_schema(
        operation_id="List a Team's Projects",
        parameters=[
            GlobalParams.ORG_SLUG,
            GlobalParams.TEAM_SLUG,
            CursorQueryParam,
        ],
        request=None,
        responses={
            200: inline_sentry_response_serializer(
                "ListTeamProjectResponse", List[OrganizationProjectResponse]
            ),
            403: RESPONSE_FORBIDDEN,
            404: OpenApiResponse(description="Team not found."),
        },
        examples=TeamExamples.LIST_TEAM_PROJECTS,
    )
    def get(self, request: Request, team) -> Response:
        """
        Return a list of projects bound to a team.
        """
        if request.auth and hasattr(request.auth, "project"):
            queryset = Project.objects.filter(id=request.auth.project.id)
        else:
            queryset = Project.objects.filter(teams=team, status=ObjectStatus.ACTIVE)

        stats_period = request.GET.get("statsPeriod")
        if stats_period not in (None, "", "24h", "14d", "30d"):
            return Response(
                {"error": {"params": {"stats_period": {"message": ERR_INVALID_STATS_PERIOD}}}},
                status=400,
            )
        elif not stats_period:
            # disable stats
            stats_period = None

        return self.paginate(
            request=request,
            queryset=queryset,
            order_by="slug",
            on_results=lambda x: serialize(
                x,
                request.user,
                ProjectSummarySerializer(
                    environment_id=self._get_environment_id_from_request(
                        request, team.organization.id
                    ),
                    stats_period=stats_period,
                ),
            ),
            paginator_cls=OffsetPaginator,
        )

    @extend_schema(
        # Ensure POST is in the projects tab
        tags=["Projects"],
        operation_id="Create a New Project",
        parameters=[
            GlobalParams.ORG_SLUG,
            GlobalParams.TEAM_SLUG,
            GlobalParams.name("The name for the project.", required=True),
            GlobalParams.slug(
                "Optional slug for the project. If not provided a slug is generated from the name."
            ),
            ProjectParams.platform("The platform for the project."),
            ProjectParams.DEFAULT_RULES,
        ],
        request=ProjectPostSerializer,
        responses={
            201: ProjectSerializer,
            400: RESPONSE_BAD_REQUEST,
            403: RESPONSE_FORBIDDEN,
            404: OpenApiResponse(description="Team not found."),
            409: OpenApiResponse(description="A project with this slug already exists."),
        },
        examples=ProjectExamples.CREATE_PROJECT,
    )
    def post(self, request: Request, team) -> Response:
        """
        Create a new project bound to a team.
        """
        serializer = ProjectPostSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        result = serializer.validated_data
        with transaction.atomic():
            try:
                with transaction.atomic():
                    project = Project.objects.create(
                        name=result["name"],
                        slug=result.get("slug"),
                        organization=team.organization,
                        platform=result.get("platform"),
                    )
            except (IntegrityError, MaxSnowflakeRetryError):
                return Response({"detail": "A project with this slug already exists."}, status=409)
            else:
                project.add_team(team)

            # XXX: create sample event?

            self.create_audit_entry(
                request=request,
                organization=team.organization,
                target_object=project.id,
                event=audit_log.get_event_id("PROJECT_ADD"),
                data=project.get_audit_log_data(),
            )

            project_created.send(
                project=project,
                user=request.user,
                default_rules=result.get("default_rules", True),
                sender=self,
            )

        return Response(serialize(project, request.user), status=201)
