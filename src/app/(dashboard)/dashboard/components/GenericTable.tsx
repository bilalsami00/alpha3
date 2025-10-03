// // // // src\app\(dashboard)\dashboard\components\GenericTable.tsx
// // // "use client";
// // // import React from "react";

// // // export type Column<T> = {
// // //   key: string;
// // //   header: React.ReactNode;
// // //   width?: string;
// // //   align?: "left" | "center" | "right";
// // //   render?: (row: T) => React.ReactNode;
// // //   accessor?: (row: T) => React.ReactNode;
// // //   className?: string;
// // //   isClickable?: boolean; // cell should look clickable (cursor)
// // //   onClick?: (row: T) => void; // cell click handler (new)
// // // };

// // // export default function GenericTable<T>({
// // //   columns,
// // //   data,
// // //   rowKey,
// // //   rowClassName,
// // //   tableClassName = "",
// // //   emptyState,
// // //   rowHeight = "h-14", // default row height (56px)
// // // }: {
// // //   columns: Column<T>[];
// // //   data: T[];
// // //   rowKey: (row: T, idx: number) => string | number;
// // //   /**
// // //    * rowClassName now receives (row, idx) so callers can use the rendered index
// // //    * to compute zebra backgrounds reliably.
// // //    */
// // //   rowClassName?: (row: T, idx: number) => string;
// // //   tableClassName?: string;
// // //   emptyState?: React.ReactNode;
// // //   rowHeight?: string; // tailwind class for height, e.g. 'h-14'
// // // }) {
// // //   return (
// // //     <div className={`bg-white rounded shadow- sm overflow-auto ${tableClassName}`}>
// // //       <table className="min-w-full divide-y divide-gray-200">
// // //         <thead className="bg-[#E9EDEE]">
// // //           <tr>
// // //             {columns.map((col) => (
// // //               <th
// // //                 key={col.key}
// // //                 scope="col"
// // //                 className={`px-8 py-3 txt-14 font-semibold tracking-wider ${
// // //                   col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"
// // //                 } ${col.className ?? ""}`}
// // //                 style={col.width ? { width: col.width } : undefined}
// // //               >
// // //                 {col.header}
// // //               </th>
// // //             ))}
// // //           </tr>
// // //         </thead>

// // //         <tbody className="bg-white divide-y divide-gray-200">
// // //           {data.length === 0 ? (
// // //             <tr>
// // //               <td colSpan={columns.length} className="p-0">
// // //                 {emptyState}
// // //               </td>
// // //             </tr>
// // //           ) : (
// // //             data.map((row, idx) => {
// // //               const trClass = `${rowClassName ? rowClassName(row, idx) : ""} ${rowHeight} align-middle`;
// // //               return (
// // //                 <tr key={String(rowKey(row, idx))} className={trClass}>
// // //                   {columns.map((col) => {
// // //                     const clickable = !!col.isClickable && !!col.onClick;
// // //                     const cellContent = col.render ? col.render(row) : col.accessor ? col.accessor(row) : (row as any)[col.key];

// // //                     // justify classes to horizontally align content consistently
// // //                     const justify =
// // //                       col.align === "center" ? "justify-center" : col.align === "right" ? "justify-end" : "justify-start";

// // //                     return (
// // //                       <td
// // //                         key={col.key as string}
// // //                         className={`px-8 py-2 txt-14 ${clickable ? "cursor-pointer select-none" : ""} ${col.className ?? ""}`}
// // //                         style={{ width: col.width }}
// // //                         onClick={clickable ? () => col.onClick!(row) : undefined}
// // //                         role={clickable ? "button" : undefined}
// // //                         tabIndex={clickable ? 0 : undefined}
// // //                         onKeyDown={
// // //                           clickable
// // //                             ? (e) => {
// // //                                 if (e.key === "Enter" || e.key === " ") {
// // //                                   e.preventDefault();
// // //                                   col.onClick!(row);
// // //                                 }
// // //                               }
// // //                             : undefined
// // //                         }
// // //                       >
// // //                         <div className={`h-full flex items-center ${justify}`}>
// // //                           {cellContent}
// // //                         </div>
// // //                       </td>
// // //                     );
// // //                   })}
// // //                 </tr>
// // //               );
// // //             })
// // //           )}
// // //         </tbody>
// // //       </table>
// // //     </div>
// // //   );
// // // }

// // // /*
// // //   USAGE NOTE (apply this change in your DailyContent component):

