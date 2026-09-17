// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { TechIcon } from "../TechIcon";

describe("TechIcon UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders SVG icon for React", () => {
    const { container } = render(<TechIcon name="React" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders SVG icon for TypeScript", () => {
    const { container } = render(<TechIcon name="TypeScript" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });

  it("renders SVG icon for Cloudflare", () => {
    const { container } = render(<TechIcon name="Cloudflare" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });

  it("renders fallback SVG for unknown technology", () => {
    const { container } = render(<TechIcon name="UnknownTech123" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });
});
