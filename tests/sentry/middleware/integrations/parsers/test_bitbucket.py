from unittest import mock
from unittest.mock import MagicMock

from django.http import HttpResponse
from django.test import RequestFactory, override_settings
from django.urls import reverse

from sentry.middleware.integrations.integration_control import IntegrationControlMiddleware
from sentry.middleware.integrations.parsers.bitbucket import BitbucketRequestParser
from sentry.models.outbox import ControlOutbox, WebhookProviderIdentifier
from sentry.services.hybrid_cloud.organization_mapping.service import organization_mapping_service
from sentry.silo.base import SiloMode
from sentry.testutils import TestCase
from sentry.testutils.region import override_regions
from sentry.testutils.silo import control_silo_test
from sentry.types.region import Region, RegionCategory


@control_silo_test()
class BitbucketRequestParserTest(TestCase):
    get_response = MagicMock(return_value=HttpResponse(content=b"no-error", status=200))
    middleware = IntegrationControlMiddleware(get_response)
    factory = RequestFactory()
    region = Region("na", 1, "https://na.testserver", RegionCategory.MULTI_TENANT)
    region_config = (region,)

    def setUp(self):
        super().setUp()
        self.path = reverse(
            "sentry-extensions-bitbucket-webhook", kwargs={"organization_id": self.organization.id}
        )
        self.integration = self.create_integration(
            organization=self.organization, external_id="bitbucket:1", provider="bitbucket"
        )

    @override_settings(SILO_MODE=SiloMode.CONTROL)
    def test_routing_endpoints(self):
        control_routes = [
            reverse("sentry-extensions-bitbucket-descriptor"),
            reverse("sentry-extensions-bitbucket-installed"),
            reverse("sentry-extensions-bitbucket-uninstalled"),
            reverse(
                "sentry-extensions-bitbucket-search",
                kwargs={
                    "organization_slug": self.organization.slug,
                    "integration_id": self.integration.id,
                },
            ),
        ]
        for route in control_routes:
            request = self.factory.post(route)
            parser = BitbucketRequestParser(request=request, response_handler=self.get_response)
            with mock.patch.object(
                parser, "get_response_from_control_silo"
            ) as get_response_from_control_silo:
                assert not get_response_from_control_silo.called
                parser.get_response()
                assert get_response_from_control_silo.called

    @override_settings(SILO_MODE=SiloMode.CONTROL)
    def test_routing_webhook(self):
        region_route = reverse(
            "sentry-extensions-bitbucket-webhook", kwargs={"organization_id": self.organization.id}
        )
        request = self.factory.post(region_route)
        parser = BitbucketRequestParser(request=request, response_handler=self.get_response)

        # Missing region
        organization_mapping_service.update(
            organization_id=self.organization.id, update={"region_name": "eu"}
        )
        with mock.patch.object(
            parser, "get_response_from_control_silo"
        ) as get_response_from_control_silo:
            parser.get_response()
            assert get_response_from_control_silo.called

        # Valid region
        organization_mapping_service.update(
            organization_id=self.organization.id, update={"region_name": "na"}
        )
        with override_regions(self.region_config):
            parser.get_response()
            outboxes = ControlOutbox.objects.filter(
                shard_identifier=WebhookProviderIdentifier.BITBUCKET
            )
            assert len(outboxes) == 1
