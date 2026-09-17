// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { CustomItemDetailPage } from "../CustomItemDetailPage";
import { ThemeProvider } from "../../context/ThemeContext";

describe("CustomItemDetailPage Component", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders custom item article details for valid section and slug", async () => {
    render(
      <MemoryRouter initialEntries={["/custom/writing-labs/zero-leak-architecture"]}>
        <ThemeProvider>
          <Routes>
            <Route path="/custom/:sectionId/:slug" element={<CustomItemDetailPage />} />
          </Routes>
        </ThemeProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Zero-Leak Architecture: Designing Privacy-First Web Applications")
      ).not.toBeNull();
    });

    expect(screen.getByText(/Architectural Overview/i)).not.toBeNull();
    expect(screen.getByText(/Back to Architectural Writing & Research/i)).not.toBeNull();
    expect(screen.getByText(/Visit external publication/i)).not.toBeNull();
  });

  it("renders not found state when slug does not exist", async () => {
    render(
      <MemoryRouter initialEntries={["/custom/writing-labs/non-existent-entry-xyz"]}>
        <ThemeProvider>
          <Routes>
            <Route path="/custom/:sectionId/:slug" element={<CustomItemDetailPage />} />
          </Routes>
        </ThemeProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/article not found/i)).not.toBeNull();
    });

    expect(screen.getByRole("link", { name: /return to portfolio/i })).not.toBeNull();
  });
});
