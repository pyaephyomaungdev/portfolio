import { useState } from "react";
import { AdminModal } from "../AdminModal";
import { Checkbox } from "../Checkbox";
import type { Project } from "../../../types/portfolio";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (project: Project) => void;
}

export function AddProjectModal({ isOpen, onClose, onAdd }: AddProjectModalProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [techStack, setTechStack] = useState("");
  const [url, setUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [period, setPeriod] = useState("");
  const [featured, setFeatured] = useState(false);
  const [buyMeACoffee, setBuyMeACoffee] = useState(false);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, "-")) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    }
  }

  function handleSubmit() {
    if (!title.trim()) return;
    const finalSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const stack = techStack.split(",").map((s) => s.trim()).filter(Boolean);
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      slug: finalSlug,
      summary: summary.trim() || null,
      body: null,
      period: period.trim() || null,
      url: url.trim() || null,
      repoUrl: repoUrl.trim() || null,
      language: stack[0] || null,
      techStack: stack,
      featured,
      buyMeACoffee,
      sortOrder: 0,
    };

    onAdd(newProj);
    setTitle("");
    setSlug("");
    setSummary("");
    setTechStack("");
    setUrl("");
    setRepoUrl("");
    setPeriod("");
    setFeatured(false);
    setBuyMeACoffee(false);
    onClose();
  }

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Project"
      eyebrow="// NEW WORK"
      onSubmit={handleSubmit}
      submitLabel="Add Project"
      submitDisabled={!title.trim()}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">
            Project Title *
          </label>
          <input
            type="text"
            placeholder="e.g. JSON Link"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">
              URL Slug
            </label>
            <input
              type="text"
              placeholder="e.g. json-link"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">
              Timeline / Year
            </label>
            <input
              type="text"
              placeholder="e.g. 2026"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition font-mono"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">
            Summary
          </label>
          <textarea
            rows={2}
            placeholder="Brief overview and architectural approach..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">
            Tech Stack (comma separated)
          </label>
          <input
            type="text"
            placeholder="TypeScript, React, Tailwind CSS, Vite"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition font-mono"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">
              Live Demo URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">
              GitHub Repo URL
            </label>
            <input
              type="url"
              placeholder="https://github.com/..."
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
            />
          </div>
        </div>
        <div className="pt-1 space-y-2">
          <Checkbox
            checked={featured}
            onChange={setFeatured}
            label="Highlight as Featured on Homepage"
          />
          <Checkbox
            checked={buyMeACoffee}
            onChange={setBuyMeACoffee}
            label="Enable 'Buy Me a Coffee' on Project Page"
          />
        </div>
      </div>
    </AdminModal>
  );
}
