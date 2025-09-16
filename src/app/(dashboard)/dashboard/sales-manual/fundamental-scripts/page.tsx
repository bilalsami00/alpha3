// // src\app\(dashboard)\dashboard\sales-manual\fundamental-scripts\page.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
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

// type Script = { id: number; term: string; script: string };
type Script = FundamentalScript;

export default function FundamentalScripts({
  onHasItemsChange,
  onAdd,
  onEdit,
}: {
  onHasItemsChange?: (has: boolean) => void;
  onAdd?: () => void;
  //   onEdit?: (initialValue: string) => void;
  onEdit?: (item: { term: string; script: string }) => void;
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

  useEffect(() => {
    function onSaved(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (!detail || detail.type !== "fundamentalScript") return;

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
        setItems((p) => {
          const idx = p.findIndex(
            (x) =>
              (init && x.script === init) || x.term === (init?.term ?? init)
          );
          if (idx === -1) return p;
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

    document.addEventListener("salesManual:itemSaved", onSaved as EventListener);
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

  // OPTIONAL: log mount + whether parent handlers exist
  useEffect(() => {
    console.log("FundamentalScripts mounted. onAdd present?", !!onAdd, "onEdit present?", !!onEdit);
  }, []);

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
      width: "420px",
      render: (r) => <div className="txt-14">{r.term}</div>,
    },
    {
      key: "script",
      header: "Fundamental Script",
      width: "800px",
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
            console.log("FundamentalScripts: edit clicked", r);
            if (onEdit) {
              onEdit({ term: r.term, script: r.script });
            } else {
              // fallback: open local modal and dispatch a request event
              console.log("FundamentalScripts: onEdit prop missing — opening fallback local modal and dispatching salesManual:requestEdit");
              setFallbackMode("edit");
              setFallbackInitial({ term: r.term, script: r.script });
              setFallbackModalOpen(true);

              document.dispatchEvent(
                new CustomEvent("salesManual:requestEdit", {
                  detail: { type: "fundamentalScript", item: { term: r.term, script: r.script } },
                })
              );
              showToast("Edit requested (fallback)", "info");
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
    showToast("Fundamental script deleted.", "info");
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
      className="px-4 py-2 rounded-lg bg-[#25292A] text-white"
    >
      {/* Add Script */}
      Add Fundamental Scripts
    </button>
  );

  return (
    <div>
      {/* If parent did not render header/add, show a local header and Add button */}
      {!onAdd && (
        <div className="flex items-center justify-between mb-6 sm:mt-6 2xl:mt-12">
          {/* <div className="flex-1"> */}
            <h2 className="txt-24 font-semibold" style={{ color: "black" }}>
              Fundamental Scripts
            </h2>
          {/* </div> */}
          <div>
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
          </div>
        </div>
      )}

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

      {/* Fallback local modal — only used when parent handlers are absent */}
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
        onSave={(payload) => {
          // dispatch the same global event your other components expect
          const detail = {
            type: "fundamentalScript",
            mode: fallbackMode,
            value: payload,
            initialValue: fallbackInitial,
          };
          document.dispatchEvent(new CustomEvent("salesManual:itemSaved", { detail }));

          // defensively update local items so UI updates immediately
          if (fallbackMode === "add") {
            if (payload && typeof payload === "object") {
              setItems((p) => [
                { id: Date.now(), term: String(payload.term).slice(0, 40), script: String(payload.script) },
                ...p,
              ]);
            } else if (typeof payload === "string") {
              setItems((p) => [{ id: Date.now(), term: String(payload).slice(0, 40), script: String(payload) }, ...p]);
            }
          } else {
            // edit: attempt to update matching item
            setItems((p) => {
              const next = [...p];
              const idx = next.findIndex((x) => x.term === (fallbackInitial?.term ?? fallbackInitial));
              if (idx !== -1) {
                next[idx] = {
                  ...next[idx],
                  term: typeof payload === "object" ? String(payload.term) : String(payload),
                  script: typeof payload === "object" ? String(payload.script) : String(payload),
                };
              }
              return next;
            });
          }

          setFallbackModalOpen(false);
        }}
      />
    </div>
  );
}
