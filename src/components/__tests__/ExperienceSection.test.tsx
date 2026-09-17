// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ExperienceSection } from "../ExperienceSection";
import { initialPortfolioData } from "../../data/portfolioData";
import type { ExperienceCompany } from "../../lib/api";

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

  it("does not show expand button when company has 2 or fewer roles", () => {
    const companyWithTwoRoles: ExperienceCompany = {
      id: "co-two",
      name: "Acme Corp",
      logoUrl: null,
      location: "Remote",
      sortOrder: 0,
      roles: [
        {
          id: "r-1",
          companyId: "co-two",
          title: "Senior Engineer",
          employmentType: "Full-time",
          startDate: "2023",
          endDate: null,
          location: null,
          skills: ["TypeScript"],
          sortOrder: 0,
        },
        {
          id: "r-2",
          companyId: "co-two",
          title: "Junior Engineer",
          employmentType: "Full-time",
          startDate: "2021",
          endDate: "2023",
          location: null,
          skills: ["JavaScript"],
          sortOrder: 1,
        },
      ],
    };

    render(<ExperienceSection companies={[companyWithTwoRoles]} />);
    expect(screen.queryByRole("button", { name: /more role/i })).toBeNull();
    expect(screen.getByText("Senior Engineer")).not.toBeNull();
    expect(screen.getByText("Junior Engineer")).not.toBeNull();
  });

  it("shows expand button and toggles roles when company has 3 or more roles", () => {
    const companyWithThreeRoles: ExperienceCompany = {
      id: "co-three",
      name: "Mega Corp",
      logoUrl: null,
      location: "Bangkok",
      sortOrder: 0,
      roles: [
        {
          id: "r-1",
          companyId: "co-three",
          title: "Principal Architect",
          employmentType: "Full-time",
          startDate: "2024",
          endDate: null,
          location: null,
          skills: ["System Design"],
          sortOrder: 0,
        },
        {
          id: "r-2",
          companyId: "co-three",
          title: "Senior Full Stack Engineer",
          employmentType: "Full-time",
          startDate: "2022",
          endDate: "2024",
          location: null,
          skills: ["React"],
          sortOrder: 1,
        },
        {
          id: "r-3",
          companyId: "co-three",
          title: "Frontend Developer",
          employmentType: "Full-time",
          startDate: "2020",
          endDate: "2022",
          location: null,
          skills: ["CSS"],
          sortOrder: 2,
        },
      ],
    };

    render(<ExperienceSection companies={[companyWithThreeRoles]} />);

    // Initially, 2 roles visible and expand button exists
    const expandBtn = screen.getByRole("button", { name: /show 1 more role/i });
    expect(expandBtn).not.toBeNull();
    expect(expandBtn.textContent).toContain("Show 1 more role");

    // Click to expand
    fireEvent.click(expandBtn);
    expect(screen.getByText("Show fewer roles")).not.toBeNull();

    // Click to collapse
    fireEvent.click(screen.getByText("Show fewer roles"));
    expect(screen.getByText("Show 1 more role")).not.toBeNull();
  });
});
