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

      // Helper to read gitignored .env.local secrets
      function getTelegramSecrets() {
        let botToken = process.env.TELEGRAM_BOT_TOKEN || "";
        let chatId = process.env.TELEGRAM_CHAT_ID || "";

        const envLocalPath = path.resolve(process.cwd(), ".env.local");
        if (fs.existsSync(envLocalPath)) {
          const content = fs.readFileSync(envLocalPath, "utf8");
          for (const line of content.split("\n")) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;
            const [key, ...valParts] = trimmed.split("=");
            const val = valParts.join("=").trim().replace(/^["']|["']$/g, "");
            if (key?.trim() === "TELEGRAM_BOT_TOKEN") botToken = val;
            if (key?.trim() === "TELEGRAM_CHAT_ID") chatId = val;
          }
        }
        return { botToken, chatId };
      }

      function saveTelegramSecrets(token: string, chat: string) {
        const envLocalPath = path.resolve(process.cwd(), ".env.local");
        let existing = "";
        if (fs.existsSync(envLocalPath)) {
          existing = fs.readFileSync(envLocalPath, "utf8");
        }

        const lines = existing.split("\n").filter((l) => {
          const k = l.split("=")[0]?.trim();
          return k !== "TELEGRAM_BOT_TOKEN" && k !== "TELEGRAM_CHAT_ID";
        });

        if (token) lines.push(`TELEGRAM_BOT_TOKEN=${token}`);
        if (chat) lines.push(`TELEGRAM_CHAT_ID=${chat}`);

        fs.writeFileSync(envLocalPath, lines.filter(Boolean).join("\n") + "\n", "utf8");
      }

      // Public endpoint for submitting contact notes securely
      server.middlewares.use("/api/send-note", (req, res) => {
        if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", async () => {
            try {
              const { name, email, message, hp_trap } = JSON.parse(body || "{}");

              // Honeypot spam trap
              if (hp_trap && hp_trap.trim() !== "") {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ success: true }));
                return;
              }

              if (!message || !message.trim()) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Message is required" }));
                return;
              }

              const { botToken, chatId } = getTelegramSecrets();
              if (!botToken || !chatId) {
                res.statusCode = 503;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Telegram Bot not configured in .env.local" }));
                return;
              }

              const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
              const escapeHtml = (s: string) =>
                s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
              const safeName = escapeHtml(name?.trim() || "Anonymous");
              const safeEmail = escapeHtml(email?.trim() || "N/A");
              const safeMessage = escapeHtml(message.trim());
              const safeTime = escapeHtml(`${timestamp} (UTC+7)`);

              const formattedHtml = `📬 <b>New Project Note from Portfolio</b>\n\n👤 <b>From:</b> ${safeName}\n📧 <b>Email:</b> ${safeEmail}\n\n💬 <b>Message:</b>\n${safeMessage}\n\n---\n⏰ <i>Time: ${safeTime}</i>`;

              const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chat_id: chatId,
                  text: formattedHtml,
                  parse_mode: "HTML",
                }),
              });

              if (tgRes.ok) {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ success: true }));
              } else {
                const tgErr = await tgRes.text().catch(() => "");
                console.error("[dev-admin] Telegram API error:", tgErr);
                res.statusCode = 502;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Failed to dispatch note to Telegram API. Please use direct email." }));
              }
            } catch (err: unknown) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }));
            }
          });
          return;
        }
        res.statusCode = 405;
        res.end("Method Not Allowed");
      });

      // Admin endpoint to read / write Telegram secrets securely in .env.local
      server.middlewares.use("/api/admin/telegram-config", (req, res) => {
        if (req.method === "GET") {
          const { botToken, chatId } = getTelegramSecrets();
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              configured: Boolean(botToken && chatId),
              hasToken: Boolean(botToken),
              chatId: chatId || "",
            })
          );
          return;
        }

        if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", () => {
            try {
              const { botToken, chatId } = JSON.parse(body || "{}");
              const current = getTelegramSecrets();
              const finalToken = botToken !== undefined ? botToken.trim() : current.botToken;
              const finalChat = chatId !== undefined ? chatId.trim() : current.chatId;

              saveTelegramSecrets(finalToken, finalChat);

              // Update telegramConfigured in portfolio.json
              try {
                const data = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
                data.profile.telegramConfigured = Boolean(finalToken && finalChat);
                fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2) + "\n", "utf8");
              } catch (e) {
                console.warn("[admin-api] Error updating telegramConfigured in portfolio.json:", e);
              }

              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  success: true,
                  configured: Boolean(finalToken && finalChat),
                  chatId: finalChat,
                })
              );
            } catch {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Invalid payload" }));
            }
          });
          return;
        }

        res.statusCode = 405;
        res.end("Method Not Allowed");
      });

      // Admin endpoint to send test ping securely from server
      server.middlewares.use("/api/admin/telegram-test", (req, res) => {
        if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", async () => {
            try {
              const { botToken, chatId } = JSON.parse(body || "{}");
              const current = getTelegramSecrets();
              const useToken = botToken?.trim() || current.botToken;
              const useChat = chatId?.trim() || current.chatId;

              if (!useToken || !useChat) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Missing Bot Token or Chat ID" }));
                return;
              }

              const tgRes = await fetch(`https://api.telegram.org/bot${useToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chat_id: useChat,
                  text: `🔔 *Test Ping from Portfolio Admin*\n\n✅ Telegram Bot is connected and ready to receive inquiries!\n\n_Sent at ${new Date().toLocaleTimeString()}._`,
                  parse_mode: "Markdown",
                }),
              });

              if (tgRes.ok) {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ success: true }));
              } else {
                const tgErr = await tgRes.json().catch(() => ({})) as { description?: string };
                res.statusCode = 502;
                res.setHeader("Content-Type", "application/json");
                let errMsg = tgErr.description || "Failed to send test ping";
                if (errMsg.toLowerCase().includes("chat not found")) {
                  errMsg = "Bad Request: chat not found — Telegram Bot ထဲသို့ဝင်၍ 'Start' (/start) အရင်နှိပ်ထားပေးပါ။";
                }
                res.end(JSON.stringify({ error: errMsg }));
              }
            } catch (err: unknown) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: err instanceof Error ? err.message : "Network error" }));
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
