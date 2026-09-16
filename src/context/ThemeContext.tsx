import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { flushSync } from "react-dom";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export type ToggleThemeEvent =
  | ReactMouseEvent<HTMLElement>
  | { clientX: number; clientY: number; currentTarget?: HTMLElement | null; target?: EventTarget | null }
  | undefined;

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: (event?: ToggleThemeEvent) => void;
}

const STORAGE_KEY = "ppm_theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
  } catch {
    // Fallback if localStorage is unavailable
  }
  return "system";
}

function applyRootTheme(isDark: boolean) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  root.setAttribute("data-theme", isDark ? "dark" : "light");

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", isDark ? "#0c0d0e" : "#fbfbfa");
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme());
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme());

  // Listen to OS preference changes
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme;

  // Apply .dark class and update meta theme-color synchronously
  useEffect(() => {
    applyRootTheme(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Ignore localStorage write failures
    }
  }, []);

  const toggleTheme = useCallback(
    (event?: ToggleThemeEvent) => {
      const next: Theme = resolvedTheme === "dark" ? "light" : "dark";
      const isNextDark = next === "dark";

      const hasViewTransition =
        typeof document !== "undefined" &&
        "startViewTransition" in document &&
        typeof document.startViewTransition === "function" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!hasViewTransition || !event) {
        applyRootTheme(isNextDark);
        setTheme(next);
        return;
      }

      // Pin the ripple center to the exact center of the clicked button
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;

      if (event) {
        const rawTarget =
          ("currentTarget" in event && event.currentTarget) ||
          ("target" in event && event.target) ||
          null;
        const button =
          rawTarget instanceof HTMLElement
            ? rawTarget.closest("button") || rawTarget
            : null;

        if (button && typeof button.getBoundingClientRect === "function") {
          const rect = button.getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        } else if ("clientX" in event && typeof event.clientX === "number" && event.clientX > 0) {
          x = event.clientX;
          y = event.clientY;
        }
      }

      // Generous buffer to ensure the circle smoothly exits all 4 screen corners
      const endRadius = Math.ceil(
        Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y),
        ) + 80,
      );

      // Apply root DOM theme synchronously within transition callback
      const transition = document.startViewTransition(() => {
        applyRootTheme(isNextDark);
        flushSync(() => {
          setTheme(next);
        });
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        document.documentElement.animate(
          {
            clipPath,
          },
          {
            duration: 500,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      });
    },
    [resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
