# 🛡️ OSIVault: Enterprise Security Core

**OSIVault** is One Smarter's shared security core: a single versioned Python package that every enterprise application imports for field-level encryption at rest, tamper-evident audit trail integrity, cryptographic signing and verification, token issuance, and strong multi-factor authentication adapters.

Extracted from proven primitives in Concorde and MeshKor alongside healthcare EDI security requirements, OSIVault provides a unified, **crypto-agile interface** designed to ensure that cryptographic algorithm upgrades occur centrally without requiring application code changes.

For full architectural details, governance rules, and monthly audit rituals, consult the [OSIVault Core Charter](docs/charter.md).

---

## 📦 Installation

```bash
pip install osivault
```

---

## 🧪 Running the tests

To run the complete test suite on PostgreSQL (including concurrency advisory lock and database trigger immutability tests):

```bash
docker run --name osivault-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=osivault_test -p 5432:5432 -d postgres:16
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/osivault_test python -m pytest -q
```

*Note: Running `python -m pytest` without `DATABASE_URL` uses an in-memory SQLite database, which runs all core cryptographic unit tests but skips PostgreSQL-specific concurrency and trigger immutability tests.*

---

## 🏛️ Module Overview

| Module | Purpose | Underlying Cryptographic Primitive |
| :--- | :--- | :--- |
| **`osivault.fields`** | Field-level encryption at rest & search hashing | AES-256-GCM Envelope Encryption & HMAC-SHA-256 |
| **`osivault.audit`** | Keyed, chained, tamper-evident audit records | SHA-256 Merkle Hash Linkage & Signed Checkpoints |
| **`osivault.sign`** | Self-describing signatures over arbitrary bytes | RSA / HMAC / Post-Quantum Ready Envelopes |
| **`osivault.tokens`** | Session and service tokens with published JWKS | RS256 / JWT Tokens & RFC 7517 JWKS Metadata |
| **`osivault.auth`** | Multi-factor authentication adapters | TOTP (Replay Guarded) & WebAuthn / FIDO2 |
| **`osivault.watch`** | Compliance inventory & posture reporting | Machine-Readable Algorithm & CVE Inventory |

---

## 🚀 Quickstart & Code Examples

### 1. Field-Level Encryption & Blind Index Search Hashing (`osivault.fields`)

```python
from osivault.fields import encrypt, decrypt, SearchHash, EncryptedTextField, EncryptedJSONField
from django.db import models

# 1. Standalone AES-256-GCM Envelope Encryption (fresh 256-bit DEK per encrypt)
ciphertext = encrypt("Sensitive Data: 123-45-6789", context="tenant_101")
plaintext = decrypt(ciphertext, context="tenant_101")

# 2. Deterministic Blind Index Search Hashing for SQL queries
ssn_hash = SearchHash("123-45-6789")

# 3. Transparent Django Model Fields
class StudentRecord(models.Model):
    name = models.CharField(max_length=255)
    ssn_id = EncryptedTextField(blank=True, null=True)
    ssn_search_hash = models.CharField(max_length=64, db_index=True, blank=True, null=True)
    medical_notes = EncryptedTextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.ssn_id:
            self.ssn_search_hash = SearchHash(self.ssn_id)
        super().save(*args, **kwargs)
```

---

### 2. Tamper-Evident Audit Trail (`osivault.audit`)

```python
from django.db import models
from osivault.audit.models import OSIVaultAuditLog
from osivault.audit import append, verify_chain, rotate_key, checkpoint, verify_checkpoint

# 1. Define Subclassed Audit Log Model
class SystemAuditLog(OSIVaultAuditLog):
    details = models.TextField(blank=True, default="")

# 2. Append Tamper-Evident Audit Record
log = append(
    model_class=SystemAuditLog,
    actor="admin_user",
    tenant="tenant_alpha",
    resource_type="STUDENT",
    resource_id="101",
    action="UPDATE",
    details="Updated student record"
)

# 3. Verify Entire Audit Chain Integrity
report = verify_chain(SystemAuditLog)
print("Is Audit Chain Intact?:", report.is_intact)

# 4. Rotate Encryption Master Key (k1 -> k2)
rotate_key(new_current_key="new-master-key-k2!", new_key_id="k2")

# 5. Take Periodic Table Snapshot Checkpoint
cp = checkpoint(SystemAuditLog)
cp_report = verify_checkpoint(cp, SystemAuditLog)
print("Checkpoint Verification:", cp_report.is_valid)
```

---

## 🔒 Security Immutability & Threat Model

- **Data Theft Resistance**: All sensitive model fields are stored as AES-256-GCM scrambled ciphertext (`OSV1$AES-256-GCM$...`).
- **Audit Log Tamper Defense**: Any direct database alteration or row deletion breaks the HMAC SHA-256 Merkle chain. `verify_chain()` flags `is_intact: False` with the exact tampered row primary key.
- **ORM Immutability Guard**: Any attempt to modify or delete historical audit entries in Python code raises `osivault.audit.crypto.ImmutabilityError`.

---

## 📖 License

Copyright 2026 One Smarter, Inc. All rights reserved. Proprietary and confidential.
