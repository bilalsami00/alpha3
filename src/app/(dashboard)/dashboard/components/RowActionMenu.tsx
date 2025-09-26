// // // src\app\(dashboard)\dashboard\components\RowActionMenu.tsx
// // "use client";
// // import React, { useRef, useState, useEffect } from "react";
// // import Image from "next/image";
// // import { PiDotsThreeOutline } from "react-icons/pi";

// // type Props = {
// //   onEdit?: () => void;
// //   onDelete?: () => void;
// //   ariaLabel?: string;
// //   // width for menu (Tailwind-friendly value e.g. "w-44" or custom class)
// //   menuWidthClass?: string;
// //   wrapperClassName?: string;
// //   // If provided, children will be rendered inside the menu (allows custom menus).
// //   children?: React.ReactNode;
// // };

// // /**
// //  * Programmatic helper to close ALL RowActionMenu instances.
// //  * Use in pages/modals when you need an explicit programmatic close:
// //  *   import { closeAllRowActionMenus } from "./RowActionMenu";
// //  *   closeAllRowActionMenus();
// //  *
// //  * The component also auto-closes when detecting a modal/dialog added to the DOM.
// //  */
// // export function closeAllRowActionMenus() {
// //   if (typeof window !== "undefined") {
// //     window.dispatchEvent(new Event("rowActionMenu:closeAll"));
// //   }
// // }

// // export default function RowActionMenu({
// //   onEdit,
// //   onDelete,
// //   ariaLabel = "More actions",
// //   menuWidthClass = "w-44 max-w-[175px]",
// //   wrapperClassName = "",
// //   children,
// // }: Props) {
// //   const ref = useRef<HTMLDivElement | null>(null);
// //   const [open, setOpen] = useState(false);

// //   // close on outside click / Escape
// //   useEffect(() => {
// //     function onDocClick(e: MouseEvent) {
// //       if (!ref.current) return;
// //       if (e.target && !ref.current.contains(e.target as Node)) setOpen(false);
// //     }
// //     function onDocKey(e: KeyboardEvent) {
// //       if (e.key === "Escape") setOpen(false);
// //     }

// //     if (open) {
// //       document.addEventListener("mousedown", onDocClick);
// //       document.addEventListener("keydown", onDocKey);
// //     }

// //     return () => {
// //       document.removeEventListener("mousedown", onDocClick);
// //       document.removeEventListener("keydown", onDocKey);
// //     };
// //   }, [open]);

// //   // scroll into view when opening (keeps existing behavior)
// //   useEffect(() => {
// //     if (!open) return;
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

// //   // Auto-close when a "modal/dialog" is added to the DOM.
// //   // This avoids having to call a close helper on every page — common modals will be detected.
// //   useEffect(() => {
// //     if (typeof document === "undefined") return;

// //     // Node checks: if a node (or its subtree) contains indicators of a modal/dialog,
// //     // we'll treat that as a signal to close any open menus.
// //     const mightBeModal = (node: Node | null): boolean => {
// //       if (!node) return false;
// //       if (node.nodeType !== Node.ELEMENT_NODE) return false;
// //       const el = node as Element;

// //       // selectors to detect modals/dialogs in popular patterns
// //       const selectors =
// //         '[role="dialog"], [data-modal], .modal, .react-modal, .headlessui-modal, [data-headlessui-modal], [data-reach-dialog]';

// //       try {
// //         if (el.matches && el.matches(selectors)) return true;
// //       } catch {
// //         // ignore if matches throws for some nodes
// //       }

// //       try {
// //         if ((el as Element).querySelector && (el as Element).querySelector(selectors)) return true;
// //       } catch {
// //         // ignore
// //       }

// //       return false;
// //     };

