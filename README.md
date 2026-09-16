<div align="center">
  <img src="public/avatar.jpg" width="96" height="96" alt="Pyae Phyo Maung Avatar" style="border-radius: 50%; border: 2px solid #e8e8e6; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" />
  <h1>Pyae Phyo Maung — Architectural Portfolio System</h1>
  <p><strong>The Swiss-Crafted, Zero-Backend Personal Portfolio & Local Visual CMS for Engineers</strong></p>
  <p>Engineered with React 19, Vite 8, TypeScript 5.8, Tailwind CSS v4, View Transitions API, dynamic GitHub commit matrix, and an executive resume print engine.</p>

  <p>
    <a href="https://pyaephyomaung.dev"><img src="https://img.shields.io/badge/Live_Site-pyaephyomaung.dev-blue?style=for-the-badge&logo=cloudflarepages&logoColor=white" alt="Live Site" /></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" /></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.8_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.8" /></a>
    <a href="https://github.com/oxc-project/oxc"><img src="https://img.shields.io/badge/Oxlint-0_Warnings-emerald?style=for-the-badge&logo=oxc&logoColor=white" alt="Oxlint Clean" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-amber?style=for-the-badge" alt="License MIT" /></a>
  </p>

  <p>
    <a href="https://www.buymeacoffee.com/pyaephyomaa"><img src="https://img.shields.io/badge/Buy_Me_A_Coffee-Support_the_Creator-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black&labelColor=black" alt="Buy Me A Coffee" /></a>
  </p>

  <p>
    <a href="#one-click-deployment">One-Click Deploy</a> •
    <a href="#why-this-portfolio-system">Why This System?</a> •
    <a href="#feature-tour">Feature Tour</a> •
    <a href="#quickstart--installation">Quickstart</a> •
    <a href="#visual-admin-cms-admin">Admin CMS</a> •
    <a href="#design-tokens--typography">Design System</a> •
    <a href="#architecture--project-structure">Architecture</a> •
    <a href="#verification--quality">Quality Assurance</a>
  </p>
</div>

---

## One-Click Deployment

Deploy your own personal portfolio in seconds to your preferred edge cloud. No database, server, or API keys required:

