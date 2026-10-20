import { useEffect, useRef, useState } from 'react';

const IconFileCode = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconBox = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const IconCheck = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconAlert = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const IconPlay = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
const IconSliders = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>;

export function VisualBrittleVsFlexible({ initial = 'brittle' }) {
  const [mode, setMode] = useState(initial);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const triggerRun = () => {
    setRunning(true);
    setFinished(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setRunning(false);
      setFinished(true);
    }, 1600);
  };

  const switchMode = (newMode) => {
    clearTimeout(timer.current);
    setMode(newMode);
    setRunning(false);
    setFinished(false);
  };

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-950 p-3 rounded-xl border border-slate-800 z-20 pr-36">
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => switchMode('brittle')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'brittle'
                ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Brittle Script (Hardcoded)
          </button>
          <button
            type="button"
            onClick={() => switchMode('container')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'container'
                ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Container-Ready (4 Principles)
          </button>
        </div>
        <button
          type="button"
          onClick={triggerRun}
          disabled={running}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all shrink-0"
        >
          <IconPlay className="w-3.5 h-3.5" />
          {running ? 'Executing Container...' : 'Test in Container'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-1 min-h-0">
        <div className="md:col-span-4 h-full bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between min-h-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1.5">
            Runtime Environment
          </div>
          <div className="space-y-2.5 my-auto">
            <div className={`p-2.5 rounded-lg border text-xs font-mono transition-all ${mode === 'container' ? 'bg-blue-950/40 border-blue-500/50 text-blue-300' : 'bg-slate-900 border-slate-800 text-slate-500 opacity-50'}`}>
              <div className="text-[10px] font-sans font-bold uppercase text-blue-400">1. Mounted Volume</div>
              /data/train.csv
            </div>
            <div className={`p-2.5 rounded-lg border text-xs font-mono transition-all ${mode === 'container' ? 'bg-purple-950/40 border-purple-500/50 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-500 opacity-50'}`}>
              <div className="text-[10px] font-sans font-bold uppercase text-purple-400">2. Runtime Config</div>
              --lr 0.005 --epochs 20
            </div>
            <div className={`p-2.5 rounded-lg border text-xs font-mono transition-all ${mode === 'container' ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500 opacity-50'}`}>
              <div className="text-[10px] font-sans font-bold uppercase text-emerald-400">3. Output Volume</div>
              /output/model.pkl
            </div>
          </div>
          <div className="text-[10px] text-slate-500 text-center">
            {mode === 'brittle' ? 'Script ignores external runtime inputs!' : 'Injected dynamically at docker run'}
          </div>
        </div>

        <div className={`md:col-span-8 h-full rounded-xl p-4 border-2 flex flex-col justify-between relative transition-all duration-500 min-h-0 ${
          mode === 'brittle'
            ? finished ? 'bg-rose-950/20 border-rose-500 shadow-[0_0_25px_rgba(225,29,72,0.25)]' : 'bg-slate-950 border-rose-500/40'
            : finished ? 'bg-emerald-950/20 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.25)]' : 'bg-slate-950 border-emerald-500/40'
        }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 gap-2">
            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-white">
              <IconBox className="w-4 h-4 text-blue-400" /> Isolated Container Instance (Stateless)
            </span>
            {running && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-bold animate-pulse shrink-0">Running train.py...</span>}
            {finished && mode === 'brittle' && <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded font-bold shrink-0">CRASHED (Exit 1)</span>}
            {finished && mode === 'container' && <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold shrink-0">SUCCESS (Exit 0)</span>}
          </div>

          {mode === 'brittle' ? (
            <div className="my-auto space-y-2.5 font-mono text-[11px]">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-rose-500/30 flex items-center justify-between gap-2">
                <div>
                  <span className="text-slate-500"># Hardcoded user path</span><br />
                  <span className="text-rose-300">df = pd.read_csv(&quot;/Users/alice/Desktop/data.csv&quot;)</span>
                </div>
                <span className="text-[10px] bg-rose-950 text-rose-400 px-2 py-0.5 rounded border border-rose-500/40 font-sans font-bold shrink-0">Path Missing!</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-rose-500/30 flex items-center justify-between gap-2">
                <div>
                  <span className="text-slate-500"># Embedded hyperparameters</span><br />
                  <span className="text-rose-300">LEARNING_RATE = 0.01  # Must rebuild image to change!</span>
                </div>
                <span className="text-[10px] bg-rose-950 text-rose-400 px-2 py-0.5 rounded border border-rose-500/40 font-sans font-bold shrink-0">Rigid</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-rose-500/30 flex items-center justify-between gap-2">
                <div>
                  <span className="text-slate-500"># Local file logging &amp; state</span><br />
                  <span className="text-rose-300">open(&quot;train.log&quot;, &quot;w&quot;).write(&quot;Epoch 1...&quot;)</span>
                </div>
                <span className="text-[10px] bg-rose-950 text-rose-400 px-2 py-0.5 rounded border border-rose-500/40 font-sans font-bold shrink-0">Lost on --rm!</span>
              </div>
            </div>
          ) : (
            <div className="my-auto grid grid-cols-2 gap-2.5">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-blue-500/40">
                <div className="text-[10px] font-bold text-blue-400 uppercase mb-1">1. Parameterize I/O</div>
                <div className="font-mono text-[10px] text-slate-300">Accepts <code className="text-blue-300">--data-path</code> &amp; <code className="text-emerald-300">--model-path</code> dynamically.</div>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-purple-500/40">
                <div className="text-[10px] font-bold text-purple-400 uppercase mb-1">2. Externalize Config</div>
                <div className="font-mono text-[10px] text-slate-300">Hyperparameters (<code className="text-purple-300">--lr</code>, <code className="text-purple-300">EPOCHS</code>) passed at runtime.</div>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-amber-500/40">
                <div className="text-[10px] font-bold text-amber-400 uppercase mb-1">3. Standardize Logging</div>
                <div className="font-mono text-[10px] text-slate-300">Streams to <code className="text-amber-300">stdout/stderr</code> for <code className="text-amber-300">docker logs</code>.</div>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-emerald-500/40">
                <div className="text-[10px] font-bold text-emerald-400 uppercase mb-1">4. Stateless Execution</div>
                <div className="font-mono text-[10px] text-slate-300">Pure function of inputs + config; zero leftover state needed.</div>
              </div>
            </div>
          )}

          <div className="bg-black border border-slate-800 rounded-lg p-2.5 font-mono text-[11px] h-20 overflow-y-auto">
            {!running && !finished && <span className="text-slate-500"># Click &quot;Test in Container&quot; to observe runtime behavior...</span>}
            {running && <span className="text-blue-400 animate-pulse">&gt; Starting containerized training process...</span>}
            {finished && mode === 'brittle' && (
              <div className="text-rose-400">
                FileNotFoundError: [Errno 2] No such file or directory: &apos;/Users/alice/Desktop/data.csv&apos;<br />
                <span className="text-slate-500"># Container exited with code 1. Hardcoded laptop paths do not exist inside Linux containers!</span>
              </div>
            )}
            {finished && mode === 'container' && (
              <div className="text-emerald-400">
                [stdout] Loading data from: /data/train.csv<br />
                [stdout] Training model with learning rate: 0.005<br />
                [stdout] Saving model to: /output/model.pkl — Training complete!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualPrinciplesReady = () => <VisualBrittleVsFlexible initial="container" />;

export function VisualArgparseEntrypoint({ initialDirective = 'ENTRYPOINT' }) {
  const [dataPath, setDataPath] = useState('/data/input.csv');
  const [modelPath, setModelPath] = useState('/output/final_model.pkl');
  const [lr, setLr] = useState('0.005');
  const [dockerDirective, setDockerDirective] = useState(initialDirective);

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-hidden">
      <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl mb-4 z-20 pr-36">
        <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
            <IconSliders className="w-3.5 h-3.5" /> Configure Runtime CLI Arguments
          </span>
          <div className="flex gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setDockerDirective('ENTRYPOINT')}
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${dockerDirective === 'ENTRYPOINT' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              Option 2: ENTRYPOINT (Executable)
            </button>
            <button
              type="button"
              onClick={() => setDockerDirective('CMD')}
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${dockerDirective === 'CMD' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              Option 1: CMD
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">--data-path (required)</label>
            <select value={dataPath} onChange={(e) => setDataPath(e.target.value)} className="w-full bg-slate-900 border border-blue-500/40 rounded px-2 py-1 text-blue-300 outline-none">
              <option value="/data/input.csv">/data/input.csv</option>
              <option value="/data/augmented_v2.csv">/data/augmented_v2.csv</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">--model-path (required)</label>
            <select value={modelPath} onChange={(e) => setModelPath(e.target.value)} className="w-full bg-slate-900 border border-emerald-500/40 rounded px-2 py-1 text-emerald-300 outline-none">
              <option value="/output/final_model.pkl">/output/final_model.pkl</option>
              <option value="/output/exp_2/model.pkl">/output/exp_2/model.pkl</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">--lr (default=0.01)</label>
            <select value={lr} onChange={(e) => setLr(e.target.value)} className="w-full bg-slate-900 border border-amber-500/40 rounded px-2 py-1 text-amber-300 outline-none">
              <option value="0.005">0.005 (Custom)</option>
              <option value="0.001">0.001 (Custom)</option>
              <option value="0.01">0.01 (Default)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px]">
            <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-400 mb-1.5 border-b border-slate-800 pb-1">
              Dockerfile Definition
            </div>
            <div className="text-slate-400">WORKDIR /app</div>
            <div className="text-slate-400">COPY training_script.py .</div>
            <div className="text-indigo-300 font-bold mt-1">
              {dockerDirective} [&quot;python&quot;, &quot;training_script.py&quot;]
            </div>
            <div className="text-[10px] font-sans text-slate-400 mt-1.5">
              {dockerDirective === 'ENTRYPOINT'
                ? 'Behaves like an executable: runtime flags append directly to python training_script.py!'
                : 'Note: With CMD alone, passing flags without the command would override python training_script.py!'}
            </div>
          </div>
          <div className="bg-black border border-slate-800 rounded-xl p-3 font-mono text-[11px] flex-1 flex flex-col justify-center">
            <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-emerald-400 mb-1.5">
              Host Terminal Execution
            </div>
            <div className="text-slate-300 leading-relaxed">
              <span className="text-emerald-400">$</span> docker run my-image \<br />
              {dockerDirective === 'CMD' && <span className="text-indigo-300">&nbsp;&nbsp;python training_script.py \<br /></span>}
              &nbsp;&nbsp;<span className="text-blue-300">--data-path {dataPath}</span> \<br />
              &nbsp;&nbsp;<span className="text-emerald-300">--model-path {modelPath}</span> \<br />
              &nbsp;&nbsp;<span className="text-amber-300">--lr {lr}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between font-mono text-[11px] min-h-0">
          <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-purple-400 border-b border-slate-800 pb-1.5">
            Inside Container: training_script.py
          </div>
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[10px] space-y-1 text-slate-300">
            <div className="text-purple-300">parser = argparse.ArgumentParser()</div>
            <div>parser.add_argument(<span className="text-blue-300">&apos;--data-path&apos;</span>, required=True)</div>
            <div>parser.add_argument(<span className="text-emerald-300">&apos;--model-path&apos;</span>, required=True)</div>
            <div>parser.add_argument(<span className="text-amber-300">&apos;--lr&apos;</span>, type=float, default=0.01)</div>
            <div className="text-purple-300">args = parser.parse_args()</div>
          </div>
          <div className="bg-indigo-950/30 border border-indigo-500/40 rounded-lg p-2.5">
            <div className="text-[9px] font-sans font-bold uppercase tracking-wider text-indigo-300 mb-1">
              Parsed Namespace (args)
            </div>
            <div className="grid grid-cols-1 gap-1 text-[10px]">
              <div>args.data_path = <span className="text-blue-300 font-bold">&quot;{dataPath}&quot;</span></div>
              <div>args.model_path = <span className="text-emerald-300 font-bold">&quot;{modelPath}&quot;</span></div>
              <div>args.lr = <span className="text-amber-300 font-bold">{lr}</span> <span className="text-slate-500">(float)</span></div>
            </div>
          </div>
          <div className="bg-black p-2.5 rounded-lg border border-slate-800 text-[10px] text-slate-300 space-y-0.5">
            <div className="text-blue-300">Loading data from: {dataPath}</div>
            <div className="text-amber-300">Training model with learning rate: {lr}</div>
            <div className="text-emerald-300">Saving model to: {modelPath}</div>
            <div className="text-white font-bold">Training complete.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualPathsAndLogging() {
  const [useMakedirs, setUseMakedirs] = useState(true);
  const [logTarget, setLogTarget] = useState('stdout');

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-hidden gap-4">
      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between min-h-0">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 gap-2 pr-36">
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider">1. Handling File Paths Safely</span>
            <span className="text-[11px] text-slate-400 ml-2 font-mono">os.path.join() + os.makedirs(exist_ok=True)</span>
          </div>
          <button
            type="button"
            onClick={() => setUseMakedirs(!useMakedirs)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${useMakedirs ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}
          >
            os.makedirs: {useMakedirs ? 'ENABLED' : 'OMITTED'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center my-auto">
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
            <div className="text-slate-400"># Target path inside newly mounted volume:</div>
            <div className="text-blue-300">model_path = os.path.join(output_dir, &quot;run_42&quot;, &quot;model.pkl&quot;)</div>
            <div className={useMakedirs ? 'text-emerald-400 font-bold' : 'text-slate-600 line-through'}>
              os.makedirs(os.path.dirname(model_path), exist_ok=True)
            </div>
            <div className="text-slate-300">joblib.dump(model, model_path)</div>
          </div>
          <div className={`p-3 rounded-lg border-2 transition-all font-mono text-xs ${useMakedirs ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/30 border-rose-500/50 text-rose-300'}`}>
            {useMakedirs ? (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-sans font-bold text-emerald-400 text-xs">
                  <IconCheck className="w-4 h-4" /> Directory Tree Auto-Created!
                </div>
                <div className="text-[11px] text-slate-300">
                  /output/ <span className="text-emerald-400">&rarr; run_42/</span> &rarr; <strong className="text-white">model.pkl</strong>
                </div>
                <div className="text-[10px] font-sans text-slate-400">
                  Even if the mounted volume starts completely empty, your script safely builds missing sub-folders.
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-sans font-bold text-rose-400 text-xs">
                  <IconAlert className="w-4 h-4" /> FileNotFoundError: &apos;/output/run_42/model.pkl&apos;
                </div>
                <div className="text-[10px] font-sans text-rose-200">
                  Mounted volumes often don&apos;t have nested sub-directories pre-created! Writing without <code>os.makedirs</code> crashes after hours of training.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between min-h-0">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 gap-2 flex-wrap pr-36">
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider">2. Logging to Standard Streams</span>
            <span className="text-[11px] text-slate-400 ml-2 font-mono">stream=sys.stdout vs Local Log File</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setLogTarget('stdout')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${logTarget === 'stdout' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              stream=sys.stdout (Best Practice)
            </button>
            <button
              type="button"
              onClick={() => setLogTarget('file')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${logTarget === 'file' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              filename=&quot;train.log&quot; (Anti-Pattern)
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-auto">
          <div className="md:col-span-5 bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[10px] space-y-1">
            <div className="text-purple-300">import logging, sys</div>
            {logTarget === 'stdout' ? (
              <div className="text-blue-300">
                logging.basicConfig(<br />
                &nbsp;&nbsp;level=logging.INFO,<br />
                &nbsp;&nbsp;<strong className="text-emerald-400">stream=sys.stdout</strong><br />
                )
              </div>
            ) : (
              <div className="text-amber-300">
                logging.basicConfig(<br />
                &nbsp;&nbsp;level=logging.INFO,<br />
                &nbsp;&nbsp;<strong className="text-rose-400">filename=&quot;/app/train.log&quot;</strong><br />
                )
              </div>
            )}
            <div className="text-slate-300">logging.info(&quot;Starting training...&quot;)</div>
          </div>
          <div className="md:col-span-2 flex flex-col items-center justify-center text-center">
            <div className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${logTarget === 'stdout' ? 'bg-blue-950 text-blue-300 border border-blue-500/40' : 'bg-rose-950 text-rose-300 border border-rose-500/40'}`}>
              {logTarget === 'stdout' ? 'Docker Logging Driver' : 'Trapped in Container FS'}
            </div>
          </div>
          <div className="md:col-span-5 bg-black p-3 rounded-lg border border-slate-800 font-mono text-[10px] h-24 flex flex-col justify-between">
            <div className="text-emerald-400">$ docker logs training_container</div>
            {logTarget === 'stdout' ? (
              <div className="text-slate-300 space-y-0.5">
                <div>2026-10-16 12:00:01 - INFO - Starting training...</div>
                <div className="text-amber-300">2026-10-16 12:00:05 - WARNING - Minor issue...</div>
                <div className="text-emerald-300">2026-10-16 12:00:10 - INFO - Training finished.</div>
              </div>
            ) : (
              <div className="text-slate-500 italic my-auto">
                (No output! Logs were written to /app/train.log inside the ephemeral container layer and vanished!)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualConfigHierarchy() {
  const [envDataOverride, setEnvDataOverride] = useState(false);
  const [envLrOverride, setEnvLrOverride] = useState(false);
  const [cliLrOverride, setCliLrOverride] = useState(false);
  const [cliEpochsOverride, setCliEpochsOverride] = useState(false);

  const effectiveDataPath = envDataOverride ? '/data/augmented_train.csv' : '/data/train.csv';
  const dataSource = envDataOverride ? 'Tier 2: Runtime -e' : 'Tier 1: Dockerfile ENV';
  const effectiveLr = cliLrOverride ? '0.0005' : envLrOverride ? '0.001' : '0.01';
  const lrSource = cliLrOverride ? 'Tier 3: CLI Argument (--learning-rate)' : envLrOverride ? 'Tier 2: Runtime -e (LEARNING_RATE)' : 'Tier 1: os.getenv Fallback';
  const effectiveEpochs = cliEpochsOverride ? '25' : '10';
  const epochsSource = cliEpochsOverride ? 'Tier 3: CLI Argument (--epochs)' : 'Tier 1: os.getenv Fallback';

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-hidden">
      <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center justify-between pr-36 gap-2">
        <span>The Hybrid Pattern: <code className="text-teal-400">argparse</code> + <code className="text-indigo-400">os.getenv()</code> Precedence</span>
        <span className="text-[10px] bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-300 shrink-0">
          1 Immutable Image &rarr; Infinite Experiments
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 z-20">
        <div className="bg-slate-950 border border-slate-700 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <span className="text-[10px] font-bold uppercase text-slate-300">Tier 1: Image &amp; Code Defaults</span>
            <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Lowest Priority</span>
          </div>
          <div className="font-mono text-[10px] text-slate-400 space-y-1">
            <div><span className="text-pink-400">ENV</span> TRAINING_DATA_PATH=/data/train.csv</div>
            <div><span className="text-pink-400">ENV</span> MODEL_OUTPUT_DIR=/output</div>
            <div className="text-slate-500 pt-1"># Python os.getenv fallbacks:</div>
            <div>LEARNING_RATE = <span className="text-slate-200">0.01</span></div>
            <div>EPOCHS = <span className="text-slate-200">10</span></div>
          </div>
        </div>
        <div className="bg-slate-950 border border-indigo-500/40 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <span className="text-[10px] font-bold uppercase text-indigo-400">Tier 2: Runtime Env (-e)</span>
            <span className="text-[9px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">Overrides Tier 1</span>
          </div>
          <div className="space-y-2 my-auto">
            <button type="button" onClick={() => setEnvDataOverride(!envDataOverride)} className={`w-full text-left px-2.5 py-1.5 rounded-lg font-mono text-[10px] border transition-all flex items-center justify-between ${envDataOverride ? 'bg-indigo-600/30 border-indigo-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              <span>-e TRAINING_DATA_PATH=/data/augmented...</span>
              <span className="text-[9px] font-sans font-bold">{envDataOverride ? 'ON' : 'OFF'}</span>
            </button>
            <button type="button" onClick={() => setEnvLrOverride(!envLrOverride)} className={`w-full text-left px-2.5 py-1.5 rounded-lg font-mono text-[10px] border transition-all flex items-center justify-between ${envLrOverride ? 'bg-indigo-600/30 border-indigo-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              <span>-e LEARNING_RATE=0.001</span>
              <span className="text-[9px] font-sans font-bold">{envLrOverride ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
        <div className="bg-slate-950 border border-teal-500/40 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <span className="text-[10px] font-bold uppercase text-teal-400">Tier 3: CLI Args (argparse)</span>
            <span className="text-[9px] bg-teal-950 text-teal-300 px-1.5 py-0.5 rounded border border-teal-500/30">Highest Priority</span>
          </div>
          <div className="space-y-2 my-auto">
            <button type="button" onClick={() => setCliLrOverride(!cliLrOverride)} className={`w-full text-left px-2.5 py-1.5 rounded-lg font-mono text-[10px] border transition-all flex items-center justify-between ${cliLrOverride ? 'bg-teal-600/30 border-teal-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              <span>--learning-rate 0.0005</span>
              <span className="text-[9px] font-sans font-bold">{cliLrOverride ? 'ON' : 'OFF'}</span>
            </button>
            <button type="button" onClick={() => setCliEpochsOverride(!cliEpochsOverride)} className={`w-full text-left px-2.5 py-1.5 rounded-lg font-mono text-[10px] border transition-all flex items-center justify-between ${cliEpochsOverride ? 'bg-teal-600/30 border-teal-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              <span>--epochs 25</span>
              <span className="text-[9px] font-sans font-bold">{cliEpochsOverride ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-[10px] flex flex-col justify-between">
          <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1">
            Python Hybrid Pattern (train.py)
          </div>
          <div className="text-slate-300 space-y-1.5 my-auto leading-relaxed">
            <div>
              parser.add_argument(<span className="text-teal-300">&apos;--data-path&apos;</span>,<br />
              &nbsp;&nbsp;default=os.getenv(<span className="text-indigo-300">&apos;TRAINING_DATA_PATH&apos;</span>, <span className="text-slate-400">&apos;/data/train.csv&apos;</span>))
            </div>
            <div>
              parser.add_argument(<span className="text-teal-300">&apos;--learning-rate&apos;</span>, type=float,<br />
              &nbsp;&nbsp;default=float(os.getenv(<span className="text-indigo-300">&apos;LEARNING_RATE&apos;</span>, <span className="text-slate-400">0.01</span>)))
            </div>
            <div>
              parser.add_argument(<span className="text-teal-300">&apos;--epochs&apos;</span>, type=int,<br />
              &nbsp;&nbsp;default=int(os.getenv(<span className="text-indigo-300">&apos;EPOCHS&apos;</span>, <span className="text-slate-400">10</span>)))
            </div>
          </div>
        </div>
        <div className="md:col-span-5 bg-black border border-slate-800 rounded-xl p-3.5 font-mono text-[11px] flex flex-col justify-between">
          <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-emerald-400 border-b border-slate-800 pb-1">
            Effective Training Configuration
          </div>
          <div className="space-y-2 my-auto">
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <div className="text-white font-bold">Data Path: <span className="text-emerald-300">{effectiveDataPath}</span></div>
              <div className="text-[9px] font-sans text-slate-400">Won by: {dataSource}</div>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <div className="text-white font-bold">Learning Rate: <span className="text-amber-300">{effectiveLr}</span></div>
              <div className="text-[9px] font-sans text-slate-400">Won by: {lrSource}</div>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <div className="text-white font-bold">Epochs: <span className="text-teal-300">{effectiveEpochs}</span></div>
              <div className="text-[9px] font-sans text-slate-400">Won by: {epochsSource}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CONFIGS = {
  resnet: {
    yaml: 'experiment_name: "resnet50_baseline"\nmodel:\n  architecture: "resnet50"\n  pretrained: true\n  dropout: 0.3\noptimizer:\n  type: "AdamW"\n  lr: 0.001\n  weight_decay: 0.01\ndata_augmentation:\n  - random_crop\n  - horizontal_flip',
    summary: 'Loaded ResNet-50 (AdamW, lr=0.001, 2 augmentations)',
  },
  transformer: {
    yaml: 'experiment_name: "vit_large_exp"\nmodel:\n  architecture: "vision_transformer"\n  num_layers: 12\n  num_heads: 8\noptimizer:\n  type: "SGD"\n  lr: 0.0002\n  momentum: 0.9\ndata_augmentation:\n  - mixup\n  - auto_augment',
    summary: 'Loaded Vision Transformer (12 layers, 8 heads, SGD)',
  },
};

export function VisualComplexConfigYaml() {
  const [selectedConfig, setSelectedConfig] = useState('resnet');

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-hidden">
      <div className="grid grid-cols-3 gap-2.5 mb-4 z-20 pr-36">
        <div className="bg-slate-950 border border-indigo-500/40 p-2.5 rounded-xl">
          <div className="text-[10px] font-bold uppercase text-indigo-400">Env Vars (ENV / -e)</div>
          <div className="text-[11px] text-white font-semibold mt-0.5">Defines the CONTEXT</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Dev/Staging/Prod paths, DB URLs, secrets.</div>
        </div>
        <div className="bg-slate-950 border border-teal-500/40 p-2.5 rounded-xl">
          <div className="text-[10px] font-bold uppercase text-teal-400">CLI Args (argparse)</div>
          <div className="text-[11px] text-white font-semibold mt-0.5">Defines the TASK</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Experiment flags, <code>--lr</code>, <code>--evaluate-only</code>.</div>
        </div>
        <div className="bg-slate-950 border border-amber-500/40 p-2.5 rounded-xl">
          <div className="text-[10px] font-bold uppercase text-amber-400">Mounted Config File</div>
          <div className="text-[11px] text-white font-semibold mt-0.5">Complex Nested Params</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Bind-mounted <code>config.yaml</code> or <code>params.json</code>.</div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center min-h-0">
        <div className="md:col-span-5 h-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between min-h-0">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <IconFileCode className="w-3.5 h-3.5" /> Host: $(pwd)/config.yaml
            </span>
            <div className="flex gap-1">
              <button type="button" onClick={() => setSelectedConfig('resnet')} className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${selectedConfig === 'resnet' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                ResNet YAML
              </button>
              <button type="button" onClick={() => setSelectedConfig('transformer')} className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${selectedConfig === 'transformer' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                ViT YAML
              </button>
            </div>
          </div>
          <pre className="font-mono text-[10px] text-amber-200/90 bg-slate-900 p-2.5 rounded-lg border border-slate-800 overflow-y-auto flex-1 my-2 leading-relaxed">
            {CONFIGS[selectedConfig].yaml}
          </pre>
          <div className="text-[10px] text-slate-400">
            1. Edit nested YAML on host without rebuilding image!
          </div>
        </div>

        <div className="md:col-span-7 h-full flex flex-col gap-3 min-h-0">
          <div className="bg-black border border-slate-800 rounded-xl p-3 font-mono text-[11px]">
            <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-400 mb-1">
              2. Bind Mount File &amp; Pass Path via CLI Flag
            </div>
            <div className="text-slate-300">
              <span className="text-emerald-400">$</span> docker run \<br />
              &nbsp;&nbsp;<span className="text-amber-300">-v $(pwd)/config.yaml:/app/config.yaml</span> \<br />
              &nbsp;&nbsp;my_training_image <span className="text-teal-300">--config /app/config.yaml</span>
            </div>
          </div>
          <div className="flex-1 bg-slate-950 border-2 border-teal-500/40 rounded-xl p-3.5 flex flex-col justify-between min-h-0">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400">
                3. Inside Container: PyYAML Parser
              </span>
              <span className="text-[9px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30 font-mono">
                /app/config.yaml
              </span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-300 space-y-1 my-auto">
              <div><span className="text-purple-400">import</span> yaml</div>
              <div><span className="text-purple-400">with</span> open(args.config, <span className="text-amber-300">&apos;r&apos;</span>) <span className="text-purple-400">as</span> f:</div>
              <div>&nbsp;&nbsp;config = yaml.safe_load(f)</div>
            </div>
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-lg p-2.5 flex items-center justify-between">
              <div className="font-mono text-[11px] text-emerald-300 font-bold flex items-center gap-2">
                <IconCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                {CONFIGS[selectedConfig].summary}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
