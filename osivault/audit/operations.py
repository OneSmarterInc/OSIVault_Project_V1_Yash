"""
The public operations of osivault.audit: append, verify_entry, verify_chain, rotate_key, checkpoint, verify_checkpoint.
"""

import hmac
import zlib
from dataclasses import dataclass
from typing import Tuple, Optional, Type
from datetime import datetime, timezone
from django.db import transaction, connection

from osivault.audit.crypto import (
    validate_envelope,
    canonical_json,
    format_iso_timestamp,
    build_checksum_payload,
    compute_hmac_sha256,
    AllowlistError,
    FORMAT_VERSION,
)
from osivault.audit.keys import (
    KeyProvider,
    get_default_key_provider,
)
from osivault.audit.models import OSIVaultAuditLog, OSIVaultAuditCheckpoint


@dataclass
class AuditVerificationReport:
    """Structured report returned by verify_chain."""
    is_intact: bool
    total_count: int
    current_key_count: int
    previous_key_count: int
    failed_pk: Optional[int] = None
    failure_reason: Optional[str] = None


@dataclass
class CheckpointVerificationReport:
    """Structured report returned by verify_checkpoint."""
    envelope_ok: bool
    mac_ok: bool
    chain_ok: bool
    live_ok: bool
    reason: Optional[str] = None

    @property
    def is_valid(self):
        return self.envelope_ok and self.mac_ok and self.chain_ok and self.live_ok


def _table_lock(model_class):
    """
    Serialize appenders for this table, including the very first append.
    On non-Postgres backends (e.g. SQLite), the root race is not closed;
    OSIVault's supported production backend is PostgreSQL.
    """
    if connection.vendor == "postgresql":
        key = zlib.crc32(model_class._meta.db_table.encode("utf-8"))
        with connection.cursor() as cursor:
            cursor.execute("SELECT pg_advisory_xact_lock(%s)", [key])


def append(
    model_class: Type[OSIVaultAuditLog],
    actor: str,
    tenant: str,
    resource_type: str,
    resource_id: str,
    action: str,
    old_values: Optional[dict] = None,
    new_values: Optional[dict] = None,
    key_provider: Optional[KeyProvider] = None,
    **extra_fields,
) -> OSIVaultAuditLog:
    """
    Appends a new audit log entry atomically under a transaction with table locking.
    Sets previous_hash to the prior row's entry_hash (or empty string for first row),
    computes entry_hash over the authenticated payload, and inserts.
    """
    if key_provider is None:
        key_provider = get_default_key_provider()

    key_bytes, key_id = key_provider.get_current_key()

    old_values = old_values if old_values is not None else {}
    new_values = new_values if new_values is not None else {}

    envelope = {
        "fmt_ver": FORMAT_VERSION,
        "hash_alg": "SHA-256",
        "key_id": key_id,
        "mac_alg": "HMAC-SHA-256",
    }
    validate_envelope(envelope)

    now = datetime.now(timezone.utc)
    timestamp_str = format_iso_timestamp(now)

    with transaction.atomic():
        _table_lock(model_class)
        last_entry = model_class.objects.select_for_update().order_by("-pk").first()
        previous_hash = last_entry.entry_hash if last_entry else ""

        payload_dict = build_checksum_payload(
            envelope=envelope,
            previous_hash=previous_hash,
            timestamp_str=timestamp_str,
            actor=actor,
            tenant=tenant,
            resource_type=resource_type,
            resource_id=resource_id,
            action=action,
            old_values=old_values,
            new_values=new_values,
        )

        payload_bytes = canonical_json(payload_dict)
        entry_hash = compute_hmac_sha256(key_bytes, payload_bytes)

        instance = model_class(
            timestamp=now,
            actor=actor,
            tenant=tenant,
            resource_type=resource_type,
            resource_id=resource_id,
            action=action,
            old_values=old_values,
            new_values=new_values,
            previous_hash=previous_hash,
            entry_hash=entry_hash,
            envelope=envelope,
            **extra_fields,
        )

        instance._osivault_append_token = True
        try:
            instance.save(force_insert=True)
        finally:
            instance._osivault_append_token = False
        return instance


