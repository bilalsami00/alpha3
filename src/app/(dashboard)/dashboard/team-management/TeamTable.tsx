// // // src\app\(dashboard)\dashboard\team-management\TeamTable.tsx
// // "use client";
// // import React, { useRef, useEffect } from "react";
// // import GenericTable, { Column } from "../components/GenericTable";
// // import type { Team } from "./types";
// // import Image from "next/image";
// // import { PiDotsThreeOutline } from "react-icons/pi";

// // type Props = {
// //   data: Team[];
// //   startIndex: number; // <-- added: page-global start index
// //   openMenuId: number | null;
// //   setOpenMenuId: (id: number | null) => void;
// //   onRequestDelete: (team: Team) => void;
// //   onRequestEdit?: (team: Team) => void; // optional edit handler
// //   onRowClick?: (team: Team) => void; // optional generic row click (used by name & memberCount cells)
// // };

// // export default function TeamTable({
// //   data,
// //   startIndex, // <-- added: page-global start index
// //   openMenuId,
// //   setOpenMenuId,
// //   onRequestDelete,
// //   onRequestEdit,
// //   onRowClick,
// // }: Props) {
// //   // Small inner component to handle the actions + outside-click detection.
// //   const ActionMenu: React.FC<{
// //     team: Team;
// //     openMenuId: number | null;
// //     setOpenMenuId: (id: number | null) => void;
// //     onRequestDelete: (team: Team) => void;
// //     onRequestEdit?: (team: Team) => void;
// //   }> = ({
// //     team,
// //     openMenuId,
// //     setOpenMenuId,
// //     onRequestDelete,
// //     onRequestEdit,
// //   }) => {
// //     const containerRef = useRef<HTMLDivElement | null>(null);

// //     useEffect(() => {
// //       if (openMenuId !== team.id) return;

// //       function handlePointerDown(e: MouseEvent | TouchEvent) {
// //         if (!containerRef.current) return;
// //         const target = e.target as Node | null;
// //         if (target && !containerRef.current.contains(target)) {
// //           setOpenMenuId(null);
// //         }
// //       }

// //       function handleKeyDown(e: KeyboardEvent) {
// //         if (e.key === "Escape") {
// //           setOpenMenuId(null);
// //         }
// //       }

// //       document.addEventListener("mousedown", handlePointerDown);
// //       document.addEventListener("touchstart", handlePointerDown);
// //       document.addEventListener("keydown", handleKeyDown);

// //       return () => {
// //         document.removeEventListener("mousedown", handlePointerDown);
// //         document.removeEventListener("touchstart", handlePointerDown);
// //         document.removeEventListener("keydown", handleKeyDown);
// //       };
// //     }, [openMenuId, team.id, setOpenMenuId]);

// //     return (
// //       <div className="relative inline-block" ref={containerRef}>
// //         <button
// //           onClick={() => setOpenMenuId(openMenuId === team.id ? null : team.id)}
// //           className="p-1 rounded"
// //           aria-expanded={openMenuId === team.id}
// //           aria-haspopup="true"
// //         >
// //           <PiDotsThreeOutline size={24} />
// //         </button>

// //         {openMenuId === team.id && (
// //           <div
// //             // className="fixed right-10 sm:-mt-1 w-44 bg-white rounded-md shadow-lg z-50 border border-gray-200"
// //             // className="fixed right-10 w-44 bg-white rounded-md shadow-lg z-50 border border-gray-200"
// //             className="fixed right-10  rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] w-45 max-w-[175px] z-50"
// //           >
// //             <div className="py- 1">
// //               {/* EDIT BUTTON (above Delete) */}
// //               <button
// //                 onClick={() => {
// //                   onRequestEdit?.(team);
// //                   setOpenMenuId(null);
// //                 }}
// //                 className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 rounded-t-lg hover:bg-gray-100 border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
// //               >
// //                 <Image
// //                   src="/dashboardIcons/edit.svg"
// //                   alt="Edit"
// //                   width={18}
// //                   height={18}
// //                   className="mr-2"
// //                 />
// //                 Edit
// //               </button>

