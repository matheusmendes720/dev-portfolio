# Fast Deployment Script for dev-portfolio
# Deploys from versioning branch to main (production)

param(
    [Parameter(Mandatory=$false)]
    [string]$Message = "Deploy: updates from versioning",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild = $false
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Fast Deployment Script" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# Get current directory
$projectRoot = Split-Path -Parent $PSScriptRoot

# Change to project directory
Set-Location $projectRoot

# Get current branch
$currentBranch = git branch --show-current

Write-Host "`n📍 Current branch: $currentBranch" -ForegroundColor Yellow

# Ensure we're on versioning branch
if ($currentBranch -ne "versioning") {
    Write-Host "⚠️  Not on versioning branch. Switching..." -ForegroundColor Yellow
    git checkout versioning
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to switch to versioning branch" -ForegroundColor Red
        exit 1
    }
}

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "`n💾 Uncommitted changes detected. Committing..." -ForegroundColor Yellow
    git add .
    $commitMsg = "chore: auto-save before deployment - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git commit -m $commitMsg
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to commit changes" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Changes committed" -ForegroundColor Green
}

# Run build test unless skipped
if (-not $SkipBuild) {
    Write-Host "`n🔨 Running build test..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed! Deployment aborted." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Build successful" -ForegroundColor Green
}

# Push versioning to remote (backup)
Write-Host "`n☁️  Pushing versioning branch to remote..." -ForegroundColor Yellow
git push origin versioning
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Warning: Failed to push versioning branch to remote" -ForegroundColor Yellow
}

if ($DryRun) {
    Write-Host "`n🔍 DRY RUN MODE - No changes will be made to main branch" -ForegroundColor Magenta
    Write-Host "Would execute:" -ForegroundColor Magenta
    Write-Host "  1. Switch to main branch" -ForegroundColor White
    Write-Host "  2. Merge versioning with message: '$Message'" -ForegroundColor White
    Write-Host "  3. Push to origin main (triggers Netlify deployment)" -ForegroundColor White
    Write-Host "  4. Switch back to versioning" -ForegroundColor White
    exit 0
}

# Create backup tag before deployment
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupTag = "backup-before-deploy-$timestamp"
Write-Host "`n🏷️  Creating backup tag: $backupTag" -ForegroundColor Yellow
git tag $backupTag
git push origin $backupTag

# Switch to main
Write-Host "`n🔄 Switching to main branch..." -ForegroundColor Yellow
git checkout main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to switch to main branch" -ForegroundColor Red
    git checkout versioning
    exit 1
}

# Pull latest main (in case there were remote changes)
Write-Host "📥 Pulling latest main from remote..." -ForegroundColor Yellow
git pull origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Warning: Failed to pull latest main" -ForegroundColor Yellow
}

# Merge versioning into main
Write-Host "`n🔀 Merging versioning into main..." -ForegroundColor Yellow
git merge versioning -m $Message
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Merge failed! Resolving conflicts..." -ForegroundColor Red
    Write-Host "Please resolve conflicts manually, then run:" -ForegroundColor Yellow
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m '$Message'" -ForegroundColor White
    Write-Host "  git push origin main" -ForegroundColor White
    Write-Host "  git checkout versioning" -ForegroundColor White
    exit 1
}

# Push to production
Write-Host "`n🚀 Pushing to production (triggers Netlify deployment)..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push to main. Deployment incomplete." -ForegroundColor Red
    git checkout versioning
    exit 1
}

Write-Host "✅ Successfully pushed to production!" -ForegroundColor Green

# Return to versioning
Write-Host "`n🔙 Returning to versioning branch..." -ForegroundColor Yellow
git checkout versioning

# Log to learning log
$logEntry = @"

### $(Get-Date -Format "MMMM dd, yyyy - hh:mm tt")

**Type**: DEPLOY  
**Description**: $Message

**Outcome**: Success ✅

**Commits**: $(git rev-parse --short HEAD)  
**Deployed to**: Production (main branch)  
**Backup Tag**: $backupTag

---
"@

Add-Content -Path "LEARNING_LOG.md" -Value $logEntry

Write-Host "`n✨ Deployment Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host "📄 Logged to LEARNING_LOG.md" -ForegroundColor Cyan
Write-Host "🌐 Check Netlify: https://app.netlify.com" -ForegroundColor Cyan
Write-Host "🏷️  Backup created: $backupTag" -ForegroundColor Cyan
Write-Host "⏪ Rollback command: git reset --hard $backupTag" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
