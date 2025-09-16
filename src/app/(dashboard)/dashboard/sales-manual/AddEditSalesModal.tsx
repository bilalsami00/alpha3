// // // src\app\(dashboard)\dashboard\sales-manual\AddEditSalesModal.tsx
// // "use client";
// // import React, { useEffect, useRef, useState } from "react";
// // import InlineSelect from "../components/InlineSelect";
// // import BaseModal from "../components/BaseModal";
// // import Image from "next/image";
// // import { SALES_CATEGORIES } from "./salesdata";

// // type ChecklistEntry = {
// //   uid: string;
// //   category: string | null;
// //   task: string;
// // };

// // type Props = {
// //   open: boolean;
// //   mode?: "add" | "edit";
// //   type: "repsChecklist" | "fundamentalScript";
// //   initial?: any;
// //   onClose: () => void;
// //   onSave?: (payload: any) => Promise<any> | any;
// //   categories?: string[];
// //   compact?: boolean;
// // };

// // const DEFAULT_CATEGORIES = SALES_CATEGORIES;

// // export default function AddEditSalesModal({
// //   open,
// //   mode = "add",
// //   type,
// //   initial = null,
// //   onClose,
// //   onSave,
// //   categories = DEFAULT_CATEGORIES,
// //   compact = true,
// // }: Props) {
// //   const isChecklist = type === "repsChecklist";

// //   // fundamental script state
// //   const [term, setTerm] = useState("");
// //   const [script, setScript] = useState("");

// //   // checklist state
// //   const [entries, setEntries] = useState<ChecklistEntry[]>([]);
// //   const [text, setText] = useState("");
// //   const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // keep null to show placeholder
// //   const [saving, setSaving] = useState(false);
// //   const [animateUid, setAnimateUid] = useState<string | null>(null);

// //   // carousel state
// //   const [activeIndex, setActiveIndex] = useState(0);
// //   const CARD_WIDTH = 420;
// //   const GAP = 16;
// //   const sliderTranslateX = activeIndex * (CARD_WIDTH + GAP);

// //   // refs for scroll/focus control
// //   const textRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
// //   const scrollContainerRef = useRef<HTMLDivElement | null>(null);

// //   // initialize on open / initial changes
// //   useEffect(() => {
// //     if (!open) return;

// //     if (isChecklist) {
// //       if (mode === "edit" && initial && !Array.isArray(initial)) {
// //         // edit a single item: prefill top inputs, no carousel
// //         setEntries([]);
// //         setSelectedCategory(initial.category ?? null);
// //         setText(initial.task ?? "");
// //         setActiveIndex(0);
// //       } else if (Array.isArray(initial) && initial.length > 0) {
// //         // seed entries for bulk-add
// //         const seed = initial.map((r: any) => ({
// //           uid: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
// //           category: r.category ?? null,
// //           task: r.task ?? "",
// //         }));
// //         setEntries(seed);
// //         setSelectedCategory(null);
// //         setText("");
// //         setActiveIndex(0);
// //       } else {
// //         // fresh add
// //         setEntries([]);
// //         setSelectedCategory(null);
// //         setText("");
// //         setActiveIndex(0);
// //       }
// //     } else {
// //       if (initial && typeof initial === "object") {
// //         setTerm(initial.term ?? "");
// //         setScript(initial.script ?? "");
// //       } else {
// //         setTerm(String(initial ?? ""));
// //         setScript("");
// //       }
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [open, initial, type, mode]);

// //   // helper: temporarily disable smooth scroll for instant adjustments
// //   function ensureInstantScroll(container: Element | null, fn: () => void) {
// //     if (!container) {
// //       fn();
// //       return;
// //     }
// //     const el = container as HTMLElement;
// //     const prev = el.style.scrollBehavior;
// //     try {
// //       el.style.scrollBehavior = "auto";
// //       fn();
// //     } finally {
// //       window.setTimeout(() => {
// //         el.style.scrollBehavior = prev || "";
// //       }, 60);
// //     }
// //   }

// //   /* ---------- add / edit helpers ---------- */
// //   function handleAddAnother() {
// //     // now require both text and a selected category
// //     if (!text.trim() || !selectedCategory) return;
// //     const uid = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
// //     const entry: ChecklistEntry = {
// //       uid,
// //       category: selectedCategory,
// //       task: text.trim(),
// //     };

// //     // capture scroll metrics of our container before DOM changes
// //     const container = scrollContainerRef.current;
// //     const prevScrollTop = container ? container.scrollTop : 0;

// //     // prepend new entry
// //     setEntries((p) => [entry, ...p]);

// //     // mark it for animation — animation will move from positive X -> 0 (no left clipping)
// //     setAnimateUid(uid);
// //     setText("");
// //     setSelectedCategory(null);
// //     setActiveIndex(0);

// //     // clear animate flag after animation completes
// //     window.setTimeout(() => setAnimateUid(null), 420);

// //     // after DOM update: ensure we keep the exact previous scrollTop (no downward jump)
// //     requestAnimationFrame(() => {
// //       requestAnimationFrame(() => {
// //         if (container) {
// //           ensureInstantScroll(container, () => {
// //             container.scrollTop = prevScrollTop;
// //           });
// //         }

// //         // focus input back WITHOUT scrolling the page
// //         try {
// //           (textRef.current as any)?.focus?.({ preventScroll: true });
// //         } catch {
// //           try {
// //             textRef.current?.focus?.();
// //           } catch {}
// //         }

// //         // After animation completes, adjust again (still keep same previous scrollTop)
// //         setTimeout(() => {
// //           if (container) {
// //             ensureInstantScroll(container, () => {
// //               container.scrollTop = prevScrollTop;
// //             });
// //           }
// //           try {
// //             (textRef.current as any)?.focus?.({ preventScroll: true });
// //           } catch {}
// //         }, 480); // slightly longer than card animation
// //       });
// //     });
// //   }

// //   function handleRemoveEntry(uid: string) {
// //     setEntries((prev) => {
// //       const next = prev.filter((e) => e.uid !== uid);
// //       if (activeIndex >= next.length) setActiveIndex(Math.max(0, next.length - 1));
// //       return next;
// //     });
// //   }

// //   function updateEntry(uid: string, patch: Partial<ChecklistEntry>) {
// //     setEntries((prev) =>
// //       prev.map((e) => (e.uid === uid ? { ...e, ...patch } : e))
// //     );
// //   }

// //   const canPrev = entries.length > 0 && activeIndex < entries.length - 1;
// //   const canNext = entries.length > 0 && activeIndex > 0;
// //   const goPrev = () => setActiveIndex((i) => Math.min(entries.length - 1, i + 1));
// //   const goNext = () => setActiveIndex((i) => Math.max(0, i - 1));

// //   /* ---------- save ---------- */
// //   async function handleSave() {
// //     if (isChecklist) {
// //       // only include pending top item if it has both task and category
// //       const pending = text.trim() && selectedCategory
// //         ? [
// //             {
// //               uid: `${Date.now()}`,
// //               category: selectedCategory,
// //               task: text.trim(),
// //             },
// //           ]
// //         : [];

// //       const all = [
// //         ...pending.map((p) => ({ category: p.category, task: p.task })),
// //         ...entries.map((e) => ({ category: e.category, task: e.task })),
// //       ];

// //       // require both category and task for an item to be valid
// //       const valid = all.filter((e) => e.task && e.task.trim().length > 0 && e.category && e.category.trim().length > 0);
// //       if (valid.length === 0) return;

// //       setSaving(true);
// //       try {
// //         if (mode === "edit") {
// //           const single = valid[0];
// //           const detail = {
// //             type: "repsChecklist",
// //             mode: "edit",
// //             value: [single],
// //           };
// //           document.dispatchEvent(new CustomEvent("salesManual:itemSaved", { detail }));
// //           if (onSave) await onSave(single);
// //         } else {
// //           const detail = { type: "repsChecklist", mode: "add", value: valid };
// //           document.dispatchEvent(new CustomEvent("salesManual:itemSaved", { detail }));
// //           if (onSave) await onSave(valid);
// //         }
// //       } finally {
// //         setSaving(false);
// //         onClose();
// //       }
// //     } else {
// //       const t = term.trim();
// //       const s = script.trim();
// //       if (!t && !s) return;
// //       setSaving(true);
// //       try {
// //         const payload = { term: t, script: s };
// //         const detail = {
// //           type: "fundamentalScript",
// //           mode,
// //           value: payload,
// //           initialValue: initial,
// //         };
// //         document.dispatchEvent(new CustomEvent("salesManual:itemSaved", { detail }));
// //         if (onSave) await onSave(payload);
// //       } finally {
// //         setSaving(false);
// //         onClose();
// //       }
// //     }
// //   }

