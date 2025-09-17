// // // broken into component for drop-down == insline select shared folder
// // // src/app/(dashboard)/dashboard/components/HallOfFame/AddEditHallModal.tsx
// // "use client";
// // import React, { useEffect, useMemo, useRef, useState } from "react";
// // import BaseModal from "../components/BaseModal";
// // import Image from "next/image";
// // import { TEAM_MEMBERS, TeamMember } from "./data";

// // import InlineSelect from "../components/InlineSelect";

// // export type HallPayload = {
// //   memberId: string;
// //   title: string;
// //   classYear: number | null;
// // };

// // export default function AddEditHallModal({
// //   open,
// //   onClose,
// //   onSave,
// //   initial,
// //   mode = "add",
// //   title = "Add to Hall of Fame",
// // }: {
// //   open: boolean;
// //   onClose: () => void;
// //   onSave: (payload: HallPayload) => Promise<void> | void;
// //   initial?: HallPayload | null;
// //   mode?: "add" | "edit";
// //   title?: string;
// // }) {
// //   const [memberId, setMemberId] = useState<string | null>(
// //     initial?.memberId ?? null
// //   );
// //   const [classYear, setClassYear] = useState<number | null>(
// //     initial?.classYear ?? null
// //   );
// //   const [itemTitle, setItemTitle] = useState(initial?.title ?? "");
// //   const [saving, setSaving] = useState(false);

// //   // track focus for the title input so we can show green border while focused
// //   const [titleFocused, setTitleFocused] = useState(false);

// //   // reset when modal opens
// //   useEffect(() => {
// //     if (open) {
// //       setMemberId(initial?.memberId ?? null);
// //       setClassYear(initial?.classYear ?? null);
// //       setItemTitle(initial?.title ?? "");
// //       setTitleFocused(false);
// //       // ensure all inline selects start closed when opening modal
// //       document.dispatchEvent(new CustomEvent("hall:closeInlineSelects"));
// //     }
// //   }, [open, initial]);

// //   // === years: descending from max(current, selected, initial) down to 2018 ===
// //   const years = useMemo(() => {
// //     const CURRENT = new Date().getFullYear();
// //     const candidateTop = classYear ?? initial?.classYear ?? CURRENT;
// //     const maxYear = Math.max(CURRENT, candidateTop);
// //     const START = 2018;
// //     const out: number[] = [];
// //     for (let y = maxYear; y >= START; y--) out.push(y);
// //     return out;
// //   }, [classYear, initial]);

// //   const canSave = !!memberId && !!classYear && itemTitle.trim().length > 0;

// //   async function handleSave() {
// //     if (!canSave) return;
// //     try {
// //       setSaving(true);
// //       await onSave({
// //         memberId: memberId!,
// //         classYear: classYear!,
// //         title: itemTitle.trim(),
// //       });
// //       onClose();
// //     } finally {
// //       setSaving(false);
// //     }
// //   }

// //   if (!open) return null;

// //   const memberItems: TeamMember[] = TEAM_MEMBERS;

// //   return (
// //     <BaseModal onClose={onClose} className="w-[486px] h-auto rounded-xl">
// //       <div className="w-full rounded-xl bg-white overflow-visible">
// //         <div className="flex items-center justify-between p-4 border-b border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
// //           <h3 className="txt-24 font-medium">
// //             {mode === "edit" ? `Edit Hall of Fame` : title}
// //           </h3>
// //           <button
// //             onClick={onClose}
// //             aria-label="Close"
// //             className="p-2 rounded-full"
// //           >
// //             <Image
// //               src="/dashboardIcons/CloseButton.svg"
// //               alt="Close"
// //               width={32}
// //               height={32}
// //             />
// //           </button>
// //         </div>

// //         <div className="p-6 ">
// //           {/* Team member select (custom inline dropdown) */}
// //           <div className="mb-4">
// //             <div className="txt-14 font-medium mb-2 ">Team Member</div>
// //             <InlineSelect<TeamMember | null>
// //               value={memberItems.find((m) => m.id === memberId) ?? null}
// //               onChange={(v) => setMemberId(v ? v.id : null)}
// //               items={memberItems}
// //               renderItem={(m) => <div className="txt-12">{m?.name}</div>}
// //               placeholder="Select team member"
// //             />
// //           </div>

