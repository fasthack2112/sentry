import {useCallback, useState} from 'react';
import {browserHistory} from 'react-router';
import styled from '@emotion/styled';

import {
  addErrorMessage,
  addLoadingMessage,
  addSuccessMessage,
} from 'sentry/actionCreators/indicator';
import Alert from 'sentry/components/alert';
import {Button} from 'sentry/components/button';
import FieldGroup from 'sentry/components/forms/fieldGroup';
import TextField from 'sentry/components/forms/fields/textField';
import Form from 'sentry/components/forms/form';
import ExternalLink from 'sentry/components/links/externalLink';
import Panel from 'sentry/components/panels/panel';
import PanelBody from 'sentry/components/panels/panelBody';
import PanelHeader from 'sentry/components/panels/panelHeader';
import PanelItem from 'sentry/components/panels/panelItem';
import SentryDocumentTitle from 'sentry/components/sentryDocumentTitle';
import TextCopyInput from 'sentry/components/textCopyInput';
import {t, tct} from 'sentry/locale';
import {space} from 'sentry/styles/space';
import {Organization, OrgAuthToken} from 'sentry/types';
import getDynamicText from 'sentry/utils/getDynamicText';
import {handleXhrErrorResponse} from 'sentry/utils/handleXhrErrorResponse';
import {useMutation, useQueryClient} from 'sentry/utils/queryClient';
import RequestError from 'sentry/utils/requestError/requestError';
import useApi from 'sentry/utils/useApi';
import {normalizeUrl} from 'sentry/utils/withDomainRequired';
import withOrganization from 'sentry/utils/withOrganization';
import SettingsPageHeader from 'sentry/views/settings/components/settingsPageHeader';
import TextBlock from 'sentry/views/settings/components/text/textBlock';
import {makeFetchOrgAuthTokensForOrgQueryKey} from 'sentry/views/settings/organizationAuthTokens';

type CreateTokenQueryVariables = {
  name: string;
};

type OrgAuthTokenWithToken = OrgAuthToken & {token: string};

type CreateOrgAuthTokensResponse = OrgAuthTokenWithToken;

function AuthTokenCreateForm({
  organization,
  onCreatedToken,
}: {
  onCreatedToken: (token: OrgAuthTokenWithToken) => void;
  organization: Organization;
}) {
  const initialData = {
    name: '',
  };

  const api = useApi();
  const queryClient = useQueryClient();

  const handleGoBack = useCallback(() => {
    browserHistory.push(normalizeUrl(`/settings/${organization.slug}/auth-tokens/`));
  }, [organization.slug]);

  const {mutate: submitToken} = useMutation<
    CreateOrgAuthTokensResponse,
    RequestError,
    CreateTokenQueryVariables
  >({
    mutationFn: ({name}) => {
      addLoadingMessage();
      return api.requestPromise(`/organizations/${organization.slug}/org-auth-tokens/`, {
        method: 'POST',
        data: {
          name,
        },
      });
    },

    onSuccess: (token: OrgAuthTokenWithToken) => {
      addSuccessMessage(t('Created auth token.'));

      queryClient.invalidateQueries({
        queryKey: makeFetchOrgAuthTokensForOrgQueryKey({orgSlug: organization.slug}),
      });

      onCreatedToken(token);
    },
    onError: error => {
      const message = t('Failed to create a new auth token.');
      handleXhrErrorResponse(message, error);
      addErrorMessage(message);
    },
  });

  return (
    <Form
      apiMethod="POST"
      initialData={initialData}
      apiEndpoint={`/organizations/${organization.slug}/org-auth-tokens/`}
      onSubmit={({name}) => {
        submitToken({
          name,
        });
      }}
      onCancel={handleGoBack}
      submitLabel={t('Create Auth Token')}
      requireChanges
    >
      <TextField
        name="name"
        label={t('Name')}
        required
        help={t('A name to help you identify this token.')}
      />

      <FieldGroup
        label={t('Scopes')}
        help={t('Organization auth tokens currently have a limited set of scopes.')}
      >
        <div>
          <div>org:ci</div>
          <ScopeHelpText>{t('Source Map Upload, Release Creation')}</ScopeHelpText>
        </div>
      </FieldGroup>
    </Form>
  );
}

function ShowNewToken({
  token,
  organization,
}: {
  organization: Organization;
  token: OrgAuthTokenWithToken;
}) {
  const handleGoBack = useCallback(() => {
    browserHistory.push(normalizeUrl(`/settings/${organization.slug}/auth-tokens/`));
  }, [organization.slug]);

  return (
    <div>
      <Alert type="warning" showIcon system>
        {t("Please copy this token to a safe place — it won't be shown again!")}
      </Alert>

      <PanelItem>
        <InputWrapper>
          <FieldGroupNoPadding
            label={t('Token')}
            help={t('You can only view this token when it was created.')}
            inline
            flexibleControlStateSize
          >
            <TextCopyInput aria-label={t('Generated token')}>
              {getDynamicText({value: token.token, fixed: 'ORG_AUTH_TOKEN'})}
            </TextCopyInput>
          </FieldGroupNoPadding>
        </InputWrapper>
      </PanelItem>

      <PanelItem>
        <ButtonWrapper>
          <Button onClick={handleGoBack} priority="primary">
            {t('Done')}
          </Button>
        </ButtonWrapper>
      </PanelItem>
    </div>
  );
}

export function OrganizationAuthTokensNewAuthToken({
  organization,
}: {
  organization: Organization;
}) {
  const [newToken, setNewToken] = useState<OrgAuthTokenWithToken | null>(null);

  return (
    <div>
      <SentryDocumentTitle title={t('Create New Auth Token')} />
      <SettingsPageHeader title={t('Create New Auth Token')} />

      <TextBlock>
        {t(
          "Authentication tokens allow you to perform actions against the Sentry API on behalf of your organization. They're the easiest way to get started using the API."
        )}
      </TextBlock>
      <TextBlock>
        {tct(
          'For more information on how to use the web API, see our [link:documentation].',
          {
            link: <ExternalLink href="https://docs.sentry.io/api/" />,
          }
        )}
      </TextBlock>
      <Panel>
        <PanelHeader>{t('Create New Auth Token')}</PanelHeader>

        <PanelBody>
          {newToken ? (
            <ShowNewToken token={newToken} organization={organization} />
          ) : (
            <AuthTokenCreateForm
              organization={organization}
              onCreatedToken={setNewToken}
            />
          )}
        </PanelBody>
      </Panel>
    </div>
  );
}

export default withOrganization(OrganizationAuthTokensNewAuthToken);

const InputWrapper = styled('div')`
  flex: 1;
`;

const ButtonWrapper = styled('div')`
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: ${p => p.theme.fontSizeSmall};
  gap: ${space(1)};
`;

const FieldGroupNoPadding = styled(FieldGroup)`
  padding: 0;
`;

const ScopeHelpText = styled('div')`
  color: ${p => p.theme.gray300};
`;
