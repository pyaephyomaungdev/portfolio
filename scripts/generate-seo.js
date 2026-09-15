#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

export function generateSeo() {
  const dataPath = path.join(rootDir, "src/data/portfolio.json");
  const indexPath = path.join(rootDir, "index.html");
  const sitemapPath = path.join(rootDir, "public/sitemap.xml");
  const robotsPath = path.join(rootDir, "public/robots.txt");

  if (!fs.existsSync(dataPath)) {
    console.warn("[generate-seo] portfolio.json not found, skipping.");
    return;
  }

  const portfolio = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const profile = portfolio.profile || {};
  const projects = portfolio.projects || [];

  const name = profile.name || "Pyae Phyo Maung";
  const headline = profile.headline || "Software Engineer & Full-Stack Developer";
  const bio =
    profile.bio ||
    "Full-stack software engineer building reliable web platforms, local-first tools, and scalable systems across Thailand and remote teams.";
  const siteUrl = "https://pyaephyomaung.dev";
  const avatarUrl = `${siteUrl}/avatar.jpg`;
  const githubUrl = profile.githubUrl || "https://github.com/pyaephyomaungdev";
  const linkedinUrl = "https://www.linkedin.com/in/pyae-phyo-maung-052445217/";

  const title = `${name} — ${headline}`;

  // 1. Generate Sitemap
  const today = new Date().toISOString().split("T")[0];
  const sitemapUrls = [
    `  <url>\n    <loc>${siteUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>`
  ];

  for (const proj of projects) {
    if (proj.slug) {
      sitemapUrls.push(
        `  <url>\n    <loc>${siteUrl}/projects/${proj.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
      );
    }
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join(
    "\n"
  )}\n</urlset>\n`;
  fs.writeFileSync(sitemapPath, sitemapXml, "utf8");

  // 2. Generate robots.txt
  const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
  fs.writeFileSync(robotsPath, robotsTxt, "utf8");

  // 3. Update index.html meta tags and JSON-LD
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, "utf8");

    // Title
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    html = html.replace(
      /<meta name="title" content=".*?" \/>/,
      `<meta name="title" content="${title}" />`
    );
    html = html.replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/>/s,
      `<meta\n      name="description"\n      content="${bio.replace(/"/g, "&quot;")}"\n    />`
    );
    html = html.replace(
      /<meta name="author" content=".*?" \/>/,
      `<meta name="author" content="${name}" />`
    );

    // OpenGraph
    html = html.replace(
      /<meta property="og:title" content=".*?" \/>/,
      `<meta property="og:title" content="${title}" />`
    );
    html = html.replace(
      /<meta\s+property="og:description"\s+content=".*?"\s*\/>/s,
      `<meta\n      property="og:description"\n      content="${bio.replace(/"/g, "&quot;")}"\n    />`
    );

    // Twitter
    html = html.replace(
      /<meta name="twitter:title" content=".*?" \/>/,
      `<meta name="twitter:title" content="${title}" />`
    );
    html = html.replace(
      /<meta\s+name="twitter:description"\s+content=".*?"\s*\/>/s,
      `<meta\n      name="twitter:description"\n      content="${bio.replace(/"/g, "&quot;")}"\n    />`
    );

    // JSON-LD
    const jsonLdData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": `${siteUrl}/#person`,
          name: name,
          url: siteUrl,
          image: avatarUrl,
          jobTitle: headline,
          sameAs: [githubUrl, linkedinUrl].filter(Boolean)
        },
        {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          url: siteUrl,
          name: `${name} Portfolio`,
          publisher: {
            "@id": `${siteUrl}/#person`
          }
        }
      ]
    };

    const formattedJson = JSON.stringify(jsonLdData, null, 2)
      .split("\n")
      .map((l) => `      ${l}`)
      .join("\n");
    const newJsonLd = `<script type="application/ld+json">\n${formattedJson}\n    </script>`;

    const jsonLdRegex = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;
    html = html.replace(jsonLdRegex, newJsonLd);

    fs.writeFileSync(indexPath, html, "utf8");
  }

  console.log(`[generate-seo] SEO generated for "${name}" (${projects.length} project pages in sitemap)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSeo();
}
