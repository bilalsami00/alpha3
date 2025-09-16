// src/app/(dashboard)/dashboard/components/SalesManual/salesdata.ts
export type RepChecklistItem = {
  id: number;
  category: string;
  task: string;
};

export type FundamentalScript = {
  id: number;
  term: string;
  script: string;
};

/**
 * Default categories used in checklist modal / inline-selects.
 * (You can import and reuse this where you need categories.)
 */
export const SALES_CATEGORIES = [
  "Bridge",
  "Price Sheet",
  "Overcoming Objections",
];

/** Sample initial data for Reps Checklist (used by RepsChecklist component) */
export const INITIAL_REPS: RepChecklistItem[] = [
  { id: 1, category: "Bridge1", task: "Script Memorized" },
  { id: 2, category: "Bridge2", task: "Script Memorized" },
  { id: 3, category: "Bridge3", task: "Script Memorized" },
  { id: 4, category: "Bridge4", task: "Script Memorized" },
  { id: 5, category: "Bridge5", task: "Script Memorized" },
  { id: 6, category: "Price Sheet1", task: "Script Memorized" },
  { id: 7, category: "Price Sheet2", task: "Business Model Understanding" },
  {
    id: 8,
    category: "Overcoming Objections",
    task: "Let me get a card/No thanks/Bad time",
  },
];

/** Sample initial data for Fundamental Scripts (used by FundamentalScripts component) */
export const INITIAL_SCRIPTS: FundamentalScript[] = [
  { id: 1, term: "It's too expensive", script: "I totally understand..." },
  {
    id: 2,
    term: "I need to think about it",
    script: "That's fair. Just so I can support...",
  },
  {
    id: 3,
    term: "I need to talk to my manager",
    script: "Absolutely. Would it help if...",
  },
];
