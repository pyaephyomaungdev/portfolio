import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("SEO & Sitemap Build Artifacts", () => {
  const rootDir = path.resolve(process.cwd());

  it("public/sitemap.xml exists and contains valid XML structure", () => {
    const sitemapPath = path.join(rootDir, "public/sitemap.xml");
    expect(fs.existsSync(sitemapPath)).toBe(true);

    const content = fs.readFileSync(sitemapPath, "utf8");
    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(content).toContain("<loc>https://pyaephyomaung.dev/</loc>");
    expect(content).toContain("<loc>https://pyaephyomaung.dev/projects/json-link</loc>");
    expect(content).toContain("<loc>https://pyaephyomaung.dev/privacy</loc>");
    expect(content).toContain("<loc>https://pyaephyomaung.dev/terms</loc>");
  });

  it("public/robots.txt allows indexing and references sitemap", () => {
    const robotsPath = path.join(rootDir, "public/robots.txt");
    expect(fs.existsSync(robotsPath)).toBe(true);

    const content = fs.readFileSync(robotsPath, "utf8");
    expect(content).toContain("User-agent: *");
    expect(content).toContain("Allow: /");
    expect(content).toContain("Sitemap: https://pyaephyomaung.dev/sitemap.xml");
  });

  it("index.html contains canonical, JSON-LD, and zero-FOUC theme script", () => {
    const indexPath = path.join(rootDir, "index.html");
    expect(fs.existsSync(indexPath)).toBe(true);

    const content = fs.readFileSync(indexPath, "utf8");
    expect(content).toContain('<link rel="canonical" href="https://pyaephyomaung.dev" />');
    expect(content).toContain('<script type="application/ld+json">');
    expect(content).toContain('"@context": "https://schema.org"');
    expect(content).toContain('localStorage.getItem("ppm_theme")');
  });
});
