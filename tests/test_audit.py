"""
Comprehensive conformance test suite for osivault.audit.
"""

import threading
import logging
import pytest
from django.db import connection, transaction
from django.conf import settings
from django.utils import timezone

from tests.models import ConcreteAuditLog
from osivault.audit import (
    append,
    verify_entry,
    verify_chain,
    rotate_key,
    checkpoint,
    verify_checkpoint,
)
from osivault.audit.models import OSIVaultAuditCheckpoint
from osivault.audit.crypto import ImmutabilityError, ConfigurationError, AllowlistError
from osivault.audit.keys import InMemoryKeyProvider
from osivault.audit.postgres import (
    install_postgres_immutability_triggers,
    remove_postgres_immutability_triggers,
)

from tests.conftest import postgres_only


@pytest.mark.django_db
def test_chain_integrity():
    """
    Append ten entries; verify_chain reports intact.
    """
    for i in range(10):
        append(
            model_class=ConcreteAuditLog,
            actor=f"user_{i}@onesmarter.com",
            tenant="tenant_alpha",
            resource_type="Document",
            resource_id=f"doc_{i}",
            action="CREATE",
            old_values={},
            new_values={"index": i},
        )

    report = verify_chain(ConcreteAuditLog)
    assert report.is_intact is True
    assert report.total_count == 10
    assert report.current_key_count == 10
    assert report.previous_key_count == 0
    assert report.failed_pk is None


@pytest.mark.django_db
def test_altered_entry_field():
    """
    Alter any field of an entry via raw SQL; verify_chain reports exact row and MAC failure.
    Note: PostgreSQL immutability trigger is not installed in this test so that tampering can be simulated; test_postgres_trigger_blocks_raw_sql proves it is blocked once installed.
    """
    entries = []
    for i in range(10):
        e = append(
            model_class=ConcreteAuditLog,
            actor=f"user_{i}@onesmarter.com",
            tenant="tenant_alpha",
            resource_type="Document",
            resource_id=f"doc_{i}",
            action="READ",
            old_values={},
            new_values={},
        )
        entries.append(e)

    target_pk = entries[4].pk
    with connection.cursor() as cursor:
        cursor.execute(
            f"UPDATE test_concrete_audit_log SET action = 'MALICIOUS_UPDATE' WHERE id = {target_pk}"
        )

    report = verify_chain(ConcreteAuditLog)
    assert report.is_intact is False
    assert report.failed_pk == target_pk
    assert "MAC verification failed" in report.failure_reason


@pytest.mark.django_db
def test_deleted_middle_row():
    """
    Delete a middle row via raw SQL; verify_chain reports break at following row.
    Note: PostgreSQL immutability trigger is not installed in this test so that tampering can be simulated; test_postgres_trigger_blocks_raw_sql proves it is blocked once installed.
    """
    entries = []
    for i in range(10):
        e = append(
            model_class=ConcreteAuditLog,
            actor=f"user_{i}@onesmarter.com",
            tenant="tenant_alpha",
            resource_type="Document",
            resource_id=f"doc_{i}",
            action="WRITE",
            old_values={},
            new_values={},
        )
        entries.append(e)

    deleted_pk = entries[4].pk
    following_pk = entries[5].pk

    with connection.cursor() as cursor:
        cursor.execute(f"DELETE FROM test_concrete_audit_log WHERE id = {deleted_pk}")

    report = verify_chain(ConcreteAuditLog)
    assert report.is_intact is False
    assert report.failed_pk == following_pk
    assert "previous_hash mismatch" in report.failure_reason or "Chain link broken" in report.failure_reason