// //               {/* DELETE BUTTON */}
// //               <button
// //                 onClick={() => {
// //                   onRequestDelete(team);
// //                   setOpenMenuId(null);
// //                 }}
// //                 className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-b-lg"
// //               >
// //                 <Image
// //                   src="/dashboardIcons/trash.svg"
// //                   alt="Delete"
// //                   width={20}
// //                   height={20}
// //                   className="mr-2"
// //                 />
// //                 Delete
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   // default handler used when no onRowClick provided:
// //   const handleCellClick = (team: Team) => {
// //     if (onRowClick) {
// //       onRowClick(team);
// //     } else if (onRequestEdit) {
// //       // fallback: open edit if provided
// //       onRequestEdit(team);
// //     } else {
// //       // no-op: we still return a function so GenericTable will mark the cell clickable
// //       // (keeps UX consistent: full-cell pointer + keyboard activation)
// //       return;
// //     }
// //   };

// //   const teamColumns: Column<Team>[] = [
// //     {
// //       key: "name",
// //       header: "Team",
// //       width: "502px",
// //       isClickable: true,
// //       onClick: handleCellClick,
// //       render: (team) => (
// //         <div className="flex items-center txt-14 font-medium cursor-pointer w-auto">
// //           <div className="flex flex-col">
// //             <span className="font-medium">{team.name}</span>
// //           </div>
// //         </div>
// //       ),
// //     },
// //     {
// //       key: "memberCount",
// //       header: "No of Members",
// //       width: "502px",
// //       isClickable: true,
// //       onClick: handleCellClick, // <-- full TD clickable now
// //       render: (team) => (
// //         <span className="cursor-pointer">{team.memberCount}</span>
// //       ),
// //     },
// //     {
// //       key: "actions",
// //       header: "Action",
// //       width: "100px",
// //       align: "center",
// //       render: (team) => (
// //         <ActionMenu
// //           team={team}
// //           openMenuId={openMenuId}
// //           setOpenMenuId={setOpenMenuId}
// //           onRequestDelete={onRequestDelete}
// //           onRequestEdit={onRequestEdit}
// //         />
// //       ),
// //     },
// //   ];

// //   return (
// //     <GenericTable<Team>
// //       columns={teamColumns}
// //       data={data}
// //       rowKey={(team) => team.id}
// //       emptyState={null} // Parent handles EmptyState rendering (so we can show Create button there)
// //       rowClassName={(r, idx) =>
// //         (startIndex + idx) % 2 === 0 ? "bg-white" : "bg-[#F2F5F6]"
// //       }
// //     />
// //   );
// // }





// // src\app\(dashboard)\dashboard\team-management\TeamTable.tsx
// "use client";
// import React, { useRef, useEffect } from "react";
// import GenericTable, { Column } from "../components/GenericTable";
// import type { Team } from "./types";
// import Image from "next/image";
// import { PiDotsThreeOutline } from "react-icons/pi";

// type Props = {
//   data: Team[];
//   startIndex: number; // <-- added: page-global start index
//   openMenuId: number | null;
//   setOpenMenuId: (id: number | null) => void;
//   onRequestDelete: (team: Team) => void;
//   onRequestEdit?: (team: Team) => void; // optional edit handler
//   onRowClick?: (team: Team) => void; // optional generic row click (used by name & memberCount cells)
// };

// export default function TeamTable({
//   data,
//   startIndex, // <-- added: page-global start index
//   openMenuId,
//   setOpenMenuId,
//   onRequestDelete,
//   onRequestEdit,
//   onRowClick,
// }: Props) {
//   // Small inner component to handle the actions + outside-click detection.
//   const ActionMenu: React.FC<{
//     team: Team;
//     openMenuId: number | null;
//     setOpenMenuId: (id: number | null) => void;
//     onRequestDelete: (team: Team) => void;
//     onRequestEdit?: (team: Team) => void;
//   }> = ({
//     team,
//     openMenuId,
//     setOpenMenuId,
//     onRequestDelete,
//     onRequestEdit,
//   }) => {
//     const containerRef = useRef<HTMLDivElement | null>(null);

//     // outside click + Escape handling
//     useEffect(() => {
//       if (openMenuId !== team.id) return;

//       function handlePointerDown(e: MouseEvent | TouchEvent) {
//         if (!containerRef.current) return;
//         const target = e.target as Node | null;
//         if (target && !containerRef.current.contains(target)) {
//           setOpenMenuId(null);
//         }
//       }

//       function handleKeyDown(e: KeyboardEvent) {
//         if (e.key === "Escape") {
//           setOpenMenuId(null);
//         }
//       }

//       document.addEventListener("mousedown", handlePointerDown);
//       document.addEventListener("touchstart", handlePointerDown);
//       document.addEventListener("keydown", handleKeyDown);

