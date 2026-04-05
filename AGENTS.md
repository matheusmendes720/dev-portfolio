# dev-portfolio — Agent Instructions

This document contains essential information for AI coding agents working on the dev-portfolio project. It covers the project architecture, build processes, code conventions, and critical implementation details.

---

## 1. Project Overview

**dev-portfolio** is a React-based portfolio website for an AI Engineer, featuring:

- A public landing page showcasing projects, skills, and background
- A secret `/contest_calendar` route for managing competitive programming and hackathon events
- A `/contest_calendar/command` Command Center for tactical mission management (Gantt charts, deliverables tracking)
- Internationalization (i18n) support for Portuguese (pt-BR) and English (EN)
- Netlify-ready deployment with CI/CD pipeline

The design aesthetic is **"dark, high-contrast, tech/terminal"** — deep black backgrounds with teal/cyan (#00d2ff) and purple (#7000ff) accents.

---

## 2. Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | React | ^19.2.0 |
| Build Tool | Vite | ^7.2.4 |
| Styling | Tailwind CSS | ^4.1.18 |
| Routing | React Router DOM | ^7.13.0 |
| i18n | i18next + react-i18next | ^25.7.4 |
| Animation | Framer Motion | ^12.34.0 |
| Gantt Charts | @svar-ui/react-gantt | ^2.6.0 |
| Calendar | FullCalendar | ^6.1.20 |
| Icons | Lucide React | ^0.562.0 |
| Testing | Playwright | ^1.58.2 |
| Linting | ESLint | ^9.39.1 |

### Key Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and npm scripts |
| `vite.config.js` | Vite build configuration with styled-jsx support |
| `tailwind.config.js` | Tailwind theme extensions (neon colors, glass effects) |
| `eslint.config.js` | ESLint rules for React Hooks and Refresh |
| `playwright.config.js` | E2E test configuration |
| `netlify.toml` | Deployment settings, security headers, redirects |
| `.env` | Environment variables for feature flags |

---

## 3. Project Structure

```
dev-portfolio/
├── src/
│   ├── components/           # React components
│   │   ├── calendar/         # Calendar-specific components (ContestCalendar)
│   │   ├── command/          # Command Center components (Gantt, Timeline)
│   │   ├── glass/            # Glassmorphism UI primitives
│   │   └── [layout comps]    # Hero, Navbar, Footer, Layout, etc.
│   ├── pages/                # Route-level page components
│   │   ├── ContestCalendar.jsx
│   │   └── CommandCenter.jsx
│   ├── context/              # React context providers
│   │   ├── SubscriptionContext.jsx      # Event subscription state
│   │   └── SubscriptionContextInternal.js
│   ├── hooks/                # Custom React hooks
│   │   ├── useSubscriptions.js
│   │   └── useTextScramble.js
│   ├── data/                 # Static data
│   │   ├── contestData.js    # EVENTS array (auto-generated)
│   │   └── competitionsData.js
│   ├── utils/                # Utility functions
│   │   ├── dateUtils.js
│   │   └── featureFlags.js
│   ├── locales/              # i18n translation files
│   │   ├── en.json
│   │   └── pt.json
│   ├── i18n.js               # i18n configuration
│   ├── index.css             # Global styles + Tailwind v4 directives
│   ├── main.jsx              # App entry point
│   └── App.jsx               # Root component with routes
├── tests/                    # Playwright E2E tests
│   ├── calendar.spec.js      # Comprehensive calendar tests
│   └── feature_flag.spec.js  # Feature flag verification
├── scripts/                  # Build/utility scripts
│   ├── deploy.ps1            # Production deployment script
│   ├── quick-save.ps1        # Quick git commit helper
│   ├── ingest_datasets.js    # CSV → contestData.js generator
│   └── [other scripts]
├── netlify/functions/        # Netlify serverless functions
│   └── sync-intel.js         # BFF intelligence endpoint
├── docs/                     # Architecture documentation
│   ├── command_center_prd.md
│   └── [other docs]
├── public/                   # Static assets
├── design-tokens.css         # CSS variables (source of truth)
└── STYLES-GUIDE.md           # Design system documentation
```

---

## 4. Build and Development Commands

```bash
# Install dependencies
npm install

# Development server (HMR on localhost:5173)
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint

# Run Playwright E2E tests
npm test
# or
npm run test:e2e        # With HTML reporter

# Quick deploy to production (PowerShell)
.\scripts\deploy.ps1 -Message "Your commit message"

# Quick save (PowerShell)
.\scripts\quick-save.ps1 "What changed"
```

---

## 5. Code Style Guidelines

### Styles (CRITICAL - Non-Negotiable)

The project has a **strict design system** defined in `STYLES-GUIDE.md` and `design-tokens.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-color` | `#030308` | Page background |
| `--text-color` | `#e0e6ed` | Primary text |
| `--accent-primary` | `#00d2ff` | Teal/cyan — CTAs, links, highlights |
| `--accent-secondary` | `#7000ff` | Deep indigo/purple — borders, glows |
| `--card-bg` | `rgba(10, 10, 18, 0.7)` | Cards, panels |
| `--border-color` | `rgba(255, 255, 255, 0.08)` | Subtle borders |
| `--font-display` | `'Syncopate', sans-serif` | Headings |
| `--font-body` | `'Space Grotesk', sans-serif` | Body text |
| `--font-mono` | `'Fira Code', monospace` | Code/mono |

**RULES:**
- **NEVER** introduce new hex/rgba colors outside the design tokens
- **NEVER** create separate themes for different pages (including `/contest_calendar`)
- Use `var(--token-name)` or Tailwind classes that map to these tokens
- All pages must share the **same** dark, tech-terminal aesthetic

### JavaScript/React Conventions

- **Type:** ES Modules (`"type": "module"` in package.json)
- **Extensions:** Use `.jsx` for React components
- **Imports:** Prefer named imports; use absolute paths from `src/`
- **Components:** Functional components with hooks
- **Props Destructuring:** Always destructure props at component level
- **Event Handlers:** Prefix with `handle` (e.g., `handleClick`)
- **Custom Hooks:** Prefix with `use` (e.g., `useSubscriptions`)

### ESLint Configuration

The project uses ESLint 9 with flat config. Key rules:

```javascript
// Ignored directories (no linting)
'dist', 'playwright-report', 'test-results', 'node_modules',
'.agent', '.agents', '.output', '.vercel', '.next', '.gemini'

// Special ignore patterns for unused vars
varsIgnorePattern: '^[A-Z_]|motion|Icon'
argsIgnorePattern: '^[A-Z_]|motion|Icon'
```

---

## 6. Testing Strategy

### E2E Tests (Playwright)

Located in `tests/` directory. Tests run against Chromium only.

| Test Suite | Coverage |
|------------|----------|
| `calendar.spec.js` | Authentication gate, layout, filters, sorting, navigation, sidebar interactions, calendar grid, right panel |
| `feature_flag.spec.js` | Feature flag verification for contest calendar and secret gate |

**Running Tests:**
```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test calendar.spec.js

# Run with UI mode for debugging
npx playwright test --ui

# Run in headed mode (visible browser)
npx playwright test --headed
```

**Test Data Attributes:**
The codebase uses `data-testid` attributes for test selectors. When adding new interactive elements, include appropriate test IDs:
- Format: `data-testid="descriptive-name"`
- Examples: `data-testid="calendar-page"`, `data-testid="filter-tier_s"`

---

## 7. Routing and Feature Flags

### Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/` | HomePage | Public |
| `/contest_calendar` | ContestCalendar | Feature-flagged + Secret Gate |
| `/contest_calendar/command` | CommandCenter | Feature-flagged + Secret Gate |

### Feature Flags

Controlled via `.env` file:

```bash
VITE_FEATURE_CONTEST_CALENDAR=true    # Enable contest calendar routes
VITE_FEATURE_SECRET_GATE=false        # Enable/disable secret key gate
```

Access in code:
```javascript
import { FEATURE_FLAGS, isFeatureEnabled } from './utils/featureFlags';

if (FEATURE_FLAGS.CONTEST_CALENDAR) { ... }
// or
if (isFeatureEnabled('SECRET_GATE')) { ... }
```

### Secret Gate

When enabled, accessing `/contest_calendar` requires the secret key: `"intel"`

The gate component is at `src/components/SecretGate.jsx`.

---

## 8. Data Architecture

### Contest Data

**Source of Truth:** `src/data/contestData.js`

This file is **AUTO-GENERATED** by `scripts/ingest_datasets.js` from CSV files in `datasets/`. **DO NOT EDIT MANUALLY**.

```javascript
// Example EVENT object
{
  id: "CP01",
  title: "Meta Hacker Cup 2026",
  tier: "S",                    // S, A, B, C tier
  type: "Online",               // Online or Presencial
  date: "2026-02-02",           // Start date (ISO)
  endDate: "2026-12-13",        // End date (ISO)
  prizePool: 41500,
  cost: "Free",
  numericCost: 0,
  roiScore: 100,
  urgencyScore: 0,
  location: "Online",
  status: "active",             // active, upcoming, ongoing
  tags: ["algorithmic"],
  link: "https://..."
}
```

### Competition Data (Command Center)

**Source:** `src/data/competitionsData.js`

Contains detailed phase and deliverable information for the Command Center Gantt charts.

```javascript
COMPETITIONS_DATA = {
  [eventId]: {
    phases: [
      {
        id: "p1",
        name: "Phase Name",
        start: "2026-03-01",
        end: "2026-04-15",
        deliverables: [
          { id: "d1", name: "Deliverable Name", done: false }
        ]
      }
    ]
  }
}
```

### State Management

- **Subscriptions:** Managed via `SubscriptionContext` with localStorage persistence
- **Deliverables:** Toggle completion state, persisted to localStorage
- **Filters/Sort:** Local component state

---

## 9. Deployment Process

### Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production — auto-deploys to Netlify |
| `versioning` | Development/staging — experiments and features |

### Deployment Steps

1. **Development work** happens on `versioning` branch
2. **Deploy to production** using the deployment script:
   ```powershell
   .\scripts\deploy.ps1 -Message "Deploy: feature description"
   ```
   This script:
   - Commits any uncommitted changes
   - Runs build verification
   - Merges `versioning` → `main`
   - Pushes to GitHub (triggers Netlify deploy)
   - Creates backup tags
   - Logs to `LEARNING_LOG.md`

3. **Netlify automatically builds and deploys** from `main` branch

### Netlify Configuration

Settings in `netlify.toml`:
- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- SPA redirects: All routes → `index.html`
- Security headers: CSP, HSTS, X-Frame-Options, etc.

---

## 10. Internationalization (i18n)

Configured in `src/i18n.js` with support for:
- **pt-BR** (default): Brazilian Portuguese
- **en**: English

Translation files: `src/locales/pt.json`, `src/locales/en.json`

Usage in components:
```javascript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<div>{t('key.nested.value')}</div>
```

---

## 11. Security Considerations

### Content Security Policy

Configured in `netlify.toml`:
```
Content-Security-Policy: default-src 'self'; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  font-src 'self' https://fonts.gstatic.com; 
  img-src 'self' data: blob: https:; 
  connect-src 'self' https:;
```

### Security Headers

- `X-Frame-Options: DENY` (prevents clickjacking)
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security` (HSTS)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (restricts browser features)

### Secret Routes

The `/contest_calendar` route has two layers of protection:
1. Feature flag (`VITE_FEATURE_CONTEST_CALENDAR`)
2. Optional secret gate (`VITE_FEATURE_SECRET_GATE`)

---

## 12. Development Conventions

### Adding New Components

1. Create component in appropriate subdirectory under `src/components/`
2. Use existing glass/card components from `src/components/glass/` where possible
3. Follow the color palette from `design-tokens.css`
4. Add `data-testid` attributes for testability
5. Use Framer Motion for animations (consistent easing: `cubic-bezier(0.19, 1, 0.22, 1)`)

### Adding New Routes

1. Add route in `src/App.jsx` within `Routes`
2. Create page component in `src/pages/`
3. Wrap sensitive routes with `SecretGate` if needed
4. Add feature flag check if the route should be toggleable
5. Update `netlify.toml` redirects if needed (SPA fallback handles most cases)

### Styling Guidelines

```css
/* DO: Use CSS variables */
.my-component {
  background: var(--card-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

/* DON'T: Hardcode colors */
.my-component {
  background: #1a1a2e;  /* WRONG - outside design system */
  color: #ffffff;
}
```

### Commit Messages

- Use descriptive messages
- Prefix with type: `feat:`, `fix:`, `refactor:`, `style:`, `test:`
- Reference issue numbers if applicable

---

## 13. Common Issues and Solutions

### Linting Errors

- **unused-vars warnings for motion/Icon:** These are whitelisted in eslint.config.js
- **React Hooks warnings:** Follow the rules of hooks; dependencies in useEffect arrays

### Build Issues

- **Out of memory during build:** Vite should handle this; if not, check for circular dependencies
- **Tailwind classes not applied:** Ensure `@source` directives in `index.css` cover your files

### Test Failures

- **Flaky tests:** Tests use `waitForTimeout` for animations; adjust if needed
- **Authentication gate tests:** Ensure `VITE_FEATURE_SECRET_GATE` is set correctly in test env

---

## 14. Quick Reference

| Task | File/Command |
|------|--------------|
| Design tokens | `design-tokens.css`, `STYLES-GUIDE.md` |
| Add translation | `src/locales/[lang].json` |
| Update contest data | Edit CSVs → run `node scripts/ingest_datasets.js` |
| Toggle feature | Edit `.env` → restart dev server |
| Deploy to prod | `.\scripts\deploy.ps1 -Message "..."` |
| Run tests | `npm test` |
| Check linting | `npm run lint` |

---

## 15. Cursor Rules Reference

The project includes Cursor IDE rules in `.cursor/rules/`:

| Rule | Purpose |
|------|---------|
| `scope.mdc` | Project scope, front-end focus, styles enforcement |
| `styles-guard.mdc` | Enforce STYLES-GUIDE.md, no off-palette colors |
| `contest-calendar.mdc` | Ensure `/contest_calendar` style consistency |

Skills available in `.cursor/skills/`:
- `frontend-engineering` — UI implementation, component reviews
- `styles-guide-mood` — Color/typography changes, style drift prevention

---

*Last updated: April 2026*
*For questions or clarifications, refer to the existing codebase patterns or the style guide documentation.*