// //           {/* Class (year) — also inline dropdown */}
// //           <div className="mb-4">
// //             <div className="txt-14 font-medium mb-2">Class</div>
// //             <InlineSelect<number | null>
// //               value={classYear}
// //               onChange={(v) => setClassYear(v ?? null)}
// //               items={years}
// //               renderItem={(y) => <div className="txt-12">{String(y)}</div>}
// //               placeholder="Select class"
// //             />
// //           </div>

// //           {/* Title */}
// //           <div className="mb-2">
// //             <div className="txt-14 font-medium mb-2">Title</div>
// //             <input
// //               value={itemTitle}
// //               onChange={(e) => setItemTitle(e.target.value)}
// //               placeholder="Enter title"
// //               onFocus={() => {
// //                 // clicking/focusing the plain input should close any open dropdowns
// //                 document.dispatchEvent(
// //                   new CustomEvent("hall:closeInlineSelects")
// //                 );
// //                 setTitleFocused(true);
// //               }}
// //               onBlur={() => setTitleFocused(false)}
// //               className="w-full p-3 rounded-lg bg-[#F2F5F6] txt-12 focus:outline-none "
// //               style={
// //                 titleFocused
// //                   ? { border: "1px solid var(--Secondary-action, #00C47E)" }
// //                   : { border: "1px solid transparent" }
// //               }
// //             />
// //           </div>
// //         </div>

// //         <div className="flex items-center justify-end gap-4 bg-[#F2F5F6] px-6 py-4 border-t border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
// //           <button
// //             onClick={onClose}
// //             className="w-25 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-white border border-[color:var(--Neutral-Grey-10,#E9EDEE)]"
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             onClick={handleSave}
// //             disabled={!canSave || saving}
// //             className="w-25 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-[#0E0E0E] text-white disabled:opacity-50 disabled:cursor-not-allowed"
// //           >
// //             {saving
// //               ? mode === "edit"
// //                 ? "Saving…"
// //                 : "Adding…"
// //               : mode === "edit"
// //               ? "Save Changes"
// //               : "Add"}
// //           </button>
// //         </div>
// //       </div>
// //     </BaseModal>
// //   );
// // }

// // src/app/(dashboard)/dashboard/components/HallOfFame/AddEditHallModal.tsx
// "use client";
// import React, { useEffect, useMemo, useState } from "react";
// import BaseModal from "../components/BaseModal";
// import Image from "next/image";
// import {
//   TEAM_MEMBERS,
//   INITIAL_TEAMS,
//   TeamMember,
//   Team,
// } from "./data";
// import InlineSelect from "../components/InlineSelect";

// export type HallPayload = {
//   memberId: string;
//   title: string;
//   classYear: number | null;
//   teamId: number | null;
// };

// export default function AddEditHallModal({
//   open,
//   onClose,
//   onSave,
//   initial,
//   mode = "add",
//   title = "Add to Hall of Fame",
// }: {
//   open: boolean;
//   onClose: () => void;
//   onSave: (payload: HallPayload) => Promise<void> | void;
//   initial?: HallPayload | null;
//   mode?: "add" | "edit";
//   title?: string;
// }) {
//   const [teamId, setTeamId] = useState<number | null>(
//     initial?.teamId ?? null
//   );
//   const [memberId, setMemberId] = useState<string | null>(
//     initial?.memberId ?? null
//   );
//   const [classYear, setClassYear] = useState<number | null>(
//     initial?.classYear ?? null
//   );
//   const [itemTitle, setItemTitle] = useState(initial?.title ?? "");
//   const [saving, setSaving] = useState(false);

//   const [titleFocused, setTitleFocused] = useState(false);

