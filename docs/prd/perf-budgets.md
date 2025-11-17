# Tagwaye Frontend Performance Budgets

## 1. Primary Experience Targets
- **Initial view (dashboard route):** Largest Contentful Paint ≤ 2.0s on M1 MBP (Chrome, throttled Fast 3G, 4× CPU slowdown).
- **Time-to-interaction:** ≤ 2000 ms to first responsive click within Universal Canvas.
- **Timeline interaction:** Scrubber drag-to-render latency ≤ 120 ms (includes Zustand update + ECharts redraw).
- **Scene Canvas (FRAG viewer):** Maintain ≥ 45 fps for 100k triangle scene on M1 MBP, ≥ 30 fps on Surface Laptop 4.
- **Panel pane switch:** Content swap and drawer animation ≤ 50 ms (excluding data fetch).
- **Sidebar hover expand:** 250 ms transition with <16 ms blocking per frame.

## 2. Network Budgets
- **JS bundle (dashboard route):** ≤ 1.5 MB gzipped (Next.js chunks + vendor). Track via `next build --analyze`.
- **Data fetch budgets:**
  - Project summary: ≤ 150 ms P95 (mocked now, API later).
  - Timeline snapshot payload: ≤ 300 ms P95, payload ≤ 120 KB.
  - System status heartbeat: ≤ 120 ms P95, payload ≤ 10 KB.
- **Image/static assets:** All chrome icons use Lucide (SVG). No raster assets in chrome shell.

## 3. Measuring & Tooling
- **Automated:** Add `npm run lint` (already) and `npm run storybook -- --smoke-test` to CI gate. Add `npm run test:perf` placeholder to run Lighthouse CI (todo once backend ready).
- **Manual Benchmarks:** Use Chrome DevTools Performance + Lighthouse for every milestone; log results in `/docs/prd/perf-budgets.md#runs`.
- **Scene Canvas:** Use Three.js stats overlay (dev-only) to capture fps + draw calls.
- **Timeline:** Run React Profiler (flame chart) while scrubbing; snapshot kept in `/docs/perf/`.

## 4. Degradation & Guards
- Respect `prefers-reduced-motion`: disable expensive Framer transitions automatically.
- When FRAG viewer drops below 30 fps for ≥ 3s, show “Performance Safe Mode” banner and pause AI overlay transitions.
- Fallback timeline visualization to sparklines (no area fill) if device memory API reports < 2 GB available.

## 5. Next Steps
1. Wire Lighthouse CI via GitHub Action (`lhci autorun`) once repo connected.
2. Add `usePerformanceBudget` hook to log runtime metrics to `console.table` in dev mode.
3. Capture baseline numbers after integrating real data (backend sprint) and update this document with dated runs.

