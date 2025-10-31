"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Search,
  Filter,
  Clock,
  Utensils,
  Trash2,
  Plus,
  Calendar,
  RefreshCw,
  Sun,
  Moon,
  Apple,
  UtensilsCrossed
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Meal } from "@/types/meal";

interface FavoriteMeal extends Meal {
  id: string;
  addedDate: string;
  lastUsed: string;
  usageCount: number;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteMeal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMealTime, setFilterMealTime] = useState<string>("all");

  // Load favorites from localStorage
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const saved = localStorage.getItem('favoriteMeals');
    if (saved) {
      try {
        const parsedFavorites = JSON.parse(saved);
        setFavorites(parsedFavorites);
        console.log('Loaded favorites:', parsedFavorites.length);
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
      }
    } else {
      console.log('No favorites found in localStorage');
      setFavorites([]);
    }
  };

  // Reload favorites when the page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadFavorites();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const filteredFavorites = favorites.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (typeof meal.description === 'string' && 
                          meal.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMealTime = filterMealTime === "all" || meal.mealTime === filterMealTime;
    
    return matchesSearch && matchesMealTime;
  });

  const handleRemoveFavorite = (id: string) => {
    const updatedFavorites = favorites.filter(meal => meal.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteMeals', JSON.stringify(updatedFavorites));
  };

  const handleAddToCurrentPlan = (meal: FavoriteMeal) => {
    // Update the usage count
    const updatedFavorites = favorites.map(fav =>
      fav.id === meal.id
        ? { ...fav, usageCount: fav.usageCount + 1, lastUsed: new Date().toISOString().split('T')[0] }
        : fav
    );
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteMeals', JSON.stringify(updatedFavorites));
    
    alert(`Added ${meal.name} to your current plan!`);
  };

  const getMealTimeColor = (mealTime: string) => {
    switch (mealTime) {
      case 'breakfast': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'lunch': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'dinner': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'snack': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMealTimeIcon = (mealTime: string) => {
    switch (mealTime) {
      case 'breakfast': return <Sun className="w-5 h-5 text-orange-500" />;
      case 'lunch': return <UtensilsCrossed className="w-5 h-5 text-yellow-500" />;
      case 'dinner': return <Moon className="w-5 h-5 text-blue-500" />;
      case 'snack': return <Apple className="w-5 h-5 text-green-500" />;
      default: return <Utensils className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 flex items-center justify-center gap-2">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
          Favorite Meals
        </h2>
        <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm">
          Your most-loved meals and recipes
        </p>
      </div>

      {/* Stats */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
  <Card className="border border-green-200 bg-green-50">
    <CardContent className="p-3 sm:p-4 text-center">
      <div className="text-lg sm:text-xl font-bold text-green-800">{favorites.length}</div>
      <div className="text-xs sm:text-sm text-green-700">Total</div>
    </CardContent>
  </Card>

  <Card className="border border-orange-200 bg-orange-50">
    <CardContent className="p-3 sm:p-4 text-center">
      <div className="text-lg sm:text-xl font-bold text-orange-800">
        {favorites.filter(fav => fav.mealTime === 'breakfast').length}
      </div>
      <div className="text-xs sm:text-sm text-orange-700">Breakfast</div>
    </CardContent>
  </Card>

  <Card className="border border-yellow-200 bg-yellow-50">
    <CardContent className="p-3 sm:p-4 text-center">
      <div className="text-lg sm:text-xl font-bold text-yellow-800">
        {favorites.filter(fav => fav.mealTime === 'lunch').length}
      </div>
      <div className="text-xs sm:text-sm text-yellow-700">Lunch</div>
    </CardContent>
  </Card>

  <Card className="border border-blue-200 bg-blue-50">
    <CardContent className="p-3 sm:p-4 text-center">
      <div className="text-lg sm:text-xl font-bold text-blue-800">
        {favorites.filter(fav => fav.mealTime === 'dinner').length}
      </div>
      <div className="text-xs sm:text-sm text-blue-700">Dinner</div>
    </CardContent>
  </Card>
</div>


      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search favorite meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4" />
              <span className="hidden xs:inline">
                {filterMealTime === "all" ? "All Meals" : filterMealTime}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterMealTime("all")} className="text-sm">
              All Meals
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterMealTime("breakfast")} className="text-sm">
              Breakfast
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterMealTime("lunch")} className="text-sm">
              Lunch
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterMealTime("dinner")} className="text-sm">
              Dinner
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterMealTime("snack")} className="text-sm">
              Snack
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          onClick={loadFavorites}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden xs:inline">Refresh</span>
        </Button>
      </div>

      {/* Favorites List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredFavorites.length === 0 ? (
          <Card className="border border-gray-200">
            <CardContent className="text-center py-8 sm:py-12">
              <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-1 sm:mb-2">
                {searchTerm || filterMealTime !== "all" ? "No matches found" : "No favorites yet"}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm">
                {searchTerm || filterMealTime !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Save meals from your generated plans to see them here!"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredFavorites.map((meal) => (
            <Card key={meal.id} className="hover:shadow-lg transition-shadow border border-gray-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                  {/* Meal Icon and Basic Info */}
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="mt-0.5">
                      {getMealTimeIcon(meal.mealTime)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-green-800 truncate">
                          {meal.name}
                        </h3>
                        <Badge className={`${getMealTimeColor(meal.mealTime)} text-xs capitalize border`}>
                          {meal.mealTime}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                        {typeof meal.description === 'string' ? meal.description : String(meal.description)}
                      </p>

                      {/* Nutrition Info */}
                      <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-3 sm:mb-4">
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

                      {/* Usage Stats */}
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Added: {formatDate(meal.addedDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Used: {meal.usageCount} times
                        </div>
                        {meal.lastUsed && (
                          <div className="flex items-center gap-1">
                            <Utensils className="w-3 h-3" />
                            Last: {formatDate(meal.lastUsed)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 self-end sm:self-auto">
                    <Button
                      onClick={() => handleAddToCurrentPlan(meal)}
                      size="sm"
                      className="flex items-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 text-xs h-8"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Add to Plan</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveFavorite(meal.id)}
                      size="sm"
                      className="flex items-center gap-1 sm:gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs h-8"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Remove</span>
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