// src\app\(dashboard)\dashboard\components\shared\ToastManager.tsx
"use client";
import React from "react";
import { useToastContext } from "../lib/ToastContext";

export default function ToastManager() {
  const { toasts, removeToast } = useToastContext();

  if (!toasts.length) return null;

  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-12 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="w-[300px] h-12 px-3 flex items-center gap-3 rounded-md bg-white shadow-[0_4px_16px_0_rgba(0,0,0,0.08)] border-l-2 border-[#00C47E]"
          role="alert"
        >
          <div className="flex-shrink-0">
            <span className="flex items-center justify-center w-5 h-5 rounded-full">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden
              >
                <circle cx="10" cy="10" r="10" fill="#00C47E" />
                <path
                  d="M5.5 10.2l2.2 2.2L14 6.1"
                  stroke="#FFFFFF"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <div className="flex-1 text-[14px] font-medium text-[#111827] truncate">
            {toast.message}
          </div>
        </div>
      ))}
    </div>
  );
}
