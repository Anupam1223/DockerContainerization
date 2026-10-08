import React, { useState } from 'react';

const IconBox = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const IconCheck = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconAlert = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const IconServer = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>;
const IconShield = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const IconFile = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const IconKey = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>;

export function VisualCondaVsPip() {
  const [tool, setTool] = useState('pip');

  return (
    <div className="w-full h-full min-h-0 flex flex-col items-center justify-center p-4 md:p-6 bg-slate-900 relative overflow-hidden">
      <div className="flex gap-4 mb-6 z-20">
        <button type="button" onClick={() => setTool('pip')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all shadow-lg ${tool === 'pip' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>Using Pip</button>
        <button type="button" onClick={() => setTool('conda')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all shadow-lg ${tool === 'conda' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>Using Conda</button>
      </div>

      <div className="relative w-full max-w-2xl flex-1 min-h-[280px] bg-slate-950 rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden shadow-2xl">
        <div className="absolute top-4 text-xs font-mono text-slate-400">
          {tool === 'pip' ? '$ pip install tensorflow' : '$ conda install tensorflow'}
        </div>

        <div className={`absolute inset-0 transition-opacity duration-500 flex flex-col items-center justify-center ${tool === 'pip' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <div className="flex flex-col items-center gap-6 relative">
            <div className="bg-blue-900/50 border-2 border-blue-500 text-blue-200 px-6 py-3 rounded-xl font-bold shadow-lg z-20">TensorFlow (Python Env)</div>
            <div className="flex gap-16">
              <div className="bg-slate-800 border-2 border-slate-600 text-slate-300 px-4 py-2 rounded-lg text-xs z-20">numpy (Python)</div>
              <div className="bg-slate-800 border-2 border-slate-600 text-slate-300 px-4 py-2 rounded-lg text-xs z-20">protobuf (Python)</div>
            </div>
            <div className="mt-4 border-2 border-dashed border-red-500/50 bg-red-900/10 p-4 rounded-xl flex gap-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-950 px-2 text-[10px] text-red-400 font-bold tracking-widest uppercase">System Level (OS)</div>
              <div className="flex flex-col items-center">
                <div className="bg-red-900/30 border border-red-500 text-red-300 px-3 py-1.5 rounded text-[10px] flex items-center gap-1"><IconAlert className="w-3 h-3" /> cuDNN (C++)</div>
                <span className="text-[8px] text-slate-500 mt-1">Not managed by pip</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-red-900/30 border border-red-500 text-red-300 px-3 py-1.5 rounded text-[10px] flex items-center gap-1"><IconAlert className="w-3 h-3" /> CUDA Toolkit</div>
                <span className="text-[8px] text-slate-500 mt-1">Not managed by pip</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`absolute inset-0 transition-opacity duration-500 flex flex-col items-center justify-center px-4 ${tool === 'conda' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <div className="flex flex-col items-center gap-6 relative">
            <div className="bg-emerald-900/50 border-2 border-emerald-500 text-emerald-200 px-6 py-3 rounded-xl font-bold shadow-lg z-20">TensorFlow (Conda Env)</div>
            <div className="flex gap-3 flex-wrap justify-center">
              <div className="bg-slate-800 border-2 border-emerald-600/50 text-slate-300 px-3 py-2 rounded-lg text-xs z-20">numpy</div>
              <div className="bg-slate-800 border-2 border-emerald-600/50 text-slate-300 px-3 py-2 rounded-lg text-xs z-20">protobuf</div>
              <div className="bg-indigo-900/50 border-2 border-indigo-500 text-indigo-200 px-3 py-2 rounded-lg text-xs z-20 flex items-center gap-1"><IconCheck className="w-3 h-3" /> cuDNN (C++)</div>
              <div className="bg-indigo-900/50 border-2 border-indigo-500 text-indigo-200 px-3 py-2 rounded-lg text-xs z-20 flex items-center gap-1"><IconCheck className="w-3 h-3" /> cudatoolkit</div>
            </div>
          </div>
          <div className="mt-8 text-emerald-400 text-xs bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-800 text-center">
            Conda resolves both Python packages AND underlying OS/C++ dependencies.
          </div>
        </div>
      </div>
    </div>
  );
}

const YAML = [
  { text: 'name: ml_env', type: 'name', desc: 'Specifies the name of the isolated Conda environment.' },
  { text: 'channels:', type: 'channel_header', desc: 'Defines where Conda looks for packages.' },
  { text: '  - defaults', type: 'channel', desc: "Anaconda's default, stable package repositories." },
  { text: '  - conda-forge', type: 'channel', desc: 'Community-led channel, often has more up-to-date ML packages.' },
  { text: 'dependencies:', type: 'dep_header', desc: 'The list of packages to install.' },
  { text: '  - python=3.9', type: 'dep_exact', desc: 'Exact version pinning (e.g., =3.9). Highest reproducibility.' },
  { text: '  - pandas>=1.4', type: 'dep_range', desc: 'Minimum version. Flexible, but carries a slight risk of future breakage.' },
  { text: '  - scikit-learn=1.1', type: 'dep_exact', desc: 'Exact version pinning.' },
  { text: '  - pip', type: 'pip_base', desc: 'Installs pip ITSELF within the Conda environment to allow non-Conda packages.' },
  { text: '  - pip:', type: 'pip_section', desc: 'Nested section for packages only available via PyPI.' },
  { text: '    - some-pip-only-pkg==0.1.0', type: 'pip_pkg', desc: 'Installed via pip AFTER Conda finishes its setup.' },
];

export function VisualEnvYaml() {
  const [activeSection, setActiveSection] = useState('none');
  const active = YAML.find((line) => line.type === activeSection);

  return (
    <div className="w-full h-full min-h-0 flex items-center justify-center p-4 md:p-6 bg-slate-900 relative overflow-hidden">
      <div className="w-full max-w-4xl flex gap-6 h-full min-h-0">
        <div className="w-1/2 bg-slate-950 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-0">
          <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 text-xs text-slate-400 font-mono flex items-center gap-2 shrink-0">
            <IconFile className="w-4 h-4" /> environment.yml
          </div>
          <div className="p-4 flex flex-col font-mono text-xs md:text-sm overflow-y-auto min-h-0">
            {YAML.map((line) => (
              <div
                key={line.text}
                onMouseEnter={() => setActiveSection(line.type)}
                onMouseLeave={() => setActiveSection('none')}
                className={`cursor-pointer px-2 py-0.5 rounded transition-colors ${activeSection === line.type ? 'bg-indigo-900/50 text-indigo-200 border-l-2 border-indigo-400' : 'text-slate-300 hover:bg-slate-800 border-l-2 border-transparent'}`}
              >
                <pre className="m-0 font-mono">{line.text}</pre>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/2 flex flex-col justify-center min-h-0">
          <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-xl min-h-[160px] flex flex-col justify-center shadow-lg">
            {activeSection === 'none' || !active ? (
              <div className="text-slate-500 italic text-center text-sm">Hover over lines in the environment.yml to see detailed explanations.</div>
            ) : (
              <div className="animate-[fadeIn_0.3s_ease-out]">
                <div className="text-indigo-400 font-bold mb-2 uppercase tracking-wider text-xs">Explanation</div>
                <div className="text-slate-200 text-sm leading-relaxed">{active.desc}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const DOCKER_LINES = [
  { code: 'FROM continuumio/miniconda3', desc: 'Minimal Conda Base Image (Recommended over massive Anaconda3)' },
  { code: 'COPY environment.yml .', desc: 'Copy declarative env file into the build context' },
  { code: 'RUN conda update -n base -c defaults conda \\', desc: 'Update base conda manager' },
  { code: ' && conda env create -f environment.yml \\', desc: 'Create isolated ML environment (Downloads massive packages)' },
  { code: ' && conda clean -afy', desc: 'CRITICAL: Removes downloaded cache in the SAME layer. Reduces image by GBs.' },
  { code: 'SHELL ["conda", "run", "-n", "ml_env", "/bin/bash", "-c"]', desc: 'Forces all subsequent RUN/CMD commands to execute inside the activated ml_env context.' },
  { code: 'RUN python -c "import torch"', desc: 'Runs seamlessly inside ml_env due to SHELL override.' },
  { code: 'CMD ["python", "app.py"]', desc: 'Container defaults to starting inside ml_env.' },
];

export function VisualCondaDockerfile() {
  const [step, setStep] = useState(0);

  return (
    <div className="w-full h-full min-h-0 flex flex-col p-4 md:p-6 bg-slate-900 relative overflow-hidden">
      <div className="flex justify-between items-center mb-4 gap-3">
        <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Conda Build Execution</div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setStep((n) => Math.max(0, n - 1))} disabled={step === 0} className="px-3 py-1.5 bg-slate-800 text-white text-xs rounded hover:bg-slate-700 disabled:opacity-50">Prev</button>
          <button type="button" onClick={() => setStep((n) => Math.min(DOCKER_LINES.length - 1, n + 1))} disabled={step === DOCKER_LINES.length - 1} className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded hover:bg-blue-500 disabled:opacity-50 shadow-lg">Step Forward</button>
        </div>
      </div>

      <div className="flex flex-1 gap-4 min-h-0">
        <div className="w-1/2 bg-slate-950 border border-slate-700 rounded-xl flex flex-col overflow-hidden min-h-0">
          <div className="bg-slate-800 px-3 py-1.5 text-[10px] text-slate-400 font-mono border-b border-slate-700">Dockerfile</div>
          <div className="p-4 font-mono text-[10px] md:text-xs text-slate-400 flex flex-col gap-1 overflow-y-auto">
            {DOCKER_LINES.map((line, idx) => (
              <div key={line.code} className={`px-2 py-1 rounded transition-colors duration-300 whitespace-pre-wrap ${step === idx ? 'bg-indigo-900/50 text-white border-l-2 border-indigo-400' : step > idx ? 'text-slate-300' : 'opacity-30'}`}>
                {line.code}
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/2 flex flex-col gap-4 min-h-0">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-600 shadow-inner min-h-[80px] flex items-center">
            <span className="text-sm text-slate-200">{DOCKER_LINES[step].desc}</span>
          </div>
          <div className="flex-1 bg-slate-950 rounded-xl border border-slate-700 relative flex flex-col items-center justify-center overflow-hidden p-4 min-h-[160px]">
            {step >= 2 && step <= 4 && (
              <div className="absolute top-4 right-4 flex flex-col items-end animate-[fadeIn_0.5s_ease-out]">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Image Layer Size</span>
                <span className={`text-2xl font-bold font-mono transition-colors duration-500 ${step === 3 ? 'text-red-400 scale-110' : 'text-emerald-400'}`}>
                  {step === 2 ? '15MB' : step === 3 ? '2.8 GB' : '1.1 GB'}
                </span>
                {step === 4 && <span className="text-[10px] text-emerald-400 bg-emerald-900/30 px-2 rounded mt-1 shadow">-1.7GB Cache Cleared!</span>}
              </div>
            )}
            <div className={`absolute inset-4 border-2 border-dashed rounded-xl transition-all duration-1000 ${step >= 5 ? 'border-indigo-500/50 bg-indigo-900/10' : 'border-transparent bg-transparent'}`}>
              {step >= 5 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-lg whitespace-nowrap">
                  SHELL Context: (ml_env) Activated
                </div>
              )}
            </div>
            <div className={`z-10 transition-all duration-500 flex flex-col items-center ${step === 3 ? 'scale-125' : 'scale-100'}`}>
              <IconBox className={`w-16 h-16 ${step === 3 ? 'text-red-400 animate-pulse' : step === 4 ? 'text-emerald-400' : step >= 5 ? 'text-indigo-400' : 'text-slate-600'}`} />
              {step === 6 && (
                <div className="mt-4 text-xs font-mono text-emerald-400 bg-black p-2 rounded shadow-lg border border-emerald-900">
                  $ python -c &quot;import torch&quot; → SUCCESS
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualArgVsEnv() {
  return (
    <div className="w-full h-full min-h-0 flex flex-col items-center justify-center p-4 md:p-6 bg-slate-900 relative overflow-auto">
      <div className="w-full max-w-4xl flex justify-between relative mt-8 gap-8">
        <div className="absolute top-24 left-10 right-10 h-2 bg-slate-700 rounded-full z-0">
          <div className="h-full bg-blue-500 rounded-full w-1/2 opacity-50" />
        </div>

        <div className="w-[45%] flex flex-col items-center z-10 relative">
          <div className="bg-slate-800 border-2 border-blue-500 text-white px-6 py-2 rounded-full font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] mb-4">Build Phase</div>
          <div className="text-[10px] text-slate-400 font-mono mb-4 bg-black px-2 py-1 rounded">docker build --build-arg PY_VER=3.9</div>
          <div className="w-full bg-slate-950 border border-slate-700 p-4 rounded-xl shadow-lg flex flex-col gap-3">
            <div className="bg-blue-900/30 border border-blue-500 p-2 rounded flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500 text-[8px] text-white px-1 font-bold">ARG</div>
              <span className="text-blue-300 font-bold text-xs mt-1">PY_VER</span>
              <span className="text-white font-mono text-xs">3.9</span>
            </div>
            <div className="bg-emerald-900/30 border border-emerald-500 p-2 rounded flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-[8px] text-white px-1 font-bold">ENV</div>
              <span className="text-emerald-300 font-bold text-xs mt-1">LOG_LEVEL</span>
              <span className="text-white font-mono text-xs">INFO</span>
            </div>
            <div className="text-[10px] text-slate-500 italic mt-2 text-center">Both variables are available during RUN commands to configure installations.</div>
          </div>
        </div>

        <div className="w-px bg-slate-600 absolute left-1/2 -translate-x-1/2 top-4 bottom-4 flex flex-col items-center z-20">
          <div className="bg-slate-900 text-[10px] text-slate-400 font-bold uppercase tracking-widest py-1 px-2 border border-slate-700 rounded mt-12 shadow-xl whitespace-nowrap">Image Created</div>
        </div>

        <div className="w-[45%] flex flex-col items-center z-10 relative">
          <div className="bg-slate-800 border-2 border-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-4">Runtime Phase</div>
          <div className="text-[10px] text-slate-400 font-mono mb-4 bg-black px-2 py-1 rounded">docker run my_image</div>
          <div className="w-full bg-slate-950 border border-slate-700 p-4 rounded-xl shadow-lg flex flex-col gap-3">
            <div className="bg-slate-800 border border-slate-700 p-2 rounded flex justify-between items-center opacity-40">
              <span className="text-slate-500 font-bold text-xs line-through">ARG PY_VER</span>
              <span className="text-slate-500 font-mono text-xs">Destroyed</span>
            </div>
            <div className="bg-emerald-900/30 border border-emerald-500 p-2 rounded flex justify-between items-center relative overflow-hidden shadow-inner">
              <div className="absolute top-0 right-0 bg-emerald-500 text-[8px] text-white px-1 font-bold">ENV</div>
              <span className="text-emerald-300 font-bold text-xs mt-1">LOG_LEVEL</span>
              <span className="text-white font-mono text-xs">INFO</span>
            </div>
            <div className="text-[10px] text-emerald-400/80 italic mt-2 text-center border-t border-emerald-900/50 pt-2">
              The Python app running inside can read <br />
              <code className="bg-black/50 px-1 rounded text-emerald-300">os.environ[&apos;LOG_LEVEL&apos;]</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualEnvOverrides() {
  const [logLevel, setLogLevel] = useState('INFO');
  const [envFileActive, setEnvFileActive] = useState(false);
  const [isHardcoded, setIsHardcoded] = useState(false);

  return (
    <div className="w-full h-full min-h-0 flex flex-col items-center justify-center p-4 md:p-6 bg-slate-900 relative overflow-auto">
      <div className="flex w-full h-full gap-6 min-h-0">
        <div className="w-[45%] flex flex-col gap-4 min-h-0">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-700 pb-2">Host Interventions</div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-700 shadow-md">
            <label className="text-xs text-slate-300 font-bold mb-2 block font-mono">-e LOG_LEVEL=</label>
            <div className="flex gap-2">
              {['INFO', 'DEBUG', 'WARNING'].map((lvl) => (
                <button key={lvl} type="button" onClick={() => setLogLevel(lvl)} className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${logLevel === lvl ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}>
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-700 shadow-md">
            <div className="flex justify-between items-center mb-2 gap-2">
              <label className="text-xs text-slate-300 font-bold font-mono">--env-file .env</label>
              <button type="button" onClick={() => setEnvFileActive((v) => !v)} className={`text-[10px] px-3 py-1 rounded font-bold transition-all ${envFileActive ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-400'}`}>
                {envFileActive ? 'Applied' : 'Apply File'}
              </button>
            </div>
            <div className={`font-mono text-[10px] p-2 rounded border transition-colors ${envFileActive ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
              MODEL_DIR=/data/models<br />
              BATCH_SIZE=64<br />
              ENABLE_GPU=true
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-colors relative overflow-hidden ${isHardcoded ? 'bg-red-900/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-slate-950 border-slate-700'}`}>
            {isHardcoded && <div className="absolute top-0 right-0 bg-red-600 text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-widest">Vulnerable</div>}
            <div className="flex justify-between items-center mb-2 gap-2">
              <label className="text-xs text-slate-300 font-bold flex items-center gap-1"><IconKey className="w-3 h-3" /> Secret Injection</label>
              <button type="button" onClick={() => setIsHardcoded((v) => !v)} className="text-[9px] bg-slate-800 text-slate-400 px-2 py-1 rounded hover:text-white border border-slate-600">Toggle Approach</button>
            </div>
            {isHardcoded ? (
              <div className="text-[10px] text-red-300">
                Hardcoded in Dockerfile:<br />
                <code className="bg-red-950/50 px-1 border border-red-800 mt-1 block">ENV API_KEY=xyz123</code>
              </div>
            ) : (
              <div className="text-[10px] text-emerald-300">
                Passed safely at runtime:<br />
                <code className="bg-emerald-950/50 px-1 border border-emerald-800 mt-1 block">docker run -e API_KEY=xyz123</code>
              </div>
            )}
          </div>
        </div>

        <div className="w-[55%] flex flex-col gap-4 min-h-0">
          <div className={`bg-black border border-red-500 rounded-lg p-3 transition-all duration-500 overflow-hidden ${isHardcoded ? 'opacity-100' : 'h-0 opacity-0 p-0 border-0'}`}>
            <div className="text-[10px] text-red-400 font-bold uppercase mb-1 flex items-center gap-1"><IconShield className="w-3 h-3" /> Hacker running `docker history`</div>
            <div className="font-mono text-[9px] text-slate-400">
              IMAGE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CREATED BY<br />
              <span className="text-red-500 bg-red-900/30">sha256:abcd12 &nbsp;&nbsp;/bin/sh -c ENV API_KEY=xyz123 &lt;-- EXPOSED!</span><br />
              sha256:efgh34 &nbsp;&nbsp;/bin/sh -c COPY . /app
            </div>
          </div>

          <div className="bg-slate-950 border-2 border-emerald-500/50 rounded-xl flex-1 flex flex-col overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.15)] min-h-0">
            <div className="bg-emerald-900/30 px-4 py-2 border-b border-emerald-800 flex justify-between items-center">
              <span className="text-emerald-400 font-bold text-xs flex items-center gap-1"><IconServer className="w-4 h-4" /> Running Container</span>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1 bg-slate-900 min-h-0">
              <div className="text-[10px] text-slate-500 font-bold uppercase">os.environ State (Python app)</div>
              <div className="font-mono text-[10px] md:text-xs text-slate-300 grid grid-cols-2 gap-y-2">
                <div className="text-slate-500">LOG_LEVEL</div>
                <div className="text-white font-bold">{logLevel}</div>
                <div className="text-slate-500">MODEL_DIR</div>
                <div className={`font-bold ${envFileActive ? 'text-emerald-400' : 'text-slate-600'}`}>{envFileActive ? '/data/models' : 'None'}</div>
                <div className="text-slate-500">BATCH_SIZE</div>
                <div className={`font-bold ${envFileActive ? 'text-emerald-400' : 'text-slate-600'}`}>{envFileActive ? '64' : 'None'}</div>
                <div className="text-slate-500">API_KEY</div>
                <div className={`font-bold ${isHardcoded ? 'text-red-400' : 'text-yellow-400'}`}>xyz123</div>
              </div>
              <div className="mt-auto bg-black rounded border border-slate-800 p-2 font-mono text-[9px] flex flex-col gap-1">
                <div className="text-slate-600">Starting ML process...</div>
                <div className={logLevel === 'DEBUG' ? 'text-slate-300' : 'text-slate-600'}>[{logLevel}] Initializing weights...</div>
                {envFileActive && <div className="text-slate-300">[{logLevel}] Loaded model from /data/models</div>}
                <div className={logLevel === 'WARNING' ? 'text-yellow-400 font-bold' : 'text-slate-600'}>[{logLevel}] Server ready.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
