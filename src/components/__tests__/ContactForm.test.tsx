// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { ContactForm } from "../ContactForm";
import { initialPortfolioData } from "../../data/portfolioData";

describe("ContactForm UI Component", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const mockProfile = initialPortfolioData.profile;

  it("renders form inputs, labels, and submit button", () => {
    render(<ContactForm profile={mockProfile} />);

    expect(screen.getByLabelText(/your name \/ team/i)).not.toBeNull();
    expect(screen.getByLabelText(/your email address/i)).not.toBeNull();
    expect(screen.getByLabelText(/message \/ project scope/i)).not.toBeNull();
    expect(screen.getByRole("button", { name: /send note/i })).not.toBeNull();
  });

  it("honeypot input field is present and off-screen for bots", () => {
    render(<ContactForm profile={mockProfile} />);
    const trap = screen.getByLabelText(/do not fill this field/i);
    expect(trap).not.toBeNull();
    expect(trap.getAttribute("tabIndex")).toBe("-1");
  });

  it("shows success feedback when API returns 200 OK", async () => {
    // Mock successful fetch response
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<ContactForm profile={mockProfile} />);

    fireEvent.change(screen.getByLabelText(/your name \/ team/i), { target: { value: "Alex" } });
    fireEvent.change(screen.getByLabelText(/your email address/i), { target: { value: "alex@example.com" } });
    fireEvent.change(screen.getByLabelText(/message \/ project scope/i), { target: { value: "Let's build something." } });

    fireEvent.click(screen.getByRole("button", { name: /send note/i }));

    await waitFor(() => {
      expect(screen.getByText(/note dispatched successfully!/i)).not.toBeNull();
    });

    const statusBox = screen.getByRole("status");
    expect(statusBox).not.toBeNull();
    expect(statusBox.getAttribute("aria-live")).toBe("polite");
  });

  it("shows fallback reachout UI when API returns error", async () => {
    // Mock failure response
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Telegram service temporarily offline" }),
    } as Response);

    // Mock window.open
    const originalOpen = window.open;
    window.open = vi.fn();

    render(<ContactForm profile={mockProfile} />);

    fireEvent.change(screen.getByLabelText(/your name \/ team/i), { target: { value: "Dev Team" } });
    fireEvent.change(screen.getByLabelText(/your email address/i), { target: { value: "team@company.com" } });
    fireEvent.change(screen.getByLabelText(/message \/ project scope/i), { target: { value: "Project inquiry." } });

    fireEvent.click(screen.getByRole("button", { name: /send note/i }));

    await waitFor(() => {
      expect(screen.getByText(/note prepared for direct reachout!/i)).not.toBeNull();
    });

    window.open = originalOpen;
  });

  it("resets the form when 'Send Another Note' button is clicked", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<ContactForm profile={mockProfile} />);

    fireEvent.change(screen.getByLabelText(/your name \/ team/i), { target: { value: "Alex" } });
    fireEvent.change(screen.getByLabelText(/your email address/i), { target: { value: "alex@example.com" } });
    fireEvent.change(screen.getByLabelText(/message \/ project scope/i), { target: { value: "Hi there" } });

    fireEvent.click(screen.getByRole("button", { name: /send note/i }));

    await waitFor(() => {
      expect(screen.getByText(/send another note/i)).not.toBeNull();
    });

    fireEvent.click(screen.getByRole("button", { name: /send another note/i }));

    expect(screen.getByLabelText(/your name \/ team/i)).not.toBeNull();
  });
});
