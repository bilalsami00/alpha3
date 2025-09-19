// src\app\(dashboard)\dashboard\team-management\AddMemberModal.tsx
"use client";
import React, { useEffect, useState } from "react";
import BaseModal from "../components/BaseModal";
import Image from "next/image";
import type { TeamMember } from "./types";
import { useToastContext } from "../lib/ToastContext";

export default function AddMemberModal({
  open,
  onClose,
  onCreate,
  onUpdate,
  editingMember,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (m: Omit<TeamMember, "id">) => void;
  onUpdate?: (id: number, m: Omit<TeamMember, "id">) => void;
  editingMember?: TeamMember | null;
}) {
  const { showToast } = useToastContext();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!open) {
      setFullName("");
      setUsername("");
      setEmail("");
      return;
    }
    if (editingMember) {
      setFullName(editingMember.fullName || "");
      setUsername(editingMember.username || "");
      setEmail(editingMember.email || "");
    } else {
      setFullName("");
      setUsername("");
      setEmail("");
    }
  }, [open, editingMember]);

  if (!open) return null;

  const isEdit = Boolean(editingMember);

  const allInputsFilled =
    fullName.trim().length > 0 &&
    username.trim().length > 0 &&
    email.trim().length > 0;

  const handleSave = () => {
    if (!allInputsFilled) return; // guard

    const payload = {
      fullName: fullName.trim(),
      username: username.trim(),
      email: email.trim(),
      status: isEdit && editingMember ? editingMember.status : "Invited",
    } as Omit<TeamMember, "id">;

    if (isEdit && editingMember && onUpdate) {
      onUpdate(editingMember.id, payload);
      showToast("Team Member updated.", "success");
    } else {
      onCreate(payload);
      showToast("Invite has been sent to user.", "success");
    }
    onClose();
  };

  return (
    <BaseModal onClose={onClose} fixedSize={{ width: 486, height: 466 }}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-3 flex items-center border-b border-[#E9EDEE]">
          <h3 className="txt-24 font-semibold">
            {isEdit ? "Edit user" : "Add Team Member"}
          </h3>
          <button
            onClick={onClose}
            className="absolute right-4"
            aria-label="Close"
          >
            <Image
              src="/dashboardIcons/CloseButton.svg"
              alt="Close"
              width={32}
              height={32}
              style={{ opacity: 1 }}
            />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="w-full h-10 px-4 text-sm bg-[#F2F5F6] rounded-md focus:outline-none focus-green border border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full h-10 px-4 text-sm bg-[#F2F5F6] rounded-md focus:outline-none focus-green border border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full h-10 px-4 text-sm bg-[#F2F5F6] rounded-md focus:outline-none focus-green border border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 bg-[#E9EDEE] p-4 rounded-b-md">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#E9EDEE] rounded-md text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!allInputsFilled}
            className={`px-4 py-2 rounded-md text-sm font-semibold ${
              allInputsFilled
                ? "bg-[#25292A] text-white"
                : "bg-[#25292A] text-white opacity-50 cursor-not-allowed"
            }`}
          >
            {isEdit ? "Save Changes" : "Send Invite"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
