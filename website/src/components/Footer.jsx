import React from 'react';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-slate-200/80 bg-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
            <Shield className="w-4 h-4 fill-white text-white" />
          </div>
          <span className="text-white font-bold text-sm">OSIVault Core</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400 font-medium">Designed & Maintained by <strong className="text-slate-200">One Smarter Inc. Engineering</strong></span>
        </div>

        <div className="flex items-center gap-6 font-medium text-slate-300">
          <a href="https://pypi.org/project/osivault/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition">PyPI Package v0.2.2</a>
          <a href="https://pypi.org/project/osivault/#description" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition">PyPI Documentation</a>
          <a href="https://pypi.org/project/osivault/#files" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition">Release Distribution</a>
        </div>
      </div>
    </footer>
  );
}
