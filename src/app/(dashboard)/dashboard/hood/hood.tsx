// // src/app/(dashboard)/dashboard/hood/page.tsx
// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import Image from "next/image";
// import GenericTable, { Column } from "../components/GenericTable";
// import SearchBar from "../components/SearchBar";
// import Pagination from "../components/Pagination";
// import EmptyState from "../components/EmptyState";
// import ConfirmModal from "../components/ConfirmModal";
// import RowActionMenu from "../components/RowActionMenu";
// import { useToastContext } from "../lib/ToastContext";
// import getInitials from "@/lib/getInitials";
// import StatusDropdown from "../team-management/TeamMember/StatusDropdown";
// import TeamSortDropdown from "./TeamSortDropdown";
// import { INITIAL_TEAMS } from "../team-management/teamData";

// /**
//  * Hood Page
//  *
//  * - Container width 1136px
//  * - Table header 44px
//  * - Column widths: 492px / 492px / 120px
//  *
//  * This creates a demo members list from INITIAL_TEAMS.
//  * Replace allRows with real member data or an API when available.
//  */

// type Member = {
//   id: number;
//   name: string;
//   username: string;
//   email?: string;
//   team: string;
//   status: "Onboard" | "Invited";
// };

// export default function Hood() {
//   const { showToast } = useToastContext();

//   // filters & pagination
//   const [teamFilter, setTeamFilter] = useState<string>("All Team");
//   const [statusFilter, setStatusFilter] = useState<"All" | "Onboard" | "Invited">("All");
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [rowsPerPage, setRowsPerPage] = useState<number>(10);
//   const [currentPage, setCurrentPage] = useState<number>(1);

//   // confirm modal for delete
//   const [confirm, setConfirm] = useState<{ open: boolean; member: Member | null }>({
//     open: false,
//     member: null,
//   });

//   // Build team options for TeamSortDropdown
//   const teamOptions = useMemo(
//     () => [{ value: "All Team", label: "All Team" }, ...INITIAL_TEAMS.map((t) => ({ value: t.name, label: t.name }))],
//     []
//   );

//   // Demo rows created from INITIAL_TEAMS:
//   // We create up to 3 demo members per team (or at least 1) so the table shows content.
//   const [allRows, setAllRows] = useState<Member[]>(
//     () =>
//       INITIAL_TEAMS.flatMap((t, ti) =>
//         Array.from({ length: Math.max(1, Math.min(3, t.memberCount || 1)) }).map((_, i) => {
//           const id = ti * 10 + i + 1;
//           const base = t.name.replace(/Team|Alpha|Bravo|Charlie|Delta|Echo|Foxtrot|Golf|Hotel/gi, "").trim() || t.name;
//           const name = `${base} Rep ${i + 1}`;
//           return {
//             id,
//             name,
//             username: `${base.replace(/\s+/g, "").toLowerCase()}${i + 1}`,
//             email: `${base.replace(/\s+/g, "").toLowerCase()}${i + 1}@example.com`,
//             team: t.name,
//             status: Math.random() > 0.5 ? "Onboard" : "Invited",
//           } as Member;
//         })
//       )
//   );

//   // search + filters
//   const filtered = useMemo(() => {
//     return allRows.filter((r) => {
//       if (teamFilter !== "All Team" && r.team !== teamFilter) return false;
//       if (statusFilter !== "All" && r.status !== statusFilter) return false;
//       const q = searchQuery.trim().toLowerCase();
//       if (!q) return true;
//       return (
//         r.name.toLowerCase().includes(q) ||
//         (r.username ?? "").toLowerCase().includes(q) ||
//         (r.email ?? "").toLowerCase().includes(q) ||
//         r.team.toLowerCase().includes(q)
//       );
//     });
//   }, [allRows, teamFilter, statusFilter, searchQuery]);

//   // pagination logic
//   const totalItems = filtered.length;
//   const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
//   useEffect(() => {
//     if (filtered.length === 0) setCurrentPage(1);
//     else if (currentPage > totalPages) setCurrentPage(totalPages);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filtered.length, rowsPerPage, totalPages]);

//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const pageRows = filtered.slice(startIndex, startIndex + rowsPerPage);

//   // actions
//   const removeMember = (id: number) => {
//     setAllRows((prev) => prev.filter((r) => r.id !== id));
//     showToast("Member removed.", "success");
//   };

//   // columns (match the requested widths)
//   const columns: Column<Member>[] = [
//     {
//       key: "name",
//       header: <div className="pl-0">Name</div>,
//       width: "492px",
//       render: (m) => (
//         <div className="flex items-center txt-14 font-medium">
//           <div
//             className="w-11 h-11 rounded-full border flex items-center justify-center mr-3 bg-white"
//             style={{ borderColor: "var(--Neutral-Grey-10, #E9EDEE)" }}
//             aria-hidden
//           >
//             <span style={{ fontWeight: 700 }}>{getInitials(m.name)}</span>
//           </div>

