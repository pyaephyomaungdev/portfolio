import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryItem {
  name: string;
  count: number;
}

interface ProjectCategoryFilterProps {
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
}

export function ProjectCategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: ProjectCategoryFilterProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    // 2px buffer for sub-pixel anti-aliasing
    const hasLeft = el.scrollLeft > 2;
    const hasRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
    setCanScrollLeft(hasLeft);
    setCanScrollRight(hasRight);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScrollState();

    el.addEventListener("scroll", checkScrollState, { passive: true });
    window.addEventListener("resize", checkScrollState, { passive: true });

    return () => {
      el.removeEventListener("scroll", checkScrollState);
      window.removeEventListener("resize", checkScrollState);
    };
  }, [checkScrollState, categories]);

  function handleScroll(direction: "left" | "right") {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distance = 220;
    el.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  }

  function handleSelect(name: string, e: React.MouseEvent<HTMLButtonElement>) {
    onSelectCategory(name);
    if (typeof e.currentTarget.scrollIntoView === "function") {
      e.currentTarget.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "nearest",
      });
    }
  }

  if (categories.length <= 1) return null;

  return (
    <div className="relative mt-5 print:hidden">
      {/* Left Blur Fade & Navigation Arrow */}
      {canScrollLeft && (
        <div
          className="absolute left-0 top-0 bottom-0 z-10 flex items-center pr-3 pl-0.5 bg-gradient-to-r from-paper/90 via-paper/50 to-transparent backdrop-blur-xs pointer-events-none transition-opacity duration-200"
          aria-hidden={!canScrollLeft}
        >
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Scroll categories left"
            className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-rule bg-white/90 backdrop-blur-md text-ink shadow-xs hover:border-ink hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Horizontally Scrollable Track without visible scrollbars */}
      <div
        ref={scrollContainerRef}
        role="group"
        aria-label="Filter projects by tech stack"
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5"
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={(e) => handleSelect(cat.name, e)}
              className={`group inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? "btn-primary border-transparent shadow-2xs"
                  : "border-rule bg-white text-muted hover:border-accent/50 hover:text-accent"
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 font-mono text-xs leading-none transition-colors ${
                  isActive
                    ? "bg-white/20 text-inherit"
                    : "bg-soft text-muted group-hover:text-accent group-hover:bg-accent/10"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Blur Fade & Navigation Arrow */}
      {canScrollRight && (
        <div
          className="absolute right-0 top-0 bottom-0 z-10 flex items-center pl-3 pr-0.5 bg-gradient-to-l from-paper/90 via-paper/50 to-transparent backdrop-blur-xs pointer-events-none transition-opacity duration-200"
          aria-hidden={!canScrollRight}
        >
          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label="Scroll categories right"
            className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-rule bg-white/90 backdrop-blur-md text-ink shadow-xs hover:border-ink hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
