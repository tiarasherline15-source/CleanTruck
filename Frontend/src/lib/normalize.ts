import type { PaginatedResponse } from "@/lib/types";

/**
 * Normalize an API response that may be a paginated object or a plain array
 * into a flat array. This avoids repeating the same logic in every hook consumer.
 */
export function normalizeList<T>(data: PaginatedResponse<T> | T[] | undefined): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : data.results;
}
