// // // // // // // // // src\app\(dashboard)\dashboard\components\RowActionMenu.tsx
// // // // // // // // "use client";
// // // // // // // // import React, { useRef, useState, useEffect } from "react";
// // // // // // // // import Image from "next/image";
// // // // // // // // import { PiDotsThreeOutline } from "react-icons/pi";

// // // // // // // // type Props = {
// // // // // // // //   onEdit?: () => void;
// // // // // // // //   onDelete?: () => void;
// // // // // // // //   ariaLabel?: string;
// // // // // // // //   // width for menu (Tailwind-friendly value e.g. "w-44" or custom class)
// // // // // // // //   menuWidthClass?: string;
// // // // // // // //   wrapperClassName?: string;
// // // // // // // //   // If provided, children will be rendered inside the menu (allows custom menus).
// // // // // // // //   children?: React.ReactNode;
// // // // // // // // };

// // // // // // // // /**
// // // // // // // //  * Programmatic helper to close ALL RowActionMenu instances.
// // // // // // // //  * Use in pages/modals when you need an explicit programmatic close:
// // // // // // // //  *   import { closeAllRowActionMenus } from "./RowActionMenu";
// // // // // // // //  *   closeAllRowActionMenus();
// // // // // // // //  *
// // // // // // // //  * The component also auto-closes when detecting a modal/dialog added to the DOM.
// // // // // // // //  */
// // // // // // // // export function closeAllRowActionMenus() {
// // // // // // // //   if (typeof window !== "undefined") {
// // // // // // // //     window.dispatchEvent(new Event("rowActionMenu:closeAll"));
// // // // // // // //   }
// // // // // // // // }

// // // // // // // // export default function RowActionMenu({
// // // // // // // //   onEdit,
// // // // // // // //   onDelete,
// // // // // // // //   ariaLabel = "More actions",
// // // // // // // //   menuWidthClass = "w-44 max-w-[175px]",
// // // // // // // //   wrapperClassName = "",
// // // // // // // //   children,
// // // // // // // // }: Props) {
// // // // // // // //   const ref = useRef<HTMLDivElement | null>(null);
// // // // // // // //   const [open, setOpen] = useState(false);

// // // // // // // //   // close on outside click / Escape
// // // // // // // //   useEffect(() => {
// // // // // // // //     function onDocClick(e: MouseEvent) {
// // // // // // // //       if (!ref.current) return;
// // // // // // // //       if (e.target && !ref.current.contains(e.target as Node)) setOpen(false);
// // // // // // // //     }
// // // // // // // //     function onDocKey(e: KeyboardEvent) {
// // // // // // // //       if (e.key === "Escape") setOpen(false);
// // // // // // // //     }

// // // // // // // //     if (open) {
// // // // // // // //       document.addEventListener("mousedown", onDocClick);
// // // // // // // //       document.addEventListener("keydown", onDocKey);
// // // // // // // //     }

// // // // // // // //     return () => {
// // // // // // // //       document.removeEventListener("mousedown", onDocClick);
// // // // // // // //       document.removeEventListener("keydown", onDocKey);
// // // // // // // //     };
// // // // // // // //   }, [open]);

// // // // // // // //   // scroll into view when opening (keeps existing behavior)
// // // // // // // //   useEffect(() => {
// // // // // // // //     if (!open) return;
// // // // // // // //     const t = window.setTimeout(() => {
// // // // // // // //       const wrapper = ref.current;
// // // // // // // //       if (!wrapper) return;
// // // // // // // //       const menuEl = wrapper.querySelector("[data-action-menu]") as HTMLElement | null;
// // // // // // // //       const elToScroll = menuEl ?? wrapper;
// // // // // // // //       try {
// // // // // // // //         elToScroll.scrollIntoView({ behavior: "smooth", block: "nearest" });
// // // // // // // //       } catch {
// // // // // // // //         const rect = elToScroll.getBoundingClientRect();
// // // // // // // //         const absoluteTop = window.scrollY + rect.top;
// // // // // // // //         window.scrollTo({ top: Math.max(0, absoluteTop - 80), behavior: "smooth" });
// // // // // // // //       }
// // // // // // // //     }, 0);
// // // // // // // //     return () => clearTimeout(t);
// // // // // // // //   }, [open]);

// // // // // // // //   // Auto-close when a "modal/dialog" is added to the DOM.
// // // // // // // //   // This avoids having to call a close helper on every page — common modals will be detected.
// // // // // // // //   useEffect(() => {
// // // // // // // //     if (typeof document === "undefined") return;

// // // // // // // //     // Node checks: if a node (or its subtree) contains indicators of a modal/dialog,
// // // // // // // //     // we'll treat that as a signal to close any open menus.
// // // // // // // //     const mightBeModal = (node: Node | null): boolean => {
// // // // // // // //       if (!node) return false;
// // // // // // // //       if (node.nodeType !== Node.ELEMENT_NODE) return false;
// // // // // // // //       const el = node as Element;

// // // // // // // //       // selectors to detect modals/dialogs in popular patterns
// // // // // // // //       const selectors =
// // // // // // // //         '[role="dialog"], [data-modal], .modal, .react-modal, .headlessui-modal, [data-headlessui-modal], [data-reach-dialog]';

// // // // // // // //       try {
// // // // // // // //         if (el.matches && el.matches(selectors)) return true;
// // // // // // // //       } catch {
// // // // // // // //         // ignore if matches throws for some nodes
// // // // // // // //       }

// // // // // // // //       try {
// // // // // // // //         if ((el as Element).querySelector && (el as Element).querySelector(selectors)) return true;
// // // // // // // //       } catch {
// // // // // // // //         // ignore
// // // // // // // //       }

// // // // // // // //       return false;
// // // // // // // //     };

// // // // // // // //     const observer = new MutationObserver((mutations) => {
// // // // // // // //       // only act if menu is open — small optimization
// // // // // // // //       if (!open) return;
// // // // // // // //       for (const m of mutations) {
// // // // // // // //         // check added nodes quickly
// // // // // // // //         if (m.addedNodes && m.addedNodes.length) {
// // // // // // // //           for (const n of Array.from(m.addedNodes)) {
// // // // // // // //             if (mightBeModal(n)) {
// // // // // // // //               setOpen(false);
// // // // // // // //               return;
// // // // // // // //             }
// // // // // // // //           }
// // // // // // // //         }
// // // // // // // //         // sometimes modals are toggled by attribute changes — check target if element
// // // // // // // //         if (m.type === "attributes" && m.target && mightBeModal(m.target)) {
// // // // // // // //           setOpen(false);
// // // // // // // //           return;
// // // // // // // //         }
// // // // // // // //       }
// // // // // // // //     });

// // // // // // // //     observer.observe(document.body, {
// // // // // // // //       childList: true,
// // // // // // // //       subtree: true,
// // // // // // // //       attributes: true,
// // // // // // // //     });

// // // // // // // //     return () => observer.disconnect();
// // // // // // // //   }, [open]);

// // // // // // // //   // listen for programmatic close event
// // // // // // // //   useEffect(() => {
// // // // // // // //     function onCloseAll() {
// // // // // // // //       setOpen(false);
// // // // // // // //     }
// // // // // // // //     window.addEventListener("rowActionMenu:closeAll", onCloseAll);
// // // // // // // //     return () => {
// // // // // // // //       window.removeEventListener("rowActionMenu:closeAll", onCloseAll);
// // // // // // // //     };
// // // // // // // //   }, []);

// // // // // // // //   return (
// // // // // // // //     <div className={`relative inline-block ${wrapperClassName}`} ref={ref}>
// // // // // // // //       <button
// // // // // // // //         onClick={() => setOpen((s) => !s)}
// // // // // // // //         className="p-1 rounded"
// // // // // // // //         aria-haspopup="true"
// // // // // // // //         aria-expanded={open}
// // // // // // // //         aria-label={ariaLabel}
// // // // // // // //       >
// // // // // // // //         <PiDotsThreeOutline size={24} />
// // // // // // // //       </button>

// // // // // // // //       {open && (
// // // // // // // //         <div
// // // // // // // //           data-action-menu
// // // // // // // //           role="menu"
// // // // // // // //           aria-label="Row actions"
// // // // // // // //           className={`absolute right-0 mt-2 rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] z-50 ${menuWidthClass}`}
// // // // // // // //         >
// // // // // // // //           {children ? (
// // // // // // // //             // custom menu (caller supplies buttons / handlers)
// // // // // // // //             <div>{children}</div>
// // // // // // // //           ) : (
// // // // // // // //             // default: Edit / Delete (both optional)
// // // // // // // //             <div>
// // // // // // // //               {onEdit && (
// // // // // // // //                 <button
// // // // // // // //                   onClick={() => {
// // // // // // // //                     setOpen(false);
// // // // // // // //                     // slight microtask delay to ensure menu state closes before parent action runs
// // // // // // // //                     // (prevents UI flashes where modal opens while menu is still visible)
// // // // // // // //                     setTimeout(() => {
// // // // // // // //                       try {
// // // // // // // //                         onEdit();
// // // // // // // //                       } catch {
// // // // // // // //                         /* swallow */
// // // // // // // //                       }
// // // // // // // //                     }, 0);
// // // // // // // //                   }}
// // // // // // // //                   className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-t-lg border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
// // // // // // // //                 >
// // // // // // // //                   <Image
// // // // // // // //                     src="/dashboardIcons/edit.svg"
// // // // // // // //                     alt="Edit"
// // // // // // // //                     width={18}
// // // // // // // //                     height={18}
// // // // // // // //                     className="mr-2"
// // // // // // // //                   />
// // // // // // // //                   Edit
// // // // // // // //                 </button>
// // // // // // // //               )}
// // // // // // // //               {onDelete && (
// // // // // // // //                 <button
// // // // // // // //                   onClick={() => {
// // // // // // // //                     setOpen(false);
// // // // // // // //                     setTimeout(() => {
// // // // // // // //                       try {
// // // // // // // //                         onDelete();
// // // // // // // //                       } catch {
// // // // // // // //                         /* swallow */
// // // // // // // //                       }
// // // // // // // //                     }, 0);
// // // // // // // //                   }}
// // // // // // // //                   className={`flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 ${onEdit ? "rounded-b-lg" : "rounded-t-lg"}`}
// // // // // // // //                 >
// // // // // // // //                   <Image
// // // // // // // //                     src="/dashboardIcons/trash.svg"
// // // // // // // //                     alt="Delete"
// // // // // // // //                     width={18}
// // // // // // // //                     height={18}
// // // // // // // //                     className="mr-2"
// // // // // // // //                   />
// // // // // // // //                   Delete
// // // // // // // //                 </button>
// // // // // // // //               )}
// // // // // // // //             </div>
// // // // // // // //           )}
// // // // // // // //         </div>
// // // // // // // //       )}
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // src/app/(dashboard)/dashboard/components/RowActionMenu.tsx
// // // // // // // "use client";
// // // // // // // import React, {
// // // // // // //   useRef,
// // // // // // //   useState,
// // // // // // //   useEffect,
// // // // // // //   useLayoutEffect,
// // // // // // //   CSSProperties,
// // // // // // // } from "react";
// // // // // // // import { createPortal } from "react-dom";
// // // // // // // import Image from "next/image";
// // // // // // // import { PiDotsThreeOutline } from "react-icons/pi";

// // // // // // // type Props = {
// // // // // // //   onEdit?: () => void;
// // // // // // //   onDelete?: () => void;
// // // // // // //   ariaLabel?: string;
// // // // // // //   // width for menu (Tailwind-friendly value e.g. "w-44" or custom class)
// // // // // // //   menuWidthClass?: string;
// // // // // // //   wrapperClassName?: string;
// // // // // // //   // If provided, children will be rendered inside the menu (allows custom menus).
// // // // // // //   children?: React.ReactNode;
// // // // // // // };

// // // // // // // export function closeAllRowActionMenus() {
// // // // // // //   if (typeof window !== "undefined") {
// // // // // // //     window.dispatchEvent(new Event("rowActionMenu:closeAll"));
// // // // // // //   }
// // // // // // // }

// // // // // // // export default function RowActionMenu({
// // // // // // //   onEdit,
// // // // // // //   onDelete,
// // // // // // //   ariaLabel = "More actions",
// // // // // // //   menuWidthClass = "w-44 max-w-[175px]",
// // // // // // //   wrapperClassName = "",
// // // // // // //   children,
// // // // // // // }: Props) {
// // // // // // //   const wrapperRef = useRef<HTMLDivElement | null>(null); // anchor in table flow
// // // // // // //   const menuRef = useRef<HTMLDivElement | null>(null); // portal menu element
// // // // // // //   const [open, setOpen] = useState(false);

// // // // // // //   // style applied to the portal menu (computed)
// // // // // // //   const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);

// // // // // // //   // Recompute position when opening, on resize, and on scroll
// // // // // // //   const computeAndSetPosition = () => {
// // // // // // //     const anchor = wrapperRef.current;
// // // // // // //     const menu = menuRef.current;
// // // // // // //     if (!anchor || !menu) return;

// // // // // // //     const anchorRect = anchor.getBoundingClientRect();
// // // // // // //     // ensure we measure the menu's natural size
// // // // // // //     const menuRect = menu.getBoundingClientRect();

// // // // // // //     const spacing = 8; // gap between anchor and menu
// // // // // // //     const viewportW = window.innerWidth;
// // // // // // //     const viewportH = window.innerHeight;

// // // // // // //     // Try to align the menu's right edge to anchor's right edge (like `right-0` in cell)
// // // // // // //     const anchorRight = anchorRect.right;
// // // // // // //     const desiredRight = viewportW - anchorRight; // px from viewport right edge

// // // // // // //     // Compute top by default (below the anchor)
// // // // // // //     let top = window.scrollY + anchorRect.bottom + spacing;
// // // // // // //     let left: number | undefined = undefined;
// // // // // // //     let right: number | undefined = undefined;

// // // // // // //     // Decide horizontal placement: prefer aligning right edges.
// // // // // // //     const wouldOverflowRight = anchorRect.right + menuRect.width > viewportW;
// // // // // // //     const spaceLeft = anchorRect.left;
// // // // // // //     const spaceRight = viewportW - anchorRect.right;
// // // // // // //     if (wouldOverflowRight && spaceLeft > spaceRight) {
// // // // // // //       // place menu so its right edge lines up with anchor's left edge (flip left)
// // // // // // //       left = Math.max(8 + window.scrollX, window.scrollX + anchorRect.left - menuRect.width + anchorRect.width);
// // // // // // //     } else {
// // // // // // //       // align right edge with anchor's right
// // // // // // //       right = Math.max(8, viewportW - anchorRect.right);
// // // // // // //     }

// // // // // // //     // Vertical flip if it would go below viewport
// // // // // // //     const bottomEdge = (top - window.scrollY) + menuRect.height;
// // // // // // //     if (bottomEdge > viewportH) {
// // // // // // //       // enough space above?
// // // // // // //       const spaceAbove = anchorRect.top;
// // // // // // //       if (menuRect.height + spacing <= spaceAbove) {
// // // // // // //         // place above anchor
// // // // // // //         top = window.scrollY + anchorRect.top - menuRect.height - spacing;
// // // // // // //       } else {
// // // // // // //         // not enough space above or below — clamp to viewport and allow internal scroll
// // // // // // //         const maxTop = window.scrollY + Math.max(8, viewportH - menuRect.height - 8);
// // // // // // //         top = Math.min(Math.max(top, window.scrollY + 8), maxTop);
// // // // // // //         // enable internal scrolling by limiting maxHeight via style (we'll set maxHeight below)
// // // // // // //       }
// // // // // // //     }

