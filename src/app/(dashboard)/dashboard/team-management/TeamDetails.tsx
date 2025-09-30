// // src\app\(dashboard)\dashboard\team-management\TeamDetails.tsx
// "use client";
// import React, { useEffect, useState, useRef, useMemo } from "react";
// import Image from "next/image";
// import { PiDotsThreeOutline } from "react-icons/pi";
// import GenericTable, { Column } from "../components/GenericTable";
// import EmptyState from "../components/EmptyState";
// import { EMPTY_ICONS } from "../components/emptyIcons";
// import AddMemberModal from "./AddMemberModal";
// import ConfirmModal from "../components/ConfirmModal";
// import Pagination from "../components/Pagination";
// import type { Team, TeamMember } from "./types";
// import { useToastContext } from "../lib/ToastContext";
// import { TEAM_MEMBERS } from "./teamMembersData"; // existing dummy data
// import RemoveModal from "./RemoveModal";
// import TeamMemberSearch from "./TeamMember/TeamMemberSearch";
// import type { MemberStatusFilter } from "./types"; // <-- use the shared type

// export default function TeamDetails({
//   team,
//   onBack,
//   onUpdateTeamMemberCount,
// }: {
//   team: Team;
//   onBack: () => void;
//   onUpdateTeamMemberCount: (teamId: number, newCount: number) => void;
// }) {
//   const { showToast } = useToastContext();
//   const storageKey = `team_members_${team.id}`;

//   // Seed: members for this team
//   const initialMembers = TEAM_MEMBERS.filter(
//     (member) => member.teamId === team.id
//   );

//   const [members, setMembers] = useState<TeamMember[]>(initialMembers);
//   const [addOpen, setAddOpen] = useState(false);
//   const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
//   const [confirm, setConfirm] = useState<{
//     open: boolean;
//     member?: TeamMember;
//     type?: "remove" | "delete" | "restrict";
//   }>({ open: false });
//   const [openMenuId, setOpenMenuId] = useState<number | null>(null);

//   // Search + status filter state
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState<MemberStatusFilter>("All");

//   // Pagination state
//   const [rowsPerPage, setRowsPerPage] = useState<number>(10);
//   const [currentPage, setCurrentPage] = useState<number>(1);

//   // refs map for outside-click detection on menus
//   // this stores the wrapper element that contains the button + menu
//   const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});

//   // NEW: when a menu opens, scroll the page so the menu is visible (page scroll, not table scroll)
//   useEffect(() => {
//     if (openMenuId == null) return;

//     // wait one tick so the menu DOM has mounted
//     const tid = window.setTimeout(() => {
//       const wrapper = menuRefs.current[openMenuId];
//       if (!wrapper) return;

//       // the actual menu element has data-action-menu attribute (see below)
//       const menuEl = wrapper.querySelector("[data-action-menu]") as HTMLElement | null;
//       const elToScroll = menuEl ?? wrapper;

//       try {
//         elToScroll.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
//       } catch (err) {
//         // fallback: compute top and scroll window
//         const rect = elToScroll.getBoundingClientRect();
//         const absoluteTop = window.scrollY + rect.top;
//         window.scrollTo({ top: Math.max(0, absoluteTop - 80), behavior: "smooth" });
//       }
//     }, 0);

//     return () => clearTimeout(tid);
//   }, [openMenuId]);

//   // load members from localStorage on mount
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const raw = localStorage.getItem(storageKey);
//     if (raw) {
//       try {
//         setMembers(JSON.parse(raw));
//         return;
//       } catch {
//         // ignore parse errors
//       }
//     }
//     setMembers(initialMembers);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [storageKey]);

//   // persist & notify parent on count change (members.length = actual team size)
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       localStorage.setItem(storageKey, JSON.stringify(members));
//     }
//     onUpdateTeamMemberCount(team.id, members.length);
//   }, [members, storageKey, onUpdateTeamMemberCount, team.id]);

//   const addMember = (payload: Omit<TeamMember, "id">) => {
//     const id = Date.now() + Math.floor(Math.random() * 1000);
//     setMembers((prev) => [{ id, ...payload }, ...prev]);
//     // reset to first page so new member is visible
//     setCurrentPage(1);
//   };

