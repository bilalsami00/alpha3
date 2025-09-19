// // "use client";
// // import React, { useRef, useState, useEffect } from "react";
// // import Image from "next/image";
// // import { PiDotsThreeOutline } from "react-icons/pi";

// // type Props = {
// //   onEdit: () => void;
// //   onDelete: () => void;
// //   ariaLabel?: string;
// //   // width for menu (Tailwind-friendly value e.g. "w-44" or custom class)
// //   menuWidthClass?: string;
// //   // optional className for the button wrapper
// //   wrapperClassName?: string;
// // };

// // export default function RowActionMenu({
// //   onEdit,
// //   onDelete,
// //   ariaLabel = "More actions",
// //   menuWidthClass = "w-44 max-w-[175px]",
// //   wrapperClassName = "",
// // }: Props) {
// //   const ref = useRef<HTMLDivElement | null>(null);
// //   const [open, setOpen] = useState(false);

// //   // outside click / Escape key
// //   useEffect(() => {
// //     if (!open) return;
// //     function onDocClick(e: MouseEvent) {
// //       if (!ref.current) return;
// //       if (e.target && !ref.current.contains(e.target as Node)) setOpen(false);
// //     }
// //     function onDocKey(e: KeyboardEvent) {
// //       if (e.key === "Escape") setOpen(false);
// //     }
// //     document.addEventListener("mousedown", onDocClick);
// //     document.addEventListener("keydown", onDocKey);
// //     return () => {
// //       document.removeEventListener("mousedown", onDocClick);
// //       document.removeEventListener("keydown", onDocKey);
// //     };
// //   }, [open]);

// //   // when opening ensure the menu (or wrapper) is visible on the page
// //   useEffect(() => {
// //     if (!open) return;
// //     // delay to allow DOM paint
// //     const t = window.setTimeout(() => {
// //       const wrapper = ref.current;
// //       if (!wrapper) return;
// //       const menuEl = wrapper.querySelector("[data-action-menu]") as HTMLElement | null;
// //       const elToScroll = menuEl ?? wrapper;
// //       try {
// //         elToScroll.scrollIntoView({ behavior: "smooth", block: "nearest" });
// //       } catch {
// //         const rect = elToScroll.getBoundingClientRect();
// //         const absoluteTop = window.scrollY + rect.top;
// //         window.scrollTo({ top: Math.max(0, absoluteTop - 80), behavior: "smooth" });
// //       }
// //     }, 0);
// //     return () => clearTimeout(t);
// //   }, [open]);

// //   return (
// //     <div className={`relative inline-block ${wrapperClassName}`} ref={ref}>
// //       <button
// //         onClick={() => setOpen((s) => !s)}
// //         className="p-1 rounded"
// //         aria-haspopup="true"
// //         aria-expanded={open}
// //         aria-label={ariaLabel}
// //       >
// //         <PiDotsThreeOutline size={24} />
// //       </button>

// //       {open && (
// //         <div
// //           data-action-menu
// //           role="menu"
// //           aria-label="Row actions"
// //           className={`absolute right-0 mt-2 rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] z-50 ${menuWidthClass}`}
// //         >
// //           <button
// //             onClick={() => {
// //               setOpen(false);
// //               onEdit();
// //             }}
// //             className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-t-lg border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
// //           >
// //             <Image
// //               src="/dashboardIcons/edit.svg"
// //               alt="Edit"
// //               width={18}
// //               height={18}
// //               className="mr-2"
// //             />
// //             Edit
// //           </button>

// //           <button
// //             onClick={() => {
// //               setOpen(false);
// //               onDelete();
// //             }}
// //             className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-b-lg"
// //           >
// //             <Image
// //               src="/dashboardIcons/trash.svg"
// //               alt="Delete"
// //               width={18}
// //               height={18}
// //               className="mr-2"
// //             />
// //             Delete
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }









// "use client";
// import React, { useRef, useState, useEffect } from "react";
// import Image from "next/image";
// import { PiDotsThreeOutline } from "react-icons/pi";

// type Props = {
//   onEdit?: () => void;
//   onDelete?: () => void;
//   ariaLabel?: string;
//   // width for menu (Tailwind-friendly value e.g. "w-44" or custom class)
//   menuWidthClass?: string;
//   wrapperClassName?: string;
//   // If provided, children will be rendered inside the menu (allows custom menus).
//   children?: React.ReactNode;
// };

