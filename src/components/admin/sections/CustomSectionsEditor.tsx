import { useSearchParams } from "react-router-dom";
import { CustomSectionsCardList } from "./custom/CustomSectionsCardList";
import { CustomSectionDetailEditorPage } from "./custom/CustomSectionDetailEditorPage";
import type { CustomSection } from "../../../types/portfolio";

interface CustomSectionsEditorProps {
  sections?: CustomSection[];
  onChange: (sections: CustomSection[]) => void;
  onRequestDelete?: (title: string, onConfirm: () => void) => void;
}

export function CustomSectionsEditor({
  sections = [],
  onChange,
  onRequestDelete,
}: CustomSectionsEditorProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isNew = searchParams.get("new") === "true";

  const activeSection = isNew
    ? {
        id: `section-${Date.now()}`,
        title: "New Custom Section",
        subtitle: "",
        layout: "cards" as const,
        content: "",
        items: [],
        sortOrder: sections.length + 1,
        visible: true,
      }
    : sections.find((s) => s.id === editId) || null;

  function handleSelectSection(id: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("edit", id);
      next.delete("new");
      return next;
    });
  }

  function handleStartNewSection() {
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

  function handleSaveSection(updated: CustomSection) {
    if (isNew) {
      onChange([...sections, updated]);
    } else {
      onChange(sections.map((s) => (s.id === updated.id ? updated : s)));
    }
    handleCloseEditor();
  }

  function handleDeleteSection(sec: CustomSection) {
    const doDelete = () => {
      onChange(sections.filter((s) => s.id !== sec.id));
      handleCloseEditor();
    };

    if (onRequestDelete) {
      onRequestDelete(sec.title || "Custom section", doDelete);
    } else {
      doDelete();
    }
  }

  if (activeSection) {
    return (
      <CustomSectionDetailEditorPage
        section={activeSection}
        onSave={handleSaveSection}
        onCancel={handleCloseEditor}
        onDelete={!isNew ? handleDeleteSection : undefined}
      />
    );
  }

  return (
    <CustomSectionsCardList
      sections={sections}
      onSelectSection={handleSelectSection}
      onAddSection={handleStartNewSection}
      onChange={onChange}
      onRequestDelete={onRequestDelete}
    />
  );
}
