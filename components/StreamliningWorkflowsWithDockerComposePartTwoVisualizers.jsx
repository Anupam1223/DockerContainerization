import { useState } from 'react';

const IconBox = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);
const IconKey = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);
const IconFileCode = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const IconCloud = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
);

function VisualListVsMapEnv({ initialFormat = 'list', initialHostVarSet = true }) {
  const [format, setFormat] = useState(initialFormat);
  const [hostVarSet, setHostVarSet] = useState(initialHostVarSet);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800 z-20">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFormat('list')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              format === 'list'
                ? 'bg-teal-600 text-white shadow-[0_0_15px_rgba(20,184,166,0.4)]'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            1. Using a List (`- KEY=VALUE`)
          </button>
          <button
            type="button"
            onClick={() => setFormat('map')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              format === 'map'
                ? 'bg-sky-600 text-white shadow-[0_0_15px_rgba(2,132,199,0.4)]'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            2. Using a Map (`KEY: VALUE`)
          </button>
        </div>

        <button
          type="button"
          onClick={() => setHostVarSet(!hostVarSet)}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
            hostVarSet
              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500 text-rose-300'
          }`}
        >
          Host Shell Secret: {hostVarSet ? 'EXPORTED ✓' : 'UNSET (Empty "")'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10.5px] flex flex-col justify-between overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-white font-bold">docker-compose.yml</span>
            <span className={`text-[9px] font-sans px-2 py-0.5 rounded font-bold ${
              format === 'list' ? 'bg-teal-500/20 text-teal-300' : 'bg-sky-500/20 text-sky-300'
            }`}>
              {format === 'list' ? 'List Syntax (Explicit Strings)' : 'Map / Dictionary Syntax'}
            </span>
          </div>

          {format === 'list' ? (
            <pre className="text-slate-300 leading-relaxed my-auto overflow-x-auto">
{`version: '3.8'
services:
  training_job:
    build: ./training_app
    image: my_training_app:latest
    environment:
      - LEARNING_RATE=0.01
      - EPOCHS=50
      - MODEL_OUTPUT_DIR=/app/outputs
      - WANDB_API_KEY=\${WANDB_API_KEY_HOST}`}
            </pre>
          ) : (
            <pre className="text-slate-300 leading-relaxed my-auto overflow-x-auto">
{`version: '3.8'
services:
  inference_api:
    build: ./inference_api
    image: my_inference_api:latest
    environment:
      MODEL_PATH: /models/latest.pkl
      API_PORT: 8000
      DATABASE_URL: \${DB_CONNECTION_STRING}
    ports:
      - "8000:8000"`}
            </pre>
          )}

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-sans text-[11px] text-slate-300">
            {format === 'list' ? (
              <span>
                <strong className="text-teal-400">Why List is Preferred:</strong> Each item is an explicit <code>VARIABLE=value</code> string, avoiding YAML type parsing surprises.
              </span>
            ) : (
              <span>
                <strong className="text-sky-400">Type Conversion Note:</strong> Compose converts map values like <code>8000</code> into strings (<code>&quot;8000&quot;</code>). Convert via <code>int(os.environ[&apos;API_PORT&apos;])</code> in Python!
              </span>
            )}
          </div>
        </div>

        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 font-mono text-[10.5px]">
            <div className="text-[9px] font-sans font-bold uppercase tracking-wider text-slate-400 mb-1">
              Host Machine Environment (Running docker-compose up)
            </div>
            {format === 'list' ? (
              <div className={hostVarSet ? 'text-emerald-300' : 'text-rose-400'}>
                {hostVarSet
                  ? '$ export WANDB_API_KEY_HOST="wandb_live_987xyz"'
                  : '# WANDB_API_KEY_HOST is NOT set on host!'}
              </div>
            ) : (
              <div className={hostVarSet ? 'text-emerald-300' : 'text-rose-400'}>
                {hostVarSet
                  ? '$ export DB_CONNECTION_STRING="postgresql://db:5432/ml"'
                  : '# DB_CONNECTION_STRING is NOT set on host!'}
              </div>
            )}
          </div>

          <div className="text-center font-mono text-xs text-teal-400 font-bold">
            ▼ Substituted into Container Environment ▼
          </div>

          <div className="p-3.5 rounded-xl bg-black border border-teal-500/40 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-[10px] font-sans font-bold uppercase text-teal-400">
                Inside Container: Python os.environ
              </span>
              <span className="text-[9px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded">
                All Values are Strings (str)
              </span>
            </div>

            {format === 'list' ? (
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">LEARNING_RATE:</span>
                  <span className="text-white">&quot;0.01&quot;</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">EPOCHS:</span>
                  <span className="text-white">&quot;50&quot;</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">MODEL_OUTPUT_DIR:</span>
                  <span className="text-white">&quot;/app/outputs&quot;</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-900">
                  <span className="text-amber-300 font-bold">WANDB_API_KEY:</span>
                  <span className={hostVarSet ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {hostVarSet ? '"wandb_live_987xyz"' : '"" (Empty String!)'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">MODEL_PATH:</span>
                  <span className="text-white">&quot;/models/latest.pkl&quot;</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">API_PORT:</span>
                  <span className="text-sky-300">&quot;8000&quot; <span className="text-[9px] text-slate-500">(str)</span></span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-900">
                  <span className="text-amber-300 font-bold">DATABASE_URL:</span>
                  <span className={hostVarSet ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {hostVarSet ? '"postgresql://db:5432/ml"' : '"" (Empty String!)'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualHostSubstitutionAndDollar({ initialSyntax = 'default', initialHostDefined = false }) {
  const [hostDefined, setHostDefined] = useState(initialHostDefined);
  const [selectedSyntax, setSelectedSyntax] = useState(initialSyntax);

  const syntaxModes = {
    plain: {
      title: '1. Basic: ${HOST_VARIABLE}',
      yaml: 'environment:\n  - API_TOKEN=${HOST_TOKEN}',
      whenSet: 'API_TOKEN="secret_host_xyz"',
      whenUnset: 'API_TOKEN="" (Silently becomes empty string!)',
      desc: 'If HOST_TOKEN is not set on the host, the container variable silently becomes an empty string ("").',
    },
    default: {
      title: '2. Fallback Default: ${VAR:-default}',
      yaml: 'services:\n  worker:\n    image: my_worker:latest\n    environment:\n      - QUEUE_NAME=${JOB_QUEUE:-default_queue}\n      - LOG_LEVEL=${LOG_LEVEL:-INFO}',
      whenSet: 'QUEUE_NAME="gpu_priority_queue"\nLOG_LEVEL="DEBUG"',
      whenUnset: 'QUEUE_NAME="default_queue"\nLOG_LEVEL="INFO" (Safe Fallback ✓)',
      desc: 'If JOB_QUEUE or LOG_LEVEL is unset or empty on the host, Compose automatically substitutes the fallback value after :-!',
    },
    error: {
      title: '3. Mandatory Guard: ${VAR:?error message}',
      yaml: 'environment:\n  - WANDB_KEY=${WANDB_KEY:?Error: WANDB_KEY must be set!}',
      whenSet: 'WANDB_KEY="wb_prod_9912"',
      whenUnset: 'ERROR: Missing mandatory variable WANDB_KEY: Error: WANDB_KEY must be set! (Compose Stops!)',
      desc: 'Best practice for required secrets! If unset on the host, Compose immediately halts and prints your custom error message.',
    },
    dollar: {
      title: '4. Escaping Literal Dollar Sign: $$',
      yaml: 'services:\n  my_service:\n    image: some_image\n    environment:\n      - CONFIG_VAR=uses_a_literal_$$VAR',
      whenSet: 'CONFIG_VAR="uses_a_literal_$VAR"',
      whenUnset: 'CONFIG_VAR="uses_a_literal_$VAR"',
      desc: 'Need a literal "$" inside your container (e.g., regex, bash command, or password)? Use "$$" so Compose does not treat it as a variable!',
    },
  };

  const active = syntaxModes[selectedSyntax];

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800 z-20">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(syntaxModes).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedSyntax(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedSyntax === key ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {item.title.split(':')[0]}
            </button>
          ))}
        </div>

        {selectedSyntax !== 'dollar' && (
          <button
            type="button"
            onClick={() => setHostDefined(!hostDefined)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
              hostDefined
                ? 'bg-emerald-600 border-emerald-400 text-white'
                : 'bg-amber-500 border-amber-300 text-slate-950'
            }`}
          >
            Host Variable is: {hostDefined ? 'SET on Host' : 'UNSET on Host (Test Fallback!)'}
          </button>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs flex flex-col justify-between">
          <div className="text-xs font-sans font-bold text-teal-400 border-b border-slate-800 pb-2">
            {active.title}
          </div>

          <pre className="bg-black p-3.5 rounded-xl border border-slate-800 text-slate-200 overflow-x-auto my-auto leading-relaxed text-[11px]">
            {active.yaml}
          </pre>

          <div className="text-xs font-sans text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
            {active.desc}
          </div>
        </div>

        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Result When Running `docker-compose up`
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              selectedSyntax === 'error' && !hostDefined
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {selectedSyntax === 'error' && !hostDefined ? 'COMPOSE STOPPED!' : 'CONTAINER STARTED'}
            </span>
          </div>

          <div className={`my-auto p-4 rounded-xl border-2 font-mono text-xs whitespace-pre-wrap leading-relaxed transition-all ${
            selectedSyntax === 'error' && !hostDefined
              ? 'bg-rose-950/40 border-rose-500 text-rose-200'
              : 'bg-black border-teal-500/50 text-emerald-300'
          }`}>
            <div className="text-[10px] font-sans uppercase font-bold text-slate-400 mb-2">
              {selectedSyntax === 'dollar'
                ? 'Evaluated String Inside Container:'
                : hostDefined
                  ? 'Outcome (When Host Variable IS Set):'
                  : 'Outcome (When Host Variable is NOT Set):'}
            </div>
            {hostDefined || selectedSyntax === 'dollar' ? active.whenSet : active.whenUnset}
          </div>

          <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <div className="text-amber-300 font-bold">&#36;&#123;VAR&#125;</div>
              <div className="font-sans text-slate-400 mt-0.5">Unset → <code>&quot;&quot;</code></div>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <div className="text-teal-300 font-bold">&#36;&#123;VAR:-def&#125;</div>
              <div className="font-sans text-slate-400 mt-0.5">Unset → <code>def</code></div>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <div className="text-rose-400 font-bold">&#36;&#123;VAR:?err&#125;</div>
              <div className="font-sans text-slate-400 mt-0.5">Unset → <strong>Stop!</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualDotEnvSubstitution({ initialProfile = 'dev' }) {
  const [selectedEnvProfile, setSelectedEnvProfile] = useState(initialProfile);

  const profiles = {
    dev: {
      DB_USER: 'ml_user',
      DB_PASSWORD: 'supersecretdevpassword',
      DB_HOST: 'db',
      DB_NAME: 'mldatabase',
      API_KEY: 'dev-abc123xyz',
    },
    staging: {
      DB_USER: 'staging_admin',
      DB_PASSWORD: 'staging_vault_99x',
      DB_HOST: 'db',
      DB_NAME: 'ml_staging_db',
      API_KEY: 'stg-998877key',
    },
  };

  const current = profiles[selectedEnvProfile];

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800 z-20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Local `.env` File Profile:
          </span>
          <button
            type="button"
            onClick={() => setSelectedEnvProfile('dev')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedEnvProfile === 'dev' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Local Dev `.env`
          </button>
          <button
            type="button"
            onClick={() => setSelectedEnvProfile('staging')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedEnvProfile === 'staging' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Staging `.env`
          </button>
        </div>

        <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded font-bold">
          ⚠ Always add `.env` to `.gitignore`!
        </span>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 items-center min-h-0">
        <div className="md:col-span-4 h-full bg-slate-950 border-2 border-amber-500/50 rounded-xl p-3.5 font-mono text-[10.5px] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-amber-300 font-bold flex items-center gap-1.5">
              <IconKey className="w-3.5 h-3.5" /> .env (Project Root)
            </span>
            <span className="text-[9px] font-sans bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Auto-Loaded</span>
          </div>

          <div className="my-auto space-y-1.5 bg-black p-3 rounded-lg border border-slate-800 text-slate-200">
            <div className="text-slate-500 text-[9.5px]"># Added to .gitignore</div>
            <div>DB_USER=<span className="text-teal-300 font-bold">{current.DB_USER}</span></div>
            <div>DB_PASSWORD=<span className="text-rose-300 font-bold">{current.DB_PASSWORD}</span></div>
            <div>DB_HOST=<span className="text-sky-300 font-bold">{current.DB_HOST}</span></div>
            <div>DB_NAME=<span className="text-purple-300 font-bold">{current.DB_NAME}</span></div>
            <div>API_KEY=<span className="text-amber-300 font-bold">{current.API_KEY}</span></div>
          </div>

          <div className="text-[10px] font-sans text-slate-400">
            Compose reads <code>.env</code> automatically when you run <code>docker-compose up</code>.
          </div>
        </div>

        <div className="md:col-span-4 h-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-[10px] flex flex-col justify-between">
          <div className="text-white font-bold border-b border-slate-800 pb-1.5">
            docker-compose.yml (Committed to Git)
          </div>

          <pre className="text-slate-300 my-auto leading-snug overflow-x-auto">
{`services:
  api:
    build: ./api
    environment:
      - DATABASE_USER=\${DB_USER}
      - DATABASE_PASSWORD=\${DB_PASSWORD}
      - DATABASE_HOST=\${DB_HOST}
      - DATABASE_NAME=\${DB_NAME}
      - EXTERNAL_SERVICE_KEY=\${API_KEY}
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: \${DB_USER}
      POSTGRES_PASSWORD: \${DB_PASSWORD}
      POSTGRES_DB: \${DB_NAME}`}
          </pre>

          <div className="text-[10px] font-sans text-teal-300 bg-teal-950/30 p-2 rounded border border-teal-500/30">
            ✓ Safe to commit to Git—zero hardcoded passwords in YAML!
          </div>
        </div>

        <div className="md:col-span-4 h-full flex flex-col gap-3 justify-between">
          <div className="flex-1 bg-slate-950 border border-sky-500/50 rounded-xl p-3 font-mono text-[10px] flex flex-col justify-between">
            <div className="text-xs font-sans font-bold text-sky-300 border-b border-slate-800 pb-1">
              1. `api` Container Environment
            </div>
            <div className="space-y-1 my-auto text-slate-300">
              <div>DATABASE_USER=<strong className="text-teal-300">{current.DB_USER}</strong></div>
              <div>DATABASE_PASSWORD=<strong className="text-rose-300">{current.DB_PASSWORD}</strong></div>
              <div>DATABASE_HOST=<strong className="text-sky-300">{current.DB_HOST}</strong></div>
              <div>DATABASE_NAME=<strong className="text-purple-300">{current.DB_NAME}</strong></div>
              <div>EXTERNAL_SERVICE_KEY=<strong className="text-amber-300">{current.API_KEY}</strong></div>
            </div>
          </div>

          <div className="flex-1 bg-slate-950 border border-emerald-500/50 rounded-xl p-3 font-mono text-[10px] flex flex-col justify-between">
            <div className="text-xs font-sans font-bold text-emerald-300 border-b border-slate-800 pb-1">
              2. `db` (Postgres) Container Environment
            </div>
            <div className="space-y-1 my-auto text-slate-300">
              <div>POSTGRES_USER=<strong className="text-teal-300">{current.DB_USER}</strong></div>
              <div>POSTGRES_PASSWORD=<strong className="text-rose-300">{current.DB_PASSWORD}</strong></div>
              <div>POSTGRES_DB=<strong className="text-purple-300">{current.DB_NAME}</strong></div>
            </div>
            <div className="text-[9.5px] font-sans text-emerald-400">
              ✓ Credentials in `api` and `db` are guaranteed to match!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualEnvPrecedencePyramid({
  initialCommon = true,
  initialService = true,
  initialCli = false,
}) {
  const [enableCommonEnv, setEnableCommonEnv] = useState(initialCommon);
  const [enableServiceEnv, setEnableServiceEnv] = useState(initialService);
  const [enableCliRunEnv, setEnableCliRunEnv] = useState(initialCli);

  const winningLogLevel = enableCliRunEnv
    ? { val: 'TRACE', source: 'Level 2: docker-compose run -e LOG_LEVEL=TRACE' }
    : enableServiceEnv
      ? { val: 'INFO', source: 'Level 1: service environment: (docker-compose.yml)' }
      : enableCommonEnv
        ? { val: 'WARNING', source: 'Level 3b: Second env_file (./config/.common.env)' }
        : { val: 'ERROR', source: 'Level 3a: First env_file (./config/.prod.env)' };

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800 z-20">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Toggle Override Layers for `LOG_LEVEL`:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setEnableCommonEnv(!enableCommonEnv)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
              enableCommonEnv ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-slate-900 border-slate-700 text-slate-500'
            }`}
          >
            2nd env_file (.common.env): {enableCommonEnv ? 'ON (WARNING)' : 'OFF'}
          </button>
          <button
            type="button"
            onClick={() => setEnableServiceEnv(!enableServiceEnv)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
              enableServiceEnv ? 'bg-teal-500/20 border-teal-400 text-teal-200' : 'bg-slate-900 border-slate-700 text-slate-500'
            }`}
          >
            YAML `environment:`: {enableServiceEnv ? 'ON (INFO)' : 'OFF'}
          </button>
          <button
            type="button"
            onClick={() => setEnableCliRunEnv(!enableCliRunEnv)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
              enableCliRunEnv ? 'bg-rose-500/20 border-rose-400 text-rose-200' : 'bg-slate-900 border-slate-700 text-slate-500'
            }`}
          >
            CLI `run -e`: {enableCliRunEnv ? 'ON (TRACE)' : 'OFF'}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10px] flex flex-col justify-between">
          <div className="text-slate-400 border-b border-slate-800 pb-1 font-bold">
            Multi-File `env_file` + `environment` Override
          </div>

          <pre className="text-slate-300 leading-relaxed my-auto overflow-x-auto">
{`services:
  inference_service:
    build: ./inference
    # 1. Loads .prod.env first (LOG_LEVEL=ERROR)
    # 2. Then .common.env overrides duplicates!
    env_file:
      - ./config/.prod.env
      - ./config/.common.env
    environment:
      # Overrides values from env_file!
      - LOG_LEVEL=INFO`}
          </pre>

          <div className="p-3 rounded-xl bg-black border border-teal-500/50">
            <div className="text-[10px] font-sans uppercase font-bold text-teal-400">
              Final Resolved Value Inside Container:
            </div>
            <div className="text-sm font-bold text-white mt-1">
              LOG_LEVEL = <span className="text-emerald-400">&quot;{winningLogLevel.val}&quot;</span>
            </div>
            <div className="text-[10px] font-sans text-slate-400 mt-0.5">
              Won by: <strong className="text-slate-200">{winningLogLevel.source}</strong>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-1.5 flex justify-between">
            <span>Compose Environment Precedence Order (1 = Highest)</span>
            <span className="text-[10px] text-teal-400 font-mono">Top Overrides Bottom</span>
          </div>

          <div className="space-y-1.5 my-auto text-xs">
            {[
              {
                rank: '1 & 2',
                title: 'Service `environment:` in YAML / `docker-compose run -e`',
                detail: 'Direct service environment definitions (and CLI -e flags during docker-compose run).',
                active: enableServiceEnv || enableCliRunEnv,
              },
              {
                rank: '3',
                title: '`env_file:` Directive (Later files override earlier files)',
                detail: 'e.g., ./config/.common.env overrides duplicate keys from ./config/.prod.env.',
                active: !enableServiceEnv && !enableCliRunEnv,
              },
              {
                rank: '4 & 5',
                title: '`.env` File & Host Environment (Variable Substitution)',
                detail: 'Provides values for ${VARIABLE} interpolation inside docker-compose.yml.',
                active: false,
              },
              {
                rank: '6',
                title: 'Dockerfile `ENV` Instruction (Lowest Priority)',
                detail: 'Default values baked into the image; overridden by any Compose setting above.',
                active: false,
              },
            ].map((item) => (
              <div
                key={item.rank}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                  item.active
                    ? 'bg-teal-950/40 border-teal-400 text-white shadow-[0_0_15px_rgba(20,184,166,0.2)]'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 font-mono text-[10px]">
                      #{item.rank}
                    </span>
                    <span>{item.title}</span>
                  </div>
                  <div className="text-[10.5px] text-slate-400 mt-0.5">{item.detail}</div>
                </div>
                {item.active && (
                  <span className="text-[9px] font-mono bg-teal-500 text-slate-950 font-bold px-2 py-0.5 rounded shrink-0 ml-2">
                    WINNER
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualBuildWithCompose({ initialStyle = 'args', initialPython = '3.10' }) {
  const [buildStyle, setBuildStyle] = useState(initialStyle);
  const [pythonVer, setPythonVer] = useState(initialPython);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800 z-20">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setBuildStyle('simple')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              buildStyle === 'simple' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            1. Simple Path (`build: ./dir`)
          </button>
          <button
            type="button"
            onClick={() => setBuildStyle('explicit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              buildStyle === 'explicit' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            2. Explicit `context` + `dockerfile`
          </button>
          <button
            type="button"
            onClick={() => setBuildStyle('args')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              buildStyle === 'args' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            3. Passing Build `args:`
          </button>
        </div>

        {buildStyle === 'args' && (
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-400 text-[10px]">PYTHON_VERSION:</span>
            {['3.9', '3.10', '3.11'].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setPythonVer(v)}
                className={`px-2 py-0.5 rounded font-bold ${
                  pythonVer === v ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10.5px] flex flex-col justify-between">
          <div className="text-white font-bold border-b border-slate-800 pb-1.5">
            docker-compose.yml
          </div>

          {buildStyle === 'simple' && (
            <pre className="text-slate-300 leading-relaxed my-auto overflow-x-auto">
{`version: '3.8'
services:
  inference_api:
    # String path to build context directory
    build: ./inference_service
    ports:
      - "5001:5000"
    volumes:
      - ./models:/app/models
    environment:
      - MODEL_PATH=/app/models/my_model.pkl`}
            </pre>
          )}

          {buildStyle === 'explicit' && (
            <pre className="text-slate-300 leading-relaxed my-auto overflow-x-auto">
{`version: '3.8'
services:
  data_processor:
    build:
      # Directory sent to Docker daemon
      context: ./processing
      # Custom Dockerfile name inside context
      dockerfile: Dockerfile.processor
    volumes:
      - ./data:/data
    command: python process.py /data/in /data/out`}
            </pre>
          )}

          {buildStyle === 'args' && (
            <pre className="text-slate-300 leading-relaxed my-auto overflow-x-auto">
{`version: '3.8'
services:
  training_env:
    build:
      context: ./training
      dockerfile: Dockerfile.train
      args:
        # Overrides ARG default in Dockerfile!
        PYTHON_VERSION: ${pythonVer}`}
            </pre>
          )}

          <div className="text-[11px] font-sans text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            {buildStyle === 'simple' && 'Compose navigates to ./inference_service and builds the default Dockerfile inside it.'}
            {buildStyle === 'explicit' && 'Use context + dockerfile when your Dockerfile has a custom name like Dockerfile.processor.'}
            {buildStyle === 'args' && `Compose passes --build-arg PYTHON_VERSION=${pythonVer} to the Docker daemon at build time!`}
          </div>
        </div>

        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between font-mono text-xs">
          <div className="text-xs font-sans font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-2">
            Target Build Context &amp; Dockerfile
          </div>

          <div className="my-auto space-y-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] font-sans uppercase font-bold text-slate-400 mb-1">
                Resolved Build Context Directory
              </div>
              <div className="text-sky-300 font-bold">
                {buildStyle === 'simple' && './inference_service/Dockerfile'}
                {buildStyle === 'explicit' && './processing/Dockerfile.processor'}
                {buildStyle === 'args' && './training/Dockerfile.train'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black border border-amber-500/40 space-y-1.5 text-[11px]">
              <div className="text-slate-500"># Inside target Dockerfile:</div>
              {buildStyle === 'args' ? (
                <>
                  <div className="text-amber-300">
                    ARG PYTHON_VERSION=3.9 <span className="text-slate-500"># Overridden to {pythonVer}!</span>
                  </div>
                  <div className="text-emerald-300 font-bold">
                    FROM python:{pythonVer}-slim
                  </div>
                </>
              ) : (
                <>
                  <div className="text-emerald-300 font-bold">FROM python:3.9-slim</div>
                  <div className="text-slate-300">WORKDIR /app</div>
                  <div className="text-slate-300">COPY . .</div>
                </>
              )}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[10.5px] text-slate-400">
            Equivalent CLI command executed by Compose:<br />
            <span className="text-emerald-400 font-bold">
              {buildStyle === 'simple' && '$ docker build ./inference_service'}
              {buildStyle === 'explicit' && '$ docker build -f ./processing/Dockerfile.processor ./processing'}
              {buildStyle === 'args' && `$ docker build --build-arg PYTHON_VERSION=${pythonVer} -f ./training/Dockerfile.train ./training`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualCombineBuildImageAndTriggers({ initialCommand = 'up_build' }) {
  const [commandMode, setCommandMode] = useState(initialCommand);

  const commandSpecs = {
    up_default: {
      cmd: '$ docker-compose up',
      title: '1. Standard `docker-compose up` (Fast, But May Reuse Stale Image!)',
      buildsImage: 'Only if image does NOT exist yet',
      startsContainers: 'YES (Starts stack)',
      desc: 'Compose checks if my_registry/my_ml_api:1.0 already exists locally. If you edited a dependency or code inside ./inference_service, standard "up" might skip rebuilding and run your old image!',
    },
    up_build: {
      cmd: '$ docker-compose up --build',
      title: '2. Forced Rebuild: `docker-compose up --build` (Recommended)',
      buildsImage: 'YES (Forces fresh build & tags image)',
      startsContainers: 'YES (Starts stack with new image)',
      desc: 'Explicitly forces Compose to rebuild ./inference_service, tag the resulting image as my_registry/my_ml_api:1.0, and recreate the running container!',
    },
    build_only: {
      cmd: '$ docker-compose build',
      title: '3. Build Only: `docker-compose build` (CI/CD & Registry Push)',
      buildsImage: 'YES (Builds & tags my_registry/my_ml_api:1.0)',
      startsContainers: 'NO (Does not start containers)',
      desc: 'Compiles and tags all services with a build: section without starting any containers—ideal when preparing images for "docker push my_registry/my_ml_api:1.0"!',
    },
  };

  const active = commandSpecs[commandMode];

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap gap-2 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800 z-20">
        {Object.entries(commandSpecs).map(([key, item]) => (
          <button
            key={key}
            type="button"
            onClick={() => setCommandMode(key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              commandMode === key ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {item.cmd}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10.5px] flex flex-col justify-between">
          <div className="text-xs font-sans font-bold text-teal-400 border-b border-slate-800 pb-1.5">
            Combining `build:` and `image:`
          </div>

          <pre className="bg-black p-3 rounded-xl border border-slate-800 text-slate-200 my-auto leading-relaxed overflow-x-auto">
{`version: '3.8'
services:
  inference_api:
    # 1. Build from this directory:
    build: ./inference_service
    # 2. Tag the built image as:
    image: my_registry/my_ml_api:1.0
    ports:
      - "5001:5000"`}
          </pre>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-sans text-[11px] text-slate-300">
            <strong className="text-amber-300">Why specify both?</strong> Without <code>image:</code>, Compose names the built image automatically (e.g., <code>project_inference_api</code>). Adding <code>image:</code> tags it for <code>docker push</code>!
          </div>
        </div>

        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-bold text-white border-b border-slate-800 pb-2">
            {active.title}
          </div>

          <div className="grid grid-cols-3 gap-2.5 my-auto py-2">
            <div className={`p-3 rounded-xl border-2 text-center transition-all ${
              commandMode !== 'up_default'
                ? 'bg-emerald-950/30 border-emerald-400 text-white'
                : 'bg-amber-950/30 border-amber-400/70 text-amber-200'
            }`}>
              <IconFileCode className="w-6 h-6 mx-auto mb-1 text-teal-300" />
              <div className="text-xs font-bold">1. Build Image</div>
              <div className="text-[10px] font-mono mt-1">{active.buildsImage}</div>
            </div>

            <div className="p-3 rounded-xl border-2 border-indigo-400/70 bg-indigo-950/30 text-center text-white">
              <IconCloud className="w-6 h-6 mx-auto mb-1 text-indigo-300" />
              <div className="text-xs font-bold">2. Tagged Artifact</div>
              <div className="text-[9.5px] font-mono text-indigo-200 mt-1 break-all">
                my_registry/my_ml_api:1.0
              </div>
              <div className="text-[9px] text-emerald-300 mt-1 font-mono">
                Ready for docker push
              </div>
            </div>

            <div className={`p-3 rounded-xl border-2 text-center transition-all ${
              commandMode !== 'build_only'
                ? 'bg-sky-950/30 border-sky-400 text-white'
                : 'bg-slate-900 border-dashed border-slate-700 text-slate-500 opacity-50'
            }`}>
              <IconBox className="w-6 h-6 mx-auto mb-1 text-sky-300" />
              <div className="text-xs font-bold">3. Run Container</div>
              <div className="text-[10px] font-mono mt-1">{active.startsContainers}</div>
            </div>
          </div>

          <div className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
            {active.desc}
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualEnvIntro() {
  return <VisualListVsMapEnv initialFormat="list" />;
}
export function VisualEnvList() {
  return <VisualListVsMapEnv initialFormat="list" />;
}
export function VisualEnvMap() {
  return <VisualListVsMapEnv initialFormat="map" />;
}
export function VisualHostSubst() {
  return <VisualHostSubstitutionAndDollar initialSyntax="plain" initialHostDefined={false} />;
}
export function VisualDotEnv() {
  return <VisualDotEnvSubstitution initialProfile="dev" />;
}
export function VisualEnvWire() {
  return <VisualDotEnvSubstitution initialProfile="dev" />;
}
export function VisualEnvFileOrder() {
  return <VisualEnvPrecedencePyramid initialCommon initialService initialCli={false} />;
}
export function VisualPrecedence() {
  return <VisualEnvPrecedencePyramid initialCommon={false} initialService={false} initialCli={false} />;
}
export function VisualLiteralDollar() {
  return <VisualHostSubstitutionAndDollar initialSyntax="dollar" />;
}
export function VisualBuildIntro() {
  return <VisualBuildWithCompose initialStyle="simple" />;
}
export function VisualBuildPath() {
  return <VisualBuildWithCompose initialStyle="simple" />;
}
export function VisualBuildContext() {
  return <VisualBuildWithCompose initialStyle="explicit" />;
}
export function VisualBuildArgs() {
  return <VisualBuildWithCompose initialStyle="args" initialPython="3.10" />;
}
export function VisualBuildTag() {
  return <VisualCombineBuildImageAndTriggers initialCommand="up_build" />;
}
export function VisualTriggerBuild() {
  return <VisualCombineBuildImageAndTriggers initialCommand="up_default" />;
}
