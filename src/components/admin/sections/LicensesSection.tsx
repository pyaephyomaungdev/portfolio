import { useSearchParams } from "react-router-dom";
import { LicensesCardList } from "./licenses/LicensesCardList";
import { LicenseDetailEditorPage } from "./licenses/LicenseDetailEditorPage";
import type { License } from "../../../types/portfolio";

interface LicensesSectionProps {
  licenses: License[];
  onChange: (licenses: License[]) => void;
  onOpenAddModal?: () => void;
  onRequestDelete?: (title: string, onConfirm: () => void) => void;
}

export function LicensesSection({
  licenses,
  onChange,
  onOpenAddModal,
  onRequestDelete,
}: LicensesSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isNew = searchParams.get("new") === "true";

  const activeLicense = isNew
    ? {
        id: `lic-${Date.now()}`,
        name: "New Certification",
        issuer: "",
        issueDate: `${new Date().getFullYear()}`,
        expiryDate: null,
        credentialId: "",
        url: null,
      }
    : licenses.find((l) => l.id === editId) || null;

  function handleSelectLicense(id: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("edit", id);
      next.delete("new");
      return next;
    });
  }

  function handleStartNewLicense() {
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

  function handleSaveLicense(updated: License) {
    if (isNew) {
      onChange([...licenses, updated]);
    } else {
      onChange(licenses.map((l) => (l.id === updated.id ? updated : l)));
    }
    handleCloseEditor();
  }

  function handleDeleteLicense(lic: License) {
    const doDelete = () => {
      onChange(licenses.filter((l) => l.id !== lic.id));
      handleCloseEditor();
    };

    if (onRequestDelete) {
      onRequestDelete(lic.name || "Certification", doDelete);
    } else {
      doDelete();
    }
  }

  if (activeLicense) {
    return (
      <LicenseDetailEditorPage
        license={activeLicense}
        onSave={handleSaveLicense}
        onCancel={handleCloseEditor}
        onDelete={!isNew ? handleDeleteLicense : undefined}
      />
    );
  }

  return (
    <LicensesCardList
      licenses={licenses}
      onSelectLicense={handleSelectLicense}
      onAddLicense={handleStartNewLicense}
      onChange={onChange}
      onRequestDelete={onRequestDelete}
    />
  );
}
