import { useState } from "react";
import {
  X,
  Check,
  PenTool,
  Folder,
  Loader2,
  FileCode,
  Image as ImageIcon,
} from "lucide-react";
import { Excalidraw, exportToSvg } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";
import { uploadAssetImage } from "../../lib/api";

interface ExcalidrawCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (markdown: string) => void;
  initialFolder?: string;
}

const PRESET_FOLDERS = ["diagrams", "architecture", "projects", "articles"];

export default function ExcalidrawCanvasModal({
  isOpen,
  onClose,
  onInsert,
  initialFolder = "diagrams",
}: ExcalidrawCanvasModalProps) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const [title, setTitle] = useState("Architecture Diagram");
  const [folder, setFolder] = useState(initialFolder);
  const [saveMode, setSaveMode] = useState<"svg" | "asset">("svg");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleInsert() {
    if (!excalidrawAPI) return;

    setErrorMsg(null);
    const elements = excalidrawAPI.getSceneElements();

    if (!elements || elements.length === 0) {
      setErrorMsg("Canvas is empty. Draw a diagram before inserting.");
      return;
    }

    setIsProcessing(true);
    try {
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();

      const svgElement = await exportToSvg({
        elements,
        appState: {
          ...appState,
          exportWithDarkMode: appState.theme === "dark",
          exportBackground: true,
        },
        files,
      });

      const svgString = svgElement.outerHTML;
      const cleanTitle = title.trim() || "Architecture Diagram";

      if (saveMode === "asset") {
        // Encode SVG string to base64 dataUrl
        const base64Svg = btoa(unescape(encodeURIComponent(svgString)));
        const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;
        const fileName = `${cleanTitle.toLowerCase().replace(/[^a-z0-9_-]/g, "-") || "diagram"}.svg`;

        const res = await uploadAssetImage({
          dataUrl,
          fileName,
          folder: folder.trim() || "diagrams",
        });

        onInsert(`![${cleanTitle}](${res.url})\n`);
      } else {
        // Directly embed SVG into markdown block
        const markdown = `\`\`\`excalidraw\n${svgString}\n\`\`\`\n`;
        onInsert(markdown);
      }

      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to export diagram");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper w-screen h-screen select-none overflow-hidden">
      {/* Top Architectural Header Bar */}
      <header className="h-14 shrink-0 flex items-center justify-between border-b border-rule bg-paper px-4 z-10 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 text-ink">
            <PenTool className="h-4 w-4 text-accent shrink-0" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider hidden sm:inline">
              Excalidraw Studio
            </span>
          </div>

          <span className="h-4 w-px bg-rule hidden sm:inline" aria-hidden="true" />

          {/* Diagram Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Diagram Title..."
            className="rounded-md border border-rule bg-soft/40 px-2.5 py-1 text-xs font-mono text-ink focus:border-accent focus:outline-none w-44 sm:w-56"
          />

          {/* Output Format Mode */}
          <div className="hidden md:flex items-center rounded-lg border border-rule bg-soft/60 p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setSaveMode("svg")}
              className={`px-2 py-0.5 rounded transition cursor-pointer flex items-center gap-1 ${
                saveMode === "svg"
                  ? "bg-ink text-paper font-semibold shadow-2xs"
                  : "text-muted hover:text-ink"
              }`}
              title="Embed raw SVG block into Markdown"
            >
              <FileCode className="h-3 w-3" />
              <span>Inline SVG</span>
            </button>
            <button
              type="button"
              onClick={() => setSaveMode("asset")}
              className={`px-2 py-0.5 rounded transition cursor-pointer flex items-center gap-1 ${
                saveMode === "asset"
                  ? "bg-ink text-paper font-semibold shadow-2xs"
                  : "text-muted hover:text-ink"
              }`}
              title="Save SVG to public/assets and insert as image markdown"
            >
              <ImageIcon className="h-3 w-3" />
              <span>Save to Assets</span>
            </button>
          </div>

          {/* Asset Subfolder Selector (Only in asset mode) */}
          {saveMode === "asset" && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono">
              <Folder className="h-3.5 w-3.5 text-accent shrink-0" />
              <input
                type="text"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                placeholder="Folder..."
                className="w-24 rounded border border-rule bg-soft/40 px-1.5 py-0.5 text-xs font-mono text-ink focus:border-accent focus:outline-none"
              />
              <div className="flex items-center gap-1">
                {PRESET_FOLDERS.slice(0, 2).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFolder(f)}
                    className={`px-1.5 py-0.5 rounded text-xs border ${
                      folder === f
                        ? "bg-accent/10 border-accent text-accent font-semibold"
                        : "border-rule text-muted hover:text-ink"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {errorMsg && (
            <span className="text-xs text-destructive font-mono hidden md:inline">
              {errorMsg}
            </span>
          )}

          <button
            type="button"
            onClick={handleInsert}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-mono font-medium text-paper hover:opacity-90 disabled:opacity-50 transition cursor-pointer shadow-xs"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5 text-accent" />
                <span>Insert Diagram</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-rule p-1.5 text-muted hover:text-ink hover:border-ink/40 transition cursor-pointer"
            title="Close Excalidraw Studio"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Fullscreen Interactive Drawing Canvas */}
      <div className="flex-1 w-full h-full relative overflow-hidden bg-white">
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          theme="light"
          UIOptions={{
            canvasActions: {
              saveToActiveFile: false,
              loadScene: true,
              export: { saveFileToDisk: true },
              toggleTheme: true,
            },
          }}
        />
      </div>
    </div>
  );
}
