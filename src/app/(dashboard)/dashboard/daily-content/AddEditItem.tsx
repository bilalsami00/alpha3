// // boken into component
// // src\app\(dashboard)\dashboard\daily-content\AddEditItem.tsx

// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import ReactDOM from "react-dom";
// import Image from "next/image";
// import SharedCalendar, { parseLocalISO, toLocalISO } from "./SharedCalendar";

// type Entry = { uid: string; text: string; scheduleDate: string | null };
// const CLOSE_ALL_CALENDARS_EVENT = "dashboard:closeAllCalendars";

// export default function AddEditItem({
//   initial,
//   onCancel,
//   onSave,
//   label = "Quote",
//   mode = "add",
//   compact = false,
// }: {
//   initial: { text: string; scheduleDate: string } | null;
//   onCancel: () => void;
//   onSave: (payload: {
//     text: string;
//     scheduleDate: string;
//   }) => Promise<any> | any;
//   label?: string;
//   mode?: "add" | "edit";
//   compact?: boolean;
// }) {
//   const DEFAULT_MAX = compact ? 40 : 150;
//   const [text, setText] = useState(initial?.text ?? "");
//   const [date, setDate] = useState<string | null>(
//     initial?.scheduleDate ?? null
//   );
//   const [saving, setSaving] = useState(false);

//   const [entries, setEntries] = useState<Entry[]>(
//     initial && mode === "add"
//       ? [
//           {
//             uid: String(Date.now()),
//             text: initial.text,
//             scheduleDate: initial.scheduleDate,
//           },
//         ]
//       : []
//   );

//   const [animateUid, setAnimateUid] = useState<string | null>(null);
//   const [activeIndex, setActiveIndex] = useState(0);

//   const [calendarOpen, setCalendarOpen] = useState(false);
//   const [calendarPos, setCalendarPos] = useState<{
//     left: number;
//     top: number;
//   } | null>(null);
//   const calendarTriggerRef = useRef<HTMLButtonElement | null>(null);
//   const calendarPortalRef = useRef<HTMLDivElement | null>(null);

//   // refs used to control scrolling + focus behavior
//   const scrollContainerRef = useRef<HTMLDivElement | null>(null);
//   const mainInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
//     null
//   );

//   const MAX_CHARS = DEFAULT_MAX;

//   useEffect(() => {
//     if (mode === "edit" && initial) {
//       setText(initial.text);
//       setDate(initial.scheduleDate);
//     }
//   }, [mode, initial]);

//   useEffect(() => {
//     function handlePointerDown(e: PointerEvent) {
//       const target = e.target as Node;
//       if (
//         (calendarPortalRef.current &&
//           calendarPortalRef.current.contains(target)) ||
//         (calendarTriggerRef.current &&
//           calendarTriggerRef.current.contains(target))
//       ) {
//         return;
//       }
//       if (calendarOpen) {
//         setCalendarOpen(false);
//         setCalendarPos(null);
//       }
//     }
//     function handleGlobalClose() {
//       if (calendarOpen) {
//         setCalendarOpen(false);
//         setCalendarPos(null);
//       }
//     }
//     function handleEsc(e: KeyboardEvent) {
//       if (e.key === "Escape" && calendarOpen) {
//         setCalendarOpen(false);
//         setCalendarPos(null);
//       }
//     }

//     document.addEventListener("pointerdown", handlePointerDown);
//     document.addEventListener(CLOSE_ALL_CALENDARS_EVENT, handleGlobalClose);
//     document.addEventListener("keydown", handleEsc);
//     return () => {
//       document.removeEventListener("pointerdown", handlePointerDown);
//       document.removeEventListener(
//         CLOSE_ALL_CALENDARS_EVENT,
//         handleGlobalClose
//       );
//       document.removeEventListener("keydown", handleEsc);
//     };
//   }, [calendarOpen]);

//   const openCalendar = () => {
//     if (typeof document !== "undefined")
//       document.dispatchEvent(new CustomEvent(CLOSE_ALL_CALENDARS_EVENT));

//     const trigger = calendarTriggerRef.current;
//     const CAL_W = 306;
//     if (!trigger) {
//       setCalendarOpen(true);
//       setCalendarPos(null);
//       return;
//     }
//     const rect = trigger.getBoundingClientRect();
//     let left = rect.right - CAL_W;
//     if (left < 8) left = rect.left;
//     const viewportW = window.innerWidth;
//     if (left + CAL_W + 8 > viewportW) left = Math.max(8, viewportW - CAL_W - 8);
//     const top = rect.bottom + 8;
//     setCalendarPos({ left, top });
//     setCalendarOpen(true);
//   };

//   // NEW helper: temporarily disable smooth scroll so adjustments happen instantly
//   function ensureInstantScroll(container: Element | null, fn: () => void) {
//     if (!container) {
//       fn();
//       return;
//     }
//     const el = container as HTMLElement;
//     const prev = el.style.scrollBehavior;
//     try {
//       el.style.scrollBehavior = "auto";
//       fn();
//     } finally {
//       // restore shortly after to avoid interfering with future smooth scrolls
//       window.setTimeout(() => {
//         el.style.scrollBehavior = prev || "";
//       }, 60);
//     }
//   }

//   // NOTE: We intentionally do NOT scroll the parent drawer here.
//   // We also intentionally do NOT add the delta to scrollTop (that would move the view down).
//   // We preserve the exact previous scrollTop so the UI never jumps down.
//   const handleAddAnother = () => {
//     if (!date || !text.trim()) return;
//     const uid = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
//     const newEntry: Entry = {
//       uid,
//       text: text.trim().slice(0, MAX_CHARS),
//       scheduleDate: date,
//     };

