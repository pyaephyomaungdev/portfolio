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

export async function fetchContributions(year: number): Promise<ContributionYear> {
  // If a custom API_BASE is configured, try it first
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/public/github/contributions?year=${year}`);
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
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=${year}`,
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
        username: GITHUB_USERNAME,
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
    username: GITHUB_USERNAME,
  };
}
