# 🚀 Git Quick Commands Cheatsheet

Quick reference for common Git operations in this project.

---

## 📍 Check Current Status

```powershell
# Where am I?
git status

# What branch am I on?
git branch

# What's changed?
git diff

# View commit history
git log --oneline -10
```

---

## 🔄 Branch Operations

```powershell
# Switch to versioning (development)
git checkout versioning

# Switch to main (production)
git checkout main

# Create new experiment branch
git checkout -b versioning/custom-[name]

# List all branches (local + remote)
git branch -a

# Delete local branch
git branch -d versioning/custom-[name]
```

---

## 💾 Save Your Work

```powershell
# Quick save with automated script
.\scripts\quick-save.ps1 "What I changed"

# Manual save
git add .
git commit -m "type: description"

# Push to remote
git push origin versioning
```

**Commit Types:**

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting, styling
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## 🚢 Deploy to Production

```powershell
# Automated deployment
.\scripts\deploy.ps1 -Message "Deploy: what's new"

# Manual deployment
git checkout main
git merge versioning -m "Deploy: description"
git push origin main
git checkout versioning
```

---

## ⏪ Undo & Reset

```powershell
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Discard local changes (not committed)
git restore .

# Discard specific file
git restore [filename]

# Rollback production
git checkout main
git reset --hard HEAD~1
git push origin main --force
```

---

## 🔍 View Changes

```powershell
# See what changed in specific commit
git show [commit-hash]

# Compare branches
git diff versioning main

# View file history
git log --follow [filename]

# Who changed this line?
git blame [filename]
```

---

## 🌐 Remote Operations

```powershell
# View remotes
git remote -v

# Fetch latest from remote (doesn't merge)
git fetch origin

# Pull latest from remote (fetches + merges)
git pull origin versioning

# Push all branches
git push --all origin

# Push and set upstream
git push -u origin [branch-name]
```

---

## 🔧 Merge & Conflicts

```powershell
# Merge another branch into current
git merge [branch-name]

# Abort merge if conflicts
git merge --abort

# After resolving conflicts manually
git add .
git commit -m "Merge: resolved conflicts"
```

---

## 🏷️ Tags (for releases)

```powershell
# Create tag
git tag -a v1.0.0 -m "Version 1.0.0"

# Push tags to remote
git push origin --tags

# List tags
git tag

# Delete tag
git tag -d v1.0.0
```

---

## 🆘 Help & Info

```powershell
# Get help on any command
git help [command]
git [command] --help

# View config
git config --list

# Set user info (first time setup)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

---

## 🎯 This Project's Workflow

### Daily Development

1. `git checkout versioning` - Start work on dev branch
2. Make changes
3. `.\scripts\quick-save.ps1 "what changed"` - Save work
4. `npm run dev` - Test locally

### Deploy to Production  

1. `git checkout versioning` - Ensure on dev branch
2. `npm run build` - Verify build works
3. `.\scripts\deploy.ps1 -Message "Deploy: new feature"` - Auto-deploy
4. Check Netlify dashboard

### Experiment with New Ideas

1. `git checkout -b versioning/custom-[experiment]` - New branch
2. Make experimental changes
3. `git add . && git commit -m "experiment: trying X"`
4. If good: `git checkout versioning && git merge versioning/custom-[experiment]`
5. If bad: `git checkout versioning && git branch -d versioning/custom-[experiment]`

---

## 📖 Learn More

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Git Branching Strategies](https://www.atlassian.com/git/tutorials/comparing-workflows)
