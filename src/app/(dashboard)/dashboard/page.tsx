// src/app/(dashboard)/dashboard/page.tsx
import { redirect } from "next/navigation";

export default function DashboardIndex() {
  // redirect to the default dashboard tab
  redirect("/dashboard/users");
}
