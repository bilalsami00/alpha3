// src\app\(dashboard)\dashboard\hall-of-fame\page.tsx
"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import Pagination from "../components/Pagination";
import GenericTable, { Column } from "../components/GenericTable";
import EmptyState from "../components/EmptyState";
import AddEditHallModal, { HallPayload } from "./AddEditHallModal";
import { HALL_DATA, TEAM_MEMBERS, HallItem, TeamMember } from "./data";
import { useToastContext } from "../lib/ToastContext";
import getInitials from "../../../../lib/getInitials"; // adjust path as needed
import Image from "next/image";
import { PiDotsThreeOutline } from "react-icons/pi";
import TeamFilter from "./TeamFilter";

import { EMPTY_ICONS } from "../components/emptyIcons";
import { INITIAL_TEAMS } from "../team-management/teamData"; // <--- using your team data
import type { Team } from "../team-management/types";

export default function HallOfFame() {
  const { showToast } = useToastContext();
  const [items, setItems] = useState<HallItem[]>(HALL_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<HallItem | null>(null);

  // team filter state (value is team.id as string; empty string = all teams)
  const [selectedTeam, setSelectedTeam] = useState<string>("");

  // teams list from INITIAL_TEAMS
  const teams: Team[] = useMemo(() => INITIAL_TEAMS, []);

  // Build a reliable mapping: memberId -> teamName
  // This tries multiple places: member.teamId, member.teamName, member.team (string or object), row.teamId
  const memberTeamMap = useMemo(() => {
    const map = new Map<number | string, string>();

    // helper to resolve a team id to a name
    const teamIdToName = (id: any) => {
      if (id == null || id === "") return undefined;
      const found = INITIAL_TEAMS.find((t) => t.id === Number(id));
      return found ? found.name : undefined;
    };

    TEAM_MEMBERS.forEach((m) => {
      const mid = (m as any).id ?? (m as any).memberId ?? null;
      if (mid == null) return;

      // 1) explicit numeric teamId on member
      if ((m as any).teamId != null) {
        const name = teamIdToName((m as any).teamId);
        if (name) {
          map.set(mid, name);
          return; // prefer numeric mapping
        }
      }

      // 2) teamName string field
      if ((m as any).teamName) {
        map.set(mid, String((m as any).teamName).trim());
        return;
      }

      // 3) team as string
      if (typeof (m as any).team === "string" && (m as any).team.trim()) {
        map.set(mid, String((m as any).team).trim());
        return;
      }

      // 4) team as object { id, name }
      if ((m as any).team && typeof (m as any).team === "object") {
        const t = (m as any).team;
        if (t.name) {
          map.set(mid, String(t.name).trim());
          return;
        }
        if (t.id) {
          const name = teamIdToName(t.id);
          if (name) {
            map.set(mid, name);
            return;
          }
        }
      }

      // 5) some members might have metadata.department.teamName
      if ((m as any).metadata?.team?.name) {
        map.set(mid, String((m as any).metadata.team.name).trim());
        return;
      }
    });

    // Also scan HALL_DATA rows themselves in case they include teamId or teamName
    (HALL_DATA || []).forEach((row) => {
      const rid = (row as any).id ?? null;
      const mid = (row as any).memberId ?? null;
      if (mid != null) {
        // if member already mapped, skip
        if (!map.has(mid)) {
          if ((row as any).teamId != null) {
            const name = teamIdToName((row as any).teamId);
            if (name) map.set(mid, name);
          }
          if ((row as any).teamName)
            map.set(mid, String((row as any).teamName).trim());
        }
      }

      // also map by row id (in case row-level team exists)
      if (rid != null) {
        if (!map.has(rid)) {
          if ((row as any).teamId != null) {
            const name = teamIdToName((row as any).teamId);
            if (name) map.set(rid, name);
          }
          if ((row as any).teamName)
            map.set(rid, String((row as any).teamName).trim());
        }
      }
    });

    return map;
  }, [TEAM_MEMBERS]);

  // helper to get team name from a member or row (robust)
  const getTeamNameFromMember = (m?: TeamMember | null, row?: HallItem) => {
    if (!m && !row) return "";

    // prefer member mapping
    const mid = m ? (m as any).id ?? (m as any).memberId ?? null : null;
    if (mid != null && memberTeamMap.has(mid))
      return memberTeamMap.get(mid) || "";

    // fallback: check row mapping
    const rid = row ? (row as any).id ?? null : null;
    if (rid != null && memberTeamMap.has(rid))
      return memberTeamMap.get(rid) || "";

    // fallback: try numeric teamId fields
    const memberTeamId =
      (m as any)?.teamId ??
      (m as any)?.team?.id ??
      (row as any)?.teamId ??
      null;
    if (memberTeamId != null) {
      const t = INITIAL_TEAMS.find((tt) => tt.id === Number(memberTeamId));
      if (t) return t.name;
    }

    // fallback: string fields
    const candidates = [
      (m as any)?.teamName,
      (m as any)?.team,
      (m as any)?.team?.name,
      (m as any)?.department?.teamName,
      (m as any)?.metadata?.team?.name,
      (row as any)?.teamName,
      (row as any)?.team,
    ];

    for (const c of candidates) {
      if (typeof c === "string" && c.trim()) return c.trim();
    }

    return ""; // return empty so UI shows a neutral placeholder
  };

  // filtering (search + team)
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const selectedTeamId = selectedTeam ? Number(selectedTeam) : null;
    const selectedTeamName =
      selectedTeamId != null
        ? INITIAL_TEAMS.find((t) => t.id === selectedTeamId)?.name || ""
        : "";

    return items.filter((it) => {
      const member = TEAM_MEMBERS.find((m) => m.id === it.memberId);
      const memberName = member?.name?.toLowerCase() || "";
      const memberUsername = member?.username?.toLowerCase() || "";
      const title = it.title?.toLowerCase() || "";

      // team name extraction (same logic as above)
      const teamName = getTeamNameFromMember(member, it) || "";

      const matchesQuery =
        !q ||
        memberName.includes(q) ||
        memberUsername.includes(q) ||
        title.includes(q);

      let matchesTeam = true;
      if (selectedTeamId != null) {
        // if member has teamId numeric field — compare ids
        if ((member as any)?.teamId != null) {
          matchesTeam = Number((member as any).teamId) === selectedTeamId;
        } else if ((it as any)?.teamId != null) {
          matchesTeam = Number((it as any).teamId) === selectedTeamId;
        } else {
          // fallback to comparing team names
          matchesTeam = (teamName && teamName === selectedTeamName) || false;
        }
      }

      return matchesQuery && matchesTeam;
    });
  }, [items, searchQuery, selectedTeam, memberTeamMap]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + rowsPerPage);

  // CRUD handlers
  // const handleAddOrUpdate = async (payload: HallPayload) => {
  //   if (editing) {
  //     setItems((prev) =>
  //       prev.map((p) =>
  //         p.id === editing.id
  //           ? {
  //               ...p,
  //               title: payload.title,
  //               classYear: payload.classYear!,
  //               memberId: payload.memberId,
  //             }
  //           : p
  //       )
  //     );
  //     showToast("Hall of Fame has been updated.", "success");
  //     setEditing(null);
  //     setModalOpen(false);
  //     return;
  //   }

  //   const id = Date.now() + Math.floor(Math.random() * 1000);
  //   setItems((prev) => [
  //     {
  //       id,
  //       memberId: payload.memberId,
  //       title: payload.title,
  //       classYear: payload.classYear!,
  //     },
  //     ...prev,
  //   ]);
  //   showToast("Member added to Hall of Fame.", "success");
  //   setModalOpen(false);
  //   setCurrentPage(1);
  // };
  const handleAddOrUpdate = async (payload: HallPayload) => {
    if (editing) {
      setItems((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                title: payload.title,
                classYear: payload.classYear!,
                memberId: payload.memberId,
                // use undefined for "no team" to satisfy HallItem type
                teamId: payload.teamId ?? undefined,
              }
            : p
        )
      );
      showToast("Hall of Fame has been updated.", "success");
      setEditing(null);
      setModalOpen(false);
      return;
    }

    // add new row (persist teamId, use undefined when missing)
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setItems((prev) => [
      {
        id,
        memberId: payload.memberId,
        title: payload.title,
        classYear: payload.classYear!,
        teamId: payload.teamId ?? undefined, // <- use undefined, not null
      },
      ...prev,
    ]);
    showToast("Member added to Hall of Fame.", "success");
    setModalOpen(false);
    setCurrentPage(1);
  };

  const handleRemove = (row: HallItem) => {
    setItems((prev) => prev.filter((p) => p.id !== row.id));
    showToast("Member removed from Hall of Fame.", "info");
  };

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (r: HallItem) => {
    setEditing(r);
    setModalOpen(true);
  };

  // table columns
  const columns: Column<HallItem>[] = [
    {
      key: "member",
      header: (
        <div className="w-full flex items-center justify-start font-semibold">
          Team Members
        </div>
      ),
      width: "402px",
      render: (r) => {
        const m = TEAM_MEMBERS.find((x) => x.id === r.memberId) || {
          name: "Unknown",
          username: "",
        };
        const initials = getInitials(m.name);

        return (
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white border border-[color:var(--Neutral-Grey-10,#E9EDEE)] flex items-center justify-center text-sm font-medium">
              <span
                className="txt-18"
                style={{
                  fontFamily: "SF Pro Display, sans-serif",
                  fontWeight: 700,
                }}
              >
                {initials}
              </span>
            </div>
            <div>
              <div className="txt-14">{m.name}</div>
              <div className="text-sm text-[#94A3A8]">{m.username}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "team", // unique key
      header: (
        <div className="w-full flex items-center justify-start font-semibold">
          Team
        </div>
      ),
      width: "402px",
      render: (r) => {
        const m = TEAM_MEMBERS.find((x) => x.id === r.memberId) || null;
        const teamName = getTeamNameFromMember(m, r);

        return (
          <div className="flex items-center gap-3">
            <div className="txt-14 font-medium">{teamName || "Unassigned"}</div>
          </div>
        );
      },
    },
    {
      key: "title",
      header: (
        <div className="w-full flex items-center justify-left ">Title</div>
      ),
      width: "402px",
      align: "left",
      render: (r) => <div className="txt-14">{r.title}</div>,
    },
    {
      key: "class",
      header: (
        <div className="w-full flex items-center justify-left">Class</div>
      ),
      width: "200px",
      align: "left",
      render: (r) => <div className="txt-14">{r.classYear}</div>,
    },
    {
      key: "action",
      header: (
        <div className="w-full flex items-center justify-center ">Action</div>
      ),
      width: "100px",
      align: "center",
      render: (r) => (
        <ActionsCell
          row={r}
          onEdit={() => openEdit(r)}
          onRemove={() => handleRemove(r)}
        />
      ),
    },
  ];

  const emptyAction = (
    <button
      onClick={openAdd}
      className="px-4 py-2 rounded-lg bg-[#25292A] text-white"
    >
      Add to Hall of Fame
    </button>
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 sm:mt-6 2xl:mt-12">
        <h2 className="txt-24 font-semibold">Hall of Fame</h2>
        <div className="flex items-center gap-4">
          {items.length > 0 && (
            <button
              onClick={openAdd}
              className="px-4 py-2 bg-[#25292A] text-white rounded-lg txt-16"
            >
              Add to Hall of Fame
            </button>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <TeamFilter
          searchQuery={searchQuery}
          onSearchChange={(v) => {
            setSearchQuery(v);
            setCurrentPage(1);
          }}
          selectedTeam={selectedTeam}
          onTeamChange={(v) => {
            setSelectedTeam(v);
            setCurrentPage(1);
          }}
          teams={teams}
          onAdd={openAdd}
        />
      )}

      <div className="bg-white rounded shadow- sm overflow-hidden">
        <GenericTable<HallItem>
          columns={columns}
          data={paginated}
          rowKey={(r) => r.id}
          rowClassName={(r, idx) =>
            idx % 2 === 0 ? "bg-white" : "bg-[#F2F5F6]"
          }
          emptyState={
            <EmptyState
              icon={EMPTY_ICONS.hallOfFame}
              title=" No Hall of Fame Members Yet"
              subtitle="Celebrate your top performers by adding them to the Hall of Fame."
              action={emptyAction}
            />
          }
        />

        {totalItems > 0 && (
          <div className="">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) =>
                setCurrentPage(Math.max(1, Math.min(totalPages, p)))
              }
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

      {/* Add / Edit modal */}
      {/* {modalOpen && (
        <AddEditHallModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          initial={
            editing
              ? {
                  memberId: editing.memberId,
                  classYear: editing.classYear,
                  title: editing.title,
                }
              : undefined
          }
          mode={editing ? "edit" : "add"}
          onSave={async (payload) => handleAddOrUpdate(payload)}
        />
      )} */}
      {modalOpen && (
        <AddEditHallModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          // initial={
          //   editing
          //     ? {
          //         memberId: editing.memberId,
          //         classYear: editing.classYear,
          //         title: editing.title,
          //         // ensure teamId is passed when editing
          //         teamId: (editing as any).teamId ?? null,
          //       }
          //     : undefined
          // }
          initial={
            editing
              ? {
                  memberId: editing.memberId,
                  classYear: editing.classYear,
                  title: editing.title,
                  teamId: (editing as any).teamId ?? null,
                }
              : undefined
          }
          mode={editing ? "edit" : "add"}
          onSave={async (payload) => handleAddOrUpdate(payload)}
        />
      )}
    </div>
  );
}

/* Actions cell: three-dots menu with Edit / Remove (uses PiDotsThreeOutline) */
function ActionsCell({
  row,
  onEdit,
  onRemove,
}: {
  row: HallItem;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="p-2 rounded"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="More actions"
      >
        <PiDotsThreeOutline size={24} />
      </button>

      {open && (
        <div
          // className="fixed right-10  rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] w-40 z-50"
          className="fixed right-10  rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] w-45 max-w-[175px] z-50"
        >
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            // className="w-full text-left px-4 py-2 border-b border-b-[var(--Neutral-Grey-20,#D8DFE0)] flex items-center gap-2"
            className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-t-lg border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
          >
            <Image
              src="/dashboardIcons/edit.svg"
              alt="Edit"
              width={18}
              height={18}
              className="mr-2"
            />
            Edit
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onRemove();
            }}
            // className="w-full text-left px-4 py-2 flex items-center gap-2"
            className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-b-lg "
          >
            <Image
              src="/dashboardIcons/close-circle.svg"
              alt="Edit"
              width={18}
              height={18}
              className="mr-2"
            />
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
