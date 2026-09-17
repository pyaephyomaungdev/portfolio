// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MarkdownRenderer } from "../MarkdownRenderer";

describe("MarkdownRenderer UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders headers and paragraphs", () => {
    const markdown = `# Main Title\n\n## Subtitle Heading\n\nThis is a normal paragraph.`;
    render(<MarkdownRenderer content={markdown} />);

    expect(screen.getByRole("heading", { level: 2, name: /main title/i })).not.toBeNull();
    expect(screen.getByRole("heading", { level: 3, name: /subtitle heading/i })).not.toBeNull();
    expect(screen.getByText("This is a normal paragraph.")).not.toBeNull();
  });

  it("renders inline bold, italic, code, and links", () => {
    const markdown = `Here is **bold text**, *italic text*, \`code snippet\`, and [My Website](https://pyaephyomaung.dev).`;
    render(<MarkdownRenderer content={markdown} />);

    expect(screen.getByText("bold text")).not.toBeNull();
    expect(screen.getByText("italic text")).not.toBeNull();
    expect(screen.getByText("code snippet")).not.toBeNull();

    const link = screen.getByRole("link", { name: /my website/i });
    expect(link).not.toBeNull();
    expect(link.getAttribute("href")).toBe("https://pyaephyomaung.dev");
  });

  it("renders blockquotes, unordered lists, and ordered lists", () => {
    const markdown = `> Important architectural note\n\n- Bullet item 1\n- Bullet item 2\n\n1. Numbered item 1\n2. Numbered item 2`;
    render(<MarkdownRenderer content={markdown} />);

    expect(screen.getByText("Important architectural note")).not.toBeNull();
    expect(screen.getByText("Bullet item 1")).not.toBeNull();
    expect(screen.getByText("Bullet item 2")).not.toBeNull();
    expect(screen.getByText("Numbered item 1")).not.toBeNull();
    expect(screen.getByText("Numbered item 2")).not.toBeNull();
  });

  it("renders fenced code blocks", () => {
    const markdown = "```\nconst x = 42;\nconsole.log(x);\n```";
    render(<MarkdownRenderer content={markdown} />);

    expect(screen.getByText(/const x = 42;/)).not.toBeNull();
  });
});
