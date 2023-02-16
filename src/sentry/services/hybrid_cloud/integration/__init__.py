from abc import abstractmethod
from datetime import datetime
from typing import Any, Dict, Iterable, List, Optional, Tuple, Union

from pydantic.fields import Field

from sentry.constants import ObjectStatus
from sentry.integrations.base import (
    IntegrationFeatures,
    IntegrationInstallation,
    IntegrationProvider,
)
from sentry.models.integrations import Integration, OrganizationIntegration
from sentry.services.hybrid_cloud import (
    ApiPaginationArgs,
    ApiPaginationResult,
    InterfaceWithLifecycle,
    SiloDataInterface,
    silo_mode_delegation,
    stubbed,
)
from sentry.silo import SiloMode


class APIIntegration(SiloDataInterface):
    id: int = -1
    provider: str = ""
    external_id: str = ""
    name: str = ""
    metadata: Dict[str, Any] = Field(default_factory=dict)
    status: int = -1

    def __hash__(self) -> int:
        return hash(self.id)

    def get_provider(self) -> IntegrationProvider:
        from sentry import integrations

        return integrations.get(self.provider)  # type: ignore

    def get_status_display(self) -> str:
        for status_id, display in ObjectStatus.as_choices():
            if status_id == self.status:
                return display
        return "disabled"


class APIOrganizationIntegration(SiloDataInterface):
    id: int = -1
    default_auth_id: int = -1
    organization_id: int = -1
    integration_id: int = -1
    config: Dict[str, Any] = Field(default_factory=dict)
    status: int = -1  # As ObjectStatus
    grace_period_end: Optional[datetime] = None

    def __hash__(self) -> int:
        return hash(self.id)

    def get_status_display(self) -> str:
        for status_id, display in ObjectStatus.as_choices():
            if status_id == self.status:
                return display
        return "disabled"


