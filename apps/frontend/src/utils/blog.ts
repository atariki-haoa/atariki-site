export function getExcerpt(markdown: string, length = 160): string {
  const withoutLeadingHeading = markdown.replace(/^\s*#{1,6}[^\n]*\n+/, '');

  const plainText = withoutLeadingHeading
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/~~([^~]*)~~/g, '$1')
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  if (plainText.length <= length) {
    return plainText;
  }

  const truncated = plainText.slice(0, length);
  const lastSpace = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : length)}…`;
}
