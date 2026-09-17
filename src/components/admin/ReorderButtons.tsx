import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";

export function reorderArray<T>(items: T[], index: number, direction: "up" | "down"): T[] {
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(index, 1);
  next.splice(targetIndex, 0, moved);
  return next;
}

export interface ReorderButtonsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  size?: "sm" | "md";
  index?: number;
  variant?: "default" | "corner";
  className?: string;
  onDelete?: () => void;
  deleteTitle?: string;
}

export function ReorderButtons({
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  size = "md",
  index,
  variant = "default",
  className = "",
  onDelete,
  deleteTitle,
}: ReorderButtonsProps) {
  const isSm = size === "sm";

  if (variant === "corner") {
    return (
      <div
        className={`absolute -top-px -right-px flex items-center gap-1.5 rounded-tr-xl rounded-bl-xl border-b border-l border-rule bg-soft/80 px-2.5 py-1 text-xs font-mono text-muted shadow-2xs transition-colors group-hover:border-ink/30 z-10 ${className}`}
      >
        {index !== undefined ? (
          <span className="font-semibold text-ink select-none text-xs">
            #{index + 1}
          </span>
        ) : null}
        <div className="h-3 w-px bg-rule transition-colors group-hover:bg-ink/20" />
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            disabled={!canMoveUp}
            onClick={onMoveUp}
            title="Move Up"
            aria-label="Move Up"
            className="p-0.5 rounded text-muted hover:text-ink hover:bg-paper disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition"
          >
            <ArrowUp className="size-3" />
          </button>
          <button
            type="button"
            disabled={!canMoveDown}
            onClick={onMoveDown}
            title="Move Down"
            aria-label="Move Down"
            className="p-0.5 rounded text-muted hover:text-ink hover:bg-paper disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition"
          >
            <ArrowDown className="size-3" />
          </button>
        </div>
        {onDelete ? (
          <>
            <div className="h-3 w-px bg-rule transition-colors group-hover:bg-ink/20" />
            <button
              type="button"
              onClick={onDelete}
              title={deleteTitle || "Delete"}
              aria-label={deleteTitle || "Delete"}
              className="p-0.5 rounded text-muted hover:text-destructive hover:bg-destructive-soft cursor-pointer transition"
            >
              <Trash2 className="size-3" />
            </button>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-rule bg-soft/60 px-1.5 py-0.5 shrink-0 shadow-2xs gap-1 font-mono transition-colors hover:border-ink/20 ${className}`}
    >
      {index !== undefined ? (
        <span className="text-xs font-semibold text-muted/80 pl-0.5 pr-1 border-r border-rule select-none">
          #{index + 1}
        </span>
      ) : null}

      <div className="flex items-center gap-0.5">
        <button
          type="button"
          disabled={!canMoveUp}
          onClick={onMoveUp}
          title="Move Up"
          aria-label="Move Up"
          className={`${
            isSm ? "p-1" : "p-1.5"
          } rounded text-muted hover:text-ink hover:bg-paper disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition`}
        >
          <ArrowUp className={isSm ? "size-3" : "size-3.5"} />
        </button>
        <button
          type="button"
          disabled={!canMoveDown}
          onClick={onMoveDown}
          title="Move Down"
          aria-label="Move Down"
          className={`${
            isSm ? "p-1" : "p-1.5"
          } rounded text-muted hover:text-ink hover:bg-paper disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition`}
        >
          <ArrowDown className={isSm ? "size-3" : "size-3.5"} />
        </button>
      </div>

      {onDelete ? (
        <>
          <div className="h-3 w-px bg-rule" />
          <button
            type="button"
            onClick={onDelete}
            title={deleteTitle || "Delete"}
            aria-label={deleteTitle || "Delete"}
            className={`${
              isSm ? "p-1" : "p-1.5"
            } rounded text-muted hover:text-destructive hover:bg-destructive-soft cursor-pointer transition`}
          >
            <Trash2 className={isSm ? "size-3" : "size-3.5"} />
          </button>
        </>
      ) : null}
    </div>
  );
}
