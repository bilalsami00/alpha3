// src\app\(dashboard)\dashboard\users\types.ts
export type UserStatus = "active" | "restricted" | "request";

export interface User {
  id: number;
  name: string;
  username?: string;
  email: string;
  status: UserStatus;
  phone?: string;
  salesReason?: string;
}
