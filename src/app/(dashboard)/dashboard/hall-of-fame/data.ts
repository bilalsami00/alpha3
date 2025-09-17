// // src\app\(dashboard)\dashboard\components\HallOfFame\data.ts
// // "database" / fixtures for Hall of Fame
// export type HallItem = {
//   id: number;
//   memberId: string; // references team members list
//   title: string;
//   classYear: number;
// };

// export type TeamMember = {
//   id: string;
//   name: string;
//   username: string;
// };

// export const TEAM_MEMBERS: TeamMember[] = [
//   { id: "brenda", name: "Brenda Clark", username: "brendaclark10" },
//   { id: "carl", name: "Carl Davis", username: "carldavis21" },
//   { id: "diana", name: "Diana Evans", username: "dianaevans15" },
//   { id: "ethan", name: "Ethan Foster", username: "ethanfoster07" },
//   { id: "fiona", name: "Fiona Green", username: "fionagreen09" },
//   { id: "greg", name: "Greg Hall", username: "greghall12" },
//   { id: "holly", name: "Holly Ingram", username: "hollyingram4" },
//   { id: "ian", name: "Ian Johnson", username: "ianjohnson23" },
//   { id: "julia", name: "Julia King", username: "juliaking67" },
//   { id: "kevin", name: "Kevin Lee", username: "kevinlee11" },
// ];

// export const HALL_DATA: HallItem[] = [
//   { id: 1, memberId: "brenda", title: "Mania Champion", classYear: 2021 },
//   { id: 2, memberId: "carl", title: "Monthly MVP – 3x", classYear: 2024 },
//   { id: 3, memberId: "diana", title: "Mania Champion", classYear: 2023 },
//   { id: 4, memberId: "ethan", title: "2× Shield Champ", classYear: 2021 },
//   { id: 5, memberId: "fiona", title: "Mania Champion", classYear: 2022 },
//   { id: 6, memberId: "greg", title: "Monthly MVP – 3x", classYear: 2021 },
//   { id: 7, memberId: "holly", title: "2× Shield Champ", classYear: 2022 },
//   { id: 8, memberId: "ian", title: "Mania Champion", classYear: 2023 },
//   { id: 9, memberId: "julia", title: "Monthly MVP – 3x", classYear: 2022 },
//   { id: 10, memberId: "kevin", title: "2× Shield Champ", classYear: 2021 },
//   // add more if you want to test pagination
// ];








// src/app/(dashboard)/dashboard/components/HallOfFame/data.ts
// "database" / fixtures for Hall of Fame (includes teams + members + hall rows)

export type Team = {
  id: number;
  name: string;
  memberCount?: number;
};

export const INITIAL_TEAMS: Team[] = [
  { id: 1, name: "Sales Team Alpha", memberCount: 12 },
  { id: 2, name: "Marketing Bravo", memberCount: 8 },
  { id: 3, name: "Development Charlie", memberCount: 15 },
  { id: 4, name: "Support Delta", memberCount: 6 },
  { id: 5, name: "Operations Echo", memberCount: 10 },
  { id: 6, name: "Finance Foxtrot", memberCount: 5 },
  { id: 7, name: "HR Golf", memberCount: 4 },
  { id: 8, name: "Design Hotel", memberCount: 7 },
];

export type HallItem = {
  id: number;
  memberId: string; // references team members list
  title: string;
  classYear: number;
  // optional convenience fields:
  teamId?: number; // numeric team reference (matches INITIAL_TEAMS.id)
  teamName?: string; // optional team name copy
};

export type TeamMember = {
  id: string;
  name: string;
  username: string;
  teamId?: number; // prefer numeric ID so components can map to INITIAL_TEAMS
  teamName?: string; // optional human-friendly name (redundant if teamId present)
};

// TEAM_MEMBERS now include teamId (mapped to INITIAL_TEAMS)
export const TEAM_MEMBERS: TeamMember[] = [
  { id: "brenda", name: "Brenda Clark", username: "brendaclark10", teamId: 1 },
  { id: "carl", name: "Carl Davis", username: "carldavis21", teamId: 2 },
  { id: "diana", name: "Diana Evans", username: "dianaevans15", teamId: 3 },
  { id: "ethan", name: "Ethan Foster", username: "ethanfoster07", teamId: 4 },
  { id: "fiona", name: "Fiona Green", username: "fionagreen09", teamId: 5 },
  { id: "greg", name: "Greg Hall", username: "greghall12", teamId: 6 },
  { id: "holly", name: "Holly Ingram", username: "hollyingram4", teamId: 7 },
  { id: "ian", name: "Ian Johnson", username: "ianjohnson23", teamId: 8 },
  { id: "julia", name: "Julia King", username: "juliaking67", teamId: 1 },
  { id: "kevin", name: "Kevin Lee", username: "kevinlee11", teamId: 3 },
];

// HALL_DATA rows also carry teamId/teamName for easier rendering (kept in sync with member)
export const HALL_DATA: HallItem[] = [
  {
    id: 1,
    memberId: "brenda",
    title: "Mania Champion",
    classYear: 2021,
    teamId: 1,
    teamName: "Sales Team Alpha",
  },
  {
    id: 2,
    memberId: "carl",
    title: "Monthly MVP – 3x",
    classYear: 2024,
    teamId: 2,
    teamName: "Marketing Bravo",
  },
  {
    id: 3,
    memberId: "diana",
    title: "Mania Champion",
    classYear: 2023,
    teamId: 3,
    teamName: "Development Charlie",
  },
  {
    id: 4,
    memberId: "ethan",
    title: "2× Shield Champ",
    classYear: 2021,
    teamId: 4,
    teamName: "Support Delta",
  },
  {
    id: 5,
    memberId: "fiona",
    title: "Mania Champion",
    classYear: 2022,
    teamId: 5,
    teamName: "Operations Echo",
  },
  {
    id: 6,
    memberId: "greg",
    title: "Monthly MVP – 3x",
    classYear: 2021,
    teamId: 6,
    teamName: "Finance Foxtrot",
  },
  {
    id: 7,
    memberId: "holly",
    title: "2× Shield Champ",
    classYear: 2022,
    teamId: 7,
    teamName: "HR Golf",
  },
  {
    id: 8,
    memberId: "ian",
    title: "Mania Champion",
    classYear: 2023,
    teamId: 8,
    teamName: "Design Hotel",
  },
  {
    id: 9,
    memberId: "julia",
    title: "Monthly MVP – 3x",
    classYear: 2022,
    teamId: 1,
    teamName: "Sales Team Alpha",
  },
  {
    id: 10,
    memberId: "kevin",
    title: "2× Shield Champ",
    classYear: 2021,
    teamId: 3,
    teamName: "Development Charlie",
  },
];
