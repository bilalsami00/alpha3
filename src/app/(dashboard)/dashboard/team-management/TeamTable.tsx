
// src\app\(dashboard)\dashboard\team-management\TeamTable.tsx
"use client";
import React, { useRef, useEffect } from "react";
import GenericTable, { Column } from "../components/GenericTable";
import type { Team } from "./types";
import Image from "next/image";
import RowActionMenu  from "../components/RowActionMenu";
import { closeAllRowActionMenus } from "../components/RowActionMenu";
closeAllRowActionMenus();


type Props = {
  data: Team[];
  startIndex: number; // <-- added: page-global start index
  openMenuId: number | null;
  setOpenMenuId: (id: number | null) => void;
  onRequestDelete: (team: Team) => void;
  onRequestEdit?: (team: Team) => void; // optional edit handler
  onRowClick?: (team: Team) => void; // optional generic row click (used by name & memberCount cells)
};

export default function TeamTable({
  data,
  startIndex,
  openMenuId,
  setOpenMenuId,
  onRequestDelete,
  onRequestEdit,
  onRowClick,
}: Props) {
  // default handler used when no onRowClick provided:
  const handleCellClick = (team: Team) => {
    if (onRowClick) {
      onRowClick(team);
    } else if (onRequestEdit) {
      onRequestEdit(team);
    } else {
      return;
    }
  };

  const teamColumns: Column<Team>[] = [
    {
      key: "name",
      header: "Team",
      width: "502px",
      isClickable: true,
      onClick: handleCellClick,
      render: (team) => (
        <div className="flex items-center txt-14 font-medium cursor-pointer w-auto">
          <div className="flex flex-col">
            <span className="font-medium">{team.name}</span>
          </div>
        </div>
      ),
    },
    {
      key: "memberCount",
      header: "No of Members",
      width: "502px",
      isClickable: true,
      onClick: handleCellClick,
      render: (team) => <span className="cursor-pointer">{team.memberCount}</span>,
    },
    {
      key: "actions",
      header: "Action",
      width: "100px",
      align: "center",
      render: (team) => (
        <div className="flex justify-center">
          <RowActionMenu
            ariaLabel={`Team actions for ${team.name}`}
            menuWidthClass="w-44 max-w-[175px]"
          >
            <button
              onClick={() => {
                onRequestEdit?.(team);
                setOpenMenuId(null);
              }}
              className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 rounded-t-lg hover:bg-gray-100 border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
            >
              <Image src="/dashboardIcons/edit.svg" alt="Edit" width={18} height={18} className="mr-2" />
              Edit
            </button>

            <button
              onClick={() => {
                onRequestDelete(team);
                setOpenMenuId(null);
              }}
              className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 rounded-b-lg hover:bg-gray-100"
            >
              <Image src="/dashboardIcons/trash.svg" alt="Delete" width={20} height={20} className="mr-2" />
              Delete
            </button>
          </RowActionMenu>
        </div>
      ),
    },
  ];

  return (
    <GenericTable<Team>
      columns={teamColumns}
      data={data}
      rowKey={(team) => team.id}
      emptyState={null}
      rowClassName={(r, idx) =>
        (startIndex + idx) % 2 === 0 ? "bg-white" : "bg-[#F2F5F6]"
      }
    />
  );
}
