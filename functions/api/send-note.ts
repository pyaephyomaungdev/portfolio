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
const ipRequestHistory = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipRequestHistory.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestHistory.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  ipRequestHistory.set(ip, timestamps);
  return false;
}

function escapeHtml(str: string): string {
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