// //     const observer = new MutationObserver((mutations) => {
// //       // only act if menu is open — small optimization
// //       if (!open) return;
// //       for (const m of mutations) {
// //         // check added nodes quickly
// //         if (m.addedNodes && m.addedNodes.length) {
// //           for (const n of Array.from(m.addedNodes)) {
// //             if (mightBeModal(n)) {
// //               setOpen(false);
// //               return;
// //             }
// //           }
// //         }
// //         // sometimes modals are toggled by attribute changes — check target if element
// //         if (m.type === "attributes" && m.target && mightBeModal(m.target)) {
// //           setOpen(false);
// //           return;
// //         }
// //       }
// //     });

// //     observer.observe(document.body, {
// //       childList: true,
// //       subtree: true,
// //       attributes: true,
// //     });

// //     return () => observer.disconnect();
// //   }, [open]);

// //   // listen for programmatic close event
// //   useEffect(() => {
// //     function onCloseAll() {
// //       setOpen(false);
// //     }
// //     window.addEventListener("rowActionMenu:closeAll", onCloseAll);
// //     return () => {
// //       window.removeEventListener("rowActionMenu:closeAll", onCloseAll);
// //     };
// //   }, []);

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
// //           {children ? (
// //             // custom menu (caller supplies buttons / handlers)
// //             <div>{children}</div>
// //           ) : (
// //             // default: Edit / Delete (both optional)
// //             <div>
// //               {onEdit && (
// //                 <button
// //                   onClick={() => {
// //                     setOpen(false);
// //                     // slight microtask delay to ensure menu state closes before parent action runs
// //                     // (prevents UI flashes where modal opens while menu is still visible)
// //                     setTimeout(() => {
// //                       try {
// //                         onEdit();
// //                       } catch {
// //                         /* swallow */
// //                       }
// //                     }, 0);
// //                   }}
// //                   className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-t-lg border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
// //                 >
// //                   <Image
// //                     src="/dashboardIcons/edit.svg"
// //                     alt="Edit"
// //                     width={18}
// //                     height={18}
// //                     className="mr-2"
// //                   />
// //                   Edit
// //                 </button>
// //               )}
// //               {onDelete && (
// //                 <button
// //                   onClick={() => {
// //                     setOpen(false);
// //                     setTimeout(() => {
// //                       try {
// //                         onDelete();
// //                       } catch {
// //                         /* swallow */
// //                       }
// //                     }, 0);
// //                   }}
// //                   className={`flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 ${onEdit ? "rounded-b-lg" : "rounded-t-lg"}`}
// //                 >
// //                   <Image
// //                     src="/dashboardIcons/trash.svg"
// //                     alt="Delete"
// //                     width={18}
// //                     height={18}
// //                     className="mr-2"
// //                   />
// //                   Delete
// //                 </button>
// //               )}
// //             </div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }













// // src/app/(dashboard)/dashboard/components/RowActionMenu.tsx
// "use client";
// import React, {
//   useRef,
//   useState,
//   useEffect,
//   useLayoutEffect,
//   CSSProperties,
// } from "react";
// import { createPortal } from "react-dom";
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

// export function closeAllRowActionMenus() {
//   if (typeof window !== "undefined") {
//     window.dispatchEvent(new Event("rowActionMenu:closeAll"));
//   }
// }

// export default function RowActionMenu({
//   onEdit,
//   onDelete,
//   ariaLabel = "More actions",
//   menuWidthClass = "w-44 max-w-[175px]",
//   wrapperClassName = "",
//   children,
// }: Props) {
//   const wrapperRef = useRef<HTMLDivElement | null>(null); // anchor in table flow
//   const menuRef = useRef<HTMLDivElement | null>(null); // portal menu element
//   const [open, setOpen] = useState(false);

//   // style applied to the portal menu (computed)
//   const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);

//   // Recompute position when opening, on resize, and on scroll
//   const computeAndSetPosition = () => {
//     const anchor = wrapperRef.current;
//     const menu = menuRef.current;
//     if (!anchor || !menu) return;

//     const anchorRect = anchor.getBoundingClientRect();
//     // ensure we measure the menu's natural size
//     const menuRect = menu.getBoundingClientRect();