// //   // ---------- Footer disabled logic ----------
// //   // Checklist: disabled when there are no entries AND top inputs are incomplete.
// //   // Top inputs are considered complete only when both task text and a selected category exist.
// //   // FundamentalScript:
// //   //   - in add mode: require non-empty `script`
// //   //   - in edit mode: allow save if term OR script present
// //   const topChecklistIncomplete = !text.trim() || !selectedCategory;
// //   const footerDisabled = isChecklist
// //     ? entries.length === 0 && topChecklistIncomplete
// //     : mode === "add"
// //     ? script.trim().length === 0
// //     : !(term.trim() || script.trim());

// //   if (!open) return null;

// //   return (
// //     <BaseModal onClose={onClose} className="min-w-[486px] min-h-[466px]">
// //       <style>{`@keyframes slideInX {
// //           0% { opacity: 0; transform: translateX(24px) scale(.995); }
// //           50% { opacity: 1; transform: translateX(8px) scale(1.01); }
// //           100% { opacity: 1; transform: translateX(0) scale(1); }
// //         }`}</style>

// //       <div className="max-w-[486px] max-2xl:max-h-[500px] rounded-xl bg-white overflow-hidden flex flex-col custom-scroll">
// //         <div className="flex items-center justify-between p-4 border-b border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
// //           <h3 className="txt-24 font-medium">
// //             {mode === "edit"
// //               ? isChecklist
// //                 ? "Edit Reps Checklist"
// //                 : "Edit Fundamental Script"
// //               : isChecklist
// //               ? "Add Reps Checklist"
// //               : "Add Fundamental Script"}
// //           </h3>
// //           <button onClick={onClose} aria-label="Close" className="p-2 rounded-full">
// //             <Image src="/dashboardIcons/CloseButton.svg" alt="Close" width={32} height={32} />
// //           </button>
// //         </div>

// //         {/* SCROLLABLE MIDDLE */}
// //         <div ref={scrollContainerRef} className="p-6 overflow-auto min-h-0 flex-1 scroller">
// //           {isChecklist ? (
// //             <>
// //               <div className="mb-4 flex flex-col gap-4">
// //                 <div>
// //                   <div className="txt-12 font-medium mb-2">Category</div>
// //                   <InlineSelect<string>
// //                     value={selectedCategory ?? null}
// //                     onChange={(v) => setSelectedCategory(v ?? null)}
// //                     items={categories}
// //                     renderItem={(it) => <div className="txt-12">{it}</div>}
// //                     placeholder="Select category"
// //                     showCaret
// //                   />
// //                 </div>

// //                 <div>
// //                   <div className="txt-12 font-medium mb-2">Checklist Task</div>
// //                   {compact ? (
// //                     <input
// //                       ref={textRef as any}
// //                       value={text}
// //                       onChange={(e) => setText(e.target.value)}
// //                       placeholder="Enter checklist task"
// //                       className="w-full p-3 rounded bg-[#F2F5F6] txt-14 focus:outline-none h-14"
// //                     />
// //                   ) : (
// //                     <textarea
// //                       ref={textRef as any}
// //                       value={text}
// //                       onChange={(e) => setText(e.target.value)}
// //                       placeholder="Enter checklist task"
// //                       rows={4}
// //                       className="w-full p-3 rounded bg-[#F2F5F6] txt-14 resize-none focus:outline-none h-24"
// //                     />
// //                   )}
// //                 </div>
// //               </div>

// //               <div className="flex items-center justify-end">
// //                 {mode === "add" && (
// //                   <button
// //                     onClick={handleAddAnother}
// //                     disabled={!text.trim() || !selectedCategory}
// //                     className={`text-[#111827] font-medium flex items-center gap-2 mt-3 ${(!text.trim() || !selectedCategory) ? "opacity-40 cursor-not-allowed" : ""}`}
// //                   >
// //                     <span className="text-2xl leading-none">+</span>
// //                     <span className="txt-14">Add another</span>
// //                   </button>
// //                 )}
// //               </div>

// //               {mode === "add" && entries.length > 0 && (
// //                 <div className="mt-6 pt-4">
// //                   <div className="flex items-center justify-between mb-3">
// //                     <div className="flex items-center gap-2 justify-end w-full">
// //                       <button
// //                         onClick={goNext}
// //                         disabled={!canNext}
// //                         className={`p-1.75 rounded-full border border-[var(--Neutral-Grey-10,#E9EDEE)] ${!canNext ? "opacity-40" : ""}`}
// //                         aria-label="previous entry"
// //                       >
// //                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
// //                           <path d="M15 18l-6-6 6-6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                         </svg>
// //                       </button>
// //                       <button
// //                         onClick={goPrev}
// //                         disabled={!canPrev}
// //                         className={`p-1.75 rounded-full border border-[var(--Neutral-Grey-10,#E9EDEE)] ${!canPrev ? "opacity-40" : ""}`}
// //                         aria-label="next entry"
// //                       >
// //                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
// //                           <path d="M9 6l6 6-6 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                         </svg>
// //                       </button>
// //                     </div>
// //                   </div>

// //                   <div style={{ width: CARD_WIDTH }} className="overflow-hidden mx-auto">
// //                     <div className="flex gap-4 transition-transform duration-300" style={{ transform: `translateX(-${sliderTranslateX}px)` }}>
// //                       {entries.map((e) => (
// //                         <div key={e.uid} className="flex-shrink-0" style={{ width: CARD_WIDTH }}>
// //                           <PreviewCard
// //                             e={e}
// //                             animateUid={animateUid}
// //                             onRemove={() => handleRemoveEntry(e.uid)}
// //                             onUpdate={(patch) => updateEntry(e.uid, patch)}
// //                             categories={categories}
// //                             compact={compact}
// //                           />
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </>
// //           ) : (
// //             <>
// //               <div className="mb-4">
// //                 <div className="txt-12 font-medium mb-2">Sales Term</div>
// //                 <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Enter sales term" className="w-full p-3 rounded bg-[#F2F5F6] txt-14 focus:outline-none" />
// //               </div>

// //               <div>
// //                 <div className="txt-12 font-medium mb-2">Fundamental Script</div>
// //                 <textarea value={script} onChange={(e) => setScript(e.target.value)} placeholder="Add fundamental script" rows={6} className="w-full p-3 rounded bg-[#F2F5F6] txt-14 resize-none focus:outline-none" />
// //               </div>
// //             </>
// //           )}
// //         </div>

// //         <div className="flex items-center justify-end gap-4 bg-[#F2F5F6] px-6 py-4 border-t border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
// //           <button onClick={onClose} className="w-28 h-10 px-3 txt-16 font-semibold rounded-lg bg-white border border-[color:var(--Neutral-Grey-10,#E9EDEE)]">
// //             Cancel
// //           </button>
// //           <button onClick={handleSave} disabled={footerDisabled || saving} className="w-36 h-10 px-3 txt-16 font-semibold rounded-lg bg-[#0E0E0E] text-white disabled:opacity-50 disabled:cursor-not-allowed">
// //             {saving ? (mode === "edit" ? "Saving…" : "Adding…") : mode === "edit" ? "Save Changes" : isChecklist ? `Add` : `Add`}
// //           </button>
// //         </div>
// //       </div>
// //     </BaseModal>
// //   );
// // }

// // /* ---------------- PreviewCard (keeps only positive X in animation) ---------------- */
// // function PreviewCard({
// //   e,
// //   animateUid,
// //   onRemove,
// //   onUpdate,
// //   categories,
// //   compact,
// // }: {
// //   e: ChecklistEntry;
// //   animateUid: string | null;
// //   onRemove: () => void;
// //   onUpdate: (patch: Partial<Omit<ChecklistEntry, "uid">>) => void;
// //   categories: string[];
// //   compact?: boolean;
// // }) {
// //   const isAnimating = animateUid === e.uid;
// //   const taRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
// //   const maxChars = compact ? 40 : 150;

