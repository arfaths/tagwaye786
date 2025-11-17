# Tagwaye Sidebar Design Specifications

**Version:** 2.0  
**Date:** November 13, 2025  
**Status:** Final Specification  
**Authors:** Design & Engineering Team

---

## Table of Contents

1. [Overview & Design Foundation](#1-overview--design-foundation)
2. [Structure & Layout](#2-structure--layout)
3. [Navigation Items & Hierarchy](#3-navigation-items--hierarchy)
4. [Interaction & States](#4-interaction--states)
5. [Implementation Guidelines](#5-implementation-guidelines)

---

## 1. Overview & Design Foundation

### 1.1 Purpose

The Tagwaye Sidebar is the primary navigation spine for the entire platform. It provides persistent, elegant access to all major workflows while maintaining awareness of the active project context. Unlike traditional enterprise sidebars that function as static menus, the Tagwaye Sidebar operates as a **contextual navigation system** that adapts to user state while embodying Apple's principle: the best interface disappears.

### 1.2 Design Principles Applied

**Clarity: Contextual Confidence**
- Active project name always visible in header (never ambiguous)
- Current page highlighted with accent color and left border
- Each navigation item has unique, unambiguous label
- Sub-items appear only when parent is active (no hidden surprises)

**Deference: Content Over Chrome**
- Collapsed to 64px by default (minimal screen footprint)
- Expands to 280px on hover or when pinned
- No redundant labels or headers (spacing creates hierarchy)
- Translucent backdrop allows focus on main content

**Depth: Progressive Disclosure**
- Starts minimal (icons only in collapsed state)
- Expands on demand (hover reveals labels)
- Actions sub-items appear when parent active
- Create modal adapts to current module context

**Continuity: Time as Truth**
- Active project persists across sessions
- Pin state remembered in localStorage
- Recent actions tracked for Command Palette
- Navigation history enables back/forward

**Intelligence: AI Suggests, User Decides**
- Ask Sage prominently placed for easy access
- Command Palette provides intelligent command suggestions
- Create modal shows context-aware options
- No intrusive notifications or badges

### 1.3 Core Architecture: Three Zones

The sidebar follows a three-zone vertical structure:

**Top Zone: Context & Tools**
- Active project name with quick switcher
- Command Palette for tool/action access
- Always visible, never scrolls

**Main Zone: Navigation Hierarchy**
- Core destinations (Home, Projects, Ask Sage)
- Analysis tools (Visualize, Analyze, Optimize)
- Collaboration & automation (Collaborate, Actions)
- Scrollable if content exceeds viewport height

**Bottom Zone: System Utilities**
- Help (documentation and support)
- Settings (application preferences)
- Always visible, anchored to bottom

### 1.4 Constraints & Requirements

**Performance:**
- Sidebar render time: <16ms (60fps)
- Hover expansion delay: 300ms (prevents accidental triggers)
- Collapse delay: 500ms (prevents flicker)
- Pin state toggle: Instant (<16ms)
- Command Palette open: <100ms

**Accessibility:**
- WCAG 2.1 Level AA compliance mandatory
- Full keyboard navigation (Tab, Arrow keys, shortcuts)
- Screen reader support (ARIA labels, live regions)
- Reduced motion support (respects prefers-reduced-motion)
- Minimum touch targets: 40×40px (48px row height exceeds this)

**Browser Support:**
- Chrome/Edge (Chromium) — latest 2 versions
- Safari (macOS/iOS) — latest 2 versions
- Firefox — latest 2 versions

**Device Support:**
- Desktop (1024px+): Full hover-expand behavior, 64px ↔ 280px
- Tablet (768-1023px): Overlay with backdrop, always 280px when visible
- Mobile (<768px): Bottom tab bar navigation (5 icons)

---

## 2. Structure & Layout

### 2.1 Three-Zone Architecture

```
┌───────────────────────────┐
│   TOP ZONE                │  Fixed (never scrolls)
│   ─────────────────       │  • Active project header
│   Active Project + Toggle │  • Command Palette
│   Command Palette         │
│                           │
├───────────────────────────┤
│   MAIN ZONE               │  Scrollable (if needed)
│   ─────────────────       │  • Core navigation
│   Home                    │  • Analysis tools
│   Projects                │  • Collaboration
│   Ask Sage                │
│   [Space]                 │
│   Visualize               │
│   Analyze                 │
│   Optimize                │
│   [Space]                 │
│   Collaborate             │
│   Actions                 │
│     Create                │
│     Manage                │
│                           │
├───────────────────────────┤
│   BOTTOM ZONE             │  Fixed (anchored to bottom)
│   ─────────────────       │  • System utilities
│   Divider                 │
│   Help                    │
│   Settings                │
│   Pin Indicator           │
└───────────────────────────┘
```

### 2.2 Width States & Transitions

**Collapsed State (Default):**
```css
width: 64px;
```
- Icons only, centered
- No labels visible
- Minimal screen footprint

**Expanded State (Hover or Pinned):**
```css
width: 280px;
transition: width 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
```
- Icons + labels visible
- Sub-items visible when parent active
- Full navigation hierarchy exposed

**Pinned State:**
- Width locked at 280px
- Hover triggers disabled
- Pin indicator visible at bottom
- State persists across sessions

### 2.3 Height & Positioning

**Fixed Positioning:**
```css
position: fixed;
top: 56px;        /* Below header */
bottom: 40px;     /* Above footer */
left: 0;
z-index: 900;     /* Below header (1000), above content */
```

**Height Calculation:**
```
Available Height = 100vh - Header (56px) - Footer (40px)
Available Height = calc(100vh - 96px)
```

**Zone Distribution:**
- Top Zone: Fixed ~109px
- Main Zone: Flexible (min 408px, scrollable if exceeds)
- Bottom Zone: Fixed ~153px

### 2.4 Visual Foundation

**Background:**
```css
background: var(--color-surface);
border-right: 1px solid var(--color-border);
```

**No translucency:**
- Sidebar is opaque (unlike Header/Footer which use backdrop-filter)
- Provides stable, solid visual foundation
- Content doesn't show through

**Dark Theme:**
```css
[data-theme="dark"] {
    background: var(--color-surface); /* #1c1c1e */
    border-right: 1px solid var(--color-border); /* #38383a */
}
```

### 2.5 Top Zone Specifications

**Contents:**
1. **Header:** Active project name + toggle icon
2. **Divider:** 1px line, inset from edges
3. **Command Palette:** Search/command input field

**Height Breakdown:**
- Header row: 40px
- Divider: 1px + 12px margin = 13px
- Gap: 12px
- Command field: 44px
- Bottom padding: 12px
- **Total: ~121px**

**Styling:**
```css
padding: 0;
border-bottom: 1px solid var(--color-border);
background: var(--color-surface);
```

### 2.6 Main Zone Specifications

**Contents (9 navigation items):**

**Group 1: Core (3 items)**
1. Home
2. Projects
3. Ask Sage

**Spacing: 16px**

**Group 2: Analysis (3 items)**
4. Visualize
5. Analyze
6. Optimize

**Spacing: 16px**

**Group 3: Collaboration (2 items)**
7. Collaborate
8. Actions (expandable: Create, Manage)

**Height Breakdown:**
- 9 items × 48px = 432px
- 2 spacing gaps × 16px = 32px
- Actions sub-items (when expanded): 2 × 40px = 80px
- Top padding: 16px
- **Total (collapsed): ~464px**
- **Total (expanded): ~544px**

**Scrolling Behavior:**
- If Main Zone content exceeds available height → scroll
- Scroll area: Main Zone only (Top and Bottom zones remain fixed)
- Scrollbar: Subtle, auto-hide on macOS

### 2.7 Bottom Zone Specifications

**Contents:**
1. **Divider:** Visual separation from Main Zone
2. **Help:** Documentation and support
3. **Settings:** Application preferences
4. **Pin Indicator:** Small icon (8px) when sidebar is pinned

**Height Breakdown:**
- Top padding: 16px
- Divider: 1px + 16px margin = 17px
- Help: 48px
- Settings: 48px
- Pin indicator: 24px (including padding)
- Bottom padding: 16px
- **Total: ~169px**

**Styling:**
```css
border-top: 1px solid var(--color-border);
background: var(--color-surface);
```

---

## 3. Navigation Items & Hierarchy

### 3.1 Top Zone: Header & Command Palette

#### **Active Project Header**

**Purpose:** Display current project context and provide quick project switching

**Collapsed State (64px):**
- No text visible
- Toggle icon only (20px, centered)

**Expanded State (280px):**
```
┌───────────────────────────┐
│ Riverside Hotel      [>]  │
└───────────────────────────┘
```

**Specifications:**
- **Text:** Active project name (e.g., "Riverside Hotel")
- **Character limit:** 20 characters maximum
- **Truncation:** Ellipsis overflow (e.g., "Riverside Hotel Re...")
- **Font-size:** 13px
- **Font-weight:** 600
- **Color:** `var(--color-text-primary)`
- **Cursor:** Pointer (entire text area clickable)

**Toggle Icon:**
- **Collapsed state:** `LuPanelLeftOpen` (20×20px) — points right →
- **Expanded state:** `LuPanelLeftClose` (20×20px) — points left ←
- **Position:** Absolute right 12px
- **Button area:** 32×32px (centered icon)
- **Hover:** Background highlight `var(--color-bg-secondary)`

**Click Behavior:**
- **Click text:** Opens project switcher dropdown
- **Click icon:** Toggles pin state (collapsed ↔ expanded)

**Project Switcher Dropdown:**
```
┌───────────────────────────┐
│ Switch Project        ✕  │
├───────────────────────────┤
│ ● Riverside Hotel         │  ← Current (accent color, checkmark)
│ ○ Distribution Center     │
│ ◐ Corporate HQ            │
│ ─────────────────────     │
│ All Projects         →    │
└───────────────────────────┘
```

**Dropdown Contents:**
- Current project (highlighted, accent background)
- Recent projects (max 5, with status dots)
- Divider
- "All Projects" link → navigates to projects page

**Status Indicators:**
- ● Live (green): `var(--color-success)`
- ○ Offline (gray): `#86868b`
- ◐ Syncing (orange with pulse): `var(--color-warning)`

**No Active Project State:**
```
┌───────────────────────────┐
│ Select Project...    [>]  │
└───────────────────────────┘
```
- Text: "Select Project..." (italic, secondary color)
- Click: Opens project selector immediately
- Main Zone modules: Disabled (grayed out) until project selected

**Tooltip (on text hover):**
- Shows full project name if truncated
- Format: "Riverside Hotel Renovation Phase 2"
- Delay: 500ms

#### **Command Palette**

**Purpose:** Provide quick access to actions, tools, and commands via natural language search

**Collapsed State (64px):**
- Icon only: Search (Lucide, 18×18px)
- Centered in 64px width
- Click: Opens Command Palette modal

**Expanded State (280px):**
```
┌───────────────────────────┐
│ 🔍 Type a command...      │
└───────────────────────────┘
```

**Specifications:**
- **Height:** 44px (proper touch target)
- **Padding:** 0 12px 0 40px (space for icon)
- **Background:** `var(--color-bg-secondary)`
- **Border:** 1px solid `var(--color-border)`
- **Border-radius:** 8px
- **Font-size:** 13px
- **Placeholder:** "Type a command..."
- **Icon:** Search (18×18px) at left 12px

**Trigger Methods:**
1. Click field
2. `Cmd+K` keyboard shortcut (works globally)

**Opens:** Full-screen Command Palette modal

---

### 3.2 Main Zone: Navigation Items

#### **Navigation Item Structure**

**Standard Item (Collapsed 64px):**
- Icon only (20×20px, centered)
- No label

**Standard Item (Expanded 280px):**
```
[Icon] Label
```
- Icon: 20×20px, left-aligned
- Label: 13px, 12px gap from icon
- Height: 48px
- Padding: 12px
- Margin: 0 8px (inset from edges)

**States:**

**Default:**
```css
background: transparent;
color: var(--color-text-secondary);
border-left: 4px solid transparent;
```

**Hover:**
```css
background: var(--color-bg-secondary);
color: var(--color-text-primary);
border-radius: 6px;
```

**Active (current page):**
```css
background: rgba(0, 113, 227, 0.12);
border-left: 4px solid var(--color-accent);
border-radius: 6px;
color: var(--color-accent);
font-weight: 600;
```

**Disabled (no active project):**
```css
opacity: 0.4;
cursor: not-allowed;
pointer-events: none;
```

---

### **Item 1: Home**

**Icon:** `LuHouse` (Lucide, 20×20px)  
**Label:** "Home"  
**Purpose:** Primary landing page showing critical/important/next actions  
**Shortcut:** `Cmd+Shift+H`  
**Type:** Direct navigation (no sub-items)  
**Always enabled:** Yes (accessible even without active project)

**Behavior:**
- Click: Navigate to home dashboard
- Shows overview of all projects, critical alerts, upcoming tasks

---

### **Item 2: Projects**

**Icon:** `LuBuilding2` (Lucide, 20×20px)  
**Label:** "Projects"  
**Purpose:** Project management and portfolio overview  
**Shortcut:** `Cmd+Shift+P`  
**Type:** Direct navigation (no sub-items)  
**Always enabled:** Yes

**Behavior:**
- Click: Navigate to projects hub page
- Projects page has its own internal navigation (tabs, sidebar, filters)
- Shows all projects, allows creation, management, switching

**Rationale for no sub-items:**
- Projects hub should own its complexity
- Keeps sidebar clean and focused
- Avoids deep nested navigation

---

### **Item 3: Ask Sage**

**Icon:** `LuSparkles` (Lucide, 20×20px)  
**Label:** "Ask Sage"  
**Purpose:** AI conversational assistant for natural language queries  
**Shortcut:** `Cmd+Shift+K`  
**Type:** Panel trigger (opens Panel on right side)  
**Always enabled:** Yes

**Behavior:**
- Click: Opens Ask Sage panel in right zone (Panel)
- Panel contains chat interface with AI assistant
- Context-aware: AI knows current view, selected assets
- Can be resized, repositioned, closed

**Placement Rationale:**
- High-value feature deserves prominence in Main Zone
- Not a "utility" like Help/Settings
- Frequently accessed tool, not occasional use

---

### **Spacing Gap (16px)**

Visual separation between Core group and Analysis group.

---

### **Item 4: Visualize**

**Icon:** `LuBox` (Lucide, 20×20px)  
**Label:** "Visualize"  
**Purpose:** 3D Scene Canvas for spatial digital twin navigation  
**Shortcut:** `Cmd+Shift+V`  
**Type:** Direct navigation (no sub-items)  
**Requires active project:** Yes (disabled without project)

**Behavior:**
- Click: Open Scene Canvas with current active project
- Renders 3D digital twin (LivingTwin)
- Spatial navigation, asset selection, system visualization
- If no project active: Disabled with tooltip "Select a project"

---

### **Item 5: Analyze**

**Icon:** `LuChartScatter` (Lucide, 20×20px)  
**Label:** "Analyze"  
**Purpose:** Data dashboards, analytics, insights visualization  
**Shortcut:** `Cmd+Shift+A`  
**Type:** Direct navigation (no sub-items)  
**Requires active project:** Yes

**Behavior:**
- Click: Navigate to dashboard/analytics view
- Opens last viewed dashboard or dashboard gallery
- Shows data visualizations, KPIs, trends
- Page has its own tabs/sections for different dashboard types

---

### **Item 6: Optimize**

**Icon:** `LuSparkle` (Lucide, 20×20px)  
**Label:** "Optimize"  
**Purpose:** Performance tuning, AI recommendations, scenario modeling  
**Shortcut:** `Cmd+Shift+O`  
**Type:** Direct navigation (no sub-items)  
**Requires active project:** Yes

**Behavior:**
- Click: Navigate to optimization view
- Shows AI-driven optimization recommendations
- Energy optimization, cost optimization, performance tuning
- Scenario comparison tools
- Page has tabs: Recommendations | Scenarios | History

**Rationale for no sub-items:**
- Page-level tabs handle different optimization modes
- Keeps sidebar focused on top-level destinations
- Sub-items would duplicate page structure

---

### **Spacing Gap (16px)**

Visual separation between Analysis group and Collaboration group.

---

### **Item 7: Collaborate**

**Icon:** `LuMessagesSquare` (Lucide, 20×20px)  
**Label:** "Collaborate"  
**Purpose:** Team presence, comments, sharing, real-time collaboration  
**Shortcut:** `Cmd+Shift+C`  
**Type:** Direct navigation (no sub-items)  
**Requires active project:** Yes

**Behavior:**
- Click: Navigate to collaboration hub
- Shows active users, recent comments, shared views
- Real-time presence indicators
- Activity feed, notifications, team communication

---

### **Item 8: Actions** (Expandable)

**Icon:** `LuWorkflow` (Lucide, 20×20px)  
**Label:** "Actions"  
**Purpose:** Workflows, automation, work orders, process management  
**Shortcut:** `Cmd+Shift+W`  
**Type:** Expandable navigation (2 sub-items)  
**Requires active project:** Yes

**Collapsed State (Actions not active):**
```
🔀 Actions
```

**Expanded State (Actions IS active page):**
```
🔀 Actions                    ← Active state (accent bg, 4px border)
   Create
   Manage
```

**Sub-items appear only when Actions is the active page.**

---

### **Sub-Item 8a: Create**

**Label:** "Create"  
**Height:** 40px (8px shorter than parent)  
**Indent:** 24px from left edge (36px padding-left)  
**Type:** Modal trigger

**Behavior:**
- Click: Opens "Create New" modal overlay

**Modal Structure:**
```
┌─────────────────────────────────────┐
│  Create New                     ✕  │
│  ───────────────────────────────   │
│                                    │
│  What would you like to create?    │
│                                    │
│  🏢 New Project                    │
│     Create a new project workspace │
│                                    │
│  🔀 New Workflow                   │
│     Design an automated workflow   │
│                                    │
│  📋 New Work Order                 │
│     Create a maintenance task      │
│                                    │
│  📊 New Report                     │
│     Generate a data report         │
│                                    │
│  📈 New Dashboard                  │
│     Build a visualization          │
│                                    │
└─────────────────────────────────────┘
```

**Modal Specifications:**
- Width: 480px
- Max-height: 600px (scrollable if needed)
- Backdrop: rgba(0, 0, 0, 0.3)
- Border-radius: 16px
- Close: Click X, press Escape, or click backdrop

**Context-Aware Options:**
- Options adapt based on current module context
- If in Visualize: Highlights "New Scene View"
- If in Analyze: Highlights "New Dashboard"
- If in Collaborate: Shows "New Team Channel"

**Each option:**
- Icon: 20×20px
- Title: 15px, 600 weight
- Description: 13px, secondary color
- Hover: Background highlight
- Click: Closes modal, opens specific creation flow

---

### **Sub-Item 8b: Manage**

**Label:** "Manage"  
**Height:** 40px  
**Indent:** 24px from left edge  
**Type:** Direct navigation

**Behavior:**
- Click: Navigate to management page
- Page shows comprehensive management interface
- Tabs: Projects | Workflows | Work Orders | Reports | Dashboards
- Full-featured: filters, search, bulk actions, sorting

**Styling (Sub-Items):**
```css
.sidebar-sub-item {
    padding: 10px 12px 10px 36px;
    height: 40px;
    font-size: 13px;
    font-weight: 400;
    color: var(--color-text-primary);
    border-radius: 6px;
    margin: 0 8px;
}

.sidebar-sub-item:hover {
    background: rgba(0, 113, 227, 0.06); /* Lighter than parent */
}

.sidebar-sub-item.active {
    background: rgba(0, 113, 227, 0.06);
    color: var(--color-accent);
    font-weight: 600;
}
```

---

### 3.3 Bottom Zone: System Utilities

#### **Divider**

**Visual Separator:**
```css
height: 1px;
background: var(--color-border);
opacity: 0.5;
margin: 16px 12px;
```

**Purpose:** Clear separation between Main navigation and System utilities

---

### **Item 9: Help**

**Icon:** `LuHelpCircle` (Lucide, 20×20px)  
**Label:** "Help"  
**Shortcut:** `?` (single key, like GitHub)  
**Type:** Direct navigation  
**Always enabled:** Yes

**Behavior:**
- Click: Opens help landing page in MainContent
- Page contains:
  - Documentation search
  - Video tutorials
  - Keyboard shortcuts reference
  - Support contact form
  - Community forum links

---

### **Item 10: Settings**

**Icon:** `LuSettings` (Lucide, 20×20px)  
**Label:** "Settings"  
**Shortcut:** `Cmd+,` (standard macOS pattern)  
**Type:** Direct navigation  
**Always enabled:** Yes

**Behavior:**
- Click: Opens settings page in MainContent
- Page has tabbed navigation:
  - Appearance (theme, density, motion)
  - Performance (quality, frame rate, cache)
  - Keyboard (shortcut customization)
  - Data & Sync (frequency, offline mode)
  - Notifications (alert preferences)
  - Integrations (connected services)
  - Advanced (feature flags, debug)

---

### **Pin Indicator**

**Visual:**
```css
width: 8px;
height: 8px;
border-radius: 50%;
background: var(--color-text-secondary);
opacity: 0.3;
position: absolute;
bottom: 16px;
right: 28px; /* Centered in 64px width */
```

**Expanded Position:**
```css
right: 136px; /* Centered in 280px width */
```

**Behavior:**
- Visible only when sidebar is pinned
- Hover: Opacity increases to 1.0
- Tooltip: "Sidebar pinned (⌘⇧S to unpin)"
- Click: Unpins sidebar (same as Cmd+Shift+S)

**Icon:** `LuPin` (8px) or small filled circle (📌)

---

## 4. Interaction & States

### 4.1 Hover-to-Expand Mechanism

**Purpose:** Allow temporary sidebar expansion without pinning

#### **Hover Trigger Zone**

**Invisible detection area:**
```css
.sidebar-hover-trigger {
    position: fixed;
    left: 0;
    top: 56px;
    bottom: 40px;
    width: 8px;
    z-index: 999;
    cursor: pointer;
}
```

**Expansion Logic:**

1. Mouse enters 8px trigger zone at left edge
2. Start 300ms timer
3. If mouse still in zone after 300ms → Expand sidebar to 280px
4. If mouse leaves before 300ms → Cancel timer, stay collapsed

**Why 300ms delay?**
- Prevents accidental expansion on quick mouse movements
- Feels intentional, not twitchy
- Matches Apple's hover timing patterns

**Collapse Logic:**

1. Mouse leaves sidebar area (exits right edge)
2. Start 500ms timer
3. If mouse still outside after 500ms → Collapse to 64px
4. If mouse re-enters before 500ms → Cancel timer, stay expanded
5. **If sidebar is pinned → Never auto-collapse**

**Why 500ms delay?**
- Longer than expansion (asymmetric timing)
- Prevents flicker when moving between sidebar and content
- User doesn't feel rushed to keep sidebar open

**Animation:**
```css
.sidebar {
    width: 64px;
    transition: width 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.sidebar.expanded {
    width: 280px;
}

.sidebar-label {
    opacity: 0;
    transition: opacity 150ms 100ms; /* 100ms delay after width transition starts */
}

.sidebar.expanded .sidebar-label {
    opacity: 1;
}
```

**Label Fade-In:**
- Labels invisible in collapsed state
- Fade in 100ms after expansion begins
- Prevents labels appearing before space is available
- Smooth, polished transition

### 4.2 Pin State Management

**Purpose:** Allow users to lock sidebar in expanded state

#### **Methods to Toggle Pin:**

**Method 1: Keyboard Shortcut**
- `Cmd+Shift+S` (macOS standard for sidebar)
- Works from anywhere in application
- Instant toggle between pinned/unpinned

**Method 2: Click Toggle Icon**
- Click chevron icon in header (top-right)
- Same behavior as keyboard shortcut
- Visual feedback: Icon rotates 180° during toggle

**Method 3: Settings Page**
- Settings → Appearance → "Keep sidebar expanded"
- Checkbox control
- Same effect as other methods

**Method 4: Context Menu**
- Right-click anywhere on sidebar
- Menu option: "☑ Keep Sidebar Expanded"
- Checkmark shows current state
- Click toggles pin state

**Pin State Persistence:**
```javascript
// localStorage schema
{
    "sidebar": {
        "pinned": true,
        "lastWidth": 280,
        "timestamp": "2025-11-13T14:47:23Z"
    }
}
```

**Behavior When Pinned:**
- Sidebar stays at 280px permanently
- Hover trigger disabled (already expanded)
- Mouse leaving sidebar does NOT trigger collapse timer
- Pin indicator visible at bottom
- State persists across:
  - Browser refresh
  - Tab close/reopen
  - User logout/login (per-user preference)

**Behavior When Unpinned:**
- Sidebar returns to 64px default
- Hover expansion re-enabled
- Auto-collapse on mouse leave (500ms delay)
- Pin indicator hidden

### 4.3 Navigation Item States

**State Definitions:**

**Default (Not Active, Not Hovered):**
```css
background: transparent;
border-left: 4px solid transparent;
color: var(--color-text-secondary);
font-weight: 400;
```

**Hover:**
```css
background: var(--color-bg-secondary);
color: var(--color-text-primary);
cursor: pointer;
transition: all 150ms cubic-bezier(0.4, 0.0, 0.2, 1);
```

**Active (Current Page):**
```css
background: rgba(0, 113, 227, 0.12); /* Accent at 12% */
border-left: 4px solid var(--color-accent);
border-radius: 6px;
color: var(--color-accent);
font-weight: 600;
icon-color: var(--color-accent);
```

**Focus (Keyboard Navigation):**
```css
outline: 2px solid var(--color-accent);
outline-offset: -2px;
border-radius: 6px;
```

**Disabled (No Active Project):**
```css
opacity: 0.4;
cursor: not-allowed;
pointer-events: none;
```

**Disabled items:**
- Visualize, Analyze, Optimize, Collaborate, Actions
- Only when no project is active
- Tooltip on hover: "Select a project to enable"

**Always enabled items:**
- Home, Projects, Ask Sage, Help, Settings

### 4.4 Sub-Item Expansion (Actions)

**Trigger:** Actions becomes active page (user navigates to Actions)

**Expansion Behavior:**
- Sub-items (Create, Manage) appear instantly (no animation)
- Parent (Actions) shows active state (accent bg, 4px border)
- Sub-items indented 24px from parent

**Visual Structure:**
```
🔀 Actions                    ← Active (accent bg 12%, 4px left border)
   Create                     ← Sub-item (indented 24px)
   Manage                     ← Sub-item
```

**When Sub-Item Is Active:**
```
🔀 Actions                    ← Parent active
   Create                     ← This sub-item active (accent text, 6% bg)
   Manage                     ← Not active
```

**Collapse Trigger:** User navigates away from Actions

**Keyboard Navigation Through Sub-Items:**
- Tab to Actions → Press Enter → Navigates to Actions page
- If Actions already active: Arrow Down → Moves to "Create" sub-item
- Arrow Down again → Moves to "Manage" sub-item
- Arrow Up → Returns to parent (Actions)
- Enter on sub-item → Executes sub-item action

### 4.5 Keyboard Navigation

**Global Shortcuts:**
- `Cmd+K` → Open Command Palette
- `/` → Focus Header Search (content search, no conflict)
- `Cmd+Shift+S` → Toggle sidebar pin state
- `Escape` → Close Command Palette, dropdowns, or remove focus

**Navigation Shortcuts:**
- `Cmd+Shift+H` → Home
- `Cmd+Shift+P` → Projects
- `Cmd+Shift+V` → Visualize
- `Cmd+Shift+A` → Analyze
- `Cmd+Shift+O` → Optimize
- `Cmd+Shift+C` → Collaborate
- `Cmd+Shift+W` → Actions (Workflows)
- `Cmd+Shift+K` → Ask Sage

**Utility Shortcuts:**
- `?` → Help
- `Cmd+,` → Settings

**Tab Order (Top to Bottom):**
1. Project header (clickable text)
2. Toggle icon
3. Command field
4. Home
5. Projects
6. Ask Sage
7. Visualize
8. Analyze
9. Optimize
10. Collaborate
11. Actions
    - 11a. Create (if Actions active)
    - 11b. Manage (if Actions active)
12. Help
13. Settings

**Arrow Key Navigation:**
- `Arrow Down` → Next item in Tab order
- `Arrow Up` → Previous item
- `Arrow Right` on Actions (collapsed) → Expands sub-items
- `Arrow Left` on Actions (expanded) → Collapses sub-items
- `Enter` or `Space` → Activate focused item

### 4.6 Command Palette Modal

**Trigger Methods:**
1. Click "Type a command..." field in sidebar
2. Press `Cmd+K` from anywhere in application

**Modal Overlay:**
```
Full-screen centered modal
Width: 600px
Max-height: 500px (scrollable if needed)
Backdrop: rgba(0, 0, 0, 0.3)
Backdrop-filter: blur(8px) (if supported)
```

**Initial State (Empty Query):**
```
┌─────────────────────────────────────┐
│  🔍 Type a command...              │  ← Autofocus on open
├─────────────────────────────────────┤
│                                    │
│  recent                            │  ← Category (11px, uppercase, gray)
│  Create new dashboard              │  ← Recent command
│  Go to Visualize                   │
│                                    │
│  suggested                         │
│  Add sensor                        │
│  Generate report                   │
│  Energy optimization               │
│                                    │
└─────────────────────────────────────┘
```

**Categories (Soft, Only When Empty):**
- `recent` — Last 5 commands executed
- `suggested` — AI-recommended commands based on context

**As User Types (Categories Disappear):**
```
User types: "create dash"

┌─────────────────────────────────────┐
│  🔍 create dash                    │
├─────────────────────────────────────┤
│  📊 Create new dashboard           │  ← Matched (highlighted)
│  📈 Dashboard from template        │
│  🗂️ Export dashboard              │
└─────────────────────────────────────┘
```

**Pure Elastic Search:**
- Fuzzy matching (typo-tolerant)
- Matches on: Command title, keywords, tags
- No category grouping during search
- Results ranked by relevance:
  1. Exact match
  2. Starts with query
  3. Contains query
  4. Fuzzy match
  5. Recent commands (boosted)

**Result Format:**
```
[Icon] Command Title
       Description/Context
```

**Keyboard Navigation:**
- `Arrow Down/Up` → Navigate results
- `Enter` → Execute highlighted command
- `Escape` → Close palette
- `Cmd+K` again → Close palette

**Close Triggers:**
- Execute command (Enter on result)
- Press Escape
- Click backdrop
- Press Cmd+K again

### 4.7 Context Menu (Right-Click)

**Trigger:** Right-click anywhere on sidebar (any item or empty space)

**Menu Contents:**
```
┌─────────────────────────────┐
│ ☑ Keep Sidebar Expanded     │  ← Toggle (checkmark if pinned)
├─────────────────────────────┤
│ Customize Sidebar...        │  ← Future feature
└─────────────────────────────┘
```

**Menu Styling:**
```css
min-width: 220px;
background: var(--color-surface);
border: 1px solid var(--color-border);
border-radius: 8px;
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
padding: 4px;
```

**Item 1: Keep Sidebar Expanded**
- Toggle checkbox (☐ or ☑)
- Shows current pin state
- Click: Toggles pin (same as Cmd+Shift+S)

**Item 2: Customize Sidebar**
- Future feature placeholder
- Click: Shows "Coming soon" message or opens customization modal
- Planned: Reorder items, hide items, add custom shortcuts

---

## 5. Implementation Guidelines

### 5.1 Technology Stack

**HTML (Semantic Structure):**
```html
<aside class="sidebar" role="navigation" aria-label="Primary navigation">
    <!-- Top Zone -->
    <header class="sidebar-header">
        <button class="sidebar-header-text" aria-label="Switch project: Riverside Hotel">
            Riverside Hotel
        </button>
        <button class="sidebar-toggle" aria-label="Toggle sidebar (⌘⇧S)">
            <svg>...</svg>
        </button>
    </header>
    
    <div class="sidebar-command">
        <input type="text" placeholder="Type a command..." aria-label="Command palette">
    </div>
    
    <!-- Main Zone -->
    <nav class="sidebar-main" aria-label="Main navigation">
        <a href="/home" class="sidebar-item" aria-current="page">
            <svg class="sidebar-icon">...</svg>
            <span class="sidebar-label">Home</span>
        </a>
        <!-- More items -->
    </nav>
    
    <!-- Bottom Zone -->
    <nav class="sidebar-bottom" aria-label="System tools">
        <a href="/help" class="sidebar-item">
            <svg class="sidebar-icon">...</svg>
            <span class="sidebar-label">Help</span>
        </a>
        <!-- More items -->
    </nav>
    
    <div class="sidebar-pin" aria-label="Sidebar is pinned"></div>
</aside>

<div class="sidebar-hover-trigger" aria-hidden="true"></div>
```

**CSS (Design Tokens):**
```css
:root {
    /* Layout */
    --sidebar-width-collapsed: 64px;
    --sidebar-width-expanded: 280px;
    --sidebar-item-height: 48px;
    --sidebar-sub-item-height: 40px;
    --sidebar-icon-size: 20px;
    --sidebar-header-height: 40px;
    --sidebar-command-height: 44px;
    
    /* Spacing */
    --sidebar-padding-y: 16px;
    --sidebar-item-padding: 12px;
    --sidebar-item-gap: 2px;
    --sidebar-item-margin: 8px;
    --sidebar-sub-item-indent: 24px;
    --sidebar-group-spacing: 16px;
    
    /* Border */
    --sidebar-border-width: 1px;
    --sidebar-active-border-width: 4px;
    --sidebar-border-radius: 6px;
    
    /* Animation */
    --sidebar-expand-delay: 300ms;
    --sidebar-collapse-delay: 500ms;
    --sidebar-transition-duration: 250ms;
    --sidebar-transition-easing: cubic-bezier(0.4, 0.0, 0.2, 1);
    
    /* Colors */
    --color-surface: #ffffff;
    --color-bg-secondary: #f5f5f7;
    --color-border: #d2d2d7;
    --color-text-primary: #1d1d1f;
    --color-text-secondary: #86868b;
    --color-accent: #0071e3;
}

[data-theme="dark"] {
    --color-surface: #1c1c1e;
    --color-bg-secondary: #2c2c2e;
    --color-border: #38383a;
    --color-text-primary: #f5f5f7;
    --color-text-secondary: #98989d;
}
```

**JavaScript (State Management):**
```javascript
class SidebarManager {
    constructor() {
        this.state = {
            expanded: false,
            pinned: this.loadPinState(),
            activeItem: this.getActiveItem(),
            hoverTimer: null,
            collapseTimer: null,
            activeProject: this.loadActiveProject()
        };
        
        this.init();
    }
    
    init() {
        this.setupHoverTrigger();
        this.setupKeyboardShortcuts();
        this.setupContextMenu();
        this.setupProjectSwitcher();
        this.restoreState();
    }
    
    setupHoverTrigger() {
        const trigger = document.querySelector('.sidebar-hover-trigger');
        const sidebar = document.querySelector('.sidebar');
        
        trigger.addEventListener('mouseenter', () => {
            if (!this.state.pinned) {
                this.state.hoverTimer = setTimeout(() => {
                    this.expand();
                }, 300);
            }
        });
        
        trigger.addEventListener('mouseleave', () => {
            clearTimeout(this.state.hoverTimer);
        });
        
        sidebar.addEventListener('mouseleave', () => {
            if (!this.state.pinned) {
                this.state.collapseTimer = setTimeout(() => {
                    this.collapse();
                }, 500);
            }
        });
        
        sidebar.addEventListener('mouseenter', () => {
            clearTimeout(this.state.collapseTimer);
        });
    }
    
    expand() {
        this.state.expanded = true;
        document.querySelector('.sidebar').classList.add('expanded');
    }
    
    collapse() {
        this.state.expanded = false;
        document.querySelector('.sidebar').classList.remove('expanded');
    }
    
    togglePin() {
        this.state.pinned = !this.state.pinned;
        this.savePinState();
        
        if (this.state.pinned) {
            this.expand();
            document.querySelector('.sidebar-pin').style.display = 'block';
        } else {
            document.querySelector('.sidebar-pin').style.display = 'none';
        }
    }
    
    loadPinState() {
        const stored = localStorage.getItem('sidebar');
        return stored ? JSON.parse(stored).pinned : false;
    }
    
    savePinState() {
        localStorage.setItem('sidebar', JSON.stringify({
            pinned: this.state.pinned,
            lastWidth: 280,
            timestamp: new Date().toISOString()
        }));
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Cmd+Shift+S: Toggle pin
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 's') {
                e.preventDefault();
                this.togglePin();
            }
            
            // Cmd+K: Open Command Palette
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.openCommandPalette();
            }
            
            // Navigation shortcuts
            if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
                switch(e.key) {
                    case 'h': this.navigateTo('/home'); break;
                    case 'p': this.navigateTo('/projects'); break;
                    case 'v': this.navigateTo('/visualize'); break;
                    case 'a': this.navigateTo('/analyze'); break;
                    case 'o': this.navigateTo('/optimize'); break;
                    case 'c': this.navigateTo('/collaborate'); break;
                    case 'w': this.navigateTo('/actions'); break;
                    case 'k': this.openAskSage(); break;
                }
            }
        });
    }
}

// Initialize
const sidebar = new SidebarManager();
```

### 5.2 Accessibility Implementation

**ARIA Labels:**
```html
<aside role="navigation" aria-label="Primary navigation">
    <nav class="sidebar-main" aria-label="Main tools">
        <a href="/home" aria-current="page">Home</a>
        <a href="/visualize" aria-disabled="true">Visualize</a>
    </nav>
    
    <nav class="sidebar-bottom" aria-label="System settings">
        <a href="/help">Help</a>
        <a href="/settings">Settings</a>
    </nav>
</aside>
```

**Screen Reader Announcements:**
- Active project change: "Active project changed to Riverside Hotel"
- Pin state: "Sidebar pinned" / "Sidebar unpinned"
- Disabled items: "Visualize unavailable. Select a project to enable."
- Navigation: "Home, current page" / "Visualize"

**Keyboard Focus:**
- Visible focus indicator: 2px accent outline
- Tab order respects visual hierarchy
- Focus trap in Command Palette modal
- Focus returns to trigger after modal close

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
    .sidebar {
        transition: none !important;
    }
    .sidebar-item {
        transition: none !important;
    }
    .sidebar-label {
        transition: none !important;
    }
}
```

### 5.3 Responsive Behavior

**Desktop (1024px+):**
- Full hover-expand behavior (300ms/500ms)
- Pin state supported
- Context menu available
- All keyboard shortcuts enabled

**Tablet (768-1023px):**
- Sidebar hidden by default
- Hamburger menu in Header opens sidebar as overlay
- Always 280px when visible (no collapsed state)
- Semi-transparent backdrop (rgba(0, 0, 0, 0.3))
- Tap outside to dismiss
- No hover behavior (touch device)

**Mobile (<768px):**
- No sidebar chrome
- Bottom tab bar navigation (5 icons):
  1. Home
  2. Visualize
  3. Analyze
  4. Collaborate
  5. More (opens full menu modal)
- Current view highlighted in tab bar
- "More" modal shows all 10 items vertically
- Native iOS/Android navigation patterns

### 5.4 Performance Optimization

**Rendering:**
- Use CSS transforms for width changes (GPU-accelerated)
- Debounce hover events (300ms / 500ms)
- Lazy render sub-items (only when parent active)
- Virtual scrolling for long lists (if >20 items)

**State Management:**
- Single source of truth (SidebarManager)
- localStorage for persistence (< 1KB payload)
- No unnecessary re-renders
- Event delegation for click handlers

**Icon Loading:**
- Inline SVG for critical icons (faster than external)
- Icon sprite sheet (single HTTP request)
- Service worker caching

### 5.5 Testing Requirements

**Unit Tests:**
- Pin state persistence across sessions
- Hover timing (300ms expand, 500ms collapse)
- Keyboard shortcuts execute correct actions
- Sub-item expansion when parent active
- Disabled state when no project active

**Integration Tests:**
- Navigation flow (click item → page loads)
- Project switcher updates active project
- Command Palette opens and filters correctly
- Context menu toggles pin state
- Keyboard navigation through all items

**Visual Regression Tests:**
- Collapsed state (64px)
- Expanded state (280px)
- Hover states (all items)
- Active states (all items)
- Disabled states
- Dark theme
- Sub-items expanded
- Mobile responsive

**Accessibility Tests:**
- Keyboard navigation (Tab through all items)
- Screen reader announcements (test with VoiceOver, NVDA)
- Focus indicators visible (2px accent outline)
- Color contrast (4.5:1 text, 3:1 UI elements)
- Reduced motion respected

**Performance Tests:**
- Sidebar expansion: <16ms render time
- Hover trigger response: <300ms
- Pin state save: <10ms
- No memory leaks (24-hour session test)
- Command Palette open: <100ms

---

## Appendix

### A. Component Hierarchy

```
Sidebar
├── Top Zone (Fixed)
│   ├── Header
│   │   ├── Active Project Text (clickable)
│   │   └── Toggle Icon (LuPanelLeftOpen/Close)
│   ├── Divider
│   └── Command Palette Input
│       └── Search Icon
├── Main Zone (Scrollable)
│   ├── Core Group
│   │   ├── Home
│   │   ├── Projects
│   │   └── Ask Sage
│   ├── Spacing (16px)
│   ├── Analysis Group
│   │   ├── Visualize
│   │   ├── Analyze
│   │   └── Optimize
│   ├── Spacing (16px)
│   └── Action Group
│       ├── Collaborate
│       └── Actions (Expandable)
│           ├── Create (Modal trigger)
│           └── Manage (Page navigation)
├── Bottom Zone (Fixed)
│   ├── Divider
│   ├── Help
│   ├── Settings
│   └── Pin Indicator (conditional)
└── Hover Trigger (8px invisible zone)
```

### B. State Machine

```
Sidebar States:
    Collapsed (64px)
        ↓ [Mouse enters trigger + 300ms]
    Expanding
        ↓ [Transition completes]
    Expanded (280px)
        ↓ [Mouse leaves + 500ms OR Pin toggle]
    Collapsing (if not pinned)
        ↓ [Transition completes]
    Collapsed (64px)

Pin States (parallel):
    Unpinned
        ↓ [Toggle: Cmd+Shift+S, Click icon, Context menu, Settings]
    Pinned (stays expanded)
        ↓ [Toggle]
    Unpinned (can auto-collapse)
```

### C. LocalStorage Schema

```json
{
    "sidebar": {
        "pinned": true,
        "lastWidth": 280,
        "timestamp": "2025-11-13T14:47:23Z"
    },
    "activeProject": {
        "id": "proj_123abc",
        "name": "Riverside Hotel",
        "status": "live"
    },
    "recentCommands": [
        "Create new dashboard",
        "Go to Visualize",
        "Add sensor"
    ]
}
```

### D. Icon Reference

| Item | Lucide Icon | Size | Color (Default) |
|------|-------------|------|-----------------|
| Toggle (collapsed) | `LuPanelLeftOpen` | 20px | Secondary |
| Toggle (expanded) | `LuPanelLeftClose` | 20px | Secondary |
| Command Palette | `LuSearch` | 18px | Secondary |
| Home | `LuHouse` | 20px | Secondary |
| Projects | `LuBuilding2` | 20px | Secondary |
| Ask Sage | `LuSparkles` | 20px | Secondary |
| Visualize | `LuBox` | 20px | Secondary |
| Analyze | `LuChartScatter` | 20px | Secondary |
| Optimize | `LuSparkle` | 20px | Secondary |
| Collaborate | `LuMessagesSquare` | 20px | Secondary |
| Actions | `LuWorkflow` | 20px | Secondary |
| Help | `LuHelpCircle` | 20px | Secondary |
| Settings | `LuSettings` | 20px | Secondary |
| Pin Indicator | `LuPin` | 8px | Secondary (0.3 opacity) |

### E. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 13, 2025 | Initial specification with two-zone architecture |
| 2.0 | Nov 13, 2025 | Final specification: Active project header, three-zone structure, Ask Sage in Main, Actions expandable with Create/Manage |

---

**End of Document**

*This specification is a living document and will be updated as the Tagwaye platform evolves. For questions or clarifications, contact the Design & Engineering team.*
