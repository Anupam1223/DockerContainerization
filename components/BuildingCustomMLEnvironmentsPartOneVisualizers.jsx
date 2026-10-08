import React, { useEffect, useRef, useState } from 'react';

const IconFileCode = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconCheck = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconAlert = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const IconZap = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const IconClock = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconTrash = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconLayers = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;

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

const ANATOMY = [
  { num: 1, name: 'Base Image', code: 'FROM python:3.9-slim', desc: 'Sets the foundational OS and runtime.', color: 'bg-blue-600' },
  { num: 2, name: 'Metadata', code: 'LABEL maintainer="ml_team"', desc: 'Adds descriptive metadata.', color: 'bg-slate-600' },
  { num: 3, name: 'System Deps', code: 'RUN apt-get update && apt-get install -y git', desc: 'Installs OS-level C++ build tools or utilities.', color: 'bg-indigo-600' },
  { num: 4, name: 'Python Env', code: 'RUN pip install --upgrade pip', desc: 'Prepares the package manager.', color: 'bg-cyan-600' },
  { num: 5, name: 'Python Deps', code: 'COPY requirements.txt .\nRUN pip install -r requirements.txt', desc: 'Installs core libraries (TF, PyTorch). Highly cached.', color: 'bg-emerald-600' },
  { num: 6, name: 'Project Code', code: 'COPY . /app', desc: 'Copies frequently changing source code.', color: 'bg-purple-600' },
  { num: 7, name: 'Working Dir', code: 'WORKDIR /app', desc: 'Sets the execution context path.', color: 'bg-slate-600' },
  { num: 8, name: 'Expose Ports', code: 'EXPOSE 8080', desc: 'Documents network listening ports.', color: 'bg-slate-600' },
  { num: 9, name: 'Command', code: 'CMD ["python", "train.py"]', desc: 'Specifies the default execution trigger.', color: 'bg-pink-600' },
];

