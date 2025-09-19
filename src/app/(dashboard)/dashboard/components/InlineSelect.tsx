// src\app\(dashboard)\dashboard\components\InlineSelect.tsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

export type InlineSelectProps<T> = {
  value: T | null;
  onChange: (v: T | null) => void;
  /** items to render in the dropdown */
  items: T[];
  /** render a single item (also used to render the current value inside the trigger) */
  renderItem: (it: T | null) => React.ReactNode;
  placeholder?: string;
  /** optional classname to apply to the trigger button */
  triggerClassName?: string;
  /** optional classname to apply to the dropdown container */
  dropdownClassName?: string;
  /** maximum height (CSS) for dropdown */
  maxHeight?: string;
  /** whether to show the caret icon */
  showCaret?: boolean;
};

/**
 * Shared InlineSelect component
 * - Works entirely inside the modal (no portal)
 * - Opening uses a global "hall:openInlineSelect" event with an instance id
 *   so other selects can close and the clicked select opens immediately
 * - Closes on pointerdown outside, focusin outside, or when the global
 *   "hall:closeInlineSelects" event is dispatched
 */
export default function InlineSelect<T>({
  value,
  onChange,
  items,
  renderItem,
  placeholder = "Select",
  triggerClassName = "",
  dropdownClassName = "",
  maxHeight = "16rem",
  showCaret = true,
}: InlineSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // stable id for this instance
  const idRef = useRef<string>(`inline-select-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    function handleOpen(ev: Event) {
      const detail = (ev as CustomEvent)?.detail;
      if (!detail || typeof detail.id !== "string") return;
      const shouldOpen = detail.id === idRef.current;
      setOpen(shouldOpen);
      setFocused(shouldOpen);
    }

    function handleClose() {
      setOpen(false);
      setFocused(false);
    }

    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    }

    function onFocusIn(e: FocusEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    }

    document.addEventListener("hall:openInlineSelect", handleOpen as EventListener);
    document.addEventListener("hall:closeInlineSelects", handleClose as EventListener);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);

    return () => {
      document.removeEventListener("hall:openInlineSelect", handleOpen as EventListener);
      document.removeEventListener("hall:closeInlineSelects", handleClose as EventListener);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, []);

  const active = open || focused;

  return (
    <div className="relative" ref={rootRef} data-hall-inline-select-id={idRef.current}>
      <button
        type="button"
        onMouseDown={(e) => {
          // stop propagation to avoid outer handlers interfering while still letting document pointer events run
          e.stopPropagation();
          if (open) {
            document.dispatchEvent(new CustomEvent("hall:closeInlineSelects"));
          } else {
            document.dispatchEvent(new CustomEvent("hall:openInlineSelect", { detail: { id: idRef.current } }));
          }
        }}
        onFocus={() => {
          document.dispatchEvent(new CustomEvent("hall:openInlineSelect", { detail: { id: idRef.current } }));
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full text-left p-3 rounded-lg bg-[#F2F5F6] txt-12 flex items-center justify-between ${triggerClassName}`}
        style={active ? { border: "1px solid var(--Secondary-action, #00C47E)" } : { border: "1px solid transparent" }}
      >
        <div className={`${value ? "text-[#111827]" : "text-[#9CA3AF]"}`}>{value ? renderItem(value) : placeholder}</div>
        {showCaret && (
          <div className={`transform transition-transform ${open ? "rotate-180" : ""}`}>
            {/* <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 9l6 6 6-6" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg> */}
            <Image
              src="/arrow-down.svg"
              alt="Caret"
              width={24}
              height={24}
            //   className={` ${open ? "rotate-180" : ""}`}
              />
          </div>
        )}
      </button>

      {open && (
        <div
          role="listbox"
          tabIndex={-1}
          className={`mt-2 w-full bg-[#F2F5F6] border border-[color:var(--Neutral-Grey-20,#E9EDEE)] rounded-lg shadow-sm overflow-auto custom-scroll ${dropdownClassName}`}
          style={{ boxShadow: "0 6px 24px rgba(0,0,0,0.08)", maxHeight }}
        >
          {items.map((it, idx) => (
            <button
              key={idx}
              type="button"
              onMouseDown={(ev) => {
                ev.stopPropagation();
                onChange(it);
                // close all selects after selecting
                document.dispatchEvent(new CustomEvent("hall:closeInlineSelects"));
              }}
              className="w-full text-left px-3 py-4 hover:bg-[#dde2e3] txt-12 flex items-center border-b border-[color:var(--Neutral-Grey-20,#D8DFE0)]"
            >
              {renderItem(it)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
