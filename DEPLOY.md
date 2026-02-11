# 🚀 Fast Deployment Guide

## Quick Deploy (Recommended)

For rapid deployment from development to production:

```powershell
# Quick save your current work
.\scripts\quick-save.ps1 "What changed"

# Fast deploy to production
.\scripts\deploy.ps1 -Message "Deploy: new feature"
```

That's it! The script handles everything:

- ✅ Commits any uncommitted changes
- ✅ Runs build test
- ✅ Merges versioning → main
- ✅ Pushes to production (triggers Netlify)
- ✅ Logs to LEARNING_LOG.md
- ✅ Creates backup tags

**Or use the workflow command:**

```powershell
# To follow the manual step-by-step workflow
# See .agent/workflows/deploy.md
```

---

# CI/CD pipeline — Remote repo → Netlify

## 1. Create the remote repo

- **GitHub:** [github.com/new](https://github.com/new)  
  - Repository name: e.g. `dev-portfolio`  
  - Visibility: Public (or Private; Netlify supports both)  
  - Do **not** add README / .gitignore (you already have them)  
  - Create, then copy the repo URL (e.g. `https://github.com/YOUR_USER/dev-portfolio.git`)

## 2. Add remote and push

From the project root (`dev-portfolio/`):

```bash
# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USER/dev-portfolio.git

# Push main and versioning
git push -u origin main
git push -u origin versioning
```

Use SSH if you prefer: `git@github.com:YOUR_USER/dev-portfolio.git`

## 3. Connect repo to Netlify

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
2. **Connect to Git provider** → choose GitHub → authorize.
3. **Pick repository** → select `dev-portfolio` (or the repo you created).
4. **Build settings** (Netlify reads `netlify.toml` from the repo):
   - Build command: `npm run build` (or leave blank; `netlify.toml` sets it).
   - Publish directory: `dist`.
   - Branch to deploy: `main` (or `versioning` if you deploy from that branch).
5. **Deploy site**.

After this, every **push** to the deploy branch triggers a build and deploy (full pipeline).

## 4. Optional: branch deploys

- In Netlify: **Site settings** → **Build & deploy** → **Continuous deployment** → **Branch deploys**: enable and choose branches (e.g. `main`, `versioning`) if you want previews per branch.

## Summary

| Step              | Action |
|-------------------|--------|
| Remote repo       | Create on GitHub, then `git remote add origin <url>` and `git push -u origin main` (and `versioning` if needed). |
| Netlify           | Import project from Git → select repo → deploy; build uses `netlify.toml`. |
| Pipeline          | Push to deploy branch → Netlify builds (`npm run build`) → publishes `dist/`. |
