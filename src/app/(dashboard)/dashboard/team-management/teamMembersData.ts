// app/(dashboard)/dashboard/components/TeamManagement/teamMembersData.ts
import type { TeamMember } from "./types";

export const TEAM_MEMBERS: TeamMember[] = [
  // Sales Team Alpha (teamId: 1)
  {
    id: 1,
    fullName: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    status: "Onboard",
    username: "sjohnson",
    teamId: 1
  },
  {
    id: 2,
    fullName: "Michael Chen",
    email: "michael.chen@company.com",
    status: "Onboard",
    username: "mchen",
    teamId: 1
  },
  {
    id: 3,
    fullName: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    status: "Invited",
    username: "erodriguez",
    teamId: 1
  },
  {
    id: 4,
    fullName: "David Wilson",
    email: "david.wilson@company.com",
    status: "Restricted",
    username: "dwilson",
    teamId: 1
  },
  {
    id: 5,
    fullName: "Jessica Parker",
    email: "jessica.parker@company.com",
    status: "Onboard",
    username: "jparker",
    teamId: 1
  },
  {
    id: 6,
    fullName: "Robert Kim",
    email: "robert.kim@company.com",
    status: "Invited",
    username: "rkim",
    teamId: 1
  },
  {
    id: 7,
    fullName: "Amanda Thompson",
    email: "amanda.thompson@company.com",
    status: "Restricted",
    username: "athompson",
    teamId: 1
  },
  {
    id: 8,
    fullName: "James Miller",
    email: "james.miller@company.com",
    status: "Onboard",
    username: "jmiller",
    teamId: 1
  },

  // Marketing Team Beta (teamId: 2)
  {
    id: 9,
    fullName: "Lisa Anderson",
    email: "lisa.anderson@company.com",
    status: "Onboard",
    username: "landerson",
    teamId: 2
  },
  {
    id: 10,
    fullName: "Brian Taylor",
    email: "brian.taylor@company.com",
    status: "Onboard",
    username: "btaylor",
    teamId: 2
  },
  {
    id: 11,
    fullName: "Olivia Martinez",
    email: "olivia.martinez@company.com",
    status: "Invited",
    username: "omartinez",
    teamId: 2
  },
  {
    id: 12,
    fullName: "Christopher Brown",
    email: "christopher.brown@company.com",
    status: "Restricted",
    username: "cbrown",
    teamId: 2
  },

  // Engineering Team Gamma (teamId: 3)
  {
    id: 13,
    fullName: "Daniel Lee",
    email: "daniel.lee@company.com",
    status: "Onboard",
    username: "dlee",
    teamId: 3
  },
  {
    id: 14,
    fullName: "Sophia Garcia",
    email: "sophia.garcia@company.com",
    status: "Onboard",
    username: "sgarcia",
    teamId: 3
  },
  {
    id: 15,
    fullName: "Kevin White",
    email: "kevin.white@company.com",
    status: "Invited",
    username: "kwhite",
    teamId: 3
  },
  {
    id: 16,
    fullName: "Emma Davis",
    email: "emma.davis@company.com",
    status: "Restricted",
    username: "edavis",
    teamId: 3
  },

  // Support Team Delta (teamId: 4)
  {
    id: 17,
    fullName: "Andrew Clark",
    email: "andrew.clark@company.com",
    status: "Onboard",
    username: "aclark",
    teamId: 4
  },
  {
    id: 18,
    fullName: "Mia Rodriguez",
    email: "mia.rodriguez@company.com",
    status: "Onboard",
    username: "mrodriguez",
    teamId: 4
  },
  {
    id: 19,
    fullName: "Jason Wilson",
    email: "jason.wilson@company.com",
    status: "Invited",
    username: "jwilson",
    teamId: 4
  }
];