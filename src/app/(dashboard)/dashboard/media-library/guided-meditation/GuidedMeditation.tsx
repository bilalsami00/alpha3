// // src\app\(dashboard)\dashboard\media-library\guided-meditation\GuidedMeditation.tsx
// "use client";
// import React, { useEffect, useMemo, useState } from "react";
// import { useToastContext } from "../../lib/ToastContext";
// import SearchBar from "../../components/SearchBar";
// import Pagination from "../../components/Pagination";
// import EmptyState from "../../components/EmptyState";
// import ConfirmModal from "../../components/ConfirmModal";
// import MediaTable from "../MediaTable";
// import MediaModal from "../MediaModal";
// import { INITIAL_MEDIA, type MediaItem } from "../mediaData";
// import { EMPTY_ICONS } from "../../components/emptyIcons";

// export default function GuidedMeditation({
//   emptyStateConfig,
// }: {
//   emptyStateConfig?: {
//     icon?: string;
//     title?: string;
//     subtitle?: string;
//     actionLabel?: string;
//   };
// }) {
//   const category = "Guided Meditation";
//   const displayTitle = "No Guided Meditation Videos Yet";

//   const { showToast } = useToastContext();
//   const [items, setItems] = useState<MediaItem[]>(() => [
//     ...(INITIAL_MEDIA[category] ?? []),
//   ]);

