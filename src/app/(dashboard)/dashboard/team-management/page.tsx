// src\app\(dashboard)\dashboard\team-management\page.tsx
"use client";
import React from "react";
import TeamManagement from "./TeamManagement";

export default function Page() {
  // Route-level page must NOT accept custom props — render the component.
  return <TeamManagement />;
}
