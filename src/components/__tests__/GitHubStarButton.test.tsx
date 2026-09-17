// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { GitHubStarButton, GitHubStarBadge } from "../GitHubStarButton";
import { parseGitHubRepo } from "../../lib/useGitHubStars";

describe("parseGitHubRepo helper", () => {
  it("parses valid github url to owner and repo", () => {
    expect(parseGitHubRepo("https://github.com/pyaephyomaungdev/portfolio")).toEqual({
      owner: "pyaephyomaungdev",
      repo: "portfolio",
    });
  });

  it("strips trailing .git suffix", () => {
    expect(parseGitHubRepo("https://github.com/pyaephyomaungdev/json-link.git")).toEqual({
      owner: "pyaephyomaungdev",
      repo: "json-link",
    });
  });

  it("returns null for non-github or invalid URLs", () => {
    expect(parseGitHubRepo("https://gitlab.com/user/project")).toBeNull();
    expect(parseGitHubRepo("not a url")).toBeNull();
    expect(parseGitHubRepo(null)).toBeNull();
    expect(parseGitHubRepo(undefined)).toBeNull();
  });
});

describe("GitHubStar UI Components", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("GitHubStarButton renders anchor tag with correct href", () => {
    render(<GitHubStarButton repoUrl="https://github.com/pyaephyomaungdev/portfolio" />);

    const link = screen.getByRole("link", { name: /star/i });
    expect(link).not.toBeNull();
    expect(link.getAttribute("href")).toBe("https://github.com/pyaephyomaungdev/portfolio");
    expect(link.getAttribute("target")).toBe("_blank");
  });

  it("GitHubStarBadge renders button with star title and opens repo on click", () => {
    window.open = vi.fn();

    render(<GitHubStarBadge repoUrl="https://github.com/pyaephyomaungdev/json-link" />);

    const button = screen.getByRole("button");
    expect(button).not.toBeNull();
    expect(button.getAttribute("title")).toContain("Star this repository on GitHub");

    fireEvent.click(button);
    expect(window.open).toHaveBeenCalledWith(
      "https://github.com/pyaephyomaungdev/json-link",
      "_blank",
      "noopener,noreferrer"
    );
  });
});