// // // // // // //     const style: CSSProperties = {
// // // // // // //       position: "absolute",
// // // // // // //       top: `${Math.round(top)}px`,
// // // // // // //       zIndex: 9999,
// // // // // // //       visibility: "visible",
// // // // // // //       maxHeight: undefined,
// // // // // // //       overflow: undefined,
// // // // // // //     };

// // // // // // //     if (left != null) style.left = `${Math.round(left)}px`;
// // // // // // //     if (right != null) style.right = `${Math.round(right)}px`;

// // // // // // //     // if menu would overflow vertically and can't fully fit, set maxHeight & overflow
// // // // // // //     const computedBottom = window.scrollY + (parseFloat(style.top as string) - window.scrollY) + menuRect.height;
// // // // // // //     if (computedBottom > window.scrollY + viewportH) {
// // // // // // //       // set maxHeight so menu scrolls internally
// // // // // // //       style.maxHeight = `${viewportH - 16}px`;
// // // // // // //       style.overflow = "auto";
// // // // // // //     }

// // // // // // //     setMenuStyle(style);
// // // // // // //   };

// // // // // // //   // when menu opens, render it into the body then compute position
// // // // // // //   useLayoutEffect(() => {
// // // // // // //     if (!open) {
// // // // // // //       setMenuStyle(null);
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     // small microtask to let the portal render menu into DOM so menuRef is available
// // // // // // //     const id = window.setTimeout(() => {
// // // // // // //       computeAndSetPosition();
// // // // // // //     }, 0);

// // // // // // //     return () => {
// // // // // // //       clearTimeout(id);
// // // // // // //     };
// // // // // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // // // //   }, [open]);

// // // // // // //   // update position on resize & scroll while open
// // // // // // //   useEffect(() => {
// // // // // // //     if (!open) return;
// // // // // // //     const handler = () => computeAndSetPosition();
// // // // // // //     window.addEventListener("resize", handler);
// // // // // // //     window.addEventListener("scroll", handler, { passive: true });
// // // // // // //     return () => {
// // // // // // //       window.removeEventListener("resize", handler);
// // // // // // //       window.removeEventListener("scroll", handler);
// // // // // // //     };
// // // // // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // // // //   }, [open]);

// // // // // // //   // close on outside click / Escape — but consider both anchor and menu ref since menu is portalled
// // // // // // //   useEffect(() => {
// // // // // // //     function onDocClick(e: MouseEvent) {
// // // // // // //       const t = e.target as Node | null;
// // // // // // //       const insideAnchor = wrapperRef.current?.contains(t ?? null);
// // // // // // //       const insideMenu = menuRef.current?.contains(t ?? null);
// // // // // // //       if (!insideAnchor && !insideMenu) {
// // // // // // //         setOpen(false);
// // // // // // //       }
// // // // // // //     }
// // // // // // //     function onDocKey(e: KeyboardEvent) {
// // // // // // //       if (e.key === "Escape") setOpen(false);
// // // // // // //     }

// // // // // // //     if (open) {
// // // // // // //       document.addEventListener("mousedown", onDocClick);
// // // // // // //       document.addEventListener("keydown", onDocKey);
// // // // // // //     }

// // // // // // //     return () => {
// // // // // // //       document.removeEventListener("mousedown", onDocClick);
// // // // // // //       document.removeEventListener("keydown", onDocKey);
// // // // // // //     };
// // // // // // //   }, [open]);

// // // // // // //   // Auto-close when a "modal/dialog" is added to the DOM.
// // // // // // //   useEffect(() => {
// // // // // // //     if (typeof document === "undefined") return;

// // // // // // //     const mightBeModal = (node: Node | null): boolean => {
// // // // // // //       if (!node) return false;
// // // // // // //       if (node.nodeType !== Node.ELEMENT_NODE) return false;
// // // // // // //       const el = node as Element;

// // // // // // //       const selectors =
// // // // // // //         '[role="dialog"], [data-modal], .modal, .react-modal, .headlessui-modal, [data-headlessui-modal], [data-reach-dialog]';

// // // // // // //       try {
// // // // // // //         if (el.matches && el.matches(selectors)) return true;
// // // // // // //       } catch {
// // // // // // //         /* ignore */
// // // // // // //       }

// // // // // // //       try {
// // // // // // //         if (el.querySelector && el.querySelector(selectors)) return true;
// // // // // // //       } catch {
// // // // // // //         /* ignore */
// // // // // // //       }

// // // // // // //       return false;
// // // // // // //     };

// // // // // // //     const observer = new MutationObserver((mutations) => {
// // // // // // //       if (!open) return;
// // // // // // //       for (const m of mutations) {
// // // // // // //         if (m.addedNodes && m.addedNodes.length) {
// // // // // // //           for (const n of Array.from(m.addedNodes)) {
// // // // // // //             if (mightBeModal(n)) {
// // // // // // //               setOpen(false);
// // // // // // //               return;
// // // // // // //             }
// // // // // // //           }
// // // // // // //         }
// // // // // // //         if (m.type === "attributes" && m.target && mightBeModal(m.target)) {
// // // // // // //           setOpen(false);
// // // // // // //           return;
// // // // // // //         }
// // // // // // //       }
// // // // // // //     });

// // // // // // //     observer.observe(document.body, {
// // // // // // //       childList: true,
// // // // // // //       subtree: true,
// // // // // // //       attributes: true,
// // // // // // //     });

// // // // // // //     return () => observer.disconnect();
// // // // // // //   }, [open]);

// // // // // // //   // listen for programmatic close event
// // // // // // //   useEffect(() => {
// // // // // // //     function onCloseAll() {
// // // // // // //       setOpen(false);
// // // // // // //     }
// // // // // // //     window.addEventListener("rowActionMenu:closeAll", onCloseAll);
// // // // // // //     return () => {
// // // // // // //       window.removeEventListener("rowActionMenu:closeAll", onCloseAll);
// // // // // // //     };
// // // // // // //   }, []);

// // // // // // //   // Portal menu element
// // // // // // //   const menuNode = (
// // // // // // //     <div
// // // // // // //       ref={menuRef}
// // // // // // //       data-action-menu
// // // // // // //       role="menu"
// // // // // // //       aria-label="Row actions"
// // // // // // //       style={{
// // // // // // //         // initial hidden so we can measure and then position
// // // // // // //         visibility: menuStyle ? (menuStyle.visibility ?? "visible") : "hidden",
// // // // // // //         ...menuStyle,
// // // // // // //       }}
// // // // // // //       className={`rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] z-50 ${menuWidthClass}`}
// // // // // // //     >
// // // // // // //       {children ? (
// // // // // // //         <div>{children}</div>
// // // // // // //       ) : (
// // // // // // //         <div>
// // // // // // //           {onEdit && (
// // // // // // //             <button
// // // // // // //               onClick={() => {
// // // // // // //                 setOpen(false);
// // // // // // //                 setTimeout(() => {
// // // // // // //                   try {
// // // // // // //                     onEdit();
// // // // // // //                   } catch {
// // // // // // //                     /* swallow */
// // // // // // //                   }
// // // // // // //                 }, 0);
// // // // // // //               }}
// // // // // // //               className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-t-lg border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
// // // // // // //             >
// // // // // // //               <Image src="/dashboardIcons/edit.svg" alt="Edit" width={18} height={18} className="mr-2" />
// // // // // // //               Edit
// // // // // // //             </button>
// // // // // // //           )}
// // // // // // //           {onDelete && (
// // // // // // //             <button
// // // // // // //               onClick={() => {
// // // // // // //                 setOpen(false);
// // // // // // //                 setTimeout(() => {
// // // // // // //                   try {
// // // // // // //                     onDelete();
// // // // // // //                   } catch {
// // // // // // //                     /* swallow */
// // // // // // //                   }
// // // // // // //                 }, 0);
// // // // // // //               }}
// // // // // // //               className={`flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 ${onEdit ? "rounded-b-lg" : "rounded-t-lg"}`}
// // // // // // //             >
// // // // // // //               <Image src="/dashboardIcons/trash.svg" alt="Delete" width={18} height={18} className="mr-2" />
// // // // // // //               Delete
// // // // // // //             </button>
// // // // // // //           )}
// // // // // // //         </div>
// // // // // // //       )}
// // // // // // //     </div>
// // // // // // //   );

// // // // // // //   return (
// // // // // // //     <>
// // // // // // //       <div className={`relative inline-block ${wrapperClassName}`} ref={wrapperRef}>
// // // // // // //         <button
// // // // // // //           onClick={() => {
// // // // // // //             // toggle open; compute position will run in useLayoutEffect
// // // // // // //             setOpen((s) => !s);
// // // // // // //           }}
// // // // // // //           className="p-1 rounded"
// // // // // // //           aria-haspopup="true"
// // // // // // //           aria-expanded={open}
// // // // // // //           aria-label={ariaLabel}
// // // // // // //         >
// // // // // // //           <PiDotsThreeOutline size={24} />
// // // // // // //         </button>
// // // // // // //       </div>

// // // // // // //       {/* render portal menu into body only when open */}
// // // // // // //       {typeof document !== "undefined" && open ? createPortal(menuNode, document.body) : null}
// // // // // // //     </>
// // // // // // //   );
// // // // // // // }

// // // // // // // row action on top i.e absolute now scroll nonsene anymore
// // // // // // // src/app/(dashboard)/dashboard/components/RowActionMenu.tsx
// // // // // // "use client";
// // // // // // import React, {
// // // // // //   useRef,
// // // // // //   useState,
// // // // // //   useEffect,
// // // // // //   useLayoutEffect,
// // // // // //   CSSProperties,
// // // // // // } from "react";
// // // // // // import { createPortal } from "react-dom";
// // // // // // import Image from "next/image";
// // // // // // import { PiDotsThreeOutline } from "react-icons/pi";

// // // // // // type Props = {
// // // // // //   onEdit?: () => void;
// // // // // //   onDelete?: () => void;
// // // // // //   ariaLabel?: string;
// // // // // //   menuWidthClass?: string;
// // // // // //   wrapperClassName?: string;
// // // // // //   children?: React.ReactNode;
// // // // // // };

// // // // // // export function closeAllRowActionMenus() {
// // // // // //   if (typeof window !== "undefined") {
// // // // // //     window.dispatchEvent(new Event("rowActionMenu:closeAll"));
// // // // // //   }
// // // // // // }

// // // // // // export default function RowActionMenu({
// // // // // //   onEdit,
// // // // // //   onDelete,
// // // // // //   ariaLabel = "More actions",
// // // // // //   menuWidthClass = "w-44 max-w-[175px]",
// // // // // //   wrapperClassName = "",
// // // // // //   children,
// // // // // // }: Props) {
// // // // // //   const wrapperRef = useRef<HTMLDivElement | null>(null); // anchor inside table flow
// // // // // //   const menuRef = useRef<HTMLDivElement | null>(null); // portal menu element to measure
// // // // // //   const buttonRef = useRef<HTMLButtonElement | null>(null); // trigger button
// // // // // //   const [open, setOpen] = useState(false);
// // // // // //   const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);

// // // // // //   // Initial offscreen style so the portal never affects document flow
// // // // // //   const initialOffscreenStyle: CSSProperties = {
// // // // // //     position: "absolute",
// // // // // //     top: "-9999px",
// // // // // //     left: "-9999px",
// // // // // //     visibility: "hidden",
// // // // // //     zIndex: 9999,
// // // // // //   };

// // // // // //   // Compute & set menu position relative to wrapperRef anchor
// // // // // //   const computeAndSetPosition = () => {
// // // // // //     const anchor = wrapperRef.current;
// // // // // //     const menu = menuRef.current;
// // // // // //     if (!anchor || !menu) return;

// // // // // //     // Measure anchor/menu
// // // // // //     const anchorRect = anchor.getBoundingClientRect();
// // // // // //     const menuRect = menu.getBoundingClientRect();

// // // // // //     const spacing = 8; // gap
// // // // // //     const viewportW = window.innerWidth;
// // // // // //     const viewportH = window.innerHeight;

// // // // // //     // Default: align menu right edge to anchor right (like `right-0`)
// // // // // //     let top = window.scrollY + anchorRect.bottom + spacing;
// // // // // //     let left: number | undefined;
// // // // // //     let right: number | undefined;

// // // // // //     const wouldOverflowRight = anchorRect.right + menuRect.width > viewportW;
// // // // // //     const spaceLeft = anchorRect.left;
// // // // // //     const spaceRight = viewportW - anchorRect.right;

// // // // // //     if (wouldOverflowRight && spaceLeft > spaceRight) {
// // // // // //       // flip to the left side of anchor (try to keep it visible)
// // // // // //       left = Math.max(8 + window.scrollX, window.scrollX + anchorRect.left - menuRect.width + anchorRect.width);
// // // // // //     } else {
// // // // // //       right = Math.max(8, viewportW - anchorRect.right);
// // // // // //     }

// // // // // //     // Vertical flip if it would overflow bottom of viewport
// // // // // //     const bottomEdge = (top - window.scrollY) + menuRect.height;
// // // // // //     if (bottomEdge > viewportH) {
// // // // // //       const spaceAbove = anchorRect.top;
// // // // // //       if (menuRect.height + spacing <= spaceAbove) {
// // // // // //         // place above anchor
// // // // // //         top = window.scrollY + anchorRect.top - menuRect.height - spacing;
// // // // // //       } else {
// // // // // //         // clamp inside viewport and allow internal scrolling
// // // // // //         const maxTop = window.scrollY + Math.max(8, viewportH - menuRect.height - 8);
// // // // // //         top = Math.min(Math.max(top, window.scrollY + 8), maxTop);
// // // // // //       }
// // // // // //     }

// // // // // //     const style: CSSProperties = {
// // // // // //       position: "absolute",
// // // // // //       top: `${Math.round(top)}px`,
// // // // // //       zIndex: 9999,
// // // // // //       visibility: "visible",
// // // // // //     };
// // // // // //     if (left != null) style.left = `${Math.round(left)}px`;
// // // // // //     if (right != null) style.right = `${Math.round(right)}px`;

// // // // // //     // If still would overflow vertically, enable internal scrolling
// // // // // //     const computedBottom = window.scrollY + (parseFloat(style.top as string) - window.scrollY) + menuRect.height;
// // // // // //     if (computedBottom > window.scrollY + viewportH) {
// // // // // //       style.maxHeight = `${viewportH - 16}px`;
// // // // // //       style.overflow = "auto";
// // // // // //     }

// // // // // //     setMenuStyle(style);
// // // // // //   };

// // // // // //   // When opening, wait for portal render then measure & position using rAF
// // // // // //   useLayoutEffect(() => {
// // // // // //     if (!open) {
// // // // // //       setMenuStyle(null);
// // // // // //       return;
// // // // // //     }

// // // // // //     // compute after next paint so the portal DOM exists and measurements are correct
// // // // // //     const raf = window.requestAnimationFrame(() => {
// // // // // //       computeAndSetPosition();

