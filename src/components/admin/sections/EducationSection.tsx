import { useSearchParams } from "react-router-dom";
import { EducationCardList } from "./education/EducationCardList";
import { EducationDetailEditorPage } from "./education/EducationDetailEditorPage";
import type { Education } from "../../../types/portfolio";

interface EducationSectionProps {
  education: Education[];
  onChange: (education: Education[]) => void;
  onOpenAddModal?: () => void;
  onRequestDelete?: (title: string, onConfirm: () => void) => void;
}

export function EducationSection({
  education,
  onChange,
  onOpenAddModal,
  onRequestDelete,
}: EducationSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isNew = searchParams.get("new") === "true";

  const activeEducation = isNew
    ? {
        id: `edu-${Date.now()}`,
        school: "New University",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: "2020",
        endDate: "2024",
        description: "",
        url: null,
      }
    : education.find((e) => e.id === editId) || null;

  function handleSelectEducation(id: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("edit", id);
      next.delete("new");
      return next;
    });
  }

  function handleStartNewEducation() {
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

  function handleSaveEducation(updated: Education) {
    if (isNew) {
      onChange([...education, updated]);
    } else {
      onChange(education.map((e) => (e.id === updated.id ? updated : e)));
    }
    handleCloseEditor();
  }

  function handleDeleteEducation(edu: Education) {
    const doDelete = () => {
      onChange(education.filter((e) => e.id !== edu.id));
      handleCloseEditor();
    };

    if (onRequestDelete) {
      onRequestDelete(edu.degree || edu.school || "Education record", doDelete);
    } else {
      doDelete();
    }
  }

  if (activeEducation) {
    return (
      <EducationDetailEditorPage
        education={activeEducation}
        onSave={handleSaveEducation}
        onCancel={handleCloseEditor}
        onDelete={!isNew ? handleDeleteEducation : undefined}
      />
    );
  }

  return (
    <EducationCardList
      education={education}
      onSelectEducation={handleSelectEducation}
      onAddEducation={handleStartNewEducation}
      onChange={onChange}
      onRequestDelete={onRequestDelete}
    />
  );
}