//     const spacing = 8; // gap between anchor and menu
//     const viewportW = window.innerWidth;
//     const viewportH = window.innerHeight;

//     // Try to align the menu's right edge to anchor's right edge (like `right-0` in cell)
//     const anchorRight = anchorRect.right;
//     const desiredRight = viewportW - anchorRight; // px from viewport right edge

//     // Compute top by default (below the anchor)
//     let top = window.scrollY + anchorRect.bottom + spacing;
//     let left: number | undefined = undefined;
//     let right: number | undefined = undefined;

//     // Decide horizontal placement: prefer aligning right edges.
//     const wouldOverflowRight = anchorRect.right + menuRect.width > viewportW;
//     const spaceLeft = anchorRect.left;
//     const spaceRight = viewportW - anchorRect.right;
//     if (wouldOverflowRight && spaceLeft > spaceRight) {
//       // place menu so its right edge lines up with anchor's left edge (flip left)
//       left = Math.max(8 + window.scrollX, window.scrollX + anchorRect.left - menuRect.width + anchorRect.width);
//     } else {
//       // align right edge with anchor's right
//       right = Math.max(8, viewportW - anchorRect.right);
//     }

//     // Vertical flip if it would go below viewport
//     const bottomEdge = (top - window.scrollY) + menuRect.height;
//     if (bottomEdge > viewportH) {
//       // enough space above?
//       const spaceAbove = anchorRect.top;
//       if (menuRect.height + spacing <= spaceAbove) {
//         // place above anchor
//         top = window.scrollY + anchorRect.top - menuRect.height - spacing;
//       } else {
//         // not enough space above or below — clamp to viewport and allow internal scroll
//         const maxTop = window.scrollY + Math.max(8, viewportH - menuRect.height - 8);
//         top = Math.min(Math.max(top, window.scrollY + 8), maxTop);
//         // enable internal scrolling by limiting maxHeight via style (we'll set maxHeight below)
//       }
//     }

//     const style: CSSProperties = {
//       position: "absolute",
//       top: `${Math.round(top)}px`,
//       zIndex: 9999,
//       visibility: "visible",
//       maxHeight: undefined,
//       overflow: undefined,
//     };

//     if (left != null) style.left = `${Math.round(left)}px`;
//     if (right != null) style.right = `${Math.round(right)}px`;

//     // if menu would overflow vertically and can't fully fit, set maxHeight & overflow
//     const computedBottom = window.scrollY + (parseFloat(style.top as string) - window.scrollY) + menuRect.height;
//     if (computedBottom > window.scrollY + viewportH) {
//       // set maxHeight so menu scrolls internally
//       style.maxHeight = `${viewportH - 16}px`;
//       style.overflow = "auto";
//     }

//     setMenuStyle(style);
//   };

//   // when menu opens, render it into the body then compute position
//   useLayoutEffect(() => {
//     if (!open) {
//       setMenuStyle(null);
//       return;
//     }

//     // small microtask to let the portal render menu into DOM so menuRef is available
//     const id = window.setTimeout(() => {
//       computeAndSetPosition();
//     }, 0);

//     return () => {
//       clearTimeout(id);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open]);

//   // update position on resize & scroll while open
//   useEffect(() => {
//     if (!open) return;
//     const handler = () => computeAndSetPosition();
//     window.addEventListener("resize", handler);
//     window.addEventListener("scroll", handler, { passive: true });
//     return () => {
//       window.removeEventListener("resize", handler);
//       window.removeEventListener("scroll", handler);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open]);

//   // close on outside click / Escape — but consider both anchor and menu ref since menu is portalled
//   useEffect(() => {
//     function onDocClick(e: MouseEvent) {
//       const t = e.target as Node | null;
//       const insideAnchor = wrapperRef.current?.contains(t ?? null);
//       const insideMenu = menuRef.current?.contains(t ?? null);
//       if (!insideAnchor && !insideMenu) {
//         setOpen(false);
//       }
//     }
//     function onDocKey(e: KeyboardEvent) {
//       if (e.key === "Escape") setOpen(false);
//     }

