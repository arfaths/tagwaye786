<!-- UI inventory derived from Tagwaye design specs -->
# Tagwaye UI Inventory

| Zone / Component | Purpose | Key Elements | Notes & Dependencies |
| --- | --- | --- | --- |
| Header | Global orientation & quick actions (`layout` §3) | Brand wordmark, Omni search (Cmd+K), context slot, project switcher, utility icons | Uses Lucide icons, command palette overlay (Radix Dialog) |
| Sidebar | Contextual navigation spine (`sidebar` §1-4) | Top zone (project switcher, command palette), main navigation tree, bottom utilities, pin toggle | Collapse/expand with Framer Motion; persistent width preference |
| Universal Canvas | Primary content surface (`canvas` §1-3) | Single view, dual view, skeleton loaders, error boundary | Coordinates respond to sidebar/panel/timeline states; virtualization hooks |
| Scene Canvas | LivingTwin WebGL viewport (`canvas` §4 + `layout` §2) | `@thatopen/fragments` viewer, selection outlines, overlay anchor layer | Shares layout space with Universal Canvas; needs GPU budget telemetry |
| Panel Container | Multi-pane toolkit (`panel` §2) | Pane tabs (Browse/Monitor/Analyze), drawer accordions, resize handle, visibility toggle | Pane content uses Radix Tabs + Accordions; state persisted per context |
| Panel Drawer Types | Provide detailed controls (`panel` §3) | Browse pane: hierarchy tree, search; Monitor: telemetry charts; Analyze: AI insights | Monitor uses ECharts mini-charts; Analyze references AI service |
| Timeline | Temporal navigation system (`timeline` §2-5) | Lifecycle bar, dimension pills, scrubber controls, visualization area, KPI rail | Collapsed strip (48 px) vs expanded (180–320 px) transitions via Framer Motion |
| Scrubber Transport | Playback controls within timeline | Back/forward, play/pause, speed selector, date tooltip | Keyboard shortcuts: J/K/L for playback speed adjustments |
| Timeline Visualization | Dimension-specific charts | Bar/line/Gantt visualizations, scenario comparison overlays | Powered by Apache ECharts; theme tokens shared with dashboards |
| Footer | Status + contextual breadcrumbs (`footer` §2-4) | Connection status, sync info, performance metric, collaborator presence, breadcrumbs, timeline toggle, view/layout/theme controls | Backdrop blur background; timeline toggle syncs with timeline zone |
| Command Palette | Accelerated navigation (`sidebar` §1.2, layout §3) | Search input, result groups (Navigate, Create, Ask Sage, Actions), iconography | Implement via Radix Dialog + Combobox; accessible from header + sidebar |
| Ask Sage Entry Points | AI assistant entry | Sidebar CTA, panel intelligence drawer CTA, canvas overlay nodes | Requires future backend but placeholder flows in frontend |
| Breadcrumb Component | Contextual location display (`footer` §3) | Hierarchical segments, drill-down menu, overflow handling | Click actions update canvas context and panel data |
| Status Indicators | Visual state cues (footer + header) | Connection pill, sync timestamp, render time, collaborator avatars | Hooked to mocked service data initially; ARIA live regions for status |

## Interaction References
- **Keyboard Shortcuts:** Cmd+K (search/palette), Cmd+\\ (panel), Cmd+Shift+P (advanced view), Arrow keys for timeline scrub increments.  
- **Gestures:** Sidebar hover expansion (300 ms delay), timeline drag with momentum, panel resize drag.  
- **Motion Specs:** Use shared token set (e.g., `motion.duration.s` = 0.25 s, `motion.ease.standard` = cubic-bezier(0.4,0,0.2,1)).

## Asset & Token Needs
- Import design tokens (colors, typography, spacing) from forthcoming `tagwaye-design-tokens.css` (placeholder).  
- Define CSS variables for zone backgrounds (`--chrome-surface`, `--chrome-border`, etc.), translucency levels, and elevation tiers.  
- Iconography standardized on Lucide (sidebar, header utilities, timeline controls).  
- Chart palette shared between ECharts and FRAG overlays to maintain continuity.

