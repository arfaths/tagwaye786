# Tagwaye Universal Canvas Design Specifications

**Version:** 1.0  
**Date:** November 13, 2025  
**Status:** Final Specification  
**Authors:** Design & Engineering Team

---

## Table of Contents

1. [Overview & Design Foundation](#1-overview--design-foundation)
2. [Architecture & Container System](#2-architecture--container-system)
3. [View Modes & Dual View](#3-view-modes--dual-view)
4. [States & Transitions](#4-states--transitions)
5. [Integration & Implementation](#5-integration--implementation)

---

## 1. Overview & Design Foundation

### 1.1 Purpose

The Universal Canvas is Tagwaye's primary content rendering container. It is not a feature-rich component but a stage—a mounting point where specialized content performs. Like the iOS home screen displays apps without being the apps themselves, Universal Canvas provides a consistent, predictable space for displaying dashboards, forms, tables, reports, and any content that doesn't require dedicated 3D rendering resources.

Universal Canvas handles 95% of platform content. Only Scene Canvas (3D digital twin viewer) exists as a separate specialized renderer due to its heavy WebGL and Three.js requirements.

### 1.2 Design Principles Applied

**Clarity: Pure Content Focus**
- No toolbars, palettes, or configuration UI in canvas
- All tools live in Panel (right zone)
- Content is the interface
- Selection states are clear and immediate
- Loading states never obscure context

**Deference: Canvas Disappears**
- Container provides no visual chrome
- Content fills available space naturally
- Background adapts to content needs (white for forms, subtle gray for dashboards)
- No borders or frames competing with content
- Users see their work, not the canvas

**Depth: Contextual Layering**
- Single View (default) — One piece of content, full attention
- Dual View (advanced) — Two pieces of content, synchronized or independent
- Modals layer above for focused tasks
- Panel slides in from right for tools
- Timeline slides in from bottom for temporal navigation

**Continuity: Seamless Transitions**
- Content changes feel instant (<100ms perceived)
- Scroll position remembered per route
- Form state auto-saved every 30 seconds
- No jarring unmount/remount between similar content types
- Smooth canvas switching (Scene Canvas ↔ Universal Canvas)

**Intelligence: Context-Aware Rendering**
- Detects content type, optimizes rendering
- Virtual scrolling for large datasets (1000+ rows)
- Lazy loads heavy components (charts render on viewport entry)
- Prefetches likely next content (user viewing Dashboard 1, prefetch Dashboard 2)
- Adapts layout to content dimensions (form centers, dashboard fills, table flows)

### 1.3 Core Architecture Philosophy

**Universal Canvas = Mounting Point + Lifecycle Manager**

Universal Canvas provides:
1. **Consistent dimensions** — Fills space between Sidebar (left), Panel (right, optional), Header (top), Footer (bottom)
2. **Predictable coordinates** — Content always knows its available width/height
3. **Mounting lifecycle** — beforeMount → onMount → onActive → onInactive → beforeUnmount → onUnmount
4. **Error boundaries** — Catches crashes, shows recovery UI, doesn't bring down entire app
5. **Loading orchestration** — Skeleton states while content fetches
6. **State preservation** — Scroll, filters, selections persist during navigation

Universal Canvas does NOT provide:
- Feature-specific UI (charts, 3D controls, node editors)
- Configuration interfaces (those live in Panel)
- Data fetching logic (content components own their data)
- Business logic (content components own their behavior)

### 1.4 Content Types Rendered

**Standard Pages** (Forms, Tables, Lists)
- Project management, settings, help documentation
- User profiles, team management
- Data source configuration
- Sensor management
- Work order lists
- Report libraries

**Dashboards** (Viewing Mode)
- Grid layout with widgets (KPIs, charts, tables)
- Interactive filters, drill-down
- Real-time data updates
- Export controls

**Dashboards** (Building Mode)
- Live preview of dashboard as user edits
- Selection handles on widgets
- Grid snap indicators
- All editing tools in Panel (not in canvas)

**Workflows** (Viewing Mode)
- Node graph display (read-only)
- Execution history, logs
- Status indicators

**Workflows** (Building Mode)
- Interactive node canvas
- Drag nodes to position
- Draw connections
- All node configuration in Panel

**Reports** (Generated Output)
- Formatted documents
- Charts, tables, text blocks
- Export actions (PDF, Excel)

**Data Pipelines**
- Visual flow diagram (source → transform → destination)
- Status indicators, logs
- Configuration in Panel

### 1.5 Constraints & Requirements

**Performance:**
- Initial render: <100ms (skeleton → content)
- Scroll performance: 60fps on desktop, 30fps on mobile
- Content switch: <200ms (perceived instant)
- Memory: <300MB for Universal Canvas core (excluding content)
- Large tables: Virtual scrolling mandatory (>100 rows)
- Bundle size: ~1.2MB gzipped (includes dashboard builder, workflow editor libraries)

**Accessibility:**
- WCAG 2.1 Level AA compliance
- Keyboard navigation (Tab, Arrow keys, shortcuts)
- Screen reader support (ARIA landmarks, live regions)
- Focus management (enters canvas, cycles through content, exits)
- Reduced motion (respects prefers-reduced-motion)
- High contrast mode support

**Browser Support:**
- Chrome/Edge (Chromium) — latest 2 versions
- Safari (macOS/iOS) — latest 2 versions  
- Firefox — latest 2 versions

**Device Support:**
- Desktop (1024px+): Full functionality, Dual View supported
- Tablet (768-1023px): Full functionality, Dual View disabled
- Mobile (<768px): View-only for most content, building on desktop only

---

## 2. Architecture & Container System

### 2.1 Positioning & Dimensions

**Fixed Positioning Relative to Viewport:**
```css
.universal-canvas {
    position: fixed;
    top: 56px;        /* Below Header */
    bottom: 40px;     /* Above Footer (when visible) */
    left: 64px;       /* Right of Sidebar (collapsed) or 280px (expanded) */
    right: 0;         /* Or: right: 360px if Panel open */
    z-index: 100;     /* Below modals (1000), above background */
}
```

**Dynamic Width Calculation:**
```
Available Width = Viewport Width - Sidebar Width - Panel Width

Examples:
- Sidebar collapsed (64px), no Panel:
  Width = 100vw - 64px = ~1856px (on 1920px display)

- Sidebar expanded (280px), Panel open (360px):
  Width = 100vw - 280px - 360px = ~1280px (on 1920px display)

- Sidebar collapsed (64px), Panel open (360px):
  Width = 100vw - 64px - 360px = ~1496px (on 1920px display)
```

**Dynamic Height Calculation:**
```
Available Height = Viewport Height - Header - Footer - Timeline (if visible)

Examples:
- No Timeline:
  Height = 100vh - 56px - 40px = ~904px (on 1000px viewport)

- Timeline visible (120px):
  Height = 100vh - 56px - 40px - 120px = ~784px (on 1000px viewport)
```

### 2.2 Container Structure

**HTML Semantic Structure:**
```html
<main class="universal-canvas" role="main" aria-label="Main content">
    <!-- Content mounting point -->
    <div class="canvas-content">
        {/* React content renders here */}
    </div>
    
    <!-- Canvas-level overlays (optional) -->
    <div class="canvas-overlay" aria-live="polite">
        {/* Toasts, transient notifications */}
    </div>
</main>
```

**CSS Foundation:**
```css
.universal-canvas {
    position: fixed;
    top: var(--header-height);
    bottom: var(--footer-height);
    left: var(--sidebar-width);
    right: var(--panel-width, 0);
    background: var(--color-canvas-bg);
    overflow: hidden; /* Content manages own scroll */
}

.canvas-content {
    width: 100%;
    height: 100%;
    overflow: auto; /* Scrollable if content exceeds */
    position: relative;
}
```

**Background Color:**
```css
/* Default: White (for forms, tables) */
--color-canvas-bg: #ffffff;

/* Dark theme */
[data-theme="dark"] {
    --color-canvas-bg: #000000;
}

/* Content can override */
.canvas-content[data-bg="subtle"] {
    background: #f5f5f7; /* Subtle gray for dashboards */
}

.canvas-content[data-bg="dark"] {
    background: #1c1c1e; /* Dark for Scene Canvas preview */
}
```

### 2.3 Content Mounting Architecture

**Routing Integration:**
```typescript
const UniversalCanvas: React.FC = () => {
    const location = useLocation();
    const contentType = getContentType(location.pathname);
    
    // Special case: 3D viewer uses Scene Canvas (not Universal Canvas)
    if (location.pathname === '/visualize') {
        return null; // Scene Canvas mounts separately
    }
    
    return (
        <main className="universal-canvas">
            <ErrorBoundary fallback={<ErrorState />}>
                <Suspense fallback={<LoadingState type={contentType} />}>
                    <ContentRouter />
                </Suspense>
            </ErrorBoundary>
        </main>
    );
};
```

**Content Router:**
```typescript
const ContentRouter = () => {
    const location = useLocation();
    
    return (
        <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/dashboard/:id" element={<DashboardView />} />
            <Route path="/dashboard/create" element={<DashboardBuilder />} />
            <Route path="/workflow/:id" element={<WorkflowView />} />
            <Route path="/workflow/create" element={<WorkflowBuilder />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/projects" element={<ProjectsList />} />
            {/* ... more routes */}
        </Routes>
    );
};
```

**Content components mount inside Universal Canvas container. They receive:**
- Available dimensions (width, height)
- Canvas utilities (toast, modal triggers)
- Scroll restoration hooks
- State persistence helpers

### 2.4 Lifecycle Management

**Content Lifecycle Events:**

**1. beforeMount**
- Canvas prepares to render content
- Shows loading skeleton (type-specific)
- Prefetches data if possible

**2. onMount**
- Content component renders
- Initializes libraries (charts, editors)
- Fetches initial data
- Registers keyboard shortcuts

**3. onActive**
- Content receives focus (user interacting)
- Starts real-time updates (if applicable)
- Resumes animations

**4. onInactive**
- Content loses focus (user navigated away, but content still mounted)
- Pauses real-time updates
- Pauses animations
- Saves current state

**5. beforeUnmount**
- Content about to be removed
- Auto-saves form state (if unsaved changes)
- Cancels in-flight API requests
- Clears timers

**6. onUnmount**
- Content removed from DOM
- Disposes heavy resources (chart instances, editor state)
- Clears event listeners
- Garbage collection eligible

**Universal Canvas provides lifecycle hooks:**
```typescript
const DashboardView = () => {
    const { isActive } = useCanvasLifecycle();
    
    useEffect(() => {
        if (isActive) {
            // Start real-time data polling
            const interval = startPolling();
            return () => clearInterval(interval);
        }
    }, [isActive]);
    
    return <Dashboard />;
};
```

### 2.5 Scroll Management

**Scroll Restoration:**
- Canvas remembers scroll position per route
- User navigates Dashboard → Settings → back to Dashboard
- Scroll position restored to exact pixel

**Implementation:**
```typescript
const useScrollRestoration = () => {
    const location = useLocation();
    const scrollCache = useRef<Map<string, number>>(new Map());
    
    useEffect(() => {
        const key = location.pathname;
        const cachedScroll = scrollCache.current.get(key);
        
        if (cachedScroll !== undefined) {
            // Restore scroll after content renders
            requestAnimationFrame(() => {
                document.querySelector('.canvas-content')?.scrollTo(0, cachedScroll);
            });
        }
        
        // Save scroll on navigation away
        return () => {
            const currentScroll = document.querySelector('.canvas-content')?.scrollTop || 0;
            scrollCache.current.set(key, currentScroll);
        };
    }, [location.pathname]);
};
```

**Scroll Behavior:**
- Smooth scrolling on navigation (CSS: scroll-behavior: smooth)
- Instant scrolling on programmatic jumps (scrollTo with behavior: 'auto')
- Scroll shadows when content overflows (subtle gradient at top/bottom edges)

### 2.6 Responsive Container Behavior

**Desktop (1024px+):**
- Full dynamic sizing (responds to Sidebar/Panel changes)
- Supports Dual View (vertical split)
- Content determines max-width constraints internally

**Tablet (768-1023px):**
- Full-width (Sidebar hidden or overlay)
- Single View only (Dual View disabled)
- Content adapts to narrower width (8-column grid vs 12-column)

**Mobile (<768px):**
- Full-screen (all chrome hidden except Header)
- Vertical scroll optimized
- Touch-friendly controls (44px minimum touch targets)
- Simplified layouts (single column)

---

## 3. View Modes & Dual View

### 3.1 Single View (Default)

**Behavior:**
- One piece of content fills entire canvas
- Standard navigation (click link, load new content)
- Simple, focused workflow

**Layout:**
```
┌────────────────────────────────────┐
│                                    │
│                                    │
│          Single Content            │
│          (Dashboard, Form,         │
│           Table, etc.)             │
│                                    │
│                                    │
└────────────────────────────────────┘
```

### 3.2 Dual View (Advanced)

**Purpose:**
- Compare two pieces of content side-by-side
- Monitor live data while building dashboard
- Reference one view while working in another

**Trigger:**
- User clicks "Dual View" toggle in Footer
- Keyboard: `Cmd+D` (toggle Dual View on/off)

**Layout:**
```
┌──────────────────────┬─────────────────────┐
│                      │                     │
│   Primary Content    │  Secondary Content  │
│   (Left Side)        │  (Right Side)       │
│                      │                     │
│                      ││                    │  ← Resizable divider
│                      │                     │
│                      │                     │
└──────────────────────┴─────────────────────┘
```

**Divider:**
- Width: 4px
- Color: `var(--color-border)` (subtle)
- Cursor: `col-resize` on hover
- Draggable: Yes
- Range: 40% - 60% (each side minimum 40%, maximum 60%)
- Double-click: Reset to 50/50

**Split Ratio:**
- Default: 50% / 50% (equal)
- User adjusts via drag
- Saved to localStorage per user
- Persists across sessions

### 3.3 Dual View Content Selection

**When user enables Dual View:**

**Step 1: Current content moves to Primary (left)**
- User viewing Dashboard A → Dashboard A becomes Primary

**Step 2: User prompted to select Secondary (right)**
- Dropdown appears: "What would you like to compare?"
- Options:
  - Recent views (last 5)
  - Dashboards (list)
  - Same dashboard (different time range)
  - Blank (start fresh)

**Step 3: Secondary content loads**

**Smart Default:**
- If viewing Dashboard: Secondary shows same dashboard, different time range
- If building Dashboard: Secondary shows last viewed dashboard (reference)
- If in workflow: Secondary shows workflow list
- Fallback: User's last Dual View configuration

**Independent Navigation:**
- Each side has own navigation state
- User can navigate Primary without affecting Secondary
- Breadcrumbs show which side is "active" (has focus)

**Synchronized Scroll (Optional):**
- Toggle in Footer: "Link Views"
- When enabled: Scrolling one side scrolls the other proportionally
- Useful for comparing dashboards with similar structure
- Default: Off (independent)

### 3.4 Dual View Interaction Model

**Focus Management:**
- Click content → That side becomes "active" (focus ring on divider nearest that side)
- Keyboard: `Cmd+1` (focus Primary), `Cmd+2` (focus Secondary)
- Active side receives keyboard input
- Inactive side dims slightly (opacity: 0.9)

**Content Constraints:**
- Cannot have two builders open (e.g., Dashboard Builder + Workflow Editor)
- Cannot have Scene Canvas in Dual View (3D viewer is full-width only)
- Can have: Viewer + Viewer, Viewer + Builder, Builder + Viewer

**Valid Combinations:**
```
✅ Dashboard View + Dashboard View (compare)
✅ Dashboard View + Dashboard Builder (reference while building)
✅ Table + Form (edit item while seeing list)
✅ Report + Dashboard (see metrics while reading report)
✅ Workflow View + Workflow View (compare two workflows)

❌ Dashboard Builder + Workflow Editor (too complex)
❌ Scene Canvas + Anything (3D viewer is exclusive)
❌ Three content views (max 2)
```

### 3.5 Dual View on Smaller Screens

**Tablet (768-1023px):**
- Dual View disabled (toggle hidden in Footer)
- If user had Dual View on desktop, switches to Single View on tablet
- Primary content shown, Secondary content accessible via navigation

**Mobile (<768px):**
- Dual View disabled
- Always Single View

---

## 4. States & Transitions

### 4.1 Loading States

**Content Loading:**
Universal Canvas shows skeleton while content fetches data.

**Type-Specific Skeletons:**

**Dashboard Skeleton:**
```
┌────────────────────────────────────┐
│  [████]  [██████████]  [████]     │  ← KPI card placeholders
│                                    │
│  ┌──────────────────────────────┐ │
│  │                              │ │
│  │   [Chart skeleton with       │ │  ← Chart placeholder (pulse)
│  │    pulsing animation]        │ │
│  │                              │ │
│  └──────────────────────────────┘ │
│                                    │
│  [████████████████████████]       │  ← Table skeleton
│  [████████████████████████]       │
└────────────────────────────────────┘
```

**Form Skeleton:**
```
┌────────────────────────────────────┐
│  [████████]                        │  ← Input field placeholders
│  [██████████████]                  │
│  [████████]                        │
│  [██████████████]                  │
│                                    │
│  [Button]  [Button]                │
└────────────────────────────────────┘
```

**Table Skeleton:**
```
┌────────────────────────────────────┐
│  [████] [████] [████] [████]       │  ← Header row
│  ─────────────────────────────     │
│  [████] [████] [████] [████]       │  ← Data rows (pulse)
│  [████] [████] [████] [████]       │
│  [████] [████] [████] [████]       │
└────────────────────────────────────┘
```

**Animation:**
- Pulse effect (opacity 0.4 → 0.8 → 0.4, 1.5s loop)
- Shimmer effect for premium feel (optional)
- Never static (always indicates loading)

**Duration:**
- Show skeleton immediately (<16ms)
- Remove skeleton when content ready
- Minimum display: 300ms (prevents flicker on fast loads)

### 4.2 Error States

**Error Boundary Catches:**
- Content component crashes
- API errors (500, 503)
- Network failures
- JavaScript exceptions

**Error UI:**
```
┌────────────────────────────────────┐
│                                    │
│         ⚠️                         │
│                                    │
│    Something went wrong            │
│                                    │
│    We couldn't load this content.  │
│    This has been reported.         │
│                                    │
│    [Reload]  [Go Home]             │
│                                    │
└────────────────────────────────────┘
```

**Error Details (Developer Mode):**
- Console logs full error
- Sentry/monitoring service notified
- User sees friendly message only
- "Reload" button re-attempts render
- "Go Home" navigates to safe state

**Partial Errors:**
- Dashboard loads, one chart fails → Show error in that chart widget only
- Table loads, data fetch fails → Show "Retry" button in table
- Never block entire canvas for partial failures

### 4.3 Empty States

**No Active Project:**
```
┌────────────────────────────────────┐
│                                    │
│         🏢                         │
│                                    │
│    No Project Selected             │
│                                    │
│    Select a project to start       │
│    working                         │
│                                    │
│    [Select Project]                │
│                                    │
└────────────────────────────────────┘
```

**No Data Available:**
```
┌────────────────────────────────────┐
│                                    │
│         📊                         │
│                                    │
│    No Data Yet                     │
│                                    │
│    Connect a data source to        │
│    see your analytics              │
│                                    │
│    [Connect Data Source]           │
│                                    │
└────────────────────────────────────┘
```

**No Results (Search/Filter):**
```
┌────────────────────────────────────┐
│                                    │
│         🔍                         │
│                                    │
│    No Results Found                │
│                                    │
│    Try adjusting your filters      │
│    or search terms                 │
│                                    │
│    [Clear Filters]                 │
│                                    │
└────────────────────────────────────┘
```

**No Access (Permissions):**
```
┌────────────────────────────────────┐
│                                    │
│         🔒                         │
│                                    │
│    Access Required                 │
│                                    │
│    You don't have permission       │
│    to view this content            │
│                                    │
│    [Request Access]                │
│                                    │
└────────────────────────────────────┘
```

**Empty State Components:**
```typescript
<EmptyState
    icon="🏢"
    title="No Project Selected"
    description="Select a project to start working"
    action={<Button onClick={openProjectPicker}>Select Project</Button>}
/>
```

### 4.4 Content Transitions

**Same-Type Transitions (Fast):**
- Dashboard A → Dashboard B: Instant swap (<50ms)
- Form A → Form B: Instant swap
- Scroll position resets

**Different-Type Transitions (Skeleton):**
- Dashboard → Table: Show table skeleton (300ms)
- Table → Form: Show form skeleton (300ms)
- Any → Dashboard: Show dashboard skeleton (300ms)

**Scene Canvas Transition (Special):**
- Universal Canvas → Scene Canvas:
  - Universal Canvas fades out (250ms)
  - Scene Canvas fades in (250ms)
  - Total: 500ms smooth transition
  
- Scene Canvas → Universal Canvas:
  - Scene Canvas fades out (250ms)
  - Universal Canvas fades in (250ms)
  - Total: 500ms

**No Transition (Instant):**
- Single View → Dual View: Instant (just adds second content pane)
- Dual View → Single View: Instant (removes second pane, primary expands)

### 4.5 Modal Overlays

**Canvas-Level Modals:**
- Confirmation dialogs ("Delete this dashboard?")
- Quick actions ("Share dashboard")
- Pickers (date range, team member)

**Modal Positioning:**
```css
.canvas-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    background: var(--color-surface);
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.canvas-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);
    z-index: 999;
}
```

**Modal Behavior:**
- Traps focus (Tab cycles through modal elements only)
- Escape to close
- Click backdrop to close (optional, depends on modal type)
- Disables scroll on canvas content while open

### 4.6 Toast Notifications

**Transient Feedback:**
- "Dashboard saved" (success)
- "Network error, retrying..." (warning)
- "Changes auto-saved" (info)

**Toast Positioning:**
```css
.canvas-toast-container {
    position: fixed;
    bottom: 60px; /* Above Footer */
    right: 20px;
    z-index: 1100;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
```

**Toast Styling:**
- Width: 360px
- Height: Auto (min 48px)
- Border-radius: 8px
- Box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
- Auto-dismiss: 4 seconds (success), 6 seconds (error), indefinite (action required)

**Toast Types:**
```typescript
showToast({
    type: 'success',
    message: 'Dashboard saved successfully',
    duration: 4000
});

showToast({
    type: 'error',
    message: 'Failed to save dashboard',
    action: { label: 'Retry', onClick: retrySave }
});
```

---

## 5. Integration & Implementation

### 5.1 Panel Integration

**Canvas + Panel Layout:**
```
┌──────────────────────────┬─────────────┐
│                          │             │
│   Universal Canvas       │   Panel     │
│   (Content)              │   (Tools)   │
│                          │             │
└──────────────────────────┴─────────────┘
```

**When Panel Opens:**
- Canvas width reduces (transition: 250ms)
- Content reflows to fit narrower space
- No content re-render (just CSS width change)

**When Panel Closes:**
- Canvas width expands (transition: 250ms)
- Content reflows to fill space

**Panel Resize:**
- User drags Panel divider
- Canvas width updates in real-time (no transition, follows mouse)
- Content reflows smoothly (CSS flex/grid handles automatically)

**Communication:**
```typescript
// Panel tells Canvas: "User selected widget in builder"
Panel.emit('widget-selected', { widgetId: '123' });

// Canvas listens, highlights widget
Canvas.on('widget-selected', (data) => {
    highlightWidget(data.widgetId);
});

// Canvas tells Panel: "User clicked widget in preview"
Canvas.emit('widget-clicked', { widgetId: '123' });

// Panel listens, opens properties drawer
Panel.on('widget-clicked', (data) => {
    openPropertiesDrawer(data.widgetId);
});
```

### 5.2 Scene Canvas Integration

**Exclusive Rendering:**
- When user navigates to `/visualize`, Universal Canvas unmounts
- Scene Canvas mounts in same space
- Header, Footer, Sidebar remain visible
- Panel shows Asset Manager (Browse, Monitor, Analyze)

**Transition:**
```typescript
const MainContent = () => {
    const location = useLocation();
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    if (location.pathname === '/visualize') {
        return (
            <>
                {isTransitioning && <TransitionOverlay />}
                <SceneCanvas />
            </>
        );
    }
    
    return (
        <>
            {isTransitioning && <TransitionOverlay />}
            <UniversalCanvas />
        </>
    );
};
```

**No Dual View with Scene Canvas:**
- Scene Canvas always full-width (no split)
- 3D viewport needs maximum space
- If user was in Dual View, switches to Single View on Scene Canvas entry

### 5.3 Timeline Integration

**When Timeline Visible:**
```
┌────────────────────────────────────┐
│                                    │
│   Universal Canvas                 │
│   (Height reduced)                 │
│                                    │
├────────────────────────────────────┤
│   Timeline (120px)                 │
└────────────────────────────────────┘
```

**Canvas Height Adjustment:**
- Timeline slides up from bottom (250ms)
- Canvas height reduces by 120px (transition: 250ms)
- Content reflows (scrollable if needed)

**Timeline Collapse:**
- User clicks Timeline minimize button
- Timeline slides down (250ms)
- Canvas height expands (transition: 250ms)

**Timeline Interaction:**
- User scrubs timeline → Canvas content updates
- Dashboard shows historical data at selected time
- Workflow shows execution state at selected time
- Form/Table: Timeline hidden (not applicable)

### 5.4 Keyboard Shortcuts

**Canvas-Level Shortcuts:**
- `Cmd+S` — Save (if content is editable)
- `Cmd+D` — Toggle Dual View
- `Cmd+\` — Toggle Panel visibility
- `Cmd+Shift+\` — Toggle Timeline visibility
- `Cmd+1` / `Cmd+2` — Focus Primary/Secondary (in Dual View)
- `Escape` — Close modal, clear selection, exit mode

**Content-Specific Shortcuts:**
- Dashboard Builder: `Cmd+Z` (undo), `Cmd+Shift+Z` (redo)
- Workflow Editor: Arrow keys (move nodes), `Delete` (remove node)
- Table: `Cmd+F` (search), `Cmd+A` (select all)

**Shortcut Registration:**
```typescript
const DashboardBuilder = () => {
    useCanvasShortcut('cmd+s', handleSave);
    useCanvasShortcut('cmd+z', handleUndo);
    useCanvasShortcut('cmd+shift+z', handleRedo);
    
    return <BuilderCanvas />;
};
```

**Shortcut Conflicts:**
- Content shortcuts override global shortcuts
- Canvas provides conflict resolution
- User sees shortcut hint on hover

### 5.5 Performance Optimization

**Virtual Scrolling:**
- Tables with >100 rows use `react-window`
- Only renders visible rows + buffer (10 rows above/below viewport)
- Smooth scroll performance on 10,000+ row tables

**Lazy Loading:**
- Charts render when entering viewport (Intersection Observer)
- Heavy components code-split (`React.lazy`)
- Images lazy load with blur-up placeholder

**Memoization:**
```typescript
const DashboardView = () => {
    const dashboard = useDashboard(id);
    
    // Memoize expensive computations
    const widgets = useMemo(() => 
        dashboard.widgets.map(processWidget),
        [dashboard.widgets]
    );
    
    return <Dashboard widgets={widgets} />;
};
```

**Debouncing:**
- Resize events debounced 100ms
- Filter input debounced 300ms
- Auto-save debounced 30 seconds

**Code Splitting:**
```typescript
// Dashboard builder loads on demand
const DashboardBuilder = lazy(() => import('./DashboardBuilder'));

// Workflow editor loads on demand
const WorkflowEditor = lazy(() => import('./WorkflowEditor'));

// Scene Canvas loads on demand
const SceneCanvas = lazy(() => import('./SceneCanvas'));
```

### 5.6 State Management

**Canvas State (Global):**
- Active view mode (Single/Dual)
- Panel visibility and width
- Timeline visibility and height
- Scroll positions per route

**Content State (Per Component):**
- Form values
- Filter selections
- Sort order
- Expanded/collapsed sections

**Persistence:**
```typescript
// Auto-save form state
useEffect(() => {
    const timer = setInterval(() => {
        localStorage.setItem(`form-${id}`, JSON.stringify(formValues));
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(timer);
}, [formValues]);

// Restore on mount
useEffect(() => {
    const saved = localStorage.getItem(`form-${id}`);
    if (saved) {
        setFormValues(JSON.parse(saved));
    }
}, []);
```

### 5.7 Accessibility Implementation

**Focus Management:**
```typescript
const UniversalCanvas = () => {
    const canvasRef = useRef<HTMLElement>(null);
    
    useEffect(() => {
        // Focus canvas on mount
        canvasRef.current?.focus();
    }, []);
    
    return (
        <main ref={canvasRef} tabIndex={-1}>
            {/* Content */}
        </main>
    );
};
```

**ARIA Landmarks:**
```html
<main class="universal-canvas" role="main" aria-label="Main content">
    <div role="region" aria-label="Primary content">
        {/* Primary content */}
    </div>
    
    {dualViewEnabled && (
        <div role="region" aria-label="Secondary content">
            {/* Secondary content */}
        </div>
    )}
</main>
```

**Screen Reader Announcements:**
```typescript
// Content loaded
announceToScreenReader('Dashboard loaded');

// Error occurred
announceToScreenReader('Error loading content. Reload button available.', 'assertive');

// State change
announceToScreenReader('Dual View enabled');
```

**Keyboard Navigation:**
- Tab enters canvas, cycles through interactive elements
- Shift+Tab exits canvas (returns to Sidebar/Header)
- Arrow keys navigate within content (if applicable)
- Escape exits focused element

### 5.8 Responsive Implementation

**Desktop CSS:**
```css
@media (min-width: 1024px) {
    .universal-canvas {
        left: var(--sidebar-width);
        right: var(--panel-width, 0);
    }
}
```

**Tablet CSS:**
```css
@media (min-width: 768px) and (max-width: 1023px) {
    .universal-canvas {
        left: 0; /* Sidebar hidden or overlay */
        right: 0; /* No Panel */
    }
    
    .dual-view {
        display: none; /* Dual View disabled */
    }
}
```

**Mobile CSS:**
```css
@media (max-width: 767px) {
    .universal-canvas {
        top: 56px; /* Header only */
        bottom: 0; /* Footer hidden */
        left: 0;
        right: 0;
    }
    
    .canvas-content {
        padding: 16px; /* Tighter padding */
    }
}
```

---

## Appendix

### A. Component Hierarchy

```
UniversalCanvas
├── ErrorBoundary
│   └── Suspense (Loading fallback)
│       └── ContentRouter
│           ├── HomePage
│           ├── DashboardView
│           │   └── DashboardGrid
│           │       ├── KPIWidget
│           │       ├── ChartWidget
│           │       └── TableWidget
│           ├── DashboardBuilder
│           │   └── BuilderCanvas (live preview)
│           ├── WorkflowView
│           ├── WorkflowEditor
│           ├── SettingsPage
│           └── ... (other content)
├── CanvasOverlay (toasts, transient notifications)
└── ModalContainer (canvas-level modals)
```

### B. State Machine

```
Universal Canvas States:

Idle
    ↓ [User navigates]
Loading
    ↓ [Content fetched]
Ready (Content displayed)
    ↓ [User enables Dual View]
Dual View Mode
    ↓ [User disables Dual View]
Ready
    ↓ [User navigates away]
Transitioning
    ↓ [New content ready]
Ready

Error States (parallel):
    Content Error → Show error UI
    Network Error → Show retry UI
    Permission Error → Show access request UI
```

### C. Performance Budgets

| Metric | Target | Critical |
|--------|--------|----------|
| Initial render | <100ms | <200ms |
| Content switch | <200ms | <500ms |
| Scroll FPS (desktop) | 60fps | 30fps |
| Scroll FPS (mobile) | 30fps | 15fps |
| Bundle size (gzipped) | <1.2MB | <2MB |
| Memory usage | <300MB | <500MB |
| Time to Interactive | <1.5s | <3s |

### D. Browser Compatibility

| Feature | Chrome/Edge | Safari | Firefox |
|---------|-------------|--------|---------|
| CSS Grid | ✅ 57+ | ✅ 10.1+ | ✅ 52+ |
| Flexbox | ✅ 29+ | ✅ 9+ | ✅ 28+ |
| Intersection Observer | ✅ 51+ | ✅ 12.1+ | ✅ 55+ |
| ResizeObserver | ✅ 64+ | ✅ 13.1+ | ✅ 69+ |
| CSS backdrop-filter | ✅ 76+ | ✅ 9+ | ✅ 103+ |
| Lazy loading (native) | ✅ 77+ | ✅ 15.4+ | ✅ 75+ |

### E. Design Tokens Reference

```css
/* Canvas Colors */
--color-canvas-bg: #ffffff;
--color-canvas-bg-subtle: #f5f5f7;
--color-canvas-bg-dark: #1c1c1e;

/* Canvas Spacing */
--canvas-padding-desktop: 24px;
--canvas-padding-tablet: 16px;
--canvas-padding-mobile: 16px;

/* Canvas Transitions */
--canvas-transition-fast: 150ms cubic-bezier(0.4, 0.0, 0.2, 1);
--canvas-transition-standard: 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
--canvas-transition-slow: 400ms cubic-bezier(0.4, 0.0, 0.2, 1);

/* Canvas Z-Index */
--z-canvas: 100;
--z-canvas-modal-backdrop: 999;
--z-canvas-modal: 1000;
--z-canvas-toast: 1100;
```

---

**End of Document**

*This specification defines the Universal Canvas container system. Individual content types (Dashboard, Workflow, Scene Canvas) will be specified in separate documents with equal rigor.*
