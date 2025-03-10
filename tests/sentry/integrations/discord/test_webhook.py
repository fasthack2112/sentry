from unittest import mock

import responses

from sentry.testutils.cases import APITestCase
from sentry.testutils.silo import region_silo_test

WEBHOOK_URL = "/extensions/discord/interactions/"


@region_silo_test(stable=True)
class DiscordWebhookTest(APITestCase):
    @responses.activate
    @mock.patch("sentry.integrations.discord.requests.base.verify_signature")
    def test_ping_interaction(self, mock_verify_signature):
        mock_verify_signature.return_value = True
        resp = self.client.post(
            path=WEBHOOK_URL,
            data={
                "type": 1,
            },
            format="json",
            HTTP_X_SIGNATURE_ED25519="signature",
            HTTP_X_SIGNATURE_TIMESTAMP="timestamp",
        )

        assert resp.status_code == 200
        assert resp.json()["type"] == 1
        assert mock_verify_signature.call_count == 1

    @responses.activate
    @mock.patch("sentry.integrations.discord.requests.base.verify_signature")
    def test_unknown_interaction(self, mock_verify_signature):
        mock_verify_signature.return_value = True
        resp = self.client.post(
            path=WEBHOOK_URL,
            data={
                "type": -1,
            },
            format="json",
            HTTP_X_SIGNATURE_ED25519="signature",
            HTTP_X_SIGNATURE_TIMESTAMP="timestamp",
        )

        assert resp.status_code == 200

    @responses.activate
    @mock.patch("sentry.integrations.discord.requests.base.verify_signature")
    def test_unauthorized_interaction(self, mock_verify_signature):
        mock_verify_signature.return_value = False
        resp = self.client.post(
            path=WEBHOOK_URL,
            data={
                "type": -1,
            },
            format="json",
            HTTP_X_SIGNATURE_ED25519="signature",
            HTTP_X_SIGNATURE_TIMESTAMP="timestamp",
        )

        assert resp.status_code == 401

    @responses.activate
    def test_missing_signature(self):
        resp = self.client.post(
            path=WEBHOOK_URL,
            data={
                "type": -1,
            },
            format="json",
            HTTP_X_SIGNATURE_TIMESTAMP="timestamp",
        )

        assert resp.status_code == 401

    @responses.activate
    def test_missing_timestamp(self):
        resp = self.client.post(
            path=WEBHOOK_URL,
            data={
                "type": -1,
            },
            format="json",
            HTTP_X_SIGNATURE_ED25519="signature",
        )

        assert resp.status_code == 401
