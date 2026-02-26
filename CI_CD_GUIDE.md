# 🚀 CI/CD Pipeline Guide — dev-portfolio

A comprehensive reference for the deployment infrastructure of this project.
Study this document alongside the actual config files to understand industry-grade CI/CD practices.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Branch Strategy](#branch-strategy)
3. [GitHub Actions Pipeline](#github-actions-pipeline)
4. [Netlify Configuration](#netlify-configuration)
5. [Deploy Workflows](#deploy-workflows)
6. [Security Headers](#security-headers)
7. [Rollback Procedures](#rollback-procedures)
8. [Reading Test Reports](#reading-test-reports)
9. [File Reference](#file-reference)

---

## Architecture Overview

```
  Local Dev (versioning)
       │
       │ git push
       ▼
  ┌─────────────────────────────────────────────┐
  │  GitHub Repository                          │
  │  matheusmendes720/dev-portfolio             │
  │                                             │
  │  Branches:                                  │
  │    main ──────── Production                 │
  │    versioning ── Development / Staging       │
  └───────┬──────────────────┬──────────────────┘
          │                  │
          │ webhook          │ webhook
          ▼                  ▼
  ┌──────────────┐   ┌──────────────────┐
  │ GitHub       │   │ Netlify          │
  │ Actions      │   │ Build & Deploy   │
  │              │   │                  │
  │ 1. 🔍 Lint   │   │ main → prod     │
  │ 2. 🔨 Build  │   │ versioning →    │
  │ 3. 🧪 Test   │   │   branch preview │
  │              │   │ PR → deploy      │
  │ Status ────► │   │   preview        │
  └──────────────┘   └──────────────────┘
```

### Why Two Systems?

| System | Purpose | Runs |
|--------|---------|------|
| **GitHub Actions** | Quality gate — lint, build, test | On every push and PR |
| **Netlify** | Build & host — deploy the site | On push to `main` or `versioning` |

They are **independent and parallel**. GitHub Actions validates code quality; Netlify builds and serves the site. Both trigger on a git push.

---

## Branch Strategy

We use a simplified **Git Flow Lite** model:

```
   versioning (active development)
       │
       │  PR (with CI checks + deploy preview)
       ▼
   main (production — auto-deploys to Netlify)
```

### Rules

| Rule | Implementation |
|------|----------------|
| Never push directly to `main` | Use PRs from `versioning` → `main` |
| All PRs must pass CI | GitHub Actions runs lint, build, test |
| Preview before merge | Netlify creates a deploy preview on every PR |
| Tag before deploy | `deploy.ps1` creates backup tags automatically |

---

## GitHub Actions Pipeline

**File**: `.github/workflows/ci.yml`

### 3-Stage Pipeline

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│ 🔍 Lint  │     │ 🔨 Build │────►│ 🧪 Test  │
│ (5 min)  │     │ (10 min) │     │ (15 min) │
│          │     │          │     │          │
│ ESLint   │     │ Vite     │     │ Playwright│
│          │     │ → dist/  │     │ 40 tests │
└─────────┘     └─────────┘     └─────────┘
  parallel        parallel        sequential
                  uploads          downloads
                  artifact         artifact
```

- **Lint** and **Build** run in parallel (no dependency)
- **Test** waits for **Build** (needs the `dist/` artifact)
- **Concurrency**: duplicate runs on the same branch are auto-cancelled

### Key Features

- **Artifact passing**: Build uploads `dist/`, Test downloads it
- **npm cache**: Node modules are cached across runs
- **Test summary**: Results posted to GitHub Step Summary
- **Auto-cancel**: In-progress runs cancelled when new commits arrive

---

## Netlify Configuration

**File**: `netlify.toml`

### Build Contexts

Netlify supports per-branch build contexts:

| Context | Branch | Environment | URL |
|---------|--------|-------------|-----|
| Production | `main` | `NODE_ENV=production` | `dev-portfolio-7479.netlify.app` |
| Branch Deploy | `versioning` | `NODE_ENV=staging` | `versioning--dev-portfolio-7479.netlify.app` |
| Deploy Preview | PR branches | `NODE_ENV=preview` | `deploy-preview-N--dev-portfolio-7479.netlify.app` |

### Plugins

- **Lighthouse**: Auto-runs performance audits after each deploy

---

## Deploy Workflows

### Option A: Quick Deploy (Direct Merge)

```powershell
# From versioning branch
.\scripts\deploy.ps1 -Message "Deploy: description of changes"
```

This script:

1. Commits uncommitted changes
2. Runs build test
3. Creates backup tag
4. Merges `versioning` → `main`
5. Pushes `main` (triggers Netlify production deploy)
6. Returns to `versioning`
7. Logs to `LEARNING_LOG.md`

### Option B: PR Deploy (Recommended for Learning)

```powershell
# From versioning branch
.\scripts\pr-deploy.ps1 -Title "feat: new calendar feature"
```

This script:

1. Pushes `versioning` to remote
2. Creates a Pull Request (`versioning` → `main`)
3. GitHub Actions CI runs automatically
4. Netlify creates a Deploy Preview
5. You review the preview URL
6. Merge the PR → triggers production deploy

### Option C: Manual Drag & Drop

1. Run `npm run build` locally
2. Drag the `dist/` folder to Netlify's deploy area

---

## Security Headers

**File**: `netlify.toml` → `[[headers]]`

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Frame-Options` | `DENY` | Prevents clickjacking attacks |
| `X-Content-Type-Options` | `nosniff` | Blocks MIME-type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=()...` | Disables unused browser APIs |
| `Strict-Transport-Security` | `max-age=31536000...` | Forces HTTPS |
| `Content-Security-Policy` | _(see file)_ | Controls resource loading |

### Cache Strategy

| Path | Cache-Control | Reason |
|------|---------------|--------|
| `/assets/*` | `max-age=31536000, immutable` | Hashed filenames — safe to cache forever |
| `/*.html` | `max-age=0, must-revalidate` | HTML should always be fresh |

---

## Rollback Procedures

### Using Backup Tags

```bash
# List backup tags
git tag -l "backup-*"

# Rollback to a specific backup
git checkout main
git reset --hard backup-before-deploy-20260225
git push origin main --force
git checkout versioning
```

### Using Netlify

1. Go to Netlify Dashboard → Deploys
2. Find the previous working deploy
3. Click "Publish deploy" to instantly restore

---

## Reading Test Reports

### In GitHub Actions

1. Go to **Actions** tab → click the workflow run
2. Scroll to **Artifacts** section
3. Download `playwright-report` → open `index.html`

### Locally

```bash
npm run test:e2e     # runs tests + generates HTML report
```

Report location: `playwright-report/index.html`

### Test Summary on PRs

GitHub Actions posts a test summary directly in the workflow run's **Summary** tab.

---

## File Reference

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | 3-stage CI pipeline (lint → build → test) |
| `.github/workflows/deploy-notify.yml` | GitHub deployment status notifications |
| `netlify.toml` | Netlify build config, headers, caching, plugins |
| `playwright.config.js` | Playwright test config (CI vs local modes) |
| `scripts/deploy.ps1` | Quick deploy: merge versioning → main |
| `scripts/pr-deploy.ps1` | PR-based deploy with GitHub CLI |
| `tests/calendar.spec.js` | 40 BDD E2E tests across 10 suites |
| `DEPLOY.md` | Original deploy instructions |
| `CI_CD_GUIDE.md` | This file — comprehensive reference |
