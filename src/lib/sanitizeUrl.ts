/**
 * Sanitizes URLs to prevent Cross-Site Scripting (XSS) and unsafe protocol execution (e.g. javascript:).
 * Compliant with GitHub CodeQL rules for DOM text reinterpreted as HTML and incomplete URL substring sanitization.
 */
export function sanitizeUrl(url: string | null | undefined, fallback = ""): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;

  // Strictly reject javascript: and other executable pseudo-protocols
  const lower = trimmed.toLowerCase().replace(/[\u0000-\u001f\s]/g, "");
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("data:text/html")
  ) {
    return fallback;
  }

  // Allow safe relative paths and anchors
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("./") ||
    trimmed.startsWith("../") ||
    trimmed.startsWith("#")
  ) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (
      parsed.protocol === "http:" ||
      parsed.protocol === "https:" ||
      parsed.protocol === "mailto:" ||
      parsed.protocol === "tel:" ||
      (parsed.protocol === "data:" && lower.startsWith("data:image/"))
    ) {
      return trimmed;
    }
  } catch {
    // Malformed absolute URL
  }

  return fallback;
}
