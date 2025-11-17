# Tagwaye Timeline Design Specifications

**Version:** 1.1  
**Date:** November 14, 2025  
**Status:** Production Ready  
**Owner:** Interaction Design & Engineering

---

## Document Overview

This specification defines the Timeline component—Tagwaye's temporal navigation system for 4D-8D BIM dimensions. The Timeline enables users to traverse project lifecycles, visualize dimension-specific data across time, and interact with living digital twins through a resizable, Apple-quality interface.

**Scope:** Complete Timeline architecture including lifecycle navigation, dimension visualization, scrubber controls, playback system, and KPI integration.

**Related Documents:**
- `tagwaye-layout-design-specifications.md` (Foundation)
- `tagwaye-canvas-design-specifications.md` (3D integration)
- `tagwaye-panel-design-specifications.md` (Data sync)
- `tagwaye-master-specifications.md` (Integration patterns)
- `tagwaye-design-tokens.css` (Implementation values)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Features](#3-features)
4. [Interaction Design](#4-interaction-design)
5. [Implementation](#5-implementation)
6. [Appendices](#appendices)

---

## 1. Overview

### 1.1 Purpose

The Timeline transforms temporal data navigation from a secondary feature into a first-class interaction model. It provides:

- **Lifecycle navigation** across seven project phases (Plan → Program → Design → Build → Commission → Operate → Renew)
- **Dimension visualization** for 4D-8D BIM data (Time, Cost, Energy, Assets, Safety)
- **Temporal scrubbing** with precision controls and milestone snapping
- **Playback system** for animated progression through project timelines
- **KPI integration** showing dimension-specific metrics at any point in time

**Design Philosophy:** "Time is not a slider—it's a story." The Timeline reveals how decisions cascade through project lifecycles, making temporal relationships visible and actionable.

### 1.2 User-Centric Approach

The Timeline serves three primary user archetypes:

**Project Managers:**
- Track project progression against planned milestones
- Identify schedule delays and cost overruns in real-time
- Compare planned vs. actual timelines across phases

**Facility Operators:**
- Monitor asset performance over operational lifetime
- Analyze energy consumption patterns seasonally
- Track maintenance schedules and work order completion

**Executives:**
- Visualize portfolio-wide timelines at strategic level
- Understand financial impact of schedule changes
- Make data-informed go/no-go decisions at phase gates

### 1.3 Core Principles

**Clarity**
- Purpose evident at every zoom level (day/week/month/year)
- Lifecycle phases clearly delineated with visual hierarchy
- Current position always visible with accent-colored indicator

**Deference**
- Timeline collapses to 48px when not in active use
- Expands to 180px (or custom height) on demand
- Hides completely in presentation/fullscreen modes

**Depth**
- Three-layer information architecture (Lifecycle → Dimensions → Data)
- Progressive disclosure: collapsed shows status, expanded shows detail
- Scrubber tooltip provides instant temporal context

**Continuity**
- Smooth spring animations for all state transitions
- Scrubber maintains position across dimension switches
- Playback speed persists across sessions

**Intelligence**
- Milestone snapping guides user to important events
- Auto-pause at critical decision points
- Dimension activation based on canvas context

---

## 2. Architecture

### 2.1 Component Structure

The Timeline consists of five primary layers arranged from top to bottom:

```
┌─────────────────────────────────────────────────────────────┐
│ LIFECYCLE BAR (40px)                                        │
│ [Plan] [Program] [Design] [Build] [Commission] [Operate]   │
├─────────────────────────────────────────────────────────────┤
│ DIMENSION PILLS (48px)                                      │
│ [4D Time] [5D Cost] [6D Energy] [7D Assets] [8D Safety]    │
├─────────────────────────────────────────────────────────────┤
│ SCRUBBER CONTROLS (44px)                                    │
│ [◀ ▶ ⏸] ────●──────────────────── [1x] Day 156 • Jun 5     │
├─────────────────────────────────────────────────────────────┤
│ VISUALIZATION AREA (variable height, 48-400px)             │
│ [Bar chart / Line chart / Gantt / Custom visualization]    │
├─────────────────────────────────────────────────────────────┤
│ KPI PANEL (optional, 56px)                                 │
│ Budget: $2.4M | Schedule: -3 days | Energy: 12% under      │
└─────────────────────────────────────────────────────────────┘
```

**Hierarchy:**
1. **Lifecycle Bar** (always visible when Timeline open)
2. **Dimension Pills** (always visible when Timeline open)
3. **Scrubber Controls** (always visible when Timeline open)
4. **Visualization Area** (visible when expanded, height adjustable)
5. **KPI Panel** (optional overlay, context-dependent)

**Total Height Range:**
- Hidden: `0px`
- Collapsed: `48px` (Lifecycle + Dimensions + Scrubber)
- Expanded (default): `180px` (adds 92px visualization)
- Expanded (custom): `48-600px` (user-adjustable with Shift+↑/↓)

### 2.2 State Management

Timeline maintains four primary state categories:

**Temporal State:**
```typescript
interface TemporalState {
  currentDay: number;           // 1-365+ (project duration in days)
  granularity: 'day' | 'week' | 'month' | 'quarter' | 'year';
  mode: 'live' | 'historical';  // Live = current date, Historical = any date
  playbackSpeed: 0.25 | 0.5 | 1 | 2 | 5 | 10;
  isPlaying: boolean;
  isDragging: boolean;          // Is user dragging scrubber?
}
```

**Lifecycle State:**
```typescript
interface LifecycleState {
  activePhase: LifecyclePhase | null;  // Currently selected phase
  phases: LifecyclePhase[];            // All project phases with dates
  milestones: Milestone[];             // Key events within phases
}

interface LifecyclePhase {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  status: 'planned' | 'active' | 'completed' | 'delayed';
}

interface Milestone {
  id: string;
  name: string;
  day: number;
  type: 'decision' | 'delivery' | 'inspection' | 'payment';
  status: 'upcoming' | 'current' | 'completed' | 'missed';
}
```

**Dimension State:**
```typescript
interface DimensionState {
  activeDimension: DimensionID;     // Currently displayed dimension
  dimensions: Dimension[];          // All available dimensions
  visualizationType: 'bar' | 'line' | 'gantt' | 'heatmap' | 'custom';
}

type DimensionID = '4d' | '5d' | '6d' | '7d' | '8d';

interface Dimension {
  id: DimensionID;
  name: string;
  label: string;                    // Display label
  color: string;                    // Brand color for dimension
  unit: string;                     // e.g., 'days', '$', 'kWh'
  dataSource: string;               // API endpoint or data key
  kpis: KPI[];                      // Key performance indicators
}
```

**UI State:**
```typescript
interface TimelineUIState {
  isExpanded: boolean;              // Collapsed (48px) vs Expanded (180px+)
  isVisible: boolean;               // Hidden (0px) vs Visible
  customHeight: number | null;      // User-adjusted height (48-600px)
  showKPIPanel: boolean;            // Display KPI overlay
  tooltipData: TooltipData | null;  // Scrubber hover data
}
```

### 2.3 Layout & Positioning

**Fixed Position:**
```css
.timeline {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width-collapsed);  /* 64px */
  right: 0;
  z-index: var(--z-timeline);             /* 150 */
  background: var(--color-surface-secondary);
  border-top: 1px solid var(--color-border);
  box-shadow: var(--shadow-timeline);
}

/* Expanded Sidebar */
[data-sidebar-expanded="true"] .timeline {
  left: var(--sidebar-width-expanded);   /* 280px */
}

/* With Panel Open */
[data-panel-open="true"] .timeline {
  right: var(--panel-width-default);     /* 360px */
}
```

**Height States:**
```css
.timeline {
  height: var(--timeline-height-collapsed);  /* 48px default */
  transition: height var(--spring-duration-normal) var(--spring-easing);
}

.timeline[aria-expanded="true"] {
  height: var(--timeline-height-expanded);   /* 180px default */
}

.timeline[data-custom-height] {
  height: var(--timeline-custom-height);     /* 48-600px */
}

.timeline[aria-hidden="true"] {
  height: 0;
  border-top: none;
  box-shadow: none;
}
```

**Responsive Behavior:**

| Viewport | Timeline Width | Lifecycle Pills | Scrubber |
|----------|---------------|-----------------|----------|
| Desktop (1440px+) | Full width minus Sidebar/Panel | All visible | Full controls |
| Desktop (1024-1439px) | Full width minus Sidebar/Panel | All visible, may scroll | Full controls |
| Tablet (768-1023px) | Full width minus Sidebar (64px) | Horizontal scroll | Simplified |
| Mobile (<768px) | Full screen width | Swipe carousel | Touch-optimized |

### 2.4 Z-Index & Layering

Timeline uses unified z-index scale from design tokens:

```css
:root {
  --z-timeline: 150;                  /* Base timeline layer */
  --z-timeline-scrubber: 151;         /* Scrubber thumb */
  --z-timeline-tooltip: 152;          /* Hover tooltip */
  --z-timeline-kpi: 153;              /* KPI panel overlay */
}
```

**Stacking Context:**
1. Canvas content (`z: 100`)
2. **Timeline base** (`z: 150`)
3. **Scrubber thumb** (`z: 151`) — draggable, needs to be above track
4. **Hover tooltip** (`z: 152`) — appears above all Timeline elements
5. **KPI panel** (`z: 153`) — optional overlay with metrics
6. Panel (`z: 200`) — should appear above Timeline
7. Sidebar (`z: 900`) — always accessible
8. Header/Footer (`z: 1000`) — always on top

**Rationale:** Timeline sits between Canvas and Panel, making it visible but not intrusive. KPI panel as highest Timeline layer ensures metrics always readable.

---

## 3. Features

### 3.1 Lifecycle Bar

**Purpose:** Navigate between seven project lifecycle phases. Each phase represents a distinct stage in the built asset's journey from conception to renewal.

**Seven Lifecycle Phases:**

| Phase | Description | Typical Duration | Icon |
|-------|-------------|------------------|------|
| **Plan** | Feasibility, site selection, funding | 3-12 months | `LuLightbulb` |
| **Program** | Requirements definition, stakeholder alignment | 2-6 months | `LuClipboardList` |
| **Design** | Schematic → DD → CD documentation | 6-18 months | `LuPenTool` |
| **Build** | Procurement, construction, commissioning prep | 12-36 months | `LuHammer` |
| **Commission** | Testing, training, handover, closeout | 1-3 months | `LuCheckCircle` |
| **Operate** | Facilities management, maintenance, optimization | 20-50 years | `LuSettings` |
| **Renew** | Renovation, retrofit, decommissioning | 6-24 months | `LuRefreshCw` |

**Visual Design:**

```typescript
interface LifecyclePhaseButton {
  // Base state
  background: 'transparent';
  color: 'var(--color-text-secondary)';
  padding: '8px 12px';
  borderRadius: 'var(--radius-sm)';
  fontSize: 'var(--font-size-body)';  // 13px
  fontWeight: 'var(--font-weight-medium)';
  
  // Active state
  backgroundActive: 'var(--color-accent-secondary)';  // rgba(10, 132, 255, 0.15)
  colorActive: 'var(--color-accent-primary)';
  
  // Hover state (when not active)
  backgroundHover: 'rgba(255, 255, 255, 0.05)';
  colorHover: 'var(--color-text-primary)';
  
  // With current indicator dot
  indicator: {
    size: '6px';
    color: 'var(--color-accent-primary)';
    animation: 'pulse 2s ease-in-out infinite';
  }
}
```

**Interaction:**

1. **Click phase button** → Scrubber jumps to phase start date
2. **Click active phase** → Scrubber jumps to phase end date
3. **Hover phase** → Tooltip shows phase date range and status
4. **Keyboard navigation** → `Tab` cycles phases, `Enter`/`Space` selects

**Phase Status Indicators:**

```typescript
type PhaseStatus = 'planned' | 'active' | 'completed' | 'delayed';

// Visual representation
const statusStyles = {
  planned: {
    opacity: 0.5,
    border: '1px dashed var(--color-border-subtle)'
  },
  active: {
    opacity: 1,
    border: '2px solid var(--color-accent-primary)',
    indicator: true  // Shows pulsing dot
  },
  completed: {
    opacity: 0.8,
    icon: 'LuCheck',
    iconColor: 'var(--color-success)'
  },
  delayed: {
    opacity: 1,
    border: '2px solid var(--color-error)',
    icon: 'LuAlertTriangle',
    iconColor: 'var(--color-error)'
  }
};
```

**Responsive Behavior:**

- **Desktop:** All 7 phases visible horizontally
- **Tablet:** Horizontal scroll with scroll indicators (fade gradient at edges)
- **Mobile:** Swipeable carousel, 2-3 phases visible at once

### 3.2 Dimension Pills

**Purpose:** Activate dimension-specific visualizations and data. Only one dimension active at a time (default behavior).

**Five Dimensions (4D-8D BIM):**

| Dimension | Name | Description | Color | Unit | Icon |
|-----------|------|-------------|-------|------|------|
| **4D** | Time | Schedule, phasing, sequencing | Blue `#007aff` | Days | `LuClock` |
| **5D** | Cost | Budget, expenditure, cash flow | Green `#34c759` | USD | `LuDollarSign` |
| **6D** | Energy | Sustainability, carbon, efficiency | Light Green `#30d158` | kWh | `LuZap` |
| **7D** | Assets | FM, maintenance, operations | Orange `#ff9500` | Assets | `LuBox` |
| **8D** | Safety | Risk, incidents, compliance | Red `#ff453a` | Incidents | `LuShield` |

**Visual Design:**

```typescript
interface DimensionPill {
  // Base state
  display: 'inline-flex';
  alignItems: 'center';
  gap: '6px';
  padding: '6px 12px';
  borderRadius: 'var(--radius-pill)';  // 999px
  border: '1px solid var(--color-border)';
  background: 'transparent';
  fontSize: 'var(--font-size-sm)';  // 12px
  fontWeight: 'var(--font-weight-medium)';
  cursor: 'pointer';
  transition: 'all 150ms var(--easing-standard)';
  
  // Active state
  backgroundActive: 'var(--dimension-color)';  // Dimension-specific
  colorActive: 'white';
  borderActive: 'none';
  boxShadow: '0 2px 8px rgba(dimension-color, 0.3)';
  
  // With KPI preview (before expansion)
  kpiPreview: {
    fontSize: '11px';
    opacity: 0.8;
    marginLeft: '4px';
  }
}
```

**Pill Content Structure:**

```jsx
<button className="dimension-pill" data-active={isActive}>
  <LuClock size={14} />
  <span className="dimension-label">4D Time</span>
  {isActive && (
    <span className="dimension-kpi">-3 days</span>
  )}
  {trend && (
    <LuTrendingUp size={12} className="dimension-trend" />
  )}
</button>
```

**KPI Preview (Active Dimension):**

When dimension is active, pill shows live KPI value at current scrubber position:

- **4D Time:** Schedule variance (e.g., "-3 days", "+2 weeks")
- **5D Cost:** Budget variance (e.g., "+$45K", "2% under")
- **6D Energy:** Performance vs. target (e.g., "12% under", "On target")
- **7D Assets:** Operational status (e.g., "98% uptime", "3 critical")
- **8D Safety:** Incident count (e.g., "0 incidents", "2 near-misses")

**Trend Indicators:**

```typescript
type Trend = 'positive' | 'negative' | 'neutral';

const trendIcons = {
  positive: 'LuTrendingUp',    // Green
  negative: 'LuTrendingDown',  // Red
  neutral: null                 // No icon
};
```

**Interaction:**

1. **Click inactive dimension** → Activates dimension, loads visualization
2. **Click active dimension** → Opens KPI panel with detailed metrics
3. **Hover dimension** → Tooltip shows dimension description and current value
4. **Keyboard** → Arrow keys navigate, `Enter`/`Space` activates

### 3.3 Scrubber Controls

**Purpose:** Precise temporal navigation with playback controls and position indicator.

**Control Layout (44px height):**

```
┌─────────────────────────────────────────────────────────────┐
│ [◀] [⏸] [▶]    ──────●──────────────    [1x]  Day 156 • Jun 5 │
│  Step  Play  Step     Scrubber Track    Speed   Current Label  │
│  Back        Forward                                           │
└─────────────────────────────────────────────────────────────┘
```

**Button Specifications:**

```typescript
interface ScrubberButton {
  width: '32px';
  height: '32px';
  borderRadius: 'var(--radius-base)';  // 6px
  background: 'transparent';
  color: 'var(--color-text-primary)';
  
  // Hover
  backgroundHover: 'var(--color-bg-hover)';
  
  // Active/Playing
  backgroundActive: 'var(--color-accent-secondary)';
  colorActive: 'var(--color-accent-primary)';
  
  // Disabled
  opacityDisabled: 0.3;
  cursorDisabled: 'not-allowed';
}
```

**Button Actions:**

| Button | Icon | Action | Shortcut | Disabled State |
|--------|------|--------|----------|----------------|
| Step Back | `◀` | Move -1 day (or -1 granularity) | `←` | At day 1 |
| Play/Pause | `▶` / `⏸` | Toggle playback animation | `Space` | Never |
| Step Forward | `▶` | Move +1 day (or +1 granularity) | `→` | At final day |
| Speed | `1x` | Cycle speed: 0.25→0.5→1→2→5→10 | `[` / `]` | Never |

**Scrubber Track:**

```typescript
interface ScrubberTrack {
  // Track base
  height: '6px';
  background: 'var(--color-bg-tertiary)';
  borderRadius: 'var(--radius-pill)';
  position: 'relative';
  cursor: 'pointer';
  
  // Progress fill (elapsed time)
  progressFill: {
    height: '100%';
    background: 'var(--color-accent-primary)';
    borderRadius: 'var(--radius-pill)';
    transition: 'width 100ms linear';
  }
  
  // Thumb (draggable handle)
  thumb: {
    position: 'absolute';
    top: '50%';
    transform: 'translateY(-50%)';
    width: '20px';
    height: '20px';
    background: 'white';
    border: '2px solid var(--color-accent-primary)';
    borderRadius: '50%';
    boxShadow: 'var(--shadow-md)';
    cursor: 'grab';
    transition: 'transform 100ms var(--easing-standard)';
  }
  
  // Thumb hover
  thumbHover: {
    transform: 'translateY(-50%) scale(1.1)';
    boxShadow: 'var(--shadow-lg)';
  }
  
  // Thumb dragging
  thumbDragging: {
    cursor: 'grabbing';
    transform: 'translateY(-50%) scale(1.2)';
    boxShadow: 'var(--shadow-xl)';
  }
}
```

**Milestone Markers:**

Milestones appear as dots on the scrubber track:

```typescript
interface MilestoneMarker {
  position: 'absolute';
  top: '50%';
  transform: 'translateY(-50%)';
  width: '8px';
  height: '8px';
  borderRadius: '50%';
  
  // Status-based colors
  upcoming: {
    background: 'var(--color-border)';
    opacity: 0.4;
  }
  current: {
    background: 'var(--color-accent-primary)';
    boxShadow: '0 0 0 4px var(--color-accent-secondary)';
    animation: 'pulse 2s infinite';
  }
  completed: {
    background: 'var(--color-success)';
    opacity: 0.8;
  }
  missed: {
    background: 'var(--color-error)';
    opacity: 0.8;
  }
}
```

**Scrubber Tooltip:**

Appears on hover above scrubber track:

```typescript
interface ScrubberTooltip {
  position: 'absolute';
  bottom: '100%';
  marginBottom: '8px';
  padding: '4px 8px';
  background: 'var(--tooltip-bg)';  // rgba(0, 0, 0, 0.9)
  color: 'white';
  fontSize: 'var(--font-size-xs)';  // 11px
  borderRadius: 'var(--radius-sm)';
  whiteSpace: 'nowrap';
  pointerEvents: 'none';
  
  // Content format: "Day 156 • Jun 5, 2024"
  // If milestone nearby: "Day 156 • Jun 5, 2024 • Foundation Complete"
}
```

**Current Label:**

Shows current position on right side of controls:

```jsx
<span className="scrubber-current-label">
  Day {currentDay} • {formatDate(currentDay)}
</span>
```

**Interaction Behaviors:**

1. **Click track** → Jump to position, snap to nearby milestone if within 5 days
2. **Drag thumb** → Smooth scrubbing, no snapping while dragging
3. **Release thumb** → Snap to nearby milestone if within 5 days
4. **Hover track** → Show tooltip with date at cursor position
5. **Arrow keys** → Step forward/backward by current granularity
6. **Shift+Arrow keys** → Jump 10× current granularity
7. **Home key** → Jump to day 1
8. **End key** → Jump to current date (Live mode)

**Milestone Snapping:**

```typescript
interface MilestoneSnapping {
  enabled: boolean;           // Default: true
  threshold: number;          // 5 days (or 5 × current granularity)
  
  shouldSnap(day: number): boolean {
    const nearbyMilestone = findNearestMilestone(day, this.threshold);
    return nearbyMilestone !== null;
  }
  
  snap(day: number): number {
    const nearbyMilestone = findNearestMilestone(day, this.threshold);
    return nearbyMilestone ? nearbyMilestone.day : day;
  }
}
```

**Playback Animation:**

When play button clicked:

```typescript
interface PlaybackConfig {
  baseSpeed: 10;              // Days per second at 1x
  speeds: [0.25, 0.5, 1, 2, 5, 10];
  
  calculateIncrement(speed: number, deltaTime: number): number {
    return (this.baseSpeed * speed * deltaTime) / 1000;
  }
  
  animate() {
    requestAnimationFrame((timestamp) => {
      const deltaTime = timestamp - this.lastTimestamp;
      const increment = this.calculateIncrement(this.speed, deltaTime);
      
      this.currentDay = Math.min(this.currentDay + increment, this.maxDay);
      
      if (this.currentDay >= this.maxDay) {
        this.pause();
      } else {
        this.animate();
      }
    });
  }
}
```

**Auto-Pause at Milestones:**

Optional behavior (user preference):

```typescript
interface AutoPauseConfig {
  enabled: boolean;           // Default: false
  pauseTypes: MilestoneType[]; // ['decision', 'payment', 'inspection']
  
  shouldPause(milestone: Milestone): boolean {
    return this.enabled && 
           this.pauseTypes.includes(milestone.type) &&
           milestone.status === 'current';
  }
}
```

### 3.4 Visualization Area

**Purpose:** Display dimension-specific data across time. Visualization type adapts to dimension and data characteristics.

**Supported Visualization Types:**

| Type | Use Cases | Dimensions | Canvas Element |
|------|-----------|------------|----------------|
| **Bar Chart** | Discrete events, counts, categorical data | All | `<canvas>` |
| **Line Chart** | Continuous metrics, trends, comparisons | 5D, 6D, 7D | `<canvas>` |
| **Gantt Chart** | Task sequences, dependencies, critical path | 4D | `<canvas>` or SVG |
| **Heatmap** | Intensity patterns, spatial-temporal data | 6D, 7D, 8D | `<canvas>` |
| **Stacked Area** | Cumulative values, composition over time | 5D, 6D | `<canvas>` |
| **Custom** | Dimension-specific visualizations | Any | React component |

**Default Visualization by Dimension:**

```typescript
const defaultVisualizations: Record<DimensionID, VisualizationType> = {
  '4d': 'gantt',        // Task timeline with dependencies
  '5d': 'stacked-area', // Cumulative cost breakdown
  '6d': 'line',         // Energy consumption trend
  '7d': 'heatmap',      // Asset utilization matrix
  '8d': 'bar'           // Incident count by type
};
```

**Canvas-Based Rendering:**

All visualizations use high-DPI canvas for smooth 60fps interactions:

```typescript
interface VisualizationCanvas {
  // Canvas setup
  setupCanvas() {
    const canvas = document.getElementById('timeline-viz');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    return { canvas, ctx, dpr, rect };
  }
  
  // Render loop
  render() {
    const { ctx, rect } = this.setupCanvas();
    
    this.drawGrid(ctx, rect);
    this.drawData(ctx, rect);
    this.drawCurrentIndicator(ctx, rect);
    this.drawMilestones(ctx, rect);
  }
}
```

**Bar Chart Example (5D Cost):**

```typescript
function renderCostBarChart(ctx: CanvasRenderingContext2D, rect: DOMRect) {
  const data = getCostDataByMonth();
  const barWidth = rect.width / data.length;
  const maxValue = Math.max(...data.map(d => d.value));
  
  data.forEach((item, index) => {
    const x = index * barWidth;
    const barHeight = (item.value / maxValue) * rect.height * 0.8;
    const y = rect.height - barHeight - 20;
    
    // Draw bar
    ctx.fillStyle = item.month <= currentMonth 
      ? 'rgba(52, 199, 89, 0.8)'   // Past: green
      : 'rgba(52, 199, 89, 0.2)';  // Future: faded green
    ctx.fillRect(x, y, barWidth - 4, barHeight);
    
    // Draw value label
    ctx.fillStyle = 'var(--color-text-primary)';
    ctx.font = '11px var(--font-family-base)';
    ctx.textAlign = 'center';
    ctx.fillText(formatCurrency(item.value), x + barWidth / 2, y - 4);
  });
}
```

**Line Chart Example (6D Energy):**

```typescript
function renderEnergyLineChart(ctx: CanvasRenderingContext2D, rect: DOMRect) {
  const data = getEnergyDataByWeek();
  const xStep = rect.width / (data.length - 1);
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  // Draw line
  ctx.strokeStyle = 'rgba(48, 209, 88, 1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  data.forEach((point, index) => {
    const x = index * xStep;
    const y = rect.height - ((point.value - minValue) / range) * rect.height * 0.8 - 20;
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  ctx.stroke();
  
  // Draw area fill
  ctx.lineTo(rect.width, rect.height - 20);
  ctx.lineTo(0, rect.height - 20);
  ctx.closePath();
  ctx.fillStyle = 'rgba(48, 209, 88, 0.1)';
  ctx.fill();
  
  // Draw current position indicator
  const currentX = (currentDay / totalDays) * rect.width;
  ctx.strokeStyle = 'rgba(10, 132, 255, 0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(currentX, 0);
  ctx.lineTo(currentX, rect.height - 20);
  ctx.stroke();
}
```

**Gantt Chart Example (4D Time):**

```typescript
function renderGanttChart(ctx: CanvasRenderingContext2D, rect: DOMRect) {
  const tasks = getTaskData();
  const rowHeight = 32;
  const taskPadding = 4;
  const totalDays = 365;
  
  tasks.forEach((task, index) => {
    const y = index * rowHeight + taskPadding;
    const x = (task.startDay / totalDays) * rect.width;
    const width = ((task.endDay - task.startDay) / totalDays) * rect.width;
    const height = rowHeight - (taskPadding * 2);
    
    // Task bar
    const isComplete = currentDay >= task.endDay;
    const isActive = currentDay >= task.startDay && currentDay < task.endDay;
    
    ctx.fillStyle = isComplete 
      ? 'rgba(52, 199, 89, 0.8)'   // Complete: green
      : isActive
      ? 'rgba(10, 132, 255, 0.8)'  // Active: blue
      : 'rgba(142, 142, 147, 0.3)'; // Upcoming: gray
    
    ctx.fillRect(x, y, width, height);
    
    // Task label
    ctx.fillStyle = 'var(--color-text-primary)';
    ctx.font = '12px var(--font-family-base)';
    ctx.textAlign = 'left';
    ctx.fillText(task.name, 8, y + height / 2 + 4);
  });
}
```

**Interactive Hover:**

When user hovers over visualization:

```typescript
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Find data point at cursor
  const dataPoint = findDataPointAt(x, y);
  
  if (dataPoint) {
    showTooltip({
      x: e.clientX,
      y: e.clientY,
      content: formatTooltipContent(dataPoint)
    });
  } else {
    hideTooltip();
  }
});
```

**Responsive Height:**

User can adjust visualization height:

```typescript
// Shift+Arrow Up: Increase height by 20px
document.addEventListener('keydown', (e) => {
  if (e.shiftKey && e.code === 'ArrowUp' && state.isExpanded) {
    const currentHeight = timeline.offsetHeight;
    const newHeight = Math.min(600, currentHeight + 20);
    timeline.style.height = `${newHeight}px`;
    renderVisualization();  // Redraw at new dimensions
  }
});

// Shift+Arrow Down: Decrease height by 20px
document.addEventListener('keydown', (e) => {
  if (e.shiftKey && e.code === 'ArrowDown' && state.isExpanded) {
    const currentHeight = timeline.offsetHeight;
    const newHeight = Math.max(150, currentHeight - 20);
    timeline.style.height = `${newHeight}px`;
    renderVisualization();
  }
});
```

### 3.5 KPI Panel

**Purpose:** Display dimension-specific key performance indicators at current scrubber position. Appears as floating overlay above visualization area.

**Panel Structure:**

```typescript
interface KPIPanel {
  position: 'absolute';
  top: 'var(--space-4)';        // 16px from top of visualization
  right: 'var(--space-4)';      // 16px from right edge
  padding: 'var(--space-3) var(--space-4)';  // 12px vertical, 16px horizontal
  background: 'var(--color-surface)';
  border: '1px solid var(--color-border)';
  borderRadius: 'var(--radius-md)';  // 8px
  boxShadow: 'var(--shadow-kpi)';
  backdropFilter: 'blur(10px)';
  zIndex: 'var(--z-timeline-kpi)';  // 153
  
  // Content layout
  display: 'flex';
  gap: 'var(--space-6)';        // 24px between KPIs
  alignItems: 'center';
}
```

**KPI Item Structure:**

```typescript
interface KPIItem {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  trendValue?: string;
  status?: 'success' | 'warning' | 'error';
}

// Visual layout
<div className="kpi-item">
  <div className="kpi-icon">
    <LuIcon size={16} />
  </div>
  <div className="kpi-content">
    <span className="kpi-label">{label}</span>
    <span className="kpi-value">
      {value} {unit}
      {trend && (
        <span className={`kpi-trend kpi-trend-${trend}`}>
          {trend === 'positive' ? <LuTrendingUp /> : <LuTrendingDown />}
          {trendValue}
        </span>
      )}
    </span>
  </div>
</div>
```

**Dimension-Specific KPIs:**

**4D Time (Schedule):**
```typescript
const timeDimensionKPIs: KPIItem[] = [
  {
    icon: LuClock,
    label: 'Schedule',
    value: '-3',
    unit: 'days',
    trend: 'negative',
    trendValue: '2%',
    status: 'warning'
  },
  {
    icon: LuCheckCircle,
    label: 'Tasks Complete',
    value: '47/65',
    unit: '',
    trend: 'positive',
    trendValue: '72%'
  },
  {
    icon: LuAlertTriangle,
    label: 'Critical Path',
    value: '3',
    unit: 'tasks',
    status: 'error'
  }
];
```

**5D Cost (Budget):**
```typescript
const costDimensionKPIs: KPIItem[] = [
  {
    icon: LuDollarSign,
    label: 'Budget',
    value: '+$45K',
    unit: '',
    trend: 'negative',
    trendValue: '2.1%',
    status: 'warning'
  },
  {
    icon: LuTrendingUp,
    label: 'Burn Rate',
    value: '$125K',
    unit: '/week',
    trend: 'neutral'
  },
  {
    icon: LuPieChart,
    label: 'Contingency',
    value: '$180K',
    unit: 'remaining',
    trend: 'positive'
  }
];
```

**6D Energy (Sustainability):**
```typescript
const energyDimensionKPIs: KPIItem[] = [
  {
    icon: LuZap,
    label: 'Energy',
    value: '12%',
    unit: 'under target',
    trend: 'positive',
    status: 'success'
  },
  {
    icon: LuLeaf,
    label: 'Carbon',
    value: '245',
    unit: 'tons CO₂',
    trend: 'negative',
    trendValue: '5%'
  },
  {
    icon: LuSun,
    label: 'Solar',
    value: '85%',
    unit: 'generation',
    trend: 'positive'
  }
];
```

**7D Assets (FM):**
```typescript
const assetDimensionKPIs: KPIItem[] = [
  {
    icon: LuBox,
    label: 'Uptime',
    value: '98.5%',
    unit: '',
    trend: 'positive',
    status: 'success'
  },
  {
    icon: LuWrench,
    label: 'Work Orders',
    value: '12',
    unit: 'open',
    trend: 'neutral'
  },
  {
    icon: LuAlertCircle,
    label: 'Critical Assets',
    value: '3',
    unit: '',
    status: 'warning'
  }
];
```

**8D Safety (Risk):**
```typescript
const safetyDimensionKPIs: KPIItem[] = [
  {
    icon: LuShield,
    label: 'Incidents',
    value: '0',
    unit: 'this month',
    trend: 'positive',
    status: 'success'
  },
  {
    icon: LuAlertTriangle,
    label: 'Near Misses',
    value: '2',
    unit: '',
    trend: 'negative'
  },
  {
    icon: LuCheckCircle,
    label: 'Inspections',
    value: '15/15',
    unit: 'complete',
    trend: 'positive'
  }
];
```

**Visibility Rules:**

```typescript
interface KPIPanelVisibility {
  showWhen: {
    timelineExpanded: boolean;    // Only show when expanded
    dimensionActive: boolean;      // Only show when dimension selected
    dataAvailable: boolean;        // Only show if KPI data exists
  }
  
  hideWhen: {
    userCollapsed: boolean;        // User clicked collapse button
    heightTooSmall: boolean;       // Timeline < 120px
    mobileViewport: boolean;       // Viewport < 768px
  }
}
```

**Interaction:**

1. **Click KPI item** → Opens detailed breakdown in Panel
2. **Hover KPI** → Shows tooltip with historical context
3. **Click collapse button** → Hides KPI panel (preference saved)
4. **Keyboard** → `Tab` cycles through KPIs, `Enter` opens detail

### 3.6 Timeline Toggle Button

**Purpose:** Show/hide and expand/collapse Timeline. Button position fixed relative to Timeline height.

**Visual Design:**

```typescript
interface TimelineToggleButton {
  position: 'fixed';
  bottom: 'calc(var(--timeline-height) + 12px)';  // 12px above Timeline
  right: '24px';
  width: '120px';
  height: '32px';
  padding: '0 var(--space-3)';
  background: 'var(--color-surface)';
  border: '1px solid var(--color-border)';
  borderRadius: 'var(--radius-base)';
  boxShadow: 'var(--shadow-md)';
  fontSize: 'var(--font-size-sm)';
  fontWeight: 'var(--font-weight-medium)';
  cursor: 'pointer';
  zIndex: 'calc(var(--z-timeline) + 1)';  // 151
  
  // Hover
  backgroundHover: 'var(--color-bg-hover)';
  boxShadowHover: 'var(--shadow-lg)';
  
  // Content
  display: 'flex';
  alignItems: 'center';
  justifyContent: 'center';
  gap: 'var(--space-1)';
}
```

**Button States:**

```jsx
// Timeline hidden
<button className="timeline-toggle">
  <LuClock size={14} />
  <span>Timeline</span>
</button>

// Timeline collapsed (48px)
<button className="timeline-toggle">
  <LuChevronUp size={14} />
  <span>Timeline</span>
</button>

// Timeline expanded (180px+)
<button className="timeline-toggle">
  <LuChevronDown size={14} />
  <span>Timeline</span>
</button>
```

**Keyboard Shortcut:**

- `Cmd+T` → Toggle visibility (Hidden ↔ Collapsed)
- `Cmd+Shift+T` → Toggle expansion (Collapsed ↔ Expanded)
- `E` → Quick expand/collapse (when Timeline focused)

**State Transitions:**

```typescript
enum TimelineState {
  Hidden = 'hidden',      // 0px
  Collapsed = 'collapsed', // 48px
  Expanded = 'expanded'    // 180px+
}

// Transition logic
function toggleTimeline() {
  switch (currentState) {
    case TimelineState.Hidden:
      setState(TimelineState.Collapsed);
      break;
    case TimelineState.Collapsed:
      setState(TimelineState.Expanded);
      break;
    case TimelineState.Expanded:
      setState(TimelineState.Collapsed);
      break;
  }
}

// Quick expand (E key)
function quickExpand() {
  if (currentState === TimelineState.Expanded) {
    setState(TimelineState.Collapsed);
  } else {
    setState(TimelineState.Expanded);
  }
}
```

---

## 4. Interaction Design

### 4.1 User Flows

**Primary Flow: Navigate Project Timeline**

1. User opens project in Visualize module
2. Timeline appears collapsed (48px) at bottom
3. User clicks lifecycle phase button (e.g., "Build")
4. Scrubber jumps to Build phase start date
5. User clicks Timeline toggle or presses `E`
6. Timeline expands to 180px, showing 4D Gantt chart
7. User drags scrubber thumb to explore specific dates
8. Milestones snap into place when released
9. Canvas updates to show asset state at selected date
10. User clicks Play button to animate progression
11. Timeline animates through Build phase at 1x speed
12. User clicks dimension pill (e.g., "5D Cost")
13. Visualization switches to cost bar chart
14. KPI panel appears showing budget variance
15. User hovers over cost bars to see detailed breakdowns
16. User presses `Esc` or clicks toggle to collapse Timeline

**Secondary Flow: Compare Planned vs. Actual**

1. User has Timeline expanded with 4D dimension active
2. Scrubber positioned at current date (Live mode)
3. User clicks "Planned" button in KPI panel
4. Visualization adds overlay showing planned schedule
5. Deviations highlighted in red (delays) or green (ahead)
6. User drags scrubber backward to see when deviation occurred
7. Canvas shows asset states at that historical point
8. User clicks specific task bar in Gantt chart
9. Panel opens with task details and dependency chain
10. User makes note of delay cause
11. User clicks "Historical" mode to see full deviation history
12. Timeline stays expanded for detailed analysis

**Tertiary Flow: Energy Performance Analysis**

1. User navigating operational phase (Operate)
2. Timeline collapsed, showing dimension pills only
3. User clicks "6D Energy" pill
4. Timeline auto-expands to show energy line chart
5. Chart displays consumption by month for past year
6. KPI panel shows: 12% under target, trend positive
7. User hovers over summer peak in line chart
8. Tooltip shows: "July 2024 • 45,000 kWh • 8% over target"
9. User clicks peak point
10. Canvas highlights HVAC assets contributing to peak
11. Panel opens with energy breakdown by system
12. User exports report for facilities team
13. Timeline remains expanded for ongoing monitoring

### 4.2 Keyboard Shortcuts

**Global Timeline Shortcuts:**

| Shortcut | Action | Context |
|----------|--------|---------|
| `Cmd+T` | Toggle Timeline visibility | Global |
| `Cmd+Shift+T` | Expand/Collapse Timeline | Global |
| `E` | Quick expand/collapse | Timeline focused |
| `?` | Show Timeline keyboard help | Timeline focused |

**Playback Controls:**

| Shortcut | Action | Context |
|----------|--------|---------|
| `Space` | Play/Pause animation | Timeline visible |
| `Enter` | Play/Pause animation (alt) | Timeline visible |
| `[` | Decrease playback speed | Timeline visible |
| `]` | Increase playback speed | Timeline visible |

**Scrubber Navigation:**

| Shortcut | Action | Increment |
|----------|--------|-----------|
| `Arrow Left` | Step backward | 1 day (or granularity) |
| `Arrow Right` | Step forward | 1 day (or granularity) |
| `Shift+Left` | Jump backward | 10 days (or 10× granularity) |
| `Shift+Right` | Jump forward | 10 days (or 10× granularity) |
| `Home` | Jump to timeline start | Day 1 |
| `End` | Jump to current date | Today (Live mode) |

**Dimension Activation:**

| Shortcut | Action | Dimension |
|----------|--------|-----------|
| `Cmd+Shift+4` | Toggle 4D Time | Schedule & Phasing |
| `Cmd+Shift+5` | Toggle 5D Cost | Budget & Cash Flow |
| `Cmd+Shift+6` | Toggle 6D Energy | Sustainability |
| `Cmd+Shift+7` | Toggle 7D Assets | Facility Management |
| `Cmd+Shift+8` | Toggle 8D Safety | Risk & Compliance |

**Timeline Resize:**

| Shortcut | Action | Increment |
|----------|--------|-----------|
| `Shift+Arrow Up` | Increase height | +20px (max 600px) |
| `Shift+Arrow Down` | Decrease height | -20px (min 150px) |

**Lifecycle Navigation:**

| Shortcut | Action | Context |
|----------|--------|---------|
| `Tab` | Next lifecycle phase | Lifecycle bar focused |
| `Shift+Tab` | Previous lifecycle phase | Lifecycle bar focused |
| `Enter` / `Space` | Select focused phase | Lifecycle bar focused |
| `1-7` | Jump to phase by number | Timeline focused |

### 4.3 Touch Interactions

**Mobile & Tablet Gestures:**

| Gesture | Action | Context |
|---------|--------|---------|
| **Tap** | Select phase/dimension | Lifecycle/Dimension pills |
| **Double tap** | Toggle Timeline expansion | Timeline header |
| **Swipe up** | Expand Timeline | Timeline collapsed |
| **Swipe down** | Collapse Timeline | Timeline expanded |
| **Swipe left/right** | Navigate phases | Lifecycle carousel |
| **Pinch in/out** | Zoom timeline granularity | Scrubber track |
| **Long press** | Show context menu | Milestone markers |
| **Drag** | Scrub timeline | Scrubber thumb |

**Touch Target Sizes:**

All interactive elements meet WCAG minimum 44×44px touch targets:

```typescript
const touchTargets = {
  lifecyclePhaseButton: '48px × 44px',
  dimensionPill: '44px (min-height)',
  scrubberControls: '44px × 44px',
  scrubberThumb: '44px × 44px',
  milestoneMarker: '44px × 44px (tap area)',
  kpiItem: '44px (min-height)'
};
```

**Haptic Feedback (iOS/Android):**

```typescript
function triggerHaptic(type: 'selection' | 'impact' | 'notification') {
  if ('vibrate' in navigator) {
    switch (type) {
      case 'selection':
        navigator.vibrate(10);  // Scrubber snap, phase select
        break;
      case 'impact':
        navigator.vibrate([5, 10, 5]);  // Play/pause, dimension change
        break;
      case 'notification':
        navigator.vibrate([10, 50, 10]);  // Milestone reached, error
        break;
    }
  }
}
```

### 4.4 Responsive Behavior

**Desktop (1024px+):**
- Timeline spans full width (minus Sidebar and Panel if open)
- All lifecycle phases visible horizontally
- All dimension pills visible without scrolling
- Full scrubber controls with labels
- Visualization area uses full available height
- KPI panel visible when expanded
- Hover interactions enabled

**Tablet (768-1023px):**
- Timeline spans full width (Sidebar collapses to 64px)
- Lifecycle phases may require horizontal scroll
- All dimension pills visible
- Scrubber controls simplified (no labels)
- Visualization area adapts to reduced height
- KPI panel shows fewer metrics (2-3 instead of 3-4)
- Touch interactions primary, hover secondary

**Mobile (<768px):**
- Timeline spans full screen width
- Lifecycle phases in swipeable carousel (2-3 visible)
- Dimension pills in horizontal scroll or accordion
- Scrubber controls icon-only, stacked vertically
- Visualization area shows simplified chart
- KPI panel becomes bottom sheet modal
- Touch-only interactions, no hover states

**Responsive Breakpoints:**

```css
/* Desktop */
@media (min-width: 1024px) {
  .timeline {
    --timeline-lifecycle-layout: row;
    --timeline-dimension-layout: row;
    --timeline-controls-layout: row;
    --timeline-kpi-position: absolute;
  }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  .timeline {
    --timeline-lifecycle-layout: row;
    --timeline-dimension-layout: row;
    --timeline-controls-layout: row;
    --timeline-kpi-position: absolute;
    --timeline-font-size: var(--font-size-sm);
  }
  
  .lifecycle-bar {
    overflow-x: auto;
    scrollbar-width: none;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .timeline {
    --timeline-lifecycle-layout: carousel;
    --timeline-dimension-layout: accordion;
    --timeline-controls-layout: column;
    --timeline-kpi-position: fixed;
  }
  
  .timeline-expanded {
    height: 50vh;  /* Half screen on mobile */
  }
  
  .kpi-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    transform: translateY(100%);
    transition: transform var(--transition-base);
  }
  
  .kpi-panel[data-open="true"] {
    transform: translateY(0);
  }
}
```

### 4.5 Accessibility

**WCAG 2.1 Level AA Compliance:**

**Keyboard Navigation:**
- All Timeline controls accessible via keyboard
- Logical tab order: Lifecycle → Dimensions → Scrubber → Visualization
- Arrow keys navigate within each section
- `Esc` closes expanded Timeline
- Focus indicators visible (2px accent outline)

**Screen Reader Support:**

```jsx
<div
  className="timeline"
  role="region"
  aria-label="Project Timeline"
  aria-expanded={isExpanded}
  aria-hidden={!isVisible}
>
  {/* Lifecycle Bar */}
  <nav
    className="lifecycle-bar"
    role="navigation"
    aria-label="Project Lifecycle Phases"
  >
    <button
      className="lifecycle-phase"
      role="tab"
      aria-selected={isActive}
      aria-label="Build Phase, January 15 to August 30, 2024"
    >
      Build
      {isActive && (
        <span className="sr-only">Currently active phase</span>
      )}
    </button>
  </nav>
  
  {/* Dimension Pills */}
  <div
    className="dimension-pills"
    role="toolbar"
    aria-label="BIM Dimensions"
  >
    <button
      className="dimension-pill"
      aria-pressed={isActive}
      aria-label="4D Time dimension, Schedule 3 days behind"
    >
      4D Time
    </button>
  </div>
  
  {/* Scrubber */}
  <div
    className="scrubber-controls"
    role="toolbar"
    aria-label="Timeline Playback Controls"
  >
    <button
      aria-label="Step backward one day"
      disabled={currentDay === 1}
    >
      ◀
    </button>
    <button
      aria-label={isPlaying ? 'Pause playback' : 'Play timeline'}
      aria-pressed={isPlaying}
    >
      {isPlaying ? '⏸' : '▶'}
    </button>
    <button aria-label="Step forward one day">
      ▶
    </button>
    
    <div
      className="scrubber-track"
      role="slider"
      aria-label="Timeline scrubber"
      aria-valuemin={1}
      aria-valuemax={totalDays}
      aria-valuenow={currentDay}
      aria-valuetext={`Day ${currentDay}, ${formatDate(currentDay)}`}
      tabIndex={0}
    />
  </div>
  
  {/* Live region for announcements */}
  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
    className="sr-only"
  >
    {announcement}
  </div>
</div>
```

**Announcements:**

```typescript
function announceTimelineAction(action: string) {
  const announcer = document.getElementById('timeline-announcer');
  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = action;
  }, 100);
}

// Examples
announceTimelineAction('Timeline expanded');
announceTimelineAction('Switched to 5D Cost dimension');
announceTimelineAction('Playback started at day 156');
announceTimelineAction('Jumped to Build phase, January 15, 2024');
```

**Color Contrast:**

All text meets WCAG AA standards:
- Primary text: 4.5:1 contrast ratio
- Secondary text: 4.5:1 contrast ratio
- UI elements: 3:1 contrast ratio

Dimension colors chosen for colorblind accessibility:
- Blue, Green, Orange, Red palette distinguishable
- Icons supplement color coding
- Status uses shape + color (e.g., triangle for warning)

**Reduced Motion:**

```css
@media (prefers-reduced-motion: reduce) {
  .timeline,
  .scrubber-thumb,
  .lifecycle-phase,
  .dimension-pill,
  .kpi-panel {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Disable playback animation, use instant jumps */
  .scrubber-progress {
    transition: none;
  }
  
  /* Disable pulse animation */
  .current-indicator {
    animation: none;
  }
}
```

**Focus Management:**

```typescript
function manageFocus() {
  // When Timeline expands, don't steal focus
  if (document.activeElement !== document.body) {
    return;
  }
  
  // When Timeline collapses, return focus to trigger button
  if (!isExpanded) {
    timelineToggleButton.focus();
  }
}

// Trap focus in Timeline when keyboard navigating
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && timelineExpanded) {
    const focusableElements = timeline.querySelectorAll(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
});
```

---

## 5. Implementation

### 5.1 Technology Stack

**Framework:**
- React 18+ with TypeScript
- Functional components with hooks
- Context API for state management

**Canvas Rendering:**
- Native HTML5 Canvas API
- High-DPI support (devicePixelRatio)
- RequestAnimationFrame for 60fps animations

**Animation:**
- CSS transitions for UI state changes
- JavaScript animation loop for playback
- Spring physics for natural motion

**Data Fetching:**
- React Query for dimension data caching
- WebSocket for live data updates
- Optimistic updates for scrubber interactions

**State Management:**
```typescript
import { create } from 'zustand';

interface TimelineStore {
  // Temporal state
  currentDay: number;
  granularity: Granularity;
  mode: 'live' | 'historical';
  playbackSpeed: PlaybackSpeed;
  isPlaying: boolean;
  isDragging: boolean;
  
  // Lifecycle state
  activePhase: LifecyclePhase | null;
  phases: LifecyclePhase[];
  milestones: Milestone[];
  
  // Dimension state
  activeDimension: DimensionID;
  dimensions: Dimension[];
  visualizationType: VisualizationType;
  
  // UI state
  isExpanded: boolean;
  isVisible: boolean;
  customHeight: number | null;
  showKPIPanel: boolean;
  
  // Actions
  setCurrentDay: (day: number) => void;
  setActivePhase: (phase: LifecyclePhase) => void;
  setActiveDimension: (dimension: DimensionID) => void;
  togglePlayback: () => void;
  toggleExpanded: () => void;
  setCustomHeight: (height: number) => void;
}

const useTimelineStore = create<TimelineStore>((set) => ({
  // Initial state
  currentDay: 1,
  granularity: 'day',
  mode: 'live',
  playbackSpeed: 1,
  isPlaying: false,
  isDragging: false,
  activePhase: null,
  phases: [],
  milestones: [],
  activeDimension: '4d',
  dimensions: [],
  visualizationType: 'gantt',
  isExpanded: false,
  isVisible: true,
  customHeight: null,
  showKPIPanel: true,
  
  // Actions
  setCurrentDay: (day) => set({ currentDay: day }),
  setActivePhase: (phase) => set({ activePhase: phase }),
  setActiveDimension: (dimension) => set({ activeDimension: dimension }),
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
  setCustomHeight: (height) => set({ customHeight: height })
}));
```

### 5.2 Component Architecture

```typescript
// Timeline Root Component
export function Timeline() {
  const { isVisible, isExpanded } = useTimelineStore();
  
  if (!isVisible) return null;
  
  return (
    <div
      className="timeline"
      aria-expanded={isExpanded}
      style={{ height: getTimelineHeight() }}
    >
      <LifecycleBar />
      <DimensionPills />
      <ScrubberControls />
      {isExpanded && (
        <>
          <VisualizationArea />
          <KPIPanel />
        </>
      )}
      <LiveRegion />
    </div>
  );
}

// Lifecycle Bar
function LifecycleBar() {
  const { phases, activePhase, setActivePhase } = useTimelineStore();
  
  return (
    <nav className="lifecycle-bar" role="navigation">
      {phases.map((phase) => (
        <LifecyclePhaseButton
          key={phase.id}
          phase={phase}
          isActive={activePhase?.id === phase.id}
          onClick={() => setActivePhase(phase)}
        />
      ))}
    </nav>
  );
}

// Dimension Pills
function DimensionPills() {
  const { dimensions, activeDimension, setActiveDimension } = useTimelineStore();
  
  return (
    <div className="dimension-pills" role="toolbar">
      {dimensions.map((dimension) => (
        <DimensionPill
          key={dimension.id}
          dimension={dimension}
          isActive={activeDimension === dimension.id}
          onClick={() => setActiveDimension(dimension.id)}
        />
      ))}
    </div>
  );
}

// Scrubber Controls
function ScrubberControls() {
  const {
    currentDay,
    isPlaying,
    playbackSpeed,
    setCurrentDay,
    togglePlayback
  } = useTimelineStore();
  
  return (
    <div className="scrubber-controls" role="toolbar">
      <button onClick={() => stepBackward()} aria-label="Step backward">
        ◀
      </button>
      <button
        onClick={togglePlayback}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
      <button onClick={() => stepForward()} aria-label="Step forward">
        ▶
      </button>
      
      <ScrubberTrack />
      
      <button onClick={() => cycleSpeed()}>
        {playbackSpeed}x
      </button>
      <span className="current-label">
        Day {currentDay} • {formatDate(currentDay)}
      </span>
    </div>
  );
}

// Scrubber Track
function ScrubberTrack() {
  const {
    currentDay,
    totalDays,
    milestones,
    setCurrentDay,
    isDragging
  } = useTimelineStore();
  
  const trackRef = useRef<HTMLDivElement>(null);
  const percentage = (currentDay / totalDays) * 100;
  
  const handleDrag = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPercentage = Math.max(0, Math.min(1, x / rect.width));
    const newDay = Math.round(newPercentage * totalDays);
    setCurrentDay(newDay);
  };
  
  return (
    <div
      ref={trackRef}
      className="scrubber-track"
      role="slider"
      aria-valuemin={1}
      aria-valuemax={totalDays}
      aria-valuenow={currentDay}
      onClick={handleDrag}
    >
      <div
        className="scrubber-progress"
        style={{ width: `${percentage}%` }}
      />
      <div
        className="scrubber-thumb"
        style={{ left: `${percentage}%` }}
        onMouseDown={() => setDragging(true)}
      />
      {milestones.map((milestone) => (
        <MilestoneMarker
          key={milestone.id}
          milestone={milestone}
          totalDays={totalDays}
        />
      ))}
    </div>
  );
}

// Visualization Area
function VisualizationArea() {
  const { activeDimension, visualizationType } = useTimelineStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    renderVisualization(ctx, rect, activeDimension, visualizationType);
  }, [activeDimension, visualizationType, currentDay]);
  
  return (
    <div className="visualization-area">
      <canvas ref={canvasRef} />
    </div>
  );
}

// KPI Panel
function KPIPanel() {
  const { activeDimension, showKPIPanel } = useTimelineStore();
  const kpis = getKPIsForDimension(activeDimension);
  
  if (!showKPIPanel || !kpis.length) return null;
  
  return (
    <div className="kpi-panel">
      {kpis.map((kpi) => (
        <KPIItem key={kpi.label} kpi={kpi} />
      ))}
    </div>
  );
}
```

### 5.3 Performance Optimization

**Canvas Rendering:**

```typescript
class VisualizationRenderer {
  private animationFrameId: number | null = null;
  private lastRenderTime = 0;
  private readonly targetFPS = 60;
  private readonly frameInterval = 1000 / this.targetFPS;
  
  render() {
    const now = performance.now();
    const elapsed = now - this.lastRenderTime;
    
    if (elapsed < this.frameInterval) {
      this.animationFrameId = requestAnimationFrame(() => this.render());
      return;
    }
    
    this.lastRenderTime = now - (elapsed % this.frameInterval);
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Render in layers
    this.renderGrid();
    this.renderData();
    this.renderMilestones();
    this.renderCurrentIndicator();
    
    this.animationFrameId = requestAnimationFrame(() => this.render());
  }
  
  cleanup() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
```

**Data Caching:**

```typescript
import { useQuery } from '@tanstack/react-query';

function useDimensionData(dimensionId: DimensionID, dateRange: DateRange) {
  return useQuery({
    queryKey: ['dimension-data', dimensionId, dateRange],
    queryFn: () => fetchDimensionData(dimensionId, dateRange),
    staleTime: 5 * 60 * 1000,  // 5 minutes
    cacheTime: 30 * 60 * 1000,  // 30 minutes
    refetchOnWindowFocus: false
  });
}
```

**Debounced Scrubbing:**

```typescript
import { useDebouncedCallback } from 'use-debounce';

function useDebouncedScrub() {
  const updateCanvas = useDebouncedCallback(
    (day: number) => {
      // Fetch new data
      refetchDimensionData(day);
      // Update canvas
      renderVisualization();
    },
    300  // 300ms delay
  );
  
  const handleScrub = (day: number) => {
    // Update scrubber position immediately (60fps)
    setCurrentDay(day);
    updateCurrentLabel(day);
    
    // Debounce expensive operations
    updateCanvas(day);
  };
  
  return handleScrub;
}
```

**Virtualization:**

For timelines with 1000+ milestones:

```typescript
function VirtualizedMilestones() {
  const visibleRange = getVisibleDateRange();
  const visibleMilestones = milestones.filter((m) =>
    m.day >= visibleRange.start && m.day <= visibleRange.end
  );
  
  return visibleMilestones.map((milestone) => (
    <MilestoneMarker key={milestone.id} milestone={milestone} />
  ));
}
```

### 5.4 Testing Strategy

**Unit Tests:**

```typescript
describe('Timeline State Management', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useTimelineStore());
    expect(result.current.currentDay).toBe(1);
    expect(result.current.isExpanded).toBe(false);
  });
  
  it('should update current day', () => {
    const { result } = renderHook(() => useTimelineStore());
    act(() => {
      result.current.setCurrentDay(100);
    });
    expect(result.current.currentDay).toBe(100);
  });
  
  it('should snap to nearby milestone when within threshold', () => {
    const milestone = { id: '1', day: 100 };
    const snappedDay = snapToMilestone(98, [milestone], 5);
    expect(snappedDay).toBe(100);
  });
});

describe('Scrubber Interactions', () => {
  it('should handle click on track', () => {
    const { container } = render(<ScrubberTrack />);
    const track = container.querySelector('.scrubber-track');
    
    fireEvent.click(track, { clientX: 250 });  // 50% of 500px track
    
    expect(useTimelineStore.getState().currentDay).toBe(183);  // ~50% of 365 days
  });
  
  it('should handle drag on thumb', () => {
    const { container } = render(<ScrubberTrack />);
    const thumb = container.querySelector('.scrubber-thumb');
    
    fireEvent.mouseDown(thumb);
    fireEvent.mouseMove(document, { clientX: 300 });
    fireEvent.mouseUp(document);
    
    expect(useTimelineStore.getState().isDragging).toBe(false);
  });
});
```

**Integration Tests:**

```typescript
describe('Timeline Integration', () => {
  it('should sync scrubber with canvas', async () => {
    render(<Timeline />);
    
    const scrubber = screen.getByRole('slider');
    
    // Scrub to day 100
    fireEvent.change(scrubber, { target: { value: 100 } });
    
    // Wait for canvas update
    await waitFor(() => {
      expect(getCanvasCurrentDay()).toBe(100);
    });
  });
  
  it('should activate dimension and load visualization', async () => {
    render(<Timeline />);
    
    const costPill = screen.getByText('5D Cost');
    fireEvent.click(costPill);
    
    await waitFor(() => {
      expect(screen.getByText('Budget')).toBeInTheDocument();
      expect(getCostVisualizationType()).toBe('bar');
    });
  });
});
```

**E2E Tests (Playwright):**

```typescript
test('complete timeline workflow', async ({ page }) => {
  await page.goto('/project/123/visualize');
  
  // Wait for Timeline to appear
  await page.waitForSelector('.timeline');
  
  // Expand Timeline
  await page.click('.timeline-toggle');
  await expect(page.locator('.timeline')).toHaveAttribute('aria-expanded', 'true');
  
  // Select Build phase
  await page.click('text=Build');
  await expect(page.locator('.scrubber-current-label')).toContainText('Jan 15');
  
  // Activate 5D Cost dimension
  await page.click('text=5D Cost');
  await expect(page.locator('.kpi-panel')).toBeVisible();
  
  // Play animation
  await page.click('[aria-label="Play timeline"]');
  await page.waitForTimeout(2000);
  await expect(page.locator('.scrubber-current-label')).not.toContainText('Jan 15');
  
  // Pause animation
  await page.click('[aria-label="Pause playback"]');
  
  // Verify canvas updated
  const canvas = await page.locator('.visualization-area canvas');
  await expect(canvas).toBeVisible();
});
```

**Accessibility Tests:**

```typescript
import { axe } from 'jest-axe';

describe('Timeline Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Timeline />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should support keyboard navigation', () => {
    render(<Timeline />);
    
    const firstPhase = screen.getAllByRole('tab')[0];
    firstPhase.focus();
    
    userEvent.keyboard('{Tab}');
    expect(screen.getAllByRole('tab')[1]).toHaveFocus();
    
    userEvent.keyboard('{Enter}');
    expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
  });
  
  it('should announce scrubber changes', async () => {
    render(<Timeline />);
    
    const announcer = screen.getByRole('status');
    const scrubber = screen.getByRole('slider');
    
    fireEvent.change(scrubber, { target: { value: 100 } });
    
    await waitFor(() => {
      expect(announcer).toHaveTextContent('Day 100');
    });
  });
});
```

### 5.5 Error Handling

**Data Loading Errors:**

```typescript
function VisualizationArea() {
  const { data, error, isLoading } = useDimensionData();
  
  if (isLoading) {
    return (
      <div className="visualization-loading">
        <LuLoader2 className="animate-spin" />
        <span>Loading dimension data...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="visualization-error">
        <LuAlertCircle />
        <span>Failed to load visualization</span>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <div className="visualization-empty">
        <LuInbox />
        <span>No data available for this time range</span>
      </div>
    );
  }
  
  return <Canvas data={data} />;
}
```

**Playback Errors:**

```typescript
function handlePlaybackError(error: Error) {
  console.error('Playback error:', error);
  
  // Stop playback
  stopPlayback();
  
  // Show user-friendly message
  showToast({
    type: 'error',
    title: 'Playback Error',
    message: 'Unable to animate timeline. Please try again.',
    action: {
      label: 'Retry',
      onClick: () => startPlayback()
    }
  });
  
  // Report to error tracking
  reportError(error, {
    context: 'timeline-playback',
    currentDay: state.currentDay,
    dimension: state.activeDimension
  });
}
```

**Canvas Rendering Errors:**

```typescript
function renderVisualization() {
  try {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas not found');
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
    
    // Render logic
    drawVisualization(ctx);
    
  } catch (error) {
    console.error('Rendering error:', error);
    
    // Fallback to SVG
    setUseSVGFallback(true);
    
    // Show warning
    showToast({
      type: 'warning',
      title: 'Rendering Issue',
      message: 'Using simplified visualization'
    });
  }
}
```

---

## Appendices

### Appendix A: Design Token Reference

**Timeline-Specific Tokens:**

```css
:root {
  /* Heights */
  --timeline-height-hidden: 0px;
  --timeline-height-collapsed: 48px;
  --timeline-height-expanded: 180px;
  --timeline-height-min: 150px;
  --timeline-height-max: 600px;
  
  /* Layer Heights */
  --timeline-lifecycle-height: 40px;
  --timeline-dimensions-height: 48px;
  --timeline-controls-height: 44px;
  
  /* Scrubber */
  --scrubber-track-height: 6px;
  --scrubber-thumb-size: 20px;
  --scrubber-milestone-size: 8px;
  
  /* Z-Index */
  --z-timeline: 150;
  --z-timeline-scrubber: 151;
  --z-timeline-tooltip: 152;
  --z-timeline-kpi: 153;
  
  /* Animations */
  --timeline-expand-duration: 350ms;
  --timeline-expand-easing: cubic-bezier(0.16, 1, 0.3, 1);
  --playback-update-interval: 16ms;  /* 60fps */
  
  /* Dimension Colors */
  --dimension-4d-color: #007aff;
  --dimension-5d-color: #34c759;
  --dimension-6d-color: #30d158;
  --dimension-7d-color: #ff9500;
  --dimension-8d-color: #ff453a;
}
```

### Appendix B: API Endpoints

**Dimension Data:**

```typescript
// Get dimension data for date range
GET /api/projects/:projectId/dimensions/:dimensionId/data
Query params:
  - startDate: ISO date string
  - endDate: ISO date string
  - granularity: 'day' | 'week' | 'month'
  
Response:
{
  dimension: '5d',
  data: [
    { date: '2024-01-15', value: 125000, label: 'Week 1' },
    { date: '2024-01-22', value: 132000, label: 'Week 2' }
  ],
  unit: 'USD',
  metadata: {
    totalBudget: 5000000,
    spentToDate: 2400000,
    variance: -45000
  }
}
```

**Lifecycle Phases:**

```typescript
// Get project lifecycle phases
GET /api/projects/:projectId/lifecycle

Response:
{
  phases: [
    {
      id: 'build',
      name: 'Build',
      startDate: '2024-01-15',
      endDate: '2024-08-30',
      status: 'active',
      milestones: [
        {
          id: 'foundation',
          name: 'Foundation Complete',
          date: '2024-02-28',
          type: 'delivery',
          status: 'completed'
        }
      ]
    }
  ],
  currentPhase: 'build',
  projectStartDate: '2023-06-01',
  projectDuration: 730  // days
}
```

**KPI Data:**

```typescript
// Get KPIs for dimension at specific date
GET /api/projects/:projectId/dimensions/:dimensionId/kpis
Query params:
  - date: ISO date string
  
Response:
{
  dimension: '5d',
  date: '2024-06-15',
  kpis: [
    {
      id: 'budget-variance',
      label: 'Budget',
      value: -45000,
      unit: 'USD',
      trend: 'negative',
      trendValue: '-2.1%',
      status: 'warning'
    },
    {
      id: 'burn-rate',
      label: 'Burn Rate',
      value: 125000,
      unit: 'USD/week',
      trend: 'neutral'
    }
  ]
}
```

### Appendix C: Browser Support

**Minimum Requirements:**

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14+ | Full support |
| Edge | 90+ | Full support |
| Mobile Safari | iOS 14+ | Touch interactions |
| Chrome Mobile | Android 10+ | Touch interactions |

**Progressive Enhancement:**

- Canvas rendering requires Canvas API support
- Playback requires requestAnimationFrame
- Touch gestures require Touch Events API
- Haptics require Vibration API (optional)

**Fallbacks:**

```typescript
// Canvas fallback to SVG
const supportsCanvas = (() => {
  const canvas = document.createElement('canvas');
  return !!(canvas.getContext && canvas.getContext('2d'));
})();

if (!supportsCanvas) {
  useVisualizationType('svg');
}

// requestAnimationFrame fallback
const requestAnimFrame = (
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  ((callback) => setTimeout(callback, 16))
);
```

### Appendix D: Performance Benchmarks

**Target Metrics:**

| Metric | Target | Critical |
|--------|--------|----------|
| Initial render | <100ms | <200ms |
| Expand/collapse animation | <350ms | <500ms |
| Scrubber drag (60fps) | <16ms/frame | <33ms/frame |
| Dimension switch | <200ms | <400ms |
| Playback frame rate | 60fps | 30fps |
| Canvas render | <16ms/frame | <33ms/frame |
| Data fetch | <500ms | <1000ms |

**Optimization Techniques:**

1. **Debounced scrubbing** – Update canvas every 300ms while dragging
2. **Virtualized milestones** – Only render visible milestones
3. **Cached visualizations** – Cache rendered frames for quick scrubbing
4. **Web Workers** – Offload data processing to background thread
5. **Lazy loading** – Load dimension data on demand
6. **Request coalescing** – Batch multiple data requests

### Appendix E: Migration Guide

**From Legacy Timeline:**

```typescript
// Old API (v1)
<Timeline
  currentDate={date}
  onDateChange={handleChange}
  phases={phases}
/>

// New API (v2)
<Timeline />  // State managed in Zustand store

// Migration steps:
1. Remove local state management
2. Use useTimelineStore hook
3. Update event handlers to use store actions
4. Replace props with store selectors
```

**Breaking Changes:**

- Timeline no longer accepts `currentDate` prop (use `setCurrentDay` action)
- Removed `onPhaseChange` callback (subscribe to store instead)
- Renamed `collapsed` → `isExpanded` (inverted logic)
- Changed dimension IDs from strings to enum (`'time'` → `'4d'`)

### Appendix F: Future Enhancements

**Roadmap:**

**Q1 2026:**
- Multi-dimension comparison view (overlay 2-3 dimensions)
- Bookmarks for important dates/milestones
- Timeline annotations (user-added notes)
- Export timeline as PDF report

**Q2 2026:**
- Real-time collaboration (see others' cursor positions)
- Timeline templates for common project types
- AI-suggested playback points ("Watch critical events")
- Mobile app with native timeline controls

**Q3 2026:**
- VR/AR timeline navigation (Meta Quest, Apple Vision Pro)
- Voice control ("Show me March costs")
- Predictive analytics overlay (forecast future values)
- Timeline diff view (compare planned vs actual)

**Q4 2026:**
- Timeline branching (what-if scenarios)
- Integration with project scheduling tools (P6, MS Project)
- Advanced playback modes (fast-forward through inactivity)
- Multi-project timeline view (portfolio level)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 14, 2025 | Design Team | Initial specification |
| 1.1 | Nov 14, 2025 | Design Team | Added KPI panel, responsive behavior, accessibility details |

---

**End of Specification**

This document defines the complete Timeline component for Tagwaye platform. Implementation should follow Apple HIG principles throughout, prioritizing clarity, deference, depth, continuity, and intelligence. The Timeline is not just a control—it's a storytelling tool that makes temporal relationships visible and actionable.

For questions or clarifications, contact the Design & Engineering team.

**Let's build something world-class.** 🚀
