# inkwell-extension

Chrome extension (Manifest V3). Popup lets users save the current tab to Inkwell.

## Dev commands

```bash
npm run build  # production build → .output/chrome-mv3/
npm run dev    # dev mode with hot reload
```

Load `.output/chrome-mv3/` in `chrome://extensions` (Developer mode).

## Stack

- **WXT** (Web Extension Toolkit) — build system, not raw Vite
- React + TypeScript, inline styles throughout
- `entrypoints/popup/` — main save widget
- `entrypoints/options/` — settings page (minimal, just API URL)

## Components

```
components/
  ExtHeader.tsx      ← logo + dark/light toggle button
  IdleView.tsx       ← paste-URL form + recent articles
  ExtractingView.tsx ← SSE progress (fetching → AI summarizing)
  DoneView.tsx       ← result card with tags/summary/open button
  ErrorView.tsx      ← error + retry
  ExtUrlBar.tsx      ← URL pill with status badge
```

## Theme system

**Two-layer approach** (different from web app's pure CSS vars):

1. `lib/theme.ts` — `dark` object for semantic/state colors that **don't change between themes**:
   `primary`, `success`, `warning`, `categoryBg/Border/Text`, `successBg/Border`, `warningBg`
   → Keep using `dark.xxx` for these in components.

2. `lib/styles.css` — CSS custom properties for bg/text/border that **do** change:
   `--bg`, `--text-1`, `--text-2`, `--text-3`, `--surface`, `--border`, `--input-bg`, `--shimmer-bg`, `--tag-bg`
   → Use `var(--xxx)` for these.

`darkMode` state lives in `entrypoints/popup/App.tsx`:
- Persisted to `localStorage` as `inkwell-ext-theme`
- Effect sets `data-theme` on `document.documentElement`
- Passed as props `{ darkMode, toggleDark }` to `ExtHeader`

**Rule**: New colors that vary by theme → CSS var. Fixed semantic colors (success green, primary blue) → `dark.xxx`.

## API connection

Extension hits the Railway URL stored in settings (`getSettings()` from `lib/storage.ts`).
No auth. CORS is open. Calls `/api/pipeline` (SSE) and `/api/articles/*`.

`lib/pipeline.ts` handles SSE streaming — events: `extracted`, `summary_chunk`, `done`, `error`.

## Public assets

- `public/logo.svg` — 32×32 Inkwell logo, served as `/logo.svg`
- `public/fonts/jakarta-variable.woff2` — Plus Jakarta Sans
