// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ContactModal } from "../ContactModal";
import { initialPortfolioData } from "../../data/portfolioData";

describe("ContactModal UI Component", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <ContactModal isOpen={false} onClose={vi.fn()} profile={initialPortfolioData.profile} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders modal title, email address, and direct channel links when isOpen is true", () => {
    render(
      <ContactModal isOpen={true} onClose={vi.fn()} profile={initialPortfolioData.profile} />
    );

    expect(screen.getByText("Let's build together")).not.toBeNull();
    expect(screen.getByText("Telegram Direct")).not.toBeNull();
    expect(screen.getByText("GitHub")).not.toBeNull();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <ContactModal isOpen={true} onClose={handleClose} profile={initialPortfolioData.profile} />
    );

    const closeBtn = screen.getByRole("button", { name: /close dialog/i });
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    const handleClose = vi.fn();
    render(
      <ContactModal isOpen={true} onClose={handleClose} profile={initialPortfolioData.profile} />
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
