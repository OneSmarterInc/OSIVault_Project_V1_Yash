"""
Concrete models for OSIVault test suite (Task 1: Audit Module).
"""

from django.db import models
from osivault.audit.models import OSIVaultAuditLog


class ConcreteAuditLog(OSIVaultAuditLog):
    """
    Concrete implementation of OSIVaultAuditLog used by the audit conformance test suite.
    """
    class Meta:
        app_label = "tests"
        db_table = "test_concrete_audit_log"
