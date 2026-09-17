import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { CustomSelect } from "../CustomSelect";

describe("CustomSelect Component", () => {
  afterEach(() => {
    cleanup();
  });

  const options = [
    { value: "opt1", label: "Option 1" },
    { value: "opt2", label: "Option 2", badge: "NEW" },
    { value: "opt3", label: "Option 3" },
  ];

  it("renders with placeholder when no value is selected", () => {
    render(
      <CustomSelect
        options={options}
        placeholder="Choose something"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole("combobox").textContent).toContain("Choose something");
  });

  it("renders selected option label", () => {
    render(
      <CustomSelect
        value="opt2"
        options={options}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole("combobox").textContent).toContain("Option 2");
  });

  it("opens popover menu when clicked", () => {
    render(
      <CustomSelect
        value="opt1"
        options={options}
        onChange={vi.fn()}
      />
    );

    const button = screen.getByRole("combobox");
    expect(screen.queryByRole("listbox")).toBeNull();

    fireEvent.click(button);
    expect(screen.getByRole("listbox")).not.toBeNull();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("calls onChange and closes when option is clicked", () => {
    const handleChange = vi.fn();
    render(
      <CustomSelect
        value="opt1"
        options={options}
        onChange={handleChange}
      />
    );

    fireEvent.click(screen.getByRole("combobox"));
    const option2 = screen.getByRole("option", { name: /option 2/i });
    fireEvent.click(option2);

    expect(handleChange).toHaveBeenCalledWith("opt2");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("closes when Escape key is pressed", () => {
    render(
      <CustomSelect
        value="opt1"
        options={options}
        onChange={vi.fn()}
      />
    );

    const button = screen.getByRole("combobox");
    fireEvent.click(button);
    expect(screen.getByRole("listbox")).not.toBeNull();

    fireEvent.keyDown(button, { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
