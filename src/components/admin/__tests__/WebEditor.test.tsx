// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { WebEditor } from "../WebEditor";

vi.mock("../ExcalidrawCanvasModal", () => ({
  default: ({
    isOpen,
    onClose,
    onInsert,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onInsert: (val: string) => void;
  }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="excalidraw-modal">
        <span>Excalidraw Studio</span>
        <button type="button" onClick={() => onInsert("```excalidraw\n<svg></svg>\n```\n")}>
          Insert Diagram
        </button>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    );
  },
}));

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

  it("renders underline tab styling on active tab", () => {
    render(
      <WebEditor
        value="Draft test content"
        onChange={vi.fn()}
      />
    );

    const writeTab = screen.getByRole("button", { name: /write/i });
    expect(writeTab.className).toContain("border-accent");

    const previewTab = screen.getByRole("button", { name: /preview/i });
    expect(previewTab.className).toContain("border-transparent");

    fireEvent.click(previewTab);
    expect(previewTab.className).toContain("border-accent");
    expect(writeTab.className).toContain("border-transparent");
  });

  it("inserts table template when clicking table toolbar button", () => {
    const handleChange = vi.fn();
    render(
      <WebEditor
        value=""
        onChange={handleChange}
      />
    );

    const tableBtn = screen.getByTitle(/insert table/i);
    fireEvent.click(tableBtn);

    expect(handleChange).toHaveBeenCalled();
    const inserted = handleChange.mock.calls[0][0];
    expect(inserted).toContain("| Column 1 | Column 2 | Column 3 |");
  });

  it("opens image asset modal and allows folder customization", () => {
    render(
      <WebEditor
        value=""
        onChange={vi.fn()}
      />
    );

    const imageBtn = screen.getByTitle(/insert image/i);
    fireEvent.click(imageBtn);

    expect(screen.getByText("Upload Asset Image")).not.toBeNull();
    expect(screen.getByPlaceholderText(/e\.g\. projects, articles, diagrams/i)).not.toBeNull();
    expect(screen.getByText("case-studies")).not.toBeNull();
  });

  it("opens excalidraw diagram modal and inserts diagram", async () => {
    const handleChange = vi.fn();
    render(
      <WebEditor
        value=""
        onChange={handleChange}
      />
    );

    const excalidrawBtn = screen.getByTitle(/insert excalidraw diagram/i);
    fireEvent.click(excalidrawBtn);

    expect(await screen.findByText("Excalidraw Studio")).not.toBeNull();
    const insertBtn = screen.getByRole("button", { name: /insert diagram/i });
    fireEvent.click(insertBtn);

    expect(handleChange).toHaveBeenCalledWith(expect.stringContaining("excalidraw"));
  });
});
