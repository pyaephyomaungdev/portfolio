// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { BackToTopButton } from "../BackToTopButton";

describe("BackToTopButton UI Component", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("is hidden when window.scrollY is at 0", () => {
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    const { container } = render(<BackToTopButton />);

    expect(container.firstChild).toBeNull();
  });

  it("becomes visible when window.scrollY exceeds 400px", () => {
    render(<BackToTopButton />);

    Object.defineProperty(window, "scrollY", { value: 500, writable: true });
    fireEvent.scroll(window);

    const button = screen.getByRole("button", { name: /back to top/i });
    expect(button).not.toBeNull();
  });

  it("calls window.scrollTo({ top: 0, behavior: 'smooth' }) on click", () => {
    window.scrollTo = vi.fn();

    render(<BackToTopButton />);

    Object.defineProperty(window, "scrollY", { value: 600, writable: true });
    fireEvent.scroll(window);

    const button = screen.getByRole("button", { name: /back to top/i });
    fireEvent.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
