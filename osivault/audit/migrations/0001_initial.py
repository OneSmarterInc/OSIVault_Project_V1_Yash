from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []

    operations = [
        migrations.CreateModel(
            name="OSIVaultAuditCheckpoint",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("table_name", models.CharField(db_index=True, max_length=255)),
                ("last_entry_hash", models.CharField(max_length=128)),
                ("row_count", models.BigIntegerField()),
                ("previous_checkpoint_hash", models.CharField(blank=True, max_length=128)),
                ("envelope", models.JSONField()),
                ("timestamp", models.DateTimeField(db_index=True)),
                ("checkpoint_hash", models.CharField(max_length=128)),
            ],
            options={
                "db_table": "osivault_audit_checkpoint",
            },
        ),
    ]
