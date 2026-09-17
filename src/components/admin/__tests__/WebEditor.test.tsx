// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { WebEditor } from "../WebEditor";

describe("WebEditor Admin Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders textarea, toolbar buttons, and word/char count", () => {
    render(
      <WebEditor
        value="Initial content for test."
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole("textbox")).not.toBeNull();
    expect(screen.getByText(/4 words/i)).not.toBeNull();
    expect(screen.getByText(/25 characters/i)).not.toBeNull();
    expect(screen.getByRole("button", { name: /write/i })).not.toBeNull();
    expect(screen.getByRole("button", { name: /preview/i })).not.toBeNull();
  });

  it("calls onChange when typing into the textarea", () => {
    const handleChange = vi.fn();
    render(
      <WebEditor
        value="Hello"
        onChange={handleChange}
      />
    );

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Hello world" } });

    expect(handleChange).toHaveBeenCalledWith("Hello world");
  });

  it("switches to preview mode and displays rendered markdown", () => {
    render(
      <WebEditor
        value="## Architectural Highlights\n\n- **Zero Backend**\n- Client Crypto"
        onChange={vi.fn()}
      />
    );

    const previewTab = screen.getByRole("button", { name: /preview/i });
    fireEvent.click(previewTab);

    // Textarea should not be rendered in preview tab
    expect(screen.queryByRole("textbox")).toBeNull();
    // Rendered markdown content should be visible
    expect(screen.getByRole("heading", { level: 3, name: /architectural highlights/i })).not.toBeNull();
    expect(screen.getByText("Zero Backend")).not.toBeNull();
  });

  it("inserts template starter when clicking + Essay", () => {
    const handleChange = vi.fn();
    render(
      <WebEditor
        value=""
        onChange={handleChange}
      />
    );

    const essayBtn = screen.getByRole("button", { name: /\+ essay/i });
    fireEvent.click(essayBtn);

    expect(handleChange).toHaveBeenCalled();
    const calledWith = handleChange.mock.calls[0][0];
    expect(calledWith).toContain("## Introduction");
  });
});
