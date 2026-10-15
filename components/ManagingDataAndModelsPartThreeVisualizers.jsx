import { useEffect, useRef, useState } from 'react';

const IconDatabase = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
const IconFolder = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const IconFileCode = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconBox = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const IconCheck = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconTrash = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconPlay = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
const IconCpu = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>;
const IconSearch = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

const FILES = {
  'data.csv': {
    title: 'project/data/data.csv',
    badge: 'Stays on Host (Not in Image!)',
    badgeColor: 'bg-amber-900/50 text-amber-300 border-amber-500/50',
    code: 'feature1,feature2,target\n1.0,2.0,0\n1.5,2.5,0\n3.0,4.0,1\n3.5,4.5,1',
  },
  'train.py': {
    title: 'project/train.py',
    badge: 'Copied into Image',
    badgeColor: 'bg-blue-900/50 text-blue-300 border-blue-500/50',
    code: `import argparse
import pandas as pd
from sklearn.linear_model import LogisticRegression
import joblib
import os

# Set up argument parser
parser = argparse.ArgumentParser(description='Simple scikit-learn model training script.')
parser.add_argument('--data_path', type=str, required=True, help='Path to the input CSV dataset.')
parser.add_argument('--model_dir', type=str, required=True, help='Directory to save the trained model.')

# Parse arguments
args = parser.parse_args()

# Ensure model directory exists
os.makedirs(args.model_dir, exist_ok=True)
model_save_path = os.path.join(args.model_dir, 'model.joblib')

print(f"Loading data from: \${args.data_path}")
try:
    # Load data
    df = pd.read_csv(args.data_path)
    X = df[['feature1', 'feature2']]
    y = df['target']

    # Train a simple model
    print("Training model...")
    model = LogisticRegression()
    model.fit(X, y)

    # Save the model
    print(f"Saving model to: \${model_save_path}")
    joblib.dump(model, model_save_path)

    print("Training complete and model saved.")

except FileNotFoundError:
    print(f"Error: Data file not found at \${args.data_path}")
    exit(1)
except Exception as e:
    print(f"An error occurred: \${e}")
    exit(1)`,
  },
  Dockerfile: {
    title: 'project/Dockerfile',
    badge: 'Build Blueprint',
    badgeColor: 'bg-purple-900/50 text-purple-300 border-purple-500/50',
    code: 'FROM python:3.9-slim\nWORKDIR /app\n\nRUN pip install --no-cache-dir \\\n    scikit-learn==1.0.2 \\\n    pandas==1.3.5 \\\n    joblib==1.1.0\n\n# Notice: We ONLY copy train.py, NOT data/!\nCOPY train.py .\n\nENTRYPOINT ["python", "train.py"]',
  },
};

