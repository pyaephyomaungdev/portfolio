import { useEffect, useState } from "react";
import { initialPortfolioData } from "../data/portfolioData";
import { fetchPortfolio } from "../lib/api";
import type { Profile } from "../types/portfolio";

export function IntroLoader() {
  const [profile, setProfile] = useState<Profile | null>(() => initialPortfolioData.profile);
  const [progress, setProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const [isCurtainUp, setIsCurtainUp] = useState(false);
  const [isMounted, setIsMounted] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.location.pathname.startsWith("/admin")) return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    if (typeof navigator !== "undefined" && /lighthouse|headlesschrome/i.test(navigator.userAgent)) return false;
    return !sessionStorage.getItem("ppm_intro_seen");
  });

  useEffect(() => {
    void fetchPortfolio().then((d) => {
      if (d.profile) setProfile(d.profile);
    });
  }, []);

  useEffect(() => {
    if (!isMounted) {
      window.dispatchEvent(new CustomEvent("intro-done"));
      return;
    }

    // Step 1: Trigger kinetic typographic reveal
    const timer = setTimeout(() => setTextVisible(true), 100);

    // Step 2: Preload critical image assets
    const imagesToPreload = [
      profile?.avatarUrl || "/avatar.jpg",
      "/favicon.png",
      "/favicon.ico",
    ];
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Step 3: Run smooth high-precision 2.6s progress timeline
    const start = performance.now();
    const duration = 2500;

    let frameId: number;
    const update = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed < duration) {
        frameId = requestAnimationFrame(update);
      } else {
        sessionStorage.setItem("ppm_intro_seen", "true");

        // Trigger curtain opening with exquisite ease
        setTimeout(() => {
          setIsCurtainUp(true);
          window.dispatchEvent(new CustomEvent("intro-done"));
        }, 220);

        // Completely unmount after transition
        setTimeout(() => {
          setIsMounted(false);
        }, 1100);
      }
    };

    frameId = requestAnimationFrame(update);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frameId);
    };
  }, [isMounted, profile?.avatarUrl]);

  if (!isMounted) return null;

  // Dynamic system stages
  const stage =
    progress < 30
      ? { step: "01", text: "Preloading visual assets & avatar..." }
      : progress < 60
        ? { step: "02", text: "Calibrating Tailwind design tokens..." }
        : progress < 90
          ? { step: "03", text: "Mounting local-first client workspace..." }
          : { step: "04", text: "Interface initialized." };

  const words = (profile?.name || "Pyae Phyo Maung")
    .trim()
    .toUpperCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((text, idx) => ({ text, key: `${text}-${idx}` }));

  const initials = (profile?.name || "Pyae Phyo Maung")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "PPM";

  const headline = profile?.headline || "Software Engineer & Full-Stack";

  const subtitle =
    profile?.bio?.split("\n").map((s) => s.trim()).filter(Boolean)[0] ||
    headline ||
    "Building reliable web infrastructure, local-first tools & systems";

  return (
    <aside
      role="status"
      aria-label="Loading portfolio"
      className={`fixed inset-0 z-loader flex flex-col justify-between bg-paper p-6 transition-all duration-800 ease-in-out sm:p-10 ${isCurtainUp
        ? "pointer-events-none -translate-y-full opacity-90"
        : "translate-y-0 opacity-100"
        }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.85, 0, 0.15, 1)",
      }}
    >
      {/* Precision Drafting Corner Marks */}
      <div className="pointer-events-none absolute inset-4 border border-rule/50 sm:inset-8" />
      <span className="pointer-events-none absolute left-3 top-3 font-mono text-xs text-muted/60 sm:left-7 sm:top-7">
        +
      </span>
      <span className="pointer-events-none absolute right-3 top-3 font-mono text-xs text-muted/60 sm:right-7 sm:top-7">
        +
      </span>
      <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-xs text-muted/60 sm:bottom-7 sm:left-7">
        +
      </span>
      <span className="pointer-events-none absolute bottom-3 right-3 font-mono text-xs text-muted/60 sm:bottom-7 sm:right-7">
        +
      </span>

      {/* Top Header Bar */}
      <div
        className={`relative z-10 flex items-center justify-between text-xs text-muted transition-all duration-700 ${textVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-ink font-semibold">
            {initials} // {new Date().getFullYear()}
          </span>
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-muted hidden sm:inline">
          Architectural Portfolio
        </span>
        <span className="font-mono text-xs uppercase text-ink">
          SYS.OK
        </span>
      </div>

      {/* Centerpiece: Kinetic Letters + Radial Progress Ring */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Eyebrow badge */}
        <div
          className={`mb-4 inline-flex items-center gap-2 rounded-md border border-rule bg-white px-3 py-1 transition-all duration-700 ${textVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-muted">
            {headline}
          </span>
        </div>

        {/* Kinetic Staggered Name Reveal */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:gap-x-5">
          {words.map((w, wIdx) => (
            <div key={w.key} className="flex overflow-hidden py-1">
              {w.text.split("").map((char, cIdx) => {
                const totalIndex = wIdx * 5 + cIdx;
                return (
                  <span
                    key={cIdx}
                    className="inline-block font-display text-5xl font-normal tracking-tight text-ink transition-transform duration-700 sm:text-7xl md:text-8xl"
                    style={{
                      transform: textVisible
                        ? "translateY(0)"
                        : "translateY(115%)",
                      transitionDelay: `${100 + totalIndex * 30}ms`,
                      transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        {/* Focus subtitle */}
        <p
          className={`mt-3 font-sans text-sm text-muted transition-all duration-700 delay-300 ${textVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
        >
          {subtitle}
        </p>

        {/* Circular Gauge + Status Block */}
        <div
          className={`mt-10 flex flex-col items-center transition-all duration-700 delay-400 ${textVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
        >
          {/* Circular precision SVG gauge */}
          <div className="relative flex items-center justify-center">
            <svg className="h-16 w-16 -rotate-90 transform" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="34"
                className="stroke-rule"
                strokeWidth="2.5"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                className="stroke-ink transition-all duration-75 ease-out"
                strokeWidth="2.5"
                strokeDasharray={213.6}
                strokeDashoffset={213.6 - (213.6 * progress) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
              <span className="text-xs font-semibold text-ink">
                {progress}
                <span className="text-muted text-xs">%</span>
              </span>
            </div>
          </div>

          {/* Dynamic Technical Stage line */}
          <div className="mt-4 flex items-center gap-2 font-mono text-xs text-muted">
            <span className="rounded bg-soft px-1.5 py-0.5 font-semibold text-ink">
              {stage.step}
            </span>
            <span className="text-muted">
              {stage.text}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Metadata Bar */}
      <div
        className={`relative z-10 flex items-center justify-between font-mono text-xs text-muted transition-all duration-700 ${textVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
      >
        <span>{profile?.location || "Bangkok, Thailand"}</span>
        <span>{profile?.joinedLabel || "Local-First & Distributed"}</span>
      </div>
    </aside>
  );
}
