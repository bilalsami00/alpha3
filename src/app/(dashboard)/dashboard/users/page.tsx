// app/(dashboard)/dashboard/components/Users/index.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useToastContext } from "../lib/ToastContext";
import getInitials from "@/lib/getInitials";
import { INITIAL_USERS } from "./usersData";
import type { User, UserStatus } from "./types";

// Import shared components
import GenericTable, { Column } from "../components/GenericTable";
import EmptyState from "../components/EmptyState";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import ConfirmModal from "../components/ConfirmModal";
// Import User-specific components
import ViewModal from "./ViewModal";
import { PiDotsThreeOutline } from "react-icons/pi";
import Image from "next/image";

export default function Users() {
  const [activeTab, setActiveTab] = useState<UserStatus>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "restrict" | "delete" | null;
    user: User | null;
    action: "restrict" | "unrestrict" | null;
  }>({ isOpen: false, type: null, user: null, action: null });

  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null,
  });
  const [selectedTeam, setSelectedTeam] = useState<string>("");

  // Use toast context
  const { showToast } = useToastContext();

  // init users and ensure username is present
  const [allUsers, setAllUsers] = useState<User[]>(
    INITIAL_USERS.map((u) => ({
      ...u,
      username: u.username ?? u.email.split("@")[0],
    }))
  );

  // outside click to close menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openMenuId !== null &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId]?.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  // filtering
  const filteredUsers = allUsers.filter(
    (user) =>
      user.status === activeTab &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.username ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (user.phone ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.salesReason ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  // pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));
  useEffect(() => {
    if (filteredUsers.length === 0) setCurrentPage(1);
    else if (currentPage > totalPages) setCurrentPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredUsers.length, rowsPerPage, totalPages]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const totalItems = filteredUsers.length;

  const toggleMenu = (userId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOpenMenuId((prev) => (prev === userId ? null : userId));
  };

  const registerMenuRef = (id: number, el: HTMLDivElement | null) => {
    menuRefs.current[id] = el;
  };

  // menu actions
  const handleMenuAction = (user: User, action: "restrict" | "delete") => {
    setOpenMenuId(null);

    if (action === "restrict") {
      if (user.status === "active") {
        setModal({ isOpen: true, type: "restrict", user, action: "restrict" });
        return;
      }
      if (user.status === "restricted") {
        setAllUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: "active" } : u))
        );
        showToast("User unrestricted.", "success");
        return;
      }
      setModal({ isOpen: true, type: "restrict", user, action: "restrict" });
      return;
    }

    if (action === "delete") {
      setModal({ isOpen: true, type: "delete", user, action: null });
    }
  };

  const handleModalAction = (confirm: boolean) => {
    if (!confirm) {
      setModal({ isOpen: false, type: null, user: null, action: null });
      return;
    }
    if (!modal.user) {
      setModal({ isOpen: false, type: null, user: null, action: null });
      return;
    }

    if (modal.type === "restrict" && modal.action === "restrict") {
      setAllUsers((prev) =>
        prev.map((u) =>
          u.id === modal.user!.id ? { ...u, status: "restricted" } : u
        )
      );
      showToast("User restricted.", "success");
    } else if (modal.type === "delete") {
      setAllUsers((prev) => prev.filter((u) => u.id !== modal.user!.id));
      showToast("User deleted.", "success");
    }

    setModal({ isOpen: false, type: null, user: null, action: null });
  };

  // view modal actions
  const openViewModal = (user: User) => {
    setSelectedTeam("");
    setViewModal({ isOpen: true, user });
  };
  const closeViewModal = () => setViewModal({ isOpen: false, user: null });

  const handleRejectFromView = (userId: number) => {
    setAllUsers((prev) => prev.filter((u) => u.id !== userId));
    closeViewModal();
    showToast("Request rejected.", "info");
  };
  const handleAddToSalesTeam = (userId: number, team?: string | null) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: "active" } : u))
    );
    closeViewModal();
    showToast("Request accepted.", "success");
  };

  // Define columns for the table
  const userColumns: Column<User>[] = [
    {
      key: "name",
      header: "Name",
      width: "502px",
      render: (user) => (
        <div className="flex items-center txt-14 font-medium">
          <div
            className="w-11 h-11 rounded-full border flex items-center justify-center mr-3 bg-white border-[color:var(--Neutral-Grey-10,#E9EDEE)]"
            aria-hidden
          >
            <span
              className="txt-18 "
              style={{
                fontFamily: "SF Pro Display, sans-serif",
                fontWeight: 700,
              }}
            >
              {getInitials(user.name)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="txt-12 text-[#51595A]">{user.username}</span>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      width: "502px",
      accessor: (user) => user.email,
    },
    {
      key: "actions",
      header: "Action",
      width: "100px",
      align: "center",
      render: (user) => (
        <div className="relative inline-block">
          <button
            onClick={(e) => toggleMenu(user.id, e)}
            className="p-1 rounded "
          >
            <PiDotsThreeOutline size={24} />
          </button>

          {openMenuId === user.id && (
            <div
              ref={(el) => registerMenuRef(user.id, el)}
              className="absolute right-4 sm:right-0   sm:-mt-1 w-40 bg-white rounded-md shadow-lg z-50 border border-gray-200"
            >
              <div className="py-1">
                <button
                  onClick={() => handleMenuAction(user, "restrict")}
                  className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <Image
                    src={
                      user.status === "active"
                        ? "/dashboardIcons/slash-red.svg"
                        : "/dashboardIcons/slash.svg"
                    }
                    alt="icon"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  {user.status === "active" ? "Restrict" : "Unrestrict"}
                </button>
                <button
                  onClick={() => handleMenuAction(user, "delete")}
                  className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <Image
                    src="/dashboardIcons/trash.svg"
                    alt="icon"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  const requestColumns: Column<User>[] = [
    {
      key: "name",
      header: "Full name",
      width: "240px",
      render: (user) => (
        <div className="flex items-center txt-14 font-medium">
          <div
            className="w-11 h-11 rounded-full border flex items-center justify-center mr-3 bg-white border-[color:var(--Neutral-Grey-10,#E9EDEE)]"
            aria-hidden
          >
            <span
              className="txt-18"
              style={{
                fontFamily: "SF Pro Display, sans-serif",
                fontWeight: 700,
              }}
            >
              {getInitials(user.name)}
            </span>
          </div>

          <div className="flex flex-col max-w-[160px] overflow-hidden">
            <span className="overflow-hidden whitespace-nowrap text-ellipsis font-medium">
              {user.name}
            </span>
            <span className="txt-12 text-[#51595A] overflow-hidden whitespace-nowrap text-ellipsis">
              @{user.username}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone number",
      width: "240px",
      accessor: (user) => user.phone ?? "-",
    },
    {
      key: "reason",
      header: "Why do you want to do sales ?",
      width: "524px",
      render: (user) => (
        <div
          className=" max-xl:w-[150px] max-2xl:max-w-[200px] [@media(min-width:1600px)]:max-w-[524px] overflow-hidden whitespace-nowrap text-ellipsis"
          title={user.salesReason ?? ""}
        >
          {user.salesReason ?? ""}
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      width: "100px",
      align: "center",
      render: (user) => (
        <button
          type="button"
          className="text-white font-medium rounded"
          style={{
            width: 61,
            height: 40,
            borderRadius: 8,
            background: "var(--Neutral-Grey-100, #25292A)",
          }}
          onClick={() => openViewModal(user)}
        >
          View
        </button>
      ),
    },
  ];

  const emptyStateCopy = {
    active: {
      title: "No active users yet",
      subtitle: "Once users are added and activated, they'll appear here.",
    },
    restricted: {
      title: "No restricted users",
      subtitle:
        "All your users currently have access to Alpha Arc. Restricted users will appear here.",
    },
    request: {
      title: "No Sales Requests Yet",
      subtitle:
        "Once a user applies for sales team access from the app, their request will appear here for your review.",
    },
  } as const;

  return (
    <div className="w-full h-full">
      {/* Heading */}
      <h2 className="txt-24 font-semibold mb-6 sm:ml- 6 sm:mt-6 2xl:mt-12">Users</h2>

      {/* Tabs */}
      <div
        className="flex mb-6 sm:ml- 6 sm:gap-4 w-auto md:max-w-[440px] text-[#51595A]"
        role="tablist"
        aria-label="User tabs"
      >
        <button
          role="tab"
          aria-pressed={activeTab === "active"}
          onClick={() => {
            setActiveTab("active");
            setCurrentPage(1);
          }}
          className={`flex-1 text-center whitespace-nowrap px-4 py-2 txt-12 font-medium border-b-2 ${
            activeTab === "active"
              ? "border-brand  bg-transparent text-[#333839]"
              : "border-transparent text-[#51595A]"
          }`}
        >
          Active Users
        </button>
        <button
          role="tab"
          aria-pressed={activeTab === "restricted"}
          onClick={() => {
            setActiveTab("restricted");
            setCurrentPage(1);
          }}
          className={`flex-1 text-center whitespace-nowrap px-4 py-2 txt-12 font-medium border-b-2 ${
            activeTab === "restricted"
              ? "border-brand  bg-transparent text-[#333839]"
              : "border-transparent text-[#51595A]"
          }`}
        >
          Restricted Users
        </button>
        <button
          role="tab"
          aria-pressed={activeTab === "request"}
          onClick={() => {
            setActiveTab("request");
            setCurrentPage(1);
          }}
          className={`flex-1 text-center whitespace-nowrap px-4 py-2 txt-12 font-medium border-b-2 ${
            activeTab === "request"
              ? "border-brand  bg-transparent text-[#333839]"
              : "border-transparent text-[#51595A]"
          }`}
        >
          Sales Tab Request
        </button>
      </div>

      {/* Search — only show when there are users */}
      {allUsers.length > 0 && (
        <div className="mb-4 sm:ml- 6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search users"
          />
        </div>
      )}

      <div className="bg-white rounded shadow-s m overflow-hidden">

      {/* Table */}
      <GenericTable<User>
        columns={activeTab === "request" ? requestColumns : userColumns}
        data={paginatedUsers}
        rowKey={(user) => user.id}
        rowClassName={(r, idx) => ((startIndex + idx) % 2 === 0 ? "bg-white" : "bg-[#F2F5F6]")}

        emptyState={
          <EmptyState
            title={emptyStateCopy[activeTab].title}
            subtitle={emptyStateCopy[activeTab].subtitle}
            // className="!w-[357px]"
          />
        }
        tableClassName="sm:ml- 6"
      />

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
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

      {/* Confirm modal */}
      <ConfirmModal
        open={modal.isOpen}
        title={
          modal.type === "delete"
            ? "Are you sure you want to delete this user?"
            : "Are you sure you want to restrict this user?"
        }
        description={
          modal.user
            ? modal.type === "delete"
              ? "This action will permanently delete the user from your Alpha Arc team."
              : "The user will lose access to the Alpha Arc app until reactivated. You can manage their status anytime."
            : ""
        }
        confirmLabel={modal.type === "delete" ? "Delete" : "Restrict"}
        // explicit intent: both delete AND restrict are dangerous in your UX
        intent={
          modal.type === "delete" || modal.type === "restrict"
            ? "danger"
            : "default"
        }
        onCancel={() =>
          setModal({ isOpen: false, type: null, user: null, action: null })
        }
        // you can return a Promise here later when wiring an API; currently it's sync
        onConfirm={() => {
          handleModalAction(true); // your existing handler already updates state + toasts
        }}
      />

      {/* View modal */}
      {viewModal.isOpen && viewModal.user && (
        <ViewModal
          user={viewModal.user}
          selectedTeam={selectedTeam}
          onChangeTeam={(t) => setSelectedTeam(t)}
          onClose={closeViewModal}
          onReject={() => handleRejectFromView(viewModal.user!.id)}
          onAdd={() => handleAddToSalesTeam(viewModal.user!.id, selectedTeam)}
        />
      )}
    </div>
  );
}
