# Generated by Django 2.2.28 on 2023-07-11 13:41

from django.db import migrations, models

import sentry.db.models.fields.bounded
from sentry.new_migrations.migrations import CheckedMigration


class Migration(CheckedMigration):
    # This flag is used to mark that a migration shouldn't be automatically run in production. For
    # the most part, this should only be used for operations where it's safe to run the migration
    # after your code has deployed. So this should not be used for most operations that alter the
    # schema of a table.
    # Here are some things that make sense to mark as dangerous:
    # - Large data migrations. Typically we want these to be run manually by ops so that they can
    #   be monitored and not block the deploy for a long period of time while they run.
    # - Adding indexes to large tables. Since this can take a long time, we'd generally prefer to
    #   have ops run this and not block the deploy. Note that while adding an index is a schema
    #   change, it's completely safe to run the operation after the code has deployed.
    is_dangerous = False

    dependencies = [
        ("sentry", "0509_merging_migrations"),
    ]

    operations = [
        migrations.AlterField(
            model_name="projectartifactbundle",
            name="project_id",
            field=sentry.db.models.fields.bounded.BoundedBigIntegerField(),
        ),
        migrations.AlterField(
            model_name="releaseartifactbundle",
            name="dist_name",
            field=models.CharField(default="", max_length=64),
        ),
        migrations.AlterField(
            model_name="releaseartifactbundle",
            name="release_name",
            field=models.CharField(max_length=250),
        ),
        migrations.AlterUniqueTogether(
            name="debugidartifactbundle",
            unique_together=set(),
        ),
        migrations.AlterUniqueTogether(
            name="projectartifactbundle",
            unique_together=set(),
        ),
        migrations.AlterUniqueTogether(
            name="releaseartifactbundle",
            unique_together=set(),
        ),
        migrations.AlterIndexTogether(
            name="artifactbundleindex",
            index_together={("url", "artifact_bundle")},
        ),
        migrations.AlterIndexTogether(
            name="debugidartifactbundle",
            index_together={("debug_id", "artifact_bundle")},
        ),
        migrations.AlterIndexTogether(
            name="projectartifactbundle",
            index_together={("project_id", "artifact_bundle")},
        ),
        migrations.AlterIndexTogether(
            name="releaseartifactbundle",
            index_together={("organization_id", "release_name", "dist_name", "artifact_bundle")},
        ),
    ]
