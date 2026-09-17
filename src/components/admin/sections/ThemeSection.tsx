import { useState } from "react";
import {
  Palette,
  RotateCcw,
  Type,
  Square,
  Sun,
  Moon,
  Laptop,
  Check,
  Wand2,
  Info,
} from "lucide-react";
import type {
  ThemeConfig,
  ThemePreset,
  FontPairing,
  RadiusStyle,
} from "../../../types/portfolio";
import { getContrastForeground, getSuggestedAccent } from "../../../lib/theme";
import { ColorPicker } from "../ColorPicker";

interface ThemeSectionProps {
  themeConfig?: ThemeConfig;
  onChange: (config: ThemeConfig) => void;
}

interface PaletteOption {
  id: ThemePreset;
  name: string;
  primaryLight: string;
  primaryDark: string;
  light: string;
  dark: string;
  description: string;
}

const PALETTES: PaletteOption[] = [
  {
    id: "signal-orange",
    name: "Signal Orange",
    primaryLight: "#f54e00",
    primaryDark: "#ff5c1a",
    light: "#0284c7",
    dark: "#38bdf8",
    description: "Signal Orange button paired with technical cyan accents",
  },
  {
    id: "electric-cyan",
    name: "Electric Cyan",
    primaryLight: "#0284c7",
    primaryDark: "#38bdf8",
    light: "#f59e0b",
    dark: "#fbbf24",
    description: "Electric Cyan button paired with solar amber accents",
  },
  {
    id: "emerald-forest",
    name: "Emerald Forest",
    primaryLight: "#059669",
    primaryDark: "#34d399",
    light: "#d97706",
    dark: "#fbbf24",
    description: "Emerald Forest button paired with warm gold accents",
  },
  {
    id: "cyber-violet",
    name: "Cyber Violet",
    primaryLight: "#7c3aed",
    primaryDark: "#a78bfa",
    light: "#10b981",
    dark: "#34d399",
    description: "Cyber Violet button paired with neon mint accents",
  },
  {
    id: "rose-crimson",
    name: "Rose Crimson",
    primaryLight: "#e11d48",
    primaryDark: "#fb7185",
    light: "#0d9488",
    dark: "#2dd4bf",
    description: "Rose Crimson button paired with editorial teal accents",
  },
  {
    id: "monokai-amber",
    name: "Monokai Amber",
    primaryLight: "#d97706",
    primaryDark: "#fbbf24",
    light: "#7c3aed",
    dark: "#a78bfa",
    description: "Monokai Amber button paired with syntax violet accents",
  },
  {
    id: "minimal-slate",
    name: "Minimal Slate",
    primaryLight: "#18181b",
    primaryDark: "#f4f4f5",
    light: "#475569",
    dark: "#94a3b8",
    description: "Monochrome industrial concrete & pure zinc",
  },
];

const PRIMARY_SWATCHES = [
  { label: "Ink Black", hex: "#18181b" },
  { label: "Signal Orange", hex: "#f54e00" },
  { label: "Electric Cyan", hex: "#0284c7" },
  { label: "Emerald", hex: "#059669" },
  { label: "Cyber Violet", hex: "#7c3aed" },
  { label: "Rose Crimson", hex: "#e11d48" },
  { label: "Deep Navy", hex: "#0f172a" },
];

const ACCENT_SWATCHES = [
  { label: "Signal Orange", hex: "#f54e00" },
  { label: "Electric Cyan", hex: "#0284c7" },
  { label: "Emerald", hex: "#059669" },
  { label: "Cyber Violet", hex: "#7c3aed" },
  { label: "Rose Crimson", hex: "#e11d48" },
  { label: "Monokai Amber", hex: "#d97706" },
  { label: "Minimal Slate", hex: "#475569" },
];

const FONTS: { id: FontPairing; name: string; displayFont: string; desc: string }[] = [
  {
    id: "editorial",
    name: "Editorial Swiss",
    displayFont: '"Instrument Serif", Georgia, serif',
    desc: "Serif display headlines with clean sans body",
  },
  {
    id: "modern",
    name: "Modern Bauhaus",
    displayFont: '"DM Sans", system-ui, sans-serif',
    desc: "Crisp modern sans-serif typography across all elements",
  },
  {
    id: "technical",
    name: "Technical Monospace",
    displayFont: 'ui-monospace, SFMono-Regular, monospace',
    desc: "Precision engineering terminal aesthetic for headings",
  },
];

const RADII: { id: RadiusStyle; name: string; desc: string }[] = [
  {
    id: "sharp",
    name: "Architectural Sharp",
    desc: "Crisp corners with minimal radius",
  },
  {
    id: "tactile",
    name: "Swiss Tactile",
    desc: "Balanced modern rounded borders (Default)",
  },
  {
    id: "pill",
    name: "Organic Soft Pill",
    desc: "Deeply curved rounded contours",
  },
];

