// src\app\(dashboard)\dashboard\hall-of-fame\TeamFilter.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import SearchBar from "../components/SearchBar";
import { GoChevronDown } from "react-icons/go";
import type { Team } from "../team-management/types";

type Props = {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  selectedTeam: string; // team id as string ("" for all)
  onTeamChange: (v: string) => void;
  teams: Team[]; // array of { id, name, memberCount? }
  addLabel?: string;
  onAdd?: () => void;
};

export default function TeamFilter({
  searchQuery,
  onSearchChange,
  selectedTeam,
  onTeamChange,
  teams,
  addLabel = "Add to Hall of Fame",
  onAdd,
}: Props) {
  // dropdown state for teams
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

  const options = [
    { id: "", name: "All teams" },
    ...teams.map((t) => ({ id: String(t.id), name: t.name })),
  ];

  const label = options.find((o) => o.id === selectedTeam)?.name ?? "All teams";

  const focusMenuItem = (idx: number) => {
    const items =
      menuRef.current?.querySelectorAll<HTMLButtonElement>("[role='menuitem']");
    const el = items?.[idx];
    el?.focus();
  };

  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
      <div className="flex-1 min-w-0">
        <SearchBar
          value={searchQuery}
          onChange={(v: string) => onSearchChange(v)}
          placeholder="Search team members"
        />
      </div>

      <div className="mt-2 sm:mt-0 flex items-center gap-3">
        <label className="sr-only">Filter by team</label>

        {/* Team dropdown styled like StatusDropdown */}
        <div style={{ width: 180, height: 40, position: "relative" }}>
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
            className="w-full min-w-[180px] h-full flex items-center justify-between px-4 text-sm rounded-lg focus:outline-none"
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
            <span className="truncate">{label}</span>

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
              <GoChevronDown size={20} />
            </div>
          </button>

          {/* stacked menu */}
          {open && (
            <div
              ref={menuRef}
              role="menu"
              aria-label="Team options"
              className="absolute top-11 right-0 w-[180px] bg-white rounded-lg shadow-sm z-[60] overflow-hidden"
              style={{
                border: "1px solid #E9EDEE",
                // paddingTop: 8,
                // paddingBottom: 8,
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
                <React.Fragment key={opt.id || "__all__"}>
                  <button
                    role="menuitem"
                    data-index={i}
                    onClick={() => {
                      onTeamChange(opt.id);
                      setOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm bg-transparent hover:bg-[#F7F8F8] focus:outline-none"
                    style={{ color: "#111827" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="truncate">{opt.name}</div>
                    </div>
                  </button>

                  {i < options.length - 1 && (
                    <div aria-hidden className="h-[1px] w-full bg-[#E9EDEE]" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
