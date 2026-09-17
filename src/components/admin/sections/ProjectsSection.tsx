import { useSearchParams } from "react-router-dom";
import { ProjectsCardList } from "./projects/ProjectsCardList";
import { ProjectDetailEditorPage } from "./projects/ProjectDetailEditorPage";
import type { Project } from "../../../types/portfolio";

interface ProjectsSectionProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
  onOpenAddModal?: () => void;
  onRequestDelete?: (title: string, onConfirm: () => void) => void;
}

export function ProjectsSection({
  projects,
  onChange,
  onOpenAddModal,
  onRequestDelete,
}: ProjectsSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isNew = searchParams.get("new") === "true";

  const activeProject = isNew
    ? {
        id: `proj-${Date.now()}`,
        title: "New Project",
        slug: "new-project",
        summary: "",
        body: "",
        period: `${new Date().getFullYear()}`,
        url: null,
        repoUrl: null,
        language: "TypeScript",
        techStack: [],
        categories: ["Systems Architecture"],
        featured: false,
        sortOrder: projects.length + 1,
      }
    : projects.find((p) => p.id === editId) || null;

  function handleSelectProject(projectId: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("edit", projectId);
      next.delete("new");
      return next;
    });
  }

  function handleStartNewProject() {
    if (onOpenAddModal) {
      onOpenAddModal();
      return;
    }
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("new", "true");
      next.delete("edit");
      return next;
    });
  }

  function handleCloseEditor() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("edit");
      next.delete("new");
      return next;
    });
  }

  function handleSaveProject(updated: Project) {
    if (isNew) {
      onChange([...projects, updated]);
    } else {
      onChange(projects.map((p) => (p.id === updated.id ? updated : p)));
    }
    handleCloseEditor();
  }

  function handleDeleteProject(proj: Project) {
    const doDelete = () => {
      onChange(projects.filter((p) => p.id !== proj.id));
      handleCloseEditor();
    };

    if (onRequestDelete) {
      onRequestDelete(proj.title || "Project", doDelete);
    } else {
      doDelete();
    }
  }

  if (activeProject) {
    return (
      <ProjectDetailEditorPage
        project={activeProject}
        onSave={handleSaveProject}
        onCancel={handleCloseEditor}
        onDelete={!isNew ? handleDeleteProject : undefined}
      />
    );
  }

  return (
    <ProjectsCardList
      projects={projects}
      onSelectProject={handleSelectProject}
      onAddProject={handleStartNewProject}
      onChange={onChange}
      onRequestDelete={onRequestDelete}
    />
  );
}
