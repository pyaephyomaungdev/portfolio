// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { BuyMeACoffeeButton, BuyMeACoffeeCard } from "../BuyMeACoffeeButton";

describe("BuyMeACoffee UI Components", () => {
  afterEach(() => {
    cleanup();
  });

  it("BuyMeACoffeeButton renders anchor link with official BMC target URL", () => {
    render(<BuyMeACoffeeButton url="https://www.buymeacoffee.com/pyaephyomaa" />);

    const link = screen.getByRole("link", { name: /buy me a coffee/i });
    expect(link).not.toBeNull();
    expect(link.getAttribute("href")).toBe("https://www.buymeacoffee.com/pyaephyomaa");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noreferrer");
  });

  it("BuyMeACoffeeCard renders support heading, card container, and call to action", () => {
    render(<BuyMeACoffeeCard url="https://www.buymeacoffee.com/pyaephyomaa" />);

    expect(screen.getByText(/support the creator/i)).not.toBeNull();
    expect(screen.getByText(/enjoying this project\?/i)).not.toBeNull();
    expect(screen.getByRole("link", { name: /buy me a coffee/i })).not.toBeNull();
  });
});
