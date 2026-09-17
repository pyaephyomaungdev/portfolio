import { useState, useRef, useEffect, useId } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
  badge?: string;
}

export interface CustomSelectProps {
  value?: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  disabled = false,
  className = "",
  id,
  "aria-label": ariaLabel,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const selectId = id || generatedId;

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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
    if (disabled) return;

    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      if (!isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    }
  }

  function handleSelect(optValue: string) {
    onChange(optValue);
    setIsOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-full ${className}`}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        id={selectId}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel || placeholder}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 rounded-lg border border-rule bg-soft/40 px-3 py-1.5 text-xs font-mono text-ink outline-none transition cursor-pointer hover:border-ink/40 focus:border-ink shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed ${
          isOpen ? "border-ink ring-1 ring-ink/10" : ""
        }`}
      >
        <span className="truncate text-left font-medium">
          {selectedOption ? selectedOption.label : <span className="text-muted">{placeholder}</span>}
        </span>
        <ChevronDown
          className={`size-3.5 text-muted shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-ink" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-labelledby={selectId}
          className="absolute left-0 top-full mt-1 z-50 w-full min-w-36 max-h-56 overflow-y-auto rounded-xl border border-rule bg-paper p-1 shadow-lg space-y-0.5"
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-xs font-mono text-muted text-center">
              No options available
            </div>
          ) : (
            options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-left cursor-pointer ${
                    isSelected
                      ? "bg-soft font-semibold text-ink"
                      : "text-muted hover:text-ink hover:bg-soft/70"
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="truncate">{option.label}</span>
                    {option.badge && (
                      <span className="px-1.5 py-0.5 rounded border border-rule bg-paper text-xs text-muted">
                        {option.badge}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="size-3 text-accent shrink-0" aria-hidden="true" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
