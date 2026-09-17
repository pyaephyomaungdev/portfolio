/**
 * Calculates estimated reading time in minutes from a text string.
 * Standard adult reading speed: ~200 words per minute.
 */
export function calculateReadingTime(text: string, wpm = 200): string {
  if (!text || !text.trim()) return "~1 min read";
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wpm));
  return `~${minutes} min read`;
}
