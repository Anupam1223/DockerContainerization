import React, { useEffect, useState } from 'react';

const IconFileCode = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconFolder = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const IconCloudDownload = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>;
const IconShield = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const IconArchive = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
const IconTerminal = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconZap = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const IconDatabase = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
const IconCheck = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconAlert = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>;
const IconClock = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const panel = 'w-full h-full min-h-0 overflow-auto flex flex-col items-center justify-center p-4 bg-slate-900 relative';

export function VisualCopyAdd({ initial = 'copy' }) {
  const [activeAction, setActiveAction] = useState(initial);

  return (
    <div className={panel}>
      <div className="flex gap-4 mb-8 z-20 shrink-0">
        <button type="button" onClick={() => setActiveAction('copy')} className={`px-6 py-2 rounded text-sm font-bold transition-all shadow-lg ${activeAction === 'copy' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>COPY (Local Files)</button>
        <button type="button" onClick={() => setActiveAction('add')} className={`px-6 py-2 rounded text-sm font-bold transition-all shadow-lg ${activeAction === 'add' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>ADD (URL & Archives)</button>
      </div>

      <div className="w-full max-w-4xl flex justify-between items-center relative z-10">
        <div className="flex flex-col gap-4 w-1/3 relative z-20">
          <div className={`bg-slate-800 border-2 rounded-xl p-4 flex flex-col items-center shadow-lg transition-colors ${activeAction === 'copy' ? 'border-blue-500' : 'border-slate-700'}`}>
            <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest text-center">Local Build Context<br />(Your Laptop)</div>
            <div className={`bg-slate-950 px-2 py-1.5 rounded flex items-center gap-2 text-xs font-mono transition-all w-full ${activeAction === 'copy' ? 'text-blue-400 ring-1 ring-blue-500' : 'text-slate-500'}`}>
              <IconFileCode className="w-4 h-4" /> train.py
            </div>
          </div>

          <div className={`bg-slate-800 border-2 rounded-xl p-4 flex flex-col items-center shadow-lg transition-colors ${activeAction === 'add' ? 'border-purple-500' : 'border-slate-700'}`}>
            <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest text-center">Remote / Compressed</div>
            <div className={`bg-slate-950 px-2 py-1.5 rounded flex items-center gap-2 text-xs font-mono w-full transition-all ${activeAction === 'add' ? 'text-purple-400 ring-1 ring-purple-500' : 'text-slate-500'}`}>
              <IconArchive className="w-4 h-4" /> data.tar.gz
            </div>
            <div className={`mt-2 bg-slate-950 px-2 py-1.5 rounded flex items-center gap-2 text-[10px] font-mono w-full transition-all ${activeAction === 'add' ? 'text-purple-400 ring-1 ring-purple-500' : 'text-slate-500'}`}>
              <IconCloudDownload className="w-3 h-3" /> https://.../weights.h5
            </div>
          </div>
        </div>

        <div className="flex-1 h-64 relative flex items-center justify-center">
          {activeAction === 'copy' && (
            <svg className="absolute w-full h-full inset-0 z-0">
              <path d="M 0,60 L 250,150" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="10,10" className="animate-[dash_1s_linear_infinite]" />
            </svg>
          )}
          {activeAction === 'add' && (
            <>
              <svg className="absolute w-full h-full inset-0 z-0">
                <path d="M 0,220 L 250,150" fill="none" stroke="#a855f7" strokeWidth="4" strokeDasharray="10,10" className="animate-[dash_1s_linear_infinite]" />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-12 bg-purple-900/80 text-purple-200 text-[10px] font-bold px-2 py-1 rounded shadow-lg border border-purple-500 animate-pulse text-center">
                Auto-Extracts Archives<br />Fetches URLs
              </div>
            </>
          )}
        </div>

        <div className="w-1/3 relative z-20">
          <div className="bg-slate-950 border-2 border-emerald-500/50 rounded-xl p-4 flex flex-col h-64 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden">
            <div className="text-xs font-bold text-emerald-400 mb-4 uppercase tracking-widest border-b border-emerald-900/50 pb-2">Docker Image FS</div>
            <div className="flex-1 flex flex-col gap-3 relative">
              <div className={`transition-all duration-500 p-2 rounded border bg-slate-900 flex items-center gap-2 font-mono text-xs ${activeAction === 'copy' ? 'text-blue-300 border-blue-500 ring-1 ring-blue-500/50' : 'text-slate-500 border-slate-700'}`}>
                <IconFileCode className="w-4 h-4" /> /app/train.py
              </div>
              <div className={`transition-all duration-500 p-2 rounded border bg-slate-900 flex flex-col gap-1 font-mono text-xs ${activeAction === 'add' ? 'text-purple-300 border-purple-500 ring-1 ring-purple-500/50' : 'text-slate-500 border-slate-700'}`}>
                <div className="flex items-center gap-2"><IconFolder className="w-4 h-4" /> /app/data/</div>
                <div className="pl-6 text-[10px] opacity-70">├── image1.jpg</div>
                <div className="pl-6 text-[10px] opacity-70">└── image2.jpg</div>
              </div>
              <div className={`transition-all duration-500 p-2 rounded border bg-slate-900 flex items-center gap-2 font-mono text-xs ${activeAction === 'add' ? 'text-purple-300 border-purple-500 ring-1 ring-purple-500/50' : 'text-slate-500 border-slate-700'}`}>
                <IconFileCode className="w-4 h-4" /> /app/weights.h5
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualCopyLocal = () => <VisualCopyAdd initial="copy" />;
export const VisualAddRemote = () => <VisualCopyAdd initial="add" />;

export function VisualDockerIgnore() {
  const [useIgnore, setUseIgnore] = useState(true);

  return (
    <div className={panel}>
      <div className="flex justify-between items-center w-full max-w-4xl mb-8 shrink-0">
        <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Build Context Transfer Simulation</div>
        <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-lg border border-slate-700">
          <span className="text-xs font-bold text-slate-300">.dockerignore</span>
          <button
            type="button"
            onClick={() => setUseIgnore(!useIgnore)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${useIgnore ? 'bg-emerald-500' : 'bg-slate-600'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useIgnore ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="flex w-full max-w-4xl h-64 gap-4 items-center">
        <div className="w-1/3 bg-slate-800 rounded-xl p-4 border border-slate-600 shadow-xl h-full flex flex-col">
          <div className="text-xs font-bold text-white mb-2 border-b border-slate-700 pb-2">Local Directory</div>
          <div className="flex flex-col gap-2 font-mono text-xs mt-2">
            <div className="flex items-center gap-2 text-slate-300"><IconFileCode className="w-4 h-4 text-blue-400" /> train.py</div>
            <div className="flex items-center gap-2 text-slate-300"><IconFileCode className="w-4 h-4 text-blue-400" /> requirements.txt</div>
            <div className={`flex items-center gap-2 ${useIgnore ? 'text-red-400 opacity-50' : 'text-slate-300'}`}><IconFolder className="w-4 h-4" /> .git/ (500MB)</div>
            <div className={`flex items-center gap-2 ${useIgnore ? 'text-red-400 opacity-50' : 'text-slate-300'}`}><IconFolder className="w-4 h-4" /> venv/ (1GB)</div>
            <div className={`flex items-center gap-2 ${useIgnore ? 'text-red-400 opacity-50' : 'text-slate-300'}`}><IconDatabase className="w-4 h-4" /> dataset.csv (10GB)</div>
          </div>
        </div>

        <div className="flex-1 h-full relative flex items-center justify-center">
          <div className={`w-full h-8 rounded-full flex items-center overflow-hidden transition-all duration-1000 ${useIgnore ? 'bg-emerald-900/30 border border-emerald-500/50' : 'bg-red-900/30 border border-red-500/50 scale-y-150'}`}>
            <div className={`h-full opacity-50 animate-[dash_1s_linear_infinite] w-[200%] ${useIgnore ? 'bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#10b981_10px,#10b981_20px)]' : 'bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ef4444_10px,#ef4444_20px)]'}`} />
          </div>

          {useIgnore && (
            <div className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="bg-emerald-500 text-white p-2 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-pulse">
                <IconShield className="w-8 h-8" />
              </div>
              <div className="absolute top-12 bg-black/80 text-emerald-300 text-[10px] px-2 py-1 rounded whitespace-nowrap font-bold">Files Blocked</div>
            </div>
          )}

          <div className="absolute -bottom-8 text-center w-full">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${useIgnore ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400 animate-pulse'}`}>
              Context Sent: {useIgnore ? '15 KB (Instant)' : '11.5 GB (Freezes build!)'}
            </span>
          </div>
        </div>

        <div className="w-1/3 bg-slate-950 rounded-xl p-4 border border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] h-full flex flex-col">
          <div className="text-xs font-bold text-blue-400 mb-2 border-b border-blue-900/50 pb-2">Docker Daemon</div>
          <div className="flex-1 flex items-center justify-center">
            <div className={`text-center transition-all ${useIgnore ? 'text-emerald-400' : 'text-red-400'}`}>
              {useIgnore ? (
                <div className="flex flex-col items-center gap-2">
                  <IconCheck className="w-12 h-12" />
                  <span className="text-sm font-bold">Build Starts Instantly</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <IconAlert className="w-12 h-12 animate-bounce" />
                  <span className="text-sm font-bold">Waiting to upload...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualBuildCache() {
  const [strategy, setStrategy] = useState('bad');
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    if (!trigger) return undefined;
    const id = setTimeout(() => setTrigger(false), 2500);
    return () => clearTimeout(id);
  }, [trigger]);

  const handleSimulate = (strat) => {
    setStrategy(strat);
    setTrigger(true);
  };

  return (
    <div className={panel}>
      <div className="flex justify-between items-center w-full max-w-4xl mb-6 gap-3 shrink-0">
        <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Simulating a Code Change (train.py edited)</div>
        <div className="flex gap-2">
          <button type="button" onClick={() => handleSimulate('bad')} disabled={trigger} className="px-3 py-1.5 bg-red-900/50 border border-red-500 hover:bg-red-800 text-red-200 text-xs font-bold rounded transition-colors disabled:opacity-50">Test Less Optimal Order</button>
          <button type="button" onClick={() => handleSimulate('good')} disabled={trigger} className="px-3 py-1.5 bg-emerald-900/50 border border-emerald-500 hover:bg-emerald-800 text-emerald-200 text-xs font-bold rounded transition-colors disabled:opacity-50 shadow-lg">Test Cache Optimized</button>
        </div>
      </div>

      <div className="w-full max-w-4xl flex flex-col gap-8">
        <div className={`p-4 rounded-xl border-2 transition-all ${strategy === 'bad' && trigger ? 'border-red-500 bg-red-900/10' : 'border-slate-800 bg-slate-950 opacity-40 grayscale'}`}>
          <div className="text-xs font-bold text-red-400 mb-3 uppercase tracking-widest flex items-center justify-between">
            Less Optimal
            {(strategy === 'bad' && trigger) && <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] animate-pulse">Cache Invalidated Early!</span>}
          </div>
          <div className="flex gap-2 w-full h-12">
            <div className="flex-1 bg-slate-800 border border-slate-600 rounded flex items-center justify-center text-[10px] text-slate-400 font-mono">FROM python</div>
            <div className="flex-1 bg-slate-800 border border-slate-600 rounded flex flex-col items-center justify-center text-[10px] text-slate-400 font-mono relative overflow-visible">
              COPY . /app
              {(strategy === 'bad' && trigger) && (
                <>
                  <div className="absolute -top-3 right-0 bg-yellow-500 w-2 h-2 rounded-full shadow-[0_0_10px_rgba(234,179,8,1)]" />
                  <div className="absolute top-full mt-2 w-32 text-center text-[9px] text-red-300 font-sans leading-tight">Code changed here ↓<br />Invalidates cache onwards</div>
                </>
              )}
            </div>
            <div className={`w-[40%] rounded flex flex-col items-center justify-center text-[10px] font-mono border transition-all duration-300 relative ${strategy === 'bad' && trigger ? 'bg-orange-900/50 border-orange-500 text-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
              RUN pip install -r req.txt
              {(strategy === 'bad' && trigger) && (
                <div className="absolute -top-3 bg-orange-500 text-white px-2 py-0.5 rounded-full text-[8px] flex items-center gap-1 font-sans">
                  <IconClock className="w-3 h-3 animate-spin" /> Re-downloading ALL packages...
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl border-2 transition-all ${strategy === 'good' && trigger ? 'border-emerald-500 bg-emerald-900/10 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'border-slate-800 bg-slate-950 opacity-40 grayscale'}`}>
          <div className="text-xs font-bold text-emerald-400 mb-3 uppercase tracking-widest flex items-center justify-between">
            Cache Optimized
            {(strategy === 'good' && trigger) && <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px]">Pip Layer Cached! &nbsp; <IconZap className="w-3 h-3 inline" /></span>}
          </div>
          <div className="flex gap-2 w-full h-12">
            <div className="flex-1 bg-slate-800 border border-slate-600 rounded flex items-center justify-center text-[10px] text-slate-400 font-mono">FROM python</div>
            <div className="flex-1 bg-slate-800 border border-slate-600 rounded flex items-center justify-center text-[10px] text-slate-400 font-mono relative">
              COPY req.txt .
            </div>
            <div className={`w-[35%] rounded flex flex-col items-center justify-center text-[10px] font-mono border transition-all duration-300 relative ${strategy === 'good' && trigger ? 'bg-emerald-900/30 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
              RUN pip install -r req.txt
              {(strategy === 'good' && trigger) && (
                <div className="absolute -top-3 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[8px] flex items-center gap-1 font-sans shadow-lg">
                  <IconCheck className="w-3 h-3" /> Cached (Instant)
                </div>
              )}
            </div>
            <div className={`flex-1 rounded flex flex-col items-center justify-center text-[10px] font-mono border transition-all duration-300 relative ${strategy === 'good' && trigger ? 'bg-blue-900/50 border-blue-400 text-blue-200' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
              COPY . /app
              {(strategy === 'good' && trigger) && (
                <>
                  <div className="absolute -top-3 right-1 bg-yellow-500 w-2 h-2 rounded-full shadow-[0_0_10px_rgba(234,179,8,1)]" />
                  <div className="absolute top-full mt-2 w-32 text-center text-[9px] text-slate-400 font-sans leading-tight">Only this tiny layer<br />rebuilds</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualLargeArtifacts() {
  const [approach, setApproach] = useState('copy');

  return (
    <div className={panel}>
      <div className="flex gap-4 mb-8 z-20 shrink-0">
        <button type="button" onClick={() => setApproach('copy')} className={`px-6 py-2 rounded text-sm font-bold transition-all shadow-lg ${approach === 'copy' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>Approach 1: COPY Artifacts</button>
        <button type="button" onClick={() => setApproach('volume')} className={`px-6 py-2 rounded text-sm font-bold transition-all shadow-lg ${approach === 'volume' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>Approach 2: Volumes (Decouple)</button>
      </div>

      <div className="flex w-full max-w-4xl justify-center items-center min-h-72 gap-16 relative">
        <div className={`transition-all duration-700 flex flex-col items-center relative ${approach === 'copy' ? 'opacity-100 scale-100' : 'opacity-20 scale-75'}`}>
          <div className="bg-red-900/20 border-4 border-red-500 rounded-2xl w-64 h-64 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.3)] relative">
            <div className="absolute -top-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">Image Size: 15.5 GB</div>
            <IconFileCode className="w-8 h-8 text-blue-400 mb-2" />
            <div className="bg-slate-800 px-3 py-1 rounded text-xs text-white mb-4">Code & OS (500MB)</div>
            <IconDatabase className="w-16 h-16 text-red-400 mb-2" />
            <div className="bg-red-950 px-3 py-1 rounded text-xs text-red-200 border border-red-500">model_weights.pt (15GB)</div>
          </div>
          <div className="mt-6 text-center text-xs text-red-300 bg-red-900/30 p-2 rounded max-w-[250px]">
            <strong>Cons:</strong> Inefficient to pull/push. Rebuilding image requires re-uploading the 15GB model to the registry every time!
          </div>
        </div>

        <div className={`transition-all duration-700 flex flex-col items-center relative ${approach === 'volume' ? 'opacity-100 scale-100' : 'opacity-20 scale-75'}`}>
          <div className="flex gap-4 items-center">
            <div className="bg-emerald-900/20 border-4 border-emerald-500 rounded-2xl w-40 h-40 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] relative">
              <div className="absolute -top-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">Image: 500 MB</div>
              <IconFileCode className="w-8 h-8 text-blue-400 mb-2" />
              <div className="bg-slate-800 px-3 py-1 rounded text-xs text-white">Code & OS Only</div>
            </div>
            <div className="text-emerald-400 text-2xl font-bold">+</div>
            <div className="bg-indigo-900/30 border-2 border-indigo-500 border-dashed rounded-xl w-32 h-40 flex flex-col items-center justify-center relative">
              <div className="absolute -top-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold">Runtime Volume</div>
              <IconDatabase className="w-10 h-10 text-indigo-400 mb-2" />
              <div className="text-[10px] text-center text-indigo-200 px-2">External Storage<br />(model_weights.pt)</div>
            </div>
          </div>
          <div className="mt-6 text-center text-xs text-emerald-300 bg-emerald-900/30 p-2 rounded max-w-[300px]">
            <strong>Pros:</strong> Image remains tiny and fast to deploy. The 15GB model is attached externally at runtime (e.g., via AWS S3 or local volume mount).
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualWorkdir() {
  const [useWorkdir, setUseWorkdir] = useState(true);

  return (
    <div className={panel}>
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Execution Context</span>
        <button
          type="button"
          onClick={() => setUseWorkdir(!useWorkdir)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${useWorkdir ? 'bg-indigo-500' : 'bg-slate-600'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useWorkdir ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
        <span className="text-indigo-300 text-sm font-bold font-mono">WORKDIR /app</span>
      </div>

      <div className="flex w-full max-w-3xl gap-8">
        <div className="w-1/2 bg-slate-950 rounded-xl border border-slate-700 p-4 font-mono text-xs flex flex-col shadow-lg">
          <div className="text-slate-500 border-b border-slate-800 pb-2 mb-2 font-bold font-sans">Dockerfile</div>
          <div className="text-slate-400">FROM python:3.9-slim</div>
          <div className={`my-2 py-1 px-2 rounded transition-colors ${useWorkdir ? 'bg-indigo-900/50 text-indigo-300 border-l-2 border-indigo-500' : 'text-slate-600 opacity-50 line-through'}`}>
            WORKDIR /app
          </div>
          <div className="text-blue-300 mt-2">COPY src/ ./src/</div>
          <div className="text-blue-300">COPY requirements.txt .</div>
          <div className={`mt-4 ${useWorkdir ? 'text-emerald-400' : 'text-red-400 line-through'}`}>CMD ["python", "src/train.py"]</div>
          {!useWorkdir && <div className="text-emerald-400 mt-1">CMD ["python", "/app/src/train.py"] <span className="text-slate-500 italic text-[10px]"># Forced absolute path</span></div>}
        </div>

        <div className="w-1/2 bg-slate-900 border-2 border-slate-700 rounded-xl p-4 flex flex-col relative shadow-xl overflow-hidden">
          <div className="text-slate-400 font-bold text-xs uppercase tracking-widest border-b border-slate-700 pb-2 mb-4 flex items-center justify-between">
            Container Filesystem
            {!useWorkdir && <span className="bg-red-900/50 text-red-400 text-[10px] px-2 py-0.5 rounded border border-red-500/50">Messy Root Dir!</span>}
          </div>
          <div className="font-mono text-sm text-slate-300 flex flex-col relative h-48">
            <div className="flex items-center gap-2 mb-1"><IconFolder className="w-4 h-4 text-slate-500" /> / (Root)</div>
            <div className={`absolute left-0 top-8 flex flex-col transition-all duration-500 w-full ${useWorkdir ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
              <div className="flex items-center gap-2 pl-4 text-indigo-300 bg-indigo-900/20 py-1 rounded border border-indigo-500/30 w-fit mb-1"><IconFolder className="w-4 h-4" /> app/</div>
              <div className="flex items-center gap-2 pl-12 text-blue-300"><IconFolder className="w-3 h-3" /> src/</div>
              <div className="flex items-center gap-2 pl-20 text-emerald-300"><IconFileCode className="w-3 h-3" /> train.py</div>
              <div className="flex items-center gap-2 pl-12 text-blue-300"><IconFileCode className="w-3 h-3" /> requirements.txt</div>
            </div>
            <div className={`absolute left-0 top-8 flex flex-col transition-all duration-500 w-full ${!useWorkdir ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
              <div className="flex items-center gap-2 pl-4 text-red-300"><IconFileCode className="w-3 h-3" /> ... (OS Files)</div>
              <div className="flex items-center gap-2 pl-4 text-blue-300 mt-2 bg-red-900/10 py-0.5 rounded border border-red-500/20 w-fit"><IconFolder className="w-3 h-3" /> src/</div>
              <div className="flex items-center gap-2 pl-12 text-emerald-300 bg-red-900/10 py-0.5 rounded border border-red-500/20 w-fit"><IconFileCode className="w-3 h-3" /> train.py</div>
              <div className="flex items-center gap-2 pl-4 text-blue-300 bg-red-900/10 py-0.5 rounded border border-red-500/20 w-fit"><IconFileCode className="w-3 h-3" /> requirements.txt</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualExecVsShell({ initialTab = 'exec_shell' }) {
  const [tab, setTab] = useState(initialTab);
  const [userArgs, setUserArgs] = useState('');

  return (
    <div className="w-full h-full min-h-0 overflow-auto flex flex-col p-4 bg-slate-900 relative">
      <div className="flex gap-4 mb-6 border-b border-slate-700 pb-4 shrink-0">
        <button type="button" onClick={() => { setTab('exec_shell'); setUserArgs(''); }} className={`px-4 py-2 rounded text-xs font-bold transition-all ${tab === 'exec_shell' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Exec vs Shell Form</button>
        <button type="button" onClick={() => { setTab('combine'); setUserArgs(''); }} className={`px-4 py-2 rounded text-xs font-bold transition-all ${tab === 'combine' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Combining CMD + ENTRYPOINT</button>
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto min-h-0">
        {tab === 'exec_shell' && (
          <div className="flex gap-8 h-full items-center justify-center animate-[fadeIn_0.5s_ease-out]">
            <div className="w-1/2 bg-slate-950 border-2 border-emerald-500/50 rounded-xl p-6 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <div className="text-emerald-400 font-bold mb-2">Exec Form (Recommended)</div>
              <div className="bg-slate-800 p-2 rounded font-mono text-[10px] text-white border border-emerald-500/30 mb-6">
                ENTRYPOINT ["python", "script.py"]
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-slate-800 border border-slate-600 px-4 py-2 rounded text-xs text-white mb-2">Docker Container</div>
                <IconFolder className="w-4 h-4 text-slate-500 mb-1" />
                <div className="bg-emerald-900 text-emerald-200 border border-emerald-500 px-6 py-2 rounded text-xs font-bold shadow-lg">
                  PID 1: python script.py
                </div>
              </div>
              <div className="mt-6 text-[10px] text-slate-400 text-center">Process receives kill signals directly (graceful shutdown).</div>
            </div>

            <div className="w-1/2 bg-slate-950 border-2 border-orange-500/50 rounded-xl p-6 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
              <div className="text-orange-400 font-bold mb-2">Shell Form</div>
              <div className="bg-slate-800 p-2 rounded font-mono text-[10px] text-white border border-orange-500/30 mb-6">
                ENTRYPOINT python script.py
              </div>
              <div className="flex flex-col items-center relative">
                <div className="bg-slate-800 border border-slate-600 px-4 py-2 rounded text-xs text-white mb-2">Docker Container</div>
                <IconFolder className="w-4 h-4 text-slate-500 mb-1" />
                <div className="bg-orange-900 text-orange-200 border border-orange-500 px-6 py-2 rounded text-xs font-bold shadow-lg w-48 text-center relative z-10">
                  PID 1: /bin/sh -c
                </div>
                <div className="w-0.5 h-6 bg-slate-600 -mt-1 -mb-1 z-0" />
                <div className="bg-slate-700 text-slate-300 border border-slate-500 px-6 py-2 rounded text-xs w-40 text-center relative z-10">
                  PID 2: python script.py
                </div>
              </div>
              <div className="mt-6 text-[10px] text-orange-300 text-center bg-orange-900/20 p-1.5 rounded">Signals hit the shell, python process gets orphaned.</div>
            </div>
          </div>
        )}

        {tab === 'combine' && (
          <div className="flex flex-col gap-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="bg-slate-950 border border-indigo-500/50 p-4 rounded-xl flex gap-4">
              <div className="w-1/2">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Dockerfile Definition</div>
                <div className="font-mono text-sm bg-slate-900 p-3 rounded border border-slate-800 text-indigo-300">
                  ENTRYPOINT ["python", "train.py"]<br />
                  CMD ["--epochs", "10"]
                </div>
              </div>
              <div className="w-1/2 flex items-center text-xs text-indigo-200">
                ENTRYPOINT locks the main executable. CMD provides default arguments that users can easily override.
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-700 p-4 rounded-xl flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Runtime Terminal (docker run)
              </div>
              <div className="flex items-center font-mono text-sm bg-black border border-slate-800 rounded p-1 pl-3 focus-within:border-emerald-500/50 transition-colors">
                <span className="text-slate-400 mr-2 shrink-0">$ docker run my_img</span>
                <input
                  type="text"
                  value={userArgs}
                  onChange={(e) => setUserArgs(e.target.value)}
                  placeholder="[type args here, e.g., --batch_size 32]"
                  className="bg-transparent text-emerald-400 outline-none w-full placeholder:text-slate-700 placeholder:italic"
                />
              </div>
              <div className="mt-6 border-t border-slate-800 pt-4 flex flex-col">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <IconTerminal className="w-3 h-3" /> Effective Command Executed Inside Container
                </div>
                <div className="font-mono text-lg p-3 bg-slate-900 rounded border border-slate-700 flex items-center shadow-inner min-h-[56px] flex-wrap">
                  <span className="text-slate-500 mr-3">&gt;</span>
                  <span className="text-indigo-400 mr-2">python train.py</span>
                  {userArgs.trim() === '' ? (
                    <span className="text-blue-400 bg-blue-900/20 px-1 rounded">--epochs 10</span>
                  ) : (
                    <>
                      <span className="text-emerald-400 bg-emerald-900/20 px-1 rounded">{userArgs}</span>
                      <span className="text-slate-600 text-[10px] ml-2 mt-1 line-through border border-slate-700 px-1 rounded">--epochs 10</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const VisualExecShellForms = () => <VisualExecVsShell initialTab="exec_shell" />;
export const VisualCombineEntryCmd = () => <VisualExecVsShell initialTab="combine" />;

export function VisualHandsOnSklearn({ initialStep = 0 }) {
  const [step, setStep] = useState(initialStep);

  const steps = [
    { title: 'Define Dependencies' },
    { title: 'Write Dockerfile' },
    { title: 'Build Image' },
    { title: 'Verify Environment' },
  ];

  return (
    <div className="w-full h-full min-h-0 overflow-hidden flex flex-col p-4 bg-slate-900 relative">
      <div className="flex gap-2 w-full max-w-4xl mx-auto mb-6 relative z-20 shrink-0">
        {steps.map((s, idx) => (
          <button
            type="button"
            key={s.title}
            onClick={() => setStep(idx)}
            className={`flex-1 h-12 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider rounded transition-all border ${step === idx ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : step > idx ? 'bg-slate-800 border-emerald-500/50 text-emerald-400' : 'bg-slate-950 border-slate-700 text-slate-600'}`}
          >
            {step > idx ? <IconCheck className="w-4 h-4 mr-1" /> : null}
            {s.title}
          </button>
        ))}
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto relative min-h-0">
        <div className={`absolute inset-0 transition-all duration-500 flex flex-col ${step === 0 ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
          <div className="bg-slate-950 border border-slate-700 rounded-xl flex-1 flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 text-xs text-slate-400 font-mono flex items-center gap-2">
              <IconFileCode className="w-4 h-4 text-blue-400" /> requirements.txt
            </div>
            <div className="p-6 font-mono text-sm text-slate-300 flex flex-col gap-1">
              <span className="text-slate-500"># requirements.txt</span>
              <span className="text-emerald-400">scikit-learn==1.2.2</span>
              <span className="text-emerald-400">pandas==1.5.3</span>
            </div>
          </div>
        </div>

        <div className={`absolute inset-0 transition-all duration-500 flex flex-col ${step === 1 ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
          <div className="bg-slate-950 border border-slate-700 rounded-xl flex-1 flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 text-xs text-slate-400 font-mono flex items-center gap-2">
              <IconFileCode className="w-4 h-4 text-purple-400" /> Dockerfile
            </div>
            <div className="p-4 font-mono text-xs md:text-sm text-slate-300 flex flex-col gap-1 overflow-y-auto">
              <span className="text-slate-500"># 1. Choose base image</span>
              <span className="text-pink-400">FROM <span className="text-slate-300">python:3.9-slim</span></span>
              <br />
              <span className="text-slate-500"># 2. Set working directory</span>
              <span className="text-pink-400">WORKDIR <span className="text-slate-300">/app</span></span>
              <br />
              <span className="text-slate-500"># 3. Copy reqs FIRST for cache optimization</span>
              <span className="text-pink-400">COPY <span className="text-slate-300">requirements.txt .</span></span>
              <br />
              <span className="text-slate-500"># 4. Install dependencies (no cache)</span>
              <span className="text-pink-400">RUN <span className="text-slate-300">pip install --no-cache-dir -r requirements.txt</span></span>
              <br />
              <span className="text-slate-500"># 5. Set default command</span>
              <span className="text-pink-400">CMD <span className="text-slate-300">["python"]</span></span>
            </div>
          </div>
        </div>

        <div className={`absolute inset-0 transition-all duration-500 flex flex-col ${step === 2 ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
          <div className="bg-[#0c0c0c] border border-slate-700 rounded-xl flex-1 flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-900 text-[10px] text-slate-400 font-mono">
              Terminal
            </div>
            <div className="p-4 font-mono text-[10px] md:text-xs text-slate-300 flex flex-col gap-2 overflow-y-auto">
              <div className="flex"><span className="text-emerald-400 mr-2">$</span> docker build -t sklearn-env:1.0 .</div>
              <div className="text-slate-500">Sending build context to Docker daemon  2.048kB</div>
              <div className="text-slate-400">Step 1/5 : FROM python:3.9-slim</div>
              <div className="text-slate-500"> ---&gt; a1b2c3d4e5f6</div>
              <div className="text-slate-400">Step 2/5 : WORKDIR /app</div>
              <div className="text-slate-500"> ---&gt; Running in b2c3d4e5f6a7</div>
              <div className="text-slate-400">Step 3/5 : COPY requirements.txt .</div>
              <div className="text-slate-400">Step 4/5 : RUN pip install --no-cache-dir -r requirements.txt</div>
              <div className="text-blue-300 pl-4">Downloading scikit-learn-1.2.2...</div>
              <div className="text-blue-300 pl-4">Downloading pandas-1.5.3...</div>
              <div className="text-slate-400">Step 5/5 : CMD ["python"]</div>
              <div className="text-emerald-400 font-bold mt-2">Successfully built 9f8e7d6c5b4a</div>
              <div className="text-emerald-400 font-bold">Successfully tagged sklearn-env:1.0</div>
            </div>
          </div>
        </div>

        <div className={`absolute inset-0 transition-all duration-500 flex flex-col ${step === 3 ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
          <div className="bg-[#0c0c0c] border border-slate-700 rounded-xl flex-1 flex flex-col overflow-hidden shadow-2xl relative">
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-900 text-[10px] text-slate-400 font-mono">
              Terminal
            </div>
            <div className="p-4 font-mono text-[10px] md:text-xs text-slate-300 flex flex-col gap-2">
              <div className="flex break-all leading-relaxed">
                <span className="text-emerald-400 mr-2 shrink-0">$</span>
                {VERIFY_CMD}
              </div>
              <div className="mt-6 border-l-4 border-emerald-500 pl-4 py-2 bg-emerald-900/10 flex flex-col gap-1 text-sm text-white font-bold">
                <div>Scikit-learn version: 1.2.2</div>
                <div>Pandas version: 1.5.3</div>
              </div>
              <div className="absolute bottom-6 right-6 flex items-center gap-2 text-emerald-400 text-xs font-sans font-bold bg-emerald-900/40 px-3 py-1.5 rounded-full border border-emerald-500/50 animate-[bounce_2s_ease-in-out_infinite]">
                <IconCheck className="w-4 h-4" /> Reproducible Environment Verified
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const VERIFY_CMD = "docker run --rm -it sklearn-env:1.0 python -c \"import sklearn; import pandas; print(f'Scikit-learn version: {sklearn.__version__}'); print(f'Pandas version: {pandas.__version__}')\"";

export const VisualSklearnDeps = () => <VisualHandsOnSklearn initialStep={0} />;
export const VisualSklearnFile = () => <VisualHandsOnSklearn initialStep={1} />;
export const VisualSklearnImage = () => <VisualHandsOnSklearn initialStep={2} />;
export const VisualSklearnCheck = () => <VisualHandsOnSklearn initialStep={3} />;
