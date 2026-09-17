import { describe, it, expect } from "vitest";
import { calculateReadingTime } from "../readingTime";

describe("calculateReadingTime helper", () => {
  it("returns ~1 min read for empty or short text", () => {
    expect(calculateReadingTime("")).toBe("~1 min read");
    expect(calculateReadingTime("   ")).toBe("~1 min read");
    expect(calculateReadingTime("Short snippet.")).toBe("~1 min read");
  });

  it("calculates accurate reading minutes based on word count", () => {
    const text200 = Array(200).fill("word").join(" ");
    expect(calculateReadingTime(text200)).toBe("~1 min read");

    const text450 = Array(450).fill("word").join(" ");
    expect(calculateReadingTime(text450)).toBe("~3 min read");
  });
});
