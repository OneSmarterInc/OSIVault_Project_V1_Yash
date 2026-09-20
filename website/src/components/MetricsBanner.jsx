import React from 'react';
import { ShieldCheck, Zap, Database, Lock } from 'lucide-react';

export default function MetricsBanner() {
  const metrics = [
    { 
      value: 'AES-256-GCM', 
      label: 'Envelope Encryption',
      subtext: 'Fresh DEKs per record',
      icon: <Lock className="w-4 h-4 text-emerald-600" />
    },
    { 
      value: '< 0.8 ms', 
      label: 'Cryptographic Overhead',
      subtext: 'High throughput pipeline',
      icon: <Zap className="w-4 h-4 text-emerald-600" />
    },
    { 
      value: '100%', 
      label: 'Merkle Tamper Proof',
      subtext: 'Linked SHA-256 hashes',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />
    },
    { 
      value: 'DB Trigger', 
      label: 'SQL Engine Immutability',
      subtext: 'Blocks raw pgAdmin deletes',
      icon: <Database className="w-4 h-4 text-emerald-600" />
    },
  ];

  return (
    <section className="py-10 px-6 bg-white border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((item, index) => (
            <div
              key={index}
              className="saas-card rounded-2xl p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-500">
                  {item.label}
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  {item.icon}
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tracking-tight mb-1">
                  {item.value}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {item.subtext}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
