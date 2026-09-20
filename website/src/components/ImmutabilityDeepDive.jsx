import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ImmutabilityDeepDive() {
  return (
    <section id="immutability" className="py-24 px-6 bg-white border-b border-slate-200/80 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold uppercase tracking-wider mb-3">
            PostgreSQL Engine Protection
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Why Database Triggers Matter</h2>
          <p className="text-slate-600 text-base mt-3">
            Application-level rules only protect against API requests. OSIVault PostgreSQL Triggers block direct raw SQL deletions inside tools like pgAdmin and DBeaver.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Without Triggers */}
          <div className="saas-card rounded-3xl p-8 border-amber-200 bg-amber-50/30 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-bold mb-6 border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Layer 1: Application Level Only
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Without Database Triggers</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
                If an attacker or developer connects directly via <strong>pgAdmin</strong>, <strong>DBeaver</strong>, or <strong>psql</strong>, they can run raw SQL statements (`DELETE FROM audit_log`) and wipe audit records because Python middleware is completely bypassed!
              </p>
            </div>
            <div className="bg-slate-950 rounded-2xl p-4 font-mono text-xs border border-slate-800 text-rose-400 shadow-inner">
              <span className="text-slate-500">-- Direct pgAdmin SQL Execution:</span><br />
              DELETE FROM audit_trail_collegeauditlog;<br />
              <span className="text-amber-400 font-bold">--&gt; DELETE 1500 (Vulnerable: Data Destroyed!)</span>
            </div>
          </div>

          {/* Card 2: With OSIVault Triggers */}
          <div className="saas-card rounded-3xl p-8 border-emerald-300/80 bg-emerald-50/30 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-6 border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> Layer 2: Native PostgreSQL Immutability
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">With OSIVault Database Triggers</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
                OSIVault installs a native PostgreSQL <code className="text-emerald-800 font-mono font-bold bg-emerald-100/80 px-1.5 py-0.5 rounded border border-emerald-300">BEFORE UPDATE OR DELETE</code> trigger directly on the database table. Even direct pgAdmin SQL queries fail immediately at the database engine level!
              </p>
            </div>
            <div className="bg-slate-950 rounded-2xl p-4 font-mono text-xs border border-emerald-900/60 text-emerald-400 shadow-inner">
              <span className="text-slate-500">-- Direct pgAdmin SQL Execution:</span><br />
              DELETE FROM audit_trail_collegeauditlog WHERE id = 1;<br />
              <span className="text-rose-400 font-bold">ERROR: OSIVault audit entries are immutable!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
