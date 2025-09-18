// src/app/(dashboard)/dashboard/components/MediaLibrary/ActionMenuMedia.tsx
"use client";
import React, { useRef, useState, useEffect } from "react";
import { PiDotsThreeOutline } from "react-icons/pi";
import Image from "next/image";

export default function ActionMenuMedia({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (e.target && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="p-1 rounded"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <PiDotsThreeOutline size={24} />
      </button>

      {open && (
        <div 
        // className="fixed right-10 mt-2 w-40 bg-white rounded-md shadow-lg z-50 border border-gray-200"
        className="fixed right-10  rounded-lg bg-white shadow-[4px_4px_40px_0px_#00000005] border border-[var(--Neutral-Grey-0,#F2F5F6)] w-45 max-w-[175px] z-50"
        >
          <div className="py -1">
            <button
              onClick={() => {
                onEdit();
                setOpen(false);
              }}
              // className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 rounded-t-lg hover:bg-gray-100 border-b border-[var(--Neutral-Grey-10,#E9EDEE)]"
            >
              <Image
                src="/dashboardIcons/edit.svg"
                alt="Edit"
                width={18}
                height={18}
                className="mr-2"
              />
              Edit
            </button>
            <button
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              // className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              className="flex items-center w-full h-[44px] text-left px-4 py-2 txt-14 rounded-b-lg hover:bg-gray-100"
            >
              <Image
                src="/dashboardIcons/trash.svg"
                alt="Delete"
                width={18}
                height={18}
                className="mr-2"
              />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
