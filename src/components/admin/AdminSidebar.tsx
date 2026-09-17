import { Link } from "react-router-dom";
import { 
  LayoutDashboard,
  User, 
  BarChart2, 
  Briefcase, 
  Layers, 
  GraduationCap, 
  Award, 
  BadgeCheck,
  FileCode,
  Cloud,
  SlidersVertical,
  Globe
} from "lucide-react";

export type AdminTab = 
  | "overview"
  | "profile" 
  | "stats" 
  | "projects" 
  | "experience" 
  | "education" 
  | "honors" 
  | "licenses" 
  | "layout"
  | "seo"
  | "deploy"
  | "json";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  counts: {
    stats: number;
    projects: number;
    experience: number;
    education: number;
    honors: number;
    licenses: number;
  };
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  counts,
}: AdminSidebarProps) {
  const tabs = [
    { id: "overview" as const, label: "Overview", icon: LayoutDashboard, count: null },
    { id: "profile" as const, label: "Profile", icon: User, count: null },
    { id: "stats" as const, label: "Stats", icon: BarChart2, count: counts.stats },
    { id: "projects" as const, label: "Projects", icon: Layers, count: counts.projects },
    { id: "experience" as const, label: "Experience", icon: Briefcase, count: counts.experience },
    { id: "education" as const, label: "Education", icon: GraduationCap, count: counts.education },
    { id: "honors" as const, label: "Honors", icon: Award, count: counts.honors },
    { id: "licenses" as const, label: "Certifications", icon: BadgeCheck, count: counts.licenses },
    { id: "layout" as const, label: "Layout & Visibility", icon: SlidersVertical, count: null },
    { id: "seo" as const, label: "SEO & Social", icon: Globe, count: null },
    { id: "deploy" as const, label: "Deploy & Hosting", icon: Cloud, count: null },
    { id: "json" as const, label: "Raw JSON", icon: FileCode, count: null },
  ];

  return (
    <>
      {/* Mobile Horizontal Tab Strip (< md) */}
      <div className="md:hidden w-full overflow-x-auto no-scrollbar flex items-center gap-1.5 pb-2 -mt-1 border-b border-rule shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              to={`/admin/${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition cursor-pointer shrink-0 ${
                isActive
                  ? "bg-ink text-paper font-semibold shadow-2xs"
                  : "bg-white border border-rule text-muted hover:text-ink hover:border-ink/40"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`rounded-full px-1.5 py-0.5 font-mono text-xs ${
                    isActive ? "bg-white/20 text-paper" : "bg-soft text-muted border border-rule"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Desktop Vertical Sidebar (md+) */}
      <aside 
        className="w-60 shrink-0 sticky top-20 self-start overflow-y-auto hidden md:flex flex-col gap-1"
        style={{ maxHeight: "calc(100vh - 6rem)" }}
      >
        <p className="text-xs font-mono uppercase tracking-wider text-muted px-3 py-1 font-semibold">
          Sections
        </p>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              to={`/admin/${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition cursor-pointer ${
                isActive
                  ? "bg-ink text-paper font-semibold"
                  : "text-muted hover:bg-soft hover:text-ink"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </div>
              {tab.count !== null && (
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-xs ${
                    isActive ? "bg-white/20 text-paper" : "bg-soft text-muted border border-rule"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </Link>
          );
        })}
      </aside>
    </>
  );
}