// // //   Replace your current rowClassName prop (which depends on id) with one of the
// // //   following options:

// // //   // per-page zebra (recommended)
// // //   rowClassName={(r, idx) => (idx % 2 === 0 ? "bg-white" : "bg-[#F2F5F6]")}

// // //   // or: global zebra across pages (keeps pattern continuous across pages)
// // //   rowClassName={(r, idx) => ((startIndex + idx) % 2 === 0 ? "bg-white" : "bg-[#F2F5F6]")}

// // //   The GenericTable now passes the rendered index (idx) as the second argument.
// // // */












// // // src\app\(dashboard)\dashboard\components\GenericTable.tsx
// // "use client";
// // import React from "react";

// // export type Column<T> = {
// //   key: string;
// //   header: React.ReactNode;
// //   width?: string;
// //   align?: "left" | "center" | "right";
// //   render?: (row: T) => React.ReactNode;
// //   accessor?: (row: T) => React.ReactNode;
// //   className?: string;
// //   isClickable?: boolean;
// //   onClick?: (row: T) => void;
// // };

// // export default function GenericTable<T>({
// //   columns,
// //   data,
// //   rowKey,
// //   rowClassName,
// //   tableClassName = "",
// //   emptyState,
// //   rowHeight = "h-14",
// //   emptyStateHeight = 616, // default fixed height for empty state
// // }: {
// //   columns: Column<T>[];
// //   data: T[];
// //   rowKey: (row: T, idx: number) => string | number;
// //   rowClassName?: (row: T, idx: number) => string;
// //   tableClassName?: string;
// //   emptyState?: React.ReactNode;
// //   rowHeight?: string;
// //   emptyStateHeight?: number;
// // }) {
// //   const hasData = !!(data && data.length > 0);

// //   return (
// //     // When we have data we allow horizontal/vertical scrolling (table can be wider).
// //     // When empty we hide horizontal scroll (header will contract) and avoid internal vertical scrolling.
// //     <div
// //       className={`bg-white rounded shadow-sm ${tableClassName}`}
// //       // conditional overflow: allow scroll only when there's data
// //       style={{
// //         overflowX: hasData ? "auto" : "hidden",
// //         overflowY: hasData ? "auto" : "visible",
// //       }}
// //     >
// //       <table
// //         className="min-w-full divide-y divide-gray-200"
// //         // fixed layout when we have data (keeps column widths stable), auto when empty so header shrinks.
// //         style={{ tableLayout: hasData ? "fixed" : "auto", width: "100%" }}
// //       >
// //         {/* apply col widths only when data exists */}
// //         <colgroup>
// //           {columns.map((col) => (
// //             <col
// //               key={col.key}
// //               style={hasData && col.width ? { width: col.width } : undefined}
// //             />
// //           ))}
// //         </colgroup>

// //         <thead className="bg-[#E9EDEE] overflow-x-auto">
// //           <tr>
// //             {columns.map((col) => (
// //               <th
// //                 key={col.key}
// //                 scope="col"
// //                 className={`px-8 py-3 txt-14 font-semibold tracking-wider ${
// //                   col.align === "center"
// //                     ? "text-center"
// //                     : col.align === "right"
// //                     ? "text-right"
// //                     : "text-left"
// //                 } ${col.className ?? ""}`}
// //                 style={hasData && col.width ? { width: col.width } : undefined}
// //               >
// //                 {col.header}
// //               </th>
// //             ))}
// //           </tr>
// //         </thead>

// //         <tbody className="bg-white divide-y divide-gray-200">
// //           {!hasData ? (
// //             <tr>
// //               <td colSpan={columns.length} className="p-0 overflow-hidden">
// //                 {/* fixed-height shrinkable wrapper for the empty-state UI */}
// //                 <div
// //                   className="w-full min-w-0 flex items-center justify-center"
// //                   style={{ height: emptyStateHeight }}
// //                   role="status"
// //                   aria-live="polite"
// //                 >
// //                   {emptyState}
// //                 </div>
// //               </td>
// //             </tr>
// //           ) : (
// //             data.map((row, idx) => {
// //               const trClass = `${rowClassName ? rowClassName(row, idx) : ""} ${rowHeight} align-middle`;
// //               return (
// //                 <tr key={String(rowKey(row, idx))} className={trClass}>
// //                   {columns.map((col) => {
// //                     const clickable = !!col.isClickable && !!col.onClick;
// //                     const cellContent = col.render
// //                       ? col.render(row)
// //                       : col.accessor
// //                       ? col.accessor(row)
// //                       : (row as any)[col.key];

