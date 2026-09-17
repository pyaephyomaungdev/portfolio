import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPortfolio, savePortfolioJson, uploadAvatarImage } from "../lib/api";
import { useTheme } from "../context/ThemeContext";
import { applyThemeConfig } from "../lib/theme";
import type {
  Portfolio,
  Project,
  ExperienceCompany,
  ExperienceRole,
  Education,
  Honor,
  License,
  Stat
} from "../types/portfolio";

// Layout & Navigation Components
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar, type AdminTab } from "../components/admin/AdminSidebar";
import { AdminFooter } from "../components/admin/AdminFooter";

// Section Components (Dumb / Presentational)
import { OverviewSection } from "../components/admin/sections/OverviewSection";
import { ProfileSection } from "../components/admin/sections/ProfileSection";
import { StatsSection } from "../components/admin/sections/StatsSection";
import { ProjectsSection } from "../components/admin/sections/ProjectsSection";
import { ExperienceSection } from "../components/admin/sections/ExperienceSection";
import { EducationSection } from "../components/admin/sections/EducationSection";
import { HonorsSection } from "../components/admin/sections/HonorsSection";
import { LicensesSection } from "../components/admin/sections/LicensesSection";
import { LayoutSection } from "../components/admin/sections/LayoutSection";
import { SeoSection } from "../components/admin/sections/SeoSection";
import { CustomSectionsEditor } from "../components/admin/sections/CustomSectionsEditor";
import { ThemeSection } from "../components/admin/sections/ThemeSection";
import { DeploySection } from "../components/admin/sections/DeploySection";
import { RawJsonSection } from "../components/admin/sections/RawJsonSection";

// Modal Dialog Components
import { AddCompanyModal } from "../components/admin/modals/AddCompanyModal";
import { AddRoleModal } from "../components/admin/modals/AddRoleModal";
import { AddEducationModal } from "../components/admin/modals/AddEducationModal";
import { AddHonorModal } from "../components/admin/modals/AddHonorModal";
import { AddLicenseModal } from "../components/admin/modals/AddLicenseModal";
import { AddProjectModal } from "../components/admin/modals/AddProjectModal";
import { AddStatModal } from "../components/admin/modals/AddStatModal";
import { ConfirmModal } from "../components/admin/modals/ConfirmModal";

type ActiveModal =
  | "add-company"
  | "add-role"
  | "add-education"
  | "add-honor"
  | "add-license"
  | "add-project"
  | "add-stat"
  | null;

const VALID_TABS: AdminTab[] = [
  "overview",
  "profile",
  "stats",
  "projects",
  "experience",
  "education",
  "honors",
  "licenses",
  "custom",
  "layout",
  "seo",
  "theme",
  "deploy",
  "json",
];

