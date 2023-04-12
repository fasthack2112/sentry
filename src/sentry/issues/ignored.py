from __future__ import annotations

from typing import Sequence

from sentry import logging
from sentry.models import (
    Group,
    GroupForecast,
    GroupInboxRemoveAction,
    User,
    remove_group_from_inbox,
)
from sentry.tasks.weekly_escalating_forecast import get_forecasts
from sentry.utils import metrics

logger = logging.getLogger(__name__)


def handle_archived_until_escalating(
    group_list: Sequence[Group],
    acting_user: User | None,
) -> None:
    """
    Handle issues that are archived until escalating and create a forecast for them.

    Issues that are marked as ignored with `archiveDuration: until_escalating`
    in the statusDetail are treated as `archived_until_escalating`.
    """
    metrics.incr("group.archived_until_escalating", skip_internal=True)
    for group in group_list:
        remove_group_from_inbox(group, action=GroupInboxRemoveAction.IGNORED, user=acting_user)

    group_forecasts = get_forecasts(list(group_list))
    GroupForecast.objects.get(group__in=group_list).delete()
    GroupForecast.objects.bulk_create(
        [GroupForecast(group=group, forecast=forecast) for group, forecast in group_forecasts]
    )
    logger.info(
        "archived_until_escalating.forecast_created",
        extra={
            "detail": "Created forecast for groups",
            "group_ids": [group.id for group in group_list],
        },
    )

    return