// //                     const justify =
// //                       col.align === "center"
// //                         ? "justify-center"
// //                         : col.align === "right"
// //                         ? "justify-end"
// //                         : "justify-start";

// //                     return (
// //                       <td
// //                         key={col.key as string}
// //                         className={`px-8 py-2 txt-14 ${clickable ? "cursor-pointer select-none" : ""} ${col.className ?? ""}`}
// //                         style={{ width: col.width }}
// //                         onClick={clickable ? () => col.onClick!(row) : undefined}
// //                         role={clickable ? "button" : undefined}
// //                         tabIndex={clickable ? 0 : undefined}
// //                         onKeyDown={
// //                           clickable
// //                             ? (e) => {
// //                                 if (e.key === "Enter" || e.key === " ") {
// //                                   e.preventDefault();
// //                                   col.onClick!(row);
// //                                 }
// //                               }
// //                             : undefined
// //                         }
// //                       >
// //                         {/* min-w-0 prevents long content from forcing column width */}
// //                         <div className={`h-full flex items-center ${justify} min-w-0`}>
// //                           {cellContent}
// //                         </div>
// //                       </td>
// //                     );
// //                   })}
// //                 </tr>
// //               );
// //             })
// //           )}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // }








// // src\app\(dashboard)\dashboard\components\GenericTable.tsx
// "use client";
// import React from "react";

// export type Column<T> = {
//   key: string;
//   header: React.ReactNode;
//   width?: string;
//   align?: "left" | "center" | "right";
//   render?: (row: T) => React.ReactNode;
//   accessor?: (row: T) => React.ReactNode;
//   className?: string;
//   isClickable?: boolean;
//   onClick?: (row: T) => void;
// };

// export default function GenericTable<T>({
//   columns,
//   data,
//   rowKey,
//   rowClassName,
//   tableClassName = "",
//   emptyState,
//   rowHeight = "h-14",
//   emptyStateHeight = 616, // default height (can override)
//   preserveLayoutWhenEmpty = true,
// }: {
//   columns: Column<T>[];
//   data: T[];
//   rowKey: (row: T, idx: number) => string | number;
//   rowClassName?: (row: T, idx: number) => string;
//   tableClassName?: string;
//   emptyState?: React.ReactNode;
//   rowHeight?: string;
//   emptyStateHeight?: number;
//   preserveLayoutWhenEmpty?: boolean;
// }) {
//   const hasData = !!(data && data.length > 0);
//   const applyFixedLayout = hasData || preserveLayoutWhenEmpty;

//   // --- Helpers for header rendering (used in both normal and empty states) ---
//   const HeaderRowJSX = (
//     <div
//       className="flex items-center"
//       style={{ minWidth: 0 /* prevent overflow pushing */ }}
//     >
//       {columns.map((col) => (
//         <div
//           key={col.key}
//           className={`px-4 py-3 txt-14 font-semibold tracking-wider ${col.className ?? ""}`}
//           style={{
//             width: col.width ?? "auto",
//             minWidth: col.width ? undefined : 0,
//             textAlign:
//               col.align === "center" ? "center" : col.align === "right" ? "right" : "left",
//             boxSizing: "border-box",
//           }}
//         >
//           {col.header}
//         </div>
//       ))}
//     </div>
//   );

//   // Wrapper style for header scroll area
//   const headerScrollWrapperStyle: React.CSSProperties = {
//     overflowX: "auto",
//     WebkitOverflowScrolling: "touch",
//   };

//   // Empty-body width strategy:
//   // ensures at 360px viewport width we get 312px body: clamp(min, preferred, max)
//   // preferred is 86% which scales on larger small screens; cap max at 1200px to be safe.
//   const emptyBodyWidth = "clamp(312px, 86%, 1200px)";

//   // When rows exist, render a normal <table> (preserve semantics)
//   if (hasData) {
//     return (
//       <div
//         className={`bg-white rounded shadow-sm ${tableClassName}`}
//         style={{
//           overflowX: "auto",
//           overflowY: "auto",
//         }}
//       >
//         <table
//           className="min-w-full divide-y divide-gray-200"
//           style={{ tableLayout: applyFixedLayout ? "fixed" : "auto", width: "100%" }}
//         >
//           <colgroup>
//             {columns.map((col) => (
//               <col key={col.key} style={col.width ? { width: col.width } : undefined} />
//             ))}
//           </colgroup>