//   // reset when modal opens
//   useEffect(() => {
//     if (open) {
//       setTeamId(initial?.teamId ?? null);
//       setMemberId(initial?.memberId ?? null);
//       setClassYear(initial?.classYear ?? null);
//       setItemTitle(initial?.title ?? "");
//       setTitleFocused(false);
//       document.dispatchEvent(new CustomEvent("hall:closeInlineSelects"));
//     }
//   }, [open, initial]);

//   // years descending from current down to 2018
//   const years = useMemo(() => {
//     const CURRENT = new Date().getFullYear();
//     const candidateTop = classYear ?? initial?.classYear ?? CURRENT;
//     const maxYear = Math.max(CURRENT, candidateTop);
//     const START = 2018;
//     const out: number[] = [];
//     for (let y = maxYear; y >= START; y--) out.push(y);
//     return out;
//   }, [classYear, initial]);

//   const filteredMembers = useMemo(() => {
//     if (!teamId) return [];
//     return TEAM_MEMBERS.filter((m) => m.teamId === teamId);
//   }, [teamId]);

//   const canSave =
//     !!teamId && !!memberId && !!classYear && itemTitle.trim().length > 0;

//   async function handleSave() {
//     if (!canSave) return;
//     try {
//       setSaving(true);
//       await onSave({
//         teamId,
//         memberId: memberId!,
//         classYear: classYear!,
//         title: itemTitle.trim(),
//       });
//       onClose();
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (!open) return null;

//   return (
//     <BaseModal onClose={onClose} className="w-[486px] h-auto rounded-xl">
//       <div className="w-full rounded-xl bg-white overflow-visible">
//         <div className="flex items-center justify-between p-4 border-b border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
//           <h3 className="txt-24 font-medium">
//             {mode === "edit" ? `Edit Hall of Fame` : title}
//           </h3>
//           <button
//             onClick={onClose}
//             aria-label="Close"
//             className="p-2 rounded-full"
//           >
//             <Image
//               src="/dashboardIcons/CloseButton.svg"
//               alt="Close"
//               width={32}
//               height={32}
//             />
//           </button>
//         </div>

//         <div className="p-6 ">
//           {/* Team select */}
//           <div className="mb-4">
//             <div className="txt-14 font-medium mb-2">Team</div>
//             <InlineSelect<Team | null>
//               value={INITIAL_TEAMS.find((t) => t.id === teamId) ?? null}
//               onChange={(v) => {
//                 setTeamId(v ? v.id : null);
//                 setMemberId(null); // reset member when team changes
//               }}
//               items={INITIAL_TEAMS}
//               renderItem={(t) => <div className="txt-12">{t?.name}</div>}
//               placeholder="Select team"
//             />
//           </div>

//           {/* Team member select */}
//           <div className="mb-4">
//             <div className="txt-14 font-medium mb-2">Team Member</div>
//             {!teamId ? (
//               <p className="text-red-500 txt-12">
//                 Please select a team first
//               </p>
//             ) : (
//               <InlineSelect<TeamMember | null>
//                 value={filteredMembers.find((m) => m.id === memberId) ?? null}
//                 onChange={(v) => setMemberId(v ? v.id : null)}
//                 items={filteredMembers}
//                 renderItem={(m) => <div className="txt-12">{m?.name}</div>}
//                 placeholder="Select team member"
//               />
//             )}
//           </div>

//           {/* Class (year) */}
//           <div className="mb-4">
//             <div className="txt-14 font-medium mb-2">Class</div>
//             <InlineSelect<number | null>
//               value={classYear}
//               onChange={(v) => setClassYear(v ?? null)}
//               items={years}
//               renderItem={(y) => <div className="txt-12">{String(y)}</div>}
//               placeholder="Select class"
//             />
//           </div>

//           {/* Title */}
//           <div className="mb-2">
//             <div className="txt-14 font-medium mb-2">Title</div>
//             <input
//               value={itemTitle}
//               onChange={(e) => setItemTitle(e.target.value)}
//               placeholder="Enter title"
//               onFocus={() => {
//                 document.dispatchEvent(
//                   new CustomEvent("hall:closeInlineSelects")
//                 );
//                 setTitleFocused(true);
//               }}
//               onBlur={() => setTitleFocused(false)}
//               className="w-full p-3 rounded-lg bg-[#F2F5F6] txt-12 focus:outline-none "
//               style={
//                 titleFocused
//                   ? { border: "1px solid var(--Secondary-action, #00C47E)" }
//                   : { border: "1px solid transparent" }
//               }
//             />
//           </div>
//         </div>

