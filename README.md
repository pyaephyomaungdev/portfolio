# Pyae Phyo Maung - Personal Portfolio

A sleek, minimalist, personal portfolio web application built with **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS v4**.

## Features

- **100% Standalone**: Completely decoupled from any backend database or server.
- **Instant Load**: Pre-seeded with authentic profile, projects, career experience, education, and certifications data.
- **GitHub Heatmap**: Displays live GitHub contributions dynamically.
- **Responsive Design**: Mobile-friendly navigation, typography, and dark-ready ink aesthetic.
- **Zero-Cost Deployment**: Ready for Vercel, Cloudflare Pages, Netlify, or GitHub Pages.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
The output will be placed in the `dist/` directory, ready for any static web host.

## Customization

- To edit your profile, experience, projects, or education, edit `src/data/portfolioData.ts`.
- To change the GitHub username for the contribution heatmap, set `VITE_GITHUB_USERNAME` in `.env`.
- To connect to an optional custom backend API, set `VITE_API_BASE` in `.env`.
