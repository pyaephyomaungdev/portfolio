// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { ArchitectureBlueprint } from "../ArchitectureBlueprint";
import type { SystemBlueprint } from "../../types/portfolio";

describe("ArchitectureBlueprint UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  const mockBlueprint: SystemBlueprint = {
    protocol: "PPM-SEC-01",
    headline: "Zero-Backend Local-First Architecture",
    description: "Client-side encrypted IndexedDB pipeline",
    nodes: [
      { id: "client", label: "React Client", role: "UI & State", badge: "CLIENT" },
      { id: "storage", label: "IndexedDB Vault", role: "Local persistence", badge: "STORAGE" },
    ],
    connections: [
      { from: "client", to: "storage", label: "AES-GCM encrypted write" },
    ],
  };

  it("does not render when blueprint prop is undefined", () => {
    const { container } = render(<ArchitectureBlueprint />);
    expect(container.firstChild).toBeNull();
  });

  it("renders blueprint title, description, and nodes", () => {
    render(<ArchitectureBlueprint blueprint={mockBlueprint} />);

    expect(screen.getByText("Zero-Backend Local-First Architecture")).not.toBeNull();
    expect(screen.getAllByText("React Client").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("IndexedDB Vault").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("AES-GCM encrypted write")).not.toBeNull();
  });

  it("allows selecting a node to inspect its connections", () => {
    render(<ArchitectureBlueprint blueprint={mockBlueprint} />);

    const clientNode = screen.getByRole("button", { name: /react client/i });
    fireEvent.click(clientNode);

    expect(screen.getByText(/click selected node to reset/i)).not.toBeNull();
  });
});
