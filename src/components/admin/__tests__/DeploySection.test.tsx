// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { DeploySection } from "../sections/DeploySection";

describe("Admin DeploySection UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders deployment guide title and cloudflare dashboard link", () => {
    render(<DeploySection />);

    expect(screen.getAllByText("Deploy to Cloudflare Pages").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("link", { name: /cloudflare pages dashboard/i })).not.toBeNull();
    expect(screen.getAllByText(/npm run deploy/i).length).toBeGreaterThanOrEqual(1);
  });
});
