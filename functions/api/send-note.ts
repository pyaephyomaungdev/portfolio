interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

interface RequestBody {
  name?: string;
  email?: string;
  message?: string;
  hp_trap?: string;
}

// In-memory sliding window rate limiter (max 5 requests per 10 minutes per IP)
export const ipRequestHistory = new Map<string, number[]>();
export const WINDOW_MS = 10 * 60 * 1000;
export const MAX_REQUESTS_PER_WINDOW = 5;

export function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Prune expired entries to prevent unbounded memory growth
  if (ipRequestHistory.size > 200) {
    for (const [key, times] of ipRequestHistory.entries()) {
      const active = times.filter((t) => now - t < WINDOW_MS);
      if (active.length === 0) {
        ipRequestHistory.delete(key);
      } else {
        ipRequestHistory.set(key, active);
      }
    }
  }

  const timestamps = (ipRequestHistory.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestHistory.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  ipRequestHistory.set(ip, timestamps);
  return false;
}

export function isAllowedOrigin(
  originHeader: string | null,
  requestUrl?: string,
  hostHeader?: string | null
): boolean {
  if (!originHeader) return true; // Direct / same-origin navigation without Origin header
  try {
    const origin = new URL(originHeader);
    const originHost = origin.hostname.toLowerCase();

    // 1. Same-origin check against current request Host header (supports any custom domain / fork)
    if (hostHeader) {
      const cleanHost = hostHeader.split(":")[0].toLowerCase();
      if (originHost === cleanHost) {
        return true;
      }
    }

    // 2. Same-origin check against current request URL (supports any custom domain / fork)
    if (requestUrl) {
      try {
        const reqUrl = new URL(requestUrl);
        if (
          origin.origin.toLowerCase() === reqUrl.origin.toLowerCase() ||
          originHost === reqUrl.hostname.toLowerCase()
        ) {
          return true;
        }
      } catch {
        // invalid requestUrl fallback
      }
    }

    // 3. Always allow local development
    if (originHost === "localhost" || originHost === "127.0.0.1") {
      return true;
    }

    // 4. Always allow Cloudflare Pages deployments (*.pages.dev)
    if (originHost.endsWith(".pages.dev")) {
      return true;
    }

    // 5. Default author domain fallback
    if (originHost === "pyaephyomaung.dev" || originHost === "www.pyaephyomaung.dev") {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  try {
    const origin = context.request.headers.get("origin");
    const host = context.request.headers.get("host");
    if (!isAllowedOrigin(origin, context.request.url, host)) {
      return new Response(
        JSON.stringify({ error: "Forbidden: cross-origin requests not allowed" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const clientIp =
      context.request.headers.get("cf-connecting-ip") ||
      context.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";

    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ error: "Too many messages sent. Please wait a few minutes or reach out directly via email." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const body = (await context.request.json().catch(() => ({}))) as RequestBody;
    const { name, email, message, hp_trap } = body;

    // Silent honeypot success if bot filled off-screen trap
    if (hp_trap && hp_trap.trim() !== "") {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!message || message.trim() === "") {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const botToken = context.env.TELEGRAM_BOT_TOKEN;
    const chatId = context.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return new Response(
        JSON.stringify({ error: "Telegram Bot notification is not configured on this server." }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
    const safeName = escapeHtml(name?.trim() || "Anonymous");
    const safeEmail = escapeHtml(email?.trim() || "N/A");
    const safeMessage = escapeHtml(message.trim());
    const safeTime = escapeHtml(`${timestamp} (UTC+7)`);

    const formattedHtml = `📬 <b>New Project Note from Portfolio</b>\n\n👤 <b>From:</b> ${safeName}\n📧 <b>Email:</b> ${safeEmail}\n\n💬 <b>Message:</b>\n${safeMessage}\n\n---\n⏰ <i>Time: ${safeTime}</i>`;

    const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formattedHtml,
        parse_mode: "HTML",
      }),
    });

    if (!telegramRes.ok) {
      const errText = await telegramRes.text();
      console.error("[send-note] Telegram API error:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to dispatch note to Telegram API. Please use direct email." }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
