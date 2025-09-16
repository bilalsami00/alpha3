// // src\app\(dashboard)\dashboard\sales-manual\sales-bible\page.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import EmptyState from "../../components/EmptyState";
import ConfirmModal from "../../components/ConfirmModal";
import Image from "next/image";
import { useToastContext } from "../../lib/ToastContext";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

type FileMeta = { name: string; uploadedAt: string; size: number } | null;

type Props = {
  onHasItemsChange?: (has: boolean) => void;
};

export default function SalesBible({ onHasItemsChange }: Props) {
  const [file, setFile] = useState<FileMeta>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { showToast } = useToastContext();

  useEffect(() => {
    onHasItemsChange?.(!!file);
  }, [file, onHasItemsChange]);

  function openFilePicker() {
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const f = e.target.files?.[0];
    if (!f) return;

    if (
      f.type !== "application/pdf" &&
      !f.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF files are allowed.");
      return;
    }

    if (f.size > MAX_BYTES) {
      setError("File is too large. Maximum allowed size is 10MB.");
      return;
    }

    setFile({
      name: f.name,
      uploadedAt: new Date().toISOString(),
      size: f.size,
    });
  }

  function handleReplace() {
    openFilePicker();
  }

  function handleDeleteConfirmed() {
    setFile(null);
    setConfirmDeleteOpen(false);
    setError(null);
    showToast("Sales Bible deleted", "success");
  }

  const uploadBtn = (
    <button
      onClick={openFilePicker}
      className="px-4 py-2 rounded-lg bg-[#25292A] text-white txt-16"
    >
      Upload Sales Bible
    </button>
  );

  return (
    <>
      <div className="mb-6 sm:mt-6 2xl:mt-12">
        <h2 className="txt-24 font-semibold text-black">Sales Bible</h2>

        <div className="mt-4 bg-white rounded-lg dashed-figma gap-6 w-full overflow-hidden p-6">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          {!file ? (
            <EmptyState
              className="!h-[328px]"
              title="No Sales Bible uploaded yet"
              subtitle="Upload your company's official Sales Bible document"
              action={uploadBtn}
              icon="/dashboardIcons/SalesManual/sales-bible.svg"
              subsubtitle="Supported format: PDF (Max size: 10MB)"
            />
          ) : (
            <EmptyState
              className="!h-[328px]"
              title="No Sales Bible uploaded yet"
              subtitle="Upload your company's official Sales Bible document"
              action={
                <button
                  disabled
                  className="px-4 py-2 rounded-lg bg-[#E9ECEC] text-[#B6B6B6] txt-16"
                >
                  Upload Sales Bible
                </button>
              }
              icon="/dashboardIcons/SalesManual/sales-bible.svg"
              subsubtitle="Supported format: PDF (Max size: 10MB)"
            />
          )}
        </div>
      </div>

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      {file && (
        <div className="mt-6 bg-[#F2F5F6] rounded-lg p-4 flex items-center gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-[#4DF15E14] rounded ">
              <Image
                src="/dashboardIcons/SalesManual/sales-manual.svg"
                alt="icon"
                width={24}
                height={24}
              />
            </div>

            <div className=" gap-3 flex flex-col">
              <div className="">
                <div className="font-medium txt-16">{file.name}</div>
                <div className="txt-14 text-[#6B6F72] font-normal">
                  Uploaded on {new Date(file.uploadedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReplace}
                  className="px-4 py-2 rounded-lg font-semibold bg-[#25292A] text-white txt-16"
                >
                  Replace Document
                </button>

                <button
                  onClick={() => setConfirmDeleteOpen(true)}
                  className="px-4 py-2 rounded-lg bg-white font-semibold border flex border-[#E9EDEE] text-[#F14D4D] txt-16"
                >
                  <Image
                    src="/dashboardIcons/trash.svg"
                    alt="Delete"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmDeleteOpen}
        title="Are you sure you want to delete the Sales Bible?"
        description="This document will be permanently removed and won’t be accessible to sales reps. You can upload a new one anytime."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        intent="danger"
        actionType="delete"
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDeleteConfirmed}
      />
    </>
  );
}
