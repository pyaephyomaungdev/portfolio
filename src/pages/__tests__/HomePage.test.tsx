// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomePage } from "../HomePage";
import { ThemeProvider } from "../../context/ThemeContext";

describe("HomePage Component", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders hero profile information, headline, and bio", () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <HomePage />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getAllByText("Pyae Phyo Maung").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Software Engineer|Full-Stack/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Selected work")).not.toBeNull();
    expect(screen.getByText("Career")).not.toBeNull();
  });

  it("renders contact form section and quick channels", () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <HomePage />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("Direct Message Dispatch")).not.toBeNull();
    expect(screen.getByRole("button", { name: /send note/i })).not.toBeNull();
  });
});
