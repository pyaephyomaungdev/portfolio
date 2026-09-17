// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { SeoSection } from "../sections/SeoSection";
import { initialPortfolioData } from "../../../data/portfolioData";

describe("Admin SeoSection UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  const defaultSeo = {
    metaTitle: "Pyae Phyo Maung — Systems Architect",
    metaDescription: "Building reliable local-first tools and web systems.",
    keywords: ["React", "TypeScript", "Vite"],
    ogImage: "https://pyaephyomaung.dev/avatar.jpg",
    twitterHandle: "@pyaephyomaung",
    canonicalUrl: "https://pyaephyomaung.dev",
  };

  it("renders SEO inputs, keywords, and social preview simulator", () => {
    render(
      <SeoSection
        seo={defaultSeo}
        profile={initialPortfolioData.profile}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText("SEO & Social Preview")).not.toBeNull();
    expect(screen.getByDisplayValue("Pyae Phyo Maung — Systems Architect")).not.toBeNull();
    expect(screen.getByDisplayValue("Building reliable local-first tools and web systems.")).not.toBeNull();
    expect(screen.getByText("React")).not.toBeNull();
    expect(screen.getByText("TypeScript")).not.toBeNull();
    expect(screen.getByText(/live share card simulation/i)).not.toBeNull();
  });

  it("triggers onChange when editing meta title", () => {
    const handleChange = vi.fn();
    render(
      <SeoSection
        seo={defaultSeo}
        profile={initialPortfolioData.profile}
        onChange={handleChange}
      />
    );

    const titleInput = screen.getByDisplayValue("Pyae Phyo Maung — Systems Architect");
    fireEvent.change(titleInput, { target: { value: "Updated Title Tag" } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        metaTitle: "Updated Title Tag",
      })
    );
  });

  it("adds a new keyword tag when typing and clicking Add", () => {
    const handleChange = vi.fn();
    render(
      <SeoSection
        seo={defaultSeo}
        profile={initialPortfolioData.profile}
        onChange={handleChange}
      />
    );

    const input = screen.getByPlaceholderText(/add keyword/i);
    fireEvent.change(input, { target: { value: "Cloudflare" } });

    const addBtn = screen.getByRole("button", { name: /add/i });
    fireEvent.click(addBtn);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        keywords: expect.arrayContaining(["React", "Cloudflare"]),
      })
    );
  });

  it("removes a keyword when remove button is clicked", () => {
    const handleChange = vi.fn();
    render(
      <SeoSection
        seo={defaultSeo}
        profile={initialPortfolioData.profile}
        onChange={handleChange}
      />
    );

    const removeBtn = screen.getByRole("button", { name: /remove keyword react/i });
    fireEvent.click(removeBtn);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        keywords: ["TypeScript", "Vite"],
      })
    );
  });

  it("allows switching between Twitter/X and LinkedIn preview tabs", () => {
    render(
      <SeoSection
        seo={defaultSeo}
        profile={initialPortfolioData.profile}
        onChange={vi.fn()}
      />
    );

    const linkedInTab = screen.getByRole("button", { name: /linkedin/i });
    fireEvent.click(linkedInTab);

    expect(screen.getByText(/2 min read/i)).not.toBeNull();

    const twitterTab = screen.getByRole("button", { name: /twitter \/ x/i });
    fireEvent.click(twitterTab);

    expect(screen.getByText(/sharing my portfolio architecture:/i)).not.toBeNull();
  });
});