// export default function RowActionMenu({
//   onEdit,
//   onDelete,
//   ariaLabel = "More actions",
//   menuWidthClass = "w-44 max-w-[175px]",
//   wrapperClassName = "",
//   children,
// }: Props) {
//   const ref = useRef<HTMLDivElement | null>(null);
//   const [open, setOpen] = useState(false);

//   // close on outside click / Escape
//   useEffect(() => {
//     if (!open) return;
//     function onDocClick(e: MouseEvent) {
//       if (!ref.current) return;
//       if (e.target && !ref.current.contains(e.target as Node)) setOpen(false);
//     }
//     function onDocKey(e: KeyboardEvent) {
//       if (e.key === "Escape") setOpen(false);
//     }
//     document.addEventListener("mousedown", onDocClick);
//     document.addEventListener("keydown", onDocKey);
//     return () => {
//       document.removeEventListener("mousedown", onDocClick);
//       document.removeEventListener("keydown", onDocKey);
//     };
//   }, [open]);

//   // ensure menu or wrapper is visible on the page when opening
//   useEffect(() => {
//     if (!open) return;
//     const t = window.setTimeout(() => {
//       const wrapper = ref.current;
//       if (!wrapper) return;
//       const menuEl = wrapper.querySelector("[data-action-menu]") as HTMLElement | null;
//       const elToScroll = menuEl ?? wrapper;
//       try {
//         elToScroll.scrollIntoView({ behavior: "smooth", block: "nearest" });
//       } catch {
//         const rect = elToScroll.getBoundingClientRect();
//         const absoluteTop = window.scrollY + rect.top;
//         window.scrollTo({ top: Math.max(0, absoluteTop - 80), behavior: "smooth" });
//       }
//     }, 0);
//     return () => clearTimeout(t);
//   }, [open]);

//   return (
//     <div className={`relative inline-block ${wrapperClassName}`} ref={ref}>
//       <button
//         onClick={() => setOpen((s) => !s)}
//         className="p-1 rounded"
//         aria-haspopup="true"
//         aria-expanded={open}
//         aria-label={ariaLabel}
//       >
//         <PiDotsThreeOutline size={24} />
//       </button>

//       {open && (
//         <div
//           data-action-menu
//           role="menu"
//           aria-label="Row actions"
//           className={`absolute right-0 mt-2 rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] z-50 ${menuWidthClass}`}
//         >
//           {children ? (
//             // custom menu (caller supplies buttons / handlers)
//             <div>{children}</div>
//           ) : (
//             // default: Edit / Delete (both optional)
//             <div>
//               {onEdit && (
//                 <button
//                   onClick={() => {
//                     setOpen(false);
//                     onEdit();
//                   }}
//                   className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-t-lg border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
//                 >
//                   <Image
//                     src="/dashboardIcons/edit.svg"
//                     alt="Edit"
//                     width={18}
//                     height={18}
//                     className="mr-2"
//                   />
//                   Edit
//                 </button>
//               )}
//               {onDelete && (
//                 <button
//                   onClick={() => {
//                     setOpen(false);
//                     onDelete();
//                   }}
//                   className={`flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 ${onEdit ? "rounded-b-lg" : "rounded-t-lg"}`}
//                 >
//                   <Image
//                     src="/dashboardIcons/trash.svg"
//                     alt="Delete"
//                     width={18}
//                     height={18}
//                     className="mr-2"
//                   />
//                   Delete
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }





// src/app/(dashboard)/dashboard/components/RowActionMenu.tsx
"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { PiDotsThreeOutline } from "react-icons/pi";

type Props = {
  onEdit?: () => void;
  onDelete?: () => void;
  ariaLabel?: string;
  // width for menu (Tailwind-friendly value e.g. "w-44" or custom class)
  menuWidthClass?: string;
  wrapperClassName?: string;
  // If provided, children will be rendered inside the menu (allows custom menus).
  children?: React.ReactNode;
};

/**
 * Programmatic helper to close ALL RowActionMenu instances.
 * Use in pages/modals when you need an explicit programmatic close:
 *   import { closeAllRowActionMenus } from "./RowActionMenu";
 *   closeAllRowActionMenus();
 *
 * The component also auto-closes when detecting a modal/dialog added to the DOM.
 */
