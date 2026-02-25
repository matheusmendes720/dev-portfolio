# dev-portfolio — Agent instructions

This project is **scoped by project rules and agent skills**. Open this folder as a workspace so Cursor applies its rules and skills here.

## Styles guide (non-negotiable)

- **STYLES-GUIDE.md** is the single source of truth for color palette, typography, and mood.
- **design-tokens.css** exposes CSS variables. Use only these tokens; do not introduce new colors or fonts outside the guide.
- **No transgressing:** Agents must not suggest or add styles that drift from the guide (e.g. new accent colors, different fonts, or a separate theme for one page).

## Secret page: /contest_calendar

- The route `/contest_calendar` must use the **same** palette and styles as the rest of the site.
- Strict consistency: same background, text color, accents, and typography. No separate "calendar" theme.

## Rules (`.cursor/rules/`)

| Rule | Purpose |
|------|---------|
| **scope.mdc** | Project scope; front-end focus; styles are law; contest_calendar consistency. (Always on.) |
| **styles-guard.mdc** | Enforce STYLES-GUIDE; no colors/typography outside the guide. (Applies to CSS/TSX/JSX.) |
| **contest-calendar.mdc** | /contest_calendar must follow the same palette and mood. (Applies under contest_calendar.) |

## Skills (`.cursor/skills/`)

| Skill | When to use |
|-------|-------------|
| **frontend-engineering** | Implementing or reviewing UI; components; layout; ensuring styles-guide adherence. |
| **styles-guide-mood** | Any change that touches colors, typography, or visual mood; prevent style drift. |

## Quick reference

- Palette & mood: **STYLES-GUIDE.md**
- Tokens: **design-tokens.css**
- Route consistency: **STYLES-GUIDE.md §5** and rule **contest-calendar.mdc**
