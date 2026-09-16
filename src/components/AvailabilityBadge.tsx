import { useEffect, useRef, useState } from "react";
import { Clock, Zap, X, ArrowRight } from "lucide-react";
import type { AvailabilityConfig } from "../types/portfolio";

interface AvailabilityBadgeProps {
  config?: AvailabilityConfig;
  onOpenContact?: () => void;
  variant?: "corner" | "inline";
  className?: string;
}

export function AvailabilityBadge({
  config,
  onOpenContact,
  variant = "corner",
  className = "",
}: AvailabilityBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (config?.enabled === false) return null;

  const targetTimezone = config?.timezone || "Asia/Bangkok";
  const timezoneLabel = config?.timezoneLabel || "BKK (UTC+7)";
  const statusLabel = config?.status || "Available for Work";
  const scopeLabel = config?.scope || "Full-Time & Remote";
  const slaLabel = config?.sla || "<24h SLA";

  // Clean time format: "3:15 PM"
  const formatTime = () => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: targetTimezone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());
    } catch {
      return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    }
  };

  const [timeString, setTimeString] = useState<string>(formatTime);

  useEffect(() => {
    setTimeString(formatTime());
    const timer = setInterval(() => {
      setTimeString(formatTime());
    }, 10000);

    return () => clearInterval(timer);
  }, [targetTimezone]);

  // Click outside to close popover
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (variant === "inline") {
    return (
      <div
        className={`group inline-flex max-w-full items-center divide-x divide-rule rounded-full border border-rule bg-white text-xs shadow-2xs ${className}`}
      >
        <div className="flex items-center gap-2 px-3 py-1">
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="font-medium text-ink whitespace-nowrap">{statusLabel}</span>
        </div>
        {scopeLabel && (
          <div className="hidden sm:block px-3 py-1 text-muted whitespace-nowrap">{scopeLabel}</div>
        )}
        <div className="flex items-center gap-1.5 px-3 py-1 font-mono text-xs text-muted whitespace-nowrap">
          <Clock className="h-3 w-3 shrink-0 text-muted/70" aria-hidden="true" />
          <span>{timezoneLabel} {timeString}</span>
        </div>
        {slaLabel && (
          <div className="hidden md:block px-2.5 py-1 font-mono text-xs font-medium text-accent whitespace-nowrap">
            {slaLabel}
          </div>
        )}
      </div>
    );
  }

  // Corner variant: sits on the bottom-right corner of the profile avatar
  return (
    <div ref={containerRef} className={`absolute -bottom-1 -right-1 sm:bottom-0 sm:right-0 z-20 ${className}`}>
      {/* Corner Pulse Beacon Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Status: ${statusLabel}. Click to view live availability details`}
        aria-expanded={isOpen}
        title={`${statusLabel} · Click for details`}
        className={`group relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white border transition-all duration-200 cursor-pointer focus:outline-hidden ${isOpen
            ? "ring-2 ring-ink border-ink scale-110 shadow-sm"
            : "ring-2 ring-paper border-rule shadow-xs hover:scale-110 active:scale-95"
          }`}
      >
        <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3 items-center justify-center" aria-hidden="true">
          <span className={`absolute inline-flex h-full w-full rounded-full bg-success ${isOpen ? "opacity-30" : "animate-ping opacity-75"}`} />
          <span className="relative inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-success ring-1 ring-white" />
        </span>
      </button>

      {/* Popover Card on Click */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Live Availability & Timezone Details"
          className="popover-container animate-popover-bloom z-30 rounded-xl border border-rule bg-white p-4 shadow-xl text-xs space-y-3"
        >
          {/* Connected Pointer Beak / Notch linking directly to the radar circle */}
          <div
            className="popover-notch pointer-events-none border-t border-l border-rule bg-white select-none z-10"
            aria-hidden="true"
          />

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                <span className="font-semibold text-ink text-sm leading-tight">
                  {statusLabel}
                </span>
              </div>
              <span className="text-muted text-xs block mt-0.5 font-mono">
                {scopeLabel}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close availability details"
              className="rounded-md p-1 text-muted hover:text-ink hover:bg-soft transition cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Architectural 2-Column Grid (Clean Swiss divider, zero wrapping issues) */}
          <div className="grid grid-cols-2 divide-x divide-rule border-y border-rule py-2.5 my-2">
            <div className="pr-3">
              <p className="font-mono text-xs uppercase tracking-wider text-muted flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted/70 shrink-0" aria-hidden="true" />
                <span>Local Time</span>
              </p>
              <p className="mt-1 font-mono text-sm font-semibold tracking-tight text-ink whitespace-nowrap">
                {timeString}
              </p>
              <p className="mt-0.5 font-mono text-xs text-muted">
                {timezoneLabel}
              </p>
            </div>

            <div className="pl-3">
              <p className="font-mono text-xs uppercase tracking-wider text-muted flex items-center gap-1">
                <Zap className="h-3 w-3 text-accent shrink-0" aria-hidden="true" />
                <span>Response SLA</span>
              </p>
              <p className="mt-1 font-mono text-sm font-semibold tracking-tight text-accent whitespace-nowrap">
                {slaLabel}
              </p>
              <p className="mt-0.5 font-mono text-xs text-muted">
                Turnaround
              </p>
            </div>
          </div>

          {/* Footer Action (Subtle architectural link instead of redundant giant button) */}
          {onOpenContact && (
            <div className="pt-0.5 flex items-center justify-between">
              <span className="font-mono text-xs text-muted">Direct channels</span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenContact();
                }}
                className="inline-flex items-center gap-1 font-mono text-xs font-medium text-ink hover:text-accent transition cursor-pointer group"
              >
                <span>Get in touch</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


