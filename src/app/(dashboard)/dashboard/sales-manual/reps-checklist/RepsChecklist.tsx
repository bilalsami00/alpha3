// src\app\(dashboard)\dashboard\sales-manual\reps-checklist\RepsChecklist.tsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import SearchBar from "../../components/SearchBar";
import GenericTable, { Column } from "../../components/GenericTable";
import Pagination from "../../components/Pagination";
import EmptyState from "../../components/EmptyState";
import { EMPTY_ICONS } from "../../components/emptyIcons";
import ConfirmModal from "../../components/ConfirmModal";
import { useToastContext } from "../../lib/ToastContext";
import ActionMenu from "../ActionMenu";
import AddEditSalesModal from "../AddEditSalesModal";
import { INITIAL_REPS, RepChecklistItem } from "../salesdata";

type Item = RepChecklistItem;

export default function RepsChecklist({
  onHasItemsChange,
  onAdd,
  onEdit,
}: {
  onHasItemsChange?: (has: boolean) => void;
  onAdd?: () => void;
  onEdit?: (item: { id?: number; category: string; task: string }) => void;
}) {
  const { showToast } = useToastContext();
  const [items, setItems] = useState<Item[]>(INITIAL_REPS);
  const [query, setQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<{ open: boolean; id?: number }>({
    open: false,
  });

  // Fallback local modal state (used only when parent onAdd/onEdit not supplied)
  const [fallbackModalOpen, setFallbackModalOpen] = useState(false);
  const [fallbackMode, setFallbackMode] = useState<"add" | "edit">("add");
  const [fallbackInitial, setFallbackInitial] = useState<any>(null);

  const processedEventIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    onHasItemsChange?.(items.length > 0);
  }, [items.length, onHasItemsChange]);

  useEffect(() => {
    function onSaved(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (!detail || detail.type !== "repsChecklist") return;

      const eventId = detail?.eventId?.toString?.() ?? null;
      if (eventId && processedEventIds.current.has(eventId)) return;
      if (eventId) processedEventIds.current.add(eventId);

      const { mode: savedMode, value } = detail;
      if (savedMode === "add" && Array.isArray(value)) {
        setItems((p) => [
          ...value.map((r: any, i: number) => ({
            id: Date.now() + i,
            category: r.category || "Uncategorized",
            task: r.task || "",
          })),
          ...p,
        ]);
        showToast("Checklist task added.", "success");
      } else if (savedMode === "edit" && Array.isArray(value)) {
        setItems((p) => {
          const next = [...p];
          value.forEach((r: any) => {
            const idFromDetail = r.id ?? undefined;
            const idx =
              idFromDetail !== undefined
                ? next.findIndex((x) => x.id === idFromDetail)
                : next.findIndex((x) => x.task === r.task);
            if (idx !== -1) {
              next[idx] = { ...next[idx], category: r.category, task: r.task };
            } else {
              // if no match found for edit, skip (avoid creating duplicates)
            }
          });
          return next;
        });
        showToast("Checklist task updated.", "success");
      }
    }

    document.addEventListener(
      "salesManual:itemSaved",
      onSaved as EventListener
    );
    return () =>
      document.removeEventListener(
        "salesManual:itemSaved",
        onSaved as EventListener
      );
  }, [showToast]);

  useEffect(() => {
    console.log(
      "RepsChecklist mounted. onAdd present?",
      !!onAdd,
      "onEdit present?",
      !!onEdit
    );
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.category.toLowerCase().includes(q) ||
        it.task.toLowerCase().includes(q)
    );
  }, [items, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const start = (page - 1) * rowsPerPage;
  const pageItems = filtered.slice(start, start + rowsPerPage);

  const columns: Column<Item>[] = [
    {
      key: "category",
      header: "Category",
      width: "502px",
      render: (r) => <div className="txt-14">{r.category}</div>,
    },
    {
      key: "task",
      header: "Checklist Task",
      width: "502px",
      render: (r) => <div className="txt-14">{r.task}</div>,
    },
    {
      key: "action",
      header: "Action",
      width: "100px",
      align: "center",
      render: (r) => (
        <ActionMenu
          onEdit={() => {
            if (onEdit) {
              onEdit({ id: r.id, category: r.category, task: r.task });
            } else {
              setFallbackMode("edit");
              setFallbackInitial({
                id: r.id,
                category: r.category,
                task: r.task,
              });
              setFallbackModalOpen(true);

              document.dispatchEvent(
                new CustomEvent("salesManual:requestEdit", {
                  detail: {
                    type: "repsChecklist",
                    item: { id: r.id, category: r.category, task: r.task },
                  },
                })
              );
            }
          }}
          onDelete={() => setConfirm({ open: true, id: r.id })}
        />
      ),
    },
  ];

  function handleDelete(id?: number) {
    if (!id) return;
    setItems((p) => p.filter((x) => x.id !== id));
    showToast("Reps checklist deleted.", "info"); // <-- add this
    setConfirm({ open: false });
  }

  const emptyAction = (
    <button
      onClick={() => {
        if (onAdd) onAdd();
        else {
          setFallbackMode("add");
          setFallbackInitial(null);
          setFallbackModalOpen(true);
        }
      }}
      className="px-4 py-2 txt-16 rounded-lg bg-[#25292A] text-white"
    >
      Add Checklist Item
    </button>
  );

  return (
    <div>
      {/* {!onAdd && (
        <div className="flex items-center justify-between mb-6 sm:mt-6 2xl:mt-12">
          <h2 className="txt-24 font-semibold" style={{ color: "black" }}>
            Reps Checklist
          </h2>
          <div className="flex items-center gap-4">
            {items.length > 0 && (
              <button
                onClick={() => {
                  setFallbackMode("add");
                  setFallbackInitial(null);
                  setFallbackModalOpen(true);
                }}
                className="px-4 py-2 bg-[#25292A] text-white rounded-lg txt-16"
              >
                Add Checklist Item
              </button>
            )}
          </div>
        </div>
      )} */}
      {/* // find this part in your return() */}
      {!onAdd && (
        <div className="flex items-center justify-between mb-6 sm:mt-6 2xl:mt-12">
          <h2 className="txt-24 font-semibold" style={{ color: "black" }}>
            Reps Checklist
          </h2>
          <div className="flex items-center gap-4">
            {/* ← changed from items.length > 0 */}
            {total > 0 && (
              <button
                onClick={() => {
                  setFallbackMode("add");
                  setFallbackInitial(null);
                  setFallbackModalOpen(true);
                }}
                className="px-4 py-2 bg-[#25292A] text-white rounded-lg txt-16"
              >
                Add Checklist Item
              </button>
            )}
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="mb-4">
          <SearchBar
            value={query}
            onChange={(v) => {
              setQuery(v);
              setPage(1);
            }}
            placeholder="Search by category or checklist"
          />
        </div>
      )}

      <div className="bg-white rounded-lg overflow-auto ">
        <GenericTable<Item>
          columns={columns}
          data={pageItems}
          rowKey={(r) => r.id}
          rowClassName={(r, idx) =>
            idx % 2 === 0 ? "bg-white" : "bg-[#F2F5F6]"
          }
          emptyState={
            <EmptyState
              icon={EMPTY_ICONS.salesManual}
              title="No Reps Checklist Items Yet"
              subtitle="Keep your rookies on track by adding tasks to the Reps Checklist. Categorize and list the essentials they need to complete for success."
              action={emptyAction}
            />
          }
        />

        {total > 0 && (
          <div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) =>
                setPage(Math.max(1, Math.min(totalPages, p)))
              }
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(n) => {
                setRowsPerPage(n);
                setPage(1);
              }}
              totalItems={total}
            />
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirm.open}
        title="Are you sure you want to delete this checklist task?"
        description="This action will permanently remove the task from the selected category. Are you sure you want to proceed?"
        intent="danger"
        confirmLabel="Delete"
        onConfirm={() => handleDelete(confirm.id)}
        onCancel={() => setConfirm({ open: false })}
        fixedSize={{ width: 545, height: 205 }}
      />

      <AddEditSalesModal
        open={fallbackModalOpen}
        mode={fallbackMode}
        type="repsChecklist"
        initial={fallbackInitial}
        onClose={() => {
          setFallbackModalOpen(false);
          setFallbackInitial(null);
          setFallbackMode("add");
        }}
        onSave={() => {
          // modal already dispatched the event (single source). Just close.
          setFallbackModalOpen(false);
        }}
      />
    </div>
  );
}
