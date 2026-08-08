function slugifyTitle(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[^\x00-\x7F]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDateForSlug(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

export function generateSlug(title: string, date: Date): string {
  const base = slugifyTitle(title) || 'post';
  return `${base}-${formatDateForSlug(date)}`;
}