//     // capture scroll metrics of our container before DOM changes
//     const container = scrollContainerRef.current;
//     const prevScrollTop = container ? container.scrollTop : 0;
//     // const prevScrollHeight = container ? container.scrollHeight : 0; // not used intentionally

//     // insert at top
//     setEntries((prev) => [newEntry, ...prev]);

//     setAnimateUid(uid);
//     setText("");
//     setDate(null);
//     setActiveIndex(0);
//     window.setTimeout(() => setAnimateUid(null), 420);

//     // after DOM update: ensure we keep the exact previous scrollTop (no downward jump)
//     requestAnimationFrame(() => {
//       requestAnimationFrame(() => {
//         if (container) {
//           ensureInstantScroll(container, () => {
//             // keep exact previous scrollTop — do not add height delta
//             container.scrollTop = prevScrollTop;
//           });
//         }

//         // focus back to main input WITHOUT scrolling the page (preventScroll)
//         try {
//           (mainInputRef.current as any)?.focus?.({ preventScroll: true });
//         } catch {
//           try {
//             mainInputRef.current?.focus?.();
//           } catch {}
//         }

//         // After animation completes, adjust again (still keep same previous scrollTop)
//         setTimeout(() => {
//           if (container) {
//             ensureInstantScroll(container, () => {
//               container.scrollTop = prevScrollTop;
//             });
//           }
//           try {
//             (mainInputRef.current as any)?.focus?.({ preventScroll: true });
//           } catch {}
//         }, 480); // slightly longer than card animation
//       });
//     });
//   };

//   const handleRemoveEntry = (uid: string) => {
//     setEntries((prev) => {
//       const next = prev.filter((e) => e.uid !== uid);
//       if (activeIndex >= next.length)
//         setActiveIndex(Math.max(0, next.length - 1));
//       return next;
//     });
//   };

//   const updateEntry = (uid: string, patch: Partial<Omit<Entry, "uid">>) => {
//     setEntries((prev) =>
//       prev.map((e) => (e.uid === uid ? { ...e, ...patch } : e))
//     );
//   };

//   async function handleSave() {
//     const current: Entry | null =
//       text.trim() !== "" && date
//         ? {
//             uid: `${Date.now()}`,
//             text: text.trim().slice(0, MAX_CHARS),
//             scheduleDate: date,
//           }
//         : null;
//     const all = entries.slice();
//     if (current) all.unshift(current);

//     if (mode === "edit") {
//       const single = current ?? {
//         uid: `${Date.now()}`,
//         text: text.trim().slice(0, MAX_CHARS),
//         scheduleDate: date ?? "",
//       };
//       if (!single.text || !single.scheduleDate) return;
//       try {
//         setSaving(true);
//         await onSave({ text: single.text, scheduleDate: single.scheduleDate! });
//       } finally {
//         setSaving(false);
//       }
//       return;
//     }

//     const valid = all.filter((e) => e.text.trim() !== "" && e.scheduleDate);
//     if (valid.length === 0) return;
//     try {
//       setSaving(true);
//       for (const e of valid) {
//         await onSave({ text: e.text, scheduleDate: e.scheduleDate! });
//       }
//     } finally {
//       setSaving(false);
//     }
//   }

//   const canPrev = entries.length > 0 && activeIndex < entries.length - 1;
//   const canNext = entries.length > 0 && activeIndex > 0;
//   const goPrev = () =>
//     setActiveIndex((i) => Math.min(entries.length - 1, i + 1));
//   const goNext = () => setActiveIndex((i) => Math.max(0, i - 1));

//   const CARD_WIDTH = 420;
//   const GAP = 16;
//   const sliderTranslateX = activeIndex * (CARD_WIDTH + GAP);

//   // determine if "Add another" should be disabled (date OR text missing)
//   const addAnotherDisabled = !date || !text.trim();

//   return (
//     // <div className="max-w-[486px] max-xl:h-[450px] max-2xl:max-h-[600px] rounded-xl bg-white overflow-hidden flex flex-col custom-scroll">
//     <div className="max-w-[486px] max-2xl:max-h-[500px] rounded-xl bg-white overflow-hidden flex flex-col custom-scroll">
//       <style>{`@keyframes slideIn { 0% { opacity: 0; transform: translateX(40px) translateY(-6px) scale(.995); } 60% { opacity: 1; transform: translateX(-8px) translateY(2px) scale(1.01); } 100% { opacity: 1; transform: translateX(0) translateY(0) scale(1); } }`}</style>

//       <div className="flex items-center justify-between p-4 border-b border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
//         <h3 className="txt-24 font-medium">
//           {mode === "edit" ? `Edit ${label}` : `Add ${label}`}
//         </h3>
//         <button onClick={onCancel} aria-label="Close">
//           <Image
//             src="/dashboardIcons/CloseButton.svg"
//             alt="Close"
//             width={32}
//             height={32}
//             style={{ opacity: 1 }}
//           />
//         </button>
//       </div>

