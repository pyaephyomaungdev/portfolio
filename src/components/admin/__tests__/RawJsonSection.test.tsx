// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { RawJsonSection } from "../sections/RawJsonSection";

describe("Admin RawJsonSection UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders textarea with JSON text and valid JSON badge", () => {
    render(
      <RawJsonSection
        jsonText='{ "name": "Pyae Phyo Maung" }'
        jsonError={null}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText("Raw Portfolio JSON")).not.toBeNull();
    expect(screen.getByRole("textbox")).not.toBeNull();
    expect(screen.getByText(/valid json/i)).not.toBeNull();
  });

  it("displays syntax error banner when jsonError is provided", () => {
    render(
      <RawJsonSection
        jsonText='{ invalid json }'
        jsonError="Unexpected token i in JSON at position 2"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText(/syntax error/i)).not.toBeNull();
    expect(screen.getByText(/unexpected token i/i)).not.toBeNull();
  });

  it("triggers onChange when editing textarea content", () => {
    const handleChange = vi.fn();
    render(
      <RawJsonSection
        jsonText='{}'
        jsonError={null}
        onChange={handleChange}
      />
    );

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: '{"test":true}' } });

    expect(handleChange).toHaveBeenCalledWith('{"test":true}');
  });
});
