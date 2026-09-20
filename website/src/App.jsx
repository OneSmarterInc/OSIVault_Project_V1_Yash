import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MetricsBanner from './components/MetricsBanner';
import PillarsGrid from './components/PillarsGrid';
import InteractivePlayground from './components/InteractivePlayground';
import ImmutabilityDeepDive from './components/ImmutabilityDeepDive';
import IntegrationCodeShowcase from './components/IntegrationCodeShowcase';
import DocsReader from './components/DocsReader';
import BenchmarksSection from './components/BenchmarksSection';
import EnterpriseCalculator from './components/EnterpriseCalculator';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';

export default function App() {
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'docs'

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Sleek Top Banner */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800/80 relative z-50 flex items-center justify-center gap-2 font-mono">
        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide">
          v0.2.2 Live
        </span>
        <span className="hidden sm:inline">🚀 OSIVault v0.2.2 published on PyPI — Production Envelope Cryptography & PostgreSQL Immutability</span>
        <span className="sm:hidden">🚀 OSIVault v0.2.2 published on PyPI!</span>
        <a 
          href="https://pypi.org/project/osivault/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-2 ml-1"
        >
          PyPI Release ↗
        </a>
      </div>

      <Navbar viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode === 'docs' ? (
        <DocsReader />
      ) : (
        <main className="relative">
          <HeroSection setViewMode={setViewMode} />
          <MetricsBanner />
          <PillarsGrid />
          <InteractivePlayground />
          <ImmutabilityDeepDive />
          <IntegrationCodeShowcase />
          <DocsReader />
          <BenchmarksSection />
          <EnterpriseCalculator />
          <FAQSection />
        </main>
      )}

      <Footer />
    </div>
  );
}
