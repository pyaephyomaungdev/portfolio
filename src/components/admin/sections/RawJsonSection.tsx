import { useRef } from "react";
import { Check, AlertCircle, Download, Upload } from "lucide-react";

interface RawJsonSectionProps {
  jsonText: string;
  jsonError: string | null;
  onChange: (text: string) => void;
  onExport?: () => void;
  onImport?: (file: File) => void;
}

export function RawJsonSection({ 
  jsonText, 
  jsonError, 
  onChange,
  onExport,
  onImport,
}: RawJsonSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && onImport) {
      onImport(file);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-rule">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">
            Admin · Raw JSON Core
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Raw Portfolio JSON
          </h2>
          <p className="text-sm text-muted mt-1">
            Direct low-level JSON editor with instant schema synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onImport && (
            <>
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
                className="inline-flex items-center gap-1.5 rounded-xl border border-rule bg-paper px-3 py-2 text-xs font-mono text-muted hover:text-ink hover:border-ink/40 transition-colors shadow-2xs cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Import JSON</span>
              </button>
            </>
          )}

          {onExport && (
            <button
              type="button"
              onClick={onExport}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rule bg-paper px-3 py-2 text-xs font-mono text-muted hover:text-ink hover:border-ink/40 transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export JSON</span>
            </button>
          )}

          {jsonError ? (
            <span className="text-xs font-mono text-destructive flex items-center gap-1 ml-2">
              <AlertCircle className="h-3.5 w-3.5" /> Syntax Error
            </span>
          ) : (
            <span className="text-xs font-mono text-success flex items-center gap-1 ml-2">
              <Check className="h-3.5 w-3.5" /> Valid JSON
            </span>
          )}
        </div>
      </div>

      {jsonError && (
        <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
          {jsonError}
        </div>
      )}

      <textarea
        rows={24}
        value={jsonText}
        onChange={(e) => onChange(e.target.value)}
        className="w-full font-mono text-xs p-4 rounded-xl border border-rule bg-paper outline-none focus:border-ink resize-y leading-relaxed"
        spellCheck={false}
      />
    </div>
  );
}
