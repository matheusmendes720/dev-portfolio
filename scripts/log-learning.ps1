# Learning Log Helper Script
# Adds a manual entry to the learning log

param(
    [Parameter(Mandatory = $true)]
    [string]$Description,
    
    [Parameter(Mandatory = $false)]
    [ValidateSet("DEPLOY", "EXPERIMENT", "BUG", "LEARNING", "FEATURE")]
    [string]$Type = "LEARNING",
    
    [Parameter(Mandatory = $false)]
    [string]$Outcome = "In Progress ⏳",
    
    [Parameter(Mandatory = $false)]
    [string]$Lessons = ""
)

$ErrorActionPreference = "Stop"

# Get current directory
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Get current commit and branch
$commitHash = git rev-parse --short HEAD 2>$null
$currentBranch = git branch --show-current 2>$null

if (-not $commitHash) {
    $commitHash = "N/A"
}

if (-not $currentBranch) {
    $currentBranch = "N/A"
}

# Build log entry
$logEntry = @"

### $(Get-Date -Format "MMMM dd, yyyy - hh:mm tt")

**Type**: $Type  
**Description**: $Description

**Outcome**: $Outcome

"@

if ($Lessons) {
    $logEntry += @"
**Lessons Learned**:
$Lessons

"@
}

$logEntry += @"
**Commit**: [$commitHash](https://github.com/matheusmendes720/dev-portfolio/commit/$commitHash)  
**Branch**: $currentBranch

---
"@

# Append to learning log
Add-Content -Path "LEARNING_LOG.md" -Value $logEntry

Write-Host "✨ Entry added to LEARNING_LOG.md" -ForegroundColor Green
Write-Host "Type: $Type" -ForegroundColor Cyan
Write-Host "Description: $Description" -ForegroundColor White
