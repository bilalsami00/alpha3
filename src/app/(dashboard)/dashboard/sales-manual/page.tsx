// // // // src\app\(dashboard)\dashboard\sales-manual\page.tsx
// "use client";
// import React, { useEffect, useState } from "react";
// import RepsChecklist from "./reps-checklist/page";
// import FundamentalScripts from "./fundamental-scripts/page";
// import SalesBible from "./sales-bible/page";
// import AddEditSalesModal from "./AddEditSalesModal";

// export default function SalesManual({ selectedSubTab }: { selectedSubTab?: string }) {
//   // treat undefined and empty string as "not controlled"
//   const controlled = typeof selectedSubTab !== "undefined" && selectedSubTab !== "";
//   const [active, setActive] = useState<string>(selectedSubTab ?? "Reps Checklist");

//   useEffect(() => {
//   function onRequestEdit(e: Event) {
//     try {
//       const detail = (e as CustomEvent).detail;
//       if (!detail) return;
//       console.log("SalesManual: received salesManual:requestEdit", detail);
//       if (detail.type === "repsChecklist") openEditForChecklist(detail.item);
//       else if (detail.type === "fundamentalScript") openEditForScript(detail.item);
//     } catch (err) {
//       console.error("SalesManual: error handling requestEdit", err);
//     }
//   }

//   document.addEventListener("salesManual:requestEdit", onRequestEdit as EventListener);
//   return () => document.removeEventListener("salesManual:requestEdit", onRequestEdit as EventListener);
// }, []);




//   useEffect(() => {
//     if (controlled) setActive(selectedSubTab ?? "Reps Checklist");
//   }, [selectedSubTab, controlled]);

//   const [modalState, setModalState] = useState<{
//     open: boolean;
//     mode: "add" | "edit";
//     type: "repsChecklist" | "fundamentalScript";
//     initial?: any;
//   }>({ open: false, mode: "add", type: "repsChecklist" });

//   // track whether the currently active tab has items — children will call this
//   const [activeHasItems, setActiveHasItems] = useState<boolean>(true);

//   function openAddForActive() {
//     const t = active === "Reps Checklist" ? "repsChecklist" : active === "Fundamental Scripts" ? "fundamentalScript" : "repsChecklist";
//     setModalState({ open: true, mode: "add", type: t });
//   }

//   function openEditForChecklist(item: { category: string; task: string }) {
//     console.log("SalesManual: openEditForChecklist", item);
//     setModalState({ open: true, mode: "edit", type: "repsChecklist", initial: item });
//   }

//   function openEditForScript(item: { term: string; script: string }) {
//     console.log("SalesManual: openEditForScript", item);
//     setModalState({ open: true, mode: "edit", type: "fundamentalScript", initial: item });
//   }

//   function getAddLabel(tabName: string) {
//     if (tabName === "Reps Checklist") return "Add Checklist Item";
//     if (tabName === "Fundamental Scripts") return "Add Fundamental Script";
//     return `Add ${tabName || "Item"}`;
//   }

//   useEffect(() => {
//     console.log("SalesManual render:", { selectedSubTab, controlled, active, modalState, activeHasItems });
//   }, [selectedSubTab, controlled, active, modalState, activeHasItems]);

//   return (
//     <div className="w-full">
//       <div className="flex items-center justify-between mb-6 sm:mt-6 2xl:mt-12">
//         {/* explicit fallback so heading never disappears */}
//         <h2 className="txt-24 font-semibold" style={{ color: "black" }}>
//           {active || "Reps Checklist"}
//         </h2>

//         <div className="flex items-center gap-4">
//           {/* show Add button for checklist & scripts (don't hide it purely because a child reports "no items") */}
//           {active !== "Sales Bible" && (
//             <button onClick={openAddForActive} className="px-4 py-2 bg-[#25292A] text-white rounded-lg txt-16">
//               {getAddLabel(active)}
//             </button>
//           )}
//         </div>
//       </div>

//       <div>
//         {active === "Reps Checklist" && (
//           <RepsChecklist
//             onHasItemsChange={(has) => {
//               console.log("SalesManual: RepsChecklist onHasItemsChange", has);
//               setActiveHasItems(has);
//             }}
//             onAdd={() => setModalState({ open: true, mode: "add", type: "repsChecklist" })}
//             onEdit={(it) => openEditForChecklist(it)}
//           />
//         )}