@pytest.mark.django_db
def test_swapped_row_order():
    """
    Swap order of two rows' contents via raw SQL; verify_chain reports both.
    Note: PostgreSQL immutability trigger is not installed in this test so that tampering can be simulated; test_postgres_trigger_blocks_raw_sql proves it is blocked once installed.
    """
    entries = []
    for i in range(5):
        e = append(
            model_class=ConcreteAuditLog,
            actor=f"user_{i}@onesmarter.com",
            tenant="tenant_alpha",
            resource_type="Item",
            resource_id=f"item_{i}",
            action=f"ACTION_TYPE_{i}",
            old_values={},
            new_values={},
        )
        entries.append(e)

    pk1, pk2 = entries[1].pk, entries[2].pk
    act1, act2 = entries[1].action, entries[2].action

    with connection.cursor() as cursor:
        cursor.execute(f"UPDATE test_concrete_audit_log SET action = '{act2}' WHERE id = {pk1}")
        cursor.execute(f"UPDATE test_concrete_audit_log SET action = '{act1}' WHERE id = {pk2}")

    report = verify_chain(ConcreteAuditLog)
    assert report.is_intact is False
    assert report.failed_pk == pk1


@pytest.mark.django_db
def test_timestamp_tampering():
    """
    Regression Test: Change only timestamp via raw SQL -> MAC fails.
    Note: PostgreSQL immutability trigger is not installed in this test so that tampering can be simulated; test_postgres_trigger_blocks_raw_sql proves it is blocked once installed.
    """
    entry = append(
        model_class=ConcreteAuditLog,
        actor="alice@onesmarter.com",
        tenant="tenant_beta",
        resource_type="MedicalRecord",
        resource_id="mr_100",
        action="VIEW",
        old_values={},
        new_values={},
    )

    with connection.cursor() as cursor:
        cursor.execute(
            f"UPDATE test_concrete_audit_log SET timestamp = '2000-01-01 00:00:00.000000+00' WHERE id = {entry.pk}"
        )

    modified_entry = ConcreteAuditLog.objects.get(pk=entry.pk)
    verified, key_used, reason = verify_entry(modified_entry)
    assert verified is False
    assert "MAC verification failed" in reason or "Timestamp" in reason


@pytest.mark.django_db
def test_tenant_tampering():
    """
    Regression Test: Change only tenant via raw SQL -> MAC fails.
    Note: PostgreSQL immutability trigger is not installed in this test so that tampering can be simulated; test_postgres_trigger_blocks_raw_sql proves it is blocked once installed.
    """
    entry = append(
        model_class=ConcreteAuditLog,
        actor="bob@onesmarter.com",
        tenant="tenant_original",
        resource_type="BillingData",
        resource_id="bill_50",
        action="EXPORT",
        old_values={},
        new_values={},
    )

    with connection.cursor() as cursor:
        cursor.execute(
            f"UPDATE test_concrete_audit_log SET tenant = 'tenant_hacked' WHERE id = {entry.pk}"
        )

    modified_entry = ConcreteAuditLog.objects.get(pk=entry.pk)
    verified, key_used, reason = verify_entry(modified_entry)
    assert verified is False


@pytest.mark.django_db
def test_unkeyed_rehash_attack():
    """
    Attacker re-calculates SHA-256 hash without secret key -> verify_entry rejects.
    Note: PostgreSQL immutability trigger is not installed in this test so that tampering can be simulated; test_postgres_trigger_blocks_raw_sql proves it is blocked once installed.
    """
    import hashlib
    entry = append(
        model_class=ConcreteAuditLog,
        actor="attacker@onesmarter.com",
        tenant="tenant_target",
        resource_type="Account",
        resource_id="acc_1",
        action="TRANSFER",
        old_values={"amount": 100},
        new_values={"amount": 10000},
    )

    unkeyed_hash = hashlib.sha256(b"fake_payload_without_secret_key").hexdigest()
    with connection.cursor() as cursor:
        cursor.execute(
            f"UPDATE test_concrete_audit_log SET new_values = '{{\"amount\": 10000}}', entry_hash = '{unkeyed_hash}' WHERE id = {entry.pk}"
        )

    modified_entry = ConcreteAuditLog.objects.get(pk=entry.pk)
    verified, key_used, reason = verify_entry(modified_entry)
    assert verified is False


