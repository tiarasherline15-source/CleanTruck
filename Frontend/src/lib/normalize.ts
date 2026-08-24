import { format, parseISO } from "date-fns";
import type { PaginatedResponse } from "@/lib/types";

/**
 * Normalize an API response that may be a paginated object or a plain array
 * into a flat array. This avoids repeating the same logic in every hook consumer.
 */
export function normalizeList<T>(data: PaginatedResponse<T> | T[] | undefined): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : data.results;
}

/** Format an ISO datetime string as "Jan 15, 2024". */
export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), "MMM d, yyyy");
  } catch {
    return iso;
  }
}

/** Format an ISO datetime string as "10:30 AM". */
export function formatTime(iso: string): string {
  try {
    return format(parseISO(iso), "h:mm a");
  } catch {
    return iso;
  }
}

/** Format an ISO datetime string as "Jan 5, 10:30 AM". */
export function formatShortDateTime(iso: string): string {
  try {
    return format(parseISO(iso), "MMM d, h:mm a");
  } catch {
    return iso;
  }
}

/** Format an ISO datetime string as "January 2024". */
export function formatMonth(iso: string): string {
  try {
    return format(parseISO(iso), "MMMM yyyy");
  } catch {
    return "Unknown";
  }
}