export function ThemeSection({ themeConfig = {}, onChange }: ThemeSectionProps) {
  const currentPreset = themeConfig.preset || "signal-orange";
  const currentPrimary = themeConfig.primaryColor || themeConfig.accentColor || "#f54e00";
  const currentAccent = themeConfig.accentColor || "#f54e00";
  const currentFont = themeConfig.fontPairing || "editorial";
  const currentRadius = themeConfig.radiusStyle || "tactile";
  const currentMode = themeConfig.defaultMode || "system";

  const primaryFg = getContrastForeground(currentPrimary);
  const suggestedAccent = getSuggestedAccent(currentPrimary);
  const isAccentMatchingSuggestion =
    currentAccent.toLowerCase() === suggestedAccent.light.toLowerCase();

  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showAccentPicker, setShowAccentPicker] = useState(false);

  function selectPreset(palette: PaletteOption) {
    onChange({
      ...themeConfig,
      preset: palette.id,
      primaryColor: palette.primaryLight,
      primaryColorDark: palette.primaryDark,
      accentColor: palette.light,
      accentColorDark: palette.dark,
    });
  }

  function handlePrimaryColorChange(color: string) {
    onChange({
      ...themeConfig,
      preset: "custom",
      primaryColor: color,
      primaryColorDark: color,
    });
  }

  function handleAccentColorChange(color: string) {
    onChange({
      ...themeConfig,
      preset: "custom",
      accentColor: color,
      accentColorDark: color,
    });
  }

  function applySuggestedAccent() {
    onChange({
      ...themeConfig,
      accentColor: suggestedAccent.light,
      accentColorDark: suggestedAccent.dark,
    });
  }

  function handleReset() {
    onChange({
      preset: "signal-orange",
      primaryColor: "#f54e00",
      primaryColorDark: "#ff5c1a",
      accentColor: "#0284c7",
      accentColorDark: "#38bdf8",
      fontPairing: "editorial",
      radiusStyle: "tactile",
      defaultMode: "system",
    });
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-rule">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">
            Admin · Theme &amp; Style Studio
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink flex items-center gap-2.5">
            <Palette className="h-6 w-6 text-accent" />
            <span>Theme &amp; Aesthetic Studio</span>
          </h2>
          <p className="text-sm text-muted mt-1">
            Customize accent color palettes, typography pairings, border radius curvature, and default mode.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-xl border border-rule bg-paper px-3.5 py-2 text-xs font-mono text-muted hover:text-ink hover:border-ink/40 transition cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Grid: Settings on Left, Live Interactive Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Curated Theme Presets */}
          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wider font-mono mb-2">
              Curated Theme Presets
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PALETTES.map((palette) => {
                const isSelected = currentPreset === palette.id;

                return (
                  <button
                    key={palette.id}
                    type="button"
                    aria-label={`Theme Preset: ${palette.name}`}
                    onClick={() => selectPreset(palette)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition cursor-pointer ${isSelected
                      ? "border-ink bg-soft/80 shadow-xs"
                      : "border-rule bg-paper hover:border-ink/30"
                      }`}
                  >
                    <div className="relative h-7 w-7 rounded-lg shrink-0 shadow-xs overflow-hidden border border-black/10 flex items-center justify-center">
                      {/* Dual-color indicator: left primary button color, right accent color */}
                      <div
                        className="absolute inset-y-0 left-0 w-1/2"
                        style={{ backgroundColor: palette.primaryLight }}
                      />
                      <div
                        className="absolute inset-y-0 right-0 w-1/2"
                        style={{ backgroundColor: palette.light }}
                      />
                      {isSelected && (
                        <Check className="relative z-10 h-4 w-4 text-white drop-shadow-md" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-ink">{palette.name}</span>
                        <div className="flex items-center gap-1 font-mono text-xs text-muted">
                          <span
                            className="inline-block w-2 h-2 rounded-full"
                            style={{ backgroundColor: palette.primaryLight }}
                            title={`Button: ${palette.primaryLight}`}
                          />
                          <span
                            className="inline-block w-2 h-2 rounded-full"
                            style={{ backgroundColor: palette.light }}
                            title={`Accent: ${palette.light}`}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted mt-0.5 leading-snug line-clamp-1">
                        {palette.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Button Color (Buttons & Key Actions) */}
          <div className="p-4 rounded-xl border border-rule bg-paper/60 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-ink uppercase tracking-wider font-mono flex items-center gap-1.5">
                <span>Primary Color (Buttons &amp; Actions)</span>
              </label>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-rule bg-soft text-muted">
                .btn-primary
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Controls all major call-to-action buttons ("Get in touch", "Send message", "Save ⌘S", "Live Demo").
            </p>

            {/* Quick Swatches */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {PRIMARY_SWATCHES.map((swatch) => {
                const isActive = currentPrimary.toLowerCase() === swatch.hex.toLowerCase();
                return (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => handlePrimaryColorChange(swatch.hex)}
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-mono transition cursor-pointer ${isActive
                      ? "border-ink bg-soft font-semibold text-ink shadow-2xs"
                      : "border-rule bg-paper text-muted hover:text-ink hover:border-ink/30"
                      }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <span>{swatch.label}</span>
                  </button>
                );
              })}
            </div>


            {/* Custom Primary Color Picker */}
            <div className="rounded-lg border border-rule bg-soft/30 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowPrimaryPicker((p) => !p)}
                className="w-full p-2.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-soft/60 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="h-8 w-8 rounded-lg border border-rule shadow-2xs shrink-0"
                    style={{ backgroundColor: currentPrimary }}
                  />
                  <div className="text-left min-w-0">
                    <span className="text-xs font-semibold text-ink block">Custom Button Color</span>
                    <span className="text-xs text-muted font-mono">{currentPrimary}</span>
                  </div>
                </div>
                <span className="text-xs text-muted font-mono shrink-0">
                  {showPrimaryPicker ? "▴ close" : "▾ edit"}
                </span>
              </button>
              {showPrimaryPicker && (
                <div className="px-3 pb-3 pt-1 border-t border-rule">
                  <ColorPicker
                    value={currentPrimary}
                    onChange={handlePrimaryColorChange}
                  />
                </div>
              )}
            </div>

            {/* Smart Suggested Accent Banner */}
            <div className="p-3 rounded-lg border border-accent/25 bg-accent/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-ink">Suggested Accent Pairing</span>
                    <span
                      className="inline-block w-3 h-3 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: suggestedAccent.light }}
                    />
                    <span className="text-xs font-mono font-medium text-accent">
                      {suggestedAccent.light}
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-tight mt-0.5">
                    Harmonious complementary accent calculated from your primary button color.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={applySuggestedAccent}
                disabled={isAccentMatchingSuggestion}
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer shrink-0 shadow-2xs ${isAccentMatchingSuggestion
                  ? "bg-soft border border-rule text-muted opacity-75 cursor-default"
                  : "bg-ink text-paper hover:opacity-90 font-medium"
                  }`}
              >
                {isAccentMatchingSuggestion ? (
                  <>
                    <Check className="h-3 w-3 text-accent" />
                    <span>Applied</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-3 w-3" />
                    <span>Apply Suggestion</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Accent Highlight Color (Tags, Radar & Links) */}
          <div className="p-4 rounded-xl border border-rule bg-paper/60 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-ink uppercase tracking-wider font-mono flex items-center gap-1.5">
                <span>Accent Color (Highlights &amp; Tags)</span>
              </label>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-rule bg-soft text-muted">
                var(--accent)
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Controls tag badges, live availability radar dot, inline link decorations, and interactive focus rings.
            </p>

            {/* Quick Accent Swatches */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {ACCENT_SWATCHES.map((swatch) => {
                const isActive = currentAccent.toLowerCase() === swatch.hex.toLowerCase();
                return (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => handleAccentColorChange(swatch.hex)}
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-mono transition cursor-pointer ${isActive
                      ? "border-ink bg-soft font-semibold text-ink shadow-2xs"
                      : "border-rule bg-paper text-muted hover:text-ink hover:border-ink/30"
                      }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <span>{swatch.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Accent Color Picker */}
            <div className="rounded-lg border border-rule bg-soft/30 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAccentPicker((p) => !p)}
                className="w-full p-2.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-soft/60 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="h-8 w-8 rounded-lg border border-rule shadow-2xs shrink-0"
                    style={{ backgroundColor: currentAccent }}
                  />
                  <div className="text-left min-w-0">
                    <span className="text-xs font-semibold text-ink block">Custom Accent Value</span>
                    <span className="text-xs text-muted font-mono">{currentAccent}</span>
                  </div>
                </div>
                <span className="text-xs text-muted font-mono shrink-0">
                  {showAccentPicker ? "▴ close" : "▾ edit"}
                </span>
              </button>
              {showAccentPicker && (
                <div className="px-3 pb-3 pt-1 border-t border-rule">
                  <ColorPicker
                    value={currentAccent}
                    onChange={handleAccentColorChange}
                  />
                </div>
              )}
            </div>

          </div>

          {/* Typography Pairings */}
          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
              <Type className="h-3.5 w-3.5" />
              <span>Typographic System</span>
            </label>
            <div className="space-y-2">
              {FONTS.map((font) => {
                const isSelected = currentFont === font.id;

                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => onChange({ ...themeConfig, fontPairing: font.id })}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition cursor-pointer ${isSelected
                      ? "border-ink bg-soft/80 shadow-xs"
                      : "border-rule bg-paper hover:border-ink/30"
                      }`}
                  >
                    <div>
                      <span className="text-xs font-semibold text-ink block">{font.name}</span>
                      <span className="text-xs text-muted mt-0.5 block">{font.desc}</span>
                    </div>
                    <span
                      className="text-lg text-ink font-semibold px-2"
                      style={{ fontFamily: font.displayFont }}
                    >
                      Aa
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Surface Radius Style */}
          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
              <Square className="h-3.5 w-3.5" />
              <span>Border Radius Curvature</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {RADII.map((radius) => {
                const isSelected = currentRadius === radius.id;

                return (
                  <button
                    key={radius.id}
                    type="button"
                    onClick={() => onChange({ ...themeConfig, radiusStyle: radius.id })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer ${isSelected
                      ? "border-ink bg-soft/80 shadow-xs"
                      : "border-rule bg-paper hover:border-ink/30"
                      }`}
                  >
                    <div
                      className={`h-6 w-10 border-2 border-ink mb-2 bg-soft ${radius.id === "sharp"
                        ? "rounded-none"
                        : radius.id === "tactile"
                          ? "rounded-lg"
                          : "rounded-full"
                        }`}
                    />
                    <span className="text-xs font-medium text-ink">{radius.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Default Theme Mode */}
          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wider font-mono mb-2">
              Default Visitor Appearance
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "system", label: "System OS", icon: Laptop },
                { id: "light", label: "Pure Light", icon: Sun },
                { id: "dark", label: "Deep Dark", icon: Moon },
              ].map((mode) => {
                const Icon = mode.icon;
                const isSelected = currentMode === mode.id;

                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...themeConfig,
                        defaultMode: mode.id as "system" | "light" | "dark",
                      })
                    }
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border transition cursor-pointer text-xs font-medium ${isSelected
                      ? "border-ink bg-ink text-paper font-semibold shadow-xs"
                      : "border-rule bg-paper text-muted hover:text-ink"
                      }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <label className="block text-xs font-medium text-muted uppercase tracking-wider font-mono">
            Live Design System Simulator
          </label>

          {/* Simulated Card Frame */}
          <div
            data-radius={currentRadius}
            className="rounded-xl border border-rule bg-white p-5 shadow-xs space-y-5"
          >
            {/* Header with Title & Availability Radar */}
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full animate-pulse shrink-0"
                  style={{ backgroundColor: currentAccent }}
                />
                <span className="text-xs font-mono text-muted uppercase tracking-wider">
                  Available for Q2 Projects
                </span>
              </div>
              <h3
                className="text-2xl font-bold text-ink mt-2"
                style={{
                  fontFamily:
                    FONTS.find((f) => f.id === currentFont)?.displayFont || undefined,
                }}
              >
                Pyae Phyo Maung
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Full-stack systems engineer building verifiable zero-backend platforms.
              </p>
            </div>

            {/* Chips & Tags with Accent and Primary */}
            <div className="flex flex-wrap gap-1.5">
              <span
                className="rounded px-2 py-0.5 text-xs font-mono font-medium shadow-2xs"
                style={{ backgroundColor: currentPrimary, color: primaryFg }}
              >
                Primary Button
              </span>
              <span
                className="rounded px-2 py-0.5 text-xs font-mono font-medium text-white shadow-2xs"
                style={{ backgroundColor: currentAccent }}
              >
                Accent Highlight
              </span>
              <span className="rounded bg-soft px-2 py-0.5 text-xs font-mono text-muted border border-rule">
                TypeScript 5.8
              </span>
              <span className="rounded bg-soft px-2 py-0.5 text-xs font-mono text-muted border border-rule">
                Cloudflare Pages
              </span>
            </div>

            {/* Simulated Case Study Action Button */}
            <div className="pt-2 border-t border-rule flex flex-col gap-2">
              <button
                type="button"
                className="w-full py-2 px-3 text-xs font-semibold rounded-lg transition shadow-xs cursor-pointer text-center"
                style={{ backgroundColor: currentPrimary, color: primaryFg }}
              >
                Explore Architectural Case Studies (CTA) →
              </button>
              <div className="flex items-center justify-between text-xs text-muted pt-1">
                <span>Link Highlight:</span>
                <span
                  className="font-medium underline underline-offset-4 cursor-pointer"
                  style={{ color: currentAccent }}
                >
                  view source code ↗
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl border border-rule bg-soft/50 text-xs text-muted leading-relaxed">
            <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <span>
              Theme configuration is stored in <code className="font-mono text-ink">portfolio.json</code>.
              Primary button colors (<code className="font-mono text-ink">--primary</code>) and accents (<code className="font-mono text-ink">--accent</code>) are dynamically injected via CSS variables.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
