# dev-portfolio — Styles guide (single source of truth)

**This file is the canonical reference for color palette, typography, and mood.** All UI (including the secret page `/contest_calendar`) must use only these tokens. Agents and contributors must not introduce colors, fonts, or effects outside this guide.

---

## 1. Color palette (CSS custom properties)

Use these variables only. Do not hardcode hex/rgba values that are not derived from these.

| Token | Value | Usage |
|-------|--------|--------|
| `--bg-color` | `#030308` | Page background |
| `--text-color` | `#e0e6ed` | Primary text |
| `--accent-primary` | `#00d2ff` | Teal/cyan — CTAs, links, key highlights |
| `--accent-secondary` | `#7000ff` | Deep indigo/purple — secondary actions, borders, glows |
| `--accent-glow` | `#00d2ff` | Glow effects (shadows, outlines) |
| `--card-bg` | `rgba(10, 10, 18, 0.7)` | Cards, panels, overlays |
| `--border-color` | `rgba(255, 255, 255, 0.08)` | Subtle borders |

### Semantic grays (derived)

- **Muted text:** `rgba(255, 255, 255, 0.5)` to `0.6`
- **Disabled / placeholder:** `#888` or `rgba(255, 255, 255, 0.35)`
- **Dividers / subtle:** `rgba(255, 255, 255, 0.05)` to `0.08`

### Do not use

- Random hex colors (e.g. `#3b82f6`, `#60a5fa`) unless they match the table above.
- New accent colors (e.g. orange, green, pink) without adding them first to this guide.
- Inline styles with hardcoded colors; prefer CSS variables or Tailwind config that maps to these tokens.

---

## 2. Typography

| Role | Variable | Value |
|------|----------|--------|
| Display / headings | `--font-display` | `'Syncopate', sans-serif` |
| Body | `--font-body` | `'Space Grotesk', sans-serif` |
| Mono / code | `--font-mono` | `'Fira Code', monospace` |

Use only these font families. Do not introduce new typefaces without updating this guide.

---

## 3. Motion & easing

- **Easing:** `--easing: cubic-bezier(0.19, 1, 0.22, 1);`
- Keep animations subtle and consistent (e.g. 200–300ms for hover, 150–250ms for focus).

---

## 4. Mood (design intent)

- **Dark, high-contrast, tech/terminal feel.** Deep black background with teal/cyan and purple accents.
- **No “playful” or unrelated palettes** (e.g. warm oranges, bright greens, pastels) unless explicitly added here.
- **Glows and borders** should use `--accent-primary` or `--accent-secondary` with low opacity (e.g. `rgba(0, 210, 255, 0.1)` to `0.3`, `rgba(112, 0, 255, 0.1)` to `0.3`).
- **Grid / scanline / blueprint** effects: use `rgba(112, 0, 255, 0.03)` or similar for grids; keep scanlines subtle.

---

## 5. Secret page: `/contest_calendar`

- **Strict consistency:** The route `/contest_calendar` is part of the same product and must follow this styles guide exactly.
- **No separate theme** for this page. Use the same `--bg-color`, `--text-color`, `--accent-primary`, `--accent-secondary`, and typography.
- **Components** (cards, buttons, inputs, calendar cells) must use only the tokens above. Do not introduce new colors for “variety” or “contrast” that are not in this document.

---

## 6. Implementation checklist (for agents)

When adding or editing UI (including `/contest_calendar`):

1. **Read this file** before writing CSS or component styles.
2. **Use CSS variables** (e.g. `var(--accent-primary)`) or a design-tokens layer that maps to this guide.
3. **Do not add** new hex/rgba colors without adding them to §1 and getting agreement.
4. **Preserve mood:** Dark, teal/indigo, tech; no style drift.

Reference: this file is the single source of truth. Project rules and agent skills enforce it.
