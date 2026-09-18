# OSIVault Core Charter

Version 0.1, September 8, 2026. Working draft for Vikram Sethi, Rushikesh (owner), and Prajval (reviewer).

## What OSIVault is

OSIVault is One Smarter's shared security core: a single versioned Python package that every One Smarter application imports for encryption at rest, audit trail integrity, cryptographic signing and verification, token issuance, and strong authentication. It is extracted from what already exists in Concorde and MeshKor and from the better half of the MIR portal's audit implementation, and it is the one place those primitives are maintained from now on.

## The interface surface

| Namespace       | Public operations                                                                | Purpose                                                                |
| --------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| osivault.fields | encrypt, decrypt, EncryptedTextField, EncryptedJSONField, rotate_dek, SearchHash | Field-level encryption at rest and blind-index search hashing          |
| osivault.audit  | append, verify_entry, verify_chain, rotate_key, checkpoint                       | Keyed, chained, tamper-evident audit records                           |
| osivault.sign   | sign, verify, Envelope                                                           | Self-describing signatures over arbitrary bytes                        |
| osivault.tokens | issue, verify, jwks_document, rotate                                             | Session and service tokens with published verification keys            |
| osivault.auth   | TOTPVerifier, WebAuthnRegistrar, WebAuthnAsserter, RecoveryCodes                 | Second-factor adapters for privileged and ordinary accounts            |
| osivault.watch  | inventory, baseline, report                                                      | Machine-readable statement of what algorithms and libraries are in use |