// //   // NOTE: removed autofocus on card's textarea to avoid browser auto-scrolling when a card mounts/updates

// //   return (
// //     <div
// //       className="bg-white rounded-lg p-3 border w-full border-[var(--Neutral-Grey-10,#E9EDEE)]"
// //       style={{
// //         width: 420,
// //         // hint the browser to optimize transitions
// //         willChange: isAnimating ? "transform, opacity" : "auto",
// //         transform: "translateZ(0)",
// //         ...(isAnimating
// //           ? {
// //               animation: "slideInX 380ms cubic-bezier(.2,.9,.25,1)",
// //               animationFillMode: "both",
// //             }
// //           : {}),
// //       }}
// //     >
// //       <div className="ml-2 flex items-end justify-end">
// //         <button onClick={onRemove} className="p-1 rounded hover:bg-neutral-100" aria-label="Delete">
// //           <Image src="/dashboardIcons/DailyContent/trash-black.svg" alt="Delete" width={24} height={24} />
// //         </button>
// //       </div>

// //       <div className="flex items-start justify-between gap-2">
// //         <div className="flex-1">
// //           <div className="txt-12 font-medium mb-2">Category</div>
// //           <InlineSelect<string>
// //             value={(e.category as string) ?? null}
// //             onChange={(v) => onUpdate({ category: v ?? categories[0] })}
// //             items={categories}
// //             renderItem={(it) => <div>{it}</div>}
// //             placeholder="Select category"
// //             triggerClassName=""
// //           />
// //         </div>
// //       </div>

// //       <div className="mt-3">
// //         <div className="text-sm font-medium mb-1">Checklist Task</div>
// //         {compact ? (
// //           <input
// //             ref={taRef as any}
// //             value={e.task}
// //             onChange={(ev) => onUpdate({ task: ev.target.value.slice(0, maxChars) })}
// //             className="w-full px-3 txt-12 rounded-lg mb-0 bg-[#F3F6F6] focus:outline-none h-14"
// //             placeholder={`Add task (Max ${maxChars} characters)`}
// //           />
// //         ) : (
// //           <textarea
// //             ref={taRef as any}
// //             value={e.task}
// //             onChange={(ev) => onUpdate({ task: ev.target.value.slice(0, maxChars) })}
// //             rows={4}
// //             maxLength={maxChars}
// //             className="w-full p-3 txt-12 rounded-lg mb-0 resize-none bg-[#F3F6F6] focus:outline-none h-24"
// //             placeholder={`Add task (Max ${maxChars} characters)`}
// //           />
// //         )}
// //       </div>
// //     </div>
// //   );
// // }






// // // src\app\(dashboard)\dashboard\sales-manual\AddEditSalesModal.tsx
// // "use client";
// // import React, { useEffect, useRef, useState } from "react";
// // import InlineSelect from "../components/InlineSelect";
// // import BaseModal from "../components/BaseModal";
// // import Image from "next/image";
// // import { SALES_CATEGORIES } from "./salesdata";

// // type ChecklistEntry = {
// //   uid: string;
// //   category: string | null;
// //   task: string;
// // };

// // type Props = {
// //   open: boolean;
// //   mode?: "add" | "edit";
// //   type: "repsChecklist" | "fundamentalScript";
// //   initial?: any;
// //   onClose: () => void;
// //   onSave?: (payload: any) => Promise<any> | any;
// //   categories?: string[];
// //   compact?: boolean;
// // };

// // const DEFAULT_CATEGORIES = SALES_CATEGORIES;

// // export default function AddEditSalesModal({
// //   open,
// //   mode = "add",
// //   type,
// //   initial = null,
// //   onClose,
// //   onSave,
// //   categories = DEFAULT_CATEGORIES,
// //   compact = true,
// // }: Props) {
// //   const isChecklist = type === "repsChecklist";

// //   // fundamental script state
// //   const [term, setTerm] = useState("");
// //   const [script, setScript] = useState("");

// //   // checklist state
// //   const [entries, setEntries] = useState<ChecklistEntry[]>([]);
// //   const [text, setText] = useState("");
// //   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
// //   const [saving, setSaving] = useState(false);
// //   const [animateUid, setAnimateUid] = useState<string | null>(null);

// //   const [activeIndex, setActiveIndex] = useState(0);
// //   const CARD_WIDTH = 420;
// //   const GAP = 16;
// //   const sliderTranslateX = activeIndex * (CARD_WIDTH + GAP);

// //   const textRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
// //   const scrollContainerRef = useRef<HTMLDivElement | null>(null);

// //   useEffect(() => {
// //     if (!open) return;

// //     if (isChecklist) {
// //       if (mode === "edit" && initial && !Array.isArray(initial)) {
// //         setEntries([]);
// //         setSelectedCategory(initial.category ?? null);
// //         setText(initial.task ?? "");
// //         setActiveIndex(0);
// //       } else if (Array.isArray(initial) && initial.length > 0) {
// //         const seed = initial.map((r: any) => ({
// //           uid: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
// //           category: r.category ?? null,
// //           task: r.task ?? "",
// //         }));
// //         setEntries(seed);
// //         setSelectedCategory(null);
// //         setText("");
// //         setActiveIndex(0);
// //       } else {
// //         setEntries([]);
// //         setSelectedCategory(null);
// //         setText("");
// //         setActiveIndex(0);
// //       }
// //     } else {
// //       if (initial && typeof initial === "object") {
// //         setTerm(initial.term ?? "");
// //         setScript(initial.script ?? "");
// //       } else {
// //         setTerm(String(initial ?? ""));
// //         setScript("");
// //       }
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [open, initial, type, mode]);

// //   function ensureInstantScroll(container: Element | null, fn: () => void) {
// //     if (!container) {
// //       fn();
// //       return;
// //     }
// //     const el = container as HTMLElement;
// //     const prev = el.style.scrollBehavior;
// //     try {
// //       el.style.scrollBehavior = "auto";
// //       fn();
// //     } finally {
// //       window.setTimeout(() => {
// //         el.style.scrollBehavior = prev || "";
// //       }, 60);
// //     }
// //   }

// //   function handleAddAnother() {
// //     if (!text.trim() || !selectedCategory) return;
// //     const uid = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
// //     const entry: ChecklistEntry = {
// //       uid,
// //       category: selectedCategory,
// //       task: text.trim(),
// //     };

// //     const container = scrollContainerRef.current;
// //     const prevScrollTop = container ? container.scrollTop : 0;

// //     setEntries((p) => [entry, ...p]);

// //     setAnimateUid(uid);
// //     setText("");
// //     setSelectedCategory(null);
// //     setActiveIndex(0);

// //     window.setTimeout(() => setAnimateUid(null), 420);

// //     requestAnimationFrame(() => {
// //       requestAnimationFrame(() => {
// //         if (container) {
// //           ensureInstantScroll(container, () => {
// //             container.scrollTop = prevScrollTop;
// //           });
// //         }

// //         try {
// //           (textRef.current as any)?.focus?.({ preventScroll: true });
// //         } catch {
// //           try {
// //             textRef.current?.focus?.();
// //           } catch {}
// //         }

// //         setTimeout(() => {
// //           if (container) {
// //             ensureInstantScroll(container, () => {
// //               container.scrollTop = prevScrollTop;
// //             });
// //           }
// //           try {
// //             (textRef.current as any)?.focus?.({ preventScroll: true });
// //           } catch {}
// //         }, 480);
// //       });
// //     });
// //   }

// //   function handleRemoveEntry(uid: string) {
// //     setEntries((prev) => {
// //       const next = prev.filter((e) => e.uid !== uid);
// //       if (activeIndex >= next.length) setActiveIndex(Math.max(0, next.length - 1));
// //       return next;
// //     });
// //   }

// //   function updateEntry(uid: string, patch: Partial<ChecklistEntry>) {
// //     setEntries((prev) => prev.map((e) => (e.uid === uid ? { ...e, ...patch } : e)));
// //   }

