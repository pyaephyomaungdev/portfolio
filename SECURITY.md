# Security Policy

## Supported Versions

This personal engineering portfolio and local CMS architecture are actively maintained on the default branch.

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Security Architecture & Defenses

1. **Zero-Leak Serverless Edge**: The direct project contact note dispatch (`/api/send-note`) runs on Cloudflare Pages Functions. Telegram bot tokens and chat IDs are stored exclusively as server-side environment secrets and never exposed in client bundles.
2. **Strict HTTP Security Headers**: Configured with 6/6 strict headers in `public/_headers` (HSTS preload, CSP with `default-src 'self'`, `X-Frame-Options: SAMEORIGIN`, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`).
3. **Local-Only Admin CMS**: The `/admin` CMS API and disk writing middleware are confined strictly to Vite development mode (`import.meta.env.DEV`), ensuring that production deployments remain 100% immutable and static on Cloudflare Pages.

## Reporting a Vulnerability

If you discover a security vulnerability or misconfiguration, please report it privately:

📧 **[contact@pyaephyomaung.dev](mailto:contact@pyaephyomaung.dev)**

Please include:
- A description of the vulnerability and its potential impact.
- Steps to reproduce or proof-of-concept.
- Environment details (browser, device).

### Response Timelines

- **Initial Response**: Within 24–48 hours.
- **Remediation**: Confirmed security issues will be patched and deployed immediately.

### Security Disclosures & Standards

Our RFC 9116 vulnerability disclosure metadata is published at:
`https://pyaephyomaung.dev/.well-known/security.txt`
