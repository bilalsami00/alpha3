// // src\app\(dashboard)\dashboard\team-management\page.tsx
// "use client";
// import React, { useState, useCallback } from "react";
// import { useToastContext } from "../lib/ToastContext";
// import SearchBar from "../components/SearchBar";
// import Pagination from "../components/Pagination";
// import GenericTable from "../components/GenericTable";
// import EmptyState from "../components/EmptyState";
// import ConfirmModal from "../components/ConfirmModal";
// import { INITIAL_TEAMS } from "./teamData";
// import type { Team } from "./types";
// import { EMPTY_ICONS } from "../components/emptyIcons";
// import TeamTable from "./TeamTable";
// import CreateTeamModal from "./CreateTeamModal";
// import TeamDetails from "./TeamDetails";

// export default function TeamManagement({
//   onOpenTeam,
// }: {
//   onOpenTeam?: (team: Team) => void;
// }) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [openMenuId, setOpenMenuId] = useState<number | null>(null);
//   const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);

//   // delete / confirm modal
//   const [modal, setModal] = useState<{
//     isOpen: boolean;
//     team: Team | null;
//     type: "delete" | null;
//   }>({ isOpen: false, team: null, type: null });

//   // create / edit team modal
//   const [createOpen, setCreateOpen] = useState(false);
//   const [editTeam, setEditTeam] = useState<Team | null>(null);

//   // selected team view (TeamDetails)
//   const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

//   const { showToast } = useToastContext();

//   // Filter teams based on search query
//   const filteredTeams = teams.filter(
//     (team) =>
//       team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       team.memberCount.toString().includes(searchQuery)
//   );

//   // Pagination
//   const totalPages = Math.max(1, Math.ceil(filteredTeams.length / rowsPerPage));
//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const paginatedTeams = filteredTeams.slice(
//     startIndex,
//     startIndex + rowsPerPage
//   );
//   const totalItems = filteredTeams.length;

//   // Delete flow
//   const onRequestDelete = (team: Team) => {
//     setModal({ isOpen: true, team, type: "delete" });
//     setOpenMenuId(null);
//   };

//   const handleModalAction = (confirm: boolean) => {
//     if (!confirm || !modal.team) {
//       setModal({ isOpen: false, team: null, type: null });
//       return;
//     }

//     if (modal.type === "delete") {
//       setTeams((prev) => prev.filter((t) => t.id !== modal.team!.id));
//       // if we were viewing that team, close the details screen
//       if (selectedTeam?.id === modal.team.id) {
//         setSelectedTeam(null);
//       }
//       showToast("Team deleted.", "success");
//     }

//     setModal({ isOpen: false, team: null, type: null });
//   };

//   // Helper to create a team
//   const addTeam = (name: string) => {
//     setTeams((prev) => {
//       const maxId = prev.length > 0 ? Math.max(...prev.map((t) => t.id)) : 0;
//       const newTeam: Team = { id: maxId + 1, name, memberCount: 0 };
//       return [newTeam, ...prev];
//     });
//     showToast("Team created.", "success");
//     setCurrentPage(1);
//   };

//   // Helper to update a team (used by the modal in edit mode)
//   const updateTeam = (id: number, name: string) => {
//     setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)));
//     showToast("Team updated.", "success");
//     setCurrentPage(1);
//   };

//   // Action button used both on header and in empty state
//   const createButton = (
//     <button
//       onClick={() => {
//         setEditTeam(null);
//         setCreateOpen(true);
//       }}
//       className="px-3 py-2 bg-[#25292A] text-white rounded-lg txt-16 sm:w-[123px] font-medium"
//     >
//       Create Team
//     </button>
//   );

//   // NEW: update team member count when TeamDetails notifies us
//   const updateTeamMemberCount = useCallback(
//     (teamId: number, newCount: number) => {
//       // update teams list
//       setTeams((prev) =>
//         prev.map((t) => (t.id === teamId ? { ...t, memberCount: newCount } : t))
//       );

