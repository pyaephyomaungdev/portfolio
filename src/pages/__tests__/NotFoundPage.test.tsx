// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NotFoundPage } from "../NotFoundPage";
import { ThemeProvider } from "../../context/ThemeContext";

describe("NotFoundPage Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders 404 error header and Back to Home navigation link", () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <NotFoundPage />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("// 404 ERROR")).not.toBeNull();
    expect(screen.getByText("Page Not Found")).not.toBeNull();
    expect(screen.getByRole("link", { name: /back to home/i })).not.toBeNull();
    expect(screen.getByRole("link", { name: /explore projects/i })).not.toBeNull();
  });
});
