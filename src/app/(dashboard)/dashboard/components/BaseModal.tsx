// // src\app\(dashboard)\dashboard\components\BaseModal.tsx
// "use client";
// import React, { useEffect } from "react";
// import ReactDOM from "react-dom";

// type BaseModalProps = {
//   children: React.ReactNode;
//   onClose: () => void;
//   fullScreen?: boolean;
//   className?: string;
//   fixedSize?: { width: number; height: number };
//   excludeLeft?: number;
// };

// export default function BaseModal({
//   children,
//   onClose,
//   fullScreen = false,
//   className = "",
//   fixedSize,
//   excludeLeft,
// }: BaseModalProps) {
//   useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "Escape") onClose();
//     }
//     document.addEventListener("keydown", onKey);

//     // ✅ lock scroll on open
//     const originalStyle = window.getComputedStyle(document.body).overflow;
//     document.body.style.overflow = "hidden";

//     return () => {
//       document.removeEventListener("keydown", onKey);
//       document.body.style.overflow = originalStyle;
//     };
//   }, [onClose]);

//   if (typeof window === "undefined") return null;

//   return ReactDOM.createPortal(
//     <div
//       className="fixed z-50 flex items-center justify-center"
//       style={
//         excludeLeft
//           ? { left: excludeLeft, right: 0, top: 0, bottom: 0 }
//           : { inset: 0 }
//       }
//       aria-modal="true"
//       role="dialog"
//       onMouseDown={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       {/* Overlay */}
//       <div
//         className="absolute inset-0 bg-black/40"
//         onMouseDown={(e) => {
//           if (e.target === e.currentTarget) onClose();
//         }}
//       />

//       {/* Modal container */}
//       <div
//         className={`relative z-10 max-sm:mx-6 ${
//           fullScreen ? "w-full h-full p-0" : ""
//         } ${className}`}
//         style={
//           fixedSize
//             ? {
//                 width: fixedSize.width,
//                 height: fixedSize.height,
//               }
//             : {}
//         }
//         onMouseDown={(e) => e.stopPropagation()}
//       >
//         {/* NOTE: we intentionally DO NOT force bg-white / rounded / overflow here.
//             Let the child control background, border-radius and overflow so
//             popovers (calendar) can escape and child styles (rounded-xl) show. */}
//         {fullScreen ? (
//           <div className="h-full w-full overflow-auto">{children}</div>
//         ) : (
//           <div className="h-full flex flex-col bg-white rounded-xl overflow-hidden">
//             {children}
//           </div>
//         )}
//       </div>
//     </div>,
//     document.body
//   );
// }







// src/app/(dashboard)/dashboard/components/BaseModal.tsx
"use client";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

type BaseModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  fullScreen?: boolean;
  className?: string;
  fixedSize?: { width?: number; height?: number };
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
  const modalRef = useRef<HTMLDivElement | null>(null);
  const scrollYRef = useRef<number>(0);
  const originalBodyPaddingRight = useRef<string>("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);

    // Save current scroll and lock page in place
    scrollYRef.current = window.scrollY || window.pageYOffset || 0;

    // compensate for scrollbar width to avoid layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      originalBodyPaddingRight.current = document.body.style.paddingRight || "";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    // keep documentElement overflow hidden as extra measure
    document.documentElement.style.overflow = "hidden";

    // iOS / touch fallback: prevent touchmove except when inside the modal itself
    const onTouchMove = (e: TouchEvent) => {
      const target = e.target as Node | null;
      if (modalRef.current && target && modalRef.current.contains(target)) {
        // allow scrolling inside modal
        return;
      }
      e.preventDefault();
    };
    document.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("touchmove", onTouchMove);

      // restore styles and scroll
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";

      // restore body padding if set
      if (originalBodyPaddingRight.current !== "") {
        document.body.style.paddingRight = originalBodyPaddingRight.current;
        originalBodyPaddingRight.current = "";
      } else {
        document.body.style.paddingRight = "";
      }

      // restore scroll position
      window.scrollTo(0, scrollYRef.current || 0);
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
        ref={modalRef}
        className={`relative z-10 max-sm:mx-6 ${fullScreen ? "w-full h-full p-0" : ""} ${className}`}
        style={
          fixedSize
            ? {
                width: fixedSize.width ? fixedSize.width : undefined,
                height: fixedSize.height ? fixedSize.height : undefined,
              }
            : {}
        }
        onMouseDown={(e) => e.stopPropagation()}
      >
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
