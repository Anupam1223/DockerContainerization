import React, { useState, useEffect } from 'react';

const IconLaptop = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 14h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2zm-4 4h24v2H0v-2z" /></svg>;
const IconServer = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>;
const IconBox = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const IconDocker = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M22.56 12.01c-.13-.39-.24-.8-.24-1.23 0-2.31 1.77-4.22 4.04-4.52-.39-1.3-1.07-2.48-1.99-3.43-1.6-1.65-3.8-2.68-6.19-2.73-1.84-.04-3.64.44-5.22 1.38-.85.5-1.62 1.12-2.29 1.83-1.12 1.18-1.92 2.6-2.34 4.14-.15.54-.25 1.1-.31 1.66-.46-.08-.94-.12-1.42-.12-2.33 0-4.53.86-6.22 2.42-1.35 1.25-2.28 2.89-2.67 4.69-.17.81-.22 1.65-.13 2.48.24 2.11 1.24 4.04 2.82 5.48 1.58 1.44 3.63 2.27 5.79 2.36 1.82.08 3.62-.35 5.22-1.22 1.57-.86 2.87-2.12 3.8-3.67.65-1.09 1.11-2.27 1.37-3.5.17-.83.22-1.68.14-2.52-.16-1.63-.73-3.17-1.65-4.48M10.42 17.5c-2.46 0-4.46-1.99-4.46-4.46 0-2.46 2.01-4.46 4.46-4.46 2.46 0 4.46 2.01 4.46 4.46 0 2.46-1.99 4.46-4.46 4.46zM10.42 10.15c-1.6 0-2.89 1.29-2.89 2.89 0 1.6 1.29 2.89 2.89 2.89 1.6 0 2.89-1.29 2.89-2.89 0-1.6-1.29-2.89-2.89-2.89z" /><path d="M13.23 8.35h2.15v2.15h-2.15zM15.82 8.35h2.15v2.15h-2.15zM18.42 8.35h2.15v2.15h-2.15zM10.63 5.76h2.15v2.15h-2.15zM13.23 5.76h2.15v2.15h-2.15zM15.82 5.76h2.15v2.15h-2.15zM13.23 3.17h2.15v2.15h-2.15z" /></svg>;
const IconTerminal = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconPlay = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
const IconStop = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z" /></svg>;
const IconTrash = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

