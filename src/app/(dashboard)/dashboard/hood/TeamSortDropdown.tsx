// src\app\(dashboard)\dashboard\hood\TeamSortDropdown.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GoChevronDown } from "react-icons/go";


export default function TeamSortDropdown({
  value,
  onChange,
  options,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function onDocClick(e: Event) {
      const target = e.target as Node | null;
      if (
        target &&
        !menuRef.current?.contains(target) &&
        !btnRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const highlighted = open || focused;

  const focusMenuItem = (idx: number) => {
    const items =
      menuRef.current?.querySelectorAll<HTMLButtonElement>("[role='menuitem']");
    const el = items?.[idx];
    el?.focus();
  };

  return (
    <div
      className={className}
      style={{ width: 180, height: 40, position: "relative" }}
    >
      <label className="sr-only">Filter by team</label>

      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          setOpen((s) => !s);
          if (!open) setTimeout(() => focusMenuItem(0), 0);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((s) => !s);
            if (!open) setTimeout(() => focusMenuItem(0), 0);
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setTimeout(() => focusMenuItem(0), 0);
          }
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full min-w-[180px] h-full flex items-center justify-between px-4 txt-14 rounded-lg focus:outline-none "
        style={{
          background: "#FFFFFF",
          border: highlighted
            ? "1px solid var(--Secondary-action, #00C47E)"
            : "1px solid #E9EDEE",
          boxShadow: highlighted
            ? "0 6px 18px rgba(0,196,126,0.08)"
            : undefined,
          color: "#111827",
          height: 40,
        }}
      >
        <span className="truncate text-[#51595A]">
          {options.find((o) => o.value === value)?.label ?? "All Team"}
        </span>

        <div
          style={{
            width: 24,
            height: 24,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 160ms ease",
          }}
          aria-hidden
          className="flex items-center justify-center"
        >
          <div
            className={`transform transition-transform  ${
              open ? "rotate-0" : ""
            }`}
          >
            {/* <Image
              src="/arrow-down.svg"
              alt="Caret"
              width={24}
              height={24}
              //   className={` ${open ? "rotate-180" : ""}`}
            /> */}
            <GoChevronDown className="text-[#51595A]" size={24} />
          </div>
        </div>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Team options"
          className="absolute top-11 right-0  w-full min-w-[180px] max-h-[150px] bg-white rounded-lg shadow-sm z-[60] overflow-auto"
          style={{
            border: "1px solid #E9EDEE",
          }}
          onKeyDown={(e) => {
            const items = Array.from(
              menuRef.current?.querySelectorAll<HTMLButtonElement>(
                "[role='menuitem']"
              ) || []
            );
            if (!items.length) return;
            const active = document.activeElement as HTMLElement | null;
            const idx = items.findIndex((it) => it === active);

            if (e.key === "ArrowDown") {
              e.preventDefault();
              const next = items[(idx + 1) % items.length];
              next.focus();
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              const prev = items[(idx - 1 + items.length) % items.length];
              prev.focus();
            } else if (e.key === "Escape") {
              setOpen(false);
              btnRef.current?.focus();
            }
          }}
        >
          {options.map((opt, i) => (
            <React.Fragment key={opt.value}>
              <button
                role="menuitem"
                data-index={i}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm bg-transparent hover:bg-[#F7F8F8] focus:outline-none"
                style={{ color: "#51595A" }}
              >
                {opt.label}
              </button>
              {i < options.length - 1 && (
                <div aria-hidden className="h-[1px] w-full bg-[#E9EDEE]" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
