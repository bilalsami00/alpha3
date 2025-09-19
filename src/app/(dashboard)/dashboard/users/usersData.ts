// src\app\(dashboard)\dashboard\users\usersData.ts
import type { User } from "./types";

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    status: "active",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.j@example.com",
    status: "active",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.w@example.com",
    status: "active",
  },
  {
    id: 5,
    name: "Michael Brown",
    email: "michael.b@example.com",
    status: "active",
  },
  {
    id: 6,
    name: "Emily Davis",
    email: "emily.d@example.com",
    status: "active",
  },
  {
    id: 7,
    name: "David Miller",
    email: "david.m@example.com",
    status: "active",
  },
  {
    id: 8,
    name: "Jessica Taylor",
    email: "jessica.t@example.com",
    status: "active",
  },
  {
    id: 9,
    name: "Daniel Anderson",
    email: "daniel.a@example.com",
    status: "active",
  },
  {
    id: 10,
    name: "Jennifer Thomas",
    email: "jennifer.t@example.com",
    status: "active",
  },
  {
    id: 11,
    name: "Christopher Martinez",
    email: "chris.m@example.com",
    status: "restricted",
  },
  {
    id: 12,
    name: "Amanda Clark",
    email: "amanda.c@example.com",
    status: "restricted",
  },
  {
    id: 13,
    name: "Matthew Rodriguez",
    email: "matt.r@example.com",
    status: "restricted",
  },

  // request users (sales tab) — added phone & salesReason so truncation can be seen
  {
    id: 14,
    name: "Elizabeth Lewis",
    email: "elizabeth.l@example.com",
    status: "request",
    phone: "+44 7700 900123",
    salesReason:
      "I want to join sales because I enjoy client interaction and I'm great at closing complex deals — I also have experience with B2B SaaS solutions and consistently exceed targets.",
  },
  {
    id: 15,
    name: "James Lee",
    email: "james.l@example.com",
    status: "request",
    phone: "+44 7700 934333",
    salesReason:
      "Passionate about product-led growth and customer success; I believe sales is a chance to solve problems by pairing the right customers with the right product.",
  },
  {
    id: 16,
    name: "Olivia Walker",
    email: "olivia.w@example.com",
    status: "request",
    phone: "+44 7700 600223",
    salesReason:
      "I have a background in retail and inside sales; I'm motivated by targets and building long-term relationships.",
  },
  {
    id: 17,
    name: "Andrew Hall",
    email: "andrew.h@example.com",
    status: "request",
    phone: "+44 7700 600123",
    salesReason:
      "Seeking to move into a consultative sales role to better leverage my product knowledge and negotiation skills for enterprise deals.",
  },
  {
    id: 18,
    name: "Sophia Allen",
    email: "sophia.a@example.com",
    status: "request",
    phone: "+44 7700 900555",
    salesReason:
      "I love meeting new people and solving their problems — sales lets me combine empathy with commercial outcomes.",
  },
  {
    id: 19,
    name: "Joshua Young",
    email: "joshua.y@example.com",
    status: "request",
    phone: "+44 7700 900321",
    salesReason:
      "Transitioning from customer success to sales to have direct impact on growth.",
  },
  {
    id: 20,
    name: "Isabella Hernandez",
    email: "isabella.h@example.com",
    status: "request",
    phone: "+44 7700 900777",
    salesReason:
      "I have a proven track record in regional sales and would like to scale those skills to digital products.",
  },

  // additional entries (21-40) kept same, with some request users having salesReason for demonstration
  {
    id: 21,
    name: "Ethan King",
    email: "ethan.k@example.com",
    status: "active",
  },
  { id: 22, name: "Mia Scott", email: "mia.s@example.com", status: "active" },
  {
    id: 23,
    name: "Alexander Green",
    email: "alex.g@example.com",
    status: "active",
  },
  {
    id: 24,
    name: "Charlotte Adams",
    email: "charlotte.a@example.com",
    status: "active",
  },
  {
    id: 25,
    name: "Benjamin Nelson",
    email: "ben.n@example.com",
    status: "active",
  },
  {
    id: 26,
    name: "Ava Carter",
    email: "ava.c@example.com",
    status: "active",
  },
  {
    id: 27,
    name: "Logan Mitchell",
    email: "logan.m@example.com",
    status: "restricted",
  },
  {
    id: 28,
    name: "Harper Perez",
    email: "harper.p@example.com",
    status: "restricted",
  },
  {
    id: 29,
    name: "Elijah Roberts",
    email: "elijah.r@example.com",
    status: "restricted",
  },
  {
    id: 30,
    name: "Amelia Turner",
    email: "amelia.t@example.com",
    status: "restricted",
  },
  {
    id: 31,
    name: "Mason Phillips",
    email: "mason.p@example.com",
    status: "restricted",
  },
  {
    id: 32,
    name: "Luna Campbell",
    email: "luna.c@example.com",
    status: "restricted",
  },
  {
    id: 33,
    name: "Oliver Parker",
    email: "oliver.p@example.com",
    status: "request",
    phone: "+44 7700 343123",
    salesReason:
      "Interested because I want to drive sales in my city and help small businesses succeed with our product.",
  },
  {
    id: 34,
    name: "Chloe Evans",
    email: "chloe.e@example.com",
    status: "request",
    phone: "+44 7700 656123",
    salesReason:
      "Long-form explanation that will be truncated in the UI to show 'online and truncated' behavior. I have experience with lead qualification and inbound conversion.",
  },
  {
    id: 35,
    name: "Henry Edwards",
    email: "henry.e@example.com",
    status: "request",
    phone: "+44 7700 444123",
    salesReason: "Short reason",
  },
  {
    id: 36,
    name: "Grace Collins",
    email: "grace.c@example.com",
    status: "request",
    phone: "+44 7700 900123",
    salesReason: "I love sales",
  },
  {
    id: 37,
    name: "Jack Stewart",
    email: "jack.s@example.com",
    status: "request",
    phone: "+44 7700 900123",
    salesReason: "Looking for growth",
  },
  {
    id: 38,
    name: "Ella Morriss",
    email: "ella.m@example.com",
    status: "request",
    phone: "+44 7700 900444",
    salesReason: "Interested",
  },
  {
    id: 39,
    name: "Lucas Rogers",
    email: "lucas.r@example.com",
    status: "request",
    phone: "+44 7700 900534",
    salesReason: "Experienced rep",
  },
  {
    id: 40,
    name: "Lily Cook",
    email: "lily.c@example.com",
    status: "request",
    phone: "+44 7700 900929",
    salesReason: "Eager to join",
  },
];
