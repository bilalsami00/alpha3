// src/app/(dashboard)/dashboard/components/MediaLibrary/mediaData.ts
export type MediaItem = {
  id: string | number;
  title: string;
  description?: string;
  thumbnailUrl?: string | null;
  // optional (you can use this if you later add player links)
  mediaUrl?: string | null;
  // optional metadata
  duration?: string | null;
};

export const CATEGORIES = [
  "Guided Breathwork",
  "Guided Meditation",
  "Video of the Day",
  "Sales Training",
] as const;
export type Category = (typeof CATEGORIES)[number];

/**
 * Initial seed data for the Media Library.
 * Each key is one of the CATEGORIES above.
 */
export const INITIAL_MEDIA: Record<Category, MediaItem[]> = {
  "Guided Breathwork": [
    {
      id: "gb-1",
      title: "Morning Reset",
      description: "3-minute breathwork to clear your mind and focus.",
      thumbnailUrl: "/media-samples/win-the-morning.jpg",
      duration: "03:00",
      mediaUrl: null,
    },
    {
      id: "gb-2",
      title: "Calm Centering",
      description: "5-minute guided breathing for grounding during the day.",
      thumbnailUrl: "/media-samples/calm.jpg",
      duration: "05:00",
      mediaUrl: null,
    },
    {
      id: "gb-3",
      title: "Box Breathing Practice",
      description: "A short paced box breathing exercise to reduce stress.",
      thumbnailUrl: null,
      duration: "04:00",
      mediaUrl: null,
    },
  ],

  "Guided Meditation": [
    {
      id: "gm-1",
      title: "Evening Wind Down",
      description: "A calm guided meditation for sleep preparation.",
      thumbnailUrl: "/media-samples/calm.jpg",
      duration: "10:00",
      mediaUrl: null,
    },
    {
      id: "gm-2",
      title: "Focus & Visualization",
      description: "Visualization practice to improve clarity and goals focus.",
      thumbnailUrl: "/media-samples/visualize.jpg",
      duration: "08:00",
      mediaUrl: null,
    },
    {
      id: "gm-3",
      title: "Quick Recharge",
      description: "2-minute micro-meditation to recenter between tasks.",
      thumbnailUrl: null,
      duration: "02:00",
      mediaUrl: null,
    },
  ],

  "Video of the Day": [
    {
      id: "votd-1",
      title: "Daily Insight — Closing Tip",
      description: "One quick sales tip to sharpen your close today.",
      thumbnailUrl: "/media-samples/daily-tip.jpg",
      duration: "01:30",
      mediaUrl: null,
    },
    {
      id: "votd-2",
      title: "Role-play Highlight",
      description: "Short clip of an effective objection-handling role-play.",
      thumbnailUrl: null,
      duration: "02:45",
      mediaUrl: null,
    },
    {
      id: "votd-3",
      title: "Product Micro-Demo",
      description: "30-second demo of a key feature to reference on calls.",
      thumbnailUrl: "/media-samples/product-demo.jpg",
      duration: "00:30",
      mediaUrl: null,
    },
  ],

  "Sales Training": [
    {
      id: "st-1",
      title: "Objection Handling",
      description: "Role-play and best responses for common objections.",
      thumbnailUrl: null,
      duration: "12:00",
      mediaUrl: null,
    },
    {
      id: "st-2",
      title: "Discovery Techniques",
      description: "How to ask discovery questions that reveal buying signals.",
      thumbnailUrl: "/media-samples/discovery.jpg",
      duration: "09:30",
      mediaUrl: null,
    },
    {
      id: "st-3",
      title: "Demo Walkthrough",
      description: "Structured demo flow to keep the prospect engaged.",
      thumbnailUrl: "/media-samples/demo-walkthrough.jpg",
      duration: "15:00",
      mediaUrl: null,
    },
  ],
};
