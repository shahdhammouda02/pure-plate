// lib/edamam.ts

export interface EdamamFood {
  food: {
    label: string;
    nutrients: {
      ENERC_KCAL: number;
      PROCNT: number;
      CHOCDF: number;
      FAT: number;
    };
    category: string;
  };
}

export interface EdamamSearchResponse {
  hints: EdamamFood[];
}

export interface MealSuggestion {
  name: string;
  description: string;
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  mealTime: "breakfast" | "lunch" | "dinner" | "snack";
}

class EdamamService {
  private baseURL = process.env.EDAMAM_BASE_URL;
  private appId = process.env.EDAMAM_APP_ID;
  private appKey = process.env.EDAMAM_APP_KEY;
  private requestCount = 0;
  private lastRequestTime = 0;
  private readonly RATE_LIMIT_DELAY = 1000; // 1 second between requests

  async searchFoods(query: string): Promise<EdamamFood[]> {
    try {
      // Add null checks for environment variables
      if (!this.appId || !this.appKey || !this.baseURL) {
        console.warn('Edamam API credentials not configured, using fallback data');
        return [];
      }

      // Rate limiting: wait if we're making requests too quickly
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
        await this.delay(this.RATE_LIMIT_DELAY - timeSinceLastRequest);
      }

      const response = await fetch(
        `${this.baseURL}/food-database/v2/parser?app_id=${this.appId}&app_key=${this.appKey}&ingr=${encodeURIComponent(query)}&nutrition-type=cooking`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      this.lastRequestTime = Date.now();
      this.requestCount++;

      if (response.status === 429) {
        console.warn('Edamam rate limit reached, using fallback data');
        return [];
      }

      if (!response.ok) {
        throw new Error(`Edamam API error: ${response.status}`);
      }

      const data: EdamamSearchResponse = await response.json();
      return data.hints || [];
    } catch (error) {
      console.error('Error searching foods:', error);
      return [];
    }
  }

  async generateMealSuggestions(
    dietaryPreference: string,
    mealTime: string,
    ingredients?: string
  ): Promise<MealSuggestion[]> {
    // If we've hit rate limits or have no credentials, use fallback immediately
    if (!this.appId || !this.appKey || this.requestCount > 50) {
      return this.getFallbackMeals(dietaryPreference, mealTime);
    }

    const baseQueries = this.getBaseQueries(dietaryPreference, mealTime, ingredients);
    const suggestions: MealSuggestion[] = [];

    for (const query of baseQueries) {
      const foodResults = await this.searchFoods(query);
      
      if (foodResults.length > 0) {
        const food = foodResults[0].food;
        suggestions.push({
          name: this.formatMealName(food.label, mealTime),
          description: this.generateMealDescription(food.label, dietaryPreference, ingredients),
          nutrients: {
            calories: Math.round(food.nutrients.ENERC_KCAL),
            protein: Math.round(food.nutrients.PROCNT),
            carbs: Math.round(food.nutrients.CHOCDF),
            fat: Math.round(food.nutrients.FAT)
          },
          mealTime: mealTime as "breakfast" | "lunch" | "dinner" | "snack"
        });
      }

      if (suggestions.length >= 2) break; // Reduced from 3 to 2 to minimize API calls
    }

    // If no results from API, use fallback
    if (suggestions.length === 0) {
      return this.getFallbackMeals(dietaryPreference, mealTime);
    }

    return suggestions;
  }

  private getFallbackMeals(dietaryPreference: string, mealTime: string): MealSuggestion[] {
    const fallbackData = {
      breakfast: [
        {
          name: 'Oatmeal Bowl',
          description: `Healthy ${dietaryPreference} oatmeal with fruits`,
          nutrients: { calories: 350, protein: 12, carbs: 60, fat: 6 },
          mealTime: 'breakfast' as const
        }
      ],
      lunch: [
        {
          name: 'Power Salad',
          description: `Fresh ${dietaryPreference} salad with mixed greens`,
          nutrients: { calories: 380, protein: 15, carbs: 35, fat: 10 },
          mealTime: 'lunch' as const
        }
      ],
      dinner: [
        {
          name: 'Balanced Dinner',
          description: `Nutritious ${dietaryPreference} dinner with vegetables`,
          nutrients: { calories: 420, protein: 25, carbs: 40, fat: 12 },
          mealTime: 'dinner' as const
        }
      ],
      snack: [
        {
          name: 'Healthy Snack',
          description: `Light ${dietaryPreference} snack`,
          nutrients: { calories: 150, protein: 8, carbs: 20, fat: 5 },
          mealTime: 'snack' as const
        }
      ]
    };

    return fallbackData[mealTime as keyof typeof fallbackData] || [];
  }

  private getBaseQueries(dietaryPreference: string, mealTime: string, ingredients?: string): string[] {
    const baseQueries: string[] = [];
    
    // Use ingredients first if available
    if (ingredients) {
      const ingredientList = ingredients.split(',').slice(0, 1); // Reduced to 1 ingredient to minimize API calls
      ingredientList.forEach(ingredient => {
        baseQueries.push(`${ingredient.trim()} ${this.getMealTimeModifier(mealTime)}`);
      });
    }

    // Add just one fallback query to minimize API calls
    const fallbackQueries = this.getFallbackQueries(dietaryPreference, mealTime);
    if (baseQueries.length === 0) {
      baseQueries.push(fallbackQueries[0]);
    }

    return baseQueries;
  }

  private getMealTimeModifier(mealTime: string): string {
    switch (mealTime) {
      case 'breakfast': return 'breakfast';
      case 'lunch': return 'lunch';
      case 'dinner': return 'dinner';
      case 'snack': return 'snack';
      default: return '';
    }
  }

  private getFallbackQueries(dietaryPreference: string, mealTime: string): string[] {
    const queries: string[] = [];
    
    switch (mealTime) {
      case 'breakfast':
        queries.push('oatmeal');
        break;
      case 'lunch':
        queries.push('salad');
        break;
      case 'dinner':
        queries.push('chicken');
        break;
      case 'snack':
        queries.push('apple');
        break;
    }

    return queries;
  }

  private formatMealName(foodName: string, mealTime: string): string {
    return `${foodName} ${mealTime.charAt(0).toUpperCase() + mealTime.slice(1)}`;
  }

  private generateMealDescription(foodName: string, dietaryPreference: string, ingredients?: string): string {
    const baseDescription = `A delicious ${dietaryPreference} ${foodName}`;
    
    if (ingredients) {
      const mainIngredient = ingredients.split(',')[0].trim();
      return `${baseDescription} featuring fresh ${mainIngredient}.`;
    }
    
    return `${baseDescription}. Perfectly balanced for your nutritional needs.`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const edamamService = new EdamamService();