//           <thead className="bg-[#E9EDEE]">
//             <tr>
//               {columns.map((col) => (
//                 <th
//                   key={col.key}
//                   scope="col"
//                   className={`px-8 py-3 txt-14 font-semibold tracking-wider ${col.className ?? ""}`}
//                   style={{
//                     width: col.width ?? undefined,
//                     textAlign: col.align === "center" ? "center" : col.align === "right" ? "right" : "left",
//                     boxSizing: "border-box",
//                   }}
//                 >
//                   {col.header}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody className="bg-white divide-y divide-gray-200">
//             {data.map((row, idx) => {
//               const trClass = `${rowClassName ? rowClassName(row, idx) : ""} ${rowHeight} align-middle`;
//               return (
//                 <tr key={String(rowKey(row, idx))} className={trClass}>
//                   {columns.map((col) => {
//                     const clickable = !!col.isClickable && !!col.onClick;
//                     const cellContent = col.render
//                       ? col.render(row)
//                       : col.accessor
//                       ? col.accessor(row)
//                       : (row as any)[col.key];

//                     const justify =
//                       col.align === "center"
//                         ? "justify-center"
//                         : col.align === "right"
//                         ? "justify-end"
//                         : "justify-start";

//                     return (
//                       <td
//                         key={col.key as string}
//                         className={`px-8 py-2 txt-14 ${clickable ? "cursor-pointer select-none" : ""} ${col.className ?? ""}`}
//                         style={{ width: col.width ?? undefined }}
//                         onClick={clickable ? () => col.onClick!(row) : undefined}
//                         role={clickable ? "button" : undefined}
//                         tabIndex={clickable ? 0 : undefined}
//                         onKeyDown={
//                           clickable
//                             ? (e) => {
//                                 if (e.key === "Enter" || e.key === " ") {
//                                   e.preventDefault();
//                                   col.onClick!(row);
//                                 }
//                               }
//                             : undefined
//                         }
//                       >
//                         <div className={`h-full flex items-center ${justify} min-w-0`}>
//                           {cellContent}
//                         </div>
//                       </td>
//                     );
//                   })}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     );
//   }

//   // --- EMPTY STATE rendering (no rows) ---
//   return (
//     <div className={`bg-white rounded shadow-sm ${tableClassName}`}>

//       {/* Header area (horizontally scrollable independently) */}
//       <div className="border-b border-[color:var(--Neutral-Grey-10,#E9EDEE)]" style={headerScrollWrapperStyle}>
//         <div style={{ display: "inline-block", minWidth: "100%" }}>
//           {/* We render header cells inline so their widths match provided col.width */}
//           <div style={{ display: "flex", alignItems: "center", paddingLeft: 0 }}>
//             {columns.map((col) => (
//               <div
//                 key={col.key}
//                 className={`px-4 py-3 txt-14 font-semibold tracking-wider ${col.className ?? ""}`}
//                 style={{
//                   width: col.width ?? "auto",
//                   minWidth: col.width ? undefined : 0,
//                   textAlign:
//                     col.align === "center" ? "center" : col.align === "right" ? "right" : "left",
//                   boxSizing: "border-box",
//                 }}
//               >
//                 {col.header}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Body area: centered, responsive width, no horizontal scroll */}
//       <div
//         className="w-full flex items-center justify-center"
//         // make sure body has at least this fixed height so empty state is centered vertically
//         style={{
//           padding: 24,
//         }}
//       >
//         <div
//           // responsive width: clamp ensures on a 360px viewport the width becomes 312px
//           style={{
//             width: emptyBodyWidth,
//             maxWidth: "100%",
//             height: emptyStateHeight,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             boxSizing: "border-box",
//           }}
//           role="status"
//           aria-live="polite"
//         >
//           {emptyState}
//         </div>
//       </div>
//     </div>
//   );
// }










// src/app/(dashboard)/dashboard/components/GenericTable.tsx
"use client";
import React from "react";

export type Column<T> = {
  key: string;
  header: React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
  accessor?: (row: T) => React.ReactNode;
  className?: string;
  isClickable?: boolean;
  onClick?: (row: T) => void;
};

