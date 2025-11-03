// app/api/generate-meal/route.ts
import { edamamService } from '@/lib/edamam';
import { NextResponse } from 'next/server';

const tips = [
  "Stay hydrated by drinking at least 8 glasses of water daily.",
  "Include a variety of colorful vegetables for optimal nutrition.",
  "Don't skip breakfast - it kickstarts your metabolism for the day.",
  "Plan your meals ahead to avoid unhealthy last-minute choices.",
  "Listen to your body's hunger and fullness cues.",
  "Include healthy fats like avocado and nuts in your diet.",
  "Meal prep on weekends to save time during busy weekdays.",
  "Balance your plate with protein, carbs, and healthy fats.",
  "Choose whole grains over refined carbohydrates when possible.",
  "Enjoy your favorite foods in moderation - no food is off limits!"
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mealsPerDay, dietaryPreference, goal, activityLevel, ingredients } = body;

    // Use a simpler approach - generate meals without overwhelming the API
    const mealTimes = getMealTimes(mealsPerDay);
    const allMeals = [];

    // Generate one meal per meal time to minimize API calls
    for (const mealTime of mealTimes) {
      const mealSuggestions = await edamamService.generateMealSuggestions(
        dietaryPreference,
        mealTime,
        ingredients
      );
      
      if (mealSuggestions.length > 0) {
        allMeals.push(mealSuggestions[0]); // Just take the first suggestion
      }
    }

    // If we don't have enough meals, use enhanced fallback
    if (allMeals.length < mealsPerDay) {
      const additionalMeals = getEnhancedFallbackMeals(mealsPerDay - allMeals.length, dietaryPreference, mealTimes.slice(allMeals.length));
      allMeals.push(...additionalMeals);
    }

    // Calculate total nutrients
    const totalNutrients = allMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.nutrients.calories,
      protein: acc.protein + meal.nutrients.protein,
      carbs: acc.carbs + meal.nutrients.carbs,
      fat: acc.fat + meal.nutrients.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    return NextResponse.json({
      meals: allMeals,
      totalNutrients,
      tip: randomTip,
    });
  } catch (error) {
    console.error("Error generating meal plan:", error);
    
    // Use enhanced fallback data
    const fallbackResponse = await generateEnhancedFallbackPlan(await req.json());
    return NextResponse.json(fallbackResponse);
  }
}

function getMealTimes(mealsPerDay: number): string[] {
  const allMealTimes = ['breakfast', 'lunch', 'dinner', 'snack'];
  return allMealTimes.slice(0, Math.min(mealsPerDay, allMealTimes.length));
}

function getEnhancedFallbackMeals(count: number, dietaryPreference: string, mealTimes: string[]) {
  const enhancedMeals = {
    breakfast: {
      name: 'Energy Breakfast',
      description: `Nutritious ${dietaryPreference} breakfast to start your day`,
      nutrients: { calories: 350, protein: 15, carbs: 55, fat: 8 }
    },
    lunch: {
      name: 'Balanced Lunch',
      description: `Satisfying ${dietaryPreference} lunch for sustained energy`,
      nutrients: { calories: 420, protein: 20, carbs: 45, fat: 12 }
    },
    dinner: {
      name: 'Hearty Dinner', 
      description: `Complete ${dietaryPreference} dinner with all essential nutrients`,
      nutrients: { calories: 480, protein: 30, carbs: 40, fat: 15 }
    },
    snack: {
      name: 'Healthy Snack',
      description: `Light ${dietaryPreference} snack to keep you going`,
      nutrients: { calories: 180, protein: 8, carbs: 22, fat: 6 }
    }
  };

  return mealTimes.slice(0, count).map(mealTime => ({
    ...enhancedMeals[mealTime as keyof typeof enhancedMeals],
    mealTime: mealTime as "breakfast" | "lunch" | "dinner" | "snack"
  }));
}

async function generateEnhancedFallbackPlan(body: any) {
  const { mealsPerDay, dietaryPreference } = body;
  const mealTimes = getMealTimes(mealsPerDay);
  const meals = getEnhancedFallbackMeals(mealsPerDay, dietaryPreference, mealTimes);

  const totalNutrients = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.nutrients.calories,
    protein: acc.protein + meal.nutrients.protein,
    carbs: acc.carbs + meal.nutrients.carbs,
    fat: acc.fat + meal.nutrients.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return {
    meals,
    totalNutrients,
    tip: randomTip,
  };
}