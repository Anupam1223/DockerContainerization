import { useEffect, useRef, useState } from 'react';

const IconDatabase = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);
const IconPlay = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

function VisualApiDbStack({ initialView = 'diagram' }) {
  const [flowStep, setFlowStep] = useState(0);
  const [viewMode, setViewMode] = useState(initialView);
  const timers = useRef([]);

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
  }, []);

  const triggerRequest = () => {
    timers.current.forEach(clearTimeout);
    setFlowStep(1);
    timers.current = [
      setTimeout(() => setFlowStep(2), 900),
      setTimeout(() => setFlowStep(3), 1800),
    ];
  };

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-5 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800 z-20">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode('diagram')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'diagram' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            1. Interactive Architecture Diagram
          </button>
          <button
            type="button"
            onClick={() => setViewMode('yaml')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'yaml' ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            2. Inspect Full `docker-compose.yml`
          </button>
        </div>

        {viewMode === 'diagram' && (
          <button
            type="button"
            onClick={triggerRequest}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <IconPlay className="w-3.5 h-3.5" /> Simulate User Prediction Request
          </button>
        )}
      </div>

      {viewMode === 'diagram' ? (
        <div className="flex-1 flex flex-col justify-between bg-slate-950 border border-slate-800 rounded-2xl p-4 relative min-h-0">
          <div className="border-2 border-slate-700 bg-slate-900/60 rounded-xl p-4 flex-1 flex flex-col justify-between relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Docker Compose Stack (`api` + `db`)
              </span>
              <div className="px-3 py-1 rounded-full border border-dashed border-sky-400 bg-sky-950/40 text-[10px] font-mono text-sky-300 font-bold">
                Docker Network: app-net (bridge)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-11 gap-2 items-center my-auto py-3">
              <div className={`md:col-span-4 p-3.5 rounded-xl border-2 text-center transition-all duration-300 ${
                flowStep === 1 || flowStep === 3
                  ? 'bg-sky-950/50 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)] scale-[1.02]'
                  : 'bg-slate-950 border-slate-700'
              }`}>
                <div className="text-xs font-bold text-white">API Service (`api`)</div>
                <div className="text-[10px] font-mono text-sky-300 mt-0.5">(Flask/FastAPI + Model)</div>
                <div className="mt-2 space-y-1 text-[9.5px] font-mono text-left bg-slate-900 p-2 rounded border border-slate-800 text-slate-300">
                  <div>• build: <code>./api</code></div>
                  <div>• ports: <code>&quot;5000:5000&quot;</code></div>
                  <div>• bind: <code>./api:/app</code> &amp; <code>./models:/app/models</code></div>
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] font-mono text-teal-300 font-bold mb-0.5">
                  DB queries (via app-net)
                </span>
                <span className={`font-mono text-sm font-bold ${
                  flowStep === 2 ? 'text-teal-400 animate-pulse scale-125' : 'text-slate-600'
                }`}>
                  ──────►
                </span>
                <span className="text-[8.5px] font-mono text-slate-400 mt-0.5">
                  @db:5432/mydatabase
                </span>
              </div>

              <div className={`md:col-span-3 p-3.5 rounded-xl border-2 text-center transition-all duration-300 ${
                flowStep === 2 || flowStep === 3
                  ? 'bg-emerald-950/50 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]'
                  : 'bg-slate-950 border-slate-700'
              }`}>
                <div className="text-xs font-bold text-white">Database Service (`db`)</div>
                <div className="text-[10px] font-mono text-emerald-300 mt-0.5">(PostgreSQL 14)</div>
                <div className="mt-2 text-[9.5px] font-mono bg-slate-900 p-1.5 rounded border border-slate-800 text-slate-300">
                  pg_isready healthcheck
                </div>
              </div>

              <div className={`md:col-span-2 p-3 rounded-xl border-2 text-center transition-all duration-300 ${
                flowStep === 3
                  ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                  : 'bg-slate-950 border-slate-700'
              }`}>
                <IconDatabase className="w-5 h-5 mx-auto text-amber-300 mb-1" />
                <div className="text-[11px] font-bold text-amber-200">DB Data Volume</div>
                <div className="text-[9px] font-mono text-amber-300/80 mt-0.5">postgres_data</div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="px-3.5 py-1.5 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs shadow">
                  User Request (Host :5000)
                </div>
                <div className="text-xs font-mono text-slate-300">
                  {flowStep === 0 && 'Click "Simulate User Prediction Request" to trace the stack.'}
                  {flowStep === 1 && '1. HTTP POST /predict hits API container on port 5000...'}
                  {flowStep === 2 && '2. API queries PostgreSQL over app-net using hostname "db:5432"...'}
                  {flowStep === 3 && '3. Prediction logged to postgres_data volume & JSON response returned!'}
                </div>
              </div>
              <span className="text-[10px] font-mono text-teal-400 font-bold">
                depends_on: db
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
          <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10px] overflow-y-auto">
            <pre className="text-slate-300 leading-snug">
{`version: '3.8'
services:
  api:
    build: ./api
    ports:
      - "5000:5000"
    volumes:
      - ./api:/app          # Live code reload in dev
      - ./models:/app/models
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/mydatabase
    depends_on:
      - db
    networks:
      - app-net

  db:
    image: postgres:14-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=mydatabase
    networks:
      - app-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d mydatabase"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
networks:
  app-net:
    driver: bridge`}
            </pre>
          </div>

          <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between text-xs">
            <div className="font-bold text-teal-400 uppercase tracking-wider border-b border-slate-800 pb-1.5">
              Key Architectural Takeaways
            </div>
            <div className="space-y-2.5 my-auto text-[11px] text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-sky-400 block">Hybrid Storage (Bind + Volume):</strong>
                Uses a bind mount (<code>./api:/app</code>) for live code edits and a named volume (<code>postgres_data</code>) for safe database persistence.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-emerald-400 block">Connection String DNS:</strong>
                <code>postgresql://user:password@db:5432/mydatabase</code> uses the service name <code>db</code> as the hostname on <code>app-net</code>.
              </div>
              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/40 text-amber-200">
                <strong className="text-amber-300 block">Why Add `pg_isready` Healthcheck?</strong>
                Standard <code>depends_on</code> only waits for the container to start, not for PostgreSQL to finish initializing!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VisualMlflowTrackingStack({ initialNode = 'trainer' }) {
  const [activeNode, setActiveNode] = useState(initialNode);

  const nodeDetails = {
    trainer: {
      title: '1. Training Service (`trainer`)',
      yaml: `trainer:
  build: ./training
  command: python train.py --data /data/input.csv --model-output /artifacts
  volumes:
    - ./training/src:/app
    - ./data:/data
    - mlflow_artifacts:/artifacts
  environment:
    - MLFLOW_TRACKING_URI=http://mlflow:5001
  depends_on:
    mlflow:
      condition: service_started
    db:
      condition: service_healthy`,
      desc: 'Runs train.py, logs metrics/params to http://mlflow:5001 over ml-net, and writes model artifacts to the shared mlflow_artifacts volume.',
    },
    mlflow: {
      title: '2. MLflow Tracking Server (`mlflow`)',
      yaml: `mlflow:
  image: ghcr.io/mlflow/mlflow:v2.10.0
  command: >
    mlflow server
    --backend-store-uri postgresql://mlflow_user:mlflow_pass@db:5432/mlflow_db
    --default-artifact-root /mlflow_artifacts
    --host 0.0.0.0 --port 5001
  ports:
    - "5001:5001" # Expose UI to Developer
  volumes:
    - mlflow_artifacts:/mlflow_artifacts
  depends_on:
    db:
      condition: service_healthy`,
      desc: 'Exposes the MLflow UI on port 5001, stores experiment metadata in PostgreSQL (db), and serves model files from mlflow_artifacts.',
    },
    db: {
      title: '3. Backend Store Database (`db` + `service_healthy`)',
      yaml: `db:
  image: postgres:14-alpine
  volumes:
    - mlflow_db_data:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U mlflow_user -d mlflow_db"]
    interval: 10s
    timeout: 5s
    retries: 5`,
      desc: 'Essential! Because db defines a pg_isready healthcheck, both trainer and mlflow can use condition: service_healthy to wait until Postgres is truly ready to accept connections!',
    },
    artifacts: {
      title: '4. Shared Artifact Volume (`mlflow_artifacts`)',
      yaml: `volumes:
  mlflow_db_data:
  mlflow_artifacts: # Shared between trainer & mlflow

networks:
  ml-net:
    driver: bridge`,
      desc: 'Mounted by BOTH trainer (at /artifacts to write models) and mlflow (at /mlflow_artifacts to read/serve models in the UI).',
    },
  };

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-5 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap gap-2 mb-3 bg-slate-950 p-2.5 pr-36 rounded-xl border border-slate-800 z-20">
        {Object.entries(nodeDetails).map(([key, item]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveNode(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeNode === key ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              MLflow Experiment Tracking Stack (Click any block)
            </span>
            <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-500/30">
              Network: ml-net
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-auto py-2">
            <div
              onClick={() => setActiveNode('trainer')}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                activeNode === 'trainer'
                  ? 'bg-sky-950/50 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                  : 'bg-slate-900 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="text-xs font-bold text-white">Training Service (`trainer`)</div>
              <div className="text-[10px] font-mono text-sky-300">MLFLOW_TRACKING_URI=http://mlflow:5001</div>
              <div className="text-[9.5px] text-slate-300 mt-1.5">
                • Logs metrics/params → <code>mlflow</code><br />
                • Saves model files → <code>mlflow_artifacts</code>
              </div>
            </div>

            <div
              onClick={() => setActiveNode('artifacts')}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                activeNode === 'artifacts'
                  ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                  : 'bg-slate-900 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                <IconDatabase className="w-4 h-4 text-amber-400" /> MLflow Artifacts Volume
              </div>
              <div className="text-[10px] font-mono text-amber-300">mlflow_artifacts (Shared)</div>
              <div className="text-[9.5px] text-slate-300 mt-1.5">
                • Written by <code>trainer</code> (/artifacts)<br />
                • Served by <code>mlflow</code> (/mlflow_artifacts)
              </div>
            </div>

            <div
              onClick={() => setActiveNode('mlflow')}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                activeNode === 'mlflow'
                  ? 'bg-indigo-950/50 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                  : 'bg-slate-900 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="text-xs font-bold text-white">MLflow Server (`mlflow`)</div>
              <div className="text-[10px] font-mono text-indigo-300">Port 5001:5001 (Web UI &amp; API)</div>
              <div className="text-[9.5px] text-slate-300 mt-1.5">
                • Stores run metadata → <code>db</code><br />
                • Developer views UI at <code>localhost:5001</code>
              </div>
            </div>

            <div
              onClick={() => setActiveNode('db')}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                activeNode === 'db'
                  ? 'bg-emerald-950/50 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-900 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="text-xs font-bold text-white">Backend DB (`db` + Volume)</div>
              <div className="text-[10px] font-mono text-emerald-300">condition: service_healthy ✓</div>
              <div className="text-[9.5px] text-slate-300 mt-1.5">
                • Persists metadata in <code>mlflow_db_data</code><br />
                • Verified ready via <code>pg_isready</code>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            {nodeDetails[activeNode].desc}
          </div>
        </div>

        <div className="md:col-span-5 bg-black border border-slate-800 rounded-xl p-4 font-mono text-[10px] flex flex-col justify-between overflow-y-auto">
          <div className="text-teal-400 font-sans font-bold text-xs border-b border-slate-900 pb-1.5">
            {nodeDetails[activeNode].title}
          </div>

          <pre className="text-slate-200 leading-relaxed my-auto overflow-x-auto">
            {nodeDetails[activeNode].yaml}
          </pre>

          <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/40 font-sans text-[10px] text-emerald-200">
            <strong>Pro Tip:</strong> Using <code>condition: service_healthy</code> prevents <code>mlflow</code> and <code>trainer</code> from crashing on startup while PostgreSQL initializes its tables!
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualHandsOnProjectCode({ initialTab = 'predict' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-950 p-2.5 pr-36 rounded-xl border border-slate-800 z-20">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('tree')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'tree' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            1. Project Setup &amp; `requirements.txt`
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('predict')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'predict' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            2. `app/main.py`: Redis Cache Lookup (`/predict`)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('health')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'health' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            3. `app/main.py`: `cache.ping()` (`/health`)
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10px] flex flex-col justify-between overflow-y-auto">
          {activeTab === 'tree' && (
            <div className="space-y-4 my-auto">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-teal-400 font-bold mb-1.5"># Directory Structure: compose_ml_app/</div>
                <div className="text-slate-200 space-y-1">
                  <div>compose_ml_app/</div>
                  <div>├── app/</div>
                  <div>│   ├── __init__.py &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500"># Makes app/ a Python package</span></div>
                  <div>│   ├── main.py &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500"># Flask API + Redis client</span></div>
                  <div>│   └── requirements.txt <span className="text-slate-500"># Pinned dependencies</span></div>
                  <div>├── Dockerfile &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500"># Builds Inference API image</span></div>
                  <div>└── docker-compose.yml &nbsp;&nbsp;<span className="text-slate-500"># Defines api + redis stack</span></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black border border-slate-800">
                <div className="text-amber-300 font-bold mb-1"># app/requirements.txt (Pinned for Reproducibility)</div>
                <div className="text-emerald-300">
                  Flask==2.3.3<br />
                  redis==5.0.1
                </div>
              </div>
            </div>
          )}

          {activeTab === 'predict' && (
            <pre className="text-slate-300 leading-relaxed my-auto overflow-x-auto">
{`# Connect using service name 'redis' from docker-compose.yml
redis_host = os.environ.get('REDIS_HOST', 'localhost')
redis_port = int(os.environ.get('REDIS_PORT', 6379))
cache = redis.StrictRedis(host=redis_host, port=redis_port, db=0, decode_responses=True)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    input_data = str(data['input']) # Use input as cache key

    # 1. Check Redis cache first
    cached_result = cache.get(input_data)
    if cached_result:
        return jsonify({"prediction": cached_result, "source": "cache"})

    # 2. Cache miss: compute prediction & store with 1-hour TTL (3600s)
    time.sleep(0.5) # Simulate model.predict() latency
    prediction_result = f"prediction_for_{input_data}"
    cache.setex(input_data, 3600, prediction_result)
    return jsonify({"prediction": prediction_result, "source": "computation"})`}
            </pre>
          )}

          {activeTab === 'health' && (
            <pre className="text-slate-300 leading-relaxed my-auto overflow-x-auto">
{`@app.route('/health', methods=['GET'])
def health_check():
    try:
        # Verify live connection to Redis container
        cache.ping()
        return jsonify({
            "status": "ok",
            "cache_connected": True
        }), 200
    except redis.exceptions.ConnectionError:
        return jsonify({
            "status": "degraded",
            "cache_connected": False
        }), 503

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)`}
            </pre>
          )}
        </div>

        <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-2">
            How the Prediction Cache Works
          </div>

          <div className="space-y-3 my-auto text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-sky-500/40">
              <div className="font-mono font-bold text-sky-300">1. Lookup: cache.get(input_data)</div>
              <p className="text-[11px] text-slate-300 mt-1">
                Before running expensive model inference, Flask checks if the feature vector key already exists in Redis.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
              <div className="font-mono font-bold text-emerald-300">2a. Cache Hit → source: &quot;cache&quot;</div>
              <p className="text-[11px] text-slate-300 mt-1">
                Returns the cached prediction immediately without invoking the ML model!
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40">
              <div className="font-mono font-bold text-amber-300">2b. Cache Miss → cache.setex(..., 3600, ...)</div>
              <p className="text-[11px] text-slate-300 mt-1">
                Runs model inference (<code>0.5s</code>), saves the result in Redis with a 1-hour expiration (<code>3600s</code>), and returns <code>source: &quot;computation&quot;</code>.
              </p>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            Defaulting <code>REDIS_HOST</code> to <code>&apos;localhost&apos;</code> lets you test <code>main.py</code> locally outside Docker, while Compose overrides it to <code>&apos;redis&apos;</code>!
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualHandsOnComposeFile({ initialPart = 'api' }) {
  const [selectedPart, setSelectedPart] = useState(initialPart);

  const explanations = {
    dockerfile: {
      title: 'Project Root `Dockerfile` (For the `api` Service)',
      detail: 'Installs Flask==2.3.3 and redis==5.0.1, copies ./app into /app, sets default ENV REDIS_HOST=redis and REDIS_PORT=6379, exposes port 5000, and runs python main.py.',
    },
    api: {
      title: 'Service 1: `api` (Inference API Container)',
      detail: 'Builds from the current directory (build: .), maps host port 5001 to container port 5000 ("5001:5000"), bind-mounts ./app:/app for live code changes without rebuilding, and connects to ml_app_network.',
    },
    redis: {
      title: 'Service 2: `redis` (Redis Cache Container)',
      detail: 'Pulls lightweight official "redis:6.2-alpine" from Docker Hub, mounts named volume redis_data:/data so cached predictions survive container restarts, and attaches to ml_app_network.',
    },
    net_vol: {
      title: 'Top-Level `volumes:` and `networks:`',
      detail: 'Declares the persistent redis_data volume and creates a dedicated custom bridge network (ml_app_network) providing isolation and automatic DNS resolution between api and redis.',
    },
  };

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap gap-2 mb-4 bg-slate-950 p-2.5 pr-36 rounded-xl border border-slate-800 z-20">
        {[
          { id: 'dockerfile', label: '1. API Dockerfile' },
          { id: 'api', label: '2. Compose: api Service' },
          { id: 'redis', label: '3. Compose: redis Service' },
          { id: 'net_vol', label: '4. Volumes & Custom Network' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedPart(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedPart === tab.id ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div
          onClick={() => setSelectedPart('dockerfile')}
          className={`md:col-span-5 rounded-xl p-4 font-mono text-[10px] flex flex-col justify-between cursor-pointer border-2 transition-all ${
            selectedPart === 'dockerfile' ? 'bg-slate-950 border-teal-400 shadow-lg' : 'bg-slate-950/70 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-white font-bold">compose_ml_app/Dockerfile</span>
            <span className="text-[9px] font-sans bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded">build: .</span>
          </div>

          <pre className="text-slate-300 leading-relaxed my-auto overflow-x-auto">
{`FROM python:3.9-slim
WORKDIR /app

COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app /app
EXPOSE 5000

ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

CMD ["python", "main.py"]`}
          </pre>

          <div className="text-[10px] font-sans text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
            Built automatically by Compose when you run <code>docker compose up --build</code>.
          </div>
        </div>

        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10px] flex flex-col justify-between overflow-y-auto">
          <div className="text-white font-bold border-b border-slate-800 pb-1.5">
            compose_ml_app/docker-compose.yml
          </div>

          <div className="space-y-1.5 my-auto leading-snug">
            <div className="text-slate-400">version: &apos;3.8&apos;</div>
            <div className="text-pink-400 font-bold">services:</div>

            <div
              onClick={() => setSelectedPart('api')}
              className={`p-1.5 rounded border cursor-pointer transition-all ${
                selectedPart === 'api' ? 'bg-sky-950/50 border-sky-400 text-white' : 'border-transparent text-slate-300 hover:bg-slate-900'
              }`}
            >
              <div className="text-sky-300 font-bold">&nbsp;&nbsp;api:</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;build: .</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;ports: [&quot;5001:5000&quot;]</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;environment:</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- REDIS_HOST=redis</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- REDIS_PORT=6379</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;volumes: [&quot;./app:/app&quot;]</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;depends_on: [redis]</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;networks: [ml_app_network]</div>
            </div>

            <div
              onClick={() => setSelectedPart('redis')}
              className={`p-1.5 rounded border cursor-pointer transition-all ${
                selectedPart === 'redis' ? 'bg-emerald-950/50 border-emerald-400 text-white' : 'border-transparent text-slate-300 hover:bg-slate-900'
              }`}
            >
              <div className="text-emerald-300 font-bold">&nbsp;&nbsp;redis:</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;image: &quot;redis:6.2-alpine&quot;</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;ports: [&quot;6379:6379&quot;]</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;volumes: [&quot;redis_data:/data&quot;]</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;networks: [ml_app_network]</div>
            </div>

            <div
              onClick={() => setSelectedPart('net_vol')}
              className={`p-1.5 rounded border cursor-pointer transition-all ${
                selectedPart === 'net_vol' ? 'bg-amber-950/40 border-amber-400 text-amber-200' : 'border-transparent text-slate-300 hover:bg-slate-900'
              }`}
            >
              <div>volumes:</div>
              <div>&nbsp;&nbsp;redis_data:</div>
              <div>networks:</div>
              <div>&nbsp;&nbsp;ml_app_network:</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;driver: bridge</div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-teal-500/40 font-sans text-xs text-slate-200 mt-2">
            <strong className="text-teal-400">{explanations[selectedPart].title}:</strong> {explanations[selectedPart].detail}
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualHandsOnLiveCacheLab() {
  const [selectedVector, setSelectedVector] = useState('some_feature_vector_1');
  const [redisCache, setRedisCache] = useState({});
  const [redisOnline, setRedisOnline] = useState(true);
  const [lastResponse, setLastResponse] = useState(null);
  const [composeLogs, setComposeLogs] = useState([
    'redis_1  | Ready to accept connections',
    'api_1    | Simulating model loading... Model loaded.',
    'api_1    | * Running on http://0.0.0.0:5000/',
  ]);

  const sendPredictRequest = () => {
    if (!redisOnline) {
      setLastResponse({
        type: 'error',
        status: '503 Service Unavailable',
        latency: '4 ms',
        json: '{"error": "Could not connect to cache service."}',
      });
      setComposeLogs((prev) => [...prev.slice(-4), 'api_1    | Redis connection error: Error 111 connecting to redis:6379.']);
      return;
    }

    if (redisCache[selectedVector]) {
      const pred = redisCache[selectedVector];
      setLastResponse({
        type: 'hit',
        status: '200 OK (CACHE HIT ⚡)',
        latency: '2 ms',
        json: `{"prediction":"${pred}","source":"cache"}`,
      });
      setComposeLogs((prev) => [...prev.slice(-4), `api_1    | Cache hit for input: ${selectedVector}`]);
    } else {
      const pred = `prediction_for_${selectedVector}`;
      setRedisCache((prev) => ({ ...prev, [selectedVector]: pred }));
      setLastResponse({
        type: 'miss',
        status: '200 OK (CACHE MISS — Computed)',
        latency: '504 ms',
        json: `{"prediction":"${pred}","source":"computation"}`,
      });
      setComposeLogs((prev) => [
        ...prev.slice(-3),
        `api_1    | Cache miss for input: ${selectedVector}. Predicting...`,
        `api_1    | Stored prediction in cache for input: ${selectedVector}`,
      ]);
    }
  };

  const sendHealthCheck = () => {
    if (redisOnline) {
      setLastResponse({
        type: 'health_ok',
        status: '200 OK',
        latency: '1 ms',
        json: '{"cache_connected":true,"status":"ok"}',
      });
    } else {
      setLastResponse({
        type: 'error',
        status: '503 Service Unavailable',
        latency: '2 ms',
        json: '{"cache_connected":false,"status":"degraded"}',
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-5 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800 z-20">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-300">Input Vector:</span>
          {['some_feature_vector_1', 'some_feature_vector_2'].map((vec) => (
            <button
              key={vec}
              type="button"
              onClick={() => setSelectedVector(vec)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                selectedVector === vec ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {vec}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={sendPredictRequest}
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <IconPlay className="w-3.5 h-3.5" /> POST /predict
          </button>
          <button
            type="button"
            onClick={sendHealthCheck}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all"
          >
            GET /health
          </button>
          <button
            type="button"
            onClick={() => setRedisOnline(!redisOnline)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
              redisOnline ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300' : 'bg-rose-950/60 border-rose-500 text-rose-300'
            }`}
          >
            Redis: {redisOnline ? 'ONLINE' : 'STOPPED'}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-6 flex flex-col gap-3 min-h-0">
          <div className="bg-black border border-slate-800 rounded-xl p-3.5 font-mono text-[10px] flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
              <span className="text-emerald-400 font-bold">$ docker compose up --build</span>
              <span className="text-[9px] font-sans bg-slate-900 text-slate-400 px-2 py-0.5 rounded">
                Terminal 1 (Interleaved Logs)
              </span>
            </div>

            <div className="space-y-1 my-auto text-slate-300 py-2">
              {composeLogs.map((log, i) => (
                <div
                  key={`${log}-${i}`}
                  className={
                    log.includes('Cache hit')
                      ? 'text-emerald-400 font-bold'
                      : log.includes('Cache miss')
                        ? 'text-amber-300'
                        : log.includes('error')
                          ? 'text-rose-400 font-bold'
                          : 'text-slate-300'
                  }
                >
                  {log}
                </div>
              ))}
            </div>

            <div className="text-[9.5px] font-sans text-slate-500 border-t border-slate-900 pt-1">
              Stop stack: <code>Ctrl+C</code> followed by <code>docker compose down</code>
            </div>
          </div>

          <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-3 font-mono text-[10.5px]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-sans font-bold text-emerald-400 flex items-center gap-1.5">
                <IconDatabase className="w-4 h-4" /> Redis Cache (`redis_data` Volume)
              </span>
              <button
                type="button"
                onClick={() => setRedisCache({})}
                className="text-[9.5px] font-sans text-slate-400 hover:text-white underline"
              >
                Flush Cache
              </button>
            </div>

            {Object.keys(redisCache).length === 0 ? (
              <div className="text-slate-500 italic text-[10px]">
                Cache is empty — 1st POST /predict will be a Cache Miss (&quot;source&quot;: &quot;computation&quot;)!
              </div>
            ) : (
              <div className="space-y-1">
                {Object.entries(redisCache).map(([k, v]) => (
                  <div key={k} className="flex justify-between bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-emerald-300">
                    <span>Key: &quot;{k}&quot;</span>
                    <span>→ &quot;{v}&quot; (TTL: 3600s)</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-6 bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-sky-400">
              Terminal 2: Test with `curl` (Host Port 5001)
            </span>
            {lastResponse && (
              <span className="text-[10px] font-mono bg-slate-900 text-slate-300 px-2 py-0.5 rounded">
                Latency: {lastResponse.latency}
              </span>
            )}
          </div>

          <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-200 text-[10.5px] leading-relaxed overflow-x-auto my-auto">
{`$ curl -X POST -H "Content-Type: application/json" \\
  -d '{"input": "${selectedVector}"}' \\
  http://localhost:5001/predict`}
          </pre>

          {lastResponse ? (
            <div className={`p-3.5 rounded-xl border-2 transition-all ${
              lastResponse.type === 'hit'
                ? 'bg-emerald-950/30 border-emerald-400 text-emerald-200'
                : lastResponse.type === 'miss'
                  ? 'bg-amber-950/30 border-amber-400 text-amber-200'
                  : lastResponse.type === 'health_ok'
                    ? 'bg-sky-950/30 border-sky-400 text-sky-200'
                    : 'bg-rose-950/40 border-rose-500 text-rose-200'
            }`}>
              <div className="flex items-center justify-between text-[10px] font-sans font-bold uppercase mb-1.5">
                <span>{lastResponse.status}</span>
                {lastResponse.type === 'miss' && (
                  <span className="text-teal-300 animate-pulse">Click &quot;POST /predict&quot; again for Cache Hit!</span>
                )}
              </div>
              <div className="font-bold text-xs break-all bg-black/60 p-2 rounded border border-slate-800">
                {lastResponse.json}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-sans text-xs text-center">
              Click <strong>POST /predict</strong> once to see a <strong>Cache Miss</strong> (<code>&quot;source&quot;:&quot;computation&quot;</code>), then click it a second time with the same input to see an instant <strong>Cache Hit</strong> (<code>&quot;source&quot;:&quot;cache&quot;</code>)!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function VisualStackIntro() {
  return <VisualApiDbStack initialView="diagram" />;
}
export function VisualApiDbFlow() {
  return <VisualApiDbStack initialView="diagram" />;
}
export function VisualApiDbYaml() {
  return <VisualApiDbStack initialView="yaml" />;
}
export function VisualMlflowFlow() {
  return <VisualMlflowTrackingStack initialNode="trainer" />;
}
export function VisualMlflowDeps() {
  return <VisualMlflowTrackingStack initialNode="db" />;
}
export function VisualHandsOnTree() {
  return <VisualHandsOnProjectCode initialTab="tree" />;
}
export function VisualCachePredict() {
  return <VisualHandsOnProjectCode initialTab="predict" />;
}
export function VisualHealthRedis() {
  return <VisualHandsOnProjectCode initialTab="health" />;
}
export function VisualDockerfileWalk() {
  return <VisualHandsOnComposeFile initialPart="dockerfile" />;
}
export function VisualComposeBreakdown() {
  return <VisualHandsOnComposeFile initialPart="api" />;
}
export function VisualUpBuild() {
  return <VisualHandsOnLiveCacheLab />;
}
export function VisualCurlAndDown() {
  return <VisualHandsOnLiveCacheLab />;
}
export function VisualDownStack() {
  return <VisualHandsOnLiveCacheLab />;
}
