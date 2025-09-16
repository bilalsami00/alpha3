// src\app\(dashboard)\dashboard\daily-content\DailyContentClient.tsx
"use client";
import React from "react";
import QuotesPage from "./quotes/Quotes";
import BuzzwordsPage from "./buzzwords/Buzzwords";
import { useSearchParams } from "next/navigation";
import { EMPTY_ICONS } from "../components/emptyIcons";

type EmptyStateConfig = {
  icon?: string;
  title?: string;
  subtitle?: string;
  actionLabel?: string;
};

export default function DailyContent() {
  // read selectedSubTab from URL query param `tab`
  const searchParams = useSearchParams();
  const selectedSubTab = searchParams?.get("tab") ?? undefined;

  const quotesEmptyConfig: EmptyStateConfig = {
    icon: EMPTY_ICONS.dailyContent,
    title: "No quote add yet",
    subtitle:
      "Add a motivational quote to inspire your team and set the tone for success.",
    actionLabel: "Add Quote",
  };

  const buzzwordsEmptyConfig: EmptyStateConfig = {
    icon: EMPTY_ICONS.dailyContent,
    title: "No buzzword add yet",
    subtitle: "Add a new buzzword to energize the team and keep the lingo fresh.",
    actionLabel: "Add Buzzword",
  };

  if (!selectedSubTab || selectedSubTab === "Quotes") {
    return <QuotesPage emptyStateConfig={quotesEmptyConfig} />;
  }
  if (selectedSubTab === "Buzzwords") {
    return <BuzzwordsPage emptyStateConfig={buzzwordsEmptyConfig} />;
  }

  return (
    <div className="w-full">
      <h2 className="txt-24 font-semibold mb-6">{selectedSubTab}</h2>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p>This section is under development ({selectedSubTab}).</p>
      </div>
    </div>
  );
}