// // // // // //       // keep the trigger focused for keyboard users but prevent scroll jump
// // // // // //       try {
// // // // // //         buttonRef.current?.focus({ preventScroll: true });
// // // // // //       } catch {
// // // // // //         // some older browsers may not support the options object; fallback to focus()
// // // // // //         try {
// // // // // //           buttonRef.current?.focus();
// // // // // //         } catch {
// // // // // //           /** ignore */
// // // // // //         }
// // // // // //       }
// // // // // //     });

// // // // // //     return () => window.cancelAnimationFrame(raf);
// // // // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // // //   }, [open]);

// // // // // //   // keep position updated while open on scroll/resize
// // // // // //   useEffect(() => {
// // // // // //     if (!open) return;
// // // // // //     const handler = () => {
// // // // // //       // debounce via rAF for smoother updates
// // // // // //       window.requestAnimationFrame(() => computeAndSetPosition());
// // // // // //     };
// // // // // //     window.addEventListener("resize", handler);
// // // // // //     window.addEventListener("scroll", handler, { passive: true });
// // // // // //     return () => {
// // // // // //       window.removeEventListener("resize", handler);
// // // // // //       window.removeEventListener("scroll", handler);
// // // // // //     };
// // // // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // // //   }, [open]);

// // // // // //   // close on outside click / Escape — consider both anchor and portal menu
// // // // // //   useEffect(() => {
// // // // // //     function onDocClick(e: MouseEvent) {
// // // // // //       const t = e.target as Node | null;
// // // // // //       const insideAnchor = wrapperRef.current?.contains(t ?? null);
// // // // // //       const insideMenu = menuRef.current?.contains(t ?? null);
// // // // // //       if (!insideAnchor && !insideMenu) {
// // // // // //         setOpen(false);
// // // // // //       }
// // // // // //     }
// // // // // //     function onDocKey(e: KeyboardEvent) {
// // // // // //       if (e.key === "Escape") setOpen(false);
// // // // // //     }

// // // // // //     if (open) {
// // // // // //       document.addEventListener("mousedown", onDocClick);
// // // // // //       document.addEventListener("keydown", onDocKey);
// // // // // //     }

// // // // // //     return () => {
// // // // // //       document.removeEventListener("mousedown", onDocClick);
// // // // // //       document.removeEventListener("keydown", onDocKey);
// // // // // //     };
// // // // // //   }, [open]);

// // // // // //   // auto-close when a modal/dialog appears (unchanged)
// // // // // //   useEffect(() => {
// // // // // //     if (typeof document === "undefined") return;
// // // // // //     const mightBeModal = (node: Node | null): boolean => {
// // // // // //       if (!node) return false;
// // // // // //       if (node.nodeType !== Node.ELEMENT_NODE) return false;
// // // // // //       const el = node as Element;
// // // // // //       const selectors =
// // // // // //         '[role="dialog"], [data-modal], .modal, .react-modal, .headlessui-modal, [data-headlessui-modal], [data-reach-dialog]';
// // // // // //       try { if (el.matches && el.matches(selectors)) return true; } catch {}
// // // // // //       try { if (el.querySelector && el.querySelector(selectors)) return true; } catch {}
// // // // // //       return false;
// // // // // //     };

// // // // // //     const observer = new MutationObserver((mutations) => {
// // // // // //       if (!open) return;
// // // // // //       for (const m of mutations) {
// // // // // //         if (m.addedNodes && m.addedNodes.length) {
// // // // // //           for (const n of Array.from(m.addedNodes)) {
// // // // // //             if (mightBeModal(n)) { setOpen(false); return; }
// // // // // //           }
// // // // // //         }
// // // // // //         if (m.type === "attributes" && m.target && mightBeModal(m.target)) {
// // // // // //           setOpen(false);
// // // // // //           return;
// // // // // //         }
// // // // // //       }
// // // // // //     });

// // // // // //     observer.observe(document.body, {
// // // // // //       childList: true,
// // // // // //       subtree: true,
// // // // // //       attributes: true,
// // // // // //     });

// // // // // //     return () => observer.disconnect();
// // // // // //   }, [open]);

// // // // // //   // programmatic close event listener
// // // // // //   useEffect(() => {
// // // // // //     function onCloseAll() {
// // // // // //       setOpen(false);
// // // // // //     }
// // // // // //     window.addEventListener("rowActionMenu:closeAll", onCloseAll);
// // // // // //     return () => window.removeEventListener("rowActionMenu:closeAll", onCloseAll);
// // // // // //   }, []);

// // // // // //   // portal menu node
// // // // // //   const menuNode = (
// // // // // //     <div
// // // // // //       ref={menuRef}
// // // // // //       data-action-menu
// // // // // //       role="menu"
// // // // // //       aria-label="Row actions"
// // // // // //       // render offscreen until we compute position to ensure no layout/scrollbar change
// // // // // //       style={menuStyle ? { ...menuStyle, zIndex: 9999 } : initialOffscreenStyle}
// // // // // //       className={`rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] ${menuWidthClass}`}
// // // // // //     >
// // // // // //       {children ? (
// // // // // //         <div>{children}</div>
// // // // // //       ) : (
// // // // // //         <div>
// // // // // //           {onEdit && (
// // // // // //             <button
// // // // // //               onClick={() => {
// // // // // //                 setOpen(false);
// // // // // //                 setTimeout(() => {
// // // // // //                   try { onEdit(); } catch {}
// // // // // //                 }, 0);
// // // // // //               }}
// // // // // //               className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-t-lg border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
// // // // // //             >
// // // // // //               <Image src="/dashboardIcons/edit.svg" alt="Edit" width={18} height={18} className="mr-2" />
// // // // // //               Edit
// // // // // //             </button>
// // // // // //           )}
// // // // // //           {onDelete && (
// // // // // //             <button
// // // // // //               onClick={() => {
// // // // // //                 setOpen(false);
// // // // // //                 setTimeout(() => {
// // // // // //                   try { onDelete(); } catch {}
// // // // // //                 }, 0);
// // // // // //               }}
// // // // // //               className={`flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 ${onEdit ? "rounded-b-lg" : "rounded-t-lg"}`}
// // // // // //             >
// // // // // //               <Image src="/dashboardIcons/trash.svg" alt="Delete" width={18} height={18} className="mr-2" />
// // // // // //               Delete
// // // // // //             </button>
// // // // // //           )}
// // // // // //         </div>
// // // // // //       )}
// // // // // //     </div>
// // // // // //   );

// // // // // //   return (
// // // // // //     <>
// // // // // //       <div className={`relative inline-block ${wrapperClassName}`} ref={wrapperRef}>
// // // // // //         <button
// // // // // //           ref={buttonRef}
// // // // // //           // Prevent native mouse-focus that can trigger auto-scroll
// // // // // //           onMouseDown={(e) => e.preventDefault()}
// // // // // //           // Keep keyboard access (Enter / Space)
// // // // // //           onKeyDown={(e) => {
// // // // // //             if (e.key === "Enter" || e.key === " ") {
// // // // // //               e.preventDefault();
// // // // // //               setOpen((s) => !s);
// // // // // //             }
// // // // // //           }}
// // // // // //           onClick={() => setOpen((s) => !s)}
// // // // // //           className="p-1 rounded"
// // // // // //           aria-haspopup="true"
// // // // // //           aria-expanded={open}
// // // // // //           aria-label={ariaLabel}
// // // // // //         >
// // // // // //           <PiDotsThreeOutline size={24} />
// // // // // //         </button>
// // // // // //       </div>

// // // // // //       {typeof document !== "undefined" && open ? createPortal(menuNode, document.body) : null}
// // // // // //     </>
// // // // // //   );
// // // // // // }

// // // // // "use client";
// // // // // import React, { useRef, useState, useEffect, useLayoutEffect, CSSProperties } from "react";
// // // // // import { createPortal } from "react-dom";
// // // // // import Image from "next/image";
// // // // // import { PiDotsThreeOutline } from "react-icons/pi";

// // // // // type Props = {
// // // // //   onEdit?: () => void;
// // // // //   onDelete?: () => void;
// // // // //   ariaLabel?: string;
// // // // //   menuWidthClass?: string;
// // // // //   wrapperClassName?: string;
// // // // //   children?: React.ReactNode;
// // // // // };

// // // // // export function closeAllRowActionMenus() {
// // // // //   if (typeof window !== "undefined") {
// // // // //     window.dispatchEvent(new Event("rowActionMenu:closeAll"));
// // // // //   }
// // // // // }

// // // // // export default function RowActionMenu({
// // // // //   onEdit,
// // // // //   onDelete,
// // // // //   ariaLabel = "More actions",
// // // // //   menuWidthClass = "w-44 max-w-[175px]",
// // // // //   wrapperClassName = "",
// // // // //   children,
// // // // // }: Props) {
// // // // //   const wrapperRef = useRef<HTMLDivElement | null>(null); // anchor inside table flow
// // // // //   const menuRef = useRef<HTMLDivElement | null>(null); // portal menu element to measure
// // // // //   const buttonRef = useRef<HTMLButtonElement | null>(null); // trigger button
// // // // //   const [open, setOpen] = useState(false);
// // // // //   const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);
// // // // //   const scrollParentsRef = useRef<(Window | Element)[] | null>(null);

// // // // //   // Initial offscreen style so the portal never affects document flow
// // // // //   const initialOffscreenStyle: CSSProperties = {
// // // // //     position: "absolute",
// // // // //     top: "-9999px",
// // // // //     left: "-9999px",
// // // // //     visibility: "hidden",
// // // // //     zIndex: 9999,
// // // // //   };

// // // // //   // Find scrollable ancestors (including window)
// // // // //   const getScrollParents = (node: Element | null): (Window | Element)[] => {
// // // // //     const parents: (Window | Element)[] = [];
// // // // //     if (!node) return [window];
// // // // //     let el: Element | null = node.parentElement;
// // // // //     const overflowRegex = /(auto|scroll|overlay)/;
// // // // //     while (el) {
// // // // //       try {
// // // // //         const style = getComputedStyle(el);
// // // // //         if (
// // // // //           overflowRegex.test(style.overflow + style.overflowY + style.overflowX) ||
// // // // //           el.scrollHeight > el.clientHeight
// // // // //         ) {
// // // // //           parents.push(el);
// // // // //         }
// // // // //       } catch {
// // // // //         // ignore
// // // // //       }
// // // // //       el = el.parentElement;
// // // // //     }
// // // // //     parents.push(window);
// // // // //     return parents;
// // // // //   };

// // // // //   // Compute & set menu position relative to wrapperRef anchor
// // // // //   const computeAndSetPosition = () => {
// // // // //     const anchor = wrapperRef.current;
// // // // //     const menu = menuRef.current;
// // // // //     if (!anchor || !menu) return;

// // // // //     // Measure anchor/menu
// // // // //     const anchorRect = anchor.getBoundingClientRect();
// // // // //     const menuRect = menu.getBoundingClientRect();

// // // // //     const spacing = 8; // gap
// // // // //     const viewportW = window.innerWidth;
// // // // //     const viewportH = window.innerHeight;

// // // // //     // Default: align menu right edge to anchor right (like `right-0`)
// // // // //     let top = window.scrollY + anchorRect.bottom + spacing;
// // // // //     let left: number | undefined;
// // // // //     let right: number | undefined;

// // // // //     const wouldOverflowRight = anchorRect.right + menuRect.width > viewportW;
// // // // //     const spaceLeft = anchorRect.left;
// // // // //     const spaceRight = viewportW - anchorRect.right;

// // // // //     if (wouldOverflowRight && spaceLeft > spaceRight) {
// // // // //       // flip to the left side of anchor (try to keep it visible)
// // // // //       left = Math.max(8 + window.scrollX, window.scrollX + anchorRect.left - menuRect.width + anchorRect.width);
// // // // //     } else {
// // // // //       right = Math.max(8, viewportW - anchorRect.right);
// // // // //     }

// // // // //     // Vertical flip if it would overflow bottom of viewport
// // // // //     const bottomEdge = (top - window.scrollY) + menuRect.height;
// // // // //     if (bottomEdge > viewportH) {
// // // // //       const spaceAbove = anchorRect.top;
// // // // //       if (menuRect.height + spacing <= spaceAbove) {
// // // // //         // place above anchor
// // // // //         top = window.scrollY + anchorRect.top - menuRect.height - spacing;
// // // // //       } else {
// // // // //         // clamp inside viewport and allow internal scrolling
// // // // //         const maxTop = window.scrollY + Math.max(8, viewportH - menuRect.height - 8);
// // // // //         top = Math.min(Math.max(top, window.scrollY + 8), maxTop);
// // // // //       }
// // // // //     }

// // // // //     const style: CSSProperties = {
// // // // //       position: "absolute",
// // // // //       top: `${Math.round(top)}px`,
// // // // //       zIndex: 9999,
// // // // //       visibility: "visible",
// // // // //     };
// // // // //     if (left != null) style.left = `${Math.round(left)}px`;
// // // // //     if (right != null) style.right = `${Math.round(right)}px`;

// // // // //     // If still would overflow vertically, enable internal scrolling
// // // // //     const computedBottom = window.scrollY + (parseFloat(style.top as string) - window.scrollY) + menuRect.height;
// // // // //     if (computedBottom > window.scrollY + viewportH) {
// // // // //       style.maxHeight = `${viewportH - 16}px`;
// // // // //       style.overflow = "auto";
// // // // //     }

// // // // //     setMenuStyle(style);
// // // // //   };

// // // // //   // When opening, wait for portal render then measure & position using rAF
// // // // //   useLayoutEffect(() => {
// // // // //     if (!open) {
// // // // //       setMenuStyle(null);
// // // // //       return;
// // // // //     }

// // // // //     // compute after next paint so the portal DOM exists and measurements are correct
// // // // //     const raf = window.requestAnimationFrame(() => {
// // // // //       computeAndSetPosition();

// // // // //       // keep the trigger focused for keyboard users but prevent scroll jump
// // // // //       try {
// // // // //         buttonRef.current?.focus({ preventScroll: true });
// // // // //       } catch {
// // // // //         try {
// // // // //           buttonRef.current?.focus();
// // // // //         } catch {
// // // // //           /** ignore */
// // // // //         }
// // // // //       }
// // // // //     });

// // // // //     return () => window.cancelAnimationFrame(raf);
// // // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // //   }, [open]);

// // // // //   // keep position updated while open on resize/scroll of all scroll parents
// // // // //   useEffect(() => {
// // // // //     if (!open) return;

// // // // //     const anchor = wrapperRef.current;
// // // // //     const parents = getScrollParents(anchor);
// // // // //     scrollParentsRef.current = parents;

// // // // //     const handler = () => {
// // // // //       window.requestAnimationFrame(() => computeAndSetPosition());
// // // // //     };

// // // // //     // attach listeners to each scroll parent
// // // // //     parents.forEach((p) => (p as any).addEventListener("scroll", handler, { passive: true }));
// // // // //     window.addEventListener("resize", handler);

// // // // //     return () => {
// // // // //       parents.forEach((p) => (p as any).removeEventListener("scroll", handler));
// // // // //       window.removeEventListener("resize", handler);
// // // // //       scrollParentsRef.current = null;
// // // // //     };
// // // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // //   }, [open]);

