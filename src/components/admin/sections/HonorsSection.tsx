import { useSearchParams } from "react-router-dom";
import { HonorsCardList } from "./honors/HonorsCardList";
import { HonorDetailEditorPage } from "./honors/HonorDetailEditorPage";
import type { Honor } from "../../../types/portfolio";

interface HonorsSectionProps {
  honors: Honor[];
  onChange: (honors: Honor[]) => void;
  onOpenAddModal?: () => void;
  onRequestDelete?: (title: string, onConfirm: () => void) => void;
}

export function HonorsSection({
  honors,
  onChange,
  onOpenAddModal,
  onRequestDelete,
}: HonorsSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isNew = searchParams.get("new") === "true";

  const activeHonor = isNew
    ? {
        id: `honor-${Date.now()}`,
        title: "New Honor or Award",
        issuer: "",
        date: `${new Date().getFullYear()}`,
        description: "",
        url: null,
      }
    : honors.find((h) => h.id === editId) || null;

  function handleSelectHonor(id: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("edit", id);
      next.delete("new");
      return next;
    });
  }

  function handleStartNewHonor() {
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

  function handleSaveHonor(updated: Honor) {
    if (isNew) {
      onChange([...honors, updated]);
    } else {
      onChange(honors.map((h) => (h.id === updated.id ? updated : h)));
    }
    handleCloseEditor();
  }

  function handleDeleteHonor(honor: Honor) {
    const doDelete = () => {
      onChange(honors.filter((h) => h.id !== honor.id));
      handleCloseEditor();
    };

    if (onRequestDelete) {
      onRequestDelete(honor.title || "Honor record", doDelete);
    } else {
      doDelete();
    }
  }

  if (activeHonor) {
    return (
      <HonorDetailEditorPage
        honor={activeHonor}
        onSave={handleSaveHonor}
        onCancel={handleCloseEditor}
        onDelete={!isNew ? handleDeleteHonor : undefined}
      />
    );
  }

  return (
    <HonorsCardList
      honors={honors}
      onSelectHonor={handleSelectHonor}
      onAddHonor={handleStartNewHonor}
      onChange={onChange}
      onRequestDelete={onRequestDelete}
    />
  );
}
