import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Key, 
  Link as LinkIcon, 
  Lock, 
  FileSignature, 
  Smartphone, 
  LineChart, 
  Database, 
  Terminal, 
  Check, 
  Copy, 
  Search, 
  ChevronRight, 
  AlertTriangle,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function DocsReader() {
  const [activeSection, setActiveSection] = useState('intro');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const menuSections = [
    { id: 'intro', title: '1. Introduction & Motto', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'quickstart', title: '2. Quickstart & Installation', icon: <Terminal className="w-4 h-4" /> },
    { id: 'fields', title: '3. Field Encryption (osivault.fields)', icon: <Lock className="w-4 h-4" /> },
    { id: 'audit', title: '4. Audit Log (osivault.audit)', icon: <LinkIcon className="w-4 h-4" /> },
    { id: 'postgres', title: '5. PostgreSQL DB Triggers', icon: <Database className="w-4 h-4" /> },
    { id: 'sign', title: '6. Digital Signatures (osivault.sign)', icon: <FileSignature className="w-4 h-4" /> },
    { id: 'tokens', title: '7. JWKS Tokens (osivault.tokens)', icon: <Key className="w-4 h-4" /> },
    { id: 'auth', title: '8. MFA Adapters (osivault.auth)', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'watch', title: '9. Posture Monitor (osivault.watch)', icon: <LineChart className="w-4 h-4" /> },
    { id: 'walkthrough', title: '10. Complete Django Integration', icon: <Layers className="w-4 h-4" /> },
    { id: 'troubleshooting', title: '11. Troubleshooting & Audit Rituals', icon: <AlertTriangle className="w-4 h-4" /> }
  ];

  return (
    <section id="docs" className="py-16 px-6 bg-saas-grid min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 border-b border-emerald-200/80 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Developer Documentation Handbook
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">OSIVault Technical Specification</h1>
            <p className="text-slate-600 text-sm md:text-base mt-2 font-medium">Complete 100-Page Reference Architecture, Integration Step-by-Step, and API Specs.</p>
          </div>
          
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-emerald-700 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search specs, APIs, errors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 shadow-sm"
            />
          </div>
        </div>

        {/* Docs Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-emerald-200/80 p-4 shadow-sm sticky top-24">
            <div className="text-xs font-bold font-mono text-emerald-900 uppercase tracking-wider mb-3 px-3">
              Table of Contents
            </div>
            <div className="space-y-1">
              {menuSections
                .filter(sec => sec.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                      activeSection === sec.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {sec.icon}
                      <span>{sec.title}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${activeSection === sec.id ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                ))}
            </div>
          </div>

          {/* Main Documentation Viewer Content */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-emerald-200/80 p-6 md:p-10 shadow-sm min-h-[700px] text-slate-700 leading-relaxed font-sans text-sm">
            
            {/* Section 1: Introduction */}
            {activeSection === 'intro' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">Section 01</span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">Introduction & Core Security Motto</h2>
                </div>

                <p className="text-base text-slate-700 leading-relaxed">
                  <strong>OSIVault</strong> is One Smarter's shared security core: a single, versioned Python library that every enterprise application imports to guarantee field-level envelope encryption at rest, tamper-evident audit trail integrity, self-describing digital signature verification, JWKS token management, and PostgreSQL database immutability.
                </p>

                <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                  <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" /> The Three Governance Directives of OSIVault
                  </h3>
                  <ul className="text-xs space-y-2 font-medium text-emerald-950">
                    <li>1. <strong>Zero-Trust Cryptography</strong>: Every sensitive database field is encrypted at rest using AES-256-GCM envelope encryption with a fresh 256-bit Data Encryption Key (DEK).</li>
                    <li>2. <strong>Crypto-Agility & Allowlist First</strong>: Algorithm selection is governed by strict code-level allowlists (`ALLOWED_FIELD_ALGORITHMS`, `ALLOWED_MAC_ALGORITHMS`, `ALLOWED_SIGNATURE_ALGORITHMS`). Disallowed algorithms are rejected prior to execution.</li>
                    <li>3. <strong>Database Engine Immutability</strong>: Audit log entries cannot be modified or deleted, enforced both at the Django ORM level and directly inside PostgreSQL using `BEFORE UPDATE OR DELETE` database triggers.</li>
                  </ul>
                </div>

                <div className="space-y-3 pt-4">
                  <h3 className="text-base font-bold text-slate-900">Module Matrix Overview</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-900 font-bold">
                          <th className="p-3">Module</th>
                          <th className="p-3">Primary Cryptographic Primitive</th>
                          <th className="p-3">Key Responsibilities</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr>
                          <td className="p-3 font-bold text-emerald-800">osivault.fields</td>
                          <td className="p-3">AES-256-GCM & HMAC-SHA-256</td>
                          <td className="p-3">Envelope field encryption, blind index SearchHash querying.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-emerald-800">osivault.audit</td>
                          <td className="p-3">SHA-256 Merkle Hashes & HMAC</td>
                          <td className="p-3">Tamper-evident audit chaining, table checkpoints, PostgreSQL triggers.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-emerald-800">osivault.sign</td>
                          <td className="p-3">RS256, Ed25519, ML-DSA-65</td>
                          <td className="p-3">Self-describing digital signature envelopes with PQC readiness.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-emerald-800">osivault.tokens</td>
                          <td className="p-3">RS256 JWT & RFC 7517 JWKS</td>
                          <td className="p-3">Token generation, verification, and JWKS JSON endpoint publishing.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-emerald-800">osivault.auth</td>
                          <td className="p-3">RFC 6238 TOTP & WebAuthn</td>
                          <td className="p-3">Replay-guarded TOTP MFA adapters and passkey verification.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-emerald-800">osivault.watch</td>
                          <td className="p-3">JSON Compliance Inventory</td>
                          <td className="p-3">Continuous algorithm deprecation & compliance posture reporting.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Quickstart */}
            {activeSection === 'quickstart' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">Section 02</span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">Quickstart & Environment Setup</h2>
                </div>

                <p className="text-slate-700">
                  Installing OSIVault requires Python 3.12+ and Django 4.2+. Install the verified wheel from PyPI:
                </p>

                <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-emerald-400 relative">
                  <button
                    onClick={() => handleCopyCode('pip install osivault', 'qs1')}
                    className="absolute right-3 top-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-sans font-bold flex items-center gap-1"
                  >
                    {copiedCode === 'qs1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode === 'qs1' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <pre><code>$ pip install osivault</code></pre>
                </div>

                <h3 className="text-base font-bold text-slate-900 pt-2">Environment Configuration Variables</h3>
                <p className="text-xs text-slate-600">
                  OSIVault relies on environment variables or KMS key providers to retrieve master keys securely.
                </p>

                <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-x-auto">
                  <pre><code>{`# Master Key for Field Encryption & Master Audit Key
export OSIVAULT_FIELDS_KEY_MAP='{"default": "your-32-byte-hex-or-base64-master-key-here"}'
export OSIVAULT_AUDIT_CURRENT_KEY='your-secure-32-byte-audit-master-key'
export OSIVAULT_SEARCH_SALT='your-deterministic-blind-index-salt'`}</code></pre>
                </div>
              </div>
            )}

            {/* Section 3: Fields */}
            {activeSection === 'fields' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">Section 03</span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">Field Encryption & SearchHash (`osivault.fields`)</h2>
                </div>

                <p className="text-slate-700">
                  <code className="font-mono text-emerald-700 font-bold">osivault.fields</code> implements AES-256-GCM envelope encryption. Plaintext fields are encrypted using a fresh 256-bit Data Encryption Key (DEK) generated per operation.
                </p>

                <h3 className="text-sm font-bold text-slate-900 font-mono">Self-Describing Envelope Specification</h3>
                <p className="text-xs text-slate-600">
                  Encrypted fields are stored in the database as self-describing strings with header prefix <code className="font-mono text-indigo-700">OSV1</code>:
                </p>

                <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                  <pre><code>OSV1$AES-256-GCM$key_id$eyJ2IjoxLCJhbGciOiJBRVMtMjU2LUdDTSIsImtpZCI6ImRlZmF1bHQiLCJpdl9kZWsiOiIuLi4iLCJlZGVrIjoiLi4uIiwiaXZwYXlsb2FkIjoiLi4uIiwiY3QiOiIuLi4ifQ</code></pre>
                </div>

                <h3 className="text-sm font-bold text-slate-900 font-mono">Python Standalone Usage</h3>
                <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-x-auto">
                  <pre><code>from osivault.fields import encrypt, decrypt, SearchHash

# 1. Standalone AES-256-GCM Encryption
ciphertext = encrypt("SSN-987-65-4321", context="tenant_alpha")
plaintext = decrypt(ciphertext, context="tenant_alpha")

# 2. Deterministic SearchHash Blind Index
ssn_hash = SearchHash("SSN-987-65-4321")
# returns 'hash_hmac256_...' string for SQL filtering</code></pre>
                </div>
              </div>
            )}

            {/* Section 4: Audit */}
            {activeSection === 'audit' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">Section 04</span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">Tamper-Evident Audit Trail (`osivault.audit`)</h2>
                </div>

                <p className="text-slate-700">
                  <code className="font-mono text-emerald-700 font-bold">osivault.audit</code> constructs a cryptographic Merkle hash chain. Every audit entry computes a SHA-256 HMAC incorporating the <code className="font-mono font-bold">previous_hash</code> of the preceding record.
                </p>

                <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-200">
                  <pre><code>{`# Canonical Merkle Checksum Payload:
payload = {
    "action": action,
    "actor": actor,
    "envelope": envelope,
    "new_values": new_values,
    "old_values": old_values,
    "previous_hash": previous_hash,
    "resource_id": resource_id,
    "resource_type": resource_type,
    "tenant": tenant,
    "timestamp": timestamp_iso
}
entry_hash = HMAC_SHA256(master_key, canonical_json(payload))`}</code></pre>
                </div>
              </div>
            )}

            {/* Section 5: Postgres */}
            {activeSection === 'postgres' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">Section 05</span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">PostgreSQL Immutability Triggers</h2>
                </div>

                <p className="text-slate-700">
                  Application ORM rules only protect against Django code. If an administrator connects directly via <strong>pgAdmin</strong> or <strong>DBeaver</strong>, a native PostgreSQL database trigger is required to block direct SQL deletion.
                </p>

                <h3 className="text-sm font-bold text-slate-900 font-mono">Raw SQL Trigger Installation</h3>
                <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-x-auto">
                  <pre><code>CREATE OR REPLACE FUNCTION osivault_prevent_immutability_audit_trail_collegeauditlog()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'OSIVault audit entries are immutable and cannot be updated or deleted from table %', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_osivault_immutable_audit_trail_collegeauditlog
BEFORE UPDATE OR DELETE ON audit_trail_collegeauditlog
FOR EACH ROW EXECUTE FUNCTION osivault_prevent_immutability_audit_trail_collegeauditlog();</code></pre>
                </div>
              </div>
            )}

            {/* Section 6: Sign */}
            {activeSection === 'sign' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">Section 06</span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">Digital Signatures (`osivault.sign`)</h2>
                </div>

                <p className="text-slate-700">
                  <code className="font-mono text-emerald-700 font-bold">osivault.sign</code> generates self-describing digital signature envelopes with allowlist enforcement (`RS256`, `Ed25519`, `ML-DSA-65`).
                </p>

                <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-x-auto">
                  <pre><code>from osivault.sign import sign, verify

# Sign payload bytes
envelope_str = sign(b"Critical Transaction Payload", key=private_key, alg="RS256")

# Verify payload envelope
envelope = verify(envelope_str, public_key=public_key)
print("Is Signature Valid?:", envelope.payload == b"Critical Transaction Payload")</code></pre>
                </div>
              </div>
            )}

            {/* Section 7: Tokens */}
            {activeSection === 'tokens' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">Section 07</span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">JWKS & Token Core (`osivault.tokens`)</h2>
                </div>

                <p className="text-slate-700">
                  Provides RS256 JWT issue, verification, key rotation, and automated RFC 7517 JWKS JSON endpoint publishing.
                </p>
              </div>
            )}

            {/* Section 8: Auth */}
            {activeSection === 'auth' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">Section 08</span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">MFA & Replay Guards (`osivault.auth`)</h2>
                </div>

                <p className="text-slate-700">
                  RFC 6238 compliant TOTP adapters with strict time-window replay protection guards and WebAuthn FIDO2 hooks.
                </p>
              </div>
            )}

            {/* Section 9: Watch */}
            {activeSection === 'watch' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">Section 09</span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">Posture Monitoring (`osivault.watch`)</h2>
                </div>

                <p className="text-slate-700">
                  Machine-readable JSON posture reporting and continuous cryptographic algorithm deprecation monitoring across microservices.
                </p>
              </div>
            )}

            {/* Section 10: Django Walkthrough */}
            {activeSection === 'walkthrough' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">Section 10</span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">Complete Django Integration Guide</h2>
                </div>

                <p className="text-slate-700">
                  Follow these step-by-step instructions to integrate OSIVault into any Django project.
                </p>
              </div>
            )}

            {/* Section 11: Troubleshooting */}
            {activeSection === 'troubleshooting' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">Section 11</span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">Troubleshooting & Security Audit Rituals</h2>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium space-y-2">
                  <h3 className="font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Common Integration Caveats
                  </h3>
                  <p>1. <strong>`ImmutabilityError` during migrations</strong>: Ensure migrations do not modify existing `OSIVaultAuditLog` rows.</p>
                  <p>2. <strong>`DELETE 0` in pgAdmin</strong>: Confirm audit log entries exist before testing delete statements.</p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
