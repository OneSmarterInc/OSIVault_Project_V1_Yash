import React from 'react';
import { Zap, Activity, RefreshCw } from 'lucide-react';

export default function BenchmarksSection() {
  return (
    <section id="benchmarks" className="py-24 px-6 bg-white border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold uppercase tracking-wider mb-3">
            Performance & Scalability
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Engineered for Microsecond Speed</h2>
          <p className="text-slate-600 text-base mt-3">High-throughput cryptographic operations with negligible runtime latency.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="saas-card rounded-3xl p-8 text-center border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
              <Zap className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-4xl font-extrabold text-slate-900 font-mono mb-2">0.78 ms</div>
            <div className="text-sm font-bold text-emerald-700 mb-2 font-mono">Envelope Encryption Latency</div>
            <p className="text-xs text-slate-600 leading-relaxed">Performs AES-256-GCM envelope encryption with fresh DEK generation in sub-millisecond speeds.</p>
          </div>

          <div className="saas-card rounded-3xl p-8 text-center border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-4xl font-extrabold text-slate-900 font-mono mb-2">12,500/s</div>
            <div className="text-sm font-bold text-emerald-700 mb-2 font-mono">Merkle Hash Appends</div>
            <p className="text-xs text-slate-600 leading-relaxed">High-throughput SHA-256 Merkle chain linkages per second on single core CPU harness.</p>
          </div>

          <div className="saas-card rounded-3xl p-8 text-center border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
              <RefreshCw className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-4xl font-extrabold text-slate-900 font-mono mb-2">0 Downtime</div>
            <div className="text-sm font-bold text-emerald-700 mb-2 font-mono">Key Rotation Execution</div>
            <p className="text-xs text-slate-600 leading-relaxed">Seamless master key rotation (`k1` -&gt; `k2`) with automatic transparent fallback decryption for legacy keys.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