// //   const canPrev = entries.length > 0 && activeIndex < entries.length - 1;
// //   const canNext = entries.length > 0 && activeIndex > 0;
// //   const goPrev = () => setActiveIndex((i) => Math.min(entries.length - 1, i + 1));
// //   const goNext = () => setActiveIndex((i) => Math.max(0, i - 1));

// //   async function handleSave() {
// //     if (isChecklist) {
// //       const pending = text.trim() && selectedCategory ? [{ uid: `${Date.now()}`, category: selectedCategory, task: text.trim() }] : [];

// //       const all = [
// //         ...pending.map((p) => ({ category: p.category, task: p.task })),
// //         ...entries.map((e) => ({ category: e.category, task: e.task })),
// //       ];

// //       const valid = all.filter((e) => e.task && e.task.trim().length > 0 && e.category && e.category.trim().length > 0);
// //       if (valid.length === 0) return;

// //       setSaving(true);
// //       try {
// //         if (mode === "edit") {
// //           const single = valid[0];
// //           const detail = {
// //             type: "repsChecklist",
// //             mode: "edit",
// //             value: [single],
// //           };
// //           document.dispatchEvent(new CustomEvent("salesManual:itemSaved", { detail }));
// //           if (onSave) await onSave(single);
// //         } else {
// //           const detail = { type: "repsChecklist", mode: "add", value: valid };
// //           document.dispatchEvent(new CustomEvent("salesManual:itemSaved", { detail }));
// //           if (onSave) await onSave(valid);
// //         }
// //       } finally {
// //         setSaving(false);
// //         onClose();
// //       }
// //     } else {
// //       const t = term.trim();
// //       const s = script.trim();
// //       if (!t && !s) return;
// //       setSaving(true);
// //       try {
// //         const payload = { term: t, script: s };
// //         const detail = {
// //           type: "fundamentalScript",
// //           mode,
// //           value: payload,
// //           initialValue: initial,
// //         };
// //         document.dispatchEvent(new CustomEvent("salesManual:itemSaved", { detail }));
// //         if (onSave) await onSave(payload);
// //       } finally {
// //         setSaving(false);
// //         onClose();
// //       }
// //     }
// //   }

// //   const topChecklistIncomplete = !text.trim() || !selectedCategory;
// //   const footerDisabled = isChecklist ? entries.length === 0 && topChecklistIncomplete : mode === "add" ? script.trim().length === 0 : !(term.trim() || script.trim());

// //   if (!open) return null;

// //   return (
// //     <BaseModal onClose={onClose} className="min-w-[486px] min-h-[466px]">
// //       <style>{`@keyframes slideInX {
// //           0% { opacity: 0; transform: translateX(24px) scale(.995); }
// //           50% { opacity: 1; transform: translateX(8px) scale(1.01); }
// //           100% { opacity: 1; transform: translateX(0) scale(1); }
// //         }`}</style>

// //       <div className="max-w-[486px] max-2xl:max-h-[500px] rounded-xl bg-white overflow-hidden flex flex-col custom-scroll">
// //         <div className="flex items-center justify-between p-4 border-b border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
// //           <h3 className="txt-24 font-medium">
// //             {mode === "edit" ? (isChecklist ? "Edit Reps Checklist" : "Edit Fundamental Script") : isChecklist ? "Add Reps Checklist" : "Add Fundamental Script"}
// //           </h3>
// //           <button onClick={onClose} aria-label="Close" className="p-2 rounded-full">
// //             <Image src="/dashboardIcons/CloseButton.svg" alt="Close" width={32} height={32} />
// //           </button>
// //         </div>

// //         <div ref={scrollContainerRef} className="p-6 overflow-auto min-h-0 flex-1 scroller">
// //           {isChecklist ? (
// //             <>
// //               <div className="mb-4 flex flex-col gap-4">
// //                 <div>
// //                   <div className="txt-12 font-medium mb-2">Category</div>
// //                   <InlineSelect<string>
// //                     value={selectedCategory ?? null}
// //                     onChange={(v) => setSelectedCategory(v ?? null)}
// //                     items={categories}
// //                     renderItem={(it) => <div className="txt-12">{it}</div>}
// //                     placeholder="Select category"
// //                     showCaret
// //                   />
// //                 </div>

// //                 <div>
// //                   <div className="txt-12 font-medium mb-2">Checklist Task</div>
// //                   {compact ? (
// //                     <input
// //                       ref={textRef as any}
// //                       value={text}
// //                       onChange={(e) => setText(e.target.value)}
// //                       placeholder="Enter checklist task"
// //                       className="w-full p-3 rounded bg-[#F2F5F6] txt-14 focus:outline-none h-14"
// //                     />
// //                   ) : (
// //                     <textarea
// //                       ref={textRef as any}
// //                       value={text}
// //                       onChange={(e) => setText(e.target.value)}
// //                       placeholder="Enter checklist task"
// //                       rows={4}
// //                       className="w-full p-3 rounded bg-[#F2F5F6] txt-14 resize-none focus:outline-none h-24"
// //                     />
// //                   )}
// //                 </div>
// //               </div>

// //               <div className="flex items-center justify-end">
// //                 {mode === "add" && (
// //                   <button
// //                     onClick={handleAddAnother}
// //                     disabled={!text.trim() || !selectedCategory}
// //                     className={`text-[#111827] font-medium flex items-center gap-2 mt-3 ${(!text.trim() || !selectedCategory) ? "opacity-40 cursor-not-allowed" : ""}`}
// //                   >
// //                     <span className="text-2xl leading-none">+</span>
// //                     <span className="txt-14">Add another</span>
// //                   </button>
// //                 )}
// //               </div>

// //               {mode === "add" && entries.length > 0 && (
// //                 <div className="mt-6 pt-4">
// //                   <div className="flex items-center justify-between mb-3">
// //                     <div className="flex items-center gap-2 justify-end w-full">
// //                       <button onClick={goNext} disabled={!canNext} className={`p-1.75 rounded-full border border-[var(--Neutral-Grey-10,#E9EDEE)] ${!canNext ? "opacity-40" : ""}`} aria-label="previous entry">
// //                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
// //                           <path d="M15 18l-6-6 6-6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                         </svg>
// //                       </button>
// //                       <button onClick={goPrev} disabled={!canPrev} className={`p-1.75 rounded-full border border-[var(--Neutral-Grey-10,#E9EDEE)] ${!canPrev ? "opacity-40" : ""}`} aria-label="next entry">
// //                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
// //                           <path d="M9 6l6 6-6 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                         </svg>
// //                       </button>
// //                     </div>
// //                   </div>

// //                   <div style={{ width: CARD_WIDTH }} className="overflow-hidden mx-auto">
// //                     <div className="flex gap-4 transition-transform duration-300" style={{ transform: `translateX(-${sliderTranslateX}px)` }}>
// //                       {entries.map((e) => (
// //                         <div key={e.uid} className="flex-shrink-0" style={{ width: CARD_WIDTH }}>
// //                           <PreviewCard e={e} animateUid={animateUid} onRemove={() => handleRemoveEntry(e.uid)} onUpdate={(patch) => updateEntry(e.uid, patch)} categories={categories} compact={compact} />
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </>
// //           ) : (
// //             <>
// //               <div className="mb-4">
// //                 <div className="txt-12 font-medium mb-2">Sales Term</div>
// //                 <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Enter sales term" className="w-full p-3 rounded bg-[#F2F5F6] txt-14 focus:outline-none" />
// //               </div>

// //               <div>
// //                 <div className="txt-12 font-medium mb-2">Fundamental Script</div>
// //                 <textarea value={script} onChange={(e) => setScript(e.target.value)} placeholder="Add fundamental script" rows={6} className="w-full p-3 rounded bg-[#F2F5F6] txt-14 resize-none focus:outline-none" />
// //               </div>
// //             </>
// //           )}
// //         </div>

