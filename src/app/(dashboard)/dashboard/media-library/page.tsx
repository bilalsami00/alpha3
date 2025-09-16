// src\app\(dashboard)\dashboard\media-library\page.tsx
// server component (no "use client")
import React, { Suspense } from "react";
import MediaLibraryClient from "./MediaLibraryClient";

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <MediaLibraryClient />
    </Suspense>
  );
}
