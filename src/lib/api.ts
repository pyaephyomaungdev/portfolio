import { initialPortfolioData } from "../data/portfolioData";
import type {
  ContributionYear,
  CustomSection,
  CustomSectionItem,
  Portfolio,
  Project,
} from "../types/portfolio";

export * from "../types/portfolio";

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") || "";
const GITHUB_USERNAME = (import.meta.env.VITE_GITHUB_USERNAME as string | undefined) || "pyaephyomaungdev";

let inFlightPortfolioPromise: Promise<Portfolio> | null = null;

export function clearPortfolioCache(): void {
  inFlightPortfolioPromise = null;
}

export async function fetchPortfolio(): Promise<Portfolio> {
  if (inFlightPortfolioPromise) {
    return inFlightPortfolioPromise;
  }

  inFlightPortfolioPromise = (async () => {
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
  })().finally(() => {
    // Keep in cache briefly to coalesce simultaneous component mounts
    setTimeout(() => {
      inFlightPortfolioPromise = null;
    }, 300);
  });

  return inFlightPortfolioPromise;
}

export async function savePortfolioJson(data: Portfolio): Promise<{ success: boolean; message: string }> {
  inFlightPortfolioPromise = null;
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

export async function uploadAssetImage({
  dataUrl,
  fileName,
  folder,
}: {
  dataUrl: string;
  fileName: string;
  folder: string;
}): Promise<{ url: string; fileName: string; folder: string }> {
  const res = await fetch("/api/admin/upload-asset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataUrl, fileName, folder }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Asset upload failed" }));
    throw new Error(err.error || "Failed to upload asset");
  }
  return (await res.json()) as { url: string; fileName: string; folder: string };
}

export async function fetchProject(slug: string): Promise<Project> {
  const portfolio = await fetchPortfolio();
  const found = portfolio.projects?.find((p) => p.slug === slug);
  if (found) {
    return found;
  }
  throw new Error(`Project not found: ${slug}`);
}

export async function fetchCustomItem(
  sectionId: string,
  slug: string,
): Promise<{ section: CustomSection; item: CustomSectionItem }> {
  const portfolio = await fetchPortfolio();
  const section = portfolio.customSections?.find((s) => s.id === sectionId);
  if (!section) {
    throw new Error(`Custom section not found: ${sectionId}`);
  }
  const item = section.items?.find((it) => it.slug === slug);
  if (!item) {
    throw new Error(`Custom item not found: ${slug}`);
  }
  return { section, item };
}

const CONTRIB_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function fetchContributions(year: number, customUsername?: string): Promise<ContributionYear> {
  const username = customUsername || GITHUB_USERNAME;
  const cacheKey = `ppm_contrib_${username}_${year}`;

  // Check localStorage cache first to avoid 2s+ network roundtrips on repeat loads/audits
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const cached = JSON.parse(raw);
        if (
          cached &&
          typeof cached.timestamp === "number" &&
          Date.now() - cached.timestamp < CONTRIB_CACHE_TTL &&
          cached.data
        ) {
          return cached.data as ContributionYear;
        }
      }
    } catch {
      // Ignore localStorage read errors
    }
  }

  const saveCache = (data: ContributionYear) => {
    if (typeof window !== "undefined" && window.localStorage && data.days?.length > 0) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
      } catch {
        // Ignore localStorage quota errors
      }
    }
  };

  // If a custom API_BASE is configured, try it first
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/public/github/contributions?year=${year}&username=${encodeURIComponent(username)}`);
      if (res.ok) {
        const result = (await res.json()) as ContributionYear;
        saveCache(result);
        return result;
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
      const result: ContributionYear = {
        year,
        total,
        days: Array.isArray(json.contributions) ? json.contributions : [],
        source: "github",
        username,
      };
      saveCache(result);
      return result;
    }
  } catch {
    // Network or API offline
  }

  // Fallback to expired cache if network is offline
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const cached = JSON.parse(raw);
        if (cached?.data) {
          return cached.data as ContributionYear;
        }
      }
    } catch {
      // Ignore
    }
  }

  return {
    year,
    total: 0,
    days: [],
    source: "empty",
    username,
  };
}
