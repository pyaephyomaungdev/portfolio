import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative inline-flex items-center gap-2 rounded-lg border border-rule bg-white p-2 text-muted shadow-2xs hover:border-ink/40 hover:text-ink active:scale-95 transition-all duration-150 ease-out cursor-pointer select-none ${className}`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className="relative flex h-4 w-4 items-center justify-center overflow-hidden">
        <Sun
          className={`h-4 w-4 transform transition-all duration-300 ${
            isDark
              ? "rotate-0 scale-100 opacity-100 text-accent drop-shadow-sm"
              : "-rotate-90 scale-0 opacity-0 text-muted"
          }`}
          style={{
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          aria-hidden="true"
        />
        <Moon
          className={`absolute h-4 w-4 transform transition-all duration-300 ${
            isDark
              ? "rotate-90 scale-0 opacity-0 text-muted"
              : "rotate-0 scale-100 opacity-100 text-ink"
          }`}
          style={{
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          aria-hidden="true"
        />
      </span>
      {showLabel && (
        <span className="font-mono text-xs uppercase tracking-wider">
          {isDark ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}
