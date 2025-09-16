// src\app\(dashboard)\dashboard\daily-content\quotes\page.tsx
"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useToastContext } from "../../lib/ToastContext";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import ConfirmModal from "../../components/ConfirmModal";
import BaseModal from "../../components/BaseModal";
import QuotesTable from "./QuotesTable";
import AddEditItem from "../AddEditItem";
import EmptyState from "../../components/EmptyState";
import { INITIAL_QUOTES, type QuoteItem } from "../data";

type EmptyStateConfig = {
  icon?: string;
  title?: string;
  subtitle?: string;
  actionLabel?: string;
};

export default function QuotesPage({
  emptyStateConfig,
}: {
  emptyStateConfig?: EmptyStateConfig;
}) {
  const { showToast } = useToastContext();
  const [items, setItems] = useState<QuoteItem[]>(INITIAL_QUOTES);

  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<QuoteItem | null>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; quote?: QuoteItem }>({
    open: false,
  });

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
  }, [filtered.length, rowsPerPage, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + rowsPerPage);

  const handleAddOrUpdate = (payload: {
    text: string;
    scheduleDate: string;
  }) => {
    if (editing) {
      setItems((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...payload } : p))
      );
      setEditing(null);
      setAddOpen(false);
      showToast("Quote has been updated.", "success");
      return;
    }
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setItems((prev) => [{ id, ...payload }, ...prev]);
    setAddOpen(false);
    setCurrentPage(1);
    showToast("Quote has been added.", "success");
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((q) => q.id !== id));
    setConfirm({ open: false });
    showToast("Quote has been deleted.", "info");
  };

  // local action button for empty state (wired to local setAddOpen)
  const emptyAction = (
    <button
      onClick={() => setAddOpen(true)}
      className="px-4 py-2 rounded-lg bg-[#25292A] text-white"
    >
      {emptyStateConfig?.actionLabel ?? "Add Quote"}
    </button>
  );

  const effectiveEmptyState = (
    <EmptyState
      icon={emptyStateConfig?.icon}
      title={emptyStateConfig?.title ?? "No quotes"}
      subtitle={emptyStateConfig?.subtitle ?? ""}
      action={emptyAction}
    />
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 sm:mt-6 2xl:mt-12">
        <h2 className="txt-24 font-semibold">Quotes</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setEditing(null);
              setAddOpen(true);
            }}
            className="px-4 py-2 bg-[#25292A] text-white rounded-lg txt-16"
          >
            Add Quote
          </button>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mb-4">
          <SearchBar
            value={searchQuery}
            onChange={(v) => {
              setSearchQuery(v);
              setCurrentPage(1);
            }}
            placeholder="Search quotes"
          />
        </div>
      )}

      <div className="bg-white rounded shadow- sm overflow-hidden">
        <QuotesTable
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
          className="w-[486px] h-auto overflow-visible rounded-xl"
          onClose={() => {
            setAddOpen(false);
            setEditing(null);
          }}
        >
          <AddEditItem
            initial={
              editing
                ? { text: editing.text, scheduleDate: editing.scheduleDate }
                : null
            }
            mode={editing ? "edit" : "add"}
            onCancel={() => {
              setAddOpen(false);
              setEditing(null);
            }}
            onSave={(p) => handleAddOrUpdate(p)}
            label="Quote"
          />
        </BaseModal>
      )}

      <ConfirmModal
        open={confirm.open}
        title="Delete quote"
        description={
          confirm.quote
            ? "This will permanently delete the quote from the list."
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
