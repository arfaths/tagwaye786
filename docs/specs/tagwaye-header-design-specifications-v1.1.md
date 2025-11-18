# Tagwaye Header Design Specifications

**Version:** 1.0  
**Date:** November 13, 2025  
**Status:** Final Specification  
**Authors:** Design & Engineering Team

---

## Table of Contents

1. [Overview & Design Foundation](#1-overview--design-foundation)
2. [Structure & Layout](#2-structure--layout)
3. [Component Specifications](#3-component-specifications)
4. [Interaction & States](#4-interaction--states)
5. [Implementation Guidelines](#5-implementation-guidelines)

---

## 1. Overview & Design Foundation

### 1.1 Purpose

The Tagwaye Header serves as the primary navigation and control zone for the entire platform. It provides persistent access to global functions: search, project switching, notifications, and user account management. The header must remain visible, accessible, and performant across all platform contexts—from Scene Canvas 3D visualization to dashboard analytics to workflow design.

### 1.2 Design Principles Applied

The header embodies all five Tagwaye design principles:

**Clarity: Contextual Confidence**
- Active project always visible with live status indicator
- Current user identity and role clearly displayed
- Search scope explicitly defined in placeholder
- Notification badge shows exact count, never ambiguous

**Deference: Content Over Chrome**
- Translucent background (80% opacity with backdrop blur) allows content beneath to remain visible
- Minimal height (56px) maximizes canvas space
- No decorative elements—every pixel serves function
- Clean borders (1px, subtle) don't compete for attention

**Depth: Progressive Disclosure**
- Search autocomplete appears only when 2+ characters typed
- Dropdowns show recent items first, "View All" for deeper access
- Notification hierarchy (Critical > Warning > Info) provides progressive urgency
- Avatar menu reveals full profile on demand

**Continuity: Time as Truth**
- Project status indicators show real-time connection state (Live/Offline/Syncing)
- Notification timestamps show recency ("2 minutes ago", "1 hour ago")
- Recent project list shows "Last viewed" times
- Search shows "Recent" category first

**Intelligence: AI Suggests, User Decides**
- Search autocomplete suggests contextual results, user selects
- Notification priority determined by AI severity classification
- Ask Sage AI assistant available via Cmd+K (not intrusive in header)
- No auto-actions—all require explicit user interaction

### 1.3 Constraints & Requirements

**Performance:**
- Header must remain responsive at 60fps during scroll
- Dropdown animations must complete in 150ms
- Search autocomplete debounced to 300ms
- Total header asset weight: <50KB (excluding user avatar images)

**Accessibility:**
- WCAG 2.1 Level AA compliance
- All interactive elements keyboard accessible
- Screen reader labels for all icons
- Minimum touch target: 40px × 40px
- Color contrast ratios: 4.5:1 (text), 3:1 (UI elements)

**Browser Support:**
- Chrome/Edge (latest 2 versions)
- Safari (latest 2 versions)
- Firefox (latest 2 versions)

**Device Support:**
- Desktop: 1024px+ (full layout)
- Tablet: 768-1023px (simplified)
- Mobile: <768px (minimal)

---

## 2. Structure & Layout

### 2.1 Grid Architecture

The header uses CSS Grid with three distinct zones:

```
┌────────────────────────────────────────────────────────────┐
│  LEFT ZONE          CENTER ZONE          RIGHT ZONE        │
│  Brand              Search               Context + Actions │
└────────────────────────────────────────────────────────────┘
```

**Grid Definition:**
```css
display: grid;
grid-template-columns: 1fr auto 1fr;
align-items: center;
gap: 20px;
padding: 0 24px;
height: 56px;
```

**Rationale:**
- `1fr auto 1fr` creates balanced left/right zones with flexible center
- Search (center) can grow/shrink based on content
- 20px gap provides breathing room between zones
- 24px horizontal padding aligns with platform grid (8px base × 3)

### 2.2 Zone Specifications

#### **Left Zone (justify-start)**

Contains: Brand identity  
Width: Flexible (minimum content width)  
Alignment: Left-aligned within zone

**Contents:**
1. **Logomark** - Layers icon from Lucide (24×24px)
2. **Wordmark** - "Tagwaye" text

**Spacing:**
- Logomark ↔ Wordmark: 8px gap
- Combined clickable area: Entire brand element (with 8px padding)

#### **Center Zone (justify-center)**

Contains: Global search  
Width: Flexible with constraints  
Alignment: Center-aligned within zone

**Contents:**
1. **Search Input** - Primary search field

**Width Constraints:**
- Maximum: 400px (desktop)
- Tablet: 280px
- Mobile: Hidden

#### **Right Zone (justify-end)**

Contains: Context indicators and user controls  
Width: Flexible (minimum content width)  
Alignment: Right-aligned within zone

**Contents (left to right):**
1. **Project Pill** - Active project context
2. **Notification Button** - Alerts and notifications
3. **User Avatar** - Account and profile access

**Spacing:**
- Gap between elements: 8px (tight grouping, related items)

### 2.3 Visual Foundation

**Background:**
```css
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px); /* Safari */
```

**Dark Theme:**
```css
background: rgba(28, 28, 30, 0.8);
```

**Border:**
```css
border-bottom: 1px solid rgba(0, 0, 0, 0.1);
```

**Dark Theme Border:**
```css
border-bottom: 1px solid rgba(255, 255, 255, 0.1);
```

**Rationale:**
- 80% opacity maintains legibility while showing content beneath
- `backdrop-filter: blur(20px)` creates depth and separation
- RGBA borders provide proper transparency (better than CSS variable colors)
- Safari requires `-webkit-` prefix for backdrop filter

### 2.4 Responsive Behavior

**Desktop (1024px+):**
- Full three-zone layout
- All elements visible
- Search: 400px max-width

**Tablet (768-1023px):**
- Three-zone layout maintained
- Search: 280px max-width
- Project Pill label visible but may truncate

**Mobile (<768px):**
- Grid changes: `auto 1fr auto` (eliminates center zone)
- Search: Hidden entirely (access via hamburger menu)
- Project Pill: Icon only, label hidden
- Chevron on Project Pill: Hidden
- Left zone: Hamburger + Brand
- Right zone: Notification + Avatar only

**Mobile Grid:**
```css
@media (max-width: 767px) {
    grid-template-columns: auto 1fr auto;
    padding: 0 16px;
}
```

---

## 3. Component Specifications

### 3.1 Brand (Left Zone)

**Purpose:** Platform identity and home navigation

#### **Logomark**

**Icon:** Layers (Lucide icon library, outline style)  
**Size:** 24×24px  
**Color:** `var(--color-accent)` (#0071e3)  
**Format:** SVG inline (not external file)

**Specifications:**
- Stroke width: 2px (Lucide default)
- No fill (outline only)
- Color does not change on hover (maintains brand identity)

#### **Wordmark**

**Text:** "Tagwaye"  
**Font:** SF Pro Display (system fallback: -apple-system)  
**Size:** 20px  
**Weight:** 600 (Semibold)  
**Letter-spacing:** -0.02em  
**Color:** `var(--color-text-primary)` (#1d1d1f light, #f5f5f7 dark)

**Specifications:**
- No transform (no uppercase, no smallcaps)
- Anti-aliased rendering
- One word (no spacing)

#### **Combined Element**

**Container:**
- Display: flex
- Align-items: center
- Gap: 8px
- Padding: 8px 12px
- Border-radius: 8px
- Cursor: pointer

**Hover State:**
- Background: `var(--color-bg-secondary)`
- Transition: 150ms cubic-bezier(0.4, 0.0, 0.2, 1)

**Click Action:**
- Navigate to home/default view
- Same as clicking "Home" in sidebar navigation
- No dropdown, no secondary menu

**Accessibility:**
- ARIA label: "Tagwaye, return to home"
- Role: link
- Keyboard: Enter or Space triggers navigation

---

### 3.2 Search (Center Zone)

**Purpose:** Fast lookup of assets, spaces, documents, people

#### **Search Input Field**

**Dimensions:**
- Width: 100% of container (max 400px desktop, 280px tablet)
- Height: 40px (proper touch target)
- Padding: 0 40px (left and right, to avoid icon collision)

**Styling:**
```css
background: var(--color-bg-secondary);
border: 1px solid var(--color-border);
border-radius: 8px;
font-size: 13px;
color: var(--color-text-primary);
```

**Focus State:**
```css
border-color: var(--color-accent);
background: var(--color-surface);
outline: none;
```

**Placeholder:**
- Text: "Search assets, spaces, documents..."
- Color: `var(--color-text-secondary)`
- Font-size: 13px

**Icons:**

**Search Icon (left):**
- Icon: Search (Lucide)
- Size: 18×18px
- Position: Absolute left 12px, vertically centered
- Color: `var(--color-text-secondary)`
- Pointer-events: none

**Clear Button (right):**
- Icon: X (Lucide)
- Size: 14×14px inside 20×20px button
- Position: Absolute right 12px, vertically centered
- Visibility: `display: none` when input empty
- Visibility: `display: flex` when input has value
- Background: transparent
- Border-radius: 4px
- Hover: Background `var(--color-bg-secondary)`

#### **Search Autocomplete Dropdown**

**Trigger:** 2+ characters typed in search field

**Positioning:**
```css
position: absolute;
top: calc(100% + 8px); /* 8px below input */
left: 0;
right: 0; /* Full width of search container */
z-index: 100;
```

**Styling:**
```css
background: var(--color-surface);
border: 1px solid var(--color-border);
border-radius: 12px;
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
max-height: 400px;
overflow-y: auto;
```

**Dark Theme Shadow:**
```css
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
```

**Animation:**
```css
@keyframes dropdownFadeIn {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
animation: dropdownFadeIn 150ms cubic-bezier(0.4, 0.0, 0.2, 1);
```

**Content Structure:**

**Category Header:**
- Padding: 12px 16px 8px
- Font-size: 11px
- Font-weight: 600
- Text-transform: uppercase
- Letter-spacing: 0.05em
- Color: `var(--color-text-secondary)`

**Search Result Item:**
- Padding: 12px 16px
- Display: flex
- Align-items: center
- Gap: 12px
- Cursor: pointer
- Hover background: `var(--color-bg-secondary)`

**Result Icon:**
- Size: 20×20px
- Color: `var(--color-text-secondary)`
- Flex-shrink: 0

**Result Title:**
- Font-size: 13px
- Font-weight: 500
- Color: `var(--color-text-primary)`

**Result Meta:**
- Font-size: 11px
- Color: `var(--color-text-secondary)`
- Margin-top: 2px

**Categories (in order):**
1. Recent (last 3 searches/selections)
2. Assets (max 3 results)
3. Spaces (max 3 results)
4. Documents (max 3 results)
5. People (max 3 results)

**Keyboard Navigation:**
- Arrow down: Next result
- Arrow up: Previous result
- Enter: Select highlighted result
- Escape: Close dropdown

**Accessibility:**
- Role: listbox
- Each result: role="option"
- aria-activedescendant: ID of highlighted result

---

### 3.3 Project Pill (Right Zone)

**Purpose:** Display active project/building context with quick switching

#### **Container**

**Styling:**
```css
display: flex;
align-items: center;
gap: 10px;
padding: 10px 14px;
background: var(--color-bg-secondary);
border-radius: 12px;
cursor: pointer;
position: relative;
```

**Hover:**
```css
background: var(--color-border);
transition: background 150ms;
```

#### **Building Icon**

**Icon:** Building-2 (Lucide)  
**Size:** 20×20px  
**Color:** `var(--color-text-secondary)`

#### **Label**

**Text:** Building/project name (e.g., "Building A")  
**Font-size:** 13px  
**Font-weight:** 600  
**Color:** `var(--color-text-primary)`  
**Max-width:** 120px (ellipsis if overflow)

#### **Chevron**

**Icon:** Chevron-down (Lucide)  
**Size:** 16×16px  
**Color:** `var(--color-text-secondary)`

#### **Status Dot**

**Position:** Absolute top 8px, right 8px  
**Size:** 8×8px circle  
**Colors:**
- Live: `var(--color-success)` (#34c759)
- Offline: `#86868b` (gray)
- Syncing: `var(--color-warning)` (#ff9500) with pulse animation

**Pulse Animation (Syncing):**
```css
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}
animation: pulse 2s infinite;
```

#### **Dropdown**

**Trigger:** Click on Project Pill

**Positioning:**
```css
position: absolute;
top: calc(100% + 8px);
right: 0;
min-width: 320px;
```

**Content:**

**List of 7 Recent Projects:**

Each project item:
- Padding: 12px
- Display: flex
- Gap: 12px
- Hover: Background `var(--color-bg-secondary)`

**Project Icon:**
- Contextual building icon (Building-2, Warehouse, Factory, Hotel, etc.)
- Size: 20×20px
- Color: 
  - Live: `var(--color-success)`
  - Offline: `var(--color-text-secondary)`
  - Syncing: `var(--color-warning)`

**Project Title:**
- Font-size: 13px
- Font-weight: 600
- Color: `var(--color-text-primary)`

**Project Meta:**
- Font-size: 11px
- Color: `var(--color-text-secondary)`
- Format: `● Live · Last viewed 2h ago`

**Footer:**
- Border-top: 1px solid `var(--color-border)`
- Padding: 12px
- Text-align: center

**"View All Projects" Link:**
- Font-size: 13px
- Font-weight: 600
- Color: `var(--color-accent)`
- Display: inline-flex
- Gap: 4px
- Includes arrow-right icon (14×14px)

---

### 3.4 Notification Button (Right Zone)

**Purpose:** Alert users to system notifications, warnings, and information

#### **Button**

**Dimensions:**
- Width: 40px
- Height: 40px (44px touch target minimum)

**Styling:**
```css
background: transparent;
border: none;
border-radius: 8px;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
position: relative;
```

**Icon:**
- Bell (Lucide)
- Size: 20×20px
- Color: `var(--color-text-secondary)`

**Hover:**
```css
background: var(--color-bg-secondary);
color: var(--color-text-primary);
```

#### **Notification Badge**

**When:** Unread notifications exist  
**Position:** Absolute top 4px, right 4px

**Styling:**
```css
min-width: 18px;
height: 18px;
padding: 0 5px;
background: var(--color-error); /* #ff3b30 */
border-radius: 9px;
border: 2px solid var(--color-surface);
font-size: 10px;
font-weight: 600;
color: white;
display: flex;
align-items: center;
justify-content: center;
```

**Count Display:**
- 1-9: Show number exactly ("3")
- 10-99: Show number exactly ("47")
- 100+: Show "99+"

#### **Notification Dropdown**

**Trigger:** Click notification button

**Positioning:**
```css
position: absolute;
top: calc(100% + 8px);
right: 0;
width: 360px;
max-width: calc(100vw - 32px); /* Mobile constraint */
```

**Content:**

**List of 5 Most Recent Notifications:**

Each notification has severity classification:

**Critical (Red):**
- Border-left: 4px solid `var(--color-error)`
- Background (if unread): rgba(255, 59, 48, 0.05)
- Dot color: `var(--color-error)`
- Title color: `var(--color-error)`
- Title weight: 600

**Warning (Orange):**
- Border-left: 4px solid `var(--color-warning)`
- Dot color: `var(--color-warning)`
- Title weight: 600

**Info (Blue):**
- Border-left: 4px solid `var(--color-info)`
- Dot color: `var(--color-info)`
- Title weight: 500

**Notification Item Structure:**
- Padding: 12px
- Display: flex
- Gap: 12px
- Cursor: pointer

**Dot:**
- Size: 8×8px circle
- Flex-shrink: 0
- Margin-top: 6px

**Content:**
- Flex: 1

**Title:**
- Font-size: 13px
- Weight: 500-600 (based on severity)

**Meta:**
- Font-size: 11px
- Color: `var(--color-text-secondary)`
- Margin-top: 4px
- Format: Relative time ("2 minutes ago", "1 hour ago", "3 days ago")

**Arrow:**
- Icon: Arrow-right (Lucide)
- Size: 16×16px
- Color: `var(--color-text-secondary)`

**Footer:**
- "View All Notifications" link (same style as Project Pill footer)

**Click Action:**
- Navigate to notification context (asset in Scene Canvas, document, page, etc.)
- Mark notification as read
- Close dropdown

---

### 3.5 User Avatar (Right Zone)

**Purpose:** User identity and account access

#### **Avatar Button**

**Dimensions:**
- Width: 36px
- Height: 36px
- Border-radius: 50% (circle)

**Default State (No Picture):**
```css
background: var(--color-bg-secondary);
display: flex;
align-items: center;
justify-content: center;
```

**Icon:**
- User (Lucide)
- Size: 20×20px
- Color: `var(--color-text-secondary)`

**With Picture:**
```css
background: none;
```
- Image: Uploaded user photo
- Object-fit: cover
- Border-radius: 50%

**Hover:**
```css
background: var(--color-border);
cursor: pointer;
```

#### **Avatar Menu Dropdown**

**Trigger:** Click avatar

**Positioning:**
```css
position: absolute;
top: calc(100% + 8px);
right: 0;
min-width: 260px;
```

**Header Section:**
- Padding: 16px 20px
- Border-bottom: 1px solid `var(--color-border)`

**Full Name:**
- Font-size: 15px
- Font-weight: 600
- Color: `var(--color-text-primary)`
- Example: "Ava Johnson"

**Job Title:**
- Font-size: 13px
- Color: `var(--color-text-secondary)`
- Margin-top: 2px
- Example: "CEO & Co-Founder"

**Menu Items:**

Each item:
- Padding: 12px
- Margin-top: 8px (first item only)
- Display: flex
- Align-items: center
- Gap: 12px
- Font-size: 13px
- Cursor: pointer
- Hover: Background `var(--color-bg-secondary)`

**Item 1: Profile**
- Icon: Settings (18×18px)
- Label: "Profile"
- Action: Navigate to user settings

**Item 2: Organization** (Conditional - only if user is admin)
- Icon: Building-2 (18×18px)
- Label: "Organization"
- Action: Navigate to organization settings

**Divider:**
```css
height: 1px;
background: var(--color-border);
margin: 4px 0;
```

**Item 3: Sign Out**
- Icon: None
- Label: "Sign Out"
- Color: `var(--color-error)` (#ff3b30)
- Action: Sign out user, redirect to login

---

## 4. Interaction & States

### 4.1 Global Header States

**Default State:**
- All elements visible as specified
- Search field empty
- No dropdowns open
- Notification badge hidden if no unread
- Status dot shows current project connection

**Search Active State:**
- Search field focused (accent border)
- Autocomplete visible if 2+ characters
- Other dropdowns closed
- Keyboard focus in search

**Dropdown Open State:**
- One dropdown visible at a time
- Backdrop click closes dropdown
- ESC key closes dropdown
- Clicking another trigger closes current, opens new

**Scroll Behavior:**
- Header remains fixed at top (position: fixed)
- No auto-hide on scroll down
- Z-index: 1000 (above all content except modals)

### 4.2 Keyboard Shortcuts

**Global:**
- `Cmd+K` or `Ctrl+K`: Focus search field (from anywhere in app)
- `ESC`: Close any open dropdown
- `Tab`: Navigate through header elements (left to right)

**Search Active:**
- `Arrow Down`: Highlight next result
- `Arrow Up`: Highlight previous result
- `Enter`: Select highlighted result
- `ESC`: Close autocomplete, keep search focused

**Dropdown Open:**
- `Arrow Down`: Highlight next item
- `Arrow Up`: Highlight previous item
- `Enter`: Select highlighted item
- `ESC`: Close dropdown

### 4.3 Loading & Error States

**Search Loading:**
- Show loading spinner in place of search icon (18×18px)
- Debounce: 300ms before triggering search
- Cancel in-flight requests on new input

**Search Error:**
- Show "No results found" in dropdown
- Suggest: "Try different keywords" or "Browse all assets"

**Search Empty:**
- Show "Recent" searches if available
- Otherwise: Empty state with suggestion

**Notification Loading:**
- Show skeleton items (3 placeholder cards with loading animation)
- Fallback: "Loading notifications..."

**Notification Error:**
- Show error message: "Unable to load notifications"
- Retry button

**Project Switching:**
- Show loading indicator on clicked project
- Optimistic UI: Assume switch succeeds, update header immediately
- Revert on error with toast notification

**Connection Lost:**
- Status dot changes to gray (Offline)
- Toast notification: "Connection lost. Working offline."
- Retry connection in background

### 4.4 Touch & Mouse Interactions

**Touch Targets:**
- Minimum: 40×40px (searchable via browser inspector)
- Padding adjusts to meet target if native size smaller
- No hover states on touch devices

**Hover States (Mouse Only):**
- All interactive elements show hover feedback
- Cursor changes to pointer on clickable elements
- Transition: 150ms for all hover states

**Click/Tap:**
- Immediate visual feedback (background change, scale, etc.)
- Dropdowns open on click, not hover
- No delay on mobile (no 300ms tap delay)

**Drag:**
- Not applicable in header (no draggable elements)

### 4.5 Dropdown Behavior

**Opening:**
- Animation: Fade in + slide down 8px
- Duration: 150ms
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
- Focus: First interactive element receives focus

**Closing:**
- Triggers:
  - Click outside dropdown
  - ESC key
  - Select item (notification, project)
  - Click close button (removed in v2, ignore)
- Animation: Fade out (no slide up)
- Duration: 100ms

**Positioning:**
- Anchored to trigger element
- Aligned right (for Right Zone elements)
- 8px gap below trigger
- Constrained to viewport (no horizontal overflow)

**Backdrop:**
- Semi-transparent overlay: rgba(0, 0, 0, 0.2)
- Click closes dropdown
- Prevents interaction with content behind
- Only for mobile (not desktop)

---

## 5. Implementation Guidelines

### 5.1 Technology Stack

**HTML:**
- Semantic `<header>` element
- Use `<nav>` for search autocomplete results
- ARIA labels and roles for accessibility

**CSS:**
- CSS Grid for layout (not Flexbox for zones)
- CSS Custom Properties (variables) for tokens
- Prefer `rem` for font-sizes (accessibility)
- Use `px` for fixed dimensions (borders, shadows)

**JavaScript:**
- Vanilla JS for MVP (no framework overhead)
- React recommended for production
- Debounce search input (lodash.debounce or custom)
- Event delegation for dropdown items

**Icons:**
- Lucide icon library (outline style only)
- Inline SVG (not external files or CDN for critical icons)
- Use `<svg>` elements with `data-lucide` attributes for Lucide
- Fallback: Unicode symbols if SVG fails

### 5.2 Design Tokens

All values must be tokenized using CSS Custom Properties:

```css
:root {
    /* Layout */
    --header-height: 56px;
    --header-padding-x: 24px;
    --header-zone-gap: 20px;
    --header-right-gap: 8px;

    /* Search */
    --search-height: 40px;
    --search-max-width: 400px;
    --search-icon-size: 18px;
    --search-icon-offset: 12px;

    /* Project Pill */
    --pill-padding-y: 10px;
    --pill-padding-x: 14px;
    --pill-gap: 10px;
    --pill-icon-size: 20px;
    --status-dot-size: 8px;

    /* Notification */
    --notification-button-size: 40px;
    --notification-icon-size: 20px;
    --notification-badge-size: 18px;
    --notification-border-width: 4px;

    /* Avatar */
    --avatar-size: 36px;
    --avatar-icon-size: 20px;
    --avatar-menu-width: 260px;

    /* Dropdown */
    --dropdown-border-radius: 12px;
    --dropdown-offset: 8px;
    --dropdown-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);

    /* Colors */
    --color-bg-primary: #ffffff;
    --color-bg-secondary: #f5f5f7;
    --color-surface: #ffffff;
    --color-border: #d2d2d7;
    --color-text-primary: #1d1d1f;
    --color-text-secondary: #86868b;
    --color-accent: #0071e3;
    --color-error: #ff3b30;
    --color-success: #34c759;
    --color-warning: #ff9500;
    --color-info: #007aff;

    /* Typography */
    --font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
    --font-size-xs: 11px;
    --font-size-sm: 13px;
    --font-size-base: 15px;
    --font-size-lg: 20px;
    --font-weight-regular: 400;
    --font-weight-semibold: 600;

    /* Motion */
    --duration-fast: 150ms;
    --duration-normal: 250ms;
    --easing: cubic-bezier(0.4, 0.0, 0.2, 1);
}
```

**Dark Theme Overrides:**
```css
[data-theme="dark"] {
    --color-bg-primary: #000000;
    --color-bg-secondary: #1c1c1e;
    --color-surface: #1c1c1e;
    --color-border: #38383a;
    --color-text-primary: #f5f5f7;
    --color-text-secondary: #98989d;
    --dropdown-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}
```

### 5.3 Accessibility Implementation

**Keyboard Navigation:**

```html
<header role="banner">
    <div class="header-left">
        <a href="/" aria-label="Tagwaye, return to home" class="header-brand">
            <!-- Logo + Wordmark -->
        </a>
    </div>
    
    <div class="header-center">
        <div role="search">
            <input 
                type="search" 
                aria-label="Search assets, spaces, documents"
                aria-autocomplete="list"
                aria-controls="search-results"
                aria-expanded="false"
            >
            <div role="listbox" id="search-results" aria-label="Search results">
                <!-- Results -->
            </div>
        </div>
    </div>
    
    <div class="header-right">
        <button aria-label="Switch project" aria-haspopup="true" aria-expanded="false">
            <!-- Project Pill -->
        </button>
        <button aria-label="Notifications, 3 unread" aria-haspopup="true" aria-expanded="false">
            <!-- Notification Button -->
        </button>
        <button aria-label="User menu" aria-haspopup="true" aria-expanded="false">
            <!-- Avatar -->
        </button>
    </div>
</header>
```

**Screen Reader Announcements:**
- Notification badge count: "3 unread notifications"
- Project status: "Building A, Live"
- Search results: "5 results found in Assets, Documents"
- Menu state: "Menu opened" / "Menu closed"

**Focus Management:**
- Visible focus indicator: 2px solid `var(--color-accent)`
- Focus trap in dropdowns (Tab cycles within dropdown)
- Focus returns to trigger on dropdown close
- Skip link: "Skip to main content" before header

**Color Contrast:**
- Text on background: 4.5:1 minimum
- UI elements: 3:1 minimum
- Tested with WCAG Color Contrast Analyzer

### 5.4 Performance Optimization

**Critical Rendering Path:**
1. Inline critical CSS (header styles) in `<head>`
2. Defer non-critical CSS (dropdowns, animations)
3. Lazy load user avatar images
4. Preconnect to icon CDN if using external Lucide

**JavaScript:**
- Debounce search input: 300ms
- Throttle scroll listeners: 16ms (60fps)
- Use event delegation for dropdown items
- Avoid layout thrashing (batch DOM reads/writes)

**Assets:**
- Inline SVG for logo (no HTTP request)
- Use SVG sprites for icons (one request, cached)
- Compress user avatars (WebP format, max 50KB)
- Lazy load notification images

**Caching:**
- Cache search results in sessionStorage (5 min TTL)
- Cache project list in localStorage (synced on load)
- Service worker for offline support

### 5.5 Testing Requirements

**Unit Tests:**
- Search debounce behavior
- Dropdown open/close logic
- Keyboard navigation handlers
- Badge count formatting (1-9, 10-99, 99+)

**Integration Tests:**
- Search → Autocomplete → Selection flow
- Notification click → Navigation
- Project switch → Header update
- Theme toggle → Color update

**Visual Regression Tests:**
- Screenshot comparisons for:
  - Default state
  - Search active
  - Each dropdown open
  - Hover states
  - Dark theme
  - Mobile responsive

**Accessibility Tests:**
- axe-core automated scan
- Manual keyboard navigation test
- Screen reader test (VoiceOver, NVDA)
- Color contrast verification

**Performance Tests:**
- Lighthouse score: 90+ (Performance, Accessibility)
- First Contentful Paint: <1s
- Time to Interactive: <2s
- Largest Contentful Paint: <2.5s

### 5.6 Browser & Device Testing

**Desktop Browsers:**
- Chrome (latest 2 versions)
- Safari (latest 2 versions)
- Firefox (latest 2 versions)
- Edge (latest 2 versions)

**Tablet Devices:**
- iPad Pro 11" (Safari)
- iPad Air (Safari)
- Samsung Galaxy Tab (Chrome)

**Mobile Devices:**
- iPhone 14 Pro (Safari)
- iPhone SE (Safari)
- Samsung Galaxy S23 (Chrome)
- Google Pixel 7 (Chrome)

**Screen Sizes:**
- 1920×1080 (Desktop)
- 1440×900 (Laptop)
- 1024×768 (Tablet Landscape)
- 768×1024 (Tablet Portrait)
- 393×852 (Mobile)

---

## Appendix

### A. Component Hierarchy

```
Header
├── Left Zone
│   └── Brand
│       ├── Logomark (Icon)
│       └── Wordmark (Text)
├── Center Zone
│   └── Search
│       ├── Search Icon
│       ├── Input Field
│       ├── Clear Button
│       └── Autocomplete Dropdown
│           ├── Category Headers
│           └── Result Items
└── Right Zone
    ├── Project Pill
    │   ├── Building Icon
    │   ├── Label
    │   ├── Chevron
    │   ├── Status Dot
    │   └── Dropdown
    │       ├── Project Items (7)
    │       └── Footer Link
    ├── Notification Button
    │   ├── Bell Icon
    │   ├── Badge (conditional)
    │   └── Dropdown
    │       ├── Notification Items (5)
    │       └── Footer Link
    └── Avatar
        ├── Avatar Image/Icon
        └── Dropdown Menu
            ├── Header (Name + Title)
            ├── Menu Items
            └── Sign Out
```

### B. State Management

```typescript
interface HeaderState {
    search: {
        value: string;
        focused: boolean;
        autocompleteOpen: boolean;
        results: SearchResult[];
        loading: boolean;
    };
    project: {
        active: Project;
        dropdownOpen: boolean;
        recent: Project[];
    };
    notifications: {
        unreadCount: number;
        dropdownOpen: boolean;
        items: Notification[];
    };
    user: {
        name: string;
        title: string;
        avatar: string | null;
        dropdownOpen: boolean;
        isAdmin: boolean;
    };
    theme: 'light' | 'dark';
    connectionStatus: 'live' | 'offline' | 'syncing';
}
```

### C. API Integration Points

**Search Autocomplete:**
- Endpoint: `GET /api/search/autocomplete?q={query}`
- Debounce: 300ms
- Cache: 5 minutes
- Response: Categorized results (Recent, Assets, Spaces, Documents, People)

**Project List:**
- Endpoint: `GET /api/projects/recent?limit=7`
- Cache: On load, refresh on project switch
- Response: Projects with status and last viewed time

**Notifications:**
- Endpoint: `GET /api/notifications?limit=5&unread=true`
- Polling: Every 30 seconds when tab active
- WebSocket: Real-time updates preferred
- Response: Notifications with severity, timestamp, action URL

**User Profile:**
- Endpoint: `GET /api/user/profile`
- Cache: On load
- Response: Name, title, avatar URL, admin status

**Connection Status:**
- WebSocket: `ws://api.tagwaye.com/status`
- Heartbeat: Every 10 seconds
- States: live, offline, syncing

### D. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 13, 2025 | Initial specification with Apple standards applied |

---

**End of Document**

*This specification is a living document and will be updated as the Tagwaye platform evolves. For questions or clarifications, contact the Design & Engineering team.*
