import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Code,
  Link,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Eye,
  Edit3,
  Sparkles,
} from "lucide-react";
import { MarkdownRenderer } from "../MarkdownRenderer";

interface WebEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  minHeight?: string;
}

export function WebEditor({
  value,
  onChange,
  placeholder = "Write your content in markdown format...",
  label = "Content Web Editor",
  minHeight = "min-h-56",
}: WebEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  /**
   * Helper to wrap or insert text around current selection
   */
  function insertFormatting(prefix: string, suffix = "", defaultText = "text") {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const replacement = selected ? `${prefix}${selected}${suffix}` : `${prefix}${defaultText}${suffix}`;

    const updated = value.substring(0, start) + replacement + value.substring(end);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + (selected ? selected.length : defaultText.length);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }

  function insertLinePrefix(prefix: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Find the beginning of the line
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const updated = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(end + prefix.length, end + prefix.length);
    }, 0);
  }

  function applyTemplate(type: "essay" | "callout" | "list") {
    let template = "";
    if (type === "essay") {
      template = `## Introduction\n\nWrite a compelling overview of your architectural thoughts or essay.\n\n### Key Principles\n\n- **Principle 1**: Clear separation of client and server state\n- **Principle 2**: Minimal external dependencies\n\n> "Simplicity is prerequisite for reliability."\n`;
    } else if (type === "callout") {
      template = `> **Important Note**: This section highlights critical announcements or engineering guidelines.\n`;
    } else if (type === "list") {
      template = `### Highlights\n\n1. Built high-performance micro-frontends\n2. Reduced initial bundle to < 350 kB\n3. Zero database local storage synchronization\n`;
    }

    const updated = value ? `${value}\n\n${template}` : template;
    onChange(updated);
  }

  return (
    <div className="rounded-xl border border-rule bg-paper overflow-hidden shadow-xs">
      {/* Header bar: Label, Tab Switcher, and Quick Templates */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule bg-soft/60 px-3 py-2">
        <div className="flex items-center gap-2">
          <Edit3 className="h-4 w-4 text-muted" />
          <span className="text-xs font-semibold text-ink uppercase tracking-wider font-mono">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Write / Preview Tab Switcher */}
          <div className="inline-flex rounded-lg border border-rule bg-paper p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("write")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 transition cursor-pointer ${
                activeTab === "write"
                  ? "bg-ink text-paper font-semibold shadow-xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Edit3 className="h-3 w-3" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 transition cursor-pointer ${
                activeTab === "preview"
                  ? "bg-ink text-paper font-semibold shadow-xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Eye className="h-3 w-3" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formatting Toolbar (Only in write mode) */}
      {activeTab === "write" ? (
        <div className="flex flex-wrap items-center gap-1 border-b border-rule bg-paper px-2 py-1.5 text-muted">
          <button
            type="button"
            title="Bold (**text**)"
            onClick={() => insertFormatting("**", "**", "bold text")}
            className="rounded p-1.5 hover:bg-soft hover:text-ink transition cursor-pointer"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Italic (*text*)"
            onClick={() => insertFormatting("*", "*", "italic text")}
            className="rounded p-1.5 hover:bg-soft hover:text-ink transition cursor-pointer"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Inline Code (`code`)"
            onClick={() => insertFormatting("`", "`", "code")}
            className="rounded p-1.5 hover:bg-soft hover:text-ink transition cursor-pointer"
          >
            <Code className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Link ([title](url))"
            onClick={() => insertFormatting("[", "](https://example.com)", "link title")}
            className="rounded p-1.5 hover:bg-soft hover:text-ink transition cursor-pointer"
          >
            <Link className="h-3.5 w-3.5" />
          </button>

          <span className="h-3.5 w-px bg-rule mx-1" aria-hidden="true" />

          <button
            type="button"
            title="Heading 2 (## )"
            onClick={() => insertLinePrefix("## ")}
            className="rounded p-1.5 hover:bg-soft hover:text-ink transition cursor-pointer"
          >
            <Heading2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Heading 3 (### )"
            onClick={() => insertLinePrefix("### ")}
            className="rounded p-1.5 hover:bg-soft hover:text-ink transition cursor-pointer"
          >
            <Heading3 className="h-3.5 w-3.5" />
          </button>

          <span className="h-3.5 w-px bg-rule mx-1" aria-hidden="true" />

          <button
            type="button"
            title="Bullet List (- )"
            onClick={() => insertLinePrefix("- ")}
            className="rounded p-1.5 hover:bg-soft hover:text-ink transition cursor-pointer"
          >
            <List className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Numbered List (1. )"
            onClick={() => insertLinePrefix("1. ")}
            className="rounded p-1.5 hover:bg-soft hover:text-ink transition cursor-pointer"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Blockquote (> )"
            onClick={() => insertLinePrefix("> ")}
            className="rounded p-1.5 hover:bg-soft hover:text-ink transition cursor-pointer"
          >
            <Quote className="h-3.5 w-3.5" />
          </button>

          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-xs text-muted font-mono mr-1">Starters:</span>
            <button
              type="button"
              onClick={() => applyTemplate("essay")}
              className="rounded border border-rule bg-soft px-1.5 py-0.5 text-xs font-mono text-ink hover:border-ink/40 transition cursor-pointer"
            >
              + Essay
            </button>
            <button
              type="button"
              onClick={() => applyTemplate("callout")}
              className="rounded border border-rule bg-soft px-1.5 py-0.5 text-xs font-mono text-ink hover:border-ink/40 transition cursor-pointer"
            >
              + Callout
            </button>
          </div>
        </div>
      ) : null}

      {/* Editor Body */}
      {activeTab === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full p-3 font-mono text-xs text-ink bg-transparent focus:outline-none resize-y ${minHeight}`}
        />
      ) : (
        <div className={`p-4 bg-paper/60 ${minHeight}`}>
          {value.trim() ? (
            <MarkdownRenderer content={value} />
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-muted">
              <Sparkles className="h-6 w-6 opacity-30 mb-2" />
              <p className="text-xs">No content to preview yet. Switch to write mode to start drafting.</p>
            </div>
          )}
        </div>
      )}

      {/* Status Bar */}
      <div className="flex items-center justify-between border-t border-rule bg-soft/30 px-3 py-1.5 text-xs font-mono text-muted">
        <span>Markdown Supported</span>
        <div className="flex items-center gap-3">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
      </div>
    </div>
  );
}
