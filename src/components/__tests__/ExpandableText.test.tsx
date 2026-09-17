// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ExpandableText } from "../ExpandableText";

describe("ExpandableText UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders short text without toggle button", () => {
    render(<ExpandableText text="Short concise description" threshold={160} />);

    expect(screen.getByText("Short concise description")).not.toBeNull();
    expect(screen.queryByRole("button", { name: /more/i })).toBeNull();
  });

  it("renders toggle button when text exceeds threshold", () => {
    const longText = "A".repeat(300);
    render(<ExpandableText text={longText} threshold={100} />);

    expect(screen.getByText(/more/i)).not.toBeNull();
  });

  it("expands and collapses when toggle button is clicked", () => {
    const longText = "B".repeat(300);
    render(<ExpandableText text={longText} threshold={100} />);

    const expandBtn = screen.getByText(/more/i);
    fireEvent.click(expandBtn);

    expect(screen.getByText(/less/i)).not.toBeNull();

    const collapseBtn = screen.getByText(/less/i);
    fireEvent.click(collapseBtn);

    expect(screen.getByText(/more/i)).not.toBeNull();
  });
});
