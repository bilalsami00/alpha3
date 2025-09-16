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

        {/* Main content */}
        <div className="flex-1 flex max-lg:flex-col overflow-hidden">
        <SidebarClient />
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
