// src/app/(dashboard)/dashboard/components/TeamManagement/CreateTeamModal.tsx
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useToastContext } from "../lib/ToastContext";
import type { Team } from "./types";

export default function CreateTeamModal({
  open,
  onClose,
  onCreate,
  onUpdate,
  editingTeam,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  onUpdate?: (id: number, name: string) => void;
  editingTeam?: Team | null;
}) {
  const [name, setName] = useState("");
  const { showToast } = useToastContext();

  // when modal opens, preload if editingTeam provided; clear when closed
  useEffect(() => {
    if (!open) {
      setName("");
      return;
    }
    setName(editingTeam?.name ?? "");
  }, [open, editingTeam]);

  if (!open) return null;

  const isDisabled = name.trim().length === 0;

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      showToast("Please enter a team name.", "error");
      return;
    }

    if (editingTeam && onUpdate) {
      onUpdate(editingTeam.id, trimmed);
    } else {
      onCreate(trimmed);
    }

    setName("");
    onClose();
  };

  const isEdit = Boolean(editingTeam);

  return (
    <div
      className="fixed inset-0 bg-[#00000033] flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-team-title"
    >
      <div className="bg-white rounded-xl max-w-[520px] w-full mx-4 relative">
        {/* Header */}
        <div className="px-6 py-4 flex items-center border-b border-[#E9EDEE]">
          <h3 id="create-team-title" className="txt-24 font-medium">
            {isEdit ? "Edit Team" : "Create Team"}
          </h3>

          <button onClick={onClose} className="absolute right-4" aria-label="Close">
            <Image src="/dashboardIcons/CloseButton.svg" alt="Close" width={32} height={32} style={{ opacity: 1 }} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="txt-14 mb-2 font-medium">Team Name</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isDisabled) {
                handleSave();
              }
            }}
            placeholder="Enter team name"
            className="w-full h-14 px-3 txt-12 bg-[#F2F5F6] text-[#25292A] rounded-md focus:outline-none focus-green"
            aria-label="Team name"
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-[#E9EDEE] bg-[#F2F5F6] rounded-b-2xl">
          <button
            onClick={() => {
              setName("");
              onClose();
            }}
            className="px-4 py-2 min-w-[100px] max-h-[40px] border border-gray-300 rounded-lg txt-16 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            className={`px-3 py-2 min-w-[120px] max-h-[40px] rounded-lg txt-16 font-semibold transition-all ${
              isDisabled
                // ? "bg-[#BFC3C4] text-white cursor-not-allowed opacity-80"
                ? " bg-[#0E0E0E] text-white disabled:opacity-50  cursor-not-allowed"
                // w-36 h-10 px-3 txt-16 font-semibold rounded-lg bg-[#0E0E0E] text-white disabled:opacity-50
                : "bg-[#25292A] text-white"
            }`}
          >
            {isEdit ? "Save changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
