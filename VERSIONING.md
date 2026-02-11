# Versioning branch

This project uses a **versioning** branch so you can try several custom variants without losing the main line.

## Branches

| Branch       | Use |
|-------------|-----|
| **main**    | Stable / baseline (last known good). |
| **versioning** | Active branch for custom experiments. Create feature branches from here for each custom (e.g. `versioning/custom-dark`, `versioning/custom-minimal`). |

## Workflow

- **Run current custom (on versioning):**  
  `npm run dev` — you're already on `versioning`.

- **Start a new custom variant:**  
  From `versioning`, create a branch and switch to it:

  ```bash
  git checkout -b versioning/custom-<name>
  ```

  Then make your changes and commit. Merge back to `versioning` when you want to keep them, or keep the branch as a separate variant.

- **Reset to baseline:**  
  `git checkout main` — gets you back to the state before versioning.

- **Update versioning from main:**  
  If you fix something on `main` and want it on versioning:

  ```bash
  git checkout versioning
  git merge main
  ```

## Fast Deployment to Production

When your experiments on `versioning` are ready for production:

```powershell
# Automated deployment (recommended)
.\scripts\deploy.ps1 -Message "Deploy: what's new"

# Manual deployment
git checkout main
git merge versioning -m "Deploy: description"
git push origin main  # Triggers Netlify
git checkout versioning
```

All deployments are logged in `LEARNING_LOG.md` for historical tracking.

See [DEPLOY.md](DEPLOY.md) for full deployment guide.

## Quick reference

```bash
# Quick save current work
.\scripts\quick-save.ps1 "What changed"

# Branch operations
git branch -a              # list branches
git checkout versioning    # work on customs
git checkout main         # back to baseline

# Deploy to production
.\scripts\deploy.ps1 -Message "Deploy: updates"
```

📖 **More Git commands**: See [GIT_QUICK_COMMANDS.md](GIT_QUICK_COMMANDS.md)
