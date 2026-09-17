import { useState } from "react";
import {
  Globe,
  Share2,
  Plus,
  X,
  Image as ImageIcon,
  Sparkles,
  RotateCcw
} from "lucide-react";
import { FaXTwitter, FaLinkedin } from "react-icons/fa6";
import type { SeoConfig, Profile } from "../../../types/portfolio";

interface SeoSectionProps {
  seo?: SeoConfig;
  profile?: Profile | null;
  onChange: (seo: SeoConfig) => void;
}

export function SeoSection({ seo = {}, profile, onChange }: SeoSectionProps) {
  const [activePreviewTab, setActivePreviewTab] = useState<"twitter" | "linkedin">("twitter");
  const [newKeyword, setNewKeyword] = useState("");

  const defaultTitle = profile
    ? `${profile.name} — ${profile.headline || "Systems Engineer"}`
    : "Pyae Phyo Maung — Software Engineer";

  const defaultDescription =
    profile?.bio ||
    "Full-stack software engineer building web platforms, clinic systems, and privacy-minded developer tools across Thailand and remote teams.";

  const metaTitle = seo.metaTitle ?? defaultTitle;
  const metaDescription = seo.metaDescription ?? defaultDescription;
  const keywords = seo.keywords ?? [
    "Software Engineer",
    "Full-Stack Developer",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Cloudflare Pages",
    "Systems Architecture"
  ];
  const ogImage = seo.ogImage ?? (profile?.avatarUrl ? `https://pyaephyomaung.dev${profile.avatarUrl}` : "https://pyaephyomaung.dev/avatar.jpg");
  const twitterHandle = seo.twitterHandle ?? (profile?.handle ? `@${profile.handle}` : "@pyaephyomaung");
  const canonicalUrl = seo.canonicalUrl ?? "https://pyaephyomaung.dev";

  function handleFieldChange<K extends keyof SeoConfig>(field: K, value: SeoConfig[K]) {
    onChange({
      ...seo,
      [field]: value,
    });
  }

  function handleAddKeyword() {
    const trimmed = newKeyword.trim();
    if (!trimmed || keywords.includes(trimmed)) return;
    handleFieldChange("keywords", [...keywords, trimmed]);
    setNewKeyword("");
  }

  function handleRemoveKeyword(keywordToRemove: string) {
    handleFieldChange(
      "keywords",
      keywords.filter((k) => k !== keywordToRemove)
    );
  }

  function handleResetDefaults() {
    onChange({
      metaTitle: defaultTitle,
      metaDescription: defaultDescription,
      keywords: [
        "Software Engineer",
        "Full-Stack Developer",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Cloudflare Pages",
        "Systems Architecture"
      ],
      ogImage: "https://pyaephyomaung.dev/avatar.jpg",
      twitterHandle: "@pyaephyomaung",
      canonicalUrl: "https://pyaephyomaung.dev",
    });
  }

  const titleLength = metaTitle.length;
  const descLength = metaDescription.length;

  return (
    <div className="space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-rule">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">
            Admin · Search &amp; Social Graph
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            SEO &amp; Social Preview
          </h2>
          <p className="text-sm text-muted mt-1">
            Configure OpenGraph meta tags and test real-time link previews on Twitter/X and LinkedIn.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-3 py-1.5 text-xs font-mono text-muted hover:text-ink hover:border-ink/40 transition cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Meta Title */}
          <div className="p-5 rounded-xl border border-rule bg-paper space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <label htmlFor="metaTitle" className="block text-xs font-mono uppercase tracking-wider text-muted font-medium">
                Page Title & Tag
              </label>
              <span
                className={`text-xs font-mono ${titleLength >= 40 && titleLength <= 65
                  ? "text-success font-medium"
                  : "text-muted"
                  }`}
              >
                {titleLength} / 60 chars (Recommended: 50–60)
              </span>
            </div>
            <input
              id="metaTitle"
              type="text"
              value={metaTitle}
              onChange={(e) => handleFieldChange("metaTitle", e.target.value)}
              placeholder="e.g. John Doe — Software Engineer"
              className="w-full rounded-xl border border-rule bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink font-medium"
            />
          </div>

          {/* Meta Description */}
          <div className="p-5 rounded-xl border border-rule bg-paper space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <label htmlFor="metaDescription" className="block text-xs font-mono uppercase tracking-wider text-muted font-medium">
                Meta Description
              </label>
              <span
                className={`text-xs font-mono ${descLength >= 110 && descLength <= 165
                  ? "text-success font-medium"
                  : "text-muted"
                  }`}
              >
                {descLength} / 160 chars (Recommended: 120–160)
              </span>
            </div>
            <textarea
              id="metaDescription"
              rows={3}
              value={metaDescription}
              onChange={(e) => handleFieldChange("metaDescription", e.target.value)}
              placeholder="Brief summary for search engine snippets..."
              className="w-full rounded-xl border border-rule bg-paper p-3.5 text-sm text-ink outline-none focus:border-ink leading-relaxed resize-y"
            />
          </div>

          {/* Social Image & Canonical URLs */}
          <div className="p-5 rounded-xl border border-rule bg-paper space-y-4 shadow-2xs">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted font-medium">
              OpenGraph Assets & Handles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ogImage" className="block text-xs text-muted mb-1.5 font-mono">
                  OG Social Image URL
                </label>
                <div className="relative">
                  <input
                    id="ogImage"
                    type="text"
                    value={ogImage}
                    onChange={(e) => handleFieldChange("ogImage", e.target.value)}
                    className="w-full rounded-xl border border-rule bg-paper pl-8 pr-3 py-2 text-xs text-ink outline-none focus:border-ink font-mono"
                  />
                  <ImageIcon className="h-3.5 w-3.5 text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label htmlFor="twitterHandle" className="block text-xs text-muted mb-1.5 font-mono">
                  Twitter / X Creator Handle
                </label>
                <div className="relative">
                  <input
                    id="twitterHandle"
                    type="text"
                    value={twitterHandle}
                    onChange={(e) => handleFieldChange("twitterHandle", e.target.value)}
                    placeholder="@username"
                    className="w-full rounded-xl border border-rule bg-paper pl-8 pr-3 py-2 text-xs text-ink outline-none focus:border-ink font-mono"
                  />
                  <FaXTwitter className="h-3.5 w-3.5 text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="canonicalUrl" className="block text-xs text-muted mb-1.5 font-mono">
                Canonical Base URL
              </label>
              <div className="relative">
                <input
                  id="canonicalUrl"
                  type="text"
                  value={canonicalUrl}
                  onChange={(e) => handleFieldChange("canonicalUrl", e.target.value)}
                  className="w-full rounded-xl border border-rule bg-paper pl-8 pr-3 py-2 text-xs text-ink outline-none focus:border-ink font-mono"
                />
                <Globe className="h-3.5 w-3.5 text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Keywords Tag Manager */}
          <div className="p-5 rounded-xl border border-rule bg-paper space-y-3 shadow-2xs">
            <label className="block text-xs font-mono uppercase tracking-wider text-muted font-medium">
              Target SEO Keywords ({keywords.length})
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add keyword (e.g. Distributed Systems)..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                className="flex-1 rounded-xl border border-rule bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                disabled={!newKeyword.trim()}
                className="inline-flex items-center gap-1 rounded-xl bg-ink px-3 py-2 text-xs font-mono text-paper hover:opacity-90 transition cursor-pointer disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-soft px-2.5 py-1 text-xs text-ink font-mono"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    aria-label={`Remove keyword ${kw}`}
                    className="text-muted hover:text-ink cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Social Share Previewer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted uppercase">
                <Share2 className="h-3.5 w-3.5 text-accent" />
                <span>Live Share Card</span>
              </div>

              {/* Preview Tabs */}
              <div className="inline-flex items-center p-0.5 rounded-lg border border-rule bg-paper text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActivePreviewTab("twitter")}
                  className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${activePreviewTab === "twitter"
                    ? "bg-ink text-paper font-semibold shadow-2xs"
                    : "text-muted hover:text-ink"
                    }`}
                >
                  <FaXTwitter className="h-3 w-3" />
                  <span>Twitter / X</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab("linkedin")}
                  className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${activePreviewTab === "linkedin"
                    ? "bg-ink text-paper font-semibold shadow-2xs"
                    : "text-muted hover:text-ink"
                    }`}
                >
                  <FaLinkedin className="h-3 w-3" />
                  <span>LinkedIn</span>
                </button>
              </div>
            </div>

            {/* Simulation Viewport Card */}
            {activePreviewTab === "twitter" ? (
              /* Twitter / X Large Summary Card */
              <div className="rounded-xl border border-rule bg-paper p-4 shadow-2xs space-y-3 font-sans">
                <div className="flex items-center gap-2.5 pb-2 border-b border-rule text-xs">
                  <div className="h-8 w-8 rounded-full bg-soft border border-rule flex items-center justify-center font-bold text-ink">
                    P
                  </div>
                  <div>
                    <div className="font-bold text-ink flex items-center gap-1">
                      <span>{profile?.name || "Pyae Phyo Maung"}</span>
                      <span className="text-muted font-normal">{twitterHandle} · 1m</span>
                    </div>
                    <p className="text-muted text-xs">Sharing my portfolio architecture:</p>
                  </div>
                </div>

                {/* Simulated Shared Card Frame */}
                <div className="rounded-xl border border-rule overflow-hidden bg-paper/50 hover:border-ink/40 transition">
                  <div
                    className="relative w-full bg-soft overflow-hidden flex items-center justify-center border-b border-rule"
                    style={{ aspectRatio: "1.91 / 1" }}
                  >
                    {ogImage ? (
                      <img
                        src={ogImage}
                        alt="OG Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted" />
                    )}
                    <span className="absolute bottom-2 left-2 rounded bg-ink/80 backdrop-blur-xs px-2 py-0.5 text-xs font-mono text-paper">
                      pyaephyomaung.dev
                    </span>
                  </div>

                  <div className="p-3 space-y-1">
                    <p className="font-mono text-xs text-muted uppercase">pyaephyomaung.dev</p>
                    <h4 className="font-semibold text-xs text-ink line-clamp-1 leading-snug">
                      {metaTitle}
                    </h4>
                    <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                      {metaDescription}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* LinkedIn Post Card */
              <div className="rounded-xl border border-rule bg-paper p-4 shadow-2xs space-y-3 font-sans">
                <div className="flex items-center gap-2.5 pb-2 border-b border-rule text-xs">
                  <div className="h-8 w-8 rounded-full bg-soft border border-rule flex items-center justify-center font-bold text-ink">
                    P
                  </div>
                  <div>
                    <span className="font-bold text-ink block">{profile?.name || "Pyae Phyo Maung"}</span>
                    <span className="text-muted text-xs block">Software Engineer</span>
                  </div>
                </div>

                {/* Simulated Shared Card Frame */}
                <div className="rounded-xl border border-rule overflow-hidden bg-paper/40">
                  <div
                    className="relative w-full bg-soft overflow-hidden flex items-center justify-center border-b border-rule"
                    style={{ aspectRatio: "1.91 / 1" }}
                  >
                    {ogImage ? (
                      <img
                        src={ogImage}
                        alt="LinkedIn Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted" />
                    )}
                  </div>

                  <div className="p-3 space-y-1">
                    <h4 className="font-bold text-xs text-ink line-clamp-1">
                      {metaTitle}
                    </h4>
                    <p className="text-xs font-mono text-muted">
                      pyaephyomaung.dev • 2 min read
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Hint Callout */}
            <div className="flex items-start gap-2 p-3 rounded-xl border border-rule bg-soft/50 text-xs text-muted leading-relaxed">
              <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <span>
                These OpenGraph and Twitter card parameters will be baked into static HTML meta tags during <code className="font-mono text-ink">npm run build</code>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
