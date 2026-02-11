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

## Quick reference

```bash
git branch -a              # list branches
git checkout versioning    # work on customs
git checkout main         # back to baseline
```
