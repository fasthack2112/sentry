import {initializeOrg} from 'sentry-test/initializeOrg';
import {render, screen, userEvent} from 'sentry-test/reactTestingLibrary';
import {textWithMarkupMatcher} from 'sentry-test/utils';

import ReleaseIssues from 'sentry/views/releases/detail/overview/releaseIssues';
import {getReleaseBounds} from 'sentry/views/releases/utils';

describe('ReleaseIssues', function () {
  let newIssuesEndpoint,
    resolvedIssuesEndpoint,
    unhandledIssuesEndpoint,
    allIssuesEndpoint;

  const props = {
    orgId: 'org',
    organization: TestStubs.Organization(),
    version: '1.0.0',
    selection: {projects: [], environments: [], datetime: {}},
    location: {href: '', query: {}},
    releaseBounds: getReleaseBounds(TestStubs.Release({version: '1.0.0'})),
  };

  beforeEach(function () {
    MockApiClient.clearMockResponses();

    MockApiClient.addMockResponse({
      url: `/organizations/${props.organization.slug}/users/`,
      body: [],
    });

    MockApiClient.addMockResponse({
      url: `/organizations/${props.organization.slug}/issues-count/?end=2020-03-24T02%3A04%3A59Z&query=first-release%3A%221.0.0%22%20is%3Aunresolved&query=release%3A%221.0.0%22%20is%3Aunresolved&query=error.handled%3A0%20release%3A%221.0.0%22%20is%3Aunresolved&query=regressed_in_release%3A%221.0.0%22&start=2020-03-23T01%3A02%3A00Z`,
    });
    MockApiClient.addMockResponse({
      url: `/organizations/${props.organization.slug}/issues-count/?query=first-release%3A%221.0.0%22%20is%3Aunresolved&query=release%3A%221.0.0%22%20is%3Aunresolved&query=error.handled%3A0%20release%3A%221.0.0%22%20is%3Aunresolved&query=regressed_in_release%3A%221.0.0%22&statsPeriod=24h`,
    });
    MockApiClient.addMockResponse({
      url: `/organizations/${props.organization.slug}/releases/1.0.0/resolved/`,
    });

    newIssuesEndpoint = MockApiClient.addMockResponse({
      url: `/organizations/${props.organization.slug}/issues/?end=2020-03-24T02%3A04%3A59Z&groupStatsPeriod=auto&limit=10&query=first-release%3A1.0.0%20is%3Aunresolved&sort=freq&start=2020-03-23T01%3A02%3A00Z`,
      body: [],
    });
    MockApiClient.addMockResponse({
      url: `/organizations/${props.organization.slug}/issues/?groupStatsPeriod=auto&limit=10&query=first-release%3A1.0.0%20is%3Aunresolved&sort=freq&statsPeriod=24h`,
      body: [],
    });
    resolvedIssuesEndpoint = MockApiClient.addMockResponse({
      url: `/organizations/${props.organization.slug}/releases/1.0.0/resolved/?end=2020-03-24T02%3A04%3A59Z&groupStatsPeriod=auto&limit=10&query=&sort=freq&start=2020-03-23T01%3A02%3A00Z`,
      body: [],
    });
    unhandledIssuesEndpoint = MockApiClient.addMockResponse({
      url: `/organizations/${props.organization.slug}/issues/?end=2020-03-24T02%3A04%3A59Z&groupStatsPeriod=auto&limit=10&query=release%3A1.0.0%20error.handled%3A0%20is%3Aunresolved&sort=freq&start=2020-03-23T01%3A02%3A00Z`,
      body: [],
    });
    MockApiClient.addMockResponse({
      url: `/organizations/${props.organization.slug}/issues/?groupStatsPeriod=auto&limit=10&query=release%3A1.0.0%20error.handled%3A0%20is%3Aunresolved&sort=freq&statsPeriod=24h`,
      body: [],
    });
    allIssuesEndpoint = MockApiClient.addMockResponse({
      url: `/organizations/${props.organization.slug}/issues/?end=2020-03-24T02%3A04%3A59Z&groupStatsPeriod=auto&limit=10&query=release%3A1.0.0%20is%3Aunresolved&sort=freq&start=2020-03-23T01%3A02%3A00Z`,
      body: [],
    });
  });

  it('shows an empty state', async function () {
    render(<ReleaseIssues {...props} />);

    expect(await screen.findByText('No new issues in this release.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('radio', {name: 'Resolved 0'}));
    expect(
      await screen.findByText('No resolved issues in this release.')
    ).toBeInTheDocument();
  });

  it('shows an empty sttate with stats period', async function () {
    render(<ReleaseIssues {...props} location={{query: {pageStatsPeriod: '24h'}}} />);

    expect(
      await screen.findByText(
        textWithMarkupMatcher('No new issues for the last 24 hours.')
      )
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('radio', {name: 'Unhandled 0'}));
    expect(
      await screen.findByText(
        textWithMarkupMatcher('No unhandled issues for the last 24 hours.')
      )
    ).toBeInTheDocument();
  });

  it('filters the issues', async function () {
    render(<ReleaseIssues {...props} />);

    expect(screen.getAllByRole('radio')).toHaveLength(5);
    await screen.findByRole('radio', {name: 'New Issues 0'});

    await userEvent.click(screen.getByRole('radio', {name: 'New Issues 0'}));
    expect(newIssuesEndpoint).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('radio', {name: 'Resolved 0'}));
    expect(resolvedIssuesEndpoint).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('radio', {name: 'Unhandled 0'}));
    expect(unhandledIssuesEndpoint).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('radio', {name: 'All Issues 0'}));
    expect(allIssuesEndpoint).toHaveBeenCalledTimes(1);
  });

  it('renders link to Issues', async function () {
    const {routerContext} = initializeOrg();

    render(<ReleaseIssues {...props} />, {context: routerContext});

    expect(screen.getByRole('button', {name: 'Open in Issues'})).toHaveAttribute(
      'href',
      '/organizations/org-slug/issues/?end=2020-03-24T02%3A04%3A59Z&groupStatsPeriod=auto&query=firstRelease%3A1.0.0&sort=freq&start=2020-03-23T01%3A02%3A00Z'
    );

    await screen.findByRole('radio', {name: 'Resolved 0'});

    await userEvent.click(screen.getByRole('radio', {name: 'Resolved 0'}));
    expect(screen.getByRole('button', {name: 'Open in Issues'})).toHaveAttribute(
      'href',
      '/organizations/org-slug/issues/?end=2020-03-24T02%3A04%3A59Z&groupStatsPeriod=auto&query=release%3A1.0.0&sort=freq&start=2020-03-23T01%3A02%3A00Z'
    );

    await userEvent.click(screen.getByRole('radio', {name: 'Unhandled 0'}));
    expect(screen.getByRole('button', {name: 'Open in Issues'})).toHaveAttribute(
      'href',
      '/organizations/org-slug/issues/?end=2020-03-24T02%3A04%3A59Z&groupStatsPeriod=auto&query=release%3A1.0.0%20error.handled%3A0&sort=freq&start=2020-03-23T01%3A02%3A00Z'
    );

    await userEvent.click(screen.getByRole('radio', {name: 'All Issues 0'}));
    expect(screen.getByRole('button', {name: 'Open in Issues'})).toHaveAttribute(
      'href',
      '/organizations/org-slug/issues/?end=2020-03-24T02%3A04%3A59Z&groupStatsPeriod=auto&query=release%3A1.0.0&sort=freq&start=2020-03-23T01%3A02%3A00Z'
    );
  });

  it('includes release context when linking to issue', async function () {
    newIssuesEndpoint = MockApiClient.addMockResponse({
      url: `/organizations/${props.organization.slug}/issues/?end=2020-03-24T02%3A04%3A59Z&groupStatsPeriod=auto&limit=10&query=first-release%3A1.0.0%20is%3Aunresolved&sort=freq&start=2020-03-23T01%3A02%3A00Z`,
      body: [TestStubs.Group({id: '123'})],
    });

    const {routerContext} = initializeOrg();

    render(<ReleaseIssues {...props} />, {context: routerContext});

    await userEvent.click(screen.getByRole('radio', {name: /New Issues/}));

    const link = await screen.findByRole('link', {name: /RequestError/});

    // Should pass the query param `query` with value `release:1.0.0`
    expect(link).toHaveAttribute(
      'href',
      '/organizations/org-slug/issues/123/?_allp=1&query=release%3A1.0.0&referrer=release-issue-stream'
    );
  });
});
