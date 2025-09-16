// // app/(dashboard)/dashboard/layout.tsx
// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { TbLayoutSidebar } from "react-icons/tb";
// import Image from "next/image";

// // Toast provider + manager
// import { ToastProvider } from "./lib/ToastContext";
// import ToastManager from "./components/ToastManager";

// // Menu config
// import { menuItems } from "./menuConfig";

// const toSlug = (s: string) =>
//   s
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, "");

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname() || "/dashboard";
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
//   const [isMobile, setIsMobile] = useState(false);

//   // Keep dropdown open if current path is one of its children
//   useEffect(() => {
//     const matchedParent = menuItems.find((mi) => {
//       if (!mi.children) return false;
//       return mi.children.some(
//         (c) => pathname === c.href
//       );
//     });
//     setActiveDropdown(matchedParent ? matchedParent.name : null);
//   }, [pathname]);

//   useEffect(() => {
//     const checkScreenSize = () => {
//       const mobile = window.innerWidth < 1024;
//       setIsMobile(mobile);
//       setSidebarOpen(!mobile);
//     };

//     checkScreenSize();
//     window.addEventListener("resize", checkScreenSize);
//     return () => window.removeEventListener("resize", checkScreenSize);
//   }, []);

//   // Close sidebar when pathname changes on mobile
//   useEffect(() => {
//     if (isMobile) {
//       setSidebarOpen(false);
//     }
//   }, [pathname, isMobile]);

//   const toggleDropdown = (name: string) => {
//     setActiveDropdown((prev) => (prev === name ? null : name));
//   };

//   const isTabSelected = (href?: string) => {
//     if (!href) return false;
//     return pathname === href;
//   };

//   const hasSelectedChild = (children: any[] | undefined) => {
//     if (!children) return false;
//     return children.some((child) => isTabSelected(child.href));
//   };

//   const handleLogout = () => {
//     console.log("Logging out...");
//     window.location.href = "/login";
//   };

//   return (
//     <ToastProvider>
//       <div className="flex h-screen bg-white">
//         {/* Mobile sidebar backdrop */}
//         {isMobile && sidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black/50 z-20 lg:hidden"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}

//         {/* Sidebar */}
//         <aside
//           className={`fixed lg:static inset-y-0 text-text-col left-0 z-30 w-64 bg-white
//             border-r border-neutral-200 transform transition-transform duration-300 ease-in-out ${
//               sidebarOpen ? "translate-x-0" : "-translate-x-full"
//             } lg:translate-x-0 flex flex-col`}
//         >
//           <div className="flex flex-col h-full justify-between 2xl:py-6 px-3 max-lg:overflow-y-auto custom-scroll">
//             <div>
//               <div className="flex justify-center mt-6">
//                 <Image
//                   src="/authIcons/Alpha-logo.png"
//                   alt="Alpha Logo"
//                   className="h-24 w-24"
//                   width={96}
//                   height={96}
//                 />
//               </div>

//               <nav className="mt-12">
//                 <ul className="space-y-2">
//                   {menuItems.map((item) => {
//                     const isParentSelected = isTabSelected(item.href);
//                     const hasSelectedChildren = hasSelectedChild(item.children);
//                     const shouldHighlightParent =
//                       isParentSelected || hasSelectedChildren;

//                     return (
//                       <li key={item.name}>
//                         {item.children ? (
//                           <div>
//                             <button
//                               onClick={() => toggleDropdown(item.name)}
//                               className={`w-full flex items-center px-4 py-3 txt-16 rounded-md transition-colors ${
//                                 shouldHighlightParent
//                                   ? "  text-[#0E0E0E] font-medium"
//                                   : "text-text-col font-normal hover:bg-neutral-100"
//                               }`}
//                             >
//                               <div className="w-6 h-6 mr-3 flex items-center justify-center">
//                                 <Image
//                                   src={item.icon || ""}
//                                   alt={item.name}
//                                   width={24}
//                                   height={24}
//                                   className={`object-contain ${
//                                     shouldHighlightParent
//                                       ? "filter brightness-0"
//                                       : ""
//                                   }`}
//                                   style={
//                                     shouldHighlightParent
//                                       ? {
//                                           filter:
//                                             "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
//                                         }
//                                       : {}
//                                   }
//                                 />
//                               </div>
//                               <span className="flex-1 text-left">
//                                 {item.name}
//                               </span>
//                               <Image
//                                 src="/dashboardIcons/arrow-down.svg"
//                                 alt="arrow down"
//                                 width={20}
//                                 height={20}
//                                 className={`transform transition-transform ${
//                                   activeDropdown === item.name ? "rotate-180" : ""
//                                 } ${
//                                   shouldHighlightParent ? "filter brightness-0" : ""
//                                 }`}
//                                 style={
//                                   shouldHighlightParent
//                                     ? {
//                                         filter:
//                                           "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
//                                       }
//                                     : {}
//                                 }
//                               />
//                             </button>

