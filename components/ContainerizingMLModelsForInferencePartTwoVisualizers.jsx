import { useEffect, useRef, useState } from 'react';

function VisualMultiStageArchitecture({ initialMode = 'multistage' }) {
  const [buildMode, setBuildMode] = useState(initialMode);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800 z-20">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setBuildMode('single')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              buildMode === 'single'
                ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Single-Stage Build (1.28 GB)
          </button>
          <button
            type="button"
            onClick={() => setBuildMode('multistage')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              buildMode === 'multistage'
                ? 'bg-teal-600 text-white shadow-[0_0_15px_rgba(20,184,166,0.4)]'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Multi-Stage Build (215 MB ✓)
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Final Image Size:</span>
          <span className={`px-2.5 py-0.5 rounded font-bold ${
            buildMode === 'multistage' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
          }`}>
            {buildMode === 'multistage' ? '215 MB (-83% Bloat!)' : '1,280 MB (Includes Compilers & SDKs)'}
          </span>
        </div>
      </div>

      <div className="flex-1 bg-slate-950 border-2 border-slate-800 rounded-2xl p-5 flex flex-col justify-between relative min-h-0">
        <div className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2">
          Dockerfile ({buildMode === 'multistage' ? 'Two-Stage Pipeline' : 'Single Monolithic Stage'})
        </div>

        {buildMode === 'multistage' ? (
          <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center my-auto py-3">
            <div className="md:col-span-4 bg-sky-950/30 border-2 border-sky-400/70 rounded-xl p-4 flex flex-col justify-between h-full shadow-[0_0_20px_rgba(56,189,248,0.15)]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-300">Stage 1: Builder</span>
                  <span className="text-[9px] font-mono bg-sky-500/20 text-sky-200 px-1.5 py-0.5 rounded">AS builder</span>
                </div>
                <div className="text-[11px] font-mono text-slate-300 mt-0.5">(FROM python:3.9)</div>
              </div>

              <div className="my-3 space-y-1.5 text-xs">
                <div className="p-2 rounded bg-rose-950/40 border border-rose-500/40 text-rose-200 flex items-center justify-between">
                  <span>• Build Tools (gcc, g++, make)</span>
                  <span className="text-[9px] font-mono text-rose-400 uppercase font-bold">Discarded</span>
                </div>
                <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex items-center justify-between">
                  <span>• Install Dependencies (/opt/venv)</span>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold">Copied →</span>
                </div>
                <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex items-center justify-between">
                  <span>• Copy Source (/app)</span>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold">Copied →</span>
                </div>
                <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex items-center justify-between">
                  <span>• Build Artifacts / Models</span>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold">Copied →</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 text-center">
                Compiles C/C++ wheels; never shipped to production!
              </div>
            </div>

            <div className="md:col-span-3 flex flex-col items-center justify-center text-center px-1">
              <div className="bg-slate-900 border border-teal-500/50 rounded-xl p-3 w-full shadow-lg">
                <div className="text-[10px] font-mono font-bold text-teal-300 mb-1">
                  COPY --from=builder
                </div>
                <div className="text-[10px] font-mono text-slate-300 space-y-1 bg-black p-2 rounded border border-slate-800">
                  <div>/opt/venv → /opt/venv</div>
                  <div>/app → /app</div>
                </div>
                <div className="text-teal-400 font-bold text-xs mt-1.5 animate-pulse">
                  ───────────►
                </div>
              </div>
            </div>

            <div className="md:col-span-4 bg-emerald-950/30 border-2 border-emerald-400 rounded-xl p-4 flex flex-col justify-between h-full shadow-[0_0_25px_rgba(16,185,129,0.2)]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300">Stage 2: Final</span>
                  <span className="text-[9px] font-mono bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">PRODUCTION</span>
                </div>
                <div className="text-[11px] font-mono text-slate-300 mt-0.5">(FROM python:3.9-slim)</div>
              </div>

              <div className="my-3 space-y-1.5 text-xs">
                <div className="p-2 rounded bg-slate-900 border border-emerald-500/30 text-slate-200">
                  • <strong>Minimal Runtime</strong> (No compilers/SDKs)
                </div>
                <div className="p-2 rounded bg-slate-900 border border-emerald-500/30 text-emerald-200 font-mono text-[11px]">
                  • Copied venv (/opt/venv)
                </div>
                <div className="p-2 rounded bg-slate-900 border border-emerald-500/30 text-emerald-200 font-mono text-[11px]">
                  • Copied Source (/app)
                </div>
                <div className="p-2 rounded bg-slate-900 border border-emerald-500/30 text-emerald-200 font-mono text-[11px]">
                  • Copied Models (/app/models)
                </div>
              </div>

              <div className="text-[10px] text-emerald-300 text-center font-semibold">
                ✓ Fast pulls • Lower storage • Smaller attack surface
              </div>
            </div>
          </div>
        ) : (
          <div className="my-auto p-6 rounded-xl bg-rose-950/20 border-2 border-rose-500/50 text-center space-y-3">
            <div className="text-sm font-bold text-rose-300">
              Single-Stage Anti-Pattern: Everything Stays in One Bloated Image!
            </div>
            <div className="flex flex-wrap justify-center gap-2 font-mono text-xs">
              <span className="px-3 py-1.5 rounded bg-rose-900/50 border border-rose-500 text-rose-200">Full Debian OS + gcc + g++ (650 MB)</span>
              <span className="px-3 py-1.5 rounded bg-rose-900/50 border border-rose-500 text-rose-200">Dev Headers &amp; Pip Cache (280 MB)</span>
              <span className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300">Python Packages + Model (350 MB)</span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl mx-auto">
              Without multi-stage builds, build-time compilers (build-essential) and headers needed to compile C extensions remain permanently trapped in the production inference image.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[10px]">
          <div className="bg-slate-900 p-2 rounded border border-slate-800">
            <strong className="text-teal-400 block">1. Reduced Size</strong> Faster node pulls &amp; scaling
          </div>
          <div className="bg-slate-900 p-2 rounded border border-slate-800">
            <strong className="text-blue-400 block">2. Improved Security</strong> Fewer CVEs &amp; no compilers
          </div>
          <div className="bg-slate-900 p-2 rounded border border-slate-800">
            <strong className="text-purple-400 block">3. Clear Separation</strong> Build vs. runtime concerns
          </div>
          <div className="bg-slate-900 p-2 rounded border border-slate-800">
            <strong className="text-amber-400 block">4. Stage Caching</strong> Caches builder independently
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualMultiStageCodeLab({ initialBlock = 'venv' }) {
  const [selectedBlock, setSelectedBlock] = useState(initialBlock);

  const explanations = {
    venv: {
      title: 'Why Create /opt/venv Inside a Container?',
      detail: 'Normally you don’t need a virtualenv inside Docker. However, in a multi-stage build, installing packages into /opt/venv gathers all compiled Python libraries and scripts into a single self-contained folder that is trivial to copy to Stage 2!',
    },
    copy_from: {
      title: 'Selective Artifact Extraction (COPY --from=builder)',
      detail: 'COPY --from=builder /opt/venv /opt/venv and COPY --from=builder /app /app pluck only the ready-to-run virtual environment and application code out of Stage 1, leaving gcc, build-essential, and intermediate layers behind.',
    },
    path: {
      title: 'Activating the Virtualenv via ENV PATH',
      detail: 'Setting ENV PATH="/opt/venv/bin:$PATH" in both stages automatically activates the virtual environment for all subsequent RUN and CMD instructions without needing "source /opt/venv/bin/activate"!',
    },
    debug: {
      title: 'Build Strategy: Inspecting Intermediate Stages',
      detail: 'Not sure where compiled binaries or model files landed in Stage 1? You can build and open an interactive shell inside the builder stage: docker run --rm -it <builder_image_id> bash',
    },
  };

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap gap-2 mb-4 bg-slate-950 p-2.5 pr-36 rounded-xl border border-slate-800 z-20">
        {[
          { id: 'venv', label: '1. Why /opt/venv in Builder?' },
          { id: 'copy_from', label: '2. COPY --from=builder' },
          { id: 'path', label: '3. ENV PATH="/opt/venv/bin:$PATH"' },
          { id: 'debug', label: '4. Inspecting Builder Stage' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedBlock(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedBlock === tab.id ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10px] flex flex-col justify-between overflow-y-auto">
          <div className="space-y-1.5 my-auto leading-snug">
            <div className="text-sky-400 font-bold"># Stage 1: Builder stage with build tools</div>
            <div><span className="text-pink-400">FROM</span> python:3.9 <span className="text-sky-300 font-bold">AS builder</span></div>
            <div><span className="text-pink-400">WORKDIR</span> /app</div>
            <div className="text-slate-500"># RUN apt-get update &amp;&amp; apt-get install -y build-essential</div>
            <div><span className="text-pink-400">COPY</span> requirements.txt .</div>

            <button
              type="button"
              onClick={() => setSelectedBlock('venv')}
              className={`w-full text-left p-1.5 rounded border cursor-pointer transition-all ${
                selectedBlock === 'venv' || selectedBlock === 'path'
                  ? 'bg-amber-950/40 border-amber-400 text-amber-200'
                  : 'border-transparent text-slate-300 hover:bg-slate-900'
              }`}
            >
              <div><span className="text-pink-400">RUN</span> python -m venv /opt/venv</div>
              <div><span className="text-pink-400">ENV</span> PATH=&quot;/opt/venv/bin:$PATH&quot;</div>
              <div><span className="text-pink-400">RUN</span> pip install --no-cache-dir -r requirements.txt</div>
            </button>

            <div><span className="text-pink-400">COPY</span> . .</div>

            <div className="text-emerald-400 font-bold pt-2"># Stage 2: Final stage with slim runtime</div>
            <div><span className="text-pink-400">FROM</span> python:3.9-slim</div>
            <div><span className="text-pink-400">WORKDIR</span> /app</div>

            <button
              type="button"
              onClick={() => setSelectedBlock('copy_from')}
              className={`w-full text-left p-1.5 rounded border cursor-pointer transition-all ${
                selectedBlock === 'copy_from'
                  ? 'bg-teal-950/50 border-teal-400 text-teal-200 font-bold'
                  : 'border-transparent text-slate-300 hover:bg-slate-900'
              }`}
            >
              <div><span className="text-pink-400">COPY</span> --from=builder /opt/venv /opt/venv</div>
              <div><span className="text-pink-400">COPY</span> --from=builder /app /app</div>
            </button>

            <div><span className="text-pink-400">EXPOSE</span> 80</div>
            <button
              type="button"
              onClick={() => setSelectedBlock('path')}
              className={`w-full text-left rounded px-1 ${selectedBlock === 'path' ? 'text-amber-300 font-bold' : 'text-slate-300'}`}
            >
              <span className="text-pink-400">ENV</span> PATH=&quot;/opt/venv/bin:$PATH&quot;
            </button>
            <div><span className="text-pink-400">CMD</span> [&quot;uvicorn&quot;, &quot;main:app&quot;, &quot;--host&quot;, &quot;0.0.0.0&quot;, &quot;--port&quot;, &quot;80&quot;]</div>
          </div>
        </div>

        <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold">
              Multi-Stage Pattern Insight
            </span>
            <h4 className="text-sm font-bold text-white mt-2">{explanations[selectedBlock].title}</h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {explanations[selectedBlock].detail}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-[10px] space-y-2 my-auto">
            <div className="text-[9px] font-sans font-bold uppercase text-slate-400">
              Filesystem Layout Inside Stage 2 (Final)
            </div>
            <div className="text-emerald-300">
              /opt/venv/bin/uvicorn &nbsp;<span className="text-slate-500">← On $PATH</span>
            </div>
            <div className="text-emerald-300">
              /opt/venv/lib/python3.9/site-packages/
            </div>
            <div className="text-blue-300">
              /app/main.py &amp; /app/models/model.pkl
            </div>
            <div className="text-rose-400 line-through opacity-60">
              /usr/bin/gcc &amp; /root/.cache/pip (Absent!)
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedBlock('debug')}
            className="bg-black p-2.5 rounded-lg border border-slate-800 font-mono text-[9.5px] text-slate-300 text-left"
          >
            <span className="text-slate-500"># Debug intermediate builder filesystem:</span><br />
            <span className="text-emerald-400">$</span> docker run --rm -it &lt;builder_id&gt; bash
          </button>
        </div>
      </div>
    </div>
  );
}

const dietDefaults = {
  compilers: true,
  headers: true,
  plotting: true,
  testing: true,
  unusedAssets: true,
  useLiteRuntime: false,
};

function VisualDependencyPruner({ initialRemoved = dietDefaults }) {
  const [removedItems, setRemovedItems] = useState(initialRemoved);

  const items = [
    {
      key: 'compilers',
      name: '1. Build Tools (gcc, g++, make, cmake, apt/pip cache)',
      sizeMB: 420,
      note: 'Essential for compiling C extensions during build, useless at runtime.',
    },
    {
      key: 'headers',
      name: '2. Dev Headers & Libraries (python3-dev, libssl-dev)',
      sizeMB: 140,
      note: 'Packages ending in -dev or -devel are only needed during compilation.',
    },
    {
      key: 'plotting',
      name: '3. Full Data Science / Plotting Libs (matplotlib, seaborn, jupyter)',
      sizeMB: 260,
      note: 'Used during exploration; inference often only needs numpy + model runtime.',
    },
    {
      key: 'testing',
      name: '4. Testing Frameworks (pytest, unittest, coverage)',
      sizeMB: 45,
      note: 'Run in CI/CD test stages; have no place in a production inference image.',
    },
    {
      key: 'unusedAssets',
      name: '5. Unused Code & Assets (train.py, notebooks/, raw_data.csv)',
      sizeMB: 310,
      note: 'Copy only src/inference_api.py, model artifacts, and runtime config.',
    },
  ];

  const baseRuntimeMB = removedItems.useLiteRuntime ? 95 : 520;
  const bloatMB = items.reduce((acc, item) => acc + (removedItems[item.key] ? 0 : item.sizeMB), 0);
  const totalMB = baseRuntimeMB + bloatMB;

  const toggleItem = (key) => {
    setRemovedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 pr-36 mb-4 z-20">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Interactive Inference Image Diet
            </span>
            <span className="text-[11px] text-slate-400 ml-2">Click items below to strip or include them</span>
          </div>
          <div className="font-mono text-sm font-bold">
            Final Size:{' '}
            <span className={totalMB <= 250 ? 'text-emerald-400' : totalMB <= 700 ? 'text-amber-400' : 'text-rose-400'}>
              {totalMB} MB
            </span>
          </div>
        </div>

        <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              totalMB <= 250 ? 'bg-emerald-500' : totalMB <= 700 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(100, Math.round((totalMB / 1700) * 100))}%` }}
          />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-8 flex flex-col justify-between gap-1.5 overflow-y-auto pr-1">
          {items.map((item) => {
            const isStripped = removedItems[item.key];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleItem(item.key)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isStripped
                    ? 'bg-slate-950/70 border-emerald-500/40 text-slate-300'
                    : 'bg-rose-950/30 border-rose-500/60 text-white'
                }`}
              >
                <div>
                  <div className="text-xs font-bold flex items-center gap-2">
                    <span className={isStripped ? 'line-through text-slate-500' : 'text-white'}>{item.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.note}</div>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded shrink-0 ml-2 ${
                  isStripped
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-600 text-white'
                }`}>
                  {isStripped ? `Stripped (-${item.sizeMB} MB)` : `+${item.sizeMB} MB Bloat`}
                </span>
              </button>
            );
          })}
        </div>

        <div className="md:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1.5">
              Framework Runtime Choice
            </div>
            <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
              Instead of installing the full <code>tensorflow</code> training package, use specialized inference runtimes when possible:
            </p>
          </div>

          <div className="space-y-2 my-auto">
            <button
              type="button"
              onClick={() => setRemovedItems((prev) => ({ ...prev, useLiteRuntime: false }))}
              className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                !removedItems.useLiteRuntime
                  ? 'bg-amber-950/30 border-amber-500/60 text-amber-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-xs font-mono font-bold">Full tensorflow==2.12.0</div>
              <div className="text-[10px] mt-0.5">Includes training ops &amp; gradients (~520 MB)</div>
            </button>

            <button
              type="button"
              onClick={() => setRemovedItems((prev) => ({ ...prev, useLiteRuntime: true }))}
              className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                removedItems.useLiteRuntime
                  ? 'bg-emerald-950/40 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-xs font-mono font-bold">tensorflow-lite-runtime</div>
              <div className="text-[10px] mt-0.5">Pure inference runtime (~95 MB total!)</div>
            </button>
          </div>

          <div className="text-[10px] font-mono bg-black p-2 rounded border border-slate-800 text-slate-300">
            pip install <span className="text-emerald-400">--no-cache-dir</span> -r requirements.txt
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualBaseImagesAndHistory({ initialBase = 'slim' }) {
  const [baseChoice, setBaseChoice] = useState(initialBase);

  const baseSpecs = {
    slim: {
      tag: 'python:3.9-slim-buster',
      osSize: '45 MB',
      libc: 'glibc (Standard)',
      wheelCompat: 'High (Pre-compiled wheels work)',
      shellAccess: 'Yes (/bin/sh, apt-get)',
      security: 'Good (Stripped Debian packages)',
      note: 'The sweet spot for most Python ML inference services: small size with full manylinux wheel compatibility.',
      layers: [
        { cmd: 'COPY /app/models ./models', size: '42 MB' },
        { cmd: 'COPY /opt/venv /opt/venv', size: '125 MB' },
        { cmd: 'FROM python:3.9-slim-buster', size: '45 MB' },
      ],
    },
    alpine: {
      tag: 'python:3.9-alpine',
      osSize: '18 MB',
      libc: 'musl libc (Warning!)',
      wheelCompat: 'Low (Often compiles C++ from source)',
      shellAccess: 'Yes (/bin/sh, apk)',
      security: 'High (Minimal Alpine OS)',
      note: 'Uses musl libc instead of glibc. Pre-compiled NumPy/SciPy/PyTorch wheels expecting glibc may fail or require slow source compilation.',
      layers: [
        { cmd: 'COPY /app/models ./models', size: '42 MB' },
        { cmd: 'COPY /opt/venv /opt/venv', size: '125 MB' },
        { cmd: 'FROM python:3.9-alpine', size: '18 MB' },
      ],
    },
    distroless: {
      tag: 'gcr.io/distroless/python3-debian11',
      osSize: '22 MB',
      libc: 'glibc (Standard)',
      wheelCompat: 'High (Copied from Debian builder)',
      shellAccess: 'NONE (No /bin/sh, no apt!)',
      security: 'Maximum (Smallest Attack Surface)',
      note: 'Google Distroless images contain ONLY your application and runtime dependencies—no shell or package managers for attackers to exploit!',
      layers: [
        { cmd: 'COPY /app/models ./models', size: '42 MB' },
        { cmd: 'COPY /opt/venv /opt/venv', size: '125 MB' },
        { cmd: 'FROM gcr.io/distroless/python3', size: '22 MB' },
      ],
    },
  };

  const active = baseSpecs[baseChoice];

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap gap-2 mb-4 bg-slate-950 p-2.5 pr-36 rounded-xl border border-slate-800 z-20">
        {[
          { id: 'slim', label: '1. python:3.9-slim (Balanced Default)' },
          { id: 'alpine', label: '2. python:3.9-alpine (musl libc Caveat)' },
          { id: 'distroless', label: '3. Google Distroless (Ultra-Secure)' },
        ].map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setBaseChoice(b.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              baseChoice === b.id ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-mono text-xs font-bold text-teal-300">{active.tag}</span>
            <span className="text-[10px] font-mono bg-slate-800 text-white px-2 py-0.5 rounded font-bold">
              Base: {active.osSize}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 my-auto text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">C Library</div>
              <div className={`font-semibold mt-0.5 ${baseChoice === 'alpine' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {active.libc}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Wheel Compatibility</div>
              <div className="text-slate-200 font-semibold mt-0.5">{active.wheelCompat}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Shell / Package Mgr</div>
              <div className={`font-semibold mt-0.5 ${baseChoice === 'distroless' ? 'text-purple-300' : 'text-slate-200'}`}>
                {active.shellAccess}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Security Posture</div>
              <div className="text-emerald-300 font-semibold mt-0.5">{active.security}</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            {active.note}
          </div>
        </div>

        <div className="md:col-span-6 bg-black border border-slate-800 rounded-xl p-4 font-mono text-[10.5px] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <span className="text-emerald-400 font-bold">$ docker history my-inference-api</span>
            <span className="text-[9px] font-sans bg-slate-900 text-slate-400 px-2 py-0.5 rounded">
              or docker-explore / dive
            </span>
          </div>

          <div className="space-y-2 my-auto">
            <div className="grid grid-cols-12 text-[9px] text-slate-500 uppercase border-b border-slate-900 pb-1">
              <span className="col-span-8">CREATED BY (LAYER INSTRUCTION)</span>
              <span className="col-span-4 text-right">SIZE</span>
            </div>

            {active.layers.map((layer) => (
              <div
                key={layer.cmd}
                className="grid grid-cols-12 items-center p-2 rounded bg-slate-950 border border-slate-800 text-slate-300"
              >
                <span className="col-span-8 truncate">{layer.cmd}</span>
                <span className="col-span-4 text-right font-bold text-teal-300">{layer.size}</span>
              </div>
            ))}

            <div className="p-2.5 rounded-lg bg-rose-950/20 border border-dashed border-rose-500/40 text-rose-300 text-[10px] font-sans">
              <strong>Why analyze layers?</strong> Running <code>docker history</code> or <code>docker-explore</code> immediately reveals if an uncleaned cache or accidental <code>raw_data.csv</code> inflated a specific layer!
            </div>
          </div>

          <div className="text-[10px] font-sans text-slate-400 border-t border-slate-900 pt-2">
            Pin exact versions (<code>==</code>) in <code>requirements.txt</code> so newer, larger transitive dependencies aren&apos;t pulled unexpectedly.
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualPortMappingDiagram({ initialPort = '8080:8000', initialBind = '0.0.0.0' }) {
  const [portMode, setPortMode] = useState(initialPort);
  const [bindAddr, setBindAddr] = useState(initialBind);

  const modeDetails = {
    '8080:8000': {
      flag: '-p 8080:8000',
      hostPort: '8080',
      containerPort: '8000',
      url: 'http://localhost:8080',
      desc: 'Maps host port 8080 to container port 8000. Traffic to localhost:8080 on your machine forwards to port 8000 inside the container.',
    },
    '8000:8000': {
      flag: '-p 8000:8000',
      hostPort: '8000',
      containerPort: '8000',
      url: 'http://localhost:8000',
      desc: 'Maps host port 8000 directly to container port 8000 (requires port 8000 to be free on your host machine).',
    },
    random: {
      flag: '-p 8000',
      hostPort: '32768 (Auto)',
      containerPort: '8000',
      url: 'http://localhost:32768',
      desc: 'Specifying only the container port (-p 8000) tells Docker to assign a random available host port! Check docker ps: 0.0.0.0:32768->8000/tcp.',
    },
  };

  const current = modeDetails[portMode];

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-5 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-slate-950 p-3 pr-36 rounded-xl border border-slate-800 z-20">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setPortMode('8080:8000')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              portMode === '8080:8000' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            1. -p 8080:8000
          </button>
          <button
            type="button"
            onClick={() => setPortMode('8000:8000')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              portMode === '8000:8000' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            2. -p 8000:8000
          </button>
          <button
            type="button"
            onClick={() => setPortMode('random')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              portMode === 'random' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            3. -p 8000 (Random Host Port)
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase text-slate-400">API Bind:</span>
          <button
            type="button"
            onClick={() => setBindAddr('0.0.0.0')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
              bindAddr === '0.0.0.0' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            0.0.0.0 ✓
          </button>
          <button
            type="button"
            onClick={() => setBindAddr('127.0.0.1')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
              bindAddr === '127.0.0.1' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            127.0.0.1 ✕
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between relative min-h-0">
        <div className="bg-emerald-950/25 border-2 border-emerald-500/60 rounded-xl p-4 relative">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-3 flex items-center justify-between">
            <span>Docker Container (Isolated Network)</span>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded">
              EXPOSE 8000 (Documentation Only)
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 px-4">
            <div className={`p-3.5 rounded-xl border-2 text-center transition-all ${
              bindAddr === '0.0.0.0'
                ? 'bg-purple-950/50 border-purple-400 text-purple-100 shadow-[0_0_15px_rgba(192,132,252,0.25)]'
                : 'bg-rose-950/50 border-rose-400 text-rose-200'
            }`}>
              <div className="text-xs font-bold">Inference API</div>
              <div className="text-[11px] font-mono mt-0.5">
                (Listening on <strong>{bindAddr}:8000</strong>)
              </div>
            </div>

            <div className="flex-1 text-center font-mono text-xs">
              {bindAddr === '0.0.0.0' ? (
                <span className="text-emerald-300 font-bold">◄────── binds to ──────</span>
              ) : (
                <span className="text-rose-400 font-bold">✕ Bound only to loopback (127.0.0.1) ✕</span>
              )}
            </div>

            <div className="px-5 py-3 rounded-full bg-amber-400/20 border-2 border-amber-300 text-amber-200 font-mono text-xs font-bold shadow-md">
              Port {current.containerPort}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center my-1">
          <div className="px-4 py-1 rounded-full bg-sky-950 border border-sky-500/50 font-mono text-xs text-sky-300 font-bold">
            docker run {current.flag} ───► Forwards Host Port {current.hostPort} to Container Port {current.containerPort}
          </div>
        </div>

        <div className="bg-slate-900/90 border-2 border-slate-600 rounded-xl p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
            <span>Host Machine</span>
            {portMode === 'random' && (
              <span className="text-[10px] font-mono text-amber-300 bg-black px-2 py-0.5 rounded border border-amber-500/30">
                $ docker ps → PORTS: 0.0.0.0:32768-&gt;8000/tcp
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 px-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-700 text-center">
              <div className="text-xs font-bold text-white">Host Network</div>
              <div className="text-[11px] font-mono text-slate-400">({current.url})</div>
            </div>

            <div className="flex-1 text-center font-mono text-xs text-sky-400">
              ─── Client sends HTTP request to ───►
            </div>

            <div className="px-5 py-3 rounded-full bg-sky-500/20 border-2 border-sky-400 text-sky-200 font-mono text-xs font-bold shadow-md">
              Port {current.hostPort}
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-300 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
          {current.desc}
        </div>
      </div>
    </div>
  );
}

function VisualCurlTester() {
  const [targetPort, setTargetPort] = useState('8080');
  const [requestStatus, setRequestStatus] = useState('success');
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const sendCurl = (portChoice) => {
    setTargetPort(portChoice);
    setRequestStatus('sending');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setRequestStatus(portChoice === '8080' ? 'success' : 'error');
    }, 500);
  };

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl relative overflow-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 pr-36 mb-4 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="font-mono text-xs text-slate-300">
          <span className="text-emerald-400">$</span> docker run -d <strong className="text-sky-400">-p 8080:8000</strong> --name my_inference_api my_inference_image:latest
        </div>
        <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded font-bold">
          Host :8080 → Container :8000
        </span>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 gap-2">
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-blue-400">
              1. Send POST Request from Host Terminal
            </span>
            <div className="flex gap-1.5 font-sans">
              <button
                type="button"
                onClick={() => sendCurl('8080')}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                  targetPort === '8080' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Test Host Port :8080 ✓
              </button>
              <button
                type="button"
                onClick={() => sendCurl('8000')}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                  targetPort === '8000' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Test Unmapped :8000 ✕
              </button>
            </div>
          </div>

          <pre className="bg-black p-3.5 rounded-xl border border-slate-800 text-slate-200 overflow-x-auto my-auto leading-relaxed text-[11px]">
{`# Sending a POST request with JSON data to /predict
curl -X POST http://localhost:${targetPort}/predict \\
     -H "Content-Type: application/json" \\
     -d '{"features": [1.0, 2.5, 0.8]}'`}
          </pre>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-sans text-xs text-slate-300">
            <strong>Crucial Rule:</strong> Always send requests from your host machine to the published <strong>host port</strong> (<code>8080</code>), not the internal container port (<code>8000</code>)!
          </div>
        </div>

        <div className="md:col-span-5 bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">
              2. Connection &amp; Prediction Output
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-sans font-bold ${
              requestStatus === 'success'
                ? 'bg-emerald-500 text-slate-950'
                : requestStatus === 'error'
                  ? 'bg-rose-600 text-white'
                  : 'bg-amber-500 text-slate-950'
            }`}>
              {requestStatus === 'success' ? 'HTTP 200 OK' : requestStatus === 'error' ? 'Connection Refused' : 'Sending...'}
            </span>
          </div>

          {requestStatus === 'success' ? (
            <div className="my-auto space-y-3">
              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-[10px] text-emerald-300 space-y-1">
                <div>1. Host <code>localhost:8080</code> receives POST</div>
                <div>2. Docker forwards to container <code>0.0.0.0:8000</code></div>
                <div>3. Model computes prediction &amp; returns JSON</div>
              </div>

              <pre className="p-3 rounded-lg bg-slate-950 border border-emerald-500/50 text-emerald-300 text-[11px] leading-relaxed">
{`{
  "predictions": [
    "class_1"
  ],
  "confidence": 0.962,
  "status": "success"
}`}
              </pre>
            </div>
          ) : (
            <div className="my-auto space-y-3">
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/50 text-rose-300 text-[11px] leading-relaxed">
                {requestStatus === 'sending'
                  ? 'Forwarding request…'
                  : 'curl: (7) Failed to connect to localhost port 8000: Connection refused'}
              </div>
              <div className="text-[11px] font-sans text-slate-400">
                Because we published <code>-p 8080:8000</code>, port <code>8000</code> is only open <em>inside</em> the isolated container network. On the host machine, Docker is listening on port <code>8080</code>!
              </div>
            </div>
          )}

          <div className="text-[10px] font-sans text-slate-400 border-t border-slate-900 pt-2">
            Tip: If your API defines a root <code>GET /</code> route or FastAPI <code>/docs</code>, you can also test it directly in your browser at <code>http://localhost:8080/docs</code>!
          </div>
        </div>
      </div>
    </div>
  );
}

const bloatedDiet = {
  compilers: false,
  headers: false,
  plotting: false,
  testing: false,
  unusedAssets: false,
  useLiteRuntime: false,
};

export function VisualImageWeight() {
  return <VisualMultiStageArchitecture initialMode="single" />;
}
export function VisualStageWalk() {
  return <VisualMultiStageArchitecture initialMode="multistage" />;
}
export function VisualBenefits() {
  return <VisualMultiStageArchitecture initialMode="multistage" />;
}
export function VisualDockerfilePass() {
  return <VisualMultiStageCodeLab initialBlock="venv" />;
}
export function VisualCopyAcross() {
  return <VisualMultiStageCodeLab initialBlock="copy_from" />;
}
export function VisualArtifactPicker() {
  return <VisualMultiStageCodeLab initialBlock="debug" />;
}
export function VisualLeaveBehind() {
  return <VisualMultiStageCodeLab initialBlock="copy_from" />;
}
export function VisualTrainVsInfer() {
  return <VisualDependencyPruner />;
}
export function VisualDropDeps() {
  return <VisualDependencyPruner initialRemoved={bloatedDiet} />;
}
export function VisualPrune() {
  return <VisualDependencyPruner />;
}
export function VisualBasePicker() {
  return <VisualBaseImagesAndHistory initialBase="slim" />;
}
export function VisualHistory() {
  return <VisualBaseImagesAndHistory initialBase="slim" />;
}
export function VisualBindHost() {
  return <VisualPortMappingDiagram initialBind="127.0.0.1" />;
}
export function VisualExposeOnly() {
  return <VisualPortMappingDiagram />;
}
export function VisualPublishBridge() {
  return <VisualPortMappingDiagram />;
}
export function VisualPortExamples() {
  return <VisualPortMappingDiagram initialPort="8080:8000" />;
}
export function VisualCurlPredict() {
  return <VisualCurlTester />;
}
