import React from 'react';
import { Award, ArrowUpRight, Shield } from 'lucide-react';

export default function EnterpriseCalculator() {
  return (
    <section id="enterprise" className="py-24 px-6 relative bg-saas-grid border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold uppercase tracking-wider mb-3">
            Open Source Enterprise Security
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Open Source Core, Enterprise Power</h2>
          <p className="text-slate-600 text-base mt-3">Released under the MIT License for community and commercial use by One Smarter Inc.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <Award className="w-4 h-4 text-emerald-600" /> MIT License (100% Commercial Friendly)
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Ready to Secure Your Backend?</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Install <code className="text-emerald-800 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">osivault</code> directly from PyPI today and bring bank-grade cryptography and PostgreSQL immutability to your Django applications.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="https://pypi.org/project/osivault/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition flex items-center gap-2 active:scale-95"
              >
                <span>View PyPI Package (v0.2.2)</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="https://pypi.org/project/osivault/#files"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 transition flex items-center gap-2 shadow-2xs"
              >
                <Shield className="w-4 h-4 text-emerald-600" /> Download Distribution Wheels
              </a>
            </div>
          </div>

          <div className="w-full md:w-80 bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center space-y-4 shadow-2xs">
            <div className="text-xs uppercase tracking-widest text-emerald-800 font-mono font-bold">Latest Release</div>
            <div className="text-4xl font-extrabold text-emerald-600 font-mono">v0.2.2</div>
            <div className="text-xs text-slate-600 font-medium">Published on PyPI with verified working homepage links.</div>
            <div className="pt-3 border-t border-slate-200 text-[11px] text-emerald-700 font-mono font-bold">
              ✓ 100% Clean Verified Build
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