@pytest.mark.django_db
def test_key_rotation():
    """
    Test key rotation using an InMemoryKeyProvider.
    """
    provider = InMemoryKeyProvider(current_key=b"k1_secret_key_32_bytes_long!!!!", current_key_id="k1")
    append(
        model_class=ConcreteAuditLog,
        actor="u1",
        tenant="t",
        resource_type="r",
        resource_id="1",
        action="A",
        key_provider=provider,
    )

    rotate_key("new_key_k2_32bytes_long_secret!", "k2", key_provider=provider)

    append(
        model_class=ConcreteAuditLog,
        actor="u2",
        tenant="t",
        resource_type="r",
        resource_id="2",
        action="B",
        key_provider=provider,
    )

    report = verify_chain(ConcreteAuditLog, key_provider=provider)
    assert report.is_intact is True
    assert report.current_key_count == 1
    assert report.previous_key_count == 1


@pytest.mark.django_db
def test_rotate_env_provider_raises():
    """
    Rotating keys with default EnvVarKeyProvider raises ConfigurationError.
    """
    with pytest.raises(ConfigurationError):
        rotate_key("new_key_k2_32bytes_long_secret!", "k2")


@pytest.mark.django_db
def test_allowlist_envelope_rejection():
    """
    Envelope naming unallowed algorithm (e.g. HMAC-SHA-512) refused before computing anything.
    """
    entry = append(
        model_class=ConcreteAuditLog,
        actor="charlie@onesmarter.com",
        tenant="tenant_delta",
        resource_type="File",
        resource_id="file_1",
        action="DELETE",
        old_values={},
        new_values={},
    )

    unsupported_envelope = '{"mac_alg": "HMAC-SHA-512", "fmt_ver": 1, "hash_alg": "SHA-512", "key_id": "k1"}'
    with connection.cursor() as cursor:
        cursor.execute(
            f"UPDATE test_concrete_audit_log SET envelope = '{unsupported_envelope}' WHERE id = {entry.pk}"
        )

    modified_entry = ConcreteAuditLog.objects.get(pk=entry.pk)
    verified, key_used, reason = verify_entry(modified_entry)
    assert verified is False
    assert "Envelope algorithm 'HMAC-SHA-512' not in allowlist" in reason or "allowlist" in reason.lower()


@pytest.mark.django_db
def test_fail_closed_and_debug_fallback(monkeypatch, caplog):
    """
    Missing key with DEBUG=False raises ConfigurationError. DEBUG=True uses fallback & logs warning.
    """
    from osivault.audit.keys import EnvVarKeyProvider, _set_default_key_provider_for_tests
    _set_default_key_provider_for_tests(EnvVarKeyProvider())

    monkeypatch.delenv("OSIVAULT_AUDIT_CURRENT_KEY", raising=False)
    monkeypatch.delenv("OSIVAULT_AUDIT_PREVIOUS_KEY", raising=False)

    # Case 1: DEBUG=False -> Fail closed
    monkeypatch.setattr(settings, "DEBUG", False)
    with pytest.raises(ConfigurationError):
        append(
            model_class=ConcreteAuditLog,
            actor="dev@onesmarter.com",
            tenant="tenant_test",
            resource_type="Test",
            resource_id="1",
            action="TEST",
            old_values={},
            new_values={},
        )

    # Case 2: DEBUG=True -> Log warning and use fallback key
    monkeypatch.setattr(settings, "DEBUG", True)
    with caplog.at_level(logging.WARNING):
        entry = append(
            model_class=ConcreteAuditLog,
            actor="dev@onesmarter.com",
            tenant="tenant_test",
            resource_type="Test",
            resource_id="1",
            action="TEST",
            old_values={},
            new_values={},
        )
        assert entry is not None
        assert "DEVELOPMENT FALLBACK KEY" in caplog.text