// //         <div className="flex items-center justify-end gap-4 bg-[#F2F5F6] px-6 py-4 border-t border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
// //           <button onClick={onClose} className="w-28 h-10 px-3 txt-16 font-semibold rounded-lg bg-white border border-[color:var(--Neutral-Grey-10,#E9EDEE)]">
// //             Cancel
// //           </button>
// //           <button onClick={handleSave} disabled={footerDisabled || saving} className="w-36 h-10 px-3 txt-16 font-semibold rounded-lg bg-[#0E0E0E] text-white disabled:opacity-50 disabled:cursor-not-allowed">
// //             {saving ? (mode === "edit" ? "Saving…" : "Adding…") : mode === "edit" ? "Save Changes" : isChecklist ? `Add` : `Add`}
// //           </button>
// //         </div>
// //       </div>
// //     </BaseModal>
// //   );
// // }

// // /* ---------------- PreviewCard ---------------- */
// // function PreviewCard({
// //   e,
// //   animateUid,
// //   onRemove,
// //   onUpdate,
// //   categories,
// //   compact,
// // }: {
// //   e: ChecklistEntry;
// //   animateUid: string | null;
// //   onRemove: () => void;
// //   onUpdate: (patch: Partial<Omit<ChecklistEntry, "uid">>) => void;
// //   categories: string[];
// //   compact?: boolean;
// // }) {
// //   const isAnimating = animateUid === e.uid;
// //   const taRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
// //   const maxChars = compact ? 40 : 150;

// //   return (
// //     <div
// //       className="bg-white rounded-lg p-3 border w-full border-[var(--Neutral-Grey-10,#E9EDEE)]"
// //       style={{
// //         width: 420,
// //         willChange: isAnimating ? "transform, opacity" : "auto",
// //         transform: "translateZ(0)",
// //         ...(isAnimating
// //           ? {
// //               animation: "slideInX 380ms cubic-bezier(.2,.9,.25,1)",
// //               animationFillMode: "both",
// //             }
// //           : {}),
// //       }}
// //     >
// //       <div className="ml-2 flex items-end justify-end">
// //         <button onClick={onRemove} className="p-1 rounded hover:bg-neutral-100" aria-label="Delete">
// //           <Image src="/dashboardIcons/DailyContent/trash-black.svg" alt="Delete" width={24} height={24} />
// //         </button>
// //       </div>

// //       <div className="flex items-start justify-between gap-2">
// //         <div className="flex-1">
// //           <div className="txt-12 font-medium mb-2">Category</div>
// //           <InlineSelect<string>
// //             value={(e.category as string) ?? null}
// //             onChange={(v) => onUpdate({ category: v ?? categories[0] })}
// //             items={categories}
// //             renderItem={(it) => <div>{it}</div>}
// //             placeholder="Select category"
// //             triggerClassName=""
// //           />
// //         </div>
// //       </div>

// //       <div className="mt-3">
// //         <div className="text-sm font-medium mb-1">Checklist Task</div>
// //         {compact ? (
// //           <input ref={taRef as any} value={e.task} onChange={(ev) => onUpdate({ task: ev.target.value.slice(0, maxChars) })} className="w-full px-3 txt-12 rounded-lg mb-0 bg-[#F3F6F6] focus:outline-none h-14" placeholder={`Add task (Max ${maxChars} characters)`} />
// //         ) : (
// //           <textarea ref={taRef as any} value={e.task} onChange={(ev) => onUpdate({ task: ev.target.value.slice(0, maxChars) })} rows={4} maxLength={maxChars} className="w-full p-3 txt-12 rounded-lg mb-0 resize-none bg-[#F3F6F6] focus:outline-none h-24" placeholder={`Add task (Max ${maxChars} characters)`} />
// //         )}
// //       </div>
// //     </div>
// //   );
// // }









// // src/app/(dashboard)/dashboard/sales-manual/AddEditSalesModal.tsx
// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import InlineSelect from "../components/InlineSelect";
// import BaseModal from "../components/BaseModal";
// import Image from "next/image";
// import { SALES_CATEGORIES } from "./salesdata";

// type ChecklistEntry = {
//   uid: string;
//   category: string | null;
//   task: string;
// };

// type Props = {
//   open: boolean;
//   mode?: "add" | "edit";
//   type: "repsChecklist" | "fundamentalScript";
//   initial?: any;
//   onClose: () => void;
//   onSave?: (payload: any) => Promise<any> | any;
//   categories?: string[];
//   compact?: boolean;
// };

// const DEFAULT_CATEGORIES = SALES_CATEGORIES;

// export default function AddEditSalesModal({
//   open,
//   mode = "add",
//   type,
//   initial = null,
//   onClose,
//   onSave,
//   categories = DEFAULT_CATEGORIES,
//   compact = true,
// }: Props) {
//   const isChecklist = type === "repsChecklist";

//   // fundamental script state
//   const [term, setTerm] = useState("");
//   const [script, setScript] = useState("");

//   // checklist state
//   const [entries, setEntries] = useState<ChecklistEntry[]>([]);
//   const [text, setText] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [animateUid, setAnimateUid] = useState<string | null>(null);

//   const [activeIndex, setActiveIndex] = useState(0);
//   const CARD_WIDTH = 420;
//   const GAP = 16;
//   const sliderTranslateX = activeIndex * (CARD_WIDTH + GAP);

//   const textRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
//   const scrollContainerRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (!open) return;

//     if (isChecklist) {
//       if (mode === "edit" && initial && !Array.isArray(initial)) {
//         setEntries([]);
//         setSelectedCategory(initial.category ?? null);
//         setText(initial.task ?? "");
//         setActiveIndex(0);
//       } else if (Array.isArray(initial) && initial.length > 0) {
//         const seed = initial.map((r: any) => ({
//           uid: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
//           category: r.category ?? null,
//           task: r.task ?? "",
//         }));
//         setEntries(seed);
//         setSelectedCategory(null);
//         setText("");
//         setActiveIndex(0);
//       } else {
//         setEntries([]);
//         setSelectedCategory(null);
//         setText("");
//         setActiveIndex(0);
//       }
//     } else {
//       if (initial && typeof initial === "object") {
//         setTerm(initial.term ?? "");
//         setScript(initial.script ?? "");
//       } else {
//         setTerm(String(initial ?? ""));
//         setScript("");
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open, initial, type, mode]);

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
//       window.setTimeout(() => {
//         el.style.scrollBehavior = prev || "";
//       }, 60);
//     }
//   }

//   function handleAddAnother() {
//     if (!text.trim() || !selectedCategory) return;
//     const uid = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
//     const entry: ChecklistEntry = {
//       uid,
//       category: selectedCategory,
//       task: text.trim(),
//     };

//     const container = scrollContainerRef.current;
//     const prevScrollTop = container ? container.scrollTop : 0;

//     setEntries((p) => [entry, ...p]);

//     setAnimateUid(uid);
//     setText("");
//     setSelectedCategory(null);
//     setActiveIndex(0);

//     window.setTimeout(() => setAnimateUid(null), 420);

//     requestAnimationFrame(() => {
//       requestAnimationFrame(() => {
//         if (container) {
//           ensureInstantScroll(container, () => {
//             container.scrollTop = prevScrollTop;
//           });
//         }

//         try {
//           (textRef.current as any)?.focus?.({ preventScroll: true });
//         } catch {
//           try {
//             textRef.current?.focus?.();
//           } catch {}
//         }

//         setTimeout(() => {
//           if (container) {
//             ensureInstantScroll(container, () => {
//               container.scrollTop = prevScrollTop;
//             });
//           }
//           try {
//             (textRef.current as any)?.focus?.({ preventScroll: true });
//           } catch {}
//         }, 480);
//       });
//     });
//   }

//   function handleRemoveEntry(uid: string) {
//     setEntries((prev) => {
//       const next = prev.filter((e) => e.uid !== uid);
//       if (activeIndex >= next.length) setActiveIndex(Math.max(0, next.length - 1));
//       return next;
//     });
//   }

//   function updateEntry(uid: string, patch: Partial<ChecklistEntry>) {
//     setEntries((prev) => prev.map((e) => (e.uid === uid ? { ...e, ...patch } : e)));
//   }

//   const canPrev = entries.length > 0 && activeIndex < entries.length - 1;
//   const canNext = entries.length > 0 && activeIndex > 0;
//   const goPrev = () => setActiveIndex((i) => Math.min(entries.length - 1, i + 1));
//   const goNext = () => setActiveIndex((i) => Math.max(0, i - 1));

