export interface NutrientInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface UserInput {
  age: number;
  activityLevel: string;
  goal: string;
  dietaryPreference: string;
  ingredients: string;
  weight: number;
  height: number;
  mealsPerDay: number;
  planDuration: string;
}

export interface Meal {
  name: string;
  description: string | ((userInput: UserInput, ingredients: string) => string);
  nutrients: NutrientInfo;
  mealTime: "breakfast" | "lunch" | "dinner" | "snack";
}

export interface MealPlan {
  meals: Meal[];
  totalNutrients: NutrientInfo;
  tip: string;
}