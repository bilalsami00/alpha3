// src\app\(dashboard)\dashboard\components\Pagination.tsx
"use client";
import React from "react";
import { GoChevronRight, GoChevronLeft } from "react-icons/go";
import { FaCaretDown } from "react-icons/fa";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  totalItems,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (n: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (n: number) => void;
  totalItems: number;
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  return (
    <div className="flex items-center justify-end gap-10 border border-[color:var(--Neutral-Grey-10,#E9EDEE)] rounded-b-lg p-4 ">
      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-700 ">Rows per page:</span>

        {/* relative wrapper so we can absolutely position the icon */}
        <div className="relative inline-block">
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            aria-label="Rows per page"
            className="form-select appearance-none  pr-8 pl-2 py-1 text-sm rounded focus:outline-none focus-green"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>

          {/* Icon positioned on the right. size=16 => 16px. color prop sets #8D9A9B */}
          <FaCaretDown
            size={16}
            color="#8D9A9B"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none opacity-100"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">
          {startItem}-{endItem} of {totalItems}
        </span>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`rounded-md ${
            currentPage === 1 ? "text-gray-400" : "text-gray-700"
          }`}
        >
          <GoChevronLeft size={24} />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`rounded-md ${
            currentPage === totalPages ? "text-gray-400" : "text-gray-700"
          }`}
        >
          <GoChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
