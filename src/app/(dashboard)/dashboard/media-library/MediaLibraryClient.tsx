// src\app\(dashboard)\dashboard\media-library\MediaLibraryClient.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import GuidedBreathwork from "./guided-breathwork/GuidedBreathwork";
import GuidedMeditation from "./guided-meditation/GuidedMeditation";
import VideoOfTheDay from "./video-of-the-day/VideoOfTheDay";
import SalesTraining from "./sales-training/SalesTraining";

const TABS = [
  "Guided Breathwork",
  "Guided Meditation",
  "Video of the Day",
  "Sales Training",
] as const;
type TabName = (typeof TABS)[number];

function isValidTab(t?: string): t is TabName {
  return !!t && (TABS as readonly string[]).includes(t);
}

export default function MediaLibraryClient() {
  const searchParams = useSearchParams();
  const selectedSubTab = searchParams?.get("tab") ?? undefined;

  // default active tab
  const [active, setActive] = useState<TabName>(() =>
    isValidTab(selectedSubTab) ? (selectedSubTab as TabName) : TABS[0]
  );

  // update active when ?tab= changes
  useEffect(() => {
    if (isValidTab(selectedSubTab)) setActive(selectedSubTab as TabName);
  }, [selectedSubTab]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 sm:mt-6 2xl:mt-12 ">
        {active === "Guided Breathwork" && <GuidedBreathwork />}
        {active === "Guided Meditation" && <GuidedMeditation />}
        {active === "Video of the Day" && <VideoOfTheDay />}
        {active === "Sales Training" && <SalesTraining />}
      </div>
    </div>
  );
}












// // src/app/(dashboard)/dashboard/media-library/MediaLibraryClient.tsx
// "use client";
// import React, { useEffect, useState } from "react";
// import MediaModalV2, { MediaItem as ModalMediaItem } from "./MediaModal";
// import MediaTable from "./MediaTable";
// import { INITIAL_MEDIA, type MediaItem } from "./mediaData";
// import { useSearchParams } from "next/navigation";

// const TABS = Object.keys(INITIAL_MEDIA) as Array<keyof typeof INITIAL_MEDIA>;
// type TabName = (typeof TABS)[number];

// function isValidTab(t?: string): t is TabName {
//   return !!t && (TABS as readonly string[]).includes(t as TabName);
// }

// export default function MediaLibraryClient() {
//   const searchParams = useSearchParams();
//   const selectedSubTab = searchParams?.get("tab") ?? undefined;

//   const [active, setActive] = useState<TabName>(() =>
//     isValidTab(selectedSubTab) ? (selectedSubTab as TabName) : (TABS[0] as TabName)
//   );
//   useEffect(() => {
//     if (isValidTab(selectedSubTab)) setActive(selectedSubTab as TabName);
//   }, [selectedSubTab]);

//   // seed items from INITIAL_MEDIA for the selected category (simple demo)
//   const [items, setItems] = useState<MediaItem[]>(INITIAL_MEDIA[TABS[0]]);
//   const [startIndex] = useState(0);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [editing, setEditing] = useState<MediaItem | null>(null);
//   const [isSaving, setIsSaving] = useState(false);

//   async function uploadFormToServer(url: string, form: FormData): Promise<MediaItem> {
//     const res = await fetch(url, { method: "POST", body: form });
//     if (!res.ok) {
//       const txt = await res.text().catch(() => "");
//       throw new Error(`upload failed: ${res.status} ${txt}`);
//     }
//     return (await res.json()) as MediaItem;
//   }

//   // Add: returns created item (so caller/modal can use it)
//   async function handleAddSave(payload: { title: string; description?: string; file?: File | null; }): Promise<MediaItem> {
//     setIsSaving(true);
//     try {
//       const fd = new FormData();
//       fd.append("title", payload.title);
//       if (payload.description) fd.append("description", payload.description);
//       if (payload.file) fd.append("file", payload.file);

