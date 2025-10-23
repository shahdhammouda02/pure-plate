// app/page.tsx
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import hero from "@/public/images/Hero_food.png";

export default function HomePage() {
  const router = useRouter();

  return (
  <main className="relative w-full min-h-screen flex items-center justify-center">
  {/* Hero Image */}
  <div className="absolute inset-0 -z-10">
    <Image
      src={hero}
      alt="Healthy food plate"
      fill
      className="object-cover object-center w-full h-full"
      priority
    />
    <div className="absolute inset-0 bg-black/40" />
  </div>

  {/* Content */}
  <div className="flex flex-col items-center justify-center text-center px-4 space-y-6">
    <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">PurePlate</h1>
    <p className="text-xl md:text-2xl text-white/90 max-w-2xl drop-shadow-md">
      AI-powered Healthy Meal & Nutrition Planner
    </p>
    <p className="text-base md:text-lg text-white/80 max-w-lg drop-shadow-sm">
      Eat smart. Feel better. Get personalized meal plans for your goals.
    </p>
    <Button
      size="lg"
      className="bg-green-50 hover:bg-green-100 text-green-700 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg cursor-pointer"
      onClick={() => router.push("/planner")}
    >
      Get Started
    </Button>
  </div>
</main>

  );
}
