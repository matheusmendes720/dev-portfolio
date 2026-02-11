---
description: Fast deploy from versioning to production
---

# Fast Deploy to Production

This workflow deploys your current work from the `versioning` branch to `main` (production), triggering automatic Netlify deployment.

## Prerequisites

- You must be on the `versioning` branch
- All changes should be committed (or will be auto-committed)
- Build must pass successfully

## Steps

1. **Ensure you're on versioning branch**

   ```powershell
   git checkout versioning
   ```

2. **Save current work (if uncommitted changes)**

   ```powershell
   .\scripts\quick-save.ps1 "Pre-deploy save: [describe changes]"
   ```

3. **Run build test**
   // turbo

   ```powershell
   npm run build
   ```

4. **Push versioning to remote (backup)**
   // turbo

   ```powershell
   git push origin versioning
   ```

5. **Switch to main and merge versioning**

   ```powershell
   git checkout main
   git merge versioning -m "Deploy: [describe what's being deployed]"
   ```

6. **Push to production (triggers Netlify)**

   ```powershell
   git push origin main
   ```

7. **Return to versioning branch**
   // turbo

   ```powershell
   git checkout versioning
   ```

8. **Log the deployment**

   ```powershell
   .\scripts\log-learning.ps1 "Deployed [feature/fix] to production"
   ```

## Quick Deploy (All-in-One)

Use the automated script for instant deployment:

```powershell
.\scripts\deploy.ps1 -Message "Deploy: [describe changes]"
```

## Rollback if Needed

If something goes wrong:

```powershell
# On main branch
git reset --hard HEAD~1
git push origin main --force
```

## Verify Deployment

1. Check Netlify dashboard: <https://app.netlify.com>
2. Visit production site
3. Verify changes are live
