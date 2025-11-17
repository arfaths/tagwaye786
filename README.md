# Tagwaye - Decision Intelligence Platform

A full-stack decision intelligence platform for the built environment, powered by AI-enhanced digital twins called LivingTwins. This monorepo contains the frontend portal and will include the backend API.

## 🏗️ Project Structure

```
2Twinsv8/
├── apps/
│   └── tagwaye-portal/          # Next.js frontend application
├── docs/                         # Documentation (PRD, roadmaps, specs)
├── References/                   # Design specification documents
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

### ✅ Completed
- Six-zone CSS Grid layout (Header, Sidebar, Main, Panel, Timeline, Footer)
- All chrome components with Framer Motion animations
- Zustand state management with localStorage persistence
- React Query data layer with mock APIs
- Timeline with ECharts visualizations
- Command palette (Cmd+K)
- Theme switching (Auto/Light/Dark)
- Storybook setup with Timeline story
- Performance budgets documented

### 🔄 In Progress
- Backend API (NestJS) - See `docs/prd/backend-roadmap.md`

### 📚 Documentation
- `docs/prd/tagwaye-prd.md` - Product requirements
- `docs/prd/backend-roadmap.md` - Backend implementation plan
- `docs/prd/perf-budgets.md` - Performance targets
- `apps/tagwaye-portal/IMPLEMENTATION_SUMMARY.md` - Frontend details

## 🛠️ Tech Stack

**Frontend**
- Next.js 15 (App Router)
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

All design specs are in `References/`:
- Layout Design Specifications
- Sidebar Design Specifications
- Panel Design Specifications
- Canvas Design Specifications
- Timeline Design Specifications
- Footer Design Specifications

## 🔐 Git Setup

To initialize Git and prepare for GitHub:

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

[Your License Here]

## 👥 Contributors

[Your Team Here]

