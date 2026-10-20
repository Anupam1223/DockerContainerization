import { useEffect, useRef, useState } from 'react';

const IconCpu = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>;
const IconFolder = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const IconBox = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const IconPlay = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
const IconDatabase = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
const IconTrash = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconZap = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const IconServer = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>;

export function VisualDockerRunOrchestrator({ initialScript = 'train', initialMount = 'bind', initialLifecycle = 'rm' }) {
  const [scriptTask, setScriptTask] = useState(initialScript);
  const [mountMode, setMountMode] = useState(initialMount);
  const [lifecycleMode, setLifecycleMode] = useState(initialLifecycle);
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const runJob = () => {
    setIsRunning(true);
    setHasFinished(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setIsRunning(false);
      setHasFinished(true);
    }, 1800);
  };

  const dataMountStr = mountMode === 'bind' ? '$(pwd)/data:/app/data:ro' : 'training_data_v1:/app/data:ro';
  const outMountStr = mountMode === 'bind' ? '$(pwd)/output:/app/output' : 'model_artifacts_v1:/app/output';
  const cmdStr = scriptTask === 'train'
    ? 'python train.py --data-dir /app/data --model-dir /app/output/models --epochs 20'
    : 'python preprocess_data.py --input /app/data --output /app/output/cleaned';

  return (
    <div className="w-full h-full flex flex-col p-5 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 pr-36 mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => { setScriptTask('train'); setHasFinished(false); }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${scriptTask === 'train' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Run train.py
            </button>
            <button
              type="button"
              onClick={() => { setScriptTask('preprocess'); setHasFinished(false); }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${scriptTask === 'preprocess' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Override: preprocess_data.py
            </button>
          </div>

          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => { setMountMode('bind'); setHasFinished(false); }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${mountMode === 'bind' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Bind Mounts (:ro)
            </button>
            <button
              type="button"
              onClick={() => { setMountMode('volume'); setHasFinished(false); }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${mountMode === 'volume' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Docker Volumes (:ro)
            </button>
          </div>

          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => { setLifecycleMode('rm'); setHasFinished(false); }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${lifecycleMode === 'rm' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              --rm (Auto-Cleanup)
            </button>
            <button
              type="button"
              onClick={() => { setLifecycleMode('detached'); setHasFinished(false); }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${lifecycleMode === 'detached' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              -d (Detached BG)
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={runJob}
          disabled={isRunning}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
        >
          <IconPlay className="w-3.5 h-3.5" />
          {isRunning ? 'Orchestrating...' : 'Execute docker run'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 items-center min-h-0 my-1">
        <div className="md:col-span-3 h-full bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1">
            Host System
          </div>

          <div className="space-y-2 my-auto">
            <div className="p-2 rounded-lg bg-slate-900 border border-blue-500/40 font-mono text-[10px]">
              <div className="text-[9px] font-sans font-bold text-blue-400 uppercase">
                {mountMode === 'bind' ? 'Host Dir (Read-Only :ro)' : 'Named Volume (:ro)'}
              </div>
              <div className="text-slate-200 truncate">{mountMode === 'bind' ? '$(pwd)/data' : 'training_data_v1'}</div>
            </div>

            <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-[10px]">
              <div className="text-[9px] font-sans font-bold text-amber-400 uppercase">Terminal CLI</div>
              <div className="text-slate-300">docker run {lifecycleMode === 'rm' ? '--rm' : '-d'}</div>
            </div>

            <div className={`p-2 rounded-lg border font-mono text-[10px] transition-all ${
              hasFinished ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]' : 'bg-slate-900 border-emerald-500/40'
            }`}
            >
              <div className="text-[9px] font-sans font-bold text-emerald-400 uppercase">
                {mountMode === 'bind' ? 'Host Output Dir (:rw)' : 'Artifacts Volume (:rw)'}
              </div>
              <div className="text-slate-200 truncate">{mountMode === 'bind' ? '$(pwd)/output' : 'model_artifacts_v1'}</div>
              {hasFinished && (
                <div className="text-[9px] text-emerald-300 font-bold mt-0.5">
                  ✓ {scriptTask === 'train' ? 'model.pkl saved!' : 'cleaned_data.csv saved!'}
                </div>
              )}
            </div>
          </div>

          <div className="text-[9px] text-slate-500 text-center">
            Note: <code className="text-amber-400">--rm</code> &amp; <code className="text-purple-400">-d</code> are mutually exclusive!
          </div>
        </div>

        <div className="md:col-span-3 h-full bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 border-b border-slate-800 pb-1">
            Docker Engine
          </div>

          <div className="my-auto space-y-2.5">
            <div className={`p-2.5 rounded-xl border transition-all ${
              isRunning ? 'bg-indigo-950/50 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-slate-900 border-slate-700'
            }`}
            >
              <IconServer className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-white">Docker Daemon</div>
              <div className="text-[9px] text-slate-400 mt-0.5">
                Mounts volumes, injects <code className="text-purple-300">-e</code>, enforces CPU/RAM
              </div>
            </div>

            <div className="text-indigo-400 font-mono text-[10px]">↓ Loads Base Layers ↓</div>

            <div className="p-2 rounded-xl bg-teal-950/30 border border-teal-500/40">
              <IconBox className="w-4 h-4 text-teal-400 mx-auto mb-0.5" />
              <div className="text-[10px] font-mono font-bold text-teal-300">your-ml-training-image</div>
              <div className="text-[9px] text-slate-400">Immutable Image Layers</div>
            </div>
          </div>

          <div className="text-[9px] font-mono text-slate-400 bg-slate-900 py-1 px-2 rounded border border-slate-800">
            --cpus=&quot;4&quot; --memory=&quot;16g&quot;
          </div>
        </div>

        <div className={`md:col-span-6 h-full rounded-xl p-3.5 border-2 flex flex-col justify-between transition-all duration-500 ${
          isRunning
            ? 'bg-slate-950 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.25)]'
            : hasFinished && lifecycleMode === 'rm'
              ? 'bg-slate-950/40 border-dashed border-amber-500/50 opacity-75'
              : 'bg-slate-950 border-slate-800'
        }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <IconCpu className={`w-4 h-4 text-blue-400 ${isRunning ? 'animate-spin' : ''}`} />
              Running Container: <code className="text-amber-300 font-mono text-[11px]">my_experiment_001</code>
            </span>
            {isRunning && <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold animate-pulse">RUNNING</span>}
            {hasFinished && lifecycleMode === 'rm' && <span className="text-[9px] bg-amber-600 text-white px-2 py-0.5 rounded font-bold">AUTO-REMOVED (--rm)</span>}
            {hasFinished && lifecycleMode === 'detached' && <span className="text-[9px] bg-purple-600 text-white px-2 py-0.5 rounded font-bold">EXITED (Needs docker rm)</span>}
          </div>

          <div className="grid grid-cols-2 gap-2 my-auto font-mono text-[10px]">
            <div className="col-span-2 bg-emerald-950/30 border border-emerald-500/40 p-2 rounded-lg">
              <div className="text-[9px] font-sans font-bold uppercase text-emerald-400">Active Process (CMD / ENTRYPOINT)</div>
              <div className="text-emerald-200 truncate">{cmdStr}</div>
            </div>

            <div className="bg-slate-900 border border-blue-500/30 p-2 rounded-lg">
              <div className="text-[9px] font-sans font-bold uppercase text-blue-400">Mounted Data (:ro)</div>
              <div className="text-slate-300">/app/data (Read-Only)</div>
            </div>

            <div className="bg-slate-900 border border-emerald-500/30 p-2 rounded-lg">
              <div className="text-[9px] font-sans font-bold uppercase text-emerald-400">Mounted Output (:rw)</div>
              <div className="text-slate-300">/app/output (Read-Write)</div>
            </div>

            <div className="bg-slate-900 border border-purple-500/30 p-2 rounded-lg">
              <div className="text-[9px] font-sans font-bold uppercase text-purple-400">Injected Env Vars (-e)</div>
              <div className="text-purple-200">LEARNING_RATE=0.005</div>
              <div className="text-purple-200">WANDB_API_KEY=***</div>
            </div>

            <div className="bg-slate-900 border border-slate-700 p-2 rounded-lg">
              <div className="text-[9px] font-sans font-bold uppercase text-slate-400">Container Filesystem</div>
              <div className="text-slate-300">Image Layers + Temp RW</div>
            </div>
          </div>

          <div className="bg-black border border-slate-800 rounded-lg p-2 font-mono text-[10px] text-slate-300 leading-relaxed">
            <span className="text-emerald-400">$</span> docker run {lifecycleMode === 'rm' ? '--rm' : '-d'} --name my_experiment_001 \<br />
            &nbsp;&nbsp;<span className="text-blue-300">-v {dataMountStr}</span> <span className="text-emerald-300">-v {outMountStr}</span> \<br />
            &nbsp;&nbsp;<span className="text-purple-300">-e LEARNING_RATE=0.005 -e WANDB_API_KEY=secret</span> \<br />
            &nbsp;&nbsp;your-ml-training-image:latest <span className="text-amber-300">{cmdStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualBasicRun = () => <VisualDockerRunOrchestrator />;
export const VisualOverrideCmd = () => <VisualDockerRunOrchestrator initialScript="preprocess" />;
export const VisualBindTrain = () => <VisualDockerRunOrchestrator initialMount="bind" />;
export const VisualNamedVolumes = () => <VisualDockerRunOrchestrator initialMount="volume" />;
export const VisualRunConfig = () => <VisualDockerRunOrchestrator />;
export const VisualDetached = () => <VisualDockerRunOrchestrator initialLifecycle="detached" />;
export const VisualResources = () => <VisualDockerRunOrchestrator />;
export const VisualLifecycle = () => <VisualDockerRunOrchestrator initialLifecycle="rm" />;
export const VisualDaemonFlow = () => <VisualDockerRunOrchestrator />;

export function VisualLogPersistenceFlow({ initialStorage = 'volume' }) {
  const [storageMode, setStorageMode] = useState(initialStorage);
  const [containerState, setContainerState] = useState('running');

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Log Storage Strategy:</span>
          <button
            type="button"
            onClick={() => { setStorageMode('none'); setContainerState('running'); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              storageMode === 'none' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            1. Ephemeral Only (No -v)
          </button>
          <button
            type="button"
            onClick={() => { setStorageMode('bind'); setContainerState('running'); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              storageMode === 'bind' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            2. Bind Mount (-v)
          </button>
          <button
            type="button"
            onClick={() => { setStorageMode('volume'); setContainerState('running'); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              storageMode === 'volume' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            3. Docker Volume (-v)
          </button>
        </div>

        <button
          type="button"
          onClick={() => setContainerState(containerState === 'running' ? 'removed' : 'running')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
            containerState === 'running' ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {containerState === 'running' ? <><IconTrash className="w-3.5 h-3.5" /> Simulate docker rm</> : 'Restart Container'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center min-h-0 my-1">
        <div className={`md:col-span-7 h-full rounded-xl p-4 border-2 flex flex-col justify-between transition-all duration-500 ${
          containerState === 'removed'
            ? 'bg-slate-950/30 border-dashed border-rose-500/40 opacity-40 scale-95'
            : 'bg-slate-950 border-slate-700'
        }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <IconBox className="w-4 h-4 text-blue-400" /> Container (training_job)
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
              containerState === 'running' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-600 text-white'
            }`}
            >
              {containerState === 'running' ? 'RUNNING' : 'REMOVED (docker rm)'}
            </span>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-300 space-y-1 my-auto">
            <div className="text-slate-400"># Dual logging inside train.py:</div>
            <div>log_file = <span className="text-emerald-300">&apos;/app/logs/training.log&apos;</span></div>
            <div>logging.basicConfig(</div>
            <div>&nbsp;&nbsp;level=logging.INFO,</div>
            <div>&nbsp;&nbsp;handlers=[</div>
            <div className="text-emerald-300 font-bold">&nbsp;&nbsp;&nbsp;&nbsp;logging.FileHandler(log_file),</div>
            <div className="text-blue-300 font-bold">&nbsp;&nbsp;&nbsp;&nbsp;logging.StreamHandler(sys.stdout)</div>
            <div>&nbsp;&nbsp;]</div>
            <div>)</div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 font-mono text-[10px]">
            <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/40">
              <div className="font-sans font-bold text-[9px] text-blue-400 uppercase">Stream 1: sys.stdout</div>
              <div className="text-slate-300 mt-0.5">Captured by <code className="text-blue-300">docker logs -f</code></div>
              <div className="text-[9px] text-rose-400 font-sans mt-1">⚠ Deleted when container is removed!</div>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40">
              <div className="font-sans font-bold text-[9px] text-emerald-400 uppercase">Stream 2: FileHandler</div>
              <div className="text-white font-bold mt-0.5">/app/logs/training.log</div>
              <div className="text-[9px] text-emerald-300 font-sans mt-1">
                {storageMode === 'none' ? '⚠ Written to ephemeral layer!' : '✓ Mounted to external storage!'}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 h-full bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
            Docker Host Persistence
          </div>

          <div className="space-y-3 my-auto">
            <div className={`p-3 rounded-xl border-2 transition-all ${
              storageMode === 'bind'
                ? 'bg-blue-950/30 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                : 'bg-slate-900/40 border-slate-800 opacity-40'
            }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-blue-400 font-mono">
                <span className="flex items-center gap-1.5"><IconFolder className="w-4 h-4" /> /path/on/host/training_logs</span>
                <span className="text-[9px] font-sans uppercase bg-blue-900/60 text-blue-200 px-1.5 py-0.5 rounded">Bind Mount</span>
              </div>
              <div className="text-[10px] font-mono text-slate-300 mt-1.5">
                -v /path/on/host/training_logs:/app/logs
              </div>
              {storageMode === 'bind' && (
                <div className="mt-2 bg-slate-950 p-1.5 rounded border border-blue-500/40 text-[10px] font-mono text-emerald-300 flex items-center justify-between">
                  <span>training.log (2026-10-19 INFO...)</span>
                  <span className="text-[9px] bg-emerald-600 text-white px-1.5 rounded font-sans font-bold">SURVIVES rm</span>
                </div>
              )}
            </div>

            <div className={`p-3 rounded-xl border-2 transition-all ${
              storageMode === 'volume'
                ? 'bg-emerald-950/30 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                : 'bg-slate-900/40 border-slate-800 opacity-40'
            }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400 font-mono">
                <span className="flex items-center gap-1.5"><IconDatabase className="w-4 h-4" /> ml_training_logs</span>
                <span className="text-[9px] font-sans uppercase bg-emerald-900/60 text-emerald-200 px-1.5 py-0.5 rounded">Docker Volume</span>
              </div>
              <div className="text-[10px] font-mono text-slate-300 mt-1.5">
                -v ml_training_logs:/app/logs
              </div>
              {storageMode === 'volume' && (
                <div className="mt-2 bg-slate-950 p-1.5 rounded border border-emerald-500/40 text-[10px] font-mono text-emerald-300 flex items-center justify-between">
                  <span>training.log (2026-10-19 INFO...)</span>
                  <span className="text-[9px] bg-emerald-600 text-white px-1.5 rounded font-sans font-bold">SURVIVES rm</span>
                </div>
              )}
            </div>
          </div>

          <div className={`p-2.5 rounded-lg border text-[11px] font-medium ${
            containerState === 'removed' && storageMode === 'none'
              ? 'bg-rose-950/50 border-rose-500 text-rose-200'
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}
          >
            {containerState === 'removed' && storageMode === 'none'
              ? '❌ Disaster! Both docker logs AND /app/logs/training.log were permanently deleted with the container!'
              : '✓ Even after docker rm deletes stdout logs, your mounted training.log file remains safely persisted.'}
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualStdoutCapture = () => <VisualLogPersistenceFlow initialStorage="none" />;
export const VisualFileLogger = () => <VisualLogPersistenceFlow initialStorage="none" />;
export const VisualPersistLog = () => <VisualLogPersistenceFlow initialStorage="bind" />;

export function VisualStructuredCentralLogging({ initialFormat = 'json' }) {
  const [formatMode, setFormatMode] = useState(initialFormat);
  const [filterHighLoss, setFilterHighLoss] = useState(false);

  const sampleLogs = [
    { container: 'exp_run_01', level: 'INFO', msg: 'Training started', lr: 0.01, epoch: 1, loss: 0.68 },
    { container: 'exp_run_02', level: 'INFO', msg: 'Epoch completed', lr: 0.005, epoch: 5, loss: 0.21 },
    { container: 'exp_run_03', level: 'WARNING', msg: 'Gradient spike detected', lr: 0.05, epoch: 3, loss: 1.45 },
  ];

  const visibleLogs = filterHighLoss ? sampleLogs.filter((l) => l.loss > 0.5) : sampleLogs;

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFormatMode('raw')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              formatMode === 'raw' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Unstructured Text Log
          </button>
          <button
            type="button"
            onClick={() => setFormatMode('json')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              formatMode === 'json' ? 'bg-teal-600 text-white shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Structured JSON (python-json-logger)
          </button>
        </div>

        <button
          type="button"
          onClick={() => setFilterHighLoss(!filterHighLoss)}
          disabled={formatMode === 'raw'}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
            formatMode === 'raw'
              ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
              : filterHighLoss
                ? 'bg-indigo-600 border-indigo-400 text-white'
                : 'bg-slate-900 border-indigo-500/40 text-indigo-300 hover:bg-indigo-950'
          }`}
        >
          {formatMode === 'raw' ? 'Query Disabled (Unstructured)' : filterHighLoss ? 'Filter: loss > 0.5 (ACTIVE)' : 'Query JSON: loss > 0.5'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-5 flex flex-col gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-[10px] flex-1 flex flex-col justify-between">
            <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-teal-400 border-b border-slate-800 pb-1">
              Python Structured Formatter
            </div>
            <div className="text-slate-300 space-y-1 my-auto leading-relaxed">
              <div><span className="text-purple-400">from</span> pythonjsonlogger <span className="text-purple-400">import</span> jsonlogger</div>
              <div>log_handler = logging.FileHandler(<span className="text-amber-300">&apos;/app/logs/training.log&apos;</span>)</div>
              <div className="text-teal-300 font-bold">
                formatter = jsonlogger.JsonFormatter(<br />
                &nbsp;&nbsp;&apos;%(asctime)s %(levelname)s %(message)s&apos;<br />
                )
              </div>
              <div>log_handler.setFormatter(formatter)</div>
              <div className="pt-1 text-blue-300">
                logger.info(<span className="text-amber-300">&quot;Training started&quot;</span>,<br />
                &nbsp;&nbsp;<strong className="text-emerald-300">extra={'{\'learning_rate\': 0.01, \'epochs\': 10}'}</strong>)
              </div>
            </div>
          </div>

          <div className="bg-black border border-slate-800 rounded-xl p-3 font-mono text-[10px]">
            <div className="text-[9px] font-sans font-bold uppercase tracking-widest text-indigo-400 mb-1">
              Forwarding to Centralized Systems
            </div>
            <div className="text-slate-300">
              <span className="text-emerald-400">$</span> docker run <span className="text-indigo-300">--log-driver=awslogs</span> \<br />
              &nbsp;&nbsp;<span className="text-indigo-300">--log-opt awslogs-group=ml-training</span> my-image
            </div>
          </div>
        </div>

        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Centralized Log Platform (ELK / Grafana Loki / CloudWatch)
            </span>
            <span className="text-[10px] font-mono text-slate-400">{visibleLogs.length} events matched</span>
          </div>

          <div className="space-y-2.5 my-auto font-mono text-[10px]">
            {visibleLogs.map((log) => (
              <div key={log.container} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-[9px] text-slate-400 mb-1">
                  <span className="font-bold text-indigo-300">container: {log.container}</span>
                  <span className={log.level === 'WARNING' ? 'text-amber-400 font-bold' : 'text-emerald-400'}>{log.level}</span>
                </div>
                {formatMode === 'raw' ? (
                  <div className="text-slate-300">
                    2026-10-19 12:31:00 - {log.level} - {log.msg} (lr={log.lr}, epoch={log.epoch}, loss={log.loss})
                  </div>
                ) : (
                  <div className="text-teal-300 break-all">
                    {`{"asctime": "2026-10-19 12:31:00", "levelname": "${log.level}", "message": "${log.msg}", `}
                    <span className="text-amber-300 font-bold">{`"learning_rate": ${log.lr}, "epochs": ${log.epoch}, "loss": ${log.loss}`}</span>
                    {'}'}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2">
            <span>Aggregates logs across 100s of parallel training containers</span>
            <span className="text-teal-400 font-bold">Searchable &amp; Alert-Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualStructured = () => <VisualStructuredCentralLogging initialFormat="json" />;
export const VisualCentralLogs = () => <VisualStructuredCentralLogging initialFormat="json" />;

export function VisualNvidiaToolkitBridge({ initialInstalled = true }) {
  const [toolkitInstalled, setToolkitInstalled] = useState(initialInstalled);

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800">
        <div>
          <span className="text-xs font-bold text-white uppercase tracking-wider">How the NVIDIA Container Toolkit Works</span>
          <span className="text-[11px] text-slate-400 ml-2">Bridging Host GPU Drivers &amp; Isolated Containers</span>
        </div>
        <button
          type="button"
          onClick={() => setToolkitInstalled(!toolkitInstalled)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
            toolkitInstalled ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          NVIDIA Container Toolkit: {toolkitInstalled ? 'ACTIVE (--gpus)' : 'MISSING (Default Docker)'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-1 min-h-0">
        <div className="md:col-span-6 h-full bg-slate-950 border-2 border-slate-700 rounded-xl p-4 flex flex-col justify-between relative">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1.5">
            Host Machine (Prerequisites 1–4)
          </div>

          <div className="grid grid-cols-2 gap-3 my-auto">
            <div className="p-3 bg-slate-900 rounded-xl border border-emerald-500/50 flex flex-col items-center text-center">
              <IconCpu className="w-6 h-6 text-emerald-400 mb-1" />
              <div className="text-xs font-bold text-white">1. NVIDIA GPU</div>
              <div className="text-[10px] text-slate-400">Physical Hardware (e.g. A100)</div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-teal-500/50 flex flex-col items-center text-center">
              <div className="text-xs font-bold text-teal-300 mt-1">2. Host NVIDIA Driver</div>
              <div className="text-[10px] text-slate-400 mt-1">Installed directly on Host OS (libcuda.so, /dev/nvidia0)</div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-blue-500/40 flex flex-col items-center text-center">
              <div className="text-xs font-bold text-blue-300">3. Docker Daemon</div>
              <div className="text-[10px] text-slate-400 mt-1">Intercepts <code className="text-white">--gpus</code> flag</div>
            </div>

            <div className={`p-3 rounded-xl border-2 flex flex-col items-center text-center transition-all ${
              toolkitInstalled
                ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                : 'bg-rose-950/30 border-rose-500/40 opacity-50'
            }`}
            >
              <div className="text-xs font-bold text-white">4. NVIDIA Container Toolkit</div>
              <div className="text-[10px] text-emerald-300 font-mono mt-0.5">nvidia-container-toolkit</div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center">
            Full hardware drivers live on the <strong>Host</strong>, keeping container images portable!
          </div>
        </div>

        <div className="md:col-span-1 flex flex-col items-center justify-center">
          <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase text-center ${
            toolkitInstalled ? 'bg-emerald-600 text-white animate-pulse' : 'bg-rose-950 text-rose-400 border border-rose-500/40'
          }`}
          >
            {toolkitInstalled ? 'Mounts →' : 'Blocked ✕'}
          </div>
        </div>

        <div className={`md:col-span-5 h-full rounded-xl p-4 border-2 flex flex-col justify-between transition-all duration-500 ${
          toolkitInstalled ? 'bg-slate-950 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.15)]' : 'bg-slate-950 border-rose-500/40'
        }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400 border-b border-slate-800 pb-1.5">
            Docker Container (Isolated)
          </div>

          <div className="space-y-2.5 my-auto">
            <div className={`p-2.5 rounded-lg border text-xs transition-all ${
              toolkitInstalled ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-500 line-through'
            }`}
            >
              <div className="font-bold text-[10px] uppercase text-emerald-400">Mounted Driver Files &amp; Devices</div>
              <div className="text-[10px] font-mono mt-0.5">Auto-mounted from Host by Toolkit at runtime</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-indigo-500/40 text-xs">
              <div className="font-bold text-[10px] uppercase text-indigo-400">CUDA &amp; cuDNN Libraries</div>
              <div className="text-[10px] text-slate-300 mt-0.5">Baked into GPU-aware Docker Base Image</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-blue-500/40 text-xs">
              <div className="font-bold text-[10px] uppercase text-blue-400">ML Training App (PyTorch / TensorFlow)</div>
              <div className="text-[10px] text-slate-300 mt-0.5">
                {toolkitInstalled
                  ? '✓ Directly accesses Host NVIDIA GPU for tensor ops!'
                  : '❌ Cannot see GPU hardware; falls back to slow CPU!'}
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-center py-1 px-2 bg-black rounded border border-slate-800 text-emerald-400">
            {toolkitInstalled ? 'ML App <═══ accesses ═══> Host NVIDIA GPU' : 'Hardware Isolation Active (No GPU)'}
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualGpuBridge = () => <VisualNvidiaToolkitBridge initialInstalled={false} />;
export const VisualGpuPrep = () => <VisualNvidiaToolkitBridge initialInstalled />;
export const VisualGpuToolkit = () => <VisualNvidiaToolkitBridge initialInstalled />;

export function VisualGpuAllocationLab({ initialFlag = 'all' }) {
  const [gpuFlag, setGpuFlag] = useState(initialFlag);

  const flagOptions = {
    none: { flag: '(No --gpus flag)', activeIds: [], desc: 'Default Docker isolation: zero GPUs exposed to container.' },
    all: { flag: '--gpus all', activeIds: [0, 1, 2, 3], desc: 'Exposes all 4 available host NVIDIA GPUs to the container.' },
    device0: { flag: '--gpus device=0', activeIds: [0], desc: 'Exposes only GPU with index 0 (ideal for single-GPU experiments).' },
    device12: { flag: '--gpus device=1,2', activeIds: [1, 2], desc: 'Pins the container specifically to GPUs 1 and 2 (leaving 0 & 3 free).' },
    count2: { flag: '--gpus count=2', activeIds: [0, 1], desc: 'Exposes the first 2 available GPUs (indices 0 and 1).' },
  };

  const current = flagOptions[gpuFlag];

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="bg-slate-950 border border-slate-800 p-3 pr-36 rounded-xl mb-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
          Select <code className="text-emerald-400">--gpus</code> Runtime Flag Pattern:
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(flagOptions).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => setGpuFlag(key)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                gpuFlag === key
                  ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {item.flag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center min-h-0">
        <div className="md:col-span-6 h-full bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-1.5">
            Host Server Rack (4x NVIDIA A100 GPUs)
          </div>

          <div className="grid grid-cols-2 gap-2.5 my-auto">
            {[0, 1, 2, 3].map((id) => {
              const isActive = current.activeIds.includes(id);
              return (
                <div
                  key={id}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between ${
                    isActive
                      ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] scale-[1.02]'
                      : 'bg-slate-900/50 border-slate-800 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">GPU index={id}</span>
                    <IconZap className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-600'}`} />
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">/dev/nvidia{id}</div>
                  <div className={`text-[9px] font-bold uppercase mt-1.5 px-1.5 py-0.5 rounded w-fit ${
                    isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                  }`}
                  >
                    {isActive ? 'Mounted to Container' : 'Isolated / Idle'}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400">{current.desc}</div>
        </div>

        <div className="md:col-span-6 h-full flex flex-col gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-[10px] flex-1 flex flex-col justify-between">
            <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-indigo-400 border-b border-slate-800 pb-1">
              GPU-Aware Dockerfile (Pre-baked CUDA/cuDNN)
            </div>
            <div className="space-y-1 text-slate-300 my-auto">
              <div className="text-slate-500"># Official TensorFlow GPU base image</div>
              <div><span className="text-pink-400">FROM</span> <span className="text-emerald-300 font-bold">tensorflow/tensorflow:2.10.0-gpu</span></div>
              <div><span className="text-pink-400">WORKDIR</span> /app</div>
              <div><span className="text-pink-400">COPY</span> requirements.txt .</div>
              <div><span className="text-pink-400">RUN</span> pip install --no-cache-dir -r requirements.txt</div>
              <div><span className="text-pink-400">COPY</span> . .</div>
              <div><span className="text-pink-400">CMD</span> [&quot;python&quot;, &quot;train.py&quot;]</div>
            </div>
          </div>

          <div className="bg-black border border-slate-800 rounded-xl p-3.5 font-mono text-[10px]">
            <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-emerald-400 mb-1">
              Host Terminal Execution
            </div>
            <div className="text-slate-300 leading-relaxed">
              <span className="text-emerald-400">$</span> docker run --rm {gpuFlag !== 'none' && <strong className="text-emerald-400 bg-emerald-950/60 px-1 rounded">{current.flag}</strong>} \<br />
              &nbsp;&nbsp;-v $(pwd)/data:/app/data -v $(pwd)/output:/app/output \<br />
              &nbsp;&nbsp;my-gpu-training-image:latest \<br />
              &nbsp;&nbsp;python train.py --epochs 50
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualGpuRun = () => <VisualGpuAllocationLab initialFlag="all" />;

export function VisualGpuVerificationSandbox() {
  const [activeTab, setActiveTab] = useState('smi');
  const [gpusEnabled, setGpusEnabled] = useState(true);

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800">
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('smi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'smi' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            1. nvidia-smi CLI
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tf')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'tf' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            2. TensorFlow Check
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pytorch')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'pytorch' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            3. PyTorch Check
          </button>
        </div>

        <button
          type="button"
          onClick={() => setGpusEnabled(!gpusEnabled)}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
            gpusEnabled
              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500 text-rose-300'
          }`}
        >
          Runtime Flag: {gpusEnabled ? '--gpus all (ENABLED)' : 'Omitted (NO GPU)'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] flex flex-col justify-between">
          <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1.5">
            {activeTab === 'smi' ? 'Host Terminal Command' : activeTab === 'tf' ? 'Python: TensorFlow GPU Check' : 'Python: PyTorch CUDA Check'}
          </div>

          {activeTab === 'smi' && (
            <div className="my-auto space-y-3 text-slate-300">
              <div className="text-slate-400 font-sans text-xs">
                Run <code className="text-emerald-300">nvidia-smi</code> inside an official NVIDIA CUDA base container to verify driver &amp; device passthrough:
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 leading-relaxed">
                <span className="text-emerald-400">$</span> docker run --rm {gpusEnabled ? <strong className="text-emerald-300">--gpus all</strong> : ''} \<br />
                &nbsp;&nbsp;nvidia/cuda:11.8.0-base-ubuntu22.04 \<br />
                &nbsp;&nbsp;<strong className="text-amber-300">nvidia-smi</strong>
              </div>
            </div>
          )}

          {activeTab === 'tf' && (
            <div className="my-auto bg-slate-900 p-3 rounded-lg border border-slate-800 text-[10px] text-slate-300 space-y-1 leading-relaxed">
              <div><span className="text-purple-400">import</span> tensorflow <span className="text-purple-400">as</span> tf</div>
              <div>gpus = <span className="text-amber-300">tf.config.list_physical_devices(&apos;GPU&apos;)</span></div>
              <div>print(<span className="text-emerald-300">&quot;Num GPUs Available: &quot;</span>, len(gpus))</div>
              <div><span className="text-purple-400">if</span> gpus:</div>
              <div>&nbsp;&nbsp;<span className="text-purple-400">for</span> gpu <span className="text-purple-400">in</span> gpus:</div>
              <div className="text-blue-300">&nbsp;&nbsp;&nbsp;&nbsp;tf.config.experimental.set_memory_growth(gpu, True)</div>
              <div>&nbsp;&nbsp;print(<span className="text-emerald-300">&quot;Memory growth enabled.&quot;</span>)</div>
            </div>
          )}

          {activeTab === 'pytorch' && (
            <div className="my-auto bg-slate-900 p-3 rounded-lg border border-slate-800 text-[10px] text-slate-300 space-y-1 leading-relaxed">
              <div><span className="text-purple-400">import</span> torch</div>
              <div>available = <span className="text-amber-300">torch.cuda.is_available()</span></div>
              <div>count = <span className="text-amber-300">torch.cuda.device_count()</span></div>
              <div>name = <span className="text-blue-300">torch.cuda.get_device_name(0)</span> <span className="text-purple-400">if</span> available <span className="text-purple-400">else</span> <span className="text-rose-300">&quot;N/A&quot;</span></div>
              <div>print(f<span className="text-emerald-300">&quot;CUDA Available: {'{available}'}&quot;</span>)</div>
              <div>print(f<span className="text-emerald-300">&quot;Device Count: {'{count}'}&quot;</span>)</div>
              <div>print(f<span className="text-emerald-300">&quot;Device Name (GPU 0): {'{name}'}&quot;</span>)</div>
            </div>
          )}

          <div className="text-[10px] font-sans text-slate-500">
            Tip: Run these checks at the very start of your training script to fail fast if GPUs are missing!
          </div>
        </div>

        <div className="md:col-span-6 bg-black border border-slate-800 rounded-xl p-4 font-mono text-[11px] flex flex-col justify-between">
          <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-emerald-400 border-b border-slate-800 pb-1.5">
            Container Standard Output (stdout)
          </div>

          <div className="my-auto">
            {activeTab === 'smi' && (
              gpusEnabled ? (
                <pre className="text-[9.5px] text-emerald-300 leading-snug overflow-x-auto">
{`+-----------------------------------------------------------------------------+
| NVIDIA-SMI 535.104.05   Driver Version: 535.104.05   CUDA Version: 12.2     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
|   0  NVIDIA A100-SXM...  On   | 00000000:00:04.0 Off |                    0 |
+-------------------------------+----------------------+----------------------+`}
                </pre>
              ) : (
                <div className="text-rose-400 space-y-1">
                  <div>docker: Error response from daemon: exec: &quot;nvidia-smi&quot;: executable file not found in $PATH</div>
                  <div className="text-slate-500 text-[10px]"># Without --gpus all, the NVIDIA Container Toolkit never mounted nvidia-smi or host drivers!</div>
                </div>
              )
            )}

            {activeTab === 'tf' && (
              gpusEnabled ? (
                <div className="space-y-1 text-emerald-300">
                  <div>Num GPUs Available:  1</div>
                  <div>Memory growth enabled.</div>
                </div>
              ) : (
                <div className="space-y-1 text-amber-300">
                  <div>Num GPUs Available:  0</div>
                  <div className="text-slate-500 text-[10px]"># TensorFlow silently falls back to CPU when --gpus is omitted!</div>
                </div>
              )
            )}

            {activeTab === 'pytorch' && (
              gpusEnabled ? (
                <div className="space-y-1 text-emerald-300">
                  <div>CUDA Available: True</div>
                  <div>Device Count: 1</div>
                  <div>Device Name (GPU 0): NVIDIA A100-SXM4-40GB</div>
                </div>
              ) : (
                <div className="space-y-1 text-rose-300">
                  <div>CUDA Available: False</div>
                  <div>Device Count: 0</div>
                  <div>Device Name (GPU 0): N/A</div>
                </div>
              )
            )}
          </div>

          <div className="text-[10px] font-sans text-slate-400 border-t border-slate-900 pt-2">
            {gpusEnabled ? '✓ Hardware passthrough verified inside container.' : '⚠ Toggle "--gpus all" above to restore GPU access.'}
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualGpuCheck = VisualGpuVerificationSandbox;

export function VisualComposeGpu() {
  const [up, setUp] = useState(false);
  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-slate-900">
      <div className="flex-1 min-h-0 flex items-center justify-center p-6">
        <div className="flex items-center gap-5">
          <div className="rounded-xl border border-slate-500 px-3 py-4 text-xs text-white">training</div>
          <div className={`rounded-xl border px-3 py-4 font-mono text-[11px] transition-opacity ${up ? 'border-emerald-400 text-emerald-200 opacity-100' : 'border-emerald-400 text-emerald-200 opacity-25'}`}>
            count: 1
          </div>
        </div>
      </div>
      <div className="shrink-0 flex justify-center pb-5">
        <button type="button" onClick={() => setUp((v) => !v)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg active:scale-95">
          {up ? 'Reset' : 'docker compose up'}
        </button>
      </div>
    </div>
  );
}
