"use client";

import { FC, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { List, CheckSquare, Clock, Target, Star, Menu, X } from "lucide-react";

interface PlannerSidebarProps {
  activeSection: string;
  setActiveSection: (
    section: "generate" | "results" | "history" | "goals" | "favorites"
  ) => void;
}

const PlannerSidebar: FC<PlannerSidebarProps> = ({
  activeSection,
  setActiveSection,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const { data: session } = useSession();

  const menuItems = [
    { key: "generate", label: "Generate Plan", icon: List },
    { key: "results", label: "Results", icon: CheckSquare },
    { key: "history", label: "History", icon: Clock },
    { key: "goals", label: "Goals", icon: Target },
    { key: "favorites", label: "Favorites", icon: Star },
  ];

  return (
    <SidebarProvider>
      <Sidebar
       className={`transition-all duration-300 relative ${
          isOpen ? "w-64" : "w-16"
        } h-full bg-green-50`}
      >
        <SidebarHeader>
          <div className="flex justify-between items-center p-4">
            {isOpen && (
              <h2 className="text-2xl font-bold text-green-700">
                Hello, {session?.user?.name?.split(" ")[0] || "Guest"}
              </h2>
            )}

            <button
              className="text-green-600 font-bold text-lg cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu className="mt-4 space-y-5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeSection === item.key}
                    onClick={() => setActiveSection(item.key as any)}
                    className={`flex items-center gap-2 text-green-600 font-semibold cursor-pointer ${
                      isOpen ? "text-lg" : "justify-center"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {isOpen && item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};

export default PlannerSidebar;
