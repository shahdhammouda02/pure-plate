"use client";

import { MealPlan, UserInput, Meal } from "@/types/meal";
import { Button } from "@/components/ui/button";
import { Download, Share2, Heart, Printer, ArrowLeft, Clock, Utensils } from "lucide-react";
import { useState } from "react";

interface ResultsPageProps {
  mealPlan: MealPlan;
  onBackToGenerate: () => void;
  userInput?: UserInput;
}

export default function ResultsPage({ mealPlan, onBackToGenerate, userInput }: ResultsPageProps) {
  const [saved, setSaved] = useState(false);
  const [favoriteStatus, setFavoriteStatus] = useState<{[key: string]: boolean}>({});

  // Save plan to history (manual save)
  const handleSaveToHistory = () => {
    if (!userInput) return;
    
    const savedPlan = {
      ...mealPlan,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userInput: userInput,
      name: `${formatGoalName(userInput.goal)} Plan - ${new Date().toLocaleDateString()}`
    };

    const existingHistory = JSON.parse(localStorage.getItem('mealPlanHistory') || '[]');
    const updatedHistory = [savedPlan, ...existingHistory];
    localStorage.setItem('mealPlanHistory', JSON.stringify(updatedHistory));
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    console.log('Manually saved plan to history');
  };

  // Save individual meal to favorites
  const handleSaveToFavorites = (meal: Meal) => {
    const favoriteMeal = {
      ...meal,
      id: `fav-${Date.now()}-${meal.name}`,
      addedDate: new Date().toISOString().split('T')[0],
      lastUsed: new Date().toISOString().split('T')[0],
      usageCount: 1
    };

    const existingFavorites = JSON.parse(localStorage.getItem('favoriteMeals') || '[]');
    
    // Check if meal already exists in favorites
    const alreadyExists = existingFavorites.some((fav: any) => fav.name === meal.name);
    
    if (!alreadyExists) {
      const updatedFavorites = [favoriteMeal, ...existingFavorites];
      localStorage.setItem('favoriteMeals', JSON.stringify(updatedFavorites));
      
      setFavoriteStatus(prev => ({
        ...prev,
        [meal.name]: true
      }));

      setTimeout(() => {
        setFavoriteStatus(prev => ({
          ...prev,
          [meal.name]: false
        }));
      }, 2000);
      console.log('Saved meal to favorites:', meal.name);
    } else {
      setFavoriteStatus(prev => ({
        ...prev,
        [meal.name]: true
      }));
      setTimeout(() => {
        setFavoriteStatus(prev => ({
          ...prev,
          [meal.name]: false
        }));
      }, 2000);
      console.log('Meal already in favorites:', meal.name);
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
${mealPlan.meals.map(meal => `
${meal.name}:
${meal.description}
- Calories: ${meal.nutrients.calories} kcal
- Protein: ${meal.nutrients.protein}g
- Carbs: ${meal.nutrients.carbs}g
- Fat: ${meal.nutrients.fat}g
`).join('\n')}

Expert Tip: ${mealPlan.tip}

Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meal-plan-${new Date().toISOString().split('T')[0]}.txt`;
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
      title: 'My PurePlate Meal Plan',
      text: `Check out my personalized meal plan from PurePlate! ${mealPlan.meals.length} delicious meals planned.`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      const planText = `My PurePlate Meal Plan:\n\n${mealPlan.meals.map(meal => `${meal.name}: ${meal.description}`).join('\n')}\n\nTip: ${mealPlan.tip}`;
      navigator.clipboard.writeText(planText);
      alert('Meal plan copied to clipboard!');
    }
  };

  const getMealTimeIcon = (mealTime: string) => {
    switch (mealTime) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '☀️';
      case 'dinner':
        return '🌙';
      case 'snack':
        return '🍎';
      default:
        return '🍽️';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBackToGenerate}
            variant="outline"
            className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-green-800">
            Your Personalized Meal Plan 🍽️
          </h2>
          <div className="w-20"></div>
        </div>
        <p className="text-gray-600 text-sm md:text-base">
          Here's your customized plan tailored to your preferences and goals.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8 justify-center">
        <Button
          onClick={handleDownload}
          variant="outline"
          className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
        <Button
          onClick={handlePrint}
          variant="outline"
          className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50"
        >
          <Printer className="w-4 h-4" />
          Print
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button
          onClick={handleSaveToHistory}
          variant="outline"
          className={`flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50 ${
            saved ? 'bg-green-50 text-green-600' : ''
          }`}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-green-600' : ''}`} />
          {saved ? 'Saved!' : 'Save Plan'}
        </Button>
      </div>

      {/* Nutrition Summary */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 border border-gray-200">
        <h3 className="text-lg md:text-xl font-semibold mb-4 text-green-800 flex items-center gap-2">
          <Utensils className="w-5 h-5" />
          Daily Nutrition Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="text-center p-3 md:p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="text-2xl md:text-3xl font-bold text-green-700">
              {mealPlan.totalNutrients.calories}
            </div>
            <div className="text-sm md:text-base text-green-600">Calories</div>
            <div className="text-xs text-green-500 mt-1">kcal</div>
          </div>
          <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-2xl md:text-3xl font-bold text-blue-700">
              {mealPlan.totalNutrients.protein}g
            </div>
            <div className="text-sm md:text-base text-blue-600">Protein</div>
            <div className="text-xs text-blue-500 mt-1">muscle building</div>
          </div>
          <div className="text-center p-3 md:p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="text-2xl md:text-3xl font-bold text-yellow-700">
              {mealPlan.totalNutrients.carbs}g
            </div>
            <div className="text-sm md:text-base text-yellow-600">Carbs</div>
            <div className="text-xs text-yellow-500 mt-1">energy</div>
          </div>
          <div className="text-center p-3 md:p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="text-2xl md:text-3xl font-bold text-red-700">
              {mealPlan.totalNutrients.fat}g
            </div>
            <div className="text-sm md:text-base text-red-600">Fat</div>
            <div className="text-xs text-red-500 mt-1">essential</div>
          </div>
        </div>
      </div>

      {/* Meals Section */}
      <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-semibold text-green-800 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Your Daily Meals
          </h3>
          <p className="text-sm text-gray-600">{mealPlan.meals.length} meals</p>
        </div>
        <div className="grid gap-4 md:gap-6">
          {mealPlan.meals.map((meal, index) => (
            <div
              key={index}
              className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">
                      {getMealTimeIcon(meal.mealTime)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg md:text-xl font-semibold text-green-800 capitalize">
                          {meal.name}
                        </h4>
                        <Button
                          onClick={() => handleSaveToFavorites(meal)}
                          variant="outline"
                          size="sm"
                          className={`flex items-center gap-1 ${
                            favoriteStatus[meal.name] 
                              ? 'bg-green-50 text-green-600 border-green-200' 
                              : 'border-green-300 text-green-700'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${favoriteStatus[meal.name] ? 'fill-green-600' : ''}`} />
                          {favoriteStatus[meal.name] ? 'Saved!' : 'Save to Favorites'}
                        </Button>
                      </div>
                      <span className="text-sm text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full">
                        {meal.mealTime}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm md:text-base mb-4 leading-relaxed">
                    {typeof meal.description === 'string' ? meal.description : String(meal.description)}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="font-semibold text-green-700 text-sm md:text-base">
                        {meal.nutrients.calories}
                      </div>
                      <div className="text-xs md:text-sm text-green-600">Calories</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="font-semibold text-blue-700 text-sm md:text-base">
                        {meal.nutrients.protein}g
                      </div>
                      <div className="text-xs md:text-sm text-blue-600">Protein</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                      <div className="font-semibold text-yellow-700 text-sm md:text-base">
                        {meal.nutrients.carbs}g
                      </div>
                      <div className="text-xs md:text-sm text-yellow-600">Carbs</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                      <div className="font-semibold text-red-700 text-sm md:text-base">
                        {meal.nutrients.fat}g
                      </div>
                      <div className="text-xs md:text-sm text-red-600">Fat</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tip Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg md:rounded-xl p-4 md:p-6 mb-6 md:mb-8">
        <div className="flex items-start gap-3">
          <div className="bg-yellow-100 p-2 rounded-full">
            <span className="text-xl">💡</span>
          </div>
          <div>
            <h4 className="text-lg md:text-xl font-semibold text-yellow-800 mb-2 md:mb-3">
              Expert Nutrition Tip
            </h4>
            <p className="text-yellow-700 text-sm md:text-base leading-relaxed">
              {mealPlan.tip}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <Button
          onClick={onBackToGenerate}
          className="bg-green-600 hover:bg-green-700 text-white px-6 md:px-8 py-2 md:py-3 text-sm md:text-base"
        >
          Create New Plan
        </Button>
        <Button
          onClick={handleDownload}
          variant="outline"
          className="border-green-300 text-green-700 hover:bg-green-50 px-6 md:px-8 py-2 md:py-3 text-sm md:text-base"
        >
          Download PDF Version
        </Button>
      </div>
    </div>
  );
}

// Helper function
const formatGoalName = (goal: string) => {
  return goal.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};