//   const updateMember = (id: number, payload: Omit<TeamMember, "id">) => {
//     setMembers((prev) =>
//       prev.map((m) => (m.id === id ? { id, ...payload } : m))
//     );
//     // keep page stable
//   };

//   const removeMember = (id: number) => {
//     setMembers((prev) => prev.filter((m) => m.id !== id));
//     showToast("Team member removed.", "success");
//   };

//   const deleteMember = (id: number) => {
//     setMembers((prev) => prev.filter((m) => m.id !== id));
//     showToast("Team member deleted.", "success");
//   };

//   const restrictMember = (id: number) => {
//     setMembers((prev) =>
//       prev.map((m) => (m.id === id ? { ...m, status: "Restricted" } : m))
//     );
//     showToast("Member restricted.", "success");
//   };

//   const confirmAction = (action: typeof confirm) => {
//     if (!action.open || !action.member || !action.type) {
//       setConfirm({ open: false });
//       return;
//     }
//     const member = action.member;
//     if (action.type === "remove") removeMember(member.id);
//     if (action.type === "delete") deleteMember(member.id);
//     if (action.type === "restrict") restrictMember(member.id);
//     setConfirm({ open: false });
//   };

//   // Member action menu (uses menuRefs for outside click detection on menus)
//   const MemberActionMenu: React.FC<{ member: TeamMember }> = ({ member }) => {
//     useEffect(() => {
//       if (openMenuId !== member.id) return;
//       function onDocClick(e: MouseEvent) {
//         const node = menuRefs.current[member.id];
//         if (!node) return;
//         if (e.target && !node.contains(e.target as Node)) {
//           setOpenMenuId(null);
//         }
//       }
//       function onKey(e: KeyboardEvent) {
//         if (e.key === "Escape") setOpenMenuId(null);
//       }
//       document.addEventListener("mousedown", onDocClick);
//       document.addEventListener("keydown", onKey);
//       return () => {
//         document.removeEventListener("mousedown", onDocClick);
//         document.removeEventListener("keydown", onKey);
//       };
//     }, [openMenuId, member.id]);

//     return (
//       // keep the wrapper relative so the menu can be positioned absolute relative to it
//       <div
//         className="relative inline-block"
//         ref={(el) => {
//           // store wrapper so outside-click and scrollIntoView can find it
//           menuRefs.current[member.id] = el;
//         }}
//       >
//         <button
//           onClick={() =>
//             setOpenMenuId(openMenuId === member.id ? null : member.id)
//           }
//           className="p-1 rounded"
//           aria-expanded={openMenuId === member.id}
//           aria-haspopup="true"
//         >
//           <PiDotsThreeOutline size={24} />
//         </button>

//         {openMenuId === member.id && (
//           // IMPORTANT: no flipping logic. menu is absolutely positioned and will open downward.
//           // Add data-action-menu attribute so the outer effect can reliably find it.
//           <div
//             // changed to absolute + mt-2 so it opens over the table (downward)
//             data-action-menu
//             className="absolute right-0 mt-2 rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] w-44 max-w-[175px] z-50"
//             role="menu"
//             aria-label={`Actions for ${member.fullName}`}
//           >
//             <div className="py-1">
//               <button
//                 onClick={() => {
//                   setConfirm({ open: true, member, type: "remove" });
//                   setOpenMenuId(null);
//                 }}
//                 className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-t-lg border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
//               >
//                 <Image
//                   src="/dashboardIcons/remove.svg"
//                   alt="Remove"
//                   width={18}
//                   height={18}
//                   className="mr-2"
//                 />
//                 Remove
//               </button>

//               <button
//                 onClick={() => {
//                   setEditingMember(member);
//                   setAddOpen(true);
//                   setOpenMenuId(null);
//                 }}
//                 className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
//               >
//                 <Image
//                   src="/dashboardIcons/edit.svg"
//                   alt="Edit"
//                   width={18}
//                   height={18}
//                   className="mr-2"
//                 />
//                 Edit
//               </button>