// // // // //   // close on outside click / Escape — consider both anchor and portal menu
// // // // //   useEffect(() => {
// // // // //     function onDocClick(e: MouseEvent) {
// // // // //       const t = e.target as Node | null;
// // // // //       const insideAnchor = wrapperRef.current?.contains(t ?? null);
// // // // //       const insideMenu = menuRef.current?.contains(t ?? null);
// // // // //       if (!insideAnchor && !insideMenu) {
// // // // //         setOpen(false);
// // // // //       }
// // // // //     }
// // // // //     function onDocKey(e: KeyboardEvent) {
// // // // //       if (e.key === "Escape") setOpen(false);
// // // // //     }

// // // // //     if (open) {
// // // // //       document.addEventListener("mousedown", onDocClick);
// // // // //       document.addEventListener("keydown", onDocKey);
// // // // //     }

// // // // //     return () => {
// // // // //       document.removeEventListener("mousedown", onDocClick);
// // // // //       document.removeEventListener("keydown", onDocKey);
// // // // //     };
// // // // //   }, [open]);

// // // // //   // auto-close when a modal/dialog appears (unchanged)
// // // // //   useEffect(() => {
// // // // //     if (typeof document === "undefined") return;
// // // // //     const mightBeModal = (node: Node | null): boolean => {
// // // // //       if (!node) return false;
// // // // //       if (node.nodeType !== Node.ELEMENT_NODE) return false;
// // // // //       const el = node as Element;
// // // // //       const selectors =
// // // // //         '[role="dialog"], [data-modal], .modal, .react-modal, .headlessui-modal, [data-headlessui-modal], [data-reach-dialog]';
// // // // //       try { if (el.matches && el.matches(selectors)) return true; } catch {}
// // // // //       try { if (el.querySelector && el.querySelector(selectors)) return true; } catch {}
// // // // //       return false;
// // // // //     };

// // // // //     const observer = new MutationObserver((mutations) => {
// // // // //       if (!open) return;
// // // // //       for (const m of mutations) {
// // // // //         if (m.addedNodes && m.addedNodes.length) {
// // // // //           for (const n of Array.from(m.addedNodes)) {
// // // // //             if (mightBeModal(n)) { setOpen(false); return; }
// // // // //           }
// // // // //         }
// // // // //         if (m.type === "attributes" && m.target && mightBeModal(m.target)) {
// // // // //           setOpen(false);
// // // // //           return;
// // // // //         }
// // // // //       }
// // // // //     });

// // // // //     observer.observe(document.body, {
// // // // //       childList: true,
// // // // //       subtree: true,
// // // // //       attributes: true,
// // // // //     });

// // // // //     return () => observer.disconnect();
// // // // //   }, [open]);

// // // // //   // programmatic close event listener
// // // // //   useEffect(() => {
// // // // //     function onCloseAll() {
// // // // //       setOpen(false);
// // // // //     }
// // // // //     window.addEventListener("rowActionMenu:closeAll", onCloseAll);
// // // // //     return () => window.removeEventListener("rowActionMenu:closeAll", onCloseAll);
// // // // //   }, []);

// // // // //   // portal menu node
// // // // //   const menuNode = (
// // // // //     <div
// // // // //       ref={menuRef}
// // // // //       data-action-menu
// // // // //       role="menu"
// // // // //       aria-label="Row actions"
// // // // //       // render offscreen until we compute position to ensure no layout/scrollbar change
// // // // //       style={menuStyle ? { ...menuStyle, zIndex: 9999 } : initialOffscreenStyle}
// // // // //       className={`rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] ${menuWidthClass}`}
// // // // //     >
// // // // //       {children ? (
// // // // //         <div>{children}</div>
// // // // //       ) : (
// // // // //         <div>
// // // // //           {onEdit && (
// // // // //             <button
// // // // //               onClick={() => {
// // // // //                 setOpen(false);
// // // // //                 setTimeout(() => {
// // // // //                   try { onEdit(); } catch {}
// // // // //                 }, 0);
// // // // //               }}
// // // // //               className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-t-lg border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
// // // // //             >
// // // // //               <Image src="/dashboardIcons/edit.svg" alt="Edit" width={18} height={18} className="mr-2" />
// // // // //               Edit
// // // // //             </button>
// // // // //           )}
// // // // //           {onDelete && (
// // // // //             <button
// // // // //               onClick={() => {
// // // // //                 setOpen(false);
// // // // //                 setTimeout(() => {
// // // // //                   try { onDelete(); } catch {}
// // // // //                 }, 0);
// // // // //               }}
// // // // //               className={`flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 ${onEdit ? "rounded-b-lg" : "rounded-t-lg"}`}
// // // // //             >
// // // // //               <Image src="/dashboardIcons/trash.svg" alt="Delete" width={18} height={18} className="mr-2" />
// // // // //               Delete
// // // // //             </button>
// // // // //           )}
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   );

// // // // //   return (
// // // // //     <>
// // // // //       <div className={`relative inline-block ${wrapperClassName}`} ref={wrapperRef}>
// // // // //         <button
// // // // //           ref={buttonRef}
// // // // //           // Prevent native mouse-focus that can trigger auto-scroll
// // // // //           onMouseDown={(e) => e.preventDefault()}
// // // // //           // Keep keyboard access (Enter / Space)
// // // // //           onKeyDown={(e) => {
// // // // //             if (e.key === "Enter" || e.key === " ") {
// // // // //               e.preventDefault();
// // // // //               setOpen((s) => !s);
// // // // //             }
// // // // //           }}
// // // // //           onClick={() => setOpen((s) => !s)}
// // // // //           className="p-1 rounded"
// // // // //           aria-haspopup="true"
// // // // //           aria-expanded={open}
// // // // //           aria-label={ariaLabel}
// // // // //         >
// // // // //           <PiDotsThreeOutline size={24} />
// // // // //         </button>
// // // // //       </div>

// // // // //       {typeof document !== "undefined" && open ? createPortal(menuNode, document.body) : null}
// // // // //     </>
// // // // //   );
// // // // // }

// // // // // src/app/(dashboard)/dashboard/components/RowActionMenu.tsx
// // // // "use client";
// // // // import React, {
// // // //   useRef,
// // // //   useState,
// // // //   useEffect,
// // // //   useLayoutEffect,
// // // //   CSSProperties,
// // // // } from "react";
// // // // import { createPortal } from "react-dom";
// // // // import Image from "next/image";
// // // // import { PiDotsThreeOutline } from "react-icons/pi";

// // // // type Props = {
// // // //   onEdit?: () => void;
// // // //   onDelete?: () => void;
// // // //   ariaLabel?: string;
// // // //   menuWidthClass?: string;
// // // //   wrapperClassName?: string;
// // // //   children?: React.ReactNode;
// // // // };

// // // // export function closeAllRowActionMenus() {
// // // //   if (typeof window !== "undefined") {
// // // //     window.dispatchEvent(new Event("rowActionMenu:closeAll"));
// // // //   }
// // // // }

// // // // /**
// // // //  * Portal approach:
// // // //  * - Menu is rendered into document.body (over the table; won't cause table scroll/resize).
// // // //  * - We compute absolute page coordinates from the row's bounding rect and position the portal menu there.
// // // //  * - Aligns menu's right edge to the row's right edge (like `right: 0` relative to the row).
// // // //  * - Recomputes on scroll/resize so it visually follows the row.
// // // //  */
// // // // export default function RowActionMenu({
// // // //   onEdit,
// // // //   onDelete,
// // // //   ariaLabel = "More actions",
// // // //   menuWidthClass = "w-44 max-w-[175px]",
// // // //   wrapperClassName = "",
// // // //   children,
// // // // }: Props) {
// // // //   const wrapperRef = useRef<HTMLDivElement | null>(null); // anchor inside row (used for measurements)
// // // //   const menuRef = useRef<HTMLDivElement | null>(null); // portal menu element
// // // //   const buttonRef = useRef<HTMLButtonElement | null>(null);
// // // //   const [open, setOpen] = useState(false);
// // // //   const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);

// // // //   // Offscreen style used until we measure and compute final position
// // // //   const initialOffscreenStyle: CSSProperties = {
// // // //     position: "absolute",
// // // //     top: "-9999px",
// // // //     left: "-9999px",
// // // //     visibility: "hidden",
// // // //     zIndex: 9999,
// // // //   };

// // // //   // compute position in page coordinates (so portal sits over everything)
// // // //   const computeAndSetPosition = () => {
// // // //     const anchor = wrapperRef.current;
// // // //     const menu = menuRef.current;
// // // //     if (!anchor || !menu) return;

// // // //     const anchorRect = anchor.getBoundingClientRect();
// // // //     const menuRect = menu.getBoundingClientRect();

// // // //     const spacing = 8; // gap between row and menu
// // // //     const viewportW = window.innerWidth;
// // // //     const viewportH = window.innerHeight;

// // // //     // target: align menu's right edge with anchor's right edge
// // // //     // left = page scroll X + anchorRect.right - menuRect.width
// // // //     let left = Math.round(window.scrollX + anchorRect.right - menuRect.width);
// // // //     // fallback: if it would go off left edge, clamp to anchor.left
// // // //     if (left < Math.round(window.scrollX + 8)) {
// // // //       left = Math.round(window.scrollX + anchorRect.left);
// // // //     }

// // // //     // default: place menu below the row (use anchorRect.bottom)
// // // //     let top = Math.round(window.scrollY + anchorRect.bottom + spacing);

// // // //     // if it would overflow bottom, try to flip above the anchor
// // // //     if (top + menuRect.height > window.scrollY + viewportH) {
// // // //       const aboveTop = Math.round(window.scrollY + anchorRect.top - spacing - menuRect.height);
// // // //       // if there's enough room above, flip above
// // // //       if (aboveTop >= Math.round(window.scrollY + 8)) {
// // // //         top = aboveTop;
// // // //       } else {
// // // //         // otherwise clamp vertically and allow internal scrolling
// // // //         const availableBelow = Math.max(0, viewportH - anchorRect.bottom - spacing);
// // // //         const availableAbove = Math.max(0, anchorRect.top - spacing);
// // // //         const maxHeight = Math.max(availableBelow, availableAbove, 120);
// // // //         setMenuStyle({
// // // //           position: "absolute",
// // // //           top: `${Math.round(top)}px`,
// // // //           left: `${Math.round(left)}px`,
// // // //           zIndex: 9999,
// // // //           maxHeight: `${Math.round(maxHeight)}px`,
// // // //           overflow: "auto",
// // // //           visibility: "visible",
// // // //         });
// // // //         return;
// // // //       }
// // // //     }

// // // //     setMenuStyle({
// // // //       position: "absolute",
// // // //       top: `${Math.round(top)}px`,
// // // //       left: `${Math.round(left)}px`,
// // // //       zIndex: 9999,
// // // //       visibility: "visible",
// // // //     });
// // // //   };

// // // //   // When menu opens: render portal (offscreen), then measure & position in rAF.
// // // //   useLayoutEffect(() => {
// // // //     if (!open) {
// // // //       setMenuStyle(null);
// // // //       return;
// // // //     }
// // // //     // measure after render/paint to ensure menuRef exists & has width/height
// // // //     const raf = window.requestAnimationFrame(() => {
// // // //       computeAndSetPosition();
// // // //       // keep trigger focused for keyboard users but prevent scroll jump
// // // //       try {
// // // //         buttonRef.current?.focus({ preventScroll: true });
// // // //       } catch {
// // // //         try {
// // // //           buttonRef.current?.focus();
// // // //         } catch {}
// // // //       }
// // // //     });
// // // //     return () => window.cancelAnimationFrame(raf);
// // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // //   }, [open]);

// // // //   // Keep position updated while open on scroll/resize (follows row)
// // // //   useEffect(() => {
// // // //     if (!open) return;
// // // //     let rafId = 0;
// // // //     const handler = () => {
// // // //       if (rafId) cancelAnimationFrame(rafId);
// // // //       rafId = requestAnimationFrame(() => {
// // // //         computeAndSetPosition();
// // // //         rafId = 0;
// // // //       });
// // // //     };
// // // //     window.addEventListener("scroll", handler, { passive: true });
// // // //     window.addEventListener("resize", handler);
// // // //     return () => {
// // // //       if (rafId) cancelAnimationFrame(rafId);
// // // //       window.removeEventListener("scroll", handler);
// // // //       window.removeEventListener("resize", handler);
// // // //     };
// // // //   }, [open]);

// // // //   // Close on outside click / Escape — consider both wrapper and the portal menu
// // // //   useEffect(() => {
// // // //     function onDocClick(e: MouseEvent) {
// // // //       const t = e.target as Node | null;
// // // //       const insideAnchor = wrapperRef.current?.contains(t ?? null);
// // // //       const insideMenu = menuRef.current?.contains(t ?? null);
// // // //       if (!insideAnchor && !insideMenu) {
// // // //         setOpen(false);
// // // //       }
// // // //     }
// // // //     function onDocKey(e: KeyboardEvent) {
// // // //       if (e.key === "Escape") setOpen(false);
// // // //     }

// // // //     if (open) {
// // // //       document.addEventListener("mousedown", onDocClick);
// // // //       document.addEventListener("keydown", onDocKey);
// // // //     }
// // // //     return () => {
// // // //       document.removeEventListener("mousedown", onDocClick);
// // // //       document.removeEventListener("keydown", onDocKey);
// // // //     };
// // // //   }, [open]);

// // // //   // auto-close when modal/dialog appears (unchanged)
// // // //   useEffect(() => {
// // // //     if (typeof document === "undefined") return;
// // // //     const mightBeModal = (node: Node | null): boolean => {
// // // //       if (!node) return false;
// // // //       if (node.nodeType !== Node.ELEMENT_NODE) return false;
// // // //       const el = node as Element;
// // // //       const selectors =
// // // //         '[role="dialog"], [data-modal], .modal, .react-modal, .headlessui-modal, [data-headlessui-modal], [data-reach-dialog]';
// // // //       try { if (el.matches && el.matches(selectors)) return true; } catch {}
// // // //       try { if (el.querySelector && el.querySelector(selectors)) return true; } catch {}
// // // //       return false;
// // // //     };

// // // //     const observer = new MutationObserver((mutations) => {
// // // //       if (!open) return;
// // // //       for (const m of mutations) {
// // // //         if (m.addedNodes && m.addedNodes.length) {
// // // //           for (const n of Array.from(m.addedNodes)) {
// // // //             if (mightBeModal(n)) { setOpen(false); return; }
// // // //           }
// // // //         }
// // // //         if (m.type === "attributes" && m.target && mightBeModal(m.target)) {
// // // //           setOpen(false);
// // // //           return;
// // // //         }
// // // //       }
// // // //     });

// // // //     observer.observe(document.body, {
// // // //       childList: true,
// // // //       subtree: true,
// // // //       attributes: true,
// // // //     });

// // // //     return () => observer.disconnect();
// // // //   }, [open]);

// // // //   // programmatic close event listener
// // // //   useEffect(() => {
// // // //     function onCloseAll() {
// // // //       setOpen(false);
// // // //     }
// // // //     window.addEventListener("rowActionMenu:closeAll", onCloseAll);
// // // //     return () => window.removeEventListener("rowActionMenu:closeAll", onCloseAll);
// // // //   }, []);

