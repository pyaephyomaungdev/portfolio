import React, { useState, useRef } from "react";
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
  Table,
  Image as ImageIcon,
  PenTool,
  UploadCloud,
  X,
  Loader2,
  Folder,
  Check,
} from "lucide-react";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { uploadAssetImage } from "../../lib/api";
import { sanitizeUrl } from "../../lib/sanitizeUrl";

const ExcalidrawCanvasModal = React.lazy(() => import("./ExcalidrawCanvasModal"));

interface WebEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  minHeight?: string;
}

const PRESET_FOLDERS = ["projects", "case-studies", "articles", "diagrams", "general"];

export function WebEditor({
  value,
  onChange,
  placeholder = "Write your content in markdown format...",
  label = "Content Web Editor",
  minHeight = "min-h-56",
}: WebEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Modals state
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageFolder, setImageFolder] = useState("projects");
  const [imageAlt, setImageAlt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadMsg, setImageUploadMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [showExcalidrawModal, setShowExcalidrawModal] = useState(false);

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

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

    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const updated = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(end + prefix.length, end + prefix.length);
    }, 0);
  }

  function insertTextAtCursor(textToInsert: string) {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value ? `${value}\n\n${textToInsert}` : textToInsert);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updated = value.substring(0, start) + textToInsert + value.substring(end);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }

  function insertTable() {
    const tableTemplate = `| Column 1 | Column 2 | Column 3 |
| :--- | :---: | ---: |
| Item 1 | Value A | 100% |
| Item 2 | Value B | 200% |
`;
    insertTextAtCursor(tableTemplate);
  }

  function applyTemplate(type: "essay" | "callout" | "list" | "table" | "diagram") {
    let template = "";
    if (type === "essay") {
      template = `## Introduction\n\nWrite a compelling overview of your architectural thoughts or essay.\n\n### Key Principles\n\n- **Principle 1**: Clear separation of client and server state\n- **Principle 2**: Minimal external dependencies\n\n> "Simplicity is prerequisite for reliability."\n`;
    } else if (type === "callout") {
      template = `> **Important Note**: This section highlights critical announcements or engineering guidelines.\n`;
    } else if (type === "list") {
      template = `### Highlights\n\n1. Built high-performance micro-frontends\n2. Reduced initial bundle to < 350 kB\n3. Zero database local storage synchronization\n`;
    } else if (type === "table") {
      template = `| Parameter | Type | Default | Description |
| :--- | :--- | :---: | ---: |
| \`endpoint\` | string | \`"/api"\` | Edge gateway route destination |
| \`timeout\` | number | \`5000\` | Max request latency in ms |
| \`retries\` | integer | \`3\` | Exponential backoff attempts |
`;
    } else if (type === "diagram") {
      template = `\`\`\`excalidraw
<svg viewBox="0 0 520 120" width="100%" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="25" width="130" height="70" rx="8" fill="#f4f4f6" stroke="#dcdce2" stroke-width="1.5"/>
  <text x="75" y="65" font-family="monospace" font-size="13" text-anchor="middle" fill="#18181b">Client App</text>
  <path d="M 140 60 L 190 60" stroke="#0284c7" stroke-width="2"/>
  <rect x="190" y="25" width="140" height="70" rx="8" fill="#f4f4f6" stroke="#dcdce2" stroke-width="1.5"/>
  <text x="260" y="65" font-family="monospace" font-size="13" text-anchor="middle" fill="#18181b">Edge Worker</text>
  <path d="M 330 60 L 380 60" stroke="#0284c7" stroke-width="2"/>
  <rect x="380" y="25" width="130" height="70" rx="8" fill="#f4f4f6" stroke="#dcdce2" stroke-width="1.5"/>
  <text x="445" y="65" font-family="monospace" font-size="13" text-anchor="middle" fill="#18181b">Distributed DB</text>
</svg>
\`\`\`
`;
    }

    const updated = value ? `${value}\n\n${template}` : template;
    onChange(updated);
  }

  // Handle local image file upload
  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadMsg(null);
    setUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.addEventListener("load", async (event) => {
        try {
          const dataUrl = event.target?.result as string;
          const result = await uploadAssetImage({
            dataUrl,
            fileName: file.name,
            folder: imageFolder.trim() || "general",
          });
          setImageUrl(result.url);
          setImageUploadMsg({
            type: "success",
            text: `Uploaded to ${result.url}`,
          });
          if (!imageAlt) {
            setImageAlt(file.name.replace(/\.[^/.]+$/, ""));
          }
        } catch (err: unknown) {
          setImageUploadMsg({
            type: "error",
            text: err instanceof Error ? err.message : "Failed to upload image",
          });
        } finally {
          setUploadingImage(false);
        }
      });
      reader.readAsDataURL(file);
    } catch {
      setUploadingImage(false);
      setImageUploadMsg({ type: "error", text: "Error reading file" });
    }
  }

  function handleInsertImage() {
    if (!imageUrl.trim()) return;
    const alt = imageAlt.trim() || "Image";
    const markdownImg = `![${alt}](${imageUrl.trim()})\n`;
    insertTextAtCursor(markdownImg);
    setShowImageModal(false);
    setImageUrl("");
    setImageAlt("");
    setImageUploadMsg(null);
  }

  return (
    <div className="rounded-xl border border-rule bg-paper overflow-hidden shadow-xs relative">
      {/* Header bar: Label & Architectural Underline Tab Switcher */}
      <div className="flex items-center justify-between border-b border-rule bg-soft/40 px-3 pt-2 pb-0">
        <div className="flex items-center gap-2 pb-2">
          <Edit3 className="h-4 w-4 text-muted" />
          <span className="text-xs font-semibold text-ink uppercase tracking-wider font-mono">
            {label}
          </span>
        </div>

        {/* Underline Tabs */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border-b-2 transition cursor-pointer ${
              activeTab === "write"
                ? "border-accent text-ink font-semibold -mb-px"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            <Edit3 className="h-3 w-3" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border-b-2 transition cursor-pointer ${
              activeTab === "preview"
                ? "border-accent text-ink font-semibold -mb-px"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            <Eye className="h-3 w-3" />
            <span>Preview</span>
          </button>
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

          <span className="h-3.5 w-px bg-rule mx-1" aria-hidden="true" />

          {/* Table Toolbar Button */}
          <button
            type="button"
            title="Insert Table (| col | col |)"
            onClick={insertTable}
            className="rounded p-1.5 hover:bg-soft hover:text-ink transition cursor-pointer"
          >
            <Table className="h-3.5 w-3.5" />
          </button>

          {/* Image Asset Upload Button */}
          <button
            type="button"
            title="Insert Image (Upload to Assets folder)"
            onClick={() => setShowImageModal(true)}
            className="rounded p-1.5 hover:bg-soft hover:text-ink transition cursor-pointer"
          >
            <ImageIcon className="h-3.5 w-3.5" />
          </button>

          {/* Excalidraw Diagram Button */}
          <button
            type="button"
            title="Insert Excalidraw Diagram"
            onClick={() => setShowExcalidrawModal(true)}
            className="rounded p-1.5 hover:bg-soft hover:text-ink transition cursor-pointer"
          >
            <PenTool className="h-3.5 w-3.5" />
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
            <button
              type="button"
              onClick={() => applyTemplate("table")}
              className="rounded border border-rule bg-soft px-1.5 py-0.5 text-xs font-mono text-ink hover:border-ink/40 transition cursor-pointer"
            >
              + Table
            </button>
            <button
              type="button"
              onClick={() => applyTemplate("diagram")}
              className="rounded border border-rule bg-soft px-1.5 py-0.5 text-xs font-mono text-ink hover:border-ink/40 transition cursor-pointer"
            >
              + Diagram
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
        <span>Markdown Supported (Tables, Images & Excalidraw)</span>
        <div className="flex items-center gap-3">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
      </div>

      {/* Image Asset Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-rule bg-paper shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-accent" />
                <h3 className="font-semibold text-sm text-ink">Upload Asset Image</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-muted hover:text-ink transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              {/* Custom Folder Name */}
              <div className="space-y-1">
                <label className="text-muted flex items-center gap-1 font-sans font-medium text-xs uppercase tracking-wider">
                  <Folder className="h-3 w-3 text-accent" />
                  Asset Subfolder:
                </label>
                <input
                  type="text"
                  value={imageFolder}
                  onChange={(e) => setImageFolder(e.target.value)}
                  placeholder="e.g. projects, articles, diagrams"
                  className="w-full rounded-md border border-rule bg-soft/40 px-2.5 py-1.5 text-ink focus:border-accent focus:outline-none"
                />
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <span className="text-xs text-muted">Presets:</span>
                  {PRESET_FOLDERS.map((folder) => (
                    <button
                      key={folder}
                      type="button"
                      onClick={() => setImageFolder(folder)}
                      className={`px-1.5 py-0.5 rounded text-xs transition cursor-pointer border ${
                        imageFolder === folder
                          ? "bg-accent/10 border-accent text-accent font-semibold"
                          : "border-rule bg-paper text-muted hover:text-ink"
                      }`}
                    >
                      {folder}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted font-sans pt-0.5">
                  Saved directly to: <code className="bg-soft px-1 rounded">public/assets/{imageFolder || "general"}/</code>
                </p>
              </div>

              {/* Alt Text */}
              <div className="space-y-1">
                <label className="text-muted font-sans font-medium text-xs uppercase tracking-wider">
                  Image Alt / Caption:
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="e.g. Architecture Overview Diagram"
                  className="w-full rounded-md border border-rule bg-soft/40 px-2.5 py-1.5 text-ink focus:border-accent focus:outline-none"
                />
              </div>

              {/* File Upload Zone */}
              <div className="space-y-1">
                <label className="text-muted font-sans font-medium text-xs uppercase tracking-wider">
                  Choose Image File:
                </label>
                <div className="relative rounded-lg border-2 border-dashed border-rule p-4 text-center hover:border-accent/60 transition bg-soft/20">
                  <input
                    type="file"
                    accept="image/*,.svg"
                    onChange={(e) => void handleImageFile(e)}
                    disabled={uploadingImage}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                    {uploadingImage ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin text-accent" />
                        <span className="text-xs text-muted">Uploading to /assets/{imageFolder}...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-5 w-5 text-muted" />
                        <span className="text-xs text-ink font-sans font-medium">Click or Drag & Drop to upload</span>
                        <span className="text-xs text-muted font-sans">PNG, JPG, WebP, GIF, SVG</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Or Direct URL */}
              <div className="space-y-1">
                <label className="text-muted font-sans font-medium text-xs uppercase tracking-wider">
                  Or Direct Image URL:
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="e.g. /assets/projects/system-flow.png"
                  className="w-full rounded-md border border-rule bg-soft/40 px-2.5 py-1.5 text-ink focus:border-accent focus:outline-none"
                />
              </div>

              {/* Status Message */}
              {imageUploadMsg && (
                <div
                  className={`rounded-md p-2 text-xs flex items-center gap-1.5 ${
                    imageUploadMsg.type === "success"
                      ? "bg-success-soft text-success border border-success/30"
                      : "bg-destructive-soft text-destructive border border-destructive/30"
                  }`}
                >
                  {imageUploadMsg.type === "success" && <Check className="h-3 w-3 shrink-0" />}
                  <span>{imageUploadMsg.text}</span>
                </div>
              )}

              {/* Preview Thumbnail */}
              {Boolean(imageUrl && sanitizeUrl(imageUrl)) && (
                <div className="rounded-lg border border-rule bg-paper p-2 flex items-center gap-2.5">
                  <img
                    src={sanitizeUrl(imageUrl)}
                    alt={imageAlt || "Preview"}
                    className="h-10 w-10 object-cover rounded border border-rule shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div className="truncate text-xs font-mono text-muted">
                    <span className="text-ink font-semibold block">{imageUrl}</span>
                    <span>{imageAlt || "No alt text"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-rule pt-3">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-3 py-1.5 rounded-lg border border-rule text-xs font-mono text-muted hover:text-ink transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                disabled={!imageUrl.trim()}
                className="px-3 py-1.5 rounded-lg bg-ink text-paper text-xs font-mono font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Fullscreen Excalidraw Canvas Modal */}
      {showExcalidrawModal && (
        <React.Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper/80 backdrop-blur-xs">
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-rule bg-paper shadow-lg">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
                <span className="text-xs font-mono text-ink">Opening Excalidraw Studio...</span>
              </div>
            </div>
          }
        >
          <ExcalidrawCanvasModal
            isOpen={showExcalidrawModal}
            onClose={() => setShowExcalidrawModal(false)}
            onInsert={(diagramMarkdown) => {
              insertTextAtCursor(diagramMarkdown);
              setShowExcalidrawModal(false);
            }}
          />
        </React.Suspense>
      )}
    </div>
  );
}
