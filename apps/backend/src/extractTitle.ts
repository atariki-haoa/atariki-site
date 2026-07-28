export function extractTitle(markdown: string): string {
  const headingMatch = /^\s*#\s+(.+)$/m.exec(markdown);
  if (headingMatch) {
    return headingMatch[1].trim();
  }

  const firstLine = markdown.split('\n').find((line) => line.trim().length > 0);
  return firstLine?.trim() ?? 'Untitled';
}
