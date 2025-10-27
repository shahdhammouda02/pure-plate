"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/planner/Sidebar";
import GeneratePlanForm from "@/components/planner/GeneratePlanForm";
import Image from "next/image";
import plan from '@/public/images/plan bg.png'

export default function PlannerPage() {
  const [activeSection, setActiveSection] = useState<
    "generate" | "results" | "history" | "goals" | "favorites"
  >("generate");
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
   <div className="relative min-h-screen w-full">
  {/* Background Image + Blur */}
  <div className="absolute top-0 left-0 w-full h-full -z-10">
    <Image
      src={plan}
      alt="Background"
      fill
      className="object-cover blur-lg"
      priority
    />
    <div className="absolute inset-0 backdrop-blur-lg bg-black/10" />
  </div>

  {/* Sidebar + Main Content */}
  <div className="flex h-screen overflow-hidden relative z-0">
    {/* Mobile Sidebar Overlay */}
    {isMobile && sidebarOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    {/* Sidebar */}
    <div className={`
      ${isMobile 
        ? `fixed top-0 left-0 h-screen z-50 transform transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`
        : 'relative w-64 shrink-0 h-full'
      }
    `}>
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onMobileClose={() => setSidebarOpen(false)}
      />
    </div>

    {/* Main content area */}
    <main className="flex-1 flex flex-col overflow-auto h-full">
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center p-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-green-700 hover:bg-green-50 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="ml-4 text-lg font-semibold text-green-700 capitalize">
            {activeSection === "generate" && "Generate Plan"}
            {activeSection === "results" && "Results"}
            {activeSection === "history" && "History"}
            {activeSection === "goals" && "Goals"}
            {activeSection === "favorites" && "Favorites"}
          </h1>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <div className="w-full max-w-5xl mx-auto h-full">
          {activeSection === "generate" && <GeneratePlanForm />}
        </div>
      </div>
    </main>
  </div>
</div>

  );
}