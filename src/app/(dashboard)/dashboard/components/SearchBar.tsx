// src\app\(dashboard)\dashboard\components\shared\SearchBar.tsx 
"use client";
import React from "react";
import Image from "next/image";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search",
  // optional styling hooks so callers can adjust sizes / paddings
  className = "",
  inputClassName = "",
  iconWrapperClassName = "",
}: {
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
  className?: string; // wrapper override
  inputClassName?: string; // input override
  iconWrapperClassName?: string; // icon wrapper override
}) {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-10 px-4 txt-14 placeholder-[#626D6F] py-2 border border-gray-200 rounded-md focus:outline-none ${inputClassName}`}
      />
      <div className={`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none ${iconWrapperClassName}`}>
        <Image
          src="/dashboardIcons/search-normal.svg"
          alt="Search"
          className="w-6 h-6"
          width={24}
          height={24}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
