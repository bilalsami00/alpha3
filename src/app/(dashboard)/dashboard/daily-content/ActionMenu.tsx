// src\app\(dashboard)\dashboard\daily-content\ActionMenu.tsx
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
      ariaLabel="Daily content actions"
    />
  );
}
