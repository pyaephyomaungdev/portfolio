import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { CustomActionMenu } from "../CustomActionMenu";

describe("CustomActionMenu Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("opens menu and calls action onClick", () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    const items = [
      { label: "Edit Item", onClick: handleEdit },
      { label: "Delete Item", onClick: handleDelete, variant: "destructive" as const },
    ];

    render(<CustomActionMenu items={items} />);

    const trigger = screen.getByRole("button", { name: /action menu/i });
    expect(screen.queryByRole("menu")).toBeNull();

    fireEvent.click(trigger);
    expect(screen.getByRole("menu")).not.toBeNull();

    const editBtn = screen.getByRole("menuitem", { name: /edit item/i });
    fireEvent.click(editBtn);

    expect(handleEdit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
