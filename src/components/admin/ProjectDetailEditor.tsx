import { Link } from "react-router-dom";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { Checkbox } from "./Checkbox";
import { ReorderButtons, reorderArray } from "./ReorderButtons";
import type { Project, CaseStudy, ProjectMetric, SystemBlueprint, BlueprintNode, BlueprintConnection } from "../../types/portfolio";


interface ProjectDetailEditorProps {
  project: Project;
  onChange: (updated: Project) => void;
}

export function ProjectDetailEditor({ project, onChange }: ProjectDetailEditorProps) {
  const cs = project.caseStudy;

  function updateCaseStudy(patch: Partial<CaseStudy>) {
    const updatedCs: CaseStudy = {
      headline: cs?.headline || project.summary || "",
      problem: cs?.problem || "",
      constraints: cs?.constraints || "",
      decisions: cs?.decisions || [],
      outcome: cs?.outcome || "",
      metrics: cs?.metrics || [],
      architectureHighlights: cs?.architectureHighlights || [],
      ...patch,
    };
    onChange({ ...project, caseStudy: updatedCs });
  }

  function handleToggleCaseStudy(enable: boolean) {
    if (enable) {
      updateCaseStudy({
        headline: project.summary || "",
        problem: "",
        constraints: "",
        decisions: [],
        outcome: "",
        metrics: [],
        architectureHighlights: [],
      });
    } else {
      const next = { ...project };
      delete next.caseStudy;
      onChange(next);
    }
  }

  // Decisions helpers
  function handleAddDecision() {
    const decisions = [...(cs?.decisions || []), ""];
    updateCaseStudy({ decisions });
  }

  function handleUpdateDecision(index: number, value: string) {
    const decisions = [...(cs?.decisions || [])];
    decisions[index] = value;
    updateCaseStudy({ decisions });
  }

  function handleDeleteDecision(index: number) {
    const decisions = (cs?.decisions || []).filter((_, i) => i !== index);
    updateCaseStudy({ decisions });
  }

  function handleMoveDecision(index: number, direction: "up" | "down") {
    const decisions = reorderArray(cs?.decisions || [], index, direction);
    updateCaseStudy({ decisions });
  }

  // Architecture Highlights helpers
  function handleAddHighlight() {
    const architectureHighlights = [...(cs?.architectureHighlights || []), ""];
    updateCaseStudy({ architectureHighlights });
  }

  function handleUpdateHighlight(index: number, value: string) {
    const architectureHighlights = [...(cs?.architectureHighlights || [])];
    architectureHighlights[index] = value;
    updateCaseStudy({ architectureHighlights });
  }

  function handleDeleteHighlight(index: number) {
    const architectureHighlights = (cs?.architectureHighlights || []).filter((_, i) => i !== index);
    updateCaseStudy({ architectureHighlights });
  }

  function handleMoveHighlight(index: number, direction: "up" | "down") {
    const architectureHighlights = reorderArray(cs?.architectureHighlights || [], index, direction);
    updateCaseStudy({ architectureHighlights });
  }

  // Metrics helpers
  function handleAddMetric() {
    const newMetric: ProjectMetric = { label: "", value: "", description: "" };
    const metrics = [...(cs?.metrics || []), newMetric];
    updateCaseStudy({ metrics });
  }

  function handleUpdateMetric(index: number, patch: Partial<ProjectMetric>) {
    const metrics = [...(cs?.metrics || [])];
    metrics[index] = { ...metrics[index], ...patch };
    updateCaseStudy({ metrics });
  }

  function handleDeleteMetric(index: number) {
    const metrics = (cs?.metrics || []).filter((_, i) => i !== index);
    updateCaseStudy({ metrics });
  }

  function handleMoveMetric(index: number, direction: "up" | "down") {
    const metrics = reorderArray(cs?.metrics || [], index, direction);
    updateCaseStudy({ metrics });
  }

  // ── Blueprint helpers ──────────────────────────────────────────────────────
  function updateBlueprint(patch: Partial<SystemBlueprint>) {
    const base: SystemBlueprint = cs?.blueprint ?? {
      protocol: "",
      headline: "",
      description: "",
      nodes: [],
      connections: [],
    };
    updateCaseStudy({ blueprint: { ...base, ...patch } });
  }

  function handleToggleBlueprint(enable: boolean) {
    if (enable) {
      updateCaseStudy({
        blueprint: {
          protocol: "",
          headline: "",
          description: "",
          nodes: [],
          connections: [],
        },
      });
    } else {
      // Rebuild CaseStudy without blueprint to fully remove the key
      onChange({
        ...project,
        caseStudy: {
          headline: cs?.headline || "",
          problem: cs?.problem || "",
          constraints: cs?.constraints || "",
          decisions: cs?.decisions || [],
          outcome: cs?.outcome || "",
          metrics: cs?.metrics || [],
          architectureHighlights: cs?.architectureHighlights || [],
        },
      });
    }
  }

  function handleAddNode() {
    const newNode: BlueprintNode = {
      id: `node-${Date.now()}`,
      label: "",
      role: "",
      badge: "CLIENT",
    };
    updateBlueprint({ nodes: [...(cs?.blueprint?.nodes ?? []), newNode] });
  }

  function handleUpdateNode(idx: number, patch: Partial<BlueprintNode>) {
    const nodes = [...(cs?.blueprint?.nodes ?? [])];
    const oldId = nodes[idx].id;
    nodes[idx] = { ...nodes[idx], ...patch };
    // If id changed, cascade update connection references
    let connections = cs?.blueprint?.connections ?? [];
    if (patch.id && patch.id !== oldId) {
      connections = connections.map((c) => ({
        ...c,
        from: c.from === oldId ? (patch.id as string) : c.from,
        to: c.to === oldId ? (patch.id as string) : c.to,
      }));
    }
    updateBlueprint({ nodes, connections });
  }

  function handleDeleteNode(idx: number) {
    const deletedId = cs?.blueprint?.nodes[idx]?.id;
    const nodes = (cs?.blueprint?.nodes ?? []).filter((_, i) => i !== idx);
    // Remove connections referencing deleted node
    const connections = (cs?.blueprint?.connections ?? []).filter(
      (c) => c.from !== deletedId && c.to !== deletedId
    );
    updateBlueprint({ nodes, connections });
  }

  function handleAddConnection() {
    const newConn: BlueprintConnection = {
      from: "",
      to: "",
      label: "",
      bidirectional: false,
    };
    updateBlueprint({
      connections: [...(cs?.blueprint?.connections ?? []), newConn],
    });
  }

  function handleUpdateConnection(
    idx: number,
    patch: Partial<BlueprintConnection>
  ) {
    const connections = [...(cs?.blueprint?.connections ?? [])];
    connections[idx] = { ...connections[idx], ...patch };
    updateBlueprint({ connections });
  }

  function handleDeleteConnection(idx: number) {
    const connections = (cs?.blueprint?.connections ?? []).filter(
      (_, i) => i !== idx
    );
    updateBlueprint({ connections });
  }

  return (
    <div className="bg-white rounded-xl border border-rule p-4 sm:p-5 space-y-6">
      {/* Sub-panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rule pb-3">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">
            Project Detail Page Editor
          </h3>
          <p className="text-xs text-muted">
            Configure long-form story, case study narrative, metrics, and architecture.
          </p>
        </div>
        <Link
          to={`/projects/${project.slug}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline shrink-0"
        >
          <span>Preview /projects/{project.slug}</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {/* 1. Project Page Meta Fields */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-muted font-semibold">
          1. Header & Page Meta
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">
              Badge Label
            </label>
            <input
              type="text"
              placeholder="e.g. Featured Case Study · Local-First"
              value={project.badge || ""}
              onChange={(e) => onChange({ ...project, badge: e.target.value || undefined })}
              className="w-full rounded border border-rule bg-paper px-2.5 py-1.5 outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">
              Period / Timeline
            </label>
            <input
              type="text"
              placeholder="e.g. 2024 – Present"
              value={project.period || ""}
              onChange={(e) => onChange({ ...project, period: e.target.value || null })}
              className="w-full rounded border border-rule bg-paper px-2.5 py-1.5 outline-none focus:border-ink font-mono"
            />
          </div>
          <div className="flex items-center sm:pt-5">
            <Checkbox
              checked={Boolean(project.isOpenSource)}
              onChange={(checked) => onChange({ ...project, isOpenSource: checked })}
              label="Open Source (Show GitHub Stars)"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">
            Full Narrative / Body (Paragraphs separated by blank line)
          </label>
          <textarea
            rows={4}
            placeholder="Detailed narrative breakdown of the project..."
            value={project.body || ""}
            onChange={(e) => onChange({ ...project, body: e.target.value || null })}
            className="w-full rounded border border-rule bg-paper px-2.5 py-1.5 text-xs outline-none focus:border-ink"
          />
        </div>
      </div>

      {/* 2. Case Study Deep Dive */}
      <div className="space-y-4 border-t border-rule pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-muted font-semibold">
              2. Case Study Sections
            </h4>
            <p className="text-xs text-muted">
              Structured problem, constraints, key decisions, metrics, and outcomes.
            </p>
          </div>
          <Checkbox
            checked={Boolean(cs)}
            onChange={handleToggleCaseStudy}
            label="Enable Case Study"
          />
        </div>

        {cs ? (
          <div className="space-y-5 pt-2">
            {/* Case Study Headline */}
            <div>
              <label className="block text-xs font-mono uppercase text-muted mb-1">
                Case Study Headline (Lead Summary)
              </label>
              <textarea
                rows={2}
                placeholder="High-impact one-liner summarizing the architectural achievement..."
                value={cs.headline}
                onChange={(e) => updateCaseStudy({ headline: e.target.value })}
                className="w-full rounded border border-rule bg-paper px-2.5 py-1.5 text-xs font-medium text-ink outline-none focus:border-ink"
              />
            </div>

            {/* Problem & Constraints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">
                  The Problem & Status Quo
                </label>
                <textarea
                  rows={4}
                  placeholder="What was broken, fragmented, or inefficient prior to building this?"
                  value={cs.problem}
                  onChange={(e) => updateCaseStudy({ problem: e.target.value })}
                  className="w-full rounded border border-rule bg-paper px-2.5 py-1.5 text-xs outline-none focus:border-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">
                  Technical Constraints & Challenges
                </label>
                <textarea
                  rows={4}
                  placeholder="Latency, security, token limits, zero-backend, offline requirements..."
                  value={cs.constraints}
                  onChange={(e) => updateCaseStudy({ constraints: e.target.value })}
                  className="w-full rounded border border-rule bg-paper px-2.5 py-1.5 text-xs outline-none focus:border-ink"
                />
              </div>
            </div>

            {/* Outcome */}
            <div>
              <label className="block text-xs font-mono uppercase text-muted mb-1">
                Outcome & Measurable Impact
              </label>
              <textarea
                rows={3}
                placeholder="Measurable results, performance gains, error rate drops, developer velocity..."
                value={cs.outcome}
                onChange={(e) => updateCaseStudy({ outcome: e.target.value })}
                className="w-full rounded border border-rule bg-paper px-2.5 py-1.5 text-xs outline-none focus:border-ink"
              />
            </div>

            {/* Key Decisions (List with Up/Down reordering) */}
            <div className="space-y-2 border-t border-rule/60 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-muted font-semibold">
                  Core Decisions & Implementation ({cs.decisions?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={handleAddDecision}
                  className="inline-flex items-center gap-1 rounded border border-rule bg-white px-2 py-0.5 text-xs font-mono text-ink hover:border-ink transition cursor-pointer shadow-2xs"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Decision</span>
                </button>
              </div>

              <div className="space-y-2">
                {(cs.decisions || []).map((decision, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2">
                    <ReorderButtons
                      size="sm"
                      canMoveUp={dIdx > 0}
                      canMoveDown={dIdx < (cs.decisions?.length || 0) - 1}
                      onMoveUp={() => handleMoveDecision(dIdx, "up")}
                      onMoveDown={() => handleMoveDecision(dIdx, "down")}
                    />
                    <input
                      type="text"
                      value={decision}
                      placeholder="e.g. Architected an AST-based variable protection parser..."
                      onChange={(e) => handleUpdateDecision(dIdx, e.target.value)}
                      className="flex-1 rounded border border-rule bg-paper px-2.5 py-1 text-xs outline-none focus:border-ink"
                    />
                    <button
                      type="button"
                      title="Remove decision"
                      onClick={() => handleDeleteDecision(dIdx)}
                      className="p-1 text-muted hover:text-destructive cursor-pointer transition shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Highlights (List with Up/Down reordering) */}
            <div className="space-y-2 border-t border-rule/60 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-muted font-semibold">
                  Architecture Highlights ({cs.architectureHighlights?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="inline-flex items-center gap-1 rounded border border-rule bg-white px-2 py-0.5 text-xs font-mono text-ink hover:border-ink transition cursor-pointer shadow-2xs"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Highlight</span>
                </button>
              </div>

              <div className="space-y-2">
                {(cs.architectureHighlights || []).map((highlight, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2">
                    <ReorderButtons
                      size="sm"
                      canMoveUp={hIdx > 0}
                      canMoveDown={hIdx < (cs.architectureHighlights?.length || 0) - 1}
                      onMoveUp={() => handleMoveHighlight(hIdx, "up")}
                      onMoveDown={() => handleMoveHighlight(hIdx, "down")}
                    />
                    <input
                      type="text"
                      value={highlight}
                      placeholder="e.g. Web File System Access API integration for atomic writes..."
                      onChange={(e) => handleUpdateHighlight(hIdx, e.target.value)}
                      className="flex-1 rounded border border-rule bg-paper px-2.5 py-1 text-xs outline-none focus:border-ink"
                    />
                    <button
                      type="button"
                      title="Remove highlight"
                      onClick={() => handleDeleteHighlight(hIdx)}
                      className="p-1 text-muted hover:text-destructive cursor-pointer transition shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Metrics Strip (List with Up/Down reordering) */}
            <div className="space-y-2 border-t border-rule/60 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-muted font-semibold">
                  Key Metrics & Engineering Proof ({cs.metrics?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={handleAddMetric}
                  className="inline-flex items-center gap-1 rounded border border-rule bg-white px-2 py-0.5 text-xs font-mono text-ink hover:border-ink transition cursor-pointer shadow-2xs"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Metric</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(cs.metrics || []).map((metric, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-3 rounded-lg border border-rule bg-paper flex items-start gap-2 text-xs"
                  >
                    <ReorderButtons
                      size="sm"
                      canMoveUp={mIdx > 0}
                      canMoveDown={mIdx < (cs.metrics?.length || 0) - 1}
                      onMoveUp={() => handleMoveMetric(mIdx, "up")}
                      onMoveDown={() => handleMoveMetric(mIdx, "down")}
                    />
                    <div className="flex-1 space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Value (e.g. 0 Servers)"
                          value={metric.value}
                          onChange={(e) => handleUpdateMetric(mIdx, { value: e.target.value })}
                          className="w-1/2 rounded border border-rule bg-white px-2 py-1 font-bold text-ink outline-none focus:border-ink"
                        />
                        <input
                          type="text"
                          placeholder="Label (e.g. Cloud Footprint)"
                          value={metric.label}
                          onChange={(e) => handleUpdateMetric(mIdx, { label: e.target.value })}
                          className="w-1/2 rounded border border-rule bg-white px-2 py-1 font-semibold text-ink outline-none focus:border-ink"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Description (e.g. 100% client-side execution)"
                        value={metric.description}
                        onChange={(e) => handleUpdateMetric(mIdx, { description: e.target.value })}
                        className="w-full rounded border border-rule bg-white px-2 py-1 text-muted outline-none focus:border-ink"
                      />
                    </div>
                    <button
                      type="button"
                      title="Remove metric"
                      onClick={() => handleDeleteMetric(mIdx)}
                      className="p-1 text-muted hover:text-destructive cursor-pointer transition shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* System Blueprint */}
            <div className="space-y-3 border-t border-rule/60 pt-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono uppercase text-muted font-semibold">
                    System Blueprint ({cs.blueprint?.nodes?.length ?? 0}{" "}
                    nodes · {cs.blueprint?.connections?.length ?? 0} rails)
                  </span>
                  <p className="mt-0.5 text-xs text-muted">
                    Interactive architecture diagram shown on the project page.
                  </p>
                </div>
                <Checkbox
                  checked={Boolean(cs.blueprint)}
                  onChange={handleToggleBlueprint}
                  label="Enable"
                />
              </div>

              {cs.blueprint ? (
                <div className="space-y-4 rounded-lg border border-rule bg-paper p-3">
                  {/* Meta */}
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Architecture headline"
                      value={cs.blueprint.headline}
                      onChange={(e) =>
                        updateBlueprint({ headline: e.target.value })
                      }
                      className="w-full rounded border border-rule bg-white px-2.5 py-1.5 text-xs font-semibold text-ink outline-none focus:border-ink"
                    />
                    <textarea
                      rows={2}
                      placeholder="Short description of the architecture..."
                      value={cs.blueprint.description}
                      onChange={(e) =>
                        updateBlueprint({ description: e.target.value })
                      }
                      className="w-full rounded border border-rule bg-white px-2.5 py-1.5 text-xs outline-none focus:border-ink"
                    />
                  </div>

                  {/* Nodes */}
                  <div className="space-y-2 border-t border-rule/60 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-muted font-semibold">
                        Nodes ({cs.blueprint.nodes.length})
                      </span>
                      <button
                        type="button"
                        onClick={handleAddNode}
                        className="inline-flex items-center gap-1 rounded border border-rule bg-white px-2 py-0.5 text-xs font-mono text-ink hover:border-ink transition cursor-pointer shadow-2xs"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Node</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {cs.blueprint.nodes.map((node, nIdx) => (
                        <div
                          key={nIdx}
                          className="rounded-lg border border-rule bg-white p-3 space-y-2"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              placeholder="id (e.g. web-ui)"
                              value={node.id}
                              onChange={(e) =>
                                handleUpdateNode(nIdx, { id: e.target.value })
                              }
                              className="w-28 rounded border border-rule bg-paper px-2 py-1 font-mono text-xs text-muted outline-none focus:border-ink"
                            />
                            <input
                              type="text"
                              placeholder="Label (e.g. Web Studio UI)"
                              value={node.label}
                              onChange={(e) =>
                                handleUpdateNode(nIdx, {
                                  label: e.target.value,
                                })
                              }
                              className="min-w-0 flex-1 rounded border border-rule bg-paper px-2 py-1 text-xs font-semibold text-ink outline-none focus:border-ink"
                            />
                            <select
                              value={node.badge}
                              onChange={(e) =>
                                handleUpdateNode(nIdx, {
                                  badge: e.target.value as BlueprintNode["badge"],
                                })
                              }
                              className="rounded border border-rule bg-paper px-2 py-1 font-mono text-xs text-ink outline-none focus:border-ink cursor-pointer"
                            >
                              {(
                                [
                                  "CLIENT",
                                  "ENGINE",
                                  "STORAGE",
                                  "AGENT",
                                  "NETWORK",
                                ] as const
                              ).map((b) => (
                                <option key={b} value={b}>
                                  {b}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              title="Remove node"
                              onClick={() => handleDeleteNode(nIdx)}
                              className="p-1 text-muted hover:text-destructive cursor-pointer transition shrink-0"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Role (e.g. Virtualized Canvas Grid)"
                            value={node.role}
                            onChange={(e) =>
                              handleUpdateNode(nIdx, { role: e.target.value })
                            }
                            className="w-full rounded border border-rule bg-paper px-2 py-1 font-mono text-xs text-muted outline-none focus:border-ink"
                          />
                          <input
                            type="text"
                            placeholder="Details (optional) — shown on inspect"
                            value={node.details ?? ""}
                            onChange={(e) =>
                              handleUpdateNode(nIdx, {
                                details: e.target.value || undefined,
                              })
                            }
                            className="w-full rounded border border-rule bg-paper px-2 py-1 text-xs text-muted outline-none focus:border-ink"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connections / Data Rails */}
                  <div className="space-y-2 border-t border-rule/60 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-muted font-semibold">
                        Data Rails ({cs.blueprint.connections.length})
                      </span>
                      <button
                        type="button"
                        onClick={handleAddConnection}
                        className="inline-flex items-center gap-1 rounded border border-rule bg-white px-2 py-0.5 text-xs font-mono text-ink hover:border-ink transition cursor-pointer shadow-2xs"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Rail</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {cs.blueprint.connections.map((conn, cIdx) => (
                        <div
                          key={cIdx}
                          className="flex flex-wrap items-center gap-2 rounded-lg border border-rule bg-white p-2"
                        >
                          <select
                            value={conn.from}
                            onChange={(e) =>
                              handleUpdateConnection(cIdx, {
                                from: e.target.value,
                              })
                            }
                            className="rounded border border-rule bg-paper px-2 py-1 font-mono text-xs text-ink outline-none focus:border-ink cursor-pointer"
                          >
                            <option value="">From…</option>
                            {cs.blueprint!.nodes.map((n) => (
                              <option key={n.id} value={n.id}>
                                {n.label || n.id}
                              </option>
                            ))}
                          </select>
                          <span className="font-mono text-xs text-muted">→</span>
                          <select
                            value={conn.to}
                            onChange={(e) =>
                              handleUpdateConnection(cIdx, {
                                to: e.target.value,
                              })
                            }
                            className="rounded border border-rule bg-paper px-2 py-1 font-mono text-xs text-ink outline-none focus:border-ink cursor-pointer"
                          >
                            <option value="">To…</option>
                            {cs.blueprint!.nodes.map((n) => (
                              <option key={n.id} value={n.id}>
                                {n.label || n.id}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Label (e.g. Atomic Disk I/O)"
                            value={conn.label ?? ""}
                            onChange={(e) =>
                              handleUpdateConnection(cIdx, {
                                label: e.target.value || undefined,
                              })
                            }
                            className="min-w-0 flex-1 rounded border border-rule bg-paper px-2 py-1 text-xs outline-none focus:border-ink"
                          />
                          <Checkbox
                            checked={conn.bidirectional ?? false}
                            onChange={(checked) =>
                              handleUpdateConnection(cIdx, {
                                bidirectional: checked,
                              })
                            }
                            label="Bi-dir"
                          />
                          <button
                            type="button"
                            title="Remove rail"
                            onClick={() => handleDeleteConnection(cIdx)}
                            className="p-1 text-muted hover:text-destructive cursor-pointer transition shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted italic bg-paper p-3 rounded-lg border border-rule">
            No Case Study attached to this project. Check "Enable Case Study" above to add structured problem, constraints, architecture decisions, and metrics.
          </p>
        )}
      </div>
    </div>
  );
}
