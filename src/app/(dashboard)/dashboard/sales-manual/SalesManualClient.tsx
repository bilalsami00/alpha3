"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import RepsChecklist from "./reps-checklist/RepsChecklist";
import FundamentalScripts from "./fundamental-scripts/FundamentalScripts";
import SalesBible from "./sales-bible/SalesBible";
import AddEditSalesModal from "./AddEditSalesModal";

const TABS = ["Reps Checklist", "Fundamental Scripts", "Sales Bible"] as const;
type TabName = (typeof TABS)[number];

function isValidTab(t?: string): t is TabName {
  return !!t && (TABS as readonly string[]).includes(t);
}

export default function SalesManualClient() {
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
