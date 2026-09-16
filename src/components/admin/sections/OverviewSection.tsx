import { Link } from "react-router-dom";
import {
  ExternalLink,
  Layers,
  Briefcase,
  Award,
  BadgeCheck,
  BarChart2,
  Radio,
  Send,
  Printer,
  ArrowRight,
  FileCode2,
  Eye,
  GraduationCap,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import type { Portfolio, AvailabilityConfig } from "../../../types/portfolio";
import type { AdminTab } from "../AdminSidebar";

interface OverviewSectionProps {
  portfolio: Portfolio;
  onUpdateAvailability: (patch: Partial<AvailabilityConfig>) => void;
  onNavigateTab: (tabId: AdminTab) => void;
}

export function OverviewSection({
  portfolio,
  onUpdateAvailability,
  onNavigateTab,
}: OverviewSectionProps) {
  const profile = portfolio.profile;
  const projects = portfolio.projects || [];
  const experience = portfolio.experience || [];
  const stats = portfolio.stats || [];
  const education = portfolio.education || [];
  const honors = portfolio.honors || [];
  const licenses = portfolio.licenses || [];

  const featuredProjects = projects.filter((p) => p.featured);
  const caseStudiesCount = projects.filter((p) => p.caseStudy).length;
  const totalRoles = experience.reduce((acc, c) => acc + (c.roles?.length || 0), 0);

  const availability = profile?.availability || {
    enabled: true,
    status: "Available for Work",
    scope: "Full-Time & Remote",
    timezone: "Asia/Bangkok",
    timezoneLabel: "BKK (UTC+7)",
    sla: "<24h SLA",
  };

  const currentStatus = availability.status || "Available for Work";
  const currentScope = availability.scope || "Full-Time & Remote";

  const statusPresets = [
    {
      label: "Available for Work",
      scope: "Full-Time & Remote",
      active: currentStatus === "Available for Work",
      dotClass: "bg-success",
    },
    {
      label: "Selective Contracts / Advisory",
      scope: "Part-Time / Contract",
      active: currentStatus.includes("Contract") || currentStatus.includes("Selective"),
      dotClass: "bg-accent",
    },
    {
      label: "In Full-Time Engagement",
      scope: "Active Leadership Role",
      active: currentStatus.includes("Full-Time Engagement") || currentStatus.includes("Unavailable"),
      dotClass: "bg-muted",
    },
  ];

  const metrics = [
    { label: "Projects", value: projects.length, sub: `${featuredProjects.length} featured`, icon: Layers, tab: "projects" as AdminTab },
    { label: "Case Studies", value: caseStudiesCount, sub: "deep dives", icon: Layers, tab: "projects" as AdminTab, accent: true },
    { label: "Companies", value: experience.length, sub: `${totalRoles} roles`, icon: Briefcase, tab: "experience" as AdminTab },
    { label: "Hero Stats", value: stats.length, sub: "homepage", icon: BarChart2, tab: "stats" as AdminTab },
    { label: "Education", value: education.length, sub: "degrees", icon: GraduationCap, tab: "education" as AdminTab },
    { label: "Certifications", value: licenses.length, sub: "verified", icon: BadgeCheck, tab: "licenses" as AdminTab },
    { label: "Honors", value: honors.length, sub: "& awards", icon: Award, tab: "honors" as AdminTab },
  ];

  return (
    <div className="space-y-10">

      {/* 1. Section heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-rule">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">Admin · Overview</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
            System Overview
          </h2>
          <p className="text-sm text-muted mt-1">
            Live availability, portfolio architecture, and content at a glance.
          </p>
        </div>
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-ink transition shrink-0"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Open public site</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {/* 2. System status — editorial row, no card boxes */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">System Status</p>
        <div className="divide-y divide-rule">

          {/* Data Store */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <FileCode2 className="h-4 w-4 text-muted shrink-0" />
              <div>
                <p className="font-mono text-xs text-muted uppercase tracking-wide">Data Store</p>
                <p className="font-display text-base font-bold text-ink">Local JSON Core</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              <code className="font-mono text-xs text-muted bg-soft px-1.5 py-0.5 rounded border border-rule">
                portfolio.json
              </code>
            </div>
          </div>

          {/* Telegram */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Send className="h-4 w-4 text-muted shrink-0" />
              <div>
                <p className="font-mono text-xs text-muted uppercase tracking-wide">Telegram Dispatch</p>
                <p className="font-display text-base font-bold text-ink">
                  {profile?.telegramConfigured ? "Edge Bot Active" : "Unconfigured"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full ${profile?.telegramConfigured ? "bg-success" : "bg-muted"
                  }`}
              />
              <span className="font-mono text-xs text-muted">
                {profile?.telegramConfigured
                  ? "Zero-leak serverless"
                  : "Direct links only"}
              </span>
            </div>
          </div>

          {/* Architecture */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-muted shrink-0" />
              <div>
                <p className="font-mono text-xs text-muted uppercase tracking-wide">Architecture</p>
                <p className="font-display text-base font-bold text-ink">Pages Edge Ready</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
              <span className="font-mono text-xs text-muted">Static · zero-cost edge</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Live Availability — editorial */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio className="h-3.5 w-3.5 text-accent animate-pulse" />
              <p className="font-mono text-xs uppercase tracking-widest text-muted">Live Availability</p>
            </div>
            <h3 className="font-display text-xl font-bold text-ink">Availability Quick Switcher</h3>
          </div>
          <p className="font-mono text-xs text-muted">
            Active: <span className="text-ink font-medium">{currentStatus}</span>
            <span className="text-muted"> · {currentScope}</span>
          </p>
        </div>

        <div className="divide-y divide-rule border-y border-rule">
          {statusPresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() =>
                onUpdateAvailability({
                  status: preset.label,
                  scope: preset.scope,
                })
              }
              className={`w-full flex items-center justify-between py-3.5 text-left transition cursor-pointer group ${preset.active ? "opacity-100" : "opacity-60 hover:opacity-100"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full shrink-0 ${preset.dotClass}`} />
                <div>
                  <p className="font-display font-bold text-sm text-ink">{preset.label}</p>
                  <p className="font-mono text-xs text-muted">{preset.scope}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {preset.active && (
                  <span className="font-mono text-xs text-accent">✓ Active</span>
                )}
                <ArrowRight className={`h-3.5 w-3.5 text-muted transition-transform ${preset.active ? "opacity-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"}`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Portfolio content metrics — inline number row */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Content Index</p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-0 divide-x divide-rule border border-rule rounded-xl overflow-hidden">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.label}
                type="button"
                onClick={() => onNavigateTab(m.tab)}
                className="flex flex-col items-start p-3 sm:p-3.5 hover:bg-soft transition text-left cursor-pointer group"
              >
                <Icon className={`h-3.5 w-3.5 mb-2 ${m.accent ? "text-accent" : "text-muted"} group-hover:text-ink transition`} />
                <p className="font-display text-2xl font-bold text-ink leading-none">{m.value}</p>
                <p className="font-mono text-xs text-muted mt-1 leading-tight">{m.label}</p>
                <p className="font-mono text-xs text-muted/60 leading-tight hidden sm:block">{m.sub}</p>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
