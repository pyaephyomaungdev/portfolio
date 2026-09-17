// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LegalPage } from "../LegalPage";
import { ThemeProvider } from "../../context/ThemeContext";

describe("LegalPage Component", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders Privacy Policy when type is privacy", () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <LegalPage type="privacy" />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Privacy Policy", level: 1 })).not.toBeNull();
    expect(screen.getByText(/information collection & usage/i)).not.toBeNull();
  });

  it("renders Terms of Service when type is terms", () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <LegalPage type="terms" />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Terms of Service", level: 1 })).not.toBeNull();
    expect(screen.getByText(/content & intellectual property/i)).not.toBeNull();
  });

  it("allows switching tabs between Privacy, Terms, and Cookies", () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <LegalPage type="privacy" />
        </ThemeProvider>
      </MemoryRouter>
    );

    const termsTab = screen.getByRole("button", { name: /terms/i });
    fireEvent.click(termsTab);

    expect(screen.getByRole("heading", { name: "Terms of Service", level: 1 })).not.toBeNull();

    const cookiesTab = screen.getByRole("button", { name: /cookies/i });
    fireEvent.click(cookiesTab);

    expect(screen.getByRole("heading", { name: "Cookie & Storage Policy", level: 1 })).not.toBeNull();
  });
});
