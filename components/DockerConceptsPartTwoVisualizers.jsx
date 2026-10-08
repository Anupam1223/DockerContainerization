import React, { useEffect, useRef, useState } from 'react';

const IconServer = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>;
const IconFileCode = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconCloud = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
const IconArrowRight = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
const IconBox = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const IconLock = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const IconCheck = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;

function useTimers() {
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const after = (ms, fn) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };
  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  return { after, clear };
}

export function VisualBuildContext() {
  const [buildPhase, setBuildPhase] = useState(0);
  const { after, clear } = useTimers();

  const triggerBuild = () => {
    clear();
    setBuildPhase(1);
    after(2000, () => setBuildPhase(2));
    after(4500, () => setBuildPhase(3));
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col items-center justify-center p-6 bg-slate-900 relative overflow-auto">
      <div className="bg-black/50 border border-slate-700 px-6 py-3 rounded-lg flex items-center gap-3 mb-8 shadow-lg z-20">
        <span className="text-emerald-400 font-mono">$</span>
        <span className="text-slate-300 font-mono text-sm">
          docker build -t my-ml-app <strong className="text-pink-500 text-lg bg-pink-500/20 px-1 rounded animate-pulse">.</strong>
        </span>
        <button type="button" onClick={triggerBuild} disabled={buildPhase > 0 && buildPhase < 3} className="ml-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-3 py-1 rounded text-xs font-bold transition-all">
          {buildPhase === 0 ? 'Execute' : buildPhase === 3 ? 'Run again' : 'Building...'}
        </button>
      </div>

      <div className="flex w-full justify-between items-center px-4 md:px-12 relative z-10 gap-2">
        <div className="flex flex-col items-center shrink-0">
          <div className="text-slate-400 font-bold mb-2 text-sm">Local Directory (Context)</div>
          <div className="bg-slate-800 border-2 border-slate-600 p-4 rounded-xl shadow-2xl relative w-48 h-56 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-300 text-xs bg-slate-900/50 p-2 rounded"><IconFileCode className="w-4 h-4 text-blue-400" /> Dockerfile</div>
            <div className="flex items-center gap-2 text-slate-300 text-xs bg-slate-900/50 p-2 rounded"><IconFileCode className="w-4 h-4 text-yellow-400" /> train.py</div>
            <div className="flex items-center gap-2 text-slate-300 text-xs bg-slate-900/50 p-2 rounded"><IconFileCode className="w-4 h-4 text-emerald-400" /> requirements.txt</div>
            <div className="flex items-center gap-2 text-slate-300 text-xs bg-slate-900/50 p-2 rounded border border-red-500/30"><IconFileCode className="w-4 h-4 text-red-400" /> massive_dataset.csv (10GB)</div>
            {buildPhase === 1 && (
              <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-[1px] border-2 border-blue-400 rounded-xl flex items-center justify-center flex-col z-10">
                <svg className="w-8 h-8 text-blue-400 animate-spin mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                <span className="text-[10px] font-bold text-blue-200 text-center">Packaging Context...<br />(Including 10GB file!)</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 h-32 relative mx-4 flex items-center justify-center min-w-0">
          <svg className="w-full h-8" preserveAspectRatio="none">
            <path d="M0,16 L1000,16" stroke="#475569" strokeWidth="2" strokeDasharray="6,6" fill="none" />
            {buildPhase >= 1 && (
              <path d="M0,16 L1000,16" stroke="#3b82f6" strokeWidth="4" strokeDasharray="10,10" fill="none" className="animate-[dash_1s_linear_infinite]" />
            )}
          </svg>
          <div className="absolute -top-4 text-[10px] font-bold text-slate-500 text-center w-full">The <strong className="text-pink-400">dot (.)</strong> tells Docker to send<br />this ENTIRE folder to the Daemon.</div>
        </div>

        <div className="flex flex-col items-center shrink-0">
          <div className="text-blue-400 font-bold mb-2 text-sm">Docker Daemon (Engine)</div>
          <div className="bg-blue-950 border-2 border-blue-800 p-4 rounded-xl shadow-[0_0_30px_rgba(30,58,138,0.4)] relative w-48 h-56 flex flex-col justify-end items-center pb-2">
            <div className="w-full flex flex-col gap-1 items-center z-10 relative">
              <div className={`w-full h-8 bg-slate-700 border border-slate-500 rounded flex items-center justify-center text-[10px] text-white font-bold transition-all duration-500 ${buildPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Base OS Layer</div>
              <div className={`w-full h-8 bg-indigo-800 border border-indigo-500 rounded flex items-center justify-center text-[10px] text-white font-bold transition-all duration-500 delay-300 ${buildPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Dependencies Layer</div>
              <div className={`w-full h-8 bg-emerald-800 border border-emerald-500 rounded flex items-center justify-center text-[10px] text-white font-bold transition-all duration-500 delay-700 ${buildPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Source Code Layer</div>
              {buildPhase === 3 && (
                <div className="absolute -top-12 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce flex items-center gap-1">
                  <IconCheck className="w-4 h-4" /> Image Built
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {buildPhase > 0 && (
        <div className="mt-6 bg-red-900/30 border border-red-500 p-3 rounded-lg max-w-lg text-xs text-red-200 animate-[fadeIn_0.5s_ease-out]">
          <strong className="text-red-400">Pro Tip:</strong> Notice how the massive CSV file was sent to the Daemon even if it wasn&apos;t copied into the image? Use a <code>.dockerignore</code> file to prevent large files from slowing down your build context transfer!
        </div>
      )}
    </div>
  );
}

const INSTRUCTIONS = [
  { id: 'RUN', code: 'RUN pip install -r req.txt', desc: 'Executes commands IN A NEW LAYER during the build process. Used for installing packages.' },
  { id: 'COPY', code: 'COPY . /app', desc: 'Moves files from the host (build context) into the image filesystem.' },
  { id: 'WORKDIR', code: 'WORKDIR /app', desc: "Sets the active directory. Creates it if it doesn't exist. Safer than using RUN cd /app." },
  { id: 'EXPOSE', code: 'EXPOSE 8080', desc: 'Metadata only! Documents that the container listens on this port. Does NOT actually publish the port to the host.' },
  { id: 'CMD', code: 'CMD ["python", "train.py"]', desc: 'The DEFAULT command to run when the container starts. Can be easily overridden.' },
  { id: 'ENTRYPOINT', code: 'ENTRYPOINT ["python"]', desc: 'Configures the container to run as an executable. Commands passed via docker run are APPENDED.' },
];

export function VisualDockerfileInstructions({ initial = 'CMD' }) {
  const [activeInstruction, setActiveInstruction] = useState(initial);
  const active = INSTRUCTIONS.find((item) => item.id === activeInstruction) || INSTRUCTIONS[0];

  return (
    <div className="w-full h-full min-h-0 flex flex-col p-4 md:p-6 bg-slate-900 relative overflow-hidden">
      <div className="flex gap-4 h-full min-h-0">
        <div className="w-1/3 flex flex-col gap-2 overflow-y-auto min-h-0">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-700 pb-2">Instructions</div>
          {INSTRUCTIONS.map((inst) => (
            <button
              key={inst.id}
              type="button"
              onClick={() => setActiveInstruction(inst.id)}
              className={`text-left px-4 py-3 rounded-lg text-sm font-mono transition-all border ${activeInstruction === inst.id ? 'bg-indigo-900/40 border-indigo-500 text-indigo-300 shadow-lg translate-x-2' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
            >
              {inst.id}
            </button>
          ))}
        </div>

        <div className="w-2/3 bg-slate-950 border border-slate-700 rounded-xl p-4 md:p-6 relative flex flex-col min-h-0 overflow-auto">
          <div className="bg-slate-800 border-l-4 border-indigo-500 p-4 rounded text-slate-300 font-mono text-sm mb-6 shadow-inner">
            {active.code}
          </div>
          <p className="text-slate-300 text-sm mb-8 leading-relaxed">{active.desc}</p>

          <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4 flex flex-col justify-center items-center relative overflow-hidden min-h-[140px]">
            {activeInstruction === 'CMD' && (
              <div className="w-full flex flex-col gap-4 animate-[fadeIn_0.3s_ease-out]">
                <div className="text-xs text-slate-400 text-center font-bold uppercase">Overriding CMD</div>
                <div className="flex justify-between items-center text-sm font-mono gap-2">
                  <div className="bg-black px-3 py-1.5 rounded text-slate-300">$ docker run my_img</div>
                  <IconArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                  <div className="bg-blue-900/30 border border-blue-500 text-blue-300 px-3 py-1.5 rounded">Runs: <span className="text-white">python train.py</span></div>
                </div>
                <div className="flex justify-between items-center text-sm font-mono opacity-80 gap-2">
                  <div className="bg-black px-3 py-1.5 rounded text-slate-300">$ docker run my_img <span className="text-pink-400">bash</span></div>
                  <IconArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                  <div className="bg-orange-900/30 border border-orange-500 text-orange-300 px-3 py-1.5 rounded">Runs: <span className="text-white">bash</span> <span className="text-[10px] block">(CMD ignored!)</span></div>
                </div>
              </div>
            )}

            {activeInstruction === 'ENTRYPOINT' && (
              <div className="w-full flex flex-col gap-4 animate-[fadeIn_0.3s_ease-out]">
                <div className="text-xs text-slate-400 text-center font-bold uppercase">Appending to ENTRYPOINT</div>
                <div className="flex justify-between items-center text-sm font-mono gap-2">
                  <div className="bg-black px-3 py-1.5 rounded text-slate-300">$ docker run my_img <span className="text-emerald-400">train.py</span></div>
                  <IconArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                  <div className="bg-blue-900/30 border border-blue-500 text-blue-300 px-3 py-1.5 rounded">Runs: python <span className="text-emerald-400">train.py</span></div>
                </div>
                <div className="flex justify-between items-center text-sm font-mono opacity-80 gap-2">
                  <div className="bg-black px-3 py-1.5 rounded text-slate-300">$ docker run my_img <span className="text-pink-400">eval.py --gpu</span></div>
                  <IconArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                  <div className="bg-blue-900/30 border border-blue-500 text-blue-300 px-3 py-1.5 rounded">Runs: python <span className="text-pink-400">eval.py --gpu</span></div>
                </div>
              </div>
            )}

            {activeInstruction === 'EXPOSE' && (
              <div className="flex flex-col items-center text-center animate-[fadeIn_0.3s_ease-out]">
                <div className="w-16 h-16 bg-slate-800 rounded-full border-2 border-dashed border-slate-500 flex items-center justify-center mb-4">
                  <span className="text-slate-400 font-mono font-bold text-xs">8080</span>
                </div>
                <p className="text-xs text-slate-400 max-w-[250px]">EXPOSE does not open ports. You still MUST use <code className="text-yellow-400 bg-black px-1 rounded">-p 8080:8080</code> when running the container to actually access it.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualInstructionRun = () => <VisualDockerfileInstructions initial="RUN" />;
export const VisualInstructionCopy = () => <VisualDockerfileInstructions initial="COPY" />;
export const VisualInstructionWorkdir = () => <VisualDockerfileInstructions initial="WORKDIR" />;
export const VisualInstructionCmd = () => <VisualDockerfileInstructions initial="CMD" />;
export const VisualInstructionExpose = () => <VisualDockerfileInstructions initial="EXPOSE" />;

export function VisualRegistries() {
  return (
    <div className="w-full h-full min-h-0 flex flex-col items-center justify-center p-6 bg-slate-900 relative overflow-auto">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-700 p-4 rounded-xl mb-12 shadow-2xl z-20 flex flex-col items-center">
        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Tag Anatomy</div>
        <div className="flex text-lg md:text-xl font-mono text-slate-300 flex-wrap justify-center">
          <span className="text-red-400 border-b-2 border-red-400/50 pb-1">nvcr.io/</span>
          <span className="text-orange-400 border-b-2 border-orange-400/50 pb-1">nvidia/</span>
          <span className="text-blue-400 border-b-2 border-blue-400/50 pb-1">pytorch</span>
          <span className="text-slate-500">:</span>
          <span className="text-emerald-400 border-b-2 border-emerald-400/50 pb-1">23.10-py3</span>
        </div>
        <div className="flex text-[10px] md:text-xs font-bold mt-2 w-full justify-between px-4 text-slate-500 gap-2">
          <span className="text-red-400/70 w-1/4 text-center">Registry Host<br />(defaults to docker.io)</span>
          <span className="text-orange-400/70 w-1/4 text-center">Organization / User</span>
          <span className="text-blue-400/70 w-1/4 text-center">Repository Name</span>
          <span className="text-emerald-400/70 w-1/4 text-center">Tag / Version<br />(defaults to latest)</span>
        </div>
      </div>

      <div className="flex w-full justify-around items-end z-10 flex-wrap gap-6">
        <div className="flex flex-col items-center">
          <div className="text-white font-bold mb-2">Public Registry</div>
          <div className="w-40 h-40 bg-blue-900/30 border-2 border-blue-500 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.2)]">
            <IconCloud className="w-12 h-12 text-blue-400 mb-2" />
            <span className="font-bold text-sm text-blue-200">Docker Hub</span>
            <span className="text-[10px] text-blue-300/70 mt-1">docker.io</span>
          </div>
          <div className="mt-4 bg-slate-800 text-xs text-slate-400 px-3 py-1.5 rounded border border-slate-700 text-center">
            Official OS bases<br />ML Frameworks
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-white font-bold mb-2 flex items-center gap-2"><IconLock className="w-4 h-4 text-emerald-400" /> Private Registries</div>
          <div className="w-64 h-40 bg-slate-800 border-2 border-emerald-500/50 rounded-2xl flex flex-col items-center justify-center gap-2 p-4 shadow-2xl relative">
            <div className="absolute -top-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">Requires docker login</div>
            <div className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 font-mono w-full text-center">AWS ECR</div>
            <div className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 font-mono w-full text-center">Google GCR / Artifact</div>
            <div className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 font-mono w-full text-center">Azure ACR</div>
          </div>
          <div className="mt-4 bg-slate-800 text-xs text-slate-400 px-3 py-1.5 rounded border border-slate-700 text-center">
            Proprietary Code<br />Sensitive Data
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualPushPullLifecycle() {
  const [step, setStep] = useState(0);
  const { after, clear } = useTimers();

  const runFlow = () => {
    clear();
    setStep(1);
    after(1500, () => setStep(2));
    after(3000, () => setStep(3));
    after(5000, () => setStep(4));
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col p-6 bg-slate-900 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Distribution Workflow</div>
        <button type="button" onClick={step === 0 || step === 4 ? runFlow : undefined} className={`px-4 py-2 rounded text-xs font-bold transition-all ${step === 0 || step === 4 ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
          {step === 0 ? 'Start Workflow' : step === 4 ? 'Restart' : 'Processing...'}
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-between px-4 min-h-[280px]">
        <div className="w-1/3 flex flex-col items-center z-20">
          <div className="bg-slate-950 border border-slate-700 p-4 rounded-xl flex flex-col items-center w-full shadow-2xl relative">
            <div className="absolute -top-3 bg-slate-700 text-[10px] font-bold px-2 py-1 rounded text-white">Local Machine</div>
            <div className="w-16 h-16 bg-blue-900/30 border-2 border-blue-500 rounded-lg flex flex-col items-center justify-center text-blue-200 mt-2">
              <IconBox className="w-6 h-6 mb-1" />
              <span className="text-[8px] font-mono">my-ml-app</span>
            </div>
            <div className={`mt-4 bg-slate-800 p-2 rounded text-[10px] font-mono text-center w-full transition-all duration-500 ${step >= 1 ? 'opacity-100 border border-indigo-500 text-indigo-300' : 'opacity-30 border border-slate-700 text-slate-500'}`}>
              $ docker tag<br />my-ml-app<br />user/my-app:1.0
            </div>
            <div className={`mt-2 bg-slate-800 p-2 rounded text-[10px] font-mono text-center w-full transition-all duration-500 flex justify-center gap-1 items-center ${step >= 2 ? 'opacity-100 border border-emerald-500 text-emerald-300' : 'opacity-30 border border-slate-700 text-slate-500'}`}>
              <IconLock className="w-3 h-3" /> docker login
            </div>
          </div>
        </div>

        <div className="flex-1 h-full relative pointer-events-none min-h-[240px]">
          <svg className="absolute inset-0 w-full h-full">
            <path d="M 0,100 L 150,100" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="6,6" fill="none" className={step === 3 ? 'animate-[dash_1s_linear_infinite]' : 'opacity-20'} />
            {step === 3 && <text x="40" y="90" fill="#c4b5fd" fontSize="10" fontWeight="bold">docker push</text>}
            <path d="M 150,100 Q 150,200 250,200 L 350,200" stroke="#10b981" strokeWidth="3" strokeDasharray="6,6" fill="none" className={step === 4 ? 'animate-[dash_1s_linear_infinite]' : 'opacity-0'} />
            {step === 4 && <text x="170" y="190" fill="#6ee7b7" fontSize="10" fontWeight="bold">docker pull</text>}
          </svg>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="w-32 h-32 bg-purple-900/20 border-2 border-purple-500/50 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.2)]">
            <IconCloud className="w-8 h-8 text-purple-400 mb-1" />
            <span className="text-[10px] font-bold text-purple-200">Docker Hub</span>
            <div className={`w-12 h-12 bg-blue-900/80 border border-blue-400 rounded-lg flex flex-col items-center justify-center text-blue-200 mt-2 transition-all duration-700 ${step >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <IconBox className="w-4 h-4" />
              <span className="text-[6px] font-mono">user/my-app:1.0</span>
            </div>
          </div>
        </div>

        <div className="w-1/3 flex flex-col items-end z-20 mt-32">
          <div className="bg-slate-950 border border-slate-700 p-4 rounded-xl flex flex-col items-center w-full shadow-2xl relative transition-all duration-1000">
            <div className="absolute -top-3 bg-slate-700 text-[10px] font-bold px-2 py-1 rounded text-white">Prod Server</div>
            <IconServer className="w-10 h-10 text-slate-500 mb-2" />
            <div className={`w-16 h-16 bg-blue-900/30 border-2 border-blue-500 rounded-lg flex flex-col items-center justify-center text-blue-200 transition-all duration-700 ${step >= 4 ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-12'}`}>
              <IconBox className="w-6 h-6 mb-1" />
              <span className="text-[8px] font-mono text-center leading-tight">Pulled<br />Image</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualJupyterPractical() {
  const [termState, setTermState] = useState(0);
  const { after, clear } = useTimers();

  const handleRun = () => {
    clear();
    setTermState(1);
    after(2500, () => setTermState(2));
  };

  const reset = () => {
    clear();
    setTermState(0);
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col items-center justify-center p-4 md:p-6 bg-slate-900 relative overflow-hidden">
      <div className={`w-full max-w-2xl transition-all duration-700 z-20 ${termState === 2 ? '-translate-y-12 scale-90 opacity-80' : 'translate-y-0 scale-100 opacity-100'}`}>
        <div className="bg-[#0c0c0c] rounded-xl border border-slate-700 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <div className="bg-slate-800 px-4 py-2 border-b border-slate-900 flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">bash</span>
          </div>

          <div className="p-4 font-mono text-xs md:text-sm min-h-[140px] text-slate-300">
            <div className="flex items-start break-all">
              <span className="text-emerald-400 mr-2 shrink-0">$</span>
              {termState === 0 ? (
                <button type="button" onClick={handleRun} className="bg-slate-800 hover:bg-slate-700 text-slate-400 px-2 py-1 rounded text-xs transition-colors flex items-center gap-2 text-left">
                  Click to execute: docker run -it --rm -p 8888:8888 tensorflow/tensorflow:latest-jupyter
                </button>
              ) : (
                <span className="text-blue-300">docker run -it --rm -p 8888:8888 tensorflow/tensorflow:latest-jupyter</span>
              )}
            </div>

            {termState >= 1 && (
              <div className="mt-2 text-slate-400 text-xs animate-[fadeIn_0.5s_ease-out] space-y-1">
                <div>Unable to find image locally...</div>
                <div>Pulling from tensorflow/tensorflow...</div>
                <div>Digest: sha256:abc123def456...</div>
                <div className="text-emerald-400">Status: Downloaded newer image</div>
              </div>
            )}

            {termState === 2 && (
              <div className="mt-4 text-yellow-300 text-[10px] md:text-xs animate-[fadeIn_0.5s_ease-out] border-l-2 border-yellow-500 pl-2">
                <div>[I 10:00:00.000 NotebookApp] Jupyter Notebook is running at:</div>
                <div>[I 10:00:00.000 NotebookApp] <span className="bg-yellow-900/50 text-white font-bold select-all cursor-text px-1">http://127.0.0.1:8888/?token=abc123xyz</span></div>
                <div className="text-slate-500 mt-1">Use Control-C to stop this server and shut down all kernels (twice to skip confirmation).</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`absolute bottom-4 w-full px-6 flex flex-col items-center transition-all duration-700 z-10 ${termState === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}`}>
        <div className="h-10 w-48 border-x-4 border-dashed border-yellow-500/50 bg-yellow-900/20 relative flex items-center justify-center">
          <div className="absolute -left-20 text-[10px] font-mono text-slate-400 text-center">Host<br /><span className="text-yellow-400 font-bold bg-black px-1 rounded">8888</span></div>
          <div className="absolute -right-24 text-[10px] font-mono text-slate-400 text-center">Container<br /><span className="text-yellow-400 font-bold bg-black px-1 rounded">8888</span></div>
          <svg className="w-full h-4 text-yellow-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
        </div>

        <div className="w-full max-w-lg bg-white rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-slate-600">
          <div className="bg-slate-200 px-3 py-1.5 border-b border-slate-300 flex items-center gap-2">
            <div className="bg-white rounded px-3 py-1 text-[10px] text-slate-600 w-full font-mono flex items-center shadow-inner border border-slate-300">
              <svg className="w-3 h-3 mr-2 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
              http://127.0.0.1:8888/?token=abc123xyz
            </div>
          </div>
          <div className="p-4 bg-white h-36 flex flex-col">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-2">
              <span className="text-orange-500 font-bold text-lg tracking-tight">jupyter</span>
              <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] border border-slate-200 ml-auto flex items-center gap-1"><IconCheck className="w-3 h-3 text-emerald-500" /> Kernel Ready</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono text-[10px] md:text-xs text-slate-800 shadow-inner">
              <div className="flex"><span className="text-blue-500 w-8">In [1]:</span> <span><span className="text-purple-700">import</span> tensorflow <span className="text-purple-700">as</span> tf</span></div>
              <div className="flex"><span className="text-blue-500 w-8">In [2]:</span> <span><span className="text-blue-700">print</span>(tf.__version__)</span></div>
              <div className="flex mt-1"><span className="text-red-500 w-8">Out[2]:</span> <span className="bg-slate-200 px-1 rounded">&apos;2.11.0&apos;</span></div>
            </div>
          </div>
        </div>

        <div className="mt-2 flex gap-4">
          <button type="button" onClick={reset} className="text-xs text-slate-400 hover:text-white underline transition-colors bg-slate-800 px-3 py-1 rounded">Ctrl+C (Stop & Cleanup)</button>
        </div>
      </div>
    </div>
  );
}
