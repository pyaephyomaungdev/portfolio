# Contributing to Portfolio

Thank you for your interest in contributing or exploring the architecture behind **Pyae Phyo Maung's Engineering Portfolio**!

---

## Code of Conduct

All contributors and participants are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Local Development

### Prerequisites

- **Node.js**: `v20.x` or later (Node 22+ recommended).
- **Package Manager**: `npm`.
- **Python 3**: (Optional, used by `scripts/generate-favicons.py`).

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pyaephyomaungdev/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local Vite dev server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Launch the Local Admin CMS**:
   ```bash
   npm run admin
   ```
   Open [http://localhost:5174/admin](http://localhost:5174/admin) to manage projects, roles, and availability with instant two-way JSON disk syncing.

---

## Quality & Verification Standards

Before committing changes, ensure that all quality gates pass:

```bash
# 1. Run ultra-fast linter (oxlint)
npm run lint

# 2. Strict TypeScript typechecking
npm run typecheck

# 3. Production build (includes SEO generator)
npm run build
```

---

## Pull Request Guidelines

- Use descriptive commit messages following the Conventional Commits specification (`feat:`, `fix:`, `docs:`, `perf:`).
- Verify that design tokens in [`DESIGN_TOKENS.md`](DESIGN_TOKENS.md) are preserved (`bg-paper`, `text-ink`, `border-rule`, `font-display`, `font-mono`).
- Ensure 0 oxlint warnings and 0 TypeScript errors.