//     if (open) {
//       document.addEventListener("mousedown", onDocClick);
//       document.addEventListener("keydown", onDocKey);
//     }

//     return () => {
//       document.removeEventListener("mousedown", onDocClick);
//       document.removeEventListener("keydown", onDocKey);
//     };
//   }, [open]);

//   // Auto-close when a "modal/dialog" is added to the DOM.
//   useEffect(() => {
//     if (typeof document === "undefined") return;

//     const mightBeModal = (node: Node | null): boolean => {
//       if (!node) return false;
//       if (node.nodeType !== Node.ELEMENT_NODE) return false;
//       const el = node as Element;

//       const selectors =
//         '[role="dialog"], [data-modal], .modal, .react-modal, .headlessui-modal, [data-headlessui-modal], [data-reach-dialog]';

//       try {
//         if (el.matches && el.matches(selectors)) return true;
//       } catch {
//         /* ignore */
//       }

//       try {
//         if (el.querySelector && el.querySelector(selectors)) return true;
//       } catch {
//         /* ignore */
//       }

//       return false;
//     };

//     const observer = new MutationObserver((mutations) => {
//       if (!open) return;
//       for (const m of mutations) {
//         if (m.addedNodes && m.addedNodes.length) {
//           for (const n of Array.from(m.addedNodes)) {
//             if (mightBeModal(n)) {
//               setOpen(false);
//               return;
//             }
//           }
//         }
//         if (m.type === "attributes" && m.target && mightBeModal(m.target)) {
//           setOpen(false);
//           return;
//         }
//       }
//     });

//     observer.observe(document.body, {
//       childList: true,
//       subtree: true,
//       attributes: true,
//     });

//     return () => observer.disconnect();
//   }, [open]);

//   // listen for programmatic close event
//   useEffect(() => {
//     function onCloseAll() {
//       setOpen(false);
//     }
//     window.addEventListener("rowActionMenu:closeAll", onCloseAll);
//     return () => {
//       window.removeEventListener("rowActionMenu:closeAll", onCloseAll);
//     };
//   }, []);

//   // Portal menu element
//   const menuNode = (
//     <div
//       ref={menuRef}
//       data-action-menu
//       role="menu"
//       aria-label="Row actions"
//       style={{
//         // initial hidden so we can measure and then position
//         visibility: menuStyle ? (menuStyle.visibility ?? "visible") : "hidden",
//         ...menuStyle,
//       }}
//       className={`rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] z-50 ${menuWidthClass}`}
//     >
//       {children ? (
//         <div>{children}</div>
//       ) : (
//         <div>
//           {onEdit && (
//             <button
//               onClick={() => {
//                 setOpen(false);
//                 setTimeout(() => {
//                   try {
//                     onEdit();
//                   } catch {
//                     /* swallow */
//                   }
//                 }, 0);
//               }}
//               className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-t-lg border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
//             >
//               <Image src="/dashboardIcons/edit.svg" alt="Edit" width={18} height={18} className="mr-2" />
//               Edit
//             </button>
//           )}
//           {onDelete && (
//             <button
//               onClick={() => {
//                 setOpen(false);
//                 setTimeout(() => {
//                   try {
//                     onDelete();
//                   } catch {
//                     /* swallow */
//                   }
//                 }, 0);
//               }}
//               className={`flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 ${onEdit ? "rounded-b-lg" : "rounded-t-lg"}`}
//             >
//               <Image src="/dashboardIcons/trash.svg" alt="Delete" width={18} height={18} className="mr-2" />
//               Delete
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <>
//       <div className={`relative inline-block ${wrapperClassName}`} ref={wrapperRef}>
//         <button
//           onClick={() => {
//             // toggle open; compute position will run in useLayoutEffect
//             setOpen((s) => !s);
//           }}
//           className="p-1 rounded"
//           aria-haspopup="true"
//           aria-expanded={open}
//           aria-label={ariaLabel}
//         >
//           <PiDotsThreeOutline size={24} />
//         </button>
//       </div>

