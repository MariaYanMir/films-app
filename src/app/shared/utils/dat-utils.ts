export function formatDate(date: Date | null): string {
  return date ? date.toISOString().split('T')[0] : '';
}
