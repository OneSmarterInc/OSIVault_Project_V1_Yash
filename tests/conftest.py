"""
Pytest configuration and shared fixtures for OSIVault test suite.
"""

import os
import pytest
from django.core.management import call_command
from django.db import connection

TEST_CURRENT_KEY = "k1_super_secret_current_key_2026_audit_spec_32bytes!"
TEST_PREVIOUS_KEY = "k0_super_secret_previous_key_2026_audit_spec_32bytes!"


@pytest.fixture(scope="session", autouse=True)
def setup_test_db(django_db_setup, django_db_blocker):
    with django_db_blocker.unblock():
        call_command("migrate", verbosity=0)


@pytest.fixture(autouse=True)
def setup_audit_keys(monkeypatch):
    monkeypatch.setenv("OSIVAULT_AUDIT_CURRENT_KEY", TEST_CURRENT_KEY)
    monkeypatch.setenv("OSIVAULT_AUDIT_PREVIOUS_KEY", TEST_PREVIOUS_KEY)


@pytest.fixture(autouse=True)
def flush_test_db(db):
    yield
    with connection.cursor() as cursor:
        if is_postgres():
            cursor.execute("DROP TRIGGER IF EXISTS trg_osivault_immutable_test_concrete_audit_log ON test_concrete_audit_log;")
            cursor.execute("DROP TRIGGER IF EXISTS trg_osivault_immutable_osivault_audit_checkpoint ON osivault_audit_checkpoint;")
        cursor.execute("DELETE FROM osivault_audit_checkpoint;")
        cursor.execute("DELETE FROM test_concrete_audit_log;")



def is_postgres():
    return connection.vendor == "postgresql"


postgres_only = pytest.mark.skipif(
    not is_postgres(),
    reason="requires PostgreSQL",
)
