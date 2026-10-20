import { useState } from 'react';

function VisualHealthCheckFundamentals({ initialState = 'healthy' }) {
  const [appState, setAppState] = useState(initialState);

  const scenarios = {
    healthy: {
      label: '1. Server Up + Model Loaded',
      processStatus: 'Up (PID 1 Running)',
      modelLoaded: true,
      httpResponse: 'HTTP 200 OK — {"status": "ok"}',
      curlOutcome: 'curl succeeds → Exit Code 0',
      exitCode: 0,
      dockerHealth: 'healthy',
      note: 'Both web server and ML model are ready. curl --fail returns 0, marking the container healthy!',
    },
    missing_model: {
      label: '2. "Zombie" Container (Model Failed to Load)',
      processStatus: 'Up (PID 1 Running!)',
      modelLoaded: false,
      httpResponse: 'HTTP 503 Service Unavailable — {"detail": "Model not loaded"}',
      curlOutcome: 'curl --fail detects 503 → || exit 1 triggers!',
      exitCode: 1,
      dockerHealth: 'unhealthy',
      note: 'Without an application-level /health check verifying model_loaded, Docker would think this container is fine just because Uvicorn is running!',
    },
    crashed: {
      label: '3. Unresponsive / Hung Server',
      processStatus: 'Hung / Deadlocked',
      modelLoaded: false,
      httpResponse: 'Connection Refused / Timeout (3s)',
      curlOutcome: 'curl fails to connect → || exit 1 triggers!',
      exitCode: 1,
      dockerHealth: 'unhealthy',
      note: 'Server hangs or refuses connections. curl fails and || exit 1 guarantees a clean Exit Code 1.',
    },
  };

  const current = scenarios[appState];

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800 z-20">
        <div className="flex flex-wrap gap-2">
          {Object.entries(scenarios).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => setAppState(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                appState === key
                  ? 'bg-teal-600 text-white shadow-[0_0_15px_rgba(20,184,166,0.4)]'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10.5px] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-white font-bold">main.py (Application-Level Health Check)</span>
            <span className={`text-[9px] font-sans font-bold px-2 py-0.5 rounded ${
              current.modelLoaded ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              model_loaded = {String(current.modelLoaded)}
            </span>
          </div>

          <pre className="bg-black p-3 rounded-xl border border-slate-800 text-slate-300 overflow-x-auto my-auto leading-relaxed">
{`model_loaded = os.path.exists("./model.pkl")

@app.get("/health")
def health_check():
    if not model_loaded:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded"
        )
    return {"status": "ok"}`}
          </pre>

          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[10px]">
            <div className="text-teal-400 font-bold mb-1"># Dockerfile Instruction:</div>
            <div className="text-slate-200">
              <span className="text-pink-400">HEALTHCHECK</span> --interval=15s --timeout=3s \<br />
              &nbsp;&nbsp;<span className="text-pink-400">CMD</span> curl <strong className="text-amber-300">--fail</strong> http://localhost:8000/health <strong className="text-rose-400">|| exit 1</strong>
            </div>
          </div>
        </div>

        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Docker Daemon Health Probe
            </span>
            <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
              current.exitCode === 0
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-rose-600 text-white animate-pulse'
            }`}>
              STATUS: ({current.dockerHealth})
            </span>
          </div>

          <div className="space-y-2.5 my-auto font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 font-sans text-[11px]">Container Process State:</span>
              <span className="text-white font-bold">{current.processStatus}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-400 font-sans text-[10px] uppercase font-bold mb-1">1. GET /health Response</div>
              <div className={current.exitCode === 0 ? 'text-emerald-300 font-bold' : 'text-rose-400 font-bold'}>
                {current.httpResponse}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-400 font-sans text-[10px] uppercase font-bold mb-1">2. Shell Exit Status</div>
              <div className="text-amber-300">{current.curlOutcome}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center font-sans">
              <div className={`p-2 rounded border ${current.exitCode === 0 ? 'bg-emerald-950/50 border-emerald-400 text-emerald-200 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                <div className="font-mono text-xs">Exit 0</div>
                <div className="text-[9px]">Healthy</div>
              </div>
              <div className={`p-2 rounded border ${current.exitCode === 1 ? 'bg-rose-950/50 border-rose-400 text-rose-200 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                <div className="font-mono text-xs">Exit 1</div>
                <div className="text-[9px]">Unhealthy</div>
              </div>
              <div className="p-2 rounded border bg-slate-900 border-slate-800 text-slate-500 opacity-60">
                <div className="font-mono text-xs">Exit 2</div>
                <div className="text-[9px]">Reserved (Do Not Use)</div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            {current.note}
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualHealthCheckTiming({ initialMode = 'slow_model_ok' }) {
  const [simMode, setSimMode] = useState(initialMode);

  const timelines = {
    slow_model_ok: {
      title: '1. Large Model Boot WITH --start-period=15s (Recommended)',
      config: '--interval=5s --timeout=3s --start-period=15s --retries=3',
      finalState: 'healthy',
      summary: 'Model takes 12s to load into RAM. Probes at 5s and 10s fail, but because they occur inside the 15s --start-period grace window, they DO NOT count toward --retries!',
      probes: [
        { time: 't=5s', phase: 'start-period', result: '503 (Loading Weights)', streak: 0, state: 'starting' },
        { time: 't=10s', phase: 'start-period', result: '503 (Loading Weights)', streak: 0, state: 'starting' },
        { time: 't=15s', phase: 'normal', result: '200 OK (Model Ready!)', streak: 0, state: 'healthy' },
        { time: 't=20s', phase: 'normal', result: '200 OK', streak: 0, state: 'healthy' },
      ],
    },
    no_start_period: {
      title: '2. Large Model Boot WITHOUT --start-period=0s (Premature Restart Trap!)',
      config: '--interval=5s --timeout=3s --start-period=0s --retries=2',
      finalState: 'unhealthy',
      summary: 'With --start-period=0s, the container is marked unhealthy at t=10s while still loading weights from disk! Orchestrators will kill and restart it in an infinite loop.',
      probes: [
        { time: 't=5s', phase: 'normal', result: '503 (Still Loading...)', streak: 1, state: 'starting' },
        { time: 't=10s', phase: 'normal', result: '503 (Still Loading...)', streak: 2, state: 'unhealthy' },
        { time: 't=12s', phase: 'normal', result: 'Killed by Orchestrator!', streak: 2, state: 'unhealthy' },
        { time: 't=15s', phase: 'normal', result: 'Restart Loop...', streak: 2, state: 'unhealthy' },
      ],
    },
    runtime_crash: {
      title: '3. Runtime Failure After 3 Consecutive Retries (--retries=3)',
      config: '--interval=10s --timeout=3s --start-period=5s --retries=3',
      finalState: 'unhealthy',
      summary: 'After running healthy, the inference worker deadlocks. Docker waits for 3 consecutive failed probes (FailingStreak = 3) before transitioning to (unhealthy).',
      probes: [
        { time: 't=10s', phase: 'normal', result: '200 OK', streak: 0, state: 'healthy' },
        { time: 't=20s', phase: 'normal', result: 'Timeout (>3s)', streak: 1, state: 'healthy' },
        { time: 't=30s', phase: 'normal', result: 'Timeout (>3s)', streak: 2, state: 'healthy' },
        { time: 't=40s', phase: 'normal', result: 'Timeout (>3s)', streak: 3, state: 'unhealthy' },
      ],
    },
  };

  const active = timelines[simMode];

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap gap-2 mb-4 bg-slate-950 p-2.5 pr-36 rounded-xl border border-slate-800 z-20">
        {Object.entries(timelines).map(([key, item]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSimMode(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              simMode === key ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {item.title.split('(')[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
          <div className="text-[10px] font-mono font-bold text-sky-400">--interval=DURATION</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Wait time between checks (Default: <code>30s</code>)</div>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
          <div className="text-[10px] font-mono font-bold text-amber-400">--timeout=DURATION</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Max time before probe fails (Default: <code>30s</code>)</div>
        </div>
        <div className="bg-slate-950 border border-teal-500/40 p-2.5 rounded-xl">
          <div className="text-[10px] font-mono font-bold text-teal-300">--start-period=DURATION</div>
          <div className="text-[10px] text-slate-300 mt-0.5">Startup grace period for heavy models (Default: <code>0s</code>)</div>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
          <div className="text-[10px] font-mono font-bold text-rose-400">--retries=N</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Consecutive failures for unhealthy (Default: <code>3</code>)</div>
        </div>
      </div>

      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between min-h-0">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div>
            <div className="text-xs font-bold text-white">{active.title}</div>
            <div className="text-[11px] font-mono text-teal-400 mt-0.5">HEALTHCHECK {active.config}</div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
            active.finalState === 'healthy' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-600 text-white'
          }`}>
            Final State: ({active.finalState})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 my-auto py-3">
          {active.probes.map((p) => (
            <div
              key={p.time}
              className={`p-3.5 rounded-xl border-2 flex flex-col justify-between transition-all ${
                p.state === 'healthy' && p.streak === 0
                  ? 'bg-emerald-950/30 border-emerald-500/60'
                  : p.state === 'unhealthy'
                    ? 'bg-rose-950/40 border-rose-500'
                    : 'bg-amber-950/30 border-amber-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white">{p.time}</span>
                <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                  p.phase === 'start-period'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {p.phase === 'start-period' ? 'Grace Period' : 'Active Check'}
                </span>
              </div>

              <div className="my-2.5 text-xs font-mono font-semibold text-slate-200">
                {p.result}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-800/80 pt-2">
                <span className="text-slate-400">FailingStreak: <strong>{p.streak}</strong></span>
                <span className={
                  p.state === 'healthy' ? 'text-emerald-400 font-bold' : p.state === 'unhealthy' ? 'text-rose-400 font-bold' : 'text-amber-300 font-bold'
                }>
                  ({p.state})
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
          {active.summary}
        </div>
      </div>
    </div>
  );
}

function VisualHealthStatusInspector({ initialState = 'healthy' }) {
  const [healthState, setHealthState] = useState(initialState);

  const stateData = {
    starting: {
      psStatus: 'Up 3 seconds (health: starting)',
      status: 'starting',
      failingStreak: 0,
      exitCode: 0,
      output: 'Initializing application and loading model.pkl...',
    },
    healthy: {
      psStatus: 'Up 14 seconds (healthy)',
      status: 'healthy',
      failingStreak: 0,
      exitCode: 0,
      output: '{\\"status\\":\\"ok\\"}',
    },
    unhealthy: {
      psStatus: 'Up 42 seconds (unhealthy)',
      status: 'unhealthy',
      failingStreak: 3,
      exitCode: 1,
      output: 'curl: (22) The requested URL returned error: 503 Service Unavailable',
    },
  };

  const current = stateData[healthState];

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800 z-20">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Simulate Container Health Lifecycle:
        </span>
        <div className="flex gap-2">
          {['starting', 'healthy', 'unhealthy'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setHealthState(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                healthState === st
                  ? st === 'healthy'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : st === 'unhealthy'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ({st})
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10px] flex flex-col justify-between">
          <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1.5">
            Dockerfile with HEALTHCHECK
          </div>

          <div className="space-y-1.5 my-auto text-slate-300 leading-snug">
            <div><span className="text-pink-400">FROM</span> python:3.9-slim</div>
            <div><span className="text-pink-400">WORKDIR</span> /app</div>
            <div className="p-1.5 rounded bg-amber-950/30 border border-amber-500/40 text-amber-200">
              <span className="text-slate-400"># Crucial: slim images don&apos;t include curl!</span><br />
              <span className="text-pink-400">RUN</span> apt-get update &amp;&amp; apt-get install -y curl \<br />
              &nbsp;&nbsp;--no-install-recommends &amp;&amp; rm -rf /var/lib/apt/lists/*
            </div>
            <div><span className="text-pink-400">COPY</span> requirements.txt .</div>
            <div><span className="text-pink-400">RUN</span> pip install --no-cache-dir -r requirements.txt</div>
            <div><span className="text-pink-400">COPY</span> ./app /app</div>
            <div><span className="text-pink-400">COPY</span> ./model.pkl /app/model.pkl</div>
            <div><span className="text-pink-400">EXPOSE</span> 8000</div>
            <div className="p-1.5 rounded bg-teal-950/40 border border-teal-500/50 text-teal-200">
              <span className="text-pink-400">HEALTHCHECK</span> --interval=10s --timeout=3s \<br />
              &nbsp;&nbsp;--start-period=5s --retries=3 \<br />
              &nbsp;&nbsp;<span className="text-pink-400">CMD</span> curl --fail http://localhost:8000/health || exit 1
            </div>
            <div><span className="text-pink-400">CMD</span> [&quot;uvicorn&quot;, &quot;main:app&quot;, &quot;--host&quot;, &quot;0.0.0.0&quot;, &quot;--port&quot;, &quot;8000&quot;]</div>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col gap-3 min-h-0">
          <div className="bg-black border border-slate-800 rounded-xl p-3.5 font-mono text-[10.5px]">
            <div className="text-emerald-400 font-bold mb-1.5">$ docker ps</div>
            <div className="grid grid-cols-12 text-[9px] text-slate-500 border-b border-slate-900 pb-1">
              <span className="col-span-2">CONTAINER ID</span>
              <span className="col-span-3">IMAGE</span>
              <span className="col-span-4">STATUS</span>
              <span className="col-span-3">PORTS</span>
            </div>
            <div className="grid grid-cols-12 items-center pt-1.5 text-slate-300">
              <span className="col-span-2 text-sky-300">a1b2c3d4e5f6</span>
              <span className="col-span-3 truncate">my-inference:latest</span>
              <span className={`col-span-4 font-bold ${
                healthState === 'healthy' ? 'text-emerald-400' : healthState === 'unhealthy' ? 'text-rose-400' : 'text-amber-300'
              }`}>
                {current.psStatus}
              </span>
              <span className="col-span-3 text-[9.5px]">0.0.0.0:8000-&gt;8000/tcp</span>
            </div>
          </div>

          <div className="flex-1 bg-black border border-slate-800 rounded-xl p-3.5 font-mono text-[10px] flex flex-col justify-between overflow-y-auto">
            <div className="text-emerald-400 font-bold">
              $ docker inspect --format=&#39;&#123;&#123;json .State.Health&#125;&#125;&#39; a1b2c3d4e5f6
            </div>

            <pre className="text-slate-300 my-auto leading-relaxed overflow-x-auto">
{`{
  "Status": "${current.status}",
  "FailingStreak": ${current.failingStreak},
  "Log": [
    {
      "Start": "2026-10-19T13:45:00.123Z",
      "End": "2026-10-19T13:45:00.456Z",
      "ExitCode": ${current.exitCode},
      "Output": "${current.output}"
    }
  ]
}`}
            </pre>

            <div className="text-[10px] font-sans text-slate-400 border-t border-slate-900 pt-1.5">
              <code>.State.Health</code> stores the last 5 health check logs, exit codes, and the exact stdout/stderr output for debugging!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualHandsOnFlaskCode({ initialTab = 'predict' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-950 p-2.5 pr-36 rounded-xl border border-slate-800 z-20">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('predict')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'predict' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            1. app.py: POST /predict Route
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('health')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'health' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            2. app.py: GET /health &amp; Startup
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('requirements')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'requirements' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            3. Project Tree &amp; requirements.txt
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10px] flex flex-col justify-between overflow-y-auto">
          {activeTab === 'predict' && (
            <pre className="text-slate-300 leading-relaxed my-auto overflow-x-auto">
{`@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    try:
        data = request.get_json(force=True)
        if 'features' not in data:
            return jsonify({'error': 'Missing "features" key'}), 400

        features = np.array(data['features'])
        # Reshape 1D array [5.1, 3.5, 1.4, 0.2] -> 2D [[5.1, 3.5, 1.4, 0.2]]
        if features.ndim == 1:
            features = features.reshape(1, -1)

        prediction = model.predict(features)
        response = {'prediction': prediction.tolist()}

        if hasattr(model, "predict_proba"):
            response['probabilities'] = model.predict_proba(features).tolist()
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500`}
            </pre>
          )}

          {activeTab === 'health' && (
            <pre className="text-slate-300 leading-relaxed my-auto overflow-x-auto">
{`# Load pre-trained model at startup
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
try:
    model = joblib.load(model_path)
except Exception:
    model = None

@app.route('/health', methods=['GET'])
def health_check():
    if model is not None:
        return jsonify({'status': 'ok'}), 200
    else:
        return jsonify({
            'status': 'error',
            'reason': 'Model not loaded'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)`}
            </pre>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-4 my-auto">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-teal-400 font-bold mb-1"># Project Directory Structure</div>
                <div className="text-slate-200 space-y-1">
                  <div>.</div>
                  <div>├── app.py &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500"># Flask application code</span></div>
                  <div>├── model.pkl &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500"># Pre-trained Iris model file</span></div>
                  <div>├── requirements.txt <span className="text-slate-500"># Python dependencies</span></div>
                  <div>└── Dockerfile &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500"># Container build instructions</span></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black border border-slate-800">
                <div className="text-amber-400 font-bold mb-1"># requirements.txt</div>
                <div className="text-slate-200">
                  flask<br />
                  scikit-learn<br />
                  numpy<br />
                  joblib<br />
                  gunicorn &nbsp;<span className="text-emerald-400"># WSGI server for production</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-2">
            Inside /predict: Data Transformation
          </div>

          <div className="space-y-3 my-auto font-mono text-[10.5px]">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[9px] font-sans uppercase font-bold text-sky-400">1. Incoming JSON Payload (1 Sample)</div>
              <div className="text-slate-200 mt-1">{'{"features": [5.1, 3.5, 1.4, 0.2]}'}</div>
              <div className="text-[9px] text-slate-400 mt-0.5">np.array shape: (4,) — 1D Array</div>
            </div>

            <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/40">
              <div className="text-[9px] font-sans uppercase font-bold text-indigo-300">
                2. Automatic 2D Reshape (features.ndim == 1)
              </div>
              <div className="text-indigo-200 mt-1">features.reshape(1, -1) → [[5.1, 3.5, 1.4, 0.2]]</div>
              <div className="text-[9px] text-slate-400 mt-0.5">Scikit-Learn expects 2D (n_samples, n_features)</div>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40">
              <div className="text-[9px] font-sans uppercase font-bold text-emerald-300">
                3. Prediction + Probabilities Response
              </div>
              <pre className="text-emerald-200 mt-1 text-[10px]">
{`{
  "prediction": [0],
  "probabilities": [[0.98, 0.01, 0.01]]
}`}
              </pre>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            Converting NumPy arrays via <code>.tolist()</code> is essential because standard <code>jsonify()</code> cannot serialize raw NumPy types directly!
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualHandsOnBasicBuildTest({ initialEndpoint = 'predict' }) {
  const [endpointTest, setEndpointTest] = useState(initialEndpoint);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 pr-36 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 z-20 font-mono text-[11px]">
        <div>
          <span className="text-emerald-400">$</span> docker build -t <strong className="text-teal-300">ml-inference-api:basic</strong> .
        </div>
        <div>
          <span className="text-emerald-400">$</span> docker run -d <strong className="text-sky-400">-p 5001:5000</strong> --name my_api ml-inference-api:basic
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10px] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-white font-bold">Dockerfile (Basic Single-Stage)</span>
            <span className="text-[9px] font-sans bg-slate-800 text-slate-300 px-2 py-0.5 rounded">7 Steps</span>
          </div>

          <div className="space-y-1.5 my-auto text-slate-300 leading-snug">
            <div><span className="text-slate-500"># 1 &amp; 2. Base Image &amp; Working Directory</span><br /><span className="text-pink-400">FROM</span> python:3.9-slim<br /><span className="text-pink-400">WORKDIR</span> /app</div>
            <div className="p-1.5 rounded bg-emerald-950/20 border border-emerald-500/30">
              <span className="text-slate-400"># 3 &amp; 4. Cached Dependencies Layer</span><br />
              <span className="text-pink-400">COPY</span> requirements.txt .<br />
              <span className="text-pink-400">RUN</span> pip install --no-cache-dir --upgrade pip &amp;&amp; \<br />
              &nbsp;&nbsp;&nbsp;&nbsp;pip install --no-cache-dir -r requirements.txt
            </div>
            <div><span className="text-slate-500"># 5. Copy app.py and model.pkl</span><br /><span className="text-pink-400">COPY</span> . .</div>
            <div><span className="text-slate-500"># 6. Document Container Port</span><br /><span className="text-pink-400">EXPOSE</span> 5000</div>
            <div className="p-1.5 rounded bg-sky-950/30 border border-sky-500/40 text-sky-200">
              <span className="text-slate-400"># 7. Run Production Gunicorn WSGI Server</span><br />
              <span className="text-pink-400">CMD</span> [&quot;gunicorn&quot;, &quot;--bind&quot;, &quot;0.0.0.0:5000&quot;, &quot;app:app&quot;]
            </div>
          </div>
        </div>

        <div className="md:col-span-6 bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2 gap-2">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">
              Test Running Container (Host :5001 → Container :5000)
            </span>
            <div className="flex gap-1.5 font-sans">
              <button
                type="button"
                onClick={() => setEndpointTest('predict')}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                  endpointTest === 'predict' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                POST /predict
              </button>
              <button
                type="button"
                onClick={() => setEndpointTest('health')}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                  endpointTest === 'health' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                GET /health
              </button>
            </div>
          </div>

          {endpointTest === 'predict' ? (
            <div className="my-auto space-y-3">
              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-[10.5px] leading-relaxed overflow-x-auto">
{`$ curl -X POST http://localhost:5001/predict \\
  -H "Content-Type: application/json" \\
  -d '{"features": [5.1, 3.5, 1.4, 0.2]}'`}
              </pre>

              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/50 text-emerald-300 text-[11px]">
                <div className="text-[9px] font-sans uppercase font-bold text-emerald-400 mb-1">HTTP 200 OK (Iris Setosa Prediction)</div>
                <code>{'{"prediction": [0], "probabilities": [[0.98, 0.01, 0.01]]}'}</code>
              </div>
            </div>
          ) : (
            <div className="my-auto space-y-3">
              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-[11px] leading-relaxed">
{'$ curl http://localhost:5001/health'}
              </pre>

              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/50 text-emerald-300 text-[11px]">
                <div className="text-[9px] font-sans uppercase font-bold text-emerald-400 mb-1">HTTP 200 OK (Model Verified in RAM)</div>
                <code>{'{"status": "ok"}'}</code>
              </div>
            </div>
          )}

          <div className="text-[10px] font-sans text-slate-400 border-t border-slate-900 pt-2">
            Notice how <code>-p 5001:5000</code> maps host port <strong>5001</strong> to container port <strong>5000</strong> where Gunicorn is listening!
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualHandsOnMultiStageOptimize() {
  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="bg-black border border-slate-800 rounded-xl p-3 pr-36 mb-4 font-mono text-[10.5px] z-20">
        <div className="text-emerald-400 font-bold mb-1">$ docker images ml-inference-api</div>
        <div className="grid grid-cols-12 text-[9px] text-slate-500 uppercase border-b border-slate-900 pb-1">
          <span className="col-span-4">REPOSITORY</span>
          <span className="col-span-3">TAG</span>
          <span className="col-span-2">IMAGE ID</span>
          <span className="col-span-3 text-right">SIZE</span>
        </div>
        <div className="grid grid-cols-12 items-center pt-1 text-emerald-300 font-bold">
          <span className="col-span-4">ml-inference-api</span>
          <span className="col-span-3">optimized</span>
          <span className="col-span-2 text-slate-400">9f8e7d6c5b4a</span>
          <span className="col-span-3 text-right">218 MB (Lean Runtime ✓)</span>
        </div>
        <div className="grid grid-cols-12 items-center pt-1 text-rose-300/80">
          <span className="col-span-4">ml-inference-api</span>
          <span className="col-span-3">basic</span>
          <span className="col-span-2 text-slate-400">3b2a1c4d5e6f</span>
          <span className="col-span-3 text-right">465 MB (Unoptimized)</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10px] flex flex-col justify-between overflow-y-auto">
          <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1">
            Optimized Multi-Stage Dockerfile (--prefix=&quot;/install&quot;)
          </div>

          <div className="space-y-1.5 my-auto text-slate-300 leading-snug">
            <div className="text-sky-400 font-bold"># ---- Build Stage ----</div>
            <div><span className="text-pink-400">FROM</span> python:3.9 <span className="text-sky-300 font-bold">as builder</span></div>
            <div><span className="text-pink-400">WORKDIR</span> /build</div>
            <div><span className="text-pink-400">COPY</span> requirements.txt .</div>
            <div className="p-1.5 rounded bg-amber-950/40 border border-amber-500/40 text-amber-200">
              <span className="text-slate-400"># Install packages into isolated /install directory</span><br />
              <span className="text-pink-400">RUN</span> pip install --no-cache-dir --upgrade pip &amp;&amp; \<br />
              &nbsp;&nbsp;&nbsp;&nbsp;pip install --no-cache-dir <strong className="text-white underline">--prefix=&quot;/install&quot;</strong> -r requirements.txt
            </div>

            <div className="text-emerald-400 font-bold pt-1"># ---- Runtime Stage ----</div>
            <div><span className="text-pink-400">FROM</span> python:3.9-slim</div>
            <div><span className="text-pink-400">WORKDIR</span> /app</div>
            <div className="p-1.5 rounded bg-teal-950/40 border border-teal-500/50 text-teal-200 font-bold">
              <span className="text-pink-400">COPY</span> --from=builder /install /usr/local
            </div>
            <div><span className="text-pink-400">COPY</span> app.py .</div>
            <div><span className="text-pink-400">COPY</span> model.pkl .</div>
            <div><span className="text-pink-400">EXPOSE</span> 5000</div>
            <div><span className="text-pink-400">CMD</span> [&quot;gunicorn&quot;, &quot;--bind&quot;, &quot;0.0.0.0:5000&quot;, &quot;app:app&quot;]</div>
          </div>
        </div>

        <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
              Alternative to /opt/venv
            </span>
            <h4 className="text-sm font-bold text-white mt-2">
              How <code>--prefix=&quot;/install&quot;</code> Works
            </h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Instead of creating a virtual environment, <code>pip install --prefix=&quot;/install&quot;</code> places all installed libraries and scripts (like <code>gunicorn</code>) into <code>/install</code>. Copying <code>/install</code> directly into <code>/usr/local</code> in Stage 2 puts everything onto the default system Python path automatically!
            </p>
          </div>

          <div className="bg-black p-3 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-300 space-y-1.5 my-auto">
            <div className="text-slate-500"># 1. Build optimized image:</div>
            <div><span className="text-emerald-400">$</span> docker build -t ml-inference-api:optimized .</div>
            <div className="text-slate-500 pt-1"># 2. Replace basic container on port 5001:</div>
            <div><span className="text-emerald-400">$</span> docker stop my_api &amp;&amp; docker rm my_api</div>
            <div className="text-teal-300 font-bold">
              <span className="text-emerald-400">$</span> docker run -d -p 5001:5000 \<br />
              &nbsp;&nbsp;--name my_api_optimized ml-inference-api:optimized
            </div>
          </div>

          <div className="text-[10px] text-emerald-300 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/30 text-center font-semibold">
            ✓ Same API endpoints • Half the image size • Zero compilers in prod
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualProbe() {
  return <VisualHealthCheckFundamentals initialState="missing_model" />;
}
export function VisualExit() {
  return <VisualHealthCheckFundamentals initialState="healthy" />;
}
export function VisualCurlHealth() {
  return <VisualHealthCheckFundamentals initialState="crashed" />;
}
export function VisualModelHealth() {
  return <VisualHealthCheckFundamentals initialState="missing_model" />;
}
export function VisualTiming() {
  return <VisualHealthCheckTiming initialMode="slow_model_ok" />;
}
export function VisualHcDockerfile() {
  return <VisualHealthStatusInspector initialState="healthy" />;
}
export function VisualPs() {
  return <VisualHealthStatusInspector initialState="healthy" />;
}
export function VisualTree() {
  return <VisualHandsOnFlaskCode initialTab="requirements" />;
}
export function VisualRoutes() {
  return <VisualHandsOnFlaskCode initialTab="predict" />;
}
export function VisualDeps() {
  return <VisualHandsOnFlaskCode initialTab="requirements" />;
}
export function VisualLayers() {
  return <VisualHandsOnBasicBuildTest />;
}
export function VisualBuild() {
  return <VisualHandsOnBasicBuildTest />;
}
export function VisualRun() {
  return <VisualHandsOnBasicBuildTest />;
}
export function VisualTest() {
  return <VisualHandsOnBasicBuildTest initialEndpoint="health" />;
}
export function VisualPrefix() {
  return <VisualHandsOnMultiStageOptimize />;
}
export function VisualCompare() {
  return <VisualHandsOnMultiStageOptimize />;
}