//       try {
//         const created = await uploadFormToServer("/api/media/upload", fd);
//         setItems((prev) => [created, ...prev]);
//         return created;
//       } catch (uploadErr) {
//         console.warn("Upload failed, falling back to object URL:", uploadErr);
//         const id = `temp-${Date.now()}`;
//         const objUrl = payload.file ? URL.createObjectURL(payload.file) : null;
//         const tempItem: MediaItem = { id, title: payload.title, description: payload.description, mediaUrl: objUrl, thumbnailUrl: null };
//         setItems((prev) => [tempItem, ...prev]);
//         return tempItem;
//       }
//     } finally {
//       setIsSaving(false);
//     }
//   }

//   // Edit: returns updated item
//   async function handleEditSave(id: string | number, payload: { title: string; description?: string; file?: File | null; }): Promise<MediaItem> {
//     setIsSaving(true);
//     try {
//       const fd = new FormData();
//       fd.append("title", payload.title);
//       if (payload.description) fd.append("description", payload.description);
//       if (payload.file) fd.append("file", payload.file);

//       try {
//         const res = await fetch(`/api/media/${id}`, { method: "PUT", body: fd });
//         if (!res.ok) throw new Error("update failed");
//         const updated = await res.json();
//         setItems((prev) => prev.map((it) => (String(it.id) === String(id) ? updated : it)));
//         return updated;
//       } catch (err) {
//         console.warn("Update failed, applying local fallback:", err);
//         const existing = items.find((it) => String(it.id) === String(id));
//         const updatedLocal: MediaItem = {
//           id,
//           title: payload.title,
//           description: payload.description,
//           mediaUrl: payload.file ? URL.createObjectURL(payload.file) : existing?.mediaUrl ?? null,
//           thumbnailUrl: existing?.thumbnailUrl ?? null,
//         };
//         setItems((prev) => prev.map((it) => (String(it.id) === String(id) ? updatedLocal : it)));
//         return updatedLocal;
//       }
//     } finally {
//       setIsSaving(false);
//     }
//   }

//   function openAdd() {
//     setEditing(null);
//     setModalOpen(true);
//   }

//   // Lookup fresh item from state to avoid stale references
//   function openEdit(item: MediaItem) {
//     const fresh = items.find((it) => String(it.id) === String(item.id)) ?? item;
//     setEditing(fresh);
//     setModalOpen(true);
//   }

//   function closeModal() {
//     setModalOpen(false);
//     setEditing(null);
//   }

//   async function onModalSave(payload: { title: string; description?: string; file?: File | null; }) {
//     if (!editing) {
//       await handleAddSave(payload);
//     } else {
//       await handleEditSave(editing.id, payload);
//     }
//   }

//   function handleDelete(item: MediaItem) {
//     setItems((prev) => prev.filter((it) => String(it.id) !== String(item.id)));
//     if (item.mediaUrl && item.mediaUrl.startsWith("blob:")) {
//       try {
//         URL.revokeObjectURL(item.mediaUrl);
//       } catch {}
//     }
//   }

//   return (
//     <div className="w-full">
//       <div className="flex items-center justify-between mb-6 sm:mt-6 2xl:mt-12 ">
//         <div className="flex gap-3">
//           {TABS.map((t) => (
//             <button key={t} className={`px-3 py-1 rounded ${t === active ? "bg-black text-white" : "bg-white"}`} onClick={() => setActive(t)}>
//               {t}
//             </button>
//           ))}
//         </div>

//         <div>
//           <button onClick={openAdd} className="px-4 py-2 rounded bg-[#0E0E0E] text-white">Add video</button>
//         </div>
//       </div>

//       <MediaTable category={active} paginated={items} startIndex={startIndex} onEdit={(it) => openEdit(it)} onDelete={(it) => handleDelete(it)} emptyState={<div>No media yet</div>} />

//       {modalOpen && (
//         <MediaModalV2
//           open={modalOpen}
//           onClose={closeModal}
//           mode={editing ? "edit" : "add"}
//           initial={editing ?? undefined}
//           onSave={async (payload) => {
//             // IMPORTANT: return the created/updated item to the modal if possible
//             if (!editing) {
//               return await handleAddSave(payload);
//             } else {
//               return await handleEditSave(editing.id, payload);
//             }
//           }}
//         />
//       )}
//     </div>
//   );
// }
