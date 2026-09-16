import { useState } from "react";
import {
  Cloud,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Rocket,
  Code,
  Sliders
} from "lucide-react";
import type { Profile } from "../../../types/portfolio";

interface DeploySectionProps {
  profile?: Profile | null;
}

export function DeploySection({ profile: _profile }: DeploySectionProps = {}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const pagesDeployDashboardUrl = "https://dash.cloudflare.com/?to=/:account/pages/new";
  const pagesListDashboardUrl = "https://dash.cloudflare.com/?to=/:account/pages";

  const markdownBadge = `[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy%20to-Cloudflare%20Pages-F38020?style=for-the-badge&logo=cloudflarepages&logoColor=white)](https://dash.cloudflare.com/?to=/:account/pages)`;

  function copyToClipboard(text: string, key: string) {
    void navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-rule pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              Deploy to Cloudflare Pages
            </h2>
            <span className="inline-flex items-center gap-1 rounded border border-accent/40 bg-accent-soft px-2 py-0.5 font-mono text-xs font-semibold text-accent">
              <Cloud className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Pages Edge</span>
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Host your portfolio on Cloudflare Pages with zero cost, unlimited bandwidth, and automated Git deployments.
          </p>
        </div>

        <a
          href={pagesListDashboardUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-3 py-1.5 font-mono text-xs text-ink hover:border-ink/40 transition shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <span>Cloudflare Pages Dashboard</span>
          <ExternalLink className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
        </a>
      </div>

      {/* Direct Deploy Hero Card */}
      <section className="rounded-2xl border border-rule bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-display text-xl font-semibold text-ink">
              Create New Cloudflare Pages Project
            </h3>
            <p className="text-xs text-muted max-w-lg">
              Click below to open Cloudflare Pages directly. Select &ldquo;Connect to Git&rdquo; or &ldquo;Direct Upload&rdquo; to deploy your portfolio to the global edge network.
            </p>
          </div>

          <a
            href={pagesDeployDashboardUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 font-medium text-sm text-paper transition hover:opacity-90 shadow-xs cursor-pointer shrink-0"
          >
            <Cloud className="h-4 w-4 text-accent" aria-hidden="true" />
            <span>Deploy to Cloudflare Pages</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
          </a>
        </div>

        {/* Cloudflare Pages Build Settings */}
        <div className="border-t border-rule pt-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Sliders className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
              Recommended Cloudflare Pages Build Settings
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-rule bg-soft/40 p-3">
              <span className="block text-xs text-muted">Framework Preset</span>
              <div className="flex items-center justify-between mt-1 font-mono text-xs font-semibold text-ink">
                <span>Vite</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard("Vite", "cfg-preset")}
                  className="text-muted hover:text-ink transition cursor-pointer"
                >
                  {copiedKey === "cfg-preset" ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-rule bg-soft/40 p-3">
              <span className="block text-xs text-muted">Build Command</span>
              <div className="flex items-center justify-between mt-1 font-mono text-xs font-semibold text-ink">
                <code>npm run build</code>
                <button
                  type="button"
                  onClick={() => copyToClipboard("npm run build", "cfg-build")}
                  className="text-muted hover:text-ink transition cursor-pointer"
                >
                  {copiedKey === "cfg-build" ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-rule bg-soft/40 p-3">
              <span className="block text-xs text-muted">Build Output Directory</span>
              <div className="flex items-center justify-between mt-1 font-mono text-xs font-semibold text-ink">
                <code>dist</code>
                <button
                  type="button"
                  onClick={() => copyToClipboard("dist", "cfg-output")}
                  className="text-muted hover:text-ink transition cursor-pointer"
                >
                  {copiedKey === "cfg-output" ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terminal Deploy (Wrangler for Pages) */}
      <section className="rounded-xl border border-rule bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-ink" aria-hidden="true" />
            <h3 className="font-semibold text-sm text-ink">
              Wrangler CLI for Cloudflare Pages
            </h3>
          </div>
          <span className="font-mono text-xs text-muted">Command Line</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Quick npm run deploy */}
          <div className="rounded-lg border border-rule bg-soft/40 p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono font-semibold text-ink flex items-center gap-1.5">
                  <Rocket className="h-3.5 w-3.5 text-accent" />
                  <span>npm run deploy</span>
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard("npm run deploy", "cli-deploy")}
                  className="font-mono text-xs text-muted hover:text-ink transition cursor-pointer"
                >
                  {copiedKey === "cli-deploy" ? (
                    <span className="text-success flex items-center gap-1">
                      <Check className="h-3 w-3" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="h-3 w-3" /> Copy
                    </span>
                  )}
                </button>
              </div>
              <p className="text-xs text-muted mt-1">
                Runs production build and deploys <code className="font-mono bg-white px-1 rounded">dist</code> directly to Cloudflare Pages.
              </p>
            </div>
            <pre className="mt-3 rounded border border-rule bg-white p-2 font-mono text-xs text-ink">
              <code>npm run deploy</code>
            </pre>
          </div>

          {/* Wrangler CLI direct */}
          <div className="rounded-lg border border-rule bg-soft/40 p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono font-semibold text-ink">Wrangler Pages Command</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard("npx wrangler pages deploy dist", "cli-wrangler")}
                  className="font-mono text-xs text-muted hover:text-ink transition cursor-pointer"
                >
                  {copiedKey === "cli-wrangler" ? (
                    <span className="text-success flex items-center gap-1">
                      <Check className="h-3 w-3" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="h-3 w-3" /> Copy
                    </span>
                  )}
                </button>
              </div>
              <p className="text-xs text-muted mt-1">
                Direct Cloudflare Pages upload command via Wrangler.
              </p>
            </div>
            <pre className="mt-3 rounded border border-rule bg-white p-2 font-mono text-xs text-ink">
              <code>npx wrangler pages deploy dist</code>
            </pre>
          </div>
        </div>
      </section>

      {/* SPA Routing & README Badge */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* SPA Routing */}
        <section className="rounded-xl border border-rule bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-ink">
              <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
              <h3 className="font-semibold text-sm">Cloudflare Pages SPA Routing</h3>
            </div>
            <span className="rounded bg-success-soft border border-success/30 px-2 py-0.5 font-mono text-xs text-success font-medium">
              Active
            </span>
          </div>

          <p className="text-xs text-muted">
            All subroutes are rewritten to <code className="font-mono bg-soft px-1 rounded">/index.html</code> so deep links and hard page refreshes never return 404.
          </p>

          <pre className="rounded-lg border border-rule bg-soft p-3 font-mono text-xs text-ink">
            <code>/*    /index.html   200</code>
          </pre>
        </section>

        {/* README Badge */}
        <section className="rounded-xl border border-rule bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-ink">
              <Code className="h-4 w-4 text-muted" aria-hidden="true" />
              <h3 className="font-semibold text-sm">README.md Badge</h3>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(markdownBadge, "badge-md")}
              className="font-mono text-xs text-muted hover:text-ink transition cursor-pointer"
            >
              {copiedKey === "badge-md" ? (
                <span className="text-success flex items-center gap-1">
                  <Check className="h-3 w-3" /> Copied
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Copy className="h-3 w-3" /> Copy Markdown
                </span>
              )}
            </button>
          </div>

          <p className="text-xs text-muted">
            Official Cloudflare Pages badge for your GitHub repository:
          </p>

          <pre className="rounded-lg border border-rule bg-soft p-3 font-mono text-xs text-ink overflow-x-auto whitespace-pre-wrap break-all">
            <code>{markdownBadge}</code>
          </pre>
        </section>
      </div>

      {/* Cloudflare Pages Functions & Secrets Card */}
      <section className="rounded-2xl border border-rule bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-rule pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-semibold text-ink">
                Cloudflare Pages Functions &amp; Environment Variables
              </h3>
              <span className="inline-flex items-center gap-1 rounded border border-accent/40 bg-accent-soft px-2 py-0.5 font-mono text-xs font-semibold text-accent">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Zero-Leak Edge Secrets</span>
              </span>
            </div>
            <p className="text-xs text-muted">
              For live Telegram Bot notifications on Cloudflare Pages, add these environment variables in your Cloudflare dashboard (Settings &rarr; Environment variables).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-rule bg-soft/40 p-3.5 flex items-center justify-between">
            <div>
              <span className="block font-mono text-xs font-semibold text-ink">TELEGRAM_BOT_TOKEN</span>
              <span className="block text-xs text-muted">Bot HTTP API token from @BotFather</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard("TELEGRAM_BOT_TOKEN", "env-token")}
              className="rounded border border-rule bg-white px-2.5 py-1 font-mono text-xs text-ink hover:border-ink transition cursor-pointer shadow-2xs"
            >
              {copiedKey === "env-token" ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="rounded-lg border border-rule bg-soft/40 p-3.5 flex items-center justify-between">
            <div>
              <span className="block font-mono text-xs font-semibold text-ink">TELEGRAM_CHAT_ID</span>
              <span className="block text-xs text-muted">Your Telegram numeric user ID or channel</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard("TELEGRAM_CHAT_ID", "env-chat")}
              className="rounded border border-rule bg-white px-2.5 py-1 font-mono text-xs text-ink hover:border-ink transition cursor-pointer shadow-2xs"
            >
              {copiedKey === "env-chat" ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
