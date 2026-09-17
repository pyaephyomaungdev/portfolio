import { describe, it, expect } from "vitest";
import { extractGitHubUsername } from "../../components/ContributionHeatmap";
import { initialPortfolioData } from "../../data/portfolioData";

describe("extractGitHubUsername", () => {
  it("extracts username from standard github profile URL", () => {
    expect(extractGitHubUsername("https://github.com/pyaephyomaungdev")).toBe("pyaephyomaungdev");
  });

  it("extracts username from URL with trailing slashes", () => {
    expect(extractGitHubUsername("https://github.com/pyaephyomaungdev///")).toBe("pyaephyomaungdev");
  });

  it("handles @ handle format", () => {
    expect(extractGitHubUsername("@pyaephyomaungdev")).toBe("pyaephyomaungdev");
  });

  it("handles bare username", () => {
    expect(extractGitHubUsername("pyaephyomaungdev")).toBe("pyaephyomaungdev");
  });

  it("returns undefined for empty, null, or undefined values", () => {
    expect(extractGitHubUsername("")).toBeUndefined();
    expect(extractGitHubUsername("   ")).toBeUndefined();
    expect(extractGitHubUsername(null)).toBeUndefined();
    expect(extractGitHubUsername(undefined)).toBeUndefined();
  });
});

describe("Portfolio Data Integrity", () => {
  it("has valid profile configuration", () => {
    const { profile } = initialPortfolioData;
    expect(profile).toBeDefined();
    expect(profile?.name).toBeTruthy();
    expect(profile?.emailPublic).toBeTruthy();
  });

  it("has unique project slugs", () => {
    const { projects } = initialPortfolioData;
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);

    const slugs = projects.map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("every project has required metadata fields", () => {
    for (const p of initialPortfolioData.projects) {
      expect(p.id).toBeTruthy();
      expect(p.slug).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.summary).toBeTruthy();
      expect(Array.isArray(p.categories)).toBe(true);
      expect(p.categories?.length).toBeGreaterThan(0);
    }
  });
});
