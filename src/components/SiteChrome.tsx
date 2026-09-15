import { useEffect, useId, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { scrollToId } from "../lib/scrollToId";

const NAV = [
  {
    id: "projects",
    label: "Projects",
    num: "01",
    sub: "Selected work & case studies",
  },
  {
    id: "experience",
    label: "Experience",
    num: "02",
    sub: "Career roles & timeline",
  },
  {
    id: "education",
    label: "Education",
    num: "03",
    sub: "Degrees & certifications",
  },
  {
    id: "contact",
    label: "Contact",
    num: "04",
    sub: "Let's build together",
  },
] as const;

export function SiteHeader({ name }: { name?: string | null }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function goSection(id: string) {
    setOpen(false);
    const hash = `#${id}`;
    if (location.pathname === "/") {
      if (location.hash !== hash) {
        navigate({ pathname: "/", hash: id });
      }
      scrollToId(id);
      return;
    }
    navigate({ pathname: "/", hash: id });
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-rule bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link
            to="/"
            className="font-semibold tracking-tight"
            onClick={() => setOpen(false)}
          >
            {name || "Pyae Phyo Maung"}
          </Link>

          <nav className="hidden gap-5 text-sm text-muted sm:flex">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                className="hover:text-ink cursor-pointer"
                onClick={() => goSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="relative z-50 inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink sm:hidden cursor-pointer"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close" : "Menu"}</span>
            <span className="relative block h-3.5 w-5" aria-hidden>
              <span
                className={`absolute left-0 top-0 block h-0.5 w-full rounded-full bg-current transition-all duration-300 ${open ? "translate-y-1.5 rotate-45" : ""
                  }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-full rounded-full bg-current transition-all duration-200 ${open ? "opacity-0" : ""
                  }`}
              />
              <span
                className={`absolute left-0 top-3 block h-0.5 w-full rounded-full bg-current transition-all duration-300 ${open ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Full-Page Apple-Style Mobile Menu Overlay */}
      <div
        id={menuId}
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-paper px-6 pb-8 pt-20 transition-all duration-500 ease-out sm:hidden ${open
          ? "pointer-events-auto opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 -translate-y-4"
          }`}
      >
        {/* Navigation items with Apple-style staggered slide-in */}
        <nav className="mt-4 flex flex-col divide-y divide-rule">
          {NAV.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              className={`group flex items-center justify-between py-5 text-left transition-all duration-500 cursor-pointer ${open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                }`}
              style={{
                transitionDelay: `${open ? 100 + idx * 70 : 0}ms`,
              }}
              onClick={() => goSection(item.id)}
            >
              <div>
                <span className="mb-1 block font-mono text-xs text-muted">
                  {item.num}
                </span>
                <span className="font-display text-3xl tracking-tight text-ink transition-colors group-hover:text-accent">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  {item.sub}
                </span>
              </div>
              <span className="text-xl text-muted/50 transition-transform group-hover:translate-x-1 group-hover:text-ink">
                →
              </span>
            </button>
          ))}
        </nav>

        {/* Bottom Tray */}
        <div
          className={`border-t border-rule pt-6 transition-all duration-500 delay-300 ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
        >
          {/* Direct contact and quick links */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <a
              href="mailto:pyaephyomaung.dev@gmail.com"
              className="text-xs font-semibold text-ink underline-offset-2 hover:underline"
            >
              pyaephyomaung.dev@gmail.com
            </a>

            <div className="flex items-center gap-4 text-xs font-medium text-muted">
              <a
                href="https://github.com/pyaephyomaungdev"
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink transition"
              >
                GitHub ↗
              </a>
              <a
                href="https://www.linkedin.com/in/pyae-phyo-maung-052445217/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink transition"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function SiteFooter({ name }: { name?: string | null }) {
  return (
    <footer className="border-t border-rule py-8 text-center text-sm text-muted">
      © {new Date().getFullYear()} {name || "Pyae Phyo Maung"}
    </footer>
  );
}