export default function GenericTable<T>({
  columns,
  data,
  rowKey,
  rowClassName,
  tableClassName = "",
  emptyState,
  rowHeight = "h-14",
  emptyStateHeight = 616, // vertical space for the empty-state block
  preserveLayoutWhenEmpty = true, // keep column widths/layout even when empty
  emptyBodyWidth = "w-[312px] sm:w-[480px]", // width classes for the centered empty body
}: {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T, idx: number) => string | number;
  rowClassName?: (row: T, idx: number) => string;
  tableClassName?: string;
  emptyState?: React.ReactNode;
  rowHeight?: string;
  emptyStateHeight?: number;
  preserveLayoutWhenEmpty?: boolean;
  emptyBodyWidth?: string;
}) {
  const hasData = !!(data && data.length > 0);
  const applyFixedLayout = hasData || preserveLayoutWhenEmpty;

  // When empty: render header as its own scrollable table (so thead can overflow-x)
  // and render a centered fixed-width body container for the empty-state (no horizontal scroll).
  if (!hasData) {
    return (
      <div className={`bg-white rounded shadow- sm ${tableClassName}`}>
        {/* Header area (scrollable horizontally) */}
        <div className="w-full overflow-x-auto border-b border-[color:var(--Neutral-Grey-10,#E9EDEE)]">
          <table
            className="min-w-full"
            // keep fixed layout so the header respects provided col widths if any
            style={{ tableLayout: applyFixedLayout ? "fixed" : "auto", width: "100%" }}
          >
            <colgroup>
              {columns.map((col) => (
                <col key={col.key} style={col.width ? { width: col.width } : undefined} />
              ))}
            </colgroup>

            <thead className="bg-[#E9EDEE]">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={`px-8 py-3 txt-14 font-semibold tracking-wider ${
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                        ? "text-right"
                        : "text-left"
                    } ${col.className ?? ""}`}
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>

        {/* Centered body area — fixed width, no horizontal scroll */}
        <div
          className="w-full flex items-center justify-center"
          // ensure the body area itself doesn't create horizontal scroll
          style={{ overflowX: "hidden" }}
        >
          <div className={`mx-auto ${emptyBodyWidth}`} style={{ minWidth: 0 }}>
            <div
              className="w-full flex items-center justify-center"
              style={{ height: emptyStateHeight }}
              role="status"
              aria-live="polite"
            >
              {emptyState}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal table rendering when there is data (unchanged behaviour)
  return (
    // container allows horizontal scroll when data exists (table may be wide)
    <div
      className={`bg-white rounded shadow- sm ${tableClassName}`}
      style={{
        overflowX: "auto",
        overflowY: "auto",
      }}
    >
      <table
        className="min-w-full divide-y divide-gray-200"
        style={{ tableLayout: applyFixedLayout ? "fixed" : "auto", width: "100%" }}
      >
        <colgroup>
          {columns.map((col) => (
            <col key={col.key} style={col.width ? { width: col.width } : undefined} />
          ))}
        </colgroup>

        <thead className="bg-[#E9EDEE]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-8 py-3 txt-14 font-semibold tracking-wider ${
                  col.align === "center"
                    ? "text-center"
                    : col.align === "right"
                    ? "text-right"
                    : "text-left"
                } ${col.className ?? ""}`}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, idx) => {
            const trClass = `${rowClassName ? rowClassName(row, idx) : ""} ${rowHeight} align-middle`;
            return (
              <tr key={String(rowKey(row, idx))} className={trClass}>
                {columns.map((col) => {
                  const clickable = !!col.isClickable && !!col.onClick;
                  const cellContent = col.render
                    ? col.render(row)
                    : col.accessor
                    ? col.accessor(row)
                    : (row as any)[col.key];

                  const justify =
                    col.align === "center"
                      ? "justify-center"
                      : col.align === "right"
                      ? "justify-end"
                      : "justify-start";

                  return (
                    <td
                      key={col.key as string}
                      className={`px-8 py-2 txt-14 ${clickable ? "cursor-pointer select-none" : ""} ${col.className ?? ""}`}
                      style={{ width: col.width }}
                      onClick={clickable ? () => col.onClick!(row) : undefined}
                      role={clickable ? "button" : undefined}
                      tabIndex={clickable ? 0 : undefined}
                      onKeyDown={
                        clickable
                          ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                col.onClick!(row);
                              }
                            }
                          : undefined
                      }
                    >
                      <div className={`h-full flex items-center ${justify} min-w-0`}>
                        {cellContent}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
