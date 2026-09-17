import React from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Parses inline formatting: **bold**, *italic*, `code`, and [link](url)
 */
function renderInline(text: string): React.ReactNode[] {
  const tokenRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={index} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={index}
          className="rounded bg-soft px-1.5 py-0.5 font-mono text-xs text-ink border border-rule"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, linkText, url] = linkMatch;
      const isExternal = url.startsWith("http://") || url.startsWith("https://");
      return (
        <a
          key={index}
          href={url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="font-medium text-accent underline underline-offset-4 hover:opacity-80 transition"
        >
          {linkText}
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];

  function flushList() {
    if (!currentList) return;
    const ListTag = currentList.type;
    const listIndex = elements.length;
    elements.push(
      <ListTag
        key={`list-${listIndex}`}
        className={`my-3 space-y-1 text-sm text-ink leading-relaxed ${
          currentList.type === "ul" ? "list-disc list-inside" : "list-decimal list-inside"
        }`}
      >
        {currentList.items.map((item, idx) => (
          <li key={idx} className="pl-1">
            {renderInline(item)}
          </li>
        ))}
      </ListTag>
    );
    currentList = null;
  }

  function flushCodeBlock() {
    if (!inCodeBlock) return;
    const codeIndex = elements.length;
    elements.push(
      <pre
        key={`code-${codeIndex}`}
        className="my-3 overflow-x-auto rounded-xl border border-rule bg-soft p-3 font-mono text-xs text-ink leading-relaxed"
      >
        <code>{codeBlockLines.join("\n")}</code>
      </pre>
    );
    inCodeBlock = false;
    codeBlockLines = [];
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    // Code block fences
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock();
      } else {
        flushList();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      return;
    }

    // Empty line
    if (!trimmed) {
      flushList();
      return;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h4 key={`h3-${i}`} className="mt-4 mb-2 text-base font-semibold text-ink tracking-tight">
          {renderInline(trimmed.slice(4))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h3 key={`h2-${i}`} className="mt-5 mb-2 font-display text-xl sm:text-2xl text-ink tracking-tight">
          {renderInline(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      flushList();
      elements.push(
        <h2 key={`h1-${i}`} className="mt-6 mb-3 font-display text-2xl sm:text-3xl text-ink tracking-tight">
          {renderInline(trimmed.slice(2))}
        </h2>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      flushList();
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-3 border-l-2 border-accent pl-3 italic text-sm text-muted leading-relaxed"
        >
          {renderInline(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    // Unordered list item
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!currentList || currentList.type !== "ul") {
        flushList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(trimmed.slice(2));
      return;
    }

    // Ordered list item
    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)/);
    if (orderedMatch) {
      if (!currentList || currentList.type !== "ol") {
        flushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(orderedMatch[1]);
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${i}`} className="my-2 text-sm text-ink leading-relaxed">
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList();
  flushCodeBlock();

  return <div className={className || undefined}>{elements}</div>;
}