// // // //   // Portal menu node (rendered into document.body)
// // // //   const portalMenuNode = (
// // // //     <div
// // // //       ref={menuRef}
// // // //       data-action-menu
// // // //       role="menu"
// // // //       aria-label="Row actions"
// // // //       // Use menuStyle when computed, otherwise render offscreen until positioned
// // // //       style={menuStyle ? { ...menuStyle, zIndex: 9999 } : initialOffscreenStyle}
// // // //       className={`rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] ${menuWidthClass}`}
// // // //     >
// // // //       {children ? (
// // // //         <div>{children}</div>
// // // //       ) : (
// // // //         <div>
// // // //           {onEdit && (
// // // //             <button
// // // //               onClick={() => {
// // // //                 setOpen(false);
// // // //                 setTimeout(() => { try { onEdit(); } catch {} }, 0);
// // // //               }}
// // // //               className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-t-lg border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
// // // //             >
// // // //               <Image src="/dashboardIcons/edit.svg" alt="Edit" width={18} height={18} className="mr-2" />
// // // //               Edit
// // // //             </button>
// // // //           )}
// // // //           {onDelete && (
// // // //             <button
// // // //               onClick={() => {
// // // //                 setOpen(false);
// // // //                 setTimeout(() => { try { onDelete(); } catch {} }, 0);
// // // //               }}
// // // //               className={`flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 ${onEdit ? "rounded-b-lg" : "rounded-t-lg"}`}
// // // //             >
// // // //               <Image src="/dashboardIcons/trash.svg" alt="Delete" width={18} height={18} className="mr-2" />
// // // //               Delete
// // // //             </button>
// // // //           )}
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );

// // // //   return (
// // // //     <>
// // // //       {/* This wrapper lives inside the row — we use it only as the measurement anchor */}
// // // //       <div className={`relative inline-block ${wrapperClassName}`} ref={wrapperRef}>
// // // //         <button
// // // //           ref={buttonRef}
// // // //           // Prevent native mouse-focus that can cause scroll jumps
// // // //           onMouseDown={(e) => e.preventDefault()}
// // // //           onKeyDown={(e) => {
// // // //             if (e.key === "Enter" || e.key === " ") {
// // // //               e.preventDefault();
// // // //               setOpen((s) => !s);
// // // //             }
// // // //           }}
// // // //           onClick={() => setOpen((s) => !s)}
// // // //           className="p-1 rounded"
// // // //           aria-haspopup="true"
// // // //           aria-expanded={open}
// // // //           aria-label={ariaLabel}
// // // //         >
// // // //           <PiDotsThreeOutline size={24} />
// // // //         </button>
// // // //       </div>

// // // //       {/* Portal into body so menu is over the table and won't affect table flow/scroll */}
// // // //       {typeof document !== "undefined" && open ? createPortal(portalMenuNode, document.body) : null}
// // // //     </>
// // // //   );
// // // // }

// // // // src/app/(dashboard)/dashboard/components/RowActionMenu.tsx
// // // "use client";
// // // import React, {
// // //   useRef,
// // //   useState,
// // //   useEffect,
// // //   useLayoutEffect,
// // //   CSSProperties,
// // // } from "react";
// // // import { createPortal } from "react-dom";
// // // import Image from "next/image";
// // // import { PiDotsThreeOutline } from "react-icons/pi";

// // // type Props = {
// // //   onEdit?: () => void;
// // //   onDelete?: () => void;
// // //   ariaLabel?: string;
// // //   menuWidthClass?: string;
// // //   wrapperClassName?: string;
// // //   children?: React.ReactNode;
// // // };

// // // export function closeAllRowActionMenus() {
// // //   if (typeof window !== "undefined") {
// // //     window.dispatchEvent(new Event("rowActionMenu:closeAll"));
// // //   }
// // // }

// // // /**
// // //  * Portal + scroll-parent listeners approach:
// // //  * - Menu is portalled into document.body so it sits over the table (no layout change).
// // //  * - We compute absolute coordinates from the row's getBoundingClientRect().
// // //  * - We attach scroll listeners to all scrollable ancestors of the row (and resize to window).
// // //  *   This ensures the portal follows the row as you scroll any parent container.
// // //  * - We also observe DOM mutations to adapt to layout changes (virtual lists, row reflows).
// // //  */
// // // export default function RowActionMenu({
// // //   onEdit,
// // //   onDelete,
// // //   ariaLabel = "More actions",
// // //   menuWidthClass = "w-44 max-w-[175px]",
// // //   wrapperClassName = "",
// // //   children,
// // // }: Props) {
// // //   const wrapperRef = useRef<HTMLDivElement | null>(null); // anchor in the row
// // //   const menuRef = useRef<HTMLDivElement | null>(null); // portal menu node
// // //   const buttonRef = useRef<HTMLButtonElement | null>(null);
// // //   const scrollParentsRef = useRef<(Window | Element)[] | null>(null);
// // //   const mutationObserverRef = useRef<MutationObserver | null>(null);
// // //   const rafRef = useRef<number | null>(null);

// // //   const [open, setOpen] = useState(false);
// // //   const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);

// // //   const initialOffscreenStyle: CSSProperties = {
// // //     position: "absolute",
// // //     top: "-9999px",
// // //     left: "-9999px",
// // //     visibility: "hidden",
// // //     zIndex: 9999,
// // //   };

// // //   // Find scrollable ancestors (returns [..ancestors, window])
// // //   const getScrollParents = (node: Element | null): (Window | Element)[] => {
// // //     const result: (Window | Element)[] = [];
// // //     if (!node) return [window];
// // //     let el: Element | null = node;
// // //     const overflowRegex = /(auto|scroll|overlay)/;
// // //     while (el) {
// // //       try {
// // //         const style = getComputedStyle(el);
// // //         if (
// // //           overflowRegex.test(style.overflow + style.overflowY + style.overflowX) ||
// // //           el.scrollHeight > el.clientHeight ||
// // //           el.scrollWidth > el.clientWidth
// // //         ) {
// // //           result.push(el);
// // //         }
// // //       } catch {
// // //         // ignore cross-origin or inaccessible nodes
// // //       }
// // //       el = el.parentElement;
// // //     }
// // //     result.push(window);
// // //     return result;
// // //   };

// // //   // Compute and set menu absolute page coordinates so portal sits over row
// // //   const computeAndSetPosition = () => {
// // //     const anchor = wrapperRef.current;
// // //     const menu = menuRef.current;
// // //     if (!anchor || !menu) return;

// // //     const anchorRect = anchor.getBoundingClientRect();
// // //     const menuRect = menu.getBoundingClientRect();

// // //     const spacing = 8;
// // //     const viewportW = window.innerWidth;
// // //     const viewportH = window.innerHeight;

// // //     // Align menu's right edge with anchor's right edge by default:
// // //     let left = Math.round(window.scrollX + anchorRect.right - menuRect.width);

// // //     // clamp left so it doesn't go off-screen on the left
// // //     left = Math.max(Math.round(window.scrollX + 8), left);

// // //     // default place below the row
// // //     let top = Math.round(window.scrollY + anchorRect.bottom + spacing);

// // //     // vertical flip if it would overflow bottom
// // //     if (top + menuRect.height > window.scrollY + viewportH) {
// // //       const aboveTop = Math.round(window.scrollY + anchorRect.top - spacing - menuRect.height);
// // //       if (aboveTop >= Math.round(window.scrollY + 8)) {
// // //         top = aboveTop; // place above
// // //       } else {
// // //         // clamp and allow internal scrolling
// // //         const availableBelow = Math.max(0, viewportH - anchorRect.bottom - spacing);
// // //         const availableAbove = Math.max(0, anchorRect.top - spacing);
// // //         const maxHeight = Math.max(availableBelow, availableAbove, 120);
// // //         setMenuStyle({
// // //           position: "absolute",
// // //           top: `${Math.round(top)}px`,
// // //           left: `${Math.round(left)}px`,
// // //           zIndex: 9999,
// // //           maxHeight: `${Math.round(maxHeight)}px`,
// // //           overflow: "auto",
// // //           visibility: "visible",
// // //         });
// // //         return;
// // //       }
// // //     }

// // //     setMenuStyle({
// // //       position: "absolute",
// // //       top: `${Math.round(top)}px`,
// // //       left: `${Math.round(left)}px`,
// // //       zIndex: 9999,
// // //       visibility: "visible",
// // //     });
// // //   };

// // //   // Helper to schedule recompute via rAF (debounced-ish)
// // //   const scheduleRecompute = () => {
// // //     if (rafRef.current) cancelAnimationFrame(rafRef.current);
// // //     rafRef.current = requestAnimationFrame(() => {
// // //       computeAndSetPosition();
// // //       rafRef.current = null;
// // //     });
// // //   };

// // //   // When opened: measure after render (rAF), find scroll parents, attach listeners and mutation observer
// // //   useLayoutEffect(() => {
// // //     if (!open) {
// // //       setMenuStyle(null);
// // //       // cleanup any outstanding raf
// // //       if (rafRef.current) {
// // //         cancelAnimationFrame(rafRef.current);
// // //         rafRef.current = null;
// // //       }
// // //       return;
// // //     }

// // //     // measure & position after the menu mounts
// // //     rafRef.current = requestAnimationFrame(() => {
// // //       computeAndSetPosition();
// // //       rafRef.current = null;
// // //       // focus trigger without scrolling jump
// // //       try {
// // //         buttonRef.current?.focus({ preventScroll: true });
// // //       } catch {
// // //         try {
// // //           buttonRef.current?.focus();
// // //         } catch {}
// // //       }
// // //     });

// // //     // identify scroll parents and store them
// // //     const parents = getScrollParents(wrapperRef.current);
// // //     scrollParentsRef.current = parents;

// // //     // attach scroll listeners to each parent
// // //     const handler = () => scheduleRecompute();
// // //     parents.forEach((p) => {
// // //       try {
// // //         (p as any).addEventListener("scroll", handler, { passive: true });
// // //       } catch {
// // //         // ignore if cannot attach
// // //       }
// // //     });
// // //     // window resize
// // //     window.addEventListener("resize", handler);

// // //     // Observe DOM mutations in case the table/rows change position (virtualization, reflow)
// // //     const mo = new MutationObserver(() => scheduleRecompute());
// // //     mutationObserverRef.current = mo;
// // //     mo.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: false });

// // //     return () => {
// // //       // cleanup listeners & observer
// // //       parents.forEach((p) => {
// // //         try {
// // //           (p as any).removeEventListener("scroll", handler);
// // //         } catch {}
// // //       });
// // //       window.removeEventListener("resize", handler);
// // //       if (mutationObserverRef.current) {
// // //         try {
// // //           mutationObserverRef.current.disconnect();
// // //         } catch {}
// // //         mutationObserverRef.current = null;
// // //       }
// // //       if (rafRef.current) {
// // //         cancelAnimationFrame(rafRef.current);
// // //         rafRef.current = null;
// // //       }
// // //       scrollParentsRef.current = null;
// // //     };
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [open]);

// // //   // Close on outside click / Escape — consider both wrapper and portal menu
// // //   useEffect(() => {
// // //     function onDocClick(e: MouseEvent) {
// // //       const t = e.target as Node | null;
// // //       const insideAnchor = wrapperRef.current?.contains(t ?? null);
// // //       const insideMenu = menuRef.current?.contains(t ?? null);
// // //       if (!insideAnchor && !insideMenu) setOpen(false);
// // //     }
// // //     function onDocKey(e: KeyboardEvent) {
// // //       if (e.key === "Escape") setOpen(false);
// // //     }

// // //     if (open) {
// // //       document.addEventListener("mousedown", onDocClick);
// // //       document.addEventListener("keydown", onDocKey);
// // //     }
// // //     return () => {
// // //       document.removeEventListener("mousedown", onDocClick);
// // //       document.removeEventListener("keydown", onDocKey);
// // //     };
// // //   }, [open]);

// // //   // auto-close when modal/dialog appears (unchanged)
// // //   useEffect(() => {
// // //     if (typeof document === "undefined") return;
// // //     const mightBeModal = (node: Node | null): boolean => {
// // //       if (!node) return false;
// // //       if (node.nodeType !== Node.ELEMENT_NODE) return false;
// // //       const el = node as Element;
// // //       const selectors =
// // //         '[role="dialog"], [data-modal], .modal, .react-modal, .headlessui-modal, [data-headlessui-modal], [data-reach-dialog]';
// // //       try { if (el.matches && el.matches(selectors)) return true; } catch {}
// // //       try { if (el.querySelector && el.querySelector(selectors)) return true; } catch {}
// // //       return false;
// // //     };

// // //     const observer = new MutationObserver((mutations) => {
// // //       if (!open) return;
// // //       for (const m of mutations) {
// // //         if (m.addedNodes && m.addedNodes.length) {
// // //           for (const n of Array.from(m.addedNodes)) {
// // //             if (mightBeModal(n)) { setOpen(false); return; }
// // //           }
// // //         }
// // //         if (m.type === "attributes" && m.target && mightBeModal(m.target)) {
// // //           setOpen(false);
// // //           return;
// // //         }
// // //       }
// // //     });

// // //     observer.observe(document.body, {
// // //       childList: true,
// // //       subtree: true,
// // //       attributes: true,
// // //     });

// // //     return () => observer.disconnect();
// // //   }, [open]);

// // //   // programmatic close
// // //   useEffect(() => {
// // //     function onCloseAll() {
// // //       setOpen(false);
// // //     }
// // //     window.addEventListener("rowActionMenu:closeAll", onCloseAll);
// // //     return () => window.removeEventListener("rowActionMenu:closeAll", onCloseAll);
// // //   }, []);

// // //   // Portal menu node
// // //   const portalMenuNode = (
// // //     <div
// // //       ref={menuRef}
// // //       data-action-menu
// // //       role="menu"
// // //       aria-label="Row actions"
// // //       style={menuStyle ? { ...menuStyle, zIndex: 9999 } : initialOffscreenStyle}
// // //       className={`rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] ${menuWidthClass}`}
// // //     >
// // //       {children ? (
// // //         <div>{children}</div>
// // //       ) : (
// // //         <div>
// // //           {onEdit && (
// // //             <button
// // //               onClick={() => {
// // //                 setOpen(false);
// // //                 setTimeout(() => {
// // //                   try { onEdit(); } catch {}
// // //                 }, 0);
// // //               }}
// // //               className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-t-lg border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
// // //             >
// // //               <Image src="/dashboardIcons/edit.svg" alt="Edit" width={18} height={18} className="mr-2" />
// // //               Edit
// // //             </button>
// // //           )}
// // //           {onDelete && (
// // //             <button
// // //               onClick={() => {
// // //                 setOpen(false);
// // //                 setTimeout(() => {
// // //                   try { onDelete(); } catch {}
// // //                 }, 0);
// // //               }}
// // //               className={`flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 ${onEdit ? "rounded-b-lg" : "rounded-t-lg"}`}
// // //             >
// // //               <Image src="/dashboardIcons/trash.svg" alt="Delete" width={18} height={18} className="mr-2" />
// // //               Delete
// // //             </button>
// // //           )}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );

