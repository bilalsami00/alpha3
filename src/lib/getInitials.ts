// src\lib\getInitials.ts
// simple shared util to create 2-letter initials
export default function getInitials(name = "") {
  if (!name) return "";
  return name
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}