export function VisualDockerfileAnatomy() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="w-full h-full min-h-0 flex p-4 md:p-6 bg-slate-900 relative gap-4 overflow-hidden">
      <div className="w-1/3 flex flex-col gap-2 overflow-y-auto pr-2 min-h-0">
        {ANATOMY.map((step, idx) => (
          <button
            key={step.num}
            type="button"
            onMouseEnter={() => setActiveStep(idx)}
            onClick={() => setActiveStep(idx)}
            className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${activeStep === idx ? `${step.color} shadow-lg text-white scale-105 ml-2` : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${activeStep === idx ? 'bg-white/20' : 'bg-slate-900'}`}>{step.num}</div>
            <span className="font-semibold text-sm">{step.name}</span>
          </button>
        ))}
      </div>

      <div className="w-2/3 bg-slate-950 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-0">
        <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 text-xs text-slate-400 font-mono flex items-center gap-2 shrink-0">
          <IconFileCode className="w-4 h-4" /> Standard_ML_Dockerfile
        </div>
        <div className="p-4 md:p-6 flex flex-col font-mono text-xs gap-3 overflow-y-auto min-h-0">
          {ANATOMY.map((step, idx) => (
            <div key={step.num} className={`transition-all duration-300 p-2 rounded ${activeStep === idx ? 'bg-blue-900/30 border-l-4 border-blue-500 scale-105' : 'opacity-40'}`}>
              <div className="text-slate-500 mb-1 opacity-70"># {step.num}. {step.name}</div>
              <div className="text-slate-200 whitespace-pre-wrap">{step.code}</div>
            </div>
          ))}
        </div>
        <div className={`mt-auto p-4 border-t border-slate-800 text-sm font-bold transition-colors ${ANATOMY[activeStep].color} text-white shrink-0`}>
          {ANATOMY[activeStep].desc}
        </div>
      </div>
    </div>
  );
}

export function VisualBuildCache() {
  const [simState, setSimState] = useState('idle');
  const [triggerType, setTriggerType] = useState(null);
  const { after, clear } = useTimers();

  const runSimulation = (type) => {
    if (simState === 'building') return;
    clear();
    setTriggerType(type);
    setSimState('building');
    after(2500, () => setSimState(`done-${type}`));
  };

  const reset = () => {
    clear();
    setSimState('idle');
    setTriggerType(null);
  };

  const Block = ({ name, dependsOnReq, dependsOnCode, alwaysRebuild }) => {
    let status = 'cached';
    let anim = '';

    if (simState === 'idle') status = 'idle';
    else if (simState === 'building') {
      if (alwaysRebuild || (triggerType === 'code' && dependsOnCode) || (triggerType === 'req' && dependsOnReq)) {
        status = 'building';
        anim = 'animate-pulse';
      }
    } else if (alwaysRebuild || (triggerType === 'code' && dependsOnCode) || (triggerType === 'req' && dependsOnReq)) {
      status = 'rebuilt';
    }

    return (
      <div className={`flex-1 h-12 rounded flex items-center justify-center text-[9px] font-bold text-center px-1 transition-all duration-300 relative ${anim} ${status === 'idle' ? 'bg-slate-700 text-slate-400' : status === 'cached' ? 'bg-emerald-900/50 border border-emerald-500 text-emerald-400' : status === 'building' ? 'bg-orange-600 border border-orange-400 text-white shadow-[0_0_15px_rgba(234,88,12,0.5)]' : 'bg-red-900/50 border border-red-500 text-red-400'}`}>
        {name}
        {status === 'cached' && <IconZap className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-900 rounded-full text-emerald-400" />}
        {status === 'building' && <IconClock className="absolute -top-2 -right-2 w-4 h-4 bg-orange-900 rounded-full text-white animate-spin" />}
      </div>
    );
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col p-4 md:p-6 bg-slate-900 relative overflow-auto">
      <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
        <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Build Cache Optimization</div>
        <div className="flex gap-2 flex-wrap">
          <button type="button" onClick={() => runSimulation('code')} disabled={simState === 'building'} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded transition-all shadow-lg">Change App Code</button>
          <button type="button" onClick={() => runSimulation('req')} disabled={simState === 'building'} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold rounded transition-all shadow-lg">Change req.txt</button>
          <button type="button" onClick={reset} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded transition-all">Reset</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6 justify-center min-h-0">
        <div className="bg-slate-950 p-4 rounded-xl border-2 border-red-900/50 relative">
          <div className="absolute -top-3 left-4 bg-red-900/80 text-red-200 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500 uppercase tracking-wider">Less Optimal Order</div>
          <div className="flex gap-1.5 w-full mt-2">
            <Block name="FROM python" />
            <Block name="COPY . /app" alwaysRebuild />
            <Block name="RUN pip install" dependsOnReq dependsOnCode />
          </div>
          <div className="h-8 mt-2 flex items-center justify-center">
            <div className={`text-xs text-red-400 transition-opacity duration-500 text-center ${simState.startsWith('done') && triggerType === 'code' ? 'opacity-100' : 'opacity-0'}`}>
              <strong>Cache Miss:</strong> Editing source code forces a full re-download of all pip packages because the COPY was placed too early!
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border-2 border-emerald-900/50 relative">
          <div className="absolute -top-3 left-4 bg-emerald-900/80 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500 uppercase tracking-wider">Cache Optimized Order</div>
          <div className="flex gap-1.5 w-full mt-2">
            <Block name="FROM python" />
            <Block name="COPY reqs.txt" dependsOnReq />
            <Block name="RUN pip install" dependsOnReq />
            <Block name="COPY . /app" dependsOnCode dependsOnReq />
          </div>
          <div className="h-8 mt-2 flex items-center justify-center">
            <div className={`text-xs text-emerald-400 transition-opacity duration-500 text-center ${simState.startsWith('done') && triggerType === 'code' ? 'opacity-100' : 'opacity-0'}`}>
              <strong>Cache Hit!</strong> pip dependencies were heavily cached. Only the final source code layer needed to rebuild.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualMaintainability() {
  const [optimized, setOptimized] = useState(false);

  return (
    <div className="w-full h-full min-h-0 flex flex-col items-center justify-center p-4 md:p-6 bg-slate-900 relative overflow-auto">
      <div className="flex items-center justify-center gap-4 mb-8">
        <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Grouping Commands</span>
        <button type="button" onClick={() => setOptimized(!optimized)} className={`px-6 py-2 rounded-full text-white font-bold transition-all shadow-lg ${optimized ? 'bg-slate-700 hover:bg-slate-600' : 'bg-emerald-600 hover:bg-emerald-500 animate-pulse'}`}>
          {optimized ? 'Revert to Unoptimized' : 'Optimize Dockerfile'}
        </button>
      </div>

      <div className="w-full max-w-3xl bg-slate-950 rounded-xl border-2 border-slate-700 p-6 flex flex-col md:flex-row gap-8 relative overflow-hidden">
        <div className="flex-1 font-mono text-xs">
          <div className="text-slate-500 mb-4 font-bold border-b border-slate-800 pb-2">Dockerfile Source</div>
          {optimized ? (
            <div className="animate-[fadeIn_0.5s_ease-out] text-slate-300">
              <span className="text-emerald-500">RUN</span> apt-get update \<br />
              &nbsp;&nbsp;<span className="text-blue-400">&amp;&amp;</span> apt-get install -y package1 \<br />
              &nbsp;&nbsp;<span className="text-blue-400">&amp;&amp;</span> apt-get install -y package2 \<br />
              &nbsp;&nbsp;<span className="text-blue-400">&amp;&amp;</span> rm -rf /var/lib/apt/lists/*
            </div>
          ) : (
            <div className="animate-[fadeIn_0.5s_ease-out] text-slate-300">
              <span className="text-red-400">RUN</span> apt-get update<br />
              <span className="text-red-400">RUN</span> apt-get install -y package1<br />
              <span className="text-red-400">RUN</span> apt-get install -y package2<br />
              <span className="text-red-400">RUN</span> rm -rf /var/lib/apt/lists/*
            </div>
          )}
        </div>

        <div className="w-px bg-slate-800 hidden md:block" />

        <div className="md:w-1/3 flex flex-col">
          <div className="text-slate-500 mb-4 font-bold border-b border-slate-800 pb-2 text-center">Resulting Image Layers</div>
          <div className="flex-1 flex flex-col justify-end gap-1 relative min-h-[10rem]">
            {optimized ? (
              <div className="w-full bg-emerald-900/40 border border-emerald-500 rounded p-2 text-center flex flex-col justify-center h-24 animate-[slideDown_0.5s_ease-out] shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <span className="text-emerald-400 font-bold text-sm mb-1">1 Single Layer</span>
                <span className="text-emerald-200/50 text-[10px] leading-tight">Combined updates & installation.<br />Cleaned cache immediately.</span>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-1 animate-[fadeIn_0.5s_ease-out]">
                <div className="w-full bg-slate-800 border border-red-500/50 rounded py-1 text-center text-[10px] text-slate-300">Layer: rm -rf (Too late!)</div>
                <div className="w-full bg-slate-800 border border-red-500/50 rounded py-1 text-center text-[10px] text-slate-300">Layer: install package2</div>
                <div className="w-full bg-slate-800 border border-red-500/50 rounded py-1 text-center text-[10px] text-slate-300">Layer: install package1</div>
                <div className="w-full bg-slate-800 border border-red-500/50 rounded py-1 text-center text-[10px] text-slate-300">Layer: apt update (Bloated)</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const BASES = {
  slim: { title: 'python:3.9-slim', size: '150 MB', c_lib: 'glibc (Standard)', ml_compat: 'High (Wheels work)', warning: null, color: 'border-blue-500' },
  alpine: { title: 'python:3.9-alpine', size: '50 MB', c_lib: 'musl libc (Non-Standard)', ml_compat: 'Low (Compiles from source)', warning: 'DANGER: Highly likely to break ML libraries that rely on pre-compiled C extensions.', color: 'border-red-500' },
  ubuntu: { title: 'ubuntu:22.04', size: '75 MB', c_lib: 'glibc', ml_compat: 'High', warning: 'Requires manual Python installation via RUN commands.', color: 'border-orange-500' },
};

export function VisualBaseImageFactors() {
  const [activeTab, setActiveTab] = useState('slim');
  const item = BASES[activeTab];

  return (
    <div className="w-full h-full min-h-0 flex flex-col p-6 bg-slate-900 relative items-center justify-center overflow-auto">
      <div className="flex gap-4 mb-8 flex-wrap justify-center">
        <button type="button" onClick={() => setActiveTab('slim')} className={`px-4 py-2 rounded-lg font-bold text-sm border-2 transition-all ${activeTab === 'slim' ? 'bg-blue-900/50 border-blue-500 text-blue-300' : 'bg-slate-800 border-transparent text-slate-500'}`}>python:-slim</button>
        <button type="button" onClick={() => setActiveTab('alpine')} className={`px-4 py-2 rounded-lg font-bold text-sm border-2 transition-all ${activeTab === 'alpine' ? 'bg-red-900/50 border-red-500 text-red-300' : 'bg-slate-800 border-transparent text-slate-500'}`}>python:-alpine</button>
        <button type="button" onClick={() => setActiveTab('ubuntu')} className={`px-4 py-2 rounded-lg font-bold text-sm border-2 transition-all ${activeTab === 'ubuntu' ? 'bg-orange-900/50 border-orange-500 text-orange-300' : 'bg-slate-800 border-transparent text-slate-500'}`}>OS (Ubuntu)</button>
      </div>

      <div className={`w-full max-w-xl rounded-2xl p-6 border shadow-2xl bg-slate-950 ${item.color}`}>
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4 gap-3">
          <div className="text-xl font-mono font-bold text-white">{item.title}</div>
          <div className="bg-slate-800 px-3 py-1 rounded text-slate-300 text-sm font-bold flex items-center gap-2 shrink-0">
            <IconLayers className="w-4 h-4" /> {item.size}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
          <div><strong className="text-slate-500 block mb-1">C Standard Library:</strong> <span className={activeTab === 'alpine' ? 'text-red-400 font-bold' : 'text-emerald-400'}>{item.c_lib}</span></div>
          <div><strong className="text-slate-500 block mb-1">ML Compatibility:</strong> <span className={activeTab === 'alpine' ? 'text-red-400 font-bold' : 'text-emerald-400'}>{item.ml_compat}</span></div>
        </div>
        {item.warning && (
          <div className={`mt-6 p-3 rounded-lg flex items-start gap-3 text-sm ${activeTab === 'alpine' ? 'bg-red-900/40 text-red-300 border border-red-500/50' : 'bg-orange-900/40 text-orange-300 border border-orange-500/50'}`}>
            <IconAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>{item.warning}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function VisualCudaVariants() {
  return (
    <div className="w-full h-full min-h-0 flex flex-col p-6 bg-slate-900 relative items-center justify-center overflow-auto">
      <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">NVIDIA CUDA Base Images Anatomy</div>
      <div className="flex w-full max-w-4xl justify-between items-end gap-4">
        <div className="w-1/3 flex flex-col items-center">
          <div className="bg-emerald-900/20 border-2 border-emerald-500 w-full h-24 rounded-lg flex items-center justify-center text-emerald-400 font-bold text-sm shadow-lg">CUDA Core Libs</div>
          <div className="mt-4 bg-slate-800 text-white font-mono text-[10px] px-3 py-1.5 rounded-full shadow">...-base-ubuntu22.04</div>
          <div className="text-slate-500 text-[10px] mt-2 text-center">~ 150 MB<br />(Bare minimum, often useless for ML)</div>
        </div>
        <div className="w-1/3 flex flex-col items-center">
          <div className="bg-blue-900/20 border-2 border-blue-500 w-full h-40 rounded-lg flex flex-col justify-end p-2 text-blue-400 font-bold text-sm shadow-lg relative">
            <div className="absolute top-2 left-2 right-2 h-12 bg-blue-600/30 border border-blue-400/50 rounded flex items-center justify-center text-xs text-blue-200">cuDNN + Math Libs</div>
            <div className="text-center mb-2">CUDA Core Libs</div>
          </div>
          <div className="mt-4 bg-slate-800 text-white font-mono text-[10px] px-3 py-1.5 rounded-full shadow border border-blue-500">...-runtime-ubuntu22.04</div>
          <div className="text-slate-500 text-[10px] mt-2 text-center">~ 2.5 GB<br />(Standard for pre-compiled Inference)</div>
        </div>
        <div className="w-1/3 flex flex-col items-center">
          <div className="bg-purple-900/20 border-2 border-purple-500 w-full h-56 rounded-lg flex flex-col justify-end p-2 text-purple-400 font-bold text-sm shadow-lg relative">
            <div className="absolute top-2 left-2 right-2 h-12 bg-purple-600/30 border border-purple-400/50 rounded flex items-center justify-center text-xs text-purple-200">nvcc Compiler & Headers</div>
            <div className="absolute top-16 left-2 right-2 h-12 bg-blue-600/30 border border-blue-400/50 rounded flex items-center justify-center text-xs text-blue-200">cuDNN + Math Libs</div>
            <div className="text-center mb-2">CUDA Core Libs</div>
          </div>
          <div className="mt-4 bg-slate-800 text-white font-mono text-[10px] px-3 py-1.5 rounded-full shadow">...-devel-ubuntu22.04</div>
          <div className="text-slate-500 text-[10px] mt-2 text-center">~ 5.0 GB<br />(Required for compiling PyTorch/TF)</div>
        </div>
      </div>
    </div>
  );
}

const TREE = {
  start: { text: "What's the primary need for the project?", opts: [{ label: 'GPU Acceleration', next: 'gpu' }, { label: 'Standard CPU ML', next: 'cpu_python' }, { label: 'Specific OS Control', next: 'os_base' }] },
  gpu: { text: 'Prefer a Specific Framework Pre-installed?', opts: [{ label: 'Yes (TensorFlow/PyTorch)', next: 'framework' }, { label: 'No (Custom Stack)', next: 'nvidia' }] },
  framework: { text: 'Use Official Framework Image', result: 'tensorflow/tensorflow:latest-gpu', desc: 'Best for immediate productivity. Heavy, but includes matching CUDA, cuDNN, and the framework.', color: 'bg-emerald-600' },
  nvidia: { text: 'Use NVIDIA CUDA Base Image', result: 'nvidia/cuda:...-runtime-ubuntu22.04', desc: 'Provides GPU drivers and CUDA. You will need to install Python and libraries manually on top.', color: 'bg-blue-600' },
  cpu_python: { text: 'Use Official Python Image', result: 'python:3.9-slim', desc: "The standard starting point. The '-slim' variant removes unnecessary OS packages to reduce size. AVOID -alpine.", color: 'bg-indigo-600' },
  os_base: { text: 'Use Bare OS Image', result: 'ubuntu:22.04', desc: 'Maximum control. Necessary if your project compiles complex C++ dependencies or needs specific system services.', color: 'bg-orange-600' },
};

export function VisualBaseImageTree() {
  const [path, setPath] = useState(['start']);
  const reset = () => setPath(['start']);
  const handleSelect = (nextId) => setPath((current) => [...current, nextId]);

  return (
    <div className="w-full h-full min-h-0 flex flex-col items-center p-6 bg-slate-900 relative overflow-hidden">
      <button type="button" onClick={reset} className="absolute top-4 right-16 text-xs text-slate-400 hover:text-white underline z-30">Restart Flow</button>
      <div className="flex-1 w-full flex flex-col items-center justify-start gap-2 mt-4 overflow-y-auto min-h-0">
        {path.map((nodeId, index) => {
          const node = TREE[nodeId];
          const isLast = index === path.length - 1;
          return (
            <div key={`${nodeId}-${index}`} className="flex flex-col items-center animate-[fadeIn_0.4s_ease-out]">
              <div className={`p-4 rounded-xl shadow-lg border-2 max-w-sm text-center ${node.result ? `${node.color} border-transparent text-white` : 'bg-slate-800 border-slate-600 text-slate-200'}`}>
                <div className={node.result ? 'font-bold text-lg mb-2' : 'font-semibold text-sm'}>{node.text}</div>
                {node.result && (
                  <>
                    <div className="bg-black/30 font-mono text-xs px-3 py-1.5 rounded inline-block mb-3 border border-white/20">FROM {node.result}</div>
                    <div className="text-[11px] text-white/80 leading-relaxed">{node.desc}</div>
                  </>
                )}
              </div>
              {isLast && node.opts && (
                <div className="flex gap-3 mt-4 flex-wrap justify-center">
                  {node.opts.map((opt) => (
                    <button key={opt.next} type="button" onClick={() => handleSelect(opt.next)} className="px-4 py-2 bg-slate-700 hover:bg-blue-600 text-slate-200 hover:text-white rounded-full text-xs font-bold transition-colors border border-slate-600 hover:border-blue-400 shadow-md">
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
              {!isLast && <div className="h-6 w-0.5 bg-slate-600 my-2" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function VisualDependencyPinning() {
  const [month, setMonth] = useState(1);
  const unpinnedStatus = month === 1 ? 'works' : month === 2 ? 'warning' : 'broken';

  return (
    <div className="w-full h-full min-h-0 flex flex-col p-4 md:p-6 bg-slate-900 relative overflow-auto">
      <div className="flex justify-center items-center gap-3 mb-6 flex-wrap">
        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">Timeline:</div>
        <button type="button" onClick={() => setMonth(1)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${month >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>Month 1</button>
        <div className={`h-0.5 w-8 ${month >= 2 ? 'bg-blue-500' : 'bg-slate-700'}`} />
        <button type="button" onClick={() => setMonth(2)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${month >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>Month 2 (Minor Update)</button>
        <div className={`h-0.5 w-8 ${month >= 3 ? 'bg-blue-500' : 'bg-slate-700'}`} />
        <button type="button" onClick={() => setMonth(3)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${month >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>Month 3 (Major Update)</button>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 bg-slate-950 rounded-xl border border-slate-700 p-4 md:p-6 flex flex-col min-w-0">
          <div className="text-white font-bold mb-4 border-b border-slate-800 pb-2 flex justify-between items-center gap-2 text-sm">
            Unpinned Approach
            {unpinnedStatus === 'works' && <span className="bg-emerald-900/50 text-emerald-400 text-[10px] px-2 py-1 rounded">Builds OK</span>}
            {unpinnedStatus === 'warning' && <span className="bg-yellow-900/50 text-yellow-400 text-[10px] px-2 py-1 rounded">Deprecation Warnings</span>}
            {unpinnedStatus === 'broken' && <span className="bg-red-900/50 text-red-400 text-[10px] px-2 py-1 rounded animate-pulse">Build Failed!</span>}
          </div>
          <div className="bg-slate-900 p-3 rounded font-mono text-xs text-slate-300 mb-6">RUN pip install pandas</div>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex flex-col items-center justify-center border-4 border-slate-700 shadow-xl">
              <IconZap className={`w-8 h-8 ${unpinnedStatus === 'works' ? 'text-emerald-400' : unpinnedStatus === 'warning' ? 'text-yellow-400' : 'text-red-500 animate-bounce'}`} />
              <div className="mt-2 text-xs font-bold text-white">pandas v{month === 1 ? '1.5.0' : month === 2 ? '1.5.3' : '2.0.0'}</div>
            </div>
            {unpinnedStatus === 'broken' && (
              <div className="mt-4 text-red-400 text-xs font-bold bg-red-900/20 py-2 px-3 rounded text-center">API changed in v2.0.0! Your code crashes.</div>
            )}
          </div>
        </div>

        <div className="flex-1 bg-slate-950 rounded-xl border-2 border-emerald-900/50 p-4 md:p-6 flex flex-col min-w-0 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="text-white font-bold mb-4 border-b border-slate-800 pb-2 flex justify-between items-center gap-2 text-sm">
            Pinned Approach
            <span className="bg-emerald-900/50 text-emerald-400 text-[10px] px-2 py-1 rounded">Builds OK (Always)</span>
          </div>
          <div className="bg-slate-900 p-3 rounded font-mono text-xs text-emerald-300 mb-6 border border-emerald-900/50">RUN pip install pandas==1.5.0</div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-emerald-900/30 rounded-full flex flex-col items-center justify-center border-4 border-emerald-500 shadow-xl">
              <IconCheck className="w-8 h-8 text-emerald-400" />
              <div className="mt-2 text-xs font-bold text-emerald-300">pandas v1.5.0</div>
            </div>
            <div className="mt-4 text-emerald-400 text-xs font-bold bg-emerald-900/20 py-2 px-3 rounded text-center">Exact version pulled. 100% Reproducible.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualPipCache() {
  const [step, setStep] = useState(0);
  const { after, clear } = useTimers();

  const runSimulation = () => {
    clear();
    setStep(1);
    after(1500, () => setStep(2));
    after(3000, () => setStep(3));
  };

  const reset = () => {
    clear();
    setStep(0);
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col p-4 md:p-6 bg-slate-900 relative overflow-auto">
      <div className="flex justify-between items-center mb-8 gap-3">
        <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">--no-cache-dir Optimization</div>
        <button type="button" onClick={step === 0 ? runSimulation : step === 3 ? reset : undefined} className={`px-4 py-2 rounded text-xs font-bold transition-all ${step === 0 || step === 3 ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-500' : 'bg-slate-700 text-slate-500'}`}>
          {step === 0 ? 'Build Image' : step === 3 ? 'Reset' : 'Building...'}
        </button>
      </div>

      <div className="flex w-full gap-6 justify-center flex-1 min-h-0">
        <div className="w-64 bg-slate-950 border border-slate-700 rounded-xl p-4 flex flex-col relative overflow-hidden">
          <div className="text-center font-mono text-[10px] text-red-400 bg-red-900/20 py-1.5 rounded mb-4">RUN pip install -r req.txt</div>
          <div className="flex-1 relative flex flex-col justify-end pb-4">
            <div className="w-full border-t-2 border-dashed border-slate-600 pt-4 flex flex-col gap-2 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-950 px-2 text-[10px] text-slate-500 uppercase tracking-widest">Disk Space</span>
              <div className={`w-full h-16 bg-blue-900/50 border border-blue-500 rounded flex items-center justify-center text-xs font-bold text-blue-300 text-center transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>Installed Python Libs<br />(1.0 GB)</div>
              <div className={`w-full h-12 bg-red-900/50 border border-red-500 rounded flex flex-col items-center justify-center text-[10px] font-bold text-red-300 text-center transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>Downloaded Wheels Cache<br />(500 MB Wasted)</div>
            </div>
          </div>
          <div className={`mt-2 text-center text-xs font-bold ${step === 3 ? 'text-red-400' : 'opacity-0'}`}>Final Image Size: 1.5GB</div>
        </div>

        <div className="w-64 bg-slate-950 border-2 border-emerald-900/50 rounded-xl p-4 flex flex-col relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="text-center font-mono text-[10px] text-emerald-400 bg-emerald-900/20 py-1.5 rounded mb-4">RUN pip install --no-cache-dir</div>
          <div className="flex-1 relative flex flex-col justify-end pb-4">
            <div className="w-full border-t-2 border-dashed border-emerald-800 pt-4 flex flex-col gap-2 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-950 px-2 text-[10px] text-emerald-600 uppercase tracking-widest">Disk Space</span>
              <div className={`w-full h-16 bg-blue-900/50 border border-blue-500 rounded flex items-center justify-center text-xs font-bold text-blue-300 text-center transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>Installed Python Libs<br />(1.0 GB)</div>
              {step >= 1 && step < 3 && (
                <div className="w-full h-12 border border-red-500/30 border-dashed rounded flex items-center justify-center text-[10px] text-red-400/70">Temp Caching...</div>
              )}
              {step === 3 && (
                <div className="w-full h-12 flex items-center justify-center text-[10px] text-emerald-400 font-bold bg-emerald-900/20 rounded animate-[fadeIn_0.5s_ease-out]">
                  <IconTrash className="w-4 h-4 mr-1" /> Cache Auto-Deleted
                </div>
              )}
            </div>
          </div>
          <div className={`mt-2 text-center text-xs font-bold ${step === 3 ? 'text-emerald-400' : 'opacity-0'}`}>Final Image Size: 1.0GB</div>
        </div>
      </div>
    </div>
  );
}