//       {/* SCROLLABLE MIDDLE */}
//       <div
//         ref={scrollContainerRef}
//         className="p-6 overflow-auto min-h-0 flex-1 scroller"
//       >
//         <div className="mb-4">
//           <div className="txt-14 font-medium mb-2">Schedule Date</div>
//           <div className="relative">
//             <button
//               ref={calendarTriggerRef}
//               onClick={() => {
//                 if (!calendarOpen) openCalendar();
//                 else {
//                   setCalendarOpen(false);
//                   setCalendarPos(null);
//                 }
//               }}
//               className="w-full max-h-[56px] text-left p-5 rounded bg-[#F2F5F6] flex items-center justify-between foust:outline-none focus:green"
//               aria-haspopup="dialog"
//               aria-expanded={calendarOpen}
//             >
//               <span
//                 className={`txt-12 ${
//                   date ? "text-[#111827]" : "text-[#9CA3AF]"
//                 }`}
//               >
//                 {date
//                   ? (() => {
//                       const dt = parseLocalISO(date);
//                       if (!dt) return date;
//                       return `${dt.getDate()}-${dt.getMonth() + 1}-${String(
//                         dt.getFullYear()
//                       ).slice(-2)}`;
//                     })()
//                   : "Select date"}
//               </span>
//               <Image
//                 src="/dashboardIcons/DailyContent/calendar.svg"
//                 alt="calendar"
//                 width={24}
//                 height={24}
//               />
//             </button>

//             {calendarOpen &&
//               typeof document !== "undefined" &&
//               ReactDOM.createPortal(
//                 <div
//                   ref={calendarPortalRef}
//                   className="z-50"
//                   style={{
//                     position: "fixed",
//                     left: calendarPos ? calendarPos.left : undefined,
//                     top: calendarPos ? calendarPos.top : undefined,
//                   }}
//                 >
//                   <SharedCalendar
//                     selected={date}
//                     onSelect={(iso) => {
//                       setDate(iso);
//                       setCalendarOpen(false);
//                       setCalendarPos(null);
//                     }}
//                     editableHeader
//                   />
//                 </div>,
//                 document.body
//               )}
//           </div>
//         </div>

//         <div className="mb-2">
//           <div className="txt-14 font-medium mb-2">{label}</div>

//           {/* main input/textarea has ref so we can refocus it without scrolling */}
//           {compact ? (
//             <input
//               ref={mainInputRef as any}
//               value={text}
//               onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
//               className="w-full px-3 txt-12 rounded-lg mb-0 bg-[#F2F5F6] focus:outline-none focus-green  h-14"
//               placeholder={`Add ${label} (Max ${MAX_CHARS} characters)`}
//             />
//           ) : (
//             <textarea
//               ref={mainInputRef as any}
//               value={text}
//               onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
//               rows={4}
//               maxLength={MAX_CHARS}
//               className="w-full p-3 txt-12 rounded-lg mb-0 resize-none bg-[#F2F5F6] focus:outline-none focus-green  h-24"
//               placeholder={`Add ${label} (Max ${MAX_CHARS} characters)`}
//             />
//           )}
//         </div>

//         <div className="flex items-center justify-end">
//           {mode === "add" && (
//             <button
//               onClick={() => {
//                 if (addAnotherDisabled) return;
//                 handleAddAnother();
//               }}
//               disabled={addAnotherDisabled}
//               aria-disabled={addAnotherDisabled}
//               className={`text-[#111827] font-medium flex items-center gap-2 mt-3 ${
//                 addAnotherDisabled ? "opacity-40 cursor-not-allowed" : ""
//               }`}
//             >
//               <span className="text-2xl leading-none">+</span>{" "}
//               <span className="txt-14">Add another</span>
//             </button>
//           )}
//         </div>

//         {entries.length > 0 && (
//           <div className="mt-6  pt-4">
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center gap-2 justify-end w-full">
//                 <button
//                   onClick={goNext}
//                   disabled={!canNext}
//                   className="p-1.75 rounded-full border border-[var(--Neutral-Grey-10,#E9EDEE)] disabled:opacity-40 disabled:cursor-not-allowed"
//                   aria-label="previous entry"
//                 >
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                     <path
//                       d="M15 18l-6-6 6-6"
//                       stroke="#6B7280"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </button>
//                 <button
//                   onClick={goPrev}
//                   disabled={!canPrev}
//                   className="p-1.75 rounded-full border border-[var(--Neutral-Grey-10,#E9EDEE)] disabled:opacity-40 disabled:cursor-not-allowed"
//                   aria-label="next entry"
//                 >
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                     <path
//                       d="M9 6l6 6-6 6"
//                       stroke="#6B7280"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             <div
//               style={{ width: CARD_WIDTH }}
//               className="overflow-hidden mx-auto"
//             >
//               <div
//                 className="flex gap-4 transition-transform duration-300"
//                 style={{ transform: `translateX(-${sliderTranslateX}px)` }}
//               >
//                 {entries.map((e) => (
//                   <div key={e.uid} className="flex-shrink-0">
//                     <PreviewCardMemo
//                       e={e}
//                       animateUid={animateUid}
//                       onRemove={() => handleRemoveEntry(e.uid)}
//                       onUpdate={(patch) => updateEntry(e.uid, patch)}
//                       label={label}
//                       maxChars={MAX_CHARS}
//                       compact={compact}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="flex items-center justify-end gap-4 bg-[#F2F5F6] px-6 py-4 border-t border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
//         <button
//           onClick={onCancel}
//           className="w-25 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-white border border-[color:var(--Neutral-Grey-10,#E9EDEE)]"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleSave}
//           disabled={
//             saving ||
//             (mode === "edit"
//               ? !(text.trim() && date)
//               : entries.length === 0 && !(text.trim() && date))
//           }
//           className="min-w-25 max-w-36 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-[#0E0E0E] text-white disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {saving
//             ? mode === "edit"
//               ? "Saving…"
//               : "Adding…"
//             : mode === "edit"
//             ? "Save Changes"
//             : `Add`}
//         </button>
//       </div>
//     </div>
//   );
// }

