# Tagwaye Project Context - For New Chat Session

**Date:** November 17, 2025  
**Repository:** https://github.com/arfaths/tagwaye786  
**Status:** Frontend Complete, Backend Ready to Start

---

## 🎯 Project Overview

**Tagwaye** is a decision intelligence platform for the built environment, powered by AI-enhanced digital twins called LivingTwins. This is a full-stack monorepo project with frontend (Next.js) complete and backend (NestJS) planned.

---

## ✅ What's Been Completed

### Frontend Implementation (100% Complete)
- **Six-zone CSS Grid layout** (Header, Sidebar, Main, Panel, Timeline, Footer)
- **All chrome components** with Framer Motion animations
- **Zustand state management** with localStorage persistence
- **React Query data layer** with mock APIs
- **Timeline component** with ECharts visualizations
- **Command palette** (Cmd+K)
- **Theme switching** (Auto/Light/Dark)
- **Storybook setup** with Timeline story
- **Performance budgets** documented
- **TypeScript** throughout
- **ESLint** configured and passing
- **Build successful** - production ready

### Git & GitHub Setup
- ✅ Git repository initialized
- ✅ Initial commit created (84 files, 25,174 lines)
- ✅ Connected to GitHub: https://github.com/arfaths/tagwaye786
- ✅ Code pushed to GitHub
- ✅ Branch: `main` (renamed from `master`)

---

## 📁 Project Structure

```
2Twinsv8/
├── apps/
│   └── tagwaye-portal/          # Next.js 15 frontend
│       ├── src/
│       │   ├── app/             # Next.js App Router
│       │   │   ├── (dashboard)/ # Dashboard layout & page
│       │   │   ├── layout.tsx   # Root layout
│       │   │   ├── providers.tsx # React Query + Command Palette
│       │   │   └── globals.css  # Six-zone grid CSS
│       │   ├── components/
│       │   │   ├── chrome/      # All 6 zones (Header, Sidebar, Panel, Timeline, Footer)
│       │   │   ├── canvas/      # UniversalCanvas, SceneCanvas (Three.js + FRAG)
│       │   │   ├── timeline/    # TimelineChart (ECharts)
│       │   │   └── command-palette/
│       │   ├── state/
│       │   │   └── layout-store.ts # Zustand store with persistence
│       │   └── data/
│       │       └── mockProject.ts   # Mock API functions
│       ├── .storybook/          # Storybook config
│       └── package.json
├── docs/
│   ├── prd/
│   │   ├── tagwaye-prd.md       # Product requirements
│   │   ├── backend-roadmap.md   # NestJS API plan
│   │   ├── perf-budgets.md      # Performance targets
│   │   └── ui-inventory.md      # Component backlog
│   └── backend/
│       └── tagwaye-api-outline.md
├── References/                  # Design specifications (6 markdown files)
├── .gitignore                   # Root-level ignore rules
├── README.md                    # Project overview
└── package.json                # Root package.json
```

---

## 🛠️ Tech Stack

### Frontend (Implemented)
- **Next.js 15** (App Router, Turbopack)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (animations)
- **Zustand** (state management)
- **React Query** (data fetching)
- **ECharts** (timeline visualizations)
- **@thatopen/fragments** (FRAG engine - ready for integration)
- **Lucide React** (icons)
- **Radix UI** (accessible primitives)
- **Storybook** (component development)
- **Vitest + Playwright** (testing setup)

### Backend (Planned - See `docs/prd/backend-roadmap.md`)
- **NestJS 11** (monolith with modules)
- **PostgreSQL 16** + **Prisma ORM**
- **TimescaleDB** (for telemetry)
- **WebSocket** (real-time updates)
- **Redis** (caching)

---

## 🔑 Key Files & Their Purpose

### Layout & Structure
- `apps/tagwaye-portal/src/app/(dashboard)/layout.tsx` - Six-zone grid shell
- `apps/tagwaye-portal/src/app/globals.css` - Grid CSS + design tokens
- `apps/tagwaye-portal/src/app/providers.tsx` - React Query + Command Palette providers

### State Management
- `apps/tagwaye-portal/src/state/layout-store.ts` - Zustand store with:
  - Layout state (sidebar, panel, timeline visibility/expansion)
  - View modes (single/dual)
  - Theme preferences
  - Project/asset selection
  - Timeline cursor & dimensions
  - localStorage persistence

### Chrome Components
- `apps/tagwaye-portal/src/components/chrome/Header.tsx` - Global search, project context
- `apps/tagwaye-portal/src/components/chrome/Sidebar.tsx` - Collapsible nav (64px ↔ 280px)
- `apps/tagwaye-portal/src/components/chrome/Panel.tsx` - Multi-pane (Browse/Monitor/Analyze), resizable
- `apps/tagwaye-portal/src/components/chrome/Timeline.tsx` - Lifecycle phases, dimensions, ECharts
- `apps/tagwaye-portal/src/components/chrome/Footer.tsx` - Status, breadcrumbs, controls

### Data Layer
- `apps/tagwaye-portal/src/data/mockProject.ts` - Mock API functions:
  - `fetchProjectSummary(projectId)` - Project metadata
  - `fetchTimelineSnapshot(projectId)` - Timeline data
  - `fetchSystemStatus(projectId)` - Connection status, render time, collaborators

### Canvas Components
- `apps/tagwaye-portal/src/components/canvas/UniversalCanvas.tsx` - Dashboard view
- `apps/tagwaye-portal/src/components/canvas/SceneCanvas.tsx` - Three.js + FRAG ready