export const VisualReproducibility = () => {
  const [step, setStep] = useState(0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-900 rounded-xl relative overflow-hidden">
      <div className="flex w-full justify-around items-end h-72 relative pb-8">
        <div className="flex flex-col items-center w-1/3 z-10">
          <IconLaptop className="w-20 h-20 text-blue-400 mb-2" />
          <div className="text-white font-bold mb-2">Local Laptop</div>
          <div className="flex flex-col gap-1 w-full max-w-[150px]">
            <span className="bg-emerald-900/50 text-emerald-400 text-[10px] px-2 py-1 rounded border border-emerald-700/50">macOS Monterey</span>
            <span className="bg-emerald-900/50 text-emerald-400 text-[10px] px-2 py-1 rounded border border-emerald-700/50">Python 3.9.2</span>
            <span className="bg-emerald-900/50 text-emerald-400 text-[10px] px-2 py-1 rounded border border-emerald-700/50">TensorFlow 2.5</span>
            <span className="bg-emerald-900/50 text-emerald-400 text-[10px] px-2 py-1 rounded border border-emerald-700/50">CUDA 11.2</span>
          </div>
        </div>

        <div className={`absolute flex flex-col items-center justify-center transition-all duration-700 ease-in-out z-20
            ${step === 0 ? 'left-[16%] bottom-[120px] scale-100' : ''}
            ${step === 1 ? 'left-[40%] bottom-[200px] scale-110' : ''}
            ${step === 2 ? 'left-[70%] bottom-[120px] scale-100' : ''}
            ${step === 3 ? 'left-[70%] bottom-[120px] scale-100' : ''}
          `}
        >
          {step === 3 ? (
             <div className="bg-blue-600/20 border-2 border-blue-400 p-2 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)]">
               <div className="bg-emerald-500 w-16 h-16 rounded-md shadow-lg flex items-center justify-center flex-col relative overflow-hidden">
                 <IconBox className="w-8 h-8 text-white z-10" />
                 <div className="absolute inset-0 bg-blue-500 opacity-50"></div>
               </div>
             </div>
          ) : (
            <div className="bg-emerald-500 w-16 h-16 rounded-md shadow-lg flex items-center justify-center flex-col">
              <IconBox className="w-8 h-8 text-white" />
            </div>
          )}

          <div className="absolute -top-10 w-32 flex justify-center">
            {step === 0 && <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">Works!</span>}
            {step === 1 && <span className="bg-slate-700 text-white text-xs px-2 py-1 rounded-full">Deploying...</span>}
            {step === 2 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">CRASH: Lib Mismatch!</span>}
            {step === 3 && <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Docker Shield Active</span>}
          </div>
        </div>

        <div className="flex flex-col items-center w-1/3 z-10">
          <IconServer className={`w-20 h-20 mb-2 transition-colors duration-500 ${step === 2 ? 'text-red-400' : step === 3 ? 'text-blue-400' : 'text-slate-400'}`} />
          <div className="text-white font-bold mb-2">Prod Server</div>
          <div className="flex flex-col gap-1 w-full max-w-[150px]">
            <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded border border-slate-700">Ubuntu 20.04</span>
            <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded border border-slate-700">Python 3.8.5</span>
            <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded border border-slate-700">TensorFlow 2.4</span>
            <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded border border-slate-700">CUDA 10.1</span>
          </div>
        </div>
      </div>

      <div className="mt-8 z-20">
        <button type="button" onClick={() => setStep((s) => (s < 3 ? s + 1 : 0))} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg transition-all active:scale-95">
          {step === 0 && "Deploy to Production"}
          {step === 1 && "Running..."}
          {step === 2 && "Fix with Docker"}
          {step === 3 && "Reset Simulation"}
        </button>
      </div>
    </div>
  );
};

export const VisualDependencyDiagram = () => (
  <div className="w-full h-full min-h-0 bg-white flex items-center justify-center p-3">
    <svg viewBox="0 0 1000 620" className="w-full h-full" role="img" aria-label="Host machine dependency conflict beside two isolated containers">
      <defs>
        <marker id="dep-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#111827" />
        </marker>
        <marker id="dep-arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
        </marker>
      </defs>

      <rect x="12" y="12" width="468" height="596" fill="#e8eef4" stroke="#111827" strokeWidth="2" />
      <text x="28" y="42" fill="#111827" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">Host Machine (Without Containers)</text>

      <path d="M 88,118 C 36,170 32,460 78,530" fill="none" stroke="#111827" strokeWidth="1.6" markerEnd="url(#dep-arrow)" />
      <path d="M 402,118 C 454,170 458,460 412,530" fill="none" stroke="#111827" strokeWidth="1.6" markerEnd="url(#dep-arrow)" />
      <path d="M 150,124 L 150,190" fill="none" stroke="#111827" strokeWidth="1.6" markerEnd="url(#dep-arrow)" />
      <path d="M 350,124 L 350,190" fill="none" stroke="#111827" strokeWidth="1.6" markerEnd="url(#dep-arrow)" />
      <path d="M 150,252 C 175,300 195,330 210,362" fill="none" stroke="#dc2626" strokeWidth="1.6" strokeDasharray="5 4" markerEnd="url(#dep-arrow-red)" />
      <path d="M 350,252 C 325,300 305,330 290,362" fill="none" stroke="#dc2626" strokeWidth="1.6" strokeDasharray="5 4" markerEnd="url(#dep-arrow-red)" />
      <path d="M 205,420 L 118,528" fill="none" stroke="#111827" strokeWidth="1.6" markerEnd="url(#dep-arrow)" />
      <path d="M 295,420 L 360,528" fill="none" stroke="#111827" strokeWidth="1.6" markerEnd="url(#dep-arrow)" />

      <text x="108" y="168" fill="#111827" fontSize="13" fontFamily="ui-sans-serif, system-ui, sans-serif">Needs</text>
      <text x="292" y="168" fill="#111827" fontSize="13" fontFamily="ui-sans-serif, system-ui, sans-serif">Needs</text>
      <text x="168" y="312" fill="#dc2626" fontSize="13" fontFamily="ui-sans-serif, system-ui, sans-serif">Conflicts?</text>
      <text x="292" y="312" fill="#dc2626" fontSize="13" fontFamily="ui-sans-serif, system-ui, sans-serif">Conflicts?</text>

      <ellipse cx="150" cy="92" rx="62" ry="28" fill="#d8b4fe" stroke="#111827" strokeWidth="1.5" />
      <text x="150" y="96" textAnchor="middle" fill="#111827" fontSize="14" fontFamily="ui-sans-serif, system-ui, sans-serif">Project B</text>
      <ellipse cx="350" cy="92" rx="62" ry="28" fill="#fde68a" stroke="#111827" strokeWidth="1.5" />
      <text x="350" y="96" textAnchor="middle" fill="#111827" fontSize="14" fontFamily="ui-sans-serif, system-ui, sans-serif">Project A</text>

      <rect x="85" y="196" width="130" height="52" fill="#7dd3fc" stroke="#111827" strokeWidth="1.5" />
      <text x="150" y="226" textAnchor="middle" fill="#111827" fontSize="14" fontFamily="ui-sans-serif, system-ui, sans-serif">libraryX v2.0</text>
      <rect x="285" y="196" width="130" height="52" fill="#f9a8d4" stroke="#111827" strokeWidth="1.5" />
      <text x="350" y="226" textAnchor="middle" fill="#111827" fontSize="14" fontFamily="ui-sans-serif, system-ui, sans-serif">libraryX v1.0</text>

      <rect x="165" y="368" width="170" height="48" rx="18" fill="#ffffff" stroke="#111827" strokeWidth="1.5" />
      <text x="250" y="397" textAnchor="middle" fill="#111827" fontSize="15" fontFamily="ui-sans-serif, system-ui, sans-serif">System Python</text>

      <rect x="62" y="536" width="112" height="46" fill="#bfdbfe" stroke="#111827" strokeWidth="1.5" />
      <text x="118" y="564" textAnchor="middle" fill="#111827" fontSize="14" fontFamily="ui-sans-serif, system-ui, sans-serif">PyTorch</text>
      <rect x="292" y="536" width="130" height="46" fill="#fdba74" stroke="#111827" strokeWidth="1.5" />
      <text x="357" y="564" textAnchor="middle" fill="#111827" fontSize="14" fontFamily="ui-sans-serif, system-ui, sans-serif">TensorFlow</text>

      <rect x="496" y="12" width="492" height="596" fill="#eef2f6" stroke="#111827" strokeWidth="2" />
      <text x="742" y="46" textAnchor="middle" fill="#111827" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">With Docker Containers</text>

      <rect x="512" y="68" width="228" height="520" fill="#e9d5ff" stroke="#111827" strokeWidth="1.5" />
      <text x="626" y="98" textAnchor="middle" fill="#111827" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">Container B</text>
      <path d="M 568,176 C 545,280 545,420 548,520" fill="none" stroke="#111827" strokeWidth="1.6" markerEnd="url(#dep-arrow)" />
      <path d="M 590,176 C 640,280 680,420 688,520" fill="none" stroke="#111827" strokeWidth="1.6" markerEnd="url(#dep-arrow)" />
      <path d="M 662,176 C 620,300 575,430 580,520" fill="none" stroke="#111827" strokeWidth="1.6" markerEnd="url(#dep-arrow)" />
      <path d="M 690,176 C 705,280 710,420 708,520" fill="none" stroke="#111827" strokeWidth="1.6" markerEnd="url(#dep-arrow)" />
      <ellipse cx="575" cy="148" rx="54" ry="26" fill="#ffffff" stroke="#111827" strokeWidth="1.5" />
      <text x="575" y="153" textAnchor="middle" fill="#111827" fontSize="14" fontFamily="ui-sans-serif, system-ui, sans-serif">Project B</text>
      <ellipse cx="680" cy="148" rx="48" ry="26" fill="#ffffff" stroke="#111827" strokeWidth="1.5" />
      <text x="680" y="153" textAnchor="middle" fill="#111827" fontSize="14" fontFamily="ui-sans-serif, system-ui, sans-serif">Python</text>
      <rect x="524" y="528" width="88" height="42" fill="#bae6fd" stroke="#111827" strokeWidth="1.5" />
      <text x="568" y="554" textAnchor="middle" fill="#111827" fontSize="13" fontFamily="ui-sans-serif, system-ui, sans-serif">PyTorch</text>
      <rect x="620" y="528" width="108" height="42" fill="#7dd3fc" stroke="#111827" strokeWidth="1.5" />
      <text x="674" y="554" textAnchor="middle" fill="#111827" fontSize="12" fontFamily="ui-sans-serif, system-ui, sans-serif">libraryX v2.0</text>

      <rect x="752" y="68" width="220" height="520" fill="#fef3c7" stroke="#111827" strokeWidth="1.5" />
      <text x="862" y="98" textAnchor="middle" fill="#111827" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">Container A</text>
      <path d="M 808,176 C 785,280 785,420 788,520" fill="none" stroke="#111827" strokeWidth="1.6" markerEnd="url(#dep-arrow)" />
      <path d="M 830,176 C 880,280 910,420 918,520" fill="none" stroke="#111827" strokeWidth="1.6" markerEnd="url(#dep-arrow)" />
      <path d="M 902,176 C 860,300 815,430 820,520" fill="none" stroke="#111827" strokeWidth="1.6" markerEnd="url(#dep-arrow)" />
      <path d="M 928,176 C 940,280 945,420 940,520" fill="none" stroke="#111827" strokeWidth="1.6" markerEnd="url(#dep-arrow)" />
      <ellipse cx="812" cy="148" rx="54" ry="26" fill="#ffffff" stroke="#111827" strokeWidth="1.5" />
      <text x="812" y="153" textAnchor="middle" fill="#111827" fontSize="14" fontFamily="ui-sans-serif, system-ui, sans-serif">Project A</text>
      <ellipse cx="918" cy="148" rx="48" ry="26" fill="#ffffff" stroke="#111827" strokeWidth="1.5" />
      <text x="918" y="153" textAnchor="middle" fill="#111827" fontSize="14" fontFamily="ui-sans-serif, system-ui, sans-serif">Python</text>
      <rect x="764" y="528" width="92" height="42" fill="#fdba74" stroke="#111827" strokeWidth="1.5" />
      <text x="810" y="554" textAnchor="middle" fill="#111827" fontSize="12" fontFamily="ui-sans-serif, system-ui, sans-serif">TensorFlow</text>
      <rect x="864" y="528" width="96" height="42" fill="#f9a8d4" stroke="#111827" strokeWidth="1.5" />
      <text x="912" y="554" textAnchor="middle" fill="#111827" fontSize="12" fontFamily="ui-sans-serif, system-ui, sans-serif">libraryX v1.0</text>
    </svg>
  </div>
);

export const VisualConsistencyAndCollab = () => (
  <div className="w-full h-full min-h-0 bg-slate-900 flex items-center justify-center p-4">
    <svg viewBox="0 0 900 480" className="w-full h-full" role="img" aria-label="One container image feeding local development, CI, and cloud deploy">
      <defs>
        <marker id="truth-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
        </marker>
        <filter id="truth-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#3b82f6" floodOpacity="0.55" />
        </filter>
      </defs>

      <text x="450" y="36" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="700" letterSpacing="3" fontFamily="ui-sans-serif, system-ui, sans-serif">THE SINGLE SOURCE OF TRUTH</text>

      <path d="M 450,214 C 450,250 160,268 160,318" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeDasharray="6 6" className="path-flow" markerEnd="url(#truth-arrow)" />
      <path d="M 450,214 L 450,318" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeDasharray="6 6" className="path-flow" markerEnd="url(#truth-arrow)" />
      <path d="M 450,214 C 450,250 740,268 740,318" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeDasharray="6 6" className="path-flow" markerEnd="url(#truth-arrow)" />

      <g filter="url(#truth-glow)">
        <rect x="325" y="72" width="250" height="142" rx="16" fill="#2563eb" stroke="#60a5fa" strokeWidth="2" />
      </g>
      <path d="M 430 108 h18 v-8 h22 v28 h-40 z" fill="#ffffff" />
      <circle cx="478" cy="112" r="8" fill="none" stroke="#ffffff" strokeWidth="3" />
      <text x="450" y="158" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">Container Image</text>
      <rect x="372" y="172" width="156" height="22" rx="4" fill="#1e3a8a" />
      <text x="450" y="187" textAnchor="middle" fill="#bfdbfe" fontSize="11" fontFamily="ui-monospace, monospace">Built from Dockerfile</text>

      <g>
        <rect x="124" y="326" width="72" height="72" rx="10" fill="#1e293b" stroke="#475569" />
        <rect x="142" y="342" width="36" height="24" rx="3" fill="none" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M 136 374 h56" stroke="#cbd5e1" strokeWidth="2" />
        <text x="160" y="422" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">Local Dev</text>
        <text x="160" y="440" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="ui-sans-serif, system-ui, sans-serif">macOS/Windows</text>
      </g>
      <g>
        <rect x="414" y="326" width="72" height="72" rx="10" fill="#1e293b" stroke="#475569" />
        <rect x="432" y="342" width="36" height="14" rx="2" fill="none" stroke="#cbd5e1" strokeWidth="2" />
        <rect x="432" y="360" width="36" height="14" rx="2" fill="none" stroke="#cbd5e1" strokeWidth="2" />
        <circle cx="458" cy="349" r="1.5" fill="#cbd5e1" />
        <circle cx="458" cy="367" r="1.5" fill="#cbd5e1" />
        <text x="450" y="422" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">CI/CD Tests</text>
        <text x="450" y="440" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="ui-sans-serif, system-ui, sans-serif">Linux Servers</text>
      </g>
      <g>
        <rect x="704" y="326" width="72" height="72" rx="10" fill="#1e293b" stroke="#475569" />
        <rect x="718" y="340" width="16" height="16" rx="2" fill="none" stroke="#60a5fa" strokeWidth="2" />
        <rect x="740" y="348" width="16" height="16" rx="2" fill="none" stroke="#60a5fa" strokeWidth="2" />
        <rect x="728" y="366" width="16" height="16" rx="2" fill="none" stroke="#60a5fa" strokeWidth="2" />
        <text x="740" y="422" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">Cloud Deploy</text>
        <text x="740" y="440" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="ui-sans-serif, system-ui, sans-serif">Kubernetes / ECS</text>
      </g>
    </svg>
  </div>
);

export const VisualImageVsContainer = () => {
  const [containers, setContainers] = useState([]);

  const addContainer = () => {
    if (containers.length < 3) setContainers([...containers, { id: Date.now() }]);
  };

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative min-h-0 overflow-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[360px]">
        <div className="flex flex-col items-center lg:border-r-2 lg:border-slate-700 lg:pr-8">
           <h3 className="text-blue-400 font-bold mb-4">IMAGE (The Class / Blueprint)</h3>
           <div className="w-full bg-slate-800 border-2 border-slate-600 rounded-lg p-4 relative shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col justify-between">
              <div className="absolute top-2 right-2 bg-red-900/50 text-red-300 text-[10px] font-bold px-2 py-1 rounded border border-red-500 uppercase flex items-center gap-1">
                 <IconStop className="w-3 h-3"/> Read-Only
              </div>
              <div className="flex flex-col gap-2 mt-6 font-mono text-xs">
                 <div className="bg-slate-950 p-2 rounded text-slate-300 border border-slate-700 flex justify-between"><span>Python Script:</span> <span>train.py</span></div>
                 <div className="bg-slate-950 p-2 rounded text-slate-300 border border-slate-700 flex justify-between"><span>Interpreter:</span> <span>Python 3.9</span></div>
                 <div className="bg-slate-950 p-2 rounded text-slate-300 border border-slate-700 flex justify-between"><span>Libs:</span> <span className="text-emerald-400">tf, pandas, numpy</span></div>
                 <div className="bg-slate-950 p-2 rounded text-slate-300 border border-slate-700 flex justify-between"><span>System Tools:</span> <span>apt dependencies</span></div>
              </div>
           </div>
           <button type="button" onClick={addContainer} disabled={containers.length >= 3} className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded font-mono text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2">
             <IconTerminal className="w-4 h-4"/> docker run image_name
           </button>
        </div>

        <div className="flex flex-col items-center relative min-h-0">
           <h3 className="text-emerald-400 font-bold mb-4">CONTAINERS (The Objects / Instances)</h3>
           <div className="w-full flex-1 flex flex-col gap-3 justify-center">
             {containers.length === 0 && <div className="text-center text-slate-500 italic text-sm mt-10">Execute `docker run` to create a runnable instance.</div>}
             {containers.map((c, i) => (
               <div key={c.id} className="w-full bg-slate-800 border-2 border-emerald-500/50 rounded-lg p-3 flex items-center shadow-lg animate-[slideIn_0.3s_ease-out]">
                  <div className="w-10 h-10 bg-emerald-900/50 rounded flex items-center justify-center mr-4">
                     <IconPlay className="w-5 h-5 text-emerald-400 animate-pulse"/>
                  </div>
                  <div className="flex-1">
                     <div className="text-white font-bold text-sm">Container Instance {i + 1}</div>
                     <div className="text-emerald-400 text-[10px] font-mono mt-1 bg-emerald-950 px-2 py-1 rounded inline-block border border-emerald-800">
                        + Writable Layer (Temporary Storage)
                     </div>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export const VisualLayeredFS = () => {
  const [base, setBase] = useState('python');

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative min-h-0 overflow-auto">
       <div className="flex justify-center gap-4 mb-6 z-20 flex-wrap">
          <button type="button" onClick={() => setBase('python')} className={`px-4 py-2 rounded text-xs font-bold transition-all border ${base === 'python' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>python:3.10-slim</button>
          <button type="button" onClick={() => setBase('ubuntu')} className={`px-4 py-2 rounded text-xs font-bold transition-all border ${base === 'ubuntu' ? 'bg-orange-600 border-orange-400 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>ubuntu:22.04</button>
          <button type="button" onClick={() => setBase('nvidia')} className={`px-4 py-2 rounded text-xs font-bold transition-all border ${base === 'nvidia' ? 'bg-green-600 border-green-400 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>nvidia/cuda:12.1</button>
       </div>

       <div className="flex-1 flex items-end justify-center relative pb-6">
          <div className="flex flex-col-reverse items-center gap-1 w-80">
            <div className={`w-full py-4 rounded flex flex-col items-center justify-center text-white font-bold transition-colors duration-500 shadow-md ${base === 'python' ? 'bg-blue-800' : base === 'ubuntu' ? 'bg-orange-800' : 'bg-green-800'}`}>
               <span className="text-sm">Base OS Layer</span>
               <span className="text-[10px] font-mono font-normal mt-1 bg-black/30 px-2 py-0.5 rounded text-center">
                  {base === 'python' ? 'FROM python:3.10-slim (Debian)' : base === 'ubuntu' ? 'FROM ubuntu:22.04 (Linux)' : 'FROM nvidia/cuda:12.1... (GPU Linux)'}
               </span>
            </div>

            {base !== 'python' && (
              <div className="w-full py-3 bg-slate-600 rounded flex flex-col items-center justify-center text-white font-bold shadow-md animate-[slideDown_0.3s_ease-out]">
                 <span className="text-sm">Python Runtime</span>
                 <span className="text-[10px] font-mono font-normal mt-1 bg-black/30 px-2 py-0.5 rounded">RUN apt-get install python3</span>
              </div>
            )}

            <div className="w-full py-5 bg-indigo-700 rounded flex flex-col items-center justify-center text-white font-bold shadow-md">
               <span className="text-sm">ML Libraries</span>
               <span className="text-[10px] font-mono font-normal mt-1 bg-black/30 px-2 py-0.5 rounded">RUN pip install tensorflow</span>
            </div>

            <div className="w-full py-3 bg-slate-500 rounded flex flex-col items-center justify-center text-white font-bold shadow-md">
               <span className="text-sm">Your Application Code</span>
               <span className="text-[10px] font-mono font-normal mt-1 bg-black/30 px-2 py-0.5 rounded">COPY . /app (e.g., train.py)</span>
            </div>

            <div className="w-[110%] border-t-2 border-dashed border-slate-500 my-2 text-center text-[10px] text-slate-400 uppercase tracking-widest relative">
               <span className="bg-slate-900 px-2">Image Boundary (Read-Only Below)</span>
            </div>

            <div className="w-full py-3 bg-emerald-900/30 border-2 border-emerald-500 border-dashed rounded flex flex-col items-center justify-center text-emerald-400 font-bold">
               <span className="text-sm">Writable Container Layer</span>
               <span className="text-[10px] font-mono mt-1">(Created when container runs)</span>
            </div>
          </div>
       </div>
    </div>
  );
};

export const VisualDockerRun = () => {
  const [flags, setFlags] = useState({ d: false, it: false, rm: false, name: false, p: false });

  const toggleFlag = (flag) => setFlags((prev) => {
    const next = { ...prev, [flag]: !prev[flag] };
    if (flag === 'd' && next.d) next.it = false;
    if (flag === 'it' && next.it) next.d = false;
    return next;
  });

  let cmd = `docker run`;
  if (flags.d) cmd += ` -d`;
  if (flags.it) cmd += ` -it`;
  if (flags.rm) cmd += ` --rm`;
  if (flags.name) cmd += ` --name my_ml_app`;
  if (flags.p) cmd += ` -p 8080:80`;
  cmd += ` my-image`;

  return (
    <div className="w-full h-full flex flex-col items-center p-6 bg-slate-900 rounded-xl relative min-h-0 overflow-auto">
       <div className="w-full bg-black p-4 rounded-lg font-mono text-sm text-green-400 shadow-inner mb-6 border border-slate-700 flex items-center">
          <span className="text-slate-500 mr-2">$</span> {cmd}
       </div>

       <div className="flex w-full flex-1 gap-8 min-h-[280px] flex-col lg:flex-row">
          <div className="lg:w-1/2 flex flex-col gap-3">
             <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Toggle Flags</div>
             <button type="button" onClick={() => toggleFlag('d')} className={`text-left px-4 py-2 rounded text-sm font-mono border transition-all ${flags.d ? 'bg-blue-900/50 border-blue-500 text-blue-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>-d (Detached / Background)</button>
             <button type="button" onClick={() => toggleFlag('it')} className={`text-left px-4 py-2 rounded text-sm font-mono border transition-all ${flags.it ? 'bg-blue-900/50 border-blue-500 text-blue-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>-it (Interactive Terminal)</button>
             <button type="button" onClick={() => toggleFlag('rm')} className={`text-left px-4 py-2 rounded text-sm font-mono border transition-all ${flags.rm ? 'bg-blue-900/50 border-blue-500 text-blue-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>--rm (Auto-remove on exit)</button>
             <button type="button" onClick={() => toggleFlag('name')} className={`text-left px-4 py-2 rounded text-sm font-mono border transition-all ${flags.name ? 'bg-blue-900/50 border-blue-500 text-blue-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>--name (Assign specific name)</button>
             <button type="button" onClick={() => toggleFlag('p')} className={`text-left px-4 py-2 rounded text-sm font-mono border transition-all ${flags.p ? 'bg-blue-900/50 border-blue-500 text-blue-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>-p (Port Mapping host:container)</button>
          </div>

          <div className="lg:w-1/2 flex items-center justify-center relative min-h-[240px]">
             <div className="absolute inset-0 border-2 border-slate-700 rounded-xl p-2">
                <span className="text-slate-500 text-[10px] font-bold uppercase">Host Machine</span>
             </div>

             {flags.p && (
                <div className="absolute left-0 top-1/2 w-16 h-8 border-y-2 border-r-2 border-yellow-500/50 bg-yellow-900/20 -translate-y-1/2 rounded-r flex items-center justify-end pr-2 text-[10px] text-yellow-400 font-bold">
                   :8080 &rarr;
                </div>
             )}

             <div className={`w-48 h-48 rounded-xl border-4 flex flex-col items-center justify-center relative transition-all duration-300 shadow-2xl z-10 bg-slate-800 ${flags.it ? 'border-emerald-500' : 'border-blue-500'}`}>
                {flags.name ? (
                   <div className="absolute -top-3 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">my_ml_app</div>
                ) : (
                   <div className="absolute -top-3 bg-slate-600 text-slate-300 text-[10px] font-mono px-3 py-1 rounded-full line-through opacity-50">random_name_xyz</div>
                )}

                {flags.it ? (
                   <IconTerminal className="w-16 h-16 text-emerald-400 animate-pulse" />
                ) : flags.d ? (
                   <div className="flex flex-col items-center">
                     <IconServer className="w-12 h-12 text-slate-400 mb-2"/>
                     <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Running in BG</span>
                   </div>
                ) : (
                   <IconPlay className="w-12 h-12 text-blue-400" />
                )}

                {flags.p && (
                   <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-[10px] font-bold text-yellow-900 z-20 border-2 border-white shadow-lg">
                      80
                   </div>
                )}

                {flags.rm && (
                   <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-red-400 font-bold bg-red-900/30 px-2 py-1 rounded">
                      <IconTrash className="w-3 h-3"/> Auto-Del
                   </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export const VisualLifecycleFlow = () => {
  const [state, setState] = useState('none');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
     let interval;
     if (state === 'running') {
        let epoch = 1;
        interval = setInterval(() => {
           setLogs(prev => [...prev.slice(-4), `Epoch ${epoch}/100 - loss: ${(Math.random() * 0.5 + 0.1).toFixed(4)}`]);
           epoch++;
        }, 800);
     }
     return () => clearInterval(interval);
  }, [state]);

  const handleCommand = (cmd) => {
     if (cmd === 'run') { setState('running'); setLogs(['> docker run -d my_ml_image', '> Container started. ID: a1b2c3d4']); }
     if (cmd === 'stop') { setState('stopped'); setLogs(prev => [...prev, '> Received SIGTERM...', '> Gracefully stopped.']); }
     if (cmd === 'start') { setState('running'); setLogs(prev => [...prev, '> Resuming from checkpoint...']); }
     if (cmd === 'rm') { setState('removed'); setLogs(['> Container removed.']); setTimeout(() => setState('none'), 1500); }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 bg-slate-900 rounded-xl relative min-h-0 overflow-auto">
       <div className="flex-1 w-full relative flex items-center justify-center min-h-[220px] overflow-x-auto">
          <div className="relative min-w-[880px] h-52">
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
             <defs>
               <marker id="life-arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto"><polygon points="0 0, 8 4, 0 8" fill="#64748b" /></marker>
             </defs>
             <path d="M 40,100 L 150,100" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#life-arrow)"/>
             <path d="M 250,100 L 360,100" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#life-arrow)"/>
             <path d="M 470,88 Q 530,60 590,88" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#life-arrow)"/>
             <path d="M 590,112 Q 530,140 470,112" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#life-arrow)"/>
             <path d="M 690,100 L 760,100" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#life-arrow)"/>
             <path d="M 430,130 Q 430,170 800,170 L 800,120" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4,4" markerEnd="url(#life-arrow)"/>
          </svg>

          <div className="absolute top-[70px] left-[48px] text-[10px] text-slate-400 w-24 leading-tight">docker create (implicit in run)</div>
          <div className="absolute top-[78px] left-[255px] text-[10px] text-slate-400 w-24 leading-tight">docker start (or docker run)</div>
          <div className="absolute top-[48px] left-[490px] text-[10px] text-slate-400 text-center w-28 leading-tight">docker stop (or process exits)</div>
          <div className="absolute top-[124px] left-[510px] text-[10px] text-slate-400">docker start</div>
          <div className="absolute top-[78px] left-[700px] text-[10px] text-slate-400">docker rm</div>
          <div className="absolute top-[176px] left-[500px] text-[10px] text-slate-400">docker rm -f (or --rm)</div>

          <div className="absolute left-[155px] top-[80px] w-20 h-10 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-slate-400 z-10 shadow-lg">Created</div>

          <div className={`absolute left-[365px] top-[74px] w-24 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold z-10 shadow-lg transition-all duration-300 ${state === 'running' ? 'bg-emerald-900/50 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
             Running
          </div>

          <div className={`absolute left-[600px] top-[80px] w-20 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold z-10 shadow-lg transition-all duration-300 ${state === 'stopped' ? 'bg-orange-900/50 border-orange-400 text-orange-300 shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-110' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
             Stopped
          </div>

          <div className={`absolute left-[770px] top-[80px] w-20 h-10 rounded-sm border-2 border-dashed flex items-center justify-center text-xs font-bold z-10 shadow-lg transition-all duration-300 ${state === 'removed' ? 'bg-red-900/30 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-110' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
             Removed
          </div>
          </div>
       </div>

       <div className="h-40 w-full flex gap-6 z-20 shrink-0">
          <div className="w-1/3 flex flex-col gap-2">
             <button type="button" onClick={() => handleCommand('run')} disabled={state === 'running'} className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-mono text-xs rounded shadow-lg">docker run</button>
             <button type="button" onClick={() => handleCommand('stop')} disabled={state !== 'running'} className="w-full py-1.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-mono text-xs rounded shadow-lg">docker stop</button>
             <button type="button" onClick={() => handleCommand('start')} disabled={state !== 'stopped'} className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-mono text-xs rounded shadow-lg">docker start</button>
             <button type="button" onClick={() => handleCommand('rm')} disabled={state !== 'stopped'} className="w-full py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-mono text-xs rounded shadow-lg">docker rm</button>
          </div>

          <div className="w-2/3 bg-black border border-slate-700 rounded-lg flex flex-col overflow-hidden">
             <div className="bg-slate-800 px-3 py-1 text-[10px] font-bold text-slate-400 border-b border-slate-700 flex justify-between">
                <span>Terminal</span>
                <span className="text-pink-400">docker logs -f my_container</span>
             </div>
             <div className="p-3 font-mono text-xs text-green-400 flex flex-col justify-end h-full overflow-hidden">
                {state === 'none' ? (
                   <span className="text-slate-600 italic">Run a container to view logs...</span>
                ) : (
                   <>
                      {logs.map((log, i) => <div key={i}>{log}</div>)}
                      {state === 'running' && <div className="w-2 h-3 bg-green-400 animate-pulse mt-1"></div>}
                   </>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};