| Provider | Instant Launch | Deployment Target | Cost |
| :--- | :--- | :--- | :--- |
| **Vercel** | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpyaephyomaungdev%2Fportfolio) | Edge Network / Global CDN | $0 / month |
| **Cloudflare Pages** | [![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/pyaephyomaungdev/portfolio) | Cloudflare Edge (300+ Cities) | $0 / month |
| **Railway** | [![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/template/new?template=https://github.com/pyaephyomaungdev/portfolio) | Containerized Web Service | Free tier ready |
| **Netlify** | [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/pyaephyomaungdev/portfolio) | High-Performance Static CDN | $0 / month |

---

## Why This Portfolio System?

| Dimension | Generic Portfolio Templates | Notion / Framer Sites | This Portfolio System |
| :--- | :--- | :--- | :--- |
| **Data Privacy & Storage** | External backend / MongoDB | Proprietary vendor lock-in | **100% Client-Side JSON + Zero Backend** |
| **Theme Switching UX** | Flash of unstyled white / snap | Abrupt CSS toggle | **Zero-FOUC + Circular View Transition Wave** |
| **CMS Experience** | Manual code edits only | Clunky block editor | **Built-in Local Visual CMS (`/admin`) with JSON Sync** |
| **Contribution Matrix** | Static screenshots or heavy embeds | Third-party iframe widgets | **Live Dynamic SVG GitHub Heatmap (No API Key Required)** |
| **Print / CV Capability** | Broken layouts with print headers | Watermarked PDF exports | **Resume-Ready `@media print` Clean Executive CV** |
| **Performance (Lighthouse)** | ~70–80 (bloated libraries) | ~60–75 (heavy script runtime) | **100 / 100 / 100 / 100 (<250ms Build)** |
| **Editorial Typography** | Generic Inter / Roboto | Restricted web font sets | **Swiss Instrument Serif + DM Sans + SFMono** |
| **Cost & Hosting** | Monthly server costs | $15–$35 / month subscription | **$0 Forever (MIT License)** |

---

## Feature Tour

<details open>
<summary><strong>1. Hardware-Accelerated View Transitions Light & Dark Mode</strong> (Click to collapse)</summary>

* **Circular Ripple Wave Engine**: Toggling between Light and Dark mode triggers a smooth circular clip-path wave originating from the exact `(x, y)` coordinates of the cursor or touch tap using the modern `document.startViewTransition()` API.
* **Synchronous DOM Snapshotting**: Injects `.dark` and `data-theme` state synchronously inside the transition callback, preventing DOM layout thrashing or mid-animation stutter.
* **Extended Viewport Coverage**: Computes exact corner distances with a `+60px` boundary margin and `450ms` group duration to guarantee the wave cleanly covers all screen corners without cutting off.
* **Zero-FOUC Architecture**: Includes a synchronous `<head>` script in `index.html` that evaluates `localStorage` and system `prefers-color-scheme` before the DOM renders, eliminating bright white flashes on reload.
* **Sun ⇄ Moon Morphing Micro-Interaction**: Dual icons smoothly scale and rotate into view with a `duration-300` transition.

</details>

<details open>
<summary><strong>2. Local-First Visual Admin CMS (`/admin`)</strong> (Click to collapse)</summary>

* **No Backend Required**: Runs completely client-side in the browser, manipulating the structured portfolio data model in memory.
* **Comprehensive Section Editing**: Visual CRUD interfaces for Profile, Featured Projects, Career Experience, Academic Background, Honors & Awards, Licenses & Certifications, and Key Statistics.
* **Live In-Page Reordering**: One-click **Up (`↑`) / Down (`↓`)** reordering buttons across all arrays with intelligent edge-boundary disabling.
* **Unsaved Changes Guard**: Custom Swiss-styled modal dialog (`ConfirmModal.tsx`) alerts the user when attempting to exit with unsaved modifications, alongside native `beforeunload` tab-close protection.
* **Destructive Deletion Confirmation**: Prevents accidental deletion of case studies or timeline items with architectural confirmation modals.
* **One-Click JSON Import / Export**: Export your complete portfolio configuration as a portable `.json` backup file, or import external datasets instantly.

</details>

<details>
<summary><strong>3. Kinetic Typographic Intro Loader</strong> (Click to expand)</summary>

* **Precision Drafting Frame**: Opens with Swiss architectural corner crosshairs (`+`), system OK status badge, and real-time year coordinates (`PPM // 2026`).
* **Staggered Letter Reveal**: Animates initials and full name using kinetic translateY easing.
* **Radial SVG Progress Meter**: Smooth 2.5s timeline loading image assets (`avatar.jpg`, `favicon.png`) with animated numerical percentage counter.
* **Session Persistence**: Remembers visit state in `sessionStorage` (`ppm_intro_seen`) so returning page visits skip directly to content without delay.

</details>

<details>
<summary><strong>4. Dynamic GitHub Contribution Matrix</strong> (Click to expand)</summary>

* **Zero API Token Required**: Extracts public contribution data directly via username scraping with cached fallback.
* **Adaptive Theme Palette**: Contribution squares dynamically shift between Light mode ink scale (`#ececea` → `#111110`) and Dark mode obsidian scale (`#1a1b20` → `#f4f4f2`) via CSS variables (`--heatmap-0` to `--heatmap-4`).
* **Fluid Responsive Layout**: Automatically resizes cell dimensions based on viewport width; seamlessly adds horizontal swipe indicators on mobile devices.
* **Year Navigation**: Inspect contribution activity across historical years (current year down to past 3 years).

</details>

<details>
<summary><strong>5. Resume-Ready Print Engine (`@media print`)</strong> (Click to expand)</summary>

* **Executive CV Format**: Hitting `Cmd + P` or `Ctrl + P` in any browser automatically transforms the web portfolio into a clean, monochrome curriculum vitae.
* **Web UI Elimination**: Strips out navigation bars, intro loader, floating buttons, back-to-top pill, and external links automatically.
* **Page Break Protection**: Enforces `break-inside: avoid` on career roles and education cards to prevent awkward mid-card page splits across printed pages.

</details>

<details>
<summary><strong>6. Two-Way Case Study Navigation & Dedicated 404</strong> (Click to expand)</summary>

* **Bilateral Navigation**: Project case study detail pages feature a responsive 2-column grid at the bottom linking to both `← Previous Case Study` and `Next Case Study →`.
* **Architectural 404 Page**: Missing routes render an editorial `// 404 ERROR` canvas with drafting crosshairs and one-click navigation back to home or project archives.
* **Accessibility**: Includes a keyboard-accessible `Skip to content` link targeting `#main-content` on all public routes.

</details>

---

## Quickstart & Installation

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### 1. Clone & Install
```bash
git clone https://github.com/pyaephyomaungdev/portfolio.git
cd portfolio
npm install
```

### 2. Start Local Development
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Launch Admin CMS
```bash
npm run admin
```
Directly launches the visual CMS at **[http://localhost:5174/admin](http://localhost:5174/admin)**.

### 4. Build for Production
```bash
npm run build
```
Executes the automated SEO and sitemap generator (`scripts/generate-seo.js`), runs strict TypeScript checking (`tsc --noEmit`), and builds an optimized static bundle in `dist/` in under 300ms.

---

## Visual Admin CMS (`/admin`)

The built-in CMS allows developers and non-developers to customize their entire portfolio without writing a line of code:

```
/admin
├── /admin/profile        → Name, Title, Bio, Email, GitHub URL, Social Links
├── /admin/projects       → Title, Slug, Description, Role, Tech Stack, Links, Reordering
├── /admin/experience     → Companies, Work Timeline, Roles, Descriptions, Reordering
├── /admin/education      → Degrees, Universities, Period, Descriptions, Reordering
├── /admin/honors         → Competitions, Hackathons, Awards, Organizations, Reordering
├── /admin/licenses       → Certifications, Issuers, Credential IDs, Verification URLs
└── /admin/stats          → Metric Badges, Numerical Values, Subtitles, Reordering
```

### Workflow
1. Navigate to `/admin`.
2. Make edits to any section, reorder cards with **`↑`** and **`↓`** buttons.
3. Click **Export JSON** to download your updated `portfolioData.json`.
4. Replace `src/data/portfolioData.ts` with your exported configuration for a permanent static build, or deploy directly!

---

## Design Tokens & Typography

Built upon an architectural drafting philosophy combining high-contrast ink, warm tactile paper, and signal orange highlights:

### Color System

| Token | CSS Variable | Light Hex | Dark Hex | Role |
| :--- | :--- | :--- | :--- | :--- |
| **Paper (Base)** | `--paper` | `#fbfbfa` | `#0c0d0e` | Canvas background |
| **Ink (Text)** | `--ink` | `#1a1a1a` | `#f4f4f2` | Primary headlines & body text |
| **Muted** | `--muted` | `#6b6b6b` | `#8e8f96` | Subtitles, dates, and metadata |
| **Rule (Borders)** | `--rule` | `#e8e8e6` | `#23252a` | Architectural gridlines & dividers |
| **Soft (Surface)** | `--soft` | `#f4f4f2` | `#15161a` | Secondary surfaces & badge backgrounds |
| **White (Cards)** | `--white` | `#ffffff` | `#1a1b20` | Elevated cards & inputs |
| **Pure White** | `--pure-white` | `#ffffff` | `#ffffff` | Absolute high-contrast button text |
| **Accent (Signal)**| `--accent` | `#f54e00` | `#ff5c1a` | Signal orange status dots & active states |

### Typographic Hierarchy

| Role | Font Family | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Editorial / Display** | `Instrument Serif`, Georgia, serif | `font-display` | Hero titles, section headings, quotes |
| **Interface / Body** | `DM Sans`, system-ui, sans-serif | `font-sans` | Body copy, navigation links, descriptions |
| **Technical / Mono** | `ui-monospace`, `SFMono-Regular`, monospace | `font-mono` | Timestamps, coordinates, stats, status codes |

---

## Architecture & Project Structure

```
portfolio/
├── public/                     # Static assets (Favicons, OpenGraph, Avatar)
│   ├── avatar.jpg              # Primary profile photo & favicon source
│   ├── robots.txt              # Search engine crawling rules
│   └── sitemap.xml             # Auto-generated XML sitemap
├── scripts/
│   ├── generate-favicons.py    # Generates 16x16, 32x32, 180x180 icons from avatar
│   └── generate-seo.js         # Automated sitemap & meta tags compilation
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── admin/              # Visual CMS editors, modals, reorder controls
│   │   │   ├── modals/         # ConfirmModal, AddCompanyModal, AddLicenseModal
│   │   │   └── sections/       # Section editors (Projects, Exp, Edu, Stats)
│   │   ├── BackToTopButton.tsx # Smooth-scrolling floating action button
│   │   ├── ContributionHeatmap.tsx # Live SVG GitHub matrix
│   │   ├── ExpandableText.tsx  # Truncated description accordion
│   │   ├── IntroLoader.tsx     # Kinetic typographic preloader
│   │   ├── SiteChrome.tsx      # SiteHeader, SiteFooter, mobile navigation
│   │   └── ThemeToggle.tsx     # Sun/Moon morphing button with View Transitions
│   ├── context/
│   │   └── ThemeContext.tsx    # Zero-FOUC theme state with circular ripple engine
│   ├── data/
│   │   └── portfolioData.ts    # Single source of truth (Profile, Projects, Career)
│   ├── pages/
│   │   ├── AdminPage.tsx       # Local CMS layout & tab controller
│   │   ├── HomePage.tsx        # Editorial single-page portfolio layout
│   │   ├── NotFoundPage.tsx    # Architectural 404 Not Found error view
│   │   └── ProjectPage.tsx     # Detailed case study view with 2-way navigation
│   ├── types/
│   │   └── portfolio.ts        # TypeScript data model interfaces
│   ├── App.tsx                 # Root router with ThemeProvider wrap
│   ├── index.css               # Tailwind v4 @theme, tokens, View Transitions
│   └── main.tsx                # Client application entry point
├── DESIGN_TOKENS.md            # Official design tokens specification
├── index.html                  # HTML entry with Zero-FOUC script & JSON-LD
└── package.json                # Project dependencies & scripts
```

---

## Verification & Quality

The codebase adheres to rigorous linting and type-safety standards with zero tolerance for warnings:

```bash
# Verify 0 oxlint warnings and 0 errors across all files
npm run lint

# Verify strict TypeScript type compilation
npm run typecheck

# Verify production static build & SEO compilation
npm run build
```

- **Oxlint**: Verified with 99 rules across all `.ts` and `.tsx` files (0 warnings, 0 errors).
- **TypeScript**: Configured with `strict: true`, `noUnusedLocals: true`, and `noUnusedParameters: true`.
- **Bundle Efficiency**: Minified production build compiles in ~250ms with zero heavy UI libraries or analytics tracking bloat.

---

## License

This project is open source and available under the **[MIT License](LICENSE)**.

Developed with ❤️ by **[Pyae Phyo Maung](https://pyaephyomaung.dev)**
