import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { generateSeo } from "./scripts/generate-seo.js";

function portfolioAdminPlugin(): Plugin {
  return {
    name: "portfolio-admin-api",
    configureServer(server) {
      const dataFilePath = path.resolve(process.cwd(), "src/data/portfolio.json");

      server.middlewares.use("/api/admin/portfolio", (req, res) => {
        if (req.method === "GET") {
          try {
            const data = fs.readFileSync(dataFilePath, "utf8");
            res.setHeader("Content-Type", "application/json");
            res.end(data);
          } catch {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Failed to read portfolio.json" }));
          }
          return;
        }

        if (req.method === "POST" || req.method === "PUT") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", () => {
            try {
              const parsed = JSON.parse(body);
              fs.writeFileSync(dataFilePath, JSON.stringify(parsed, null, 2) + "\n", "utf8");

              // Auto-generate SEO, sitemap, robots.txt, and index.html meta tags
              try {
                generateSeo();
              } catch (e) {
                console.warn("[admin-api] Error generating SEO:", e);
              }

              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: true, message: "Saved to src/data/portfolio.json" }));
            } catch {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Invalid JSON or write failure" }));
            }
          });
          return;
        }

        res.statusCode = 405;
        res.end("Method Not Allowed");
      });

      server.middlewares.use("/api/admin/upload-avatar", (req, res) => {
        if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", () => {
            try {
              const { dataUrl } = JSON.parse(body);
              if (!dataUrl) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Missing dataUrl" }));
                return;
              }
              const cleanBase64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
              const buffer = Buffer.from(cleanBase64, "base64");
              const avatarPath = path.resolve(process.cwd(), "public/avatar.jpg");
              fs.writeFileSync(avatarPath, buffer);

              // Automatically generate circular favicons and apple-touch-icon
              try {
                const scriptPath = path.resolve(process.cwd(), "scripts/generate-favicons.py");
                execSync(`python3 "${scriptPath}"`, { stdio: "ignore" });
              } catch {
                const faviconPath = path.resolve(process.cwd(), "public/favicon.png");
                fs.writeFileSync(faviconPath, buffer);
              }

              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: true, url: "/avatar.jpg" }));
            } catch {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Failed to upload avatar" }));
            }
          });
          return;
        }
        res.statusCode = 405;
        res.end("Method Not Allowed");
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), portfolioAdminPlugin()],
  server: { port: 5173 },
});
