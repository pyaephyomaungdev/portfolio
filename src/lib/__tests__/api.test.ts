import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchPortfolio, fetchProject, fetchContributions } from "../api";
import { initialPortfolioData } from "../../data/portfolioData";

describe("Client API routines", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetchPortfolio returns static dataset fallback", async () => {
    const portfolio = await fetchPortfolio();
    expect(portfolio).toBeDefined();
    expect(portfolio.profile?.name).toBe(initialPortfolioData.profile?.name);
  });

  it("fetchProject finds project by valid slug", async () => {
    const sampleSlug = initialPortfolioData.projects[0]?.slug;
    expect(sampleSlug).toBeTruthy();

    if (sampleSlug) {
      const project = await fetchProject(sampleSlug);
      expect(project).toBeDefined();
      expect(project.slug).toBe(sampleSlug);
    }
  });

  it("fetchProject throws error for invalid slug", async () => {
    await expect(fetchProject("invalid-non-existent-slug-xyz")).rejects.toThrow("Project not found");
  });

  it("fetchContributions returns empty fallback on network error", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network offline"));

    const result = await fetchContributions(2026, "testuser");
    expect(result.year).toBe(2026);
    expect(result.total).toBe(0);
    expect(result.days).toEqual([]);
    expect(result.source).toBe("empty");
  });
});
