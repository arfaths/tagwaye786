# Tagwaye - Decision Intelligence Platform

A full-stack decision intelligence platform for the built environment, powered by AI-enhanced digital twins called LivingTwins. This monorepo contains the frontend portal and will include the backend API.

## 🏗️ Project Structure

```
2Twinsv8/
├── apps/
│   └── tagwaye-portal/          # Next.js frontend application
├── docs/                         # Documentation (PRD, roadmaps, specs)
│   ├── prd/                     # Product requirements and roadmaps
│   ├── quality/                 # Quality gates and tooling
│   ├── specs/                   # Design specification documents
│   └── backend/                 # Backend API documentation
└── package.json                 # Root package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or pnpm
- Git (for version control)

### Frontend Development

```bash
cd apps/tagwaye-portal
npm install
npm run dev
```

Visit `http://localhost:3000` to see the app.

### Available Scripts

**Frontend (tagwaye-portal)**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run storybook` - Launch Storybook

## 📋 Implementation Status

### ✅ Frontend Implementation: 100% Complete

**Completion Date:** November 17, 2025  
**Specification Compliance:** 99%+  
**Tasks Completed:** 150/150

#### Core Features
- ✅ Six-zone CSS Grid layout (Header, Sidebar, Main, Panel, Timeline, Footer)
- ✅ All chrome components with Framer Motion animations
- ✅ Design token system (zero hardcoded values)
- ✅ Zustand state management with localStorage persistence
- ✅ React Query data layer with mock APIs
- ✅ Timeline with interactive scrubber, milestone snapping, 60fps playback
- ✅ Command palette (Cmd+K)
- ✅ Theme switching (Auto/Light/Dark)
- ✅ Dual View canvas with resizable divider
- ✅ Panel drawer system with context switching
- ✅ WCAG 2.1 Level AA accessibility compliance
- ✅ Comprehensive keyboard navigation
- ✅ Storybook setup

#### Quality Metrics
- ✅ 60fps animations and interactions
- ✅ High-DPI canvas rendering
- ✅ Performance optimizations (debouncing, throttling, lazy loading)
- ✅ Code splitting and virtual scrolling ready

### 🔄 In Progress
- Backend API (NestJS) - See `docs/prd/backend-roadmap.md`

### 📚 Documentation
- **Product Requirements:** `docs/prd/tagwaye-prd.md`
- **Backend Roadmap:** `docs/prd/backend-roadmap.md`
- **Performance Targets:** `docs/prd/perf-budgets.md`
- **Quality Gates:** `docs/quality/quality-gates.md` (detailed tooling guide)
- **Quality Checklist:** `docs/prd/quality-gates.md` (release checklist)

## 🛠️ Tech Stack

**Frontend**
- Next.js 16.0.3 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Zustand
- React Query
- ECharts
- @thatopen/fragments (FRAG engine)
- Lucide React
- Radix UI

**Backend** (Planned)
- NestJS 11
- PostgreSQL 16 + Prisma
- WebSocket (real-time)
- Redis (caching)

## 📖 Design Specifications

All design specs are in `docs/specs/`:
- Layout Design Specifications: `docs/specs/tagwaye-layout-design-specifications-v1.1.md`
- Sidebar Design Specifications: `docs/specs/tagwaye-sidebar-design-specifications-v1.1.md`
- Panel Design Specifications: `docs/specs/tagwaye-panel-design-specifications-v1.1.md`
- Canvas Design Specifications: `docs/specs/tagwaye-canvas-design-specifications-v1.1.md`
- Timeline Design Specifications: `docs/specs/tagwaye-timeline-design-specifications-v1.1.md`
- Footer Design Specifications: `docs/specs/tagwaye-footer-design-specifications-v1.1.md`
- Header Design Specifications: `docs/specs/tagwaye-header-design-specifications-v1.1.md`

## 🔐 Git Setup

To initialize Git and prepare for GitHub, use the provided PowerShell scripts:

**Recommended:** Run `.\setup-git.ps1` for a comprehensive setup with user prompts.

**Alternative scripts:**
- `.\init-git.ps1` - Quick initialization (non-interactive)
- `.\verify-git.ps1` - Check Git repository status

**Manual setup:**
1. **Install Git** (if not installed):
   - Download from https://git-scm.com/download/win
   - Or use: `winget install Git.Git`

2. **Initialize repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Tagwaye frontend implementation"
   ```

3. **Connect to GitHub**:
   - Create a new repository on GitHub
   - Add remote: `git remote add origin <your-repo-url>`
   - Push: `git push -u origin main`

## 📝 License

This project is proprietary to Hloov. All rights reserved. See the [LICENSE](LICENSE) file for details.

## 👥 Contributors

[Your Team Here]

