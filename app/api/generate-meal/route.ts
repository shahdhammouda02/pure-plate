// app/api/generate-plan/route.ts
import { MEAL_DATABASE } from "@/data/meals";
import tips from "@/data/tips.json";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mealsPerDay, dietaryPreference, goal, activityLevel, ingredients } = body;

    // Filter meals based on dietary preference
    const filteredMeals = MEAL_DATABASE.filter(meal => {
      if (dietaryPreference === 'vegan') {
        return !meal.name.toLowerCase().includes('chicken') && 
               !meal.name.toLowerCase().includes('salmon') && 
               !meal.name.toLowerCase().includes('yogurt') &&
               !meal.name.toLowerCase().includes('egg');
      }
      if (dietaryPreference === 'vegetarian') {
        return !meal.name.toLowerCase().includes('chicken') && 
               !meal.name.toLowerCase().includes('salmon');
      }
      if (dietaryPreference === 'pescatarian') {
        return !meal.name.toLowerCase().includes('chicken');
      }
      return true;
    });

    // Select meals based on mealsPerDay
    const selectedMeals = filteredMeals.slice(0, Math.min(mealsPerDay, filteredMeals.length));

    // Process meal descriptions
    const processedMeals = selectedMeals.map(meal => ({
      ...meal,
      description: typeof meal.description === 'function' 
        ? meal.description(body, ingredients || '')
        : meal.description
    }));

    // Calculate total nutrients
    const totalNutrients = processedMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.nutrients.calories,
      protein: acc.protein + meal.nutrients.protein,
      carbs: acc.carbs + meal.nutrients.carbs,
      fat: acc.fat + meal.nutrients.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    return NextResponse.json({
      meals: processedMeals,
      totalNutrients,
      tip: randomTip,
    });
  } catch (error) {
    console.error("Error generating meal plan:", error);
    return NextResponse.json(
      { error: "Failed to generate meal plan" },
      { status: 500 }
    );
  }
}