//               <button
//                 onClick={() => {
//                   setConfirm({ open: true, member, type: "restrict" });
//                   setOpenMenuId(null);
//                 }}
//                 className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
//               >
//                 <Image
//                   src="/dashboardIcons/slash-red.svg"
//                   alt="Restrict"
//                   width={18}
//                   height={18}
//                   className="mr-2"
//                 />
//                 Restrict
//               </button>

//               <button
//                 onClick={() => {
//                   setConfirm({ open: true, member, type: "delete" });
//                   setOpenMenuId(null);
//                 }}
//                 className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-b-lg"
//               >
//                 <Image
//                   src="/dashboardIcons/trash.svg"
//                   alt="Delete"
//                   width={18}
//                   height={18}
//                   className="mr-2 "
//                 />
//                 Delete
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Table columns
//   const columns: Column<TeamMember>[] = [
//     {
//       key: "name",
//       header: "Name",
//       width: "40%",
//       render: (m) => (
//         <div className="flex items-center gap-3">
//           <div className="w-11 h-11 rounded-full border flex items-center justify-center mr-2 border-[color:var(--Neutral-Grey-10,#E9EDEE)]">
//             <span
//               className="txt-18 font-semibold"
//               style={{
//                 fontFamily: "SF Pro Display, sans-serif",
//                 fontWeight: 700,
//               }}
//             >
//               {m.fullName
//                 .split(" ")
//                 .map((s) => s[0])
//                 .slice(0, 2)
//                 .join("")
//                 .toUpperCase()}
//             </span>
//           </div>
//           <div>
//             <div className="font-medium">{m.fullName}</div>
//             <div className="txt-12 text-gray-500">{m.username}</div>
//           </div>
//         </div>
//       ),
//     },
//     {
//       key: "email",
//       header: "Email",
//       width: "35%",
//       render: (m) => (
//         <div
//           className="txt-14 overflow-hidden whitespace-nowrap text-ellipsis"
//           title={m.email}
//         >
//           {m.email}
//         </div>
//       ),
//     },
//     {
//       key: "status",
//       header: "Status",
//       width: "15%",
//       align: "center",
//       render: (m) => (
//         <div className="flex justify-center">
//           <span
//             className={`inline-flex items-center justify-center txt-12 rounded-md ${
//               m.status === "Onboard"
//                 ? "bg-[#4DF15E14] text-[#00C47E]"
//                 : m.status === "Invited"
//                 ? "border border-[#E9EDEE] bg-white"
//                 : m.status === "Restricted"
//                 ? "bg-[#FFF1F1] text-[#F14D4D]"
//                 : "bg-[#ECFDF3] text-[#00C47E]"
//             }`}
//             style={{
//               width:
//                 m.status === "Onboard"
//                   ? "68px"
//                   : m.status === "Invited"
//                   ? "74px"
//                   : "auto",
//               height: "24px",
//               padding: "4px 8px",
//             }}
//           >
//             {m.status ?? "Invited"}
//           </span>
//         </div>
//       ),
//     },
//     {
//       key: "action",
//       header: "Action",
//       width: "10%",
//       align: "center",
//       render: (m) => (
//         <div className="flex justify-center">
//           <MemberActionMenu member={m} />
//         </div>
//       ),
//     },
//   ];

//   // FILTERING: apply status filter (All / Onboard / Invited) + text search across name/username/email
//   const filteredMembers = useMemo(() => {
//     const q = searchQuery.trim().toLowerCase();
//     return members.filter((m) => {
//       if (statusFilter !== "All") {
//         if (m.status !== statusFilter) return false;
//       }

//       if (!q) return true;

//       const inName = (m.fullName || "").toLowerCase().includes(q);
//       const inUsername = (m.username || "").toLowerCase().includes(q);
//       const inEmail = (m.email || "").toLowerCase().includes(q);

//       return inName || inUsername || inEmail;
//     });
//   }, [members, searchQuery, statusFilter]);

//   // PAGINATION: compute total pages based on filteredMembers
//   const totalItems = filteredMembers.length;
//   const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
//   // clamp currentPage if filters/page size changed
//   useEffect(() => {
//     if (currentPage > totalPages) {
//       setCurrentPage(totalPages);
//     }
//   }, [currentPage, totalPages]);

//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const paginatedMembers = filteredMembers.slice(
//     startIndex,
//     startIndex + rowsPerPage
//   );

