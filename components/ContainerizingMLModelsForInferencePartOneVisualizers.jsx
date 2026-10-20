import { useState } from 'react';

const IconCpu = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>;
const IconPlay = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
const IconDatabase = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
const IconBox = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const IconGlobe = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>;

const contractScenarios = {
  valid_json: {
    label: '1. Valid JSON Request',
    endpoint: 'POST /predict',
    contentType: 'application/json',
    reqBody: `{\n  "features": [\n    {"sepal_len": 5.1, "petal_len": 1.4}\n  ]\n}`,
    status: '200 OK',
    statusColor: 'bg-emerald-500 text-slate-950',
    borderColor: 'border-emerald-500/60',
    resBody: `{\n  "predictions": ["setosa"],\n  "confidence": [0.984],\n  "latency_ms": 12.4\n}`,
    note: 'Standard web API contract: JSON payload in, JSON prediction + confidence out.',
  },
  binary: {
    label: '2. Binary / Protobuf',
    endpoint: 'POST /predict_image',
    contentType: 'multipart/form-data (or Protobuf)',
    reqBody: `--boundary\nContent-Disposition: form-data; name="image"; filename="scan.png"\n<binary_bytes_89504E47...>`,
    status: '200 OK',
    statusColor: 'bg-blue-500 text-slate-950',
    borderColor: 'border-blue-500/60',
    resBody: `{\n  "predictions": [{"label": "benign", "score": 0.94}],\n  "latency_ms": 28.1\n}`,
    note: 'Used for performance-critical vision/audio models to avoid base64 JSON overhead.',
  },
  bad_input: {
    label: '3. Invalid Client Input (400)',
    endpoint: 'POST /predict',
    contentType: 'application/json',
    reqBody: `{\n  "wrong_key": "missing_features_array"\n}`,
    status: '400 Bad Request',
    statusColor: 'bg-amber-500 text-slate-950',
    borderColor: 'border-amber-500/60',
    resBody: `{\n  "error": "Missing 'features' key in JSON payload",\n  "code": "INVALID_INPUT_SCHEMA"\n}`,
    note: 'Client sent malformed data; service catches it early and returns a 4xx status.',
  },
  model_error: {
    label: '4. Model Failure (500)',
    endpoint: 'POST /predict',
    contentType: 'application/json',
    reqBody: `{\n  "features": [[NaN, Infinity, -99999]]\n}`,
    status: '500 Internal Server Error',
    statusColor: 'bg-rose-600 text-white',
    borderColor: 'border-rose-500/60',
    resBody: `{\n  "error": "Prediction failed",\n  "details": "Model not loaded or numerical instability"\n}`,
    note: 'Server-side or model execution failure communicates a clear 5xx status.',
  },
};

