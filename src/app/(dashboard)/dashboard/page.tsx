// // src/app/(dashboard)/dashboard/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { TbLayoutSidebar } from "react-icons/tb";
// import Image from "next/image";

// // Import shared components
// import { ToastProvider } from "./lib/ToastContext";
// import ToastManager from "./components/ToastManager";

// import { useRouter } from "next/navigation";

// // Import menu config
// import { menuItems } from "./menuConfig";

// // Import screen components
// import Users from "./users/page";
// import TeamManagement from "./team-management/page";
// import DailyContent from "./daily-content/page"
// import MediaLibrary from "./media-library/page";
// import HallOfFame from "./hall-of-fame/page";
// import SalesManual from "./sales-manual/page";

// export default function DashboardWrapper() {
//   return (
//     <ToastProvider>
//       <Dashboard />
//     </ToastProvider>
//   );
// }

// function Dashboard() {
//   const router = useRouter();

//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [selectedTab, setSelectedTab] = useState<string>("Users");

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

//   const toggleDropdown = (name: string) => {
//     setActiveDropdown(activeDropdown === name ? null : name);
//   };

//   const handleTabSelect = (
//     tabName: string,
//     isChild: boolean = false,
//     parentName?: string
//   ) => {
//     if (isChild) {
//       setSelectedTab(tabName);
//       if (parentName) {
//         setActiveDropdown(parentName);
//       }
//     } else {
//       const menuItem = menuItems.find((item) => item.name === tabName);
//       if (menuItem && !menuItem.children) {
//         setSelectedTab(tabName);
//       }
//     }
//   };

//   const handleLogout = () => {
//     console.log("Logging out...");
//     // router.replace()
//     router.push("/login");
//   };

//   const isTabSelected = (tabName: string) => {
//     return selectedTab === tabName;
//   };

//   const hasSelectedChild = (children: any[] | undefined) => {
//     if (!children) return false;
//     return children.some((child) => isTabSelected(child.name));
//   };

//   // Components map for rendering content
//   const componentsMap: Record<string, React.ComponentType<any>> = {
//     Users: Users,
//     "Team Management": TeamManagement,
//     Quotes: () => <DailyContent selectedSubTab="Quotes" />,
//     Buzzwords: () => <DailyContent selectedSubTab="Buzzwords" />,
//     "Guided Breathwork": () => (
//       <MediaLibrary selectedSubTab="Guided Breathwork" />
//     ),
//     "Guided Meditation": () => (
//       <MediaLibrary selectedSubTab="Guided Meditation" />
//     ),
//     "Video of the Day": () => (
//       <MediaLibrary selectedSubTab="Video of the Day" />
//     ),
//     "Sales Training": () => <MediaLibrary selectedSubTab="Sales Training" />,
//     "Hall of Fame": HallOfFame,
//     "Reps Checklist": () => <SalesManual selectedSubTab="Reps Checklist" />,
//     "Fundamental Scripts": () => (
//       <SalesManual selectedSubTab="Fundamental Scripts" />
//     ),
//     "Sales Bible": () => <SalesManual selectedSubTab="Sales Bible" />,
//   };

//   const renderContent = () => {
//     const Component = componentsMap[selectedTab];
//     if (Component) return <Component />;

//     return (
//       <div>
//         <h1 className="text-3xl font-bold text-neutral-800 mb-6">
//           Welcome to Your Dashboard
//         </h1>
//         <div className="bg-white p-6 rounded-lg shadow-sm">
//           <p className="text-neutral-600">
//             This is your main content area. Select an option from the sidebar to
//             navigate to different sections.
//           </p>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="flex h-screen bg-white">
//       {/* Mobile sidebar backdrop */}
//       {isMobile && sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-20 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//             {/* removed and put in layout of dsahboard */}


//       {/* Main content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <header className="h-16 lg:hidden flex items-center px-4 bg-white border-b border-neutral-200">
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-2 rounded-md text-neutral-700 hover:bg-neutral-100 focus:outline-none"
//           >
//             <TbLayoutSidebar className="h-6 w-6" />
//           </button>
//         </header>

//         <main className="flex-1 overflow-y-auto p-6 custom-scroll">
//           <div className="mx-auto">{renderContent()}</div>
//         </main>
//       </div>

//       {/* Toast Manager */}
//       <ToastManager />
//     </div>
//   );
// }








// src/app/(dashboard)/dashboard/page.tsx
import { redirect } from "next/navigation";

export default function DashboardIndex() {
  // redirect to the default dashboard tab
  redirect("/dashboard/users");
}
