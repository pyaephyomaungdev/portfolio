import { useEffect, useState } from "react";
import type { Profile } from "../types/portfolio";
import {
  X,
  Mail,
  Copy,
  Check,
  Send,
  ExternalLink,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { FaTelegram, FaLinkedin } from "react-icons/fa6";
import { SiGithub } from "react-icons/si";
import { scrollToId } from "../lib/scrollToId";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: Profile | null;
}

export function ContactModal({ isOpen, onClose, profile }: ContactModalProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const emailAddress = profile?.emailPublic || "pyaephyomaung.dev@gmail.com";
  const telegramUrl = profile?.telegramUrl || "https://t.me/pyaephyomaung";
  const githubUrl = profile?.githubUrl || "https://github.com/pyaephyomaungdev";
  const linkedinUrl = profile?.linkedinUrl || null;
  const telegramConfigured = profile?.telegramConfigured ?? false;

  const modalTitle = profile?.contactModalTitle || "Let's build together";
  const modalSubtitle = profile?.contactModalSubtitle || "Connect via verified direct engineering channels or copy email address.";

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  function handleCopyEmail() {
    void navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  }

  function handleGoToContactSection() {
    onClose();
    setTimeout(() => {
      scrollToId("contact");
    }, 150);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-rule bg-paper shadow-2xl overflow-hidden flex flex-col">

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-rule bg-white px-6 py-5">
          <div>
            <h3 id="contact-modal-title" className="font-display text-2xl font-semibold text-ink mt-0.5">
              {modalTitle}
            </h3>
            <p className="mt-1 text-xs text-muted leading-relaxed max-w-sm">
              {modalSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-muted hover:text-ink hover:bg-soft transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-muted block mb-2.5">
              Verified Reachout Channels
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Copy Email Box */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex items-center justify-between rounded-xl border border-rule bg-white px-3.5 py-2.5 text-left transition hover:border-ink/40 hover:bg-soft cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Mail className="h-4 w-4 text-muted group-hover:text-ink transition-colors shrink-0" />
                  <div className="min-w-0">
                    <span className="block font-semibold text-xs text-ink">
                      Email Address
                    </span>
                    <span className="block font-mono text-xs text-muted truncate">
                      {emailAddress}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  {copiedEmail ? (
                    <span className="inline-flex items-center gap-1 font-mono text-xs text-success font-medium">
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-mono text-xs text-muted group-hover:text-ink transition-colors">
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </span>
                  )}
                </div>
              </button>

              {/* Telegram Channel */}
              {telegramUrl ? (
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-rule bg-white px-3.5 py-2.5 text-left transition hover:border-ink/40 hover:bg-soft cursor-pointer shadow-2xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <FaTelegram className="h-4 w-4 text-muted group-hover:text-ink transition-colors shrink-0" />
                    <div>
                      <span className="block font-semibold text-xs text-ink">
                        Telegram Direct
                      </span>
                      <span className="block font-mono text-xs text-muted">
                        @pyaephyomaung
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted group-hover:text-ink transition-colors shrink-0" />
                </a>
              ) : null}

              {/* GitHub Link */}
              {githubUrl ? (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-rule bg-white px-3.5 py-2.5 text-left transition hover:border-ink/40 hover:bg-soft cursor-pointer shadow-2xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <SiGithub className="h-4 w-4 text-muted group-hover:text-ink transition-colors shrink-0" />
                    <div>
                      <span className="block font-semibold text-xs text-ink">
                        GitHub
                      </span>
                      <span className="block font-mono text-xs text-muted">
                        @pyaephyomaungdev
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted group-hover:text-ink transition-colors shrink-0" />
                </a>
              ) : null}

              {/* LinkedIn (or Mailto shortcut) */}
              {linkedinUrl ? (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-rule bg-white px-3.5 py-2.5 text-left transition hover:border-ink/40 hover:bg-soft cursor-pointer shadow-2xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <FaLinkedin className="h-4 w-4 text-muted group-hover:text-ink transition-colors shrink-0" />
                    <div>
                      <span className="block font-semibold text-xs text-ink">
                        LinkedIn
                      </span>
                      <span className="block font-mono text-xs text-muted">
                        Professional Profile
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted group-hover:text-ink transition-colors shrink-0" />
                </a>
              ) : (
                <a
                  href={`mailto:${emailAddress}`}
                  className="flex items-center justify-between rounded-xl border border-rule bg-white px-3.5 py-2.5 text-left transition hover:border-ink/40 hover:bg-soft cursor-pointer shadow-2xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <Send className="h-4 w-4 text-muted group-hover:text-ink transition-colors shrink-0" />
                    <div>
                      <span className="block font-semibold text-xs text-ink">
                        Launch Mail App
                      </span>
                      <span className="block font-mono text-xs text-muted">
                        Default Email Client
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted group-hover:text-ink transition-colors shrink-0" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Note Shortcut — only when Telegram bot is configured */}
          {telegramConfigured ? (
            <div className="rounded-xl border border-rule bg-soft/60 p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <MessageSquare className="h-4 w-4 text-accent shrink-0" />
                <div className="min-w-0">
                  <span className="block font-semibold text-xs text-ink">
                    Looking to drop a quick note?
                  </span>
                  <span className="block text-xs text-muted truncate">
                    Quick message form to get in touch with me.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoToContactSection}
                className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 font-mono text-xs text-paper shrink-0 hover:opacity-90 transition cursor-pointer shadow-2xs"
              >
                <span>Go to Form</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
