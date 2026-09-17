// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { scrollToId } from "../scrollToId";

describe("scrollToId helper", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("scrolls element into view when found in document", () => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 0;
    });

    const target = document.createElement("div");
    target.id = "projects";
    target.scrollIntoView = vi.fn();
    document.body.appendChild(target);

    scrollToId("projects");

    expect(target.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("handles non-existent id gracefully without throwing errors", () => {
    expect(() => scrollToId("non-existent-id", { attempts: 1 })).not.toThrow();
  });
});
