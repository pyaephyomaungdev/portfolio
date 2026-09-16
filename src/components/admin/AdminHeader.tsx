import { useRef } from "react";
import { 
  Save, 
  RotateCcw, 
  Eye, 
  Check, 
  AlertCircle, 
  Download, 
  Upload 
} from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";

interface AdminHeaderProps {
  statusMessage: { type: "success" | "error"; text: string } | null;
  onRevert: () => void;
  onSave: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onExit?: () => void;
  isSaving: boolean;
  hasErrors: boolean;
  isDirty?: boolean;
}

export function AdminHeader({
  statusMessage,
  onRevert,
  onSave,
  onExport,
  onImport,
  onExit,
  isSaving,
  hasErrors,
  isDirty = false,
}: AdminHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      // Reset input value so the same file can be selected again if needed
      e.target.value = "";
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-white/95 backdrop-blur-md px-5 py-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="font-display text-2xl tracking-tight text-ink font-bold">
          Portfolio Admin
        </span>
        <span className="rounded bg-soft px-2 py-0.5 text-xs font-mono text-muted border border-rule">
          Local CMS
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {statusMessage && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono ${
              statusMessage.type === "success"
                ? "bg-success-soft text-success border border-success/30"
                : "bg-destructive-soft text-destructive border border-destructive/30"
            }`}
          >
            {statusMessage.type === "success" ? (
              <Check className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Hidden File Input for JSON Import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Import portfolio data from a JSON file"
          className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-2.5 py-1.5 text-xs font-mono text-muted hover:text-ink hover:border-ink/40 transition-colors shadow-2xs cursor-pointer"
        >
          <Upload className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Import</span>
        </button>

        <button
          type="button"
          onClick={onExport}
          title="Export portfolio data to a JSON backup"
          className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-2.5 py-1.5 text-xs font-mono text-muted hover:text-ink hover:border-ink/40 transition-colors shadow-2xs cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          type="button"
          onClick={onRevert}
          title="Reload fresh from disk"
          className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-2.5 py-1.5 text-xs font-mono text-muted hover:text-ink hover:border-ink/40 transition-colors shadow-2xs cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Revert</span>
        </button>

        <button
          type="button"
          onClick={onExit}
          title="Return to public portfolio site"
          className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-2.5 py-1.5 text-xs font-mono text-muted hover:text-ink hover:border-ink/40 transition-colors shadow-2xs cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Exit to Site</span>
        </button>

        <ThemeToggle className="px-2.5 py-1.5" />

        {isDirty && !statusMessage && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-accent-soft px-2 py-0.5 text-xs font-mono text-accent border border-accent/20">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span>Unsaved</span>
          </span>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || hasErrors}
          title="Save changes to disk (⌘S or Ctrl+S)"
          className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-mono transition cursor-pointer disabled:opacity-50 shadow-xs"
        >
          <Save className="h-3.5 w-3.5 shrink-0" />
          <span>{isSaving ? "Saving..." : "Save to Disk"}</span>
          <span className="hidden sm:inline rounded bg-paper/20 px-1 text-xs opacity-75">
            ⌘S
          </span>
        </button>
      </div>
    </header>
  );
}
