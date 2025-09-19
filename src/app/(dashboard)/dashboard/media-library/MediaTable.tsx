// src\app\(dashboard)\dashboard\media-library\MediaTable.tsx
"use client";
import React from "react";
import GenericTable, { Column } from "../components/GenericTable";
import Image from "next/image";
import ActionMenuV2 from "./ActionMenuMedia"; // <-- your new action component
import type { MediaItem as MI } from "./mediaData";

type Props = {
  category?: string;
  paginated: MI[]; // page slice already computed by parent
  startIndex?: number; // page-global start index for zebra rows
  onEdit: (item: MI) => void;
  onDelete: (item: MI) => void;
  emptyState?: React.ReactNode;
};

export default function MediaTable({
  category = "Media",
  paginated,
  startIndex = 0,
  onEdit,
  onDelete,
  emptyState,
}: Props) {
  const columns: Column<MI>[] = [
    {
      key: "title",
      header: "Title",
      width: "502px",
      isClickable: true,
      onClick: (r) => onEdit(r),
      render: (m) => (
        <div className="flex items-center txt-14 font-medium cursor-pointer">
          <div className="flex flex-col">
            <span className="font-medium">{m.title}</span>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      width: "502px",
      render: (m) => <div className="txt-14 text-gray-600 truncate">{m.description ?? "-"}</div>,
    },
    {
      key: "action",
      header: "Action",
      width: "100px",
      align: "center",
      render: (m) => (
        <div className="flex items-center justify-center w-full">
          <ActionMenuV2
            onEdit={() => onEdit(m)}
            onDelete={() => onDelete(m)}
          />
        </div>
      ),
    },
  ];

  return (
    <GenericTable<MI>
      columns={columns}
      data={paginated}
      rowKey={(r) => r.id}
      rowClassName={(r, idx) => ((startIndex + idx) % 2 === 0 ? "bg-white" : "bg-[#F2F5F6]")}
      emptyState={emptyState}
    />
  );
}
