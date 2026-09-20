import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

export default function IntegrationCodeShowcase() {
  const [activeCodeTab, setActiveCodeTab] = useState('models');
  const [copied, setCopied] = useState(false);

  const codeSnippets = {
    models: `from django.db import models
from osivault.fields import EncryptedTextField, SearchHash

class StudentRecord(models.Model):
    name = models.CharField(max_length=255)
    
    # 1. AES-256-GCM Envelope Encryption at rest
    ssn_id = EncryptedTextField(blank=True, null=True)
    
    # 2. Deterministic HMAC Blind Index for fast SQL queries
    ssn_search_hash = models.CharField(max_length=64, db_index=True, blank=True)

    def save(self, *args, **kwargs):
        if self.ssn_id:
            self.ssn_search_hash = SearchHash(self.ssn_id)
        super().save(*args, **kwargs)`,

    audit: `from django.db import models
from osivault.audit.models import OSIVaultAuditLog
from osivault.audit import append

class CollegeAuditLog(OSIVaultAuditLog):
    details = models.TextField(blank=True, default="")

# Automatically append Merkle audit entry on save
def audit_student_change(sender, instance, created, **kwargs):
    action = "CREATE" if created else "UPDATE"
    append(
        model_class=CollegeAuditLog,
        actor="AdminUser",
        tenant="MainCollege",
        resource_type="STUDENT",
        resource_id=str(instance.id),
        action=action,
        details=f"Updated student: {instance.name}"
    )`,

    middleware: `# settings.py
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    # OSIVault Immutability Middleware: Blocks HTTP PUT/PATCH/DELETE on audit URLs
    'audit_trail.middleware.OSIVaultImmutabilityMiddleware',
    'django.middleware.common.CommonMiddleware',
]`,

    trigger: `# audit_trail/apps.py
from django.apps import AppConfig

class AuditTrailConfig(AppConfig):
    name = 'audit_trail'

    def ready(self):
        import audit_trail.signals
        from osivault.audit.postgres import install_postgres_immutability_trigger
        
        # Auto-installs PostgreSQL BEFORE DELETE trigger on boot
        install_postgres_immutability_trigger('audit_trail_collegeauditlog')`,
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="code" className="py-24 px-6 relative bg-saas-grid border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold uppercase tracking-wider mb-3">
            Integration Blueprint
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Integrate in under 5 Minutes</h2>
          <p className="text-slate-600 text-base mt-3">Clean Pythonic APIs designed for seamless Django, FastAPI, and Flask integration.</p>
        </div>

        <div className="bg-slate-950 rounded-3xl border border-slate-800/90 overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-200">Django Integration Blueprint</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveCodeTab('models')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                    activeCodeTab === 'models' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1. models.py
                </button>
                <button
                  onClick={() => setActiveCodeTab('audit')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                    activeCodeTab === 'audit' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2. signals.py
                </button>
                <button
                  onClick={() => setActiveCodeTab('middleware')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                    activeCodeTab === 'middleware' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3. settings.py
                </button>
                <button
                  onClick={() => setActiveCodeTab('trigger')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                    activeCodeTab === 'trigger' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  4. apps.py
                </button>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 ml-2"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
              </button>
            </div>
          </div>

          <div className="p-6 bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
            <pre><code>{codeSnippets[activeCodeTab]}</code></pre>
          </div>
        </div>
      </div>
    </section>
  );
}
