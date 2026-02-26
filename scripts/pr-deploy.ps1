# PR-Based Deploy Script for dev-portfolio
# Creates a PR from versioning → main for production deploy
# Usage: .\scripts\pr-deploy.ps1 -Title "feat: new calendar feature"

param(
    [Parameter(Mandatory = $false)]
    [string]$Title = "Deploy: updates from versioning",

    [Parameter(Mandatory = $false)]
    [string]$Body = "Automated PR for production deployment."
)

$ErrorActionPreference = "Stop"

Write-Host "`n🔀 PR-Based Deployment" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

# Get current directory
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Ensure we're on versioning
$currentBranch = git branch --show-current
if ($currentBranch -ne "versioning") {
    Write-Host "⚠️  Not on versioning. Switching..." -ForegroundColor Yellow
    git checkout versioning
}

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "`n💾 Uncommitted changes detected. Committing..." -ForegroundColor Yellow
    git add .
    $commitMsg = "chore: pre-deploy save - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git commit -m $commitMsg
    Write-Host "✅ Changes committed" -ForegroundColor Green
}

# Push versioning
Write-Host "`n☁️  Pushing versioning to remote..." -ForegroundColor Yellow
git push origin versioning
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Push failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Pushed to remote" -ForegroundColor Green

# Create PR using GitHub CLI
Write-Host "`n📝 Creating Pull Request..." -ForegroundColor Yellow

$prExists = gh pr list --head versioning --base main --json number --jq '.[0].number' 2>$null
if ($prExists) {
    Write-Host "ℹ️  PR #$prExists already exists" -ForegroundColor Cyan
    Write-Host "🔗 https://github.com/matheusmendes720/dev-portfolio/pull/$prExists" -ForegroundColor Cyan
}
else {
    gh pr create `
        --title $Title `
        --body $Body `
        --base main `
        --head versioning

    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create PR. Do you have 'gh' CLI installed?" -ForegroundColor Red
        Write-Host "Install: winget install --id GitHub.cli" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ PR created!" -ForegroundColor Green
}

Write-Host "`n✨ PR Deploy Flow Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. GitHub Actions CI will run (lint → build → test)" -ForegroundColor White
Write-Host "  2. Netlify will create a Deploy Preview" -ForegroundColor White
Write-Host "  3. Review the Deploy Preview URL" -ForegroundColor White
Write-Host "  4. Merge the PR → triggers production deploy" -ForegroundColor White
Write-Host "================================" -ForegroundColor Cyan
