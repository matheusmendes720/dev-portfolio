# Command Center: Frontend System Design & Visual Topology

This document details the frontend system design, component breakdown, and architectural intent of the **`/contest-calendar/command`** subpage within the `dev-portfolio` application. 

It specifically maps how the React layer acts as a visual wrapper for the intelligence structures defined in our `specs/Architecture_Data_Topology.md`.

## 1. Main Intent & Origin
The **Command Center** was conceptualized to solve a critical logistical problem: managing the overlapping execution phases of multiple simultaneous hackathons. 

While the root `/contest_calendar` acts as a global index, the Command Center is a **tactical multi-view wrapper**. Its sole intent is to take *only* the chosen/subscribed events from our `local/` directories and visualize their strategic progression side-by-side, preventing scheduling conflicts between research, architecture, and coding phases.

## 2. Topological Integration (The `local/` Data Bridge)
As defined in `Architecture_Data_Topology.md`, strategy is born in the `local/` directory using the 6-Node Architecture (e.g., `local/lowhack`, `local/liga_jovem`). 

The Command Center Frontend is the visual terminus for this data:
- **`00_Regulamento` →** Feeds the **Overview Timeline** bounds.
- **`01_Intel` & `02_Estrategia` →** Feeds the **Info-Cards** and strategic notes within the tabs.
- **`03_Arquitetura` & `04_BI` →** Feeds the **Deliverables Panel** checklists.

The UI intentionally *only* renders these deep metrics for events the user has starred, ensuring the command center remains unpolluted by the broader global dataset.

## 3. High-Level Anatomy (The Multi-View Wrapper)

The page layout (`CommandCenter.jsx`) is separated into two major visual planes:

### Plane 1: The Macro Overlap (Main Timeline Widget)
Located at the top, the **Overview Timeline** widget visually displays the absolute start and end dates of all active missions concurrently.
- **Purpose**: Instantly identifying temporal overlaps (e.g., discovering that the "Code Sprint" for Liga Jovem overlaps with the "OSINT Phase" of Low Hack). 
- **Scalability**: Switchable temporal ranges (Weekly, Monthly, Quarterly) allow broad strategic planning.

### Plane 2: The Micro Execution (Strategic Drill-Down)
Located in the lower section, structured as a CSS Grid:
- **Left Sidebar (Mission Roster)**: A list of active, chosen events categorized by Tier colors.
- **Right Workspace (Info Sub-Tabs & Gantt)**: A dynamic injection area that swaps components based on the selected tab.

## 4. Component Breakdowns

### 4.1 `OverviewTimeline.jsx` (Global Conflict Resolution)
- **Role**: The main structural timeline widget spanning the top of the app.
- **Data Hook**: Reads the global start/end limits of all `subscribedEvents`.
- **Interactivity**: Clicking any bar on this timeline sets the focus for the entire lower dashboard, swapping out the active data inside the Tabs wrapper.

### 4.2 Tab 1: `MissionGantt.jsx` (Phase Progression)
- **Role**: A granular Gantt chart mapping the localized phases of a *single* chosen event.
- **Visuals**: Displays the progression of each specific phase (`Intel_OSINT`, `Estrategia`, `Arquitetura`) proportionally over time.
- **Strategic Connection**: This component translates the abstract Markdown timelines from the `local/` folder into visual blocks, highlighting exactly when the intelligence gathering must stop and the code architecture must begin.

### 4.3 Tab 2: `DeliverablesPanel.jsx` (Execution & Info-Cards)
- **Role**: The operational execution engine and strategic info-card display.
- **Visuals**: Organizes the derived tactical goals (e.g., "Define ESG ODS 12 Alignment" extracted from `01_Intel`) into specific, actionable fields.
- **State Management**: Uses persistent `localStorage` linked to `SubscriptionContext.jsx` to maintain a checklist of what has been accomplished in real-time.

## 5. Summary
The Command Center is more than just a calendar. It is a highly specialized React multi-view wrapper built specifically to consume JSON-transpiled data from the `local/` 6-Node methodologies. By separating the Main Timeline Widget (overlap detection) from the Mission Gantt / Deliverables Sub-Tabs (tactical execution), it guarantees ultimate competitive advantage through sheer operational awareness.
