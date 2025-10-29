// components/planner/Favorites.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  RefreshCw
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
      case 'breakfast': return 'bg-orange-100 text-orange-800';
      case 'lunch': return 'bg-yellow-100 text-yellow-800';
      case 'dinner': return 'bg-blue-100 text-blue-800';
      case 'snack': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMealTimeIcon = (mealTime: string) => {
    switch (mealTime) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-800 flex items-center justify-center gap-2">
          <Heart className="w-8 h-8" />
          Favorite Meals
        </h2>
        <p className="text-gray-600 mt-2">
          Your most-loved meals and recipes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-800">{favorites.length}</div>
            <div className="text-sm text-gray-600">Total Favorites</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-800">
              {favorites.filter(fav => fav.mealTime === 'breakfast').length}
            </div>
            <div className="text-sm text-gray-600">Breakfast</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-800">
              {favorites.filter(fav => fav.mealTime === 'lunch').length}
            </div>
            <div className="text-sm text-gray-600">Lunch</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-800">
              {favorites.filter(fav => fav.mealTime === 'dinner').length}
            </div>
            <div className="text-sm text-gray-600">Dinner</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search favorite meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              {filterMealTime === "all" ? "All Meals" : filterMealTime}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterMealTime("all")}>
              All Meals
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterMealTime("breakfast")}>
              Breakfast
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterMealTime("lunch")}>
              Lunch
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterMealTime("dinner")}>
              Dinner
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterMealTime("snack")}>
              Snack
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          onClick={loadFavorites}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Favorites List */}
      <div className="space-y-4">
        {filteredFavorites.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchTerm || filterMealTime !== "all" ? "No matches found" : "No favorites yet"}
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterMealTime !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Save meals from your generated plans to see them here!"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredFavorites.map((meal) => (
            <Card key={meal.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Meal Icon and Basic Info */}
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">
                      {getMealTimeIcon(meal.mealTime)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-green-800">
                          {meal.name}
                        </h3>
                        <Badge className={getMealTimeColor(meal.mealTime)}>
                          {meal.mealTime}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-4 max-w-2xl">
                        {typeof meal.description === 'string' ? meal.description : String(meal.description)}
                      </p>

                      {/* Nutrition Info */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                          <div className="font-semibold text-green-700">
                            {meal.nutrients.calories}
                          </div>
                          <div className="text-xs text-green-600">Calories</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                          <div className="font-semibold text-blue-700">
                            {meal.nutrients.protein}g
                          </div>
                          <div className="text-xs text-blue-600">Protein</div>
                        </div>
                        <div className="text-center p-2 bg-yellow-50 rounded-lg">
                          <div className="font-semibold text-yellow-700">
                            {meal.nutrients.carbs}g
                          </div>
                          <div className="text-xs text-yellow-600">Carbs</div>
                        </div>
                        <div className="text-center p-2 bg-red-50 rounded-lg">
                          <div className="font-semibold text-red-700">
                            {meal.nutrients.fat}g
                          </div>
                          <div className="text-xs text-red-600">Fat</div>
                        </div>
                      </div>

                      {/* Usage Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Added: {formatDate(meal.addedDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Used: {meal.usageCount} times
                        </div>
                        {meal.lastUsed && (
                          <div className="flex items-center gap-1">
                            <Utensils className="w-4 h-4" />
                            Last: {formatDate(meal.lastUsed)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2 md:ml-auto">
                    <Button
                      onClick={() => handleAddToCurrentPlan(meal)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add to Plan
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveFavorite(meal.id)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
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