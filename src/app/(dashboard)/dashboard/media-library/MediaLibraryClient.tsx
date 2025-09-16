// src\app\(dashboard)\dashboard\media-library\MediaLibraryClient.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import GuidedBreathwork from "./guided-breathwork/GuidedBreathwork";
import GuidedMeditation from "./guided-meditation/GuidedMeditation";
import VideoOfTheDay from "./video-of-the-day/VideoOfTheDay";
import SalesTraining from "./sales-training/SalesTraining";

const TABS = [
  "Guided Breathwork",
  "Guided Meditation",
  "Video of the Day",
  "Sales Training",
] as const;
type TabName = (typeof TABS)[number];

function isValidTab(t?: string): t is TabName {
  return !!t && (TABS as readonly string[]).includes(t);
}

export default function MediaLibraryClient() {
  const searchParams = useSearchParams();
  const selectedSubTab = searchParams?.get("tab") ?? undefined;

  // default active tab
  const [active, setActive] = useState<TabName>(() =>
    isValidTab(selectedSubTab) ? (selectedSubTab as TabName) : TABS[0]
  );

  // update active when ?tab= changes
  useEffect(() => {
    if (isValidTab(selectedSubTab)) setActive(selectedSubTab as TabName);
  }, [selectedSubTab]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 sm:mt-6 2xl:mt-12 ">
        {active === "Guided Breathwork" && <GuidedBreathwork />}
        {active === "Guided Meditation" && <GuidedMeditation />}
        {active === "Video of the Day" && <VideoOfTheDay />}
        {active === "Sales Training" && <SalesTraining />}
      </div>
    </div>
  );
}
