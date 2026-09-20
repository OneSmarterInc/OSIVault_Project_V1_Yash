"""
Django test settings for OSIVault test suite.
"""

import os
import urllib.parse
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "osivault-conformance-test-suite-secret-key-spec-2026"

DEBUG = True

ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.auth",
    "osivault.audit",
    "tests",
]

MIDDLEWARE = []

# Support PostgreSQL via DATABASE_URL if set, fallback to SQLite in-memory for basic unit tests
DATABASE_URL = os.environ.get("DATABASE_URL")

if DATABASE_URL:
    url = urllib.parse.urlparse(DATABASE_URL)
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": url.path[1:],
            "USER": url.username or "postgres",
            "PASSWORD": url.password or "",
            "HOST": url.hostname or os.environ.get("PGHOST", "localhost"),
            "PORT": url.port or int(os.environ.get("PGPORT", "5432")),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "osivault_test.sqlite3",
            "OPTIONS": {
                "timeout": 30,
            },
        }
    }

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

USE_TZ = True
TIME_ZONE = "UTC"
