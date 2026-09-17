// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CustomSectionsEditor } from "../sections/CustomSectionsEditor";
import type { CustomSection } from "../../../types/portfolio";

const MOCK_SECTIONS: CustomSection[] = [
  {
    id: "writing-1",
    title: "Technical Writing & Research",
    subtitle: "Essays on distributed systems",
    layout: "cards",
    content: "Overview of publications",
    items: [
      {
        id: "item-1",
        title: "Zero-Leak Architecture",
        tag: "Engineering",
        date: "2026",
      },
    ],
    sortOrder: 1,
    visible: true,
  },
];

describe("CustomSectionsEditor Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders existing custom sections with title and layout badge", () => {
    render(
      <MemoryRouter>
        <CustomSectionsEditor
          sections={MOCK_SECTIONS}
          onChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/custom content blocks/i)).not.toBeNull();
    expect(screen.getByText("Technical Writing & Research")).not.toBeNull();
    expect(screen.getByText("cards")).not.toBeNull();
  });

  it("adds a new section when clicking Add Section and saving in dedicated editor", () => {
    const handleChange = vi.fn();
    render(
      <MemoryRouter>
        <CustomSectionsEditor
          sections={MOCK_SECTIONS}
          onChange={handleChange}
        />
      </MemoryRouter>
    );

    const addBtn = screen.getByRole("button", { name: /add section/i });
    fireEvent.click(addBtn);

    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveBtn);

    expect(handleChange).toHaveBeenCalled();
    const updated = handleChange.mock.calls[0][0];
    expect(updated.length).toBe(2);
    expect(updated[1].title).toBe("New Custom Section");
  });

  it("toggles section visibility", () => {
    const handleChange = vi.fn();
    render(
      <MemoryRouter>
        <CustomSectionsEditor
          sections={MOCK_SECTIONS}
          onChange={handleChange}
        />
      </MemoryRouter>
    );

    const toggleBtn = screen.getByTitle(/toggle section visibility/i);
    fireEvent.click(toggleBtn);

    expect(handleChange).toHaveBeenCalled();
    const updated = handleChange.mock.calls[0][0];
    expect(updated[0].visible).toBe(false);
  });

  it("deletes a section when clicking the trash icon", () => {
    const handleChange = vi.fn();
    render(
      <MemoryRouter>
        <CustomSectionsEditor
          sections={MOCK_SECTIONS}
          onChange={handleChange}
        />
      </MemoryRouter>
    );

    const deleteBtn = screen.getByTitle(/delete section/i);
    fireEvent.click(deleteBtn);

    expect(handleChange).toHaveBeenCalledWith([]);
  });
});
