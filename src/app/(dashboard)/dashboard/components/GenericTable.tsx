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
//   isClickable?: boolean; // cell should look clickable (cursor)
//   onClick?: (row: T) => void; // cell click handler (new)
// };

// export default function GenericTable<T>({
//   columns,
//   data,
//   rowKey,
//   rowClassName,
//   tableClassName = "",
//   emptyState,
//   rowHeight = "h-14", // default row height (56px)
// }: {
//   columns: Column<T>[];
//   data: T[];
//   rowKey: (row: T, idx: number) => string | number;
//   /**
//    * rowClassName now receives (row, idx) so callers can use the rendered index
//    * to compute zebra backgrounds reliably.
//    */
//   rowClassName?: (row: T, idx: number) => string;
//   tableClassName?: string;
//   emptyState?: React.ReactNode;
//   rowHeight?: string; // tailwind class for height, e.g. 'h-14'
// }) {
//   return (
//     <div className={`bg-white rounded shadow- sm overflow-auto ${tableClassName}`}>
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-[#E9EDEE]">
//           <tr>
//             {columns.map((col) => (
//               <th
//                 key={col.key}
//                 scope="col"
//                 className={`px-8 py-3 txt-14 font-semibold tracking-wider ${
//                   col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"
//                 } ${col.className ?? ""}`}
//                 style={col.width ? { width: col.width } : undefined}
//               >
//                 {col.header}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody className="bg-white divide-y divide-gray-200">
//           {data.length === 0 ? (
//             <tr>
//               <td colSpan={columns.length} className="p-0">
//                 {emptyState}
//               </td>
//             </tr>
//           ) : (
//             data.map((row, idx) => {
//               const trClass = `${rowClassName ? rowClassName(row, idx) : ""} ${rowHeight} align-middle`;
//               return (
//                 <tr key={String(rowKey(row, idx))} className={trClass}>
//                   {columns.map((col) => {
//                     const clickable = !!col.isClickable && !!col.onClick;
//                     const cellContent = col.render ? col.render(row) : col.accessor ? col.accessor(row) : (row as any)[col.key];

//                     // justify classes to horizontally align content consistently
//                     const justify =
//                       col.align === "center" ? "justify-center" : col.align === "right" ? "justify-end" : "justify-start";

//                     return (
//                       <td
//                         key={col.key as string}
//                         className={`px-8 py-2 txt-14 ${clickable ? "cursor-pointer select-none" : ""} ${col.className ?? ""}`}
//                         style={{ width: col.width }}
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
//                         <div className={`h-full flex items-center ${justify}`}>
//                           {cellContent}
//                         </div>
//                       </td>
//                     );
//                   })}
//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// /*
//   USAGE NOTE (apply this change in your DailyContent component):

//   Replace your current rowClassName prop (which depends on id) with one of the
//   following options:

//   // per-page zebra (recommended)
//   rowClassName={(r, idx) => (idx % 2 === 0 ? "bg-white" : "bg-[#F2F5F6]")}

//   // or: global zebra across pages (keeps pattern continuous across pages)
//   rowClassName={(r, idx) => ((startIndex + idx) % 2 === 0 ? "bg-white" : "bg-[#F2F5F6]")}

//   The GenericTable now passes the rendered index (idx) as the second argument.
// */












// src\app\(dashboard)\dashboard\components\GenericTable.tsx
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
  emptyStateHeight = 616, // default fixed height for empty state
}: {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T, idx: number) => string | number;
  rowClassName?: (row: T, idx: number) => string;
  tableClassName?: string;
  emptyState?: React.ReactNode;
  rowHeight?: string;
  emptyStateHeight?: number;
}) {
  const hasData = !!(data && data.length > 0);

  return (
    // When we have data we allow horizontal/vertical scrolling (table can be wider).
    // When empty we hide horizontal scroll (header will contract) and avoid internal vertical scrolling.
    <div
      className={`bg-white rounded shadow-sm ${tableClassName}`}
      // conditional overflow: allow scroll only when there's data
      style={{
        overflowX: hasData ? "auto" : "hidden",
        overflowY: hasData ? "auto" : "visible",
      }}
    >
      <table
        className="min-w-full divide-y divide-gray-200"
        // fixed layout when we have data (keeps column widths stable), auto when empty so header shrinks.
        style={{ tableLayout: hasData ? "fixed" : "auto", width: "100%" }}
      >
        {/* apply col widths only when data exists */}
        <colgroup>
          {columns.map((col) => (
            <col
              key={col.key}
              style={hasData && col.width ? { width: col.width } : undefined}
            />
          ))}
        </colgroup>

        <thead className="bg-[#E9EDEE] overflow-x-auto">
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
                style={hasData && col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {!hasData ? (
            <tr>
              <td colSpan={columns.length} className="p-0 overflow-hidden">
                {/* fixed-height shrinkable wrapper for the empty-state UI */}
                <div
                  className="w-full min-w-0 flex items-center justify-center"
                  style={{ height: emptyStateHeight }}
                  role="status"
                  aria-live="polite"
                >
                  {emptyState}
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, idx) => {
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
                        {/* min-w-0 prevents long content from forcing column width */}
                        <div className={`h-full flex items-center ${justify} min-w-0`}>
                          {cellContent}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
