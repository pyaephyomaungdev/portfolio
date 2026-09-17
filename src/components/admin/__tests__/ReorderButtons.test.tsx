// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ReorderButtons, reorderArray } from "../ReorderButtons";

describe("reorderArray helper", () => {
  it("moves item up correctly", () => {
    const list = ["A", "B", "C"];
    const result = reorderArray(list, 1, "up");
    expect(result).toEqual(["B", "A", "C"]);
  });

  it("moves item down correctly", () => {
    const list = ["A", "B", "C"];
    const result = reorderArray(list, 1, "down");
    expect(result).toEqual(["A", "C", "B"]);
  });

  it("returns unchanged array when attempting to move first item up", () => {
    const list = ["A", "B", "C"];
    const result = reorderArray(list, 0, "up");
    expect(result).toEqual(["A", "B", "C"]);
  });

  it("returns unchanged array when attempting to move last item down", () => {
    const list = ["A", "B", "C"];
    const result = reorderArray(list, 2, "down");
    expect(result).toEqual(["A", "B", "C"]);
  });
});

describe("ReorderButtons UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("disables Move Up when canMoveUp is false", () => {
    render(
      <ReorderButtons
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
        canMoveUp={false}
        canMoveDown={true}
      />
    );

    const upBtn = screen.getByRole("button", { name: /move up/i });
    const downBtn = screen.getByRole("button", { name: /move down/i });

    expect(upBtn.hasAttribute("disabled")).toBe(true);
    expect(downBtn.hasAttribute("disabled")).toBe(false);
  });

  it("calls onMoveUp and onMoveDown when clicked", () => {
    const handleUp = vi.fn();
    const handleDown = vi.fn();

    render(
      <ReorderButtons
        onMoveUp={handleUp}
        onMoveDown={handleDown}
        canMoveUp={true}
        canMoveDown={true}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /move up/i }));
    expect(handleUp).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: /move down/i }));
    expect(handleDown).toHaveBeenCalledTimes(1);
  });
});
