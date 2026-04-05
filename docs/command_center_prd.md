# PRD — Command Center: Tactical Intelligence Dashboard
**Product:** `dev-portfolio` → `/command-center`  
**Component Scope:** `MissionGantt`, `OverviewTimeline`, `DeliverablesPanel`, `CommandCenter` (page), `sync-intel` (BFF)  
**Author:** Feature Engineering Session  
**Date:** 2026-04-02  
**Status:** 🔴 ACTIVE — Issues Under Resolution

---

## 1. Executive Summary

The **Command Center** is a high-fidelity, immersive tactical dashboard embedded in the portfolio that visualizes **all competitive programming and hackathon missions** the user is enrolled in. It serves as a single pane of glass combining:

- **Strategic Chronology** — a global horizontal timeline of all active missions
- **Tactical Gantt** — a drill-down, per-mission project timeline with phase/deliverable decomposition
- **Mission Vault** — a structured checklist of phase deliverables with completion tracking
- **BFF Intelligence Node** — a serverless backend that will eventually hydrate the UI with live data

The aesthetic language is **"Cyberpunk Ops HUD"** — dark background, neon-green accents, monospace fonts, scanline overlays, glassmorphic panels, and motion elements. The visual identity is non-negotiable and is treated as a first-class feature requirement.

---

## 2. Problem Statement

### 2.1 Core User Problem
A competitive programmer managing 5+ simultaneous events (hackathons, competitive rounds, regional phases, national phases) has **no single unified view** of:
- Where each mission sits in time relative to today
- What specific deliverables are due in each phase
- How far along each phase is (progress)
- Which deadlines are critical vs. comfortable

### 2.2 Current Failure Modes (Bugs to Resolve)

| # | Defect | Component | Severity | Root Cause |
|---|--------|-----------|----------|------------|
| D-01 | Task bars stack **vertically** instead of spreading horizontally across the timeline | `MissionGantt` | 🔴 Critical | All deliverables share the same `start_date` (phase start). Waterfall distribution not applied |
| D-02 | Date column headers show **garbage labels** (raw token strings like `%M %Y` literally) | `MissionGantt` | 🔴 Critical | SVAR Gantt's `format` property uses its own internal token parser — not all tokens are supported consistently |
| D-03 | Scale switcher (Daily / Weekly / Monthly / Quarterly) changes button highlight but does **not re-render the chart** correctly | `MissionGantt` | 🔴 Critical | `cellWidth` and `scales` config change, but the library may not re-mount on prop change |
| D-04 | BFF endpoint (`sync-intel`) returns mock data and is **never wired to the Gantt data** | `sync-intel.js` + `CommandCenter` | 🟡 Medium | Intentional placeholder, not integrated |
| D-05 | `OverviewTimeline` axis labels only appear in **Year view** — Week and Month show empty header | `OverviewTimeline` | 🟡 Medium | Axis label rendering logic gated only on `range === 'Year'` |
| D-06 | Deliverable **completion state is ephemeral** — lost on page refresh | `SubscriptionContext` | 🟡 Medium | State stored in React context without `localStorage` persistence |
| D-07 | `Today marker` in `OverviewTimeline` is **misaligned** — uses `calc(44px + ...)` which breaks on mobile | `OverviewTimeline` | 🟡 Medium | Hard-coded pixel offset for sidebar width |
| D-08 | Linting errors: `no-unused-vars` across `Hero.jsx`, `CalendarEventPill.jsx` | repo-wide | 🟢 Low | Accumulated dead code from refactoring |

---

## 3. Goals & Non-Goals

### 3.1 Goals
- ✅ Fix all 🔴 Critical defects before any new features
- ✅ Implement a **fully functional multi-scale Gantt** with correct date labels
- ✅ Ensure horizontal waterfall task distribution for all scales (day/week/month/quarter/year)
- ✅ Achieve visual parity with the "Cyberpunk HUD" design reference in all views
- ✅ Persist deliverable completion state across sessions
- ✅ Correctly label all axes in `OverviewTimeline` for all range views (Week/Month/Quarter/Year)

### 3.2 Non-Goals (Out of Scope for This Iteration)
- ❌ Real-time multi-user collaboration on deliverables
- ❌ Native mobile app version
- ❌ Automated web scraping of competition portals
- ❌ User authentication / multi-user profiles

---

## 4. User Stories

