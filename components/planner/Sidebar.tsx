"use client";

import { FC, useState, useEffect } from "react";
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
  activeSection = "generate",
  setActiveSection,
  onMobileClose,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      onToggle(!newState);
    }
  };

  return (
    <SidebarProvider 
      defaultOpen={true}
      // prevent overlay in mobile
      open={isMobile ? false : undefined}
    >
      <Sidebar
        className={`transition-all duration-300 relative h-full bg-green-50 ${
          isOpen ? "w-64" : "w-16"
        }`}
        // prevent automatic behavior on small screens
        collapsible={isMobile ? "none" : "offcanvas"}
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

        <SidebarContent className="shadow-lg">
          {isMobile && isOpen && (
            <div className="px-4 pb-4 border-b border-green-200">
              <h2 className="text-lg font-bold text-green-700">
                Hello, {session?.user?.name?.split(" ")[0] || "Guest"}
              </h2>
            </div>
          )}

          <SidebarMenu className="mt-4 space-y-2 md:space-y-5 px-2 md:px-5 mb-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.key;
              return (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={isActive}
                    onClick={() => handleItemClick(item.key)}
                    className={`flex items-center gap-2 font-semibold cursor-pointer p-3 rounded-lg transition-colors ${
                      isOpen ? "text-base md:text-lg" : "justify-center"
                    } ${
                      isActive
                        ? "bg-green-100 text-green-800"
                        : "text-green-600 hover:bg-green-100"
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