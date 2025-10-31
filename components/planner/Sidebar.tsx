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
  onMobileClose?: () => void;
  onToggle?: (collapsed: boolean) => void;
}

const PlannerSidebar: FC<PlannerSidebarProps> = ({
  activeSection,
  setActiveSection,
  onMobileClose,
  onToggle,
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

  const handleItemClick = (key: string) => {
    setActiveSection(key as any);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) {
      onToggle(!newState); // Send collapsed state to parent
    }
  };

  return (
    <SidebarProvider>
      <Sidebar
        className={`transition-all duration-300 relative h-full bg-green-50 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        <SidebarHeader>
          <div className="flex justify-between items-center p-4">
            {isOpen && (
              <h2 className="text-xl md:text-2xl font-bold text-green-700 truncate">
                Hello, {session?.user?.name?.split(" ")[0] || "Guest"}
              </h2>
            )}

            <button
              className="text-green-600 font-bold text-lg cursor-pointer p-1 hover:bg-green-100 rounded"
              onClick={handleToggle}
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
          <SidebarMenu className="mt-4 space-y-2 md:space-y-5 px-2 md:px-5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeSection === item.key}
                    onClick={() => handleItemClick(item.key)}
                    className={`flex items-center gap-2 text-green-600 font-semibold cursor-pointer p-3 rounded-lg hover:bg-green-100 transition-colors ${
                      isOpen ? "text-base md:text-lg" : "justify-center"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {isOpen && (
                      <span className="truncate text-sm md:text-base">
                        {item.label}
                      </span>
                    )}
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