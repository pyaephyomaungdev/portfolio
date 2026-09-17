import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { flushSync } from "react-dom";

import { applyThemeConfig } from "../lib/theme";
import { initialPortfolioData } from "../data/portfolioData";
import type { ThemeConfig } from "../types/portfolio";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export type ToggleThemeEvent =
  | ReactMouseEvent<HTMLElement>
  | { clientX: number; clientY: number; currentTarget?: HTMLElement | null; target?: EventTarget | null }
  | undefined;

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  themeConfig: ThemeConfig;
  setTheme: (theme: Theme) => void;
  toggleTheme: (event?: ToggleThemeEvent) => void;
  setThemeConfig: (config: ThemeConfig) => void;
}

const STORAGE_KEY = "ppm_theme";
const CONFIG_STORAGE_KEY = "ppm_theme_config";

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
  return initialPortfolioData.themeConfig?.defaultMode || "system";
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
  const [themeConfig, setThemeConfigState] = useState<ThemeConfig>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved) as ThemeConfig;
        }
      } catch {
        // Fallback
      }
    }
    return initialPortfolioData.themeConfig || {};
  });

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

  // Synchronously apply accent colors, typography pairings, and border radius whenever themeConfig or resolvedTheme changes
  useEffect(() => {
    applyThemeConfig(themeConfig, resolvedTheme === "dark");
  }, [themeConfig, resolvedTheme]);

  // Listen to cross-tab storage updates
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === CONFIG_STORAGE_KEY && e.newValue) {
        try {
          setThemeConfigState(JSON.parse(e.newValue) as ThemeConfig);
        } catch {
          // Ignore
        }
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Ignore localStorage write failures
    }
  }, []);

  const setThemeConfig = useCallback((newConfig: ThemeConfig) => {
    setThemeConfigState(newConfig);
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
    } catch {
      // Ignore
    }
  }, []);

  const isTransitioningRef = useRef(false);

  const toggleTheme = useCallback(
    (event?: ToggleThemeEvent) => {
      if (isTransitioningRef.current) return;

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

      // Determine center point of the clicked button
      let x: number | null = null;
      let y: number | null = null;

      if (event) {
        const rawTarget =
          ("currentTarget" in event && event.currentTarget) ||
          ("target" in event && event.target) ||
          null;
        const elem = rawTarget instanceof Element ? rawTarget : null;
        const btn = elem?.closest("button") || (elem?.tagName === "BUTTON" ? (elem as HTMLElement) : null);

        if (btn && typeof btn.getBoundingClientRect === "function") {
          const rect = btn.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
          }
        }

        if ((x === null || y === null) && "clientX" in event && typeof event.clientX === "number" && event.clientX > 0) {
          x = event.clientX;
          y = typeof event.clientY === "number" && event.clientY > 0 ? event.clientY : 28;
        }
      }

      // Priority 2: Query the DOM for visible theme button
      if (x === null || y === null || x <= 0) {
        if (typeof document !== "undefined") {
          const visibleBtn = Array.from(
            document.querySelectorAll<HTMLElement>('button[aria-label*="Switch to"], button[aria-label*="theme"]')
          ).find((b) => b.offsetWidth > 0 && b.offsetHeight > 0);

          if (visibleBtn) {
            const rect = visibleBtn.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              x = rect.left + rect.width / 2;
              y = rect.top + rect.height / 2;
            }
          }
        }
      }

      // Priority 3: Absolute fallback — always top-right header coordinates
      const finalX =
        x !== null && x > 0
          ? x
          : typeof window !== "undefined"
            ? window.innerWidth - 44
            : 320;
      const finalY = y !== null && y > 0 ? y : 28;

      // Generous buffer to ensure the circle smoothly exits all 4 screen corners
      const endRadius = Math.ceil(
        Math.hypot(
          Math.max(finalX, window.innerWidth - finalX),
          Math.max(finalY, window.innerHeight - finalY),
        ) + 60,
      );

      // Set CSS variables synchronously before starting the view transition
      document.documentElement.style.setProperty("--vt-x", `${finalX}px`);
      document.documentElement.style.setProperty("--vt-y", `${finalY}px`);
      document.documentElement.style.setProperty("--vt-radius", `${endRadius}px`);

      isTransitioningRef.current = true;

      // Apply root DOM theme synchronously within transition callback
      const transition = document.startViewTransition(() => {
        applyRootTheme(isNextDark);
        flushSync(() => {
          setTheme(next);
        });
      });

      transition.finished
        .catch(() => {})
        .finally(() => {
          isTransitioningRef.current = false;
        });
    },
    [resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, themeConfig, setTheme, toggleTheme, setThemeConfig }}
    >
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
