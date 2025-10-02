// src\app\(dashboard)\dashboard\components\EmptyState.tsx
"use client";
import React from "react";
import Image from "next/image";

export default function EmptyState({
  title,
  subtitle,
  subsubtitle,
  icon = "/dashboardIcons/Users/empty-user.svg",
  height = 616,
  action,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  subsubtitle?: string;
  icon?: string;
  height?: number;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-full flex items-center justify-center ${className}`}
      style={{ height }}
      role="status"
      aria-live="polite"
    >
      <div
        className="flex flex-col items-center justify-center w-[275px] sm:w-[480px]"
      >
        <div className="w-16 h-16 rounded-full flex items-center justify-center">
          <Image src={icon} alt="Empty" width={64} height={64} />
        </div>

        <div className="text-center mt-4">
          <div className="txt-24 leading-[32px] font-semibold ">
            {title ?? "Nothing here yet"}
          </div>
          {subtitle && (
            <div className="txt-16 leading-[24px] font-medium text-text-col mt-2">
              {subtitle}
            </div>
          )}
        </div>

        {action && <div className="mt-6">{action}</div>}
        {subsubtitle && (
            <div className="txt-14 leading-[24px] font-medium mt-3">
              {subsubtitle}
            </div>
          )}
      </div>
    </div>
  );
}
