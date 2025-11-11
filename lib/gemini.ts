export async function generateMealPlanWithAI(userInput: any): Promise<string> {
  const { age, weight, height, dietaryPreference, goal, mealsPerDay, ingredients } = userInput;
  
  const prompt = `
    Create a personalized nutrition tip for someone with these details:
    - Age: ${age}
    - Weight: ${weight}kg
    - Height: ${height}cm  
    - Dietary Preference: ${dietaryPreference}
    - Goal: ${goal}
    - Meals per day: ${mealsPerDay}
    - Available ingredients: ${ingredients || 'none specified'}
    
    Give one specific, actionable nutrition tip that's under 100 characters.
    Make it personalized to their goals and dietary needs.
    Return only the tip text, no explanations.
  `;

  try {
    // ✅ Use gemini-2.5-flash (from your available models)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const tip = data.candidates[0].content.parts[0].text.trim();
      console.log('AI Generated Tip:', tip);
      return tip;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('AI service unavailable, using smart fallback');
    return generateSmartFallbackTip(userInput);
  }
}

function generateSmartFallbackTip(userInput: any): string {
  const { dietaryPreference, goal, mealsPerDay } = userInput;
  
  const tips = {
    weight_loss: {
      vegan: `Focus on high-fiber veggies at your ${mealsPerDay} meals to stay full.`,
      vegetarian: `Include protein like Greek yogurt to stay satisfied between meals.`,
      pescatarian: `Choose grilled fish for lean protein and metabolism support.`
    },
    muscle_gain: {
      vegan: `Combine legumes with grains for complete protein at every meal.`,
      vegetarian: `Have protein within 2 hours after workouts for muscle recovery.`,
      pescatarian: `Eat fish post-workout - the protein helps build muscle tissue.`
    },
    maintain: {
      vegan: `Balance each meal with plants, proteins, and healthy fats.`,
      vegetarian: `Rotate between different protein sources for diverse nutrients.`,
      pescatarian: `Include fatty fish weekly for omega-3s and overall health.`
    }
  };

  // @ts-ignore
  return tips[goal]?.[dietaryPreference] 
    || `Stay consistent with your ${mealsPerDay} daily meals and stay hydrated!`;
}