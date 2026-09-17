// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { ProfileSection } from "../sections/ProfileSection";
import { initialPortfolioData } from "../../../data/portfolioData";

describe("Admin ProfileSection UI Component", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const mockProfile = initialPortfolioData.profile!;

  it("renders profile identity inputs with current values", () => {
    render(
      <ProfileSection
        profile={mockProfile}
        onChange={vi.fn()}
        onUploadAvatar={vi.fn()}
        isUploadingAvatar={false}
      />
    );

    expect(screen.getByDisplayValue(mockProfile?.name || "")).not.toBeNull();
    expect(screen.getByDisplayValue(mockProfile?.headline || "")).not.toBeNull();
  });

  it("calls onChange when typing into name input", () => {
    const handleChange = vi.fn();
    render(
      <ProfileSection
        profile={mockProfile}
        onChange={handleChange}
        onUploadAvatar={vi.fn()}
        isUploadingAvatar={false}
      />
    );

    const nameInput = screen.getByDisplayValue(mockProfile?.name || "");
    fireEvent.change(nameInput, { target: { value: "New Name" } });

    expect(handleChange).toHaveBeenCalled();
  });
});
