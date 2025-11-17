# Tagwaye Quality Gates

## 1. Static Analysis
- `npm run lint` (Next.js + eslint-config-next/core-web-vitals) enforced in CI.
- `npm run typecheck` (tsc `--noEmit`) ensures route groups & shared types stay sound.
- Pre-commit hook: lint-staged running `eslint --max-warnings=0` on staged TS/TSX files.

## 2. Component QA
- Storybook instance (`apps/tagwaye-portal/.storybook`) to be added next sprint; baseline stories:
  - Layout shell states (default, sidebar expanded, panel open, timeline expanded)
  - Zone components (Header, Sidebar, Panel panes) with Chromatic diffs.
- Accessibility add-ons (storybook-addon-a11y) + Lighthouse CI targeted at `/`.

## 3. Testing Strategy
- **Unit:** Vitest + Testing Library for layout store, panel reducers, timeline math.
- **Integration:** Playwright journeys (sidebar navigation, panel width persistence, timeline scrubbing).
- **Data:** Contract tests for mock API vs future NestJS OpenAPI using `openapi-enforcer`.

## 4. Performance Budgets
- Cold start TTI < 2s on M1 MBP (Fast 3G), prefetch key bundles.
- Timeline scrub-to-render < 200 ms, Scene canvas maintains ≥45 fps for 100k triangles via FRAG.
- Web Vitals tracked via Next.js instrumentation; alerts when CLS > 0.1, LCP > 2.5 s.

## 5. Release Checklist
1. `npm run lint && npm run typecheck` pass.
2. Storybook visual regression green.
3. Playwright suite `npm run test:e2e` green on Chrome & WebKit.
4. Perf smoke (Lighthouse CI, FRAG FPS sample) within budget.
5. Backend contract sync (OpenAPI) succeeded.