//   return (
//     <div className="w-full">
//       {/* top bar (title + add button) */}
//       <div className="flex items-center gap-4 mb-6 sm:mt-6 2xl:mt-12">
//         <button onClick={onBack} className=" rounded-full" aria-label="Back">
//           <Image src="/authBack-button.svg" alt="Back" width={32} height={32} />
//         </button>
//         <h2 className="txt-24 font-semibold">{team.name}</h2>
//         <div className="ml-auto">
//           {members.length > 0 && (
//             <button
//               onClick={() => {
//                 setEditingMember(null);
//                 setAddOpen(true);
//               }}
//               className="px-4 py-2 txt-16 rounded-lg bg-[#25292A] text-white"
//             >
//               Add Team Member
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Search + status filter */}
//       <div className="mb-4">
//         <TeamMemberSearch
//           value={searchQuery}
//           onChange={(v) => {
//             setSearchQuery(v);
//             setCurrentPage(1); // reset page when user types
//           }}
//           status={statusFilter}
//           onStatusChange={(s) => {
//             setStatusFilter(s);
//             setCurrentPage(1); // reset page when status filter changes
//           }}
//           placeholder="Search by name, username, or email"
//         />
//       </div>

//       {/* Table (paginated) */}
//       <GenericTable<TeamMember>
//         columns={columns}
//         data={paginatedMembers}
//         rowKey={(m) => m.id}
//         rowClassName={(r, idx) =>
//           (startIndex + idx) % 2 === 0 ? "bg-white" : "bg-[#F2F5F6]"
//         }
//         emptyState={
//           <EmptyState
//             icon={EMPTY_ICONS.teams}
//             title="No team members added yet"
//             // subtitle={`Start building your ${team.name} team by adding your first employee.`}
//             subtitle={`Start building your Alpha Arc team by adding your first employee.`}
//             action={
//               <button
//                 onClick={() => setAddOpen(true)}
//                 className="px-4 py-2 rounded-lg bg-[#25292A] text-white"
//               >
//                 Add Team Member
//               </button>
//             }
//             height={616}
//           />
//         }
//         tableClassName=""
//       />

