// src/app/(dashboard)/dashboard/daily-content/page.tsx
import React, { Suspense } from "react";
import DailyContentClient from "./DailyContentClient";

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <DailyContentClient />
    </Suspense>
  );
}