### US-01: Chronological Overview
> *"As a competitor, I want to see all my active missions on a single horizontal timeline so I can instantly see overlaps, upcoming deadlines, and which missions are in flight now."*

**Acceptance Criteria:**
- [ ] All subscribed events appear as horizontal bars on the `OverviewTimeline`
- [ ] Bars are correctly positioned using `event.date` and `event.endDate` percentage math
- [ ] A "TODAY" marker (neon-green vertical line with pulsing dot) appears at the current date
- [ ] Time axis labels appear for **all** range views: Week (Mon/Tue/..), Month (01/08/15..), Quarter (Jan/Apr/..), Year (Jan..Dec)
- [ ] Clicking any bar selects that mission and drills into the bottom panels

### US-02: Tactical Gantt Drilldown
> *"As a competitor, I want to see a detailed Gantt chart for a specific mission showing all phases and their deliverables as horizontal bars, so I can understand the sequencing visually."*

**Acceptance Criteria:**
- [ ] Phase rows appear as **summary bars** spanning their full date range
- [ ] Deliverable rows appear as **child task bars** distributed sequentially within the phase (waterfall)
- [ ] No two deliverables have identical `start_date` / `end_date` (sequential, non-overlapping segments)
- [ ] Switching scale (Day/Week/Month/Quarter/Year) re-renders the chart with correct column header labels
- [ ] Date column labels correctly display (e.g., "APR 2026", "WK 15", "02", "Q2")
- [ ] Completed deliverables (`done: true`) show bars with 100% progress fill
- [ ] Today marker appears as a vertical green line at the current date
- [ ] The sidebar shows "Operational_Task" and "Chron_Start" columns

### US-03: Mission Vault (Deliverables Checklist)
> *"As a competitor, I want to check off deliverables as I complete them, with progress persisting between sessions, so I can track execution in real time."*

**Acceptance Criteria:**
- [ ] Each phase is a collapsible accordion card
- [ ] Each deliverable has a toggleable checkbox
- [ ] Critical deliverables are marked with a "Priority_Alpha" badge
- [ ] Overdue phases (past `end` date) show a red "CRITICAL_EXPIRY" countdown
- [ ] Completion state persists in `localStorage`
- [ ] Overall progress percentage (%) is shown per phase
- [ ] A phase turns neon-green when all deliverables are complete

### US-04: Scale-Aware View Switching
> *"As a competitor, I want to switch quickly between Daily, Weekly, Monthly, Quarterly, and Yearly Gantt views so I can zoom in for tactical detail or zoom out for strategic overview."*

**Acceptance Criteria:**
- [ ] The scale switcher buttons (Daily/Weekly/Monthly/Quarterly/Yearly) are visible when the "Tactical_Gantt" tab is active
- [ ] Clicking a scale button immediately re-renders the Gantt with updated column widths and header labels
- [ ] Each scale maps to a specific date format:
  - **Day** → Top row: `Apr 2026`, Bottom row: `02`, `03`, `04`...
  - **Week** → Top row: `Apr 2026`, Bottom row: `WK15`, `WK16`...
  - **Month** → Top row: `2026`, Bottom row: `JAN`, `FEB`...
  - **Quarter** → Top row: `2026`, Bottom row: `Q1`, `Q2`, `Q3`, `Q4`
  - **Year** → Single row: `2026`, `2027`...

### US-05: BFF Intelligence Sync
> *"As a developer, I want the BFF to act as a data gateway that can eventually serve live competition phase data, so the front end remains decoupled from data sources."*

**Acceptance Criteria:**
- [ ] The `sync-intel` Netlify function returns a valid JSON envelope
- [ ] The `CommandCenter` page displays sync status (`SYNC_COMPLETE`, `SYNC_ERROR`, `SYNC_UNREACHABLE`)
- [ ] [Future] The BFF hydrates `COMPETITIONS_DATA` from a GitHub-sourced YAML or remote JSON

---

