# Tagwaye Layout Design Specifications

**Version:** 1.0  
**Date:** November 13, 2025  
**Status:** Final Draft  
**Authors:** Design & Engineering Team

---

## Table of Contents

1. [Overview & Design Principles](#1-overview--design-principles)
2. [Layout Architecture](#2-layout-architecture)
3. [Zone Specifications](#3-zone-specifications)
4. [Responsive Behavior](#4-responsive-behavior)
5. [Implementation Guidelines](#5-implementation-guidelines)

---

## 1. Overview & Design Principles

### 1.1 Platform Vision

Tagwaye is a decision intelligence platform for the built environment, powered by AI-enhanced digital twins called LivingTwins. The layout architecture serves as the foundation for delivering spatial, temporal, and intelligent insights across the entire building lifecycle—from design through decommissioning.

### 1.2 Core Design Principles

The Tagwaye layout is governed by five foundational principles that ensure consistency, usability, and excellence across all user interactions:

#### **Principle 1: Clarity — Contextual Confidence**

Users always know where they are, what they're seeing, what they can do, and why it matters now. The interface eliminates ambiguity without eliminating nuance, amplifies relevant information, minimizes distractions, and provides immediate meaningful feedback and rationale—fostering trust, confidence, and fluent decision-making.

**Application:**
- Persistent spatial breadcrumbs in footer center zone
- Visual highlighting of selected assets in Scene Canvas
- Status indicators always visible (connection state, sync status)
- Contextual panel content that adapts to selection

#### **Principle 2: Deference — Content Over Chrome**

Content—the building, digital twins, data, and human decisions—is the undisputed hero. Interface elements graciously recede or emerge only as needed, never competing with insight or obscuring judgment, while providing subtle, supportive guidance.

**Application:**
- MainContent (Universal Canvas) occupies 60-70% of viewport
- Sidebar collapses to 64px icon strip when not in use
- Panel slides in only when asset selected or explicitly invoked
- Timeline collapses to 48px strip showing only current phase
- All chrome uses translucent backgrounds and subtle borders

#### **Principle 3: Depth — Progressive Disclosure**

The UI begins simple and unfurls complexity aligned to user intent and expertise, avoiding cognitive overload while empowering deep interaction and mastery. Power users have direct paths to depth without traversing intermediate layers.

**Application:**
- CXO sees strategic dashboard; BIM Specialist sees full technical detail
- Panel panes collapse by default, expand on interaction
- Drawers within panes provide additional layering
- Keyboard shortcuts (Cmd+Shift+P) jump directly to advanced features
- Four view modes (Balanced, Focus, Analysis, Presentation) adapt to task

#### **Principle 4: Continuity — Time as Truth**

Buildings have memory. Every asset shows its history, every system its trajectory, every decision its consequence over time. The timeline is always accessible—collapsed when irrelevant, expanded when investigating. Users scrub through past, present, and projected future as naturally as orbiting the building. 4D through 8D dimensions integrate into spatial view, not separate tabs. Time isn't a feature. It's how buildings actually exist.

**Application:**
- Timeline zone spans full width beneath MainContent
- Multi-pane horizontal structure (Phases, Scrubber, Controls, Scenarios)
- Scrubbing timeline updates Scene Canvas in real-time
- Asset properties panel shows temporal trends and predictions
- Lifecycle phases always visible in timeline header

#### **Principle 5: Intelligence — AI Suggests, User Decides**

AI illuminates options and risks users might miss. It explains its reasoning transparently, cites sources, and quantifies confidence. But it never acts autonomously. Every suggestion requires human approval. Users can dismiss any recommendation without consequence or explanation. When AI is wrong, the system learns. When AI is uncertain, it says so explicitly. When a user overrides AI, that choice is respected and logged—not flagged as "ignored recommendation." The human is always right to choose differently.

**Application:**
- AI insights appear as floating cards near affected systems in Scene Canvas
- Intelligence pane in Panel shows recommendations with "Why?" explanations
- No auto-execution—all AI actions require explicit user approval
- Transparent confidence indicators on all AI predictions
- Ask Sage AI assistant available via Cmd+K, never intrusive

---

### 1.3 User-Centric Approach

Tagwaye serves diverse user types across the building lifecycle:

- **Executive Leadership (CXOs):** Portfolio health, strategic decisions, ROI insights
- **Senior Management (VPs, Directors):** Program status, resource allocation, cross-project dependencies
- **Operational Management (Managers):** Active workstreams, team capacity, milestone tracking, exception management
- **Execution Team/Specialists (Architects, Engineers, BIM Managers, Analysts):** Technical workbench, data quality, simulation tools, collaboration feeds

**Critical Principle:** Users do not experience "modules"—they experience one unified platform. The interface adapts to the user's role and context, not the other way around. Navigation is through spatial and temporal dimensions (the building and its lifecycle), not through application menus.

---

## 2. Layout Architecture

### 2.1 Six-Zone Grid System

Tagwaye's layout is built on a CSS Grid foundation with six distinct zones, each serving a specific purpose in the user experience:

```
┌─────────────────────────────────────────────────────────┐
│  1. HEADER                                              │
├────┬────────────────────────────────────────┬───────────┤
│    │                                        │           │
│ 2. │         3. MAINCONTENT                 │  4. PANEL │
│    │      (Universal Canvas)                │  (Multi-  │
│ S  │                                        │   Pane)   │
│ I  │   • Pages/Dashboards                   │           │
│ D  │   • Scene Canvas (3D/Twin)             │           │
│ E  │   • Prism Canvas (Builder)             │           │
│ B  │   • Flow Canvas (Workflows)            │           │
│ A  │   • Dual View Support                  │           │
│ R  │                                        │           │
│    │                                        │           │
├────┴────────────────────────────────────────┴───────────┤
│  5. TIMELINE (Multi-Pane Horizontal)                    │
├─────────────────────────────────────────────────────────┤
│  6. FOOTER                                              │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Grid Template Definition

**Desktop (1024px+):**
```css
grid-template-areas:
    "header header header header"
    "sidebar main main panel"
    "sidebar timeline timeline panel"
    "footer footer footer footer";

grid-template-rows: 
    56px        /* Header: fixed */
    1fr         /* MainContent: flexible */
    48px        /* Timeline: collapsed (320px expanded) */
    40px;       /* Footer: fixed */

grid-template-columns: 
    64px        /* Sidebar: collapsed (280px expanded) */
    1fr         /* MainContent: flexible */
    0px         /* Spacer */
    0px;        /* Panel: hidden (400px when open) */
```

### 2.3 Layout States

The grid dynamically adjusts based on user interaction:

| State | Sidebar | Panel | Timeline | Grid Columns |
|-------|---------|-------|----------|--------------|
| **Default** | Collapsed (64px) | Hidden (0px) | Collapsed (48px) | `64px 1fr 0px 0px` |
| **Sidebar Expanded** | Expanded (280px) | Hidden (0px) | Collapsed (48px) | `280px 1fr 0px 0px` |
| **Panel Open** | Collapsed (64px) | Open (400px) | Collapsed (48px) | `64px 1fr 0px 400px` |
| **Both Expanded** | Expanded (280px) | Open (400px) | Collapsed (48px) | `280px 1fr 0px 400px` |
| **Timeline Expanded** | Any | Any | Expanded (320px) | Rows adjust to `56px 1fr 320px 40px` |
| **Timeline Hidden** | Any | Any | Hidden (0px) | Grid template changes to 3 rows |

### 2.4 Minimum Canvas Constraints

To ensure usable 3D visualization and data presentation, MainContent must never fall below:

- **Minimum Width:** 1080px
- **Minimum Height:** 600px

When viewport constraints violate these minimums, the layout switches to responsive mode (see Section 4).

---

## 3. Zone Specifications

### 3.1 Header (Zone 1)

**Purpose:** Global orientation, navigation, and quick actions  
**Height:** 56px (fixed)  
**Visibility:** Always visible (persistent)

#### Structure: Three-Zone Layout

```
┌─────────────────────────────────────────────────────────┐
│  LEFT              CENTER              RIGHT            │
│  Brand + Search    [Empty/Context]     Project + Utils  │
└─────────────────────────────────────────────────────────┘
```

**Left Zone (justify-start):**
- **Brand:** "Tagwaye" wordmark (17px, 600 weight, -0.02em letter-spacing)
- **Global Search:** Omni-field input (320px min-width, Cmd+K to focus)
  - Natural language queries
  - Searches: assets, spaces, people, decisions, documents, time
  - Morphs to breadcrumbs when navigating deep contexts

**Center Zone (justify-center):**
- Reserved for contextual indicators
- Can display active mode, current view state, or system messages
- Typically empty in default state

**Right Zone (justify-end):**
- **Active Project Pill:** Current building/portfolio context
  - Icon + Label + Dropdown chevron
  - Click to switch buildings
  - Shows live status indicator (● Live / ○ Offline / ◐ Syncing)
- **Notification Button:** Bell icon with badge indicator
- **User Avatar:** User menu access

**Styling:**
- Background: `rgba(255, 255, 255, 0.8)` with `backdrop-filter: blur(20px)`
- Border-bottom: `1px solid var(--color-border)`
- Translucent to create depth without blocking content beneath

---

### 3.2 Sidebar (Zone 2)

**Purpose:** Primary navigation, module switching, intelligence feed  
**Width:** 64px collapsed / 280px expanded  
**Visibility:** Always present (minimum as icon strip)

#### Structure: Three-Zone Vertical Layout

**Top Zone:**
- Menu toggle button (pin/unpin sidebar expanded state)
- Acts as anchor for sidebar identity

**Main Zone (flex: 1, overflow-y: auto):**
- **Navigation Items:**
  - Scene (Cube icon) — 3D/BIM LivingTwin viewer
  - Dashboard (Layout icon) — Data visualization and KPIs
  - Builder (Sparkles icon) — Prism Canvas for dashboard creation
  - Workflows (Workflow icon) — Flow Canvas for process design
- **Divider**
- **View Modes:**
  - Dual View toggle (Columns icon)
- **Divider**
- **Contextual Actions:**
  - Intelligence (Lightbulb icon) — AI insights feed
  - Collaboration (Users icon) — Team presence and activity

**Bottom Zone:**
- Settings access
- User preferences
- Help/documentation

**Behavior:**
- **Desktop:** Hover to expand (200ms delay), leave to collapse (300ms delay)
- **Pinned State:** Click menu toggle to lock expanded state
- **Active Indicator:** Current canvas highlighted with accent color background
- **Label Visibility:** Labels fade in when expanded (`opacity: 0 → 1`, 250ms transition)

**Responsive:**
- **Desktop (1024px+):** Vertical left rail
- **Tablet (768-1023px):** Hidden (navigation moves to mobile patterns)
- **Mobile (<768px):** Hidden (navigation moves to bottom tab bar)

---

### 3.3 MainContent (Zone 3) — Universal Canvas

**Purpose:** Primary workspace where all content renders  
**Size:** Flexible (fills remaining space after Sidebar/Panel)  
**Visibility:** Always visible (the sacred center)

#### Canvas Types

MainContent is not a container—it's a **mounting point** for different canvas types:

**A. Standard Pages**
- Dashboard grids (cards, widgets, charts)
- Table views (asset lists, schedules, reports)
- Form views (data entry, configuration, settings)
- Report views (generated documents, exports)

**B. Scene Canvas** — 3D/BIM LivingTwin Viewer
- Interactive 3D viewport powered by WebGL/Three.js
- Real-time twin rendering with LOD (level of detail) streaming
- Spatial navigation (orbit, pan, zoom, select)
- Asset selection triggers Panel with contextual properties
- Overlays: heatmaps, annotations, measurements, system traces, AI insights

**C. Prism Canvas** — Dashboard Builder
- Drag-drop dashboard creation interface
- Widget library (charts, KPIs, tables, maps)
- Real-time preview mode
- Grid-based layout system with snap-to-grid
- Responsive breakpoint preview (Desktop/Tablet/Mobile)

**D. Flow Canvas** — Workflow Designer
- Node-based workflow editor
- Process mapping and automation builder
- Visual logic connections (triggers, conditions, actions)
- Integration with building systems and data sources

#### Dual View Mode

MainContent supports **Dual View**—displaying two canvases side-by-side for comparative analysis:

```
┌─────────────────────┬───┬─────────────────────┐
│   Scene Canvas      │ │ │   Dashboard View    │
│   (3D LivingTwin)   │ ÷ │   (Charts/Data)     │
│                     │ │ │                     │
└─────────────────────┴───┴─────────────────────┘
```

**Dual View Specifications:**
- **Default Split:** 60% Scene / 40% Dashboard
- **Resizable Divider:** 4px wide, draggable with mouse
- **Constraints:** Minimum 20% per side, maximum 80% per side
- **Divider Styling:**
  - Default: `var(--color-border)`
  - Hover: `var(--color-accent)`
  - Cursor: `col-resize`
  - Handle indicator: Centered pill with subtle drop shadow
- **Synchronization:** Timeline scrubbing updates both canvases simultaneously
- **Exit:** Click "Dual View" sidebar item again to return to single view

**Responsive Behavior:**
- **Desktop (1024px+):** Full dual view support with resizable divider
- **Tablet (768-1023px):** Single view only (dual view disabled)
- **Mobile (<768px):** Single view only

---

### 3.4 Panel (Zone 4) — Multi-Pane Contextual

**Purpose:** Deep-dive on selected elements, AI assistant, properties  
**Width:** 0px hidden / 400px standard / 600px expanded  
**Visibility:** Contextual (slides in based on selection or invocation)

#### Structure

**Panel Header (fixed, 56px):**
- Title (dynamic based on context: "Asset Details", "Ask Sage", "Properties")
- Close button (X icon, closes panel)

**Panel Content (flex: 1, overflow-y: auto):**
- Multi-pane vertical stack
- Each pane independently collapsible
- Each pane independently scrollable

#### Panel Panes (Vertical)

**1. Identity Pane**
- What is this asset/element?
- ID, type, location, photo, QR code
- "Share this asset" quick action
- Always visible when panel open

**2. Insights Pane**
- Live data and real-time metrics
- Trends (sparklines, mini charts)
- Status indicators (health, performance, operational state)
- **Drawers within pane:**
  - Performance Metrics drawer (temperature, pressure, airflow)
  - Operational Status drawer (current state, mode, alerts)

**3. Intelligence Pane**
- AI analysis and recommendations
- Risk alerts with severity indicators
- Pattern detections and anomaly flags
- Each insight has "Why?" button explaining AI reasoning
- "Apply Recommendation" buttons (never auto-execute)

**4. Timeline Pane**
- Mini horizontal timeline for this specific asset
- Installation → Maintenance → Current → Predicted
- Click to expand into full Timeline zone below

**5. Activity Pane**
- Chronological feed (comments, changes, approvals)
- Who edited what and when
- Document attachments
- Collapsed by default

**6. Actions Pane**
- Role-appropriate action buttons
- Create work order, Update parameters, Run simulation, Export data, Request approval
- Always visible at bottom of panel

#### Drawer System

Panes can contain **drawers**—collapsible sub-sections for additional organization:

```
┌─────────────────────────────────────┐
│  Pane Header              [▼]      │  ← Pane (collapsible)
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐ │
│  │ Drawer Header        [▼]     │ │  ← Drawer (nested collapsible)
│  ├───────────────────────────────┤ │
│  │ Drawer Content               │ │
│  │ • Item 1                     │ │
│  │ • Item 2                     │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Interaction Pattern:**
- Click pane header → Collapses entire pane (chevron: ▼ → ▶)
- Click drawer header → Collapses just that drawer
- Identical interaction pattern to Timeline panes (learn once, use everywhere)

#### Panel Context Modes

Panel content adapts based on MainContent state:

| MainContent State | Panel Shows |
|-------------------|-------------|
| Scene Canvas + asset selected | Asset properties, insights, AI analysis |
| Prism Canvas + widget selected | Widget configuration, styling options |
| Flow Canvas + node selected | Node settings, connections, logic |
| Dashboard page (nothing selected) | Ask Sage AI assistant |
| User invokes Cmd+K | Ask Sage (AI chat interface) |

**Ask Sage Mode:**
- Full-height chat interface
- Context-aware Q&A (knows current view, selected assets)
- Shows reasoning and cites data sources
- Can propose actions (user must approve)
- Floating option: Drag panel header → becomes floating window

---

### 3.5 Timeline (Zone 5) — Multi-Pane Horizontal

**Purpose:** Temporal navigation (4D-8D), lifecycle phase awareness  
**Height:** 48px collapsed / 320px expanded  
**Visibility:** Contextual (appears when temporal context relevant)  
**Width:** Full width (spans entire layout except Panel)

#### Timeline Header (collapsed state, 48px)

Visible when timeline collapsed, acts as both indicator and toggle:

```
┌─────────────────────────────────────────────────────────┐
│ [Clock Icon] Timeline · Operate Phase · Nov 13, 2025 [▲]│
└─────────────────────────────────────────────────────────┘
```

- **Left:** Icon + Title + Current phase + Current date
- **Right:** Collapse/expand chevron
- **Hover:** Background highlight to indicate clickability
- **Click:** Expands to full multi-pane view

#### Timeline Content (expanded state, 320px)

Multi-pane horizontal structure, identical interaction pattern to Panel:

**Pane 1: Phases (200px)**
- Vertical list of lifecycle phases:
  - Plan
  - Design
  - Build
  - **Operate** (current, highlighted with accent color)
  - Maintain
  - Decommission
- Click phase → jumps to that time period in scrubber

**Pane 2: Scrubber (flexible, min 400px)**
- Horizontal timeline visualization
- Phase markers (vertical lines dividing phases)
- Event annotations (milestones, incidents, decisions)
- Scrubber handle (draggable)
- Thumbnail previews on hover (state of building at that moment)
- Range selector (dual handles for comparing two periods)

**Pane 3: Controls (200px)**
- **Playback:**
  - Play/Pause button
  - Speed selector (0.5x, 1x, 2x, 5x, 10x)
  - Loop toggle
- **Navigation:**
  - Previous/Next event buttons
  - Jump to phase buttons

**Pane 4: Scenarios (200px)**
- Dropdown selector:
  - Baseline (as-built)
  - Alternative 1
  - Alternative 2
  - Compare mode (split view)
- Add scenario button
- Manage scenarios link

#### Timeline Behavior

**When Timeline Appears:**
- User viewing Scene Canvas with temporal data
- User running 4D/5D/6D/7D/8D simulations
- User comparing as-designed vs. as-built scenarios
- User reviewing project history or maintenance records

**Scrubbing Interaction:**
- Drag scrubber handle → MainContent updates in real-time (60fps target)
- Scene Canvas renders different time states (construction phasing, system changes)
- Dashboard charts update to show data for selected time period
- Panel shows temporal context for selected asset

**Integration Points:**
- Synchronized with Scene Canvas rendering
- Panel Timeline pane shows asset-specific temporal data
- Footer breadcrumbs update to show temporal context

**Toggle Visibility:**
- Footer has "Timeline" button to show/hide zone entirely
- Keyboard shortcut: Cmd+T (toggle expanded/collapsed), Cmd+Shift+H (hide completely)

---

### 3.6 Footer (Zone 6)

**Purpose:** System status, context awareness, quick settings  
**Height:** 40px (fixed)  
**Visibility:** Always visible (persistent)

#### Structure: Three-Zone Layout

```
┌─────────────────────────────────────────────────────────┐
│  LEFT                CENTER                RIGHT        │
│  Status Info         Breadcrumbs           Controls     │
└─────────────────────────────────────────────────────────┘
```

**Left Zone (justify-start, color: text-secondary):**
- **Connection Status:**
  - ● Live (green dot) — real-time connection active
  - ○ Offline (gray dot) — no connection
  - ◐ Syncing (animated pulse) — data synchronizing
- **Performance:** Render time (e.g., "47ms")
- **Collaboration:** Active users count (e.g., "3 users viewing")
- Separated by `|` dividers

**Center Zone (justify-center, color: text-secondary):**
- **Spatial Breadcrumbs:** Current location in twin hierarchy
  - Format: `Building A › Level 3 › HVAC North › AHU-07`
  - Clickable (navigate up hierarchy)
  - Truncates gracefully on narrow screens
  - Updates dynamically as user selects assets in Scene Canvas

**Right Zone (justify-end):**

Four dropdown controls (all same styling for consistency):

**1. Timeline (Clock icon)**
- Toggle timeline visibility (show/hide zone entirely)
- Active state when timeline visible

**2. View (Eye icon)**
- Dropdown menu:
  - Single View
  - Dual View

**3. Layout (Layout icon)**
- Dropdown menu:
  - Normal (default)
  - Compact (minimal chrome)
  - Expansive (hide chrome, maximize canvas)
  - Custom (State shown when user makes any changes on any of the above three like resizing the Panel)


**4. Theme (Palette icon)**
- Dropdown menu:
  - Light Theme
  - Dark Theme
  - Auto (follows system preference)

**Dropdown Styling:**
- Button: Icon + Label + Chevron-down
- Padding: 4px 8px
- Border: 1px solid var(--color-border)
- Border-radius: 6px
- Hover: Background highlight
- Font-size: 13px

---

## 4. Responsive Behavior

### 4.1 Breakpoint Strategy

Tagwaye uses a **device-class approach** rather than arbitrary pixel breakpoints:

| Device Class | Range | Primary Input | Layout Strategy |
|--------------|-------|---------------|-----------------|
| **Desktop** | 1024px+ | Mouse + Keyboard | Full six-zone layout, all features |
| **Tablet Landscape** | 768-1023px | Touch + Keyboard | Simplified layout, sidebar hidden, panel slide-over |
| **Tablet Portrait** | 600-767px | Touch | Mobile-first approach, full-screen modals |
| **Mobile** | <600px | Touch | Minimal chrome, bottom navigation |

### 4.2 Desktop Layout (1024px+)

**No Compromises — Full Feature Set**

All six zones active with complete functionality:
- Sidebar: Vertical left rail (hover to expand)
- MainContent: Full canvas with dual view support
- Panel: Right-side panel (resizable 400-600px)
- Timeline: Full-width horizontal multi-pane
- Keyboard shortcuts: All enabled
- Gestures: Trackpad gestures for Scene Canvas navigation

### 4.3 Tablet Layout (768-1023px)

**Adaptive Simplification**

```
┌─────────────────────────────────────┐
│  HEADER (simplified)                │
├─────────────────────────────────────┤
│                                     │
│  MAINCONTENT                        │
│  (Single view only)                 │
│                                     │
├─────────────────────────────────────┤
│  TIMELINE (docked, 200px expanded)  │
├─────────────────────────────────────┤
│  FOOTER (condensed)                 │
└─────────────────────────────────────┘
```

**Changes from Desktop:**
- **Sidebar:** Hidden (navigation through header menu or bottom toolbar)
- **Panel:** iOS-style slide-over (320px, overlays MainContent from right)
- **Timeline:** Reduced expanded height (200px instead of 320px)
- **Dual View:** Disabled (single view only)
- **Header Search:** Reduced to 240px width
- **Footer Breadcrumbs:** Truncate middle segments if needed

**Grid Template:**
```css
grid-template-areas:
    "header header header"
    "main main main"
    "timeline timeline timeline"
    "footer footer footer";
grid-template-columns: 1fr 0px 0px;
```

**Panel as Slide-Over:**
- Position: Fixed right
- Width: 400px
- Height: 100vh
- Transform: `translateX(100%)` when closed
- Transition: 250ms ease
- Backdrop: Semi-transparent overlay (dismisses panel on click)

### 4.4 Mobile Layout (<768px)

**Content-First, Touch-Optimized**

```
┌─────────────────┐
│  HEADER (mini)  │
├─────────────────┤
│                 │
│  MAINCONTENT    │
│  (Dashboard or  │
│   "View 3D")    │
│                 │
│                 │
├─────────────────┤
│  FOOTER (icons) │
└─────────────────┘
```

**Significant Adaptations:**
- **Sidebar:** Hidden (navigation via bottom tab bar or header hamburger)
- **Header:**
  - Logo + Hamburger menu (left)
  - Notification + User (right)
  - Search: Hidden (access via menu)
  - Project Pill: Hidden (access via menu)
- **MainContent:**
  - Default: Dashboard cards (metrics, alerts, quick actions)
  - Scene Canvas: "View 3D" button launches simplified touch viewer
  - Touch gestures: Single-finger pan, pinch zoom, two-finger rotate
- **Panel:**
  - Full-screen modal (slides up from bottom)
  - Header with back button
  - Scrollable content
- **Timeline:** Hidden (access via footer button → full-screen timeline view)
- **Footer:**
  - Minimal (icons only, no labels)
  - Status (left) + Breadcrumbs hidden + Controls (right)

**Grid Template:**
```css
grid-template-areas:
    "header"
    "main"
    "footer";
grid-template-rows: 56px 1fr 40px;
```

### 4.5 Responsive Design Tokens

CSS variables that change per breakpoint:

```css
/* Desktop (1024px+) */
--sidebar-width-collapsed: 64px;
--sidebar-width-expanded: 280px;
--panel-width: 400px;
--timeline-height-expanded: 320px;
--header-search-width: 320px;

/* Tablet (768-1023px) */
@media (max-width: 1023px) {
    --panel-width: 320px;
    --timeline-height-expanded: 200px;
    --header-search-width: 240px;
}

/* Mobile (<768px) */
@media (max-width: 767px) {
    --header-search-width: 0px; /* hidden */
    --footer-breadcrumbs: none; /* hidden */
}
```

---

## 5. Implementation Guidelines

### 5.1 Technology Stack

**Core:**
- HTML5 (semantic markup)
- CSS3 (Grid, Flexbox, Custom Properties)
- JavaScript (ES6+, no framework for MVP)

**Production Recommendations:**
- React (component architecture, state management)
- Vanilla Extract (zero-runtime CSS-in-JS with design tokens)
- Framer Motion (smooth transitions and spring physics)
- Three.js (Scene Canvas 3D rendering)
- WebSocket (real-time collaboration)

**Icons:**
- Lucide (outline style only)
- CDN: `https://unpkg.com/lucide@latest/dist/umd/lucide.js`
- Initialize after DOM load: `lucide.createIcons()`

### 5.2 Design Token System

All layout values must be tokenized for consistency and themability:

```css
:root {
    /* Layout Dimensions */
    --header-height: 56px;
    --footer-height: 40px;
    --sidebar-width-collapsed: 64px;
    --sidebar-width-expanded: 280px;
    --panel-width-standard: 400px;
    --timeline-height-collapsed: 48px;
    --timeline-height-expanded: 320px;

    /* Spacing Scale */
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 12px;
    --space-lg: 16px;
    --space-xl: 24px;
    --space-2xl: 32px;

    /* Colors */
    --color-bg-primary: #ffffff;
    --color-bg-secondary: #f5f5f7;
    --color-surface: #ffffff;
    --color-border: #d2d2d7;
    --color-text-primary: #1d1d1f;
    --color-text-secondary: #86868b;
    --color-accent: #0071e3;

    /* Typography */
    --font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
    --font-size-xs: 12px;
    --font-size-sm: 13px;
    --font-size-base: 15px;
    --font-size-lg: 17px;

    /* Motion */
    --duration-fast: 150ms;
    --duration-normal: 250ms;
    --easing: cubic-bezier(0.4, 0.0, 0.2, 1);
}
```

### 5.3 Accessibility Requirements

**WCAG 2.1 Level AA Compliance:**

1. **Keyboard Navigation:**
   - All interactive elements must be keyboard accessible
   - Logical tab order (Header → Sidebar → MainContent → Panel → Timeline → Footer)
   - Visible focus indicators (2px outline, accent color)
   - Keyboard shortcuts documented and discoverable (? key shows shortcuts)

2. **Screen Reader Support:**
   - Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`)
   - ARIA labels for icon-only buttons
   - ARIA live regions for dynamic content updates
   - Alt text for all icons and images

3. **Color Contrast:**
   - Text on background: Minimum 4.5:1 ratio
   - Interactive elements: Minimum 3:1 ratio
   - Never rely on color alone (use icons, labels, patterns)

4. **Motion:**
   - Respect `prefers-reduced-motion` system preference
   - Disable transitions and animations when enabled
   - Provide alternative static views for timeline playback

5. **Text Scaling:**
   - Support browser text zoom up to 200%
   - Use relative units (rem, em) for font sizes
   - Ensure layout does not break when text scales

### 5.4 Performance Targets

**Load Performance:**
- Initial page load: <2 seconds on broadband
- First Contentful Paint (FCP): <1 second
- Time to Interactive (TTI): <3 seconds

**Runtime Performance:**
- Scene Canvas rendering: 60fps on desktop, 30fps on tablet
- Panel/Timeline transitions: 60fps
- Keyboard shortcut response: <16ms
- Asset selection feedback: Immediate (<16ms)

**Optimization Strategies:**
- Progressive LOD loading for 3D models
- Virtual scrolling for long lists (Panel Activity pane)
- Debounce search input (300ms)
- Lazy load timeline thumbnails
- IndexedDB caching for offline support

### 5.5 State Management

**Application State:**
```typescript
interface LayoutState {
    sidebar: {
        expanded: boolean;
        pinned: boolean;
    };
    panel: {
        open: boolean;
        width: number;
        activePane: string;
    };
    timeline: {
        expanded: boolean;
        visible: boolean;
        currentPhase: string;
        scrubberPosition: number;
    };
    mainContent: {
        activeCanvas: 'scene' | 'dashboard' | 'prism' | 'flow';
        dualView: boolean;
        dualViewSplit: number;
    };
    theme: 'light' | 'dark' | 'auto';
    viewMode: 'balanced' | 'focus' | 'analysis' | 'presentation';
}
```

**Persistence:**
- Save state to localStorage on change
- Restore state on page load
- Per-user preferences (server-side for logged-in users)

### 5.6 Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Cmd+B` | Toggle Sidebar (pin/unpin) | Global |
| `Cmd+I` | Toggle Panel | Global |
| `Cmd+T` | Toggle Timeline (expand/collapse) | Global |
| `Cmd+Shift+T` | Toggle Theme (Light/Dark) | Global |
| `Cmd+K` | Focus Search / Invoke Ask Sage | Global |
| `Cmd+Shift+F` | Toggle Focus Mode | Global |
| `Cmd+Shift+A` | Toggle Analysis Mode | Global |
| `Cmd+1-4` | Jump to Panel Panes | Panel open |
| `Cmd+L` | Cycle View Modes | Global |
| `Esc` | Close Panel / Exit Mode | Contextual |
| `Space` | Play/Pause Timeline | Timeline active |
| `←/→` | Step through Timeline Events | Timeline active |
| `?` | Show Keyboard Shortcuts Help | Global |

### 5.7 Testing Matrix

**Browsers:**
- Chrome/Edge (Chromium) — latest 2 versions
- Safari — latest 2 versions
- Firefox — latest 2 versions

**Devices:**
- Desktop: 1920×1080, 1440×900, 1366×768
- Tablet: iPad Pro 11" (2388×1668), iPad Air (2360×1640)
- Mobile: iPhone 15 Pro (393×852), Samsung Galaxy S24 (360×800)

**Testing Scenarios:**
1. Load time on 3G network simulation
2. Scene Canvas rendering with 10,000+ assets
3. Timeline scrubbing with 50+ phase events
4. Panel with 6 panes all expanded
5. Dual View with live data updates
6. Keyboard-only navigation (no mouse)
7. Screen reader navigation (VoiceOver, NVDA)
8. High contrast mode and dark theme
9. Browser zoom at 200%
10. Offline mode (IndexedDB cache)

---

## Appendix

### A. Grid Template Reference

```css
.app-container {
    display: grid;
    grid-template-areas:
        "header header header header"
        "sidebar main main panel"
        "sidebar timeline timeline panel"
        "footer footer footer footer";
    grid-template-rows: 56px 1fr 48px 40px;
    grid-template-columns: 64px 1fr 0px 0px;
    height: 100vh;
    width: 100vw;
    transition: 
        grid-template-columns 250ms cubic-bezier(0.4, 0.0, 0.2, 1),
        grid-template-rows 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
```

### B. Color Palette

**Light Theme:**
- Primary Background: `#ffffff`
- Secondary Background: `#f5f5f7`
- Tertiary Background: `#e8e8ed`
- Border: `#d2d2d7`
- Text Primary: `#1d1d1f`
- Text Secondary: `#86868b`
- Accent: `#0071e3`
- Success: `#34c759`
- Warning: `#ff9500`
- Error: `#ff3b30`

**Dark Theme:**
- Primary Background: `#000000`
- Secondary Background: `#1c1c1e`
- Tertiary Background: `#2c2c2e`
- Border: `#38383a`
- Text Primary: `#f5f5f7`
- Text Secondary: `#98989d`
- Accent: `#0071e3` (same)

### C. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 13, 2025 | Initial specification release |

---

**End of Document**

*This specification is a living document and will be updated as the Tagwaye platform evolves. For questions or clarifications, contact the Design & Engineering team.*
