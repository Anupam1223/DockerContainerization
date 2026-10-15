import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const IconDatabase = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
const IconHardDrive = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
const IconCloud = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
const IconShield = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const IconKey = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>;
const IconBox = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const IconAlert = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;

export function VisualMountVsVolumeCore() {
  const [activeTab, setActiveTab] = useState('bind');

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-900 rounded-xl relative">
      <div className="flex gap-4 mb-8 z-20 pr-36">
        <button type="button" onClick={() => setActiveTab('bind')} className={`px-6 py-2 rounded text-sm font-bold transition-all shadow-lg ${activeTab === 'bind' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>Bind Mount</button>
        <button type="button" onClick={() => setActiveTab('volume')} className={`px-6 py-2 rounded text-sm font-bold transition-all shadow-lg ${activeTab === 'volume' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>Docker Volume</button>
      </div>

      <div className="w-full max-w-3xl flex justify-between items-center relative h-64 border-2 border-slate-700 bg-slate-950 rounded-xl p-8 overflow-hidden">
        <div className="w-1/3 h-full flex flex-col items-center relative z-10">
          <div className="text-slate-400 font-bold mb-4 uppercase tracking-widest text-xs">Host Filesystem</div>
          <div className="w-full flex-1 border-2 border-slate-600 rounded-lg p-2 flex flex-col gap-2 relative bg-slate-900">
            <div className={`p-2 rounded border-2 transition-all duration-500 flex items-center gap-2 ${activeTab === 'bind' ? 'bg-blue-900/50 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105 z-20' : 'bg-slate-800 border-transparent opacity-30 grayscale'}`}>
              <IconHardDrive className="w-4 h-4 text-blue-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-300">/Users/me/project</span>
                <span className="text-[8px] text-blue-300 uppercase tracking-widest">User Controlled</span>
              </div>
            </div>
            <div className="my-auto w-full h-px bg-slate-700" />
            <div className={`p-2 rounded border-2 transition-all duration-500 flex items-center gap-2 ${activeTab === 'volume' ? 'bg-emerald-900/50 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105 z-20' : 'bg-slate-800 border-transparent opacity-30 grayscale'}`}>
              <IconDatabase className="w-4 h-4 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-300">/var/lib/docker/volumes</span>
                <span className="text-[8px] text-emerald-300 uppercase tracking-widest">Docker Managed Area</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 h-full relative z-0 mx-4">
          <svg className="w-full h-full">
            <defs>
              <marker id="mount-arrow-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" /></marker>
              <marker id="mount-arrow-emerald" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#10b981" /></marker>
            </defs>
            {activeTab === 'bind' && <path d="M 0,50 Q 100,50 180,100" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="8,8" className="animate-[dash_1s_linear_infinite]" markerEnd="url(#mount-arrow-blue)" />}
            {activeTab === 'volume' && <path d="M 0,150 Q 100,150 180,100" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="8,8" className="animate-[dash_1s_linear_infinite]" markerEnd="url(#mount-arrow-emerald)" />}
          </svg>
        </div>

        <div className="w-1/3 h-full flex flex-col items-center relative z-10">
          <div className="text-slate-400 font-bold mb-4 uppercase tracking-widest text-xs">Docker Container</div>
          <div className="w-full flex-1 border-2 border-slate-500 bg-slate-800 rounded-lg p-4 flex items-center justify-center relative shadow-xl">
            <div className={`p-3 rounded-lg border-2 w-full text-center transition-all duration-500 ${activeTab === 'bind' ? 'bg-blue-900/50 border-blue-500 text-blue-300' : 'bg-emerald-900/50 border-emerald-500 text-emerald-300'}`}>
              <div className="font-mono text-sm">/app/data</div>
              <div className="text-[10px] mt-1 opacity-70">Mount Point</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 text-sm text-slate-300 text-center max-w-lg h-12">
        {activeTab === 'bind'
          ? <span><strong>Bind Mounts:</strong> Tie the container directly to a specific user-controlled folder on your laptop. Great for live-editing code.</span>
          : <span><strong>Docker Volumes:</strong> Stored in a hidden, secure directory completely managed by Docker. Best for persisting trained models and databases.</span>}
      </div>
    </div>
  );
}

export function VisualPerfSecurity() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-900 rounded-xl relative overflow-hidden">
      <div className="text-center font-bold text-slate-400 mb-8 uppercase tracking-widest text-xs">Performance & Security Implications (macOS / Windows)</div>
      <div className="w-full max-w-4xl flex gap-12 min-h-0">
        <div className="w-1/2 bg-slate-950 border border-slate-700 rounded-xl p-6 relative flex flex-col shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 bg-yellow-600/20 text-yellow-400 text-[10px] font-bold px-3 py-1 rounded-bl-lg border-b border-l border-yellow-500/50">Performance Overhead</div>
          <div className="flex-1 flex flex-col justify-center gap-6 relative min-h-[180px]">
            <div className="bg-slate-800 border-2 border-slate-600 rounded p-3 text-center z-10 relative">
              <span className="text-xs font-bold text-slate-300">Host OS (macOS/Win)</span>
              <div className="absolute -bottom-4 right-4 bg-blue-600 text-white text-[8px] px-1 rounded z-20">Bind Data</div>
            </div>
            <div className="w-full border-t-2 border-dashed border-red-500/50 my-1 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-950 px-2 text-[10px] text-red-400 font-bold tracking-widest uppercase">Virtual Machine Boundary</span>
            </div>
            <div className="bg-slate-800 border-2 border-emerald-600 rounded p-3 text-center z-10 relative">
              <span className="text-xs font-bold text-emerald-400">Docker Linux VM</span>
              <div className="absolute -top-4 right-4 bg-emerald-600 text-white text-[8px] px-1 rounded z-20">Volume Data</div>
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <path d="M 60,35 Q 20,80 60,135" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" />
              <text x="70" y="90" fill="#ef4444" fontSize="10" fontWeight="bold">Slow (Crosses VM)</text>
              <path d="M 280,120 A 20 20 0 1 1 280,150" fill="none" stroke="#10b981" strokeWidth="2" />
              <text x="180" y="145" fill="#10b981" fontSize="10" fontWeight="bold">Fast (Native Linux)</text>
            </svg>
          </div>
          <div className="mt-4 text-[10px] text-slate-400 text-center leading-tight">
            Reading 100,000 images from a Bind Mount crosses the VM boundary 100,000 times. Volumes stay inside the Linux VM, offering near-native speed.
          </div>
        </div>

        <div className="w-1/2 bg-slate-950 border border-slate-700 rounded-xl p-6 relative flex flex-col shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-600/20 text-red-400 text-[10px] font-bold px-3 py-1 rounded-bl-lg border-b border-l border-red-500/50">Security & Isolation</div>
          <div className="flex-1 flex flex-col justify-center items-center gap-6 relative">
            <div className="w-full bg-slate-800/50 border border-blue-500/30 p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center border border-red-500"><IconAlert className="w-4 h-4 text-red-400" /></div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-blue-300">Bind Mount</span>
                  <span className="text-[10px] text-slate-400">Directly exposes Host files.</span>
                </div>
              </div>
              <div className="text-[10px] text-red-300 max-w-[100px] text-right leading-tight">
                Container root user can modify/delete sensitive host data!
              </div>
            </div>
            <div className="w-full bg-slate-800/50 border border-emerald-500/30 p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center border border-emerald-500"><IconShield className="w-4 h-4 text-emerald-400" /></div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-emerald-300">Docker Volume</span>
                  <span className="text-[10px] text-slate-400">Managed, isolated storage.</span>
                </div>
              </div>
              <div className="text-[10px] text-emerald-300 max-w-[100px] text-right leading-tight">
                Abstracted away from core OS files. Highly secure.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualCloudAuth({ initial = 'env' }) {
  const [authMethod, setAuthMethod] = useState(initial);
  const stroke = authMethod === 'env' ? '#f97316' : authMethod === 'mount' ? '#3b82f6' : '#10b981';

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-900 rounded-xl relative">
      <div className="flex gap-4 mb-8 z-20 pr-36 flex-wrap justify-center">
        <button type="button" onClick={() => setAuthMethod('env')} className={`px-4 py-2 rounded text-sm font-bold transition-all border ${authMethod === 'env' ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>Env Vars</button>
        <button type="button" onClick={() => setAuthMethod('mount')} className={`px-4 py-2 rounded text-sm font-bold transition-all border ${authMethod === 'mount' ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>Mounted File</button>
        <button type="button" onClick={() => setAuthMethod('iam')} className={`px-4 py-2 rounded text-sm font-bold transition-all border ${authMethod === 'iam' ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>IAM Role (Recommended)</button>
      </div>

      <div className="w-full max-w-4xl flex justify-between items-center h-64 relative">
        <div className="w-64 h-full bg-slate-950 border-2 border-slate-700 rounded-xl p-4 flex flex-col items-center shadow-2xl relative z-10">
          <div className="text-xs font-bold text-slate-300 mb-4 uppercase tracking-widest border-b border-slate-800 pb-2">Container</div>
          <IconBox className="w-12 h-12 text-slate-500 mb-2" />
          <div className="bg-slate-800 px-3 py-1.5 rounded text-xs text-white border border-slate-600 font-mono w-full text-center">boto3 / SDK</div>
          <div className="mt-auto w-full flex justify-center h-16">
            {authMethod === 'env' && (
              <div className="bg-orange-900/30 border border-orange-500 text-orange-300 text-[9px] p-2 rounded flex flex-col animate-[fadeIn_0.5s_ease-out]">
                <span>AWS_ACCESS_KEY_ID=...</span>
                <span className="flex items-center gap-1 mt-1 text-red-400 font-bold"><IconAlert className="w-3 h-3" /> Visible in docker inspect</span>
              </div>
            )}
            {authMethod === 'mount' && (
              <div className="bg-blue-900/30 border border-blue-500 text-blue-300 text-[10px] p-2 rounded flex items-center gap-2 animate-[fadeIn_0.5s_ease-out]">
                <IconKey className="w-4 h-4" /> /root/.aws/credentials
              </div>
            )}
            {authMethod === 'iam' && (
              <div className="bg-emerald-900/30 border border-emerald-500 text-emerald-300 text-[10px] p-2 rounded flex flex-col items-center justify-center animate-[fadeIn_0.5s_ease-out]">
                <IconShield className="w-4 h-4 mb-1" /> No hardcoded secrets!
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 h-full relative z-0 flex items-center justify-center">
          <svg className="absolute w-full h-full">
            <defs>
              <marker id="cloud-auth-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill={stroke} />
              </marker>
            </defs>
            <path d="M 0,128 L 250,128" fill="none" stroke={stroke} strokeWidth="4" strokeDasharray="8,8" className="animate-[dash_1s_linear_infinite]" markerEnd="url(#cloud-auth-arrow)" />
          </svg>
          <div className="bg-slate-900 px-3 py-1 rounded-full border border-slate-700 text-[10px] font-bold text-slate-300 z-10 shadow-lg">Authenticating...</div>
        </div>

        <div className="w-64 h-full bg-slate-900 border-2 border-purple-500/50 rounded-xl p-4 flex flex-col items-center shadow-[0_0_30px_rgba(168,85,247,0.15)] relative z-10">
          <div className="text-xs font-bold text-purple-300 mb-4 uppercase tracking-widest border-b border-purple-900/50 pb-2">Cloud Storage</div>
          <IconCloud className="w-16 h-16 text-purple-400 mb-4" />
          <div className="bg-purple-900/30 px-4 py-2 rounded text-xs text-purple-200 border border-purple-500/50 font-mono w-full text-center">s3://my-ml-bucket</div>
        </div>
      </div>
      <div className="mt-8 text-sm text-slate-300 text-center max-w-2xl h-12">
        {authMethod === 'env' && 'Passing secrets as env vars is easy but dangerous. They are visible to anyone who can run `docker inspect`.'}
        {authMethod === 'mount' && 'Mounting a read-only credential file (like ~/.aws) keeps secrets out of the image layer history.'}
        {authMethod === 'iam' && 'For cloud deployments (EC2, GKE), the container simply inherits permissions from the underlying host instance. Zero secret management required!'}
      </div>
    </div>
  );
}

export function VisualIAMFlow() {
  const [step, setStep] = useState(0);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const runFlow = () => {
    timers.current.forEach(clearTimeout);
    setStep(1);
    timers.current = [
      setTimeout(() => setStep(2), 1500),
      setTimeout(() => setStep(3), 3000),
    ];
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setStep(0);
  };

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 pr-36">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Instance Metadata Service (IMDS) Flow</div>
        <button type="button" onClick={step === 0 || step === 3 ? (step === 0 ? runFlow : reset) : undefined} className={`px-4 py-2 rounded text-xs font-bold transition-all ${step === 0 || step === 3 ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
          {step === 0 ? 'Execute Flow' : step === 3 ? 'Reset' : 'Processing...'}
        </button>
      </div>

      <div className="flex-1 relative border-2 border-slate-700 rounded-xl p-4 bg-slate-950 flex flex-col min-h-0">
        <div className="absolute top-0 right-0 bg-slate-800 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-b border-l border-slate-700">Cloud VM (e.g., EC2)</div>
        <div className="flex justify-between items-center h-full w-full relative z-10 px-8">
          <div className="w-48 h-40 bg-blue-900/20 border-2 border-blue-500 rounded-xl flex flex-col items-center justify-center relative shadow-lg">
            <div className="absolute -top-3 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">Docker Container</div>
            <div className="bg-slate-800 border border-slate-600 px-3 py-1 rounded text-xs text-white mb-4">ML Script</div>
            <div className="bg-blue-800/50 border border-blue-400 px-3 py-1.5 rounded text-xs text-blue-200 font-bold">boto3 (AWS SDK)</div>
          </div>
          <div className="w-48 h-24 bg-emerald-900/20 border-2 border-emerald-500 border-dashed rounded-xl flex flex-col items-center justify-center relative shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <div className="absolute -top-3 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">Instance Metadata Service</div>
            <div className="text-[10px] text-emerald-300 font-mono text-center">169.254.169.254<br />(Local API)</div>
          </div>
          <div className="w-40 h-40 bg-purple-900/20 border-2 border-purple-500 rounded-xl flex flex-col items-center justify-center relative shadow-lg">
            <div className="absolute -top-3 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">Cloud S3 Bucket</div>
            <IconCloud className="w-12 h-12 text-purple-400" />
          </div>
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <marker id="iam-arrow-blue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#3b82f6" /></marker>
            <marker id="iam-arrow-emerald" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#10b981" /></marker>
            <marker id="iam-arrow-purple" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#a855f7" /></marker>
          </defs>
          {step >= 1 && (
            <>
              <path d="M 230,130 L 370,130" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" className="animate-[dash_1s_linear_infinite]" markerEnd="url(#iam-arrow-blue)" />
              <text x="250" y="120" fill="#93c5fd" fontSize="10" fontWeight="bold">1. SDK requests Token</text>
            </>
          )}
          {step >= 2 && (
            <>
              <path d="M 370,160 L 230,160" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4,4" className="animate-[dash_1s_linear_infinite_reverse]" markerEnd="url(#iam-arrow-emerald)" />
              <text x="240" y="175" fill="#6ee7b7" fontSize="10" fontWeight="bold">2. Returns Temp Token</text>
            </>
          )}
          {step === 3 && (
            <>
              <path d="M 180,210 Q 300,300 620,180" fill="none" stroke="#a855f7" strokeWidth="3" strokeDasharray="8,8" className="animate-[dash_1s_linear_infinite]" markerEnd="url(#iam-arrow-purple)" />
              <text x="350" y="250" fill="#d8b4fe" fontSize="10" fontWeight="bold">3. Authed API Call (using Temp Token)</text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}

export function VisualModelPackagingStrategy({ initial = 'embed' }) {
  const [strategy, setStrategy] = useState(initial);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-900 rounded-xl relative overflow-hidden">
      <div className="flex gap-4 mb-8 z-20 pr-36 flex-wrap justify-center">
        <button type="button" onClick={() => setStrategy('embed')} className={`px-6 py-2 rounded text-sm font-bold transition-all border ${strategy === 'embed' ? 'bg-orange-600 border-orange-400 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>Strategy 1: Embed in Image</button>
        <button type="button" onClick={() => setStrategy('volume')} className={`px-6 py-2 rounded text-sm font-bold transition-all border ${strategy === 'volume' ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>Strategy 2: Decouple via Volume</button>
      </div>

      <div className="flex w-full max-w-4xl h-72 gap-12">
        <div className={`flex-1 transition-all duration-700 flex flex-col items-center ${strategy === 'embed' ? 'opacity-100 scale-100' : 'opacity-20 scale-90 grayscale'}`}>
          <div className="text-orange-400 font-bold mb-4 uppercase tracking-widest text-xs">Docker Image</div>
          <div className="w-56 h-56 bg-slate-950 border-4 border-orange-500 rounded-2xl flex flex-col items-center justify-center p-4 relative shadow-2xl">
            <div className="absolute -top-4 bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">Size: 5.5 GB</div>
            <div className="w-full bg-slate-800 border border-slate-600 p-2 rounded text-center text-xs text-white mb-2">App Code (500MB)</div>
            <div className="w-full flex-1 bg-orange-900/40 border-2 border-orange-500 border-dashed rounded flex flex-col items-center justify-center">
              <IconDatabase className="w-8 h-8 text-orange-400 mb-1" />
              <span className="text-xs font-bold text-orange-300">Model Weights</span>
              <span className="text-[10px] text-orange-400 font-mono">(5 GB)</span>
            </div>
          </div>
          <div className="mt-6 w-full flex justify-center gap-2">
            <span className="bg-red-900/50 text-red-300 text-[10px] px-2 py-1 rounded font-bold border border-red-500/50">Slow Push/Pull</span>
            <span className="bg-red-900/50 text-red-300 text-[10px] px-2 py-1 rounded font-bold border border-red-500/50">Must Rebuild</span>
          </div>
        </div>

        <div className="w-px bg-slate-700 h-full" />

        <div className={`flex-1 transition-all duration-700 flex flex-col items-center ${strategy === 'volume' ? 'opacity-100 scale-100' : 'opacity-20 scale-90 grayscale'}`}>
          <div className="text-emerald-400 font-bold mb-4 uppercase tracking-widest text-xs">Docker Image + Runtime Volume</div>
          <div className="flex gap-4 items-center w-full justify-center h-56 relative">
            <div className="w-32 h-32 bg-slate-950 border-4 border-emerald-500 rounded-xl flex flex-col items-center justify-center p-3 relative shadow-2xl">
              <div className="absolute -top-4 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">Size: 500 MB</div>
              <div className="w-full h-full bg-slate-800 border border-slate-600 rounded flex items-center justify-center text-xs text-white text-center">App Code</div>
            </div>
            <div className="text-slate-500 font-bold text-xl">+</div>
            <div className="w-32 h-40 bg-indigo-900/30 border-2 border-indigo-500 border-dashed rounded-xl flex flex-col items-center justify-center p-3 relative shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <div className="absolute -top-3 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">External Volume</div>
              <IconDatabase className="w-8 h-8 text-indigo-400 mb-1" />
              <span className="text-xs font-bold text-indigo-300 text-center leading-tight">Model Weights</span>
              <span className="text-[10px] text-indigo-400 font-mono">(5 GB)</span>
            </div>
            <svg className="absolute w-full h-full pointer-events-none -z-10">
              <path d="M 128,140 Q 180,180 230,140" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4,4" className="animate-[dash_1s_linear_infinite_reverse]" />
            </svg>
          </div>
          <div className="mt-6 w-full flex justify-center gap-2">
            <span className="bg-emerald-900/50 text-emerald-300 text-[10px] px-2 py-1 rounded font-bold border border-emerald-500/50">Fast Deploys</span>
            <span className="bg-emerald-900/50 text-emerald-300 text-[10px] px-2 py-1 rounded font-bold border border-emerald-500/50">Independent Updates</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualModelInside = () => <VisualModelPackagingStrategy initial="embed" />;
export const VisualModelMounted = () => <VisualModelPackagingStrategy initial="volume" />;
export const VisualModelChoice = () => <VisualModelPackagingStrategy initial="embed" />;

export const VisualCloudSdk = () => <VisualCloudAuth initial="env" />;
export const VisualCloudEnv = () => <VisualCloudAuth initial="env" />;
export const VisualCloudMount = () => <VisualCloudAuth initial="mount" />;
export const VisualCloudChoice = () => <VisualCloudAuth initial="iam" />;

const btn = 'bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg active:scale-95';

export function VisualVolumeInit() {
  const [volume, setVolume] = useState(true);
  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-slate-900">
      <div className="flex-1 min-h-0 flex items-center justify-center p-4 overflow-hidden">
        <div className="text-center">
          <AnimatePresence mode="wait">
            <motion.div key={String(volume)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-600 px-6 py-5">
              <p className="text-[10px] text-slate-400">/app/data inside the container</p>
              <p className="mt-3 font-mono text-sm text-white">{volume ? 'copied from the image' : 'exactly the host folder'}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="shrink-0 flex justify-center pb-5">
        <button type="button" onClick={() => setVolume((v) => !v)} className={btn}>{volume ? 'Bind-mount the host dir' : 'Mount an empty volume'}</button>
      </div>
    </div>
  );
}

export const VisualBindVsVolume = VisualMountVsVolumeCore;
export const VisualPerfCompare = VisualPerfSecurity;
export const VisualIsolation = VisualPerfSecurity;
export const VisualIamFlow = VisualIAMFlow;
