import { useState } from 'react';

const IconBox = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);
const IconDatabase = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);
const IconCheck = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
const IconGlobe = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

function VisualIntroCompose({ initialMode = 'compose', initialComposeActive = true }) {
  const [mode, setMode] = useState(initialMode);
  const [manualStarted, setManualStarted] = useState([false, false, false]);
  const [composeActive, setComposeActive] = useState(initialComposeActive);

  const toggleManual = (idx) => {
    setManualStarted((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800 z-20">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'manual'
                ? 'bg-sky-600 text-white shadow-[0_0_15px_rgba(2,132,199,0.4)]'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            1. Manual `docker run` (Fragmented)
          </button>
          <button
            type="button"
            onClick={() => setMode('compose')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'compose'
                ? 'bg-teal-600 text-white shadow-[0_0_15px_rgba(20,184,166,0.4)]'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            2. Declarative `Docker Compose` (Unified)
          </button>
        </div>

        {mode === 'compose' && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setComposeActive(true)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                composeActive ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              $ docker-compose up
            </button>
            <button
              type="button"
              onClick={() => setComposeActive(false)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                !composeActive ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              $ docker-compose down
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-4 justify-between min-h-0">
        <div
          onClick={() => setMode('manual')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            mode === 'manual'
              ? 'bg-slate-950 border-sky-500 shadow-[0_0_25px_rgba(14,165,233,0.15)]'
              : 'bg-slate-950/50 border-slate-800 opacity-60 hover:opacity-90'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Manual `docker run` (Click each command to start manually)
            </span>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
              Manual network, order &amp; port flags required!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { cmd: 'docker run ... db_image', role: 'Database' },
              { cmd: 'docker run ... api_image', role: 'Inference API' },
              { cmd: 'docker run ... worker_image', role: 'Background Worker' },
            ].map((item, idx) => (
              <button
                key={item.cmd}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMode('manual');
                  toggleManual(idx);
                }}
                className={`p-3 rounded-xl border-2 font-mono text-xs transition-all flex flex-col items-center justify-center gap-1 ${
                  manualStarted[idx] && mode === 'manual'
                    ? 'bg-sky-900/40 border-sky-400 text-white shadow-md'
                    : 'bg-sky-950/20 border-sky-500/30 text-sky-200 hover:border-sky-400'
                }`}
              >
                <div className="font-bold">{item.cmd}</div>
                <span className="text-[10px] font-sans text-slate-400">
                  {manualStarted[idx] && mode === 'manual' ? '● Running (Isolated)' : '○ Click to run'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div
          onClick={() => setMode('compose')}
          className={`flex-1 p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            mode === 'compose'
              ? 'bg-slate-950 border-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.18)]'
              : 'bg-slate-950/50 border-slate-800 opacity-60 hover:opacity-90'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Docker Compose (Single Declarative Stack)
            </span>
            <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold ${
              composeActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}>
              {composeActive ? 'STACK UP (All 3 Managed Containers Running)' : 'STACK DOWN (Cleaned Up)'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-auto py-2">
            <div className="md:col-span-5 flex flex-col items-center gap-3">
              <div className={`w-full p-3.5 rounded-xl border-2 text-center font-mono text-xs font-bold transition-all ${
                composeActive
                  ? 'bg-sky-600/30 border-sky-400 text-white shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}>
                {composeActive ? '$ docker-compose up' : '$ docker-compose down'}
              </div>

              <div className="text-teal-400 font-mono text-xs font-bold">▲ reads configuration ▲</div>

              <div className="w-full p-3 rounded-xl bg-amber-400/15 border-2 border-amber-400/70 text-center">
                <div className="font-mono text-xs font-bold text-amber-200">docker-compose.yml</div>
                <div className="text-[10px] text-amber-300/90 mt-0.5">(defines db, api, worker)</div>
              </div>
            </div>

            <div className="md:col-span-1 flex items-center justify-center">
              <div className={`font-mono text-lg font-bold transition-all ${composeActive ? 'text-teal-400 animate-pulse' : 'text-slate-700'}`}>
                ───►
              </div>
            </div>

            <div className="md:col-span-6 bg-slate-900/90 border-2 border-slate-700 rounded-xl p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center mb-3">
                Managed Containers (Shared Network &amp; Volumes)
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {['db container', 'api container', 'worker container'].map((cName) => (
                  <div
                    key={cName}
                    className={`p-3 rounded-xl border-2 text-center transition-all duration-500 ${
                      composeActive
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)] scale-100'
                        : 'bg-slate-950 border-dashed border-slate-800 text-slate-600 scale-95 opacity-40'
                    }`}
                  >
                    <IconBox className={`w-5 h-5 mx-auto mb-1 ${composeActive ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <div className="font-mono text-[11px] font-bold">{cName}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualDefiningServices({ initialExample = 'combined' }) {
  const [selectedExample, setSelectedExample] = useState(initialExample);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-950 p-2.5 pr-36 rounded-xl border border-slate-800 z-20">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedExample('combined')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedExample === 'combined' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            1. Combined Stack (build + image)
          </button>
          <button
            type="button"
            onClick={() => setSelectedExample('prebuilt')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedExample === 'prebuilt' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            2. Pre-built Images (`image:`)
          </button>
          <button
            type="button"
            onClick={() => setSelectedExample('custom_build')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedExample === 'custom_build' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            3. Custom Context (`context` &amp; `dockerfile`)
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10.5px] flex flex-col justify-between overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-white font-bold">docker-compose.yml</span>
            <span className="text-[9px] font-sans bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold">
              version: &apos;3.8&apos;
            </span>
          </div>

          {selectedExample === 'combined' && (
            <pre className="text-slate-300 leading-relaxed my-auto overflow-x-auto">
{`version: '3.8'

services:
  # 1. Build custom ML API from ./api/Dockerfile
  prediction_api:
    build: ./api

  # 2. Pull pre-built PostgreSQL image from Hub
  metadata_db:
    image: postgres:14-alpine`}
            </pre>
          )}

          {selectedExample === 'prebuilt' && (
            <pre className="text-slate-300 leading-relaxed my-auto overflow-x-auto">
{`version: '3.8'

services:
  database:
    image: postgres:14-alpine # Official Postgres

  redis_cache:
    image: redis:7-alpine     # Official Redis`}
            </pre>
          )}

          {selectedExample === 'custom_build' && (
            <pre className="text-slate-300 leading-relaxed my-auto overflow-x-auto">
{`version: '3.8'

services:
  training_job:
    build:
      context: ./training_module
      dockerfile: Dockerfile.train`}
            </pre>
          )}

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-sans text-[11px] text-slate-300">
            <strong className="text-teal-400">Hostname Rule:</strong> Each service key (e.g., <code>prediction_api</code>, <code>metadata_db</code>) automatically becomes a network hostname!
          </div>
        </div>

        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
            How Compose Resolves Service Sources
          </div>

          <div className="my-auto flex flex-col gap-5 py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="px-3.5 py-3 rounded-xl bg-sky-500/20 border-2 border-sky-400 text-sky-200 font-mono text-xs font-bold shadow-md">
                docker-compose.yml
              </div>
              <div className="text-slate-500 font-mono text-xs">──►</div>
              <div className="px-3.5 py-3 rounded-xl bg-slate-800 border-2 border-slate-600 text-white font-mono text-xs font-bold shadow-md">
                services:
              </div>
              <div className="text-slate-500 font-mono text-xs">──►</div>
              <div className="flex-1 flex flex-col gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <div className="text-[10px] font-mono text-emerald-300 uppercase font-bold">
                    build: ./api
                  </div>
                  <div className="font-mono text-xs font-bold text-white mt-0.5">
                    prediction_api
                  </div>
                  <div className="text-[10px] text-slate-300 mt-0.5">
                    Builds local Dockerfile in <code>./api</code>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-500/20 border-2 border-indigo-400 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  <div className="text-[10px] font-mono text-indigo-300 uppercase font-bold">
                    image: postgres:14
                  </div>
                  <div className="font-mono text-xs font-bold text-white mt-0.5">
                    metadata_db
                  </div>
                  <div className="text-[10px] text-slate-300 mt-0.5">
                    Pulls pre-built image from Registry
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/30">
              <strong className="text-emerald-400 font-mono block">build:</strong>
              Use for your custom ML API or training code with a <code>Dockerfile</code>.
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-indigo-500/30">
              <strong className="text-indigo-400 font-mono block">image:</strong>
              Use for standard off-the-shelf services like Postgres, Redis, or MLflow.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualNetworkingServiceDiscovery({ initialStep = 2 }) {
  const [step, setStep] = useState(initialStep);

  const stepsInfo = [
    {
      title: 'Step 1: Creates Dedicated Bridge Network',
      desc: 'Compose automatically creates an isolated bridge network named <project_name>_default (e.g., myproject_default).',
    },
    {
      title: 'Step 2: Respects Startup Order (depends_on)',
      desc: 'Because app specifies depends_on: [cache], Compose starts the Redis cache container before starting the Python app container.',
    },
    {
      title: 'Step 3: Built-in Service Discovery (Hostname DNS)',
      desc: 'The app container connects to Redis simply using REDIS_HOST: cache (cache:6379)—no brittle IP addresses needed!',
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-950 p-2.5 pr-36 rounded-xl border border-slate-800 z-20">
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setStep(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                step === idx ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {stepsInfo[idx].title.split(':')[0]}
            </button>
          ))}
        </div>
        <span className="text-[11px] font-mono text-teal-400 font-bold pr-2">
          {stepsInfo[step].title.split(':')[1]}
        </span>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10px] flex flex-col justify-between overflow-y-auto">
          <div className="text-slate-400 border-b border-slate-800 pb-1 font-bold">
            docker-compose.yml (App + Redis Cache)
          </div>

          <pre className="text-slate-300 leading-snug my-auto">
{`version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000" # External access
    environment:
      # Connect using service name!
      REDIS_HOST: cache
    depends_on:
      - cache

  cache:
    image: redis:alpine
    # No 'ports' needed for internal!`}
          </pre>

          <div className="p-2 rounded bg-amber-950/30 border border-amber-500/40 font-sans text-[10px] text-amber-200">
            <strong>Note on <code>depends_on</code>:</strong> Ensures <code>cache</code> starts before <code>app</code>, though it waits for container start rather than full Redis readiness.
          </div>
        </div>

        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className={`flex-1 rounded-2xl border-2 border-dashed p-4 flex flex-col justify-between transition-all ${
            step >= 0 ? 'border-sky-500/60 bg-sky-950/10' : 'border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-sky-400">
                Compose Network (e.g., myproject_default)
              </span>
              <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded">
                Built-in DNS Server
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-11 gap-2 items-center my-auto py-4">
              <div className={`md:col-span-5 p-3.5 rounded-xl border-2 text-center transition-all ${
                step >= 2
                  ? 'bg-sky-500/20 border-sky-400 text-white shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}>
                <div className="text-xs font-bold">app container</div>
                <div className="text-[10px] font-mono text-sky-300 mt-1">
                  (Connects to &apos;cache:6379&apos;)
                </div>
                <div className="mt-2 text-[9px] font-mono bg-slate-950 p-1.5 rounded border border-slate-800 text-emerald-300">
                  REDIS_HOST=cache
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col items-center justify-center text-center">
                <div className="text-[9px] font-mono text-teal-300 font-bold mb-1">
                  uses service name &apos;cache&apos;
                </div>
                <div className="text-teal-400 font-bold text-sm animate-pulse">
                  ──────►
                </div>
              </div>

              <div className={`md:col-span-4 p-3.5 rounded-xl border-2 text-center transition-all ${
                step >= 1
                  ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}>
                <div className="text-xs font-bold">cache container</div>
                <div className="text-[10px] font-mono text-emerald-300 mt-1">
                  (Redis, listens on 6379)
                </div>
                <div className="mt-2 text-[9px] font-mono bg-slate-950 p-1.5 rounded border border-slate-800 text-slate-300">
                  Internal Port: 6379
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
              {stepsInfo[step].desc}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualInternalVsExternalPorts({ initialFlow = 'external_to_app' }) {
  const [trafficFlow, setTrafficFlow] = useState(initialFlow);

  const flows = {
    external_to_app: {
      label: '1. External Client → app (host:5000)',
      status: 'ALLOWED (Published via ports: "5000:5000")',
      color: 'emerald',
      explanation: 'Because the app service defines ports: - "5000:5000", external browsers or clients on the host machine can reach the app container via localhost:5000.',
    },
    internal_app_to_cache: {
      label: '2. Internal app → cache (cache:6379)',
      status: 'ALLOWED (Direct on Compose Network)',
      color: 'sky',
      explanation: 'Services inside the same Compose network talk directly on internal ports (cache:6379) without needing a ports: directive in docker-compose.yml!',
    },
    external_to_cache_blocked: {
      label: '3. External Client → cache (Unexposed)',
      status: 'BLOCKED (Isolated inside Compose Network ✓)',
      color: 'amber',
      explanation: 'Because the Redis cache service omits the ports: section, it is completely shielded from outside access while remaining accessible to app internally!',
    },
  };

  const active = flows[trafficFlow];

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap gap-2 mb-4 bg-slate-950 p-2.5 pr-36 rounded-xl border border-slate-800 z-20">
        {Object.entries(flows).map(([key, item]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTrafficFlow(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              trafficFlow === key ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between min-h-0">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Network Boundary &amp; Port Exposure Simulator
          </span>
          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold ${
            active.color === 'emerald'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : active.color === 'sky'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
          }`}>
            {active.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center my-auto py-4">
          <div className={`md:col-span-3 p-4 rounded-2xl border-2 text-center transition-all ${
            trafficFlow !== 'internal_app_to_cache'
              ? 'bg-white text-slate-950 border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
              : 'bg-slate-900 text-slate-400 border-slate-700 opacity-50'
          }`}>
            <IconGlobe className="w-6 h-6 mx-auto mb-1 text-slate-800" />
            <div className="text-xs font-bold">External Client</div>
            <div className="text-[10px] font-mono mt-0.5">(Host Browser / curl)</div>
          </div>

          <div className="md:col-span-2 flex flex-col items-center justify-center text-center">
            {trafficFlow === 'external_to_app' && (
              <>
                <span className="text-[10px] font-mono text-emerald-300 font-bold">accesses via host:5000</span>
                <span className="text-emerald-400 font-bold text-sm animate-pulse">──────►</span>
                <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  ports: &quot;5000:5000&quot;
                </span>
              </>
            )}
            {trafficFlow === 'internal_app_to_cache' && (
              <span className="text-[10px] font-mono text-slate-600">No external traffic</span>
            )}
            {trafficFlow === 'external_to_cache_blocked' && (
              <>
                <span className="text-[10px] font-mono text-amber-300 font-bold">tries host:6379</span>
                <span className="text-rose-500 font-bold text-sm">───✕───</span>
                <span className="text-[9px] font-mono bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30">
                  No `ports:` on cache!
                </span>
              </>
            )}
          </div>

          <div className="md:col-span-7 rounded-2xl border-2 border-dashed border-sky-500/60 bg-sky-950/15 p-4">
            <div className="text-[10px] font-mono font-bold text-sky-300 text-center mb-3">
              Compose Network (e.g., myproject_default)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-11 gap-2 items-center">
              <div className={`md:col-span-5 p-3 rounded-xl border-2 text-center transition-all ${
                trafficFlow === 'external_to_app' || trafficFlow === 'internal_app_to_cache'
                  ? 'bg-sky-500/30 border-sky-300 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}>
                <div className="text-xs font-bold">app container</div>
                <div className="text-[10px] font-mono text-sky-200 mt-1">
                  (Connects to &apos;cache:6379&apos;)
                </div>
              </div>

              <div className="md:col-span-2 text-center font-mono">
                <div className="text-[8.5px] text-sky-300">uses service name &apos;cache&apos;</div>
                <div className={`text-sm font-bold ${
                  trafficFlow === 'internal_app_to_cache' ? 'text-sky-400 animate-pulse' : 'text-slate-600'
                }`}>
                  ────►
                </div>
              </div>

              <div className={`md:col-span-4 p-3 rounded-xl border-2 text-center transition-all ${
                trafficFlow === 'internal_app_to_cache'
                  ? 'bg-sky-500/30 border-sky-300 text-white shadow-lg'
                  : trafficFlow === 'external_to_cache_blocked'
                    ? 'bg-amber-950/30 border-amber-400/70 text-amber-200'
                    : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}>
                <div className="text-xs font-bold">cache container</div>
                <div className="text-[10px] font-mono text-sky-200 mt-1">
                  (Redis, listens on 6379)
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
          {active.explanation}
        </div>
      </div>
    </div>
  );
}

function VisualComposeVolumes({ initialStep = 'both' }) {
  const [highlightStep, setHighlightStep] = useState(initialStep);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-950 p-2.5 pr-36 rounded-xl border border-slate-800 z-20">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setHighlightStep('step1_declare')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              highlightStep === 'step1_declare' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Step 1: Declare Top-Level `volumes:`
          </button>
          <button
            type="button"
            onClick={() => setHighlightStep('step2_mount')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              highlightStep === 'step2_mount' ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Step 2: Mount into Services
          </button>
          <button
            type="button"
            onClick={() => setHighlightStep('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              highlightStep === 'both' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Show Full Wiring
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10px] flex flex-col justify-between overflow-y-auto">
          <div className="text-slate-400 border-b border-slate-800 pb-1 font-bold">
            docker-compose.yml (Two-Step Volume Pattern)
          </div>

          <div className="space-y-1.5 my-auto leading-snug text-slate-300">
            <div>version: &apos;3.8&apos;</div>
            <div>services:</div>
            <div className="pl-2">
              <div className="text-sky-300 font-bold">db:</div>
              <div className="pl-2">image: postgres:14-alpine</div>
              <div className={`pl-2 p-1 rounded border transition-all ${
                highlightStep === 'step2_mount' || highlightStep === 'both'
                  ? 'bg-sky-950/50 border-sky-400 text-sky-200 font-bold'
                  : 'border-transparent'
              }`}>
                volumes:<br />
                &nbsp;&nbsp;- postgres_data:/var/lib/postgresql/data
              </div>
            </div>

            <div className="pl-2 pt-1">
              <div className="text-sky-300 font-bold">inference_api:</div>
              <div className="pl-2">build: ./inference_service</div>
              <div className="pl-2">ports: [&quot;8000:8000&quot;]</div>
              <div className={`pl-2 p-1 rounded border transition-all ${
                highlightStep === 'step2_mount' || highlightStep === 'both'
                  ? 'bg-sky-950/50 border-sky-400 text-sky-200 font-bold'
                  : 'border-transparent'
              }`}>
                volumes:<br />
                &nbsp;&nbsp;- ml_models:/app/models
              </div>
              <div className="pl-2">depends_on: [db]</div>
            </div>

            <div className={`p-1.5 rounded border transition-all mt-2 ${
              highlightStep === 'step1_declare' || highlightStep === 'both'
                ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                : 'border-transparent'
            }`}>
              <div># Step 1: Top-Level Volume Declarations</div>
              <div>volumes:</div>
              <div>&nbsp;&nbsp;postgres_data:</div>
              <div>&nbsp;&nbsp;ml_models:</div>
            </div>
          </div>
        </div>

        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-center text-slate-300 border-b border-slate-800 pb-2">
            Docker Compose Application
          </div>

          <div className="my-auto space-y-6 py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="w-40 p-3.5 rounded-xl bg-sky-500/20 border-2 border-sky-400 text-center shadow-md">
                <div className="text-xs font-bold text-white">db Service</div>
                <div className="text-[10px] font-mono text-sky-300">(PostgreSQL)</div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <span className="text-[9.5px] font-mono text-slate-300 mb-1">/var/lib/postgresql/data</span>
                <div className="w-full border-b-2 border-teal-400 relative flex items-center justify-end">
                  <span className="text-teal-400 text-xs font-bold -mr-1">►</span>
                </div>
              </div>
              <div className="w-40 p-3.5 rounded-2xl bg-amber-400/20 border-2 border-amber-300 text-center shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                <IconDatabase className="w-5 h-5 mx-auto text-amber-300 mb-0.5" />
                <div className="text-xs font-mono font-bold text-amber-200">postgres_data</div>
                <div className="text-[10px] text-amber-300">Volume</div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="w-40 p-3.5 rounded-xl bg-sky-500/20 border-2 border-sky-400 text-center shadow-md">
                <div className="text-xs font-bold text-white">inference_api</div>
                <div className="text-[10px] font-mono text-sky-300">Service</div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-300 mb-1">/app/models</span>
                <div className="w-full border-b-2 border-teal-400 relative flex items-center justify-end">
                  <span className="text-teal-400 text-xs font-bold -mr-1">►</span>
                </div>
              </div>
              <div className="w-40 p-3.5 rounded-2xl bg-amber-400/20 border-2 border-amber-300 text-center shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                <IconDatabase className="w-5 h-5 mx-auto text-amber-300 mb-0.5" />
                <div className="text-xs font-mono font-bold text-amber-200">ml_models</div>
                <div className="text-[10px] text-amber-300">Volume</div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
            Compose automatically creates <code>postgres_data</code> and <code>ml_models</code> the first time you run <code>docker-compose up</code>!
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualVolumeLifecycleAndUseCases({ initialLifecycle = 'up', initialUseCase = 'models' }) {
  const [lifecycleState, setLifecycleState] = useState(initialLifecycle);
  const [selectedUseCase, setSelectedUseCase] = useState(initialUseCase);

  const useCases = {
    models: {
      title: 'Model Storage',
      desc: 'A training service saves trained weights (.pkl, .pt) to a named volume, which is then mounted read-only by an inference_api service.',
    },
    databases: {
      title: 'Databases & Metadata',
      desc: 'Persisting PostgreSQL or MySQL tables used for MLflow experiment tracking, hyperparameter logs, or feature stores.',
    },
    datasets: {
      title: 'Datasets',
      desc: 'Mounting large datasets into training or preprocessing containers so they are managed cleanly inside Docker.',
    },
    artifacts: {
      title: 'Shared Intermediate Artifacts',
      desc: 'Storing tokenized text or preprocessed tensors generated by a data-prep container and consumed by a training container.',
    },
    logs: {
      title: 'Centralized Application Logs',
      desc: 'Persisting logs generated by multiple services into a central volume for analysis or shipping to a logging platform.',
    },
  };

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800 z-20">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Test Volume Lifecycle Commands:
        </span>
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setLifecycleState('up')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              lifecycleState === 'up' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            $ docker-compose up
          </button>
          <button
            type="button"
            onClick={() => setLifecycleState('down_keep_vol')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              lifecycleState === 'down_keep_vol' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            $ docker-compose down
          </button>
          <button
            type="button"
            onClick={() => setLifecycleState('down_wipe_vol')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              lifecycleState === 'down_wipe_vol' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            $ docker-compose down -v
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
            What Survives Shutdown? (`down` vs `down -v`)
          </div>

          <div className="space-y-3 my-auto">
            <div className={`p-3.5 rounded-xl border-2 transition-all duration-500 ${
              lifecycleState === 'up'
                ? 'bg-sky-950/30 border-sky-400 text-white'
                : 'bg-slate-900/30 border-dashed border-slate-800 text-slate-500 opacity-40'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Containers &amp; Default Network</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  lifecycleState === 'up' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-600 text-white'
                }`}>
                  {lifecycleState === 'up' ? 'ACTIVE' : 'REMOVED'}
                </span>
              </div>
              <div className="text-[11px] font-mono mt-1 text-slate-300">
                db, inference_api, myproject_default
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border-2 transition-all duration-500 ${
              lifecycleState !== 'down_wipe_vol'
                ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                : 'bg-rose-950/30 border-dashed border-rose-500/50 text-rose-300 opacity-50'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <IconDatabase className="w-4 h-4 text-amber-300" />
                  Named Volumes (postgres_data, ml_models)
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  lifecycleState !== 'down_wipe_vol' ? 'bg-amber-400 text-slate-950' : 'bg-rose-600 text-white'
                }`}>
                  {lifecycleState !== 'down_wipe_vol' ? 'PERSISTED ✓' : 'DELETED (-v)'}
                </span>
              </div>
              <div className="text-[11px] mt-1.5 text-slate-200">
                {lifecycleState === 'up' && 'Storing live DB tables and trained model artifacts.'}
                {lifecycleState === 'down_keep_vol' && 'Protected! Standard docker-compose down leaves your volumes intact for the next run.'}
                {lifecycleState === 'down_wipe_vol' && 'Explicitly wiped! Passing -v removes named volumes along with containers.'}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            Use <code>docker-compose down</code> for routine stops, and <code>docker-compose down -v</code> only when you want a completely clean slate.
          </div>
        </div>

        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-2">
            5 Common ML Volume Use Cases in Compose
          </div>

          <div className="flex flex-wrap gap-1.5 my-2">
            {Object.entries(useCases).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedUseCase(key)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  selectedUseCase === key ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          <div className="my-auto p-4 rounded-xl bg-slate-900 border border-teal-500/40 space-y-2">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <IconCheck className="w-4 h-4 text-teal-400" />
              {useCases[selectedUseCase].title}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {useCases[selectedUseCase].desc}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <strong className="text-teal-400 block">Centralized Definition</strong>
              All storage requirements documented in one YAML file.
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <strong className="text-teal-400 block">Decoupled Lifecycle</strong>
              Upgrade container images without losing models or DB rows.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualManyRuns() {
  return <VisualIntroCompose initialMode="manual" initialComposeActive={false} />;
}
export function VisualComposeUp() {
  return <VisualIntroCompose initialMode="compose" initialComposeActive />;
}
export function VisualSameStack() {
  return <VisualIntroCompose initialMode="compose" initialComposeActive />;
}
export function VisualHostnames() {
  return <VisualDefiningServices initialExample="combined" />;
}
export function VisualPullImages() {
  return <VisualDefiningServices initialExample="prebuilt" />;
}
export function VisualBuildSource() {
  return <VisualDefiningServices initialExample="custom_build" />;
}
export function VisualMixSources() {
  return <VisualDefiningServices initialExample="combined" />;
}
export function VisualServiceDns() {
  return <VisualNetworkingServiceDiscovery initialStep={0} />;
}
export function VisualRedisStack() {
  return <VisualNetworkingServiceDiscovery initialStep={2} />;
}
export function VisualInsideOutside() {
  return <VisualInternalVsExternalPorts initialFlow="external_to_app" />;
}
export function VisualVolumeSurvive() {
  return <VisualVolumeLifecycleAndUseCases initialLifecycle="down_keep_vol" initialUseCase="databases" />;
}
export function VisualDeclareVolumes() {
  return <VisualComposeVolumes initialStep="step1_declare" />;
}
export function VisualMountVolumes() {
  return <VisualComposeVolumes initialStep="step2_mount" />;
}
export function VisualDownFlag() {
  return <VisualVolumeLifecycleAndUseCases initialLifecycle="down_keep_vol" initialUseCase="models" />;
}
export function VisualMlVolumes() {
  return <VisualVolumeLifecycleAndUseCases initialLifecycle="up" initialUseCase="models" />;
}
