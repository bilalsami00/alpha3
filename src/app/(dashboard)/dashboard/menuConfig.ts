// // app/(dashboard)/dashboard/menuConfig.ts
// export interface MenuItem {
//   name: string;
//   href?: string;
//   icon: string;
//   children?: MenuItem[];
// }

// export const menuItems: MenuItem[] = [
//   { 
//     name: "Users", 
//     href: "/dashboard/users",  // Changed from "#users"
//     icon: "/dashboardIcons/user-profile.svg" 
//   },
//   { 
//     name: "Team Management", 
//     href: "/dashboard/team-management",  // Changed from "#team"
//     icon: "/dashboardIcons/people.svg" 
//   },
//   {
//     name: "Daily Content",
//     icon: "/dashboardIcons/note-2.svg",
//     children: [
//       { name: "Quotes", href: "/dashboard/daily-content/quotes", icon: "" },
//       { name: "Buzzwords", href: "/dashboard/daily-content/buzzwords", icon: "" },
//     ],
//   },
//   {
//     name: "Media Library",
//     icon: "/dashboardIcons/video-play.svg",
//     children: [
//       { name: "Guided Breathwork", href: "/dashboard/media-library/guided-breathwork", icon: "" },
//       { name: "Guided Meditation", href: "/dashboard/media-library/guided-meditation", icon: "" },
//       { name: "Video of the Day", href: "/dashboard/media-library/video-of-the-day", icon: "" },
//       { name: "Sales Training", href: "/dashboard/media-library/sales-training", icon: "" },
//     ],
//   },
//   { 
//     name: "Hall of Fame", 
//     href: "/dashboard/hall-of-fame", 
//     icon: "/dashboardIcons/cup.svg" 
//   },
//   {
//     name: "Sales Manual",
//     icon: "/dashboardIcons/document-text.svg",
//     children: [
//       { name: "Reps Checklist", href: "/dashboard/sales-manual/reps-checklist", icon: "" },
//       { name: "Fundamental Scripts", href: "/dashboard/sales-manual/fundamental-scripts", icon: "" },
//       { name: "Sales Bible", href: "/dashboard/sales-manual/sales-bible", icon: "" },
//     ],
//   },
// ];



// src/app/(dashboard)/dashboard/menuConfig.ts
export interface MenuItem {
  name: string;
  href?: string;
  icon: string;
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  { name: "Users", href: "/dashboard/users", icon: "/dashboardIcons/user-profile.svg" },
  { name: "Team Management", href: "/dashboard/team-management", icon: "/dashboardIcons/people.svg" },
  {
    name: "Daily Content",
    icon: "/dashboardIcons/note-2.svg",
    children: [
      { name: "Quotes", href: "/dashboard/daily-content/quotes", icon: "" },
      { name: "Buzzwords", href: "/dashboard/daily-content/buzzwords", icon: "" },
    ],
  },
  {
    name: "Media Library",
    icon: "/dashboardIcons/video-play.svg",
    children: [
      { name: "Guided Breathwork", href: "/dashboard/media-library/guided-breathwork", icon: "" },
      { name: "Guided Meditation", href: "/dashboard/media-library/guided-meditation", icon: "" },
      { name: "Video of the Day", href: "/dashboard/media-library/video-of-the-day", icon: "" },
      { name: "Sales Training", href: "/dashboard/media-library/sales-training", icon: "" },
    ],
  },
  { name: "Hall of Fame", href: "/dashboard/hall-of-fame", icon: "/dashboardIcons/cup.svg" },
  {
    name: "Sales Manual",
    icon: "/dashboardIcons/document-text.svg",
    children: [
      { name: "Reps Checklist", href: "/dashboard/sales-manual/reps-checklist", icon: "" },
      { name: "Fundamental Scripts", href: "/dashboard/sales-manual/fundamental-scripts", icon: "" },
      { name: "Sales Bible", href: "/dashboard/sales-manual/sales-bible", icon: "" },
    ],
  },
];
