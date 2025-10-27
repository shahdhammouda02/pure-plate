"use client";

import { useState } from "react";
import PlannerSidebar from "@/components/planner/Sidebar";

export default function PlannerPage() {
  const [activeSection, setActiveSection] = useState<
    "generate" | "results" | "history" | "goals" | "favorites"
  >("generate");

  return (
    <main className="flex min-h-[calc(100vh-64px)] w-full">
      {/* Sidebar */}
      <PlannerSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
    </main>
  );
}
