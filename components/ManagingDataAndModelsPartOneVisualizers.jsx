import React, { useEffect, useRef, useState } from 'react';

const IconServer = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>;
const IconCheck = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconDatabase = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
const IconTerminal = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconTrash = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconBox = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const IconRefresh = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
const IconLaptop = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 14h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2zm-4 4h24v2H0v-2z" /></svg>;

function useTimers() {
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const after = (ms, fn) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };
  return { after, clear };
}

export function VisualEphemeral() {
  const [status, setStatus] = useState('idle');
  const { after, clear } = useTimers();

  const runSimulation = () => {
    clear();
    setStatus('training');
    after(2000, () => setStatus('done'));
  };

  const removeContainer = () => {
    clear();
    setStatus('removed');
    after(2000, () => setStatus('idle'));
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col items-center justify-center p-4 bg-slate-900 relative overflow-auto">
      <div className="flex gap-4 mb-8 pr-36">
        <button type="button" onClick={runSimulation} disabled={status !== 'idle'} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded font-bold text-sm shadow-lg transition-all">1. Start ML Training</button>
        <button type="button" onClick={removeContainer} disabled={status !== 'done'} className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded font-bold text-sm shadow-lg transition-all flex items-center gap-2"><IconTrash className="w-4 h-4" /> 2. docker rm</button>
      </div>

      <div className="relative w-64 h-64 flex flex-col items-center justify-end pb-4 border-b-4 border-slate-700">
        <div className={`w-48 h-12 bg-slate-800 rounded-b-lg border-2 border-slate-600 flex items-center justify-center text-slate-400 font-bold text-xs shadow-inner absolute bottom-0 transition-opacity duration-500 ${status === 'removed' ? 'opacity-0 translate-y-10' : 'opacity-100'}`}>
          Read-Only Image Layers
        </div>
        <div className={`w-48 h-32 bg-blue-900/30 border-2 border-blue-500 border-dashed rounded-t-lg absolute bottom-12 flex flex-col items-center justify-start pt-4 transition-all duration-500 ${status === 'removed' ? 'opacity-0 scale-90 translate-y-10' : 'opacity-100'}`}>
          <div className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-2">Writable Layer</div>
          {status === 'training' && (
            <div className="w-8 h-8 rounded-full border-2 border-t-blue-400 border-r-blue-400 border-b-transparent border-l-transparent animate-spin" />
          )}
          {status === 'done' && (
            <div className="flex flex-col items-center animate-[bounce_0.5s_ease-out]">
              <IconDatabase className="w-8 h-8 text-emerald-400" />
              <span className="text-emerald-400 text-[10px] font-mono mt-1">model.pt (2GB)</span>
            </div>
          )}
        </div>
        {status === 'removed' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-red-400 animate-[fadeIn_0.5s_ease-out]">
            <IconTrash className="w-12 h-12 mb-2 animate-bounce" />
            <span className="text-xs font-bold text-center">Container Removed.<br />Data is LOST!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function VisualStorageDiagram() {
  const [activeMount, setActiveMount] = useState('none');

  return (
    <div className="w-full h-full min-h-0 flex flex-col items-center justify-center p-4 bg-slate-900 relative overflow-auto">
      <div className="flex gap-4 mb-8">
        <button type="button" onMouseEnter={() => setActiveMount('bind')} onMouseLeave={() => setActiveMount('none')} onClick={() => setActiveMount('bind')} className={`px-4 py-2 rounded text-sm font-bold transition-all border ${activeMount === 'bind' ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>Bind Mount (Dev)</button>
        <button type="button" onMouseEnter={() => setActiveMount('volume')} onMouseLeave={() => setActiveMount('none')} onClick={() => setActiveMount('volume')} className={`px-4 py-2 rounded text-sm font-bold transition-all border ${activeMount === 'volume' ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>Docker Volume (Prod)</button>
      </div>

      <div className="w-full max-w-3xl relative h-72 bg-slate-950 border border-slate-700 rounded-xl p-8 flex flex-col justify-between overflow-hidden">
        <div className="w-full flex justify-end">
          <div className="w-64 h-20 bg-red-900/20 border-2 border-red-500/50 border-dashed rounded-lg flex flex-col items-center justify-center relative">
            <span className="text-red-300 font-bold text-sm">Container Writable Layer</span>
            <span className="text-red-400/70 text-[10px] uppercase">(Ephemeral - Lost on Removal)</span>
            <div className={`absolute -bottom-4 -left-12 w-24 h-8 rounded border-2 flex items-center justify-center text-[10px] font-mono transition-all ${activeMount === 'bind' ? 'bg-blue-900 text-blue-300 border-blue-400 shadow-lg scale-110' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
              /app/src
            </div>
            <div className={`absolute -bottom-4 right-12 w-24 h-8 rounded border-2 flex items-center justify-center text-[10px] font-mono transition-all ${activeMount === 'volume' ? 'bg-emerald-900 text-emerald-300 border-emerald-400 shadow-lg scale-110' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
              /app/data
            </div>
          </div>
        </div>

        <div className="w-full flex justify-between items-end relative z-10">
          <div className={`w-48 h-20 rounded-lg flex flex-col items-center justify-center border-2 transition-all ${activeMount === 'bind' ? 'bg-blue-900/40 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)] scale-105' : 'bg-blue-900/10 border-blue-500/30'}`}>
            <span className={`font-bold text-xs ${activeMount === 'bind' ? 'text-blue-300' : 'text-slate-500'}`}>Host Directory</span>
            <span className={`text-[10px] font-mono ${activeMount === 'bind' ? 'text-blue-400' : 'text-slate-600'}`}>(/Users/me/project)</span>
          </div>
          <div className={`w-56 h-20 rounded-lg flex flex-col items-center justify-center border-2 transition-all ${activeMount === 'volume' ? 'bg-emerald-900/40 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-105' : 'bg-emerald-900/10 border-emerald-500/30'}`}>
            <span className={`font-bold text-xs ${activeMount === 'volume' ? 'text-emerald-300' : 'text-slate-500'}`}>Docker Managed Area</span>
            <span className={`text-[10px] font-mono ${activeMount === 'volume' ? 'text-emerald-400' : 'text-slate-600'}`}>(/var/lib/docker/volumes)</span>
          </div>
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" /></marker>
            <marker id="arrowhead-emerald" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#10b981" /></marker>
          </defs>
          <path d="M 160,200 L 460,95" fill="none" stroke={activeMount === 'bind' ? '#3b82f6' : '#334155'} strokeWidth={activeMount === 'bind' ? '3' : '1'} strokeDasharray={activeMount === 'bind' ? '10 10' : undefined} markerEnd={activeMount === 'bind' ? 'url(#arrowhead-blue)' : undefined} className={activeMount === 'bind' ? 'animate-[dash_1s_linear_infinite]' : ''} />
          {activeMount === 'bind' && <text x="250" y="140" fill="#93c5fd" fontSize="10" fontWeight="bold">Direct Link (-v)</text>}
          <path d="M 580,200 L 610,95" fill="none" stroke={activeMount === 'volume' ? '#10b981' : '#334155'} strokeWidth={activeMount === 'volume' ? '3' : '1'} strokeDasharray={activeMount === 'volume' ? '10 10' : undefined} markerEnd={activeMount === 'volume' ? 'url(#arrowhead-emerald)' : undefined} className={activeMount === 'volume' ? 'animate-[dash_1s_linear_infinite]' : ''} />
          {activeMount === 'volume' && <text x="610" y="160" fill="#6ee7b7" fontSize="10" fontWeight="bold">Managed Link</text>}
        </svg>
      </div>
    </div>
  );
}

function MapFolder({ x, y, label, file, on, w = 128 }) {
  const nx = Number(x);
  const ny = Number(y);
  const nw = Number(w);
  return (
    <g>
      <path d={`M ${nx} ${ny + 10} h 26 v -10 h 10 l 8 10`} fill={on ? '#38bdf8' : '#075985'} />
      <rect x={nx} y={ny + 10} width={nw} height="52" rx="8" fill={on ? '#082f49' : '#020617'} stroke={on ? '#7dd3fc' : '#0369a1'} strokeWidth="2" />
      <text x={nx + nw / 2} y={file ? ny + 32 : ny + 40} textAnchor="middle" fill={on ? '#f8fafc' : '#bae6fd'} fontSize="12" fontWeight="700">{label}</text>
      {file && (
        <text x={nx + nw / 2} y={ny + 50} textAnchor="middle" fill={on ? '#67e8f9' : '#64748b'} fontSize="9" fontFamily="ui-monospace, monospace">{file}</text>
      )}
    </g>
  );
}

export function VisualBindMapDiagram() {
  const [focus, setFocus] = useState('both');
  const srcOn = focus !== 'data';
  const dataOn = focus !== 'src';

  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-slate-900 overflow-auto p-4">
      <svg viewBox="0 0 820 460" className="w-full flex-1 min-h-[280px]">
        <rect x="16" y="12" width="500" height="188" rx="14" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        <text x="266" y="36" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700">Host Machine</text>
        <MapFolder x="40" y="78" label="my_ml_project" on={srcOn || dataOn} />
        <MapFolder x="300" y="52" label="src" file="train.py" on={srcOn} />
        <MapFolder x="300" y="124" label="data" file="features.csv" on={dataOn} />
        <path d="M 168 114 L 300 88" fill="none" stroke={srcOn ? '#38bdf8' : '#334155'} strokeWidth="2" />
        <path d="M 168 130 L 300 160" fill="none" stroke={dataOn ? '#38bdf8' : '#334155'} strokeWidth="2" />

        <MapFolder x="8" y="248" label="Host Filesystem" on w="168" />
        <MapFolder x="8" y="338" label="Container Filesystem" on w="168" />

        <rect x="250" y="230" width="546" height="210" rx="14" fill="#111827" stroke="#334155" strokeWidth="2" />
        <text x="523" y="256" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700">Container</text>
        <MapFolder x="280" y="310" label="app" on={srcOn || dataOn} />
        <MapFolder x="620" y="278" label="src" file="/app/src" on={srcOn} />
        <MapFolder x="620" y="352" label="data" file="/app/data" on={dataOn} />
        <path d="M 408 346 L 620 314" fill="none" stroke={srcOn ? '#38bdf8' : '#334155'} strokeWidth="2" />
        <path d="M 408 362 L 620 388" fill="none" stroke={dataOn ? '#38bdf8' : '#334155'} strokeWidth="2" />

        <path
          d="M 428 78 C 560 40, 700 160, 620 304"
          fill="none"
          stroke={srcOn ? '#2dd4bf' : '#1e293b'}
          strokeWidth="2"
          strokeDasharray="7 6"
          className={srcOn ? 'path-flow' : undefined}
        />
        <path
          d="M 428 150 C 590 150, 740 240, 620 378"
          fill="none"
          stroke={dataOn ? '#fbbf24' : '#1e293b'}
          strokeWidth="2"
          strokeDasharray="7 6"
          className={dataOn ? 'path-flow' : undefined}
        />
        <text x="560" y="70" fill={srcOn ? '#5eead4' : '#475569'} fontSize="11">bind mount</text>
        <text x="600" y="188" fill={dataOn ? '#fcd34d' : '#475569'} fontSize="11">bind mount</text>
      </svg>

      <div className="text-center text-[11px] text-slate-300 pb-2">
        {srcOn && <span className="font-mono text-teal-200">my_ml_project/src → /app/src</span>}
        {srcOn && dataOn && <span className="mx-2 text-slate-600">·</span>}
        {dataOn && <span className="font-mono text-amber-200">my_ml_project/data → /app/data</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setFocus('src')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${focus === 'src' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Mount src</button>
        <button type="button" onClick={() => setFocus('data')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${focus === 'data' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>Mount data</button>
        <button type="button" onClick={() => setFocus('both')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${focus === 'both' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Both bind mounts</button>
      </div>
    </div>
  );
}

export function VisualBindMount() {
  const [code, setCode] = useState('print("Hello World")');
  const [output, setOutput] = useState('');
  const { after, clear } = useTimers();

  const executeCode = () => {
    clear();
    setOutput('...');
    after(600, () => {
      if (code.includes('print')) {
        const match = code.match(/print\(['"](.*?)['"]\)/);
        setOutput(match ? match[1] : 'Error: Invalid print syntax');
      } else {
        setOutput('Error: No output');
      }
    });
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col p-4 bg-slate-900 relative overflow-hidden">
      <div className="w-full bg-black/50 border border-slate-700 p-3 rounded-lg mb-4 flex items-center justify-between shadow-lg gap-3 pr-36">
        <div className="font-mono text-[10px] text-blue-300">
          docker run -v <span className="text-yellow-400">$(pwd)/src</span>:<span className="text-pink-400">/app/src</span> my_image python <span className="text-pink-400">/app/src/train.py</span>
        </div>
        <div className="text-[10px] bg-blue-900/50 text-blue-300 px-2 py-1 rounded border border-blue-500/50 flex items-center gap-1 animate-pulse shrink-0">
          <IconRefresh className="w-3 h-3" /> Live Sync Active
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="w-1/2 flex flex-col bg-slate-800 rounded-xl border-2 border-yellow-500/50 overflow-hidden shadow-2xl relative min-h-0">
          <div className="bg-yellow-900/30 border-b border-yellow-500/30 px-3 py-1.5 flex items-center gap-2">
            <IconLaptop className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-bold text-yellow-500">Host (VS Code)</span>
            <span className="text-[10px] font-mono text-slate-400 ml-auto">./src/train.py</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-transparent text-slate-200 font-mono text-xs p-4 outline-none resize-none min-h-0"
            spellCheck={false}
          />
        </div>

        <div className="w-1/2 flex flex-col bg-slate-950 rounded-xl border-2 border-pink-500/50 overflow-hidden shadow-2xl relative min-h-0">
          <div className="bg-pink-900/30 border-b border-pink-500/30 px-3 py-1.5 flex items-center gap-2">
            <IconBox className="w-4 h-4 text-pink-500" />
            <span className="text-xs font-bold text-pink-500">Container FS</span>
            <span className="text-[10px] font-mono text-slate-400 ml-auto">/app/src/train.py</span>
          </div>
          <div className="h-1/2 p-4 font-mono text-xs text-slate-400 whitespace-pre-wrap bg-slate-900/50 border-b border-slate-800 overflow-auto min-h-0">
            {code}
          </div>
          <div className="h-1/2 flex flex-col min-h-0">
            <div className="flex justify-between items-center p-2 bg-black border-b border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Terminal</span>
              <button type="button" onClick={executeCode} className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded shadow">Run Script</button>
            </div>
            <div className="flex-1 p-3 bg-[#0c0c0c] font-mono text-xs text-emerald-400 overflow-y-auto">
              {output && <div className="animate-[fadeIn_0.3s_ease-out]">&gt; {output}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EngineContainer({ x, y, w, h, label, fill, on }) {
  return (
    <g opacity={on ? 1 : 0.28}>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={fill} stroke="#0f172a" strokeWidth="1.5" />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="700">{label}</text>
    </g>
  );
}

function HostFolder({ x, y, label, w, active }) {
  return (
    <g>
      <path d={`M ${x} ${y + 12} h 28 v -12 h 12 l 10 12`} fill={active ? '#7dd3fc' : '#9ca3af'} />
      <rect x={x} y={y + 12} width={w} height="52" rx="3" fill={active ? '#e0f2fe' : '#d1d5db'} stroke={active ? '#0284c7' : '#6b7280'} strokeWidth="1.5" />
      <text x={x + w / 2} y={y + 43} textAnchor="middle" fill="#1f2937" fontSize="13" fontWeight="650">{label}</text>
    </g>
  );
}

export function VisualVolumeEngineDiagram() {
  const [focus, setFocus] = useState('both');
  const inferenceOn = focus !== 'training';
  const trainingOn = focus !== 'inference';
  const stored = inferenceOn || trainingOn;

  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-slate-900 overflow-auto p-4">
      <svg viewBox="0 0 800 470" className="w-full flex-1 min-h-[300px]">
        <defs>
          <marker id="vol-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 Z" fill="#f8fafc" />
          </marker>
          <marker id="vol-arrow-dim" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 Z" fill="#475569" />
          </marker>
          <marker id="store-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 Z" fill="#94a3b8" />
          </marker>
        </defs>

        <rect x="150" y="8" width="500" height="288" rx="4" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x="400" y="28" textAnchor="middle" fill="#cbd5e1" fontSize="13">Docker Engine</text>

        <EngineContainer x={185} y={46} w={190} h={58} label="Inference Container" fill="#fde68a" on={inferenceOn} />
        <EngineContainer x={425} y={46} w={190} h={58} label="Training Container" fill="#99f6e4" on={trainingOn} />

        <path d="M 280 104 L 352 164" fill="none" stroke={inferenceOn ? '#f8fafc' : '#334155'} strokeWidth="1.6" markerEnd={inferenceOn ? 'url(#vol-arrow)' : 'url(#vol-arrow-dim)'} />
        <path d="M 520 104 L 448 164" fill="none" stroke={trainingOn ? '#f8fafc' : '#334155'} strokeWidth="1.6" markerEnd={trainingOn ? 'url(#vol-arrow)' : 'url(#vol-arrow-dim)'} />
        <text x="292" y="140" textAnchor="middle" fill={inferenceOn ? '#f8fafc' : '#475569'} fontSize="12" fontFamily="ui-monospace, monospace" stroke="#020617" strokeWidth="3" paintOrder="stroke">/model_in_cont</text>
        <text x="508" y="140" textAnchor="middle" fill={trainingOn ? '#f8fafc' : '#475569'} fontSize="12" fontFamily="ui-monospace, monospace" stroke="#020617" strokeWidth="3" paintOrder="stroke">/data_in_cont</text>

        <path d="M 292 188 L 292 262 A 108 22 0 0 0 508 262 L 508 188" fill={stored ? '#38bdf8' : '#0c4a6e'} />
        <ellipse cx="400" cy="262" rx="108" ry="22" fill={stored ? '#0284c7' : '#082f49'} />
        <ellipse cx="400" cy="188" rx="108" ry="22" fill={stored ? '#7dd3fc' : '#0369a1'} stroke="#e0f2fe" strokeWidth="1.5" />
        <text x="400" y="214" textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="700">my-ml-data</text>
        <text x="400" y="232" textAnchor="middle" fill="#0f172a" fontSize="12">(Docker Volume)</text>

        <path d="M 400 284 L 420 386" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeDasharray="5 4" markerEnd="url(#store-arrow)" className={stored ? 'path-flow' : undefined} />
        <text x="436" y="324" fill="#e2e8f0" fontSize="12">Stores data here</text>
        <text x="436" y="342" fill="#94a3b8" fontSize="11">(Location managed by Docker)</text>

        <rect x="160" y="356" width="480" height="104" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1.5" />
        <text x="400" y="376" textAnchor="middle" fill="#374151" fontSize="13">Host Machine Filesystem</text>
        <HostFolder x={178} y={386} w={200} label="Other Host Files" active={false} />
        <HostFolder x={398} y={386} w={220} label="Docker Managed Area" active={stored} />
      </svg>

      <div className="text-center text-[11px] text-slate-300 pb-2">
        {inferenceOn && <span className="font-mono text-amber-200">Inference → /model_in_cont</span>}
        {inferenceOn && trainingOn && <span className="mx-2 text-slate-600">·</span>}
        {trainingOn && <span className="font-mono text-teal-200">Training → /data_in_cont</span>}
        {stored && <span className="ml-2 text-sky-300">shared in my-ml-data</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setFocus('inference')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${focus === 'inference' ? 'bg-amber-300 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>Inference Container</button>
        <button type="button" onClick={() => setFocus('training')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${focus === 'training' ? 'bg-teal-300 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>Training Container</button>
        <button type="button" onClick={() => setFocus('both')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${focus === 'both' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Both share the volume</button>
      </div>
    </div>
  );
}

export function VisualVolumeSharing() {
  const [phase, setPhase] = useState(0);
  const { after, clear } = useTimers();

  const runFlow = () => {
    clear();
    setPhase(1);
    after(2500, () => setPhase(2));
    after(4000, () => setPhase(3));
  };

  const reset = () => {
    clear();
    setPhase(0);
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col items-center p-4 bg-slate-900 relative overflow-hidden">
      <div className="w-full flex justify-between items-center mb-4 border-b border-slate-700 pb-4 pr-36">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Volume Persistence & Sharing</div>
        <button type="button" onClick={phase === 0 ? runFlow : phase === 3 ? reset : undefined} className={`px-4 py-2 rounded text-xs font-bold transition-all shadow-lg shrink-0 ${phase === 0 || phase === 3 ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-700 text-slate-500'}`}>
          {phase === 0 ? 'Run Training Job' : phase === 3 ? 'Reset Scenario' : 'Processing...'}
        </button>
      </div>

      <div className="flex-1 w-full relative flex items-center justify-center min-h-[240px]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-emerald-900/30 border-2 border-emerald-500 rounded-xl flex flex-col items-center justify-center z-10 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <IconDatabase className="w-8 h-8 text-emerald-400 mb-2" />
          <span className="text-xs font-bold text-emerald-300 font-mono">my-ml-data (Volume)</span>
          <div className="mt-2 h-6 flex items-center justify-center w-full">
            {phase >= 2 && (
              <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded shadow-lg animate-[fadeIn_0.5s_ease-out]">model_weights.h5</span>
            )}
          </div>
        </div>

        <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-40 h-40 bg-blue-900/20 border-2 border-blue-500 rounded-xl flex flex-col items-center justify-center transition-all duration-700 ${phase === 0 ? 'opacity-30' : phase === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="absolute -top-3 bg-blue-600 text-[10px] font-bold px-2 py-1 rounded text-white">Training Container</div>
          <IconTerminal className="w-8 h-8 text-blue-400 mb-2" />
          {phase === 1 && (
            <div className="mt-4 flex flex-col items-center">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mb-1" />
              <span className="text-[10px] text-blue-300">Training...</span>
            </div>
          )}
        </div>

        <div className={`absolute right-4 top-1/2 -translate-y-1/2 w-40 h-40 bg-purple-900/20 border-2 border-purple-500 rounded-xl flex flex-col items-center justify-center transition-all duration-700 ${phase === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="absolute -top-3 bg-purple-600 text-[10px] font-bold px-2 py-1 rounded text-white">Inference API</div>
          <IconServer className="w-8 h-8 text-purple-400 mb-2" />
          {phase === 3 && (
            <div className="mt-4 bg-purple-950 border border-purple-500 px-2 py-1 rounded text-[10px] text-purple-300 text-center animate-[fadeIn_1s_ease-out]">
              Loaded weights!<br />Ready for requests.
            </div>
          )}
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <marker id="arrow-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" /></marker>
            <marker id="arrow-purple" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#a855f7" /></marker>
          </defs>
          {phase === 1 && (
            <path d="M 230,220 L 350,220" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6 6" markerEnd="url(#arrow-blue)" className="animate-[dash_1s_linear_infinite]" />
          )}
          {phase === 3 && (
            <path d="M 450,220 L 570,220" fill="none" stroke="#a855f7" strokeWidth="3" strokeDasharray="6 6" markerEnd="url(#arrow-purple)" className="animate-[dash_1s_linear_infinite]" />
          )}
        </svg>
      </div>
    </div>
  );
}

const SAVE_STEPS = ['The Python Script', 'Build Image', 'Run Training', 'Verify Persistence'];

export function VisualPracticalModelSave({ initialStep = 0 }) {
  const [step, setStep] = useState(initialStep);

  return (
    <div className="w-full h-full min-h-0 flex flex-col p-4 bg-slate-900 relative overflow-hidden">
      <div className="flex gap-2 w-full mb-4 relative z-20 pr-36 shrink-0">
        {SAVE_STEPS.map((title, idx) => (
          <button
            type="button"
            key={title}
            onClick={() => setStep(idx)}
            className={`flex-1 h-10 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider rounded transition-all border ${step === idx ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : step > idx ? 'bg-slate-800 border-emerald-500/50 text-emerald-400' : 'bg-slate-950 border-slate-700 text-slate-600'}`}
          >
            {step > idx ? <IconCheck className="w-4 h-4 mr-1" /> : null}
            {title}
          </button>
        ))}
      </div>

      <div className="flex-1 w-full relative min-h-0">
        <div className={`absolute inset-0 transition-all duration-500 flex flex-col ${step === 0 ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-slate-950 border border-slate-700 rounded-xl flex-1 flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 text-xs text-slate-400 font-mono">save_model.py</div>
            <div className="p-4 font-mono text-[10px] text-slate-300 flex flex-col gap-1 overflow-y-auto">
              <span><span className="text-purple-400">import</span> os</span>
              <br />
              <span className="text-slate-500"># Save to the directory we intend to mount a volume to</span>
              <span>output_dir = <span className="text-emerald-400">&quot;/app/output&quot;</span></span>
              <span>os.makedirs(output_dir, exist_ok=<span className="text-blue-400">True</span>)</span>
              <br />
              <span>filepath = os.path.join(output_dir, <span className="text-emerald-400">&quot;model_artifact.txt&quot;</span>)</span>
              <span><span className="text-purple-400">with</span> open(filepath, <span className="text-emerald-400">&quot;w&quot;</span>) <span className="text-purple-400">as</span> f:</span>
              <span className="ml-4">f.write(<span className="text-emerald-400">&quot;Trained Model Weights Data&quot;</span>)</span>
              <br />
              <span><span className="text-blue-300">print</span>(<span className="text-emerald-400">f&quot;Successfully saved to {'{filepath}'}&quot;</span>)</span>
            </div>
          </div>
        </div>

        <div className={`absolute inset-0 transition-all duration-500 flex flex-col ${step === 1 ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-slate-950 border border-slate-700 rounded-xl flex-1 flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 text-xs text-slate-400 font-mono">Dockerfile & Terminal</div>
            <div className="p-4 font-mono text-[10px] text-slate-300 flex flex-col gap-1">
              <span><span className="text-blue-400">FROM</span> python:3.9-slim</span>
              <span><span className="text-blue-400">WORKDIR</span> /app</span>
              <span><span className="text-blue-400">COPY</span> save_model.py .</span>
              <span><span className="text-blue-400">CMD</span> [&quot;python&quot;, &quot;save_model.py&quot;]</span>
              <div className="mt-8 border-t border-slate-700 pt-4">
                <span className="text-emerald-400">$</span> docker build -t simple-saver .
                <div className="text-slate-500 mt-1">Successfully built image simple-saver</div>
              </div>
            </div>
          </div>
        </div>

        <div className={`absolute inset-0 transition-all duration-500 flex flex-col ${step === 2 ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-[#0c0c0c] border border-slate-700 rounded-xl flex-1 flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-900 text-xs text-slate-400 font-mono">Terminal (Training Run)</div>
            <div className="p-4 font-mono text-[10px] text-slate-300 flex flex-col gap-2">
              <div className="text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded border border-yellow-700/50 mb-2">Notice the --rm flag! The container deletes itself after running.</div>
              <div>
                <span className="text-emerald-400">$</span> docker run --rm \<br />
                <span className="pl-4 text-pink-400">-v model-storage:/app/output</span> \<br />
                <span className="pl-4">simple-saver</span>
              </div>
              <div className="text-slate-500 mt-4">Executing /app/save_model.py...</div>
              <div className="text-blue-300">Successfully saved to /app/output/model_artifact.txt</div>
              <div className="text-slate-500 mt-2">Container exited and was automatically removed.</div>
            </div>
          </div>
        </div>

        <div className={`absolute inset-0 transition-all duration-500 flex flex-col ${step === 3 ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-[#0c0c0c] border border-emerald-900/50 rounded-xl flex-1 flex flex-col overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.15)] relative">
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-900 text-xs text-slate-400 font-mono">Terminal (Verification Run)</div>
            <div className="p-4 font-mono text-[10px] text-slate-300 flex flex-col gap-2">
              <div className="text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded border border-emerald-700/50 mb-2">We spin up a totally new, temporary container just to look inside the volume.</div>
              <div>
                <span className="text-emerald-400">$</span> docker run --rm \<br />
                <span className="pl-4 text-pink-400">-v model-storage:/data</span> \<br />
                <span className="pl-4">python:3.9-slim</span> <span className="text-yellow-400">ls -l /data</span>
              </div>
              <div className="mt-6 border-l-2 border-emerald-500 pl-3">
                total 4<br />
                -rw-r--r-- 1 root root 26 Oct 12 15:30 <span className="text-white font-bold">model_artifact.txt</span>
              </div>
            </div>
            <div className="absolute bottom-6 right-6 flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-900/40 px-3 py-2 rounded-full border border-emerald-500/50 shadow-lg">
              <IconCheck className="w-4 h-4" /> Data Persisted Successfully!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualPracticalScript = () => <VisualPracticalModelSave initialStep={0} />;
export const VisualPracticalRun = () => <VisualPracticalModelSave initialStep={2} />;
