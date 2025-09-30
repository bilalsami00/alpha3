// hoodRequestsData.ts
// Small dataset used only by the Hood UI to mark which members have requested Hood access.
// This intentionally does NOT change the original TEAM_MEMBERS file.
// Replace the numbers in the Set with real member IDs (from TEAM_MEMBERS) when available.

export const HOOD_REQUESTED_IDS = new Set<number>([
  // example: member IDs who requested Hood
  3, 6, 15, 19, 23
]);
