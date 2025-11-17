# Tagwaye Git Setup Script
# Run this script from the project root: .\setup-git.ps1

Write-Host "=== Tagwaye Git Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
$gitInstalled = $false
$gitPath = $null

# Try to find Git
if (Get-Command git -ErrorAction SilentlyContinue) {
    $gitInstalled = $true
    $gitPath = "git"
    Write-Host "✓ Git found in PATH" -ForegroundColor Green
} else {
    # Check common installation paths
    $commonPaths = @(
        "C:\Program Files\Git\bin\git.exe",
        "C:\Program Files (x86)\Git\bin\git.exe",
        "$env:LOCALAPPDATA\Programs\Git\bin\git.exe",
        "$env:ProgramFiles\Git\cmd\git.exe"
    )
    
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            $gitInstalled = $true
            $gitPath = $path
            Write-Host "✓ Git found at: $path" -ForegroundColor Green
            break
        }
    }
}

if (-not $gitInstalled) {
    Write-Host "✗ Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Or use: winget install Git.Git" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After installing Git, restart your terminal and run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if already a git repository
if (Test-Path .git) {
    Write-Host "⚠ Git repository already initialized" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 0
    }
} else {
    # Initialize Git repository
    Write-Host "Initializing Git repository..." -ForegroundColor Cyan
    if ($gitPath -eq "git") {
        git init
    } else {
        & $gitPath init
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to initialize Git repository" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
}

Write-Host ""

# Configure Git user (if not already set)
Write-Host "Checking Git configuration..." -ForegroundColor Cyan
$userName = if ($gitPath -eq "git") { git config user.name } else { & $gitPath config user.name }
$userEmail = if ($gitPath -eq "git") { git config user.email } else { & $gitPath config user.email }

if (-not $userName -or -not $userEmail) {
    Write-Host "Git user identity not configured." -ForegroundColor Yellow
    $configure = Read-Host "Configure now? (y/n)"
    if ($configure -eq "y") {
        $name = Read-Host "Enter your name"
        $email = Read-Host "Enter your email"
        if ($gitPath -eq "git") {
            git config user.name $name
            git config user.email $email
        } else {
            & $gitPath config user.name $name
            & $gitPath config user.email $email
        }
        Write-Host "✓ Git user configured" -ForegroundColor Green
    }
} else {
    Write-Host "✓ Git user: $userName <$userEmail>" -ForegroundColor Green
}

Write-Host ""

# Stage all files
Write-Host "Staging files..." -ForegroundColor Cyan
if ($gitPath -eq "git") {
    git add .
} else {
    & $gitPath add .
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to stage files" -ForegroundColor Red
    exit 1
}

# Show status
Write-Host "Checking status..." -ForegroundColor Cyan
if ($gitPath -eq "git") {
    git status --short
} else {
    & $gitPath status --short
}

Write-Host ""

# Create initial commit
Write-Host "Creating initial commit..." -ForegroundColor Cyan
$commitMessage = @"
Initial commit: Tagwaye frontend implementation

- Complete six-zone layout (Header, Sidebar, Main, Panel, Timeline, Footer)
- All chrome components with Framer Motion animations
- Zustand state management with localStorage persistence
- React Query data layer with mock APIs
- Timeline with ECharts visualizations
- Command palette (Cmd+K)
- Theme switching support
- Storybook setup
- Performance budgets documented
- Backend roadmap prepared
"@

if ($gitPath -eq "git") {
    git commit -m $commitMessage
} else {
    & $gitPath commit -m $commitMessage
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to create commit" -ForegroundColor Red
    Write-Host "You may need to configure Git user identity first." -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Initial commit created" -ForegroundColor Green
Write-Host ""

# Show commit info
Write-Host "=== Setup Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create a repository on GitHub: https://github.com/new" -ForegroundColor White
Write-Host "2. Add remote: git remote add origin <your-repo-url>" -ForegroundColor White
Write-Host "3. Push: git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "See GIT_SETUP.md for detailed instructions." -ForegroundColor Gray

