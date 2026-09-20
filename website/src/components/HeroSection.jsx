import React, { useState } from 'react';
import { Copy, Check, ArrowRight, Shield, Terminal, Code2, CheckCircle2, Lock, Sparkles } from 'lucide-react';

export default function HeroSection({ setViewMode }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('bash');

  const handleCopy = () => {
    navigator.clipboard.writeText('pip install osivault');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-16 pb-24 px-6 bg-saas-grid border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-8 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold">OSIVault v0.2.2 Live on PyPI</span>
          <span className="text-emerald-300">|</span>
          <span className="text-emerald-700 font-medium">Enterprise Cryptography Suite</span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.12] font-sans">
          Zero-Trust Cryptography.<br />
          <span className="text-emerald-gradient">Tamper-Proof Data Integrity.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-600 font-normal mb-10 leading-relaxed">
          Field-level AES-256-GCM envelope encryption, Merkle-chained tamper-evident audit logs, post-quantum digital signatures, and PostgreSQL database immutability triggers for enterprise Python & Django apps.
        </p>

        {/* Hero Visual: Mac-Style IDE & Terminal Container */}
        <div className="max-w-4xl mx-auto mb-12 text-left">
          <div className="bg-slate-950 rounded-2xl border border-slate-800/90 shadow-2xl overflow-hidden">
            
            {/* Window Header */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/90"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/90"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/90"></span>
                </div>
                
                {/* Visual Tabs */}
                <div className="flex items-center gap-1 ml-3">
                  <button
                    onClick={() => setActiveTab('bash')}
                    className={`px-3 py-1 rounded-md text-[11px] font-mono font-semibold transition flex items-center gap-1.5 ${
                      activeTab === 'bash' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" /> bash ~ install
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-3 py-1 rounded-md text-[11px] font-mono font-semibold transition flex items-center gap-1.5 ${
                      activeTab === 'code' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" /> models.py ~ usage
                  </button>
                </div>
              </div>

              {/* Status Badges */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Postgres Trigger: ACTIVE
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                  Python 3.12+
                </span>
              </div>
            </div>

            {/* Window Content Body */}
            {activeTab === 'bash' ? (
              <div className="p-6 bg-slate-950 font-mono text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold">$</span>
                    <span className="text-slate-400">pip install</span>
                    <span className="text-emerald-300 font-bold text-base">osivault</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    <span>{copied ? 'Copied to Clipboard' : 'Copy Pip Command'}</span>
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400 pt-2">
                  <div className="flex items-center gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>AES-256-GCM Envelope</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Merkle Tamper Chain</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>PostgreSQL Immutability</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto">
                <pre><code>{`from django.db import models
from osivault.fields import EncryptedTextField, SearchHash
from osivault.audit.models import OSIVaultAuditLog

class StudentRecord(OSIVaultAuditLog):
    student_name = models.CharField(max_length=255)
    
    # Encrypted envelope field (AES-256-GCM)
    ssn_number = EncryptedTextField()
    
    # Deterministic HMAC-SHA-256 SearchHash for blind SQL index
    ssn_search_hash = models.CharField(max_length=64, db_index=True)`}</code></pre>
              </div>
            )}

          </div>
        </div>

        {/* Action Call-to-Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#playground"
            className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Interactive Sandbox</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <button
            onClick={() => setViewMode && setViewMode('docs')}
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300/80 text-slate-800 text-xs sm:text-sm font-bold transition shadow-xs flex items-center gap-2"
          >
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Technical Documentation</span>
          </button>
        </div>

      </div>
    </section>
  );
}
