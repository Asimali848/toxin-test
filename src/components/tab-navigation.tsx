"use client";

import { useTestStore } from "@/lib/store";
import type { TabType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: "air", label: "Air Tests", icon: "🌫️" },
  { id: "water", label: "Water Tests", icon: "💧" },
  { id: "surface", label: "Wall/Surface Tests", icon: "🧱" },
  { id: "dust", label: "Dust Tests", icon: "🌪️" },
];

export function TabNavigation() {
  const { currentTab, setCurrentTab, setCurrentStep } = useTestStore();
  
  const handleBackToUserInfo = () => {
    setCurrentStep("user-info");
  };

  return (
    <div className="border-border border-b">
      <nav className="flex gap-2 items-center justify-between overflow-x-auto" aria-label="Test categories">
        <Button variant={"outline"} size="icon" onClick={handleBackToUserInfo}>
        <ArrowLeft />
        </Button>
        <div className="w-full flex items-center justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 font-medium text-sm transition-colors",
              currentTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:border-muted hover:text-foreground",
            )}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
        </div>
      </nav>
    </div>
  );
}
