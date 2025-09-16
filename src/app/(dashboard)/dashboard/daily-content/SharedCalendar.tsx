// src\app\(dashboard)\dashboard\components\DailyContent\SharedCalendar.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";

export type SharedCalendarProps = {
  selected: string | null;
  onSelect: (iso: string) => void;
  editableHeader?: boolean;
  width?: number;
  minDate?: Date;
};

export function toLocalISO(dt: Date) {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseLocalISO(iso?: string | null): Date | null {
  if (!iso) return null;
  const parts = iso.split("-");
  if (parts.length < 3) return null;
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null;
  // construct using year, month-1, day so it's local midnight (avoids Date("yyyy-mm-dd") timezone parsing issues)
  return new Date(y, m - 1, d);
}

export default function SharedCalendar({
  selected,
  onSelect,
  editableHeader = false,
  width = 306,
  minDate,
}: SharedCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const min = minDate ?? today;

  const base = useMemo(() => {
    const dt = selected ? parseLocalISO(selected) ?? today : today;
    return new Date(dt.getFullYear(), dt.getMonth(), 1);
  }, [selected, today]);

  const [monthStart, setMonthStart] = useState<Date>(base);
  useEffect(() => setMonthStart(base), [base]);

  const monthDays = useMemo(() => {
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startWeekday = firstDay.getDay();
    const cells: (number | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return { year, month, cells, daysInMonth };
  }, [monthStart]);

  const prevMonth = () =>
    setMonthStart((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const nextMonth = () =>
    setMonthStart((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  const selectDay = (d: number) => {
    const dt = new Date(monthDays.year, monthDays.month, d);
    onSelect(toLocalISO(dt));
  };

  const todayIso = toLocalISO(today);
  const selectedIso = selected ?? null;
  const minYear = min.getFullYear();
  const minMonth = min.getMonth();
  const isCurrentMonth =
    monthStart.getFullYear() === minYear && monthStart.getMonth() === minMonth;

  const [editingHeader, setEditingHeader] = useState(false);
  const [editMonthIndex, setEditMonthIndex] = useState<number>(
    monthStart.getMonth()
  );
  const [editYear, setEditYear] = useState<number>(monthStart.getFullYear());
  useEffect(() => {
    if (!editingHeader) {
      setEditMonthIndex(monthStart.getMonth());
      setEditYear(monthStart.getFullYear());
    }
  }, [monthStart, editingHeader]);

  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const handleHeaderSave = () => {
    const newDate = new Date(editYear, editMonthIndex, 1);
    if (
      newDate.getFullYear() < minYear ||
      (newDate.getFullYear() === minYear && newDate.getMonth() < minMonth)
    ) {
      setMonthStart(new Date(minYear, minMonth, 1));
    } else {
      setMonthStart(newDate);
    }
    setEditingHeader(false);
  };

  return (
    <div
      style={{ width }}
      className="min-h-[310px] rounded-[8px] p-6 shadow-[2px_16px_19px_0_rgba(0,0,0,0.09)] bg-white"
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={isCurrentMonth}
          className={`p-1 rounded-full ${
            isCurrentMonth
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
          aria-label="Prev month"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {editableHeader && editingHeader ? (
          <div className="flex items-center gap-2">
            <select
              value={editMonthIndex}
              onChange={(e) => setEditMonthIndex(Number(e.target.value))}
              className="px-2 py-1 border rounded text-sm"
              aria-label="Select month"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={editYear}
              min={minYear}
              onChange={(e) => setEditYear(Number(e.target.value))}
              className="w-20 px-2 py-1 border rounded text-sm "
              aria-label="Enter year"
            />
            <button
              onClick={handleHeaderSave}
              className="text-xs text-[#00C47E] px-2"
            >
              OK
            </button>
          </div>
        ) : (
          <button
            onClick={() =>
              editableHeader ? setEditingHeader(true) : undefined
            }
            className="text-sm font-medium text-[#333]"
          >
            {monthStart.toLocaleString(undefined, { month: "long" })}{" "}
            {monthStart.getFullYear()}
          </button>
        )}

        <button
          onClick={nextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Next month"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6l6 6-6 6"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-3 text-xs text-[#94A3A8]">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {monthDays.cells.map((day, i) => {
          if (day === null) return <div key={`pad-${i}`} />;
          const dt = new Date(monthDays.year, monthDays.month, day);
          const iso = toLocalISO(dt);
          const isSelected = selectedIso === iso;
          const isToday = todayIso === iso;
          const isDisabled =
            dt < new Date(min.getFullYear(), min.getMonth(), min.getDate());

          const baseBtn =
            "w-[30px] h-[30px] flex items-center justify-center rounded-[29px] text-sm";
          let cls = "";
          if (isDisabled) cls = `${baseBtn} text-[#9EA9AA] cursor-not-allowed`;
          else if (isSelected) cls = `${baseBtn} bg-[#00C47E] text-white`;
          else if (isToday)
            cls = `${baseBtn} border-2 border-[#00C47E] text-[#00C47E]`;
          else cls = `${baseBtn} text-[#111827] hover:bg-neutral-100`;

          return (
            <button
              key={iso}
              onClick={() => !isDisabled && selectDay(day)}
              className={cls}
              disabled={isDisabled}
              title={iso}
            >
              <span>{day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
