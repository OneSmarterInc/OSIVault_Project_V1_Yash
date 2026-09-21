# Changelog

All notable changes to OSIVault will be documented in this file.
The format is based on Keep a Changelog and this project adheres to Semantic Versioning.
OSIVault is consumed by git tag; see docs/charter.md for the pin policy.

## [Unreleased]

### Added
- osivault.fields: AES-256-GCM field encryption with fresh DEK per encrypt, AAD context
  binding, LocalKeyringProvider and AWSKMSProvider, rotate_dek, SearchHash, and
  EncryptedTextField / EncryptedJSONField. Pending review against Concorde encryption_utils.
- osivault.sign: self-describing signature envelopes over RS256 and Ed25519 with
  allowlist-first verification. Pending review against the MeshKor seam rules.
- osivault.tokens: JWT issuance and verification over osivault.sign with a JWKS document.

## [0.1.0] - Unreleased

### Added
- osivault.audit: keyed HMAC-SHA-256 audit entries with previous-hash chaining, self-describing
  envelope with allowlist-first verification, Postgres advisory lock on append, append-only
  guard on the model, immutable checkpoints with their own chain, verify_checkpoint, env-backed
  and in-memory key providers, and a Postgres immutability trigger installer.
- Package skeleton for osivault.fields, osivault.sign, osivault.tokens, osivault.auth, and
  osivault.watch as stubs.
