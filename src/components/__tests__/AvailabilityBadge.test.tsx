// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { AvailabilityBadge } from "../AvailabilityBadge";
import type { AvailabilityConfig } from "../../types/portfolio";

describe("AvailabilityBadge UI Component", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const mockConfig: AvailabilityConfig = {
    enabled: true,
    status: "Available for Q2/Q3 2026",
    scope: "Full-Stack & Systems Architecture",
    timezone: "Asia/Bangkok",
    timezoneLabel: "BKK (UTC+7)",
    sla: "<12h Response",
  };

  it("renders beacon button and status text", () => {
    render(<AvailabilityBadge config={mockConfig} variant="corner" />);

    const badgeBtn = screen.getByRole("button");
    expect(badgeBtn).not.toBeNull();
    expect(badgeBtn.getAttribute("aria-label")).toContain("Available for Q2/Q3 2026");
  });

  it("does not render when config.enabled is false", () => {
    const disabledConfig = { ...mockConfig, enabled: false };
    const { container } = render(<AvailabilityBadge config={disabledConfig} />);
    expect(container.firstChild).toBeNull();
  });

  it("opens popover notch and shows details when clicked", () => {
    render(<AvailabilityBadge config={mockConfig} variant="corner" />);

    const badgeBtn = screen.getByRole("button");
    fireEvent.click(badgeBtn);

    expect(screen.getByText("Available for Q2/Q3 2026")).not.toBeNull();
    expect(screen.getByText("Full-Stack & Systems Architecture")).not.toBeNull();
    expect(screen.getByText("<12h Response")).not.toBeNull();
    expect(screen.getByText("BKK (UTC+7)")).not.toBeNull();
  });

  it("triggers onOpenContact callback when action button is clicked", () => {
    const handleOpenContact = vi.fn();
    render(<AvailabilityBadge config={mockConfig} onOpenContact={handleOpenContact} variant="corner" />);

    // Open popover
    fireEvent.click(screen.getByRole("button"));

    // Click contact button inside popover
    const contactBtn = screen.getByRole("button", { name: /get in touch/i });
    fireEvent.click(contactBtn);

    expect(handleOpenContact).toHaveBeenCalledTimes(1);
  });
});
