//  src\app\(dashboard)\dashboard\hall-of-fame\page.tsx
"use client";
import React, { useMemo, useState } from "react";
import Pagination from "../components/Pagination";
import GenericTable, { Column } from "../components/GenericTable";
import EmptyState from "../components/EmptyState";
import AddEditHallModal, { HallPayload } from "./AddEditHallModal";
import { HALL_DATA, TEAM_MEMBERS, HallItem, TeamMember } from "./data";
import { useToastContext } from "../lib/ToastContext";
import getInitials from "../../../../lib/getInitials"; // adjust path as needed
import Image from "next/image";
import RowActionMenu from "../components/RowActionMenu";
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
  const memberTeamMap = useMemo(() => {
    const map = new Map<number | string, string>();

    const teamIdToName = (id: any) => {
      if (id == null || id === "") return undefined;
      const found = INITIAL_TEAMS.find((t) => t.id === Number(id));
      return found ? found.name : undefined;
    };

    TEAM_MEMBERS.forEach((m) => {
      const mid = (m as any).id ?? (m as any).memberId ?? null;
      if (mid == null) return;

      if ((m as any).teamId != null) {
        const name = teamIdToName((m as any).teamId);
        if (name) {
          map.set(mid, name);
          return;
        }
      }

      if ((m as any).teamName) {
        map.set(mid, String((m as any).teamName).trim());
        return;
      }

      if (typeof (m as any).team === "string" && (m as any).team.trim()) {
        map.set(mid, String((m as any).team).trim());
        return;
      }

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

      if ((m as any).metadata?.team?.name) {
        map.set(mid, String((m as any).metadata.team.name).trim());
        return;
      }
    });

    (HALL_DATA || []).forEach((row) => {
      const rid = (row as any).id ?? null;
      const mid = (row as any).memberId ?? null;
      if (mid != null) {
        if (!map.has(mid)) {
          if ((row as any).teamId != null) {
            const name = teamIdToName((row as any).teamId);
            if (name) map.set(mid, name);
          }
          if ((row as any).teamName) map.set(mid, String((row as any).teamName).trim());
        }
      }

      if (rid != null) {
        if (!map.has(rid)) {
          if ((row as any).teamId != null) {
            const name = teamIdToName((row as any).teamId);
            if (name) map.set(rid, name);
          }
          if ((row as any).teamName) map.set(rid, String((row as any).teamName).trim());
        }
      }
    });

    return map;
  }, []);

  // helper to get team name from a member or row (robust)
  const getTeamNameFromMember = (m?: TeamMember | null, row?: HallItem) => {
    if (!m && !row) return "";

    const mid = m ? (m as any).id ?? (m as any).memberId ?? null : null;
    if (mid != null && memberTeamMap.has(mid)) return memberTeamMap.get(mid) || "";

    const rid = row ? (row as any).id ?? null : null;
    if (rid != null && memberTeamMap.has(rid)) return memberTeamMap.get(rid) || "";

    const memberTeamId =
      (m as any)?.teamId ?? (m as any)?.team?.id ?? (row as any)?.teamId ?? null;
    if (memberTeamId != null) {
      const t = INITIAL_TEAMS.find((tt) => tt.id === Number(memberTeamId));
      if (t) return t.name;
    }

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

    return "";
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

      const teamName = getTeamNameFromMember(member, it) || "";

      const matchesQuery =
        !q ||
        memberName.includes(q) ||
        memberUsername.includes(q) ||
        title.includes(q);

      let matchesTeam = true;
      if (selectedTeamId != null) {
        if ((member as any)?.teamId != null) {
          matchesTeam = Number((member as any).teamId) === selectedTeamId;
        } else if ((it as any)?.teamId != null) {
          matchesTeam = Number((it as any).teamId) === selectedTeamId;
        } else {
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
                teamId: payload.teamId ?? undefined,
              }
            : p
        )
      );
      showToast("Member added to Hall of Fame.", "success");
      setEditing(null);
      setModalOpen(false);
      return;
    }

    const id = Date.now() + Math.floor(Math.random() * 1000);
    setItems((prev) => [
      {
        id,
        memberId: payload.memberId,
        title: payload.title,
        classYear: payload.classYear!,
        teamId: payload.teamId ?? undefined,
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
        <div className="flex justify-center">
          <RowActionMenu menuWidthClass="w-44 max-w-[175px]" ariaLabel={`Actions for Hall item ${r.id}`}>
            <button
              onClick={() => {
                openEdit(r);
              }}
              className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 rounded-t-lg hover:bg-gray-100 border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
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
                handleRemove(r);
              }}
              className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 rounded-b-lg hover:bg-gray-100"
            >
              <Image
                src="/dashboardIcons/close-circle.svg"
                alt="Remove"
                width={18}
                height={18}
                className="mr-2"
              />
              Remove
            </button>
          </RowActionMenu>
        </div>
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
      {modalOpen && (
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
