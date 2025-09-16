// src/app/(dashboard)/dashboard/components/TeamManagement/types.ts
export type MemberStatusFilter = "All" | "Onboard" | "Invited";

export type Team = {
  id: number;
  name: string;
  memberCount: number;
};

export type TeamMember = {
  id: number;
  fullName: string;
  username?: string;
  email?: string;
  status?: "Onboard" | "Invited" | "Restricted";
  teamId: number;
};
