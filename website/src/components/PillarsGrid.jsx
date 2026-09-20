import React from 'react';
import { Lock, Link, FileSignature, Key, Smartphone, LineChart, CheckCircle2 } from 'lucide-react';

export default function PillarsGrid() {
  const pillars = [
    {
      icon: <Lock className="w-5 h-5 text-emerald-600" />,
      module: 'osivault.fields',
      title: 'Field Encryption & SearchHash',
      desc: 'AES-256-GCM envelope encryption for sensitive fields with fresh DEKs per write. Includes HMAC-SHA-256 blind indices (SearchHash) allowing fast SQL filtering without decrypting database columns.',
      points: ['EncryptedTextField & EncryptedJSONField', 'Deterministic SearchHash blind index'],
    },
    {
      icon: <Link className="w-5 h-5 text-emerald-600" />,
      module: 'osivault.audit',
      title: 'Tamper-Evident Audit Trail',
      desc: 'Merkle-linked cryptographic audit logs. Every log entry contains a signed SHA-256 hash derived from its predecessor. Includes PostgreSQL immutability triggers enforcing DB-level zero deletion.',
      points: ['Merkle SHA-256 hash chaining', 'PostgreSQL BEFORE DELETE triggers'],
    },
    {
      icon: <FileSignature className="w-5 h-5 text-emerald-600" />,
      module: 'osivault.sign',
      title: 'Digital Signature Envelopes',
      desc: 'Self-describing signature envelopes over arbitrary byte payloads and JSON dictionaries. Supports HMAC-SHA256, RSA-PSS, and post-quantum algorithm agility wrappers.',
      points: ['Self-describing signature headers', 'Non-repudiation verification'],
    },
    {
      icon: <Key className="w-5 h-5 text-emerald-600" />,
      module: 'osivault.tokens',
      title: 'JWKS & Token Core',
      desc: 'RS256 JWT issue, verification, and automated key rotation with RFC 7517 JSON Web Key Sets (JWKS) publishing for seamless microservice auth verification.',
      points: ['RFC 7517 JWKS endpoint generation', 'Zero-downtime key rotation'],
    },
    {
      icon: <Smartphone className="w-5 h-5 text-emerald-600" />,
      module: 'osivault.auth',
      title: 'MFA & Replay Guards',
      desc: 'RFC 6238 compliant TOTP adapters with built-in time-window replay protection and WebAuthn / FIDO2 passkey integration hooks.',
      points: ['TOTP replay window guards', 'WebAuthn / Passkey support'],
    },
    {
      icon: <LineChart className="w-5 h-5 text-emerald-600" />,
      module: 'osivault.watch',
      title: 'Compliance & Audit Posture',
      desc: 'Machine-readable security inventory and cryptographic algorithm posture reporting to ensure continuous HIPAA, SOC 2, and PCI-DSS compliance.',
      points: ['Machine-readable posture JSON', 'Crypto algorithm deprecation watch'],
    },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-slate-50/50 border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold uppercase tracking-wider mb-3">
            Core Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">The 6 Pillars of OSIVault</h2>
          <p className="text-slate-600 text-base mt-3 font-normal">A unified zero-trust security framework engineered for enterprise Python applications.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((item, index) => (
            <div
              key={index}
              className="saas-card rounded-2xl p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full border border-emerald-200 text-emerald-800 bg-emerald-50/80 text-[11px] font-mono font-semibold">
                    {item.module}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2.5">{item.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-6 font-normal">{item.desc}</p>
              </div>

              <ul className="text-xs text-slate-600 space-y-2 font-mono pt-4 border-t border-slate-100">
                {item.points.map((pt, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
