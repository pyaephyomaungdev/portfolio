import { Link } from "react-router-dom";
import { Plus, ExternalLink } from "lucide-react";
import { Checkbox } from "./Checkbox";
import { ReorderButtons, reorderArray } from "./ReorderButtons";
import { CustomSelect } from "./CustomSelect";
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

  function handleMoveNode(index: number, direction: "up" | "down") {
    if (!cs?.blueprint?.nodes) return;
    const nodes = reorderArray(cs.blueprint.nodes, index, direction);
    updateBlueprint({ nodes });
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

  function handleMoveConnection(index: number, direction: "up" | "down") {
    if (!cs?.blueprint?.connections) return;
    const connections = reorderArray(cs.blueprint.connections, index, direction);
    updateBlueprint({ connections });
  }

  return (
    <div className="space-y-6">
      {/* Sub-panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rule pb-3">
        <div>
          <h3 className="font-display text-base font-bold text-ink">
            Case Study & Technical Architecture
          </h3>
          <p className="text-xs text-muted">
            Configure structured problem breakdown, key decisions, metrics, and system blueprint.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/projects/${project.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline shrink-0"
          >
            <span>Preview Page</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
          <div className="h-3.5 w-px bg-rule" />
          <Checkbox
            checked={Boolean(cs)}
            onChange={handleToggleCaseStudy}
            label="Enable Case Study"
          />
        </div>
      </div>

      {cs ? (
        <div className="space-y-6">
          {/* Case Study Headline */}
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">
              Case Study Headline (Lead Summary)
            </label>
            <textarea
              rows={2}
              placeholder="High-impact one-liner summarizing the architectural achievement..."
              value={cs.headline}
              onChange={(e) => updateCaseStudy({ headline: e.target.value })}
              className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-medium text-ink outline-none focus:border-ink"
            />
          </div>

          {/* Problem & Constraints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">
                The Problem & Status Quo
              </label>
              <textarea
                rows={4}
                placeholder="What was broken, fragmented, or inefficient prior to building this?"
                value={cs.problem}
                onChange={(e) => updateCaseStudy({ problem: e.target.value })}
                className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">
                Technical Constraints & Challenges
              </label>
              <textarea
                rows={4}
                placeholder="Latency, security, token limits, zero-backend, offline requirements..."
                value={cs.constraints}
                onChange={(e) => updateCaseStudy({ constraints: e.target.value })}
                className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs outline-none focus:border-ink"
              />
            </div>
          </div>

          {/* Outcome */}
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">
              Outcome & Measurable Impact
            </label>
            <textarea
              rows={3}
              placeholder="Measurable results, performance gains, error rate drops, developer velocity..."
              value={cs.outcome}
              onChange={(e) => updateCaseStudy({ outcome: e.target.value })}
              className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs outline-none focus:border-ink"
            />
          </div>

          {/* Key Decisions (Card Containers) */}
          <div className="space-y-3 border-t border-rule/60 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-muted font-semibold">
                Core Decisions & Implementation ({cs.decisions?.length || 0})
              </span>
              <button
                type="button"
                onClick={handleAddDecision}
                className="inline-flex items-center gap-1 rounded border border-rule bg-paper px-2 py-0.5 text-xs font-mono text-ink hover:border-ink transition cursor-pointer shadow-2xs"
              >
                <Plus className="h-3 w-3" />
                <span>Add Decision</span>
              </button>
            </div>

            {(!cs.decisions || cs.decisions.length === 0) ? (
              <p className="text-xs text-muted italic">No decisions recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {cs.decisions.map((decision, dIdx) => (
                  <div
                    key={dIdx}
                    className="group relative rounded-xl border border-rule bg-paper p-3.5 flex flex-col gap-2 text-xs hover:border-accent/50 hover:shadow-xs transition"
                  >
                    <ReorderButtons
                      variant="corner"
                      index={dIdx}
                      canMoveUp={dIdx > 0}
                      canMoveDown={dIdx < (cs.decisions?.length || 0) - 1}
                      onMoveUp={() => handleMoveDecision(dIdx, "up")}
                      onMoveDown={() => handleMoveDecision(dIdx, "down")}
                      onDelete={() => handleDeleteDecision(dIdx)}
                      deleteTitle="Delete decision"
                    />

                    <div className="flex items-center gap-2 pr-28">
                      <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                        Decision #{dIdx + 1}
                      </span>
                    </div>

                    <textarea
                      rows={2}
                      value={decision}
                      placeholder="e.g. Architected an AST-based variable protection parser that tokenizes framework placeholders..."
                      onChange={(e) => handleUpdateDecision(dIdx, e.target.value)}
                      className="w-full rounded-lg border border-rule bg-soft/30 p-2.5 text-xs text-ink outline-none focus:border-ink font-medium resize-y leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Architecture Highlights (Card Containers) */}
          <div className="space-y-3 border-t border-rule/60 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-muted font-semibold">
                Architecture Highlights ({cs.architectureHighlights?.length || 0})
              </span>
              <button
                type="button"
                onClick={handleAddHighlight}
                className="inline-flex items-center gap-1 rounded border border-rule bg-paper px-2 py-0.5 text-xs font-mono text-ink hover:border-ink transition cursor-pointer shadow-2xs"
              >
                <Plus className="h-3 w-3" />
                <span>Add Highlight</span>
              </button>
            </div>

            {(!cs.architectureHighlights || cs.architectureHighlights.length === 0) ? (
              <p className="text-xs text-muted italic">No architecture highlights recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {cs.architectureHighlights.map((highlight, hIdx) => (
                  <div
                    key={hIdx}
                    className="group relative rounded-xl border border-rule bg-paper p-3.5 flex flex-col gap-2 text-xs hover:border-accent/50 hover:shadow-xs transition"
                  >
                    <ReorderButtons
                      variant="corner"
                      index={hIdx}
                      canMoveUp={hIdx > 0}
                      canMoveDown={hIdx < (cs.architectureHighlights?.length || 0) - 1}
                      onMoveUp={() => handleMoveHighlight(hIdx, "up")}
                      onMoveDown={() => handleMoveHighlight(hIdx, "down")}
                      onDelete={() => handleDeleteHighlight(hIdx)}
                      deleteTitle="Delete highlight"
                    />

                    <div className="flex items-center gap-2 pr-28">
                      <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                        Highlight #{hIdx + 1}
                      </span>
                    </div>

                    <textarea
                      rows={2}
                      value={highlight}
                      placeholder="e.g. Distributed zero-latency CRDT synchronization..."
                      onChange={(e) => handleUpdateHighlight(hIdx, e.target.value)}
                      className="w-full rounded-lg border border-rule bg-soft/30 p-2.5 text-xs text-ink outline-none focus:border-ink font-medium resize-y leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Metrics */}
          <div className="space-y-3 border-t border-rule/60 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-muted font-semibold">
                Key Metrics ({cs.metrics?.length || 0})
              </span>
              <button
                type="button"
                onClick={handleAddMetric}
                className="inline-flex items-center gap-1 rounded border border-rule bg-paper px-2 py-0.5 text-xs font-mono text-ink hover:border-ink transition cursor-pointer shadow-2xs"
              >
                <Plus className="h-3 w-3" />
                <span>Add Metric</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(cs.metrics || []).map((metric, mIdx) => (
                <div
                  key={mIdx}
                  className="group relative rounded-xl border border-rule bg-paper p-3.5 flex flex-col gap-2.5 text-xs hover:border-accent/50 hover:shadow-xs transition"
                >
                  <ReorderButtons
                    variant="corner"
                    index={mIdx}
                    canMoveUp={mIdx > 0}
                    canMoveDown={mIdx < (cs.metrics?.length || 0) - 1}
                    onMoveUp={() => handleMoveMetric(mIdx, "up")}
                    onMoveDown={() => handleMoveMetric(mIdx, "down")}
                    onDelete={() => handleDeleteMetric(mIdx)}
                    deleteTitle="Delete metric"
                  />

                  <div className="flex items-center gap-2 pr-28">
                    <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                      Metric #{mIdx + 1}
                    </span>
                    {metric.label || metric.value ? (
                      <span className="font-medium text-xs text-ink truncate">
                        — {metric.label || metric.value}
                      </span>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Value (e.g. 0 Servers)"
                        value={metric.value}
                        onChange={(e) => handleUpdateMetric(mIdx, { value: e.target.value })}
                        className="w-1/2 rounded-lg border border-rule bg-paper px-2.5 py-1.5 font-bold text-ink outline-none focus:border-ink"
                      />
                      <input
                        type="text"
                        placeholder="Label (e.g. Cloud Footprint)"
                        value={metric.label}
                        onChange={(e) => handleUpdateMetric(mIdx, { label: e.target.value })}
                        className="w-1/2 rounded-lg border border-rule bg-paper px-2.5 py-1.5 font-semibold text-ink outline-none focus:border-ink"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Description (e.g. 100% client-side execution)"
                      value={metric.description}
                      onChange={(e) => handleUpdateMetric(mIdx, { description: e.target.value })}
                      className="w-full rounded-lg border border-rule bg-paper px-2.5 py-1.5 text-muted outline-none focus:border-ink"
                    />
                  </div>
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
              <div className="space-y-4 pt-1">
                {/* Meta */}
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Architecture headline"
                    value={cs.blueprint.headline}
                    onChange={(e) =>
                      updateBlueprint({ headline: e.target.value })
                    }
                    className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-semibold text-ink outline-none focus:border-ink"
                  />
                  <textarea
                    rows={2}
                    placeholder="Short description of the architecture..."
                    value={cs.blueprint.description}
                    onChange={(e) =>
                      updateBlueprint({ description: e.target.value })
                    }
                    className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs outline-none focus:border-ink"
                  />
                </div>

                {/* Nodes */}
                <div className="space-y-3 border-t border-rule/60 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-muted font-semibold">
                      Nodes ({cs.blueprint.nodes.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddNode}
                      className="inline-flex items-center gap-1 rounded border border-rule bg-paper px-2 py-0.5 text-xs font-mono text-ink hover:border-ink transition cursor-pointer shadow-2xs"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Node</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {cs.blueprint.nodes.map((node, nIdx) => (
                      <div
                        key={nIdx}
                        className="group relative rounded-xl border border-rule bg-paper p-3.5 flex flex-col gap-3 hover:border-accent/50 hover:shadow-xs transition text-xs"
                      >
                        <ReorderButtons
                          variant="corner"
                          index={nIdx}
                          canMoveUp={nIdx > 0}
                          canMoveDown={nIdx < cs.blueprint!.nodes.length - 1}
                          onMoveUp={() => handleMoveNode(nIdx, "up")}
                          onMoveDown={() => handleMoveNode(nIdx, "down")}
                          onDelete={() => handleDeleteNode(nIdx)}
                          deleteTitle="Delete node"
                        />

                        <div className="flex items-center gap-2 pr-28">
                          <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                            Node #{nIdx + 1}
                          </span>
                          {node.label || node.id ? (
                            <span className="font-medium text-xs text-ink truncate">
                              — {node.label || node.id}
                            </span>
                          ) : null}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                          <div className="sm:col-span-3">
                            <label className="block text-xs font-mono uppercase text-muted mb-1">
                              Node ID *
                            </label>
                            <input
                              type="text"
                              placeholder="id (e.g. web-ui)"
                              value={node.id}
                              onChange={(e) =>
                                handleUpdateNode(nIdx, { id: e.target.value })
                              }
                              className="w-full rounded-lg border border-rule bg-paper px-2.5 py-1.5 font-mono text-xs text-ink outline-none focus:border-ink"
                            />
                          </div>
                          <div className="sm:col-span-5">
                            <label className="block text-xs font-mono uppercase text-muted mb-1">
                              Display Label *
                            </label>
                            <input
                              type="text"
                              placeholder="Label (e.g. Web Studio UI)"
                              value={node.label}
                              onChange={(e) =>
                                handleUpdateNode(nIdx, { label: e.target.value })
                              }
                              className="w-full rounded-lg border border-rule bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink outline-none focus:border-ink"
                            />
                          </div>
                          <div className="sm:col-span-4">
                            <label className="block text-xs font-mono uppercase text-muted mb-1">
                              Architectural Layer
                            </label>
                            <CustomSelect
                              value={node.badge}
                              onChange={(val) =>
                                handleUpdateNode(nIdx, {
                                  badge: val as BlueprintNode["badge"],
                                })
                              }
                              options={[
                                { value: "CLIENT", label: "CLIENT" },
                                { value: "ENGINE", label: "ENGINE" },
                                { value: "STORAGE", label: "STORAGE" },
                                { value: "AGENT", label: "AGENT" },
                                { value: "NETWORK", label: "NETWORK" },
                              ]}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-xs font-mono uppercase text-muted mb-1">
                              Component Role
                            </label>
                            <input
                              type="text"
                              placeholder="Role (e.g. Virtualized Canvas Grid)"
                              value={node.role}
                              onChange={(e) =>
                                handleUpdateNode(nIdx, { role: e.target.value })
                              }
                              className="w-full rounded-lg border border-rule bg-paper px-2.5 py-1.5 font-mono text-xs text-ink outline-none focus:border-ink"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono uppercase text-muted mb-1">
                              Inspect Details (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="Details shown on node inspect..."
                              value={node.details ?? ""}
                              onChange={(e) =>
                                handleUpdateNode(nIdx, {
                                  details: e.target.value || undefined,
                                })
                              }
                              className="w-full rounded-lg border border-rule bg-paper px-2.5 py-1.5 text-xs text-muted outline-none focus:border-ink"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connections / Data Rails */}
                <div className="space-y-3 border-t border-rule/60 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-muted font-semibold">
                      Data Rails ({cs.blueprint.connections.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddConnection}
                      className="inline-flex items-center gap-1 rounded border border-rule bg-paper px-2 py-0.5 text-xs font-mono text-ink hover:border-ink transition cursor-pointer shadow-2xs"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Rail</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {cs.blueprint.connections.map((conn, cIdx) => (
                      <div
                        key={cIdx}
                        className="group relative rounded-xl border border-rule bg-paper p-3.5 flex flex-col gap-3 hover:border-accent/50 hover:shadow-xs transition text-xs"
                      >
                        <ReorderButtons
                          variant="corner"
                          index={cIdx}
                          canMoveUp={cIdx > 0}
                          canMoveDown={cIdx < cs.blueprint!.connections.length - 1}
                          onMoveUp={() => handleMoveConnection(cIdx, "up")}
                          onMoveDown={() => handleMoveConnection(cIdx, "down")}
                          onDelete={() => handleDeleteConnection(cIdx)}
                          deleteTitle="Delete rail"
                        />

                        <div className="flex items-center gap-2 pr-28">
                          <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                            Rail #{cIdx + 1}
                          </span>
                          {conn.label || (conn.from && conn.to) ? (
                            <span className="font-medium text-xs text-ink truncate">
                              — {conn.label || `${conn.from} → ${conn.to}`}
                            </span>
                          ) : null}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                          <div className="sm:col-span-3">
                            <label className="block text-xs font-mono uppercase text-muted mb-1">
                              From Node *
                            </label>
                            <CustomSelect
                              value={conn.from}
                              placeholder="From node..."
                              onChange={(val) =>
                                handleUpdateConnection(cIdx, {
                                  from: val,
                                })
                              }
                              options={cs.blueprint!.nodes.map((n) => ({
                                value: n.id,
                                label: n.label ? `${n.label} (${n.id})` : n.id,
                              }))}
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <label className="block text-xs font-mono uppercase text-muted mb-1">
                              To Node *
                            </label>
                            <CustomSelect
                              value={conn.to}
                              placeholder="To node..."
                              onChange={(val) =>
                                handleUpdateConnection(cIdx, {
                                  to: val,
                                })
                              }
                              options={cs.blueprint!.nodes.map((n) => ({
                                value: n.id,
                                label: n.label ? `${n.label} (${n.id})` : n.id,
                              }))}
                            />
                          </div>
                          <div className="sm:col-span-4">
                            <label className="block text-xs font-mono uppercase text-muted mb-1">
                              Channel / Rail Label
                            </label>
                            <input
                              type="text"
                              placeholder="Label (e.g. Atomic Disk I/O)"
                              value={conn.label ?? ""}
                              onChange={(e) =>
                                handleUpdateConnection(cIdx, {
                                  label: e.target.value || undefined,
                                })
                              }
                              className="w-full rounded-lg border border-rule bg-paper px-2.5 py-1.5 text-xs outline-none focus:border-ink"
                            />
                          </div>
                          <div className="sm:col-span-2 flex items-center h-8">
                            <Checkbox
                              checked={conn.bidirectional ?? false}
                              onChange={(checked) =>
                                handleUpdateConnection(cIdx, {
                                  bidirectional: checked,
                                })
                              }
                              label="Bi-dir"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 px-4 rounded-lg border border-dashed border-rule text-xs text-muted">
          No Case Study enabled for this project. Check &ldquo;Enable Case Study&rdquo; above to configure structured problem breakdown, architecture decisions, and metrics.
        </div>
      )}
    </div>
  );
}
