import type { ThemeConfig } from "../types/portfolio";

export function getContrastForeground(hexColor: string): string {
  if (!hexColor) return "#ffffff";
  const hex = hexColor.replace("#", "");
  let r = 0;
  let g = 0;
  let b = 0;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    return "#ffffff";
  }
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 145 ? "#111111" : "#ffffff";
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const r = parseInt(c.substring(0, 2) || "0", 16) / 255;
  const g = parseInt(c.substring(2, 4) || "0", 16) / 255;
  const b = parseInt(c.substring(4, 6) || "0", 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const toHex = (x: number) =>
  Math.round(x * 255)
    .toString(16)
    .padStart(2, "0");

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

export function getSuggestedAccent(primaryHex: string): { light: string; dark: string } {
  if (!primaryHex) return { light: "#f54e00", dark: "#ff5c1a" };
  const hsl = hexToHsl(primaryHex);

  // If neutral or near monochrome (slate / dark ink / white), suggest classic Swiss Signal Orange
  if (hsl.s < 18 || hsl.l < 14 || hsl.l > 88) {
    return { light: "#f54e00", dark: "#ff5c1a" };
  }

  // Complementary or warm contrast hue
  const targetHue = (hsl.h + 180) % 360;
  const lightHex = hslToHex(targetHue, Math.max(hsl.s, 85), 48);
  const darkHex = hslToHex(targetHue, Math.max(hsl.s, 88), 62);
  return { light: lightHex, dark: darkHex };
}

export function applyThemeConfig(config?: ThemeConfig, isDark = false) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (!config) {
    // Reset to defaults
    root.style.removeProperty("--primary");
    root.style.removeProperty("--primary-fg");
    root.style.removeProperty("--accent");
    root.style.removeProperty("--accent-soft");
    root.style.removeProperty("--heatmap-0");
    root.style.removeProperty("--heatmap-1");
    root.style.removeProperty("--heatmap-2");
    root.style.removeProperty("--heatmap-3");
    root.style.removeProperty("--heatmap-4");
    root.style.removeProperty("--display");
    root.removeAttribute("data-radius");
    return;
  }

  // Primary Button Color
  const primary = isDark
    ? config.primaryColorDark || config.primaryColor || (config.accentColorDark || config.accentColor || "#f4f4f2")
    : config.primaryColor || (config.accentColor || "#1a1a1a");

  root.style.setProperty("--primary", primary);
  root.style.setProperty("--primary-fg", getContrastForeground(primary));

  // Accent Color
  const accent = isDark
    ? config.accentColorDark || config.accentColor || "#ff5c1a"
    : config.accentColor || "#f54e00";

  root.style.setProperty("--accent", accent);

  // Soft accent (using CSS color-mix or rgba)
  root.style.setProperty(
    "--accent-soft",
    isDark
      ? `color-mix(in srgb, ${accent} 18%, #15161a)`
      : `color-mix(in srgb, ${accent} 12%, #ffffff)`
  );

  // Heatmap cell tints — levels 0–4 derived from primary color so the
  // contribution grid always matches the primary theme color.
  const bg = isDark ? "#0c0d0e" : "#f4f4f2";
  root.style.setProperty("--heatmap-0", `color-mix(in srgb, ${primary}  7%, ${bg})`);
  root.style.setProperty("--heatmap-1", `color-mix(in srgb, ${primary} 22%, ${bg})`);
  root.style.setProperty("--heatmap-2", `color-mix(in srgb, ${primary} 45%, ${bg})`);
  root.style.setProperty("--heatmap-3", `color-mix(in srgb, ${primary} 70%, ${bg})`);
  root.style.setProperty("--heatmap-4", primary);

  // Typography Pairing
  if (config.fontPairing === "modern") {
    root.style.setProperty("--display", '"DM Sans", system-ui, sans-serif');
  } else if (config.fontPairing === "technical") {
    root.style.setProperty("--display", "ui-monospace, SFMono-Regular, monospace");
  } else {
    root.style.setProperty("--display", '"Instrument Serif", Georgia, serif');
  }

  // Radius Style
  if (config.radiusStyle) {
    root.setAttribute("data-radius", config.radiusStyle);
  } else {
    root.removeAttribute("data-radius");
  }
}