## 5. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                      /command-center (React Page)                    │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────────────────────────────┐ │
│  │  Mission Roster  │  │         Global Chronology Panel          │ │
│  │  (Sidebar List)  │  │        <OverviewTimeline range={} />     │ │
│  │                  │  │    Custom % math renderer — no deps      │ │
│  │  subscribedEvents│  └──────────────────────────────────────────┘ │
│  │  from Context    │                                               │
│  │                  │  ┌──────────────────────────────────────────┐ │
│  │  + Scale Buttons │  │         Drill-Down Panel (tabs)          │ │
│  │  (when Gantt tab)│  │                                          │ │
│  └──────────────────┘  │  [Tactical_Gantt tab]                    │ │
│                        │   <MissionGantt                          │ │
│                        │     competitionData={enriched}           │ │
│                        │     scale={ganttScale}                   │ │
│                        │   />                                     │ │
│                        │   — uses @svar-ui/react-gantt v2.6.0 —  │ │
│                        │                                          │ │
│                        │  [Mission_Vault tab]                     │ │
│                        │   <DeliverablesPanel                     │ │
│                        │     competitionData={enriched}           │ │
│                        │     onDeliverableToggle={toggleFn}       │ │
│                        │   />                                     │ │
│                        └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
         │                                           │
         ▼                                           ▼
┌──────────────────┐                    ┌────────────────────────────┐
│  SubscriptionCtx │                    │  Netlify BFF               │
│  + localStorage  │                    │  /.netlify/functions/      │
│  for persistence │                    │  sync-intel.js             │
│                  │                    │  → returns intel envelope  │
│  COMPETITIONS_   │                    │  → future: GitHub API +    │
│  DATA (static)   │                    │    remote YAML hydration   │
└──────────────────┘                    └────────────────────────────┘
```

### 5.1 Data Flow: Gantt Task Generation

```
COMPETITIONS_DATA[selectedId]
  └── phases[] (each has start, end, deliverables[])
        │
        ▼ [MissionGantt — useMemo]
        │
        ├── Phase Row: { id: "p_0", type: "summary", start_date, end_date }
        │
        └── Deliverable Rows (Waterfall Distribution):
              totalDurationMs = phaseEnd - phaseStart
              segmentMs       = totalDurationMs / delCount
              ┌────────────────────────────────────────────────────┐
              │ del[0]: start = phaseStart + (0 * segmentMs)       │
              │ del[1]: start = phaseStart + (1 * segmentMs)       │
              │ del[2]: start = phaseStart + (2 * segmentMs)       │
              │         ...each end = start + segmentMs            │
              └────────────────────────────────────────────────────┘
              → Enforces non-overlapping, left-to-right horizontal flow
```

---

## 6. Technical Specification

### 6.1 `MissionGantt.jsx` — Fix Specification

#### 6.1.1 Scale Configuration (Fix D-02)
Replace SVAR `%` tokens with a **JavaScript formatter function** via `date-fns`:

```javascript
// WRONG (current) — tokens may not render in all svar versions:
{ unit: 'month', step: 1, format: '%M %Y' }

// CORRECT — use explicit format functions:
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const scaleConfigs = {
  day: [
    { unit: 'month', step: 1, format: (d) => format(d, 'MMM yyyy').toUpperCase() },
    { unit: 'day',   step: 1, format: (d) => format(d, 'dd') }
  ],
  week: [
    { unit: 'month', step: 1, format: (d) => format(d, 'MMM yyyy').toUpperCase() },
    { unit: 'week',  step: 1, format: (d) => `WK${format(d, 'ww')}` }
  ],
  month: [
    { unit: 'year',  step: 1, format: (d) => format(d, 'yyyy') },
    { unit: 'month', step: 1, format: (d) => format(d, 'MMM').toUpperCase() }
  ],
  quarter: [
    { unit: 'year',    step: 1, format: (d) => format(d, 'yyyy') },
    { unit: 'quarter', step: 1, format: (d) => `Q${Math.ceil((d.getMonth() + 1) / 3)}` }
  ],
  year: [
    { unit: 'year', step: 1, format: (d) => format(d, 'yyyy') }
  ]
};
```

#### 6.1.2 Waterfall Guard (Fix D-01)
Ensure minimum 1-day task duration for visibility:

```javascript
const MIN_SEGMENT_MS = 24 * 60 * 60 * 1000; // 1 day fallback

dels.forEach((del, di) => {
  const rawSegment = Math.max(taskSegmentMs, MIN_SEGMENT_MS);
  const taskStart  = new Date(phaseStart.getTime() + (di * rawSegment));
  const taskEnd    = new Date(taskStart.getTime() + rawSegment);
  // ... push to result
});
```

#### 6.1.3 Scale Remount (Fix D-03)
Force the Gantt to fully remount when scale changes by using a `key` prop:

```jsx
<Gantt
  key={scale}   // ← forces remount on scale change
  tasks={tasks}
  scales={scaleConfigs[scale]}
  cellWidth={cellWidths[scale]}
  markers={markers}
  columns={columns}