// function PreviewCard({
//   e,
//   animateUid,
//   onRemove,
//   onUpdate,
//   label,
//   maxChars,
//   compact,
// }: {
//   e: Entry;
//   animateUid: string | null;
//   onRemove: () => void;
//   onUpdate: (patch: Partial<Omit<Entry, "uid">>) => void;
//   label: string;
//   maxChars: number;
//   compact?: boolean;
// }) {
//   const isAnimating = animateUid === e.uid;
//   const [cardCalendarOpen, setCardCalendarOpen] = useState(false);
//   const [cardCalendarPos, setCardCalendarPos] = useState<{
//     left: number;
//     top: number;
//   } | null>(null);

//   const wrapperRef = useRef<HTMLDivElement | null>(null);
//   const cardPortalRef = useRef<HTMLDivElement | null>(null);
//   const taRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

//   useEffect(() => {
//     function handlePointerDown(ev: PointerEvent) {
//       const target = ev.target as Node;
//       if (
//         (cardPortalRef.current && cardPortalRef.current.contains(target)) ||
//         (wrapperRef.current && wrapperRef.current.contains(target))
//       ) {
//         return;
//       }
//       if (cardCalendarOpen) {
//         setCardCalendarOpen(false);
//         setCardCalendarPos(null);
//       }
//     }
//     function handleGlobalClose() {
//       if (cardCalendarOpen) {
//         setCardCalendarOpen(false);
//         setCardCalendarPos(null);
//       }
//     }
//     document.addEventListener("pointerdown", handlePointerDown);
//     document.addEventListener(CLOSE_ALL_CALENDARS_EVENT, handleGlobalClose);
//     return () => {
//       document.removeEventListener("pointerdown", handlePointerDown);
//       document.removeEventListener(
//         CLOSE_ALL_CALENDARS_EVENT,
//         handleGlobalClose
//       );
//     };
//   }, [cardCalendarOpen]);

//   const openCardCalendar = () => {
//     if (typeof document !== "undefined")
//       document.dispatchEvent(new CustomEvent(CLOSE_ALL_CALENDARS_EVENT));

//     const trigger = wrapperRef.current;
//     const CAL_W = 306;
//     if (!trigger) {
//       setCardCalendarOpen(true);
//       setCardCalendarPos(null);
//       return;
//     }
//     const rect = trigger.getBoundingClientRect();
//     let left = rect.right - CAL_W;
//     if (left < 8) left = rect.left;
//     const viewportW = window.innerWidth;
//     if (left + CAL_W + 8 > viewportW) left = Math.max(8, viewportW - CAL_W - 8);
//     const top = rect.bottom + 8;
//     setCardCalendarPos({ left, top });
//     setCardCalendarOpen(true);
//   };

//   // NOTE: removed auto-focus on card's textarea to avoid browser auto-scrolling when a card mounts/updates

//   return (
//     <div
//       className="bg-white rounded-lg p-3 border w-full border-[var(--Neutral-Grey-10,#E9EDEE)]"
//       style={{
//         width: 420,
//         ...(isAnimating
//           ? { animation: "slideIn 380ms cubic-bezier(.2,.9,.25,1)" }
//           : {}),
//       }}
//     >
//       <div className="flex mb-2 flex-col-reverse w-full">
//         <div>
//           <div className="text-sm font-medium">Schedule Date</div>

//           <div
//             ref={wrapperRef}
//             role="button"
//             tabIndex={0}
//             onClick={() => {
//               if (!cardCalendarOpen) openCardCalendar();
//               else {
//                 setCardCalendarOpen(false);
//                 setCardCalendarPos(null);
//               }
//             }}
//             onKeyDown={(ev) => {
//               if (
//                 ev.key === "Enter" ||
//                 ev.key === " " ||
//                 ev.key === "ArrowDown"
//               ) {
//                 ev.preventDefault();
//                 if (!cardCalendarOpen) openCardCalendar();
//               }
//             }}
//             className="mt-2 w-full relative"
//             aria-haspopup="dialog"
//             aria-expanded={cardCalendarOpen}
//           >
//             <div className="bg-[#F2F5F6] p-3 rounded flex items-center justify-between w-full">
//               <div className="txt-12 font-medium">
//                 {e.scheduleDate
//                   ? (() => {
//                       const dt = parseLocalISO(e.scheduleDate);
//                       if (!dt) return e.scheduleDate;
//                       return `${dt.getDate()}-${dt.getMonth() + 1}-${String(
//                         dt.getFullYear()
//                       ).slice(-2)}`;
//                     })()
//                   : "Select date"}
//               </div>

//               <div className="ml-2" aria-hidden>
//                 <span className="p-1 rounded inline-flex items-center justify-center">
//                   <Image
//                     src="/dashboardIcons/DailyContent/calendar.svg"
//                     alt=""
//                     width={24}
//                     height={24}
//                   />
//                 </span>
//               </div>
//             </div>

//             {cardCalendarOpen &&
//               typeof document !== "undefined" &&
//               ReactDOM.createPortal(
//                 <div
//                   ref={cardPortalRef}
//                   style={{
//                     position: "fixed",
//                     left: cardCalendarPos ? cardCalendarPos.left : undefined,
//                     top: cardCalendarPos ? cardCalendarPos.top : undefined,
//                     zIndex: 9999,
//                   }}
//                 >
//                   <SharedCalendar
//                     selected={e.scheduleDate}
//                     onSelect={(iso) => {
//                       onUpdate({ scheduleDate: iso });
//                       setCardCalendarOpen(false);
//                       setCardCalendarPos(null);
//                     }}
//                   />
//                 </div>,
//                 document.body
//               )}
//           </div>
//         </div>

