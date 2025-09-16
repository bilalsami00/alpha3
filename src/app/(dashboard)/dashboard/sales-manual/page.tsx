// src\app\(dashboard)\dashboard\sales-manual\page.tsx
import React, { Suspense } from "react";
import SalesManualClient from "./SalesManualClient";

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <SalesManualClient />
    </Suspense>
  );
}
