import type { KeyboardEvent } from "react";
import { Check } from "lucide-react";

interface CheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
}: CheckboxProps) {
  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!disabled) {
        onChange(!checked);
      }
    }
  }

  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-2 select-none cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <button
        type="button"
        id={id}
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        onKeyDown={handleKeyDown}
        className={`h-4 w-4 rounded shrink-0 border transition-all flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ink/20 ${
          checked
            ? "border-ink bg-ink text-paper"
            : "border-rule bg-white hover:border-ink/50"
        }`}
      >
        {checked && <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />}
      </button>
      {label && <span className="text-xs text-ink">{label}</span>}
    </label>
  );
}
