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

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  try {
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
    const formattedText = `📬 *New Project Note from Portfolio*\n\n👤 *From:* ${name?.trim() || "Anonymous"}\n📧 *Email:* ${email?.trim() || "N/A"}\n\n💬 *Message:*\n${message.trim()}\n\n---\n⏰ _Time: ${timestamp} (UTC+7)_`;

    const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formattedText,
        parse_mode: "Markdown",
      }),
    });

    if (!telegramRes.ok) {
      const errText = await telegramRes.text();
      return new Response(
        JSON.stringify({ error: "Failed to dispatch note to Telegram API", details: errText }),
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
