import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "Does OSIVault replace Django's standard ORM?",
      a: "No! OSIVault seamlessly extends Django's ORM by providing drop-in field types like EncryptedTextField and EncryptedJSONField, plus model subclassing for tamper-evident audit logs."
    },
    {
      q: "How does SearchHash allow SQL filtering on encrypted fields?",
      a: "SearchHash creates a deterministic HMAC-SHA-256 blind index stored in a separate indexed column. Your queries filter on the blind index hash (`WHERE ssn_search_hash = ...`) without ever exposing or decrypting the raw column data in database indexes."
    },
    {
      q: "Why are PostgreSQL database triggers required for immutability?",
      a: "Django ORM and middleware only run when requests come through your Python application code. If someone opens pgAdmin, DBeaver, or psql directly, a PostgreSQL BEFORE DELETE trigger is the only thing that blocks raw SQL DELETE or UPDATE statements at the database engine level."
    },
    {
      q: "Is OSIVault compatible with key rotation?",
      a: "Yes! OSIVault supports zero-downtime key rotation. You can promote a new key (`k2`) as active while legacy keys (`k1`) remain available for transparent fallback decryption."
    }
  ];

  return (
    <section className="py-24 px-6 bg-white border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold uppercase tracking-wider mb-3">
            Common Questions
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="saas-card rounded-2xl border border-slate-200/90 overflow-hidden transition shadow-2xs"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between font-bold text-slate-900 text-base hover:text-emerald-600 transition"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{faq.q}</span>
                </span>
                <ChevronDown className={`w-5 h-5 transition transform ${openIndex === index ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 font-normal">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
