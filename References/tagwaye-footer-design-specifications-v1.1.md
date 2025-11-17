# Tagwaye Footer Design Specifications

**Version:** 1.0  
**Date:** November 13, 2025  
**Status:** Final Specification  
**Authors:** Design & Engineering Team

---

## Table of Contents

1. [Overview & Design Foundation](#1-overview--design-foundation)
2. [Structure & Layout](#2-structure--layout)
3. [Zone Specifications](#3-zone-specifications)
4. [Interaction & States](#4-interaction--states)
5. [Implementation Guidelines](#5-implementation-guidelines)

---

## 1. Overview & Design Foundation

### 1.1 Purpose

The Tagwaye Footer serves as the status bar and quick control zone for the platform. It provides persistent visibility into system state (connection, performance, collaboration), contextual awareness (spatial breadcrumbs, current location), and rapid access to view/layout controls. Unlike traditional application footers, the Tagwaye Footer is an active, intelligent component that adapts its content based on user context and workflow.

### 1.2 Design Principles Applied

**Clarity: Contextual Confidence**
- Connection status always visible with explicit state (Live/Offline/Syncing)
- Last sync timestamp provides temporal confidence
- Spatial breadcrumbs show exact location in building hierarchy
- Performance metrics reveal system health transparently

**Deference: Content Over Chrome**
- Fixed 40px height (minimal vertical space)
- Secondary text color (11px) recedes visually
- Translucent background allows content beneath to show
- No competing visual weight with primary canvas

**Depth: Progressive Disclosure**
- Connection status: Hover reveals last sync details
- Collaboration: Hover shows list of active users
- Breadcrumbs: Click segments to navigate hierarchy
- Controls: Dropdowns reveal options on demand

**Continuity: Time as Truth**
- Last sync timestamp ("Synced 2m ago")
- Performance metrics update in real-time
- Presence indicators show who's active now
- Timeline toggle reflects current visibility state

**Intelligence: AI Suggests, User Decides**
- Performance warnings (>100ms render time) shown but not intrusive
- Collaboration presence informs without disrupting
- Layout mode "Custom" detects user modifications
- No auto-actions—user controls all view/layout changes

### 1.3 Core Requirements

**Fixed Position:**
- Always visible at bottom of viewport
- Z-index: 900 (below header at 1000, above content)
- Never scrolls with content
- Persists across all platform views

**Contextual Adaptation:**
- Center zone content changes based on active module:
  - Scene Canvas: Spatial breadcrumbs
  - Dashboard: Widget count or filter summary
  - Prism Canvas: Grid info or snap status
  - Flow Canvas: Node count or validation status
- Seamless transitions when switching contexts

**Real-Time Updates:**
- Connection status: WebSocket heartbeat (10s interval)
- Performance metrics: Frame-based updates
- Collaboration presence: WebSocket events
- All updates <16ms to avoid jank

### 1.4 Constraints

**Performance:**
- Footer rendering: <16ms per frame
- Status updates: Debounced to 100ms minimum
- WebSocket reconnect: Exponential backoff (1s, 2s, 4s, 8s, max 30s)

**Accessibility:**
- WCAG 2.1 Level AA compliance
- All controls keyboard accessible
- Screen reader announcements for state changes
- Minimum contrast: 4.5:1 for text, 3:1 for UI elements

**Browser Support:**
- Same as header (Chrome, Safari, Firefox, Edge - latest 2 versions)

---

## 2. Structure & Layout

### 2.1 Grid Architecture

The footer uses CSS Grid with three distinct zones:

```
┌────────────────────────────────────────────────────────────┐
│  LEFT ZONE          CENTER ZONE          RIGHT ZONE        │
│  Status Info        Contextual           Controls/Actions  │
└────────────────────────────────────────────────────────────┘
```

**Grid Definition:**
```css
display: grid;
grid-template-columns: 1fr auto 1fr;
align-items: center;
gap: 16px;
padding: 0 24px;
height: 40px;
```

**Rationale:**
- `1fr auto 1fr` creates balanced left/right zones with flexible center
- Center zone (contextual) grows/shrinks based on content
- 16px gap provides adequate separation
- 24px horizontal padding matches header

### 2.2 Zone Specifications

#### **Left Zone (justify-start)**

Contains: System status information  
Width: Flexible (minimum content width)  
Alignment: Left-aligned within zone

**Contents (left to right, separated by `|` dividers):**
1. **Connection Status** - Live/Offline/Syncing with dot
2. **Last Sync** - Timestamp (e.g., "Synced 2m ago")
3. **Performance** - Render time (e.g., "47ms")
4. **Collaboration** - Active users count (e.g., "3 active")

**Spacing:**
- Gap between items: 12px
- Divider: `|` character in secondary color, or 1px × 12px vertical line

#### **Center Zone (justify-center)**

Contains: Contextual information (module-dependent)  
Width: Flexible with constraints  
Alignment: Center-aligned within zone

**Contents (context-dependent):**
- **Scene Canvas:** Spatial breadcrumbs (e.g., `Building A › Level 3 › HVAC North › AHU-07`)
- **Dashboard:** Filter summary or widget count
- **Prism Canvas:** Grid status or snap mode
- **Flow Canvas:** Node count or validation errors

**Visibility:**
- Desktop (1024px+): Visible
- Tablet (768-1023px): Hidden
- Mobile (<768px): Hidden

#### **Right Zone (justify-end)**

Contains: View and layout controls  
Width: Flexible (minimum content width)  
Alignment: Right-aligned within zone

**Contents (left to right):**
1. **Timeline Toggle** - Show/hide timeline zone
2. **View Mode** - Single/Dual view selector
3. **Layout Mode** - Normal/Compact/Expansive/Custom selector
4. **Theme** - Auto (with Sun/Moon icon)

**Spacing:**
- Gap between controls: 8px (tight grouping, related items)

### 2.3 Visual Foundation

**Background:**
```css
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
```

**Dark Theme:**
```css
background: rgba(28, 28, 30, 0.8);
```

**Border:**
```css
border-top: 1px solid rgba(0, 0, 0, 0.1);
```

**Dark Theme Border:**
```css
border-top: 1px solid rgba(255, 255, 255, 0.1);
```

**Alternative (Solid Background):**
If content doesn't scroll beneath footer:
```css
background: var(--color-bg-primary);
border-top: 1px solid var(--color-border);
```

### 2.4 Responsive Behavior

**Desktop (1024px+):**
- Full three-zone layout
- All elements visible
- Center zone shows contextual content

**Tablet (768-1023px):**
- Three-zone layout maintained
- Center zone: Hidden
- Left zone: All status items visible
- Right zone: All controls visible

**Mobile (<768px):**
- Grid changes: `1fr auto` (two-zone)
- Center zone: Hidden
- Left zone: Connection status + Collaboration only
- Right zone: View Mode + Theme only (Layout and Timeline hidden)
- Padding: 0 16px (reduced from 24px)

**Mobile Grid:**
```css
@media (max-width: 767px) {
    grid-template-columns: 1fr auto;
    padding: 0 16px;
}
```

---

## 3. Zone Specifications

### 3.1 Left Zone: Status Information

**Purpose:** System health, collaboration, and performance monitoring

#### **Connection Status**

**Display Format:** `● Live` or `○ Offline` or `◐ Syncing`

**Typography:**
- Font-size: 11px
- Font-weight: 400
- Color: `var(--color-text-secondary)`

**Status Dot:**
- Size: 6×6px circle (smaller than header's 8px)
- Position: Inline with text (vertical-align: middle)
- Margin-right: 4px

**Colors:**
- Live: `var(--color-success)` (#34c759)
- Offline: `#86868b` (gray)
- Syncing: `var(--color-warning)` (#ff9500)

**Syncing Animation:**
```css
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}
animation: pulse 2s infinite;
```

**Hover State:**
- Tooltip appears above (8px offset)
- Shows last heartbeat time
- Format: "Last heartbeat: 3 seconds ago"

#### **Last Sync**

**Display Format:** `Synced 2m ago` or `Syncing...` or `Sync failed`

**Typography:**
- Font-size: 11px
- Font-weight: 400
- Color: `var(--color-text-secondary)`

**States:**
- Synced: Shows relative time ("2m ago", "1h ago", "2d ago")
- Syncing: Shows "Syncing..." with subtle pulse animation on text
- Failed: Shows "Sync failed" in `var(--color-error)` with retry icon

**Hover State:**
- Tooltip shows absolute timestamp
- Format: "Last synced: Nov 13, 2025 at 2:47 PM"

**Update Frequency:**
- Real-time on sync events (WebSocket)
- Relative time updates every 30 seconds

#### **Performance Metrics**

**Display Format:** `47ms` or `127ms` (render time)

**Typography:**
- Font-family: `SF Mono, Monaco, 'Cascadia Code', 'Courier New', monospace`
- Font-size: 11px
- Font-weight: 400
- Font-variant-numeric: tabular-nums (fixed-width numbers)
- Color: Dynamic based on performance

**Color Logic:**
- Good (<50ms): `var(--color-success)` (#34c759)
- Warning (50-100ms): `var(--color-warning)` (#ff9500)
- Poor (>100ms): `var(--color-error)` (#ff3b30)

**Hover State:**
- Tooltip shows detailed breakdown
- Format:
  ```
  Render: 47ms
  Scene: 31ms
  UI: 12ms
  Network: 4ms
  ```

**Update Frequency:**
- Real-time (every frame when Scene Canvas active)
- Debounced to 100ms for display updates
- Hidden when not on Scene Canvas (N/A or empty)

#### **Collaboration Presence**

**Display Format:** `3 active` or `1 active` or hidden (if 0)

**Typography:**
- Font-size: 11px
- Font-weight: 400
- Color: `var(--color-text-secondary)`

**Hover State:**
- Shows list of active users
- Format:
  ```
  Active on Building A:
  • Ava Johnson (you)
  • Sarah Chen
  • Michael Torres
  ```
- User avatars: 20×20px circles
- "you" indicator for current user

**Click Action:**
- Expands inline to show user list with avatars
- Click outside to collapse
- Alternative: Opens collaboration panel in Panel zone

**Update Frequency:**
- Real-time via WebSocket presence events
- Fallback: 30-second polling

**Context:**
- Shows users active on current project, not just current view
- "Active" = Online and viewing any part of the project in last 5 minutes

#### **Dividers**

**Character Divider:**
```
● Live  |  Synced 2m ago  |  47ms  |  3 active
```
- Character: `|` (pipe)
- Color: `var(--color-text-secondary)`
- Opacity: 0.5

**Visual Divider (Alternative):**
```css
width: 1px;
height: 12px;
background: var(--color-border);
opacity: 0.5;
```

---

### 3.2 Center Zone: Contextual Information

**Purpose:** Context-aware information based on active module/workflow

**Visibility:**
- Desktop: Visible
- Tablet/Mobile: Hidden

#### **Scene Canvas Context: Spatial Breadcrumbs**

**Purpose:** Show current location in building hierarchy

**Display Format:**
```
Building A › Level 3 › HVAC North › AHU-07
```

**Typography:**
- Font-size: 11px
- Font-weight: 400 (segments), 600 (current/last segment)
- Color: `var(--color-text-secondary)` (segments), `var(--color-text-primary)` (current)

**Separator:**
- Character: `›` (single right-pointing angle quotation mark, U+203A)
- Margin: 0 6px
- Color: `var(--color-text-secondary)`
- Opacity: 0.5

**Segments:**
- Each segment represents a level in hierarchy
- Click segment: Navigate to that level in Scene Canvas
- Hover: Background highlight `var(--color-bg-secondary)`, border-radius 4px
- Last segment (current): Not clickable, bold, no hover state

**Truncation (Desktop):**
- If total length exceeds 600px:
  - Keep first segment (Building)
  - Keep last segment (current selection)
  - Middle segments: Show count (e.g., `Building A › ... (2 levels) › AHU-07`)
- Click `...` : Shows full path in tooltip

**Empty State:**
- Nothing selected: Show `Building A` (project name only)
- No project: Hide center zone entirely

#### **Dashboard Context: Filter Summary**

**Display Format:**
```
Filters: Asset Type = HVAC, Status = Active (47 results)
```

**Typography:**
- Font-size: 11px
- Font-weight: 400
- Color: `var(--color-text-secondary)`

**Click Action:**
- Opens filter panel or expands filter controls

#### **Prism Canvas Context: Grid Status**

**Display Format:**
```
Grid: 8px | Snap: On | Breakpoint: Desktop (1920px)
```

**Typography:**
- Font-size: 11px
- Font-weight: 400
- Color: `var(--color-text-secondary)`

#### **Flow Canvas Context: Validation Status**

**Display Format:**
```
Nodes: 12 | Connections: 18 | Errors: 0
```

**Typography:**
- Font-size: 11px
- Font-weight: 400
- Color: `var(--color-text-secondary)` (normal), `var(--color-error)` (if errors)

---

### 3.3 Right Zone: Controls & Quick Actions

**Purpose:** Rapid access to view, layout, and theme controls

#### **Timeline Toggle**

**Purpose:** Show/hide Timeline zone (collapsed/expanded/hidden)

**Button Structure:**
- Icon: Clock (Lucide, 16×16px)
- Label: "Timeline" (optional, hidden on smaller screens)
- Size: 32px × 32px (minimum touch target 40px with padding)

**Default State:**
- Timeline hidden (button not highlighted)
- Icon color: `var(--color-text-secondary)`

**Active State:**
- Timeline visible (button highlighted)
- Icon color: `var(--color-accent)`
- Background: `rgba(0, 113, 227, 0.1)` (subtle accent tint)

**Click Action:**
- Hidden → Collapsed (48px height)
- Collapsed → Expanded (320px height)
- Expanded → Hidden
- Keyboard: `Cmd+T` (toggle collapsed/expanded), `Cmd+Shift+H` (hide)

**Styling:**
```css
padding: 6px 10px;
border-radius: 6px;
border: 1px solid transparent;
transition: all 150ms;
```

**Hover:**
```css
background: var(--color-bg-secondary);
border-color: var(--color-border);
```

#### **View Mode Selector**

**Purpose:** Switch between Single and Dual view layouts

**Button Structure:**
- Icon: Eye (Lucide, 16×16px)
- Label: Current mode ("Single" or "Dual")
- Chevron: Down (12×12px)
- Size: Auto width, 32px height

**Styling:**
```css
padding: 6px 10px;
gap: 6px;
border-radius: 6px;
border: 1px solid var(--color-border);
background: transparent;
```

**Hover:**
```css
background: var(--color-bg-secondary);
```

**Dropdown Menu:**

Positioning:
```css
position: absolute;
bottom: calc(100% + 8px); /* Above footer */
right: 0;
min-width: 160px;
```

**Menu Items:**
1. **Single** - Full canvas (one view)
2. **Dual** - Split canvas (two views side-by-side)

Each item:
- Padding: 10px 12px
- Font-size: 13px
- Display: flex, justify-content: space-between
- Hover: Background `var(--color-bg-secondary)`

**Current Selection:**
- Checkmark icon (Lucide, 14×14px) on right
- Font-weight: 600
- Color: `var(--color-accent)`

**Click Action:**
- Opens dropdown above footer
- Select item: Changes view mode, closes dropdown
- Click outside: Closes dropdown

#### **Layout Mode Selector**

**Purpose:** Control sidebar, panel, and timeline visibility/positioning

**Button Structure:**
- Icon: Layout (Lucide, 16×16px)
- Label: Current mode ("Normal", "Compact", "Expansive", "Custom")
- Chevron: Down (12×12px)
- Size: Auto width, 32px height

**Styling:** Same as View Mode Selector

**Dropdown Menu:**

**Menu Items:**
1. **Normal** - Default layout (Sidebar collapsed, Panel closed, Timeline hidden)
2. **Compact** - Minimal chrome (Sidebar icons only, Panel closed, Timeline hidden)
3. **Expansive** - Maximum space (Sidebar expanded, Panel open, Timeline expanded)
4. **Custom** - User-modified layout (shows checkmark if user has resized/repositioned)

**Custom Detection:**
- Automatically selected when user:
  - Resizes Panel width
  - Floats Panel pane as separate window
  - Manually adjusts any default dimension
  - Pins Sidebar expanded
- Saves custom state to localStorage
- "Reset to Normal" option appears in dropdown when Custom active

**Menu Item Details:**

Each item:
- Padding: 10px 12px
- Font-size: 13px
- Icon on left (16×16px): Layout variants
- Checkmark on right if current
- Description (optional): 11px, secondary color, shows what changes

**Click Action:**
- Opens dropdown above footer
- Select mode: Animates layout change (250ms), closes dropdown
- Keyboard: Arrow keys navigate, Enter selects

#### **Theme Selector**

**Purpose:** Toggle between Light/Dark/Auto theme

**Button Structure:**
- Icon: Sun (light theme) or Moon (dark theme) - 16×16px
- Label: "Auto" (default, shows current theme detection)
- Size: 32px × 32px (icon only, no dropdown)

**Behavior:**
- **Auto (Default):** Follows system preference
  - Icon: Sun if system light, Moon if system dark
  - Click: Cycles to Light
- **Light (Override):** Forces light theme
  - Icon: Sun
  - Click: Cycles to Dark
- **Dark (Override):** Forces dark theme
  - Icon: Moon
  - Click: Cycles to Auto

**Cycle Pattern:**
```
Auto → Light → Dark → Auto
```

**Styling:**
```css
padding: 8px;
border-radius: 6px;
border: 1px solid transparent;
```

**Active State (Override):**
```css
border-color: var(--color-accent);
background: rgba(0, 113, 227, 0.05);
```

**Hover:**
```css
background: var(--color-bg-secondary);
```

**Click Action:**
- Immediate theme change (no animation)
- Persists to localStorage
- Updates all components instantly

**Keyboard:**
- `Cmd+Shift+T`: Cycle theme

---

## 4. Interaction & States

### 4.1 Global Footer States

**Default State:**
- All elements visible as specified
- Timeline hidden (toggle button not active)
- View Mode: Single
- Layout Mode: Normal
- Theme: Auto

**Loading State:**
- Connection status: Shows spinner (14×14px) instead of dot
- Performance metrics: Shows "—" (em dash)
- Collaboration: Shows "—"
- Breadcrumbs: Shows skeleton loader

**Error State:**
- Connection status: Red dot, "Offline"
- Last sync: "Sync failed" in red with retry icon
- Performance metrics: Hidden or "—"
- Collaboration: Hidden

**Offline State:**
- Connection status: Gray dot, "Offline"
- Last sync: Shows time since last successful sync
- Performance metrics: Hidden
- Collaboration: Hidden
- Footer background: Subtle yellow tint (rgba(255, 149, 0, 0.05))

### 4.2 Connection & Sync States

**Connection State Machine:**

```
┌─────────┐
│  Live   │ ──(WebSocket disconnect)──> Offline
└─────────┘                                │
     ↑                                     │
     │                                     ↓
     └────(WebSocket reconnect)──── Reconnecting
                                           │
                                           ↓
                                       Syncing
                                           │
                                           ↓
                                       Live
```

**Sync States:**

1. **Synced (Success):**
   - Display: "Synced 2m ago"
   - Color: Secondary text
   - Updates: Every 30 seconds (relative time)

2. **Syncing (In Progress):**
   - Display: "Syncing..." with pulse animation
   - Color: Warning (orange)
   - Duration: Typically <5 seconds

3. **Failed (Error):**
   - Display: "Sync failed" with retry icon
   - Color: Error (red)
   - Click: Retry sync manually
   - Auto-retry: 3 attempts with exponential backoff (1s, 2s, 4s)

### 4.3 Performance Monitoring

**Render Time Calculation:**
```javascript
// Pseudo-code
const startTime = performance.now();
// ... render Scene Canvas frame
const endTime = performance.now();
const renderTime = endTime - startTime;

// Update footer (debounced)
updatePerformanceMetric(renderTime);
```

**Display Logic:**
- <16ms (60fps): Hide or show in green
- 16-50ms (30-60fps): Show in green
- 50-100ms (10-30fps): Show in orange
- >100ms (<10fps): Show in red

**Tooltip Breakdown:**
- Scene rendering: Time spent in 3D engine
- UI updates: Time spent updating React/DOM
- Network: Time waiting for data
- Total: Sum of all components

### 4.4 Collaboration Presence

**Presence Events (WebSocket):**
```javascript
// User joins project
{
    event: 'user:joined',
    user: { id, name, avatar },
    project: 'building-a',
    timestamp: '2025-11-13T14:47:23Z'
}

// User leaves project
{
    event: 'user:left',
    user: { id },
    project: 'building-a',
    timestamp: '2025-11-13T14:52:15Z'
}

// User active (heartbeat every 60s)
{
    event: 'user:active',
    user: { id },
    project: 'building-a',
    timestamp: '2025-11-13T14:48:23Z'
}
```

**Active User Definition:**
- Online: WebSocket connected
- Recent activity: Heartbeat within last 5 minutes
- Same project: Viewing any part of current building/portfolio

**Display Priority:**
- Current user always first
- Sort by recency (most recent activity first)
- Maximum 10 users in hover list, "+ N more" if exceeds

### 4.5 Breadcrumb Navigation

**Click Behavior:**
```
Building A › Level 3 › HVAC North › AHU-07
   ↑          ↑            ↑           ↑
 Click 1    Click 2      Click 3    Current
                                    (no action)
```

**Click 1 (Building A):**
- Navigate to Building overview in Scene Canvas
- Deselect current asset
- Zoom to building extents

**Click 2 (Level 3):**
- Navigate to Level 3 view
- Show all assets on Level 3
- Zoom to level extents

**Click 3 (HVAC North):**
- Navigate to HVAC North zone
- Show all HVAC assets in north zone
- Zoom to zone extents

**Keyboard Navigation:**
- Tab: Focus on first clickable segment
- Arrow Right/Left: Move between segments
- Enter: Navigate to focused segment
- Escape: Remove focus

### 4.6 Control Dropdowns

**Opening:**
- Animation: Fade in + slide up 8px (from bottom)
- Duration: 150ms
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
- Focus: First item receives focus

**Closing:**
- Triggers:
  - Click outside dropdown
  - Escape key
  - Select item
- Animation: Fade out
- Duration: 100ms

**Positioning:**
- Anchored to trigger button
- Aligned right (for Right Zone controls)
- 8px gap above footer
- Max-height: 300px (scrollable if exceeds)

---

## 5. Implementation Guidelines

### 5.1 Technology Stack

**HTML:**
- Semantic `<footer>` element
- Role: "contentinfo"
- ARIA labels for all controls

**CSS:**
- CSS Grid for layout
- CSS Custom Properties for tokens
- Backdrop-filter for translucency
- Prefer rem for font-sizes

**JavaScript:**
- WebSocket for real-time updates
- Debounce performance metrics (100ms)
- Throttle breadcrumb updates (16ms)
- LocalStorage for theme/layout persistence

### 5.2 Design Tokens

```css
:root {
    /* Layout */
    --footer-height: 40px;
    --footer-padding-x: 24px;
    --footer-zone-gap: 16px;
    --footer-left-gap: 12px;
    --footer-right-gap: 8px;

    /* Typography */
    --footer-font-size: 11px;
    --footer-font-weight: 400;
    --footer-font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;

    /* Status */
    --status-dot-size: 6px;
    --status-divider-width: 1px;
    --status-divider-height: 12px;

    /* Controls */
    --control-height: 32px;
    --control-icon-size: 16px;
    --control-padding: 6px 10px;
    --control-gap: 6px;
    --control-border-radius: 6px;

    /* Dropdown */
    --dropdown-offset: 8px;
    --dropdown-min-width: 160px;
    --dropdown-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);

    /* Colors (inherit from global tokens) */
    --color-bg-primary: #ffffff;
    --color-bg-secondary: #f5f5f7;
    --color-border: #d2d2d7;
    --color-text-primary: #1d1d1f;
    --color-text-secondary: #86868b;
    --color-accent: #0071e3;
    --color-success: #34c759;
    --color-warning: #ff9500;
    --color-error: #ff3b30;

    /* Motion */
    --duration-fast: 150ms;
    --easing: cubic-bezier(0.4, 0.0, 0.2, 1);
}
```

**Dark Theme Overrides:**
```css
[data-theme="dark"] {
    --color-bg-primary: #000000;
    --color-bg-secondary: #1c1c1e;
    --color-border: #38383a;
    --color-text-primary: #f5f5f7;
    --color-text-secondary: #98989d;
    --dropdown-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}
```

### 5.3 Accessibility Implementation

**Keyboard Navigation:**
```html
<footer role="contentinfo" aria-label="Status bar and controls">
    <div class="footer-left" role="status" aria-live="polite">
        <span aria-label="Connection status: Live">● Live</span>
        <span aria-label="Last synced 2 minutes ago">Synced 2m ago</span>
        <span aria-label="Render time: 47 milliseconds">47ms</span>
        <span aria-label="3 users active on this project">3 active</span>
    </div>
    
    <nav class="footer-center" aria-label="Current location">
        <ol class="breadcrumbs">
            <li><a href="#" aria-current="false">Building A</a></li>
            <li><a href="#" aria-current="false">Level 3</a></li>
            <li><a href="#" aria-current="false">HVAC North</a></li>
            <li><span aria-current="location">AHU-07</span></li>
        </ol>
    </nav>
    
    <div class="footer-right" role="toolbar" aria-label="View controls">
        <button aria-label="Toggle timeline" aria-pressed="false">
            <svg>...</svg>
            Timeline
        </button>
        <button aria-label="View mode: Single" aria-haspopup="true" aria-expanded="false">
            <svg>...</svg>
            Single
        </button>
        <button aria-label="Layout mode: Normal" aria-haspopup="true" aria-expanded="false">
            <svg>...</svg>
            Normal
        </button>
        <button aria-label="Theme: Auto" aria-pressed="false">
            <svg>...</svg>
        </button>
    </div>
</footer>
```

**Screen Reader Announcements:**
- Connection change: "Connection status changed to Offline"
- Sync complete: "Data synced successfully"
- Performance warning: "Performance warning: Render time 127 milliseconds"
- User joined: "Sarah Chen joined the project"
- View changed: "View mode changed to Dual"

**Focus Management:**
- Tab order: Left to right across zones
- Skip link: Optional "Skip to footer controls" before main content
- Focus visible: 2px outline, accent color

### 5.4 Performance Optimization

**WebSocket Management:**
```javascript
class FooterWebSocket {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectDelay = 30000; // 30s
    }

    connect() {
        this.ws = new WebSocket('wss://api.tagwaye.com/status');
        
        this.ws.onopen = () => {
            this.reconnectAttempts = 0;
            this.updateConnectionStatus('live');
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
        };

        this.ws.onclose = () => {
            this.updateConnectionStatus('offline');
            this.reconnect();
        };

        this.ws.onerror = () => {
            this.updateConnectionStatus('offline');
        };
    }

    reconnect() {
        const delay = Math.min(
            1000 * Math.pow(2, this.reconnectAttempts),
            this.maxReconnectDelay
        );
        
        setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
        }, delay);
    }

    handleMessage(data) {
        switch(data.type) {
            case 'heartbeat':
                this.updateLastSync(data.timestamp);
                break;
            case 'presence':
                this.updateCollaboration(data.users);
                break;
            case 'performance':
                this.updatePerformance(data.metrics);
                break;
        }
    }
}
```

**Performance Metrics Debouncing:**
```javascript
const debouncedUpdatePerformance = debounce((renderTime) => {
    const element = document.getElementById('performance-metric');
    element.textContent = `${Math.round(renderTime)}ms`;
    
    // Update color based on performance
    if (renderTime < 50) {
        element.className = 'performance-good';
    } else if (renderTime < 100) {
        element.className = 'performance-warning';
    } else {
        element.className = 'performance-poor';
    }
}, 100);
```

**Breadcrumb Update Optimization:**
```javascript
// Don't re-render entire breadcrumb, diff update only
function updateBreadcrumb(newPath) {
    const currentPath = getCurrentPath();
    const diff = diffPaths(currentPath, newPath);
    
    // Only update changed segments
    diff.changed.forEach(({ index, segment }) => {
        updateSegment(index, segment);
    });
    
    // Add new segments
    diff.added.forEach(segment => {
        appendSegment(segment);
    });
    
    // Remove old segments
    diff.removed.forEach(index => {
        removeSegment(index);
    });
}
```

### 5.5 State Management

```typescript
interface FooterState {
    connection: {
        status: 'live' | 'offline' | 'syncing';
        lastSync: Date | null;
        lastHeartbeat: Date | null;
    };
    performance: {
        renderTime: number | null;
        breakdown: {
            scene: number;
            ui: number;
            network: number;
        };
        visible: boolean; // Only show on Scene Canvas
    };
    collaboration: {
        activeUsers: User[];
        count: number;
        expanded: boolean;
    };
    context: {
        type: 'breadcrumbs' | 'filters' | 'grid' | 'validation';
        content: any; // Context-specific data
        visible: boolean;
    };
    controls: {
        timeline: {
            visible: boolean;
            expanded: boolean;
        };
        viewMode: 'single' | 'dual';
        layoutMode: 'normal' | 'compact' | 'expansive' | 'custom';
        theme: 'auto' | 'light' | 'dark';
    };
}
```

### 5.6 Testing Requirements

**Unit Tests:**
- Connection state transitions
- Performance metric formatting
- Breadcrumb truncation logic
- Relative time formatting ("2m ago", "1h ago")

**Integration Tests:**
- WebSocket connect/disconnect/reconnect
- Dropdown open/close/select
- Theme persistence across sessions
- Layout mode changes update grid

**Visual Regression Tests:**
- Default state
- Each control dropdown open
- Hover states
- Mobile responsive
- Dark theme

**Accessibility Tests:**
- Keyboard navigation (Tab through all controls)
- Screen reader announcements (test with VoiceOver/NVDA)
- Focus indicators visible
- Color contrast verification

**Performance Tests:**
- Footer render time: <16ms
- WebSocket message handling: <10ms
- Dropdown animation: 60fps
- No memory leaks (long-running session test)

---

## Appendix

### A. Component Hierarchy

```
Footer
├── Left Zone (Status)
│   ├── Connection Status
│   │   ├── Status Dot (animated)
│   │   └── Status Text
│   ├── Last Sync
│   │   └── Relative Time (with tooltip)
│   ├── Performance Metrics
│   │   └── Render Time (color-coded, with tooltip)
│   └── Collaboration
│       ├── User Count
│       └── User List (hover/click)
├── Center Zone (Contextual)
│   ├── Breadcrumbs (Scene Canvas)
│   │   ├── Segments (clickable)
│   │   └── Separators
│   ├── Filter Summary (Dashboard)
│   ├── Grid Status (Prism Canvas)
│   └── Validation Status (Flow Canvas)
└── Right Zone (Controls)
    ├── Timeline Toggle
    │   └── Active State Indicator
    ├── View Mode Selector
    │   ├── Icon + Label + Chevron
    │   └── Dropdown Menu
    ├── Layout Mode Selector
    │   ├── Icon + Label + Chevron
    │   └── Dropdown Menu
    └── Theme Selector
        └── Icon (Sun/Moon) + Cycle Behavior
```

### B. WebSocket Message Format

```json
// Heartbeat
{
    "type": "heartbeat",
    "timestamp": "2025-11-13T14:47:23Z",
    "status": "live"
}

// Sync Complete
{
    "type": "sync",
    "timestamp": "2025-11-13T14:47:25Z",
    "status": "success",
    "itemsSynced": 47
}

// Presence Update
{
    "type": "presence",
    "project": "building-a",
    "users": [
        {
            "id": "user-123",
            "name": "Ava Johnson",
            "avatar": "https://...",
            "lastActive": "2025-11-13T14:47:20Z"
        }
    ]
}

// Performance Metrics
{
    "type": "performance",
    "metrics": {
        "renderTime": 47,
        "breakdown": {
            "scene": 31,
            "ui": 12,
            "network": 4
        }
    }
}
```

### C. LocalStorage Schema

```javascript
// Theme Preference
localStorage.setItem('tagwaye:theme', 'auto'); // 'auto' | 'light' | 'dark'

// Layout Mode
localStorage.setItem('tagwaye:layout', JSON.stringify({
    mode: 'custom',
    sidebar: { expanded: true, width: 280 },
    panel: { open: true, width: 450 },
    timeline: { visible: true, expanded: true, height: 320 }
}));

// View Mode
localStorage.setItem('tagwaye:viewMode', 'dual');

// Timeline State
localStorage.setItem('tagwaye:timeline', JSON.stringify({
    visible: false,
    expanded: false
}));
```

### D. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 13, 2025 | Initial specification with three-zone architecture and contextual center |

---

**End of Document**

*This specification is a living document and will be updated as the Tagwaye platform evolves. For questions or clarifications, contact the Design & Engineering team.*
