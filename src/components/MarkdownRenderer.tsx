import React, { useState } from "react";
import { Copy, Check, PenTool } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative group my-3">
      <pre className="overflow-x-auto rounded-xl border border-rule bg-soft p-3.5 font-mono text-xs text-ink leading-relaxed pr-16">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied code" : "Copy code"}
        className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-md border border-rule bg-white/90 px-2 py-1 text-xs font-mono text-muted shadow-2xs backdrop-blur-xs transition hover:border-accent/40 hover:text-accent cursor-pointer opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 text-accent" />
            <span className="text-accent">Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
}

function ExcalidrawBlock({ code }: { code: string }) {
  const trimmed = code.trim();
  const isSvg = trimmed.startsWith("<svg") || trimmed.includes("<svg");

  if (isSvg) {
    // Strip solid white backgrounds so the diagram has a completely transparent background
    const transparentSvg = trimmed
      .replace(/(<rect\b[^>]*\bfill=)["'](?:#ffffff|#fff|white)["']/gi, '$1"transparent"')
      .replace(/(<rect\b[^>]*\bx=["']0["'][^>]*\by=["']0["'][^>]*\bfill=)["'][^"']*["']/gi, '$1"transparent"');

    return (
      <figure className="my-8 flex flex-col items-center">
        <div
          className="w-full flex justify-center overflow-x-auto [&>svg]:max-w-full [&>svg]:h-auto bg-transparent"
          dangerouslySetInnerHTML={{ __html: transparentSvg }}
        />
        <figcaption className="mt-3 text-xs font-mono text-muted/60 select-none tracking-wide text-center">
          Powered by Excalidraw
        </figcaption>
      </figure>
    );
  }

  try {
    const data = JSON.parse(trimmed);
    const elements = Array.isArray(data) ? data : data.elements || [];
    return (
      <figure className="my-8 flex flex-col items-center">
        <div className="w-full py-6 text-center font-mono text-xs text-muted flex flex-col items-center gap-2 bg-transparent">
          <PenTool className="h-5 w-5 text-accent/60" />
          <span>Excalidraw Diagram ({elements.length} vector objects)</span>
        </div>
        <figcaption className="mt-2 text-xs font-mono text-muted/60 select-none tracking-wide text-center">
          Powered by Excalidraw
        </figcaption>
      </figure>
    );
  } catch {
    return <CodeBlock code={code} />;
  }
}

function isTableRow(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.length > 2;
}

function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  if (!isTableRow(trimmed)) return false;
  const inner = trimmed.slice(1, -1);
  const parts = inner.split("|");
  return parts.length > 0 && parts.every((p) => /^[\s:-]+$/.test(p) && p.includes("-"));
}

function parseTableCells(line: string): string[] {
  const trimmed = line.trim();
  return trimmed
    .slice(1, -1)
    .split("|")
    .map((c) => c.trim());
}

function parseAlignments(separatorLine: string): ("left" | "center" | "right")[] {
  const cells = parseTableCells(separatorLine);
  return cells.map((cell) => {
    const hasLeft = cell.startsWith(":");
    const hasRight = cell.endsWith(":");
    if (hasLeft && hasRight) return "center";
    if (hasRight) return "right";
    return "left";
  });
}

/**
 * Parses inline formatting: **bold**, *italic*, `code`, ![img](url), and [link](url)
 */
function renderInline(text: string): React.ReactNode[] {
  const tokenRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|!\[.*?\]\(.*?\)|\(?\[.*?\]\(.*?\))/g;
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

    const imgMatch = part.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      const [, altText, url] = imgMatch;
      return (
        <img
          key={index}
          src={url}
          alt={altText}
          className="inline-block max-w-full h-auto rounded border border-rule my-1 shadow-2xs"
          loading="lazy"
        />
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
  let codeBlockLang = "";
  let codeBlockLines: string[] = [];

  let currentTable: {
    headers: string[];
    alignments: ("left" | "center" | "right")[];
    rows: string[][];
  } | null = null;
  let pendingTableHeader: string[] | null = null;

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
    if (codeBlockLang === "excalidraw") {
      elements.push(
        <ExcalidrawBlock
          key={`excalidraw-${codeIndex}`}
          code={codeBlockLines.join("\n")}
        />
      );
    } else {
      elements.push(
        <CodeBlock
          key={`code-${codeIndex}`}
          code={codeBlockLines.join("\n")}
        />
      );
    }
    inCodeBlock = false;
    codeBlockLang = "";
    codeBlockLines = [];
  }

  function flushTable() {
    if (currentTable) {
      const tableIndex = elements.length;
      const { headers, alignments, rows } = currentTable;
      elements.push(
        <div key={`table-${tableIndex}`} className="my-4 overflow-x-auto rounded-lg border border-rule">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-soft/80 border-b border-rule">
              <tr>
                {headers.map((h, idx) => (
                  <th
                    key={idx}
                    style={{ textAlign: alignments[idx] || "left" }}
                    className="px-3.5 py-2 font-semibold text-ink whitespace-nowrap"
                  >
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-rule/60 bg-paper">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-soft/30 transition">
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      style={{ textAlign: alignments[cIdx] || "left" }}
                      className="px-3.5 py-2 text-ink whitespace-normal"
                    >
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = null;
    } else if (pendingTableHeader) {
      elements.push(
        <p key={`p-header-${elements.length}`} className="my-2 text-sm text-ink leading-relaxed">
          {renderInline(`| ${pendingTableHeader.join(" | ")} |`)}
        </p>
      );
      pendingTableHeader = null;
    }
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    // Code block inside
    if (inCodeBlock) {
      if (trimmed.startsWith("```")) {
        flushCodeBlock();
      } else {
        codeBlockLines.push(line);
      }
      return;
    }

    // Code block start
    if (trimmed.startsWith("```")) {
      flushList();
      flushTable();
      inCodeBlock = true;
      codeBlockLang = trimmed.slice(3).trim().toLowerCase();
      return;
    }

    // Table rows handling
    if (isTableRow(trimmed)) {
      if (!pendingTableHeader && !currentTable) {
        flushList();
        pendingTableHeader = parseTableCells(trimmed);
        return;
      }
      if (pendingTableHeader && isTableSeparator(trimmed)) {
        const alignments = parseAlignments(trimmed);
        currentTable = {
          headers: pendingTableHeader,
          alignments,
          rows: [],
        };
        pendingTableHeader = null;
        return;
      }
      if (currentTable) {
        currentTable.rows.push(parseTableCells(trimmed));
        return;
      }
    }

    // Non-table line encountered
    if (pendingTableHeader) {
      flushTable();
    }
    if (currentTable) {
      flushTable();
    }

    // Empty line
    if (!trimmed) {
      flushList();
      flushTable();
      return;
    }

    // Standalone image block
    const standaloneImgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (standaloneImgMatch) {
      flushList();
      flushTable();
      const [, altText, url] = standaloneImgMatch;
      elements.push(
        <figure key={`img-${i}`} className="my-5 space-y-2 text-center">
          <img
            src={url}
            alt={altText}
            className="rounded-xl border border-rule max-w-full h-auto mx-auto object-cover shadow-xs"
            loading="lazy"
          />
          {altText ? (
            <figcaption className="text-center font-mono text-xs text-muted">
              {altText}
            </figcaption>
          ) : null}
        </figure>
      );
      return;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      flushList();
      flushTable();
      elements.push(
        <h4 key={`h3-${i}`} className="mt-4 mb-2 text-base font-semibold text-ink tracking-tight">
          {renderInline(trimmed.slice(4))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      flushTable();
      elements.push(
        <h3 key={`h2-${i}`} className="mt-5 mb-2 font-display text-xl sm:text-2xl text-ink tracking-tight">
          {renderInline(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      flushList();
      flushTable();
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
      flushTable();
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
      flushTable();
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
      flushTable();
      if (!currentList || currentList.type !== "ol") {
        flushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(orderedMatch[1]);
      return;
    }

    // Regular paragraph
    flushList();
    flushTable();
    elements.push(
      <p key={`p-${i}`} className="my-2 text-sm text-ink leading-relaxed">
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList();
  flushTable();
  flushCodeBlock();

  return <div className={className || undefined}>{elements}</div>;
}
