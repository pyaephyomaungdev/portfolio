// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { IntroLoader } from "../IntroLoader";

describe("IntroLoader UI Component", () => {
  afterEach(() => {
    cleanup();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("does not render when intro has already been seen in sessionStorage", () => {
    sessionStorage.setItem("ppm_intro_seen", "true");

    const { container } = render(<IntroLoader />);
    expect(container.firstChild).toBeNull();
  });

  it("renders loader screen on fresh session", () => {
    const { container } = render(<IntroLoader />);
    expect(container.firstChild).not.toBeNull();
  });
});
