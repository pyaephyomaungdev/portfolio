import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface ExpandableTextProps {
  text: string;
  className?: string;
  bg?: "white" | "paper";
  threshold?: number;
}

export function ExpandableText({
  text,
  className = "",
  bg = "white",
  threshold = 160,
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldTruncate, setShouldTruncate] = useState(() => text.length > threshold);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      // Check if text exceeds ~3 lines (around 75px) or length fallback in headless environments
      const isOverflowing =
        textRef.current.scrollHeight > 75 ||
        (textRef.current.scrollHeight === 0 && text.length > threshold);
      setShouldTruncate(isOverflowing);
    }
  }, [text, threshold]);

  if (!shouldTruncate) {
    return (
      <p className={`text-sm text-ink/85 leading-relaxed ${className}`}>
        {text}
      </p>
    );
  }

  const isPaper = bg === "paper";

  return (
    <div className="relative">
      {/* Content wrapper with fluid height transition */}
      <div
        className={`relative overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? "max-h-96" : "max-h-20"
        }`}
        style={
          isExpanded
            ? undefined
            : {
                WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
                maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
              }
        }
      >
        <p
          ref={textRef}
          className={`text-sm text-ink/85 leading-relaxed ${className}`}
        >
          {text}
        </p>
      </div>

      {/* Centered subtle down arrow pill toggle */}
      <div className="mt-2 flex justify-center">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded((prev) => !prev);
          }}
          className={`group inline-flex items-center gap-1.5 rounded-full border border-rule px-3 py-1 text-xs font-mono text-muted hover:text-accent hover:border-accent/40 hover:bg-soft shadow-2xs hover:shadow-xs transition-all cursor-pointer ${
            isPaper ? "bg-paper" : "bg-white"
          }`}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Show less description" : "Show full description"}
        >
          <span className="transition-colors group-hover:text-accent">{isExpanded ? "Show less" : "Read more"}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-300 group-hover:text-accent ${
              isExpanded ? "rotate-180 text-accent" : ""
            }`}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
