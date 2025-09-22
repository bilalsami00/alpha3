//  src\app\(dashboard)\dashboard\sales-manual\ActionMenu.tsx
"use client";
import React from "react";
import RowActionMenu from "../components/RowActionMenu";

export default function ActionMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <RowActionMenu
      onEdit={onEdit}
      onDelete={onDelete}
      ariaLabel="Sales manual actions"
      // keep default width; override wrapperClassName if needed
    />
  );
}
