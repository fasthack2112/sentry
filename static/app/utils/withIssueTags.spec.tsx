import {act, render, screen, waitFor} from 'sentry-test/reactTestingLibrary';

import {SearchGroup} from 'sentry/components/smartSearchBar/types';
import MemberListStore from 'sentry/stores/memberListStore';
import TagStore from 'sentry/stores/tagStore';
import TeamStore from 'sentry/stores/teamStore';
import withIssueTags, {WithIssueTagsProps} from 'sentry/utils/withIssueTags';

interface MyComponentProps extends WithIssueTagsProps {
  forwardedValue: string;
}
function MyComponent(props: MyComponentProps) {
  return (
    <div>
      ForwardedValue: {props.forwardedValue}
      {'is: ' + props.tags?.is?.values?.[0]}
      {'mechanism: ' + props.tags?.mechanism?.values?.join(', ')}
      {'bookmarks: ' + props.tags?.bookmarks?.values?.join(', ')}
      {'assigned: ' + props.tags?.assigned?.values?.join(', ')}
      {'stack filename: ' + props.tags?.['stack.filename'].name}
    </div>
  );
}

describe('withIssueTags HoC', function () {
  beforeEach(() => {
    TeamStore.reset();
    TagStore.reset();
    MemberListStore.loadInitialData([]);
  });

  it('forwards loaded tags to the wrapped component', async function () {
    const Container = withIssueTags(MyComponent);
    render(<Container organization={TestStubs.Organization()} forwardedValue="value" />);

    // Should forward props.
    expect(await screen.findByText(/ForwardedValue: value/)).toBeInTheDocument();

    act(() => {
      TagStore.loadTagsSuccess([
        {name: 'MechanismTag', key: 'mechanism', values: ['MechanismTagValue']},
      ]);
    });

    // includes custom tags
    await waitFor(() => {
      expect(screen.getByText(/MechanismTagValue/)).toBeInTheDocument();
    });

    // should include special issue and attributes.
    expect(screen.getByText(/is: resolved/)).toBeInTheDocument();
    expect(screen.getByText(/bookmarks: me/)).toBeInTheDocument();
    expect(screen.getByText(/assigned: me/)).toBeInTheDocument();
    expect(screen.getByText(/stack filename: stack.filename/)).toBeInTheDocument();
  });

  it('updates the assigned tags with users and teams, and bookmark tags with users', function () {
    const Container = withIssueTags(MyComponent);
    render(<Container organization={TestStubs.Organization()} forwardedValue="value" />);

    act(() => {
      TagStore.loadTagsSuccess([
        {name: 'MechanismTag', key: 'mechanism', values: ['MechanismTagValue']},
      ]);
    });

    expect(screen.getByText(/assigned: me, \[me, none\]/)).toBeInTheDocument();

    act(() => {
      TeamStore.loadInitialData([
        TestStubs.Team({slug: 'best-team-na', name: 'Best Team NA', isMember: true}),
      ]);
      MemberListStore.loadInitialData([
        TestStubs.User(),
        TestStubs.User({username: 'joe@example.com'}),
      ]);
    });

    expect(
      screen.getByText(
        /assigned: me, \[me, none\], #best-team-na, foo@example.com, joe@example.com/
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(/bookmarks: me, foo@example.com, joe@example.com/)
    ).toBeInTheDocument();
  });

  it('groups assignees and puts suggestions first', function () {
    const Container = withIssueTags(({tags}: MyComponentProps) => (
      <div>
        {(tags?.assigned?.values as SearchGroup[])?.map(searchGroup => (
          <div data-test-id={searchGroup.title} key={searchGroup.title}>
            {searchGroup.children?.map(item => item.desc).join(', ')}
          </div>
        ))}
      </div>
    ));
    const organization = TestStubs.Organization({features: ['issue-search-shortcuts']});
    TeamStore.loadInitialData([
      TestStubs.Team({id: 1, slug: 'best-team', name: 'Best Team', isMember: true}),
      TestStubs.Team({id: 2, slug: 'worst-team', name: 'Worst Team', isMember: false}),
    ]);
    MemberListStore.loadInitialData([
      TestStubs.User(),
      TestStubs.User({username: 'joe@example.com'}),
    ]);
    render(<Container organization={organization} forwardedValue="value" />, {
      organization,
    });

    expect(screen.getByTestId('Suggested Values')).toHaveTextContent(
      'me, [me, none], #best-team'
    );

    expect(screen.getByTestId('All Values')).toHaveTextContent(
      'foo@example.com, joe@example.com, #worst-team'
    );
  });
});
