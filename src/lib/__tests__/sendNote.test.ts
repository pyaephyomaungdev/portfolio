import { describe, it, expect } from "vitest";

// Test the HTML escaping logic used in send-note.ts and vite.config.ts
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Test the sliding window rate limiter logic
function createRateLimiter(windowMs: number, maxRequests: number) {
  const ipRequestHistory = new Map<string, number[]>();

  return {
    isRateLimited(ip: string, currentTime = Date.now()): boolean {
      const timestamps = (ipRequestHistory.get(ip) || []).filter((t) => currentTime - t < windowMs);
      if (timestamps.length >= maxRequests) {
        ipRequestHistory.set(ip, timestamps);
        return true;
      }
      timestamps.push(currentTime);
      ipRequestHistory.set(ip, timestamps);
      return false;
    },
    getHistory: () => ipRequestHistory,
  };
}

describe("send-note Telegram HTML escaping", () => {
  it("escapes ampersands, angle brackets, and quotes", () => {
    const maliciousInput = '<script>alert("XSS & injection")</script>';
    const escaped = escapeHtml(maliciousInput);

    expect(escaped).toBe("&lt;script&gt;alert(&quot;XSS &amp; injection&quot;)&lt;/script&gt;");
    expect(escaped).not.toContain("<");
    expect(escaped).not.toContain(">");
  });

  it("safely handles text with underscores, asterisks and code backticks", () => {
    const rawNote = "Hello _world_ *bold* `const x = 10;` john_doe@company.com";
    const escaped = escapeHtml(rawNote);

    // HTML mode does not treat underscore as entity markdown delimiter
    expect(escaped).toContain("john_doe@company.com");
    expect(escaped).toContain("`const x = 10;`");
  });

  it("escapes single quotes correctly", () => {
    const text = "I'm interested in working together";
    expect(escapeHtml(text)).toBe("I&#039;m interested in working together");
  });
});

describe("send-note In-Memory Rate Limiter", () => {
  it("permits requests within the window limit", () => {
    const limiter = createRateLimiter(60000, 3);
    const ip = "192.168.1.1";

    expect(limiter.isRateLimited(ip, 1000)).toBe(false);
    expect(limiter.isRateLimited(ip, 2000)).toBe(false);
    expect(limiter.isRateLimited(ip, 3000)).toBe(false);
  });

  it("throttles requests that exceed maximum threshold", () => {
    const limiter = createRateLimiter(60000, 3);
    const ip = "192.168.1.2";

    limiter.isRateLimited(ip, 1000);
    limiter.isRateLimited(ip, 2000);
    limiter.isRateLimited(ip, 3000);

    // 4th request exceeds max of 3
    expect(limiter.isRateLimited(ip, 4000)).toBe(true);
    expect(limiter.isRateLimited(ip, 5000)).toBe(true);
  });

  it("allows new requests after sliding window expires", () => {
    const limiter = createRateLimiter(10000, 2);
    const ip = "192.168.1.3";

    expect(limiter.isRateLimited(ip, 1000)).toBe(false);
    expect(limiter.isRateLimited(ip, 2000)).toBe(false);
    expect(limiter.isRateLimited(ip, 3000)).toBe(true); // Exceeded

    // Advance beyond window (1000 + 10000 = 11000)
    expect(limiter.isRateLimited(ip, 15000)).toBe(false);
  });

  it("isolates rate limits by IP address", () => {
    const limiter = createRateLimiter(60000, 2);
    const ipA = "10.0.0.1";
    const ipB = "10.0.0.2";

    limiter.isRateLimited(ipA, 1000);
    limiter.isRateLimited(ipA, 2000);
    expect(limiter.isRateLimited(ipA, 3000)).toBe(true);

    // ipB is independent and should not be throttled
    expect(limiter.isRateLimited(ipB, 3000)).toBe(false);
  });
});