//   async function handleSave() {
//     if (isChecklist) {
//       const pending = text.trim() && selectedCategory ? [{ uid: `${Date.now()}`, category: selectedCategory, task: text.trim() }] : [];

//       const all = [
//         ...pending.map((p) => ({ category: p.category, task: p.task })),
//         ...entries.map((e) => ({ category: e.category, task: e.task })),
//       ];

//       const valid = all.filter((e) => e.task && e.task.trim().length > 0 && e.category && e.category.trim().length > 0);
//       if (valid.length === 0) return;

//       setSaving(true);
//       const eventId = `${Date.now()}-${Math.random()}`;
//       try {
//         if (mode === "edit") {
//           const single = valid[0];
//           const detail = {
//             type: "repsChecklist",
//             mode: "edit",
//             value: [single],
//             eventId,
//           };
//           // modal dispatches single source-of-truth event (includes eventId)
//           document.dispatchEvent(new CustomEvent("salesManual:itemSaved", { detail }));
//           if (onSave) await onSave(single);
//         } else {
//           const detail = { type: "repsChecklist", mode: "add", value: valid, eventId };
//           document.dispatchEvent(new CustomEvent("salesManual:itemSaved", { detail }));
//           if (onSave) await onSave(valid);
//         }
//       } finally {
//         setSaving(false);
//         onClose();
//       }
//     } else {
//       const t = term.trim();
//       const s = script.trim();
//       if (!t && !s) return;
//       setSaving(true);
//       const eventId = `${Date.now()}-${Math.random()}`;
//       try {
//         const payload = { term: t, script: s };
//         const detail = {
//           type: "fundamentalScript",
//           mode,
//           value: payload,
//           initialValue: initial,
//           eventId,
//         };
//         document.dispatchEvent(new CustomEvent("salesManual:itemSaved", { detail }));
//         if (onSave) await onSave(payload);
//       } finally {
//         setSaving(false);
//         onClose();
//       }
//     }
//   }

//   const topChecklistIncomplete = !text.trim() || !selectedCategory;
//   const footerDisabled = isChecklist ? entries.length === 0 && topChecklistIncomplete : mode === "add" ? script.trim().length === 0 : !(term.trim() || script.trim());

//   if (!open) return null;

//   return (
//     <BaseModal onClose={onClose} className="min-w-[486px] min-h-[466px]">
//       <style>{`@keyframes slideInX {
//           0% { opacity: 0; transform: translateX(24px) scale(.995); }
//           50% { opacity: 1; transform: translateX(8px) scale(1.01); }
//           100% { opacity: 1; transform: translateX(0) scale(1); }
//         }`}</style>

//       <div className="max-w-[486px] max-2xl:max-h-[500px] rounded-xl bg-white overflow-hidden flex flex-col custom-scroll">
//         <div className="flex items-center justify-between p-4 border-b border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
//           <h3 className="txt-24 font-medium">
//             {mode === "edit" ? (isChecklist ? "Edit Reps Checklist" : "Edit Fundamental Script") : isChecklist ? "Add Reps Checklist" : "Add Fundamental Script"}
//           </h3>
//           <button onClick={onClose} aria-label="Close" className="p-2 rounded-full">
//             <Image src="/dashboardIcons/CloseButton.svg" alt="Close" width={32} height={32} />
//           </button>
//         </div>

//         <div ref={scrollContainerRef} className="p-6 overflow-auto min-h-0 flex-1 scroller">
//           {isChecklist ? (
//             <>
//               <div className="mb-4 flex flex-col gap-4">
//                 <div>
//                   <div className="txt-12 font-medium mb-2">Category</div>
//                   <InlineSelect<string>
//                     value={selectedCategory ?? null}
//                     onChange={(v) => setSelectedCategory(v ?? null)}
//                     items={categories}
//                     renderItem={(it) => <div className="txt-12">{it}</div>}
//                     placeholder="Select category"
//                     showCaret
//                   />
//                 </div>

//                 <div>
//                   <div className="txt-12 font-medium mb-2">Checklist Task</div>
//                   {compact ? (
//                     <input
//                       ref={textRef as any}
//                       value={text}
//                       onChange={(e) => setText(e.target.value)}
//                       placeholder="Enter checklist task"
//                       className="w-full p-3 rounded bg-[#F2F5F6] txt-14 focus:outline-none h-14"
//                     />
//                   ) : (
//                     <textarea
//                       ref={textRef as any}
//                       value={text}
//                       onChange={(e) => setText(e.target.value)}
//                       placeholder="Enter checklist task"
//                       rows={4}
//                       className="w-full p-3 rounded bg-[#F2F5F6] txt-14 resize-none focus:outline-none h-24"
//                     />
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center justify-end">
//                 {mode === "add" && (
//                   <button
//                     onClick={handleAddAnother}
//                     disabled={!text.trim() || !selectedCategory}
//                     className={`text-[#111827] font-medium flex items-center gap-2 mt-3 ${(!text.trim() || !selectedCategory) ? "opacity-40 cursor-not-allowed" : ""}`}
//                   >
//                     <span className="text-2xl leading-none">+</span>
//                     <span className="txt-14">Add another</span>
//                   </button>
//                 )}
//               </div>

//               {mode === "add" && entries.length > 0 && (
//                 <div className="mt-6 pt-4">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-2 justify-end w-full">
//                       <button onClick={goNext} disabled={!canNext} className={`p-1.75 rounded-full border border-[var(--Neutral-Grey-10,#E9EDEE)] ${!canNext ? "opacity-40" : ""}`} aria-label="previous entry">
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                           <path d="M15 18l-6-6 6-6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                         </svg>
//                       </button>
//                       <button onClick={goPrev} disabled={!canPrev} className={`p-1.75 rounded-full border border-[var(--Neutral-Grey-10,#E9EDEE)] ${!canPrev ? "opacity-40" : ""}`} aria-label="next entry">
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                           <path d="M9 6l6 6-6 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                         </svg>
//                       </button>
//                     </div>
//                   </div>

//                   <div style={{ width: CARD_WIDTH }} className="overflow-hidden mx-auto">
//                     <div className="flex gap-4 transition-transform duration-300" style={{ transform: `translateX(-${sliderTranslateX}px)` }}>
//                       {entries.map((e) => (
//                         <div key={e.uid} className="flex-shrink-0" style={{ width: CARD_WIDTH }}>
//                           <PreviewCard e={e} animateUid={animateUid} onRemove={() => handleRemoveEntry(e.uid)} onUpdate={(patch) => updateEntry(e.uid, patch)} categories={categories} compact={compact} />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </>
//           ) : (
//             <>
//               <div className="mb-4">
//                 <div className="txt-12 font-medium mb-2">Sales Term</div>
//                 <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Enter sales term" className="w-full p-3 rounded bg-[#F2F5F6] txt-14 focus:outline-none" />
//               </div>

//               <div>
//                 <div className="txt-12 font-medium mb-2">Fundamental Script</div>
//                 <textarea value={script} onChange={(e) => setScript(e.target.value)} placeholder="Add fundamental script" rows={6} className="w-full p-3 rounded bg-[#F2F5F6] txt-14 resize-none focus:outline-none" />
//               </div>
//             </>
//           )}
//         </div>

//         <div className="flex items-center justify-end gap-4 bg-[#F2F5F6] px-6 py-4 border-t border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
//           <button onClick={onClose} className="w-28 h-10 px-3 txt-16 font-semibold rounded-lg bg-white border border-[color:var(--Neutral-Grey-10,#E9EDEE)]">
//             Cancel
//           </button>
//           <button onClick={handleSave} disabled={footerDisabled || saving} className="w-36 h-10 px-3 txt-16 font-semibold rounded-lg bg-[#0E0E0E] text-white disabled:opacity-50 disabled:cursor-not-allowed">
//             {saving ? (mode === "edit" ? "Saving…" : "Adding…") : mode === "edit" ? "Save Changes" : isChecklist ? `Add` : `Add`}
//           </button>
//         </div>
//       </div>
//     </BaseModal>
//   );
// }