// // //   return (
// // //     <>
// // //       {/* wrapper lives in-row and is only used as the measurement anchor */}
// // //       <div className={`relative inline-block ${wrapperClassName}`} ref={wrapperRef}>
// // //         <button
// // //           ref={buttonRef}
// // //           // Prevent native mouse-focus that can cause scroll jumps
// // //           onMouseDown={(e) => e.preventDefault()}
// // //           onKeyDown={(e) => {
// // //             if (e.key === "Enter" || e.key === " ") {
// // //               e.preventDefault();
// // //               setOpen((s) => !s);
// // //             }
// // //           }}
// // //           onClick={() => setOpen((s) => !s)}
// // //           className="p-1 rounded"
// // //           aria-haspopup="true"
// // //           aria-expanded={open}
// // //           aria-label={ariaLabel}
// // //         >
// // //           <PiDotsThreeOutline size={24} />
// // //         </button>
// // //       </div>

// // //       {/* portal into body so it sits above the table and doesn't change table flow */}
// // //       {typeof document !== "undefined" && open ? createPortal(portalMenuNode, document.body) : null}
// // //     </>
// // //   );
// // // }

// // // perfect
// // // src/app/(dashboard)/dashboard/components/RowActionMenu.tsx
// // "use client";
// // import React, {
// //   useRef,
// //   useState,
// //   useEffect,
// //   useLayoutEffect,
// //   CSSProperties,
// // } from "react";
// // import { createPortal } from "react-dom";
// // import Image from "next/image";
// // import { PiDotsThreeOutline } from "react-icons/pi";

// // type Props = {
// //   onEdit?: () => void;
// //   onDelete?: () => void;
// //   ariaLabel?: string;
// //   menuWidthClass?: string;
// //   wrapperClassName?: string;
// //   children?: React.ReactNode;
// // };

// // export function closeAllRowActionMenus() {
// //   if (typeof window !== "undefined") {
// //     window.dispatchEvent(new Event("rowActionMenu:closeAll"));
// //   }
// // }

// // /**
// //  * Portal + fixed positioning:
// //  * - Menu is portalled into document.body (so it sits above the table and doesn't affect layout).
// //  * - We position the menu with `position: fixed` using the row's getBoundingClientRect()
// //  *   (fixed avoids changing page height and prevents extra scrollbars).
// //  * - We ALWAYS place the menu BELOW the row (no vertical flipping).
// //  * - No internal menu scrolling (no maxHeight / overflow:auto) — so you won't see the extra scrollbar.
// //  * - We still subscribe to the row's scrollable ancestors + resize + mutations so the portal follows the row.
// //  */
// // export default function RowActionMenu({
// //   onEdit,
// //   onDelete,
// //   ariaLabel = "More actions",
// //   menuWidthClass = "w-44 max-w-[175px]",
// //   wrapperClassName = "",
// //   children,
// // }: Props) {
// //   const wrapperRef = useRef<HTMLDivElement | null>(null); // measurement anchor inside the row
// //   const menuRef = useRef<HTMLDivElement | null>(null); // portal menu element
// //   const buttonRef = useRef<HTMLButtonElement | null>(null);
// //   const scrollParentsRef = useRef<(Window | Element)[] | null>(null);
// //   const mutationObserverRef = useRef<MutationObserver | null>(null);
// //   const rafRef = useRef<number | null>(null);

// //   const [open, setOpen] = useState(false);
// //   const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);

// //   // Render the menu offscreen initially (fixed so it won't affect document height)
// //   const initialOffscreenStyle: CSSProperties = {
// //     position: "fixed",
// //     top: "-9999px",
// //     left: "-9999px",
// //     visibility: "hidden",
// //     zIndex: 9999,
// //   };

// //   // Find scrollable ancestors of the row (so we add listeners only where needed)
// //   const getScrollParents = (node: Element | null): (Window | Element)[] => {
// //     const result: (Window | Element)[] = [];
// //     if (!node) return [window];
// //     let el: Element | null = node;
// //     const overflowRegex = /(auto|scroll|overlay)/;
// //     while (el) {
// //       try {
// //         const style = getComputedStyle(el);
// //         if (
// //           overflowRegex.test(style.overflow + style.overflowY + style.overflowX) ||
// //           el.scrollHeight > el.clientHeight ||
// //           el.scrollWidth > el.clientWidth
// //         ) {
// //           result.push(el);
// //         }
// //       } catch {
// //         // ignore
// //       }
// //       el = el.parentElement;
// //     }
// //     result.push(window); // always include window as a fallback
// //     return result;
// //   };

// //   /**
// //    * Compute & set position.
// //    * IMPORTANT CHANGES:
// //    * - Use `position: fixed` and anchorRect (client coordinates) so the menu does NOT change document height.
// //    * - Always place the menu BELOW the row (no flip).
// //    * - Do NOT set maxHeight/overflow on the menu (so it won't create an internal scrollbar).
// //    */
// //   const computeAndSetPosition = () => {
// //     const anchor = wrapperRef.current;
// //     const menu = menuRef.current;
// //     if (!anchor || !menu) return;

// //     // anchorRect is relative to the viewport (client coordinates) — perfect for fixed positioning
// //     const anchorRect = anchor.getBoundingClientRect();
// //     const menuRect = menu.getBoundingClientRect();

// //     const spacing = -10;

// //     // Align menu's right edge with anchor's right edge:
// //     // left = anchorRect.right - menuRect.width  (client-space)
// //     let left = Math.round(anchorRect.right - menuRect.width);

// //     // clamp so it doesn't go fully off-screen to the left
// //     left = Math.max(8, left);

// //     // ALWAYS place below the row (no flipping)
// //     const top = Math.round(anchorRect.bottom + spacing);

// //     // set fixed positioning (top/left are viewport/client coordinates)
// //     setMenuStyle({
// //       position: "fixed", // fixed prevents the menu from increasing document height => no extra scrollbar
// //       top: `${top}px`,
// //       left: `${left}px`,
// //       zIndex: 9999,
// //       visibility: "visible",
// //       // intentionally: no maxHeight / overflow here (user said it's ok to spill)
// //     });
// //   };

// //   // Debounced rAF scheduling
// //   const scheduleRecompute = () => {
// //     if (rafRef.current) cancelAnimationFrame(rafRef.current);
// //     rafRef.current = requestAnimationFrame(() => {
// //       computeAndSetPosition();
// //       rafRef.current = null;
// //     });
// //   };

// //   // When opening: measure after render, find scroll parents, attach listeners, and observe DOM changes
// //   useLayoutEffect(() => {
// //     if (!open) {
// //       setMenuStyle(null);
// //       if (rafRef.current) {
// //         cancelAnimationFrame(rafRef.current);
// //         rafRef.current = null;
// //       }
// //       return;
// //     }

// //     // measure once the portal/menu exists
// //     rafRef.current = requestAnimationFrame(() => {
// //       computeAndSetPosition();
// //       rafRef.current = null;
// //       // focus trigger without scrolling
// //       try {
// //         buttonRef.current?.focus({ preventScroll: true });
// //       } catch {
// //         try {
// //           buttonRef.current?.focus();
// //         } catch {}
// //       }
// //     });

// //     // find and attach to all scrollable ancestors (so menu follows the row in any scroll container)
// //     const parents = getScrollParents(wrapperRef.current);
// //     scrollParentsRef.current = parents;

// //     const handler = () => scheduleRecompute();
// //     parents.forEach((p) => {
// //       try {
// //         (p as any).addEventListener("scroll", handler, { passive: true });
// //       } catch {}
// //     });
// //     window.addEventListener("resize", handler);

// //     // watch for DOM mutations (virtual lists / layout changes)
// //     const mo = new MutationObserver(() => scheduleRecompute());
// //     mutationObserverRef.current = mo;
// //     mo.observe(document.body, { childList: true, subtree: true, attributes: true });

// //     return () => {
// //       parents.forEach((p) => {
// //         try {
// //           (p as any).removeEventListener("scroll", handler);
// //         } catch {}
// //       });
// //       window.removeEventListener("resize", handler);
// //       if (mutationObserverRef.current) {
// //         try {
// //           mutationObserverRef.current.disconnect();
// //         } catch {}
// //         mutationObserverRef.current = null;
// //       }
// //       if (rafRef.current) {
// //         cancelAnimationFrame(rafRef.current);
// //         rafRef.current = null;
// //       }
// //       scrollParentsRef.current = null;
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [open]);

// //   // Close on outside click / Escape
// //   useEffect(() => {
// //     function onDocClick(e: MouseEvent) {
// //       const t = e.target as Node | null;
// //       const insideAnchor = wrapperRef.current?.contains(t ?? null);
// //       const insideMenu = menuRef.current?.contains(t ?? null);
// //       if (!insideAnchor && !insideMenu) setOpen(false);
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

// //   // auto-close when modal/dialog appears (unchanged)
// //   useEffect(() => {
// //     if (typeof document === "undefined") return;
// //     const mightBeModal = (node: Node | null): boolean => {
// //       if (!node) return false;
// //       if (node.nodeType !== Node.ELEMENT_NODE) return false;
// //       const el = node as Element;
// //       const selectors =
// //         '[role="dialog"], [data-modal], .modal, .react-modal, .headlessui-modal, [data-headlessui-modal], [data-reach-dialog]';
// //       try { if (el.matches && el.matches(selectors)) return true; } catch {}
// //       try { if (el.querySelector && el.querySelector(selectors)) return true; } catch {}
// //       return false;
// //     };

// //     const observer = new MutationObserver((mutations) => {
// //       if (!open) return;
// //       for (const m of mutations) {
// //         if (m.addedNodes && m.addedNodes.length) {
// //           for (const n of Array.from(m.addedNodes)) {
// //             if (mightBeModal(n)) { setOpen(false); return; }
// //           }
// //         }
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

// //   // programmatic close
// //   useEffect(() => {
// //     function onCloseAll() {
// //       setOpen(false);
// //     }
// //     window.addEventListener("rowActionMenu:closeAll", onCloseAll);
// //     return () => window.removeEventListener("rowActionMenu:closeAll", onCloseAll);
// //   }, []);

// //   // Portal menu node — note: style will be fixed and computed above
// //   const portalMenuNode = (
// //     <div
// //       ref={menuRef}
// //       data-action-menu
// //       role="menu"
// //       aria-label="Row actions"
// //       style={menuStyle ? { ...menuStyle, zIndex: 9999 } : initialOffscreenStyle}
// //       className={`rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] ${menuWidthClass}`}
// //     >
// //       {children ? (
// //         <div>{children}</div>
// //       ) : (
// //         <div>
// //           {onEdit && (
// //             <button
// //               onClick={() => {
// //                 setOpen(false);
// //                 setTimeout(() => { try { onEdit(); } catch {} }, 0);
// //               }}
// //               className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-t-lg border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
// //             >
// //               <Image src="/dashboardIcons/edit.svg" alt="Edit" width={18} height={18} className="mr-2" />
// //               Edit
// //             </button>
// //           )}
// //           {onDelete && (
// //             <button
// //               onClick={() => {
// //                 setOpen(false);
// //                 setTimeout(() => { try { onDelete(); } catch {} }, 0);
// //               }}
// //               className={`flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 ${onEdit ? "rounded-b-lg" : "rounded-t-lg"}`}
// //             >
// //               <Image src="/dashboardIcons/trash.svg" alt="Delete" width={18} height={18} className="mr-2" />
// //               Delete
// //             </button>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );

// //   return (
// //     <>
// //       {/* wrapper lives inside the row and is only used as the measurement anchor */}
// //       <div className={`relative inline-block ${wrapperClassName}`} ref={wrapperRef}>
// //         <button
// //           ref={buttonRef}
// //           onMouseDown={(e) => e.preventDefault()}
// //           onKeyDown={(e) => {
// //             if (e.key === "Enter" || e.key === " ") {
// //               e.preventDefault();
// //               setOpen((s) => !s);
// //             }
// //           }}
// //           onClick={() => setOpen((s) => !s)}
// //           className="p-1 rounded"
// //           aria-haspopup="true"
// //           aria-expanded={open}
// //           aria-label={ariaLabel}
// //         >
// //           <PiDotsThreeOutline size={24} />
// //         </button>
// //       </div>

// //       {/* portal into body so it sits above the table and won't affect table flow */}
// //       {typeof document !== "undefined" && open ? createPortal(portalMenuNode, document.body) : null}
// //     </>
// //   );
// // }

// // // flip up and no scroll
// // // // src/app/(dashboard)/dashboard/components/RowActionMenu.tsx
// // // "use client";
// // // import React, {
// // //   useRef,
// // //   useState,
// // //   useEffect,
// // //   useLayoutEffect,
// // //   CSSProperties,
// // // } from "react";
// // // import { createPortal } from "react-dom";
// // // import Image from "next/image";
// // // import { PiDotsThreeOutline } from "react-icons/pi";

// // // type Props = {
// // //   onEdit?: () => void;
// // //   onDelete?: () => void;
// // //   ariaLabel?: string;
// // //   menuWidthClass?: string;
// // //   wrapperClassName?: string;
// // //   children?: React.ReactNode;
// // // };

// // // export function closeAllRowActionMenus() {
// // //   if (typeof window !== "undefined") {
// // //     window.dispatchEvent(new Event("rowActionMenu:closeAll"));
// // //   }
// // // }

// // // /**
// // //  * Portal + fixed positioning + flipping (no internal scrollbar).
// // //  * - Menu is portalled into document.body and positioned `fixed` with viewport coordinates.
// // //  * - Prefer below the row; if it doesn't fit, try above; if neither fits fully,
// // //  *   clamp the vertical position so the menu sits within the viewport (no overflow:auto).
// // //  * - Align menu's right edge with the row's right edge (like `right: 0`).
// // //  * - Recomputes on scroll/resize and observes DOM mutations so the portal follows the row.
// // //  */
// // // export default function RowActionMenu({
// // //   onEdit,
// // //   onDelete,
// // //   ariaLabel = "More actions",
// // //   menuWidthClass = "w-44 max-w-[175px]",
// // //   wrapperClassName = "",
// // //   children,
// // // }: Props) {
// // //   const wrapperRef = useRef<HTMLDivElement | null>(null); // row anchor for measuring
// // //   const menuRef = useRef<HTMLDivElement | null>(null); // portal node
// // //   const buttonRef = useRef<HTMLButtonElement | null>(null);
// // //   const scrollParentsRef = useRef<(Window | Element)[] | null>(null);
// // //   const mutationObserverRef = useRef<MutationObserver | null>(null);
// // //   const rafRef = useRef<number | null>(null);

// // //   const [open, setOpen] = useState(false);
// // //   const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);

// // //   const initialOffscreenStyle: CSSProperties = {
// // //     position: "fixed",
// // //     top: "-9999px",
// // //     left: "-9999px",
// // //     visibility: "hidden",
// // //     zIndex: 9999,
// // //   };

// // //   const getScrollParents = (node: Element | null): (Window | Element)[] => {
// // //     const result: (Window | Element)[] = [];
// // //     if (!node) return [window];
// // //     let el: Element | null = node;
// // //     const overflowRegex = /(auto|scroll|overlay)/;
// // //     while (el) {
// // //       try {
// // //         const style = getComputedStyle(el);
// // //         if (
// // //           overflowRegex.test(style.overflow + style.overflowY + style.overflowX) ||
// // //           el.scrollHeight > el.clientHeight ||
// // //           el.scrollWidth > el.clientWidth
// // //         ) {
// // //           result.push(el);
// // //         }
// // //       } catch {
// // //         // ignore cross-origin/inaccessible nodes
// // //       }
// // //       el = el.parentElement;
// // //     }
// // //     result.push(window);
// // //     return result;
// // //   };

