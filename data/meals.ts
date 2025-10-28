// data/meals.ts
import { Meal, UserInput } from "@/types/meal";

export const MEAL_DATABASE: Meal[] = [
  {
    name: "Breakfast Bowl",
    description: (userInput: UserInput, ingredients: string) => 
      `Oatmeal with ${userInput.dietaryPreference === 'vegan' ? 'almond milk' : 'milk'} and fresh fruits${ingredients ? ` with ${ingredients.split(',')[0]}` : ''}`,
    nutrients: { calories: 350, protein: 15, carbs: 60, fat: 8 },
    mealTime: "breakfast"
  },
  {
    name: "Protein Power Breakfast",
    description: (userInput: UserInput, ingredients: string) => 
      `Scrambled ${userInput.dietaryPreference === 'vegan' ? 'tofu' : 'eggs'} with whole grain toast and avocado`,
    nutrients: { calories: 420, protein: 25, carbs: 30, fat: 22 },
    mealTime: "breakfast"
  },
  {
    name: "Grilled Chicken Bowl",
    description: (userInput: UserInput, ingredients: string) => 
      `Grilled ${userInput.dietaryPreference === 'vegan' ? 'tofu' : 'chicken'} breast with brown rice and steamed broccoli${ingredients ? `, featuring ${ingredients.split(',')[0]}` : ''}`,
    nutrients: { calories: 450, protein: 40, carbs: 35, fat: 10 },
    mealTime: "lunch"
  },
  {
    name: "Quinoa Power Lunch",
    description: (userInput: UserInput, ingredients: string) => 
      `Quinoa salad with ${userInput.dietaryPreference === 'vegan' ? 'chickpeas' : userInput.dietaryPreference === 'vegetarian' ? 'feta cheese' : 'grilled chicken'} and mixed vegetables`,
    nutrients: { calories: 480, protein: 28, carbs: 55, fat: 18 },
    mealTime: "lunch"
  },
  {
    name: "Salmon with Quinoa",
    description: (userInput: UserInput, ingredients: string) => 
      `Baked ${userInput.dietaryPreference === 'vegan' ? 'tofu steak' : userInput.dietaryPreference === 'vegetarian' ? 'portobello mushroom' : 'salmon'} served with quinoa and asparagus${ingredients ? ` and ${ingredients.split(',')[0]}` : ''}`,
    nutrients: { calories: 520, protein: 42, carbs: 30, fat: 15 },
    mealTime: "dinner"
  },
  {
    name: "Vegetable Stir Fry",
    description: (userInput: UserInput, ingredients: string) => 
      `Mixed vegetable stir fry with ${userInput.dietaryPreference === 'vegan' ? 'tofu' : userInput.dietaryPreference === 'vegetarian' ? 'tofu' : 'chicken'} in light soy sauce${ingredients ? `, including ${ingredients.split(',')[0]}` : ''}`,
    nutrients: { calories: 380, protein: 22, carbs: 45, fat: 12 },
    mealTime: "dinner"
  },
  {
    name: "Greek Yogurt Snack",
    description: (userInput: UserInput, ingredients: string) => 
      `${userInput.dietaryPreference === 'vegan' ? 'Coconut' : 'Greek'} yogurt with berries and a drizzle of honey${ingredients ? `, topped with ${ingredients.split(',')[0]}` : ''}`,
    nutrients: { calories: 180, protein: 12, carbs: 22, fat: 5 },
    mealTime: "snack"
  },
  {
    name: "Protein Smoothie",
    description: (userInput: UserInput, ingredients: string) => 
      `Protein smoothie with ${userInput.dietaryPreference === 'vegan' ? 'plant-based protein' : 'whey protein'}, banana, and spinach${ingredients ? `, blended with ${ingredients.split(',')[0]}` : ''}`,
    nutrients: { calories: 220, protein: 20, carbs: 25, fat: 4 },
    mealTime: "snack"
  },
  {
    name: "Energy Bars",
    description: (userInput: UserInput, ingredients: string) => 
      `Homemade energy bars with oats, nuts, and ${userInput.dietaryPreference === 'vegan' ? 'maple syrup' : 'honey'}${ingredients ? `, including ${ingredients.split(',')[0]}` : ''}`,
    nutrients: { calories: 150, protein: 8, carbs: 20, fat: 6 },
    mealTime: "snack"
  }
];

// Helper function to get meals by time of day
export const getMealsByTime = (mealTime: string): Meal[] => {
  return MEAL_DATABASE.filter(meal => meal.mealTime === mealTime);
};

// Helper function to get all meal times available
export const getAvailableMealTimes = (): string[] => {
  return Array.from(new Set(MEAL_DATABASE.map(meal => meal.mealTime)));
};