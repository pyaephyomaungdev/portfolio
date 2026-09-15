import { useEffect, useState } from "react";

// In-memory cache for GitHub star counts
const starCache: Record<string, { stars: number; timestamp: number }> = {};
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

export function parseGitHubRepo(repoUrl: string | null | undefined): { owner: string; repo: string } | null {
  if (!repoUrl) return null;
  try {
    const url = new URL(repoUrl);
    if (!url.hostname.includes("github.com")) return null;
    const parts = url.pathname.replace(/^\//, "").replace(/\.git$/, "").split("/");
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return { owner: parts[0], repo: parts[1] };
    }
  } catch {
    return null;
  }
  return null;
}

export async function fetchRepoStars(repoUrl: string | null | undefined): Promise<number | null> {
  const parsed = parseGitHubRepo(repoUrl);
  if (!parsed) return null;

  const key = `${parsed.owner}/${parsed.repo}`;
  const cached = starCache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.stars;
  }

  // Check sessionStorage if available
  try {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem(`gh_stars_${key}`) : null;
    if (stored) {
      const { stars, timestamp } = JSON.parse(stored);
      if (Date.now() - timestamp < CACHE_TTL_MS) {
        starCache[key] = { stars, timestamp };
        return stars;
      }
    }
  } catch {
    // Ignore storage errors
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`);
    if (res.ok) {
      const data = await res.json();
      const count = typeof data.stargazers_count === "number" ? data.stargazers_count : null;
      if (count !== null) {
        starCache[key] = { stars: count, timestamp: Date.now() };
        try {
          sessionStorage.setItem(
            `gh_stars_${key}`,
            JSON.stringify({ stars: count, timestamp: Date.now() })
          );
        } catch {
          // Ignore storage quota
        }
        return count;
      }
    }
  } catch {
    // Network or offline
  }

  return cached ? cached.stars : null;
}

export function useRepoStars(repoUrl: string | null | undefined): number | null {
  const [stars, setStars] = useState<number | null>(() => {
    const parsed = parseGitHubRepo(repoUrl);
    if (!parsed) return null;
    return starCache[`${parsed.owner}/${parsed.repo}`]?.stars ?? null;
  });

  useEffect(() => {
    if (!repoUrl) {
      setStars(null);
      return;
    }
    let active = true;
    void fetchRepoStars(repoUrl).then((count) => {
      if (active && count !== null) {
        setStars(count);
      }
    });
    return () => {
      active = false;
    };
  }, [repoUrl]);

  return stars;
}
