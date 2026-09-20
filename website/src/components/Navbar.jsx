import React from 'react';
import { Shield, ArrowUpRight, BookOpen, Terminal, Sparkles } from 'lucide-react';

export default function Navbar({ viewMode, setViewMode }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setViewMode && setViewMode('landing')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20 group-hover:scale-105 transition">
            <Shield className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 font-sans">
                OSI<span className="text-emerald-600">Vault</span>
              </span>
              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded border border-emerald-300">
                PROD
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase font-medium">Core v0.2.2</span>
            </div>
          </div>
        </div>

        {/* Clean Pill Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-100/80 border border-slate-200/80 text-xs font-semibold text-slate-600">
          <button 
            onClick={() => setViewMode && setViewMode('landing')} 
            className={`px-4 py-1.5 rounded-full transition ${viewMode === 'landing' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'hover:text-slate-900'}`}
          >
            Overview
          </button>
          <a 
            href="#features" 
            onClick={() => setViewMode && setViewMode('landing')} 
            className="px-3.5 py-1.5 rounded-full hover:text-slate-900 transition"
          >
            6 Pillars
          </a>
          <a 
            href="#playground" 
            onClick={() => setViewMode && setViewMode('landing')} 
            className="px-3.5 py-1.5 rounded-full hover:text-slate-900 transition"
          >
            Sandbox
          </a>
          <a 
            href="#immutability" 
            onClick={() => setViewMode && setViewMode('landing')} 
            className="px-3.5 py-1.5 rounded-full hover:text-slate-900 transition"
          >
            DB Immutability
          </a>
          <a 
            href="#code" 
            onClick={() => setViewMode && setViewMode('landing')} 
            className="px-3.5 py-1.5 rounded-full hover:text-slate-900 transition"
          >
            Code Guide
          </a>
          <button 
            onClick={() => setViewMode && setViewMode('docs')} 
            className={`px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 ${viewMode === 'docs' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'hover:text-slate-900'}`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Technical Docs
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode && setViewMode(viewMode === 'docs' ? 'landing' : 'docs')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>{viewMode === 'docs' ? 'Overview' : 'Docs Portal'}</span>
          </button>
          <a
            href="https://pypi.org/project/osivault/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow-sm shadow-emerald-600/20 active:scale-95"
          >
            <span>PyPI v0.2.2</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-100" />
          </a>
        </div>

      </div>
    </header>
  );
}
