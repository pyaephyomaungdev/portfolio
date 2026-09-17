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

  it("renders markdown tables with headers and aligned cells", () => {
    const markdown = `| Column 1 | Column 2 |
| :--- | ---: |
| Value A | 100% |
| Value B | 200% |`;
    render(<MarkdownRenderer content={markdown} />);

    expect(screen.getByRole("table")).not.toBeNull();
    expect(screen.getByText("Column 1")).not.toBeNull();
    expect(screen.getByText("Column 2")).not.toBeNull();
    expect(screen.getByText("Value A")).not.toBeNull();
    expect(screen.getByText("100%")).not.toBeNull();
    expect(screen.getByText("Value B")).not.toBeNull();
    expect(screen.getByText("200%")).not.toBeNull();
  });

  it("renders markdown images with alt text and figure captions", () => {
    const markdown = `![Architecture Diagram](/assets/projects/architecture.png)`;
    render(<MarkdownRenderer content={markdown} />);

    const img = screen.getByRole("img", { name: /architecture diagram/i });
    expect(img).not.toBeNull();
    expect(img.getAttribute("src")).toBe("/assets/projects/architecture.png");
    expect(screen.getByText("Architecture Diagram")).not.toBeNull();
  });

  it("renders excalidraw codeblocks with SVG markup", () => {
    const markdown = `\`\`\`excalidraw
<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" /></svg>
\`\`\``;
    const { container } = render(<MarkdownRenderer content={markdown} />);

    expect(screen.getByText(/powered by excalidraw/i)).not.toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.querySelector("circle")).not.toBeNull();
  });
});