export function VisualApiContractTester({ initialScenario = 'valid_json' }) {
  const [scenario, setScenario] = useState(initialScenario);
  const active = contractScenarios[scenario];

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-500">Training Workflow</div>
            <div className="text-xs text-slate-300 font-semibold">Batch processing • High throughput • Minutes/Hours</div>
          </div>
          <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Offline</span>
        </div>
        <div className="bg-teal-950/30 border border-teal-500/40 rounded-lg p-2.5 pr-28 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase text-teal-400">Inference Service</div>
            <div className="text-xs text-white font-semibold">Single/Small-batch requests • Low latency (ms) • 24/7 API</div>
          </div>
          <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded font-bold">Online</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 bg-slate-950 p-2.5 pr-36 rounded-xl border border-slate-800">
        {Object.entries(contractScenarios).map(([key, item]) => (
          <button
            key={key}
            type="button"
            onClick={() => setScenario(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              scenario === key
                ? 'bg-teal-600 text-white shadow-[0_0_15px_rgba(20,184,166,0.4)]'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 items-center min-h-0">
        <div className="md:col-span-4 h-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between font-mono text-[10px]">
          <div>
            <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1.5">
              1–3. Client Request Contract
            </div>
            <div className="mt-2 flex items-center justify-between bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800">
              <span className="text-amber-300 font-bold">{active.endpoint}</span>
              <span className="text-[9px] text-slate-400">{active.contentType}</span>
            </div>
          </div>
          <pre className="bg-black p-2.5 rounded-lg border border-slate-800 text-slate-300 overflow-x-auto my-auto leading-relaxed">
            {active.reqBody}
          </pre>
          <div className="text-[10px] font-sans text-slate-400">
            • <strong>Endpoint:</strong> URL path<br />
            • <strong>Method:</strong> HTTP <code>POST</code>
          </div>
        </div>

        <div className="md:col-span-4 h-full bg-slate-950 border-2 border-teal-500/50 rounded-xl p-3.5 flex flex-col justify-between text-center relative shadow-[0_0_25px_rgba(20,184,166,0.1)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1.5">
            Inference Container
          </div>
          <div className="my-auto space-y-2.5">
            <div className="text-[10px] font-mono text-blue-300 bg-blue-950/40 border border-blue-500/30 py-1 px-2 rounded">
              → Parses &amp; Validates Input →
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center">
              <IconCpu className="w-7 h-7 text-teal-400 mb-1 animate-pulse" />
              <div className="text-xs font-bold text-white">Loaded ML Model</div>
              <div className="text-[10px] font-mono text-slate-400">model.predict(X)</div>
            </div>
            <div className="text-[10px] font-mono text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 py-1 px-2 rounded">
              ← Serializes Output / Error ←
            </div>
          </div>
          <div className="text-[10px] text-slate-400">
            Enforces strict contract before &amp; after prediction
          </div>
        </div>

        <div className={`md:col-span-4 h-full bg-slate-950 border-2 ${active.borderColor} rounded-xl p-3.5 flex flex-col justify-between font-mono text-[10px] transition-all`}>
          <div>
            <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-1.5 flex items-center justify-between">
              <span>4–5. Output &amp; Status</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-sans font-bold ${active.statusColor}`}>
                {active.status}
              </span>
            </div>
          </div>
          <pre className="bg-black p-2.5 rounded-lg border border-slate-800 text-emerald-300 overflow-x-auto my-auto leading-relaxed">
            {active.resBody}
          </pre>
          <div className="text-[10px] font-sans text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">
            {active.note}
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualShift = () => <VisualApiContractTester initialScenario="valid_json" />;
export const VisualContract = () => <VisualApiContractTester initialScenario="valid_json" />;
export const VisualErrors = () => <VisualApiContractTester initialScenario="bad_input" />;

const asyncStepsInfo = [
  { step: 1, title: '1. POST /submit_job (Input Data)', desc: 'Client sends heavy input payload (e.g., video or large batch) to Inference Service.' },
  { step: 2, title: '2. 202 Accepted (Job ID)', desc: 'Service immediately returns HTTP 202 Accepted + unique Job ID without blocking!' },
  { step: 3, title: '3. Enqueue Job', desc: 'Inference Service pushes the job metadata onto a message/job queue (e.g., Redis/RabbitMQ).' },
  { step: 4, title: '4. Process Job', desc: 'Background Prediction Worker (Container) pulls the job from the queue and runs model inference.' },
  { step: 5, title: '5. Store Result', desc: 'Prediction Worker writes the completed prediction output into the Result Store (DB/S3/Redis).' },
  { step: 6, title: '6. GET /results/{Job ID} (Polling)', desc: 'Client polls the results endpoint using its Job ID (or receives a webhook callback).' },
  { step: 7, title: '7. Fetch Result', desc: 'Inference Service retrieves the finished prediction from the Result Store.' },
  { step: 8, title: '8. 200 OK (Prediction)', desc: 'Final prediction is returned to the client!' },
];

export function VisualSyncVsAsyncFlow({ initialPattern = 'sync' }) {
  const [pattern, setPattern] = useState(initialPattern);
  const [asyncStep, setAsyncStep] = useState(0);

  return (
    <div className="w-full h-full flex flex-col p-5 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPattern('sync')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              pattern === 'sync'
                ? 'bg-sky-600 text-white shadow-[0_0_15px_rgba(2,132,199,0.4)]'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Synchronous Inference (2 Steps)
          </button>
          <button
            type="button"
            onClick={() => setPattern('async')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              pattern === 'async'
                ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(217,119,6,0.4)]'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Asynchronous Inference (8 Steps)
          </button>
        </div>

        {pattern === 'async' && (
          <div className="flex items-center gap-1">
            {asyncStepsInfo.map((s, idx) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setAsyncStep(idx)}
                className={`w-6 h-6 rounded text-[10px] font-bold transition-all ${
                  asyncStep === idx ? 'bg-amber-500 text-slate-950 scale-110' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {s.step}
              </button>
            ))}
          </div>
        )}
      </div>

      {pattern === 'sync' ? (
        <div className="flex-1 bg-sky-950/20 border-2 border-sky-500/40 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-sky-500/30 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
              Synchronous Inference (Real-Time / Low Latency)
            </span>
            <span className="text-[10px] font-mono bg-sky-500/20 text-sky-200 px-2.5 py-0.5 rounded">
              Connection Held Open (ms to seconds)
            </span>
          </div>
          <div className="my-auto flex items-center justify-around gap-4 py-6">
            <div className="w-40 p-4 rounded-xl bg-slate-950 border-2 border-slate-600 text-center shadow-lg">
              <div className="text-xs font-bold text-white">Client</div>
              <div className="text-[10px] text-slate-400 mt-1">Waits in same HTTP connection</div>
            </div>
            <div className="flex-1 max-w-md flex flex-col gap-5">
              <div className="bg-slate-950/90 border border-sky-500/50 rounded-lg p-2.5 text-center relative">
                <div className="text-[11px] font-mono font-bold text-sky-300">
                  1. POST /predict (Input Data) ───►
                </div>
                <div className="text-[9px] text-slate-400">Sent immediately over HTTP</div>
              </div>
              <div className="bg-slate-950/90 border border-emerald-500/50 rounded-lg p-2.5 text-center relative">
                <div className="text-[11px] font-mono font-bold text-emerald-300">
                  ◄─── 2. 200 OK (Prediction)
                </div>
                <div className="text-[9px] text-slate-400">Computed &amp; returned in same connection</div>
              </div>
            </div>
            <div className="w-52 p-4 rounded-xl bg-slate-950 border-2 border-sky-400 text-center shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <div className="text-xs font-bold text-white">Inference Service</div>
              <div className="text-[10px] font-mono text-sky-300">(Container)</div>
              <div className="mt-2 text-[10px] text-slate-300 bg-slate-900 p-1.5 rounded">
                Ideal for fraud detection, search ranking, recommendations
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <strong className="text-sky-400">Why Synchronous?</strong> Simplest to implement when model inference takes milliseconds or a few seconds and won&apos;t trigger HTTP request timeouts.
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-amber-950/15 border-2 border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Asynchronous Inference (Background Queue &amp; Worker Architecture)
            </span>
            <button
              type="button"
              onClick={() => setAsyncStep((asyncStep + 1) % 8)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-[10px] font-bold transition-all"
            >
              Next Step ({asyncStep + 1}/8) →
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2.5 items-center my-auto py-2">
            <div className={`p-3 rounded-xl border-2 text-center transition-all ${
              [0, 1, 5, 7].includes(asyncStep) ? 'bg-slate-950 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'bg-slate-950/60 border-slate-800'
            }`}
            >
              <div className="text-xs font-bold text-white">Client</div>
              <div className="text-[9px] font-mono text-slate-400 mt-1 space-y-1 text-left">
                <div className={asyncStep === 0 ? 'text-amber-300 font-bold' : ''}>1. POST /submit_job</div>
                <div className={asyncStep === 1 ? 'text-emerald-300 font-bold' : ''}>2. 202 Accepted</div>
                <div className={asyncStep === 5 ? 'text-sky-300 font-bold' : ''}>6. GET /results/id</div>
                <div className={asyncStep === 7 ? 'text-emerald-300 font-bold' : ''}>8. 200 OK</div>
              </div>
            </div>
            <div className={`p-3 rounded-xl border-2 text-center transition-all ${
              [0, 1, 2, 5, 6, 7].includes(asyncStep) ? 'bg-slate-950 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-slate-950/60 border-slate-800'
            }`}
            >
              <div className="text-xs font-bold text-white">Inference Service</div>
              <div className="text-[9px] font-mono text-blue-300">(Container)</div>
              <div className="text-[9px] text-slate-400 mt-1.5">
                Issues Job ID, enqueues task &amp; serves polled results
              </div>
            </div>
            <div className={`p-3 rounded-xl border-2 text-center transition-all ${
              [2, 3].includes(asyncStep) ? 'bg-purple-950/50 border-purple-400 scale-105 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-slate-950/60 border-slate-800'
            }`}
            >
              <IconDatabase className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-purple-200">Job Queue</div>
              <div className="text-[9px] font-mono text-slate-400 mt-1">
                3. Enqueue Job<br />4. Process Job
              </div>
            </div>
            <div className={`p-3 rounded-xl border-2 text-center transition-all ${
              [3, 4].includes(asyncStep) ? 'bg-emerald-950/50 border-emerald-400 scale-105 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-950/60 border-slate-800'
            }`}
            >
              <IconCpu className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-emerald-200">Prediction Worker</div>
              <div className="text-[9px] font-mono text-emerald-400">(Container)</div>
              <div className="text-[9px] text-slate-400 mt-1">Heavy GPU/CPU batch or video job</div>
            </div>
            <div className={`p-3 rounded-xl border-2 text-center transition-all ${
              [4, 6].includes(asyncStep) ? 'bg-indigo-950/50 border-indigo-400 scale-105 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-slate-950/60 border-slate-800'
            }`}
            >
              <IconDatabase className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-indigo-200">Result Store</div>
              <div className="text-[9px] font-mono text-slate-400 mt-1">
                5. Store Result<br />7. Fetch Result
              </div>
            </div>
          </div>
          <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-amber-300">{asyncStepsInfo[asyncStep].title}</div>
              <div className="text-[11px] text-slate-300 mt-0.5">{asyncStepsInfo[asyncStep].desc}</div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">Step {asyncStep + 1} of 8</span>
          </div>
        </div>
      )}
    </div>
  );
}

export const VisualSyncPath = () => <VisualSyncVsAsyncFlow initialPattern="sync" />;
export const VisualAsyncPath = () => <VisualSyncVsAsyncFlow initialPattern="async" />;

export function VisualStatelessScaling() {
  const [archMode, setArchMode] = useState('stateless');
  const [replicaCount, setReplicaCount] = useState(3);
  const [node1Crashed, setNode1Crashed] = useState(false);
  const [activeRequestReplica, setActiveRequestReplica] = useState(2);

  const sendTraffic = () => {
    const healthyReplicas = [1, 2, 3].slice(0, replicaCount).filter((id) => !(node1Crashed && id === 1));
    if (healthyReplicas.length > 0) {
      const next = healthyReplicas[Math.floor(Math.random() * healthyReplicas.length)];
      setActiveRequestReplica(next);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setArchMode('stateless'); setNode1Crashed(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              archMode === 'stateless' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ✓ Stateless Containers (Best Practice)
          </button>
          <button
            type="button"
            onClick={() => { setArchMode('stateful'); setNode1Crashed(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              archMode === 'stateful' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ✕ Stateful In-Memory (Anti-Pattern)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={sendTraffic}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
          >
            <IconPlay className="w-3 h-3" /> Route Request
          </button>
          <button
            type="button"
            onClick={() => {
              setNode1Crashed(!node1Crashed);
              if (!node1Crashed && activeRequestReplica === 1) setActiveRequestReplica(2);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              node1Crashed
                ? 'bg-amber-600 text-white border-amber-400'
                : 'bg-slate-900 text-rose-300 border-rose-500/40 hover:bg-rose-950'
            }`}
          >
            {node1Crashed ? 'Restore Container #1' : 'Simulate Container #1 Crash'}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center min-h-0">
        <div className="md:col-span-3 h-full bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between text-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1.5">
            Load Balancer
          </div>
          <div className="my-auto space-y-3">
            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/40">
              <IconGlobe className="w-7 h-7 text-blue-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-white">Incoming Requests</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Round-Robin / Least-Conn</div>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 mb-1">Horizontal Scale (Replicas):</div>
              <div className="flex justify-center gap-1.5">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setReplicaCount(n)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                      replicaCount === n ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {n}x
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-500">
            Routed to: <strong className="text-teal-400">Replica #{activeRequestReplica}</strong>
          </div>
        </div>

        <div className="md:col-span-5 h-full flex flex-col justify-center gap-2.5">
          {[1, 2, 3].slice(0, replicaCount).map((id) => {
            const isCrashed = id === 1 && node1Crashed;
            const isSelected = activeRequestReplica === id && !isCrashed;
            return (
              <div
                key={id}
                className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                  isCrashed
                    ? 'bg-rose-950/30 border-dashed border-rose-500/60 opacity-60'
                    : isSelected
                      ? 'bg-slate-950 border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.25)]'
                      : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <IconBox className={`w-5 h-5 ${isCrashed ? 'text-rose-400' : 'text-teal-400'}`} />
                  <div>
                    <div className="text-xs font-bold text-white">Inference Container #{id}</div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {isCrashed
                        ? 'CRASHED (OOM / Node Failure)'
                        : archMode === 'stateless'
                          ? 'Zero local session state • Pure function'
                          : id === 1
                            ? 'Holds User_42 history in local RAM!'
                            : 'Missing User_42 history!'}
                    </div>
                  </div>
                </div>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                  isCrashed
                    ? 'bg-rose-600 text-white'
                    : isSelected
                      ? 'bg-teal-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                }`}
                >
                  {isCrashed ? 'OFFLINE' : isSelected ? 'SERVING' : 'READY'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="md:col-span-4 h-full bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 border-b border-slate-800 pb-1.5">
            External State / Cache
          </div>
          <div className={`p-3.5 rounded-xl border-2 my-auto transition-all ${
            archMode === 'stateless'
              ? 'bg-purple-950/30 border-purple-500/50'
              : 'bg-slate-900 border-dashed border-slate-700 opacity-40'
          }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
              <IconDatabase className="w-5 h-5 text-purple-400" />
              Redis / Feature Store
            </div>
            <div className="text-[10px] text-slate-300 mt-1.5 leading-relaxed">
              {archMode === 'stateless'
                ? 'If user context or feature lookups are needed, any container fetches them from Redis in <1ms.'
                : 'Not used — state is trapped inside individual container memory!'}
            </div>
          </div>
          <div className={`p-3 rounded-lg border text-[11px] ${
            archMode === 'stateless'
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
          }`}
          >
            {archMode === 'stateless' ? (
              node1Crashed
                ? '✓ Reliability Verified: Container #1 crashed, but Replica #2/#3 served the request with zero data loss!'
                : '✓ Scalability Verified: Any replica can handle any request identically.'
            ) : (
              node1Crashed
                ? '❌ Session Lost! Container #1 crashed and took User_42’s in-memory history down with it!'
                : activeRequestReplica !== 1
                  ? `⚠ Inconsistent! Request landed on Replica #${activeRequestReplica}, which doesn't have Container #1's local RAM state!`
                  : '⚠ Fragile! Only works while requests happen to hit Container #1.'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualStateless = VisualStatelessScaling;

const loadStrategies = {
  startup: {
    name: '1. Load at Startup (Production Standard)',
    bootTimeMs: '3,200 ms',
    bootWidth: 'w-4/5',
    req1Latency: '18 ms (Fast!)',
    req1Width: 'w-12',
    req2Latency: '18 ms',
    req2Width: 'w-12',
    badge: 'Recommended for Production',
    desc: 'Model weights are loaded into memory when the container starts, BEFORE accepting traffic. Container boot is slower, but the very first user request is served immediately without cold-start latency.',
  },
  lazy: {
    name: '2. Lazy Load on First Request',
    bootTimeMs: '300 ms (Instant Boot)',
    bootWidth: 'w-16',
    req1Latency: '3,218 ms (Cold-Start Spike!)',
    req1Width: 'w-full',
    req2Latency: '18 ms',
    req2Width: 'w-12',
    badge: 'Dev / Low-Traffic Only',
    desc: 'Container starts immediately, but the first incoming request blocks while multi-MB/GB model weights load from disk. Causes severe tail-latency timeouts on Request #1.',
  },
  dynamic: {
    name: '3. Dynamic Multi-Model Loading',
    bootTimeMs: '500 ms',
    bootWidth: 'w-20',
    req1Latency: '450 ms (Swaps Model A/B)',
    req1Width: 'w-2/5',
    req2Latency: '18 ms (If cached in RAM)',
    req2Width: 'w-16',
    badge: 'Multi-Tenant / Infrequent Models',
    desc: 'Loads and unloads models on-demand based on request parameters (e.g., tenant_id). Useful when serving dozens of models that cannot all fit into RAM simultaneously.',
  },
};

export function VisualModelLoadingStrategies({ initialStrategy = 'startup' }) {
  const [strategy, setStrategy] = useState(initialStrategy);
  const current = loadStrategies[strategy];

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap gap-2 mb-4 bg-slate-950 p-2.5 pr-36 rounded-xl border border-slate-800">
        {Object.entries(loadStrategies).map(([key, item]) => (
          <button
            key={key}
            type="button"
            onClick={() => setStrategy(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              strategy === key ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white">Latency Timeline Comparison</span>
            <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded font-bold">
              {current.badge}
            </span>
          </div>
          <div className="space-y-4 my-auto">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">Container Startup Time (Before Ready)</span>
                <span className="font-mono text-amber-300 font-bold">{current.bootTimeMs}</span>
              </div>
              <div className="w-full bg-slate-900 h-5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div className={`h-full bg-amber-500 rounded-full transition-all duration-500 ${current.bootWidth}`} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">1st Client Request Latency</span>
                <span className={`font-mono font-bold ${strategy === 'lazy' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {current.req1Latency}
                </span>
              </div>
              <div className="w-full bg-slate-900 h-5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div className={`h-full rounded-full transition-all duration-500 ${strategy === 'lazy' ? 'bg-rose-500' : 'bg-emerald-500'} ${current.req1Width}`} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">Subsequent Requests (Model in RAM)</span>
                <span className="font-mono text-emerald-400 font-bold">{current.req2Latency}</span>
              </div>
              <div className="w-full bg-slate-900 h-5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div className={`h-full bg-emerald-500 rounded-full transition-all duration-500 ${current.req2Width}`} />
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800 leading-relaxed">
            {current.desc}
          </p>
        </div>

        <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-400 border-b border-slate-800 pb-2">
            Failure Modes &amp; Status Codes
          </div>
          <div className="space-y-2 my-auto text-[11px]">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-amber-500/30">
              <div className="font-bold text-amber-300 flex justify-between">
                <span>1. Invalid Input</span>
                <code className="text-[10px]">400 Bad Request</code>
              </div>
              <div className="text-slate-400 text-[10px] mt-0.5">Missing keys, wrong data types, malformed JSON.</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-rose-500/30">
              <div className="font-bold text-rose-300 flex justify-between">
                <span>2. Model / Server Errors</span>
                <code className="text-[10px]">500 / 503</code>
              </div>
              <div className="text-slate-400 text-[10px] mt-0.5">NaN instability, missing model file, or 503 Service Unavailable.</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-purple-500/30">
              <div className="font-bold text-purple-300 flex justify-between">
                <span>3. Resource Exhaustion</span>
                <code className="text-[10px]">OOM / CPU Spike</code>
              </div>
              <div className="text-slate-400 text-[10px] mt-0.5">Container runs out of RAM holding large weights; detected via health checks.</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-blue-500/30">
              <div className="font-bold text-blue-300 flex justify-between">
                <span>4. Structured Logs</span>
                <code className="text-[10px]">stdout / stderr</code>
              </div>
              <div className="text-slate-400 text-[10px] mt-0.5">Log input summary, prediction, latency &amp; stack traces as JSON.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualLoadStrategy = () => <VisualModelLoadingStrategies initialStrategy="startup" />;
export const VisualLogs = () => <VisualModelLoadingStrategies initialStrategy="startup" />;

const flaskStages = [
  {
    title: '1. Load Model at Startup',
    code: `app = Flask(__name__)
try:
    model = joblib.load('model.joblib')
    print("Model loaded successfully.")
except FileNotFoundError:
    model = None`,
    detail: 'Loads serialized model.joblib once globally when the Flask module initializes.',
  },
  {
    title: '2. Define /predict Route',
    code: `@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500`,
    detail: 'Exposes the POST /predict endpoint and guards against missing model artifacts.',
  },
  {
    title: '3. Validate & DataFrame',
    code: `    data = request.get_json(force=True)
    if 'features' not in data:
        return jsonify({"error": "Missing 'features' key"}), 400
    input_df = pd.DataFrame(data['features'])`,
    detail: 'Parses incoming JSON, checks for the required "features" key (400 if missing), and builds a DataFrame.',
  },
  {
    title: '4. Predict & Serialize JSON',
    code: `    predictions = model.predict(input_df)
    output = predictions.tolist()
    return jsonify({"predictions": output})`,
    detail: 'Converts NumPy array predictions to a standard Python list (.tolist()) so jsonify() can serialize it.',
  },
];

export function VisualFlaskPipeline({ initialStage = 0, initialServer = 'gunicorn' }) {
  const [activeStage, setActiveStage] = useState(initialStage);
  const [serverMode, setServerMode] = useState(initialServer);

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800">
        <div className="flex flex-wrap gap-1.5">
          {flaskStages.map((s, idx) => (
            <button
              key={s.title}
              type="button"
              onClick={() => setActiveStage(idx)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                activeStage === idx ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setServerMode(serverMode === 'gunicorn' ? 'dev' : 'gunicorn')}
          className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
            serverMode === 'gunicorn'
              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300'
              : 'bg-amber-950/60 border-amber-400 text-amber-300'
          }`}
        >
          {serverMode === 'gunicorn' ? 'Server: Gunicorn (Production WSGI)' : 'Server: python app.py (Dev Only)'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between font-mono text-[10.5px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-white font-bold">app.py (Flask Scikit-Learn API)</span>
            <span className="text-[10px] text-blue-400 font-sans font-bold">WSGI Microframework</span>
          </div>
          <pre className="bg-black p-3.5 rounded-xl border border-blue-500/40 text-slate-200 overflow-x-auto my-auto leading-relaxed">
            {flaskStages[activeStage].code}
          </pre>
          <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/30 font-sans text-xs text-blue-200">
            <strong>Stage Insight:</strong> {flaskStages[activeStage].detail}
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-[10.5px] flex-1 flex flex-col justify-between">
            <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
              requirements.txt
            </div>
            <pre className="text-slate-300 my-auto leading-relaxed">
{`flask
pandas
scikit-learn
joblib
# Production WSGI server:
gunicorn`}
            </pre>
          </div>
          <div className={`p-3.5 rounded-xl border-2 font-mono text-[10.5px] transition-all ${
            serverMode === 'gunicorn' ? 'bg-emerald-950/20 border-emerald-500/50' : 'bg-amber-950/20 border-amber-500/50'
          }`}
          >
            <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-white mb-1">
              {serverMode === 'gunicorn' ? '✓ Production Container CMD' : '⚠ Local Dev Server (Single-Threaded)'}
            </div>
            {serverMode === 'gunicorn' ? (
              <>
                <div className="bg-black p-2 rounded text-emerald-300">
                  $ gunicorn --bind 0.0.0.0:5000 app:app
                </div>
                <div className="text-[10px] font-sans text-slate-300 mt-1.5">
                  Gunicorn manages multiple worker processes to handle concurrent inference requests safely in production.
                </div>
              </>
            ) : (
              <>
                <div className="bg-black p-2 rounded text-amber-300">
                  $ python app.py &nbsp;# app.run(port=5000)
                </div>
                <div className="text-[10px] font-sans text-slate-300 mt-1.5">
                  Built-in Flask server is for local debugging only; never use it directly in production containers.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualHttp = () => <VisualFlaskPipeline initialStage={0} initialServer="gunicorn" />;
export const VisualFlaskSteps = () => <VisualFlaskPipeline initialStage={0} initialServer="dev" />;
export const VisualFlaskApp = () => <VisualFlaskPipeline initialStage={1} initialServer="gunicorn" />;
export const VisualGunicorn = () => <VisualFlaskPipeline initialStage={3} initialServer="gunicorn" />;

export function VisualFastApiPydanticLab({ initialTab = 'validation' }) {
  const [payloadType, setPayloadType] = useState('valid');
  const [rightTab, setRightTab] = useState(initialTab);

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setPayloadType('valid'); setRightTab('validation'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              payloadType === 'valid' && rightTab === 'validation' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Test Valid Payload (Pydantic Pass)
          </button>
          <button
            type="button"
            onClick={() => { setPayloadType('invalid_type'); setRightTab('validation'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              payloadType === 'invalid_type' && rightTab === 'validation' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Test Wrong Type (Auto 422 Error)
          </button>
        </div>
        <button
          type="button"
          onClick={() => setRightTab(rightTab === 'swagger' ? 'validation' : 'swagger')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
            rightTab === 'swagger'
              ? 'bg-teal-600 border-teal-400 text-white'
              : 'bg-slate-900 border-teal-500/40 text-teal-300 hover:bg-teal-950'
          }`}
        >
          {rightTab === 'swagger' ? 'Viewing /docs (Swagger UI)' : 'Open Auto-Generated /docs'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10px] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-white font-bold">app.py (FastAPI + Pydantic)</span>
            <span className="text-[10px] text-teal-400 font-sans font-bold">ASGI + Type Hints</span>
          </div>
          <pre className="text-slate-300 my-auto leading-relaxed overflow-x-auto">
{`class FeatureRow(BaseModel):
    feature1: float
    feature2: int
    feature3: str

class PredictionInput(BaseModel):
    features: List[FeatureRow]

class PredictionOutput(BaseModel):
    predictions: List[Any]

@app.post("/predict", response_model=PredictionOutput)
async def predict(input_data: PredictionInput):
    input_dict_list = [row.dict() for row in input_data.features]
    input_df = pd.DataFrame(input_dict_list)
    preds = model.predict(input_df).tolist()
    return PredictionOutput(predictions=preds)`}
          </pre>
          <div className="bg-black p-2 rounded border border-slate-800 text-[9.5px] text-teal-300">
            $ uvicorn app:app --host 0.0.0.0 --port 8000
          </div>
        </div>

        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          {rightTab === 'validation' ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Automatic Pydantic Data Validation
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  payloadType === 'valid' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-600 text-white'
                }`}
                >
                  {payloadType === 'valid' ? '200 OK' : '422 Unprocessable Entity'}
                </span>
              </div>
              <div className="my-auto space-y-3 font-mono text-[10px]">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-[9px] font-sans font-bold uppercase text-slate-400 mb-1">Incoming JSON Payload</div>
                  {payloadType === 'valid' ? (
                    <div className="text-blue-300">
                      {'{"features": [{"feature1": 1.5, "feature2": 3, "feature3": "A"}]}'}
                    </div>
                  ) : (
                    <div className="text-rose-300">
                      {'{"features": [{"feature1": "not_a_float", "feature2": "bad_int"}]}'}
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-lg border ${
                  payloadType === 'valid' ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}
                >
                  <div className="text-[9px] font-sans font-bold uppercase mb-1">
                    {payloadType === 'valid' ? 'Validated & Serialized via PredictionOutput' : 'Rejected Before Reaching Model Code!'}
                  </div>
                  <pre className="overflow-x-auto leading-snug">
                    {payloadType === 'valid'
                      ? '{\n  "predictions": [1]\n}'
                      : '{\n  "detail": [\n    {\n      "loc": ["body", "features", 0, "feature1"],\n      "msg": "value is not a valid float",\n      "type": "type_error.float"\n    }\n  ]\n}'}
                  </pre>
                </div>
              </div>
              <div className="text-[10px] text-slate-400">
                Zero manual <code>if/else</code> boilerplate needed for field types!
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-teal-400 font-mono">http://localhost:8000/docs</span>
                <span className="text-[9px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold">Auto-Generated OpenAPI</span>
              </div>
              <div className="my-auto space-y-2.5 font-mono text-[10px]">
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                  <div>
                    <span className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded mr-2">POST</span>
                    <span className="text-white font-bold">/predict</span>
                  </div>
                  <span className="text-slate-400">Predict with ML Model</span>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/40 flex items-center justify-between">
                  <div>
                    <span className="bg-blue-500 text-slate-950 font-bold px-2 py-0.5 rounded mr-2">GET</span>
                    <span className="text-white font-bold">/</span>
                  </div>
                  <span className="text-slate-400">Read Root Health</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <div className="text-[9px] font-sans font-bold uppercase text-teal-400 mb-1">Schemas (From Pydantic Models)</div>
                  <div>• <code>PredictionInput</code> (features: List[FeatureRow])</div>
                  <div>• <code>FeatureRow</code> (feature1: float, feature2: int, feature3: str)</div>
                  <div>• <code>PredictionOutput</code> (predictions: List[Any])</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400">
                FastAPI generates interactive Swagger UI (<code>/docs</code>) and ReDoc (<code>/redoc</code>) automatically!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const VisualFastFlow = () => <VisualFastApiPydanticLab initialTab="validation" />;
export const VisualUvicorn = () => <VisualFastApiPydanticLab initialTab="swagger" />;

export function VisualDockerInferenceNetworking({ initialFramework = 'fastapi' }) {
  const [bindHost, setBindHost] = useState('0.0.0.0');
  const [framework, setFramework] = useState(initialFramework);
  const port = framework === 'fastapi' ? '8000' : '5000';
  const cmdStr = framework === 'fastapi'
    ? `CMD ["uvicorn", "app:app", "--host", "${bindHost}", "--port", "8000"]`
    : `CMD ["gunicorn", "--bind", "${bindHost}:5000", "app:app"]`;

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFramework('fastapi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              framework === 'fastapi' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            FastAPI + Uvicorn (:8000)
          </button>
          <button
            type="button"
            onClick={() => setFramework('flask')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              framework === 'flask' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Flask + Gunicorn (:5000)
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-slate-400">Bind Interface:</span>
          <button
            type="button"
            onClick={() => setBindHost('0.0.0.0')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              bindHost === '0.0.0.0' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-400'
            }`}
          >
            0.0.0.0 (All Interfaces ✓)
          </button>
          <button
            type="button"
            onClick={() => setBindHost('127.0.0.1')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              bindHost === '127.0.0.1' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-800 text-slate-400'
            }`}
          >
            127.0.0.1 (Loopback Trap ✕)
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center min-h-0">
        <div className="md:col-span-6 h-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10px] flex flex-col justify-between">
          <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1.5">
            6-Step Inference Dockerfile
          </div>
          <div className="space-y-1.5 my-auto text-slate-300">
            <div><span className="text-slate-500"># 1. Base Image</span><br /><span className="text-pink-400">FROM</span> python:3.9-slim</div>
            <div><span className="text-pink-400">WORKDIR</span> /app</div>
            <div><span className="text-slate-500"># 2. Install Dependencies (Cached Layer)</span><br /><span className="text-pink-400">COPY</span> requirements.txt .<br /><span className="text-pink-400">RUN</span> pip install --no-cache-dir -r requirements.txt</div>
            <div><span className="text-slate-500"># 3 &amp; 4. Copy API Code &amp; Model Artifact</span><br /><span className="text-pink-400">COPY</span> app.py model.joblib ./</div>
            <div><span className="text-slate-500"># 5. Document Listening Port</span><br /><span className="text-pink-400">EXPOSE</span> {port}</div>
            <div className={`p-1.5 rounded border ${
              bindHost === '0.0.0.0' ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/30 border-rose-500/50 text-rose-300'
            }`}
            >
              <span className="text-slate-400"># 6. Start Production Server</span><br />
              <span className="font-bold">{cmdStr}</span>
            </div>
          </div>
          <div className="bg-black p-2 rounded border border-slate-800 text-slate-300">
            <span className="text-emerald-400">$</span> docker run -d <strong className="text-amber-300">-p 8080:{port}</strong> my-inference-api
          </div>
        </div>

        <div className={`md:col-span-6 h-full rounded-xl p-4 border-2 flex flex-col justify-between transition-all ${
          bindHost === '0.0.0.0' ? 'bg-slate-950 border-emerald-500/50' : 'bg-slate-950 border-rose-500/50'
        }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-1.5">
            Why <code className="text-emerald-400">0.0.0.0</code> is Mandatory Inside Containers
          </div>
          <div className="my-auto space-y-3">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/40 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase text-amber-400">Host Machine Browser / Client</div>
                <div className="text-xs font-mono text-white">POST http://localhost:8080/predict</div>
              </div>
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">-p 8080:{port}</span>
            </div>
            <div className="text-center font-mono text-xs">
              {bindHost === '0.0.0.0' ? (
                <span className="text-emerald-400 font-bold">↓ Docker Bridge forwards to container eth0 ({port}) ↓</span>
              ) : (
                <span className="text-rose-400 font-bold">✕ Connection Refused! Server only listens on container lo (127.0.0.1) ✕</span>
              )}
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
              <div className="text-[10px] font-bold uppercase text-slate-400">Container Network Namespace</div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                <div className={`p-2 rounded border ${
                  bindHost === '0.0.0.0' ? 'bg-emerald-950/40 border-emerald-400 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
                >
                  <div className="font-bold">eth0 (0.0.0.0:{port})</div>
                  <div className="text-[9px] font-sans mt-0.5">External Docker traffic</div>
                </div>
                <div className="p-2 rounded border bg-slate-950 border-slate-700 text-slate-300">
                  <div className="font-bold">lo (127.0.0.1:{port})</div>
                  <div className="text-[9px] font-sans mt-0.5">Internal loopback only</div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            <strong>Remember:</strong> <code>EXPOSE {port}</code> is documentation only—you must publish the port with <code>-p 8080:{port}</code> AND bind your server to <code>0.0.0.0</code>!
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualDockerApi = () => <VisualDockerInferenceNetworking initialFramework="fastapi" />;
export const VisualChoice = () => <VisualDockerInferenceNetworking initialFramework="flask" />;