export function closeAllRowActionMenus() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("rowActionMenu:closeAll"));
  }
}

export default function RowActionMenu({
  onEdit,
  onDelete,
  ariaLabel = "More actions",
  menuWidthClass = "w-44 max-w-[175px]",
  wrapperClassName = "",
  children,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  // close on outside click / Escape
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (e.target && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onDocKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onDocKey);
    }

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onDocKey);
    };
  }, [open]);

  // scroll into view when opening (keeps existing behavior)
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      const wrapper = ref.current;
      if (!wrapper) return;
      const menuEl = wrapper.querySelector("[data-action-menu]") as HTMLElement | null;
      const elToScroll = menuEl ?? wrapper;
      try {
        elToScroll.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } catch {
        const rect = elToScroll.getBoundingClientRect();
        const absoluteTop = window.scrollY + rect.top;
        window.scrollTo({ top: Math.max(0, absoluteTop - 80), behavior: "smooth" });
      }
    }, 0);
    return () => clearTimeout(t);
  }, [open]);

  // Auto-close when a "modal/dialog" is added to the DOM.
  // This avoids having to call a close helper on every page — common modals will be detected.
  useEffect(() => {
    if (typeof document === "undefined") return;

    // Node checks: if a node (or its subtree) contains indicators of a modal/dialog,
    // we'll treat that as a signal to close any open menus.
    const mightBeModal = (node: Node | null): boolean => {
      if (!node) return false;
      if (node.nodeType !== Node.ELEMENT_NODE) return false;
      const el = node as Element;

      // selectors to detect modals/dialogs in popular patterns
      const selectors =
        '[role="dialog"], [data-modal], .modal, .react-modal, .headlessui-modal, [data-headlessui-modal], [data-reach-dialog]';

      try {
        if (el.matches && el.matches(selectors)) return true;
      } catch {
        // ignore if matches throws for some nodes
      }

      try {
        if ((el as Element).querySelector && (el as Element).querySelector(selectors)) return true;
      } catch {
        // ignore
      }

      return false;
    };

    const observer = new MutationObserver((mutations) => {
      // only act if menu is open — small optimization
      if (!open) return;
      for (const m of mutations) {
        // check added nodes quickly
        if (m.addedNodes && m.addedNodes.length) {
          for (const n of Array.from(m.addedNodes)) {
            if (mightBeModal(n)) {
              setOpen(false);
              return;
            }
          }
        }
        // sometimes modals are toggled by attribute changes — check target if element
        if (m.type === "attributes" && m.target && mightBeModal(m.target)) {
          setOpen(false);
          return;
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => observer.disconnect();
  }, [open]);

  // listen for programmatic close event
  useEffect(() => {
    function onCloseAll() {
      setOpen(false);
    }
    window.addEventListener("rowActionMenu:closeAll", onCloseAll);
    return () => {
      window.removeEventListener("rowActionMenu:closeAll", onCloseAll);
    };
  }, []);

  return (
    <div className={`relative inline-block ${wrapperClassName}`} ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="p-1 rounded"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <PiDotsThreeOutline size={24} />
      </button>

      {open && (
        <div
          data-action-menu
          role="menu"
          aria-label="Row actions"
          className={`absolute right-0 mt-2 rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] z-50 ${menuWidthClass}`}
        >
          {children ? (
            // custom menu (caller supplies buttons / handlers)
            <div>{children}</div>
          ) : (
            // default: Edit / Delete (both optional)
            <div>
              {onEdit && (
                <button
                  onClick={() => {
                    setOpen(false);
                    // slight microtask delay to ensure menu state closes before parent action runs
                    // (prevents UI flashes where modal opens while menu is still visible)
                    setTimeout(() => {
                      try {
                        onEdit();
                      } catch {
                        /* swallow */
                      }
                    }, 0);
                  }}
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
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    setOpen(false);
                    setTimeout(() => {
                      try {
                        onDelete();
                      } catch {
                        /* swallow */
                      }
                    }, 0);
                  }}
                  className={`flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 ${onEdit ? "rounded-b-lg" : "rounded-t-lg"}`}
                >
                  <Image
                    src="/dashboardIcons/trash.svg"
                    alt="Delete"
                    width={18}
                    height={18}
                    className="mr-2"
                  />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
