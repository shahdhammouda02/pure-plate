"use client";

import type { MealPlan } from "@/types/meal";

interface MealResultsProps {
  data: MealPlan;
  userName: string; // directly from form input
}

export default function MealResults({ data, userName }: MealResultsProps) {
  return (
    <div className="w-full flex flex-col items-center space-y-8">
      {/* Personalized greeting */}
      <h2 className="text-2xl md:text-3xl font-bold text-green-700 text-center drop-shadow-md">
        Here’s your meal plan, {userName}!
      </h2>

      {/* Meals Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full border border-green-200 rounded-xl overflow-hidden shadow-lg">
          <thead className="bg-green-100 text-green-800 font-semibold text-left">
            <tr>
              <th className="px-4 py-3">Meal</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Calories</th>
              <th className="px-4 py-3">Protein (g)</th>
              <th className="px-4 py-3">Carbs (g)</th>
              <th className="px-4 py-3">Fat (g)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-200">
            {data.meals.map((meal, idx) => (
              <tr
                key={idx}
                className="hover:bg-green-50 transition-colors duration-300 cursor-pointer"
              >
                <td className="px-4 py-2 font-medium text-green-700">{meal.name}</td>
                <td className="px-4 py-2 text-green-600">{meal.description}</td>
                <td className="px-4 py-2 text-green-700">{meal.nutrients.calories}</td>
                <td className="px-4 py-2 text-green-700">{meal.nutrients.protein}</td>
                <td className="px-4 py-2 text-green-700">{meal.nutrients.carbs}</td>
                <td className="px-4 py-2 text-green-700">{meal.nutrients.fat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tip */}
      {data.tip && (
        <p className="mt-6 text-center text-green-800 font-medium text-lg drop-shadow-sm">
          Tip: {data.tip}
        </p>
      )}
    </div>
  );
}
