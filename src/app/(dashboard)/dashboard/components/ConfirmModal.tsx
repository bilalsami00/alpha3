// src\app\(dashboard)\dashboard\components\ConfirmModal.tsx
"use client";
import React, { useState } from "react";
import BaseModal from "./BaseModal";

type FixedSize = { width: number; height: number };

export type ConfirmModalProps = {
  open: boolean;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Visual intent — callers should set this explicitly when known. */
  intent?: "default" | "danger";
  /** Optional semantic action type; used only as a convenience mapping when intent not supplied. */
  actionType?: "remove" | "delete" | "restrict";
  /** onConfirm may return a Promise (API). The modal will await it and show loading. */
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  fixedSize?: FixedSize;
  confirmClassName?: string;
  cancelClassName?: string;
  footerLeft?: React.ReactNode;
  autoCloseOnConfirm?: boolean; // default true
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  intent,
  actionType,
  onConfirm,
  onCancel,
  fixedSize = { width: 533, height: 205 },
  confirmClassName = "",
  cancelClassName = "",
  footerLeft,
  autoCloseOnConfirm = true,
}: ConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  // If intent not provided, map from actionType (convenience).
  const effectiveIntent =
    intent ?? (actionType === "delete" || actionType === "restrict" ? "danger" : "default");

  const confirmClasses =
    effectiveIntent === "danger"
      ? `w-28 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-[#F14D4D] text-white ${confirmClassName}`
      : `w-28 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-[#0E0E0E] text-white ${confirmClassName}`;

  const cancelClasses = `w-28 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-white border border-[color:var(--Neutral-Grey-10,#E9EDEE)] ${cancelClassName}`;

  async function handleConfirm() {
    try {
      const res = onConfirm();
      if (res && typeof (res as Promise<void>).then === "function") {
        setLoading(true);
        await res;
        setLoading(false);
      }
      if (autoCloseOnConfirm) onCancel();
    } catch (err) {
      setLoading(false);
      // Let caller handle errors (or extend modal to show them)
      throw err;
    }
  }

  if (!open) return null;

  return (
    <BaseModal onClose={onCancel} fixedSize={fixedSize}>
      <div className="h-full flex flex-col">
        <div className="p-6">
          <h3 className="txt-18 font-semibold mb-2">{title}</h3>
          <p className="txt-16">{description}</p>
        </div>

        <div className=" mt-auto">
          <div className="flex items-center justify-end space-x-3 bg-[#F2F5F6] w-full px-6 py-1 sm:py-4">
            <div className="mr-auto">{footerLeft}</div>

            <button disabled={loading} onClick={onCancel} className={cancelClasses}>
              {cancelLabel}
            </button>

            <button disabled={loading} onClick={handleConfirm} className={confirmClasses}>
              {loading ? "Processing…" : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