//           <div className="flex flex-col">
//             <span className="font-medium">{m.name}</span>
//             <span className="txt-12 text-[#51595A]">@{m.username}</span>
//           </div>
//         </div>
//       ),
//     },
//     {
//       key: "team",
//       header: "Team",
//       width: "492px",
//       accessor: (m) => <div className="text-sm">{m.team}</div>,
//     },
//     {
//       key: "status",
//       header: <div className="text-center">Status</div>,
//       width: "120px",
//       align: "center",
//       render: (m) => (
//         <div className="flex items-center gap-2 justify-center">
//           <div
//             style={{
//               width: 12,
//               height: 12,
//               borderRadius: 999,
//               background: m.status === "Onboard" ? "#00C47E" : "#FF5A5F",
//               boxShadow: m.status === "Onboard" ? "0 0 0 4px rgba(0,196,126,0.08)" : "0 0 0 4px rgba(255,90,95,0.06)",
//               border: "1px solid rgba(0,0,0,0.04)",
//             }}
//             aria-hidden
//           />
//           {/* <span className="text-sm text-gray-600">{m.status}</span> */}
//         </div>
//       ),
//     },

//   ];

//   return (
//     <div className="w-full h-full">
//       <div className=" w-full">
//         {/* Heading + controls */}
//         <div className="flex items-center justify-between mb-6 sm:mt-6 2xl:mt-12">
//           <h1 className="text-2xl font-semibold">Hood Status</h1>

//           <div className="flex items-center gap-3">
//             <TeamSortDropdown
//               value={teamFilter}
//               onChange={(v) => {
//                 setTeamFilter(v);
//                 setCurrentPage(1);
//               }}
//               options={teamOptions}
//             />

//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded  overflow-hidden">
//           <GenericTable<Member>
//             columns={columns}
//             data={pageRows}
//             rowKey={(r) => r.id}
//             rowClassName={(r, idx) => ((startIndex + idx) % 2 === 0 ? "bg-white" : "bg-[#F2F5F6]")}
//             emptyState={
//               <EmptyState
//                 title="No results"
//                 subtitle="No members match the current filters. Try adjusting the filters or search."
//               />
//             }
//             tableClassName=""
//           />

