import {ResolutionStatus} from 'sentry/types';
import {transformIssuesResponseToTable} from 'sentry/views/dashboards/datasetConfig/issues';

describe('transformIssuesResponseToTable', function () {
  it('transforms issues response', () => {
    expect(
      transformIssuesResponseToTable(
        [
          TestStubs.Group({
            id: '1',
            title: 'Error: Failed',
            project: TestStubs.Project({
              id: '3',
            }),
            status: ResolutionStatus.UNRESOLVED,
            owners: [
              {
                type: 'ownershipRule',
                owner: 'user:2',
                date_added: '2022-01-01T13:04:02Z',
              },
            ],
            lifetime: {count: '10', firstSeen: '', lastSeen: '', stats: {}, userCount: 5},
            count: '6',
            userCount: 3,
            firstSeen: '2022-01-01T13:04:02Z',
          }),
        ],
        {
          name: '',
          fields: ['issue', 'assignee', 'title', 'culprit', 'status'],
          columns: ['issue', 'assignee', 'title', 'culprit', 'status'],
          aggregates: [],
          conditions: 'assigned_or_suggested:#visibility timesSeen:>100',
          orderby: '',
        },
        TestStubs.Organization(),
        TestStubs.GlobalSelection()
      )
    ).toEqual(
      expect.objectContaining({
        data: [
          expect.objectContaining({
            discoverSearchQuery: ' assigned_or_suggested:#visibility timesSeen:>100',
            events: '6',
            firstSeen: '2022-01-01T13:04:02Z',
            id: '1',
            'issue.id': '1',
            lifetimeUsers: 5,
            links: '',
            period: '',
            projectId: '3',
            status: 'unresolved',
            title: 'Error: Failed',
            users: 3,
            end: '2019-09-09T11:18:59',
            start: '2019-10-09T11:18:59',
          }),
        ],
      })
    );
  });
});
