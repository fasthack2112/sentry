import {useCallback, useState} from 'react';

import {LinkButton} from 'sentry/components/button';
import EmptyMessage from 'sentry/components/emptyMessage';
import ExternalLink from 'sentry/components/links/externalLink';
import Link from 'sentry/components/links/link';
import LoadingError from 'sentry/components/loadingError';
import LoadingIndicator from 'sentry/components/loadingIndicator';
import {Panel, PanelAlert, PanelBody, PanelHeader} from 'sentry/components/panels';
import {t, tct} from 'sentry/locale';
import {Organization, Project} from 'sentry/types';
import {useApiQuery} from 'sentry/utils/queryClient';
import withOrganization from 'sentry/utils/withOrganization';
import SettingsPageHeader from 'sentry/views/settings/components/settingsPageHeader';
import TextBlock from 'sentry/views/settings/components/text/textBlock';
import {LoaderSettings} from 'sentry/views/settings/project/projectKeys/details/loaderSettings';
import {ProjectKey} from 'sentry/views/settings/project/projectKeys/types';

export function ProjectLoaderScript({
  organization,
  project,
}: {
  organization: Organization;
  project: Project;
}) {
  const apiEndpoint = `/projects/${organization.slug}/${project.slug}/keys/`;
  const [updatedProjectKeys, setUpdatedProjectKeys] = useState<ProjectKey[]>([]);

  const {
    data: projectKeys,
    isLoading,
    error,
    refetch: refetchProjectKeys,
  } = useApiQuery<ProjectKey[]>([apiEndpoint], {
    staleTime: 0,
  });

  const handleUpdateProjectKey = useCallback(
    (projectKey: ProjectKey) => {
      const existingProjectIndex = updatedProjectKeys.findIndex(
        key => key.id === projectKey.id
      );
      const newUpdatedProjectKeys =
        existingProjectIndex > -1
          ? [...updatedProjectKeys].map((updatedProjectKey, index) => {
              return index === existingProjectIndex ? projectKey : updatedProjectKey;
            })
          : [...updatedProjectKeys, projectKey];

      setUpdatedProjectKeys(newUpdatedProjectKeys);
    },
    [updatedProjectKeys]
  );

  return (
    <div>
      <SettingsPageHeader title={t('Loader Script')} />

      <TextBlock>
        {tct(
          'The Loader Script is the easiest way to initialize the Sentry SDK. The Loader Script automatically keeps your Sentry SDK up to date and offers configuration for different Sentry features. [docsLink:Learn more about the Loader Script]. Note: The Loader Script is bound to a Client Key (DSN), to create a new Script, go to the [clientKeysLink:Client Keys page].',
          {
            docsLink: (
              <ExternalLink href="https://docs.sentry.io/platforms/javascript/install/loader/" />
            ),
            clientKeysLink: (
              <Link
                to={`/settings/${organization.slug}/projects/${project.slug}/keys/`}
              />
            ),
          }
        )}
      </TextBlock>

      {isLoading && <LoadingIndicator />}
      {!!error && (
        <LoadingError
          message={t('Failed to load project keys.')}
          onRetry={refetchProjectKeys}
        />
      )}
      {!isLoading && !error && !projectKeys?.length && (
        <EmptyMessage title={t('There are no keys active for this project.')} />
      )}

      {projectKeys?.map(key => {
        const actualKey =
          updatedProjectKeys.find(updatedKey => updatedKey.id === key.id) ?? key;
        return (
          <LoaderItem
            key={actualKey.id}
            organization={organization}
            project={project}
            projectKey={actualKey}
            updateProjectKey={handleUpdateProjectKey}
          />
        );
      })}
    </div>
  );
}

function LoaderItem({
  organization,
  project,
  projectKey,
  updateProjectKey,
}: {
  organization: Organization;
  project: Project;
  projectKey: ProjectKey;
  updateProjectKey: (projectKey: ProjectKey) => void;
}) {
  return (
    <Panel>
      <PanelHeader hasButtons>
        <div>{tct('Client Key: [name]', {name: projectKey.name})}</div>
        <LinkButton
          to={`/settings/${organization.slug}/projects/${project.slug}/keys/${projectKey.id}/`}
        >
          {t('View Key Details')}
        </LinkButton>
      </PanelHeader>
      <PanelBody>
        <PanelAlert type="info" showIcon>
          {t('Note that it can take a few minutes until changed options are live.')}
        </PanelAlert>

        <LoaderSettings
          orgSlug={organization.slug}
          keyId={projectKey.id}
          project={project}
          data={projectKey}
          updateData={updateProjectKey}
        />
      </PanelBody>
    </Panel>
  );
}

export default withOrganization(ProjectLoaderScript);
