import { 
  Layers, 
  Briefcase, 
  GraduationCap, 
  BadgeCheck, 
  Award, 
  GitCommit, 
  BarChart2, 
  Send,
  Eye,
  RotateCcw
} from "lucide-react";
import type { SectionVisibility } from "../../../types/portfolio";

interface LayoutSectionProps {
  visibility?: SectionVisibility;
  onChange: (visibility: SectionVisibility) => void;
}

interface SectionMeta {
  key: keyof SectionVisibility;
  title: string;
  description: string;
  icon: typeof Layers;
  recommended: boolean;
}

const SECTIONS: SectionMeta[] = [
  {
    key: "projects",
    title: "Selected Work & Projects",
    description: "Featured projects, category momentum chips, and architectural case study deep dives.",
    icon: Layers,
    recommended: true,
  },
  {
    key: "experience",
    title: "Career Experience",
    description: "Professional employment timeline, company roles, responsibilities, and skill tags.",
    icon: Briefcase,
    recommended: true,
  },
  {
    key: "education",
    title: "Academic Background",
    description: "Higher education, degrees, fields of study, and academic honors.",
    icon: GraduationCap,
    recommended: true,
  },
  {
    key: "licenses",
    title: "Certifications & Credentials",
    description: "Industry certificates, credentials, issuing authorities, and verification links.",
    icon: BadgeCheck,
    recommended: false,
  },
  {
    key: "honors",
    title: "Honors & Awards",
    description: "Engineering hackathons, academic recognition, and competitive achievements.",
    icon: Award,
    recommended: false,
  },
  {
    key: "heatmap",
    title: "GitHub Contribution Heatmap",
    description: "Live interactive SVG activity matrix synced directly with public GitHub profile.",
    icon: GitCommit,
    recommended: true,
  },
  {
    key: "stats",
    title: "Hero Key Statistics",
    description: "Numerical metrics strip displayed prominently under the hero profile heading.",
    icon: BarChart2,
    recommended: true,
  },
  {
    key: "contact",
    title: "Direct Message Dispatch",
    description: "Inline interactive contact form with edge Telegram notification forwarding.",
    icon: Send,
    recommended: true,
  },
];

export function LayoutSection({ visibility = {}, onChange }: LayoutSectionProps) {
  // Normalize visibility values, defaulting to true
  const currentVisibility: Required<SectionVisibility> = {
    stats: visibility.stats ?? true,
    heatmap: visibility.heatmap ?? true,
    projects: visibility.projects ?? true,
    experience: visibility.experience ?? true,
    education: visibility.education ?? true,
    honors: visibility.honors ?? true,
    licenses: visibility.licenses ?? true,
    contact: visibility.contact ?? true,
  };

  const visibleCount = Object.values(currentVisibility).filter(Boolean).length;

  function handleToggle(key: keyof SectionVisibility) {
    onChange({
      ...currentVisibility,
      [key]: !currentVisibility[key],
    });
  }

  function handleEnableAll() {
    const allEnabled = SECTIONS.reduce((acc, s) => {
      acc[s.key] = true;
      return acc;
    }, {} as Required<SectionVisibility>);
    onChange(allEnabled);
  }

  function handleResetDefaults() {
    const defaults: Required<SectionVisibility> = {
      stats: true,
      heatmap: true,
      projects: true,
      experience: true,
      education: true,
      honors: true,
      licenses: true,
      contact: true,
    };
    onChange(defaults);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-rule">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              Admin · Homepage Layout
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
            Section Visibility
          </h2>
          <p className="text-sm text-muted mt-1">
            Control which sections appear on your public homepage in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleEnableAll}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-3 py-1.5 text-xs font-mono text-muted hover:text-ink hover:border-ink/40 transition cursor-pointer shadow-2xs"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Show All</span>
          </button>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-3 py-1.5 text-xs font-mono text-muted hover:text-ink hover:border-ink/40 transition cursor-pointer shadow-2xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="flex items-center justify-between p-3.5 rounded-xl border border-rule bg-white text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-muted">Active Sections:</span>
          <span className="text-ink font-semibold">{visibleCount} of {SECTIONS.length} visible</span>
        </div>
        <span className="text-muted hidden sm:inline">Changes reflect immediately upon saving</span>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isVisible = currentVisibility[sec.key];

          return (
            <div
              key={sec.key}
              onClick={() => handleToggle(sec.key)}
              className={`group flex items-start justify-between p-4 rounded-xl border transition-all cursor-pointer select-none ${
                isVisible
                  ? "border-rule bg-white hover:border-ink/40 shadow-2xs"
                  : "border-rule/60 bg-soft/40 opacity-70 hover:opacity-100 hover:border-rule"
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 pr-3">
                <div
                  className={`p-2 rounded-lg border shrink-0 transition ${
                    isVisible
                      ? "border-rule bg-soft text-ink group-hover:border-ink/30"
                      : "border-rule bg-paper text-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-ink truncate">
                      {sec.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono font-medium border ${
                        isVisible
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-muted/10 text-muted border-muted/20"
                      }`}
                    >
                      {isVisible ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">
                    {sec.description}
                  </p>
                </div>
              </div>

              {/* Accessible Custom Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isVisible}
                aria-label={`Toggle ${sec.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(sec.key);
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isVisible ? "bg-ink" : "bg-rule"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isVisible ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
