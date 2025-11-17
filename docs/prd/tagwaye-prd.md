<!-- Tagwaye PRD generated from References specs -->
# Tagwaye Frontend PRD & Backlog

**Date:** 2025-11-17  
**Owner:** Engineering  
**Sources:** `References/tagwaye-*.md` (layout, timeline, canvas, panel, sidebar, footer)

---

## 1. Vision & Success Metrics
- Deliver a decision-intelligence cockpit where the six-zone shell keeps users perpetually aware of spatial, temporal, and operational context (`tagwaye-layout-design-specifications-v1.1.md` §1-3).
- Success KPIs:  
  - <2s TTI on cold load for dashboard route (Chrome on MacBook Pro M1).  
  - ≥90 Lighthouse accessibility score with keyboard-only navigation across all zones.  
  - Timeline scrubber + Scene Canvas synchronization latency <200 ms round-trip using mocked data initially.  
  - At least 4 personas (CXO, VP, Manager, Specialist) can complete their primary flow without leaving the unified workspace during user validation.

---

## 2. Personas & Primary Use Cases
| Persona | Goals | Critical Zones |
| --- | --- | --- |
| CXO / VP | Inspect portfolio health, time-to-value, risk outlook | Header context, Timeline KPIs, Panel Intelligence |
| Program Manager | Track milestones, manage resources, resolve blockers | Sidebar navigation, Timeline scrubber, Panel Actions |
| BIM Specialist | Manipulate LivingTwin, analyze systems, log decisions | Canvas dual-view, Panel Browse/Monitor/Analyze, Footer breadcrumbs |
| Field Ops | Verify work orders, monitor asset status on site | Sidebar quick actions, Canvas overlays, Panel drawers |

Each persona must experience a single, adaptive platform rather than separate modules (`tagwaye-layout-design-specifications-v1.1.md` §1.3).

---

## 3. Experience Pillars
1. **Clarity** – Persistent orientation (footer breadcrumbs, header context indicators, panel headers).  
2. **Deference** – Chrome yields to content (canvas consumes 60–70% viewport, translucent chrome).  
3. **Depth** – Progressive disclosure (sidebar hover expand, panel drawers, timeline collapsed/expanded).  
4. **Continuity** – Smooth transitions governed by shared animation tokens (Framer Motion).  
5. **Intelligence** – AI surfaces options (panel intelligence pane, timeline milestone snapping) but users decide.  
(Derived from respective spec intros.)

---

## 4. Functional Requirements & Acceptance Criteria

### 4.1 Global Shell
- Implement six-zone CSS Grid with responsive states (default, sidebar expanded, panel open, timeline expanded/hidden) per layout spec §2.  
- Enforce minimum canvas area (1080×600) and trigger responsive mode below thresholds (§2.4, §4).  
- Transition between states using Framer Motion spring animations that respect reduced motion preferences.

### 4.2 Header
- 56 px persistent bar with left brand/search, center context slot, right project/utils (`layout` §3.1).  
- Global command palette (`Cmd+K`) hooks into Lucide iconography for hints.  
- Search field supports omni-query placeholder state; focus shortcut must work globally.

### 4.3 Sidebar
- Three vertical zones (context/tools, navigation, utilities) with 64 px collapsed ↔ 280 px expanded widths (`sidebar` §2).  
- Hover expand delay 300 ms, collapse delay 500 ms; pinned state persists via localStorage.  
- Navigation hierarchy: Home, Projects, Ask Sage, Visualize, Analyze, Optimize, Collaborate, Actions→(Create/Manage), Help, Settings.  
- Keyboard navigation across icons/labels, with Lucide icons and tooltip microcopy.

### 4.4 Canvas System
- Universal Canvas fills remaining grid space; coordinates update when sidebar/panel/timeline states change (`canvas` §2.1-2.2).  
- Dual View support toggled via footer “View Mode”; each pane mounts independent React trees with shared context.  
- Scene Canvas leverages `@thatopen/fragments` viewer with overlays for AI insight cards (§4).  
- Loading orchestration: skeletons <100 ms, scroll virtualization for lists >100 rows.

### 4.5 Panel
- Right-aligned container (280–600 px) with tabbed panes and accordion drawers (`panel` §2).  
- Hero configuration (Asset Manager) ships with Browse / Monitor / Analyze panes, auto-expanding drawers upon asset selection.  
- Resizable left edge with 60 fps feedback; Framer Motion handles pane transitions at 200 ms.  
- State persistence per context (pane, drawer, width) stored in localStorage; respects keyboard shortcuts (Cmd+\\).

