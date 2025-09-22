//  src\app\(dashboard)\dashboard\media-library\ActionMenuMedia.tsx
"use client";
import React from "react";
import RowActionMenu from "../components/RowActionMenu";

export default function ActionMenuMedia({
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
      ariaLabel="Media library actions"
      // if you prefer narrower/wider menu: menuWidthClass="w-36" or "w-44"
    />
  );
}
