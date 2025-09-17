// src/app/(dashboard)/dashboard/layout.tsx
import React from "react";
import SidebarClient from "./SidebarClient";
import { ToastProvider } from "./lib/ToastContext";
import ToastManager from "./components/ToastManager";

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <ToastProvider>
//       <div className="flex h-screen bg-white">
//         {/* Client-side interactive sidebar */}

//         {/* Main content */}
//         <div className="flex-1 flex max-lg:flex-col overflow-hidden">
//         <SidebarClient />
//           <main className="flex-1 overflow-y-auto p-6 custom-scroll">
//             <div className="mx-auto h-full">{children}</div>
//           </main>
//         </div>

//         {/* Toast Manager (can be client) */}
//         <ToastManager />
//       </div>
//     </ToastProvider>
//   );
// }



// src/app/(dashboard)/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex h-screen bg-white">
        {/* Sidebar */}

        {/* make container not let children overflow out of the flex box */}
        <div className="flex-1 flex max-lg:flex-col overflow-hidden">
        <SidebarClient />
          {/* allow this flex child to shrink to available height */}
          <main className="flex-1 min-h-0 overflow-y-auto p-6 custom-scroll">
            {/* remove forced h-full — use min-h-full if you need it */}
            <div className="mx-auto">{children}</div>
          </main>
        </div>

        <ToastManager />
      </div>
    </ToastProvider>
  );
}