@pytest.mark.django_db
def test_immutability_guards():
    """
    Model save on existing PK raises ImmutabilityError; delete raises ImmutabilityError.
    Queryset update and delete raise ImmutabilityError.
    """
    entry = append(
        model_class=ConcreteAuditLog,
        actor="dave@onesmarter.com",
        tenant="tenant_epsilon",
        resource_type="Policy",
        resource_id="pol_1",
        action="ACTIVATE",
        old_values={},
        new_values={},
    )

    # 1. ORM Save on existing PK
    with pytest.raises(ImmutabilityError):
        entry.action = "TAMPER"
        entry.save()

    # 2. ORM Delete
    with pytest.raises(ImmutabilityError):
        entry.delete()

    # 3. QuerySet Update & Delete
    with pytest.raises(ImmutabilityError):
        ConcreteAuditLog.objects.filter(pk=entry.pk).update(action="TAMPER")

    with pytest.raises(ImmutabilityError):
        ConcreteAuditLog.objects.filter(pk=entry.pk).delete()


@pytest.mark.django_db
def test_append_is_the_only_way_in():
    """
    Direct creation via .create(), .save(), or .bulk_create() outside append() raises ImmutabilityError.
    """
    fields = dict(
        timestamp=timezone.now(),
        actor="x",
        tenant="t",
        resource_type="r",
        resource_id="1",
        action="A",
        entry_hash="00",
        envelope={},
    )
    with pytest.raises(ImmutabilityError):
        ConcreteAuditLog.objects.create(**fields)
    with pytest.raises(ImmutabilityError):
        ConcreteAuditLog(**fields).save()
    with pytest.raises(ImmutabilityError):
        ConcreteAuditLog.objects.bulk_create([ConcreteAuditLog(**fields)])
    assert ConcreteAuditLog.objects.count() == 0


