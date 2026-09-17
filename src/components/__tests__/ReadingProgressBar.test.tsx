// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { ReadingProgressBar } from "../ReadingProgressBar";

describe("ReadingProgressBar Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders without crashing", () => {
    const { container } = render(<ReadingProgressBar />);
    expect(container).toBeDefined();
  });
});