//         <div className="flex justify-end gap-2">
//           <button
//             onClick={onRemove}
//             className="p-1 rounded hover:bg-neutral-100"
//             aria-label="Delete"
//           >
//             <Image
//               src="/dashboardIcons/DailyContent/trash-black.svg"
//               alt="Delete"
//               width={24}
//               height={24}
//             />
//           </button>
//         </div>
//       </div>

//       <div className="mt-3">
//         <div className="text-sm font-medium mb-1">{label}</div>

//         {compact ? (
//           <input
//             ref={taRef as any}
//             value={e.text}
//             onChange={(ev) =>
//               onUpdate({ text: ev.target.value.slice(0, maxChars) })
//             }
//             className="w-full px-3 txt-12 rounded-lg mb-0 bg-[#F2F5F6] focus:outline-none focus-green h-14"
//             placeholder={`Add ${label} (Max ${maxChars} characters)`}
//           />
//         ) : (
//           <textarea
//             ref={taRef as any}
//             value={e.text}
//             onChange={(ev) =>
//               onUpdate({ text: ev.target.value.slice(0, maxChars) })
//             }
//             rows={4}
//             maxLength={maxChars}
//             className="w-full p-3 txt-12 rounded-lg mb-0 resize-none bg-[#F2F5F6] focus:outline-none focus-green h-24"
//             placeholder={`Add ${label} (Max ${maxChars} characters)`}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// const PreviewCardMemo = React.memo(PreviewCard);













// src/app/(dashboard)/dashboard/daily-content/AddEditItem.tsx
"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import SharedCalendar, { parseLocalISO, toLocalISO } from "./SharedCalendar";

type Entry = { uid: string; text: string; scheduleDate: string | null };
const CLOSE_ALL_CALENDARS_EVENT = "dashboard:closeAllCalendars";

