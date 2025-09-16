// src\app\(dashboard)\dashboard\components\HallOfFame\data.ts
// "database" / fixtures for Hall of Fame
export type HallItem = {
  id: number;
  memberId: string; // references team members list
  title: string;
  classYear: number;
};

export type TeamMember = {
  id: string;
  name: string;
  username: string;
};

export const TEAM_MEMBERS: TeamMember[] = [
  { id: "brenda", name: "Brenda Clark", username: "brendaclark10" },
  { id: "carl", name: "Carl Davis", username: "carldavis21" },
  { id: "diana", name: "Diana Evans", username: "dianaevans15" },
  { id: "ethan", name: "Ethan Foster", username: "ethanfoster07" },
  { id: "fiona", name: "Fiona Green", username: "fionagreen09" },
  { id: "greg", name: "Greg Hall", username: "greghall12" },
  { id: "holly", name: "Holly Ingram", username: "hollyingram4" },
  { id: "ian", name: "Ian Johnson", username: "ianjohnson23" },
  { id: "julia", name: "Julia King", username: "juliaking67" },
  { id: "kevin", name: "Kevin Lee", username: "kevinlee11" },
];

export const HALL_DATA: HallItem[] = [
  { id: 1, memberId: "brenda", title: "Mania Champion", classYear: 2021 },
  { id: 2, memberId: "carl", title: "Monthly MVP – 3x", classYear: 2024 },
  { id: 3, memberId: "diana", title: "Mania Champion", classYear: 2023 },
  { id: 4, memberId: "ethan", title: "2× Shield Champ", classYear: 2021 },
  { id: 5, memberId: "fiona", title: "Mania Champion", classYear: 2022 },
  { id: 6, memberId: "greg", title: "Monthly MVP – 3x", classYear: 2021 },
  { id: 7, memberId: "holly", title: "2× Shield Champ", classYear: 2022 },
  { id: 8, memberId: "ian", title: "Mania Champion", classYear: 2023 },
  { id: 9, memberId: "julia", title: "Monthly MVP – 3x", classYear: 2022 },
  { id: 10, memberId: "kevin", title: "2× Shield Champ", classYear: 2021 },
  // add more if you want to test pagination
];