// // //   const computeAndSetPosition = () => {
// // //     const anchor = wrapperRef.current;
// // //     const menu = menuRef.current;
// // //     if (!anchor || !menu) return;

// // //     const anchorRect = anchor.getBoundingClientRect(); // client coords
// // //     const menuRect = menu.getBoundingClientRect(); // client coords

// // //     const spacing = 8;
// // //     const viewportW = window.innerWidth;
// // //     const viewportH = window.innerHeight;

// // //     // Compute horizontal: align right edge of menu to right edge of anchor
// // //     let left = Math.round(anchorRect.right - menuRect.width);
// // //     // clamp to not go off-screen left beyond 8px
// // //     left = Math.max(8, left);
// // //     // also clamp to not overflow right side
// // //     if (left + menuRect.width > viewportW - 8) {
// // //       left = Math.max(8, viewportW - 8 - menuRect.width);
// // //     }

// // //     // Vertical: prefer BELOW
// // //     const belowTop = Math.round(anchorRect.bottom + spacing);
// // //     const belowBottom = belowTop + menuRect.height;

// // //     // try below
// // //     if (belowBottom <= viewportH - 8) {
// // //       // fully fits below
// // //       setMenuStyle({
// // //         position: "fixed",
// // //         top: `${belowTop}px`,
// // //         left: `${left}px`,
// // //         zIndex: 9999,
// // //         visibility: "visible",
// // //       });
// // //       return;
// // //     }

// // //     // try above
// // //     const aboveTop = Math.round(anchorRect.top - spacing - menuRect.height);
// // //     if (aboveTop >= 8) {
// // //       // fully fits above
// // //       setMenuStyle({
// // //         position: "fixed",
// // //         top: `${aboveTop}px`,
// // //         left: `${left}px`,
// // //         zIndex: 9999,
// // //         visibility: "visible",
// // //       });
// // //       return;
// // //     }

// // //     // neither fully fits. Clamp so menu sits inside viewport as much as possible
// // //     // We'll prefer to keep menu as low as possible (so it visually points to row),
// // //     // but ensure top is at least 8 and bottom is at most viewportH - 8.
// // //     let clampedTop = belowTop;
// // //     if (clampedTop + menuRect.height > viewportH - 8) {
// // //       clampedTop = Math.max(8, viewportH - 8 - menuRect.height);
// // //     }
// // //     // if clampedTop is still > anchorRect.top (rare), it's fine — we don't add internal scroll.
// // //     setMenuStyle({
// // //       position: "fixed",
// // //       top: `${Math.round(clampedTop)}px`,
// // //       left: `${left}px`,
// // //       zIndex: 9999,
// // //       visibility: "visible",
// // //     });
// // //   };

// // //   const scheduleRecompute = () => {
// // //     if (rafRef.current) cancelAnimationFrame(rafRef.current);
// // //     rafRef.current = requestAnimationFrame(() => {
// // //       computeAndSetPosition();
// // //       rafRef.current = null;
// // //     });
// // //   };

// // //   useLayoutEffect(() => {
// // //     if (!open) {
// // //       setMenuStyle(null);
// // //       if (rafRef.current) {
// // //         cancelAnimationFrame(rafRef.current);
// // //         rafRef.current = null;
// // //       }
// // //       return;
// // //     }

// // //     // measure once the menu exists
// // //     rafRef.current = requestAnimationFrame(() => {
// // //       computeAndSetPosition();
// // //       rafRef.current = null;
// // //       try {
// // //         buttonRef.current?.focus({ preventScroll: true });
// // //       } catch {
// // //         try { buttonRef.current?.focus(); } catch {}
// // //       }
// // //     });

// // //     const parents = getScrollParents(wrapperRef.current);
// // //     scrollParentsRef.current = parents;

// // //     const handler = () => scheduleRecompute();
// // //     parents.forEach((p) => {
// // //       try { (p as any).addEventListener("scroll", handler, { passive: true }); } catch {}
// // //     });
// // //     window.addEventListener("resize", handler);

// // //     const mo = new MutationObserver(() => scheduleRecompute());
// // //     mutationObserverRef.current = mo;
// // //     mo.observe(document.body, { childList: true, subtree: true, attributes: true });

// // //     return () => {
// // //       parents.forEach((p) => {
// // //         try { (p as any).removeEventListener("scroll", handler); } catch {}
// // //       });
// // //       window.removeEventListener("resize", handler);
// // //       if (mutationObserverRef.current) {
// // //         try { mutationObserverRef.current.disconnect(); } catch {}
// // //         mutationObserverRef.current = null;
// // //       }
// // //       if (rafRef.current) {
// // //         cancelAnimationFrame(rafRef.current);
// // //         rafRef.current = null;
// // //       }
// // //       scrollParentsRef.current = null;
// // //     };
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [open]);

// // //   // Close on outside click / Escape
// // //   useEffect(() => {
// // //     function onDocClick(e: MouseEvent) {
// // //       const t = e.target as Node | null;
// // //       const insideAnchor = wrapperRef.current?.contains(t ?? null);
// // //       const insideMenu = menuRef.current?.contains(t ?? null);
// // //       if (!insideAnchor && !insideMenu) setOpen(false);
// // //     }
// // //     function onDocKey(e: KeyboardEvent) {
// // //       if (e.key === "Escape") setOpen(false);
// // //     }
// // //     if (open) {
// // //       document.addEventListener("mousedown", onDocClick);
// // //       document.addEventListener("keydown", onDocKey);
// // //     }
// // //     return () => {
// // //       document.removeEventListener("mousedown", onDocClick);
// // //       document.removeEventListener("keydown", onDocKey);
// // //     };
// // //   }, [open]);

// // //   // auto-close when modal/dialog appears (unchanged)
// // //   useEffect(() => {
// // //     if (typeof document === "undefined") return;
// // //     const mightBeModal = (node: Node | null): boolean => {
// // //       if (!node) return false;
// // //       if (node.nodeType !== Node.ELEMENT_NODE) return false;
// // //       const el = node as Element;
// // //       const selectors =
// // //         '[role="dialog"], [data-modal], .modal, .react-modal, .headlessui-modal, [data-headlessui-modal], [data-reach-dialog]';
// // //       try { if (el.matches && el.matches(selectors)) return true; } catch {}
// // //       try { if (el.querySelector && el.querySelector(selectors)) return true; } catch {}
// // //       return false;
// // //     };

// // //     const observer = new MutationObserver((mutations) => {
// // //       if (!open) return;
// // //       for (const m of mutations) {
// // //         if (m.addedNodes && m.addedNodes.length) {
// // //           for (const n of Array.from(m.addedNodes)) {
// // //             if (mightBeModal(n)) { setOpen(false); return; }
// // //           }
// // //         }
// // //         if (m.type === "attributes" && m.target && mightBeModal(m.target)) {
// // //           setOpen(false);
// // //           return;
// // //         }
// // //       }
// // //     });

// // //     observer.observe(document.body, {
// // //       childList: true,
// // //       subtree: true,
// // //       attributes: true,
// // //     });

// // //     return () => observer.disconnect();
// // //   }, [open]);

// // //   // programmatic close
// // //   useEffect(() => {
// // //     function onCloseAll() {
// // //       setOpen(false);
// // //     }
// // //     window.addEventListener("rowActionMenu:closeAll", onCloseAll);
// // //     return () => window.removeEventListener("rowActionMenu:closeAll", onCloseAll);
// // //   }, []);

// // //   const portalMenuNode = (
// // //     <div
// // //       ref={menuRef}
// // //       data-action-menu
// // //       role="menu"
// // //       aria-label="Row actions"
// // //       style={menuStyle ? { ...menuStyle, zIndex: 9999 } : initialOffscreenStyle}
// // //       className={`rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] ${menuWidthClass}`}
// // //     >
// // //       {children ? (
// // //         <div>{children}</div>
// // //       ) : (
// // //         <div>
// // //           {onEdit && (
// // //             <button
// // //               onClick={() => {
// // //                 setOpen(false);
// // //                 setTimeout(() => { try { onEdit(); } catch {} }, 0);
// // //               }}
// // //               className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 rounded-t-lg border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
// // //             >
// // //               <Image src="/dashboardIcons/edit.svg" alt="Edit" width={18} height={18} className="mr-2" />
// // //               Edit
// // //             </button>
// // //           )}
// // //           {onDelete && (
// // //             <button
// // //               onClick={() => {
// // //                 setOpen(false);
// // //                 setTimeout(() => { try { onDelete(); } catch {} }, 0);
// // //               }}
// // //               className={`flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 ${onEdit ? "rounded-b-lg" : "rounded-t-lg"}`}
// // //             >
// // //               <Image src="/dashboardIcons/trash.svg" alt="Delete" width={18} height={18} className="mr-2" />
// // //               Delete
// // //             </button>
// // //           )}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );

// // //   return (
// // //     <>
// // //       {/* wrapper lives in-row and is only used as the measurement anchor */}
// // //       <div className={`relative inline-block ${wrapperClassName}`} ref={wrapperRef}>
// // //         <button
// // //           ref={buttonRef}
// // //           onMouseDown={(e) => e.preventDefault()}
// // //           onKeyDown={(e) => {
// // //             if (e.key === "Enter" || e.key === " ") {
// // //               e.preventDefault();
// // //               setOpen((s) => !s);
// // //             }
// // //           }}
// // //           onClick={() => setOpen((s) => !s)}
// // //           className="p-1 rounded"
// // //           aria-haspopup="true"
// // //           aria-expanded={open}
// // //           aria-label={ariaLabel}
// // //         >
// // //           <PiDotsThreeOutline size={24} />
// // //         </button>
// // //       </div>

// // //       {/* portal into body so menu sits above table and does not affect layout */}
// // //       {typeof document !== "undefined" && open ? createPortal(portalMenuNode, document.body) : null}
// // //     </>
// // //   );
// // // }

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
//   id?: string | number;
//   onOpen?: () => void;
//   onClose?: () => void;
//   onEdit?: () => void;
//   onDelete?: () => void;
//   ariaLabel?: string;
//   menuWidthClass?: string;
//   wrapperClassName?: string;
//   children?: React.ReactNode;
// };

// export function closeAllRowActionMenus() {
//   if (typeof window !== "undefined") {
//     window.dispatchEvent(new Event("rowActionMenu:closeAll"));
//   }
// }

// export default function RowActionMenu({
//   id,
//   onOpen,
//   onClose,
//   onEdit,
//   onDelete,
//   ariaLabel = "More actions",
//   menuWidthClass = "w-44 max-w-[175px]",
//   wrapperClassName = "",
//   children,
// }: Props) {
//   const wrapperRef = useRef<HTMLDivElement | null>(null);
//   const menuRef = useRef<HTMLDivElement | null>(null);
//   const buttonRef = useRef<HTMLButtonElement | null>(null);
//   const scrollParentsRef = useRef<(Window | Element)[] | null>(null);
//   const mutationObserverRef = useRef<MutationObserver | null>(null);
//   const rafRef = useRef<number | null>(null);

//   const [open, setOpen] = useState(false);
//   const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);

//   const initialOffscreenStyle: CSSProperties = {
//     position: "fixed",
//     top: "-9999px",
//     left: "-9999px",
//     visibility: "hidden",
//     zIndex: 9999,
//   };

//   const getScrollParents = (node: Element | null): (Window | Element)[] => {
//     const result: (Window | Element)[] = [];
//     if (!node) return [window];
//     let el: Element | null = node;
//     const overflowRegex = /(auto|scroll|overlay)/;
//     while (el) {
//       try {
//         const style = getComputedStyle(el);
//         if (
//           overflowRegex.test(style.overflow + style.overflowY + style.overflowX) ||
//           el.scrollHeight > el.clientHeight ||
//           el.scrollWidth > el.clientWidth
//         ) {
//           result.push(el);
//         }
//       } catch {
//         // ignore
//       }
//       el = el.parentElement;
//     }
//     result.push(window);
//     return result;
//   };

//   /**
//    * Updated compute & set position
//    * - Prefer below
//    * - If below overflows, try above
//    * - If neither fully fits, clamp vertically so the menu becomes visible
//    * - Only if menuHeight > viewportHeight - 16px do we set maxHeight + overflow:auto
//    */
//   const computeAndSetPosition = () => {
//     const anchor = wrapperRef.current;
//     const menu = menuRef.current;
//     if (!anchor || !menu) return;

//     const anchorRect = anchor.getBoundingClientRect(); // client coords
//     const menuRect = menu.getBoundingClientRect(); // client coords

//     const spacing = -10; // your chosen vertical offset
//     const viewportW = window.innerWidth;
//     const viewportH = window.innerHeight;
//     const margin = 8; // safe viewport margin

//     // Horizontal: align right edge of menu to right edge of anchor
//     let left = Math.round(anchorRect.right - menuRect.width);
//     left = Math.max(margin, left);
//     if (left + menuRect.width > viewportW - margin) {
//       left = Math.max(margin, viewportW - margin - menuRect.width);
//     }

//     // 1) Try placing **below**
//     const belowTop = Math.round(anchorRect.bottom + spacing);
//     const belowBottom = belowTop + menuRect.height;

//     if (belowBottom <= viewportH - margin) {
//       // fully fits below
//       setMenuStyle({
//         position: "fixed",
//         top: `${belowTop}px`,
//         left: `${left}px`,
//         zIndex: 9999,
//         visibility: "visible",
//       });
//       return;
//     }

//     // 2) Try placing **above**
//     const aboveTop = Math.round(anchorRect.top - spacing - menuRect.height);
//     if (aboveTop >= margin) {
//       // fully fits above
//       setMenuStyle({
//         position: "fixed",
//         top: `${aboveTop}px`,
//         left: `${left}px`,
//         zIndex: 9999,
//         visibility: "visible",
//       });
//       return;
//     }

//     // 3) Neither fully fits. We'll attempt to clamp so the menu is as visible as possible:
//     // prefer to keep it visually below (so it still looks attached), but move it up enough
//     // so its bottom hits viewportH - margin. This avoids clipping.
//     // Compute desired top = belowTop, but if that causes overflow, shift it up.
//     let clampedTop = belowTop;
//     if (clampedTop + menuRect.height > viewportH - margin) {
//       clampedTop = Math.max(margin, viewportH - margin - menuRect.height);
//     }
//     // If menu is still taller than viewport (menuRect.height > viewportH - 2*margin)
//     // we cannot fit it fully. In that extreme case we set maxHeight + internal scroll.
//     const availableHeight = viewportH - margin * 2;
//     if (menuRect.height > availableHeight) {
//       setMenuStyle({
//         position: "fixed",
//         top: `${margin}px`, // pin to top margin
//         left: `${left}px`,
//         zIndex: 9999,
//         visibility: "visible",
//         maxHeight: `${availableHeight}px`,
//         overflow: "auto",
//       });
//       return;
//     }

//     // otherwise set clamped top so menu becomes fully visible
//     setMenuStyle({
//       position: "fixed",
//       top: `${Math.round(clampedTop)}px`,
//       left: `${left}px`,
//       zIndex: 9999,
//       visibility: "visible",
//     });
//   };

