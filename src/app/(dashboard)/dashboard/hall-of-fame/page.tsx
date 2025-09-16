// // src\app\(dashboard)\dashboard\components\HallOfFame\index.tsx
"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import GenericTable, { Column } from "../components/GenericTable";
import EmptyState from "../components/EmptyState";
import AddEditHallModal, { HallPayload } from "./AddEditHallModal";
import { HALL_DATA, TEAM_MEMBERS, HallItem, TeamMember } from "./data";
import { useToastContext } from "../lib/ToastContext";
import getInitials from "../../../../lib/getInitials"; // adjust path as needed
import Image from "next/image";
import { PiDotsThreeOutline } from "react-icons/pi";

import { EMPTY_ICONS } from "../components/emptyIcons";

export default function HallOfFame() {
  const { showToast } = useToastContext();
  const [items, setItems] = useState<HallItem[]>(HALL_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<HallItem | null>(null);

  // filtering
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const member = TEAM_MEMBERS.find((m) => m.id === it.memberId);
      return (
        member?.name.toLowerCase().includes(q) ||
        member?.username.toLowerCase().includes(q) ||
        it.title.toLowerCase().includes(q)
      );
    });
  }, [items, searchQuery]);

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
              }
            : p
        )
      );
      showToast("Hall of Fame has been updated.", "success");
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
              {/* {initials} */}
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
      key: "title",
      header: (
        <div className="w-full flex items-center justify-left ">
          Title
        </div>
      ),
      width: "402px",
      align: "left",
      render: (r) => <div className="txt-14">{r.title}</div>,
    },
    {
      key: "class",
      header: (
        <div className="w-full flex items-center justify-left">
          Class
        </div>
      ),
      width: "200px",
      align: "left",
      render: (r) => <div className="txt-14">{r.classYear}</div>,
    },
    {
      key: "action",
      header: (
        <div className="w-full flex items-center justify-center ">
          Action
        </div>
      ),
      width: "100px",
      align: "center",
      render: (r) => (
        <ActionsCell
          row={r}
          onEdit={() => openEdit(r)}
          onRemove={() => handleRemove(r)}
        />
        // <PiDotsThreeOutline size={18} />
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
        {/* <div className="flex items-center gap-4">
          <button */}
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
      <div className="mb-4">
        <SearchBar
          value={searchQuery}
          onChange={(v) => {
            setSearchQuery(v);
            setCurrentPage(1);
          }}
          placeholder="Search team members"
        />
      </div>
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
              /* optional: className or height if table needs a particular spacing */
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
        <div className="absolute right-0  rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] w-40 z-50">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="w-full text-left px-4 py-2 border-b border-b-[var(--Neutral-Grey-20,#D8DFE0)] flex items-center gap-2"
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
            className="w-full text-left px-4 py-2 flex items-center gap-2"
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
