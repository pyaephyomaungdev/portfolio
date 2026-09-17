// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ConfirmModal } from "../modals/ConfirmModal";

describe("ConfirmModal UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <ConfirmModal
        isOpen={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete Project?"
        message="This action cannot be undone."
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders dialog title, message, and buttons when isOpen is true", () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete Project?"
        message="This action cannot be undone."
        confirmLabel="Yes, Delete"
        cancelLabel="Keep Project"
      />
    );

    expect(screen.getByRole("dialog")).not.toBeNull();
    expect(screen.getByText("Delete Project?")).not.toBeNull();
    expect(screen.getByText("This action cannot be undone.")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Yes, Delete" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Keep Project" })).not.toBeNull();
  });

  it("calls onConfirm and onClose when confirm button is clicked", () => {
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    render(
      <ConfirmModal
        isOpen={true}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Delete Item?"
        message="Are you sure?"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close button (X) is clicked", () => {
    const handleClose = vi.fn();

    render(
      <ConfirmModal
        isOpen={true}
        onClose={handleClose}
        onConfirm={vi.fn()}
        title="Delete Item?"
        message="Are you sure?"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /close dialog/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
