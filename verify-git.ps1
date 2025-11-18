<#
.SYNOPSIS
    Git repository status verification script for Tagwaye project.

.DESCRIPTION
    This script checks the current status of the Git repository without making
    any changes. Use this to verify your Git setup or check repository state.

.PARAMETER None
    This script takes no parameters.

.EXAMPLE
    .\verify-git.ps1

.NOTES
    - Read-only script (no changes made)
    - Shows repository status, recent commits, and current branch
    - Useful for verifying setup after running init-git.ps1 or setup-git.ps1
    - For initial setup, use setup-git.ps1 (recommended) or init-git.ps1

#>
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

