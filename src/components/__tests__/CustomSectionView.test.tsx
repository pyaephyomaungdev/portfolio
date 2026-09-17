// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { CustomSectionView } from "../CustomSectionView";
import type { CustomSection } from "../../types/portfolio";

describe("CustomSectionView Public Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders custom section with cards layout and items", () => {
    const section: CustomSection = {
      id: "essays",
      title: "Featured Architecture Essays",
      subtitle: "Long-form technical documentation",
      layout: "cards",
      content: "A curated collection of systems research.",
      items: [
        {
          id: "1",
          title: "Zero-Backend Systems",
          subtitle: "Architecture",
          description: "Designing deterministic client-first web apps.",
          tag: "Systems",
          date: "2026",
          url: "https://example.com/essay",
        },
      ],
      sortOrder: 1,
      visible: true,
    };

    render(<CustomSectionView section={section} />);

    expect(screen.getByText("Featured Architecture Essays")).not.toBeNull();
    expect(screen.getByText("Long-form technical documentation")).not.toBeNull();
    expect(screen.getByText("Zero-Backend Systems")).not.toBeNull();
    expect(screen.getByText("Systems")).not.toBeNull();
    expect(screen.getByText("2026")).not.toBeNull();
  });

  it("renders null when visible is false", () => {
    const section: CustomSection = {
      id: "hidden-sec",
      title: "Hidden Section",
      layout: "prose",
      content: "Secret content",
      sortOrder: 1,
      visible: false,
    };

    const { container } = render(<CustomSectionView section={section} />);
    expect(container.firstChild).toBeNull();
  });
});
