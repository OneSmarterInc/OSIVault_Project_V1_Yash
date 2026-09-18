# OSIVault Core Security Framework

OSIVault is One Smarter Inc.'s shared security core: a single, versioned Python package that every One Smarter application imports for encryption at rest, audit trail integrity, cryptographic signing and verification, token issuance, and strong authentication. It unifies the cryptographic primitives extracted from Concorde, MeshKor, and the MIR portal into a single maintained core.

## Architecture and Design Goal

The primary design goal of OSIVault is long-term cryptographic agility:

When a monthly audit dictates a change in an algorithm, key size, library, or mode, that change is executed once inside OSIVault. OSIVault ships a new version, consuming applications bump their pin and run the conformance suite, and no application code changes. If an upgrade ever requires editing application code, the interface was wrong and the fix is to the interface, not to the application.

## Public Interface Surface

Applications import strictly from these six public namespaces:

| Namespace | Public Operations | Purpose |
| --- | --- | --- |
| osivault.audit | append, verify_entry, verify_chain, rotate_key, checkpoint | Keyed, chained, tamper-evident audit records |
| osivault.fields | encrypt, decrypt, EncryptedTextField, EncryptedJSONField, rotate_dek, SearchHash | Field-level encryption at rest and blind-index search hashing |
| osivault.sign | sign, verify, Envelope | Self-describing signatures over arbitrary bytes |
| osivault.tokens | issue, verify, jwks_document, rotate | Session and service tokens with published verification keys |
| osivault.auth | TOTPVerifier, WebAuthnRegistrar, WebAuthnAsserter, RecoveryCodes | Second-factor adapters for privileged and ordinary accounts |
| osivault.watch | inventory, baseline, report | Machine-readable statement of algorithms and libraries in use |

## Module Specification: osivault.audit

Round 1 delivers `osivault.audit`, merging the keyed HMAC checksums from Concorde with the `previous_hash` chain and PostgreSQL triggers from the MIR portal.

### Technical Implementation Details
1. **Self-Describing Envelope (Format v1)**: Authenticated header specifying `mac_alg: HMAC-SHA-256`, `fmt_ver: 1`, `hash_alg: SHA-256`, and `key_id`.
2. **Canonical JSON Serialization**: Key-sorted payload binding `envelope`, `previous_hash`, `timestamp` (ISO 8601 UTC with microseconds), `actor`, `tenant`, `resource_type`, `resource_id`, `action`, `old_values`, and `new_values` inside the MAC computation.
3. **Key Providers and Fail-Closed Semantics**: `EnvVarKeyProvider` and `InMemoryKeyProvider` supporting active current and previous key rotation. Production environments fail closed if no key is configured (`DEBUG=False`).
4. **Atomic Linear Append**: Uses `select_for_update().order_by("-pk").first()` inside database transactions to ensure chain linearity under concurrent writers.
5. **PostgreSQL Engine Immutability**: Native PL/pgSQL `BEFORE UPDATE OR DELETE` function trigger (`install_postgres_immutability_trigger`) blocking direct SQL modifications in tools like pgAdmin, DBeaver, or psql.
6. **Whole-Table Replacement Protection**: `checkpoint()` operation computes the entry hash and row count of the last row, producing authenticated records in `OSIVaultAuditCheckpoint` to detect whole-table replacements.

## Integration Guide

### 1. Installation

```bash
pip install osivault
```

### 2. Subclassing AuditLog Model

```python
from django.db import models
from osivault.audit.models import OSIVaultAuditLog

class ApplicationAuditLog(OSIVaultAuditLog):
    """
    Subclass OSIVaultAuditLog to add tenant foreign keys or application-specific columns.
    """
    client_name = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = "audit_log"
```

### 3. Appending Audit Entries

```python
from osivault.audit import append
from myapp.models import ApplicationAuditLog

audit_entry = append(
    model_class=ApplicationAuditLog,
    actor="admin@onesmarter.com",
    tenant="tenant_alpha",
    resource_type="PATIENT_RECORD",
    resource_id="REC_99201",
    action="UPDATE",
    old_values={"status": "PENDING"},
    new_values={"status": "APPROVED"},
)
```

### 4. Installing PostgreSQL Immutability Trigger

```python
from django.apps import AppConfig

class AuditConfig(AppConfig):
    name = "myapp"

    def ready(self):
        from osivault.audit.postgres import install_postgres_immutability_trigger
        
        install_postgres_immutability_trigger('audit_log')
```

### 5. Verifying Audit Chain Integrity

```python
from osivault.audit import verify_chain
from myapp.models import ApplicationAuditLog

report = verify_chain(ApplicationAuditLog)

if report.is_intact:
    print(f"Chain intact. Total verified entries: {report.total_count}")
else:
    print(f"Audit failure detected at primary key {report.failed_pk}: {report.failure_reason}")
```

## Running Conformance Tests

Run the test suite using pytest:

```bash
pytest
```

## Authors and Maintainers

- Yash Tayade (tayadeyash2005@gmail.com)
- One Smarter Inc., USA (engineering@onesmarter.com)

## License

This project is licensed under the MIT License.
