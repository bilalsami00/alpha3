// broken into component for drop-down == insline select shared folder
// src/app/(dashboard)/dashboard/components/HallOfFame/AddEditHallModal.tsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import BaseModal from "../components/BaseModal";
import Image from "next/image";
import { TEAM_MEMBERS, TeamMember } from "./data";

import InlineSelect from "../components/InlineSelect";

export type HallPayload = {
  memberId: string;
  title: string;
  classYear: number | null;
};

export default function AddEditHallModal({
  open,
  onClose,
  onSave,
  initial,
  mode = "add",
  title = "Add to Hall of Fame",
}: {
  open: boolean;
  onClose: () => void;
  onSave: (payload: HallPayload) => Promise<void> | void;
  initial?: HallPayload | null;
  mode?: "add" | "edit";
  title?: string;
}) {
  const [memberId, setMemberId] = useState<string | null>(
    initial?.memberId ?? null
  );
  const [classYear, setClassYear] = useState<number | null>(
    initial?.classYear ?? null
  );
  const [itemTitle, setItemTitle] = useState(initial?.title ?? "");
  const [saving, setSaving] = useState(false);

  // track focus for the title input so we can show green border while focused
  const [titleFocused, setTitleFocused] = useState(false);

  // reset when modal opens
  useEffect(() => {
    if (open) {
      setMemberId(initial?.memberId ?? null);
      setClassYear(initial?.classYear ?? null);
      setItemTitle(initial?.title ?? "");
      setTitleFocused(false);
      // ensure all inline selects start closed when opening modal
      document.dispatchEvent(new CustomEvent("hall:closeInlineSelects"));
    }
  }, [open, initial]);

  // === years: descending from max(current, selected, initial) down to 2018 ===
  const years = useMemo(() => {
    const CURRENT = new Date().getFullYear();
    const candidateTop = classYear ?? initial?.classYear ?? CURRENT;
    const maxYear = Math.max(CURRENT, candidateTop);
    const START = 2018;
    const out: number[] = [];
    for (let y = maxYear; y >= START; y--) out.push(y);
    return out;
  }, [classYear, initial]);

  const canSave = !!memberId && !!classYear && itemTitle.trim().length > 0;

  async function handleSave() {
    if (!canSave) return;
    try {
      setSaving(true);
      await onSave({
        memberId: memberId!,
        classYear: classYear!,
        title: itemTitle.trim(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const memberItems: TeamMember[] = TEAM_MEMBERS;

  return (
    <BaseModal onClose={onClose} className="w-[486px] h-auto rounded-xl">
      <div className="w-full rounded-xl bg-white overflow-visible">
        <div className="flex items-center justify-between p-4 border-b border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
          <h3 className="txt-24 font-medium">
            {mode === "edit" ? `Edit Hall of Fame` : title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-full"
          >
            <Image
              src="/dashboardIcons/CloseButton.svg"
              alt="Close"
              width={32}
              height={32}
            />
          </button>
        </div>

        <div className="p-6 ">
          {/* Team member select (custom inline dropdown) */}
          <div className="mb-4">
            <div className="txt-14 font-medium mb-2 ">Team Member</div>
            <InlineSelect<TeamMember | null>
              value={memberItems.find((m) => m.id === memberId) ?? null}
              onChange={(v) => setMemberId(v ? v.id : null)}
              items={memberItems}
              renderItem={(m) => <div className="txt-12">{m?.name}</div>}
              placeholder="Select team member"
            />
          </div>

          {/* Class (year) — also inline dropdown */}
          <div className="mb-4">
            <div className="txt-14 font-medium mb-2">Class</div>
            <InlineSelect<number | null>
              value={classYear}
              onChange={(v) => setClassYear(v ?? null)}
              items={years}
              renderItem={(y) => <div className="txt-12">{String(y)}</div>}
              placeholder="Select class"
            />
          </div>

          {/* Title */}
          <div className="mb-2">
            <div className="txt-14 font-medium mb-2">Title</div>
            <input
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              placeholder="Enter title"
              onFocus={() => {
                // clicking/focusing the plain input should close any open dropdowns
                document.dispatchEvent(
                  new CustomEvent("hall:closeInlineSelects")
                );
                setTitleFocused(true);
              }}
              onBlur={() => setTitleFocused(false)}
              className="w-full p-3 rounded-lg bg-[#F2F5F6] txt-12 focus:outline-none "
              style={
                titleFocused
                  ? { border: "1px solid var(--Secondary-action, #00C47E)" }
                  : { border: "1px solid transparent" }
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 bg-[#F2F5F6] px-6 py-4 border-t border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
          <button
            onClick={onClose}
            className="w-28 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-white border border-[color:var(--Neutral-Grey-10,#E9EDEE)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave || saving}
            className="w-33 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-[#0E0E0E] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving
              ? mode === "edit"
                ? "Saving…"
                : "Adding…"
              : mode === "edit"
              ? "Save Changes"
              : "Add"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
