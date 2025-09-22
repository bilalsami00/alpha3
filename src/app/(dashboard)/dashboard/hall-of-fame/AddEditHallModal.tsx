// src\app\(dashboard)\dashboard\hall-of-fame\AddEditHallModal.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import BaseModal from "../components/BaseModal";
import Image from "next/image";
import InlineSelect from "../components/InlineSelect";
import { TEAM_MEMBERS, INITIAL_TEAMS, TeamMember, Team } from "./data";
import { PiWarningCircle } from "react-icons/pi";


export type HallPayload = {
  memberId: string;
  title: string;
  classYear: number | null;
  teamId?: number | null; // made optional so `initial` can omit it
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
  const [teamId, setTeamId] = useState<number | null>(initial?.teamId ?? null);
  const [memberId, setMemberId] = useState<string | null>(
    initial?.memberId ?? null
  );
  const [classYear, setClassYear] = useState<number | null>(
    initial?.classYear ?? null
  );
  const [itemTitle, setItemTitle] = useState(initial?.title ?? "");
  const [saving, setSaving] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);

  // show transient warning when user clicks member field without a team
  const [showTeamWarning, setShowTeamWarning] = useState(false);

  // reset when modal opens
  useEffect(() => {
    if (open) {
      setTeamId(initial?.teamId ?? null);
      setMemberId(initial?.memberId ?? null);
      setClassYear(initial?.classYear ?? null);
      setItemTitle(initial?.title ?? "");
      setTitleFocused(false);
      setShowTeamWarning(false);
      document.dispatchEvent(new CustomEvent("hall:closeInlineSelects"));
    }
  }, [open, initial]);

  // years descending from current down to 2018
  const years = useMemo(() => {
    const CURRENT = new Date().getFullYear();
    const candidateTop = classYear ?? initial?.classYear ?? CURRENT;
    const maxYear = Math.max(CURRENT, candidateTop);
    const START = 2018;
    const out: number[] = [];
    for (let y = maxYear; y >= START; y--) out.push(y);
    return out;
  }, [classYear, initial]);

  // members filtered by teamId
  const filteredMembers = useMemo(() => {
    if (!teamId) return [];
    return TEAM_MEMBERS.filter((m) => (m as any).teamId === teamId);
  }, [teamId]);

  const canSave =
    !!teamId && !!memberId && !!classYear && itemTitle.trim().length > 0;

  async function handleSave() {
    if (!canSave) return;
    try {
      setSaving(true);
      await onSave({
        teamId,
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

  // helper: when clicking the member field while no team selected
  function handleMemberFieldClickIfNoTeam(
    e?: React.MouseEvent | React.KeyboardEvent
  ) {
    e?.preventDefault?.();
    setShowTeamWarning(true);
    // hide after 2.5s
    window.setTimeout(() => setShowTeamWarning(false), 2500);
  }

  return (
    <BaseModal onClose={onClose} className="w-[486px] h-auto rounded-xl">
      {/* Constrain overall modal height with viewport-based max-height and hide overflow so it won't grow */}
      <div className="w-full max-2xl:max-h-[95vh] h-auto overflow-hidden flex flex-col bg-white rounded-xl">
        {/* header (stays at top) */}
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

        {/* middle scrollable area (flex-1 + min-h-0 allows it to scroll inside flex column) */}
        <div className="p-6 overflow-auto min-h-0 flex-1 custom-scroll">
          {/* Team select */}
          <div className="mb-4">
            <div className="txt-14 font-medium mb-2">Team</div>
            <InlineSelect<Team | null>
              value={INITIAL_TEAMS.find((t) => t.id === teamId) ?? null}
              onChange={(v) => {
                setTeamId(v ? v.id : null);
                setMemberId(null);
              }}
              items={INITIAL_TEAMS}
              renderItem={(t) => <div className="txt-12">{t?.name}</div>}
              placeholder="Select team"
              showCaret
            />
          </div>

          {/* Team member select */}
          <div className="mb-4">
            <div className="txt-14 font-medium mb-2">Team Member</div>
            <div className="relative">
              <InlineSelect<TeamMember | null>
                value={filteredMembers.find((m) => m.id === memberId) ?? null}
                onChange={(v) => setMemberId(v ? v.id : null)}
                items={filteredMembers}
                renderItem={(m) => <div className="txt-12">{m?.name}</div>}
                placeholder={
                  teamId ? "Select team member" : "Select team first"
                }
                showCaret
                triggerClassName={teamId ? "" : "text-[#94A3A8] bg-[#F2F5F6]"}
                dropdownClassName=""
              />

              {!teamId && (
                <button
                  type="button"
                  aria-label="Select team first"
                  onClick={handleMemberFieldClickIfNoTeam}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleMemberFieldClickIfNoTeam(e);
                    }
                  }}
                  className="absolute inset-0 w-full h-full bg-transparent cursor-not-allowed"
                />
              )}
            </div>

            {showTeamWarning && (
              <p className="mt-2 txt-12 flex items-center gap-1">
                {/* icon */}
                <PiWarningCircle className="rotate-180 w-4 h-4"/>
                Please select a team first
              </p>
            )}
          </div>

          {/* Class (year) */}
          <div className="mb-4">
            <div className="txt-14 font-medium mb-2">Class</div>
            <InlineSelect<number | null>
              value={classYear}
              onChange={(v) => setClassYear(v ?? null)}
              items={years}
              renderItem={(y) => <div className="txt-12">{String(y)}</div>}
              placeholder="Select class"
              showCaret
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

        {/* footer (sticks to bottom) */}
        <div className="flex items-center justify-end gap-4 bg-[#F2F5F6] px-6 py-4 border-t border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
          <button
            onClick={onClose}
            className="w-25 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-white border border-[color:var(--Neutral-Grey-10,#E9EDEE)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave || saving}
            className="min-w-25 max-w-36 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-[#0E0E0E] text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
