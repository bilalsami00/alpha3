// src/app/page.tsx
"use client"; // optional — you can omit if you keep this as a server component and import a client one
import LoginPage from "./(auth)/login/page";

export default function RootPage() {
  return <LoginPage />;
}
