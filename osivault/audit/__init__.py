"""
osivault.audit: Keyed, chained, tamper-evident audit records.
"""

def __getattr__(name):
    if name in {
        "register_audit_signal",
        "serialize_model_instance",
        "OSIVaultAuditMiddleware",
        "set_current_actor",
        "get_current_actor",
        "clear_current_actor",
        "set_current_tenant",
        "get_current_tenant",
        "clear_current_tenant",
        "audit_bulk_delete",
    }:
        from osivault.audit import signals
        return getattr(signals, name)
    if name in {"append", "verify_entry", "verify_chain", "rotate_key", "checkpoint", "verify_checkpoint", "AuditVerificationReport", "CheckpointVerificationReport"}:
        from osivault.audit import operations
        return getattr(operations, name)
    if name in {"AuditError", "ImmutabilityError", "ConfigurationError", "AllowlistError"}:
        from osivault.audit import crypto
        return getattr(crypto, name)
    if name in {"install_postgres_immutability_trigger", "install_postgres_immutability_triggers"}:
        from osivault.audit import postgres
        return getattr(postgres, name)
    raise AttributeError(f"module '{__name__}' has no attribute '{name}'")


__all__ = [
    "register_audit_signal",
    "serialize_model_instance",
    "OSIVaultAuditMiddleware",
    "set_current_actor",
    "get_current_actor",
    "clear_current_actor",
    "set_current_tenant",
    "get_current_tenant",
    "clear_current_tenant",
    "audit_bulk_delete",
    "append",
    "verify_entry",
    "verify_chain",
    "rotate_key",
    "checkpoint",
    "verify_checkpoint",
    "AuditVerificationReport",
    "CheckpointVerificationReport",
    "AuditError",
    "ImmutabilityError",
    "ConfigurationError",
    "AllowlistError",
    "install_postgres_immutability_trigger",
    "install_postgres_immutability_triggers",
]
