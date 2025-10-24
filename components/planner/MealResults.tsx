"use client";

import { Card } from "@/components/ui/card";
import type { MealPlan } from "@/types/meal";

interface MealResultsProps {
  data: MealPlan;
}

export default function MealResults({ data }: MealResultsProps) {
  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-green-700">
        Your AI Meal Plan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {data.meals.map((meal, index) => (
          <Card
            key={index}
            className="bg-beige-50 border border-green-200 shadow-lg p-6 rounded-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
          >
            <h3 className="text-lg font-semibold text-green-800 mb-2">{meal.name}</h3>
            <p className="text-green-700 mb-3">{meal.description}</p>
            <div className="flex justify-between text-sm text-green-600 font-medium">
              <span>Calories: {meal.nutrients.calories}</span>
              <span>Protein: {meal.nutrients.protein}g</span>
              <span>Carbs: {meal.nutrients.carbs}g</span>
              <span>Fat: {meal.nutrients.fat}g</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Tip */}
      <p className="mt-6 text-center text-green-800 font-medium text-lg">
        Tip: {data.tip}
      </p>
    </div>
  );
}
