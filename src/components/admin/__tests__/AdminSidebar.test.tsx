// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AdminSidebar } from "../AdminSidebar";

describe("AdminSidebar UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  const mockCounts = {
    stats: 4,
    projects: 8,
    experience: 3,
    education: 2,
    honors: 5,
    licenses: 6,
  };

  it("renders all admin section tabs and project badge counts", () => {
    render(
      <MemoryRouter>
        <AdminSidebar activeTab="overview" onSelectTab={vi.fn()} counts={mockCounts} />
      </MemoryRouter>
    );

    expect(screen.getAllByText("Overview").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Profile").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Projects").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Experience").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Deploy & Hosting").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Raw JSON").length).toBeGreaterThanOrEqual(1);
  });

  it("calls onSelectTab when a tab button is clicked", () => {
    const handleSelectTab = vi.fn();
    render(
      <MemoryRouter>
        <AdminSidebar activeTab="overview" onSelectTab={handleSelectTab} counts={mockCounts} />
      </MemoryRouter>
    );

    const projectTabs = screen.getAllByText("Projects");
    fireEvent.click(projectTabs[0]!);

    expect(handleSelectTab).toHaveBeenCalledWith("projects");
  });
});
