import { useState } from "react";
import type { SystemBlueprint, BlueprintNode } from "../types/portfolio";
import {
  Cpu,
  Database,
  Bot,
  Layers,
  ArrowRight,
  ArrowLeftRight,
  ShieldCheck,
  HardDrive,
} from "lucide-react";

interface ArchitectureBlueprintProps {
  blueprint?: SystemBlueprint;
  className?: string;
}

function getNodeIcon(badge: BlueprintNode["badge"]) {
  switch (badge) {
    case "CLIENT":
      return Layers;
    case "ENGINE":
      return Cpu;
    case "STORAGE":
      return Database;
    case "AGENT":
      return Bot;
    case "NETWORK":
      return ShieldCheck;
    default:
      return HardDrive;
  }
}

export function ArchitectureBlueprint({
  blueprint,
  className = "",
}: ArchitectureBlueprintProps) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  if (!blueprint) return null;

  const activeConnections = activeNodeId
    ? blueprint.connections.filter(
        (c) => c.from === activeNodeId || c.to === activeNodeId
      )
    : blueprint.connections;

  const connectedNodeIds = new Set<string>();
  if (activeNodeId) {
    connectedNodeIds.add(activeNodeId);
    blueprint.connections.forEach((c) => {
      if (c.from === activeNodeId) connectedNodeIds.add(c.to);
      if (c.to === activeNodeId) connectedNodeIds.add(c.from);
    });
  }

  return (
    <section
      aria-label="System Architecture Blueprint"
      className={`rounded-2xl border border-rule bg-paper p-5 sm:p-7 ${className}`}
    >
      {/* Header */}
      <div className="border-b border-rule pb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          System Architecture
        </p>
        <h3 className="mt-1 font-display text-2xl tracking-tight text-ink">
          {blueprint.headline}
        </h3>
        {blueprint.description ? (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            {blueprint.description}
          </p>
        ) : null}
      </div>

      {/* Architecture Nodes */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Architecture Nodes
          </p>
          <span className="text-xs text-muted">
            {activeNodeId
              ? "Click selected node to reset"
              : "Click node to inspect data rails"}
          </span>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {blueprint.nodes.map((node) => {
            const Icon = getNodeIcon(node.badge);
            const isSelected = activeNodeId === node.id;
            const isDimmed =
              activeNodeId !== null && !connectedNodeIds.has(node.id);

            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setActiveNodeId(isSelected ? null : node.id)}
                className={`flex flex-col rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-ink bg-white shadow-xs"
                    : isDimmed
                      ? "border-rule bg-white opacity-40 hover:opacity-100 hover:border-ink/40"
                      : "border-rule bg-white hover:border-ink/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded border border-rule bg-soft px-1.5 py-0.5 font-mono text-xs font-medium text-muted">
                    <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span>{node.badge}</span>
                  </span>
                  <span className="font-mono text-xs text-muted">
                    #{node.id}
                  </span>
                </div>

                <h4 className="mt-3 text-sm font-semibold tracking-tight text-ink">
                  {node.label}
                </h4>
                <p className="text-xs text-muted">{node.role}</p>

                {node.details ? (
                  <p className="mt-2 border-t border-rule pt-2 text-xs leading-relaxed text-muted">
                    {node.details}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Data Rails */}
      <div className="mt-6 border-t border-rule pt-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Data Rails
          </p>
          <span className="text-xs text-muted">
            {activeConnections.length} of {blueprint.connections.length} paths
          </span>
        </div>

        <div className="mt-3 space-y-2">
          {activeConnections.map((conn, idx) => {
            const fromNode = blueprint.nodes.find((n) => n.id === conn.from);
            const toNode = blueprint.nodes.find((n) => n.id === conn.to);

            return (
              <div
                key={`${conn.from}-${conn.to}-${idx}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-rule bg-white px-3.5 py-2.5 transition hover:border-ink/30"
              >
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="rounded border border-rule bg-soft px-2 py-0.5 font-medium text-ink">
                    {fromNode?.label || conn.from}
                  </span>

                  {conn.bidirectional ? (
                    <span
                      className="inline-flex items-center gap-1 text-muted"
                      title="Bi-directional sync"
                    >
                      <ArrowLeftRight
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        Sync
                      </span>
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1 text-muted"
                      title="Uni-directional event"
                    >
                      <ArrowRight
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        Emit
                      </span>
                    </span>
                  )}

                  <span className="rounded border border-rule bg-soft px-2 py-0.5 font-medium text-ink">
                    {toNode?.label || conn.to}
                  </span>
                </div>

                {conn.label ? (
                  <span className="self-start rounded border border-rule bg-soft/60 px-2 py-0.5 font-mono text-xs text-muted sm:self-auto">
                    {conn.label}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