@postgres_only
@pytest.mark.django_db(transaction=True)
def test_concurrency_safe():
    """
    Simultaneous appends across 8 threads result in linear, intact audit chain with exactly 1 root.
    """
    from django.db import connection as conn
    errors = []

    def worker(idx):
        try:
            for i in range(50):
                append(
                    ConcreteAuditLog,
                    actor=f"t{idx}",
                    tenant="c",
                    resource_type="Job",
                    resource_id=str(i),
                    action="RUN",
                )
        except Exception as ex:
            errors.append(ex)
        finally:
            conn.close()

    threads = [threading.Thread(target=worker, args=(n,)) for n in range(8)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    assert errors == []
    assert ConcreteAuditLog.objects.count() == 400
    report = verify_chain(ConcreteAuditLog)
    assert report.is_intact, report.failure_reason
    roots = ConcreteAuditLog.objects.filter(previous_hash="").count()
    assert roots == 1


@pytest.mark.django_db
def test_checkpoint_immutability():
    """
    Direct creation of checkpoint records outside checkpoint() raises ImmutabilityError.
    """
    fields = dict(
        table_name="test_concrete_audit_log",
        last_entry_hash="abc",
        row_count=10,
        previous_checkpoint_hash="",
        envelope={},
        timestamp=timezone.now(),
        checkpoint_hash="00",
    )
    with pytest.raises(ImmutabilityError):
        OSIVaultAuditCheckpoint.objects.create(**fields)
    with pytest.raises(ImmutabilityError):
        OSIVaultAuditCheckpoint(**fields).save()
    with pytest.raises(ImmutabilityError):
        OSIVaultAuditCheckpoint.objects.bulk_create([OSIVaultAuditCheckpoint(**fields)])
    assert OSIVaultAuditCheckpoint.objects.count() == 0


@pytest.mark.django_db
def test_table_replacement_checkpoint():
    """
    Checkpoint verification catches whole-table replacement attacks.
    """
    for i in range(5):
        append(
            model_class=ConcreteAuditLog,
            actor=f"user_{i}",
            tenant="t",
            resource_type="r",
            resource_id=str(i),
            action="A",
        )

    cp1 = checkpoint(ConcreteAuditLog)

    # Replace table with fresh valid chain of same length
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM test_concrete_audit_log")

    for i in range(5):
        append(
            model_class=ConcreteAuditLog,
            actor=f"attacker_{i}",
            tenant="t",
            resource_type="r",
            resource_id=str(i),
            action="A",
        )

    report = verify_checkpoint(cp1, ConcreteAuditLog)
    assert report.envelope_ok is True
    assert report.mac_ok is True
    assert report.chain_ok is True
    assert report.live_ok is False
    assert report.reason == "live"


@pytest.mark.django_db
def test_checkpoint_chain():
    """
    Taking three checkpoints forms a verified chain. Tampering with middle checkpoint's previous_checkpoint_hash
    fails mac verification on middle and chain verification on third.
    """
    for i in range(3):
        append(
            ConcreteAuditLog,
            actor=f"u_{i}",
            tenant="t",
            resource_type="r",
            resource_id=str(i),
            action="A",
        )
        checkpoint(ConcreteAuditLog)

    checkpoints = list(OSIVaultAuditCheckpoint.objects.order_by("pk"))
    assert len(checkpoints) == 3

    for cp in checkpoints:
        report = verify_checkpoint(cp, ConcreteAuditLog)
        assert report.chain_ok is True

    # Tamper with middle checkpoint's previous_checkpoint_hash using raw SQL
    with connection.cursor() as cursor:
        cursor.execute(
            "UPDATE osivault_audit_checkpoint SET checkpoint_hash='TAMPERED', previous_checkpoint_hash='TAMPERED' WHERE id=%s",
            [checkpoints[1].id],
        )

    checkpoints[1].refresh_from_db()
    checkpoints[2].refresh_from_db()

    report_mid = verify_checkpoint(checkpoints[1], ConcreteAuditLog)
    assert report_mid.mac_ok is False

    report_3rd = verify_checkpoint(checkpoints[2], ConcreteAuditLog)
    assert report_3rd.chain_ok is False


@pytest.mark.django_db
def test_verify_without_keys_raises(monkeypatch, settings):
    """
    Calling verify_entry without configured keys in production (DEBUG=False) raises ConfigurationError.
    """
    entry = append(
        ConcreteAuditLog,
        actor="a",
        tenant="t",
        resource_type="r",
        resource_id="1",
        action="A",
    )
    monkeypatch.delenv("OSIVAULT_AUDIT_CURRENT_KEY", raising=False)
    monkeypatch.delenv("OSIVAULT_AUDIT_PREVIOUS_KEY", raising=False)
    settings.DEBUG = False
    with pytest.raises(ConfigurationError):
        verify_entry(entry)


@postgres_only
@pytest.mark.django_db(transaction=True)
def test_postgres_trigger_blocks_raw_sql():
    """
    Verifies that PostgreSQL BEFORE UPDATE OR DELETE triggers prevent raw SQL tampering on audit log and checkpoint tables.
    """
    append(ConcreteAuditLog, actor="a", tenant="t", resource_type="r", resource_id="1", action="A")
    checkpoint(ConcreteAuditLog)
    install_postgres_immutability_triggers("test_concrete_audit_log", "osivault_audit_checkpoint")
    try:
        for stmt in (
            "UPDATE test_concrete_audit_log SET actor='evil'",
            "DELETE FROM test_concrete_audit_log",
            "UPDATE osivault_audit_checkpoint SET row_count=999",
            "DELETE FROM osivault_audit_checkpoint",
        ):
            with pytest.raises(Exception, match="immutable"):
                with transaction.atomic():
                    with connection.cursor() as c:
                        c.execute(stmt)
    finally:
        remove_postgres_immutability_triggers("test_concrete_audit_log", "osivault_audit_checkpoint")