//       // also update selectedTeam (if we're currently viewing it) so TeamDetails header shows the new count
//       setSelectedTeam((prev) =>
//         prev && prev.id === teamId ? { ...prev, memberCount: newCount } : prev
//       );
//     },
//     [setTeams, setSelectedTeam]
//   );

//   // If a team is selected, show TeamDetails screen
//   if (selectedTeam) {
//     return (
//       <div className="w-full">
//         <TeamDetails
//           team={selectedTeam}
//           onBack={() => setSelectedTeam(null)}
//           onUpdateTeamMemberCount={updateTeamMemberCount}
//         />
//       </div>
//     );
//   }

//   // --- List view (default) ---
//   return (
//     <div className="w-full">
//       <div className="flex items-center justify-between mb-6 sm:mt-6 2xl:mt-12">
//         <h2 className="txt-24 font-semibold">Team Management</h2>
//         {/* top-right create button */}
//         {createButton}
//       </div>

//       {/* Search */}
//       {teams.length > 0 && (
//         <div className="mb-4">
//           <SearchBar
//             value={searchQuery}
//             onChange={(v) => {
//               setSearchQuery(v);
//               setCurrentPage(1);
//             }}
//             placeholder="Search teams"
//           />
//         </div>
//       )}

//       <div className="bg-white rounded shadow- sm overflow-hidden">

//       {/* Table */}
//       <TeamTable
//         data={paginatedTeams}
//         startIndex={startIndex}               // <-- add this
//         openMenuId={openMenuId}
//         setOpenMenuId={setOpenMenuId}
//         onRequestDelete={onRequestDelete}
//         onRequestEdit={(team) => {
//           setEditTeam(team);
//           setCreateOpen(true);
//           setOpenMenuId(null);
//         }}
//         onRowClick={(team) => {
//           // open details screen locally
//           setSelectedTeam(team);
//           // also notify parent if provided
//           if (onOpenTeam) onOpenTeam(team);
//         }}
//       />

//       {/* Empty state if no items - Parent also shows createButton */}
//       {totalItems === 0 && (
//         <div className="mt-4">
//           <EmptyState
//             icon={EMPTY_ICONS.teams}
//             title="No team is created yet"
//             subtitle="Start by creating your first team to organize members and assign them for hood requests."
//             action={createButton}
//           />
//         </div>
//       )}

//       {/* Pagination */}
//       {totalItems > 0 && (
//         <div className="">
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={(p) => setCurrentPage(p)}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={(n) => {
//               setRowsPerPage(n);
//               setCurrentPage(1);
//             }}
//             totalItems={totalItems}
//           />
//         </div>
//       )}
//       </div>

//       {/* Confirm modal (delete team) */}
//       <ConfirmModal
//         open={modal.isOpen}
//         title="Are you sure you want to remove this team?"
//         description={
//           modal.team
//             // ? `Are you sure you want to delete ${modal.team.name}? This action cannot be undone.`
//             // : ""
//             ? `Once deleted, this team and its member assignments will be permanently removed.`
//             : ""
//         }
//         confirmLabel="Delete"
//         intent="danger"
//         onCancel={() => setModal({ isOpen: false, team: null, type: null })}
//         onConfirm={() => handleModalAction(true)}
//       />

//       {/* Create / Edit Team Modal */}
//       <CreateTeamModal
//         open={createOpen}
//         onClose={() => {
//           setCreateOpen(false);
//           setEditTeam(null);
//         }}
//         onCreate={addTeam}
//         onUpdate={updateTeam}
//         editingTeam={editTeam}
//       />
//     </div>
//   );
// }





// src/app/(dashboard)/dashboard/team-management/page.tsx
"use client";
import React from "react";
import TeamManagement from "./TeamManagement";

export default function Page() {
  // Route-level page must NOT accept custom props — render the component.
  return <TeamManagement />;
}
