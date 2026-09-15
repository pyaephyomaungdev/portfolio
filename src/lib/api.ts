import { initialPortfolioData } from "../data/portfolioData";
import type {
  ContributionYear,
  Portfolio,
  Project,
} from "../types/portfolio";

export * from "../types/portfolio";

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") || "";
const GITHUB_USERNAME = (import.meta.env.VITE_GITHUB_USERNAME as string | undefined) || "pyaephyomaungdev";

export async function fetchPortfolio(): Promise<Portfolio> {
  // In dev environment, check local admin API first if available
  if (import.meta.env.DEV) {
    try {
      const res = await fetch("/api/admin/portfolio");
      if (res.ok) {
        return (await res.json()) as Portfolio;
      }
    } catch {
      // Fall through
    }
  }

  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/public/portfolio`, { credentials: "include" });
      if (res.ok) {
        return (await res.json()) as Portfolio;
      }
    } catch {
      // Fall through to static data on failure
    }
  }
  return initialPortfolioData;
}

export async function savePortfolioJson(data: Portfolio): Promise<{ success: boolean; message: string }> {
  const res = await fetch("/api/admin/portfolio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error || "Failed to save portfolio data");
  }
  return (await res.json()) as { success: boolean; message: string };
}

export async function uploadAvatarImage(dataUrl: string): Promise<string> {
  const res = await fetch("/api/admin/upload-avatar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataUrl }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(err.error || "Failed to upload avatar");
  }
  const result = (await res.json()) as { success: boolean; url: string };
  return result.url;
}

export async function fetchProject(slug: string): Promise<Project> {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/public/projects/${slug}`, { credentials: "include" });
      if (res.ok) {
        return (await res.json()) as Project;
      }
    } catch {
      // Fall through to static data
    }
  }

  const found = initialPortfolioData.projects.find((p) => p.slug === slug);
  if (found) {
    return found;
  }
  throw new Error(`Project not found: ${slug}`);
}

export async function fetchContributions(year: number, customUsername?: string): Promise<ContributionYear> {
  const username = customUsername || GITHUB_USERNAME;
  // If a custom API_BASE is configured, try it first
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/public/github/contributions?year=${year}&username=${encodeURIComponent(username)}`);
      if (res.ok) {
        return (await res.json()) as ContributionYear;
      }
    } catch {
      // Fall back to direct GitHub contribution endpoint
    }
  }

  // Fetch directly from public GitHub contributions API
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=${year}`,
    );
    if (res.ok) {
      const json = await res.json();
      const total =
        (typeof json.total === "number" ? json.total : json.total?.[String(year)]) || 0;
      return {
        year,
        total,
        days: Array.isArray(json.contributions) ? json.contributions : [],
        source: "github",
        username,
      };
    }
  } catch {
    // Network or API offline
  }

  return {
    year,
    total: 0,
    days: [],
    source: "empty",
    username,
  };
}
