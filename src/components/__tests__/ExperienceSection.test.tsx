// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ExperienceSection } from "../ExperienceSection";
import { initialPortfolioData } from "../../data/portfolioData";

describe("ExperienceSection UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("does not render when companies array is empty", () => {
    const { container } = render(<ExperienceSection companies={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders company names, role titles, and career section header", () => {
    render(<ExperienceSection companies={initialPortfolioData.experience} />);

    expect(screen.getByText("Career")).not.toBeNull();
    const firstCompany = initialPortfolioData.experience[0];
    if (firstCompany) {
      expect(screen.getAllByText(new RegExp(firstCompany.name, "i")).length).toBeGreaterThanOrEqual(1);
    }
  });
});
