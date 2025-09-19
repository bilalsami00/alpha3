// src\app\(dashboard)\dashboard\daily-content\quotes\QuotesTable.tsx
"use client";
import React from "react";
import GenericTable, { Column } from "../../components/GenericTable";
import type { QuoteItem } from "../data";
import ActionMenu from "../ActionMenu";

type Props = {
  paginated: QuoteItem[];
  startIndex: number;
  onEdit: (q: QuoteItem) => void;
  onDelete: (q: QuoteItem) => void;
  emptyState?: React.ReactNode;
};

// parse "YYYY-MM-DD" as a local Date (avoid UTC shift). If string contains a time ('T'),
// fall back to Date(...) so full ISO timestamps still work.
function parseLocalISO(iso?: string | null): Date | null {
  if (!iso) return null;
  if (iso.includes("T")) {
    const dt = new Date(iso);
    return isNaN(dt.getTime()) ? null : dt;
  }
  const parts = iso.split("-");
  if (parts.length < 3) return null;
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null;
  return new Date(y, m - 1, d); // local midnight for that date
}

function formatDateLocal(d?: string | null): string {
  if (!d) return "";
  const dt = parseLocalISO(d);
  if (!dt) return d;
  return `${dt.getDate()}-${dt.getMonth() + 1}-${String(dt.getFullYear()).slice(-2)}`;
}

export default function QuotesTable({ paginated, startIndex, onEdit, onDelete, emptyState }: Props) {
  const columns: Column<QuoteItem>[] = [
    {
      key: "quote",
      header: <div className="w-full flex items-center justify-start font-semibold">Quotes</div>,
      width: "794px",
      render: (q) => <div className="txt-14 break-words font-normal">{q.text}</div>,
    },
    {
      key: "date",
      header: <div className="w-full flex items-center justify-center px-4 font-semibold">Schedule Date</div>,
      width: "210px",
      align: "center",
      render: (q) => <div className="w-full flex items-center justify-center txt-14">{formatDateLocal(q.scheduleDate)}</div>,
    },
    {
      key: "action",
      header: <div className="w-full flex items-center justify-center px-4 font-semibold">Action</div>,
      width: "100px",
      align: "center",
      render: (q) => (
        <div className="w-full flex items-center justify-center">
          <ActionMenu onEdit={() => onEdit(q)} onDelete={() => onDelete(q)} />
        </div>
      ),
    },
  ];

  return (
    <GenericTable<QuoteItem>
      columns={columns}
      data={paginated}
      rowKey={(r) => r.id}
      rowClassName={(r, idx) => ((startIndex + idx) % 2 === 0 ? "bg-white" : "bg-[#F2F5F6]")}
      emptyState={emptyState}
    />
  );
}