//       {/* Pagination (show when there are any filtered results) */}
//       {totalItems > 0 && (
//         <div className="">
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={(p) => {
//               const next = Math.max(1, Math.min(totalPages, p));
//               setCurrentPage(next);
//             }}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={(n) => {
//               setRowsPerPage(n);
//               setCurrentPage(1);
//             }}
//             totalItems={totalItems}
//           />
//         </div>
//       )}

//       {/* Add/Edit modal */}
//       <AddMemberModal
//         open={addOpen}
//         onClose={() => {
//           setAddOpen(false);
//           setEditingMember(null);
//         }}
//         onCreate={(m) => addMember(m)}
//         onUpdate={(id, m) => updateMember(id, m)}
//         editingMember={editingMember}
//       />

//       <RemoveModal
//         open={confirm.open && confirm.type === "remove"}
//         title="Are you sure you want to remove this team member?"
//         description={
//           confirm.member
//             ? " This action will permanently remove the employee from your Alpha Arc team. "
//             : ""
//         }
//         confirmLabel="Remove"
//         onCancel={() => setConfirm({ open: false })}
//         onConfirm={() => confirmAction(confirm)}
//       />

//       {/* Confirm modal for delete and restrict */}
//       <ConfirmModal
//         open={
//           confirm.open &&
//           (confirm.type === "delete" || confirm.type === "restrict")
//         }
//         title={
//           confirm.type === "restrict"
//             ? "Are you sure you want to restrict this user?"
//             : "Are you sure you want to delete this team member?"
//         }
//         description={
//           confirm.member
//             ? confirm.type === "restrict"
//               ? "The user will lose access to the Alpha Arc app until reactivated. You can manage their status anytime."
//               : "This action will permanently delete the employee from your Alpha Arc team."
//             : ""
//         }
//         confirmLabel={confirm.type === "delete" ? "Delete" : "Restrict"}
//         intent={
//           confirm.type === "delete" || confirm.type === "restrict"
//             ? "danger"
//             : "default"
//         }
//         onCancel={() => setConfirm({ open: false })}
//         onConfirm={() => confirmAction(confirm)} // still fine to call existing function
//       />
//     </div>
//   );
// }




// src/app/(dashboard)/dashboard/team-management/TeamDetails.tsx
"use client";
import React, { useEffect, useState, useRef, useMemo, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { PiDotsThreeOutline } from "react-icons/pi";
import GenericTable, { Column } from "../components/GenericTable";
import EmptyState from "../components/EmptyState";
import { EMPTY_ICONS } from "../components/emptyIcons";
import AddMemberModal from "./AddMemberModal";
import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";
import type { Team, TeamMember } from "./types";
import { useToastContext } from "../lib/ToastContext";
import { TEAM_MEMBERS } from "./teamMembersData"; // existing dummy data
import RemoveModal from "./RemoveModal";
import TeamMemberSearch from "./TeamMember/TeamMemberSearch";
import type { MemberStatusFilter } from "./types"; // <-- use the shared type

export default function TeamDetails({
  team,
  onBack,
  onUpdateTeamMemberCount,
}: {
  team: Team;
  onBack: () => void;
  onUpdateTeamMemberCount: (teamId: number, newCount: number) => void;
}) {
  const { showToast } = useToastContext();
  const storageKey = `team_members_${team.id}`;

  // Seed: members for this team
  const initialMembers = TEAM_MEMBERS.filter((member) => member.teamId === team.id);

  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [addOpen, setAddOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [confirm, setConfirm] = useState<{
    open: boolean;
    member?: TeamMember;
    type?: "remove" | "delete" | "restrict";
  }>({ open: false });
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Search + status filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MemberStatusFilter>("All");

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // refs map for outside-click detection on menus
  // this stores the wrapper element that contains the button + menu
  const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // NEW: when a menu opens, scroll the page so the menu is visible (page scroll, not table scroll)
  useEffect(() => {
    if (openMenuId == null) return;

    // wait one tick so the menu DOM has mounted
    const tid = window.setTimeout(() => {
      const wrapper = menuRefs.current[openMenuId];
      if (!wrapper) return;

      // the actual menu element has data-action-menu attribute (portal menu will also have it)
      const menuEl = wrapper.querySelector("[data-action-menu]") as HTMLElement | null;
      const elToScroll = menuEl ?? wrapper;

      try {
        elToScroll.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      } catch (err) {
        // fallback: compute top and scroll window
        const rect = elToScroll.getBoundingClientRect();
        const absoluteTop = window.scrollY + rect.top;
        window.scrollTo({ top: Math.max(0, absoluteTop - 80), behavior: "smooth" });
      }
    }, 0);

    return () => clearTimeout(tid);
  }, [openMenuId]);

  // load members from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        setMembers(JSON.parse(raw));
        return;
      } catch {
        // ignore parse errors
      }
    }
    setMembers(initialMembers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // persist & notify parent on count change (members.length = actual team size)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(members));
    }
    onUpdateTeamMemberCount(team.id, members.length);
  }, [members, storageKey, onUpdateTeamMemberCount, team.id]);

  const addMember = (payload: Omit<TeamMember, "id">) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setMembers((prev) => [{ id, ...payload }, ...prev]);
    // reset to first page so new member is visible
    setCurrentPage(1);
  };

  const updateMember = (id: number, payload: Omit<TeamMember, "id">) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { id, ...payload } : m)));
    // keep page stable
  };

  const removeMember = (id: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    showToast("Team member removed.", "success");
  };

  const deleteMember = (id: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    showToast("Team member deleted.", "success");
  };

  const restrictMember = (id: number) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status: "Restricted" } : m)));
    showToast("Member restricted.", "success");
  };

  const confirmAction = (action: typeof confirm) => {
    if (!action.open || !action.member || !action.type) {
      setConfirm({ open: false });
      return;
    }
    const member = action.member;
    if (action.type === "remove") removeMember(member.id);
    if (action.type === "delete") deleteMember(member.id);
    if (action.type === "restrict") restrictMember(member.id);
    setConfirm({ open: false });
  };

  //
  // MemberActionMenu (portal-based) — positions itself relative to wrapper stored in menuRefs
  //
  const MemberActionMenu: React.FC<{ member: TeamMember }> = ({ member }) => {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [style, setStyle] = useState<React.CSSProperties | null>(null);

    // compute position relative to wrapperRef (menuRefs.current[member.id])
    const computePosition = () => {
      const wrapper = menuRefs.current[member.id];
      const menuEl = menuRef.current;
      if (!wrapper || !menuEl) return;

      const anchorRect = wrapper.getBoundingClientRect();
      const menuRect = menuEl.getBoundingClientRect();
      const spacing = 8;
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;

      let top = window.scrollY + anchorRect.bottom + spacing;
      let left: number | undefined;
      let right: number | undefined;

      const wouldOverflowRight = anchorRect.right + menuRect.width > viewportW;
      const spaceLeft = anchorRect.left;
      const spaceRight = viewportW - anchorRect.right;

      if (wouldOverflowRight && spaceLeft > spaceRight) {
        // try to place to the left side
        left = Math.max(8 + window.scrollX, window.scrollX + anchorRect.left - menuRect.width + anchorRect.width);
      } else {
        right = Math.max(8, viewportW - anchorRect.right);
      }

      // vertical flip if it would overflow bottom
      const bottomEdge = (top - window.scrollY) + menuRect.height;
      if (bottomEdge > viewportH) {
        const spaceAbove = anchorRect.top;
        if (menuRect.height + spacing <= spaceAbove) {
          top = window.scrollY + anchorRect.top - menuRect.height - spacing;
        } else {
          // clamp inside viewport
          const maxTop = window.scrollY + Math.max(8, viewportH - menuRect.height - 8);
          top = Math.min(Math.max(top, window.scrollY + 8), maxTop);
        }
      }

      const s: React.CSSProperties = {
        position: "absolute",
        top: `${Math.round(top)}px`,
        zIndex: 9999,
        visibility: "visible",
      };
      if (left != null) s.left = `${Math.round(left)}px`;
      if (right != null) s.right = `${Math.round(right)}px`;

      if (window.scrollY + parseFloat(s.top as string) + menuRect.height > window.scrollY + viewportH) {
        s.maxHeight = `${viewportH - 16}px`;
        s.overflow = "auto";
      }

      setStyle(s);
    };

    // open/close outside click & Escape — consider both wrapper and portal menu
    useEffect(() => {
      if (openMenuId !== member.id) return;

      function onDocClick(e: MouseEvent) {
        const t = e.target as Node | null;
        const insideWrapper = menuRefs.current[member.id]?.contains(t ?? null);
        const insideMenu = menuRef.current?.contains(t ?? null);
        if (!insideWrapper && !insideMenu) setOpenMenuId(null);
      }

      function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") setOpenMenuId(null);
      }

      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("mousedown", onDocClick);
        document.removeEventListener("keydown", onKey);
      };
    }, [openMenuId, member.id]);

    // position when menu opens and on scroll/resize
    useLayoutEffect(() => {
      if (openMenuId !== member.id) {
        setStyle(null);
        return;
      }

      // render is in DOM; compute position in next rAF
      const raf = window.requestAnimationFrame(() => {
        computePosition();

        // focus the button for keyboard users without causing scroll
        try {
          buttonRef.current?.focus({ preventScroll: true });
        } catch {
          try {
            buttonRef.current?.focus();
          } catch {
            /* ignore */
          }
        }
      });

      return () => window.cancelAnimationFrame(raf);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openMenuId]);

    useEffect(() => {
      if (openMenuId !== member.id) return;
      const handler = () => window.requestAnimationFrame(() => computePosition());
      window.addEventListener("resize", handler);
      window.addEventListener("scroll", handler, { passive: true });
      return () => {
        window.removeEventListener("resize", handler);
        window.removeEventListener("scroll", handler);
      };
    }, [openMenuId, member.id]);

    // initial offscreen style so portal never affects layout
    const initialOffscreenStyle: React.CSSProperties = {
      position: "absolute",
      top: "-9999px",
      left: "-9999px",
      visibility: "hidden",
      zIndex: 9999,
    };

    const menuNode = (
      <div
        ref={menuRef}
        data-action-menu
        role="menu"
        aria-label={`Actions for ${member.fullName}`}
        style={style ? { ...style, zIndex: 9999 } : initialOffscreenStyle}
        className="rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] w-44 max-w-[175px] z-50"
      >
        <div className="py-1">
          <button
            onClick={() => {
              setConfirm({ open: true, member, type: "remove" });
              setOpenMenuId(null);
            }}
            className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-t-lg border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
          >
            <Image src="/dashboardIcons/remove.svg" alt="Remove" width={18} height={18} className="mr-2" />
            Remove
          </button>

          <button
            onClick={() => {
              setEditingMember(member);
              setAddOpen(true);
              setOpenMenuId(null);
            }}
            className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
          >
            <Image src="/dashboardIcons/edit.svg" alt="Edit" width={18} height={18} className="mr-2" />
            Edit
          </button>

          <button
            onClick={() => {
              setConfirm({ open: true, member, type: "restrict" });
              setOpenMenuId(null);
            }}
            className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
          >
            <Image src="/dashboardIcons/slash-red.svg" alt="Restrict" width={18} height={18} className="mr-2" />
            Restrict
          </button>

          <button
            onClick={() => {
              setConfirm({ open: true, member, type: "delete" });
              setOpenMenuId(null);
            }}
            className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-b-lg"
          >
            <Image src="/dashboardIcons/trash.svg" alt="Delete" width={18} height={18} className="mr-2 " />
            Delete
          </button>
        </div>
      </div>
    );

    return (
      <>
        <div
          className="relative inline-block"
          ref={(el) => {
            // keep wrapper reference for positioning and outside-click detection
            menuRefs.current[member.id] = el;
          }}
        >
          <button
            ref={buttonRef}
            onMouseDown={(e) => e.preventDefault()} // prevent native focus scroll
            onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
            aria-expanded={openMenuId === member.id}
            aria-haspopup="true"
            className="p-1 rounded"
          >
            <PiDotsThreeOutline size={24} />
          </button>
        </div>

        {typeof document !== "undefined" && openMenuId === member.id ? createPortal(menuNode, document.body) : null}
      </>
    );
  };

  // Table columns
  const columns: Column<TeamMember>[] = [
    {
      key: "name",
      header: "Name",
      width: "40%",
      render: (m) => (
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border flex items-center justify-center mr-2 border-[color:var(--Neutral-Grey-10,#E9EDEE)]">
            <span className="txt-18 font-semibold" style={{ fontFamily: "SF Pro Display, sans-serif", fontWeight: 700 }}>
              {m.fullName.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium">{m.fullName}</div>
            <div className="txt-12 text-gray-500">{m.username}</div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      width: "35%",
      render: (m) => (
        <div className="txt-14 overflow-hidden whitespace-nowrap text-ellipsis" title={m.email}>
          {m.email}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "15%",
      align: "center",
      render: (m) => (
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center justify-center txt-12 rounded-md ${
              m.status === "Onboard"
                ? "bg-[#4DF15E14] text-[#00C47E]"
                : m.status === "Invited"
                ? "border border-[#E9EDEE] bg-white"
                : m.status === "Restricted"
                ? "bg-[#FFF1F1] text-[#F14D4D]"
                : "bg-[#ECFDF3] text-[#00C47E]"
            }`}
            style={{
              width: m.status === "Onboard" ? "68px" : m.status === "Invited" ? "74px" : "auto",
              height: "24px",
              padding: "4px 8px",
            }}
          >
            {m.status ?? "Invited"}
          </span>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      width: "10%",
      align: "center",
      render: (m) => (
        <div className="flex justify-center">
          <MemberActionMenu member={m} />
        </div>
      ),
    },
  ];

  // FILTERING: apply status filter (All / Onboard / Invited) + text search across name/username/email
  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return members.filter((m) => {
      if (statusFilter !== "All") {
        if (m.status !== statusFilter) return false;
      }

      if (!q) return true;

      const inName = (m.fullName || "").toLowerCase().includes(q);
      const inUsername = (m.username || "").toLowerCase().includes(q);
      const inEmail = (m.email || "").toLowerCase().includes(q);

      return inName || inUsername || inEmail;
    });
  }, [members, searchQuery, statusFilter]);

  // PAGINATION: compute total pages based on filteredMembers
  const totalItems = filteredMembers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  // clamp currentPage if filters/page size changed
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="w-full">
      {/* top bar (title + add button) */}
      <div className="flex items-center gap-4 mb-6 sm:mt-6 2xl:mt-12">
        <button onClick={onBack} className=" rounded-full" aria-label="Back">
          <Image src="/authBack-button.svg" alt="Back" width={32} height={32} />
        </button>
        <h2 className="txt-24 font-semibold">{team.name}</h2>
        <div className="ml-auto">
          {/* {members.length > 0 && (
            <button
              onClick={() => {
                setEditingMember(null);
                setAddOpen(true);
              }}
              className="px-4 py-2 txt-16 rounded-lg bg-[#25292A] text-white"
            >
              Add Team Member
            </button>
          )} */}
          {totalItems > 0 && (
            <button
              onClick={() => {
                setEditingMember(null);
                setAddOpen(true);
              }}
              className="px-4 py-2 txt-16 rounded-lg bg-[#25292A] text-white"
            >
              Add Team Member
            </button>
          )}
        </div>
      </div>

      {/* Search + status filter */}
      <div className="mb-4">
        <TeamMemberSearch
          value={searchQuery}
          onChange={(v) => {
            setSearchQuery(v);
            setCurrentPage(1); // reset page when user types
          }}
          status={statusFilter}
          onStatusChange={(s) => {
            setStatusFilter(s);
            setCurrentPage(1); // reset page when status filter changes
          }}
          placeholder="Search by name, username, or email"
        />
      </div>

      {/* Table (paginated) */}
      <GenericTable<TeamMember>
        columns={columns}
        data={paginatedMembers}
        rowKey={(m) => m.id}
        rowClassName={(r, idx) => (startIndex + idx) % 2 === 0 ? "bg-white" : "bg-[#F2F5F6]"}
        emptyState={
          <EmptyState
            icon={EMPTY_ICONS.teams}
            title="No team members added yet"
            subtitle={`Start building your Alpha Arc team by adding your first employee.`}
            action={
              <button onClick={() => setAddOpen(true)} className="px-4 py-2 rounded-lg bg-[#25292A] text-white">
                Add Team Member
              </button>
            }
            height={616}
          />
        }
        tableClassName=""
      />

      {/* Pagination (show when there are any filtered results) */}
      {totalItems > 0 && (
        <div className="">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => {
              const next = Math.max(1, Math.min(totalPages, p));
              setCurrentPage(next);
            }}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(n) => {
              setRowsPerPage(n);
              setCurrentPage(1);
            }}
            totalItems={totalItems}
          />
        </div>
      )}

      {/* Add/Edit modal */}
      <AddMemberModal
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          setEditingMember(null);
        }}
        onCreate={(m) => addMember(m)}
        onUpdate={(id, m) => updateMember(id, m)}
        editingMember={editingMember}
      />

      <RemoveModal
        open={confirm.open && confirm.type === "remove"}
        title="Are you sure you want to remove this team member?"
        description={
          confirm.member ? " This action will permanently remove the employee from your Alpha Arc team. " : ""
        }
        confirmLabel="Remove"
        onCancel={() => setConfirm({ open: false })}
        onConfirm={() => confirmAction(confirm)}
      />

      {/* Confirm modal for delete and restrict */}
      <ConfirmModal
        open={confirm.open && (confirm.type === "delete" || confirm.type === "restrict")}
        title={confirm.type === "restrict" ? "Are you sure you want to restrict this user?" : "Are you sure you want to delete this team member?"}
        description={
          confirm.member
            ? confirm.type === "restrict"
              ? "The user will lose access to the Alpha Arc app until reactivated. You can manage their status anytime."
              : "This action will permanently delete the employee from your Alpha Arc team."
            : ""
        }
        confirmLabel={confirm.type === "delete" ? "Delete" : "Restrict"}
        intent={confirm.type === "delete" || confirm.type === "restrict" ? "danger" : "default"}
        onCancel={() => setConfirm({ open: false })}
        onConfirm={() => confirmAction(confirm)}
      />
    </div>
  );
}