//       return () => {
//         document.removeEventListener("mousedown", handlePointerDown);
//         document.removeEventListener("touchstart", handlePointerDown);
//         document.removeEventListener("keydown", handleKeyDown);
//       };
//     }, [openMenuId, team.id, setOpenMenuId]);

//     // When menu opens, scroll the page so the menu (or wrapper) is visible.
//     useEffect(() => {
//       if (openMenuId !== team.id) return;
//       // wait a tick so DOM mounts
//       const tid = window.setTimeout(() => {
//         const wrapper = containerRef.current;
//         if (!wrapper) return;
//         const menuEl = wrapper.querySelector("[data-action-menu]") as HTMLElement | null;
//         const elToScroll = menuEl ?? wrapper;
//         try {
//           elToScroll.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
//         } catch (err) {
//           const rect = elToScroll.getBoundingClientRect();
//           const absoluteTop = window.scrollY + rect.top;
//           window.scrollTo({ top: Math.max(0, absoluteTop - 80), behavior: "smooth" });
//         }
//       }, 0);

//       return () => clearTimeout(tid);
//     }, [openMenuId, team.id]);

//     return (
//       <div className="relative inline-block" ref={containerRef}>
//         <button
//           onClick={() => setOpenMenuId(openMenuId === team.id ? null : team.id)}
//           className="p-1 rounded"
//           aria-expanded={openMenuId === team.id}
//           aria-haspopup="true"
//         >
//           <PiDotsThreeOutline size={24} />
//         </button>

//         {openMenuId === team.id && (
//           <div
//             // no flipping/measurement. open downward relative to wrapper.
//             data-action-menu
//             className="absolute right-0 mt-2 rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] w-44 max-w-[175px] z-50"
//             role="menu"
//             aria-label={`Actions for ${team.name}`}
//           >
//             <div className="py-1">
//               {/* EDIT BUTTON (above Delete) */}
//               <button
//                 onClick={() => {
//                   onRequestEdit?.(team);
//                   setOpenMenuId(null);
//                 }}
//                 className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 rounded-t-lg hover:bg-gray-100 border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
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

//               {/* DELETE BUTTON */}
//               <button
//                 onClick={() => {
//                   onRequestDelete(team);
//                   setOpenMenuId(null);
//                 }}
//                 className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-b-lg"
//               >
//                 <Image
//                   src="/dashboardIcons/trash.svg"
//                   alt="Delete"
//                   width={20}
//                   height={20}
//                   className="mr-2"
//                 />
//                 Delete
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // default handler used when no onRowClick provided:
//   const handleCellClick = (team: Team) => {
//     if (onRowClick) {
//       onRowClick(team);
//     } else if (onRequestEdit) {
//       // fallback: open edit if provided
//       onRequestEdit(team);
//     } else {
//       // no-op: we still return a function so GenericTable will mark the cell clickable
//       // (keeps UX consistent: full-cell pointer + keyboard activation)
//       return;
//     }
//   };

//   const teamColumns: Column<Team>[] = [
//     {
//       key: "name",
//       header: "Team",
//       width: "502px",
//       isClickable: true,
//       onClick: handleCellClick,
//       render: (team) => (
//         <div className="flex items-center txt-14 font-medium cursor-pointer w-auto">
//           <div className="flex flex-col">
//             <span className="font-medium">{team.name}</span>
//           </div>
//         </div>
//       ),
//     },
//     {
//       key: "memberCount",
//       header: "No of Members",
//       width: "502px",
//       isClickable: true,
//       onClick: handleCellClick, // <-- full TD clickable now
//       render: (team) => <span className="cursor-pointer">{team.memberCount}</span>,
//     },
//     {
//       key: "actions",
//       header: "Action",
//       width: "100px",
//       align: "center",
//       render: (team) => (
//         <ActionMenu
//           team={team}
//           openMenuId={openMenuId}
//           setOpenMenuId={setOpenMenuId}
//           onRequestDelete={onRequestDelete}
//           onRequestEdit={onRequestEdit}
//         />
//       ),
//     },
//   ];

//   return (
//     <GenericTable<Team>
//       columns={teamColumns}
//       data={data}
//       rowKey={(team) => team.id}
//       emptyState={null} // Parent handles EmptyState rendering (so we can show Create button there)
//       rowClassName={(r, idx) =>
//         (startIndex + idx) % 2 === 0 ? "bg-white" : "bg-[#F2F5F6]"
//       }
//     />
//   );
// }













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
