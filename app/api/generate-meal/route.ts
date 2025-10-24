import meals from "@/data/meals.json";
import tips from "@/data/tips.json";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { goal, ingredients, mealsPerDay } = body;

  const selectedMeals = meals.slice(0, mealsPerDay);
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return NextResponse.json({
    meals: selectedMeals,
    tip: randomTip,
  });
}