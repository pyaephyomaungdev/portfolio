import { Link } from "react-router-dom";
import { 
  User, 
  BarChart2, 
  Briefcase, 
  Layers, 
  GraduationCap, 
  Award, 
  BadgeCheck,
  FileCode 
} from "lucide-react";

export type AdminTab = 
  | "profile" 
  | "stats" 
  | "projects" 
  | "experience" 
  | "education" 
  | "honors" 
  | "licenses" 
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
    { id: "profile" as const, label: "Profile", icon: User, count: null },
    { id: "stats" as const, label: "Stats", icon: BarChart2, count: counts.stats },
    { id: "projects" as const, label: "Projects", icon: Layers, count: counts.projects },
    { id: "experience" as const, label: "Experience", icon: Briefcase, count: counts.experience },
    { id: "education" as const, label: "Education", icon: GraduationCap, count: counts.education },
    { id: "honors" as const, label: "Honors", icon: Award, count: counts.honors },
    { id: "licenses" as const, label: "Certifications", icon: BadgeCheck, count: counts.licenses },
    { id: "json" as const, label: "Raw JSON", icon: FileCode, count: null },
  ];

  return (
    <aside 
      className="w-60 shrink-0 sticky top-20 self-start overflow-y-auto flex flex-col gap-1"
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
  );
}
