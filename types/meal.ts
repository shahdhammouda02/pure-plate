export interface NutrientInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  name: string;
  description: string;
  nutrients: NutrientInfo;
}

export interface MealPlan {
  meals: Meal[];
  totalNutrients: NutrientInfo;
  tip: string;
}

export interface UserInput {
  name: string;
    age: number;
  goal: string;
  ingredients: string;
  mealsPerDay: number;
}