def verify_entry(
    entry: OSIVaultAuditLog,
    key_provider: Optional[KeyProvider] = None,
) -> Tuple[bool, Optional[str], Optional[str]]:
    """
    Verifies a single audit entry's MAC signature against current or previous key.
    Returns (verified: bool, key_used: str|None, reason: str|None).
    """
    if key_provider is None:
        key_provider = get_default_key_provider()

    envelope = entry.envelope
    if isinstance(envelope, str):
        import json
        try:
            envelope = json.loads(envelope)
        except Exception:
            return False, None, "Invalid JSON envelope"

    try:
        validate_envelope(envelope)
    except AllowlistError as err:
        return False, None, str(err)

    timestamp_str = format_iso_timestamp(entry.timestamp)

    payload_dict = build_checksum_payload(
        envelope=envelope,
        previous_hash=entry.previous_hash,
        timestamp_str=timestamp_str,
        actor=entry.actor,
        tenant=entry.tenant,
        resource_type=entry.resource_type,
        resource_id=entry.resource_id,
        action=entry.action,
        old_values=entry.old_values,
        new_values=entry.new_values,
    )
    payload_bytes = canonical_json(payload_dict)

    # 1. Try current key (ConfigurationError propagates if missing key in prod)
    current_key, _ = key_provider.get_current_key()
    if current_key and hmac.compare_digest(compute_hmac_sha256(current_key, payload_bytes), entry.entry_hash):
        return True, "current", "Verified under current key"

    # 2. Try previous key
    prev_key, _ = key_provider.get_previous_key()
    if prev_key and hmac.compare_digest(compute_hmac_sha256(prev_key, payload_bytes), entry.entry_hash):
        return True, "previous", "Verified under previous key"

    return False, None, "MAC verification failed: signature mismatch or unconfigured key"


def verify_chain(
    model_class: Type[OSIVaultAuditLog],
    key_provider: Optional[KeyProvider] = None,
    full_report: bool = True,
) -> AuditVerificationReport:
    """
    Walks the chain from first row to last in primary key order.
    Verifies MAC signature under allowed keys and checks previous_hash linkage.
    Returns a structured AuditVerificationReport.
    """
    if key_provider is None:
        key_provider = get_default_key_provider()

    queryset = model_class.objects.order_by("pk")
    total_count = 0
    current_key_count = 0
    previous_key_count = 0

    first_failed_pk = None
    first_failure_reason = None
    is_intact = True

    expected_previous_hash = ""

    for entry in queryset:
        total_count += 1

        # 1. Verify previous_hash linkage
        if entry.previous_hash != expected_previous_hash:
            is_intact = False
            if first_failed_pk is None:
                first_failed_pk = entry.pk
                first_failure_reason = (
                    f"previous_hash mismatch at pk={entry.pk}: expected '{expected_previous_hash}', got '{entry.previous_hash}'"
                )
            if not full_report:
                break

        # 2. Verify MAC signature
        verified, key_used, reason = verify_entry(entry, key_provider=key_provider)
        if not verified:
            is_intact = False
            if first_failed_pk is None:
                first_failed_pk = entry.pk
                first_failure_reason = f"MAC verification failed at pk={entry.pk}: {reason}"
            if not full_report:
                break
        else:
            if key_used == "current":
                current_key_count += 1
            elif key_used == "previous":
                previous_key_count += 1

        expected_previous_hash = entry.entry_hash

    return AuditVerificationReport(
        is_intact=is_intact,
        total_count=total_count,
        current_key_count=current_key_count,
        previous_key_count=previous_key_count,
        failed_pk=first_failed_pk,
        failure_reason=first_failure_reason,
    )


def rotate_key(
    new_current_key: str | bytes,
    new_key_id: str = "k2",
    key_provider: Optional[KeyProvider] = None,
) -> None:
    """
    Delegates key rotation to key provider.
    """
    (key_provider or get_default_key_provider()).rotate(new_current_key, new_key_id)


