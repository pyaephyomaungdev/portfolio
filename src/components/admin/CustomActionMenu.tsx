import { useState, useRef, useEffect, ReactNode } from "react";
import { MoreVertical } from "lucide-react";

export interface ActionMenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
  divider?: boolean;
}

export interface CustomActionMenuProps {
  items: ActionMenuItem[];
  trigger?: ReactNode;
  align?: "left" | "right";
  className?: string;
  "aria-label"?: string;
}

export function CustomActionMenu({
  items,
  trigger,
  align = "right",
  className = "",
  "aria-label": ariaLabel = "Action menu",
}: CustomActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div
      ref={menuRef}
      className={`relative inline-block ${className}`}
      onKeyDown={handleKeyDown}
    >
      {trigger ? (
        <div onClick={() => setIsOpen((prev) => !prev)}>{trigger}</div>
      ) : (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-label={ariaLabel}
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-1.5 rounded-lg border border-rule bg-paper text-muted hover:text-ink hover:border-ink/40 transition cursor-pointer shadow-2xs"
        >
          <MoreVertical className="size-3.5" aria-hidden="true" />
        </button>
      )}

      {isOpen && (
        <div
          role="menu"
          className={`absolute top-full mt-1 z-50 min-w-40 rounded-xl border border-rule bg-paper p-1 shadow-xl space-y-0.5 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item, idx) => (
            <div key={idx}>
              {item.divider && <div className="my-1 border-t border-rule" />}
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono text-left transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  item.variant === "destructive"
                    ? "text-destructive hover:bg-destructive-soft hover:text-destructive"
                    : "text-ink hover:bg-soft"
                }`}
              >
                {item.icon && (
                  <span className="shrink-0 size-3.5 flex items-center justify-center">
                    {item.icon}
                  </span>
                )}
                <span className="truncate">{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
