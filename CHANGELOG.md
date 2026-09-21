# Changelog

All notable changes to OSIVault will be documented in this file.
The format is based on Keep a Changelog and this project adheres to Semantic Versioning.
OSIVault is consumed by git tag; see docs/charter.md for the pin policy.

## [0.1.0] - Unreleased

### Added
- osivault.audit: keyed HMAC-SHA-256 audit entries with previous-hash chaining, self-describing
  envelope with allowlist-first verification, Postgres advisory lock on append, append-only
  guard on the model, immutable checkpoints with their own chain, verify_checkpoint, env-backed
  and in-memory key providers, and a Postgres immutability trigger installer.
- Package skeleton for osivault.fields, osivault.sign, osivault.tokens, osivault.auth, and
  osivault.watch as stubs.
