// src\app\(dashboard)\dashboard\daily-content\buzzwords\Buzzwords.tsx
"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useToastContext } from "../../lib/ToastContext";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import EmptyState from "../../components/EmptyState";
import ConfirmModal from "../../components/ConfirmModal";
import BaseModal from "../../components/BaseModal";
import BuzzwordsTable from "./BuzzwordsTable";
import AddEditItem from "../AddEditItem";
import { INITIAL_BUZZWORDS, type QuoteItem } from "../data";

type EmptyStateConfig = {
  icon?: string;
  title?: string;
  subtitle?: string;
  actionLabel?: string;
};

export default function Buzzwords({
  emptyStateConfig,
}: {
  emptyStateConfig?: EmptyStateConfig;
}) {
  const { showToast } = useToastContext();
  const [items, setItems] = useState<QuoteItem[]>(INITIAL_BUZZWORDS);

  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<QuoteItem | null>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; quote?: QuoteItem }>(
    { open: false }
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => it.text.toLowerCase().includes(q));
  }, [items, searchQuery]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  useEffect(() => {
    if (filtered.length === 0) setCurrentPage(1);
    else if (currentPage > totalPages) setCurrentPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, rowsPerPage, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + rowsPerPage);

  const handleAddOrUpdate = (payload: { text: string; scheduleDate: string }) => {
    if (editing) {
      setItems((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...payload } : p))
      );
      setEditing(null);
      setAddOpen(false);
      showToast("Buzzword has been updated.", "success");
      return;
    }
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setItems((prev) => [{ id, ...payload }, ...prev]);
    setAddOpen(false);
    setCurrentPage(1);
    showToast("Buzzword has been added.", "success");
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((q) => q.id !== id));
    setConfirm({ open: false });
    showToast("Buzzword has been deleted.", "info");
  };

  const emptyAction = (
    <button
      onClick={() => {
        setEditing(null);
        setAddOpen(true);
      }}
      className="px-4 py-2 rounded-lg bg-[#25292A] text-white"
    >
      {emptyStateConfig?.actionLabel ?? "Add Buzzword"}
    </button>
  );

  const effectiveEmptyState = (
    <EmptyState
      icon={emptyStateConfig?.icon}
      title={emptyStateConfig?.title ?? "No buzzwords yet"}
      subtitle={emptyStateConfig?.subtitle ?? "Add a buzzword to populate this list."}
      action={emptyAction}
    />
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 sm:mt-6 2xl:mt-12">
        <h2 className="txt-24 font-semibold">Buzzwords</h2>
          <div className="flex items-center gap-4">
          {items.length > 0 && (
            <button
            onClick={() => {
              setEditing(null);
              setAddOpen(true);
            }}
            className="px-4 py-2 bg-[#25292A] text-white rounded-lg txt-16"
          >
            Add Buzzword
          </button>
        )}
        </div>
      </div>

      {items.length > 0 && (
        <div className="mb-4 ">
          <SearchBar
            value={searchQuery}
            onChange={(v) => {
              setSearchQuery(v);
              setCurrentPage(1);
            }}
            placeholder="Search buzzwords"
          />
        </div>
      )}

      <div className="bg-white rounded shadow- sm overflow-hidden">
        <BuzzwordsTable
          paginated={paginated}
          startIndex={startIndex}
          onEdit={(q) => {
            setEditing(q);
            setAddOpen(true);
          }}
          onDelete={(q) => setConfirm({ open: true, quote: q })}
          emptyState={effectiveEmptyState}
        />

        {totalItems > 0 && (
          <div className="">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) =>
                setCurrentPage(Math.max(1, Math.min(totalPages, p)))
              }
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(n) => {
                setRowsPerPage(n);
                setCurrentPage(1);
              }}
              totalItems={totalItems}
            />
          </div>
        )}
      </div>

      {addOpen && (
        <BaseModal
          className="w-[486px] h-auto"
          onClose={() => {
            setAddOpen(false);
            setEditing(null);
          }}
        >
          <AddEditItem
            initial={
              editing ? { text: editing.text, scheduleDate: editing.scheduleDate } : null
            }
            mode={editing ? "edit" : "add"}
            onCancel={() => {
              setAddOpen(false);
              setEditing(null);
            }}
            onSave={(p) => handleAddOrUpdate(p)}
            label="Buzzword"
            compact={true}
          />
        </BaseModal>
      )}

      <ConfirmModal
        open={confirm.open}
        title="Delete buzzword"
        description={
          confirm.quote
            ? "This will permanently delete the buzzword from the list."
            : ""
        }
        confirmLabel="Delete"
        intent="danger"
        onCancel={() => setConfirm({ open: false })}
        onConfirm={() => confirm.quote && handleDelete(confirm.quote.id)}
      />
    </div>
  );
}