//         {active === "Fundamental Scripts" && (
//           <FundamentalScripts
//             onHasItemsChange={(has) => {
//               console.log("SalesManual: FundamentalScripts onHasItemsChange", has);
//               setActiveHasItems(has);
//             }}
//             onAdd={() => setModalState({ open: true, mode: "add", type: "fundamentalScript" })}
//             onEdit={(it) => openEditForScript(it)}
//           />
//         )}

//         {active === "Sales Bible" && <SalesBible onHasItemsChange={(has: boolean) => setActiveHasItems(has)} />}
//       </div>

//       <AddEditSalesModal
//         open={modalState.open}
//         mode={modalState.mode}
//         type={modalState.type}
//         initial={modalState.initial}
//         onClose={() => setModalState((s) => ({ ...s, open: false }))}
//         onSave={(payload) => {
//           console.log("AddEditSalesModal saved payload", payload);
//         }}
//       />
//     </div>
//   );
// }





"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// import sub-component files (make sure these exist as component files — RepsChecklist, SalesBible follow same pattern)
import RepsChecklist from "./reps-checklist/RepsChecklist";
import FundamentalScripts from "./fundamental-scripts/FundamentalScripts";
import SalesBible from "./sales-bible/SalesBible";
import AddEditSalesModal from "./AddEditSalesModal";

const TABS = ["Reps Checklist", "Fundamental Scripts", "Sales Bible"] as const;
type TabName = (typeof TABS)[number];

function isValidTab(t?: string): t is TabName {
  return !!t && (TABS as readonly string[]).includes(t);
}

export default function SalesManual() {
  const searchParams = useSearchParams();
  const selectedSubTab = searchParams?.get("tab") ?? undefined;

  const controlled = isValidTab(selectedSubTab);
  const [active, setActive] = useState<TabName>(() =>
    isValidTab(selectedSubTab) ? (selectedSubTab as TabName) : TABS[0]
  );

  useEffect(() => {
    if (controlled && isValidTab(selectedSubTab)) setActive(selectedSubTab as TabName);
  }, [selectedSubTab, controlled]);

  // modal state
  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: "add" | "edit";
    type: "repsChecklist" | "fundamentalScript";
    initial?: any;
  }>({ open: false, mode: "add", type: "repsChecklist" });

  const [activeHasItems, setActiveHasItems] = useState<boolean>(true);

  function openAddForActive() {
    const t =
      active === "Reps Checklist"
        ? "repsChecklist"
        : active === "Fundamental Scripts"
        ? "fundamentalScript"
        : "repsChecklist";
    setModalState({ open: true, mode: "add", type: t });
  }

  function openEditForChecklist(item: { category: string; task: string }) {
    setModalState({ open: true, mode: "edit", type: "repsChecklist", initial: item });
  }

  function openEditForScript(item: { term: string; script: string }) {
    setModalState({ open: true, mode: "edit", type: "fundamentalScript", initial: item });
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 sm:mt-6 2xl:mt-12">
        <h2 className="txt-24 font-semibold" style={{ color: "black" }}>
          {active || "Reps Checklist"}
        </h2>

        <div className="flex items-center gap-4">
          {active !== "Sales Bible" && (
            <button onClick={openAddForActive} className="px-4 py-2 bg-[#25292A] text-white rounded-lg txt-16">
              {active === "Reps Checklist" ? "Add Checklist Item" : active === "Fundamental Scripts" ? "Add Fundamental Script" : `Add ${active}`}
            </button>
          )}
        </div>
      </div>

      <div>
        {active === "Reps Checklist" && (
          <RepsChecklist
            onHasItemsChange={(has) => setActiveHasItems(has)}
            onAdd={() => setModalState({ open: true, mode: "add", type: "repsChecklist" })}
            onEdit={(it) => openEditForChecklist(it)}
          />
        )}

        {active === "Fundamental Scripts" && (
          <FundamentalScripts
            onHasItemsChange={(has) => setActiveHasItems(has)}
            onAdd={() => setModalState({ open: true, mode: "add", type: "fundamentalScript" })}
            onEdit={(it) => openEditForScript(it)}
          />
        )}

        {active === "Sales Bible" && <SalesBible onHasItemsChange={(has: boolean) => setActiveHasItems(has)} />}
      </div>

      <AddEditSalesModal
        open={modalState.open}
        mode={modalState.mode}
        type={modalState.type}
        initial={modalState.initial}
        onClose={() => setModalState((s) => ({ ...s, open: false }))}
        onSave={(payload) => {
          console.log("AddEditSalesModal saved payload", payload);
        }}
      />
    </div>
  );
}
