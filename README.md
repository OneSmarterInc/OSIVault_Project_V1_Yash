# OSIVault: Enterprise Security Core

**OSIVault** is One Smarter's shared security core: a single versioned Python package that every enterprise application imports for field-level encryption at rest, tamper-evident audit trail integrity, cryptographic signing and verification, token issuance, and strong multi-factor authentication adapters.

Extracted from proven primitives in Concorde and MeshKor alongside healthcare EDI security requirements, OSIVault provides a unified, **crypto-agile interface** designed to ensure that cryptographic algorithm upgrades occur centrally without requiring application code changes.

For full architectural details, governance rules, and monthly audit rituals, consult the [OSIVault Core Charter](docs/charter.md). OSIVault is consumed by git tag; see [docs/charter.md](docs/charter.md) for the pin policy.

---

## Module Overview

| Module | Purpose | Underlying Cryptographic Primitive |
| :--- | :--- | :--- |
| **`osivault.fields`** | Field-level encryption at rest & search hashing | AES-256-GCM Envelope Encryption & HMAC-SHA-256 |
| **`osivault.audit`** | Keyed, chained, tamper-evident audit records | SHA-256 Merkle Hash Linkage & Signed Checkpoints |
| **`osivault.sign`** | Self-describing signatures over arbitrary bytes | RSA / HMAC / Post-Quantum Ready Envelopes |
| **`osivault.tokens`** | Session and service tokens with published JWKS | RS256 / JWT Tokens & RFC 7517 JWKS Metadata |
| **`osivault.auth`** | Multi-factor authentication adapters | TOTP (Replay Guarded) & WebAuthn / FIDO2 |
| **`osivault.watch`** | Compliance inventory & posture reporting | Machine-Readable Algorithm & CVE Inventory |

---

## Running the tests

To run the complete test suite on PostgreSQL (including concurrency advisory lock and database trigger immutability tests):

```bash
docker run --name osivault-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=osivault_test -p 5432:5432 -d postgres:16
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/osivault_test python -m pytest -q
```

*Note: Running `python -m pytest` without `DATABASE_URL` uses an in-memory SQLite database, which runs all core cryptographic unit tests but skips PostgreSQL-specific concurrency and trigger immutability tests.*

---

## License

Copyright 2026 One Smarter, Inc. All rights reserved. Proprietary and confidential.
