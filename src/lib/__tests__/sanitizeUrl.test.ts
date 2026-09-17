import { describe, it, expect } from "vitest";
import { sanitizeUrl } from "../sanitizeUrl";

describe("sanitizeUrl utility", () => {
  it("allows safe http and https URLs", () => {
    expect(sanitizeUrl("https://pyaephyomaung.dev")).toBe("https://pyaephyomaung.dev");
    expect(sanitizeUrl("http://example.com/image.png")).toBe("http://example.com/image.png");
  });

  it("allows safe relative paths", () => {
    expect(sanitizeUrl("/avatar.jpg")).toBe("/avatar.jpg");
    expect(sanitizeUrl("./assets/photo.png")).toBe("./assets/photo.png");
    expect(sanitizeUrl("../doc/readme.md")).toBe("../doc/readme.md");
    expect(sanitizeUrl("#section-1")).toBe("#section-1");
  });

  it("allows safe data:image/ URIs", () => {
    const dataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    expect(sanitizeUrl(dataUrl)).toBe(dataUrl);
  });

  it("blocks dangerous javascript: and vbscript: URLs", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBe("");
    expect(sanitizeUrl("JAVASCRIPT:alert(document.cookie)")).toBe("");
    expect(sanitizeUrl("javascript :alert(1)")).toBe("");
    expect(sanitizeUrl("vbscript:msgbox(1)")).toBe("");
    expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBe("");
  });

  it("returns custom fallback if provided on blocked/invalid input", () => {
    expect(sanitizeUrl("javascript:void(0)", "/avatar.jpg")).toBe("/avatar.jpg");
    expect(sanitizeUrl(null, "/default.png")).toBe("/default.png");
    expect(sanitizeUrl(undefined, "/default.png")).toBe("/default.png");
    expect(sanitizeUrl("   ", "/default.png")).toBe("/default.png");
  });
});
