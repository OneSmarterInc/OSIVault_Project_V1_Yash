import React, { useState } from 'react';
import { Lock, Link, FileSignature, Key, Plus, AlertTriangle, ShieldCheck, Play } from 'lucide-react';

export default function InteractivePlayground() {
  const [activeTab, setActiveTab] = useState('encrypt');

  // Encryption Tab state
  const [plaintext, setPlaintext] = useState('Sensitive Record: SSN 987-65-4321 [Student: Yash Tayade]');
  const [ciphertextResult, setCiphertextResult] = useState('');
  const [searchHashResult, setSearchHashResult] = useState('');

  // Audit Tab state
  const [auditChain, setAuditChain] = useState([
    { id: 1, action: "CREATE", actor: "AdminUser", prev: "00000000000000000000000000000000", hash: "a1f9e83c21d45678b90123456789abcdef1234567890abcdef1234567890abcd" },
    { id: 2, action: "UPDATE", actor: "SecurityService", prev: "a1f9e83c21d45678b90123456789abcdef1234567890abcdef1234567890abcd", hash: "b2e8d74c32e56789c01234567890abcdef2345678901abcdef2345678901abc" }
  ]);
  const [isTampered, setIsTampered] = useState(false);

  // Signature Tab state
  const [signPayload, setSignPayload] = useState('{"action": "TRANSFER_FUNDS", "amount": 50000, "currency": "USD", "target": "ACC_88102"}');
  const [signResult, setSignResult] = useState('');

  const handleEncrypt = () => {
    const fakeIv = btoa(Math.random().toString()).substring(0, 16);
    const fakeTag = btoa(Math.random().toString()).substring(0, 16);
    const fakeCipher = btoa(plaintext).substring(0, 32);

    const jsonOutput = {
      algorithm: "AES-256-GCM",
      key_id: "k1_master_key",
      iv_base64: fakeIv,
      tag_base64: fakeTag,
      ciphertext: "enc_v1$" + fakeCipher + "$" + fakeTag,
      dek_status: "FRESH_256BIT_DEK_GENERATED"
    };

    setCiphertextResult(JSON.stringify(jsonOutput, null, 2));

    let hash = 0;
    for (let i = 0; i < plaintext.length; i++) {
      hash = (hash << 5) - hash + plaintext.charCodeAt(i);
      hash |= 0;
    }
    const fullHash = "hash_hmac256_" + Math.abs(hash).toString(16).padStart(8, '0') + "8f90ab12cd34ef567890abcdef1234567890";
    setSearchHashResult(fullHash);
  };

  const handleAddAudit = () => {
    const last = auditChain[auditChain.length - 1];
    const newId = last.id + 1;
    const newHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + "1234567890abcdef1234567890";
    setAuditChain([
      ...auditChain,
      {
        id: newId,
        action: "UPDATE",
        actor: "SystemWorker",
        prev: last.hash,
        hash: newHash
      }
    ]);
  };

  const handleTamper = () => {
    if (auditChain.length > 1) {
      const copy = [...auditChain];
      copy[1].hash = "INVALID_CORRUPTED_HASH_999999999999999999999999999";
      setAuditChain(copy);
      setIsTampered(true);
    }
  };

  const handleSign = () => {
    const signedObj = {
      alg: "OSIVAULT-HMAC-SHA256",
      kid: "sign_key_v1",
      timestamp: new Date().toISOString(),
      payload_hash: "sha256_" + Math.random().toString(36).substring(2, 15),
      signature_envelope: "sig_v1_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + btoa(signPayload).substring(0, 24) + ".X59ab01cd"
    };
    setSignResult(JSON.stringify(signedObj, null, 2));
  };

  return (
    <section id="playground" className="py-24 px-6 relative bg-saas-grid border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider">
            Live Sandbox Environment
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-3">Interactive Crypto Sandbox</h2>
          <p className="text-slate-600 text-base mt-2">
            Simulate OSIVault envelope encryption, HMAC blind indices, Merkle tamper alerts, and self-describing digital signatures in real time.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xl">
          {/* Tab Controls */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200/80 pb-4 mb-8">
            <button
              onClick={() => setActiveTab('encrypt')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'encrypt' ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              <Lock className="w-4 h-4" /> 1. AES-256-GCM Envelope Encryption
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'audit' ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              <Link className="w-4 h-4" /> 2. Merkle Audit Chain & Tamper Sim
            </button>
            <button
              onClick={() => setActiveTab('signature')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'signature' ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              <FileSignature className="w-4 h-4" /> 3. Digital Signature Envelope
            </button>
          </div>

          {/* Tab 1: Encryption */}
          {activeTab === 'encrypt' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Plaintext Input Data</label>
                  <textarea
                    value={plaintext}
                    onChange={(e) => setPlaintext(e.target.value)}
                    rows={5}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-mono text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition shadow-2xs"
                  />
                  <button
                    onClick={handleEncrypt}
                    className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <Key className="w-4 h-4" /> Encrypt Data & Compute SearchHash
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Encrypted Output (Ciphertext Envelope)</label>
                  <div className="w-full h-[170px] bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-y-auto leading-relaxed shadow-inner">
                    {ciphertextResult || '// Click "Encrypt Data" to generate live AES-256-GCM envelope payload...'}
                  </div>
                </div>
              </div>

              {searchHashResult && (
                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-emerald-800 font-mono block font-bold">Deterministic Blind Index (SearchHash):</span>
                    <span className="text-sm font-mono font-bold text-emerald-950">{searchHashResult}</span>
                  </div>
                  <span className="text-[11px] px-3 py-1 bg-white text-emerald-800 rounded-full border border-emerald-300 font-bold shadow-xs">
                    Allows `WHERE ssn_search_hash = '...'` SQL Queries
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Audit */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Live Merkle Audit Log Chain</h4>
                  <p className="text-xs text-slate-600">Each entry stores `previous_hash` forming an unalterable SHA-256 Merkle chain.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleAddAudit}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-4 h-4" /> Append Log Entry
                  </button>
                  <button
                    onClick={handleTamper}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <AlertTriangle className="w-4 h-4" /> Simulate DB Tamper
                  </button>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {auditChain.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <div>
                      <span className="text-emerald-700 font-bold">#{item.id} [{item.action}]</span> by <span className="text-slate-900 font-semibold">{item.actor}</span>
                      <div className="text-[10px] text-slate-500">Prev Hash: <span className="text-slate-600">{item.prev.substring(0, 24)}...</span></div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-teal-700 font-bold block">Entry Hash (Merkle Signed):</span>
                      <span className="text-[10px] text-slate-700 font-mono">{item.hash.substring(0, 24)}...</span>
                    </div>
                  </div>
                ))}
              </div>

              {isTampered ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center justify-between shadow-xs">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    Audit Verification Alert: <strong>TAMPERING DETECTED AT ENTRY #2!</strong>
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-rose-200 text-rose-900 font-bold">Merkle Chain Broken</span>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    Audit Verification Status: <strong>INTACT (100% Valid Merkle Hashes)</strong>
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-white text-emerald-800 border border-emerald-300 font-bold">Zero Tampering</span>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Signatures */}
          {activeTab === 'signature' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Payload to Sign</label>
                  <textarea
                    value={signPayload}
                    onChange={(e) => setSignPayload(e.target.value)}
                    rows={5}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-mono text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition shadow-2xs"
                  />
                  <button
                    onClick={handleSign}
                    className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <FileSignature className="w-4 h-4" /> Sign Payload & Create Envelope
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Signed Envelope Output</label>
                  <div className="w-full h-[170px] bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-teal-300 overflow-y-auto leading-relaxed shadow-inner">
                    {signResult || '// Click "Sign Payload" to view self-describing signature envelope...'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
