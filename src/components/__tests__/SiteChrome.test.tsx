// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SiteHeader, SiteFooter } from "../SiteChrome";
import { ThemeProvider } from "../../context/ThemeContext";

describe("SiteChrome UI Components", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("SiteHeader renders display name and navigation items", () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <SiteHeader name="Pyae Phyo Maung" />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getAllByText("Pyae Phyo Maung").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Projects").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Experience").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Education").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Contact").length).toBeGreaterThanOrEqual(1);
  });

  it("SiteHeader triggers onOpenContact when contact button is clicked", () => {
    const handleOpenContact = vi.fn();
    render(
      <MemoryRouter>
        <ThemeProvider>
          <SiteHeader onOpenContact={handleOpenContact} />
        </ThemeProvider>
      </MemoryRouter>
    );

    // Click Contact navigation item
    const contactBtns = screen.getAllByText("Contact");
    fireEvent.click(contactBtns[0]);

    expect(handleOpenContact).toHaveBeenCalled();
  });

  it("SiteFooter renders copyright year, name, and legal links", () => {
    const currentYear = new Date().getFullYear();
    render(
      <MemoryRouter>
        <SiteFooter name="Pyae Phyo Maung" />
      </MemoryRouter>
    );

    expect(screen.getByText(new RegExp(`© ${currentYear} Pyae Phyo Maung`))).not.toBeNull();
    expect(screen.getByText("Privacy")).not.toBeNull();
    expect(screen.getByText("Terms")).not.toBeNull();
    expect(screen.getByText("Cookies")).not.toBeNull();
  });
});