//           {/* Pagination */}
//           {totalItems > 0 && (
//             <div className="mt-0">
//               <Pagination
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 onPageChange={(p) => {
//                   if (p < 1 || p > totalPages) return;
//                   setCurrentPage(p);
//                 }}
//                 rowsPerPage={rowsPerPage}
//                 onRowsPerPageChange={(n) => {
//                   setRowsPerPage(n);
//                   setCurrentPage(1);
//                 }}
//                 totalItems={totalItems}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// src/app/(dashboard)/dashboard/hood/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import GenericTable, { Column } from "../components/GenericTable";
// import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
// import ConfirmModal from "../components/ConfirmModal";
// import RowActionMenu from "../components/RowActionMenu";
import { useToastContext } from "../lib/ToastContext";
import getInitials from "@/lib/getInitials";
import TeamSortDropdown from "./TeamSortDropdown";
import { INITIAL_TEAMS } from "../team-management/teamData";
import { TEAM_MEMBERS } from "../team-management/teamMembersData";
import { HOOD_REQUESTED_IDS } from "./hoodRequestsData";

/**
 * Hood Page — now uses real TEAM_MEMBERS
 *
 * - Container width 1136px
 * - Table header 44px
 * - Column widths: 492px / 492px / 120px
 */

type Member = {
  id: number;
  name: string;
  username?: string;
  email?: string;
  team: string;
  status: "Onboard" | "Invited" | "Restricted";
};

export default function Hood() {
  const { showToast } = useToastContext();

  // filters & pagination
  const [teamFilter, setTeamFilter] = useState<string>("All Team");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Onboard" | "Invited" | "Restricted"
  >("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // confirm modal for delete
  const [confirm, setConfirm] = useState<{
    open: boolean;
    member: Member | null;
  }>({
    open: false,
    member: null,
  });

  // Build team options for TeamSortDropdown
  const teamOptions = useMemo(
    () => [
      { value: "All Team", label: "All Team" },
      ...INITIAL_TEAMS.map((t) => ({ value: t.name, label: t.name })),
    ],
    []
  );

  // Map TEAM_MEMBERS -> rows with team names
  const initialRows = useMemo<Member[]>(() => {
    const teamMap = new Map<number, string>(
      INITIAL_TEAMS.map((t) => [t.id, t.name])
    );
    return TEAM_MEMBERS.map((m) => ({
      id: m.id,
      name: m.fullName,
      username: m.username,
      email: m.email,
      team: teamMap.get(m.teamId) ?? `Team ${m.teamId}`,
      status:
        m.status === "Onboard" ||
        m.status === "Invited" ||
        m.status === "Restricted"
          ? m.status
          : "Invited",
    }));
  }, []);

  const [allRows, setAllRows] = useState<Member[]>(initialRows);

  // search + filters
  const filtered = useMemo(() => {
    return allRows.filter((r) => {
      if (teamFilter !== "All Team" && r.team !== teamFilter) return false;
      if (statusFilter !== "All" && r.status !== statusFilter) return false;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        (r.username ?? "").toLowerCase().includes(q) ||
        (r.email ?? "").toLowerCase().includes(q) ||
        r.team.toLowerCase().includes(q)
      );
    });
  }, [allRows, teamFilter, statusFilter, searchQuery]);

  // pagination logic
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  useEffect(() => {
    if (filtered.length === 0) setCurrentPage(1);
    else if (currentPage > totalPages) setCurrentPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, rowsPerPage, totalPages]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const pageRows = filtered.slice(startIndex, startIndex + rowsPerPage);

  // actions
  const removeMember = (id: number) => {
    setAllRows((prev) => prev.filter((r) => r.id !== id));
    showToast("Member removed.", "success");
  };

  // columns (match the requested widths)
  const columns: Column<Member>[] = [
    {
      key: "name",
      header: <div className="pl-0">Name</div>,
      width: "492px",
      render: (m) => (
        <div className="flex items-center txt-14 font-medium gap-3">
          <div
            className="w-11 h-11 rounded-full bg-white border border-[color:var(--Neutral-Grey-10,#E9EDEE)] flex items-center justify-center text-sm font-medium"
            style={{ borderColor: "var(--Neutral-Grey-10, #E9EDEE)" }}
            aria-hidden
          >
            <span
              className="txt-18 font-semibold"
              style={{
                fontFamily: "SF Pro Display, sans-serif",
                fontWeight: 700,
              }}
            >
              {getInitials(m.name)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-medium">{m.name}</span>
            <span className="txt-12 text-[#51595A]">@{m.username}</span>
          </div>
        </div>
      ),
    },
    {
      key: "team",
      header: "Team",
      width: "492px",
      accessor: (m) => <div className="text-sm">{m.team}</div>,
    },
    {
      key: "status",
      header: <div className="text-center">Status</div>,
      width: "120px",
      align: "center",
      render: (m) => {
        const requested = HOOD_REQUESTED_IDS.has(m.id);
        const src = requested
          ? "/dashboardIcons/green-hood.svg"
          : "/dashboardIcons/red-hood.svg";
        const title = requested ? "Requested Hood access" : "No Hood request";

        return (
          <div
            className="flex items-center justify-center"
            style={{ gap: "3.33px" }}
            title={title}
            aria-label={title}
          >
            {/* outer wrapper keeps the padding you specified */}
            <div className="flex justify-center items-center">
              <Image src={src} alt={title} width={16} height={16} />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full h-full">
      <div className=" w-full">
        {/* Heading + controls */}
        <div className="flex items-center justify-between mb-6 sm:mt-6 2xl:mt-12">
          <h1 className="txt-24 font-semibold">Hood Status</h1>

          <div className="flex items-center gap-3">
            <TeamSortDropdown
              value={teamFilter}
              onChange={(v) => {
                setTeamFilter(v);
                setCurrentPage(1);
              }}
              options={teamOptions}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded  overflow-hidden">
          <GenericTable<Member>
            columns={columns}
            data={pageRows}
            rowKey={(r) => r.id}
            rowClassName={(r, idx) =>
              (startIndex + idx) % 2 === 0 ? "bg-white" : "bg-[#F2F5F6]"
            }
            emptyState={
              <EmptyState
                title="No results"
                subtitle="No members match the current filters. Try adjusting the filters or search."
              />
            }
            tableClassName=""
          />

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="mt-0">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => {
                  if (p < 1 || p > totalPages) return;
                  setCurrentPage(p);
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
        </div>
      </div>

      {/* Confirm modal */}
      {/* <ConfirmModal
        open={confirm.open}
        title="Remove member?"
        description={confirm.member ? `Are you sure you want to remove ${confirm.member.name} from this team?` : ""}
        confirmLabel="Remove"
        intent="danger"
        onCancel={() => setConfirm({ open: false, member: null })}
        onConfirm={() => {
          if (confirm.member) removeMember(confirm.member.id);
          setConfirm({ open: false, member: null });
        }}
      /> */}
    </div>
  );
}
