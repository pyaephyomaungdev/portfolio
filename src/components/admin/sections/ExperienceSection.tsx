import { useSearchParams } from "react-router-dom";
import { ExperienceCardList } from "./experience/ExperienceCardList";
import { CompanyDetailEditorPage } from "./experience/CompanyDetailEditorPage";
import type { ExperienceCompany } from "../../../types/portfolio";

interface ExperienceSectionProps {
  companies: ExperienceCompany[];
  onChange: (companies: ExperienceCompany[]) => void;
  onOpenAddCompanyModal?: () => void;
  onOpenAddRoleModal?: (companyId: string, companyName: string) => void;
  onRequestDelete?: (title: string, onConfirm: () => void) => void;
}

export function ExperienceSection({
  companies,
  onChange,
  onOpenAddCompanyModal,
  onRequestDelete,
}: ExperienceSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isNew = searchParams.get("new") === "true";

  const activeCompany = isNew
    ? {
        id: `exp-${Date.now()}`,
        name: "New Company",
        logoUrl: null,
        location: "Remote",
        sortOrder: companies.length + 1,
        roles: [
          {
            id: `role-${Date.now()}`,
            companyId: `exp-${Date.now()}`,
            title: "Senior Full-Stack Engineer",
            employmentType: "Full-Time",
            startDate: `${new Date().getFullYear()}`,
            endDate: null,
            location: "Remote",
            description: "",
            skills: ["TypeScript", "React"],
            sortOrder: 1,
          },
        ],
      }
    : companies.find((c) => c.id === editId) || null;

  function handleSelectCompany(id: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("edit", id);
      next.delete("new");
      return next;
    });
  }

  function handleStartNewCompany() {
    if (onOpenAddCompanyModal) {
      onOpenAddCompanyModal();
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

  function handleSaveCompany(updated: ExperienceCompany) {
    if (isNew) {
      onChange([...companies, updated]);
    } else {
      onChange(companies.map((c) => (c.id === updated.id ? updated : c)));
    }
    handleCloseEditor();
  }

  function handleDeleteCompany(comp: ExperienceCompany) {
    const doDelete = () => {
      onChange(companies.filter((c) => c.id !== comp.id));
      handleCloseEditor();
    };

    if (onRequestDelete) {
      onRequestDelete(comp.name || "Company", doDelete);
    } else {
      doDelete();
    }
  }

  if (activeCompany) {
    return (
      <CompanyDetailEditorPage
        company={activeCompany}
        onSave={handleSaveCompany}
        onCancel={handleCloseEditor}
        onDelete={!isNew ? handleDeleteCompany : undefined}
      />
    );
  }

  return (
    <ExperienceCardList
      companies={companies}
      onSelectCompany={handleSelectCompany}
      onAddCompany={handleStartNewCompany}
      onChange={onChange}
      onRequestDelete={onRequestDelete}
    />
  );
}
