import { describe, it, expect, beforeEach } from "vitest";
import {
  isRateLimited,
  isAllowedOrigin,
  escapeHtml,
  ipRequestHistory,
  onRequestPost,
} from "../api/send-note";

describe("functions/api/send-note Cloudflare Endpoint", () => {
  beforeEach(() => {
    ipRequestHistory.clear();
  });

  describe("Origin validation", () => {
    it("allows valid portfolio domains and local dev", () => {
      expect(isAllowedOrigin("https://pyaephyomaung.dev")).toBe(true);
      expect(isAllowedOrigin("https://www.pyaephyomaung.dev")).toBe(true);
      expect(isAllowedOrigin("https://portfolio-preview.pages.dev")).toBe(true);
      expect(isAllowedOrigin("http://localhost:5173")).toBe(true);
      expect(isAllowedOrigin(null)).toBe(true);
    });

    it("allows any custom domain when request is same-origin (for forks)", () => {
      expect(
        isAllowedOrigin(
          "https://my-custom-portfolio.io",
          "https://my-custom-portfolio.io/api/send-note",
          "my-custom-portfolio.io"
        )
      ).toBe(true);

      expect(
        isAllowedOrigin(
          "https://another-user.com",
          undefined,
          "another-user.com:443"
        )
      ).toBe(true);
    });

    it("rejects malicious or third-party cross-origin requests even on custom domain", () => {
      expect(
        isAllowedOrigin(
          "https://evil-attacker.com",
          "https://my-custom-portfolio.io/api/send-note",
          "my-custom-portfolio.io"
        )
      ).toBe(false);
      expect(isAllowedOrigin("https://evil-attacker.com")).toBe(false);
      expect(isAllowedOrigin("https://pyaephyomaung.dev.attacker.com")).toBe(false);
      expect(isAllowedOrigin("not-a-url")).toBe(false);
    });
  });

  describe("HTML sanitization", () => {
    it("escapes dangerous HTML characters in telegram message", () => {
      const input = '<script>alert("XSS & danger")</script>';
      const escaped = escapeHtml(input);
      expect(escaped).toBe(
        "&lt;script&gt;alert(&quot;XSS &amp; danger&quot;)&lt;/script&gt;"
      );
    });
  });

  describe("Rate limiting", () => {
    it("allows up to 5 requests per window and blocks the 6th", () => {
      const testIp = "203.0.113.195";
      for (let i = 0; i < 5; i++) {
        expect(isRateLimited(testIp)).toBe(false);
      }
      expect(isRateLimited(testIp)).toBe(true);
    });
  });

  describe("onRequestPost handler", () => {
    it("returns 403 when origin is disallowed", async () => {
      const req = new Request("https://pyaephyomaung.dev/api/send-note", {
        method: "POST",
        headers: {
          origin: "https://malicious-site.com",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Hello" }),
      });

      const res = await onRequestPost({
        request: req,
        env: { TELEGRAM_BOT_TOKEN: "mock", TELEGRAM_CHAT_ID: "123" },
      });

      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toContain("Forbidden");
    });

    it("returns 200 silent success for honeypot bot trap", async () => {
      const req = new Request("https://pyaephyomaung.dev/api/send-note", {
        method: "POST",
        headers: {
          origin: "https://pyaephyomaung.dev",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Bot",
          message: "Spam",
          hp_trap: "filled-by-bot",
        }),
      });

      const res = await onRequestPost({
        request: req,
        env: { TELEGRAM_BOT_TOKEN: "mock", TELEGRAM_CHAT_ID: "123" },
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });

    it("returns 400 when message is missing", async () => {
      const req = new Request("https://pyaephyomaung.dev/api/send-note", {
        method: "POST",
        headers: {
          origin: "https://pyaephyomaung.dev",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "Tester" }),
      });

      const res = await onRequestPost({
        request: req,
        env: { TELEGRAM_BOT_TOKEN: "mock", TELEGRAM_CHAT_ID: "123" },
      });

      expect(res.status).toBe(400);
    });
  });
});
