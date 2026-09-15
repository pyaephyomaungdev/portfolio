import { ArrowUp, ArrowDown } from "lucide-react";

export function reorderArray<T>(items: T[], index: number, direction: "up" | "down"): T[] {
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(index, 1);
  next.splice(targetIndex, 0, moved);
  return next;
}

interface ReorderButtonsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  size?: "sm" | "md";
}

export function ReorderButtons({
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  size = "md",
}: ReorderButtonsProps) {
  const isSm = size === "sm";

  return (
    <div className="inline-flex items-center rounded border border-rule bg-white shrink-0 shadow-2xs">
      <button
        type="button"
        disabled={!canMoveUp}
        onClick={onMoveUp}
        title="Move Up"
        aria-label="Move Up"
        className={`${
          isSm ? "p-0.5" : "p-1"
        } text-muted hover:text-ink disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition`}
      >
        <ArrowUp className={isSm ? "h-2.5 w-2.5" : "h-3 w-3"} />
      </button>
      <button
        type="button"
        disabled={!canMoveDown}
        onClick={onMoveDown}
        title="Move Down"
        aria-label="Move Down"
        className={`${
          isSm ? "p-0.5" : "p-1"
        } text-muted hover:text-ink disabled:opacity-30 border-l border-rule cursor-pointer disabled:cursor-not-allowed transition`}
      >
        <ArrowDown className={isSm ? "h-2.5 w-2.5" : "h-3 w-3"} />
      </button>
    </div>
  );
}
