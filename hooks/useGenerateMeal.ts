import { useState } from "react";
import type { MealPlan } from "@/types/meal";

export function useGenerateMeal() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MealPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generateMeal(input: Record<string, unknown>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to generate meal");
      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, generateMeal };
}