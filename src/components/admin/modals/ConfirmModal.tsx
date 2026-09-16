import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  eyebrow?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "warning";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  eyebrow = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "destructive",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-md rounded-xl border border-rule bg-paper shadow-2xl overflow-hidden">
        {/* Precision drafting corner marks */}
        <span className="pointer-events-none absolute left-2.5 top-2.5 font-mono text-xs text-muted/40">+</span>
        <span className="pointer-events-none absolute right-2.5 top-2.5 font-mono text-xs text-muted/40">+</span>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-rule bg-white px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg border ${variant === "destructive"
                  ? "border-destructive/20 bg-destructive-soft text-destructive"
                  : "border-accent/20 bg-accent-soft text-accent"
                }`}
            >
              {variant === "destructive" ? (
                <Trash2 className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
            </div>
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-muted block">
                {eyebrow}
              </span>
              <h3 id="confirm-modal-title" className="font-display text-xl font-normal text-ink">
                {title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-muted hover:text-ink hover:bg-soft transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message Content */}
        <div className="p-5 text-sm text-muted leading-relaxed">
          <p>{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 border-t border-rule bg-white/70 px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-rule bg-white px-4 py-2 text-xs font-mono font-medium text-ink hover:border-ink transition cursor-pointer shadow-2xs"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-lg px-4 py-2 text-xs font-mono font-medium transition cursor-pointer shadow-xs ${variant === "destructive"
                ? "bg-destructive text-pure-white hover:bg-destructive/90"
                : "bg-ink text-paper hover:bg-ink/90"
              }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
