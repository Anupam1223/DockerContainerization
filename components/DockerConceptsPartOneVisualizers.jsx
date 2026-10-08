import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, Cloud, Laptop, Server, X } from 'lucide-react';
import { Caption, Frame, StepControls, Terminal, tabClass, useStepper } from './VisualKit';

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25 },
};

function Machine({ icon: Icon, name, detail, status, tone = 'ok' }) {
  const shell = {
    ok: 'border-teal-500/40 bg-teal-950/20',
    bad: 'border-rose-500/50 bg-rose-950/30',
    diff: 'border-amber-400/50 bg-amber-950/20',
  }[tone];
  const ink = { ok: 'text-teal-300', bad: 'text-rose-300', diff: 'text-amber-200' }[tone];

  return (
    <div className={`flex-1 min-w-0 rounded-2xl border p-3 ${shell}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
          <Icon className={`w-4 h-4 ${ink}`} />
          {name}
        </span>
        <span className={`text-[10px] font-bold tracking-wide ${ink}`}>{status}</span>
      </div>
      <p className="mt-2 font-mono text-[11px] text-gray-400">{detail}</p>
    </div>
  );
}

const DRIFT = [
  {
    where: 'Your laptop',
    when: 'Last week',
    lib: 'numpy 1.24',
    status: 'WORKS',
    bad: false,
    caption: 'The same script finishes. Nothing about the code has changed yet.',
  },
  {
    where: 'Your laptop',
    when: 'This week',
    lib: 'numpy 1.26',
    status: 'FAILS',
    bad: true,
    caption: 'One installed library moved. The script did not.',
  },
  {
    where: 'split',
    caption: 'Same model file. The laptop and the server do not share a stack, so they do not share a result.',
  },
  {
    where: 'sealed',
    caption: 'The code, libraries, and config are one image. Both machines run that image.',
  },
];

export function WorksOnMyMachineVisualizer() {
  const stepper = useStepper(DRIFT.length, 1700);
  const beat = DRIFT[stepper.index];
  const split = beat.where === 'split';

  return (
    <Frame
      title="Same script, different stack"
      hint="Press Play. A library version moves, then the model meets another machine."
      footer={<StepControls stepper={stepper} total={DRIFT.length} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <AnimatePresence mode="wait">
          {beat.where === 'sealed' ? (
            <motion.div key="sealed" {...fade} className="w-full max-w-lg flex flex-col items-center gap-3">
              <div className="rounded-full border border-teal-400/40 bg-teal-500/10 px-3 py-1 text-[11px] font-semibold text-teal-200">
                one image · code + libraries + config
              </div>
              <div className="w-full flex gap-3">
                <Machine icon={Laptop} name="Laptop" detail="that image" status="0.91" />
                <Machine icon={Server} name="Server" detail="that image" status="0.91" />
              </div>
            </motion.div>
          ) : split ? (
            <motion.div key="split" {...fade} className="w-full max-w-lg flex flex-col items-center gap-3">
              <div className="rounded-full border border-gray-600 bg-gray-900 px-3 py-1 text-[11px] font-mono text-gray-300">
                train.py · same file
              </div>
              <div className="w-full flex gap-3">
                <Machine icon={Laptop} name="Laptop" detail="numpy 1.24" status="0.91" />
                <Machine icon={Server} name="Server" detail="numpy 1.21" status="0.74" tone="diff" />
              </div>
            </motion.div>
          ) : (
            <motion.div key="solo" className="w-full max-w-sm">
              <div
                className={`rounded-2xl border p-4 transition-colors duration-500 ${
                  beat.bad ? 'border-rose-500/50 bg-rose-950/30' : 'border-teal-500/40 bg-teal-950/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                    <Laptop className={`w-4 h-4 ${beat.bad ? 'text-rose-300' : 'text-teal-300'}`} />
                    {beat.where}
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={beat.status}
                      {...fade}
                      className={`text-[10px] font-bold tracking-wide ${beat.bad ? 'text-rose-300' : 'text-teal-300'}`}
                    >
                      {beat.status}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p key={beat.lib} {...fade} className="mt-3 font-mono text-sm text-gray-200">
                    {beat.lib}
                  </motion.p>
                </AnimatePresence>
              </div>
              <p className="mt-3 text-center text-[11px] uppercase tracking-wider text-gray-500">{beat.when}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <Caption text={beat.caption} />
      </div>
    </Frame>
  );
}

const PACKED = ['train.py', 'Python 3.9', 'ML libraries', 'BLAS / LAPACK', 'config'];

export function PortableImageVisualizer() {
  const stepper = useStepper(PACKED.length + 1, 1100);
  const sealed = stepper.index === PACKED.length;
  const inside = PACKED.slice(0, stepper.index + 1);

  return (
    <Frame
      title="Everything the run needs, in one image"
      hint="Press Play. Each piece joins the image. The last step runs that same image somewhere else."
      footer={<StepControls stepper={stepper} total={PACKED.length + 1} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <AnimatePresence mode="wait">
          {sealed ? (
            <motion.div key="sealed" {...fade} className="w-full max-w-lg flex flex-col items-center gap-3">
              <div className="rounded-full border border-teal-500/40 bg-teal-500/10 px-3 py-1 text-[11px] font-semibold text-teal-200">
                One image
              </div>
              <div className="w-full flex gap-3">
                <Machine icon={Laptop} name="Laptop" detail="that image" status="0.91" />
                <Machine icon={Server} name="Server" detail="that image" status="0.91" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              {...fade}
              className="w-full max-w-xs rounded-2xl border border-dashed border-gray-600 bg-gray-950/50 p-3 min-h-[220px]"
            >
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Image</p>
              <div className="space-y-1.5">
                <AnimatePresence>
                  {inside.map((item) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-sm text-teal-50"
                    >
                      {item}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Caption
          text={
            sealed
              ? 'The server did not install the stack. It ran the image that already had it.'
              : `${inside[inside.length - 1]} is in the image now.`
          }
        />
      </div>
    </Frame>
  );
}

const LAYERS = [
  { name: 'Python', from: '3.9', to: '3.11', result: 'does not start', bad: true, note: 'The interpreter itself moved.' },
  { name: 'ML libraries', from: 'pinned', to: 'newer pins', result: '0.64', bad: true, note: 'TensorFlow, PyTorch, scikit-learn, pandas, or NumPy changed.' },
  { name: 'BLAS / LAPACK', from: 'system', to: 'other build', result: '0.79', bad: true, note: 'Same math, different low-level library, different numbers.' },
  { name: 'Operating system', from: 'Ubuntu', to: 'another OS', result: 'missing lib', bad: true, note: 'A system library the stack expected is gone.' },
  { name: 'CUDA driver', from: 'matched', to: 'other driver', result: 'no GPU', bad: true, note: 'The GPU stack no longer matches the image that trained.' },
];

export function ReproStackVisualizer() {
  const stepper = useStepper(LAYERS.length + 1, 1500);
  const changed = stepper.index === 0 ? null : LAYERS[stepper.index - 1];

  return (
    <Frame
      title="Nudge one layer"
      hint="Press Play, or click a layer. The script stays put. The result does not."
      footer={<StepControls stepper={stepper} total={LAYERS.length + 1} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={changed ? changed.result : 'baseline'}
            {...fade}
            className={`rounded-2xl border px-6 py-3 text-center ${
              changed ? 'border-rose-500/40 bg-rose-950/30' : 'border-teal-500/40 bg-teal-950/20'
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider text-gray-500">Same script</p>
            <p className={`font-mono text-2xl font-bold ${changed ? 'text-rose-200' : 'text-teal-200'}`}>
              {changed ? changed.result : '0.81'}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="w-full max-w-sm space-y-1.5">
          <button
            type="button"
            onClick={() => stepper.pick(0)}
            className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
              stepper.index === 0 ? 'border-teal-400/60 bg-teal-500/10 text-white' : 'border-gray-700 text-gray-400'
            }`}
          >
            Stack unchanged
          </button>
          {LAYERS.map((layer, i) => {
            const on = stepper.index === i + 1;
            return (
              <button
                key={layer.name}
                type="button"
                onClick={() => stepper.pick(i + 1)}
                className={`w-full rounded-xl border px-3 py-2 text-left transition-colors ${
                  on ? 'border-rose-400/60 bg-rose-500/10' : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <span className="flex items-center justify-between gap-3 text-sm">
                  <span className={on ? 'text-white font-semibold' : 'text-gray-300'}>{layer.name}</span>
                  <span className={`font-mono text-[11px] ${on ? 'text-rose-200' : 'text-gray-500'}`}>
                    {on ? `${layer.from} → ${layer.to}` : layer.from}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <Caption text={changed ? changed.note : 'Validation accuracy while every layer stays where the run left it.'} />
      </div>
    </Frame>
  );
}

const HELL = [
  { caption: 'Two projects live on one machine.' },
  { caption: 'They need the same library at two versions.' },
  { caption: 'One system Python cannot hold both.' },
  { caption: 'Each container gets its own Python and its own libraryX.' },
];

function ProjectCard({ name, stack, tint }) {
  return (
    <div className={`flex-1 min-w-0 rounded-2xl border px-3 py-3 ${tint}`}>
      <p className="text-sm font-semibold text-white">{name}</p>
      <p className="mt-1 font-mono text-[11px] text-gray-300">{stack}</p>
    </div>
  );
}

export function DependencyHellVisualizer() {
  const stepper = useStepper(HELL.length, 1600);
  const phase = stepper.index;
  const split = phase === 3;

  return (
    <Frame
      title="One library, two versions"
      hint="Press Play. The clash appears when both projects share a Python, and it leaves when they do not."
      footer={<StepControls stepper={stepper} total={HELL.length} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <AnimatePresence mode="wait">
          {split ? (
            <motion.div key="split" {...fade} className="w-full max-w-lg flex gap-3">
              <div className="flex-1 rounded-2xl border border-amber-400/40 bg-amber-500/10 p-3 space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-amber-200">Container A</p>
                <p className="text-sm font-semibold text-white">Project A</p>
                <p className="font-mono text-[11px] text-amber-100">TensorFlow 2.5</p>
                <p className="font-mono text-[11px] text-amber-100">libraryX 1.0</p>
                <p className="font-mono text-[11px] text-gray-300">its own Python</p>
              </div>
              <div className="flex-1 rounded-2xl border border-violet-400/40 bg-violet-500/10 p-3 space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-violet-200">Container B</p>
                <p className="text-sm font-semibold text-white">Project B</p>
                <p className="font-mono text-[11px] text-violet-100">PyTorch 1.9</p>
                <p className="font-mono text-[11px] text-violet-100">libraryX 2.0</p>
                <p className="font-mono text-[11px] text-gray-300">its own Python</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="host" {...fade} className="w-full max-w-lg flex flex-col items-center gap-3">
              <div className="w-full flex gap-3">
                <ProjectCard name="Project A" stack="TensorFlow 2.5" tint="border-amber-400/30 bg-amber-500/5" />
                <ProjectCard name="Project B" stack="PyTorch 1.9" tint="border-violet-400/30 bg-violet-500/5" />
              </div>
              <div className="w-full flex gap-3 min-h-[36px]">
                {phase >= 1 && (
                  <>
                    <motion.div {...fade} className="flex-1 text-center font-mono text-[11px] text-amber-200">
                      libraryX 1.0
                    </motion.div>
                    <motion.div {...fade} className="flex-1 text-center font-mono text-[11px] text-violet-200">
                      libraryX 2.0
                    </motion.div>
                  </>
                )}
              </div>
              <AnimatePresence>
                {phase >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full rounded-2xl border border-rose-500/50 bg-rose-950/40 px-3 py-3 flex items-center justify-between"
                  >
                    <span className="text-sm text-white">System Python</span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-rose-300">
                      <X className="w-3.5 h-3.5" />
                      conflict
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
        <Caption text={HELL[phase].caption} />
      </div>
    </Frame>
  );
}

const PLACES = [
  { name: 'Laptop', icon: Laptop, host: 'macOS' },
  { name: 'CI', icon: Server, host: 'Linux' },
  { name: 'Cloud', icon: Cloud, host: 'hosted' },
];

export function SameImageVisualizer() {
  const stepper = useStepper(PLACES.length, 1400);

  return (
    <Frame
      title="One image, three homes"
      hint="Press Play. The hosts differ. The score does not, because each one runs the image."
      footer={<StepControls stepper={stepper} total={PLACES.length} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="w-full max-w-lg grid grid-cols-3 gap-2">
          {PLACES.map((place, i) => {
            const on = i <= stepper.index;
            const Icon = place.icon;
            return (
              <button
                key={place.name}
                type="button"
                onClick={() => stepper.pick(i)}
                className={`rounded-2xl border p-3 text-left transition-all ${
                  on ? 'border-teal-400/50 bg-teal-950/30' : 'border-gray-800 bg-gray-950/40 opacity-50'
                }`}
              >
                <Icon className={`w-4 h-4 mb-2 ${on ? 'text-teal-300' : 'text-gray-600'}`} />
                <p className="text-sm font-semibold text-white">{place.name}</p>
                <p className="text-[10px] text-gray-500">{place.host}</p>
                <div className="mt-3 h-10">
                  {on && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                      <p className="font-mono text-[10px] text-teal-200/80">image</p>
                      <p className="font-mono text-lg font-bold text-teal-200">0.91</p>
                    </motion.div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <Caption text="Developing, testing, and serving are the same image on different hosts." />
      </div>
    </Frame>
  );
}

const SETUP = ['Install Python 3.9', 'Create a virtualenv', 'pip install the pinned set', 'Export the env vars'];

export function CollaborationVisualizer() {
  const stepper = useStepper(SETUP.length, 1300);
  const handed = stepper.index === SETUP.length - 1;

  return (
    <Frame
      title="Setup notes, then one command"
      hint="Press Play. The new person gets stuck on the install. The last step hands them the image instead."
      footer={<StepControls stepper={stepper} total={SETUP.length} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <AnimatePresence mode="wait">
          {handed ? (
            <motion.div key="run" {...fade} className="w-full max-w-sm text-center">
              <div className="rounded-2xl border border-teal-500/40 bg-gray-950 px-4 py-4">
                <p className="font-mono text-sm text-teal-100">docker run …</p>
              </div>
              <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal-300">
                <Check className="w-3.5 h-3.5" />
                same environment
              </p>
            </motion.div>
          ) : (
            <motion.div key="list" {...fade} className="w-full max-w-sm space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Notes for a new teammate</p>
              {SETUP.map((line, i) => {
                const reached = i <= stepper.index;
                const failed = reached && i === 2 && stepper.index >= 2;
                return (
                  <div
                    key={line}
                    className={`rounded-xl border px-3 py-2 text-sm flex items-center justify-between gap-2 ${
                      failed
                        ? 'border-rose-500/50 bg-rose-950/30 text-rose-100'
                        : reached
                          ? 'border-gray-600 bg-gray-900 text-gray-100'
                          : 'border-gray-800 text-gray-600'
                    }`}
                  >
                    <span>{line}</span>
                    {failed && <AlertTriangle className="w-3.5 h-3.5 text-rose-300 shrink-0" />}
                    {reached && !failed && <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        <Caption
          text={
            handed
              ? 'They pull the image and run it. They do not rebuild your laptop by hand.'
              : stepper.index >= 2
                ? 'libraryX on their machine is already a different version. The notes stop here.'
                : 'Sharing the project used to mean sharing this list.'
          }
        />
      </div>
    </Frame>
  );
}

const SCALE = [
  { copies: 1, hot: false, caption: 'One container is the API.' },
  { copies: 1, hot: true, caption: 'More requests arrive. That single container is the limit.' },
  { copies: 3, hot: false, caption: 'More copies of the same image. The image did not change.' },
];

export function ScaleVisualizer() {
  const stepper = useStepper(SCALE.length, 1500);
  const beat = SCALE[stepper.index];

  return (
    <Frame
      title="Copy the image, not the setup"
      hint="Press Play. Load rises on one container, then two more copies of the same image take it."
      footer={<StepControls stepper={stepper} total={SCALE.length} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-500 mb-1">
            <span>Waiting requests</span>
            <span>{beat.hot ? 'piling up' : 'steady'}</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
            <motion.div
              className={`h-full ${beat.hot ? 'bg-amber-400' : 'bg-teal-400'}`}
              animate={{ width: beat.hot ? '100%' : '32%' }}
              transition={{ duration: 0.45 }}
            />
          </div>
        </div>

        <div className="flex items-end justify-center gap-2 min-h-[120px]">
          <AnimatePresence>
            {Array.from({ length: beat.copies }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                className={`w-24 rounded-2xl border px-2 py-3 text-center ${
                  beat.hot ? 'border-amber-400/60 bg-amber-950/30' : 'border-teal-500/40 bg-teal-950/20'
                }`}
              >
                <p className="text-[10px] text-gray-400">image</p>
                <p className="text-xs font-semibold text-white mt-1">API</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <Caption text={beat.caption} />
      </div>
    </Frame>
  );
}

const BUNDLE = [
  { name: 'train.py', detail: 'training or inference script' },
  { name: 'Python 3.9', detail: 'the interpreter pinned' },
  { name: 'tensorflow · pandas', detail: 'libraries at exact versions' },
  { name: 'system tools', detail: 'BLAS, compilers, CA certs' },
  { name: 'config', detail: 'env vars and settings' },
];

export function WhatIsAnImageVisualizer() {
  const stepper = useStepper(BUNDLE.length + 1, 1200);
  const running = stepper.index === BUNDLE.length;
  const packed = BUNDLE.slice(0, Math.min(stepper.index + 1, BUNDLE.length));

  return (
    <Frame
      title="A read-only package, then a running instance"
      hint="Press Play. The image fills with what an ML run needs. The last step stamps a container from it."
      footer={<StepControls stepper={stepper} total={BUNDLE.length + 1} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="w-full max-w-sm rounded-2xl border border-gray-600 bg-gray-950/60 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-wider text-gray-500">Image · read-only</p>
            <p className="text-[10px] font-mono text-gray-500">like a class</p>
          </div>
          <div className="space-y-1.5">
            <AnimatePresence>
              {packed.map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1.5"
                >
                  <p className="text-sm text-white">{item.name}</p>
                  <p className="text-[11px] text-gray-400">{item.detail}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {running && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-sm rounded-2xl border border-cyan-400/50 bg-cyan-950/30 px-3 py-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Container</p>
                <p className="text-[10px] font-mono text-cyan-200">like an object</p>
              </div>
              <p className="mt-1 text-[11px] text-gray-400">A running instance of that image. The image itself did not change.</p>
            </motion.div>
          )}
        </AnimatePresence>
        <Caption
          text={
            running
              ? 'docker run takes the template and starts a process. The image stays. The container is the live copy.'
              : packed[packed.length - 1]
                ? `${packed[packed.length - 1].name} is inside the template.`
                : 'An image is the blueprint.'
          }
        />
      </div>
    </Frame>
  );
}

const STACK = [
  { name: 'Base OS', cmd: 'FROM ubuntu:22.04' },
  { name: 'Python runtime', cmd: 'RUN apt-get install python3' },
  { name: 'ML libraries', cmd: 'RUN pip install tensorflow' },
  { name: 'Application code', cmd: 'COPY train.py' },
];

export function LayerStackVisualizer() {
  const stepper = useStepper(STACK.length + 1, 1300);
  const running = stepper.index === STACK.length;
  const shown = STACK.slice(0, Math.min(stepper.index + 1, STACK.length));

  return (
    <Frame
      title="Each instruction is a layer"
      hint="Press Play. Layers stack from the base OS up. The last step is docker run, which adds a thin writable layer."
      footer={<StepControls stepper={stepper} total={STACK.length + 1} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <div className="w-full max-w-sm flex flex-col-reverse gap-1.5">
          {shown.map((layer, i) => {
            const on = !running && i === stepper.index;
            return (
              <motion.div
                key={layer.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl border px-3 py-2 ${
                  on ? 'border-teal-400/70 bg-teal-500/15' : 'border-gray-700 bg-gray-900/70'
                }`}
              >
                <p className="text-sm font-semibold text-white">{layer.name}</p>
                <p className="font-mono text-[11px] text-gray-400">{layer.cmd}</p>
              </motion.div>
            );
          })}
          <AnimatePresence>
            {running && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-dashed border-cyan-400/60 bg-cyan-950/20 px-3 py-2"
              >
                <p className="text-sm font-semibold text-cyan-100">Writable layer</p>
                <p className="font-mono text-[11px] text-cyan-300/80">docker run image_name</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Caption
          text={
            running
              ? 'The image layers stay read-only. Logs, temp files, and config edits land in this extra layer.'
              : `${STACK[Math.min(stepper.index, STACK.length - 1)].name} is a new layer on top of everything below it.`
          }
        />
      </div>
    </Frame>
  );
}

const CACHE = [
  { caption: 'First build. Every layer is new.' },
  { caption: 'You change train.py. The layers under it are still valid.' },
  { caption: 'Docker reuses the cache and rebuilds only the code layer.' },
];

export function LayerCacheVisualizer() {
  const stepper = useStepper(CACHE.length, 1600);
  const phase = stepper.index;

  return (
    <Frame
      title="Change one line, rebuild one layer"
      hint="Press Play. The OS and library layers stay cached. Only the application layer rebuilds."
      footer={<StepControls stepper={stepper} total={CACHE.length} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="w-full max-w-sm flex flex-col-reverse gap-1.5">
          {STACK.map((layer, i) => {
            const rebuilt = phase === 2 && i === 3;
            const cached = phase === 2 && i < 3;
            const dirty = phase === 1 && i === 3;
            return (
              <div
                key={layer.name}
                className={`rounded-xl border px-3 py-2 transition-colors duration-500 ${
                  rebuilt
                    ? 'border-amber-400/70 bg-amber-500/15'
                    : cached
                      ? 'border-teal-400/50 bg-teal-500/10'
                      : dirty
                        ? 'border-amber-400/50 bg-amber-950/30'
                        : 'border-gray-700 bg-gray-900/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-white">{layer.name}</p>
                  <span className="text-[10px] font-mono uppercase tracking-wide text-gray-400">
                    {rebuilt ? 'rebuild' : cached ? 'cached' : dirty ? 'changed' : 'build'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <Caption text={CACHE[phase].caption} />
      </div>
    </Frame>
  );
}

export function LayerShareVisualizer() {
  const stepper = useStepper(2, 1500);
  const sharing = stepper.index === 1;

  return (
    <Frame
      title="Two images, one base"
      hint="Press Play. Training and serving share the OS and the CUDA stack. Only the top layer differs."
      footer={<StepControls stepper={stepper} total={2} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="w-full max-w-md grid grid-cols-2 gap-3">
          {['train', 'serve'].map((kind) => (
            <div key={kind} className="flex flex-col-reverse gap-1.5">
              {['ubuntu + CUDA', 'Python 3.10', kind === 'train' ? 'train.py' : 'serve.py'].map((name, i) => {
                const shared = sharing && i < 2;
                return (
                  <motion.div
                    key={name}
                    animate={{
                      borderColor: shared ? 'rgba(45, 212, 191, 0.55)' : 'rgba(55, 65, 81, 1)',
                    }}
                    className={`rounded-xl border px-2 py-2 text-center text-[12px] ${
                      shared ? 'bg-teal-500/10 text-teal-100' : 'bg-gray-900/70 text-gray-200'
                    }`}
                  >
                    {name}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
        <Caption
          text={
            sharing
              ? 'Those two lower layers live once on disk. Both images point at them.'
              : 'Two ML images. They look independent until you look at the layers.'
          }
        />
      </div>
    </Frame>
  );
}

const BASES = [
  {
    name: 'python:3.10-slim-bullseye',
    kind: 'Official Python',
    note: 'Small Debian plus that interpreter. Enough for a plain training script.',
  },
  {
    name: 'ubuntu:22.04',
    kind: 'OS image',
    note: 'A full Linux userland when you need system tools the slim Python image does not ship.',
  },
  {
    name: 'nvidia/cuda:12.1.1',
    kind: 'Vendor GPU',
    note: 'CUDA drivers and libraries already in the base. Then you add TensorFlow or PyTorch.',
  },
];

export function BaseImageVisualizer() {
  const stepper = useStepper(BASES.length, 1800);
  const pick = BASES[stepper.index];

  return (
    <Frame
      title="Every image starts FROM something"
      hint="Press Play, or click a base. The rest of the Dockerfile sits on top of this choice."
      footer={<StepControls stepper={stepper} total={BASES.length} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="w-full max-w-md space-y-1.5">
          {BASES.map((base, i) => {
            const on = i === stepper.index;
            return (
              <button
                key={base.name}
                type="button"
                onClick={() => stepper.pick(i)}
                className={`w-full text-left rounded-xl border px-3 py-2 ${
                  on ? 'border-teal-400/60 bg-teal-500/10' : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <p className={`text-[10px] uppercase tracking-wider ${on ? 'text-teal-300' : 'text-gray-500'}`}>
                  {base.kind}
                </p>
                <p className="font-mono text-sm text-white">{base.name}</p>
              </button>
            );
          })}
        </div>
        <Caption text={pick.note} />
      </div>
    </Frame>
  );
}

const VS = [
  { caption: 'The image is the recipe. Nothing is running yet.' },
  { caption: 'docker run stamps a container from it. The image stays.' },
  { caption: 'Logs and temp files write into a thin layer on top of the image.' },
  { caption: 'Delete the container and that writable layer is gone. The image is still there.' },
];

export function ImageVsContainerVisualizer() {
  const stepper = useStepper(VS.length, 1600);
  const phase = stepper.index;
  const alive = phase === 1 || phase === 2;

  return (
    <Frame
      title="Recipe, then a meal"
      hint="Press Play. A container appears, writes a log, then disappears. The image never moves."
      footer={<StepControls stepper={stepper} total={VS.length} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="w-full max-w-sm rounded-2xl border border-gray-600 bg-gray-950 px-3 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Image</p>
            <p className="text-[10px] font-mono text-gray-400">read-only</p>
          </div>
          <p className="mt-1 font-mono text-[11px] text-gray-500">python · tensorflow · train.py</p>
        </div>

        <AnimatePresence>
          {(alive || phase === 3) && (
            <motion.div
              key={phase === 3 ? 'gone' : 'box'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: phase === 3 ? 0.35 : 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`w-full max-w-sm rounded-2xl border px-3 py-3 ${
                phase === 3
                  ? 'border-dashed border-gray-700 bg-transparent'
                  : 'border-cyan-400/50 bg-cyan-950/30'
              }`}
            >
              {phase === 3 ? (
                <p className="text-sm text-gray-500">Container removed</p>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">Container</p>
                    <p className="text-[10px] font-mono text-cyan-200">running</p>
                  </div>
                  <AnimatePresence>
                    {phase === 2 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 font-mono text-[11px] text-cyan-100"
                      >
                        + /tmp/epoch.log
                      </motion.p>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <Caption text={VS[phase].caption} />
      </div>
    </Frame>
  );
}

const IMMUTABLE = [
  { caption: 'The built image is frozen. Its ID is the environment you ran.' },
  { caption: 'You cannot patch Python or the model inside that image.' },
  { caption: 'Change the Dockerfile or the source, then build again.' },
  { caption: 'The new image has a new ID. Anyone who pulls it gets that stack, not a patched one.' },
];

export function ImmutabilityVisualizer() {
  const stepper = useStepper(IMMUTABLE.length, 1600);
  const phase = stepper.index;

  return (
    <Frame
      title="Do not edit an image. Build a new one."
      hint="Press Play. An in-place edit is refused. A rebuild produces a different ID."
      footer={<StepControls stepper={stepper} total={IMMUTABLE.length} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="w-full max-w-sm space-y-2">
          <div
            className={`rounded-2xl border px-3 py-3 ${
              phase >= 3 ? 'border-gray-700 opacity-40' : 'border-teal-500/40 bg-teal-950/20'
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider text-gray-500">Image</p>
            <p className="font-mono text-sm text-white">sha256:abc123</p>
          </div>

          <AnimatePresence mode="wait">
            {phase === 1 && (
              <motion.div
                key="block"
                {...fade}
                className="rounded-2xl border border-rose-500/50 bg-rose-950/30 px-3 py-3 flex items-center justify-between"
              >
                <span className="text-sm text-rose-100">edit numpy in place</span>
                <X className="w-4 h-4 text-rose-300" />
              </motion.div>
            )}
            {phase === 2 && (
              <motion.div key="src" {...fade} className="rounded-2xl border border-amber-400/40 bg-amber-950/20 px-3 py-3">
                <p className="text-sm text-amber-100">Dockerfile + train.py changed</p>
              </motion.div>
            )}
            {phase === 3 && (
              <motion.div key="new" {...fade} className="rounded-2xl border border-teal-400/50 bg-teal-950/30 px-3 py-3">
                <p className="text-[10px] uppercase tracking-wider text-teal-300">New image</p>
                <p className="font-mono text-sm text-white">sha256:def456</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Caption text={IMMUTABLE[phase].caption} />
      </div>
    </Frame>
  );
}

const FLAGS = [
  {
    flag: 'docker run my-ml-app',
    title: 'Just the image name',
    visual: 'A container starts in the foreground and holds the terminal.',
    lines: [{ kind: 'cmd', text: 'docker run my-ml-app' }, { kind: 'out', text: 'training epoch 1 …' }],
  },
  {
    flag: '-d',
    title: 'Detached',
    visual: 'The command prints an ID and gives the terminal back. Training or the API keeps running.',
    lines: [
      { kind: 'cmd', text: 'docker run -d my-ml-app' },
      { kind: 'ok', text: 'a1b2c3d4e5f6' },
    ],
  },
  {
    flag: '-it',
    title: 'Interactive shell',
    visual: 'You are inside the container. Type exit to leave and stop it.',
    lines: [
      { kind: 'cmd', text: 'docker run -it python:3.9-slim /bin/bash' },
      { kind: 'info', text: 'root@a1b2c3:/#' },
    ],
  },
  {
    flag: '--rm',
    title: 'Remove when it exits',
    visual: 'A one-shot training job finishes and the container is gone. Nothing to clean up.',
    lines: [
      { kind: 'cmd', text: 'docker run --rm my-training-image python train.py --epochs 10' },
      { kind: 'ok', text: 'done. container removed.' },
    ],
  },
  {
    flag: '--name',
    title: 'A name you can find',
    visual: 'Later commands use inference_api instead of a random ID.',
    lines: [
      { kind: 'cmd', text: 'docker run -d --name inference_api my-inference-image' },
      { kind: 'ok', text: 'named: inference_api' },
    ],
  },
  {
    flag: '-p',
    title: 'Publish a port',
    visual: 'The host’s 8080 forwards to port 80 in the container, so a browser can hit the API.',
    lines: [
      { kind: 'cmd', text: 'docker run -d -p 8080:80 --name web_server nginx' },
      { kind: 'info', text: 'localhost:8080  →  container:80' },
    ],
  },
];

export function DockerRunFlagsVisualizer() {
  const stepper = useStepper(FLAGS.length, 2000);
  const beat = FLAGS[stepper.index];

  return (
    <Frame
      title="Same command, different flags"
      hint="Press Play, or click a flag. Each one changes what docker run does with the container."
      footer={<StepControls stepper={stepper} total={FLAGS.length} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="flex flex-wrap justify-center gap-1.5">
          {FLAGS.map((item, i) => (
            <button key={item.flag} type="button" className={tabClass(i === stepper.index)} onClick={() => stepper.pick(i)}>
              {item.flag}
            </button>
          ))}
        </div>
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div key={beat.flag} {...fade}>
              <Terminal title={beat.title} lines={beat.lines} />
            </motion.div>
          </AnimatePresence>
        </div>
        <Caption text={beat.visual} />
      </div>
    </Frame>
  );
}

const MANAGE = [
  {
    caption: 'docker ps shows what is running now.',
    rows: [{ name: 'inference_api', state: 'Up', image: 'my-inference' }],
    cmd: 'docker ps',
  },
  {
    caption: 'docker ps -a also lists stopped jobs: a finished training run, a crash.',
    rows: [
      { name: 'inference_api', state: 'Up', image: 'my-inference' },
      { name: 'old_experiment', state: 'Exited', image: 'train' },
    ],
    cmd: 'docker ps -a',
  },
  {
    caption: 'docker stop inference_api sends SIGTERM, then SIGKILL if it does not leave.',
    rows: [
      { name: 'inference_api', state: 'Exited', image: 'my-inference' },
      { name: 'old_experiment', state: 'Exited', image: 'train' },
    ],
    cmd: 'docker stop inference_api',
  },
  {
    caption: 'docker start inference_api brings that same writable layer back.',
    rows: [
      { name: 'inference_api', state: 'Up', image: 'my-inference' },
      { name: 'old_experiment', state: 'Exited', image: 'train' },
    ],
    cmd: 'docker start inference_api',
  },
  {
    caption: 'docker rm old_experiment deletes a stopped container. docker container prune deletes all of them.',
    rows: [{ name: 'inference_api', state: 'Up', image: 'my-inference' }],
    cmd: 'docker rm old_experiment',
  },
];

function ManageRange({ from, to, title, hint }) {
  const beats = MANAGE.slice(from, to);
  const stepper = useStepper(beats.length, 1800);
  const beat = beats[stepper.index];

  return (
    <Frame
      title={title}
      hint={hint}
      footer={<StepControls stepper={stepper} total={beats.length} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <p className="font-mono text-xs text-teal-200">{beat.cmd}</p>
        <div className="w-full max-w-md rounded-2xl border border-gray-700 overflow-hidden">
          <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] uppercase tracking-wider text-gray-500 bg-gray-900/80">
            <span>Name</span>
            <span>Status</span>
            <span>Image</span>
          </div>
          <AnimatePresence mode="popLayout">
            {beat.rows.map((row) => (
              <motion.div
                key={row.name}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-3 px-3 py-2 text-sm border-t border-gray-800"
              >
                <span className="font-mono text-gray-200 truncate">{row.name}</span>
                <span className={row.state === 'Up' ? 'text-teal-300' : 'text-gray-500'}>{row.state}</span>
                <span className="text-gray-400 truncate">{row.image}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <Caption text={beat.caption} />
      </div>
    </Frame>
  );
}

export function PsVisualizer() {
  return (
    <ManageRange
      from={0}
      to={2}
      title="Running, then everything"
      hint="Press Play. docker ps, then docker ps -a."
    />
  );
}

export function StopStartVisualizer() {
  return (
    <ManageRange
      from={1}
      to={4}
      title="Stop, then start the same container"
      hint="Press Play. inference_api stops and comes back with the same name."
    />
  );
}

export function RemoveVisualizer() {
  return (
    <ManageRange
      from={3}
      to={5}
      title="Remove what you are finished with"
      hint="Press Play. old_experiment leaves. inference_api stays."
    />
  );
}

const LOG_LINES = [
  { kind: 'dim', text: '# docker logs inference_api' },
  { kind: 'out', text: 'loaded model.pkl' },
  { kind: 'out', text: 'listening on :80' },
  { kind: 'out', text: 'POST /predict  200' },
  { kind: 'cmd', text: 'docker logs -f training_job_1' },
  { kind: 'out', text: 'epoch 1  loss 0.82' },
  { kind: 'out', text: 'epoch 2  loss 0.61' },
  { kind: 'out', text: 'epoch 3  loss 0.44' },
];

export function LogsVisualizer() {
  const stepper = useStepper(LOG_LINES.length, 900);

  return (
    <Frame
      title="The process is detached. The logs are how you see it."
      hint="Press Play. First a snapshot of inference_api, then a follow on a training job."
      footer={<StepControls stepper={stepper} total={LOG_LINES.length} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="w-full max-w-md">
          <Terminal title="docker logs" lines={LOG_LINES.slice(0, stepper.index + 1)} />
        </div>
        <Caption
          text={
            stepper.index < 4
              ? 'stdout and stderr of the main process, after the fact.'
              : ' -f keeps printing, like tail -f. Ctrl+C stops following, not the container.'
          }
        />
      </div>
    </Frame>
  );
}

const LIFE = [
  { state: 'Created', cmd: 'docker create  (often inside docker run)', caption: 'The container exists. It is not executing yet.' },
  { state: 'Running', cmd: 'docker start  or  docker run', caption: 'The main process is alive: training, or the API.' },
  { state: 'Stopped', cmd: 'docker stop  or the process exits', caption: 'The writable layer is still on disk. docker start can bring it back.' },
  { state: 'Removed', cmd: 'docker rm  or  docker run --rm', caption: 'The container is gone. The image is not.' },
];

const ADV = [
  { caption: 'Change the app. Docker rebuilds that layer and leaves the ones under it cached.' },
  { caption: 'Two images share the CUDA base. That layer is stored once.' },
  { caption: 'Almost all of the size is the ML library layer.' },
];

export function LayerAdvantagesVisualizer() {
  const stepper = useStepper(ADV.length, 1700);
  const phase = stepper.index;

  return (
    <Frame
      title="Cache, share, size"
      hint="Press Play. Same stack, three things layers change."
      footer={<StepControls stepper={stepper} total={ADV.length} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        {phase === 1 ? (
          <div className="w-full max-w-md grid grid-cols-2 gap-3">
            {['train', 'serve'].map((kind) => (
              <div key={kind} className="flex flex-col-reverse gap-1.5">
                {['CUDA base', 'Python', kind].map((name, i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`rounded-xl border px-2 py-2 text-center text-xs ${
                      i < 2 ? 'border-teal-400/50 bg-teal-500/15 text-teal-100' : 'border-gray-600 bg-gray-900 text-white'
                    }`}
                  >
                    {name}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full max-w-xs flex flex-col-reverse gap-1.5">
            {[
              { name: 'Base OS', grow: false },
              { name: 'Python', grow: false },
              { name: 'ML libraries', grow: phase === 2 },
              { name: 'train.py', grow: false, hot: phase === 0 },
            ].map((layer) => (
              <motion.div
                key={layer.name}
                animate={{ height: layer.grow ? 72 : 40 }}
                className={`rounded-xl border px-3 flex items-center justify-between ${
                  layer.hot
                    ? 'border-amber-400/70 bg-amber-500/15'
                    : layer.grow
                      ? 'border-rose-400/40 bg-rose-950/30'
                      : 'border-gray-700 bg-gray-900/70'
                }`}
              >
                <span className="text-sm text-white">{layer.name}</span>
                <span className="text-[10px] font-mono text-gray-400">
                  {layer.hot ? 'rebuild' : layer.grow ? 'most of the image' : 'cached'}
                </span>
              </motion.div>
            ))}
          </div>
        )}
        <Caption text={ADV[phase].caption} />
      </div>
    </Frame>
  );
}

export function LifecycleVisualizer() {
  const stepper = useStepper(LIFE.length, 1600);

  return (
    <Frame
      title="Four states, the commands between them"
      hint="Press Play. Each step is the command that moved the container."
      footer={<StepControls stepper={stepper} total={LIFE.length} />}
    >
      <div className="h-full flex flex-col items-center justify-center gap-5">
        <div className="w-full max-w-lg flex items-center justify-between gap-1">
          {LIFE.map((node, i) => {
            const on = i === stepper.index;
            const done = i < stepper.index;
            return (
              <React.Fragment key={node.state}>
                <button
                  type="button"
                  onClick={() => stepper.pick(i)}
                  className={`rounded-full px-3 py-2 text-xs font-semibold border transition-colors ${
                    on
                      ? 'border-teal-400 bg-teal-500/20 text-white'
                      : done
                        ? 'border-teal-800 text-teal-200/80'
                        : 'border-gray-700 text-gray-500'
                  }`}
                >
                  {node.state}
                </button>
                {i < LIFE.length - 1 && (
                  <div className={`h-px flex-1 ${done ? 'bg-teal-700' : 'bg-gray-800'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <p className="font-mono text-xs text-teal-200 text-center">{LIFE[stepper.index].cmd}</p>
        <Caption text={LIFE[stepper.index].caption} />
      </div>
    </Frame>
  );
}