//       {/* render portal menu into body only when open */}
//       {typeof document !== "undefined" && open ? createPortal(menuNode, document.body) : null}
//     </>
//   );
// }








// row action on top i.e absolute now scroll nonsene anymore
// src/app/(dashboard)/dashboard/components/RowActionMenu.tsx
"use client";
import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { PiDotsThreeOutline } from "react-icons/pi";

type Props = {
  onEdit?: () => void;
  onDelete?: () => void;
  ariaLabel?: string;
  menuWidthClass?: string;
  wrapperClassName?: string;
  children?: React.ReactNode;
};

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
  const wrapperRef = useRef<HTMLDivElement | null>(null); // anchor inside table flow
  const menuRef = useRef<HTMLDivElement | null>(null); // portal menu element to measure
  const buttonRef = useRef<HTMLButtonElement | null>(null); // trigger button
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);

  // Initial offscreen style so the portal never affects document flow
  const initialOffscreenStyle: CSSProperties = {
    position: "absolute",
    top: "-9999px",
    left: "-9999px",
    visibility: "hidden",
    zIndex: 9999,
  };

  // Compute & set menu position relative to wrapperRef anchor
  const computeAndSetPosition = () => {
    const anchor = wrapperRef.current;
    const menu = menuRef.current;
    if (!anchor || !menu) return;

    // Measure anchor/menu
    const anchorRect = anchor.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    const spacing = 8; // gap
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    // Default: align menu right edge to anchor right (like `right-0`)
    let top = window.scrollY + anchorRect.bottom + spacing;
    let left: number | undefined;
    let right: number | undefined;

    const wouldOverflowRight = anchorRect.right + menuRect.width > viewportW;
    const spaceLeft = anchorRect.left;
    const spaceRight = viewportW - anchorRect.right;

    if (wouldOverflowRight && spaceLeft > spaceRight) {
      // flip to the left side of anchor (try to keep it visible)
      left = Math.max(8 + window.scrollX, window.scrollX + anchorRect.left - menuRect.width + anchorRect.width);
    } else {
      right = Math.max(8, viewportW - anchorRect.right);
    }

    // Vertical flip if it would overflow bottom of viewport
    const bottomEdge = (top - window.scrollY) + menuRect.height;
    if (bottomEdge > viewportH) {
      const spaceAbove = anchorRect.top;
      if (menuRect.height + spacing <= spaceAbove) {
        // place above anchor
        top = window.scrollY + anchorRect.top - menuRect.height - spacing;
      } else {
        // clamp inside viewport and allow internal scrolling
        const maxTop = window.scrollY + Math.max(8, viewportH - menuRect.height - 8);
        top = Math.min(Math.max(top, window.scrollY + 8), maxTop);
      }
    }

    const style: CSSProperties = {
      position: "absolute",
      top: `${Math.round(top)}px`,
      zIndex: 9999,
      visibility: "visible",
    };
    if (left != null) style.left = `${Math.round(left)}px`;
    if (right != null) style.right = `${Math.round(right)}px`;

    // If still would overflow vertically, enable internal scrolling
    const computedBottom = window.scrollY + (parseFloat(style.top as string) - window.scrollY) + menuRect.height;
    if (computedBottom > window.scrollY + viewportH) {
      style.maxHeight = `${viewportH - 16}px`;
      style.overflow = "auto";
    }

    setMenuStyle(style);
  };

  // When opening, wait for portal render then measure & position using rAF
  useLayoutEffect(() => {
    if (!open) {
      setMenuStyle(null);
      return;
    }

    // compute after next paint so the portal DOM exists and measurements are correct
    const raf = window.requestAnimationFrame(() => {
      computeAndSetPosition();

      // keep the trigger focused for keyboard users but prevent scroll jump
      try {
        buttonRef.current?.focus({ preventScroll: true });
      } catch {
        // some older browsers may not support the options object; fallback to focus()
        try {
          buttonRef.current?.focus();
        } catch {
          /** ignore */
        }
      }
    });

    return () => window.cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // keep position updated while open on scroll/resize
  useEffect(() => {
    if (!open) return;
    const handler = () => {
      // debounce via rAF for smoother updates
      window.requestAnimationFrame(() => computeAndSetPosition());
    };
    window.addEventListener("resize", handler);
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // close on outside click / Escape — consider both anchor and portal menu
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node | null;
      const insideAnchor = wrapperRef.current?.contains(t ?? null);
      const insideMenu = menuRef.current?.contains(t ?? null);
      if (!insideAnchor && !insideMenu) {
        setOpen(false);
      }
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

  // auto-close when a modal/dialog appears (unchanged)
  useEffect(() => {
    if (typeof document === "undefined") return;
    const mightBeModal = (node: Node | null): boolean => {
      if (!node) return false;
      if (node.nodeType !== Node.ELEMENT_NODE) return false;
      const el = node as Element;
      const selectors =
        '[role="dialog"], [data-modal], .modal, .react-modal, .headlessui-modal, [data-headlessui-modal], [data-reach-dialog]';
      try { if (el.matches && el.matches(selectors)) return true; } catch {}
      try { if (el.querySelector && el.querySelector(selectors)) return true; } catch {}
      return false;
    };

    const observer = new MutationObserver((mutations) => {
      if (!open) return;
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length) {
          for (const n of Array.from(m.addedNodes)) {
            if (mightBeModal(n)) { setOpen(false); return; }
          }
        }
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

  // programmatic close event listener
  useEffect(() => {
    function onCloseAll() {
      setOpen(false);
    }
    window.addEventListener("rowActionMenu:closeAll", onCloseAll);
    return () => window.removeEventListener("rowActionMenu:closeAll", onCloseAll);
  }, []);

  // portal menu node
  const menuNode = (
    <div
      ref={menuRef}
      data-action-menu
      role="menu"
      aria-label="Row actions"
      // render offscreen until we compute position to ensure no layout/scrollbar change
      style={menuStyle ? { ...menuStyle, zIndex: 9999 } : initialOffscreenStyle}
      className={`rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] ${menuWidthClass}`}
    >
      {children ? (
        <div>{children}</div>
      ) : (
        <div>
          {onEdit && (
            <button
              onClick={() => {
                setOpen(false);
                setTimeout(() => {
                  try { onEdit(); } catch {}
                }, 0);
              }}
              className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-t-lg border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
            >
              <Image src="/dashboardIcons/edit.svg" alt="Edit" width={18} height={18} className="mr-2" />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                setOpen(false);
                setTimeout(() => {
                  try { onDelete(); } catch {}
                }, 0);
              }}
              className={`flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 ${onEdit ? "rounded-b-lg" : "rounded-t-lg"}`}
            >
              <Image src="/dashboardIcons/trash.svg" alt="Delete" width={18} height={18} className="mr-2" />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className={`relative inline-block ${wrapperClassName}`} ref={wrapperRef}>
        <button
          ref={buttonRef}
          // Prevent native mouse-focus that can trigger auto-scroll
          onMouseDown={(e) => e.preventDefault()}
          // Keep keyboard access (Enter / Space)
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((s) => !s);
            }
          }}
          onClick={() => setOpen((s) => !s)}
          className="p-1 rounded"
          aria-haspopup="true"
          aria-expanded={open}
          aria-label={ariaLabel}
        >
          <PiDotsThreeOutline size={24} />
        </button>
      </div>

      {typeof document !== "undefined" && open ? createPortal(menuNode, document.body) : null}
    </>
  );
}
