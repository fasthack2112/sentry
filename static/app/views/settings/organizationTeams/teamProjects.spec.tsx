import {initializeOrg} from 'sentry-test/initializeOrg';
import {render, screen, userEvent} from 'sentry-test/reactTestingLibrary';

import {TeamProjects as OrganizationTeamProjects} from 'sentry/views/settings/organizationTeams/teamProjects';

describe('OrganizationTeamProjects', function () {
  let team;
  let getMock;
  let putMock;
  let postMock;
  let deleteMock;

  const project = TestStubs.Project({
    teams: [team],
    access: ['project:read', 'project:write', 'project:admin'],
  });
  const project2 = TestStubs.Project({
    id: '3',
    slug: 'project-slug-2',
    name: 'Project Name 2',
    access: ['project:read', 'project:write', 'project:admin'],
  });

  const {routerContext, organization} = initializeOrg({
    organization: TestStubs.Organization({slug: 'org-slug'}),
    projects: [project, project2],
  });

  const router = TestStubs.router();
  const routerProps = {
    router,
    routes: router.routes,
    params: router.params,
    routeParams: router.params,
    route: router.routes[0],
    location: router.location,
  };

  beforeEach(function () {
    team = TestStubs.Team({slug: 'team-slug'});

    getMock = MockApiClient.addMockResponse({
      url: '/organizations/org-slug/projects/',
      body: [project, project2],
    });

    putMock = MockApiClient.addMockResponse({
      method: 'PUT',
      url: '/projects/org-slug/project-slug/',
      body: project,
    });

    postMock = MockApiClient.addMockResponse({
      method: 'POST',
      url: `/projects/org-slug/${project2.slug}/teams/${team.slug}/`,
      body: {...project2, teams: [team]},
      status: 201,
    });

    deleteMock = MockApiClient.addMockResponse({
      method: 'DELETE',
      url: `/projects/org-slug/${project2.slug}/teams/${team.slug}/`,
      body: {...project2, teams: []},
      status: 204,
    });
  });

  afterEach(function () {
    MockApiClient.clearMockResponses();
  });

  it('fetches linked and unlinked projects', function () {
    render(
      <OrganizationTeamProjects
        {...routerProps}
        api={new MockApiClient()}
        organization={organization}
        team={team}
        params={{teamId: team.slug}}
        location={{...routerProps.location, query: {}}}
      />,
      {context: routerContext}
    );

    expect(getMock).toHaveBeenCalledTimes(2);

    expect(getMock.mock.calls[0][1].query.query).toBe('team:team-slug');
    expect(getMock.mock.calls[1][1].query.query).toBe('!team:team-slug');
  });

  it('Should render', async function () {
    const {container} = render(
      <OrganizationTeamProjects
        {...routerProps}
        api={new MockApiClient()}
        organization={organization}
        team={team}
        params={{teamId: team.slug}}
        location={{...routerProps.location, query: {}}}
      />,
      {context: routerContext}
    );

    expect(await screen.findByText('project-slug')).toBeInTheDocument();
    expect(container).toSnapshot();
  });

  it('Should allow bookmarking', async function () {
    render(
      <OrganizationTeamProjects
        {...routerProps}
        api={new MockApiClient()}
        organization={organization}
        team={team}
        params={{teamId: team.slug}}
        location={{...routerProps.location, query: {}}}
      />,
      {context: routerContext}
    );

    const stars = await screen.findAllByRole('button', {name: 'Bookmark Project'});
    expect(stars).toHaveLength(2);

    await userEvent.click(stars[0]);
    expect(
      screen.getByRole('button', {name: 'Bookmark Project', pressed: true})
    ).toBeInTheDocument();

    expect(putMock).toHaveBeenCalledTimes(1);
  });

  it('Should allow adding and removing projects', async function () {
    render(
      <OrganizationTeamProjects
        {...routerProps}
        api={new MockApiClient()}
        organization={organization}
        team={team}
        params={{teamId: team.slug}}
        location={{...routerProps.location, query: {}}}
      />,
      {context: routerContext}
    );

    expect(getMock).toHaveBeenCalledTimes(2);

    await userEvent.click(await screen.findByText('Add Project'));
    // console.log(screen.debug());
    await userEvent.click(screen.getByRole('option', {name: 'project-slug-2'}));

    expect(postMock).toHaveBeenCalledTimes(1);

    // find second project's remove button
    const removeButtons = await screen.findAllByRole('button', {name: 'Remove'});
    await userEvent.click(removeButtons[1]);

    expect(deleteMock).toHaveBeenCalledTimes(1);
  });

  it('handles filtering unlinked projects', async function () {
    render(
      <OrganizationTeamProjects
        {...routerProps}
        api={new MockApiClient()}
        organization={organization}
        team={team}
        params={{teamId: team.slug}}
        location={{...routerProps.location, query: {}}}
      />,
      {context: routerContext}
    );

    expect(getMock).toHaveBeenCalledTimes(2);

    await userEvent.click(await screen.findByText('Add Project'));

    await userEvent.type(screen.getByRole('textbox'), 'a');

    expect(getMock).toHaveBeenCalledTimes(3);
    expect(getMock).toHaveBeenCalledWith(
      '/organizations/org-slug/projects/',
      expect.objectContaining({
        query: expect.objectContaining({
          query: '!team:team-slug a',
        }),
      })
    );
  });
});