def checkpoint(
    model_class: Type[OSIVaultAuditLog],
    key_provider: Optional[KeyProvider] = None,
) -> OSIVaultAuditCheckpoint:
    """
    Computes entry_hash of the current last row along with row count and produces a signed checkpoint record.
    """
    if key_provider is None:
        key_provider = get_default_key_provider()

    table_name = model_class._meta.db_table
    now = datetime.now(timezone.utc)
    timestamp_str = format_iso_timestamp(now)

    with transaction.atomic():
        _table_lock(model_class)
        last_row = model_class.objects.order_by("-pk").first()
        last_entry_hash = last_row.entry_hash if last_row else ""
        row_count = model_class.objects.count()

        prev_cp = (
            OSIVaultAuditCheckpoint.objects.filter(table_name=table_name)
            .order_by("-pk")
            .first()
        )
        previous_checkpoint_hash = prev_cp.checkpoint_hash if prev_cp else ""

        key_bytes, key_id = key_provider.get_current_key()
        envelope = {
            "fmt_ver": FORMAT_VERSION,
            "hash_alg": "SHA-256",
            "key_id": key_id,
            "mac_alg": "HMAC-SHA-256",
        }

        payload_dict = {
            "envelope": envelope,
            "last_entry_hash": last_entry_hash,
            "previous_checkpoint_hash": previous_checkpoint_hash,
            "row_count": row_count,
            "table_name": table_name,
            "timestamp": timestamp_str,
        }
        payload_bytes = canonical_json(payload_dict)
        checkpoint_hash = compute_hmac_sha256(key_bytes, payload_bytes)

        cp = OSIVaultAuditCheckpoint(
            table_name=table_name,
            last_entry_hash=last_entry_hash,
            row_count=row_count,
            previous_checkpoint_hash=previous_checkpoint_hash,
            envelope=envelope,
            timestamp=now,
            checkpoint_hash=checkpoint_hash,
        )
        cp._osivault_append_token = True
        try:
            cp.save(force_insert=True)
        finally:
            cp._osivault_append_token = False
        return cp


def verify_checkpoint(cp, model_class, key_provider=None) -> CheckpointVerificationReport:
    """
    Verifies a checkpoint record.
    Note that live_ok is expected to be False for any checkpoint that is not the most recent,
    because rows have been appended since. An operator verifies the latest checkpoint
    against the live table, and verifies older checkpoints for mac_ok and chain_ok only.
    """
    key_provider = key_provider or get_default_key_provider()
    try:
        validate_envelope(cp.envelope)
    except AllowlistError as err:
        return CheckpointVerificationReport(False, False, False, False, str(err))

    payload = canonical_json({
        "envelope": cp.envelope,
        "last_entry_hash": cp.last_entry_hash,
        "previous_checkpoint_hash": cp.previous_checkpoint_hash,
        "row_count": cp.row_count,
        "table_name": cp.table_name,
        "timestamp": format_iso_timestamp(cp.timestamp),
    })

    mac_ok = False
    current_key, _ = key_provider.get_current_key()
    prev_key, _ = key_provider.get_previous_key()

    for key in (current_key, prev_key):
        if key and hmac.compare_digest(compute_hmac_sha256(key, payload), cp.checkpoint_hash):
            mac_ok = True
            break

    prev = (
        OSIVaultAuditCheckpoint.objects.filter(table_name=cp.table_name, pk__lt=cp.pk)
        .order_by("-pk")
        .first()
    )
    chain_ok = (prev.checkpoint_hash if prev else "") == cp.previous_checkpoint_hash

    last = model_class.objects.order_by("-pk").first()
    live_ok = (
        (last.entry_hash if last else "") == cp.last_entry_hash
        and model_class.objects.count() == cp.row_count
    )

    reason_parts = []
    if not mac_ok:
        reason_parts.append("mac")
    if not chain_ok:
        reason_parts.append("chain")
    if not live_ok:
        reason_parts.append("live")

    reason = "; ".join(reason_parts) if reason_parts else None
    return CheckpointVerificationReport(True, mac_ok, chain_ok, live_ok, reason)