export default function AddEditItem({
  initial,
  onCancel,
  onSave,
  label = "Quote",
  mode = "add",
  compact = false,
}: {
  initial: { text: string; scheduleDate: string } | null;
  onCancel: () => void;
  onSave: (payload: {
    text: string;
    scheduleDate: string;
  }) => Promise<any> | any;
  label?: string;
  mode?: "add" | "edit";
  compact?: boolean;
}) {
  const DEFAULT_MAX = compact ? 40 : 150;
  const [text, setText] = useState(initial?.text ?? "");
  const [date, setDate] = useState<string | null>(initial?.scheduleDate ?? null);
  const [saving, setSaving] = useState(false);

  const [entries, setEntries] = useState<Entry[]>(
    initial && mode === "add"
      ? [
          {
            uid: String(Date.now()),
            text: initial.text,
            scheduleDate: initial.scheduleDate,
          },
        ]
      : []
  );

  const [animateUid, setAnimateUid] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarPos, setCalendarPos] = useState<{ left: number; top: number } | null>(null);
  const calendarTriggerRef = useRef<HTMLButtonElement | null>(null);
  const calendarPortalRef = useRef<HTMLDivElement | null>(null);

  // refs used to control scrolling + focus behavior
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const mainInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // carousel measurement refs
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardOuterRef = useRef<HTMLDivElement | null>(null);
  const [cardWidth, setCardWidth] = useState<number>(420);
  const GAP = 16;

  const MAX_CHARS = DEFAULT_MAX;

  useEffect(() => {
    if (mode === "edit" && initial) {
      setText(initial.text);
      setDate(initial.scheduleDate);
    }
  }, [mode, initial]);

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (
        (calendarPortalRef.current && calendarPortalRef.current.contains(target)) ||
        (calendarTriggerRef.current && calendarTriggerRef.current.contains(target))
      ) {
        return;
      }
      if (calendarOpen) {
        setCalendarOpen(false);
        setCalendarPos(null);
      }
    }
    function handleGlobalClose() {
      if (calendarOpen) {
        setCalendarOpen(false);
        setCalendarPos(null);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape" && calendarOpen) {
        setCalendarOpen(false);
        setCalendarPos(null);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener(CLOSE_ALL_CALENDARS_EVENT, handleGlobalClose);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener(CLOSE_ALL_CALENDARS_EVENT, handleGlobalClose);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [calendarOpen]);

  const openCalendar = () => {
    if (typeof document !== "undefined")
      document.dispatchEvent(new CustomEvent(CLOSE_ALL_CALENDARS_EVENT));

    const trigger = calendarTriggerRef.current;
    const CAL_W = 306;
    if (!trigger) {
      setCalendarOpen(true);
      setCalendarPos(null);
      return;
    }
    const rect = trigger.getBoundingClientRect();
    let left = rect.right - CAL_W;
    if (left < 8) left = rect.left;
    const viewportW = window.innerWidth;
    if (left + CAL_W + 8 > viewportW) left = Math.max(8, viewportW - CAL_W - 8);
    const top = rect.bottom + 8;
    setCalendarPos({ left, top });
    setCalendarOpen(true);
  };

  // NEW helper: temporarily disable smooth scroll so adjustments happen instantly
  function ensureInstantScroll(container: Element | null, fn: () => void) {
    if (!container) {
      fn();
      return;
    }
    const el = container as HTMLElement;
    const prev = el.style.scrollBehavior;
    try {
      el.style.scrollBehavior = "auto";
      fn();
    } finally {
      // restore shortly after to avoid interfering with future smooth scrolls
      window.setTimeout(() => {
        el.style.scrollBehavior = prev || "";
      }, 60);
    }
  }

  // NOTE: We intentionally do NOT scroll the parent drawer here.
  // We also intentionally do NOT add the delta to scrollTop (that would move the view down).
  // We preserve the exact previous scrollTop so the UI never jumps down.
  const handleAddAnother = () => {
    if (!date || !text.trim()) return;
    const uid = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const newEntry: Entry = {
      uid,
      text: text.trim().slice(0, MAX_CHARS),
      scheduleDate: date,
    };

    // capture scroll metrics of our container before DOM changes
    const container = scrollContainerRef.current;
    const prevScrollTop = container ? container.scrollTop : 0;

    // insert at top
    setEntries((prev) => [newEntry, ...prev]);

    setAnimateUid(uid);
    setText("");
    setDate(null);
    setActiveIndex(0);
    window.setTimeout(() => setAnimateUid(null), 420);

    // after DOM update: ensure we keep the exact previous scrollTop (no downward jump)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (container) {
          ensureInstantScroll(container, () => {
            // keep exact previous scrollTop — do not add height delta
            container.scrollTop = prevScrollTop;
          });
        }

        // focus back to main input WITHOUT scrolling the page (preventScroll)
        try {
          (mainInputRef.current as any)?.focus?.({ preventScroll: true });
        } catch {
          try {
            mainInputRef.current?.focus?.();
          } catch {}
        }

        // After animation completes, adjust again (still keep same previous scrollTop)
        setTimeout(() => {
          if (container) {
            ensureInstantScroll(container, () => {
              container.scrollTop = prevScrollTop;
            });
          }
          try {
            (mainInputRef.current as any)?.focus?.({ preventScroll: true });
          } catch {}
        }, 480); // slightly longer than card animation
      });
    });
  };

  const handleRemoveEntry = (uid: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.uid !== uid);
      if (activeIndex >= next.length) setActiveIndex(Math.max(0, next.length - 1));
      return next;
    });
  };

  const updateEntry = (uid: string, patch: Partial<Omit<Entry, "uid">>) => {
    setEntries((prev) => prev.map((e) => (e.uid === uid ? { ...e, ...patch } : e)));
  };

  async function handleSave() {
    const current: Entry | null =
      text.trim() !== "" && date
        ? {
            uid: `${Date.now()}`,
            text: text.trim().slice(0, MAX_CHARS),
            scheduleDate: date,
          }
        : null;
    const all = entries.slice();
    if (current) all.unshift(current);

    if (mode === "edit") {
      const single = current ?? {
        uid: `${Date.now()}`,
        text: text.trim().slice(0, MAX_CHARS),
        scheduleDate: date ?? "",
      };
      if (!single.text || !single.scheduleDate) return;
      try {
        setSaving(true);
        await onSave({ text: single.text, scheduleDate: single.scheduleDate! });
      } finally {
        setSaving(false);
      }
      return;
    }

    const valid = all.filter((e) => e.text.trim() !== "" && e.scheduleDate);
    if (valid.length === 0) return;
    try {
      setSaving(true);
      for (const e of valid) {
        await onSave({ text: e.text, scheduleDate: e.scheduleDate! });
      }
    } finally {
      setSaving(false);
    }
  }

  const canPrev = entries.length > 0 && activeIndex < entries.length - 1;
  const canNext = entries.length > 0 && activeIndex > 0;
  const goPrev = () => setActiveIndex((i) => Math.min(entries.length - 1, i + 1));
  const goNext = () => setActiveIndex((i) => Math.max(0, i - 1));

  // compute slider translate using measured card width (keeps carousel pixel-perfect)
  const sliderTranslateX = activeIndex * (cardWidth + GAP);

  // measure card width responsively
  useLayoutEffect(() => {
    function measure() {
      // prefer measuring the actual card wrapper width (if present)
      const outer = cardOuterRef.current;
      if (outer) {
        // card width should not exceed 420 (desktop card) but on narrow screens use container width
        const available = outer.clientWidth;
        const computed = Math.min(420, available);
        setCardWidth(computed);
        return;
      }

      // fallback: use track container width or window width
      const track = trackRef.current;
      if (track) {
        const available = track.clientWidth;
        setCardWidth(Math.min(420, available));
        return;
      }

      // fallback to window
      setCardWidth(Math.min(420, typeof window !== "undefined" ? window.innerWidth - 48 : 420));
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [entries.length]);

  const addAnotherDisabled = !date || !text.trim();

  return (
    <div
    //  className="w-full max-w-[560px] h-auto max-xl:max-h-[470px] xl:h-full rounded-xl bg-white overflow-hidden flex flex-col custom-scroll"
           className="w-full rounded-xl bg-white overflow-hidden flex flex-col custom-scroll" style={{ maxHeight: "calc(100vh - 48px)" }}
>
      <style>{`@keyframes slideIn { 0% { opacity: 0; transform: translateX(40px) translateY(-6px) scale(.995); } 60% { opacity: 1; transform: translateX(-8px) translateY(2px) scale(1.01); } 100% { opacity: 1; transform: translateX(0) translateY(0) scale(1); } }`}</style>

      <div className="flex items-center justify-between p-4 border-b border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
        <h3 className="txt-24 font-medium">{mode === "edit" ? `Edit ${label}` : `Add ${label}`}</h3>
        <button onClick={onCancel} aria-label="Close">
          <Image src="/dashboardIcons/CloseButton.svg" alt="Close" width={32} height={32} style={{ opacity: 1 }} />
        </button>
      </div>

      {/* SCROLLABLE MIDDLE */}
      <div ref={scrollContainerRef} className="p-4 sm:p-6 overflow-auto min-h-0 flex-1 scroller min-w-0">
        <div className="mb-4">
          <div className="txt-14 font-medium mb-2">Schedule Date</div>
          <div className="relative">
            <button
              ref={calendarTriggerRef}
              onClick={() => {
                if (!calendarOpen) openCalendar();
                else {
                  setCalendarOpen(false);
                  setCalendarPos(null);
                }
              }}
              className="w-full max-h-[56px] text-left p-5 rounded bg-[#F2F5F6] flex items-center justify-between foust:outline-none focus:green"
              aria-haspopup="dialog"
              aria-expanded={calendarOpen}
            >
              <span className={`txt-12 ${date ? "text-[#111827]" : "text-[#9CA3AF]"}`}>
                {date
                  ? (() => {
                      const dt = parseLocalISO(date);
                      if (!dt) return date;
                      return `${dt.getDate()}-${dt.getMonth() + 1}-${String(dt.getFullYear()).slice(-2)}`;
                    })()
                  : "Select date"}
              </span>
              <Image src="/dashboardIcons/DailyContent/calendar.svg" alt="calendar" width={24} height={24} />
            </button>

            {calendarOpen &&
              typeof document !== "undefined" &&
              ReactDOM.createPortal(
                <div
                  ref={calendarPortalRef}
                  className="z-50"
                  style={{
                    position: "fixed",
                    left: calendarPos ? calendarPos.left : undefined,
                    top: calendarPos ? calendarPos.top : undefined,
                  }}
                >
                  <SharedCalendar
                    selected={date}
                    onSelect={(iso) => {
                      setDate(iso);
                      setCalendarOpen(false);
                      setCalendarPos(null);
                    }}
                    editableHeader
                  />
                </div>,
                document.body
              )}
          </div>
        </div>

        <div className="mb-2">
          <div className="txt-14 font-medium mb-2">{label}</div>

          {/* main input/textarea has ref so we can refocus it without scrolling */}
          {compact ? (
            <input
              ref={mainInputRef as any}
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
              className="w-full px-3 txt-12 rounded-lg mb-0 bg-[#F2F5F6] focus:outline-none focus-green h-14"
              placeholder={`Add ${label} (Max ${MAX_CHARS} characters)`}
            />
          ) : (
            <textarea
              ref={mainInputRef as any}
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
              rows={4}
              maxLength={MAX_CHARS}
              className="w-full p-3 txt-12 rounded-lg mb-0 resize-none bg-[#F2F5F6] focus:outline-none focus-green h-24"
              placeholder={`Add ${label} (Max ${MAX_CHARS} characters)`}
            />
          )}
        </div>

        <div className="flex items-center justify-end">
          {mode === "add" && (
            <button
              onClick={() => {
                if (addAnotherDisabled) return;
                handleAddAnother();
              }}
              disabled={addAnotherDisabled}
              aria-disabled={addAnotherDisabled}
              className={`text-[#111827] font-medium flex items-center gap-2 mt-3 ${addAnotherDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <span className="text-2xl leading-none">+</span> <span className="txt-14">Add another</span>
            </button>
          )}
        </div>

        {entries.length > 0 && (
          <div className="mt-6 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 justify-end w-full">
                <button
                  onClick={goNext}
                  disabled={!canNext}
                  className="p-1.75 rounded-full border border-[var(--Neutral-Grey-10,#E9EDEE)] disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="previous entry"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={goPrev}
                  disabled={!canPrev}
                  className="p-1.75 rounded-full border border-[var(--Neutral-Grey-10,#E9EDEE)] disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="next entry"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6l6 6-6 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* WRAPPER: full width but clip overflow */}
            <div className="overflow-hidden mx-auto w-full" ref={cardOuterRef}>
              <div
                ref={trackRef}
                className="flex gap-4 transition-transform duration-300 min-w-0"
                style={{ transform: `translateX(-${sliderTranslateX}px)` }}
              >
                {entries.map((e) => (
                  // each child now responsive: full width on mobile, fixed on sm+
                  <div key={e.uid} className="flex-shrink-0 w-full">
                    <PreviewCardMemo
                      e={e}
                      animateUid={animateUid}
                      onRemove={() => handleRemoveEntry(e.uid)}
                      onUpdate={(patch) => updateEntry(e.uid, patch)}
                      label={label}
                      maxChars={MAX_CHARS}
                      compact={compact}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-4 bg-[#F2F5F6] px-6 py-4 border-t border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
        <button onClick={onCancel} className="w-25 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-white border border-[color:var(--Neutral-Grey-10,#E9EDEE)]">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={
            saving ||
            (mode === "edit" ? !(text.trim() && date) : entries.length === 0 && !(text.trim() && date))
          }
          className="min-w-25 max-w-36 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-[#0E0E0E] text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (mode === "edit" ? "Saving…" : "Adding…") : mode === "edit" ? "Save Changes" : `Add`}
        </button>
      </div>
    </div>
  );
}

function PreviewCard({
  e,
  animateUid,
  onRemove,
  onUpdate,
  label,
  maxChars,
  compact,
}: {
  e: Entry;
  animateUid: string | null;
  onRemove: () => void;
  onUpdate: (patch: Partial<Omit<Entry, "uid">>) => void;
  label: string;
  maxChars: number;
  compact?: boolean;
}) {
  const isAnimating = animateUid === e.uid;
  const [cardCalendarOpen, setCardCalendarOpen] = useState(false);
  const [cardCalendarPos, setCardCalendarPos] = useState<{ left: number; top: number } | null>(null);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const cardPortalRef = useRef<HTMLDivElement | null>(null);
  const taRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    function handlePointerDown(ev: PointerEvent) {
      const target = ev.target as Node;
      if ((cardPortalRef.current && cardPortalRef.current.contains(target)) || (wrapperRef.current && wrapperRef.current.contains(target))) {
        return;
      }
      if (cardCalendarOpen) {
        setCardCalendarOpen(false);
        setCardCalendarPos(null);
      }
    }
    function handleGlobalClose() {
      if (cardCalendarOpen) {
        setCardCalendarOpen(false);
        setCardCalendarPos(null);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener(CLOSE_ALL_CALENDARS_EVENT, handleGlobalClose);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener(CLOSE_ALL_CALENDARS_EVENT, handleGlobalClose);
    };
  }, [cardCalendarOpen]);

  const openCardCalendar = () => {
    if (typeof document !== "undefined") document.dispatchEvent(new CustomEvent(CLOSE_ALL_CALENDARS_EVENT));

    const trigger = wrapperRef.current;
    const CAL_W = 306;
    if (!trigger) {
      setCardCalendarOpen(true);
      setCardCalendarPos(null);
      return;
    }
    const rect = trigger.getBoundingClientRect();
    let left = rect.right - CAL_W;
    if (left < 8) left = rect.left;
    const viewportW = window.innerWidth;
    if (left + CAL_W + 8 > viewportW) left = Math.max(8, viewportW - CAL_W - 8);
    const top = rect.bottom + 8;
    setCardCalendarPos({ left, top });
    setCardCalendarOpen(true);
  };

  return (
    <div
      className={`bg-white rounded-lg p-3 border w-full  border-[var(--Neutral-Grey-10,#E9EDEE)]`}
      style={isAnimating ? { animation: "slideIn 380ms cubic-bezier(.2,.9,.25,1)" } : {}}
    >
      <div className="flex mb-2 flex-col-reverse w-full">
        <div>
          <div className="text-sm font-medium">Schedule Date</div>

          <div
            ref={wrapperRef}
            role="button"
            tabIndex={0}
            onClick={() => {
              if (!cardCalendarOpen) openCardCalendar();
              else {
                setCardCalendarOpen(false);
                setCardCalendarPos(null);
              }
            }}
            onKeyDown={(ev) => {
              if (ev.key === "Enter" || ev.key === " " || ev.key === "ArrowDown") {
                ev.preventDefault();
                if (!cardCalendarOpen) openCardCalendar();
              }
            }}
            className="mt-2 w-full relative"
            aria-haspopup="dialog"
            aria-expanded={cardCalendarOpen}
          >
            <div className="bg-[#F2F5F6] p-3 rounded flex items-center justify-between w-full">
              <div className="txt-12 font-medium">
                {e.scheduleDate
                  ? (() => {
                      const dt = parseLocalISO(e.scheduleDate);
                      if (!dt) return e.scheduleDate;
                      return `${dt.getDate()}-${dt.getMonth() + 1}-${String(dt.getFullYear()).slice(-2)}`;
                    })()
                  : "Select date"}
              </div>

              <div className="ml-2" aria-hidden>
                <span className="p-1 rounded inline-flex items-center justify-center">
                  <Image src="/dashboardIcons/DailyContent/calendar.svg" alt="" width={24} height={24} />
                </span>
              </div>
            </div>

            {cardCalendarOpen &&
              typeof document !== "undefined" &&
              ReactDOM.createPortal(
                <div
                  ref={cardPortalRef}
                  style={{
                    position: "fixed",
                    left: cardCalendarPos ? cardCalendarPos.left : undefined,
                    top: cardCalendarPos ? cardCalendarPos.top : undefined,
                    zIndex: 9999,
                  }}
                >
                  <SharedCalendar
                    selected={e.scheduleDate}
                    onSelect={(iso) => {
                      onUpdate({ scheduleDate: iso });
                      setCardCalendarOpen(false);
                      setCardCalendarPos(null);
                    }}
                  />
                </div>,
                document.body
              )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onRemove} className="p-1 rounded hover:bg-neutral-100" aria-label="Delete">
            <Image src="/dashboardIcons/DailyContent/trash-black.svg" alt="Delete" width={24} height={24} />
          </button>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-sm font-medium mb-1">{label}</div>

        {compact ? (
          <input
            ref={taRef as any}
            value={e.text}
            onChange={(ev) => onUpdate({ text: ev.target.value.slice(0, maxChars) })}
            className="w-full px-3 txt-12 rounded-lg mb-0 bg-[#F2F5F6] focus:outline-none focus-green h-14"
            placeholder={`Add ${label} (Max ${maxChars} characters)`}
          />
        ) : (
          <textarea
            ref={taRef as any}
            value={e.text}
            onChange={(ev) => onUpdate({ text: ev.target.value.slice(0, maxChars) })}
            rows={4}
            maxLength={maxChars}
            className="w-full p-3 txt-12 rounded-lg mb-0 resize-none bg-[#F2F5F6] focus:outline-none focus-green h-24"
            placeholder={`Add ${label} (Max ${maxChars} characters)`}
          />
        )}
      </div>
    </div>
  );
}

const PreviewCardMemo = React.memo(PreviewCard);
