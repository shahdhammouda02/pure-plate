"use client";

import { useState } from "react";
import MealForm from "@/components/planner/MealForm";
import MealResults from "@/components/planner/MealResults";
import { Button } from "@/components/ui/button";
import type { UserInput, MealPlan } from "@/types/meal";
import planner from "@/public/images/planner.png";
import Image from "next/image";

export default function PlannerPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MealPlan | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [formValues, setFormValues] = useState<UserInput | null>(null);

  async function handleGenerate(values: UserInput) {
    if (!values.name || !values.age || !values.goal || !values.ingredients || !values.dietaryPreference) {
      setError("Please fill all fields correctly");
      return;
    }
    setLoading(true);
    setError(null);
    setFormValues(values);

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
    setFormValues(null);
  };

  return (
    <main className="relative w-full flex flex-col items-center justify-start min-h-screen py-10 px-4">

      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={planner}
          alt="Planner Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>

      {/* Form / Results Container */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center justify-center space-y-8 p-6 
                      rounded-xl shadow-xl backdrop-blur-md border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 text-center drop-shadow-lg">
          PurePlate Planner
        </h1>

        {error && <p className="text-red-600 font-medium text-center">{error}</p>}

        {!showResults ? (
          <MealForm onGenerate={handleGenerate} loading={loading} />
        ) : (
          <div className="w-full space-y-6">
            <MealResults data={data!} userName={formValues!.name} />
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