export function AdminPage() {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();

  const activeTab: AdminTab = tab && VALID_TABS.includes(tab as AdminTab)
    ? (tab as AdminTab)
    : "overview";

  useEffect(() => {
    if (tab && !VALID_TABS.includes(tab as AdminTab)) {
      navigate("/admin/overview", { replace: true });
    }
  }, [tab, navigate]);

  function handleSelectTab(selectedTab: AdminTab) {
    navigate(`/admin/${selectedTab}`);
  }

  const { resolvedTheme, setThemeConfig } = useTheme();
  const [data, setData] = useState<Portfolio | null>(null);

  useEffect(() => {
    if (data?.themeConfig) {
      applyThemeConfig(data.themeConfig, resolvedTheme === "dark");
    }
  }, [data?.themeConfig, resolvedTheme]);

  const [savedSnapshot, setSavedSnapshot] = useState<string>("");
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Draft cache & Revert confirmation
  const [draftDetected, setDraftDetected] = useState<Portfolio | null>(null);
  const [revertModalOpen, setRevertModalOpen] = useState(false);

  // Modal Dialog states
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [targetCompanyForRole, setTargetCompanyForRole] = useState<{ id: string; name: string } | null>(null);
  const [unsavedExitModalOpen, setUnsavedExitModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
  });

  function requestDelete(title: string, onConfirm: () => void) {
    setDeleteModal({
      isOpen: true,
      title: `Delete "${title}"?`,
      message: `Are you sure you want to delete "${title}"? This item will be removed from your portfolio configuration.`,
      onConfirm,
    });
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    try {
      const p = await fetchPortfolio();
      setData(p);
      setSavedSnapshot(JSON.stringify(p));
      setJsonText(JSON.stringify(p, null, 2));
      setJsonError(null);

      // Check localStorage for unsaved drafts
      try {
        const savedDraft = localStorage.getItem("ppm_admin_draft");
        if (savedDraft) {
          const parsedDraft = JSON.parse(savedDraft);
          if (JSON.stringify(parsedDraft) !== JSON.stringify(p)) {
            setDraftDetected(parsedDraft);
          } else {
            localStorage.removeItem("ppm_admin_draft");
          }
        }
      } catch {
        // Ignore localStorage error
      }
    } catch {
      setStatusMessage({ type: "error", text: "Failed to load initial data" });
    }
  }

  const isDirty = data !== null && savedSnapshot !== "" && JSON.stringify(data) !== savedSnapshot;

  // Auto-cache dirty state in localStorage
  useEffect(() => {
    if (isDirty && data) {
      try {
        localStorage.setItem("ppm_admin_draft", JSON.stringify(data));
      } catch {
        // Ignore storage quota
      }
    }
  }, [isDirty, data]);

  // Protect against accidental tab closure / reload when isDirty is true
  useEffect(() => {
    if (!isDirty) return;
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  function handleRequestRevert() {
    if (isDirty) {
      setRevertModalOpen(true);
    } else {
      void loadData();
    }
  }

  function handleExitSite() {
    if (isDirty) {
      setUnsavedExitModalOpen(true);
    } else {
      navigate("/");
    }
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void handleSave();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [data, jsonError]);

  function handleJsonChange(text: string) {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      setData(parsed);
      setJsonError(null);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Invalid JSON";
      setJsonError(message);
    }
  }

  function syncJson(updated: Portfolio) {
    setData(updated);
    setJsonText(JSON.stringify(updated, null, 2));
    setJsonError(null);
  }

  function handleExportJson() {
    if (!data) return;
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    link.href = url;
    link.download = `portfolio-data-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusMessage({ type: "success", text: "Portfolio exported as JSON successfully!" });
    setTimeout(() => setStatusMessage(null), 3500);
  }

  function handleImportJson(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          throw new Error("Invalid format. Uploaded file must be a JSON object.");
        }
        if (!parsed.profile && !parsed.projects) {
          throw new Error("Missing 'profile' or 'projects' in uploaded JSON.");
        }
        syncJson(parsed as Portfolio);
        setStatusMessage({
          type: "success",
          text: `Imported "${file.name}" successfully! Click "Save to Disk" to persist.`,
        });
        setTimeout(() => setStatusMessage(null), 5000);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to parse JSON";
        setStatusMessage({ type: "error", text: `Import failed: ${msg}` });
      }
    };
    reader.readAsText(file);
  }

  async function handleSave() {
    if (!data) return;
    if (jsonError) {
      setStatusMessage({ type: "error", text: "Please fix JSON syntax errors before saving." });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      await savePortfolioJson(data);
      setSavedSnapshot(JSON.stringify(data));
      try {
        localStorage.removeItem("ppm_admin_draft");
      } catch {
        // Ignore
      }
      setDraftDetected(null);
      setStatusMessage({ type: "success", text: "Saved successfully to src/data/portfolio.json!" });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save portfolio data";
      setStatusMessage({ type: "error", text: message });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAvatarUpload(file: File) {
    setIsUploadingAvatar(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        try {
          const newUrl = await uploadAvatarImage(dataUrl);
          if (data && data.profile) {
            syncJson({
              ...data,
              profile: {
                ...data.profile,
                avatarUrl: newUrl,
              },
            });
          }
          setStatusMessage({ type: "success", text: "Avatar updated! Click 'Save to Disk' to persist." });
        } catch {
          // If dev server upload endpoint fails, use data URL fallback
          if (data && data.profile) {
            syncJson({
              ...data,
              profile: {
                ...data.profile,
                avatarUrl: dataUrl,
              },
            });
          }
          setStatusMessage({ type: "success", text: "Avatar set as data URL! Click 'Save to Disk' to persist." });
        } finally {
          setIsUploadingAvatar(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingAvatar(false);
      setStatusMessage({ type: "error", text: "Could not read image file." });
    }
  }

  // Modal Submit Handlers
  function handleAddCompany(company: ExperienceCompany) {
    if (!data) return;
    syncJson({
      ...data,
      experience: [company, ...(data.experience || [])],
    });
    setStatusMessage({ type: "success", text: `Added company: ${company.name}` });
  }

  function handleAddRoleToCompany(companyId: string, role: ExperienceRole) {
    if (!data) return;
    const updated = data.experience.map((comp) => {
      if (comp.id === companyId) {
        return {
          ...comp,
          roles: [role, ...comp.roles],
        };
      }
      return comp;
    });
    syncJson({ ...data, experience: updated });
    setStatusMessage({ type: "success", text: `Added role: ${role.title}` });
  }

  function handleAddEducation(edu: Education) {
    if (!data) return;
    syncJson({
      ...data,
      education: [...(data.education || []), edu],
    });
    setStatusMessage({ type: "success", text: `Added education: ${edu.school}` });
  }

  function handleAddHonor(honor: Honor) {
    if (!data) return;
    syncJson({
      ...data,
      honors: [...(data.honors || []), honor],
    });
    setStatusMessage({ type: "success", text: `Added honor: ${honor.title}` });
  }

  function handleAddLicense(lic: License) {
    if (!data) return;
    syncJson({
      ...data,
      licenses: [...(data.licenses || []), lic],
    });
    setStatusMessage({ type: "success", text: `Added certification: ${lic.name}` });
  }

  function handleAddProject(proj: Project) {
    if (!data) return;
    syncJson({
      ...data,
      projects: [proj, ...(data.projects || [])],
    });
    setStatusMessage({ type: "success", text: `Added project: ${proj.title}` });
  }

  function handleAddStat(stat: Stat) {
    if (!data) return;
    syncJson({
      ...data,
      stats: [...(data.stats || []), stat],
    });
    setStatusMessage({ type: "success", text: `Added metric stat: ${stat.label}` });
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper text-muted font-mono text-sm">
        Loading admin workspace...
      </div>
    );
  }

  const profile = data.profile || {
    name: "",
    handle: "",
    headline: "",
    avatarUrl: "",
    location: "",
    emailPublic: "",
    githubUrl: "",
    websiteUrl: "",
    buyMeACoffeeUrl: "",
    joinedLabel: null,
    bio: "",
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans">
      {/* 1. Header (Dumb Component) */}
      <AdminHeader
        statusMessage={statusMessage}
        onRevert={loadData}
        onRequestRevert={handleRequestRevert}
        onSave={handleSave}
        onExport={handleExportJson}
        onImport={handleImportJson}
        onExit={handleExitSite}
        isSaving={isSaving}
        hasErrors={Boolean(jsonError)}
        isDirty={isDirty}
      />

      {/* Draft Recovery Notification Banner */}
      {draftDetected && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-accent/30 bg-accent-soft text-accent text-xs font-mono shadow-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span>Unsaved local draft from a previous session detected.</span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  syncJson(draftDetected);
                  setDraftDetected(null);
                  setStatusMessage({ type: "success", text: "Restored unsaved draft!" });
                  setTimeout(() => setStatusMessage(null), 3000);
                }}
                className="px-2.5 py-1 rounded bg-accent text-white font-medium hover:opacity-90 transition cursor-pointer"
              >
                Restore Draft
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem("ppm_admin_draft");
                  } catch {
                    // Ignore
                  }
                  setDraftDetected(null);
                }}
                className="px-2.5 py-1 rounded bg-white/60 text-ink hover:bg-white border border-accent/20 transition cursor-pointer"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Workspace Body: Sidebar + Main Section Container */}
      <div className="flex-1 flex flex-col md:flex-row items-start max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          counts={{
            stats: data.stats?.length || 0,
            projects: data.projects?.length || 0,
            experience: data.experience?.length || 0,
            education: data.education?.length || 0,
            honors: data.honors?.length || 0,
            licenses: data.licenses?.length || 0,
            custom: data.customSections?.length || 0,
          }}
        />

        <main className="flex-1 min-w-0 w-full pb-12">
          {activeTab === "overview" && (
            <OverviewSection
              portfolio={data}
              onUpdateAvailability={(patch) => {
                const currentAvail = profile.availability || {
                  enabled: true,
                  status: "Available for Work",
                  scope: "Full-Time & Remote",
                  timezone: "Asia/Bangkok",
                  timezoneLabel: "BKK (UTC+7)",
                  sla: "<24h SLA",
                };
                syncJson({
                  ...data,
                  profile: {
                    ...profile,
                    availability: { ...currentAvail, ...patch },
                  },
                });
                setStatusMessage({ type: "success", text: "Availability status updated!" });
                setTimeout(() => setStatusMessage(null), 3000);
              }}
              onNavigateTab={handleSelectTab}
            />
          )}

          {activeTab === "profile" && (
            <ProfileSection
              profile={profile}
              onChange={(updated) => syncJson({ ...data, profile: updated })}
              onUploadAvatar={(file) => void handleAvatarUpload(file)}
              isUploadingAvatar={isUploadingAvatar}
            />
          )}

          {activeTab === "stats" && (
            <StatsSection
              stats={data.stats || []}
              onChange={(stats) => syncJson({ ...data, stats })}
              onOpenAddModal={() => setActiveModal("add-stat")}
              onRequestDelete={requestDelete}
            />
          )}

          {activeTab === "projects" && (
            <ProjectsSection
              projects={data.projects || []}
              onChange={(projects) => syncJson({ ...data, projects })}
              onOpenAddModal={() => setActiveModal("add-project")}
              onRequestDelete={requestDelete}
            />
          )}

          {activeTab === "experience" && (
            <ExperienceSection
              companies={data.experience || []}
              onChange={(experience) => syncJson({ ...data, experience })}
              onOpenAddCompanyModal={() => setActiveModal("add-company")}
              onOpenAddRoleModal={(companyId, companyName) => {
                setTargetCompanyForRole({ id: companyId, name: companyName });
                setActiveModal("add-role");
              }}
              onRequestDelete={requestDelete}
            />
          )}

          {activeTab === "education" && (
            <EducationSection
              education={data.education || []}
              onChange={(education) => syncJson({ ...data, education })}
              onOpenAddModal={() => setActiveModal("add-education")}
              onRequestDelete={requestDelete}
            />
          )}

          {activeTab === "honors" && (
            <HonorsSection
              honors={data.honors || []}
              onChange={(honors) => syncJson({ ...data, honors })}
              onOpenAddModal={() => setActiveModal("add-honor")}
              onRequestDelete={requestDelete}
            />
          )}

          {activeTab === "licenses" && (
            <LicensesSection
              licenses={data.licenses || []}
              onChange={(licenses) => syncJson({ ...data, licenses })}
              onOpenAddModal={() => setActiveModal("add-license")}
              onRequestDelete={requestDelete}
            />
          )}

          {activeTab === "custom" && (
            <CustomSectionsEditor
              sections={data.customSections || []}
              onChange={(customSections) => syncJson({ ...data, customSections })}
            />
          )}

          {activeTab === "layout" && (
            <LayoutSection
              visibility={data.sectionVisibility}
              onChange={(sectionVisibility) => syncJson({ ...data, sectionVisibility })}
            />
          )}

          {activeTab === "seo" && (
            <SeoSection
              seo={data.seo}
              profile={data.profile}
              onChange={(seo) => syncJson({ ...data, seo })}
            />
          )}

          {activeTab === "theme" && (
            <ThemeSection
              themeConfig={data.themeConfig}
              onChange={(themeConfig) => {
                syncJson({ ...data, themeConfig });
                setThemeConfig(themeConfig);
              }}
            />
          )}

          {activeTab === "deploy" && (
            <DeploySection profile={data.profile} />
          )}

          {activeTab === "json" && (
            <RawJsonSection
              jsonText={jsonText}
              jsonError={jsonError}
              onChange={handleJsonChange}
              onExport={handleExportJson}
              onImport={handleImportJson}
            />
          )}
        </main>
      </div>

      {/* 3. Sticky Footer (Dumb Component) */}
      <AdminFooter />

      {/* 4. Modals Container */}
      <AddCompanyModal
        isOpen={activeModal === "add-company"}
        onClose={() => setActiveModal(null)}
        onAdd={handleAddCompany}
      />

      {targetCompanyForRole && (
        <AddRoleModal
          isOpen={activeModal === "add-role"}
          onClose={() => {
            setActiveModal(null);
            setTargetCompanyForRole(null);
          }}
          companyId={targetCompanyForRole.id}
          companyName={targetCompanyForRole.name}
          onAdd={handleAddRoleToCompany}
        />
      )}

      <AddEducationModal
        isOpen={activeModal === "add-education"}
        onClose={() => setActiveModal(null)}
        onAdd={handleAddEducation}
      />

      <AddHonorModal
        isOpen={activeModal === "add-honor"}
        onClose={() => setActiveModal(null)}
        onAdd={handleAddHonor}
      />

      <AddLicenseModal
        isOpen={activeModal === "add-license"}
        onClose={() => setActiveModal(null)}
        onAdd={handleAddLicense}
      />

      <AddProjectModal
        isOpen={activeModal === "add-project"}
        onClose={() => setActiveModal(null)}
        onAdd={handleAddProject}
      />

      <AddStatModal
        isOpen={activeModal === "add-stat"}
        onClose={() => setActiveModal(null)}
        onAdd={handleAddStat}
        currentCount={data.stats?.length || 0}
      />

      {/* 5. Confirmation Modals */}
      <ConfirmModal
        isOpen={unsavedExitModalOpen}
        onClose={() => setUnsavedExitModalOpen(false)}
        onConfirm={() => {
          setUnsavedExitModalOpen(false);
          navigate("/");
        }}
        eyebrow="// UNSAVED CHANGES"
        title="Discard Unsaved Changes?"
        message="You have unsaved modifications in your portfolio editor. If you exit now, your changes will not be saved to disk."
        confirmLabel="Discard & Exit"
        cancelLabel="Stay & Edit"
        variant="warning"
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={deleteModal.onConfirm}
        title={deleteModal.title}
        message={deleteModal.message}
        confirmLabel="Delete Item"
        cancelLabel="Cancel"
        variant="destructive"
      />

      <ConfirmModal
        isOpen={revertModalOpen}
        onClose={() => setRevertModalOpen(false)}
        onConfirm={() => {
          setRevertModalOpen(false);
          try {
            localStorage.removeItem("ppm_admin_draft");
          } catch {
            // Ignore
          }
          setDraftDetected(null);
          void loadData();
          setStatusMessage({ type: "success", text: "Reloaded fresh state from disk." });
          setTimeout(() => setStatusMessage(null), 3000);
        }}
        eyebrow="// DISCARD MODIFICATIONS"
        title="Revert to Disk State?"
        message="Are you sure you want to discard all unsaved edits and reload the saved state from src/data/portfolio.json?"
        confirmLabel="Discard & Revert"
        cancelLabel="Keep Editing"
        variant="warning"
      />
    </div>
  );
}
