// // src\app\(dashboard)\dashboard\team-management\TeamMember\TeamMemberSearch.tsx
"use client";

import React from "react";
import SearchBar from "../../components/SearchBar";
import StatusDropdown from "./StatusDropdown";
import type { MemberStatusFilter } from "../types";

export default function TeamMemberSearch({
  value,
  onChange,
  status,
  onStatusChange,
  placeholder = "Search team member",
}: {
  value: string;
  onChange: (s: string) => void;
  status: MemberStatusFilter;
  onStatusChange: (s: MemberStatusFilter) => void;
  placeholder?: string;
}) {
  return (
    <div aria-label="Member search and status filter" className="flex items-center w-full gap-4">
      {/* Reuse shared SearchBar and adapt styles via props */}
      <div className="rounded-lg w-full">
        <SearchBar
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          // tweak the input to match the TeamMember look: white bg, subtle border color, rounded, extra right padding
          inputClassName="h-10 pl-4 pr-12 text-sm rounded-lg bg-white border-[#E9EDEE] shadow-sm text-gray-900"
          // wrap icon in the small circular area to match TeamMember visual
          iconWrapperClassName="pr-2"
          // keep outer wrapper minimal since we already provide the rounded container
          className=""
        />
      </div>

      {/* Status dropdown component */}
      <div className="w-44 h-10 relative">
        <StatusDropdown value={status} onChange={onStatusChange} />
      </div>
    </div>
  );
}
