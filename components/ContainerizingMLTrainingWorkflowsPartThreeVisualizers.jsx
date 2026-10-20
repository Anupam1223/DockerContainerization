import { useEffect, useRef, useState } from 'react';

const IconCpu = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>;
const IconFileCode = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconFolder = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const IconCheck = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconPlay = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
const IconDatabase = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;

const workflowSteps = [
  { num: 1, title: '1. Read Hyperparameters', detail: 'Training container fetches config from Config Web Service' },
  { num: 2, title: '2. Fetch Data IDs', detail: 'Queries PostgreSQL database for training sample IDs' },
  { num: 3, title: '3. Run Training Process', detail: 'Executes model training inside isolated Python container' },
  { num: 4, title: '4. Save Metrics & Artifacts', detail: 'Writes model to shared volume & logs metrics back to DB' },
];

export function VisualManualVsCompose({ initialMode = 'compose', initialStep = 0 }) {
  const [mode, setMode] = useState(initialMode);
  const [activeStep, setActiveStep] = useState(initialStep);

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'manual'
                ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Manual CLI (Multiple docker run)
          </button>
          <button
            type="button"
            onClick={() => setMode('compose')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'compose'
                ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Declarative Stack (Docker Compose)
          </button>
        </div>

        <div className="flex gap-1.5">
          {workflowSteps.map((s, idx) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                activeStep === idx ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Step {s.num}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center min-h-0">
        <div className="md:col-span-5 h-full bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between font-mono text-[10px]">
          <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1.5">
            {mode === 'manual' ? 'Manual Orchestration (Fragile)' : 'Single Declarative Command'}
          </div>

          {mode === 'manual' ? (
            <div className="space-y-2 my-auto text-rose-300">
              <div className="p-2 bg-slate-900 rounded border border-rose-500/30">
                <span className="text-slate-500"># 1. Manually create bridge network</span><br />
                $ docker network create ml_net
              </div>
              <div className="p-2 bg-slate-900 rounded border border-rose-500/30">
                <span className="text-slate-500"># 2. Create named volumes manually</span><br />
                $ docker volume create db_data<br />
                $ docker volume create model_output
              </div>
              <div className="p-2 bg-slate-900 rounded border border-rose-500/30">
                <span className="text-slate-500"># 3. Start DB &amp; Config containers</span><br />
                $ docker run -d --net ml_net --name db postgres<br />
                $ docker run -d --net ml_net --name cfg config_svc
              </div>
              <div className="p-2 bg-slate-900 rounded border border-rose-500/30">
                <span className="text-slate-500"># 4. Hope DB is ready, then run training!</span><br />
                $ docker run --net ml_net -e DB_HOST=db ...
              </div>
            </div>
          ) : (
            <div className="space-y-3 my-auto">
              <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/50 text-emerald-300">
                <div className="text-[9px] font-sans font-bold uppercase text-emerald-400 mb-1">Start Entire Stack</div>
                <span className="text-white font-bold text-xs">$ docker-compose up</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 space-y-1.5 font-sans text-[11px]">
                <div className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Shared Network:</strong> Automatic DNS by service name (<code>db</code>, <code>config</code>).</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Managed Volumes:</strong> Attaches <code>db_data</code> &amp; <code>model_output</code>.</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Startup Order:</strong> Respects <code>depends_on</code> &amp; tears down via <code>docker-compose down</code>.</span>
                </div>
              </div>
            </div>
          )}

          <div className="text-[10px] font-sans text-slate-500">
            {mode === 'manual' ? '⚠ Easy to misconfigure network flags or startup order!' : '✓ Entire topology version-controlled in docker-compose.yml'}
          </div>
        </div>

        <div className={`md:col-span-7 h-full rounded-xl p-4 border-2 flex flex-col justify-between transition-all ${
          mode === 'compose' ? 'bg-slate-950 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)]' : 'bg-slate-950 border-rose-500/40'
        }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              {mode === 'compose' ? 'Compose Shared Network (Auto-DNS)' : 'Manual Container Wiring'}
            </span>
            <span className="text-[10px] bg-blue-600/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded font-bold">
              {workflowSteps[activeStep].title}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-auto">
            <div className="col-span-2 p-3 rounded-xl bg-blue-950/30 border-2 border-blue-500 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <IconCpu className="w-6 h-6 text-blue-400 animate-pulse" />
                <div>
                  <div className="text-xs font-bold text-white">Training Service (Python Script)</div>
                  <div className="text-[10px] text-blue-300 font-mono">{workflowSteps[activeStep].detail}</div>
                </div>
              </div>
              <span className="text-[9px] font-mono bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded">service: training</span>
            </div>

            <div className={`p-3 rounded-xl border transition-all ${
              activeStep === 0 ? 'bg-amber-950/40 border-amber-400 scale-[1.02]' : 'bg-slate-900 border-slate-800'
            }`}
            >
              <div className="text-[10px] font-bold text-amber-400 uppercase">1. Config Web Service</div>
              <div className="text-[10px] text-slate-300 mt-1">Serves hyperparameters JSON/YAML over HTTP</div>
            </div>

            <div className={`p-3 rounded-xl border transition-all ${
              activeStep === 1 || activeStep === 3 ? 'bg-emerald-950/40 border-emerald-400 scale-[1.02]' : 'bg-slate-900 border-slate-800'
            }`}
            >
              <div className="text-[10px] font-bold text-emerald-400 uppercase">2. Database Service (db)</div>
              <div className="text-[10px] text-slate-300 mt-1">Provides sample IDs &amp; stores experiment metrics</div>
            </div>

            <div className={`col-span-2 p-2.5 rounded-xl border transition-all flex items-center justify-between ${
              activeStep === 3 ? 'bg-purple-950/40 border-purple-400' : 'bg-slate-900 border-slate-800'
            }`}
            >
              <span className="text-[10px] font-bold text-purple-300 uppercase flex items-center gap-1.5">
                <IconDatabase className="w-4 h-4 text-purple-400" /> Shared Volumes (model_output &amp; db_data)
              </span>
              <span className="text-[10px] font-mono text-slate-400">Persists models &amp; DB tables</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center">
            Click <strong>Step 1 – 4</strong> above to trace how the training container interacts with the stack!
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualManyRuns = () => <VisualManualVsCompose initialMode="manual" />;
export const VisualFourNeeds = () => <VisualManualVsCompose initialMode="compose" initialStep={0} />;
export const VisualComposeOps = () => <VisualManualVsCompose initialMode="compose" />;
export const VisualShareStack = () => <VisualManualVsCompose initialMode="compose" />;

const yamlDetails = {
  training: {
    badge: 'services.training',
    title: 'Training Service Definition',
    desc: 'Uses build: . to build the image from the local Dockerfile, mounts ./data (bind mount) and model_output (named volume), and waits for db via depends_on.',
  },
  dns: {
    badge: 'DB_HOST=db + depends_on',
    title: 'Service Name DNS & Startup Order',
    desc: 'Because Compose places all services on a shared network, setting DB_HOST=db lets Python connect directly to the PostgreSQL container using "db" as the hostname!',
  },
  db: {
    badge: 'services.db',
    title: 'PostgreSQL Database Service',
    desc: 'Pulls the pre-built postgres:14-alpine image, configures database credentials via environment variables, and persists database files into db_data.',
  },
  volumes: {
    badge: 'volumes:',
    title: 'Top-Level Named Volumes Declaration',
    desc: 'Declares db_data and model_output so Docker manages their lifecycle persistently across container restarts.',
  },
};

export function VisualComposeYamlExplorer({ initialSection = 'training' }) {
  const [selectedSection, setSelectedSection] = useState(initialSection);

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-slate-950 p-2.5 pr-36 rounded-xl border border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Inspect YAML Block:</span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'training', label: '1. training service' },
            { id: 'dns', label: '2. DB_HOST=db & depends_on' },
            { id: 'db', label: '3. db (postgres) service' },
            { id: 'volumes', label: '4. Named volumes' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedSection(item.id)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                selectedSection === item.id ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-[10px] flex flex-col justify-between overflow-y-auto">
          <div className="text-slate-400 pb-1 border-b border-slate-800 flex justify-between">
            <span>docker-compose.yml</span>
            <span className="text-blue-400">version: &apos;3.8&apos;</span>
          </div>

          <div className="space-y-1.5 my-auto leading-snug">
            <div className="text-pink-400 font-bold">services:</div>

            <div
              onClick={() => setSelectedSection('training')}
              className={`p-1.5 rounded cursor-pointer border transition-all ${
                selectedSection === 'training' ? 'bg-blue-950/40 border-blue-400' : 'border-transparent hover:bg-slate-900'
              }`}
            >
              <div className="text-blue-300 font-bold">&nbsp;&nbsp;training:</div>
              <div className="text-slate-300">&nbsp;&nbsp;&nbsp;&nbsp;build: .</div>
              <div className="text-slate-300">&nbsp;&nbsp;&nbsp;&nbsp;volumes:</div>
              <div className="text-teal-300">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ./data:/app/data</div>
              <div className="text-purple-300">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- model_output:/app/output</div>
            </div>

            <div
              onClick={() => setSelectedSection('dns')}
              className={`p-1.5 rounded cursor-pointer border transition-all ${
                selectedSection === 'dns' ? 'bg-amber-950/40 border-amber-400' : 'border-transparent hover:bg-slate-900'
              }`}
            >
              <div className="text-slate-300">&nbsp;&nbsp;&nbsp;&nbsp;environment:</div>
              <div className="text-amber-300 font-bold">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- DB_HOST=db &nbsp;# Service name as hostname!</div>
              <div className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- DB_NAME=training_logs</div>
              <div className="text-amber-300 font-bold">&nbsp;&nbsp;&nbsp;&nbsp;depends_on:</div>
              <div className="text-amber-300 font-bold">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- db</div>
            </div>

            <div
              onClick={() => setSelectedSection('db')}
              className={`p-1.5 rounded cursor-pointer border transition-all ${
                selectedSection === 'db' ? 'bg-emerald-950/40 border-emerald-400' : 'border-transparent hover:bg-slate-900'
              }`}
            >
              <div className="text-emerald-300 font-bold">&nbsp;&nbsp;db:</div>
              <div className="text-slate-300">&nbsp;&nbsp;&nbsp;&nbsp;image: postgres:14-alpine</div>
              <div className="text-slate-300">&nbsp;&nbsp;&nbsp;&nbsp;volumes:</div>
              <div className="text-emerald-300">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- db_data:/var/lib/postgresql/data</div>
              <div className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;environment:</div>
              <div className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- POSTGRES_DB=training_logs</div>
            </div>

            <div
              onClick={() => setSelectedSection('volumes')}
              className={`p-1.5 rounded cursor-pointer border transition-all ${
                selectedSection === 'volumes' ? 'bg-purple-950/40 border-purple-400' : 'border-transparent hover:bg-slate-900'
              }`}
            >
              <div className="text-pink-400 font-bold">volumes:</div>
              <div className="text-purple-300">&nbsp;&nbsp;db_data:</div>
              <div className="text-purple-300">&nbsp;&nbsp;model_output:</div>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {yamlDetails[selectedSection].badge}
            </span>
            <h4 className="text-sm font-bold text-white mt-2">{yamlDetails[selectedSection].title}</h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{yamlDetails[selectedSection].desc}</p>
          </div>

          <div className="my-auto py-3 space-y-2.5 font-mono text-[10px]">
            <div className={`p-2.5 rounded-lg border transition-all ${
              selectedSection === 'training' || selectedSection === 'dns'
                ? 'bg-blue-950/40 border-blue-400 text-blue-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            >
              <div className="font-bold text-white">Container 1: training</div>
              <div>Image: Built from ./Dockerfile</div>
              <div>Connects to: <span className="text-amber-300">postgres://trainer@db:5432</span></div>
            </div>

            <div className="text-center text-amber-400 font-bold text-[10px]">
              ↑ depends_on (db starts first) &amp; DNS resolves &quot;db&quot; ↓
            </div>

            <div className={`p-2.5 rounded-lg border transition-all ${
              selectedSection === 'db' || selectedSection === 'dns'
                ? 'bg-emerald-950/40 border-emerald-400 text-emerald-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            >
              <div className="font-bold text-white">Container 2: db</div>
              <div>Image: postgres:14-alpine</div>
              <div>Storage: <span className="text-purple-300">db_data</span> volume</div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-2">
            Click any block in the YAML file on the left to inspect its role.
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualComposeFile = () => <VisualComposeYamlExplorer initialSection="training" />;
export const VisualComposeExplain = () => <VisualComposeYamlExplorer initialSection="dns" />;

export function VisualComposeStackOrchestrator({ initialShowConfig = true }) {
  const [stackState, setStackState] = useState('running');
  const [useBuildFlag, setUseBuildFlag] = useState(true);
  const [showConfigSvc, setShowConfigSvc] = useState(initialShowConfig);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleComposeUp = () => {
    setStackState('building');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setStackState('running');
    }, 1200);
  };

  return (
    <div className="w-full h-full flex flex-col p-5 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 pr-36 mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setUseBuildFlag(!useBuildFlag)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border transition-all ${
              useBuildFlag
                ? 'bg-amber-600/30 border-amber-400 text-amber-200'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            --build: {useBuildFlag ? 'ON (Rebuilds Dockerfile)' : 'OFF (Reuses Cached Image)'}
          </button>

          <button
            type="button"
            onClick={() => setShowConfigSvc(!showConfigSvc)}
            className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all ${
              showConfigSvc
                ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            Optional Config Service: {showConfigSvc ? 'Shown' : 'Hidden'}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleComposeUp}
            disabled={stackState === 'building'}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-mono font-bold shadow-md transition-all"
          >
            $ docker-compose up {useBuildFlag ? '--build' : ''}
          </button>
          <button
            type="button"
            onClick={() => setStackState('down')}
            disabled={stackState === 'down'}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-lg text-xs font-mono font-bold shadow-md transition-all"
          >
            $ docker-compose down
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 items-center min-h-0 my-1">
        <div className="md:col-span-2 h-full flex flex-col justify-center">
          <div className="p-3 rounded-xl bg-rose-950/40 border-2 border-rose-400/60 text-center shadow-lg">
            <div className="text-xs font-bold text-rose-200">Developer / CI</div>
            <div className="text-[9px] font-mono text-rose-300 mt-1">
              {stackState === 'down' ? 'docker-compose down' : `docker-compose up ${useBuildFlag ? '--build' : ''}`}
            </div>
          </div>
        </div>

        <div className={`md:col-span-10 h-full rounded-2xl p-4 border-2 flex flex-col justify-between transition-all duration-500 ${
          stackState === 'running'
            ? 'bg-slate-950 border-teal-500/60 shadow-[0_0_25px_rgba(20,184,166,0.15)]'
            : stackState === 'building'
              ? 'bg-slate-950 border-amber-400 animate-pulse'
              : 'bg-slate-950/50 border-dashed border-slate-800'
        }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Docker Compose Environment (Shared Network)
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              stackState === 'running'
                ? 'bg-emerald-500/20 text-emerald-300'
                : stackState === 'building'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-rose-500/20 text-rose-300'
            }`}
            >
              {stackState === 'running' ? 'STACK ACTIVE' : stackState === 'building' ? 'BUILDING & STARTING...' : 'CONTAINERS & NETWORK REMOVED'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center my-auto">
            <div className={`md:col-span-4 p-3 rounded-xl border-2 transition-all ${
              stackState === 'down' ? 'bg-slate-900/30 border-dashed border-slate-800 opacity-30' : 'bg-blue-950/40 border-blue-400'
            }`}
            >
              <div className="text-xs font-bold text-blue-200">Training Service</div>
              <div className="text-[10px] text-blue-300 font-mono">(Python Script)</div>
              <div className="mt-2 text-[9px] text-slate-300 space-y-1">
                <div>• Saves Models → <code>model_output</code></div>
                {showConfigSvc && <div>• Reads Hyperparams → <code>Config</code></div>}
                <div>• Writes logs / Reads IDs → <code>db</code></div>
              </div>
            </div>

            <div className="md:col-span-4 space-y-2.5">
              {showConfigSvc && (
                <div className={`p-2.5 rounded-xl border-2 border-dashed transition-all ${
                  stackState === 'down' ? 'bg-slate-900/30 border-slate-800 opacity-30' : 'bg-amber-950/30 border-amber-400/80'
                }`}
                >
                  <div className="text-xs font-bold text-amber-200">Config Service</div>
                  <div className="text-[10px] text-amber-300 font-mono">(Optional Example)</div>
                </div>
              )}

              <div className={`p-2.5 rounded-xl border-2 transition-all ${
                stackState === 'down' ? 'bg-slate-900/30 border-dashed border-slate-800 opacity-30' : 'bg-emerald-950/40 border-emerald-400'
              }`}
              >
                <div className="text-xs font-bold text-emerald-200">Database Service</div>
                <div className="text-[10px] text-emerald-300 font-mono">(PostgreSQL)</div>
                <div className="text-[9px] text-slate-300 mt-1">Persists Data → <code>db_data</code></div>
              </div>
            </div>

            <div className="md:col-span-4 p-3 rounded-xl border-2 border-dashed border-purple-500/50 bg-purple-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Volumes</span>
                <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-bold">PERSISTENT</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900 border border-purple-500/40 font-mono text-[10px] text-purple-200 flex items-center gap-1.5">
                <IconDatabase className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>model_output</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900 border border-purple-500/40 font-mono text-[10px] text-purple-200 flex items-center gap-1.5">
                <IconDatabase className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>db_data</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-1.5 gap-3">
            <span>
              {useBuildFlag
                ? '✓ --build forces Compose to rebuild the training Dockerfile before starting.'
                : '⚠ Without --build, Compose reuses an existing image even if your code changed!'}
            </span>
            <span className="text-purple-300 font-mono shrink-0">Volumes survive docker-compose down</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualComposeDiagram = () => <VisualComposeStackOrchestrator initialShowConfig />;
export const VisualComposeLifecycle = () => <VisualComposeStackOrchestrator initialShowConfig />;

const irisFiles = {
  'train.py': {
    path: 'ml-training-project/src/train.py',
    badge: 'Copied into Image (COPY src/ ./src/)',
    code: `import argparse, os, joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

def train_model(input_dir, output_dir, C):
    data_path = os.path.join(input_dir, 'iris.csv')
    iris_df = pd.read_csv(data_path)
    X = iris_df[['sepal_length', 'sepal_width', 'petal_length', 'petal_width']]
    y = iris_df['species']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = LogisticRegression(C=C, max_iter=200, random_state=42)
    model.fit(X_train, y_train)
    acc = accuracy_score(y_test, model.predict(X_test))
    print(f"Model accuracy on test set: {acc:.4f}")

    os.makedirs(output_dir, exist_ok=True)
    model_path = os.path.join(output_dir, 'iris_model.joblib')
    joblib.dump(model, model_path)
    print(f"Model saved to: {model_path}")`,
  },
  'requirements.txt': {
    path: 'ml-training-project/requirements.txt',
    badge: 'Copied First for Layer Caching',
    code: `pandas
scikit-learn==1.2.2  # Pinning version for reproducibility
joblib`,
  },
  'iris.csv': {
    path: 'ml-training-project/data/iris.csv',
    badge: 'Mounted at Runtime (-v $(pwd)/data:/app/data)',
    code: `sepal_length,sepal_width,petal_length,petal_width,species
5.1,3.5,1.4,0.2,setosa
4.9,3.0,1.4,0.2,setosa
7.0,3.2,4.7,1.4,versicolor
6.3,3.3,6.0,2.5,virginica`,
  },
};

export function VisualIrisProjectExplorer({ initialFile = 'train.py' }) {
  const [activeFile, setActiveFile] = useState(initialFile);

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="md:col-span-5 flex flex-col gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex-1 flex flex-col justify-between">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1.5">
              Project Directory Structure
            </div>

            <div className="font-mono text-xs text-slate-300 space-y-1.5 my-auto">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <IconFolder className="w-4 h-4 text-blue-400" /> ml-training-project/
              </div>
              <div className="ml-4 text-slate-400 flex items-center gap-1.5">
                <IconFileCode className="w-3.5 h-3.5 text-purple-400" /> Dockerfile
              </div>
              <button
                type="button"
                onClick={() => setActiveFile('requirements.txt')}
                className={`ml-4 w-[calc(100%-1rem)] text-left px-2 py-1 rounded flex items-center gap-1.5 transition-all ${
                  activeFile === 'requirements.txt' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40' : 'hover:bg-slate-900 text-slate-400'
                }`}
              >
                <IconFileCode className="w-3.5 h-3.5 text-emerald-400" /> requirements.txt
              </button>
              <div className="ml-4 text-slate-400 flex items-center gap-1.5">
                <IconFolder className="w-3.5 h-3.5 text-blue-400" /> src/
              </div>
              <button
                type="button"
                onClick={() => setActiveFile('train.py')}
                className={`ml-8 w-[calc(100%-2rem)] text-left px-2 py-1 rounded flex items-center gap-1.5 transition-all ${
                  activeFile === 'train.py' ? 'bg-blue-950/60 text-blue-300 border border-blue-500/40' : 'hover:bg-slate-900 text-slate-400'
                }`}
              >
                <IconFileCode className="w-3.5 h-3.5 text-blue-400" /> train.py
              </button>
              <div className="ml-4 text-slate-400 flex items-center gap-1.5">
                <IconFolder className="w-3.5 h-3.5 text-amber-400" /> data/
              </div>
              <button
                type="button"
                onClick={() => setActiveFile('iris.csv')}
                className={`ml-8 w-[calc(100%-2rem)] text-left px-2 py-1 rounded flex items-center gap-1.5 transition-all ${
                  activeFile === 'iris.csv' ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40' : 'hover:bg-slate-900 text-slate-400'
                }`}
              >
                <IconDatabase className="w-3.5 h-3.5 text-amber-400" /> iris.csv
              </button>
              <div className="ml-4 text-slate-500 flex items-center gap-1.5">
                <IconFolder className="w-3.5 h-3.5 text-teal-400" /> output/ <span className="text-[10px]">(For saved model)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[10px] space-y-1">
            <div className="text-[9px] font-sans font-bold uppercase tracking-wider text-indigo-400">
              CLI Interface (argparse)
            </div>
            <div className="text-slate-300"><strong className="text-blue-300">--input-dir</strong> (str, required): Dir with iris.csv</div>
            <div className="text-slate-300"><strong className="text-emerald-300">--output-dir</strong> (str, required): Dir for model</div>
            <div className="text-slate-300"><strong className="text-amber-300">--C</strong> (float, default=1.0): Inverse regularization</div>
          </div>
        </div>

        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
          <div className="bg-slate-900 px-4 py-2.5 pr-36 border-b border-slate-800 flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold text-white">{irisFiles[activeFile].path}</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-semibold">
              {irisFiles[activeFile].badge}
            </span>
          </div>
          <pre className="p-4 font-mono text-[10.5px] leading-relaxed text-slate-300 overflow-y-auto flex-1">
            {irisFiles[activeFile].code}
          </pre>
        </div>
      </div>
    </div>
  );
}

export const VisualPrereqs = () => <VisualIrisProjectExplorer initialFile="train.py" />;
export const VisualTrainScript = () => <VisualIrisProjectExplorer initialFile="train.py" />;
export const VisualTree = () => <VisualIrisProjectExplorer initialFile="iris.csv" />;
export const VisualPin = () => <VisualIrisProjectExplorer initialFile="requirements.txt" />;

export function VisualIrisDockerfileBuilder({ initialRunMode = 'help' }) {
  const [runMode, setRunMode] = useState(initialRunMode);

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 pr-36 mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="font-mono text-xs text-slate-300">
          <span className="text-emerald-400">$</span> docker build -t <strong className="text-blue-400">ml-training-app:latest</strong> .
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRunMode('help')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              runMode === 'help' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Test Default CMD (No Args)
          </button>
          <button
            type="button"
            onClick={() => setRunMode('train')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              runMode === 'train' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Test With Training Args
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10.5px] flex flex-col justify-between">
          <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-purple-400 border-b border-slate-800 pb-1.5">
            ml-training-project/Dockerfile
          </div>

          <div className="space-y-2 my-auto">
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-pink-400 font-bold">FROM</span> python:3.9-slim<br />
              <span className="text-pink-400 font-bold">WORKDIR</span> /app
            </div>

            <div className="p-1.5 rounded bg-emerald-950/20 border border-emerald-500/40">
              <div className="text-[9px] font-sans text-emerald-400 font-bold uppercase">Layer Cached unless requirements change</div>
              <span className="text-pink-400 font-bold">COPY</span> requirements.txt .<br />
              <span className="text-pink-400 font-bold">RUN</span> pip install --no-cache-dir -r requirements.txt
            </div>

            <div className="p-1.5 rounded bg-blue-950/20 border border-blue-500/40">
              <div className="text-[9px] font-sans text-blue-400 font-bold uppercase">Copies src/train.py into /app/src/</div>
              <span className="text-pink-400 font-bold">COPY</span> src/ ./src/
            </div>

            <div className="p-2 rounded bg-amber-950/30 border-2 border-amber-500/60">
              <div className="text-[9px] font-sans text-amber-300 font-bold uppercase">Executable Pattern + Safe Default Help</div>
              <span className="text-pink-400 font-bold">ENTRYPOINT</span> [&quot;python&quot;, &quot;src/train.py&quot;]<br />
              <span className="text-pink-400 font-bold">CMD</span> [&quot;--help&quot;]
            </div>
          </div>

          <div className="text-[10px] font-sans text-slate-400">
            Notice: <code>data/</code> and <code>output/</code> are <strong>not</strong> copied into the image!
          </div>
        </div>

        <div className="md:col-span-6 bg-black border border-slate-800 rounded-xl p-4 font-mono text-[10.5px] flex flex-col justify-between">
          <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-emerald-400 border-b border-slate-900 pb-1.5">
            Container Execution Preview
          </div>

          {runMode === 'help' ? (
            <div className="space-y-3 my-auto">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                <div className="text-[9px] font-sans text-amber-400 uppercase font-bold mb-1">1. Run Without Arguments</div>
                $ docker run --rm ml-training-app:latest
              </div>

              <div className="p-2.5 bg-amber-950/20 rounded-lg border border-amber-500/40 text-amber-200">
                <div className="text-[9px] font-sans text-amber-400 uppercase font-bold mb-1">2. Effective Command Executed</div>
                python src/train.py <strong className="underline">--help</strong>
              </div>

              <pre className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[9.5px] text-slate-300 leading-snug">
{`usage: train.py [-h] --input-dir INPUT_DIR
                --output-dir OUTPUT_DIR [--C C]

Train a Logistic Regression model on Iris data.
optional arguments:
  --input-dir   Directory containing iris.csv
  --output-dir  Directory to save trained model
  --C           Inverse of regularization strength`}
              </pre>
            </div>
          ) : (
            <div className="space-y-3 my-auto">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                <div className="text-[9px] font-sans text-emerald-400 uppercase font-bold mb-1">1. Run With CLI Arguments</div>
                $ docker run --rm ... ml-training-app:latest \<br />
                &nbsp;&nbsp;<span className="text-emerald-300">--input-dir /app/data --output-dir /app/output --C 0.5</span>
              </div>

              <div className="p-2.5 bg-emerald-950/20 rounded-lg border border-emerald-500/40 text-emerald-200">
                <div className="text-[9px] font-sans text-emerald-400 uppercase font-bold mb-1">2. Effective Command (CMD [&quot;--help&quot;] Overridden!)</div>
                python src/train.py --input-dir /app/data --output-dir /app/output --C 0.5
              </div>

              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-emerald-300 space-y-0.5">
                <div>Loading data from: /app/data</div>
                <div>Training Logistic Regression model with C=0.5...</div>
                <div>Model saved to: /app/output/iris_model.joblib</div>
              </div>
            </div>
          )}

          <div className="text-[10px] font-sans text-slate-400 border-t border-slate-900 pt-2">
            Combining <code>ENTRYPOINT</code> with <code>CMD [&quot;--help&quot;]</code> makes your training image self-documenting!
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualLayers = () => <VisualIrisDockerfileBuilder initialRunMode="help" />;
export const VisualBuild = () => <VisualIrisDockerfileBuilder initialRunMode="train" />;

const accuracyMap = {
  0.1: '0.9667',
  0.5: '1.0000',
  1.0: '1.0000',
  5.0: '1.0000',
};

export function VisualIrisTrainingRunner({ initialC = '0.5', initialMounted = true }) {
  const [cParam, setCParam] = useState(initialC);
  const [dataMounted, setDataMounted] = useState(initialMounted);
  const [hasRun, setHasRun] = useState(true);

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 pr-36 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-400">Hyperparameter --C:</span>
            {['0.1', '0.5', '1.0', '5.0'].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => { setCParam(val); setHasRun(true); }}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                  cParam === val ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {val}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => { setDataMounted(!dataMounted); setHasRun(true); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
              dataMounted
                ? 'bg-teal-950/60 border-teal-400 text-teal-300'
                : 'bg-rose-950/60 border-rose-500 text-rose-300'
            }`}
          >
            Data Mount: {dataMounted ? '-v $(pwd)/data:/app/data (OK)' : 'Omitted (Test Error Handling)'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setHasRun(true)}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md"
        >
          <IconPlay className="w-3.5 h-3.5" /> Run Container
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10.5px] flex flex-col justify-between">
          <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-blue-400 border-b border-slate-800 pb-1.5">
            1. Execute Containerized Training
          </div>

          <div className="bg-black p-3 rounded-lg border border-slate-800 text-slate-300 leading-relaxed my-auto">
            <span className="text-emerald-400">$</span> docker run --rm \<br />
            {dataMounted && (
              <>
                &nbsp;&nbsp;<span className="text-teal-300">-v &quot;$(pwd)/data:/app/data&quot;</span> \<br />
              </>
            )}
            &nbsp;&nbsp;<span className="text-purple-300">-v &quot;$(pwd)/output:/app/output&quot;</span> \<br />
            &nbsp;&nbsp;ml-training-app:latest \<br />
            &nbsp;&nbsp;<span className="text-amber-300">--input-dir /app/data</span> \<br />
            &nbsp;&nbsp;<span className="text-amber-300">--output-dir /app/output</span> \<br />
            &nbsp;&nbsp;<span className="text-blue-300 font-bold">--C {cParam}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/40 font-sans text-[11px] text-amber-200">
            <strong>Crucial Path Rule:</strong> Pass the <em>container paths</em> (<code>/app/data</code>, <code>/app/output</code>) to <code>--input-dir</code> and <code>--output-dir</code>, not your host paths!
          </div>
        </div>

        <div className="md:col-span-6 flex flex-col gap-3">
          <div className="bg-black border border-slate-800 rounded-xl p-3.5 font-mono text-[10.5px] flex-1 flex flex-col justify-between">
            <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-1">
              2. Container Terminal Output
            </div>

            {hasRun && dataMounted ? (
              <div className="my-auto space-y-1 text-slate-300">
                <div>Loading data from: <span className="text-teal-300">/app/data</span></div>
                <div className="text-emerald-400">Data loaded successfully.</div>
                <div>Training Logistic Regression model with <span className="text-blue-300 font-bold">C={cParam}</span>...</div>
                <div className="text-amber-300 font-bold">Model accuracy on test set: {accuracyMap[cParam]}</div>
                <div className="text-purple-300">Model saved to: /app/output/iris_model.joblib</div>
              </div>
            ) : (
              <div className="my-auto space-y-1 text-rose-400">
                <div>Loading data from: /app/data</div>
                <div className="font-bold">Error: Could not find /app/data/iris.csv. Make sure iris.csv is mounted correctly.</div>
              </div>
            )}
          </div>

          <div className={`p-3.5 rounded-xl border-2 font-mono text-[11px] transition-all ${
            dataMounted ? 'bg-emerald-950/30 border-emerald-500/60' : 'bg-slate-950 border-slate-800 opacity-50'
          }`}
          >
            <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-emerald-400 mb-1">
              3. Verify Saved Artifact on Host Machine
            </div>
            <div className="text-slate-300">$ ls output/</div>
            {dataMounted ? (
              <div className="mt-1 flex items-center justify-between text-emerald-300 font-bold">
                <span>iris_model.joblib</span>
                <span className="text-[9px] font-sans bg-emerald-600 text-white px-2 py-0.5 rounded">
                  PERSISTED ON HOST (C={cParam})
                </span>
              </div>
            ) : (
              <div className="mt-1 text-slate-500 italic">(Directory empty — training aborted)</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualRunTrain = () => <VisualIrisTrainingRunner />;
export const VisualTrainLogs = () => <VisualIrisTrainingRunner />;
export const VisualVerifyModel = () => <VisualIrisTrainingRunner />;
export const VisualSummarySteps = () => <VisualIrisTrainingRunner />;
