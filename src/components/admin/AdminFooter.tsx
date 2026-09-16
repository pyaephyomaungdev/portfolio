import { Heart } from "lucide-react";

export function AdminFooter() {
  return (
    <footer className="mt-auto border-t border-rule bg-paper py-3.5 px-6 text-center text-xs font-mono text-muted flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span>Portfolio Admin // Local Data Mode</span>
      </div>
      <div className="inline-flex items-center gap-1.5">
        Developed with <Heart className="h-3.5 w-3.5 fill-accent text-accent inline" aria-label="love" /> by{" "}
        <a
          href="https://pyaephyomaung.dev"
          target="_blank"
          rel="noreferrer"
          className="text-ink font-medium underline underline-offset-4 hover:text-accent transition"
        >
          Pyae Phyo Maung
        </a>
      </div>
    </footer>
  );
}
