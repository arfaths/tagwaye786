# Tagwaye Quality Gates & Tooling

**Date:** 2025-11-17  
**Owner:** DX Engineering  
**Purpose:** Define the "done" criteria for UI/UX feature work before merge.

> **Note:** This is a detailed tooling and implementation guide. For a quick release checklist, see [`docs/prd/quality-gates.md`](../prd/quality-gates.md).

---

## 1. Testing Stack
- **Unit / Integration:** Vitest + @testing-library/react. Minimum 80 % statement coverage on `src/components` and state stores (`pnpm test -- --coverage`). Critical flows (timeline scrubber, panel pane switching) require regression tests.
- **E2E / Workflow:** Playwright (Chromium + WebKit). Scenarios:
  1. Persona load → verify six zones render + responsive collapse.
  2. Timeline expand/collapse, dimension pill switch updates ECharts series.
  3. Command palette open via `Cmd+K`, search filtering, closing.
- **Visual Regression:** Storybook + Chromatic. Each chrome zone gets at least one story (default, expanded, error). Pull requests must pass Chromatic diff review.

## 2. Static Analysis & Accessibility
- ESLint (Next.js preset) + custom rules enforcing `use client` placement, ARIA attributes on interactive elements.
- Stylelint (tailwindcss v4 plugin) for globals once tokens land.
- Axe accessibility suite integrated into Playwright run; no critical (`serious`/`critical`) issues permitted.

## 3. Performance Budgets
- Lighthouse CI (Desktop) budgets:
  - Performance ≥ 75, Accessibility ≥ 90, Best Practices ≥ 90.
  - Bundle size gate: initial JS < 350 KB for `/` route (post-code-splitting).
- WebGL (Scene Canvas) budget: >45 fps w/ 100k triangles on MBP M1. Include Jest perf test stub that asserts render loop completes within 16 ms average across 120 frames (headless).

## 4. Pipeline Hooks
- Pre-commit: `lint-staged` running ESLint + Vitest (changed files).
- Pre-push: Playwright smoke suite against local dev server.
- CI (GitHub Actions):
  1. Install via `npm ci` at repo root (workspaces aware).
  2. `npm run lint`, `npm run test`, `npm run lint:portal` (if added).
  3. Launch Storybook build → Chromatic upload.
  4. Playwright tests using `npx playwright test --project=chromium`.
  5. Lighthouse CI via `npx @lhci/cli autorun` hitting deployed preview.

## 5. Observability in Dev
- Integrate `why-did-you-render` in development to monitor re-render hotspots when toggling panels/timeline.
- Use React Profiler API (Next devtools) to record timeline expansion, ensure transitions < 200 ms budget.

## 6. Action Items
1. Add workspace `packages/testing` with shared Vitest config + custom matchers.
2. Stand up Storybook (`npx storybook@latest init`) scoped to `src/components` with Tailwind 4 support.
3. Configure Chromatic project + token secrets in CI.
4. Add Playwright scaffolding via `npx playwright install --with-deps` and seed tests for command palette + timeline.
5. Wire Lighthouse CI config referencing performance budgets above.