class IntegrationService(InterfaceWithLifecycle):
    def _serialize_integration(self, integration: Integration) -> APIIntegration:
        return APIIntegration(
            id=integration.id,
            provider=integration.provider,
            external_id=integration.external_id,
            name=integration.name,
            metadata=integration.metadata,
            status=integration.status,
        )

    def _serialize_organization_integration(
        self, oi: OrganizationIntegration
    ) -> APIOrganizationIntegration:
        return APIOrganizationIntegration(
            id=oi.id,
            default_auth_id=oi.default_auth_id,
            organization_id=oi.organization_id,
            integration_id=oi.integration_id,
            config=oi.config,
            status=oi.status,
            grace_period_end=oi.grace_period_end,
        )

    @abstractmethod
    def page_integration_ids(
        self,
        *,
        provider_keys: List[str],
        organization_id: int,
        args: ApiPaginationArgs,
    ) -> ApiPaginationResult:
        pass

    @abstractmethod
    def page_organization_integrations_ids(
        self,
        *,
        organization_id: int,
        statuses: List[int],
        provider_key: Optional[str] = None,
        args: ApiPaginationArgs,
    ) -> ApiPaginationResult:
        pass

    @abstractmethod
    def get_integrations(
        self,
        *,
        integration_ids: Optional[Iterable[int]] = None,
        organization_id: Optional[int] = None,
        status: Optional[int] = None,
        providers: Optional[List[str]] = None,
        org_integration_status: Optional[int] = None,
        limit: Optional[int] = None,
    ) -> List[APIIntegration]:
        """
        Returns all APIIntegrations matching the provided kwargs.
        """
        pass

    @abstractmethod
    def get_integration(
        self,
        *,
        integration_id: Optional[int] = None,
        provider: Optional[str] = None,
        external_id: Optional[str] = None,
    ) -> Optional[APIIntegration]:
        """
        Returns an APIIntegration using either the id or a combination of the provider and external_id
        """
        pass

    @abstractmethod
    def get_organization_integrations(
        self,
        *,
        org_integration_ids: Optional[List[int]] = None,
        integration_id: Optional[int] = None,
        organization_id: Optional[int] = None,
        status: Optional[int] = None,
        providers: Optional[List[str]] = None,
        has_grace_period: Optional[bool] = None,
        limit: Optional[int] = None,
    ) -> List[APIOrganizationIntegration]:
        """
        Returns all APIOrganizationIntegrations from the matching kwargs.
        If providers is set, it will also be filtered by the integration providers set in the list.
        If has_grace_period is set, it will filter by whether the grace_period is null or not.
        """
        pass

    def get_organization_integration(
        self, *, integration_id: int, organization_id: int
    ) -> Optional[APIOrganizationIntegration]:
        """
        Returns an APIOrganizationIntegration from the integration and organization ids.
        """
        ois = self.get_organization_integrations(
            integration_id=integration_id, organization_id=organization_id, limit=1
        )
        return self._serialize_organization_integration(ois[0]) if len(ois) > 0 else None

    @abstractmethod
    def get_organization_context(
        self,
        *,
        organization_id: int,
        integration_id: Optional[int] = None,
        provider: Optional[str] = None,
        external_id: Optional[str] = None,
    ) -> Tuple[Optional[APIIntegration], Optional[APIOrganizationIntegration]]:
        """
        Returns a tuple of APIIntegration and APIOrganizationIntegration. The integration is selected
        by either integration_id, or a combination of provider and external_id.
        """
        pass

    @abstractmethod
    def update_integrations(
        self,
        *,
        integration_ids: List[int],
        name: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        status: Optional[int] = None,
    ) -> List[APIIntegration]:
        """
        Returns a list of APIIntegrations after updating the fields provided.
        To set a field as null, use the `set_{FIELD}_null` keyword argument.
        """
        pass

    @abstractmethod
    def update_integration(
        self,
        *,
        integration_id: int,
        name: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        status: Optional[int] = None,
    ) -> Optional[APIIntegration]:
        """
        Returns an APIIntegration after updating the fields provided.
        To set a field as null, use the `set_{FIELD}_null` keyword argument.
        """
        pass

    @abstractmethod
    def update_organization_integrations(
        self,
        *,
        org_integration_ids: List[int],
        config: Optional[Dict[str, Any]] = None,
        status: Optional[int] = None,
        grace_period_end: Optional[datetime] = None,
        set_grace_period_end_null: Optional[bool] = None,
    ) -> List[APIOrganizationIntegration]:
        """
        Returns a list of APIOrganizationIntegrations after updating the fields provided.
        To set a field as null, use the `set_{FIELD}_null` keyword argument.
        """
        pass

    @abstractmethod
    def update_organization_integration(
        self,
        *,
        org_integration_id: int,
        config: Optional[Dict[str, Any]] = None,
        status: Optional[int] = None,
        grace_period_end: Optional[datetime] = None,
        set_grace_period_end_null: Optional[bool] = None,
    ) -> Optional[APIOrganizationIntegration]:
        """
        Returns an APIOrganizationIntegration after updating the fields provided.
        To set a field as null, use the `set_{FIELD}_null` keyword argument.
        """
        pass

    # The following methods replace instance methods of the ORM objects!

    def get_installation(
        self,
        *,
        integration: Union[APIIntegration, Integration],
        organization_id: int,
    ) -> IntegrationInstallation:
        """
        Returns the IntegrationInstallation class for a given integration.
        Intended to replace calls of `integration.get_installation`.
        See src/sentry/models/integrations/integration.py
        """
        from sentry import integrations

        provider = integrations.get(integration.provider)
        installation: IntegrationInstallation = provider.get_installation(
            model=integration,
            organization_id=organization_id,
        )
        return installation

    def has_feature(self, *, provider: str, feature: IntegrationFeatures) -> bool:
        """
        Returns True if the IntegrationProvider subclass contains a given feature
        Intended to replace calls of `integration.has_feature`.
        See src/sentry/models/integrations/integration.py
        """
        from sentry import integrations

        int_provider: IntegrationProvider = integrations.get(provider)
        return feature in int_provider.features


def impl_with_db() -> IntegrationService:
    from sentry.services.hybrid_cloud.integration.impl import DatabaseBackedIntegrationService

    return DatabaseBackedIntegrationService()


integration_service: IntegrationService = silo_mode_delegation(
    {
        SiloMode.MONOLITH: impl_with_db,
        SiloMode.REGION: stubbed(impl_with_db, SiloMode.CONTROL),
        SiloMode.CONTROL: impl_with_db,
    }
)
