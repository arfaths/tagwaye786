# Tagwaye Universal Panel Design Specifications

**Version:** 1.0  
**Date:** November 13, 2025  
**Status:** Final Specification  
**Authors:** Design & Engineering Team

---

## Table of Contents

1. [Overview & Design Foundation](#1-overview--design-foundation)
2. [Architecture & Multi-Pane System](#2-architecture--multi-pane-system)
3. [Context Configurations](#3-context-configurations)
4. [Interaction & Behavior](#4-interaction--behavior)
5. [Implementation & Integration](#5-implementation--integration)

---

## 1. Overview & Design Foundation

### 1.1 Purpose

The Universal Panel is Tagwaye's context-aware tool system. It adapts to whatever the user is doing, providing precisely the tools needed without cluttering the canvas. Like Figma's right sidebar or Power BI's property panes, Universal Panel combines multiple tool categories (panes) with hierarchical organization (drawers) into a single, unified interface.

Universal Panel is not a feature—it's a stage where tools perform. The same Panel container hosts Dashboard Builder tools, Workflow Editor tools, Scene Canvas Asset Manager, and any other context-specific interface. Content determines what appears; Panel provides the structure.

**Asset Manager (Scene Canvas context) is the hero Panel configuration**—the flagship example that demonstrates Panel's full power with Browse, Monitor, and Analyze panes for digital twin exploration.

### 1.2 Design Principles Applied

**Clarity: Context is Everything**
- Panel adapts to active workflow (Dashboard Builder vs Scene Canvas vs Settings)
- Active pane clearly indicated (accent color, bold tab)
- Open drawers stay open; closed drawers stay closed (respects user state)
- No mystery meat (every control labeled, every action predictable)
- Current context never ambiguous (Panel header shows context name)

**Deference: Tools Serve Content**
- Panel never obscures canvas content
- Can be hidden entirely (Cmd+\) when not needed
- Width user-adjustable (280-600px range)
- Collapses to icon-only mode on narrow screens
- Auto-hides on mobile (full-screen modal when needed)

**Depth: Progressive Disclosure**
- Panes organize high-level categories (Visualizations, Data, Format)
- Drawers organize detailed controls within panes
- Most-used drawers open by default; advanced drawers collapsed
- Complexity hidden until needed
- Power users can expand everything; beginners see essentials

**Continuity: State Persists**
- Which pane is active (remembered per context)
- Which drawers are open/closed (remembered per pane)
- Panel width (same across all contexts)
- Scroll position within panes (preserved on tab switch)
- Last-used configuration restored on return

**Intelligence: Anticipates Needs**
- Opens relevant pane when user selects element (widget selected → Format pane)
- Expands relevant drawer automatically (asset selected → Live Data drawer)
- Suggests next action (data source connected → suggests adding fields)
- Remembers patterns (user always opens Filters drawer → opens by default)

### 1.3 Core Architecture Philosophy

**Universal Panel = Container + Context Loader**

Universal Panel provides:
1. **Fixed dimensions** — Right-aligned, 280-600px wide, full height
2. **Multi-pane system** — Horizontal tabs for major tool categories
3. **Drawer hierarchy** — Vertical accordions within each pane
4. **Resize mechanism** — User adjusts width, drags left edge
5. **Visibility control** — Toggle on/off, keyboard shortcut
6. **State persistence** — localStorage per user, per context

Universal Panel does NOT provide:
- Specific tool implementations (Dashboard Builder provides those)
- Content logic (Context configs define pane/drawer contents)
- Data fetching (Tools within Panel handle their own data)
- Canvas rendering (Panel is separate from content)

### 1.4 Panel Contexts

**Context** = The current user workflow that determines Panel configuration.

**Primary Contexts:**

**1. Dashboard Builder** (when creating/editing dashboard)
- Panes: Visualizations, Data, Format, Filters
- Purpose: Build data visualizations with drag-drop widgets

**2. Asset Manager** (Scene Canvas - Hero Context)
- Panes: Browse, Monitor, Analyze
- Purpose: Navigate 3D digital twin, inspect assets, view real-time data
- **This is the flagship Panel configuration**

**3. Workflow Editor** (when creating/editing workflow)
- Panes: Nodes, Properties, Variables, Runs
- Purpose: Design automated workflows with visual node editor

**4. Form Builder** (when creating/editing forms)
- Panes: Fields, Layout, Validation, Actions
- Purpose: Design data entry forms with field library

**5. Report Generator** (when creating reports)
- Panes: Data, Template, Schedule, Export
- Purpose: Configure automated report generation

**6. Data Pipeline Builder** (when configuring ETL)
- Panes: Sources, Transforms, Destinations, Schedule
- Purpose: Design data transformation pipelines

**7. Settings Manager** (when in Settings page)
- Panes: Profile, Appearance, Notifications, Integrations
- Purpose: Configure application preferences

**8. Project Manager** (when managing projects)
- Panes: Details, Team, Data, Settings
- Purpose: Configure project properties and permissions

### 1.5 Constraints & Requirements

**Performance:**
- Panel render time: <50ms (pane switch instant)
- Drawer toggle animation: 200ms (smooth, not slow)
- Resize performance: 60fps (follows mouse smoothly)
- Memory: <50MB for Panel system (excluding content)
- State save to localStorage: <10ms

**Accessibility:**
- WCAG 2.1 Level AA compliance
- Keyboard navigation (Tab, Arrow keys, Enter/Space)
- Screen reader support (ARIA tabs, accordions, landmarks)
- Focus management (Tab into Panel, cycle through panes, exit)
- Reduced motion support (instant drawer toggle if preferred)

**Browser Support:**
- Chrome/Edge (Chromium) — latest 2 versions
- Safari (macOS/iOS) — latest 2 versions
- Firefox — latest 2 versions

**Device Support:**
- Desktop (1024px+): Full Panel, resizable, all features
- Tablet (768-1023px): Full-screen modal Panel when needed
- Mobile (<768px): View-only (Panel hidden or minimal)

---

## 2. Architecture & Multi-Pane System

### 2.1 Positioning & Dimensions

**Fixed Positioning:**
```css
.universal-panel {
    position: fixed;
    top: 56px;        /* Below Header */
    bottom: 40px;     /* Above Footer */
    right: 0;
    width: 360px;     /* Default width */
    z-index: 200;     /* Above Canvas (100), below Modals (1000) */
    background: var(--color-surface);
    border-left: 1px solid var(--color-border);
}
```

**Width Range:**
- **Minimum:** 280px (narrower becomes unusable)
- **Default:** 360px (30% of typical 1200px canvas width)
- **Maximum:** 600px (wider dominates screen)
- **User-adjustable:** Yes, drag left edge to resize

**Height:**
- Full viewport height minus Header (56px) and Footer (40px)
- If Timeline visible (120px), Panel height remains same (overlays Timeline)
- Scrollable if pane content exceeds available height

**Canvas Integration:**
```
┌────────────────────────────┬─────────────┐
│                            │             │
│   Universal Canvas         │   Panel     │
│   (Width adjusts           │   360px     │
│    when Panel resizes)     │             │
│                            │             │
└────────────────────────────┴─────────────┘
```

### 2.2 Panel Structure

**Three-Layer Hierarchy:**

**Layer 1: Panel Container**
- Fixed dimensions and positioning
- Resize handle (left edge)
- Visibility toggle (Cmd+\ keyboard shortcut)

**Layer 2: Panes (Horizontal Tabs)**
- 2-6 panes per context (typically 3-4)
- Tabs at top, content below
- Click tab to switch active pane
- Only one pane active at a time

**Layer 3: Drawers (Vertical Accordions)**
- 2-10 drawers per pane (typically 3-5)
- Click header to toggle open/closed
- Multiple drawers can be open simultaneously
- Scrollable if content exceeds pane height

**Visual Hierarchy:**
```
┌─────────────────────────────────┐
│  PANEL HEADER                   │  ← Context name (optional)
├─────────────────────────────────┤
│  [Pane 1] [Pane 2] [Pane 3]    │  ← Layer 2: Horizontal panes
├─────────────────────────────────┤
│                                 │
│  ▼ Drawer 1 (expanded)          │  ← Layer 3: Vertical drawers
│    Content here...              │
│    • Item A                     │
│    • Item B                     │
│                                 │
│  ▶ Drawer 2 (collapsed)         │
│                                 │
│  ▼ Drawer 3 (expanded)          │
│    Content here...              │
│    [Controls, inputs, etc.]     │
│                                 │
└─────────────────────────────────┘
```

### 2.3 Pane Structure (Layer 2)

**Pane Tab Bar:**
```css
.panel-pane-tabs {
    display: flex;
    height: 44px;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-bg-secondary);
    padding: 0 12px;
    gap: 4px;
}
```

**Pane Tab (Inactive):**
```css
.panel-pane-tab {
    padding: 0 16px;
    height: 44px;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-secondary);
    background: transparent;
    border: none;
    cursor: pointer;
    position: relative;
}

.panel-pane-tab:hover {
    color: var(--color-text-primary);
    background: var(--color-bg-hover);
    border-radius: 6px;
}
```

**Pane Tab (Active):**
```css
.panel-pane-tab.active {
    color: var(--color-accent);
    font-weight: 600;
}

.panel-pane-tab.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--color-accent);
}
```

**Pane Content Area:**
```css
.panel-pane-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0; /* Drawers provide own padding */
}
```

**Pane Switching:**
- Click tab → Instant switch (no animation)
- Active pane content shows, inactive panes hidden (display: none)
- Scroll position preserved per pane (on switch back, restores scroll)

**Tab Overflow:**
- If >5 tabs, horizontal scroll (rare, but supported)
- Scroll shadows indicate more tabs available
- Alternatively: Dropdown menu for panes 6+ (cleaner)

### 2.4 Drawer Structure (Layer 3)

**Drawer Header (Collapsible):**
```css
.panel-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    padding: 0 16px;
    cursor: pointer;
    user-select: none;
    border-bottom: 1px solid var(--color-border);
}

.panel-drawer-header:hover {
    background: var(--color-bg-hover);
}

.panel-drawer-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-primary);
}

.panel-drawer-chevron {
    width: 16px;
    height: 16px;
    color: var(--color-text-secondary);
    transition: transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.panel-drawer.open .panel-drawer-chevron {
    transform: rotate(90deg); /* ▶ becomes ▼ */
}
```

**Drawer Content (Expandable):**
```css
.panel-drawer-content {
    padding: 16px;
    background: var(--color-surface);
    overflow: hidden; /* For height animation */
    max-height: 0; /* Collapsed state */
    transition: max-height 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.panel-drawer.open .panel-drawer-content {
    max-height: 1000px; /* Expanded state (generous value) */
}
```

**Drawer Toggle Animation:**
- Click header → Toggle open/closed
- Height animates smoothly (200ms)
- Chevron rotates (▶ right = closed, ▼ down = open)
- Multiple drawers can be open simultaneously
- If `prefers-reduced-motion`, no animation (instant toggle)

**Drawer Scrolling:**
- If drawer content exceeds available space, scrolls internally
- Scroll shadows at top/bottom indicate more content
- Scrollbar styled to match theme (subtle, auto-hide on macOS)

### 2.5 Resize Mechanism

**Resize Handle (Left Edge):**
```css
.panel-resize-handle {
    position: absolute;
    top: 0;
    left: -2px; /* Slightly overlaps Panel border */
    width: 4px;
    height: 100%;
    cursor: col-resize;
    z-index: 201; /* Above Panel content */
}

.panel-resize-handle:hover {
    background: var(--color-accent);
    opacity: 0.3;
}

.panel-resize-handle.dragging {
    background: var(--color-accent);
    opacity: 0.5;
}
```

**Resize Interaction:**
1. User hovers left edge → Cursor changes to ↔
2. User clicks and drags → Panel width follows mouse
3. Canvas width adjusts in real-time (opposite direction)
4. User releases → Width saved to localStorage

**Width Constraints:**
- Minimum: 280px (prevents unusable narrow Panel)
- Maximum: 600px (prevents Panel dominating screen)
- If user drags beyond limits, stops at boundary (no snap-back)

**Double-Click Reset:**
- Double-click resize handle → Resets to default (360px)
- Smooth transition (250ms)

### 2.6 Visibility Control

**Toggle Methods:**

**1. Keyboard Shortcut (Primary):**
- `Cmd+\` (macOS) or `Ctrl+\` (Windows)
- Toggles Panel visibility
- Works from anywhere in application

**2. Header Button (Optional):**
- Small button in Header (right zone): "Show Panel" / "Hide Panel"
- Icon: Panel symbol with chevron (◧)
- Appears when Panel is hidden

**3. Context Menu:**
- Right-click in Canvas → "Show/Hide Panel"
- Also accessible via main menu (View → Panel)

**Visibility Animation:**
- Panel slides in from right (250ms)
- Panel slides out to right (250ms)
- Canvas width expands/contracts smoothly
- Easing: `cubic-bezier(0.4, 0.0, 0.2, 1)`

**Hidden State:**
- Panel completely off-screen (transform: translateX(100%))
- Canvas fills entire space
- Keyboard shortcut still works to show Panel

### 2.7 Panel Header (Optional)

**Context Indicator:**
```
┌─────────────────────────────────┐
│  Dashboard Builder          [✕] │  ← Panel header with context name
├─────────────────────────────────┤
│  [Visualizations] [Data] [...] │
```

**When to Show:**
- Dashboard Builder: "Dashboard Builder"
- Asset Manager: "Asset Manager"
- Workflow Editor: "Workflow Editor"
- Settings: No header (tabs are self-explanatory)

**Header Actions:**
- Close button (✕): Hides Panel (same as Cmd+\)
- Context icon (optional): Visual indicator of current context

**Header Styling:**
```css
.panel-header {
    height: 40px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface);
}

.panel-header-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-primary);
}
```

---

## 3. Context Configurations

### 3.1 Asset Manager (Hero Context)

**When Active:** User navigates to Visualize (Scene Canvas)

**Purpose:** Navigate 3D digital twin, inspect assets, monitor real-time data, analyze historical trends

**Panel Configuration:**
```typescript
{
    context: 'asset-manager',
    headerTitle: 'Asset Manager',
    panes: [
        {
            id: 'browse',
            label: 'Browse',
            icon: '🔍',
            drawers: [...]
        },
        {
            id: 'monitor',
            label: 'Monitor',
            icon: '📊',
            drawers: [...]
        },
        {
            id: 'analyze',
            label: 'Analyze',
            icon: '📈',
            drawers: [...]
        }
    ],
    defaultPane: 'browse' // Or last used
}
```

---

#### **Browse Pane**

**Purpose:** Find and navigate to assets in digital twin hierarchy

**Drawers:**

**1. Hierarchy (Default Open)**
```
▼ Hierarchy
  ├─ Building A
  │  ├─ Level 1
  │  │  ├─ AHU-01
  │  │  └─ AHU-02
  │  ├─ Level 2
  │  └─ Level 3
  │     ├─ AHU-07 ← Currently selected
  │     └─ AHU-08
  └─ Distribution Center
     └─ ...
```

**Features:**
- Tree view (expand/collapse nodes)
- Icons per asset type (building, floor, equipment)
- Status indicators (green/yellow/red dots)
- Click asset → Camera flies to asset in Scene Canvas
- Selected asset highlighted (accent background)

**2. Search (Default Collapsed)**
```
▶ Search
  [Search field: "Find asset..."]
  [Filters: Type, Status, Location]
  [Results list]
```

**Features:**
- Fuzzy search by name, ID, type
- Filter by asset type, status, location
- Recent searches (last 5)
- Click result → Navigate to asset

**3. Favorites (Default Collapsed)**
```
▶ Favorites
  ⭐ AHU-07
  ⭐ Chiller-01
  ⭐ Main Electrical Room
  [+ Add Current Asset]
```

**Features:**
- User can favorite assets for quick access
- Drag to reorder favorites
- Click → Navigate to asset

**4. Filters (Default Collapsed)**
```
▶ Filters
  System Type: [All ▼]
  Status: [All ▼]
  Location: [All ▼]
  Manufacturer: [All ▼]
  [Apply] [Clear]
```

**Features:**
- Multi-select filters
- Apply filters → Tree view shows only matching assets
- Filter count indicator (e.g., "Filters (3)")

---

#### **Monitor Pane**

**Purpose:** View real-time sensor data and alerts for selected asset

**Drawers:**

**1. Live Data (Auto-Expands on Asset Selection)**
```
▼ Live Data (AHU-07)
  🌡️ Temperature: 72.3°F
     ↑ 1.2° from avg
  
  💨 Airflow: 1,245 CFM
     ↓ 55 CFM from target
  
  ⚡ Power: 4.2 kW
     Normal range
  
  🔄 Status: Running
     Uptime: 47 days
  
  [View All Sensors →]
```

**Features:**
- Shows 4-6 key metrics (most important)
- Color-coded values (green/yellow/red based on thresholds)
- Delta from baseline (↑ higher, ↓ lower, ↔ stable)
- Trend indicator (sparkline mini-chart)
- Auto-updates every 5 seconds

**2. Alerts (Default Open if Alerts Present)**
```
▼ Alerts (AHU-07)
  ⚠️ High Temperature
     Zone 3 exceeds threshold (75°F)
     2 hours ago
  
  ℹ️ Maintenance Due
     Scheduled maintenance in 5 days
     1 day ago
  
  [View All Alerts →]
```

**Features:**
- Shows active alerts for selected asset
- Color-coded severity (red = critical, yellow = warning, blue = info)
- Time since alert triggered
- Click alert → Opens detail modal with full context
- Dismiss/acknowledge actions

**3. Alarms (Default Collapsed)**
```
▶ Alarms
  🔴 Critical: 0
  🟡 Warning: 2
  🔵 Info: 5
  [View All →]
```

**Features:**
- System-wide alarm summary
- Counts by severity
- Click → Opens alarms management page

**4. History (Default Collapsed)**
```
▶ History
  [Timeline: Last 24 hours]
  • 2:30 PM: Temperature spike
  • 10:15 AM: Filter replaced
  • 9:00 AM: Routine check
  [View Full History →]
```

**Features:**
- Recent events for selected asset
- Maintenance logs, system events, alerts
- Click event → Expands detail

---

#### **Analyze Pane**

**Purpose:** View historical trends and perform comparative analysis

**Drawers:**

**1. Trends (Default Open)**
```
▼ Trends (AHU-07)
  [Time Range: Last 24 hours ▼]
  
  [Chart: Temperature over time]
  [Chart: Power consumption]
  
  [+ Add Metric]
```

**Features:**
- Line charts for selected metrics
- Time range selector (last 1h, 24h, 7d, 30d, custom)
- Multiple metrics on same chart (toggle visibility)
- Zoom, pan, hover tooltips
- Export chart as PNG

**2. Comparisons (Default Collapsed)**
```
▶ Comparisons
  Compare: AHU-07 vs [Select Asset ▼]
  
  [Side-by-side charts]
  
  AHU-07      AHU-08
  72°F        68°F
  1,245 CFM   1,180 CFM
```

**Features:**
- Select second asset for comparison
- Side-by-side or overlay charts
- Highlight differences (deltas)
- Statistical comparison (mean, min, max, std dev)

**3. Reports (Default Collapsed)**
```
▶ Reports
  • Energy Efficiency Report
  • Maintenance Summary
  • Performance Analysis
  [Generate New Report →]
```

**Features:**
- Pre-configured report templates
- Click → Opens report in Canvas
- Generate custom reports (opens Report Generator context)

**4. Forecasting (Default Collapsed)**
```
▶ Forecasting
  [AI-powered predictions]
  
  🔮 Next 7 days:
  Predicted failure risk: Low
  Maintenance suggested: Day 5
  
  [View Detailed Forecast →]
```

**Features:**
- AI/ML predictions for asset health
- Anomaly detection
- Maintenance scheduling suggestions
- Risk scores

---

### 3.2 Dashboard Builder Context

**When Active:** User creates/edits dashboard

**Panel Configuration:**
```typescript
{
    context: 'dashboard-builder',
    headerTitle: 'Dashboard Builder',
    panes: [
        { id: 'visualizations', label: 'Visualizations', drawers: [...] },
        { id: 'data', label: 'Data', drawers: [...] },
        { id: 'format', label: 'Format', drawers: [...] },
        { id: 'filters', label: 'Filters', drawers: [...] }
    ],
    defaultPane: 'visualizations'
}
```

**Panes:**

**Visualizations:** Widget types (charts, KPIs, tables, maps)  
**Data:** Data sources, fields, relationships, queries  
**Format:** Colors, fonts, spacing, themes (opens when widget selected)  
**Filters:** Global filters, parameters, drill-through config

---

### 3.3 Workflow Editor Context

**When Active:** User creates/edits workflow

**Panel Configuration:**
```typescript
{
    context: 'workflow-editor',
    headerTitle: 'Workflow Editor',
    panes: [
        { id: 'nodes', label: 'Nodes', drawers: [...] },
        { id: 'properties', label: 'Properties', drawers: [...] },
        { id: 'variables', label: 'Variables', drawers: [...] },
        { id: 'runs', label: 'Runs', drawers: [...] }
    ],
    defaultPane: 'nodes'
}
```

**Panes:**

**Nodes:** Triggers, actions, logic, integrations (drag to canvas)  
**Properties:** Selected node configuration (opens when node selected)  
**Variables:** Workflow variables, constants, expressions  
**Runs:** Execution history, logs, debugging

---

### 3.4 Form Builder Context

**When Active:** User creates/edits form

**Panel Configuration:**
```typescript
{
    context: 'form-builder',
    panes: [
        { id: 'fields', label: 'Fields', drawers: [...] },
        { id: 'layout', label: 'Layout', drawers: [...] },
        { id: 'validation', label: 'Validation', drawers: [...] },
        { id: 'actions', label: 'Actions', drawers: [...] }
    ],
    defaultPane: 'fields'
}
```

---

### 3.5 Settings Context

**When Active:** User in Settings page

**Panel Configuration:**
```typescript
{
    context: 'settings',
    panes: [
        { id: 'profile', label: 'Profile', drawers: [...] },
        { id: 'appearance', label: 'Appearance', drawers: [...] },
        { id: 'notifications', label: 'Notifications', drawers: [...] },
        { id: 'integrations', label: 'Integrations', drawers: [...] }
    ],
    defaultPane: 'profile'
}
```

---

### 3.6 Context Switching

**When User Navigates:**

**From Dashboard Builder → Scene Canvas (Asset Manager):**

1. Dashboard Builder Panel unmounts (saves state to localStorage)
2. Asset Manager Panel mounts (restores state from localStorage)
3. Smooth transition (no animation, instant switch)
4. Panel width persists (user's preferred width carries over)
5. Last active pane restored (if Browse was active, opens Browse)

**State Persistence Schema:**
```json
{
    "panel": {
        "width": 380,
        "visible": true,
        "contexts": {
            "dashboard-builder": {
                "activePane": "data",
                "openDrawers": {
                    "visualizations": ["charts", "kpis"],
                    "data": ["sources", "fields"]
                },
                "scrollPosition": {
                    "data": 120
                }
            },
            "asset-manager": {
                "activePane": "monitor",
                "openDrawers": {
                    "browse": ["hierarchy"],
                    "monitor": ["live-data", "alerts"],
                    "analyze": ["trends"]
                },
                "scrollPosition": {
                    "monitor": 0
                }
            }
        }
    }
}
```

**When user returns to Dashboard Builder:**
- Panel restores exact state (Data pane active, specific drawers open, scroll position)
- No re-learning curve

---

## 4. Interaction & Behavior

### 4.1 Pane Navigation

**Mouse Interaction:**
- Click pane tab → Switch to that pane (instant)
- Hover pane tab → Subtle highlight (lighter background)
- Active pane tab → Accent color text + bottom border

**Keyboard Interaction:**
- `Tab` into Panel → Focus first pane tab
- `Arrow Left/Right` → Navigate between pane tabs
- `Enter` or `Space` → Activate focused pane
- `Tab` again → Move into active pane content

**Touch Interaction (Tablet/Mobile):**
- Tap pane tab → Switch pane
- Swipe left/right on tab bar → Scroll through tabs (if overflow)

### 4.2 Drawer Interaction

**Mouse Interaction:**
- Click drawer header → Toggle open/closed
- Hover drawer header → Subtle highlight
- Open drawer → Content expands smoothly (200ms)
- Closed drawer → Content collapses (200ms)

**Keyboard Interaction:**
- `Tab` through panel → Focus cycles through drawer headers
- `Enter` or `Space` on focused drawer → Toggle open/closed
- `Arrow Up/Down` → Navigate between drawer headers
- `Tab` into open drawer → Focus first interactive element

**Multiple Drawers:**
- User can have multiple drawers open simultaneously
- No automatic collapse (respect user's state)
- Each drawer independent

**Drawer Scroll:**
- If drawer content exceeds ~400px height, scrolls internally
- Scroll shadows indicate more content above/below
- Drawer header remains sticky (always visible)

### 4.3 Auto-Expand Behavior

**Intelligent Drawer Expansion:**

**Scenario 1: Asset Selected in Scene Canvas**
- User clicks AHU-07 in 3D viewport
- Panel receives event: `asset-selected: AHU-07`
- If Monitor pane is active: "Live Data" drawer auto-expands
- If Monitor pane is inactive: No auto-expand (user might be in Browse)

**Scenario 2: Widget Selected in Dashboard Builder**
- User clicks chart widget in canvas
- Panel switches to Format pane (if not already there)
- "Appearance" drawer auto-expands (relevant to selected widget)

**Scenario 3: Node Selected in Workflow Editor**
- User clicks workflow node
- Panel switches to Properties pane
- Node-specific drawer opens (e.g., "API Configuration" for API node)

**Rules:**
- Only auto-expand if action is contextually relevant
- Only auto-expand if target pane is already active
- Never auto-collapse drawers (respect user state)
- User can disable auto-expand in Settings (preference)

### 4.4 Resize Interaction

**Drag Resize:**
1. User hovers left edge → Cursor changes to ↔
2. User drags left → Panel narrows, Canvas widens
3. User drags right → Panel widens, Canvas narrows
4. Both adjust in real-time (no lag, follows mouse)
5. User releases → Width saved to localStorage

**Constraints During Drag:**
- Minimum: 280px (panel becomes unusable below this)
- Maximum: 600px (panel dominates screen above this)
- If user drags beyond limit, stops at boundary (visual feedback: resistance)

**Performance:**
- Resize handler debounced (every 16ms = 60fps)
- Canvas reflow handled by CSS flexbox (GPU-accelerated)
- No JavaScript layout calculations during drag

**Double-Click Reset:**
- User double-clicks resize handle
- Panel animates to default width (360px) over 250ms
- Easing: `cubic-bezier(0.4, 0.0, 0.2, 1)`

### 4.5 Visibility Toggle

**Hide Panel:**
- User presses `Cmd+\` (or clicks Hide button)
- Panel slides out to right (250ms animation)
- Canvas expands to fill space (250ms, synchronized)
- Panel header shows "Show Panel" button (optional)

**Show Panel:**
- User presses `Cmd+\` (or clicks Show button)
- Panel slides in from right (250ms animation)
- Canvas contracts (250ms, synchronized)
- Last active pane restored (exact state)

**Focus Management:**
- Hide Panel → Focus returns to Canvas
- Show Panel → Focus moves to Panel (first pane tab)
- Seamless keyboard navigation

### 4.6 Cross-Panel Communication

**Canvas ↔ Panel Events:**

**Canvas emits:**
- `asset-selected` → Panel updates Monitor pane
- `widget-selected` → Panel switches to Format pane
- `node-selected` → Panel switches to Properties pane
- `filter-applied` → Panel updates Filters pane

**Panel emits:**
- `asset-clicked-in-browse` → Canvas navigates camera to asset
- `widget-drag-start` → Canvas shows drop zones
- `property-changed` → Canvas updates widget appearance
- `data-source-connected` → Canvas refreshes data

**Event Bus Pattern:**
```typescript
// Canvas listens
eventBus.on('asset-clicked-in-browse', (data) => {
    sceneCanvas.flyToAsset(data.assetId);
    sceneCanvas.selectAsset(data.assetId);
});

// Panel emits
eventBus.emit('asset-clicked-in-browse', {
    assetId: 'AHU-07',
    camera: { position: [x, y, z] }
});
```

**Bi-Directional Sync:**
- User clicks asset in Scene Canvas → Panel updates
- User clicks asset in Panel hierarchy → Scene Canvas updates
- Always synchronized (single source of truth)

### 4.7 State Persistence

**What Gets Saved:**
- Panel width (per user, global across contexts)
- Active pane per context (last used)
- Open/closed drawers per pane (per context)
- Scroll position per pane (per context)
- User preferences (auto-expand enabled/disabled)

**Storage:**
```typescript
// On panel state change
localStorage.setItem('panel-state', JSON.stringify({
    width: 380,
    visible: true,
    contexts: { ... }
}));

// On mount
const savedState = JSON.parse(localStorage.getItem('panel-state'));
restorePanelState(savedState);
```

**Persistence Timing:**
- Width: Saved on drag end (debounced 300ms)
- Pane: Saved immediately on switch
- Drawer: Saved immediately on toggle
- Scroll: Saved on pane switch or navigation

---

## 5. Implementation & Integration

### 5.1 Component Architecture

**React Component Structure:**
```typescript
<UniversalPanel
    context={currentContext}
    width={panelWidth}
    visible={panelVisible}
    onResize={handleResize}
    onClose={handleClose}
>
    <PaneTabs
        panes={contextConfig.panes}
        activePane={activePane}
        onPaneChange={setActivePane}
    />
    
    <PaneContent activePane={activePane}>
        {contextConfig.panes.map(pane => (
            <Pane key={pane.id} active={pane.id === activePane}>
                {pane.drawers.map(drawer => (
                    <Drawer
                        key={drawer.id}
                        title={drawer.title}
                        open={drawerState[drawer.id]}
                        onToggle={() => toggleDrawer(drawer.id)}
                    >
                        {drawer.content}
                    </Drawer>
                ))}
            </Pane>
        ))}
    </PaneContent>
</UniversalPanel>
```

**Context Configuration Loader:**
```typescript
const getContextConfig = (pathname: string): PanelConfig => {
    if (pathname === '/visualize') {
        return assetManagerConfig;
    }
    if (pathname.startsWith('/dashboard')) {
        return dashboardBuilderConfig;
    }
    if (pathname.startsWith('/workflow')) {
        return workflowEditorConfig;
    }
    // ... more contexts
    return null; // No panel for this route
};
```

### 5.2 Performance Optimization

**Lazy Pane Rendering:**
- Only active pane renders (inactive panes display: none)
- Inactive pane content unmounted (React.lazy)
- Reduces memory footprint

**Virtualized Drawers:**
- If drawer has 100+ items (rare), use virtual scrolling
- Only render visible items + buffer
- Smooth scroll on 1000+ item lists

**Debounced Resize:**
```typescript
const handleResize = useDebouncedCallback((newWidth: number) => {
    setPanelWidth(newWidth);
    localStorage.setItem('panel-width', String(newWidth));
}, 16); // 60fps
```

**Memoized Content:**
```typescript
const DrawerContent = memo(({ data }) => {
    return <ExpensiveComponent data={data} />;
});
```

### 5.3 Accessibility Implementation

**ARIA Landmarks:**
```html
<aside class="universal-panel" role="complementary" aria-label="Tool panel">
    <div role="tablist" aria-label="Panel sections">
        <button role="tab" aria-selected="true">Browse</button>
        <button role="tab" aria-selected="false">Monitor</button>
        <button role="tab" aria-selected="false">Analyze</button>
    </div>
    
    <div role="tabpanel" aria-labelledby="browse-tab">
        <!-- Browse pane content -->
    </div>
</aside>
```

**Drawer Accordion:**
```html
<div class="drawer">
    <h3>
        <button
            aria-expanded="true"
            aria-controls="hierarchy-content"
        >
            Hierarchy
        </button>
    </h3>
    <div id="hierarchy-content" role="region">
        <!-- Drawer content -->
    </div>
</div>
```

**Keyboard Navigation:**
- `Tab` → Enter Panel, focus first pane tab
- `Arrow Left/Right` → Navigate pane tabs
- `Enter` → Activate focused pane
- `Tab` → Move to first drawer header
- `Arrow Up/Down` → Navigate drawer headers
- `Enter` → Toggle focused drawer
- `Tab` → Enter drawer, focus first interactive element
- `Escape` → Return focus to Canvas

**Screen Reader Announcements:**
```typescript
announceToScreenReader('Browse pane activated');
announceToScreenReader('Hierarchy drawer expanded');
announceToScreenReader('Asset AHU-07 selected');
```

### 5.4 Responsive Behavior

**Desktop (1024px+):**
- Full Panel (280-600px adjustable width)
- All features available
- Resizable, pinnable

**Tablet (768-1023px):**
- Panel as full-screen modal (when opened)
- Button in Header to open Panel
- Same pane/drawer structure
- "Done" button to close and return to Canvas

**Mobile (<768px):**
- Panel hidden by default (view-only mode)
- If building features needed: Full-screen modal
- Simplified interface (fewer drawers, essential only)
- Most creation workflows desktop-only

**Responsive CSS:**
```css
@media (max-width: 1023px) {
    .universal-panel {
        position: fixed;
        inset: 0;
        width: 100%;
        z-index: 2000;
        transform: translateX(100%);
    }
    
    .universal-panel.open {
        transform: translateX(0);
    }
}
```

### 5.5 Dark Theme Support

**Panel Colors:**
```css
:root {
    --panel-bg: #ffffff;
    --panel-border: #d2d2d7;
    --panel-tab-bg: #f5f5f7;
    --panel-drawer-hover: #e5e5e7;
}

[data-theme="dark"] {
    --panel-bg: #1c1c1e;
    --panel-border: #38383a;
    --panel-tab-bg: #2c2c2e;
    --panel-drawer-hover: #3a3a3c;
}
```

**Drawer Content:**
- Controls (inputs, buttons) use semantic tokens
- Charts use theme-aware color scales
- Icons adapt to theme (currentColor)

### 5.6 Error Handling

**Panel Load Failure:**
```typescript
<ErrorBoundary fallback={<PanelErrorState />}>
    <UniversalPanel context={context} />
</ErrorBoundary>
```

**Error State UI:**
```
┌─────────────────────────────────┐
│  ⚠️ Panel Unavailable          │
│                                 │
│  Unable to load tools.          │
│                                 │
│  [Retry] [Hide Panel]           │
└─────────────────────────────────┘
```

**Partial Errors:**
- If one drawer fails to load, show error in that drawer only
- Other drawers continue to function
- User can reload failed drawer independently

### 5.7 Testing Requirements

**Unit Tests:**
- Pane switching (active pane updates correctly)
- Drawer toggle (open/close state)
- Resize constraints (min/max width enforced)
- State persistence (localStorage read/write)
- Auto-expand logic (correct drawer expands)

**Integration Tests:**
- Canvas ↔ Panel communication (events fire correctly)
- Context switching (state persists and restores)
- Keyboard navigation (Tab, Arrow keys work)
- Resize interaction (Canvas width adjusts)

**Visual Regression Tests:**
- Panel appearance (all contexts)
- Pane tabs (hover, active states)
- Drawer states (open, closed, animations)
- Dark theme
- Responsive layouts

**Accessibility Tests:**
- Keyboard navigation (can reach all controls)
- Screen reader (ARIA roles, labels, announcements)
- Focus management (focus visible, logical order)
- Color contrast (4.5:1 text, 3:1 UI elements)

---

## Appendix

### A. Design Tokens

```css
/* Panel Dimensions */
--panel-width-min: 280px;
--panel-width-default: 360px;
--panel-width-max: 600px;

/* Panel Layout */
--panel-pane-tab-height: 44px;
--panel-drawer-header-height: 44px;
--panel-drawer-padding: 16px;

/* Panel Colors */
--panel-bg: var(--color-surface);
--panel-border: var(--color-border);
--panel-tab-bg: var(--color-bg-secondary);
--panel-drawer-hover: var(--color-bg-hover);

/* Panel Transitions */
--panel-drawer-duration: 200ms;
--panel-resize-duration: 250ms;
--panel-slide-duration: 250ms;
--panel-easing: cubic-bezier(0.4, 0.0, 0.2, 1);

/* Panel Z-Index */
--z-panel: 200;
--z-panel-resize-handle: 201;
```

### B. Context Config Schema

```typescript
interface PanelConfig {
    context: string;
    headerTitle?: string;
    panes: PaneConfig[];
    defaultPane: string;
}

interface PaneConfig {
    id: string;
    label: string;
    icon?: string;
    drawers: DrawerConfig[];
}

interface DrawerConfig {
    id: string;
    title: string;
    defaultOpen: boolean;
    content: React.ReactNode;
}
```

### C. Event Bus API

```typescript
interface PanelEvents {
    'asset-selected': { assetId: string; metadata: object };
    'asset-clicked-in-browse': { assetId: string; camera: object };
    'widget-selected': { widgetId: string; type: string };
    'widget-drag-start': { widgetType: string };
    'property-changed': { property: string; value: any };
    'data-source-connected': { sourceId: string; status: string };
    'node-selected': { nodeId: string; type: string };
    'filter-applied': { filters: object };
}
```

### D. Performance Benchmarks

| Metric | Target | Critical |
|--------|--------|----------|
| Pane switch | <16ms | <50ms |
| Drawer toggle | <200ms | <300ms |
| Resize (60fps) | <16ms/frame | <32ms/frame |
| Context switch | <100ms | <300ms |
| State save | <10ms | <50ms |
| Auto-expand | <100ms | <200ms |

---

**End of Document**

*This specification defines the Universal Panel system. Context-specific implementations (Asset Manager, Dashboard Builder, etc.) will follow these architectural principles while providing specialized content within panes and drawers.*
