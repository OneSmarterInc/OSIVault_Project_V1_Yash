# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Repository bootstrap and package structure (`osivault.fields`, `osivault.audit`, `osivault.sign`, `osivault.tokens`, `osivault.auth`, `osivault.watch`).
- `osivault.audit` merged audit module implementation:
  - Abstract model `OSIVaultAuditLog` with immutable `.save()` and `.delete()` guards.
  - Keyed HMAC-SHA-256 MAC authentication over canonical JSON payload.
  - Merkle SHA-256 `previous_hash` chain linkage.
  - Key providers (`EnvVarKeyProvider` and `InMemoryKeyProvider`) with debug fallback warnings and production fail-closed semantics.
  - Operations: `append`, `verify_entry`, `verify_chain`, `rotate_key`, `checkpoint`.
  - Native PostgreSQL `BEFORE UPDATE OR DELETE` function trigger (`install_postgres_immutability_trigger`).
  - Periodic `checkpoint` table (`OSIVaultAuditCheckpoint`) to catch whole-table replacement.
- Seed conformance test suite (`tests/test_audit.py`) with 13 comprehensive tests.
