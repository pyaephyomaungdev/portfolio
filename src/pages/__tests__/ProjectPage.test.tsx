// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProjectPage } from "../ProjectPage";
import { ThemeProvider } from "../../context/ThemeContext";
import { initialPortfolioData } from "../../data/portfolioData";

describe("ProjectPage Component", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders project case study details for valid slug", async () => {
    const sampleProject = initialPortfolioData.projects[0];
    expect(sampleProject).toBeDefined();

    render(
      <MemoryRouter initialEntries={[`/projects/${sampleProject?.slug}`]}>
        <ThemeProvider>
          <Routes>
            <Route path="/projects/:slug" element={<ProjectPage />} />
          </Routes>
        </ThemeProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText(sampleProject?.title || "").length).toBeGreaterThanOrEqual(1);
    });

    expect(screen.getByText(/back to selected work/i)).not.toBeNull();
  });

  it("renders not found state when project slug does not exist", async () => {
    render(
      <MemoryRouter initialEntries={["/projects/non-existent-project-xyz"]}>
        <ThemeProvider>
          <Routes>
            <Route path="/projects/:slug" element={<ProjectPage />} />
          </Routes>
        </ThemeProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/project not found/i)).not.toBeNull();
    });

    expect(screen.getByRole("link", { name: /view all projects/i })).not.toBeNull();
  });
});
