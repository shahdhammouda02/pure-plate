"use client";

import { useState } from "react";
import MealForm from "@/components/planner/MealForm";
import MealResults from "@/components/planner/MealResults";
import { Button } from "@/components/ui/button";
import type { UserInput, MealPlan } from "@/types/meal";
import {
  Apple,
  Carrot,
  Egg,
  Leaf,
  Coffee,
  Fish,
  Cherry,
  Nut
} from "lucide-react";

export default function PlannerPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MealPlan | null>(null);
  const [showResults, setShowResults] = useState(false);

  async function handleGenerate(values: UserInput) {
    if (!values.name || !values.age || !values.goal || !values.ingredients || values.mealsPerDay < 1) {
      setError("Please fill all fields correctly");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to generate meal plan");

      const json: MealPlan = await res.json();
      setData(json);
      setShowResults(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleBackToForm = () => {
    setShowResults(false);
    setData(null);
    setError(null);
  };

  return (
    <main className="relative w-full flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-green-50 to-beige-50 min-h-screen py-10 px-4">

      {/* Background Lucide Icons around form */}
      <Apple className="absolute top-8 left-8 w-10 h-10 text-red-400 animate-bounce-slow" />
      <Carrot className="absolute top-20 right-16 w-12 h-12 text-orange-400 animate-spin-slow" />
      <Egg className="absolute bottom-32 left-14 w-14 h-14 text-yellow-300 animate-bounce-slow" />
      <Leaf className="absolute bottom-24 right-20 w-12 h-12 text-green-600 animate-spin-slow" />
      <Coffee className="absolute top-1/2 left-1/4 w-10 h-10 text-brown-400 animate-bounce-slow" />
      <Fish className="absolute top-1/3 left-1/2 w-12 h-12 text-blue-400 animate-spin-slow" />
        <Cherry className="absolute top-3/4 right-1/4 w-10 h-10 text-red-600 animate-spin-slow" />
      <Nut className="absolute top-1/3 left-3/4 w-10 h-10 text-orange-500 animate-spin-slow" />

      {/* Form / Results Container */}
      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center space-y-8 p-6 
                      bg-gradient-to-br from-green-100/80 to-beige-100/80 
                      rounded-xl shadow-xl backdrop-blur-md border border-green-200">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 text-center drop-shadow-lg">
          PurePlate Planner
        </h1>

        {error && <p className="text-red-600 font-medium text-center">{error}</p>}

        {!showResults ? (
          <MealForm onGenerate={handleGenerate} loading={loading} />
        ) : (
          <div className="w-full space-y-6">
            <MealResults data={data!} />
            <Button
              variant="outline"
              className="w-full text-green-700 border-green-700 hover:bg-green-50"
              onClick={handleBackToForm}
            >
              Generate Another Plan
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
