from typing import Optional


def assert_mock_called_once_with_partial(mock, *args, **kwargs):
    """
    Similar to ``mock.assert_called_once_with()``, but we don't require all
    args and kwargs to be specified.
    """
    assert len(mock.mock_calls) == 1
    m_args, m_kwargs = mock.call_args
    for i, arg in enumerate(args):
        assert m_args[i] == arg
    for kwarg in kwargs:
        assert m_kwargs[kwarg] == kwargs[kwarg], (m_kwargs[kwarg], kwargs[kwarg])


def assert_commit_shape(commit):
    from sentry.models import CommitFileChange

    commit_file_type_choices = {c[0] for c in CommitFileChange._meta.get_field("type").choices}

    assert commit["id"]
    assert commit["repository"]
    assert commit["author_email"]
    assert commit["author_name"]
    assert commit["message"]
    assert commit["timestamp"]
    assert commit["patch_set"]
    patches = commit["patch_set"]
    for patch in patches:
        assert patch["type"] in commit_file_type_choices
        assert patch["path"]


def assert_status_code(response, minimum: int, maximum: Optional[int] = None):
    # Omit max to assert status_code == minimum.
    maximum = maximum or minimum + 1
    assert minimum <= response.status_code < maximum, (response.status_code, response.content)


def org_audit_log_exists(**kwargs):
    from sentry.models import AuditLogEntry

    assert kwargs
    if "organization" in kwargs:
        kwargs["organization_id"] = kwargs.pop("organization").id
    return AuditLogEntry.objects.filter(**kwargs).exists()


def assert_org_audit_log_exists(**kwargs):
    assert org_audit_log_exists(**kwargs)


def assert_org_audit_log_does_not_exist(**kwargs):
    assert not org_audit_log_exists(**kwargs)


def delete_all_org_audit_logs():
    from sentry.models import AuditLogEntry

    return AuditLogEntry.objects.all().delete()
