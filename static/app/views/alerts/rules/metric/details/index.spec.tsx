import {initializeOrg} from 'sentry-test/initializeOrg';
import {act, render, screen, userEvent} from 'sentry-test/reactTestingLibrary';

import ProjectsStore from 'sentry/stores/projectsStore';
import {trackAnalytics} from 'sentry/utils/analytics';
import MetricAlertDetails from 'sentry/views/alerts/rules/metric/details';

jest.mock('sentry/utils/analytics');

describe('MetricAlertDetails', () => {
  const project = TestStubs.Project({slug: 'earth', platform: 'javascript'});
  beforeEach(() => {
    act(() => ProjectsStore.loadInitialData([project]));
    MockApiClient.addMockResponse({
      url: '/organizations/org-slug/projects/',
      body: [project],
    });
    MockApiClient.addMockResponse({
      url: '/organizations/org-slug/users/',
      body: [],
    });
    MockApiClient.addMockResponse({
      url: '/organizations/org-slug/events-stats/',
      body: TestStubs.EventsStats(),
    });
    MockApiClient.addMockResponse({
      url: '/organizations/org-slug/issues/?end=2017-10-17T02%3A41%3A20&groupStatsPeriod=auto&limit=5&project=2&query=event.type%3Aerror&sort=freq&start=2017-10-10T02%3A41%3A20',
      body: [TestStubs.Group()],
    });
  });

  afterEach(() => {
    act(() => ProjectsStore.reset());
    jest.resetAllMocks();
    MockApiClient.clearMockResponses();
  });

  it('renders', async () => {
    const {routerContext, organization, routerProps} = initializeOrg();
    const incident = TestStubs.Incident();
    const rule = TestStubs.MetricRule({
      projects: [project.slug],
      latestIncident: incident,
    });

    MockApiClient.addMockResponse({
      url: `/organizations/org-slug/alert-rules/${rule.id}/`,
      body: rule,
    });
    MockApiClient.addMockResponse({
      url: `/organizations/org-slug/incidents/`,
      body: [incident],
    });

    render(
      <MetricAlertDetails
        organization={organization}
        {...routerProps}
        params={{ruleId: rule.id}}
      />,
      {context: routerContext, organization}
    );

    expect(await screen.findAllByText(rule.name)).toHaveLength(2);
    expect(screen.getByText('Change alert status to Resolved')).toBeInTheDocument();
    expect(screen.getByText(`#${incident.identifier}`)).toBeInTheDocument();
    // Related issues
    expect(screen.getByTestId('group')).toBeInTheDocument();

    expect(trackAnalytics).toHaveBeenCalledWith(
      'alert_rule_details.viewed',
      expect.objectContaining({
        rule_id: Number(rule.id),
        alert: '',
      })
    );
  });

  it('renders selected incident', async () => {
    const {routerContext, organization, router, routerProps} = initializeOrg();
    const rule = TestStubs.MetricRule({projects: [project.slug]});
    const incident = TestStubs.Incident();

    MockApiClient.addMockResponse({
      url: `/organizations/org-slug/alert-rules/${rule.id}/`,
      body: rule,
    });
    const incidentMock = MockApiClient.addMockResponse({
      url: `/organizations/org-slug/incidents/${incident.id}/`,
      body: incident,
    });
    MockApiClient.addMockResponse({
      url: `/organizations/org-slug/incidents/`,
      body: [incident],
    });
    // Related issues to the selected incident
    const issuesRequest = MockApiClient.addMockResponse({
      url: '/organizations/org-slug/issues/?end=2016-04-26T19%3A44%3A05&groupStatsPeriod=auto&limit=5&project=2&query=event.type%3Aerror&sort=freq&start=2016-03-29T19%3A44%3A05',
      body: [TestStubs.Group()],
    });

    render(
      <MetricAlertDetails
        organization={organization}
        {...routerProps}
        location={{...router.location, query: {alert: incident.id}}}
        params={{ruleId: rule.id}}
      />,
      {context: routerContext, organization}
    );

    expect(await screen.findAllByText(rule.name)).toHaveLength(2);
    // Related issues
    expect(screen.getByTestId('group')).toBeInTheDocument();
    expect(trackAnalytics).toHaveBeenCalledWith(
      'alert_rule_details.viewed',
      expect.objectContaining({
        rule_id: Number(rule.id),
        alert: '321',
      })
    );
    expect(incidentMock).toHaveBeenCalled();
    expect(issuesRequest).toHaveBeenCalled();
  });

  it('renders mute button for metric alert', async () => {
    const {routerContext, organization, router} = initializeOrg();
    const incident = TestStubs.Incident();
    const rule = TestStubs.MetricRule({
      projects: [project.slug],
      latestIncident: incident,
    });

    MockApiClient.addMockResponse({
      url: `/organizations/org-slug/alert-rules/${rule.id}/`,
      body: rule,
    });
    MockApiClient.addMockResponse({
      url: `/organizations/org-slug/incidents/`,
      body: [incident],
    });

    const postRequest = MockApiClient.addMockResponse({
      url: `/projects/${organization.slug}/${project.slug}/alert-rules/${rule.id}/snooze/`,
      method: 'POST',
    });
    const deleteRequest = MockApiClient.addMockResponse({
      url: `/projects/${organization.slug}/${project.slug}/alert-rules/${rule.id}/snooze/`,
      method: 'DELETE',
    });

    render(
      <MetricAlertDetails
        organization={organization}
        route={{}}
        router={router}
        routes={router.routes}
        routeParams={router.params}
        location={router.location}
        params={{ruleId: rule.id}}
      />,
      {context: routerContext, organization}
    );

    expect(await screen.findByText('Mute for me')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', {name: 'Mute for me'}));
    expect(postRequest).toHaveBeenCalledTimes(1);

    expect(await screen.findByText('Unmute')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'Unmute'}));

    expect(deleteRequest).toHaveBeenCalledTimes(1);
  });
});
