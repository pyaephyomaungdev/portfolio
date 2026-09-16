# Design Tokens Reference

This document outlines the official design tokens, typography, layout rules, and component patterns for the **PPM Portfolio** system.

---

## 1. Color Palette

The color system is built on a **Swiss / Architectural Editorial** visual aesthetic: warm tactile paper, deep ink contrast, subtle boundary rules, and an international electric orange accent.

| Token | CSS Variable | Tailwind Utility | Light Hex | Dark Hex | Usage |
|---|---|---|---|---|---|
| **Paper (Base)** | `--paper` | `bg-paper` | `#fbfbfa` | `#0c0d0e` | Primary canvas & background. Soft warm off-white in light, matte obsidian in dark. |
| **Ink (Text)** | `--ink` | `text-ink`, `bg-ink` | `#1a1a1a` | `#f4f4f2` | Primary text, titles, high-contrast badges & primary CTA buttons. |
| **Muted** | `--muted` | `text-muted` | `#6b6b6b` | `#8e8f96` | Secondary descriptions, timestamps, subtitles, and subtle glyphs. |
| **Rule (Borders)** | `--rule` | `border-rule` | `#e8e8e6` | `#23252a` | Architectural gridlines, structural dividers, card borders. |
| **Soft (Surface)** | `--soft` | `bg-soft` | `#f4f4f2` | `#15161a` | Subtle container backgrounds, code blocks, chip badges. |
| **White (Elevated)** | `--white` | `bg-white` | `#ffffff` | `#1a1b20` | Elevated cards, interactive inputs, floating headers. |
| **Pure White** | `--pure-white` | `text-pure-white` | `#ffffff` | `#ffffff` | Absolute high-contrast pure white text for colored/destructive buttons. |
| **Accent (Signal)**| `--accent`| `text-accent`, `bg-accent`| `#f54e00` | `#ff5c1a` | Signal orange for live badges, status indicators, and active highlights. |
| **Accent Soft** | `--accent-soft` | `bg-accent-soft` | `#ffe8de` | `#2e160a` | Tinted background for active states and alert highlights. |
| **Destructive** | `--color-destructive` | `text-destructive` | `#b91c1c` | `#ef4444` | Deletions, warnings, and error statuses. |

---

## 2. Typography

The typographic hierarchy pairs an editorial serif with a geometric Swiss neo-grotesque and crisp monospace.

| Role | Font Family | Tailwind Class | Recommended Weights | Usage |
|---|---|---|---|---|
| **Display / Editorial** | `Instrument Serif`, Georgia, serif | `font-display` | Regular (`font-normal`), Italic (`italic`) | Hero names, section titles, quote callouts, large headlines. |
| **Body / Interface** | `DM Sans`, system-ui, sans-serif | `font-sans` | Regular (`font-normal`), Medium (`font-medium`), Bold (`font-semibold`) | Body text, UI labels, descriptions, navigation items. |
| **Technical / Monospace**| `ui-monospace`, `SFMono-Regular`, monospace | `font-mono` | Regular, Medium, Bold | Timestamps, version numbers, coordinates, tags, status codes (`PPM // 2026`). |

### Typographic Scales & Pairings
- **Hero Title**: `text-4xl sm:text-6xl md:text-7xl font-display font-normal text-ink tracking-tight`
- **Section Heading**: `text-2xl sm:text-3xl font-display font-normal text-ink`
- **Component Subtitle / Eyebrow**: `text-xs font-mono uppercase tracking-widest text-muted`
- **Body Copy**: `text-sm sm:text-base text-muted leading-relaxed`
- **Metadata / Stat Value**: `text-xl sm:text-2xl font-mono font-semibold text-ink`

---

## 3. Borders, Grids & Corners

To preserve an architectural drafting look and feel:

- **Border Width**: Standard `1px` (`border border-rule`).
- **Corner Radius**:
  - `rounded-none` for rigid grid containers and section borders.
  - `rounded-md` (`6px`) or `rounded-lg` (`8px`) for interactive buttons, chips, and cards.
  - `rounded-full` strictly for avatar thumbnails, status dot indicators, and pill tags.
- **Drafting Crosshairs**: Precision corner marks (`+`) positioned at boundary intersections:
  ```html
  <span class="pointer-events-none absolute left-3 top-3 font-mono text-xs text-muted/60">+</span>
  ```

---

## 4. Iconography Standards

All directional symbols and status indicators must use **Lucide React** icons rather than raw unicode text arrows (`→`, `←`, `↓`, `↗`, `✓`).

| Concept | Recommended Icon | Lucide Import | Example Class |
|---|---|---|---|
| **External Link** | Diagonal Arrow | `ExternalLink` | `h-3.5 w-3.5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5` |
| **Action / Next** | Right Arrow | `ArrowRight` | `h-4 w-4 transition-transform group-hover:translate-x-1` |
| **Back / Return** | Left Arrow | `ArrowLeft` | `h-4 w-4 transition-transform group-hover:-translate-x-1` |
| **Scroll / Down** | Down Arrow | `ArrowDown` | `h-4 w-4 animate-bounce` |
| **Success / Verified** | Checkmark | `Check` | `h-3.5 w-3.5 text-ink` |
| **Save Action** | Floppy Disk | `Save` | `h-4 w-4 mr-2` |
| **Reset / Revert** | Undo Arrow | `RotateCcw` | `h-4 w-4 mr-2` |

---

## 5. Animation & Motion Tokens

- **Curtain Reveal**: `cubic-bezier(0.85, 0, 0.15, 1)` for opening screens.
- **Typographic Slide**: `cubic-bezier(0.16, 1, 0.3, 1)` with `duration-700` and staggered delay (`delay-[n]ms`).
- **Hover Transitions**: `transition-all duration-200 ease-out`.
- **Accessibility**: All keyframe animations MUST respect `@media (prefers-reduced-motion: reduce)`.
