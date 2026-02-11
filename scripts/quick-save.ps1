# Quick Save Script for dev-portfolio
# Quickly commit and push current work to versioning branch

param(
    [Parameter(Mandatory=$true)]
    [string]$Message,
    
    [Parameter(Mandatory=$false)]
    [switch]$NoPush = $false
)

$ErrorActionPreference = "Stop"

Write-Host "💾 Quick Save" -ForegroundColor Cyan
Write-Host "=============" -ForegroundColor Cyan

# Get current directory
$projectRoot = Split-Path -Parent $PSScriptRoot

# Change to project directory
Set-Location $projectRoot

# Get current branch
$currentBranch = git branch --show-current

Write-Host "`n📍 Current branch: $currentBranch" -ForegroundColor Yellow

# Check if on versioning or a versioning/* branch
if (-not ($currentBranch -match "^versioning")) {
    Write-Host "⚠️  You're not on a versioning branch!" -ForegroundColor Yellow
    Write-Host "Current branch: $currentBranch" -ForegroundColor Yellow
    $response = Read-Host "Continue anyway? (y/n)"
    if ($response -ne "y") {
        Write-Host "❌ Aborted" -ForegroundColor Red
        exit 1
    }
}

# Check if there are changes to commit
$status = git status --porcelain
if (-not $status) {
    Write-Host "ℹ️  No changes to save" -ForegroundColor Yellow
    exit 0
}

# Show what will be committed
Write-Host "`n📝 Changes to be committed:" -ForegroundColor Yellow
git status --short

# Stage all changes
Write-Host "`n➕ Staging all changes..." -ForegroundColor Yellow
git add .

# Determine commit type from message
$commitType = "feat"
if ($Message -match "^(feat|fix|docs|style|refactor|test|chore):") {
    $commitMessage = $Message
} else {
    # Auto-detect type
    if ($Message -match "bug|fix|error") {
        $commitType = "fix"
    } elseif ($Message -match "doc|readme|comment") {
        $commitType = "docs"
    } elseif ($Message -match "style|css|ui|design") {
        $commitType = "style"
    } elseif ($Message -match "test") {
        $commitType = "test"
    } elseif ($Message -match "refactor|clean|organize") {
        $commitType = "refactor"
    } elseif ($Message -match "deploy|build|config") {
        $commitType = "chore"
    }
    
    $commitMessage = "${commitType}: $Message"
}

# Commit
Write-Host "`n💾 Committing..." -ForegroundColor Yellow
git commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Commit failed" -ForegroundColor Red
    exit 1
}

$commitHash = git rev-parse --short HEAD
Write-Host "✅ Committed: $commitHash" -ForegroundColor Green

# Push to remote unless --NoPush flag is set
if (-not $NoPush) {
    Write-Host "`n☁️  Pushing to remote..." -ForegroundColor Yellow
    git push origin $currentBranch
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Failed to push. You can push manually later with:" -ForegroundColor Yellow
        Write-Host "  git push origin $currentBranch" -ForegroundColor White
    } else {
        Write-Host "✅ Pushed to remote" -ForegroundColor Green
    }
}

# Add entry to learning log if it's a significant change
if ($Message -notmatch "wip|temp|minor|typo") {
    $logEntry = @"

### $(Get-Date -Format "MMMM dd, yyyy - hh:mm tt")

**Type**: LEARNING  
**Description**: $commitMessage

**Commit**: [$commitHash](https://github.com/matheusmendes720/dev-portfolio/commit/$commitHash)  
**Branch**: $currentBranch

---
"@

    Add-Content -Path "LEARNING_LOG.md" -Value $logEntry
    Write-Host "`n📄 Logged to LEARNING_LOG.md" -ForegroundColor Cyan
}

Write-Host "`n✨ Quick save complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Cyan
Write-Host "📝 Message: $commitMessage" -ForegroundColor White
Write-Host "🔗 Commit: $commitHash" -ForegroundColor White
Write-Host "🌿 Branch: $currentBranch" -ForegroundColor White
Write-Host "==================" -ForegroundColor Cyan
