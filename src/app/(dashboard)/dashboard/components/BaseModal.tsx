// src\app\(dashboard)\dashboard\components\BaseModal.tsx
"use client";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

type BaseModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  fullScreen?: boolean;
  className?: string;
  fixedSize?: { width: number; height: number };
  excludeLeft?: number;
};

export default function BaseModal({
  children,
  onClose,
  fullScreen = false,
  className = "",
  fixedSize,
  excludeLeft,
}: BaseModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);

    // ✅ lock scroll on open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalStyle;
    };
  }, [onClose]);

  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      className="fixed z-50 flex items-center justify-center"
      style={
        excludeLeft
          ? { left: excludeLeft, right: 0, top: 0, bottom: 0 }
          : { inset: 0 }
      }
      aria-modal="true"
      role="dialog"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      />

      {/* Modal container */}
      <div
        className={`relative z-10 max-sm:mx-6 ${
          fullScreen ? "w-full h-full p-0" : ""
        } ${className}`}
        style={
          fixedSize
            ? {
                width: fixedSize.width,
                height: fixedSize.height,
              }
            : {}
        }
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* NOTE: we intentionally DO NOT force bg-white / rounded / overflow here.
            Let the child control background, border-radius and overflow so
            popovers (calendar) can escape and child styles (rounded-xl) show. */}
        {fullScreen ? (
          <div className="h-full w-full overflow-auto">{children}</div>
        ) : (
          <div className="h-full flex flex-col bg-white rounded-xl overflow-hidden">
            {children}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
