import { useState } from "react";
import type { Profile } from "../types/portfolio";
import { Send, Check, Sparkles, Loader2, Copy, AlertCircle, RefreshCw } from "lucide-react";

interface ContactFormProps {
  profile?: Profile | null;
  className?: string;
}

export function ContactForm({ profile, className = "" }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "fallback">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const emailAddress = profile?.emailPublic || "pyaephyomaung.dev@gmail.com";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Anti-spam honeypot check: if bot fills this, silently mark success
    if (honeypot.trim() !== "") {
      setStatus("success");
      return;
    }

    setStatus("sending");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/send-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          hp_trap: honeypot.trim(),
        }),
      });

      if (res.ok) {
        setStatus("success");
        return;
      }

      const errData = await res.json().catch(() => ({}));
      setErrorMessage(
        typeof errData.error === "string"
          ? errData.error
          : "Instant notification unavailable. Opening email draft fallback."
      );
      openMailto();
      setStatus("fallback");
    } catch (err) {
      console.warn("Network error during note dispatch:", err);
      setErrorMessage("Network connection timed out. Opening email draft fallback.");
      openMailto();
      setStatus("fallback");
    }
  }

  function openMailto() {
    const subject = `Project Inquiry from ${name.trim() || "Visitor"}`;
    const bodyText = `${message.trim()}\n\n---\nSender: ${name.trim()} (${email.trim()})`;
    const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    window.open(mailtoUrl, "_blank");
  }

  function handleCopyNote() {
    const subject = `Project Inquiry from ${name.trim() || "Visitor"}`;
    const bodyText = `Subject: ${subject}\n\n${message.trim()}\n\n---\nFrom: ${name.trim()} (${email.trim()})`;
    void navigator.clipboard.writeText(bodyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() {
    setName("");
    setEmail("");
    setMessage("");
    setStatus("idle");
    setErrorMessage(null);
  }

  return (
    <div className={`relative rounded-xl border border-rule bg-white p-6 sm:p-7 shadow-xs ${className}`}>
      <div className="flex items-center justify-between border-b border-rule pb-3.5 mb-5">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-muted block">
            // DROP A QUICK NOTE
          </span>
          <h3 className="font-display text-xl font-semibold text-ink mt-0.5">
            Direct Message Dispatch
          </h3>
        </div>
      </div>

      {status === "success" ? (
        <div className="rounded-xl border border-success/30 bg-success-soft p-6 text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
            <Sparkles className="h-6 w-6" />
          </div>
          <h4 className="font-display text-2xl font-semibold text-ink">
            Note Dispatched Successfully!
          </h4>
          <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
            Your message has been sent directly to my Telegram. I review inquiries daily and will respond within 24 hours.
          </p>

          <div className="pt-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-xs font-medium text-paper hover:opacity-90 transition cursor-pointer shadow-2xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Send Another Note</span>
            </button>
          </div>
        </div>
      ) : status === "fallback" ? (
        <div className="rounded-xl border border-rule bg-soft p-6 text-center space-y-3">
          {errorMessage && (
            <div className="inline-flex items-center gap-1.5 rounded-md bg-destructive-soft px-3 py-1 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{errorMessage}</span>
            </div>
          )}
          <h4 className="font-display text-xl font-semibold text-ink">
            Note Prepared for Direct Reachout!
          </h4>
          <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
            Your note has been formatted. If your default email client did not launch, click below to copy the complete note to paste into Telegram or your email app.
          </p>

          <div className="flex flex-wrap justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleCopyNote}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-4 py-2 text-xs font-medium text-ink hover:border-ink transition cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-success" />
                  <span className="text-success font-medium">Copied Note to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Note &amp; Subject</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-paper transition hover:opacity-90 cursor-pointer shadow-2xs"
            >
              Send Another Note
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot Spam Trap */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="hp_trap_field">Do not fill this field</label>
            <input
              id="hp_trap_field"
              type="text"
              name="hp_trap_field"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="form-name" className="block text-xs font-medium text-ink mb-1.5">
                Your Name / Team
              </label>
              <input
                id="form-name"
                type="text"
                required
                placeholder="e.g. Alex / Engineering Team"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink focus:border-ink focus:outline-hidden"
              />
            </div>

            <div>
              <label htmlFor="form-email" className="block text-xs font-medium text-ink mb-1.5">
                Your Email Address
              </label>
              <input
                id="form-email"
                type="email"
                required
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink focus:border-ink focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label htmlFor="form-message" className="block text-xs font-medium text-ink mb-1.5">
              Message / Project Scope
            </label>
            <textarea
              id="form-message"
              required
              rows={3}
              placeholder="Tell me about your project, timeline, technical requirements, or role..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs text-ink focus:border-ink focus:outline-hidden resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <span className="font-mono text-xs text-muted">
              ⚡ Direct Telegram Bot Notification enabled
            </span>

            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-xs font-medium transition cursor-pointer disabled:opacity-50"
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Transmitting to Telegram...</span>
                </>
              ) : (
                <>
                  <span>Send Note</span>
                  <Send className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