---

## 📋 Design Specifications

All design specs are in `References/`:
1. `tagwaye-layout-design-specifications-v1.1.md` - Six-zone grid system
2. `tagwaye-sidebar-design-specifications-v1.1.md` - Navigation structure
3. `tagwaye-panel-design-specifications-v1.1.md` - Multi-pane system
4. `tagwaye-canvas-design-specifications-v1.1.md` - Universal + Scene canvases
5. `tagwaye-timeline-design-specifications-v1.1.md` - Temporal navigation
6. `tagwaye-footer-design-specifications-v1.1.md` - Status bar

**Key Design Principles:**
- Clarity: Contextual confidence
- Deference: Content over chrome
- Depth: Progressive disclosure
- Continuity: Time as truth
- Intelligence: AI suggests, user decides

---

## 🚀 Running the App

```bash
cd apps/tagwaye-portal
npm install
npm run dev
```

App runs at: `http://localhost:3000`

**Available Scripts:**
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run lint` - ESLint check
- `npm run storybook` - Storybook UI
- `npm run build-storybook` - Build Storybook

---

## 🔄 Git Workflow

**Repository:** https://github.com/arfaths/tagwaye786  
**Branch:** `main`  
**Remote:** `origin` → `https://github.com/arfaths/tagwaye786.git`

**Common Commands:**
```bash
git status                    # Check changes
git add .                     # Stage all changes
git commit -m "message"       # Commit changes
git push                      # Push to GitHub
git pull                      # Pull from GitHub
git checkout -b feature/name  # Create feature branch
```

---

## 📝 Next Steps / Backlog

### Immediate Priorities
1. **Backend API Development**
   - Set up NestJS app in `apps/api`
   - Implement modules: projects, assets, timelines, analytics, intelligence
   - Replace mock APIs with real endpoints
   - See: `docs/prd/backend-roadmap.md`

2. **Frontend Enhancements**
   - Connect to real backend APIs
   - Implement timeline scrubber functionality
   - Integrate @thatopen/fragments with real FRAG files
   - Add more Storybook stories

3. **CI/CD Setup**
   - GitHub Actions for lint/build/test
   - Automated deployment workflow

### Future Work
- Authentication/Authorization
- Real-time WebSocket integration
- Telemetry data streaming
- AI/Sage integration
- Performance monitoring
- Documentation site

---

## 🐛 Known Issues / Notes

- Git commands work but output not always visible in this environment
- PowerShell scripts created but had syntax issues (fixed in `init-git.ps1`)
- Storybook initialized but onboarding server was interrupted
- FRAG engine ready but needs actual .frag file integration
- Mock APIs in place, ready for backend replacement

---

## 📚 Important Documentation

- **PRD:** `docs/prd/tagwaye-prd.md`
- **Backend Plan:** `docs/prd/backend-roadmap.md`
- **Performance:** `docs/prd/perf-budgets.md`
- **Implementation Summary:** `apps/tagwaye-portal/IMPLEMENTATION_SUMMARY.md`
- **Git Setup Guide:** `GIT_SETUP.md`

---

## 💡 Key Decisions Made

1. **Monorepo structure** - Frontend in `apps/tagwaye-portal`, backend will go in `apps/api`
2. **Zustand over Redux** - Simpler state management for layout state
3. **React Query** - For server state, caching, refetching
4. **Framer Motion** - For smooth animations matching design specs
5. **ECharts** - For timeline visualizations (spec requirement)
6. **@thatopen/fragments** - For 3D digital twin rendering (spec requirement)
7. **Storybook** - For component development and visual regression
8. **TypeScript strict mode** - Type safety throughout

---

## 🔐 Git Configuration

**User:**
- Name: `arfaths`
- Email: `suhail.arfath@arfath.com`

**Repository:**
- Local: `C:\Users\suhai\_Projects\2Twinsv8`
- Remote: `https://github.com/arfaths/tagwaye786.git`
- Branch: `main`

---

## 🎨 Design Tokens & Styling

**CSS Variables** (in `globals.css`):
- `--chrome-bg`, `--chrome-surface`, `--chrome-border`
- `--text-primary`, `--text-secondary`
- `--sidebar-width`, `--panel-width`, `--timeline-height`
- `--header-height`, `--footer-height`

**Theme Support:**
- Auto (system preference)
- Light mode
- Dark mode (default)

**Grid Layout:**
- Header: 56px fixed
- Sidebar: 64px collapsed, 280px expanded
- Panel: 0px hidden, 280-600px resizable
- Timeline: 0px hidden, 48px collapsed, 320px expanded
- Footer: 40px fixed

---

## 📞 Quick Reference

**Project URL:** https://github.com/arfaths/tagwaye786  
**Dev Server:** http://localhost:3000 (when running)  
**Storybook:** http://localhost:6006 (when running)

**Key Contacts/Info:**
- Developer: arfaths (suhail.arfath@arfath.com)
- Project: Tagwaye - Decision Intelligence Platform
- Status: Frontend complete, backend ready to start

---

## 🚨 Important Reminders

1. **Always commit before switching branches**
2. **Pull before pushing** if working with others
3. **Use feature branches** for new work
4. **Follow the design specs** in `References/`
5. **Update documentation** when making significant changes
6. **Run `npm run lint`** before committing
7. **Test builds** with `npm run build` before pushing

---

**Last Updated:** November 17, 2025  
**Context Prepared For:** New chat session continuation