//         <div className="flex items-center justify-end gap-4 bg-[#F2F5F6] px-6 py-4 border-t border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
//           <button
//             onClick={onClose}
//             className="w-25 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-white border border-[color:var(--Neutral-Grey-10,#E9EDEE)]"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={!canSave || saving}
//             className="w-25 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-[#0E0E0E] text-white disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {saving
//               ? mode === "edit"
//                 ? "Saving…"
//                 : "Adding…"
//               : mode === "edit"
//               ? "Save Changes"
//               : "Add"}
//           </button>
//         </div>
//       </div>
//     </BaseModal>
//   );
// }

// src/app/(dashboard)/dashboard/components/HallOfFame/AddEditHallModal.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import BaseModal from "../components/BaseModal";
import Image from "next/image";
import { TEAM_MEMBERS, INITIAL_TEAMS, TeamMember, Team } from "./data";
import InlineSelect from "../components/InlineSelect";

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
  function handleMemberFieldClickIfNoTeam(e?: React.MouseEvent) {
    if (teamId) return;
    // prevent underlying selects from toggling
    e?.preventDefault?.();
    setShowTeamWarning(true);
    // hide after 2.5s
    window.setTimeout(() => setShowTeamWarning(false), 2500);
  }

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
          {/* Team select */}
          <div className="mb-4">
            <div className="txt-14 font-medium mb-2">Team</div>
            <InlineSelect<Team | null>
              value={INITIAL_TEAMS.find((t) => t.id === teamId) ?? null}
              onChange={(v) => {
                setTeamId(v ? v.id : null);
                setMemberId(null); // reset member when team changes
              }}
              items={INITIAL_TEAMS}
              renderItem={(t) => <div className="txt-12">{t?.name}</div>}
              placeholder="Select team"
            />
          </div>

          {/* Team member select - always visible, but disabled-looking if no team */}
          <div className="mb-4">
            <div className="txt-14 font-medium mb-2">Team Member</div>

            {/* If team is selected render real InlineSelect; otherwise render a fake input (clickable) */}
            {teamId ? (
              <InlineSelect<TeamMember | null>
                value={filteredMembers.find((m) => m.id === memberId) ?? null}
                onChange={(v) => setMemberId(v ? v.id : null)}
                items={filteredMembers}
                renderItem={(m) => <div className="txt-12">{m?.name}</div>}
                placeholder="Select team member"
              />
            ) : (
              // fake disabled select that still captures clicks to show warning
              <div
                role="button"
                tabIndex={0}
                onClick={handleMemberFieldClickIfNoTeam}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleMemberFieldClickIfNoTeam();
                  }
                }}
                className="w-full p-3 rounded-lg bg-[#F2F5F6] txt-12 flex items-center justify-between cursor-not-allowed"
                aria-disabled="true"
              >
                <span className="text-[#94A3A8]">Select team first</span>
                {/* small caret to mimic select */}
                <span className="text-[#94A3A8]">▾</span>
              </div>
            )}

            {/* warning text that shows when user clicks the member field without team */}
            {showTeamWarning && (
              <p className="mt-2 text-red-500 txt-12 flex items-center gap-2">
                {/* small exclamation icon (svg inline) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="inline-block"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
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
          {/* <button
            onClick={handleSave}
            disabled={!canSave || saving}
            className={`${
              mode === "edit" ? "w-33" : "w-25"
            } h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-[#0E0E0E] text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {saving
              ? mode === "edit"
                ? "Saving…"
                : "Adding…"
              : mode === "edit"
              ? "Save Changes"
              : "Add"}
          </button> */}
        </div>
      </div>
    </BaseModal>
  );
}