export function VisualPrereqsAndBuild({ initialFile = 'train.py' }) {
  const [selectedFile, setSelectedFile] = useState(initialFile);
  const [buildState, setBuildState] = useState('idle');
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const triggerBuild = () => {
    setBuildState('building');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setBuildState('built'), 1800);
  };

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 border border-slate-800 p-3 rounded-xl mb-4 shadow-lg z-20 pr-36">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <span className="text-emerald-400">$</span>
          <span>docker build -t <strong className="text-teal-400">ml-data-practice</strong> .</span>
        </div>
        <button
          type="button"
          onClick={() => (buildState === 'built' ? setBuildState('idle') : triggerBuild())}
          disabled={buildState === 'building'}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
            buildState === 'built'
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-teal-600 text-white hover:bg-teal-500 disabled:opacity-50'
          }`}
        >
          {buildState === 'idle' && <><IconPlay className="w-3.5 h-3.5" /> Build Image</>}
          {buildState === 'building' && <span className="animate-pulse">Building Layers...</span>}
          {buildState === 'built' && <>Reset Build</>}
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        <div className="w-full md:w-5/12 flex flex-col gap-3 min-h-0">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex-1 flex flex-col min-h-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-800 pb-1.5">
              Host Project Directory
            </div>
            <div className="font-mono text-xs flex flex-col gap-1.5 text-slate-300">
              <div className="flex items-center gap-1.5 text-slate-400">
                <IconFolder className="w-4 h-4 text-slate-500" /> project/
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile('Dockerfile')}
                className={`ml-4 flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all ${
                  selectedFile === 'Dockerfile' ? 'bg-purple-900/40 text-purple-300 border border-purple-500/50' : 'hover:bg-slate-900 text-slate-400'
                }`}
              >
                <IconFileCode className="w-4 h-4 shrink-0 text-purple-400" />
                <span>Dockerfile</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedFile('train.py')}
                className={`ml-4 flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all ${
                  selectedFile === 'train.py' ? 'bg-blue-900/40 text-blue-300 border border-blue-500/50' : 'hover:bg-slate-900 text-slate-400'
                }`}
              >
                <IconFileCode className="w-4 h-4 shrink-0 text-blue-400" />
                <span>train.py</span>
              </button>
              <div className="ml-4 flex items-center gap-1.5 text-slate-400 mt-1">
                <IconFolder className="w-4 h-4 text-amber-500/70" /> data/
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile('data.csv')}
                className={`ml-8 flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all ${
                  selectedFile === 'data.csv' ? 'bg-amber-900/40 text-amber-300 border border-amber-500/50' : 'hover:bg-slate-900 text-slate-400'
                }`}
              >
                <IconDatabase className="w-4 h-4 shrink-0 text-amber-400" />
                <span>data.csv</span>
              </button>
            </div>
          </div>

          <div className={`rounded-xl p-3 border-2 transition-all duration-500 flex flex-col justify-center relative overflow-hidden ${
            buildState === 'built'
              ? 'bg-teal-950/30 border-teal-500 shadow-[0_0_25px_rgba(20,184,166,0.2)]'
              : buildState === 'building'
                ? 'bg-slate-950 border-teal-500/40 animate-pulse'
                : 'bg-slate-950/50 border-slate-800 opacity-50'
          }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400 flex items-center gap-1.5">
                <IconBox className="w-3.5 h-3.5" /> Image: ml-data-practice
              </span>
              {buildState === 'built' && (
                <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded border border-teal-500/40 font-bold">
                  Ready
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800 text-slate-300">
                python:3.9 + sklearn
              </div>
              <div className="bg-blue-950/50 p-1.5 rounded border border-blue-500/30 text-blue-300">
                /app/train.py
              </div>
            </div>
            <div className="mt-2 text-[10px] text-amber-300/90 bg-amber-950/40 border border-amber-500/30 rounded px-2 py-1 text-center">
              Zero datasets or models baked inside!
            </div>
          </div>
        </div>

        <div className="w-full md:w-7/12 bg-slate-950 border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-xl min-h-0">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <span className="font-mono text-xs text-slate-300 font-bold">{FILES[selectedFile].title}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${FILES[selectedFile].badgeColor}`}>
              {FILES[selectedFile].badge}
            </span>
          </div>
          <div className="p-4 font-mono text-[11px] leading-relaxed text-slate-300 overflow-y-auto flex-1 whitespace-pre">
            {FILES[selectedFile].code}
          </div>
        </div>
      </div>
    </div>
  );
}

export const VisualDatasetFile = () => <VisualPrereqsAndBuild initialFile="data.csv" />;
export const VisualTrainScript = () => <VisualPrereqsAndBuild initialFile="train.py" />;
export const VisualPracticeImage = () => <VisualPrereqsAndBuild initialFile="Dockerfile" />;
export const VisualBuildPractice = () => <VisualPrereqsAndBuild initialFile="Dockerfile" />;
export const VisualKeepOutside = () => <VisualPrereqsAndBuild initialFile="train.py" />;

export function VisualBindMountWorkflow({ initialStep = 0 }) {
  const [step, setStep] = useState(initialStep);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else setStep(0);
  };

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 bg-slate-950 p-3 rounded-xl border border-slate-800 z-20 pr-36 gap-2">
        <div className="flex gap-2 flex-wrap">
          {[
            { idx: 0, label: '0. Initial' },
            { idx: 1, label: '1. mkdir models' },
            { idx: 2, label: '2. docker run (-v)' },
            { idx: 3, label: '3. Verify Output' },
          ].map((s) => (
            <button
              key={s.idx}
              type="button"
              onClick={() => setStep(s.idx)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                step === s.idx
                  ? 'bg-teal-600 text-white shadow-md'
                  : step > s.idx
                    ? 'bg-slate-800 text-teal-400 border border-teal-500/30'
                    : 'bg-slate-900 text-slate-500'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={nextStep}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md transition-all shrink-0"
        >
          {step < 3 ? 'Next Step →' : 'Reset'}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-between gap-4 relative my-2 min-h-0">
        <div className="w-5/12 h-full bg-slate-950 border-2 border-slate-700 rounded-xl p-4 flex flex-col justify-between relative z-10 shadow-xl">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-2">
            Host Machine (project/)
          </div>
          <div className={`p-3 rounded-xl border-2 transition-all duration-500 ${
            step === 2 ? 'bg-blue-950/40 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-slate-900 border-slate-700'
          }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 font-mono">
              <IconFolder className="w-4 h-4" /> $(pwd)/data
            </div>
            <div className="mt-2 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800 flex items-center gap-2 font-mono text-[11px] text-amber-300">
              <IconDatabase className="w-3.5 h-3.5 text-amber-400" /> data.csv
            </div>
          </div>
          <div className={`p-3 rounded-xl border-2 transition-all duration-500 ${
            step === 0
              ? 'border-dashed border-slate-800 opacity-30'
              : step >= 2
                ? 'bg-emerald-950/40 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 border-slate-600'
          }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400 font-mono">
              <span className="flex items-center gap-2"><IconFolder className="w-4 h-4" /> $(pwd)/models</span>
              {step === 1 && <span className="text-[9px] bg-emerald-900/60 text-emerald-200 px-1.5 py-0.5 rounded">Created!</span>}
            </div>
            <div className="mt-2 min-h-[30px] flex items-center">
              {step >= 2 ? (
                <div className="w-full bg-emerald-900/40 px-2.5 py-1.5 rounded border border-emerald-400 flex items-center justify-between font-mono text-[11px] text-emerald-200 animate-[fadeIn_0.5s_ease-out]">
                  <span className="flex items-center gap-1.5"><IconCheck className="w-3.5 h-3.5 text-emerald-400" /> model.joblib</span>
                  <span className="text-[9px] uppercase bg-emerald-500 text-slate-950 font-bold px-1 rounded">Saved</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 font-mono italic">Empty directory...</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 h-full relative flex items-center justify-center z-0">
          <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 200 240">
            <defs>
              <marker id="bm-arrow-blue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
              </marker>
              <marker id="bm-arrow-emerald" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
              </marker>
            </defs>
            {step === 2 && (
              <>
                <path d="M 10,75 L 190,75" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6,6" className="animate-[dash_1s_linear_infinite]" markerEnd="url(#bm-arrow-blue)" />
                <text x="100" y="65" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="bold">Bind Mount (Read CSV)</text>
                <path d="M 190,175 L 10,175" stroke="#10b981" strokeWidth="3" strokeDasharray="6,6" className="animate-[dash_1s_linear_infinite]" markerEnd="url(#bm-arrow-emerald)" />
                <text x="100" y="165" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontWeight="bold">Bind Mount (Write Model)</text>
              </>
            )}
          </svg>
        </div>

        <div className={`w-5/12 h-full rounded-xl p-4 flex flex-col justify-between relative z-10 transition-all duration-500 border-2 ${
          step === 2
            ? 'bg-slate-950 border-teal-500 shadow-[0_0_25px_rgba(20,184,166,0.25)] opacity-100 scale-100'
            : step === 3
              ? 'bg-slate-950/30 border-dashed border-red-500/40 opacity-50 scale-95'
              : 'bg-slate-950/40 border-dashed border-slate-800 opacity-40'
        }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Container (--rm)</span>
            {step === 2 && <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded animate-pulse">Running</span>}
            {step === 3 && <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded">Removed (--rm)</span>}
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-blue-500/40 font-mono text-[11px]">
            <div className="text-blue-300 font-bold">/app/data</div>
            <div className="text-[10px] text-slate-400 mt-0.5">--data_path /app/data/data.csv</div>
          </div>
          <div className="my-auto py-2 flex flex-col items-center justify-center bg-slate-900/90 rounded-lg border border-slate-800">
            <IconCpu className={`w-6 h-6 mb-1 ${step === 2 ? 'text-teal-400 animate-spin' : 'text-slate-600'}`} />
            <span className="font-mono text-[10px] text-slate-300">ENTRYPOINT: python train.py</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/40 font-mono text-[11px]">
            <div className="text-emerald-300 font-bold">/app/output</div>
            <div className="text-[10px] text-slate-400 mt-0.5">--model_dir /app/output</div>
          </div>
        </div>
      </div>

      <div className="bg-black border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 h-24 overflow-y-auto shadow-inner">
        {step === 0 && <div className="text-slate-500"># Click &quot;Next Step&quot; to step through the Bind Mount workflow...</div>}
        {step === 1 && (
          <div>
            <span className="text-emerald-400">$</span> mkdir /path/to/project/models<br />
            <span className="text-slate-400"># Created local output directory on host.</span>
          </div>
        )}
        {step === 2 && (
          <div>
            <span className="text-emerald-400">$</span> docker run --rm -v &quot;$(pwd)/data&quot;:/app/data -v &quot;$(pwd)/models&quot;:/app/output ml-data-practice --data_path /app/data/data.csv --model_dir /app/output<br />
            <span className="text-teal-300">Loading data from: /app/data/data.csv</span><br />
            <span className="text-teal-300">Training model... Saving model to: /app/output/model.joblib</span>
          </div>
        )}
        {step === 3 && (
          <div>
            <span className="text-emerald-400">$</span> ls /path/to/project/models<br />
            <span className="text-white font-bold">model.joblib</span> <span className="text-emerald-400 ml-2"># Container vanished (--rm), model is directly on your host!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function VisualVolumePopulate() {
  const [phase, setPhase] = useState(0);

  const advance = () => {
    if (phase < 3) setPhase(phase + 1);
    else setPhase(0);
  };

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 bg-slate-950 p-3 rounded-xl border border-slate-800 z-20 pr-36 gap-2">
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 0, title: '0. Start' },
            { id: 1, title: '1. volume create' },
            { id: 2, title: '2. Alpine Helper cp' },
            { id: 3, title: '3. Volume Populated' },
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPhase(p.id)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                phase === p.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : phase > p.id
                    ? 'bg-slate-800 text-indigo-400 border border-indigo-500/30'
                    : 'bg-slate-900 text-slate-500'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={advance}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md transition-all shrink-0"
        >
          {phase < 3 ? 'Next Step →' : 'Reset'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-4 items-center relative my-2 min-h-0">
        <div className="h-56 bg-slate-950 border-2 border-slate-700 rounded-xl p-4 flex flex-col justify-between z-10">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1.5">
            Host Machine
          </div>
          <div className="p-3 bg-slate-900 rounded-lg border border-blue-500/40">
            <div className="text-xs font-mono font-bold text-blue-400 flex items-center gap-1.5">
              <IconFolder className="w-4 h-4" /> $(pwd)/data
            </div>
            <div className="mt-2 bg-slate-950 p-2 rounded border border-slate-800 font-mono text-xs text-amber-300 flex items-center gap-1.5">
              <IconDatabase className="w-3.5 h-3.5 text-amber-400" /> data.csv
            </div>
          </div>
          <div className="text-[10px] text-slate-500 text-center">
            Bind mounted as <code className="text-blue-300">/host_data</code>
          </div>
        </div>

        <div className={`h-56 rounded-xl p-4 flex flex-col justify-between z-10 transition-all duration-500 border-2 relative ${
          phase === 2
            ? 'bg-indigo-950/40 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.3)] scale-105'
            : phase === 3
              ? 'bg-slate-950/20 border-dashed border-red-500/40 opacity-40 scale-95'
              : 'bg-slate-950/30 border-dashed border-slate-800 opacity-30'
        }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-1">
              <IconBox className="w-3.5 h-3.5" /> Alpine Helper
            </span>
            {phase === 2 && <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold">Copying</span>}
            {phase === 3 && <span className="text-[9px] bg-red-500/30 text-red-300 px-1.5 py-0.5 rounded">--rm Deleted</span>}
          </div>
          <div className="my-auto flex flex-col gap-2 font-mono text-[10px]">
            <div className="bg-slate-900 p-2 rounded border border-blue-500/30 text-blue-300 text-center">
              /host_data/data.csv
            </div>
            <div className="text-center text-indigo-400 font-bold text-xs animate-bounce">
              ↓ cp command ↓
            </div>
            <div className="bg-slate-900 p-2 rounded border border-emerald-500/30 text-emerald-300 text-center">
              /volume_data/data.csv
            </div>
          </div>
          <div className="text-[9px] text-slate-400 text-center">
            Bridges Host FS &amp; Docker Volume
          </div>
        </div>

        <div className="h-56 bg-slate-950 border-2 border-emerald-500/40 rounded-xl p-4 flex flex-col justify-between z-10">
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest border-b border-slate-800 pb-1.5">
            Docker Volumes Area
          </div>
          <div className={`p-2.5 rounded-lg border transition-all duration-500 ${
            phase >= 1 ? 'bg-emerald-950/30 border-emerald-500' : 'bg-slate-900 border-slate-800 opacity-30'
          }`}
          >
            <div className="flex items-center justify-between font-mono text-[11px] text-emerald-300 font-bold">
              <span className="flex items-center gap-1.5"><IconDatabase className="w-3.5 h-3.5" /> ml-input-data</span>
            </div>
            <div className="mt-1.5 min-h-[26px] flex items-center">
              {phase >= 2 ? (
                <div className="w-full bg-amber-950/60 border border-amber-500/50 rounded px-2 py-0.5 font-mono text-[10px] text-amber-300 flex items-center justify-between animate-[fadeIn_0.4s_ease-out]">
                  <span>data.csv</span>
                  <IconCheck className="w-3 h-3 text-emerald-400" />
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 font-mono italic">Empty volume</span>
              )}
            </div>
          </div>
          <div className={`p-2.5 rounded-lg border transition-all duration-500 ${
            phase >= 1 ? 'bg-purple-950/30 border-purple-500/60' : 'bg-slate-900 border-slate-800 opacity-30'
          }`}
          >
            <div className="flex items-center justify-between font-mono text-[11px] text-purple-300 font-bold">
              <span className="flex items-center gap-1.5"><IconDatabase className="w-3.5 h-3.5" /> ml-output-models</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono italic mt-1">Ready for training output</div>
          </div>
        </div>
      </div>

      <div className="bg-black border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 h-24 overflow-y-auto">
        {phase === 0 && <div className="text-slate-500"># Volumes cannot directly see host files. Let&apos;s create and populate them!</div>}
        {phase === 1 && (
          <div>
            <span className="text-emerald-400">$</span> docker volume create ml-input-data<br />
            <span className="text-emerald-400">$</span> docker volume create ml-output-models
          </div>
        )}
        {phase >= 2 && (
          <div>
            <span className="text-emerald-400">$</span> docker run --rm -v ml-input-data:/volume_data -v &quot;$(pwd)/data&quot;:/host_data alpine cp /host_data/data.csv /volume_data/<br />
            {phase === 3 && <span className="text-indigo-400"># Alpine container copied data.csv into ml-input-data and exited (--rm)!</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export function VisualVolumeTraining() {
  const [isTraining, setIsTraining] = useState(false);
  const [trained, setTrained] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const runTraining = () => {
    setIsTraining(true);
    setTrained(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setIsTraining(false);
      setTrained(true);
    }, 2000);
  };

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-hidden">
      <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl mb-4 flex items-center justify-between z-20 pr-36 gap-2">
        <div className="font-mono text-[10px] md:text-xs text-slate-300">
          <span className="text-emerald-400">$</span> docker run --rm -v <span className="text-emerald-400">ml-input-data</span>:/app/data -v <span className="text-purple-400">ml-output-models</span>:/app/output ml-data-practice ...
        </div>
        <button
          type="button"
          onClick={runTraining}
          disabled={isTraining}
          className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-md transition-all shrink-0 ml-2"
        >
          {isTraining ? 'Training...' : trained ? 'Re-Run Training' : 'Run with Volumes'}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-between gap-6 relative my-2 min-h-0">
        <div className="w-5/12 h-full bg-slate-950 border-2 border-slate-700 rounded-xl p-4 flex flex-col justify-between z-10 shadow-xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">
            Docker Managed Storage
          </div>
          <div className={`p-3 rounded-xl border-2 transition-all ${
            isTraining ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-900 border-emerald-500/40'
          }`}
          >
            <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
              <IconDatabase className="w-4 h-4" /> ml-input-data
            </div>
            <div className="mt-2 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800 font-mono text-[11px] text-amber-300 flex items-center justify-between">
              <span>data.csv</span>
              <span className="text-[9px] text-slate-400">Populated</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl border-2 transition-all ${
            trained ? 'bg-purple-950/40 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-slate-900 border-purple-500/40'
          }`}
          >
            <div className="text-xs font-mono font-bold text-purple-400 flex items-center gap-2">
              <IconDatabase className="w-4 h-4" /> ml-output-models
            </div>
            <div className="mt-2 min-h-[30px] flex items-center">
              {trained ? (
                <div className="w-full bg-purple-900/40 px-2.5 py-1.5 rounded border border-purple-400 font-mono text-[11px] text-purple-200 flex items-center justify-between animate-[fadeIn_0.5s_ease-out]">
                  <span className="flex items-center gap-1.5"><IconCheck className="w-3.5 h-3.5 text-purple-300" /> model.joblib</span>
                  <span className="text-[9px] bg-purple-400 text-slate-950 font-bold px-1 rounded">Persisted!</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 font-mono italic">Waiting for model output...</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 h-full relative flex items-center justify-center">
          <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 200 240">
            {(isTraining || trained) && (
              <>
                <path d="M 10,75 L 190,75" stroke="#10b981" strokeWidth="3" strokeDasharray="6,6" className={isTraining ? 'animate-[dash_1s_linear_infinite]' : ''} />
                <text x="100" y="65" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontWeight="bold">Volume Mount (/app/data)</text>
                <path d="M 190,175 L 10,175" stroke="#a855f7" strokeWidth="3" strokeDasharray="6,6" className={isTraining ? 'animate-[dash_1s_linear_infinite]' : ''} />
                <text x="100" y="165" textAnchor="middle" fill="#d8b4fe" fontSize="9" fontWeight="bold">Volume Mount (/app/output)</text>
              </>
            )}
          </svg>
        </div>

        <div className={`w-5/12 h-full rounded-xl p-4 flex flex-col justify-between z-10 transition-all duration-500 border-2 ${
          isTraining
            ? 'bg-slate-950 border-teal-400 shadow-[0_0_25px_rgba(20,184,166,0.3)]'
            : trained
              ? 'bg-slate-950/30 border-dashed border-slate-700 opacity-60'
              : 'bg-slate-950 border-slate-800'
        }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">ml-data-practice</span>
            {isTraining && <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded animate-pulse">Training</span>}
            {trained && <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Exited (--rm)</span>}
          </div>
          <div className="p-2.5 bg-slate-900 rounded-lg border border-emerald-500/30 font-mono text-[11px] text-emerald-300">
            /app/data/data.csv
          </div>
          <div className="my-auto py-3 bg-slate-900 rounded-lg border border-slate-800 flex flex-col items-center">
            <IconCpu className={`w-7 h-7 mb-1 ${isTraining ? 'text-teal-400 animate-spin' : 'text-slate-500'}`} />
            <span className="text-[10px] font-mono text-slate-300">LogisticRegression.fit(X, y)</span>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-lg border border-purple-500/30 font-mono text-[11px] text-purple-300">
            /app/output/model.joblib
          </div>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 flex items-center justify-between">
        <span>
          <strong className="text-teal-400">Notice:</strong> Zero host paths (like <code className="text-slate-400">$(pwd)</code>) were used! This command works identically on Linux, macOS, Windows, or Cloud servers.
        </span>
      </div>
    </div>
  );
}

export function VisualVerifyAndCleanup() {
  const [inspected, setInspected] = useState(false);
  const [volumesRemoved, setVolumesRemoved] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [logs, setLogs] = useState([
    '# Model is saved inside ml-output-models volume. Run commands below to verify or clean up:',
  ]);

  const handleVerify = () => {
    if (volumesRemoved) {
      setLogs((prev) => [...prev, '$ docker run --rm -v ml-output-models:/volume_data alpine ls /volume_data', 'Error: volume ml-output-models not found (already removed)']);
      return;
    }
    setInspected(true);
    setLogs((prev) => [
      ...prev,
      '$ docker run --rm -v ml-output-models:/volume_data alpine ls /volume_data',
      'model.joblib',
    ]);
  };

  const handleRemoveVolumes = () => {
    setVolumesRemoved(true);
    setInspected(false);
    setLogs((prev) => [
      ...prev,
      '$ docker volume rm ml-input-data ml-output-models',
      'ml-input-data',
      'ml-output-models',
    ]);
  };

  const handleRemoveImage = () => {
    setImageRemoved(true);
    setLogs((prev) => [
      ...prev,
      '$ docker image rm ml-data-practice',
      'Untagged: ml-data-practice:latest',
      'Deleted: sha256:9f8e7d6c5b4a...',
    ]);
  };

  const handleReset = () => {
    setInspected(false);
    setVolumesRemoved(false);
    setImageRemoved(false);
    setLogs(['# Sandbox reset! Volume and image restored.']);
  };

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-900 rounded-xl relative overflow-hidden">
      <div className="flex flex-wrap gap-2 mb-4 z-20 pr-36">
        <button
          type="button"
          onClick={handleVerify}
          disabled={volumesRemoved}
          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
        >
          <IconSearch className="w-3.5 h-3.5" /> 1. Verify Volume (Alpine ls)
        </button>
        <button
          type="button"
          onClick={handleRemoveVolumes}
          disabled={volumesRemoved}
          className="px-3 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-30 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
        >
          <IconTrash className="w-3.5 h-3.5" /> 2. docker volume rm
        </button>
        <button
          type="button"
          onClick={handleRemoveImage}
          disabled={imageRemoved}
          className="px-3 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
        >
          <IconTrash className="w-3.5 h-3.5" /> 3. docker image rm
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="ml-auto px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all"
        >
          Reset Lab
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 my-2 flex-1 items-center min-h-0">
        <div className={`h-44 rounded-xl p-4 border-2 flex flex-col justify-between transition-all duration-500 ${
          volumesRemoved ? 'bg-slate-950/20 border-dashed border-slate-800 opacity-30 scale-95' : 'bg-slate-950 border-emerald-500/50 shadow-lg'
        }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Docker Volume</div>
          <div className="flex flex-col items-center my-auto">
            <IconDatabase className="w-8 h-8 text-emerald-400 mb-1" />
            <span className="font-mono text-xs font-bold text-white">ml-input-data</span>
            <span className="font-mono text-[10px] text-amber-300 mt-1">data.csv</span>
          </div>
          <div className="text-[10px] text-center text-slate-500">
            {volumesRemoved ? 'Deleted' : 'Active on Disk'}
          </div>
        </div>

        <div className={`h-44 rounded-xl p-4 border-2 flex flex-col justify-between transition-all duration-500 relative ${
          volumesRemoved
            ? 'bg-slate-950/20 border-dashed border-slate-800 opacity-30 scale-95'
            : inspected
              ? 'bg-indigo-950/30 border-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.3)] scale-105'
              : 'bg-slate-950 border-purple-500/50 shadow-lg'
        }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Docker Volume</span>
            {inspected && !volumesRemoved && (
              <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold animate-pulse">
                Alpine Mounted
              </span>
            )}
          </div>
          <div className="flex flex-col items-center my-auto">
            <IconDatabase className="w-8 h-8 text-purple-400 mb-1" />
            <span className="font-mono text-xs font-bold text-white">ml-output-models</span>
            <span className={`font-mono text-[11px] mt-1 px-2 py-0.5 rounded ${
              inspected ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-purple-300'
            }`}
            >
              model.joblib
            </span>
          </div>
          <div className="text-[10px] text-center text-slate-500">
            {volumesRemoved ? 'Deleted' : 'Verified Persistent'}
          </div>
        </div>

        <div className={`h-44 rounded-xl p-4 border-2 flex flex-col justify-between transition-all duration-500 ${
          imageRemoved ? 'bg-slate-950/20 border-dashed border-slate-800 opacity-30 scale-95' : 'bg-slate-950 border-teal-500/50 shadow-lg'
        }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-teal-400">Docker Image</div>
          <div className="flex flex-col items-center my-auto">
            <IconBox className="w-8 h-8 text-teal-400 mb-1" />
            <span className="font-mono text-xs font-bold text-white">ml-data-practice</span>
            <span className="font-mono text-[10px] text-slate-400 mt-1">python + sklearn</span>
          </div>
          <div className="text-[10px] text-center text-slate-500">
            {imageRemoved ? 'Deleted' : 'Stored Locally'}
          </div>
        </div>
      </div>

      <div className="bg-black border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 h-32 overflow-y-auto flex flex-col gap-1 shadow-inner">
        {logs.map((line, i) => (
          <div
            key={`${line}-${i}`}
            className={
              line.startsWith('$') ? 'text-emerald-400 font-bold mt-1'
                : line.startsWith('#') ? 'text-slate-500 italic'
                  : line === 'model.joblib' ? 'text-teal-300 font-bold bg-teal-950/40 px-2 py-0.5 rounded w-fit'
                    : 'text-slate-300'
            }
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export const VisualBindPractice = VisualBindMountWorkflow;
export const VisualBindVerify = () => <VisualBindMountWorkflow initialStep={3} />;
export const VisualSeedVolume = VisualVolumePopulate;
export const VisualVolumePractice = VisualVolumeTraining;
export const VisualCleanupPractice = VisualVerifyAndCleanup;
