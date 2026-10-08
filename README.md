# Docker

Visualized React slide deck. Same architecture as ML FastAPI: topics are files, slides live inside those files.

## Quick start

```bash
npm install
npm run dev
```

## Mental model

```
App.jsx (topic shell)
  └── sections/TopicNameN.jsx   ← auto-discovered, ordered by N
        └── ChapterDeck (shared)
              └── slide content + Visual component
```

- **Top bar** — switch topics (Prev / Next / dropdown)
- **Bottom bar** — switch slides inside the current topic (arrow keys also work)

## Add a new topic

1. Create `sections/YourTopicNameN.jsx` — PascalCase, trailing number `N` sets the order
2. Export `meta`, define slides, and default-export a `<ChapterDeck />`

```jsx
import ChapterDeck from '../components/ChapterDeck';

export const meta = { title: 'Images and Containers', subtitle: 'Recipe vs running process' };

function ImageVisual() {
  return <div className="p-6 text-white">Visual goes here.</div>;
}

const slides = [
  {
    id: 'image',
    title: 'Image vs container',
    subtitle: 'A recipe and a running meal',
    Visual: ImageVisual,
    content: <p className="text-sm text-gray-300">Explain the idea here.</p>,
  },
];

export default function ImagesAndContainers() {
  return <ChapterDeck slides={slides} />;
}
```

No changes to `App.jsx` needed — Vite's `import.meta.glob` picks up new files.

`components/Slideshow.jsx` is the alternate chrome: full-bleed slides, no split panel. Pass `slides={[{ component: Slide, title: 'Intro' }]}`.

A section must not render its own page shell (`min-h-screen`, header, Prev/Next, progress bar). `App.jsx` and `ChapterDeck` provide those.

## Stack

- Vite + React 18
- Tailwind CSS + `tailwindcss-animate`
- framer-motion (slide transitions)
- recharts (plots)
- lucide-react (icons)

## Folder layout

```
├── App.jsx                 # Topic shell + discovery
├── main.jsx                # React entry
├── index.html / index.css
├── components/
│   ├── ChapterDeck.jsx     # Split-panel slide chrome
│   ├── Slideshow.jsx       # Full-bleed slide chrome
│   ├── CodeBlock.jsx
│   ├── VisualKit.jsx       # Frame, Terminal, steppers
│   └── DockerConceptsPartOneVisualizers.jsx
└── sections/
    └── DockerConceptsForMachineLearningPartOne1.jsx
```
# DockerContainerization
