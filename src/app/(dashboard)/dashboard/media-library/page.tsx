// src\app\(dashboard)\dashboard\components\MediaLibrary\index.tsx
"use client";
import React, { useEffect, useState } from "react";
import GuidedBreathworkPage from "./guided-breathwork/page";
import GuidedMeditationPage from "./guided-meditation/page";
import VideoOfTheDayPage from "./video-of-the-day/page";
import SalesTrainingPage from "./sales-training/page";

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

export default function MediaLibrary({
  selectedSubTab,
}: {
  selectedSubTab?: string;
}) {
  const controlled =
    typeof selectedSubTab !== "undefined" && isValidTab(selectedSubTab);
  const [active, setActive] = useState<TabName>(() =>
    controlled ? (selectedSubTab as TabName) : TABS[0]
  );

  useEffect(() => {
    if (controlled && isValidTab(selectedSubTab)) {
      setActive(selectedSubTab as TabName);
    }
  }, [selectedSubTab, controlled]);

  return (
    <div className="w-full">
      {/* <div className="flex items-center justify-between mb-6 sm:mt-12"> */}
        {/* <h2 className="txt-24 font-semibold">Media Library</h2> */}

         
      {/* </div> */}

      <div className="flex items-center justify-between mb-6 sm:mt-6 2xl:mt-12 ">
        {active === "Guided Breathwork" && <GuidedBreathworkPage />}
        {active === "Guided Meditation" && <GuidedMeditationPage />}
        {active === "Video of the Day" && <VideoOfTheDayPage />}
        {active === "Sales Training" && <SalesTrainingPage />}
      </div>
    </div>
  );
}
