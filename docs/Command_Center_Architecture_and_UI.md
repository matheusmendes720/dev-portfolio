# Command Center Architecture & UI Design System

This document provides a comprehensive breakdown of the Frontend architecture, state management, and data integration for the **Competitive Programming Intelligence Dashboard (Command Center)** within the dev-portfolio.

## 1. Top-Level UI Architecture

The Command Center is a highly optimized React sub-application designed to visualize, track, and manage hackathon/competition strategic executions. 

The architecture is built upon three core pillars:
1. **The Event Registry (`contestData.js`)**: A quantitative, auto-generated list of all known competitions (ingested from CSVs).
2. **The Intelligence Node (`competitionsData.js`)**: A qualitative, deeply nested JSON registry mapping specific competition IDs to a structured 3-Phase strategy ([01_Intel_OSINT, 02_Estrategia_Vencedora, 03_Arquitetura_Projeto, etc.]).
3. **The React UI Engine (`CommandCenter.jsx`)**: The rendering engine that merges the two data sources using context and state.

## 2. Design System & Frontend Components

### 2.1 Component Decoupling
The UI strictly decouples the *display* of data from the *definition* of data.
- **Widgets**: The dashboard uses modular widgets (Gantt Charts, ROI/Urgency metrics, Checklist progress). These components are purely functional and accept standardized props (e.g., `phases`, `deliverables`).
- **Data Enrichment Layer**: When an event is selected, `CommandCenter.getEnrichedData()` merges the generic event stats (from `contestData.js`) with the specific Phase execution plan (from `competitionsData.js`). 

### 2.2 Global State & Persistence
To maintain user progress across sessions without a heavy backend:
- **`SubscriptionContext`**: A React Context provider that tracks which events the user is currently participating in.
- **Local Storage Syncing**: Checkbox states for individual deliverables (e.g., "Extract TAM/SAM/SOM") are immediately serialized to the browser's `localStorage`. This ensures that refresh cycles or Netlify deployments do not reset the user's strategic progress.

## 3. Data Models & Objects

### 3.1 `contestData.js` (The Quantitative Layer)
Auto-generated via `scripts/ingest_datasets.js`, this file exports:
- `EVENTS`: An array of objects containing top-level metrics:
  ```javascript
  {
      id: "HK_LOWHACK",
      title: "Low Hack 2026",
      date: "2026-04-10",
      roiScore: 85,        // Calculated based on Prize Pool vs Cost
      urgencyScore: 100    // Calculated based on Days remaining
  }
  ```

### 3.2 `competitionsData.js` (The Qualitative Layer)
Manually maintained or partially generated, this maps an `id` to a strategic tree:
```javascript
export const COMPETITIONS_DATA = {
    "HK_LOWHACK": {
        phases: [
            { id: "p1", name: "01_Intel_OSINT", start: "2026-03-20", end: "2026-03-25" },
            // ...
        ],
        deliverables: [
            { id: "d1", phaseId: "p1", name: "Market Research Report" },
            // ...
        ]
    }
}
```

## 4. Making UI and Architecture Updates

### Adding a New Widget
1. **Identify Data Needs**: If the widget requires new fields (e.g., "Team Member Roles"), add them to the qualitative node in `competitionsData.js`.
2. **Pass Props**: Update the `CommandCenter.jsx` render loop to pass the new object structures to the new Widget component.

### Modifying the Data Model
- **CSV Origin**: If you want a new global metric (e.g., "Sponsor Name"), add a new column to the CSV.
- **Ingestion Script**: Update `scripts/ingest_datasets.js` to parse the new column and map it to `contestData.js`. 
- **No UI Breakage**: Because the UI ignores unused object keys, adding new data models to the ingestion script is inherently backward-compatible.
