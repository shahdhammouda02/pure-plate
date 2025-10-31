// components/planner/History.tsx
"use client";

import { useState, useEffect } from "react";
import { MealPlan, UserInput } from "@/types/meal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Download, 
  Trash2, 
  Eye, 
  Utensils,
  Filter,
  Search,
  ChevronDown,
  ArrowLeft,
  RefreshCw
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SavedPlan extends MealPlan {
  id: string;
  createdAt: string;
  userInput: UserInput;
  name: string;
}

const formatGoalName = (goal: string) => {
  return goal.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function HistoryPage() {
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGoal, setFilterGoal] = useState<string>("all");
  const [selectedPlan, setSelectedPlan] = useState<SavedPlan | null>(null);

  // Load saved plans from localStorage on component mount
  useEffect(() => {
    loadSavedPlans();
  }, []);

  const loadSavedPlans = () => {
    const saved = localStorage.getItem('mealPlanHistory');
    if (saved) {
      try {
        const parsedPlans = JSON.parse(saved);
        setSavedPlans(parsedPlans);
        console.log('Loaded plans from history:', parsedPlans.length);
      } catch (error) {
        console.error('Error loading history:', error);
        setSavedPlans([]);
      }
    } else {
      console.log('No history found in localStorage');
      setSavedPlans([]);
    }
  };

  // Reload plans when the page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadSavedPlans();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const filteredPlans = savedPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.userInput.goal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGoal = filterGoal === "all" || plan.userInput.goal === filterGoal;
    return matchesSearch && matchesGoal;
  });

  const handleDownload = (plan: SavedPlan) => {
    const planText = `
PurePlate Meal Plan - ${plan.name}
Generated on: ${plan.createdAt}
Goals: ${formatGoalName(plan.userInput.goal)}
Dietary Preference: ${plan.userInput.dietaryPreference}
Activity Level: ${plan.userInput.activityLevel}

Total Daily Nutrition:
- Calories: ${plan.totalNutrients.calories} kcal
- Protein: ${plan.totalNutrients.protein}g
- Carbohydrates: ${plan.totalNutrients.carbs}g
- Fat: ${plan.totalNutrients.fat}g

Meals:
${plan.meals.map(meal => `
${meal.name} (${meal.mealTime}):
${typeof meal.description === 'string' ? meal.description : String(meal.description)}
- Calories: ${meal.nutrients.calories} kcal
- Protein: ${meal.nutrients.protein}g
- Carbs: ${meal.nutrients.carbs}g
- Fat: ${meal.nutrients.fat}g
`).join('\n')}

Expert Tip: ${plan.tip}
    `;

    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meal-plan-${plan.createdAt}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    const updatedPlans = savedPlans.filter(plan => plan.id !== id);
    setSavedPlans(updatedPlans);
    localStorage.setItem('mealPlanHistory', JSON.stringify(updatedPlans));
    if (selectedPlan?.id === id) {
      setSelectedPlan(null);
    }
  };

  const getGoalBadgeVariant = (goal: string) => {
    switch (goal) {
      case 'weight_loss': return 'destructive';
      case 'muscle_gain': return 'default';
      case 'maintain': return 'secondary';
      default: return 'outline';
    }
  };

  if (selectedPlan) {
    return (
      <div className="w-full max-w-4xl mx-auto p-3 sm:p-4">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Button
            onClick={() => setSelectedPlan(null)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Back to History</span>
          </Button>
          <h2 className="text-lg sm:text-xl font-bold text-green-800 text-center flex-1 mx-2">
            {selectedPlan.name}
          </h2>
          <div className="w-12 sm:w-20"></div>
        </div>

        <Card className="border border-gray-200">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  Plan Details
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Created on {new Date(selectedPlan.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant={getGoalBadgeVariant(selectedPlan.userInput.goal)} className="text-xs">
                  {formatGoalName(selectedPlan.userInput.goal)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {selectedPlan.userInput.dietaryPreference}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* User Input Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-700">Age</div>
                <div className="text-gray-600">{selectedPlan.userInput.age}</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-700">Weight</div>
                <div className="text-gray-600">{selectedPlan.userInput.weight}kg</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-700">Height</div>
                <div className="text-gray-600">{selectedPlan.userInput.height}cm</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-700">Meals/Day</div>
                <div className="text-gray-600">{selectedPlan.userInput.mealsPerDay}</div>
              </div>
            </div>

            {/* Nutrition Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                <div className="text-lg sm:text-xl font-bold text-green-700">
                  {selectedPlan.totalNutrients.calories}
                </div>
                <div className="text-xs sm:text-sm text-green-600">Calories</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                <div className="text-lg sm:text-xl font-bold text-blue-700">
                  {selectedPlan.totalNutrients.protein}g
                </div>
                <div className="text-xs sm:text-sm text-blue-600">Protein</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
                <div className="text-lg sm:text-xl font-bold text-yellow-700">
                  {selectedPlan.totalNutrients.carbs}g
                </div>
                <div className="text-xs sm:text-sm text-yellow-600">Carbs</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg">
                <div className="text-lg sm:text-xl font-bold text-red-700">
                  {selectedPlan.totalNutrients.fat}g
                </div>
                <div className="text-xs sm:text-sm text-red-600">Fat</div>
              </div>
            </div>

            {/* Meals */}
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Utensils className="w-3 h-3 sm:w-4 sm:h-4" />
                Meals ({selectedPlan.meals.length})
              </h4>
              <div className="space-y-3 sm:space-y-4">
                {selectedPlan.meals.map((meal, index) => (
                  <div key={index} className="p-3 sm:p-4 border rounded-lg">
                    <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-2 mb-2">
                      <h5 className="font-semibold capitalize text-sm sm:text-base">{meal.name}</h5>
                      <Badge variant="outline" className="capitalize text-xs">
                        {meal.mealTime}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                      {typeof meal.description === 'string' ? meal.description : String(meal.description)}
                    </p>
                    <div className="grid grid-cols-4 gap-1 sm:gap-2 text-xs">
                      <div className="text-center p-1 sm:p-2 bg-gray-50 rounded">
                        {meal.nutrients.calories} cal
                      </div>
                      <div className="text-center p-1 sm:p-2 bg-gray-50 rounded">
                        {meal.nutrients.protein}g protein
                      </div>
                      <div className="text-center p-1 sm:p-2 bg-gray-50 rounded">
                        {meal.nutrients.carbs}g carbs
                      </div>
                      <div className="text-center p-1 sm:p-2 bg-gray-50 rounded">
                        {meal.nutrients.fat}g fat
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div className="bg-linear-to-r from-green-50 to-yellow-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <h4 className="font-semibold text-green-800 mb-1 sm:mb-2 text-sm sm:text-base">Expert Tip</h4>
              <p className="text-green-700 text-xs sm:text-sm">{selectedPlan.tip}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
          Plan History
        </h2>
        <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm">
          Review your previously generated meal plans
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
          <Input
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 sm:pl-10 text-xs sm:text-sm"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">
                {filterGoal === "all" ? "All Goals" : formatGoalName(filterGoal)}
              </span>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterGoal("all")} className="text-xs sm:text-sm">
              All Goals
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterGoal("weight_loss")} className="text-xs sm:text-sm">
              Weight Loss
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterGoal("muscle_gain")} className="text-xs sm:text-sm">
              Muscle Gain
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterGoal("maintain")} className="text-xs sm:text-sm">
              Maintain Weight
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end mb-3 sm:mb-4">
        <Button
          onClick={loadSavedPlans}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
        >
          <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Refresh</span>
        </Button>
      </div>

      {/* History List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredPlans.length === 0 ? (
          <Card className="border border-gray-200">
            <CardContent className="text-center py-8 sm:py-12">
              <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-1 sm:mb-2">No plans found</h3>
              <p className="text-gray-500 text-xs sm:text-sm">
                {searchTerm || filterGoal !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "You haven't generated any meal plans yet. Generate a plan to see it here!"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow border border-gray-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-green-800 truncate">
                        {plan.name}
                      </h3>
                      <div className="flex gap-1 sm:gap-2 flex-wrap">
                        <Badge variant={getGoalBadgeVariant(plan.userInput.goal)} className="text-xs">
                          {formatGoalName(plan.userInput.goal)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {plan.userInput.dietaryPreference}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 text-xs text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Utensils className="w-3 h-3" />
                        {plan.meals.length} meals
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {plan.totalNutrients.calories} total calories
                      </div>
                    </div>

                    <p className="text-gray-700 text-xs sm:text-sm line-clamp-2">
                      {plan.meals.map(meal => meal.name).join(" • ")}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPlan(plan)}
                      className="flex items-center gap-1 text-xs h-8"
                    >
                      <Eye className="w-3 h-3" />
                      <span className="hidden xs:inline">View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(plan)}
                      className="flex items-center gap-1 text-xs h-8"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(plan.id)}
                      className="flex items-center gap-1 text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}