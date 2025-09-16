// src/app/(dashboard)/dashboard/components/shared/RemoveModal.tsx
"use client";
import React from "react";
import ConfirmModal from "../components/ConfirmModal";

export default function RemoveModal(props: {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}) {
  return (
    <ConfirmModal
      {...props}
      confirmLabel={props.confirmLabel ?? "Remove"}
      // do NOT set intent here; Remove should remain default unless caller asks otherwise
      actionType="remove" // optional: semantic hint (keeps intent = default)
    />
  );
}