// /* ---------------- PreviewCard ---------------- */
// function PreviewCard({
//   e,
//   animateUid,
//   onRemove,
//   onUpdate,
//   categories,
//   compact,
// }: {
//   e: ChecklistEntry;
//   animateUid: string | null;
//   onRemove: () => void;
//   onUpdate: (patch: Partial<Omit<ChecklistEntry, "uid">>) => void;
//   categories: string[];
//   compact?: boolean;
// }) {
//   const isAnimating = animateUid === e.uid;
//   const taRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
//   const maxChars = compact ? 40 : 150;

//   return (
//     <div
//       className="bg-white rounded-lg p-3 border w-full border-[var(--Neutral-Grey-10,#E9EDEE)]"
//       style={{
//         width: 420,
//         willChange: isAnimating ? "transform, opacity" : "auto",
//         transform: "translateZ(0)",
//         ...(isAnimating
//           ? {
//               animation: "slideInX 380ms cubic-bezier(.2,.9,.25,1)",
//               animationFillMode: "both",
//             }
//           : {}),
//       }}
//     >
//       <div className="ml-2 flex items-end justify-end">
//         <button onClick={onRemove} className="p-1 rounded hover:bg-neutral-100" aria-label="Delete">
//           <Image src="/dashboardIcons/DailyContent/trash-black.svg" alt="Delete" width={24} height={24} />
//         </button>
//       </div>

//       <div className="flex items-start justify-between gap-2">
//         <div className="flex-1">
//           <div className="txt-12 font-medium mb-2">Category</div>
//           <InlineSelect<string>
//             value={(e.category as string) ?? null}
//             onChange={(v) => onUpdate({ category: v ?? categories[0] })}
//             items={categories}
//             renderItem={(it) => <div>{it}</div>}
//             placeholder="Select category"
//             triggerClassName=""
//           />
//         </div>
//       </div>

//       <div className="mt-3">
//         <div className="text-sm font-medium mb-1">Checklist Task</div>
//         {compact ? (
//           <input ref={taRef as any} value={e.task} onChange={(ev) => onUpdate({ task: ev.target.value.slice(0, maxChars) })} className="w-full px-3 txt-12 rounded-lg mb-0 bg-[#F3F6F6] focus:outline-none h-14" placeholder={`Add task (Max ${maxChars} characters)`} />
//         ) : (
//           <textarea ref={taRef as any} value={e.task} onChange={(ev) => onUpdate({ task: ev.target.value.slice(0, maxChars) })} rows={4} maxLength={maxChars} className="w-full p-3 txt-12 rounded-lg mb-0 resize-none bg-[#F3F6F6] focus:outline-none h-24" placeholder={`Add task (Max ${maxChars} characters)`} />
//         )}
//       </div>
//     </div>
//   );
// }




"use client";
import React, { useEffect, useRef, useState } from "react";
import InlineSelect from "../components/InlineSelect";
import BaseModal from "../components/BaseModal";
import Image from "next/image";
import { SALES_CATEGORIES } from "./salesdata";

type ChecklistEntry = {
  uid: string;
  category: string | null;
  task: string;
};

type Props = {
  open: boolean;
  mode?: "add" | "edit";
  type: "repsChecklist" | "fundamentalScript";
  initial?: any;
  onClose: () => void;
  onSave?: (payload: any) => Promise<any> | any;
  categories?: string[];
  compact?: boolean;
};

const DEFAULT_CATEGORIES = SALES_CATEGORIES;

