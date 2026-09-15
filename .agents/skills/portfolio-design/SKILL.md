---
name: portfolio-design
description: Complete design system guide, token definitions, typography rules, layout blueprints, and component patterns for the PPM Architectural Editorial Portfolio. Use whenever designing, reviewing, creating, or styling components, pages, or interactive elements in the portfolio.
---

# Portfolio Design System & Guidelines

This skill governs the visual language, typography, layout, component architecture, and interaction design of the **PPM Portfolio** (`portfolio`).

---

## 1. Core Philosophy: Architectural & Swiss Editorial

The portfolio is designed as an architectural blueprint meets a fine editorial monograph:
1. **Warm Tactile Canvas**: Built on `#fbfbfa` (`--paper`) with high-contrast `#1a1a1a` (`--ink`) rather than sterile pure `#ffffff` / `#000000`.
2. **Drafting Precision**: 1px subtle rules (`--rule`), hairline grid borders, monospaced drafting annotations (`+` corner markers, `PPM // 2026`, coordinate notes).
3. **Typographic Hierarchy**:
   - Editorial headings in `Instrument Serif` (`font-display`).
   - Clean structural UI and body reading in `DM Sans` (`font-sans`).
   - Metadata, stats, technical tags, and timestamps in monospace (`font-mono`).
4. **Signal Accent**: Sparse, deliberate use of international electric orange (`#f54e00`, `--accent`) for status indicators, active links, and pulse dots. Never overuse.
5. **No Clutter / Anti-Skeuomorphic**: No heavy dropshadows, no tacky gradients, no bouncy toy animations. Everything is crisp, understated, and mathematically proportioned.

---

## 2. Design Tokens Quick Reference

| Token | Class | Value | Context |
|---|---|---|---|
| Background | `bg-paper` | `#fbfbfa` | Canvas, backdrop |
| Foreground | `text-ink` | `#1a1a1a` | Primary copy, titles, bold elements |
| Subdued | `text-muted` | `#6b6b6b` | Captions, dates, meta, subtitles |
| Dividers | `border-rule` | `#e8e8e6` | Section bounds, card borders, gridlines |
| Surface | `bg-soft` | `#f4f4f2` | Code blocks, pill badges, subtle chips |
| Elevated | `bg-white` | `#ffffff` | Floating navs, input boxes, modal cards |
| Accent | `text-accent` / `bg-accent` | `#f54e00` | Active pills, live beacons, focus rings |
| Accent Tint | `bg-accent-soft` | `#ffe8de` | Active tab backgrounds |
| Destructive | `text-destructive` | `#b91c1c` | Danger actions, removal icons |

---

## 3. Component Architecture & Rules

### Navigation & Site Chrome
- Fixed or sticky top bar with subtle blur: `sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-md`.
- Navigation links styled in monospaced or refined sans: `font-mono text-xs uppercase tracking-wider`.
- Active state: `text-ink font-semibold border-b-2 border-accent` or subtle badge.

### Editorial Section Headers
```tsx
<div className="mb-8 border-b border-rule pb-4">
  <span className="font-mono text-xs uppercase tracking-widest text-muted">
    // 01 ARCHITECTURE & PROJECTS
  </span>
  <h2 className="mt-1 font-display text-3xl font-normal text-ink">
    Selected Work
  </h2>
</div>
```

### Cards & Grid Containers
- Structural hairline borders: `border border-rule`.
- Background: `bg-white` on hover or standard `bg-transparent`.
- Subtle hover transitions: `transition-all duration-200 hover:border-ink/30`.

### Iconography Rules
- **NEVER** use text unicode arrows (e.g. `→`, `←`, `↓`, `↗`, `✓`) in JSX.
- **ALWAYS** import crisp icons from `lucide-react`:
  - `ArrowRight`, `ArrowLeft`, `ArrowDown`, `ExternalLink`, `Check`, `Save`, `RotateCcw`, `Trash2`, `Plus`.
- Standard icon sizing: `h-3.5 w-3.5` or `h-4 w-4`.

---

## 4. Local Admin Panel Conventions

- The admin interface is accessed via `/admin` and launched via `npm run admin` (runs on isolated port `5174`).
- All edits directly persist to disk at `src/data/portfolio.json` via the local Vite middleware (`/api/admin/portfolio`).
- Production builds (`npm run build`) exclude live file-writing endpoints, preserving 100% static hosting compatibility.
- Any new section added to the portfolio data schema in `src/types/portfolio.ts` MUST also be mapped in `AdminPage.tsx`.