//   const [query, setQuery] = useState("");
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const [editing, setEditing] = useState<MediaItem | null>(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState<"add" | "edit">("add");

//   const [confirm, setConfirm] = useState<{ open: boolean; item?: MediaItem }>({
//     open: false,
//   });

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return items;
//     return items.filter((it) =>
//       (it.title + " " + (it.description ?? "")).toLowerCase().includes(q)
//     );
//   }, [items, query]);

//   const totalItems = filtered.length;
//   const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const paginated = filtered.slice(startIndex, startIndex + rowsPerPage);

//   useEffect(() => {
//     if (filtered.length === 0) setCurrentPage(1);
//     else if (currentPage > totalPages) setCurrentPage(totalPages);
//   }, [filtered.length, rowsPerPage, totalPages, currentPage]);

//   function openAdd() {
//     setModalMode("add");
//     setEditing(null);
//     setModalOpen(true);
//   }
//   function openEdit(item: MediaItem) {
//     setModalMode("edit");
//     setEditing(item);
//     setModalOpen(true);
//   }

//   async function handleSave(payload: {
//     title: string;
//     description?: string;
//     file?: File | null;
//   }) {
//     if (modalMode === "add") {
//       const id = `gm-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
//       const thumbnailUrl = payload.file ? URL.createObjectURL(payload.file) : null;
//       const newItem: MediaItem = {
//         id,
//         title: payload.title,
//         description: payload.description ?? "",
//         thumbnailUrl,
//       };
//       setItems((s) => [newItem, ...s]);
//       showToast("Video added.", "success");
//       setModalOpen(false);
//       setCurrentPage(1);
//       return;
//     }

//     if (modalMode === "edit" && editing) {
//       const thumbnailUrl = payload.file
//         ? URL.createObjectURL(payload.file)
//         : editing.thumbnailUrl ?? null;
//       const updated: MediaItem = {
//         ...editing,
//         title: payload.title,
//         description: payload.description ?? "",
//         thumbnailUrl,
//       };
//       setItems((s) => s.map((it) => (it.id === editing.id ? updated : it)));
//       showToast("Video updated.", "success");
//       setModalOpen(false);
//       setEditing(null);
//     }
//   }

//   function requestDelete(item: MediaItem) {
//     setConfirm({ open: true, item });
//   }
//   function confirmDelete() {
//     if (!confirm.item) return;
//     setItems((s) => s.filter((it) => it.id !== confirm.item!.id));
//     showToast("Video deleted.", "info");
//     setConfirm({ open: false });
//   }

//   const emptyAction = (
//     <button onClick={openAdd} className="px-4 py-2 rounded-lg bg-[#25292A] text-white">
//       {emptyStateConfig?.actionLabel ?? `Add Video`}
//     </button>
//   );

//   return (
//     <div className="w-full">
//       <div className="flex items-center justify-between mb-6 sm:mt-6 2xl:mt-12">
//         <h2 className="txt-24 font-semibold">{category}</h2>

//         <div>
//           {/* {items.length > 0 && ( */}
//           {totalItems > 0 && (
//             <button
//               onClick={openAdd}
//               className="bg-[#0E0E0E] text-white px-4 py-2 txt-16 rounded-md"
//             >
//               Add Video
//             </button>
//           )}
//         </div>
//       </div>

//       {items.length > 0 && (
//         <div className="mb-4 ">
//           <SearchBar
//             value={query}
//             onChange={(v) => {
//               setQuery(v);
//               setCurrentPage(1);
//             }}
//             placeholder={`Search video`}
//           />
//         </div>
//       )}

//       <div className="bg-white rounded-lg">
//         <MediaTable
//           category={category}
//           paginated={paginated}
//           startIndex={startIndex}
//           onEdit={openEdit}
//           onDelete={requestDelete}
//           emptyState={
//             <EmptyState
//               icon={emptyStateConfig?.icon ?? EMPTY_ICONS.mediaLibrary}
//               title={emptyStateConfig?.title ?? displayTitle}
//               subtitle={
//                 emptyStateConfig?.subtitle ??
//                 `Start by uploading your first guided meditation session to help your team relax, reset, and stay focused.`
//               }
//               action={emptyAction}
//             />
//           }
//         />

//         {totalItems > 0 && (
//           <div>
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={(p) =>
//                 setCurrentPage(Math.max(1, Math.min(totalPages, p)))
//               }
//               rowsPerPage={rowsPerPage}
//               onRowsPerPageChange={(n) => {
//                 setRowsPerPage(n);
//                 setCurrentPage(1);
//               }}
//               totalItems={totalItems}
//             />
//           </div>
//         )}
//       </div>

//       {modalOpen && (
//         <MediaModal
//           open={modalOpen}
//           onClose={() => {
//             setModalOpen(false);
//             setEditing(null);
//           }}
//           mode={modalMode}
//           initial={editing ?? undefined}
//           onSave={async (payload) => {
//             await handleSave(payload);
//           }}
//           onDelete={
//             modalMode === "edit" && editing
//               ? () => {
//                   setModalOpen(false);
//                   requestDelete(editing);
//                 }
//               : undefined
//           }
//         />
//       )}

//       <ConfirmModal
//         open={confirm.open}
//         title="Are you sure you want to delete this video?"
//         description="This action cannot be undone. The video will be permanently removed from guided meditation sessions."
//         intent="danger"
//         confirmLabel="Delete"
//         onCancel={() => setConfirm({ open: false })}
//         onConfirm={() => confirmDelete()}
//       />
//     </div>
//   );
// }













// src\app\(dashboard)\dashboard\media-library\guided-meditation\GuidedMeditation.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useToastContext } from "../../lib/ToastContext";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import EmptyState from "../../components/EmptyState";
import ConfirmModal from "../../components/ConfirmModal";
import MediaTable from "../MediaTable";
import MediaModal from "../MediaModal";
import { INITIAL_MEDIA, type MediaItem } from "../mediaData";
import { EMPTY_ICONS } from "../../components/emptyIcons";

export default function GuidedMeditation({
  emptyStateConfig,
}: {
  emptyStateConfig?: {
    icon?: string;
    title?: string;
    subtitle?: string;
    actionLabel?: string;
  };
}) {
  const category = "Guided Meditation";
  const displayTitle = "No Guided Meditation Videos Yet";

  const { showToast } = useToastContext();
  const [items, setItems] = useState<MediaItem[]>(() => [
    ...(INITIAL_MEDIA[category] ?? []),
  ]);

  const [query, setQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const [confirm, setConfirm] = useState<{ open: boolean; item?: MediaItem }>({
    open: false,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      (it.title + " " + (it.description ?? "")).toLowerCase().includes(q)
    );
  }, [items, query]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + rowsPerPage);

  useEffect(() => {
    if (filtered.length === 0) setCurrentPage(1);
    else if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [filtered.length, rowsPerPage, totalPages, currentPage]);

  function openAdd() {
    setModalMode("add");
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(item: MediaItem) {
    setModalMode("edit");
    const fresh = items.find((it) => it.id === item.id) ?? item;
    setEditing(fresh);
    setModalOpen(true);
  }

  function revokeIfBlob(url?: string | null) {
    if (url && url.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    }
  }

  async function handleSave(payload: {
    title: string;
    description?: string;
    file?: File | null;
  }) {
    if (modalMode === "add") {
      const id = `gm-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const objUrl = payload.file ? URL.createObjectURL(payload.file) : null;
      const newItem: MediaItem = {
        id,
        title: payload.title,
        description: payload.description ?? "",
        thumbnailUrl: objUrl ?? null,
        mediaUrl: objUrl ?? null,
      };
      setItems((s) => [newItem, ...s]);
      showToast("Video added.", "success");
      setModalOpen(false);
      setCurrentPage(1);
      return;
    }

    if (modalMode === "edit" && editing) {
      const newObjUrl = payload.file ? URL.createObjectURL(payload.file) : null;
      if (payload.file && editing.mediaUrl && editing.mediaUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(editing.mediaUrl);
        } catch {}
      }

      const updated: MediaItem = {
        ...editing,
        title: payload.title,
        description: payload.description ?? "",
        thumbnailUrl: newObjUrl ?? editing.thumbnailUrl ?? null,
        mediaUrl: newObjUrl ?? editing.mediaUrl ?? null,
      };
      setItems((s) => s.map((it) => (it.id === editing.id ? updated : it)));
      showToast("Video updated.", "success");
      setModalOpen(false);
      setEditing(null);
    }
  }

  function requestDelete(item: MediaItem) {
    setConfirm({ open: true, item });
  }
  function confirmDelete() {
    if (!confirm.item) return;
    revokeIfBlob(confirm.item.mediaUrl);
    revokeIfBlob(confirm.item.thumbnailUrl);
    setItems((s) => s.filter((it) => it.id !== confirm.item!.id));
    showToast("Video deleted.", "info");
    setConfirm({ open: false });
  }

  const emptyAction = (
    <button onClick={openAdd} className="px-4 py-2 txt-16 rounded-lg bg-[#25292A] text-white">
      {emptyStateConfig?.actionLabel ?? `Add Video`}
    </button>
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 sm:mt-6 2xl:mt-12">
        <h2 className="txt-24 font-semibold">{category}</h2>

        <div>
          {totalItems > 0 && (
            <button
              onClick={openAdd}
              className="bg-[#0E0E0E] text-white px-4 py-2 txt-16 rounded-md"
            >
              Add Video
            </button>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <div className="mb-4 ">
          <SearchBar
            value={query}
            onChange={(v) => {
              setQuery(v);
              setCurrentPage(1);
            }}
            placeholder={`Search video`}
          />
        </div>
      )}

      <div className="bg-white rounded-lg">
        <MediaTable
          category={category}
          paginated={paginated}
          startIndex={startIndex}
          onEdit={openEdit}
          onDelete={requestDelete}
          emptyState={
            <EmptyState
              icon={emptyStateConfig?.icon ?? EMPTY_ICONS.mediaLibrary}
              title={emptyStateConfig?.title ?? displayTitle}
              subtitle={
                emptyStateConfig?.subtitle ??
                `Start by uploading your first guided meditation session to help your team relax, reset, and stay focused.`
              }
              action={emptyAction}
            />
          }
        />

        {totalItems > 0 && (
          <div>
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

      {modalOpen && (
        <MediaModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          mode={modalMode}
          initial={editing ?? undefined}
          onSave={async (payload) => {
            await handleSave(payload);
          }}
          onDelete={
            modalMode === "edit" && editing
              ? () => {
                  setModalOpen(false);
                  requestDelete(editing);
                }
              : undefined
          }
        />
      )}

      <ConfirmModal
        open={confirm.open}
        title="Are you sure you want to delete this video?"
        description="This action cannot be undone. The video will be permanently removed from guided meditation sessions."
        intent="danger"
        confirmLabel="Delete"
        onCancel={() => setConfirm({ open: false })}
        onConfirm={() => confirmDelete()}
      />
    </div>
  );
}
