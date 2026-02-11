# Dev Portfolio - Fast Deployment Workflow

Complete Git workflow automation for rapid development → production deployment.

## 🚀 Quick Start

### Daily Development

```powershell
# Make changes to your code...

# Quick save
.\scripts\quick-save.ps1 "Added new feature"
```

### Deploy to Production

```powershell
# One-command deployment
.\scripts\deploy.ps1 -Message "Deploy: new portfolio feature"
```

## 📁 Project Structure

```
dev-portfolio/
├── .agent/workflows/
│   └── deploy.md              # Step-by-step deployment workflow
├── scripts/
│   ├── deploy.ps1             # Automated deployment
│   ├── quick-save.ps1         # Quick commit & push
│   └── log-learning.ps1       # Manual learning log entries
├── LEARNING_LOG.md            # Your development journal
├── GIT_QUICK_COMMANDS.md      # Git cheatsheet
├── DEPLOY.md                  # Deployment guide
└── VERSIONING.md              # Branch strategy
```

## 🌿 Branch Strategy

- **`versioning`** - Development/experiments/learning
- **`main`** - Production (auto-deploys to Netlify)

## 🔧 Available Scripts

### `.\scripts\quick-save.ps1`

Quick commit and push your changes.

```powershell
# Basic usage
.\scripts\quick-save.ps1 "What I changed"

# Just commit, don't push
.\scripts\quick-save.ps1 "WIP changes" -NoPush
```

### `.\scripts\deploy.ps1`

Deploy to production with full automation.

```powershell
# Standard deployment
.\scripts\deploy.ps1 -Message "Deploy: new feature"

# Dry run (see what would happen)
.\scripts\deploy.ps1 -DryRun

# Skip build test (not recommended)
.\scripts\deploy.ps1 -SkipBuild -Message "Hotfix"
```

### `.\scripts\log-learning.ps1`

Manually add entries to your learning log.

```powershell
# Log an experiment
.\scripts\log-learning.ps1 -Description "Tried new animation library" -Type EXPERIMENT

# Log a bug fix
.\scripts\log-learning.ps1 -Description "Fixed navbar on mobile" -Type BUG -Outcome "Success ✅"
```

## 📖 Documentation

- **[GIT_QUICK_COMMANDS.md](GIT_QUICK_COMMANDS.md)** - Common Git operations
- **[LEARNING_LOG.md](LEARNING_LOG.md)** - Your development journey
- **[DEPLOY.md](DEPLOY.md)** - Full deployment guide
- **[VERSIONING.md](VERSIONING.md)** - Branch workflow details

## 🎯 Common Workflows

### Experiment with New Feature

```powershell
# Create experiment branch
git checkout -b versioning/new-feature

# Make changes...

# Quick save
.\scripts\quick-save.ps1 "Experimenting with feature X"

# If good, merge back
git checkout versioning
git merge versioning/new-feature
```

### Fix Production Bug

```powershell
# Make fix on versioning
git checkout versioning

# Fix the bug...

# Quick save
.\scripts\quick-save.ps1 "fix: resolved navbar issue"

# Fast deploy
.\scripts\deploy.ps1 -Message "Deploy: bug fix for navbar"
```

### Track Learning Progress

```powershell
# Automatic logging (via deploy/quick-save)
# - Happens automatically on saves and deploys

# Manual logging
.\scripts\log-learning.ps1 -Description "Learned about React Context" -Type LEARNING
```

## 🔄 Deployment Flow

```
Local Changes
    ↓
quick-save.ps1 (commit + push to versioning)
    ↓
npm run build (verify)
    ↓
merge versioning → main
    ↓
git push origin main
    ↓
Netlify Auto-Deploy ✨
    ↓
Production Live! 🎉
```

## 🆘 Emergency Rollback

```powershell
# Find backup tag
git tag | Select-String "backup-before-deploy"

# Rollback to it
git checkout main
git reset --hard backup-before-deploy-TIMESTAMP
git push origin main --force
```

## 📚 Learning Log

Every deployment and significant save is logged in `LEARNING_LOG.md`:

- What you tried
- What worked/failed
- Lessons learned
- Git references

This creates a **historical record** of your development journey!

## 🔗 Resources

- [Git Documentation](https://git-scm.com/doc)
- [Netlify Docs](https://docs.netlify.com)
- [GitHub Guides](https://guides.github.com)

---

**Happy coding and deploying! 🚀**
