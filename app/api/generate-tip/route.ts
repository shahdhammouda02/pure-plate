import { generateRandomNutritionTip } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
try {
const body = await req.json();
const { context, userPreferences } = body;
const aiTip = await generateRandomNutritionTip(context, userPreferences);

return NextResponse.json({ tip: aiTip });
} catch (error) {
console.error("Error generating AI tip:", error);
// Fallback tips if AI service is unavailable
const fallbackTips = [
  "Stay hydrated by drinking water throughout the day.",
  "Include colorful vegetables in every meal for diverse nutrients.",
  "Balance your plate with protein, carbs, and healthy fats.",
  "Listen to your body's hunger and fullness signals.",
  "Plan ahead to make healthy eating easier during busy days."
];

const randomFallback = fallbackTips[Math.floor(Math.random() * fallbackTips.length)];

return NextResponse.json({ tip: randomFallback });
}
}

export async function GET() {
try {
// Generate a general nutrition tip
const aiTip = await generateRandomNutritionTip("general", {});
return NextResponse.json({ tip: aiTip });
} catch (error) {
console.error("Error generating AI tip:", error);
const fallbackTips = [
  "Eating mindfully can help you enjoy food more and recognize fullness.",
  "Include protein in your breakfast to stay full and energized all morning.",
  "Variety in your diet ensures you get all essential nutrients.",
  "Cook at home more often to control ingredients and portions.",
  "Don't forget to include healthy fats like avocado and nuts in your diet."
];

const randomFallback = fallbackTips[Math.floor(Math.random() * fallbackTips.length)];

return NextResponse.json({ tip: randomFallback });
}
}