// // // // src/app/(dashboard)/dashboard/layout.tsx
// // // import React from "react";
// // // import SidebarClient from "./SidebarClient";
// // // import { ToastProvider } from "./lib/ToastContext";
// // // import ToastManager from "./components/ToastManager";

// // // export default function DashboardLayout({ children }: { children: React.ReactNode }) {
// // //   return (
// // //     <ToastProvider>
// // //       <div className="flex h-screen bg-white">
// // //         {/* Sidebar */}

// // //         {/* make container not let children overflow out of the flex box */}
// // //         <div className="flex-1 flex max-lg:flex-col overflow-hidden">
// // //         <SidebarClient />
// // //           {/* allow this flex child to shrink to available height */}
// // //           <main className="flex-1 min-h-0 overflow-y-auto p-6 custom-scroll">
// // //             {/* remove forced h-full — use min-h-full if you need it */}
// // //             <div className="mx-auto">{children}</div>
// // //           </main>
// // //         </div>

// // //         <ToastManager />
// // //       </div>
// // //     </ToastProvider>
// // //   );
// // // }







// // import React from "react";
// // import SidebarClient from "./SidebarClient";
// // import { ToastProvider } from "./lib/ToastContext";
// // import ToastManager from "./components/ToastManager";

// // export default function DashboardLayout({ children }: { children: React.ReactNode }) {
// //   return (
// //     <ToastProvider>
// //       {/* use min-h-screen so the page can grow beyond viewport if needed */}
// //       <div className="flex min-h- screen bg-white">
// //         {/* Sidebar + main content container */}
// //         <div className="flex-1 flex max-lg:flex-col overflow-hidden">
// //           <SidebarClient />
// //           {/* allow this flex child to shrink to available height so its internal scroll works */}
// //           <main className="flex-1 min-h- 0 overflow-y-auto p-6 custom-scroll">
// //             <div className="mx-auto">{children}</div>
// //           </main>
// //         </div>

// //         <ToastManager />
// //       </div>
// //     </ToastProvider>
// //   );
// // }






// import React from "react";
// import SidebarClient from "./SidebarClient";
// import { ToastProvider } from "./lib/ToastContext";
// import ToastManager from "./components/ToastManager";

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <ToastProvider>
//       {/* Outer flex: sidebar is a sibling of the main content so heights match */}
//       <div className="flex min-h-0 bg-blue-300">
//         {/* Sidebar (fixed width) */}
//          <div className="flex-1 flex max-lg:flex-col  h-full overflow-hidden">
//         <SidebarClient />

//         {/* Main area - takes remaining space and can scroll internally */}
//         <div className="flex-1 flex bg-red -400 flex-col overflow-hidden">
//           <main className="flex-1 min-h-0 overflow-y-auto p-6 custom-scroll">
//             <div className="mx-auto">{children}</div>
//           </main>
//         </div>

//         <ToastManager />
//       </div>
//       </div>
//     </ToastProvider>
//   );
// }








// src/app/(dashboard)/dashboard/layout.tsx
import React from "react";
import SidebarClient from "./SidebarClient";
import { ToastProvider } from "./lib/ToastContext";
import ToastManager from "./components/ToastManager";

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