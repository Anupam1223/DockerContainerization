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

export const VisualDependencyDiagram = () => {
  const [mode, setMode] = useState('host');

  return (
    <div className="w-full h-full flex flex-col items-center p-4 bg-slate-900 rounded-xl relative min-h-0">
      <div className="flex bg-slate-800 p-1 rounded-lg mb-4 z-20 shrink-0">
        <button type="button" onClick={() => setMode('host')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === 'host' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Host Machine (Without Containers)</button>
        <button type="button" onClick={() => setMode('docker')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === 'docker' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>With Docker Containers</button>
      </div>

      <div className="relative w-full flex-1 min-h-[420px] border-2 border-slate-700 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-4">
        <div className={`absolute inset-0 transition-opacity duration-500 p-8 flex flex-col items-center ${mode === 'host' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
           <div className="flex w-full justify-around mb-12">
             <div className="bg-purple-300 text-purple-900 font-bold px-6 py-3 rounded-full z-10 w-32 text-center text-sm shadow-lg">Project B</div>
             <div className="bg-yellow-200 text-yellow-900 font-bold px-6 py-3 rounded-full z-10 w-32 text-center text-sm shadow-lg">Project A</div>
           </div>

           <div className="flex w-full justify-around mb-16 relative">
             <div className="bg-sky-300 text-sky-900 font-bold px-4 py-2 rounded z-10 text-sm shadow-md">libraryX v2.0</div>
             <div className="bg-pink-300 text-pink-900 font-bold px-4 py-2 rounded z-10 text-sm shadow-md">libraryX v1.0</div>
           </div>

           <div className="bg-slate-200 text-slate-900 font-bold px-6 py-2 rounded-full z-10 mb-12 text-sm shadow-md">System Python</div>

           <div className="flex w-full justify-around mt-auto pb-4">
             <div className="bg-indigo-300 text-indigo-900 font-bold px-4 py-2 rounded z-10 text-sm shadow-md">PyTorch</div>
             <div className="bg-orange-300 text-orange-900 font-bold px-4 py-2 rounded z-10 text-sm shadow-md">TensorFlow</div>
           </div>

           <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 230,80 Q 250,110 210,140" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <text x="235" y="115" className="text-[10px] fill-slate-400">Needs</text>
              <path d="M 520,80 Q 500,110 540,140" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <text x="500" y="115" className="text-[10px] fill-slate-400">Needs</text>
              <path d="M 230,170 Q 270,220 350,260" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead-red)"/>
              <text x="250" y="220" className="text-[10px] fill-red-500 font-bold">Conflicts?</text>
              <path d="M 520,170 Q 480,220 400,260" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead-red)"/>
              <text x="450" y="220" className="text-[10px] fill-red-500 font-bold">Conflicts?</text>
              <path d="M 350,290 L 230,360" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <path d="M 400,290 L 520,360" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <path d="M 180,80 Q 100,200 180,360" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <path d="M 570,80 Q 650,200 570,360" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>
           </svg>
        </div>

        <div className={`absolute inset-0 transition-opacity duration-500 flex justify-center gap-4 p-4 ${mode === 'docker' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
           <div className="w-[45%] h-full bg-purple-200 border-2 border-purple-400 relative flex flex-col p-4 shadow-lg">
              <div className="text-center font-bold text-purple-900 mb-6 text-sm">Container B</div>
              <div className="flex justify-around mb-auto">
                 <div className="bg-purple-300 text-purple-900 border border-purple-900 font-bold px-4 py-2 rounded-full z-10 text-xs">Project B</div>
                 <div className="bg-purple-300 text-purple-900 border border-purple-900 font-bold px-4 py-2 rounded-full z-10 text-xs">Python</div>
              </div>
              <div className="flex justify-around mt-auto pb-4">
                 <div className="bg-indigo-300 text-indigo-900 border border-indigo-900 font-bold px-3 py-1.5 rounded z-10 text-xs">PyTorch</div>
                 <div className="bg-sky-300 text-sky-900 border border-sky-900 font-bold px-3 py-1.5 rounded z-10 text-xs">libraryX v2.0</div>
              </div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                 <path d="M 70,100 Q 70,150 70,230" fill="none" stroke="#4c1d95" strokeWidth="2" markerEnd="url(#arrowhead-purple)"/>
                 <path d="M 80,100 Q 100,150 170,230" fill="none" stroke="#4c1d95" strokeWidth="2" markerEnd="url(#arrowhead-purple)"/>
                 <path d="M 220,100 Q 200,150 110,230" fill="none" stroke="#4c1d95" strokeWidth="2" markerEnd="url(#arrowhead-purple)"/>
                 <path d="M 230,100 Q 230,150 230,230" fill="none" stroke="#4c1d95" strokeWidth="2" markerEnd="url(#arrowhead-purple)"/>
              </svg>
           </div>

           <div className="w-[45%] h-full bg-yellow-100 border-2 border-yellow-400 relative flex flex-col p-4 shadow-lg">
              <div className="text-center font-bold text-yellow-900 mb-6 text-sm">Container A</div>
              <div className="flex justify-around mb-auto">
                 <div className="bg-yellow-200 text-yellow-900 border border-yellow-900 font-bold px-4 py-2 rounded-full z-10 text-xs">Project A</div>
                 <div className="bg-yellow-200 text-yellow-900 border border-yellow-900 font-bold px-4 py-2 rounded-full z-10 text-xs">Python</div>
              </div>
              <div className="flex justify-around mt-auto pb-4">
                 <div className="bg-orange-300 text-orange-900 border border-orange-900 font-bold px-3 py-1.5 rounded z-10 text-xs">TensorFlow</div>
                 <div className="bg-pink-300 text-pink-900 border border-pink-900 font-bold px-3 py-1.5 rounded z-10 text-xs">libraryX v1.0</div>
              </div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                 <path d="M 70,100 Q 70,150 70,230" fill="none" stroke="#713f12" strokeWidth="2" markerEnd="url(#arrowhead-yellow)"/>
                 <path d="M 80,100 Q 100,150 170,230" fill="none" stroke="#713f12" strokeWidth="2" markerEnd="url(#arrowhead-yellow)"/>
                 <path d="M 220,100 Q 200,150 110,230" fill="none" stroke="#713f12" strokeWidth="2" markerEnd="url(#arrowhead-yellow)"/>
                 <path d="M 230,100 Q 230,150 230,230" fill="none" stroke="#713f12" strokeWidth="2" markerEnd="url(#arrowhead-yellow)"/>
              </svg>
           </div>
        </div>

        <svg className="absolute w-0 h-0">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" /></marker>
            <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" /></marker>
            <marker id="arrowhead-purple" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#4c1d95" /></marker>
            <marker id="arrowhead-yellow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#713f12" /></marker>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export const VisualConsistencyAndCollab = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-900 rounded-xl relative overflow-hidden">
      <div className="text-center font-bold text-slate-400 mb-8 tracking-widest text-sm uppercase">The Single Source of Truth</div>

      <div className="w-full h-72 relative flex items-center justify-center">
         <div className="absolute z-20 flex flex-col items-center top-[10%]">
            <div className="bg-blue-600 px-6 py-4 rounded-xl border-2 border-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.4)] flex flex-col items-center">
               <IconDocker className="w-10 h-10 text-white mb-2" />
               <div className="text-white font-bold text-sm">Container Image</div>
               <div className="text-blue-200 text-[10px] bg-blue-900/50 px-2 py-0.5 mt-1 rounded font-mono">Built from Dockerfile</div>
            </div>
         </div>

         <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <path d="M 370,120 Q 200,120 200,200" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="4,4" className="path-flow"/>
            <path d="M 370,120 Q 370,160 370,200" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="4,4" className="path-flow"/>
            <path d="M 370,120 Q 540,120 540,200" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="4,4" className="path-flow"/>
         </svg>

         <div className="absolute bottom-[10%] w-full flex justify-between px-8 z-20">
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-slate-800 rounded-lg border border-slate-600 flex items-center justify-center mb-2 shadow-lg"><IconLaptop className="w-8 h-8 text-slate-300"/></div>
               <div className="text-white text-xs font-bold text-center">Local Dev<br/><span className="text-slate-400 font-normal">macOS/Windows</span></div>
            </div>

            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-slate-800 rounded-lg border border-slate-600 flex items-center justify-center mb-2 shadow-lg"><IconServer className="w-8 h-8 text-slate-300"/></div>
               <div className="text-white text-xs font-bold text-center">CI/CD Tests<br/><span className="text-slate-400 font-normal">Linux Servers</span></div>
            </div>

            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-slate-800 rounded-lg border border-slate-600 flex items-center justify-center mb-2 shadow-lg relative overflow-hidden">
                 <IconBox className="w-6 h-6 text-blue-400 absolute top-2 left-2"/>
                 <IconBox className="w-6 h-6 text-blue-400 absolute bottom-2 right-2"/>
                 <IconBox className="w-6 h-6 text-blue-400 absolute top-2 right-2"/>
               </div>
               <div className="text-white text-xs font-bold text-center">Cloud Deploy<br/><span className="text-slate-400 font-normal">Kubernetes / ECS</span></div>
            </div>
         </div>
      </div>
    </div>
  );
};

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