//   const scheduleRecompute = () => {
//     if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     rafRef.current = requestAnimationFrame(() => {
//       computeAndSetPosition();
//       rafRef.current = null;
//     });
//   };

//   const toggleMenu = () => {
//     if (!open) {
//       closeAllRowActionMenus();
//       setOpen(true);
//       if (onOpen) onOpen();
//     } else {
//       setOpen(false);
//       if (onClose) onClose();
//     }
//   };

//   useLayoutEffect(() => {
//     if (!open) {
//       setMenuStyle(null);
//       if (rafRef.current) {
//         cancelAnimationFrame(rafRef.current);
//         rafRef.current = null;
//       }
//       return;
//     }

//     rafRef.current = requestAnimationFrame(() => {
//       computeAndSetPosition();
//       rafRef.current = null;
//       try {
//         buttonRef.current?.focus({ preventScroll: true });
//       } catch {
//         try {
//           buttonRef.current?.focus();
//         } catch {}
//       }
//     });

//     const parents = getScrollParents(wrapperRef.current);
//     scrollParentsRef.current = parents;
//     const handler = () => scheduleRecompute();
//     parents.forEach((p) => {
//       try {
//         (p as any).addEventListener("scroll", handler, { passive: true });
//       } catch {}
//     });
//     window.addEventListener("resize", handler);

//     const mo = new MutationObserver(() => scheduleRecompute());
//     mutationObserverRef.current = mo;
//     mo.observe(document.body, { childList: true, subtree: true, attributes: true });

//     return () => {
//       parents.forEach((p) => {
//         try {
//           (p as any).removeEventListener("scroll", handler);
//         } catch {}
//       });
//       window.removeEventListener("resize", handler);
//       if (mutationObserverRef.current) {
//         try {
//           mutationObserverRef.current.disconnect();
//         } catch {}
//         mutationObserverRef.current = null;
//       }
//       if (rafRef.current) {
//         cancelAnimationFrame(rafRef.current);
//         rafRef.current = null;
//       }
//       scrollParentsRef.current = null;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open]);

//   useEffect(() => {
//     function onDocClick(e: MouseEvent) {
//       const t = e.target as Node | null;
//       const insideAnchor = wrapperRef.current?.contains(t ?? null);
//       const insideMenu = menuRef.current?.contains(t ?? null);
//       if (!insideAnchor && !insideMenu) {
//         setOpen(false);
//         if (onClose) onClose();
//       }
//     }
//     function onDocKey(e: KeyboardEvent) {
//       if (e.key === "Escape") {
//         setOpen(false);
//         if (onClose) onClose();
//       }
//     }
//     if (open) {
//       document.addEventListener("mousedown", onDocClick);
//       document.addEventListener("keydown", onDocKey);
//     }
//     return () => {
//       document.removeEventListener("mousedown", onDocClick);
//       document.removeEventListener("keydown", onDocKey);
//     };
//   }, [open, onClose]);

//   useEffect(() => {
//     if (typeof document === "undefined") return;
//     const mightBeModal = (node: Node | null): boolean => {
//       if (!node) return false;
//       if (node.nodeType !== Node.ELEMENT_NODE) return false;
//       const el = node as Element;
//       const selectors =
//         '[role="dialog"], [data-modal], .modal, .react-modal, .headlessui-modal, [data-headlessui-modal], [data-reach-dialog]';
//       try { if (el.matches && el.matches(selectors)) return true; } catch {}
//       try { if (el.querySelector && el.querySelector(selectors)) return true; } catch {}
//       return false;
//     };

//     const observer = new MutationObserver((mutations) => {
//       if (!open) return;
//       for (const m of mutations) {
//         if (m.addedNodes && m.addedNodes.length) {
//           for (const n of Array.from(m.addedNodes)) {
//             if (mightBeModal(n)) { setOpen(false); if (onClose) onClose(); return; }
//           }
//         }
//         if (m.type === "attributes" && m.target && mightBeModal(m.target)) {
//           setOpen(false);
//           if (onClose) onClose();
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
//   }, [open, onClose]);

//   useEffect(() => {
//     function onCloseAll() {
//       if (open) {
//         setOpen(false);
//         if (onClose) onClose();
//       }
//     }
//     window.addEventListener("rowActionMenu:closeAll", onCloseAll);
//     return () => window.removeEventListener("rowActionMenu:closeAll", onCloseAll);
//   }, [open, onClose]);

//   const portalMenuNode = (
//     <div
//       ref={menuRef}
//       data-action-menu
//       {...(id !== undefined ? { "data-row": String(id) } : {})}
//       role="menu"
//       aria-label={ariaLabel}
//       style={menuStyle ? { ...menuStyle, zIndex: 9999 } : initialOffscreenStyle}
//       className={`rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] ${menuWidthClass}`}
//     >
//       {children ? (
//         <div>{children}</div>
//       ) : (
//         <div>
//           {onEdit && (
//             <button
//               onClick={() => {
//                 setOpen(false);
//                 if (onClose) onClose();
//                 setTimeout(() => { try { onEdit(); } catch {} }, 0);
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
//                 if (onClose) onClose();
//                 setTimeout(() => { try { onDelete(); } catch {} }, 0);
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
//           ref={buttonRef}
//           onMouseDown={(e) => e.preventDefault()}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" || e.key === " ") {
//               e.preventDefault();
//               toggleMenu();
//             }
//           }}
//           onClick={() => toggleMenu()}
//           className="p-1 rounded"
//           aria-haspopup="true"
//           aria-expanded={open}
//           aria-label={ariaLabel}
//         >
//           <PiDotsThreeOutline size={24} />
//         </button>
//       </div>

//       {typeof document !== "undefined" && open ? createPortal(portalMenuNode, document.body) : null}
//     </>
//   );
// }







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
  id?: string | number;
  onOpen?: () => void;
  onClose?: () => void;
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
  id,
  onOpen,
  onClose,
  onEdit,
  onDelete,
  ariaLabel = "More actions",
  menuWidthClass = "w-44 max-w-[175px]",
  wrapperClassName = "",
  children,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const scrollParentsRef = useRef<(Window | Element)[] | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);
  const rafRef = useRef<number | null>(null);

  // remember the initial placement chosen when the menu first opened
  // possible values: 'below' | 'above' | 'clamped'
  const initialPlacementRef = useRef<"below" | "above" | "clamped" | null>(
    null
  );

  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);

  const initialOffscreenStyle: CSSProperties = {
    position: "fixed",
    top: "-9999px",
    left: "-9999px",
    visibility: "hidden",
    zIndex: 9999,
  };

  const getScrollParents = (node: Element | null): (Window | Element)[] => {
    const result: (Window | Element)[] = [];
    if (!node) return [window];
    let el: Element | null = node;
    const overflowRegex = /(auto|scroll|overlay)/;
    while (el) {
      try {
        const style = getComputedStyle(el);
        if (
          overflowRegex.test(
            style.overflow + style.overflowY + style.overflowX
          ) ||
          el.scrollHeight > el.clientHeight ||
          el.scrollWidth > el.clientWidth
        ) {
          result.push(el);
        }
      } catch {
        // ignore
      }
      el = el.parentElement;
    }
    result.push(window);
    return result;
  };

  /**
   * computeAndSetPosition
   *
   * Behavior:
   * - On the *first* call after `open`, choose a placement:
   *     prefer below -> if fits use 'below'
   *     else if above fits use 'above'
   *     else if menu > viewport set 'clamped' (and give maxHeight)
   *     else choose 'clamped' position
   *   and store that choice in initialPlacementRef.
   *
   * - On subsequent calls while open (scroll/resize), DO NOT flip sides:
   *   keep the stored side and recompute coordinates accordingly (follow the row).
   *   For 'below'/'above' we follow the anchor exactly (no vertical clamp) so the
   *   menu isn't pinned/stuck at the viewport edge — it will move with the row.
   *
   * - 'clamped' still ensures visibility by clamping into viewport and only sets
   *   maxHeight + overflow if the menu is taller than viewport.
   */
  const computeAndSetPosition = () => {
    const anchor = wrapperRef.current;
    const menu = menuRef.current;
    if (!anchor || !menu) return;

    const anchorRect = anchor.getBoundingClientRect(); // client coords
    const menuRect = menu.getBoundingClientRect(); // client coords

    const spacing = -10; // vertical offset
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const margin = 8; // safe viewport margin

    // Horizontal: align right edge of menu to right edge of anchor (clamped)
    let left = Math.round(anchorRect.right - menuRect.width);
    left = Math.max(margin, left);
    if (left + menuRect.width > viewportW - margin) {
      left = Math.max(margin, viewportW - margin - menuRect.width);
    }

    // Candidate positions
    const belowTop = Math.round(anchorRect.bottom + spacing);
    const aboveTop = Math.round(anchorRect.top - spacing - menuRect.height);
    const belowFits = belowTop + menuRect.height <= viewportH - margin;
    const aboveFits = aboveTop >= margin;
    const availableHeight = viewportH - margin * 2;

    // Decide placement on first run after open
    if (!initialPlacementRef.current) {
      if (belowFits) {
        initialPlacementRef.current = "below";
      } else if (aboveFits) {
        initialPlacementRef.current = "above";
      } else if (menuRect.height > availableHeight) {
        initialPlacementRef.current = "clamped";
      } else {
        initialPlacementRef.current = "clamped";
      }
    }

    const p = initialPlacementRef.current;

    // If 'below' was chosen initially, follow the anchor exactly (no vertical clamp)
    if (p === "below") {
      const top = belowTop; // follow anchor bottom + spacing
      setMenuStyle({
        position: "fixed",
        top: `${Math.round(top)}px`,
        left: `${left}px`,
        zIndex: 9999,
        visibility: "visible",
      });
      return;
    }

    // If 'above' was chosen initially, follow the anchor exactly (no vertical clamp)
    if (p === "above") {
      const top = aboveTop;
      setMenuStyle({
        position: "fixed",
        top: `${Math.round(top)}px`,
        left: `${left}px`,
        zIndex: 9999,
        visibility: "visible",
      });
      return;
    }

    // 'clamped' placement — try to keep it visible
    let clampedTop = belowTop;
    if (clampedTop + menuRect.height > viewportH - margin) {
      clampedTop = Math.max(margin, viewportH - margin - menuRect.height);
    }
    if (menuRect.height > availableHeight) {
      setMenuStyle({
        position: "fixed",
        top: `${margin}px`,
        left: `${left}px`,
        zIndex: 9999,
        visibility: "visible",
        maxHeight: `${availableHeight}px`,
        overflow: "auto",
      });
      return;
    }
    setMenuStyle({
      position: "fixed",
      top: `${Math.round(clampedTop)}px`,
      left: `${left}px`,
      zIndex: 9999,
      visibility: "visible",
    });
  };

  const scheduleRecompute = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      computeAndSetPosition();
      rafRef.current = null;
    });
  };

  const toggleMenu = () => {
    if (!open) {
      initialPlacementRef.current = null; // clear lock before opening
      closeAllRowActionMenus();
      setOpen(true);
      if (onOpen) onOpen();
    } else {
      setOpen(false);
      if (onClose) onClose();
      initialPlacementRef.current = null;
    }
  };

  useLayoutEffect(() => {
    if (!open) {
      setMenuStyle(null);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    rafRef.current = requestAnimationFrame(() => {
      computeAndSetPosition();
      rafRef.current = null;
      try {
        buttonRef.current?.focus({ preventScroll: true });
      } catch {
        try {
          buttonRef.current?.focus();
        } catch {}
      }
    });

    const parents = getScrollParents(wrapperRef.current);
    scrollParentsRef.current = parents;
    const handler = () => scheduleRecompute();
    parents.forEach((p) => {
      try {
        (p as any).addEventListener("scroll", handler, { passive: true });
      } catch {}
    });
    window.addEventListener("resize", handler);

    const mo = new MutationObserver(() => scheduleRecompute());
    mutationObserverRef.current = mo;
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      parents.forEach((p) => {
        try {
          (p as any).removeEventListener("scroll", handler);
        } catch {}
      });
      window.removeEventListener("resize", handler);
      if (mutationObserverRef.current) {
        try {
          mutationObserverRef.current.disconnect();
        } catch {}
        mutationObserverRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      scrollParentsRef.current = null;
      initialPlacementRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node | null;
      const insideAnchor = wrapperRef.current?.contains(t ?? null);
      const insideMenu = menuRef.current?.contains(t ?? null);
      if (!insideAnchor && !insideMenu) {
        setOpen(false);
        if (onClose) onClose();
        initialPlacementRef.current = null;
      }
    }
    function onDocKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        if (onClose) onClose();
        initialPlacementRef.current = null;
      }
    }
    if (open) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onDocKey);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onDocKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const mightBeModal = (node: Node | null): boolean => {
      if (!node) return false;
      if (node.nodeType !== Node.ELEMENT_NODE) return false;
      const el = node as Element;
      const selectors =
        '[role="dialog"], [data-modal], .modal, .react-modal, .headlessui-modal, [data-headlessui-modal], [data-reach-dialog]';
      try {
        if (el.matches && el.matches(selectors)) return true;
      } catch {}
      try {
        if (el.querySelector && el.querySelector(selectors)) return true;
      } catch {}
      return false;
    };

    const observer = new MutationObserver((mutations) => {
      if (!open) return;
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length) {
          for (const n of Array.from(m.addedNodes)) {
            if (mightBeModal(n)) {
              setOpen(false);
              if (onClose) onClose();
              initialPlacementRef.current = null;
              return;
            }
          }
        }
        if (m.type === "attributes" && m.target && mightBeModal(m.target)) {
          setOpen(false);
          if (onClose) onClose();
          initialPlacementRef.current = null;
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
  }, [open, onClose]);

  useEffect(() => {
    function onCloseAll() {
      if (open) {
        setOpen(false);
        if (onClose) onClose();
        initialPlacementRef.current = null;
      }
    }
    window.addEventListener("rowActionMenu:closeAll", onCloseAll);
    return () =>
      window.removeEventListener("rowActionMenu:closeAll", onCloseAll);
  }, [open, onClose]);

  const portalMenuNode = (
    <div
      ref={menuRef}
      data-action-menu
      {...(id !== undefined ? { "data-row": String(id) } : {})}
      role="menu"
      aria-label={ariaLabel}
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
                if (onClose) onClose();
                setTimeout(() => {
                  try {
                    onEdit();
                  } catch {}
                }, 0);
                initialPlacementRef.current = null;
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
                if (onClose) onClose();
                setTimeout(() => {
                  try {
                    onDelete();
                  } catch {}
                }, 0);
                initialPlacementRef.current = null;
              }}
              className={`flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 hover:bg-gray-100 ${
                onEdit ? "rounded-b-lg" : "rounded-t-lg"
              }`}
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
  );

  return (
    <>
      <div
        className={`relative inline-block ${wrapperClassName}`}
        ref={wrapperRef}
      >
        <button
          ref={buttonRef}
          onMouseDown={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleMenu();
            }
          }}
          onClick={() => toggleMenu()}
          className="p-1 rounded"
          aria-haspopup="true"
          aria-expanded={open}
          aria-label={ariaLabel}
        >
          <PiDotsThreeOutline size={24} />
        </button>
      </div>

      {typeof document !== "undefined" && open
        ? createPortal(portalMenuNode, document.body)
        : null}
    </>
  );
}