//                             {activeDropdown === item.name && (
//                               <ul className="ml-9 mt-1 space-y-1">
//                                 {item.children!.map((child) => {
//                                   const isChildSelected = isTabSelected(
//                                     child.href
//                                   );

//                                   return (
//                                     <li key={child.name}>
//                                       <Link
//                                         href={child.href || "#"}
//                                         onClick={() => isMobile && setSidebarOpen(false)}
//                                         className={`block px-4 py-2 txt-16 rounded-md transition-colors ${
//                                           isChildSelected
//                                             ? "bg-brand text-[#0E0E0E] font-medium"
//                                             : "text-text-col hover:bg-neutral-100 font-normal"
//                                         }`}
//                                       >
//                                         {child.name}
//                                       </Link>
//                                     </li>
//                                   );
//                                 })}
//                               </ul>
//                             )}
//                           </div>
//                         ) : (
//                           <Link
//                             href={item.href || "#"}
//                             onClick={() => isMobile && setSidebarOpen(false)}
//                             className={`flex items-center px-4 py-2 txt-16 rounded-md transition-colors ${
//                               isTabSelected(item.href)
//                                 ? "bg-brand text-[#0E0E0E] font-medium"
//                                 : "font-normal hover:bg-neutral-100"
//                             }`}
//                           >
//                             <div className="w-6 h-6 mr-3 flex items-center justify-center">
//                               <Image
//                                 src={item.icon || ""}
//                                 alt={item.name}
//                                 width={24}
//                                 height={24}
//                                 className={`object-contain ${
//                                   isTabSelected(item.href) ? "filter brightness-0" : ""
//                                 }`}
//                                 style={
//                                   isTabSelected(item.href)
//                                     ? {
//                                         filter:
//                                           "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
//                                       }
//                                     : {}
//                                 }
//                               />
//                             </div>
//                             <span>{item.name}</span>
//                           </Link>
//                         )}
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </nav>
//             </div>

//             <div className="mt-6 py-4  bottom-0 bg-white">
//               <button
//                 onClick={handleLogout}
//                 className="w-full h-10 py-2 px-3 flex items-center gap-2 rounded-lg hover:bg-neutral-100 transition-colors"
//               >
//                 <Image
//                   src="/dashboardIcons/logout.svg"
//                   alt="Logout"
//                   width={24}
//                   height={24}
//                 />
//                 <span className="txt-16 font-medium">Logout</span>
//               </button>
//             </div>
//           </div>
//         </aside>

//         {/* Main content */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <header className="h-16 lg:hidden flex items-center px-4 bg-white border-b border-neutral-200">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="p-2 rounded-md text-neutral-700 hover:bg-neutral-100 focus:outline-none"
//             >
//               <TbLayoutSidebar className="h-6 w-6" />
//             </button>
//           </header>

//           <main className="flex-1 overflow-y-auto p-6 custom-scroll">
//             <div className="mx-auto h-full">{children}</div>
//           </main>
//         </div>

//         {/* Toast Manager (inside provider) */}
//         <ToastManager />
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
        {/* Client-side interactive sidebar */}
        <SidebarClient />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6 custom-scroll">
            <div className="mx-auto h-full">{children}</div>
          </main>
        </div>

        {/* Toast Manager (can be client) */}
        <ToastManager />
      </div>
    </ToastProvider>
  );
}