/>
```

### 6.2 `OverviewTimeline.jsx` — Fix Specification

#### 6.2.1 Axis Labels for All Views (Fix D-05)

```javascript
// Add label renders for Week and Month views
{range === 'Week' && Array.from({ length: 7 }, (_, i) => {
  const d = new Date(winStart);
  d.setDate(d.getDate() + i);
  return (
    <span key={i} style={{ left: `${pct(d)}%` }} className="...">
      {d.toLocaleString('en', { weekday: 'short' }).toUpperCase()}
    </span>
  );
})}

{range === 'Month' && Array.from({ length: 5 }, (_, i) => {
  const d = new Date(winStart);
  d.setDate(d.getDate() + (i * 7));
  return (
    <span key={i} style={{ left: `${pct(d)}%` }} className="...">
      {format(d, 'dd MMM')}
    </span>
  );
})}
```

#### 6.2.2 Today Marker Alignment (Fix D-07)
Replace hard-coded `calc(44px + X%)` with relative positioning:

```jsx
// The track area is flex-1, the pct() calc should be relative to it
<div className="relative flex-1 h-full">
  <div 
    className="absolute top-0 bottom-0 w-px bg-neon-green z-20"
    style={{ left: `${pct(now)}%` }}
  />
</div>
```

### 6.3 `SubscriptionContext.jsx` — Persistence (Fix D-06)

```javascript
// On toggle:
const toggleDeliverable = (eventId, delId) => {
  setDeliverables(prev => {
    const next = { ...prev, [eventId]: { ...prev[eventId], [delId]: !prev[eventId]?.[delId] } };
    localStorage.setItem('cmd_center_deliverables', JSON.stringify(next));
    return next;
  });
};

// On init:
const [deliverables, setDeliverables] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('cmd_center_deliverables')) || {};
  } catch { return {}; }
});
```

### 6.4 `sync-intel.js` — Future BFF Architecture (Fix D-04)

```
Phase 1 (Current): Static mock — returns hardcoded JSON envelope
Phase 2 (Next):    Fetch COMPETITIONS_DATA from GitHub Gist (public URL)
Phase 3 (Future):  PostgreSQL / Supabase read → return enriched phase data
                   GitHub API → return open PRs as deliverables
```

---

## 7. Design Specification

### 7.1 Design Language: "Cyberpunk Ops HUD"

| Token | Value |
|-------|-------|
| Background | `#050510` (near-black indigo) |
| Accent Primary | `#10b981` (neon-green / emerald) |
| Accent Secondary | `#8b5cf6` (neon-purple) |
| Accent Danger | `#ef4444` (red) |
| Font Primary | `JetBrains Mono`, `monospace` |
| Font Secondary | `Inter`, `sans-serif` |
| Border Subtle | `rgba(255,255,255,0.05)` |
| Border Active | `rgba(16,185,129,0.4)` |
| Glassmorphism | `backdrop-blur-3xl`, `bg-white/5` |
| Grid Pattern | `linear-gradient` repeating 40px mesh |
| Scanline Overlay | `repeating-linear-gradient` 4px rows, opacity 0.2 |

### 7.2 Gantt Visual Specification

| Element | Style |
|---------|-------|
| Phase (summary) bar | `linear-gradient(90deg, #10b981, #3b82f6)`, height 24px |
| Deliverable (task) bar | `linear-gradient(90deg, #6366f1, #a855f7)`, height 20px |
| Completed task | `#10b981` solid, opacity 0.8 |
| Header row | `bg-[#141428]/95`, `border-bottom: 2px solid #10b981/40` |
| Scale cells | `uppercase`, `letter-spacing: 0.15em`, non-active: `#475569`, active row: `#94a3b8` |
| Today marker | `2px` neon-green vertical line, `z-index: 100` |
| Row hover | `rgba(255,255,255,0.03)` |
| Sidebar | `bg-[#0a0a19]/60`, `border-right: 1px solid #10b981/20` |

### 7.3 Motion Design

| Interaction | Animation |
|-------------|-----------|
| Mission select | `scale: 1→1.02`, border glow, `duration: 500ms` |
| Tab switch | `opacity: 0→1`, `y: 20→0`, framer-motion `AnimatePresence` |
| Deliverable complete | `scale: 1→1.05→1`, color shift to neon-green, `duration: 700ms` |
| Scanline on selected bar | `x: -100%→200%`, 3s loop, linear |
| Status badge pulse | CSS `animate-pulse` on critical/overdue items |

