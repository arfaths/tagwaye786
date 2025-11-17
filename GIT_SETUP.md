# Git Setup Guide

This guide will help you initialize Git and prepare the repository for GitHub.

## Step 1: Install Git (if needed)

If Git is not installed on your system:

**Windows:**
- Download from https://git-scm.com/download/win
- Or use: `winget install Git.Git`
- Or use: `choco install git`

**Verify installation:**
```bash
git --version
```

## Step 2: Initialize Git Repository

From the project root (`C:\Users\suhai\_Projects\2Twinsv8`):

```bash
# Initialize Git
git init

# Configure your identity (if not already set globally)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Step 3: Stage and Commit Files

```bash
# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: Tagwaye frontend implementation

- Complete six-zone layout (Header, Sidebar, Main, Panel, Timeline, Footer)
- All chrome components with Framer Motion animations
- Zustand state management with localStorage persistence
- React Query data layer with mock APIs
- Timeline with ECharts visualizations
- Command palette (Cmd+K)
- Theme switching support
- Storybook setup
- Performance budgets documented
- Backend roadmap prepared"
```

## Step 4: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `tagwaye` (or your preferred name)
3. Description: "Decision intelligence platform for the built environment"
4. Choose Public or Private
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 5: Connect Local Repository to GitHub

```bash
# Add remote (replace with your actual repository URL)
git remote add origin https://github.com/YOUR_USERNAME/tagwaye.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 6: Set Up Branch Protection (Optional but Recommended)

1. Go to your GitHub repository
2. Settings → Branches
3. Add rule for `main` branch:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date

## Step 7: Add GitHub Actions (Optional)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd apps/tagwaye-portal && npm ci
      - run: cd apps/tagwaye-portal && npm run lint
      - run: cd apps/tagwaye-portal && npm run build
```

## Current Git Status

After running the commands above, you should see:

```
✓ .gitignore created at root
✓ All source files ready to commit
✓ Documentation in place
```

## Next Steps After Git Setup

1. **Create feature branches** for new work:
   ```bash
   git checkout -b feature/backend-api
   ```

2. **Regular commits** with meaningful messages:
   ```bash
   git add .
   git commit -m "feat: add timeline scrubber functionality"
   ```

3. **Push regularly**:
   ```bash
   git push origin feature/backend-api
   ```

## Troubleshooting

**Git not found:**
- Ensure Git is installed and in your PATH
- Restart terminal after installation

**Authentication issues:**
- Use Personal Access Token (Settings → Developer settings → Personal access tokens)
- Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

**Large files:**
- If you need to track large files, consider Git LFS:
  ```bash
  git lfs install
  git lfs track "*.frag"
  ```