export default function AddEditSalesModal({
  open,
  mode = "add",
  type,
  initial = null,
  onClose,
  onSave,
  categories = DEFAULT_CATEGORIES,
  compact = true,
}: Props) {
  const isChecklist = type === "repsChecklist";

  // fundamental script state
  const [term, setTerm] = useState("");
  const [script, setScript] = useState("");

  // checklist state
  const [entries, setEntries] = useState<ChecklistEntry[]>([]);
  const [text, setText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [animateUid, setAnimateUid] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const CARD_WIDTH = 420;
  const GAP = 16;
  const sliderTranslateX = activeIndex * (CARD_WIDTH + GAP);

  const textRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    if (isChecklist) {
      if (mode === "edit" && initial && !Array.isArray(initial)) {
        setEntries([]);
        setSelectedCategory(initial.category ?? null);
        setText(initial.task ?? "");
        setActiveIndex(0);
      } else if (Array.isArray(initial) && initial.length > 0) {
        const seed = initial.map((r: any) => ({
          uid: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          category: r.category ?? null,
          task: r.task ?? "",
        }));
        setEntries(seed);
        setSelectedCategory(null);
        setText("");
        setActiveIndex(0);
      } else {
        setEntries([]);
        setSelectedCategory(null);
        setText("");
        setActiveIndex(0);
      }
    } else {
      if (initial && typeof initial === "object") {
        setTerm(initial.term ?? "");
        setScript(initial.script ?? "");
      } else {
        setTerm(String(initial ?? ""));
        setScript("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial, type, mode]);

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
      window.setTimeout(() => {
        el.style.scrollBehavior = prev || "";
      }, 60);
    }
  }

  function handleAddAnother() {
    if (!text.trim() || !selectedCategory) return;
    const uid = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const entry: ChecklistEntry = {
      uid,
      category: selectedCategory,
      task: text.trim(),
    };

    const container = scrollContainerRef.current;
    const prevScrollTop = container ? container.scrollTop : 0;

    setEntries((p) => [entry, ...p]);

    setAnimateUid(uid);
    setText("");
    setSelectedCategory(null);
    setActiveIndex(0);

    window.setTimeout(() => setAnimateUid(null), 420);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (container) {
          ensureInstantScroll(container, () => {
            container.scrollTop = prevScrollTop;
          });
        }

        try {
          (textRef.current as any)?.focus?.({ preventScroll: true });
        } catch {
          try {
            textRef.current?.focus?.();
          } catch {}
        }

        setTimeout(() => {
          if (container) {
            ensureInstantScroll(container, () => {
              container.scrollTop = prevScrollTop;
            });
          }
          try {
            (textRef.current as any)?.focus?.({ preventScroll: true });
          } catch {}
        }, 480);
      });
    });
  }

  function handleRemoveEntry(uid: string) {
    setEntries((prev) => {
      const next = prev.filter((e) => e.uid !== uid);
      if (activeIndex >= next.length) setActiveIndex(Math.max(0, next.length - 1));
      return next;
    });
  }

  function updateEntry(uid: string, patch: Partial<ChecklistEntry>) {
    setEntries((prev) => prev.map((e) => (e.uid === uid ? { ...e, ...patch } : e)));
  }

  const canPrev = entries.length > 0 && activeIndex < entries.length - 1;
  const canNext = entries.length > 0 && activeIndex > 0;
  const goPrev = () => setActiveIndex((i) => Math.min(entries.length - 1, i + 1));
  const goNext = () => setActiveIndex((i) => Math.max(0, i - 1));

  async function handleSave() {
    if (isChecklist) {
      const pending = text.trim() && selectedCategory ? [{ uid: `${Date.now()}`, category: selectedCategory, task: text.trim() }] : [];

      const all = [
        ...pending.map((p) => ({ category: p.category, task: p.task })),
        ...entries.map((e) => ({ category: e.category, task: e.task })),
      ];

      const valid = all.filter((e) => e.task && e.task.trim().length > 0 && e.category && e.category.trim().length > 0);
      if (valid.length === 0) return;

      setSaving(true);
      const eventId = `${Date.now()}-${Math.random()}`;
      try {
        if (mode === "edit") {
          const single = valid[0];
          const detail = {
            type: "repsChecklist",
            mode: "edit",
            // include id so listeners can match item to update
            value: [{ ...(single as any), id: initial?.id ?? undefined }],
            eventId,
          };
          document.dispatchEvent(new CustomEvent("salesManual:itemSaved", { detail }));
          if (onSave) await onSave(single);
        } else {
          const detail = { type: "repsChecklist", mode: "add", value: valid, eventId };
          document.dispatchEvent(new CustomEvent("salesManual:itemSaved", { detail }));
          if (onSave) await onSave(valid);
        }
      } finally {
        setSaving(false);
        onClose();
      }
    } else {
      const t = term.trim();
      const s = script.trim();
      if (!t && !s) return;
      setSaving(true);
      const eventId = `${Date.now()}-${Math.random()}`;
      try {
        const payload: any = { term: t, script: s };
        // include id on edit so listeners can match by id
        if (mode === "edit" && initial?.id !== undefined) payload.id = initial.id;
        const detail = {
          type: "fundamentalScript",
          mode,
          value: payload,
          initialValue: initial,
          eventId,
        };
        document.dispatchEvent(new CustomEvent("salesManual:itemSaved", { detail }));
        if (onSave) await onSave(payload);
      } finally {
        setSaving(false);
        onClose();
      }
    }
  }

  const topChecklistIncomplete = !text.trim() || !selectedCategory;
  const footerDisabled = isChecklist ? entries.length === 0 && topChecklistIncomplete : mode === "add" ? script.trim().length === 0 : !(term.trim() || script.trim());

  if (!open) return null;

  return (
    <BaseModal onClose={onClose} className="min-w-[486px] min-h-[466px]">
      <style>{`@keyframes slideInX {
          0% { opacity: 0; transform: translateX(24px) scale(.995); }
          50% { opacity: 1; transform: translateX(8px) scale(1.01); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }`}</style>

      <div className="max-w-[486px] max-2xl:max-h-[500px] rounded-xl bg-white overflow-hidden flex flex-col custom-scroll">
        <div className="flex items-center justify-between p-4 border-b border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
          <h3 className="txt-24 font-medium">
            {mode === "edit" ? (isChecklist ? "Edit Reps Checklist" : "Edit Fundamental Script") : isChecklist ? "Add Reps Checklist" : "Add Fundamental Script"}
          </h3>
          <button onClick={onClose} aria-label="Close" className="p-2 rounded-full">
            <Image src="/dashboardIcons/CloseButton.svg" alt="Close" width={32} height={32} />
          </button>
        </div>

        <div ref={scrollContainerRef} className="p-6 overflow-auto min-h-0 flex-1 scroller">
          {isChecklist ? (
            <>
              <div className="mb-4 flex flex-col gap-4">
                <div>
                  <div className="txt-12 font-medium mb-2">Category</div>
                  <InlineSelect<string>
                    value={selectedCategory ?? null}
                    onChange={(v) => setSelectedCategory(v ?? null)}
                    items={categories}
                    renderItem={(it) => <div className="txt-12">{it}</div>}
                    placeholder="Select category"
                    showCaret
                  />
                </div>

                <div>
                  <div className="txt-12 font-medium mb-2">Checklist Task</div>
                  {compact ? (
                    <input
                      ref={textRef as any}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter checklist task"
                      className="w-full p-3 rounded bg-[#F2F5F6] txt-14 focus:outline-none h-14"
                    />
                  ) : (
                    <textarea
                      ref={textRef as any}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter checklist task"
                      rows={4}
                      className="w-full p-3 rounded bg-[#F2F5F6] txt-14 resize-none focus:outline-none h-24"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end">
                {mode === "add" && (
                  <button
                    onClick={handleAddAnother}
                    disabled={!text.trim() || !selectedCategory}
                    className={`text-[#111827] font-medium flex items-center gap-2 mt-3 ${(!text.trim() || !selectedCategory) ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <span className="text-2xl leading-none">+</span>
                    <span className="txt-14">Add another</span>
                  </button>
                )}
              </div>

              {mode === "add" && entries.length > 0 && (
                <div className="mt-6 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 justify-end w-full">
                      <button onClick={goNext} disabled={!canNext} className={`p-1.75 rounded-full border border-[var(--Neutral-Grey-10,#E9EDEE)] ${!canNext ? "opacity-40" : ""}`} aria-label="previous entry">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M15 18l-6-6 6-6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button onClick={goPrev} disabled={!canPrev} className={`p-1.75 rounded-full border border-[var(--Neutral-Grey-10,#E9EDEE)] ${!canPrev ? "opacity-40" : ""}`} aria-label="next entry">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M9 6l6 6-6 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div style={{ width: CARD_WIDTH }} className="overflow-hidden mx-auto">
                    <div className="flex gap-4 transition-transform duration-300" style={{ transform: `translateX(-${sliderTranslateX}px)` }}>
                      {entries.map((e) => (
                        <div key={e.uid} className="flex-shrink-0" style={{ width: CARD_WIDTH }}>
                          <PreviewCard e={e} animateUid={animateUid} onRemove={() => handleRemoveEntry(e.uid)} onUpdate={(patch) => updateEntry(e.uid, patch)} categories={categories} compact={compact} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-4">
                <div className="txt-12 font-medium mb-2">Sales Term</div>
                <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Enter sales term" className="w-full p-3 rounded bg-[#F2F5F6] txt-14 focus:outline-none" />
              </div>

              <div>
                <div className="txt-12 font-medium mb-2">Fundamental Script</div>
                <textarea value={script} onChange={(e) => setScript(e.target.value)} placeholder="Add fundamental script" rows={6} className="w-full p-3 rounded bg-[#F2F5F6] txt-14 resize-none focus:outline-none" />
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 bg-[#F2F5F6] px-6 py-4 border-t border-[color:var(--Neutral-Grey-20,#E9EDEE)]">
          <button onClick={onClose} className="w-28 h-10 px-3 txt-16 font-semibold rounded-lg bg-white border border-[color:var(--Neutral-Grey-10,#E9EDEE)]">
            Cancel
          </button>
          <button onClick={handleSave} disabled={footerDisabled || saving} className="w-36 h-10 px-3 txt-16 font-semibold rounded-lg bg-[#0E0E0E] text-white disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? (mode === "edit" ? "Saving…" : "Adding…") : mode === "edit" ? "Save Changes" : isChecklist ? `Add` : `Add`}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}

/* ---------------- PreviewCard ---------------- */
function PreviewCard({
  e,
  animateUid,
  onRemove,
  onUpdate,
  categories,
  compact,
}: {
  e: ChecklistEntry;
  animateUid: string | null;
  onRemove: () => void;
  onUpdate: (patch: Partial<Omit<ChecklistEntry, "uid">>) => void;
  categories: string[];
  compact?: boolean;
}) {
  const isAnimating = animateUid === e.uid;
  const taRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const maxChars = compact ? 40 : 150;

  return (
    <div
      className="bg-white rounded-lg p-3 border w-full border-[var(--Neutral-Grey-10,#E9EDEE)]"
      style={{
        width: 420,
        willChange: isAnimating ? "transform, opacity" : "auto",
        transform: "translateZ(0)",
        ...(isAnimating
          ? {
              animation: "slideInX 380ms cubic-bezier(.2,.9,.25,1)",
              animationFillMode: "both",
            }
          : {}),
      }}
    >
      <div className="ml-2 flex items-end justify-end">
        <button onClick={onRemove} className="p-1 rounded hover:bg-neutral-100" aria-label="Delete">
          <Image src="/dashboardIcons/DailyContent/trash-black.svg" alt="Delete" width={24} height={24} />
        </button>
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="txt-12 font-medium mb-2">Category</div>
          <InlineSelect<string>
            value={(e.category as string) ?? null}
            onChange={(v) => onUpdate({ category: v ?? categories[0] })}
            items={categories}
            renderItem={(it) => <div>{it}</div>}
            placeholder="Select category"
            triggerClassName=""
          />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-sm font-medium mb-1">Checklist Task</div>
        {compact ? (
          <input ref={taRef as any} value={e.task} onChange={(ev) => onUpdate({ task: ev.target.value.slice(0, maxChars) })} className="w-full px-3 txt-12 rounded-lg mb-0 bg-[#F3F6F6] focus:outline-none h-14" placeholder={`Add task (Max ${maxChars} characters)`} />
        ) : (
          <textarea ref={taRef as any} value={e.task} onChange={(ev) => onUpdate({ task: ev.target.value.slice(0, maxChars) })} rows={4} maxLength={maxChars} className="w-full p-3 txt-12 rounded-lg mb-0 resize-none bg-[#F3F6F6] focus:outline-none h-24" placeholder={`Add task (Max ${maxChars} characters)`} />
        )}
      </div>
    </div>
  );
}