---

## 8. Execution Plan & Priority Order

### Phase 0 — Stabilization (🔴 Must Do First)
1. **Fix D-02** → Replace SVAR `%` tokens with `date-fns` formatter functions
2. **Fix D-01** → Enforce waterfall + 1-day minimum segment guard
3. **Fix D-03** → Add `key={scale}` to `<Gantt>` component for remount on scale change
4. Smoke test: all 5 scales render correctly with readable labels

### Phase 1 — Correctness (🟡 High Priority)
5. **Fix D-05** → Add axis labels to Week, Month, Quarter views in `OverviewTimeline`
6. **Fix D-07** → Fix today marker alignment in `OverviewTimeline`
7. **Fix D-06** → Add `localStorage` persistence for deliverable completion state

### Phase 2 — Enhancement
8. **BFF Integration** → Wire `sync-intel.js` to serve `COMPETITIONS_DATA` as JSON from a GitHub Gist or remote source
9. **Progress Sync** → Ensure Gantt task `progress` field reflects real deliverable completion
10. **Linting** → Resolve `no-unused-vars` across Hero.jsx, CalendarEventPill.jsx (Fix D-08)

### Phase 3 — Hardening
11. Critical path highlighting (SVAR PRO feature or custom overlay)
12. Export timeline as PNG (canvas capture)
13. Keyboard navigation for deliverable checklist

---

## 9. Verification Checklist

### Gantt Verification
- [ ] Open Command Center → select "SENAI Nacional 2026" → click "Tactical_Gantt" tab
- [ ] Phase bars appear horizontal (e.g., "Registration & Team Formation" spans March–April)
- [ ] Deliverable bars appear INSIDE each phase, distributed left-to-right
- [ ] No two deliverables have the same horizontal position
- [ ] Switch to "Daily" view → labels show "02", "03", "04" etc. at top "APR 2026"
- [ ] Switch to "Weekly" view → labels show "WK14", "WK15" etc.
- [ ] Switch to "Monthly" view → labels show "JAN", "FEB", "MAR"
- [ ] Switch to "Quarterly" view → labels show "Q1", "Q2", "Q3", "Q4"
- [ ] Today marker appears as a green vertical line at the correct date

### OverviewTimeline Verification
- [ ] Select "Week" range → axis shows "MON", "TUE", "WED"...
- [ ] Select "Month" range → axis shows "01 Apr", "08 Apr", "15 Apr"...
- [ ] Select "Quarter" range → axis shows month abbreviations
- [ ] Select "Year" range → axis shows "JAN", "FEB", "MAR"... (already works)
- [ ] Today marker is correctly positioned relative to the visible track

### Persistence Verification
- [ ] Toggle a deliverable as done → refresh page → deliverable remains done
- [ ] Console shows no errors during toggle

### Visual Integrity
- [ ] No plain-white or plain-black style overrides from SVAR leaking through
- [ ] Scanline overlay renders at correct opacity (subtle, not blocking)
- [ ] All text in Gantt sidebar is readable (not clipped)

---

## 10. Known Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| `@svar-ui/react-gantt` does not support function-based `format` prop | Medium | Verify against library source; fallback to SVAR-specific ISO date string parsing |
| Library internal state doesn't reset on `key` prop change | Low | Use `React.forceUpdate` or wrap in a `useEffect` that unmounts/remounts |
| `localStorage` quota on large `deliverables` objects | Very Low | Structure `deliverables` as a flat `{eventId: {delId: boolean}}` map — max ~5KB |
| `date-fns` locale (pt-BR) month names on Gantt headers conflict with uppercase CSS | Low | Apply `.toUpperCase()` explicitly in formatter functions |

---

## 11. Dependencies

| Dependency | Version | Role |
|------------|---------|------|
| `@svar-ui/react-gantt` | `^2.6.0` | Core Gantt rendering engine |
| `date-fns` | `^4.1.0` | Date formatting for scale labels |
| `framer-motion` | `^12.34.0` | Animations across all components |
| `lucide-react` | `^0.562.0` | Icons |
| Netlify Functions | (platform) | BFF `sync-intel` endpoint |
| Tailwind CSS | `^4.1.18` | Utility class styling |

---

*PRD approved for implementation. Proceed with Phase 0 → Phase 1 in sequential order.*
