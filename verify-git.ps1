# Verify Git Setup
Write-Host "=== Git Repository Status ===" -ForegroundColor Cyan
Write-Host ""

if (Test-Path .git) {
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
    
    $machinePath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
    $userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
    $env:Path = $machinePath + ";" + $userPath
    
    if (Get-Command git -ErrorAction SilentlyContinue) {
        $gitCmd = "git"
    } else {
        $gitCmd = "C:\Program Files\Git\bin\git.exe"
    }
    
    Write-Host ""
    Write-Host "Repository Status:" -ForegroundColor Yellow
    & $gitCmd status --short
    
    Write-Host ""
    Write-Host "Recent Commits:" -ForegroundColor Yellow
    & $gitCmd log --oneline -5
    
    Write-Host ""
    Write-Host "Branch:" -ForegroundColor Yellow
    & $gitCmd branch
    
} else {
    Write-Host "✗ Git repository not found" -ForegroundColor Red
    Write-Host "Run .\init-git.ps1 to initialize" -ForegroundColor Yellow
}

