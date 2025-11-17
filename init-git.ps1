# Quick Git Initialization Script
# Run: .\init-git.ps1

Write-Host "Initializing Git repository..." -ForegroundColor Cyan

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Try to find Git
$gitCmd = $null
if (Get-Command git -ErrorAction SilentlyContinue) {
    $gitCmd = "git"
} else {
    $commonPaths = @(
        "C:\Program Files\Git\bin\git.exe",
        "C:\Program Files (x86)\Git\bin\git.exe",
        "$env:LOCALAPPDATA\Programs\Git\bin\git.exe"
    )
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            $gitCmd = $path
            break
        }
    }
}

if (-not $gitCmd) {
    Write-Host "ERROR: Git not found. Please restart your terminal after installing Git." -ForegroundColor Red
    exit 1
}

# Initialize if needed
if (-not (Test-Path .git)) {
    if ($gitCmd -eq "git") {
        git init | Out-Null
    } else {
        & $gitCmd init | Out-Null
    }
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git repository already exists" -ForegroundColor Yellow
}

# Stage all files
Write-Host "Staging files..." -ForegroundColor Cyan
if ($gitCmd -eq "git") {
    git add .
} else {
    & $gitCmd add .
}
Write-Host "✓ Files staged" -ForegroundColor Green

# Create commit
Write-Host "Creating initial commit..." -ForegroundColor Cyan
$commitMsg = @"
Initial commit: Tagwaye frontend implementation

- Complete six-zone layout
- All chrome components with animations
- Zustand state management
- React Query data layer
- Timeline with ECharts
- Command palette
- Theme switching
- Storybook setup
- Performance budgets documented
- Backend roadmap prepared
"@

if ($gitCmd -eq "git") {
    git commit -m $commitMsg
} else {
    & $gitCmd commit -m $commitMsg
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Initial commit created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next: Create GitHub repo and run:" -ForegroundColor Yellow
    Write-Host "  git remote add origin <your-repo-url>" -ForegroundColor White
    Write-Host "  git branch -M main" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor White
} else {
    Write-Host "⚠ Commit may have failed. Check if Git user is configured:" -ForegroundColor Yellow
    Write-Host "  git config user.name 'Your Name'" -ForegroundColor White
    Write-Host "  git config user.email 'your.email@example.com'" -ForegroundColor White
}

