# Tagwaye Portal

The frontend application for the Tagwaye Decision Intelligence Platform.

> **Note:** For complete project documentation, see the [root README](../../README.md).

## Quick Start

From the project root:

```bash
npm run dev
```

Or from this directory:

```bash
cd apps/tagwaye-portal
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run storybook` - Launch Storybook
- `npm run build-storybook` - Build Storybook for static hosting

## Tech Stack

- **Framework:** Next.js 16.0.3 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Data Fetching:** React Query (TanStack Query)
- **3D Rendering:** @thatopen/fragments (FRAG engine), Three.js
- **Charts:** ECharts
- **Icons:** Lucide React
- **Components:** Radix UI

## Project Structure

```
apps/tagwaye-portal/
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   ├── components/       # React components
│   │   ├── chrome/       # Layout chrome (Header, Sidebar, Footer, etc.)
│   │   ├── canvas/      # 3D canvas components
│   │   ├── panel/       # Panel drawer system
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   ├── state/           # Zustand stores
│   ├── utils/           # Utility functions
│   └── styles/          # Global styles and design tokens
├── public/              # Static assets
└── src/stories/         # Storybook stories
```

## Development

This is a Next.js application using the App Router. Key features:

- **Six-zone layout** with CSS Grid
- **Design token system** (zero hardcoded values)
- **Accessibility** - WCAG 2.1 Level AA compliant
- **Performance** - 60fps animations, optimized rendering

For detailed documentation, see the [root README](../../README.md).
