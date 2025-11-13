export async function generateMealPlanWithAI(userInput: any): Promise<string> {
  const {
    age,
    weight,
    height,
    dietaryPreference,
    goal,
    mealsPerDay,
    ingredients,
  } = userInput;

  const prompt = `
    Create a personalized nutrition tip for someone with these details:
    - Age: ${age}
    - Weight: ${weight}kg
    - Height: ${height}cm  
    - Dietary Preference: ${dietaryPreference}
    - Goal: ${goal}
    - Meals per day: ${mealsPerDay}
    - Available ingredients: ${ingredients || "none specified"}
    
    Give one specific, actionable nutrition tip that's under 100 characters.
    Make it personalized to their goals and dietary needs.
    Return only the tip text, no explanations.
  `;

  try {
    // ✅ Use gemini-2.5-flash (from your available models)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const tip = data.candidates[0].content.parts[0].text.trim();
      console.log("AI Generated Tip:", tip);
      return tip;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("AI service unavailable, using smart fallback");
    return generateSmartFallbackTip(userInput);
  }
}

export async function generateRandomNutritionTip(
  context: string = "general",
  userPreferences: any = {}
): Promise<string> {
  const prompts = {
    general:
      "Give me a random, interesting nutrition tip that's practical and under 80 characters. Make it something people might not know. Return only the tip text.",
    breakfast:
      "Give me a unique breakfast nutrition tip that's actionable and under 80 characters. Return only the tip text.",
    lunch:
      "Give me a creative lunch nutrition tip that's practical and under 80 characters. Return only the tip text.",
    dinner:
      "Give me an insightful dinner nutrition tip that's helpful and under 80 characters. Return only the tip text.",
    snacks:
      "Give me a smart snacking tip that's healthy and under 80 characters. Return only the tip text.",
    hydration:
      "Give me an interesting hydration tip that's useful and under 80 characters. Return only the tip text.",
    fitness:
      "Give me a nutrition tip for active people that's under 80 characters. Return only the tip text.",
    weightloss:
      "Give me a weight management nutrition tip that's under 80 characters. Return only the tip text.",
  };

  const prompt = prompts[context as keyof typeof prompts] || prompts.general;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const tip = data.candidates[0].content.parts[0].text.trim();
      console.log("AI Generated Random Tip:", tip);
      return tip;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("AI service unavailable, using smart fallback");
    return generateRandomFallbackTip(context);
  }
}

function generateSmartFallbackTip(userInput: any): string {
  const { dietaryPreference, goal, mealsPerDay } = userInput;

  const tips = {
    weight_loss: {
      vegan: `Focus on high-fiber veggies at your ${mealsPerDay} meals to stay full.`,
      vegetarian: `Include protein like Greek yogurt to stay satisfied between meals.`,
      pescatarian: `Choose grilled fish for lean protein and metabolism support.`,
    },
    muscle_gain: {
      vegan: `Combine legumes with grains for complete protein at every meal.`,
      vegetarian: `Have protein within 2 hours after workouts for muscle recovery.`,
      pescatarian: `Eat fish post-workout - the protein helps build muscle tissue.`,
    },
    maintain: {
      vegan: `Balance each meal with plants, proteins, and healthy fats.`,
      vegetarian: `Rotate between different protein sources for diverse nutrients.`,
      pescatarian: `Include fatty fish weekly for omega-3s and overall health.`,
    },
  };

  const goalTips = tips[goal as keyof typeof tips] || tips.maintain;
  const finalTip =
    goalTips[dietaryPreference as keyof typeof goalTips] ||
    "Eat a balanced diet with a variety of nutrients.";
  return finalTip;
}

function generateRandomFallbackTip(context: string): string {
  const fallbackTips = {
    general: [
      "Drink water before meals to help control appetite naturally.",
      "Add colorful vegetables to every meal for diverse nutrients.",
      "Chew your food slowly to improve digestion and satisfaction.",
      "Include protein in each meal to maintain steady energy levels.",
      "Plan your meals weekly to make healthy choices easier.",
    ],
    breakfast: [
      "Include protein in breakfast to prevent mid-morning cravings.",
      "Add berries to your breakfast for antioxidants and fiber.",
      "Choose whole grains for sustained morning energy.",
      "Don't skip breakfast - it kickstarts your metabolism.",
      "Add nuts or seeds for healthy fats and crunch.",
    ],
    lunch: [
      "Build lunch around vegetables first, then add protein.",
      "Include a source of healthy fats like avocado or olive oil.",
      "Choose lean proteins to stay full without feeling heavy.",
      "Add fermented foods like yogurt for gut health.",
      "Pack your lunch to control ingredients and save money.",
    ],
    dinner: [
      "Eat dinner at least 2-3 hours before bedtime for better sleep.",
      "Make half your dinner plate non-starchy vegetables.",
      "Choose lighter proteins in the evening for better digestion.",
      "Include fiber-rich foods to keep you full through the night.",
      "Experiment with herbs and spices instead of salt.",
    ],
    snacks: [
      "Pair carbs with protein for satisfying, balanced snacks.",
      "Keep healthy snacks visible and accessible.",
      "Choose whole fruit over juice for more fiber.",
      "Pre-portion snacks to avoid mindless eating.",
      "Include nuts or seeds for sustained energy between meals.",
    ],
    hydration: [
      "Start your day with a glass of water to rehydrate.",
      "Keep a water bottle nearby as a visual reminder to drink.",
      "Add lemon or cucumber slices to water for natural flavor.",
      "Drink water before you feel thirsty - thirst means you're already dehydrated.",
      "Eat water-rich foods like watermelon and cucumber.",
    ],
    fitness: [
      "Fuel workouts with easily digestible carbs 1-2 hours before.",
      "Replenish with protein and carbs within 30 minutes after exercise.",
      "Stay hydrated before, during, and after your workouts.",
      "Listen to your body - eat more on active days, less on rest days.",
      "Include electrolytes during intense or long workouts.",
    ],
    weightloss: [
      "Focus on nutrient density rather than just calorie counting.",
      "Eat slowly and mindfully to recognize fullness cues.",
      "Include fiber at every meal to promote satiety.",
      "Don't eliminate food groups - practice moderation instead.",
      "Get enough sleep - tiredness increases hunger hormones.",
    ],
  };

  const tips =
    fallbackTips[context as keyof typeof fallbackTips] || fallbackTips.general;
  return tips[Math.floor(Math.random() * tips.length)];
}
