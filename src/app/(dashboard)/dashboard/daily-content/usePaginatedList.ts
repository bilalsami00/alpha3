// src/app/(dashboard)/dashboard/components/DailyContent/usePaginatedList.ts
import { useMemo, useEffect, useState } from "react";

export function usePaginatedList<T>(
  initialItems: T[],
  opts?: {
    initialRowsPerPage?: number;
    filterFn?: (item: T, q: string) => boolean;
  }
) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [q, setQ] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(opts?.initialRowsPerPage ?? 10);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return items;
    const filterFn = opts?.filterFn ?? ((item: any, s: string) => ((item.text ?? "") as string).toLowerCase().includes(s));
    return items.filter((it) => filterFn(it, qq));
  }, [items, q, opts]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    if (filtered.length === 0) setCurrentPage(1);
    else if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [filtered.length, rowsPerPage, currentPage]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + rowsPerPage);

  return {
    items,
    setItems,
    q,
    setQ,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    startIndex,
    paginated,
    totalItems: filtered.length,
  };
}
