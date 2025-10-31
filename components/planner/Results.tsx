"use client";

import { MealPlan, UserInput, Meal } from "@/types/meal";
import { Button } from "@/components/ui/button";
import {
  Download,
  Share2,
  Heart,
  Printer,
  ArrowLeft,
  Clock,
  Utensils,
  Sun,
  Moon,
  Apple,
  UtensilsCrossed,
  Lightbulb,
} from "lucide-react";
import { useState } from "react";

interface ResultsPageProps {
  mealPlan: MealPlan;
  onBackToGenerate: () => void;
  userInput?: UserInput;
}

export default function ResultsPage({
  mealPlan,
  onBackToGenerate,
  userInput,
}: ResultsPageProps) {
  const [saved, setSaved] = useState(false);
  const [favoriteStatus, setFavoriteStatus] = useState<{
    [key: string]: boolean;
  }>({});

  // Save plan to history (manual save)
  const handleSaveToHistory = () => {
    if (!userInput) return;

    const savedPlan = {
      ...mealPlan,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userInput: userInput,
      name: `${formatGoalName(
        userInput.goal
      )} Plan - ${new Date().toLocaleDateString()}`,
    };

    const existingHistory = JSON.parse(
      localStorage.getItem("mealPlanHistory") || "[]"
    );
    const updatedHistory = [savedPlan, ...existingHistory];
    localStorage.setItem("mealPlanHistory", JSON.stringify(updatedHistory));

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    console.log("Manually saved plan to history");
  };

  // Save individual meal to favorites
  const handleSaveToFavorites = (meal: Meal) => {
    const favoriteMeal = {
      ...meal,
      id: `fav-${Date.now()}-${meal.name}`,
      addedDate: new Date().toISOString().split("T")[0],
      lastUsed: new Date().toISOString().split("T")[0],
      usageCount: 1,
    };

    const existingFavorites = JSON.parse(
      localStorage.getItem("favoriteMeals") || "[]"
    );

    // Check if meal already exists in favorites
    const alreadyExists = existingFavorites.some(
      (fav: any) => fav.name === meal.name
    );

    if (!alreadyExists) {
      const updatedFavorites = [favoriteMeal, ...existingFavorites];
      localStorage.setItem("favoriteMeals", JSON.stringify(updatedFavorites));

      setFavoriteStatus((prev) => ({
        ...prev,
        [meal.name]: true,
      }));

      setTimeout(() => {
        setFavoriteStatus((prev) => ({
          ...prev,
          [meal.name]: false,
        }));
      }, 2000);
      console.log("Saved meal to favorites:", meal.name);
    } else {
      setFavoriteStatus((prev) => ({
        ...prev,
        [meal.name]: true,
      }));
      setTimeout(() => {
        setFavoriteStatus((prev) => ({
          ...prev,
          [meal.name]: false,
        }));
      }, 2000);
      console.log("Meal already in favorites:", meal.name);
    }
  };

  const handleDownload = () => {
    const planText = `
PurePlate Meal Plan
===================

Total Daily Nutrition:
- Calories: ${mealPlan.totalNutrients.calories} kcal
- Protein: ${mealPlan.totalNutrients.protein}g
- Carbohydrates: ${mealPlan.totalNutrients.carbs}g
- Fat: ${mealPlan.totalNutrients.fat}g

Meals:
${mealPlan.meals
  .map(
    (meal) => `
${meal.name}:
${meal.description}
- Calories: ${meal.nutrients.calories} kcal
- Protein: ${meal.nutrients.protein}g
- Carbs: ${meal.nutrients.carbs}g
- Fat: ${meal.nutrients.fat}g
`
  )
  .join("\n")}

Expert Tip: ${mealPlan.tip}

Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([planText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meal-plan-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: "My PurePlate Meal Plan",
      text: `Check out my personalized meal plan from PurePlate! ${mealPlan.meals.length} delicious meals planned.`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      const planText = `My PurePlate Meal Plan:\n\n${mealPlan.meals
        .map((meal) => `${meal.name}: ${meal.description}`)
        .join("\n")}\n\nTip: ${mealPlan.tip}`;
      navigator.clipboard.writeText(planText);
      alert("Meal plan copied to clipboard!");
    }
  };

  const getMealTimeIcon = (mealTime: string) => {
    switch (mealTime) {
      case "breakfast":
        return <Sun className="w-6 h-6 text-orange-500" />;
      case "lunch":
        return <UtensilsCrossed className="w-6 h-6 text-yellow-500" />;
      case "dinner":
        return <Moon className="w-6 h-6 text-blue-500" />;
      case "snack":
        return <Apple className="w-6 h-6 text-red-500" />;
      default:
        return <Utensils className="w-6 h-6 text-green-500" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <Button
            onClick={onBackToGenerate}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 sm:gap-2 border-green-300 text-green-700 hover:bg-green-50 text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <h2 className="text-lg sm:text-xl font-bold text-green-800">
            Your Meal Plan
          </h2>
          <div className="w-12 sm:w-20"></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6 justify-center">
        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 sm:gap-2 border-green-300 text-green-700 hover:bg-green-50 text-xs sm:text-sm"
        >
          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Download</span>
        </Button>
        <Button
          onClick={handlePrint}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 sm:gap-2 border-green-300 text-green-700 hover:bg-green-50 text-xs sm:text-sm"
        >
          <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Print</span>
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 sm:gap-2 border-green-300 text-green-700 hover:bg-green-50 text-xs sm:text-sm"
        >
          <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Share</span>
        </Button>
        <Button
          onClick={handleSaveToHistory}
          variant="outline"
          size="sm"
          className={`flex items-center gap-1 sm:gap-2 border-green-300 text-green-700 hover:bg-green-50 text-xs sm:text-sm ${
            saved ? "bg-green-50 text-green-600" : ""
          }`}
        >
          <Heart
            className={`w-3 h-3 sm:w-4 sm:h-4 ${saved ? "fill-green-600" : ""}`}
          />
          <span className="hidden xs:inline">{saved ? "Saved!" : "Save"}</span>
        </Button>
      </div>

      {/* Nutrition Summary */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-green-800 flex items-center gap-2">
          <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
          Daily Nutrition
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="text-lg sm:text-xl font-bold text-green-700">
              {mealPlan.totalNutrients.calories}
            </div>
            <div className="text-xs sm:text-sm text-green-600">Calories</div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-lg sm:text-xl font-bold text-blue-700">
              {mealPlan.totalNutrients.protein}g
            </div>
            <div className="text-xs sm:text-sm text-blue-600">Protein</div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="text-lg sm:text-xl font-bold text-yellow-700">
              {mealPlan.totalNutrients.carbs}g
            </div>
            <div className="text-xs sm:text-sm text-yellow-600">Carbs</div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-red-50 rounded-lg border border-red-100">
            <div className="text-lg sm:text-xl font-bold text-red-700">
              {mealPlan.totalNutrients.fat}g
            </div>
            <div className="text-xs sm:text-sm text-red-600">Fat</div>
          </div>
        </div>
      </div>

      {/* Meals Section */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-green-800 flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            Daily Meals
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            {mealPlan.meals.length} meals
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {mealPlan.meals.map((meal, index) => (
            <div
              key={index}
              className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 border border-gray-200"
            >
              <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="mt-0.5">{getMealTimeIcon(meal.mealTime)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mb-1">
                    <h4 className="text-base sm:text-lg font-semibold text-green-800 capitalize truncate">
                      {meal.name}
                    </h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full capitalize shrink-0">
                      {meal.mealTime}
                    </span>
                  </div>

                  <p className="text-gray-700 text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed line-clamp-2">
                    {typeof meal.description === "string"
                      ? meal.description
                      : String(meal.description)}
                  </p>

                  <div className="grid grid-cols-4 gap-1 sm:gap-2">
                    <div className="text-center p-1 sm:p-2 bg-green-50 rounded border border-green-100">
                      <div className="font-semibold text-green-700 text-xs sm:text-sm">
                        {meal.nutrients.calories}
                      </div>
                      <div className="text-xs text-green-600">Cal</div>
                    </div>
                    <div className="text-center p-1 sm:p-2 bg-blue-50 rounded border border-blue-100">
                      <div className="font-semibold text-blue-700 text-xs sm:text-sm">
                        {meal.nutrients.protein}g
                      </div>
                      <div className="text-xs text-blue-600">Protein</div>
                    </div>
                    <div className="text-center p-1 sm:p-2 bg-yellow-50 rounded border border-yellow-100">
                      <div className="font-semibold text-yellow-700 text-xs sm:text-sm">
                        {meal.nutrients.carbs}g
                      </div>
                      <div className="text-xs text-yellow-600">Carbs</div>
                    </div>
                    <div className="text-center p-1 sm:p-2 bg-red-50 rounded border border-red-100">
                      <div className="font-semibold text-red-700 text-xs sm:text-sm">
                        {meal.nutrients.fat}g
                      </div>
                      <div className="text-xs text-red-600">Fat</div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleSaveToFavorites(meal)}
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-1 shrink-0 ${
                    favoriteStatus[meal.name]
                      ? "bg-green-50 text-green-600 border-green-200"
                      : "border-green-300 text-green-700"
                  }`}
                >
                  <Heart
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${
                      favoriteStatus[meal.name] ? "fill-green-600" : ""
                    }`}
                  />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tip Section */}
      <div className="bg-linear-gradient-to-r from-green-50 to-yellow-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-base sm:text-lg font-semibold text-green-800 mb-1 sm:mb-2">
              Expert Tip
            </h4>
            <p className="text-green-700 text-xs sm:text-sm leading-relaxed">
              {mealPlan.tip}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
        <Button
          onClick={onBackToGenerate}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 text-xs sm:text-sm"
        >
          Create New Plan
        </Button>
        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="border-green-300 text-green-700 hover:bg-green-50 px-4 sm:px-6 py-2 text-xs sm:text-sm"
        >
          Download PDF
        </Button>
      </div>
    </div>
  );
}

// Helper function
const formatGoalName = (goal: string) => {
  return goal
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
