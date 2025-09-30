// src\app\(dashboard)\dashboard\hood\page.tsx
"use client";
import React from "react";
import Hood from "./hood";

export default function Page() {
  // Route-level page must NOT accept custom props — render the component.
  return <Hood />;
}
