import { useRef, useState, useEffect } from "react";
import {
  Upload,
  Radio,
  MessageSquare,
  Clock,
  Zap,
  Send,
  Check,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
  User,
  Sliders,
  Info,
} from "lucide-react";
import { Checkbox } from "../Checkbox";
import { AvailabilityBadge } from "../../AvailabilityBadge";
import type { Profile, AvailabilityConfig } from "../../../types/portfolio";

interface ProfileSectionProps {
  profile: Profile;
  onChange: (updated: Profile) => void;
  onUploadAvatar: (file: File) => void;
  isUploadingAvatar: boolean;
}

export function ProfileSection({
  profile,
  onChange,
  onUploadAvatar,
  isUploadingAvatar,
}: ProfileSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Telegram secrets local management
  const [botTokenInput, setBotTokenInput] = useState("");
  const [chatIdInput, setChatIdInput] = useState("");
  const [showBotToken, setShowBotToken] = useState(false);
  const [isSavingTg, setIsSavingTg] = useState(false);
  const [tgSaveMsg, setTgSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testError, setTestError] = useState<string | null>(null);

  // Fetch configured status from local server on mount
  useEffect(() => {
    fetch("/api/admin/telegram-config")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (data.chatId) setChatIdInput(data.chatId);
          if (data.configured && profile.telegramConfigured !== true) {
            onChange({ ...profile, telegramConfigured: true });
          }
        }
      })
      .catch(() => { });
  }, []);

  const availability: AvailabilityConfig = profile.availability || {
    enabled: true,
    status: "Available for Work",
    scope: "Full-Time & Remote",
    timezone: "Asia/Bangkok",
    timezoneLabel: "BKK (UTC+7)",
    sla: "<24h SLA",
  };

  function updateAvailability(patch: Partial<AvailabilityConfig>) {
    onChange({
      ...profile,
      availability: {
        ...availability,
        ...patch,
      },
    });
  }

  async function handleSaveTelegramConfig() {
    setIsSavingTg(true);
    setTgSaveMsg(null);
    try {
      const res = await fetch("/api/admin/telegram-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botToken: botTokenInput || undefined,
          chatId: chatIdInput,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        onChange({ ...profile, telegramConfigured: Boolean(data.configured) });
        setTgSaveMsg({
          type: "success",
          text: data.configured
            ? "Credentials saved to local .env.local! Telegram Bot is active."
            : "Settings saved.",
        });
        if (botTokenInput) setBotTokenInput(""); // clear raw token from memory for security
        setTimeout(() => setTgSaveMsg(null), 5000);
      } else {
        setTgSaveMsg({ type: "error", text: data.error || "Failed to save Telegram credentials." });
      }
    } catch (err: unknown) {
      setTgSaveMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Network error contacting local server.",
      });
    } finally {
      setIsSavingTg(false);
    }
  }

  async function handleTestTelegramPing() {
    setTestStatus("testing");
    setTestError(null);
    try {
      const res = await fetch("/api/admin/telegram-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botToken: botTokenInput || undefined,
          chatId: chatIdInput || undefined,
        }),
      });

      if (res.ok) {
        setTestStatus("success");
        setTimeout(() => setTestStatus("idle"), 4000);
      } else {
        const data = await res.json().catch(() => ({}));
        setTestStatus("error");
        setTestError(data.error || "Failed to send test ping. Check token and chat ID.");
      }
    } catch (err: unknown) {
      setTestStatus("error");
      setTestError(err instanceof Error ? err.message : "Network error contacting test endpoint.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-rule pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              Profile &amp; Biography
            </h2>
            <span className="inline-flex items-center gap-1 rounded border border-rule bg-soft px-2 py-0.5 font-mono text-xs font-semibold text-muted">
              CMS Core
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Manage your core identity, avatar photo, direct reachout links, availability radar, and contact settings.
          </p>
        </div>
      </div>

      {/* Card 1: Avatar & Visual Representation */}
      <section className="rounded-2xl border border-rule bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-rule pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-semibold text-ink">
                Avatar Photo
              </h3>
              <span className="inline-flex items-center gap-1 rounded border border-rule bg-soft px-2 py-0.5 font-mono text-xs font-semibold text-muted">
                <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Visual Asset</span>
              </span>
            </div>
            <p className="text-xs text-muted max-w-lg">
              Upload a square portrait photo. It will be used on the hero section, navigation avatar, and dynamic metadata.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative shrink-0">
            <img
              src={profile.avatarUrl || "/avatar.jpg"}
              alt={profile.name}
              className="h-24 w-24 rounded-2xl border border-rule object-cover shadow-xs ring-1 ring-black/5 bg-white"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/avatar.jpg";
              }}
            />
            <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-accent ring-2 ring-white" />
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onUploadAvatar(file);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-3.5 py-2 text-xs font-medium text-ink hover:border-ink transition cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>{isUploadingAvatar ? "Uploading..." : "Upload New Photo"}</span>
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...profile, avatarUrl: "/avatar.jpg" })}
                className="rounded-lg border border-rule bg-white px-3 py-2 text-xs font-medium text-muted hover:text-ink transition cursor-pointer shadow-2xs"
              >
                Reset to Default
              </button>
            </div>

            <div>
              <label htmlFor="profile-avatar-url" className="block text-xs font-medium text-ink mb-1.5">
                Avatar Image Source URL
              </label>
              <input
                id="profile-avatar-url"
                type="text"
                placeholder="e.g. /avatar.jpg or https://..."
                value={profile.avatarUrl || ""}
                onChange={(e) => onChange({ ...profile, avatarUrl: e.target.value })}
                className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink font-mono"
              />
              <p className="text-xs text-muted mt-1">
                Local uploaded files are stored in <code className="font-mono text-ink">public/avatar.jpg</code> and automatically generate circular favicons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Card 2: Personal Details & Direct Engineering Channels */}
      <section className="rounded-2xl border border-rule bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-rule pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-semibold text-ink">
                Identity &amp; Direct Channels
              </h3>
              <span className="inline-flex items-center gap-1 rounded border border-rule bg-soft px-2 py-0.5 font-mono text-xs font-semibold text-muted">
                <User className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Metadata</span>
              </span>
            </div>
            <p className="text-xs text-muted max-w-lg">
              Core profile data, social usernames, public email, and direct reachout channel URLs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="profile-name" className="block text-xs font-medium text-ink mb-1.5">Full Name</label>
            <input
              id="profile-name"
              type="text"
              value={profile.name}
              onChange={(e) => onChange({ ...profile, name: e.target.value })}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink"
            />
          </div>

          <div>
            <label htmlFor="profile-handle" className="block text-xs font-medium text-ink mb-1.5">Handle / Username</label>
            <input
              id="profile-handle"
              type="text"
              value={profile.handle}
              onChange={(e) => onChange({ ...profile, handle: e.target.value })}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink font-mono"
            />
          </div>

          <div>
            <label htmlFor="profile-headline" className="block text-xs font-medium text-ink mb-1.5">Headline</label>
            <input
              id="profile-headline"
              type="text"
              placeholder="e.g. Software Engineer &amp; Full-Stack"
              value={profile.headline || ""}
              onChange={(e) => onChange({ ...profile, headline: e.target.value })}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink"
            />
          </div>

          <div>
            <label htmlFor="profile-location" className="block text-xs font-medium text-ink mb-1.5">Location</label>
            <input
              id="profile-location"
              type="text"
              placeholder="e.g. Thailand"
              value={profile.location || ""}
              onChange={(e) => onChange({ ...profile, location: e.target.value })}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink"
            />
          </div>

          <div>
            <label htmlFor="profile-email" className="block text-xs font-medium text-ink mb-1.5">Public Email</label>
            <input
              id="profile-email"
              type="email"
              placeholder="you@domain.com"
              value={profile.emailPublic || ""}
              onChange={(e) => onChange({ ...profile, emailPublic: e.target.value })}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink font-mono"
            />
          </div>

          <div>
            <label htmlFor="profile-github" className="block text-xs font-medium text-ink mb-1.5">GitHub URL</label>
            <input
              id="profile-github"
              type="url"
              placeholder="https://github.com/username"
              value={profile.githubUrl || ""}
              onChange={(e) => onChange({ ...profile, githubUrl: e.target.value })}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink font-mono"
            />
          </div>

          <div>
            <label htmlFor="profile-telegram" className="block text-xs font-medium text-ink mb-1.5">Telegram Direct URL</label>
            <input
              id="profile-telegram"
              type="url"
              placeholder="https://t.me/yourusername"
              value={profile.telegramUrl || ""}
              onChange={(e) => onChange({ ...profile, telegramUrl: e.target.value })}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink font-mono"
            />
          </div>

          <div>
            <label htmlFor="profile-linkedin" className="block text-xs font-medium text-ink mb-1.5">LinkedIn URL</label>
            <input
              id="profile-linkedin"
              type="url"
              placeholder="https://linkedin.com/in/yourname"
              value={profile.linkedinUrl || ""}
              onChange={(e) => onChange({ ...profile, linkedinUrl: e.target.value })}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink font-mono"
            />
          </div>

          <div>
            <label htmlFor="profile-website" className="block text-xs font-medium text-ink mb-1.5">Website URL</label>
            <input
              id="profile-website"
              type="url"
              placeholder="https://..."
              value={profile.websiteUrl || ""}
              onChange={(e) => onChange({ ...profile, websiteUrl: e.target.value })}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink font-mono"
            />
          </div>

          <div>
            <label htmlFor="profile-bmc" className="block text-xs font-medium text-ink mb-1.5">Buy Me a Coffee URL</label>
            <input
              id="profile-bmc"
              type="url"
              placeholder="https://www.buymeacoffee.com/yourname"
              value={profile.buyMeACoffeeUrl || ""}
              onChange={(e) => onChange({ ...profile, buyMeACoffeeUrl: e.target.value })}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink font-mono"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="pt-2">
          <label htmlFor="profile-bio" className="block text-xs font-medium text-ink mb-1.5">
            Biography Narrative
          </label>
          <textarea
            id="profile-bio"
            rows={3}
            placeholder="Write a concise executive bio describing your engineering experience..."
            value={profile.bio || ""}
            onChange={(e) => onChange({ ...profile, bio: e.target.value })}
            className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink resize-y leading-relaxed"
          />
          <p className="text-xs text-muted mt-1">
            Displayed on the homepage hero. Supports automatic fade-out and the ExpandableText component.
          </p>
        </div>
      </section>

      {/* Card 3: Live Availability & Timezone Radar */}
      <section className="rounded-2xl border border-rule bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-rule pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-semibold text-ink">
                Live Availability &amp; Timezone Radar
              </h3>
              <span className="inline-flex items-center gap-1 rounded border border-success/40 bg-success-soft px-2 py-0.5 font-mono text-xs font-semibold text-success">
                <Radio className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Live Radar</span>
              </span>
            </div>
            <p className="text-xs text-muted max-w-lg">
              Real-time availability status, IANA timezone clock, and response SLA indicator anchored to your hero avatar.
            </p>
          </div>

          <div className="shrink-0">
            <Checkbox
              id="availability-enabled"
              checked={availability.enabled !== false}
              onChange={(checked) => updateAvailability({ enabled: checked })}
              label="Enable on Hero"
            />
          </div>
        </div>

        {/* Live Preview on Hero (1:1 Hero Simulation) */}
        <div className="rounded-xl border border-rule bg-paper p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-muted font-semibold">
                // LIVE PREVIEW ON HERO
              </span>
              <span className="inline-flex items-center gap-1 rounded border border-rule bg-white px-2 py-0.5 font-mono text-xs text-muted">
                1:1 Interactive Simulation
              </span>
            </div>
            <span className="text-xs text-muted font-mono hidden sm:inline">
              Click beacon on avatar corner ↘
            </span>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-rule/70 bg-white p-4 shadow-2xs">
            <div className="relative shrink-0">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border border-rule object-cover shadow-xs ring-1 ring-black/5"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/avatar.jpg";
                  }}
                />
              ) : (
                <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl border border-rule bg-soft text-2xl font-semibold text-muted">
                  {(profile.name || "P").slice(0, 1)}
                </div>
              )}
              <AvailabilityBadge config={availability} variant="corner" />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink truncate">
                {profile.name || "Pyae Phyo Maung"}
              </div>
              <div className="text-xs text-muted truncate">
                @{profile.handle || "pyaephyomaung"}
                {profile.headline ? ` · ${profile.headline}` : ""}
              </div>
              <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                {profile.location && (
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-muted">
                    📍 {profile.location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded border border-rule bg-paper px-2 py-0.5 font-mono text-xs text-muted">
                  🕒 {availability.timezone || "Asia/Bangkok"}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted leading-relaxed">
            Interactive preview: The green beacon on the avatar corner pulses live. Clicking it blooms the Swiss architectural availability popover with your configured local time and response SLA.
          </p>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="avail-status" className="block text-xs font-medium text-ink mb-1.5">
              Availability Status
            </label>
            <input
              id="avail-status"
              type="text"
              placeholder="Available for Work"
              value={availability.status || ""}
              onChange={(e) => updateAvailability({ status: e.target.value })}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink"
            />
          </div>

          <div>
            <label htmlFor="avail-scope" className="block text-xs font-medium text-ink mb-1.5">
              Working Scope / Roles
            </label>
            <input
              id="avail-scope"
              type="text"
              placeholder="Full-Time &amp; Remote"
              value={availability.scope || ""}
              onChange={(e) => updateAvailability({ scope: e.target.value })}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink"
            />
          </div>

          <div>
            <label htmlFor="avail-timezone" className="block text-xs font-medium text-ink mb-1.5 flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted" />
              <span>Timezone ID (IANA)</span>
            </label>
            <input
              id="avail-timezone"
              type="text"
              placeholder="Asia/Bangkok"
              value={availability.timezone || ""}
              onChange={(e) => updateAvailability({ timezone: e.target.value })}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink font-mono"
            />
            <span className="text-xs text-muted mt-1 block">
              Standard IANA timezone (e.g. Asia/Bangkok, Asia/Singapore, UTC, America/New_York).
            </span>
          </div>

          <div>
            <label htmlFor="avail-timezone-label" className="block text-xs font-medium text-ink mb-1.5">
              Timezone Display Badge
            </label>
            <input
              id="avail-timezone-label"
              type="text"
              placeholder="BKK (UTC+7)"
              value={availability.timezoneLabel || ""}
              onChange={(e) => updateAvailability({ timezoneLabel: e.target.value })}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink font-mono"
            />
            <span className="text-xs text-muted mt-1 block">
              Short abbreviation shown beside the live ticking clock.
            </span>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="avail-sla" className="block text-xs font-medium text-ink mb-1.5 flex items-center gap-1">
              <Zap className="h-3 w-3 text-accent" />
              <span>Response SLA Tag</span>
            </label>
            <input
              id="avail-sla"
              type="text"
              placeholder="<24h SLA"
              value={availability.sla || ""}
              onChange={(e) => updateAvailability({ sla: e.target.value })}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink"
            />
          </div>
        </div>
      </section>

      {/* Card 4: Direct Contact Dialog Settings */}
      <section className="rounded-2xl border border-rule bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-rule pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-semibold text-ink">
                Direct Contact Dialog Settings
              </h3>
              <span className="inline-flex items-center gap-1 rounded border border-rule bg-soft px-2 py-0.5 font-mono text-xs font-semibold text-muted">
                <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Modal Dialog</span>
              </span>
            </div>
            <p className="text-xs text-muted max-w-lg">
              Configure the heading and description shown inside the Direct Engineering Channels dialog modal.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="contact-title" className="block text-xs font-medium text-ink mb-1.5">
              Modal Dialog Title
            </label>
            <input
              id="contact-title"
              type="text"
              placeholder="Let's build together"
              value={profile.contactModalTitle || ""}
              onChange={(e) => onChange({ ...profile, contactModalTitle: e.target.value })}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink"
            />
          </div>

          <div>
            <label htmlFor="contact-subtitle" className="block text-xs font-medium text-ink mb-1.5">
              Modal Dialog Subtitle
            </label>
            <textarea
              id="contact-subtitle"
              rows={2}
              placeholder="Connect via verified direct engineering channels, copy email address, or drop a quick project note."
              value={profile.contactModalSubtitle || ""}
              onChange={(e) => onChange({ ...profile, contactModalSubtitle: e.target.value })}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink resize-none leading-relaxed"
            />
          </div>
        </div>
      </section>

      {/* Card 5: Telegram Instant Notification Bot (Secure Edge Architecture) */}
      <section className="rounded-2xl border border-rule bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-rule pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-semibold text-ink">
                Telegram Instant Notification Bot
              </h3>
              <span className="inline-flex items-center gap-1 rounded border border-accent/40 bg-accent-soft px-2 py-0.5 font-mono text-xs font-semibold text-accent">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Zero-Leak Edge Dispatch</span>
              </span>
            </div>
            <p className="text-xs text-muted max-w-lg">
              Receive real-time alerts directly in your Telegram chat when visitors submit notes. Tokens are never exposed to client browsers.
            </p>
          </div>

          <div className="shrink-0">
            <Checkbox
              id="telegram-dispatch-enabled"
              checked={profile.telegramConfigured === true}
              onChange={(checked) => onChange({ ...profile, telegramConfigured: checked })}
              label="Enable Note Dispatch on Homepage"
            />
          </div>
        </div>

        {/* Security Architecture Callout Box */}
        <div className="rounded-xl border border-accent/25 bg-accent-soft/40 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              Zero-Leak Edge Security Architecture
            </span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Your Telegram Bot Token is <strong>never stored in public JSON or bundled into the client browser</strong>.
            In local dev, secrets are saved to gitignored <code className="font-mono text-ink bg-white px-1.5 py-0.5 rounded border border-rule">.env.local</code>.
            When deploying to Cloudflare Pages, set <code className="font-mono text-ink bg-white px-1.5 py-0.5 rounded border border-rule">TELEGRAM_BOT_TOKEN</code> and <code className="font-mono text-ink bg-white px-1.5 py-0.5 rounded border border-rule">TELEGRAM_CHAT_ID</code> under Cloudflare Pages Environment Variables.
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-ink">Homepage Form Status:</span>
            {profile.telegramConfigured ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success-soft px-2.5 py-0.5 font-mono text-xs font-semibold text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                <span>Active</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-rule bg-soft px-2.5 py-0.5 font-mono text-xs font-semibold text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-muted/60" />
                <span>Hidden (Direct Channels Only)</span>
              </span>
            )}
          </div>
        </div>

        {/* Credentials Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="telegram-bot-token" className="block text-xs font-medium text-ink">
                Telegram Bot Token
              </label>
              <button
                type="button"
                onClick={() => setShowBotToken((prev) => !prev)}
                className="text-xs font-mono text-muted hover:text-ink flex items-center gap-1 cursor-pointer"
              >
                {showBotToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                <span>{showBotToken ? "Hide" : "Show"}</span>
              </button>
            </div>
            <div className="relative">
              <input
                id="telegram-bot-token"
                type={showBotToken ? "text" : "password"}
                placeholder="Paste new bot token (e.g. 123456789:ABC...)"
                value={botTokenInput}
                onChange={(e) => setBotTokenInput(e.target.value)}
                className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink font-mono"
              />
            </div>
            <span className="text-xs text-muted mt-1 block">
              Create a bot via <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="underline hover:text-ink">@BotFather</a> and copy the HTTP API token.
            </span>
          </div>

          <div>
            <label htmlFor="telegram-chat-id" className="block text-xs font-medium text-ink mb-1.5">
              Telegram Chat ID
            </label>
            <input
              id="telegram-chat-id"
              type="text"
              placeholder="e.g. 123456789 or @yourchannel"
              value={chatIdInput}
              onChange={(e) => setChatIdInput(e.target.value)}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink font-mono"
            />
            <span className="text-xs text-muted mt-1 block">
              Find your numeric Chat ID via <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="underline hover:text-ink">@userinfobot</a> on Telegram.
            </span>
          </div>
        </div>

        {/* Telegram Bot Setup Remark Note */}
        <div className="flex items-start gap-2.5 rounded-xl border border-rule bg-soft/70 p-3.5 text-xs text-muted leading-relaxed">
          <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-ink block mb-0.5">
              Important: Start your Bot first before testing
            </span>
            <span>
              Telegram anti-spam policy prohibits bots from initiating messages to users. Make sure you have opened your bot in Telegram and tapped{" "}
              <code className="font-mono text-ink bg-white px-1.5 py-0.5 rounded border border-rule">/start</code>{" "}
              from the account matching your Chat ID. Otherwise, Telegram API will return{" "}
              <code className="font-mono text-ink bg-white px-1.5 py-0.5 rounded border border-rule">Bad Request: chat not found</code>.
            </span>
          </div>
        </div>

        {/* Action Buttons: Save to .env.local & Test Server Ping */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            disabled={isSavingTg}
            onClick={handleSaveTelegramConfig}
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-xs font-medium text-paper hover:opacity-90 transition cursor-pointer shadow-2xs disabled:opacity-50"
          >
            {isSavingTg ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving to .env.local...</span>
              </>
            ) : (
              <>
                <Sliders className="h-3.5 w-3.5" />
                <span>Save Telegram Credentials</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={testStatus === "testing" || (!botTokenInput && !chatIdInput && !profile.telegramConfigured)}
            onClick={handleTestTelegramPing}
            className="inline-flex items-center gap-2 rounded-lg border border-rule bg-white px-4 py-2 text-xs font-medium text-ink hover:border-ink transition cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testStatus === "testing" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" />
                <span>Pinging Server Dispatch...</span>
              </>
            ) : testStatus === "success" ? (
              <>
                <Check className="h-3.5 w-3.5 text-success" />
                <span className="text-success font-medium">Ping Sent! Check Telegram</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Send Test Ping</span>
              </>
            )}
          </button>

          {tgSaveMsg && (
            <div
              className={`inline-flex items-center gap-1.5 text-xs ${tgSaveMsg.type === "success" ? "text-success" : "text-destructive"
                }`}
            >
              {tgSaveMsg.type === "success" ? (
                <Check className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              )}
              <span>{tgSaveMsg.text}</span>
            </div>
          )}

          {testError && (
            <div className="inline-flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{testError}</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
