// src\app\(dashboard)\dashboard\sales-manual\fundamental-scripts\FundamentalScripts.tsx
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
import AddEditSalesModal from "../AddEditSalesModal"; // fallback modal
import { INITIAL_SCRIPTS, FundamentalScript } from "../salesdata";

type Script = FundamentalScript;

export default function FundamentalScripts({
  onHasItemsChange,
  onAdd,
  onEdit,
}: {
  onHasItemsChange?: (has: boolean) => void;
  onAdd?: () => void;
  onEdit?: (item: { id?: number; term: string; script: string }) => void;
}) {
  const { showToast } = useToastContext();
  const [items, setItems] = useState<Script[]>(INITIAL_SCRIPTS);
  const [q, setQ] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<{ open: boolean; id?: number }>({
    open: false,
  });

  // fallback modal state (used when parent onAdd/onEdit absent)
  const [fallbackModalOpen, setFallbackModalOpen] = useState(false);
  const [fallbackMode, setFallbackMode] = useState<"add" | "edit">("add");
  const [fallbackInitial, setFallbackInitial] = useState<any>(null);

  // guard to prevent processing the same dispatched event twice
  const processedEventIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    function onSaved(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (!detail || detail.type !== "fundamentalScript") return;

      const eventId = detail?.eventId?.toString?.() ?? null;
      if (eventId && processedEventIds.current.has(eventId)) return;
      if (eventId) processedEventIds.current.add(eventId);

      const { mode: savedMode, value, initialValue: init } = detail;

      if (savedMode === "add") {
        if (value && typeof value === "object") {
          setItems((p) => [
            {
              id: Date.now(),
              term: String(value.term).slice(0, 40),
              script: String(value.script),
            },
            ...p,
          ]);
        } else if (typeof value === "string") {
          setItems((p) => [
            {
              id: Date.now(),
              term: String(value).slice(0, 40),
              script: String(value),
            },
            ...p,
          ]);
        }
        showToast("Fundamental script added.", "success");
      } else {
        // EDIT: prefer matching by id, fallback to previous matching logic
        setItems((p) => {
          const idFromValue =
            value && typeof value === "object" ? (value as any).id : undefined;
          const idFromInit = init?.id ?? undefined;
          const idToMatch = idFromValue ?? idFromInit;

          const idx =
            idToMatch !== undefined
              ? p.findIndex((x) => x.id === idToMatch)
              : p.findIndex(
                  (x) =>
                    (init && x.script === init) ||
                    x.term === (init?.term ?? init)
                );

          if (idx === -1) {
            // no matched item to update — do nothing to avoid accidental insertion
            return p;
          }

          const next = [...p];
          next[idx] = {
            ...next[idx],
            term:
              typeof value === "object" ? String(value.term) : String(value),
            script:
              typeof value === "object" ? String(value.script) : String(value),
          };
          return next;
        });
        showToast("Fundamental script updated.", "success");
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

  useEffect(
    () => onHasItemsChange?.(items.length > 0),
    [items.length, onHasItemsChange]
  );

  useEffect(() => {
    console.log(
      "FundamentalScripts mounted. onAdd present?",
      !!onAdd,
      "onEdit present?",
      !!onEdit
    );
  }, [onAdd, onEdit]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter(
      (it) =>
        it.term.toLowerCase().includes(t) || it.script.toLowerCase().includes(t)
    );
  }, [items, q]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const start = (page - 1) * rowsPerPage;
  const pageItems = filtered.slice(start, start + rowsPerPage);

  const columns: Column<Script>[] = [
    {
      key: "term",
      header: "Sales Term",
      width: "502px",
      render: (r) => <div className="txt-14">{r.term}</div>,
    },
    {
      key: "script",
      header: "Fundamental Script",
      width: "502px",
      render: (r) => <div className="txt-14 truncate">{r.script}</div>,
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
              onEdit({ id: r.id, term: r.term, script: r.script });
            } else {
              setFallbackMode("edit");
              setFallbackInitial({ id: r.id, term: r.term, script: r.script });
              setFallbackModalOpen(true);

              document.dispatchEvent(
                new CustomEvent("salesManual:requestEdit", {
                  detail: {
                    type: "fundamentalScript",
                    item: { id: r.id, term: r.term, script: r.script },
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
    showToast("Fundamental script deleted.", "info"); // <-- add this
    setConfirm({ open: false });
  }

  const emptyAction = (
    <button
      onClick={() =>
        onAdd
          ? onAdd()
          : (() => {
              setFallbackMode("add");
              setFallbackInitial(null);
              setFallbackModalOpen(true);
            })()
      }
      className="px-4 py-2 txt-16 rounded-lg bg-[#25292A] text-white"
    >
      Add Fundamental Scripts
    </button>
  );

  return (
    <div>
      {!onAdd && (
        <div className="flex items-center justify-between mb-6 sm:mt-6 2xl:mt-12">
          <h2 className="txt-24 font-semibold" style={{ color: "black" }}>
            Fundamental Scripts
          </h2>
          <div className="flex items-center gap-4">
            {/* {items.length > 0 && ( */}
            {total > 0 && (
              <button
                onClick={() => {
                  setFallbackMode("add");
                  setFallbackInitial(null);
                  setFallbackModalOpen(true);
                }}
                className="px-4 py-2 bg-[#25292A] text-white rounded-lg txt-16"
              >
                Add Fundamental Script
              </button>
            )}
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="mb-4 flex items-center gap-4">
          <div className="flex-1">
            <SearchBar
              value={q}
              onChange={(v) => {
                setQ(v);
                setPage(1);
              }}
              placeholder="Search sales term"
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg overflow-hidden">
        <GenericTable<Script>
          columns={columns}
          data={pageItems}
          rowKey={(r) => r.id}
          rowClassName={(r, idx) =>
            idx % 2 === 0 ? "bg-white" : "bg-[#F2F5F6]"
          }
          emptyState={
            <EmptyState
              icon={EMPTY_ICONS.salesManual}
              title="No Fundamental Scripts Added Yet"
              subtitle="Start building your sales foundation by adding key terms and their response scripts. This will help your reps handle objections with confidence."
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
        title="Are you sure you want to delete this Fundamental Script?"
        description="This action will permanently remove the script. You won’t be able to recover it later."
        intent="danger"
        confirmLabel="Delete"
        onConfirm={() => handleDelete(confirm.id)}
        onCancel={() => setConfirm({ open: false })}
        fixedSize={{ width: 545, height: 205 }}
      />

      <AddEditSalesModal
        open={fallbackModalOpen}
        mode={fallbackMode}
        type="fundamentalScript"
        initial={fallbackInitial}
        onClose={() => {
          setFallbackModalOpen(false);
          setFallbackInitial(null);
          setFallbackMode("add");
        }}
        onSave={() => {
          // modal already dispatches the event (single source). Just close.
          setFallbackModalOpen(false);
        }}
      />
    </div>
  );
}
