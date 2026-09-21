"""
Tests for osivault.sign module.
Covers self-describing digital signature envelopes, allowlist-first verification,
Ed25519 and RS256 signature schemes, and payload tampering protection.
"""


import pytest
from cryptography.hazmat.primitives.asymmetric import rsa, ed25519
from osivault.sign import sign, verify, Envelope, SignatureVerificationError


@pytest.fixture
def rsa_keys():
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    public_key = private_key.public_key()
    return private_key, public_key


@pytest.fixture
def ed25519_keys():
    private_key = ed25519.Ed25519PrivateKey.generate()
    public_key = private_key.public_key()
    return private_key, public_key


def test_sign_verify_rsa_roundtrip(rsa_keys):
    priv_key, pub_key = rsa_keys
    payload = b"OSIVault Audit Checkpoint Data #42"

    envelope_str = sign(payload, key=priv_key, alg="RS256", key_id="key-rsa-1")
    assert "OSV1-SIG" in envelope_str or envelope_str.startswith("OSV1$")

    envelope = verify(envelope_str, key_resolver=lambda kid: pub_key)
    assert isinstance(envelope, Envelope)
    assert envelope.sig_alg == "RS256"
    assert envelope.key_id == "key-rsa-1"
    assert envelope.payload == payload


def test_sign_verify_ed25519_roundtrip(ed25519_keys):
    priv_key, pub_key = ed25519_keys
    payload = "Self-describing ed25519 signature payload"

    envelope_str = sign(payload, key=priv_key, alg="Ed25519", key_id="key-ed-1")
    envelope = verify(envelope_str, key_resolver=lambda kid: pub_key)

    assert envelope.sig_alg == "Ed25519"
    assert envelope.key_id == "key-ed-1"
    assert envelope.payload == (payload.encode("utf-8") if isinstance(payload, str) else payload)


def test_allowlist_algorithm_rejection(rsa_keys):
    priv_key, pub_key = rsa_keys

    # Try signing with disallowed algorithm
    with pytest.raises(SignatureVerificationError) as exc_info:
        sign(b"test", key=priv_key, alg="MD5withRSA")
    assert "allowlist" in str(exc_info.value).lower() or "disallowed" in str(exc_info.value).lower() or "unsupported" in str(exc_info.value).lower()

    # Fabricate envelope with disallowed algorithm
    bad_envelope = "OSV1$SIG$v=1$alg=RSA-MD5$kid=test$payload=dGVzdA==$sig=ZmFrZQ=="
    with pytest.raises(SignatureVerificationError):
        verify(bad_envelope, key_resolver=lambda kid: pub_key)


def test_signature_tampering_detection(ed25519_keys):
    priv_key, pub_key = ed25519_keys
    payload = b"Original Authentic Statement"

    envelope_str = sign(payload, key=priv_key, alg="Ed25519")

    # Corrupt signature in envelope string by changing last character of signature field
    parts = envelope_str.split("$")
    sig = parts[5]
    corrupted_sig = ("A" if sig[0] != "A" else "B") + sig[1:]
    parts[5] = corrupted_sig
    corrupted_str = "$".join(parts)

    with pytest.raises(SignatureVerificationError):
        verify(corrupted_str, key_resolver=lambda kid: pub_key)


def test_ml_dsa_not_on_allowlist_until_implemented(rsa_keys):
    private_key, public_key = rsa_keys
    with pytest.raises(SignatureVerificationError, match="Allowlist"):
        sign(b"payload", private_key, alg="ML-DSA-65", key_id="k1")

    # An envelope that merely claims ML-DSA-65 is refused before any key is touched.
    forged = "OSV1-SIG$ML-DSA-65$k1$SHA-256$cGF5bG9hZA$AAAA"
    with pytest.raises(SignatureVerificationError, match="Allowlist"):
        verify(forged, public_key=public_key)

