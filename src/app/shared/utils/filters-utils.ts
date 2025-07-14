export function cleanFilterParams(
  filters: Partial<Record<string, any>>
): Record<string, string> {
  const params: Record<string, string> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (
      value !== null &&
      value !== undefined &&
      !(typeof value === 'string' && value.trim() === '') &&
      !(Array.isArray(value) && value.length === 0) &&
      !(typeof value === 'number' && value === 0)
    ) {
      params[key] = Array.isArray(value) ? value.join(',') : String(value);
    }
  }

  return params;
}