### 4.6 Timeline
- Five stacked layers (Lifecycle bar, Dimension pills, Scrubber, Visualization, KPI rail) with collapsed 48 px and expanded 180–320 px heights (`timeline` §2-4).  
- Interaction set: scrubber drag with milestone snapping, play/pause controls, speed selector, dimension toggles, KPI chips.  
- Visualization area rendered via Apache ECharts; dataset responds to current dimension (4D–8D).  
- Timeline state drives canvas scenes via shared store; collapsed state still shows current phase + progress chip.

### 4.7 Footer
- 40 px translucent bar with left status rail (connection, sync, perf, collaborators), center contextual breadcrumbs, right controls (timeline toggle, view mode, layout mode, theme) (`footer` §2).  
- Breadcrumb segments clickable for navigation; timeline toggle mirrors timeline visibility state, view mode toggles single/dual.  
- Connection + perf indicators powered by mocked WebSocket heartbeat and render timing metrics.

### 4.8 Accessibility & Internationalization
- All focus orders follow visual structure: sidebar → header search → canvas → panel → timeline → footer.  
- WCAG 2.1 AA: color contrast, keyboard interactions, ARIA labels (tabs, accordions, breadcrumbs, sliders).  
- Copy stored in i18n dictionary to support future localization; prefer sentence case labels.

---

## 5. Non-Functional Requirements
- **Performance:**  
  - Sidebar render <16 ms, panel pane switch <50 ms, timeline animations 60 fps (§respective specs).  
  - Canvas initial render <100 ms, FRAG viewer at ≥45 fps with 100k triangles test scene.  
- **State Management:** Shared store (Zustand or Redux Toolkit) for layout, selection, timeline cursor; React Query for data fetching/mocking.  
- **Persistence:** localStorage for user UI preferences (pinned sidebar, panel width, timeline state).  
- **Offline Support:** Footer connection indicator reflects network; timeline scrub remains usable with cached data snapshot.

---

## 6. Tech Stack Decisions
- **Framework:** Next.js 15 (App Router) + React 18 + TypeScript.  
- **Styling:** Tailwind CSS (or CSS Modules) + design tokens; CSS variables for zones.  
- **Icons:** Lucide React (align with spec).  
- **Motion:** Framer Motion for state transitions and micro-interactions.  
- **Charts:** Apache ECharts for timeline visualization area + dashboard widgets.  
- **3D Canvas:** `@thatopen/fragments` for digital twin rendering (.FRAG).  
- **UI Primitives:** Radix UI (dialog, tabs, tooltip) for accessible building blocks.  
- **Tooling:** Storybook, Playwright, Vitest, ESLint, Prettier, Husky hooks.  
- **Data Layer:** Mock services (MirageJS/Mock Service Worker) until backend lands; plan GraphQL/REST clients later.

---

## 7. Backlog (MVP → Next)
| Priority | Feature | Description | References |
| --- | --- | --- | --- |
| P0 | Six-Zone Layout Shell | Implement responsive grid, state toggles, min canvas | Layout §2 |
| P0 | Sidebar Spine | Collapsible, role-aware navigation with Lucide icons | Sidebar §1-4 |
| P0 | Universal Canvas + Scene Canvas | Mount universal content + integrate `@thatopen/fragments` dual view | Canvas §2-4 |
| P0 | Universal Panel | Multi-pane asset manager with drawers + persistence | Panel §2-4 |
| P0 | Timeline System | Lifecycle, dimension pills, scrubber, ECharts visual, KPI rail | Timeline §2-5 |
| P0 | Footer Status Bar | Breadcrumbs, status, view controls, timeline toggle | Footer §2-4 |
| P1 | Command Palette & Search | Global omni-search, Cmd+K palette | Layout §3 + Sidebar §1 |
| P1 | AI Insights Overlay | Canvas floating cards + panel intelligence pane | Layout §1.2 Principle 5 |
| P1 | Collaboration Presence | Footer presence chips, panel comments integration | Footer §3.1, Panel §4 |
| P1 | Responsive Modes | Tablet/mobile adaptations for sidebar/panel/timeline | Layout §4 |
| P2 | Dual-Canvas Templates | Saved layouts, presentation mode, scenario comparison | Canvas §3 |
| P2 | Timeline Playback Recording | Export timeline states, share scenario snapshots | Timeline §5 |

---

## 8. Open Questions
1. Data contract for lifecycle phases vs organization-specific workflows (needs backend alignment).  
2. Auth/session model (SSO?) for command palette scope.  
3. Extensibility of `@thatopen/fragments` overlays for AI cards (HTML vs WebGL layer).  
4. Hosting requirements for FRAG assets (CDN vs local bundling).

---

## 9. Next Steps
1. Confirm mock API schema and sample datasets for timeline, KPIs, asset telemetry.  
2. Kick off frontend workspace setup per plan (Next.js, tooling).  
3. Create Storybook baseline stories for the six zones using design tokens.  
4. Prepare backend RFC for NestJS + PostgreSQL service layer and streaming updates.


