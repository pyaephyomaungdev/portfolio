<div align="center">
  <img src="public/avatar.jpg" width="96" height="96" alt="Pyae Phyo Maung Avatar" style="border-radius: 50%; border: 2px solid #e8e8e6; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" />
  <h1>Pyae Phyo Maung — Architectural Portfolio System</h1>
  <p><strong>The Swiss-Crafted, Zero-Backend Personal Portfolio & Local Visual CMS for Engineers</strong></p>
  <p>Engineered with React 19, Vite 8, TypeScript 5.8 Strict, Tailwind CSS v4, View Transitions API, Cloudflare Pages Functions edge dispatch, dynamic GitHub commit matrix, and an executive resume print engine.</p>

  <p>
    <a href="https://pyaephyomaung.dev"><img src="https://img.shields.io/badge/Live_Site-pyaephyomaung.dev-blue?style=for-the-badge&logo=cloudflarepages&logoColor=white" alt="Live Site" /></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" /></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.8_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.8" /></a>
    <a href="https://developers.cloudflare.com/pages"><img src="https://img.shields.io/badge/Edge-Cloudflare_Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare Edge" /></a>
    <a href="https://github.com/oxc-project/oxc"><img src="https://img.shields.io/badge/Oxlint-0_Warnings-emerald?style=for-the-badge&logo=oxc&logoColor=white" alt="Oxlint Clean" /></a>
    <a href="SECURITY.md"><img src="https://img.shields.io/badge/Security-Policy-brightgreen?style=for-the-badge&logo=shield&logoColor=white" alt="Security Policy" /></a>
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
    <a href="#community--contributing">Contributing</a> •
    <a href="#security-policy">Security</a> •
    <a href="#verification--quality">Quality Assurance</a>
  </p>
</div>

---

## One-Click Deployment

Deploy your own personal portfolio in seconds to your preferred edge cloud. No database, server, or API keys required:

| Provider | Instant Launch | Deployment Target | Cost |
| :--- | :--- | :--- | :--- |
| **Cloudflare Pages** | [![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/pyaephyomaungdev/portfolio) | Cloudflare Edge (330+ Cities) + Serverless Functions | $0 / month |
| **Vercel** | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpyaephyomaungdev%2Fportfolio) | Edge Network / Global CDN | $0 / month |
| **Railway** | [![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/template/new?template=https://github.com/pyaephyomaungdev/portfolio) | Containerized Web Service | Free tier ready |
| **Netlify** | [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/pyaephyomaungdev/portfolio) | High-Performance Static CDN | $0 / month |

---

## Why This Portfolio System?

| Dimension | Generic Portfolio Templates | Notion / Framer Sites | This Portfolio System |
| :--- | :--- | :--- | :--- |
| **Data Privacy & Storage** | External backend / MongoDB | Proprietary vendor lock-in | **100% Client-Side JSON + Zero Backend** |
| **Theme Switching UX** | Flash of unstyled white / snap | Abrupt CSS toggle | **Zero-FOUC + Circular View Transition Wave** |
| **Live Availability & Timezone** | Static text lines | None | **Avatar Corner Radar Badge with Live Clock & Swiss Popover** |
| **Direct Contact Notifications** | Generic mailto links only | Formspree / Typeform ($29/mo) | **Telegram Bot Zero-Leak Edge Dispatch (`functions/api/send-note.ts`)** |
| **Category Tech Filtering** | Clunky wrapping lists | Multi-select dropdowns | **Zero-Scrollbar Momentum Chip Track with Gradient Blur Navigation** |
| **Engineering Blueprints** | Uninteractive static screenshots | Heavy embed widgets | **Interactive Swiss Drafting System Architecture Blueprints** |
| **CMS Experience** | Manual code edits only | Clunky block editor | **Built-in Local Visual CMS (`/admin`) with JSON Sync** |
| **Contribution Matrix** | Static screenshots or heavy embeds | Third-party iframe widgets | **Live Dynamic SVG GitHub Heatmap (No API Key Required)** |
| **Print / CV Capability** | Broken layouts with print headers | Watermarked PDF exports | **Resume-Ready `@media print` Clean Executive CV** |
| **Performance (Lighthouse)** | ~70–80 (bloated libraries) | ~60–75 (heavy script runtime) | **100 / 100 / 100 / 100 (<250ms Build)** |
| **Editorial Typography** | Generic Inter / Roboto | Restricted web font sets | **Swiss Instrument Serif + DM Sans + SFMono** |
| **Cost & Hosting** | Monthly server costs | $15–$35 / month subscription | **$0 Forever (MIT License)** |

---

## Feature Tour

<details open>
<summary><strong>1. Live Availability & Timezone Radar Badge (Corner Anchor)</strong> (Click to collapse)</summary>

* **Avatar Bottom-Right Anchor**: Completely eliminates lengthy horizontal hero text; anchors a sleek, space-efficient circular radar beacon at the bottom-right corner of the avatar (`AvailabilityBadge.tsx`).
* **Real-Time Pulsing Beacon**: Live pulsing green indicator (`animate-ping bg-success`) with tactile ring boundary (`ring-2 ring-paper border-rule`).
* **Tactile Spring Bloom Popover**: Clicking the beacon triggers an architectural popover card with a physical 45° pointer beak notch connecting directly to the beacon center.
* **Live Asia/Bangkok Ticking Clock**: Computes exact local time via `Intl.DateTimeFormat` with IANA timezone support (`Asia/Bangkok`), response SLA tags (`<24h SLA`), and Swiss drafting crosshairs (`+`).
* **Mobile Viewport Protection**: Smart boundary positioning prevents horizontal overflow on any mobile screen (iPhone SE, Pixel 7, modern Android).

</details>

<details open>
<summary><strong>2. Telegram Bot Instant Notification & Zero-Leak Edge Architecture</strong> (Click to collapse)</summary>

* **Zero-Leak Secret Isolation**: Telegram Bot Token and Chat ID are **never exposed in client-side bundles or public JSON**.
* **Cloudflare Pages Edge Function** ([`functions/api/send-note.ts`](functions/api/send-note.ts)): Contact note submissions from the browser call `POST /api/send-note`. The Cloudflare Pages serverless function reads `context.env.TELEGRAM_BOT_TOKEN` & `context.env.TELEGRAM_CHAT_ID` and dispatches markdown notifications directly to Telegram server-to-server.
* **Local Development Secrets Isolation**: When running locally (`npm run dev`), credentials entered in Admin are saved to gitignored `.env.local` via Vite dev connect middleware.
* **Anti-Spam Honeypot**: Features an invisible off-screen honeypot trap (`hp_trap`) that silently neutralizes automated web scrapers.
* **Conditional Homepage Form**: The "Direct Message Dispatch" form on the homepage is only rendered when Telegram notifications are configured and active; otherwise, displays verified direct channels (Email copy, Telegram direct link, GitHub).

</details>

<details open>
<summary><strong>3. Horizontally Scrollable Tech Stack Filters with Gradient Blur Navigation</strong> (Click to collapse)</summary>

* **Zero-Scrollbar Momentum Track**: Dynamically derives project category tags into a single clean horizontal track with native momentum scrolling and completely hidden scrollbars (`.no-scrollbar`).
* **Real-Time Edge Blur Indicators**: Dynamically detects scroll boundaries; renders smooth transparent gradient overlays (`from-paper via-paper/90 to-transparent backdrop-blur-xs`) on the left and right edges when more content is available.
* **One-Click Chevron Navigation**: Embedded circular navigation buttons (`ChevronLeft` / `ChevronRight`) allow seamless one-click scrolling without requiring touch swiping.
* **Auto-Focus Active Pill**: Clicking any category chip smoothly scrolls the selected pill into view.

</details>

<details open>
<summary><strong>4. Interactive System Architecture Blueprints for Case Studies</strong> (Click to collapse)</summary>

* **Swiss Drafting Aesthetic**: Every featured engineering case study includes an architectural blueprint (`[BLUEPRINT // FIG 1.0]`) featuring boundary crosshairs (`+`), headline, narrative, and transport protocol badges.
* **Taxonomic Node Isolation**: Interactive nodes categorized by system role (`CLIENT`, `ENGINE`, `STORAGE`, `AGENT`, `NETWORK`). Clicking any node isolates its inbound and outbound channels and dims unrelated components.
* **Bidirectional Protocol Flow Rails**: Visual transmission data pipes displaying protocol directions (`Sync ⇄`, `Emit ──►`) and transport details (e.g., `Atomic Disk I/O`, `AES-GCM 256`, `Stdio JSON-RPC 2.0`, `BullMQ + Redis`).

</details>

<details>
<summary><strong>5. Hardware-Accelerated View Transitions Light & Dark Mode</strong> (Click to expand)</summary>

* **Circular Ripple Wave Engine**: Toggling between Light and Dark mode triggers a smooth circular clip-path wave originating from the exact `(x, y)` coordinates of the toggle button using the modern `document.startViewTransition()` API.
* **Synchronous DOM Snapshotting**: Injects `.dark` and `data-theme` state synchronously inside the transition callback, preventing DOM layout thrashing.
* **Zero-FOUC Architecture**: Synchronous inline `<head>` script evaluates `localStorage` and system `prefers-color-scheme` before DOM painting, eliminating bright white flashes on reload.
* **Sun ⇄ Moon Morphing Micro-Interaction**: Dual icons smoothly scale and rotate into view with a `duration-500` transition.

</details>

<details>
<summary><strong>6. Local-First Visual Admin CMS (`/admin`)</strong> (Click to expand)</summary>

* **No Backend Required**: Runs client-side in the browser, manipulating structured portfolio data models in memory with instant disk persistence.
* **1:1 Hero Avatar Simulation**: Profile Section includes an authentic interactive preview of the hero avatar and corner availability beacon with live popover testing.
* **Comprehensive Section Editing**: Visual CRUD interfaces for Profile, Featured Projects, Career Experience, Academic Background, Honors & Awards, Licenses & Certifications, Key Statistics, and Cloudflare Deployment.
* **Universal Up/Down Reordering**: One-click **Up (`↑`) / Down (`↓`)** reordering buttons across all arrays with intelligent edge-boundary disabling.
* **Unsaved Changes Guard & Confirmation Modals**: Custom Swiss-styled modal dialogs (`ConfirmModal.tsx`) guard unsaved modifications and prevent accidental deletions.
* **One-Click JSON Import / Export**: Export your complete portfolio configuration as a portable `.json` backup file, or import external datasets instantly.

</details>

<details>
<summary><strong>7. Cloudflare Pages Deployment & Edge Secret Hub (`/admin/deploy`)</strong> (Click to expand)</summary>

* **Deploy Hub**: Dedicated admin section with 1-click Wrangler CLI commands (`npm run deploy`), build settings copies, and direct Cloudflare dashboard project creation shortcuts.
* **SPA Routing Protection**: Includes `public/_redirects` (`/* /index.html 200`) automatically bundled into `dist/` on build to prevent 404s on deep links.
* **Edge Environment Variables Helper**: Instant 1-click copy cards for configuring `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in Cloudflare Pages dashboard.

</details>

<details>
<summary><strong>8. Kinetic Typographic Intro Loader</strong> (Click to expand)</summary>

* **Precision Drafting Frame**: Opens with Swiss architectural corner crosshairs (`+`), system OK status badge, and real-time year coordinates (`PPM // 2026`).
* **Staggered Letter Reveal**: Animates initials and full name using kinetic translateY easing.
* **Radial SVG Progress Meter**: Smooth 2.5s timeline loading image assets (`avatar.jpg`, `favicon.png`) with animated numerical percentage counter.
* **Session Persistence**: Remembers visit state in `sessionStorage` (`ppm_intro_seen`) so returning page visits skip directly to content without delay.

</details>

<details>
<summary><strong>9. Dynamic GitHub Contribution Matrix</strong> (Click to expand)</summary>

* **Zero API Token Required**: Extracts public contribution data directly via username scraping with cached fallback.
* **Adaptive Theme Palette**: Contribution squares dynamically shift between Light mode ink scale (`#ececea` → `#111110`) and Dark mode obsidian scale (`#1a1b20` → `#f4f4f2`) via CSS variables (`--heatmap-0` to `--heatmap-4`).
* **Fluid Responsive Layout**: Automatically resizes cell dimensions based on viewport width; seamlessly adds horizontal swipe indicators on mobile devices.
* **Year Navigation**: Inspect contribution activity across historical years (current year down to past 3 years).

</details>

<details>
<summary><strong>10. Resume-Ready Print Engine (`@media print`)</strong> (Click to expand)</summary>

* **Executive CV Format**: Hitting `Cmd + P` or `Ctrl + P` in any browser automatically transforms the web portfolio into a clean, monochrome curriculum vitae.
* **Web UI Elimination**: Strips out navigation bars, intro loader, floating buttons, back-to-top pill, and external links automatically.
* **Page Break Protection**: Enforces `break-inside: avoid` on career roles and education cards to prevent awkward mid-card page splits across printed pages.

</details>

<details>
<summary><strong>11. Two-Way Case Study Navigation & Dedicated 404</strong> (Click to expand)</summary>

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

### 5. Deploy to Cloudflare Pages
```bash
npm run deploy
```
Compiles production build and deploys to Cloudflare Pages edge network via Wrangler CLI.

---

## Visual Admin CMS (`/admin`)

The built-in CMS allows developers and non-developers to customize their entire portfolio without writing a line of code:

```
/admin
├── /admin/profile        → Identity, Avatar, Social Links, Availability Radar, Telegram Bot
├── /admin/projects       → Title, Slug, Case Study, Blueprints, Buy Me A Coffee, Reordering
├── /admin/experience     → Companies, Work Timeline, Roles, Descriptions, Reordering
├── /admin/education      → Degrees, Universities, Period, Descriptions, Reordering
├── /admin/honors         → Competitions, Hackathons, Awards, Organizations, Reordering
├── /admin/licenses       → Certifications, Issuers, Credential IDs, Verification URLs
├── /admin/stats          → Metric Badges, Numerical Values, Subtitles, Reordering
├── /admin/deploy         → Cloudflare Pages Edge Deployment, Secrets & SPA Routing
└── /admin/json           → Raw JSON Direct Import & Export Hub
```

### Workflow
1. Navigate to `/admin`.
2. Make edits to any section, reorder cards with **`↑`** and **`↓`** buttons.
3. Click **Save to Disk (`⌘S` / `Ctrl+S`)** to write changes directly to `src/data/portfolio.json`.
4. Click **Export** to download portable JSON backups, or **Import** to restore datasets.

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
├── functions/                  # Cloudflare Pages Serverless Edge Functions
│   └── api/
│       └── send-note.ts        # Server-side Telegram Bot dispatch & honeypot validation
├── public/                     # Static assets (Favicons, OpenGraph, Avatar)
│   ├── _redirects              # Cloudflare Pages SPA rewrite rules (/* /index.html 200)
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
│   │   │   └── sections/       # Section editors (Profile, Projects, Exp, Deploy)
│   │   ├── ArchitectureBlueprint.tsx # Interactive Swiss drafting case study blueprints
│   │   ├── AvailabilityBadge.tsx     # Avatar corner radar beacon with popover notch
│   │   ├── BackToTopButton.tsx       # Smooth-scrolling floating action button
│   │   ├── BuyMeACoffeeButton.tsx    # Official brand BMC support button & card
│   │   ├── ContactForm.tsx           # Honeypot-protected edge dispatch note form
│   │   ├── ContactModal.tsx          # Direct engineering channels hub dialog
│   │   ├── ContributionHeatmap.tsx   # Live SVG GitHub matrix
│   │   ├── ExpandableText.tsx        # Truncated description accordion
│   │   ├── IntroLoader.tsx           # Kinetic typographic preloader
│   │   ├── ProjectCategoryFilter.tsx # Zero-scrollbar momentum chip track with gradient blur
│   │   ├── SiteChrome.tsx            # SiteHeader, SiteFooter, mobile navigation
│   │   └── ThemeToggle.tsx           # Sun/Moon morphing button with View Transitions
│   ├── context/
│   │   └── ThemeContext.tsx    # Zero-FOUC theme state with circular ripple engine
│   ├── data/
│   │   ├── portfolio.json      # Single source of truth (Profile, Projects, Career)
│   │   └── portfolioData.ts    # Type-safe client fallback data
│   ├── pages/
│   │   ├── AdminPage.tsx       # Local CMS layout & tab controller
│   │   ├── HomePage.tsx        # Editorial single-page portfolio layout
│   │   ├── NotFoundPage.tsx    # Architectural 404 Not Found error view
│   │   └── ProjectPage.tsx     # Detailed case study view with 2-way navigation
│   ├── types/
│   │   └── portfolio.ts        # TypeScript data model interfaces
│   ├── App.tsx                 # Root router with ThemeProvider wrap
│   ├── index.css               # Tailwind v4 @theme, tokens, View Transitions, no-scrollbar
│   └── main.tsx                # Client application entry point
├── DESIGN_TOKENS.md            # Official design tokens specification
├── index.html                  # HTML entry with Zero-FOUC script & JSON-LD
├── package.json                # Project dependencies & scripts
└── vite.config.ts              # Vite config with admin server connect middleware
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

## Community & Contributing

We welcome community feedback, bug reports, and architectural contributions!

- **[Contributing Guidelines](CONTRIBUTING.md)**: Local dev setup, design token guidelines, and quality standards.
- **[Code of Conduct](CODE_OF_CONDUCT.md)**: Contributor Covenant standards.
- **[Issue Templates](.github/ISSUE_TEMPLATE/)**: Structured forms for [Bug Reports](.github/ISSUE_TEMPLATE/bug_report.yml) and [Feature Requests](.github/ISSUE_TEMPLATE/feature_request.yml).
- **[Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md)**: Quality checklist for all PRs.

---

## Security Policy

Security vulnerabilities can be reported privately according to our **[Security Policy](SECURITY.md)** or via **[contact@pyaephyomaung.dev](mailto:contact@pyaephyomaung.dev)**.

RFC 9116 Vulnerability Disclosure metadata is published at `https://pyaephyomaung.dev/.well-known/security.txt`.

---

## License

This project is open source and available under the **[MIT License](LICENSE)**.

Developed with ❤️ by **[Pyae Phyo Maung](https://pyaephyomaung.dev)**
