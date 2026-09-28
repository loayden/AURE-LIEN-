export type PaginationParams = { page: number; limit: number };

export function parsePaginationParams(url: URL, defaults = { page: 1, limit: 24 }): PaginationParams {
  const rawPage = Number(url.searchParams.get("page") ?? defaults.page);
  const rawLimit = Number(url.searchParams.get("limit") ?? defaults.limit);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? Math.min(rawPage, 1000) : defaults.page;
  const limit = Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : defaults.limit;
  return { page, limit };
}

export function paginateArray<T>(items: T[], page: number, limit: number): {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
} {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    pagination: { page: safePage, limit, total, totalPages },
  };
}
