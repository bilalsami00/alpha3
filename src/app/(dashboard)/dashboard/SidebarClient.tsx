// src/app/(dashboard)/dashboard/SidebarClient.tsx
"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TbLayoutSidebar } from "react-icons/tb";
import Image from "next/image";
import { menuItems } from "./menuConfig";

const toSlug = (s: string) =>
  s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export default function SidebarClient() {
  const pathname = usePathname() || "/dashboard";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [pathname, isMobile]);

  // Keep dropdown open if one of its children matches current pathname
  useEffect(() => {
    const matchedParent = menuItems.find((mi) => {
      if (!mi.children) return false;
      return mi.children.some((c) => pathname === (c.href ?? `/${toSlug(c.name)}`));
    });
    if (pathname === "/dashboard") {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(matchedParent ? matchedParent.name : null);
    }
  }, [pathname]);

  const toggleDropdown = (name: string) => setActiveDropdown((p) => (p === name ? null : name));

  const isTabSelected = (href?: string) => {
    if (!href) return false;
    // Show Users as selected when on the dashboard root
    if (pathname === "/dashboard") return href === "/dashboard/users";
    return pathname === href;
  };

  const hasSelectedChild = (children?: any[]) => (children ? children.some((c) => isTabSelected(c.href)) : false);

  const handleLogout = () => {
    // your logout logic; this is placeholder
    window.location.href = "/login";
  };

  // Small inner component for parents with children so we can use refs/hooks per parent.
  function SidebarParent({ item }: { item: typeof menuItems[number] }) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const [lineStyle, setLineStyle] = useState<{ top: number; height: number; visible: boolean }>({
      top: 0,
      height: 0,
      visible: false,
    });

    // measure and place the vertical line when dropdown opens / window resizes
    const measure = () => {
      if (!wrapperRef.current || !btnRef.current) return setLineStyle((s) => ({ ...s, visible: false }));

      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const btnRect = btnRef.current.getBoundingClientRect();

      const topPx = Math.max(0, btnRect.bottom - wrapperRect.top); // start right below the button
      const bottomPx = Math.max(0, wrapperRect.bottom - btnRect.bottom - 8); // -8 px padding
      const visible = bottomPx > 6; // show only if there is space
      setLineStyle({ top: topPx, height: bottomPx, visible });
    };

    useLayoutEffect(() => {
      // measure after layout when this parent is active
      if (activeDropdown === item.name) measure();
      // measure also when children expand/collapse on window resize
      const onResize = () => {
        if (activeDropdown === item.name) measure();
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeDropdown]);

    return (
      <div ref={wrapperRef} className="relative">
        <button
          ref={btnRef}
          onClick={() => toggleDropdown(item.name)}
          className={`w-full flex items-center px-4 py-3 txt-16 rounded-md transition-colors ${
            isTabSelected(item.href) || hasSelectedChild(item.children)
              ? "text-[#0E0E0E] font-medium"
              : "text-text-col font-normal hover:bg-neutral-100"
          }`}
        >
          <div className="w-6 h-6 mr-3 flex items-center justify-center">
            <Image
              src={item.icon || ""}
              alt={item.name}
              width={24}
              height={24}
              className={`object-contain ${isTabSelected(item.href) || hasSelectedChild(item.children) ? "filter brightness-0" : ""}`}
            />
          </div>
          <span className="flex-1 text-left">{item.name}</span>
          <Image
            src="/dashboardIcons/arrow-down.svg"
            alt="arrow down"
            width={20}
            height={20}
            className={`transform transition-transform ${activeDropdown === item.name ? "rotate-180" : ""} ${
              isTabSelected(item.href) || hasSelectedChild(item.children) ? "filter brightness-0" : ""
            }`}
          />
        </button>

        {/* vertical grouping line — absolutely positioned inside the wrapper */}
        {lineStyle.visible && activeDropdown === item.name && (
          <div
            aria-hidden
            style={{ top: lineStyle.top, height: lineStyle.height }}
            className="absolute left-7 w-[1px] mt-1 bg-[#F2F5F6] rounded"
          />
        )}

        {activeDropdown === item.name && (
          <ul className="ml-10 mt-1 space-y-1 relative z-10">
            {item.children!.map((child) => {
              const href = child.href || `/dashboard/${toSlug(child.name)}`;
              const isChildSelected = isTabSelected(href);
              return (
                <li key={child.name}>
                  <Link
                    href={href}
                    onClick={() => isMobile && setSidebarOpen(false)}
                    className={`block px-4 py-2 txt-16 rounded-md transition-colors ${
                      isChildSelected ? "bg-brand text-[#0E0E0E] font-medium" : "text-text-col hover:bg-neutral-100 font-normal"
                    }`}
                  >
                    {child.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col`}
      >
        <div className="flex flex-col h-full justify-between 2xl:py-6 px-3 max-lg:overflow-y-auto custom-scroll">
          <div>
            <div className="flex justify-center">
              <Image src="/authIcons/Alpha-logo.png" alt="Alpha Logo" width={96} height={96} className="h-24 w-24" />
            </div>

            <nav className="mt-12">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  return (
                    <li key={item.name}>
                      {item.children ? (
                        // use the SidebarParent component so each parent can measure itself
                        <SidebarParent item={item} />
                      ) : (
                        <Link
                          href={item.href || `/dashboard/${toSlug(item.name)}`}
                          onClick={() => isMobile && setSidebarOpen(false)}
                          className={`flex items-center px-4 py-2 txt-16 rounded-md transition-colors ${
                            isTabSelected(item.href) ? "bg-brand text-[#0E0E0E] font-medium" : "text-text-col font-normal hover:bg-neutral-100"
                          }`}
                        >
                          <div className="w-6 h-6 mr-3 flex items-center justify-center">
                            <Image
                              src={item.icon || ""}
                              alt={item.name}
                              width={24}
                              height={24}
                              className={`object-contain ${isTabSelected(item.href) ? "filter brightness-0" : ""}`}
                            />
                          </div>
                          <span>{item.name}</span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="mt-6 py-4 bottom-0 bg-white">
            <button onClick={handleLogout} className="w-full h-10 py-2 px-3 flex items-center gap-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <Image src="/dashboardIcons/logout.svg" alt="Logout" width={24} height={24} />
              <span className="txt-16 font-medium text-text-col">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header toggle */}
      <header className="h-16 lg:hidden flex items-center px-4 bg-white border-b border-neutral-200">
        <button onClick={() => setSidebarOpen((s) => !s)} className="p-2 rounded-md text-neutral-700 hover:bg-neutral-100 focus:outline-none">
          <TbLayoutSidebar className="h-6 w-6" />
        </button>
      </header>
    </>
  );
}
