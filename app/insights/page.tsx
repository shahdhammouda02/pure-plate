// components/Insights.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Target,
  Calendar,
  Utensils,
  Heart,
  Clock,
  Award,
  Leaf,
  BarChart3,
  Lightbulb,
  Trophy,
  Star,
  RefreshCw,
  User
} from "lucide-react";
import tips from "@/data/tips.json";
import { InsightData } from "@/types/meal";

export default function InsightsPage() {
  const { data: session } = useSession();
  const [insightData, setInsightData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsightData();
  }, []);

  const loadInsightData = () => {
    setLoading(true);
    
    if (!session) {
      setLoading(false);
      return;
    }
    
    // Load data from localStorage
    const savedPlans = JSON.parse(localStorage.getItem('mealPlanHistory') || '[]');
    const savedGoals = JSON.parse(localStorage.getItem('userGoals') || '[]');
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteMeals') || '[]');
    
    // Calculate insights
    const totalPlans = savedPlans.length;
    const totalMeals = savedPlans.reduce((acc: number, plan: any) => acc + plan.meals.length, 0);
    const favoriteMeals = savedFavorites.length;
    const completedGoals = savedGoals.filter((goal: any) => goal.completed).length;
    const activeGoals = savedGoals.filter((goal: any) => !goal.completed).length;
    
    // Calculate average calories
    const totalCalories = savedPlans.reduce((acc: number, plan: any) => acc + plan.totalNutrients.calories, 0);
    const averageCalories = totalPlans > 0 ? Math.round(totalCalories / totalPlans) : 0;
    
    // Find most common goal
    const goalCounts: { [key: string]: number } = {};
    savedPlans.forEach((plan: any) => {
      const goal = plan.userInput.goal;
      goalCounts[goal] = (goalCounts[goal] || 0) + 1;
    });
    const mostCommonGoal = Object.keys(goalCounts).reduce((a, b) => 
      goalCounts[a] > goalCounts[b] ? a : b, 'weight_loss'
    );
    
    // Dietary preferences distribution
    const dietaryPreferences: { [key: string]: number } = {};
    savedPlans.forEach((plan: any) => {
      const preference = plan.userInput.dietaryPreference;
      dietaryPreferences[preference] = (dietaryPreferences[preference] || 0) + 1;
    });
    
    // Meal time distribution
    const mealTimeDistribution: { [key: string]: number } = {};
    savedPlans.forEach((plan: any) => {
      plan.meals.forEach((meal: any) => {
        mealTimeDistribution[meal.mealTime] = (mealTimeDistribution[meal.mealTime] || 0) + 1;
      });
    });
    
    // Weekly progress (mock data for demonstration)
    const weeklyProgress = Math.min(100, Math.round((savedPlans.length / 4) * 100));
    const streak = Math.min(7, savedPlans.length);

    const data: InsightData = {
      totalPlans,
      totalMeals,
      favoriteMeals,
      completedGoals,
      activeGoals,
      averageCalories,
      mostCommonGoal,
      dietaryPreferences,
      mealTimeDistribution,
      weeklyProgress,
      streak,
    };

    setInsightData(data);
    setLoading(false);
  };

  const formatGoalName = (goal: string) => {
    return goal.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getAchievementLevel = () => {
    if (!insightData) return "Beginner";
    const score = insightData.totalPlans + insightData.completedGoals * 2;
    if (score >= 10) return "Expert";
    if (score >= 5) return "Intermediate";
    return "Beginner";
  };

  const getMotivationalMessage = () => {
    if (!insightData) return "Start your journey to better health!";
    
    if (insightData.totalPlans === 0) {
      return "Ready to start your health journey? Generate your first meal plan!";
    } else if (insightData.totalPlans < 3) {
      return "Great start! Keep going to build healthy habits.";
    } else if (insightData.completedGoals > 0) {
      return "Amazing progress! You're achieving your goals.";
    } else {
      return "Consistency is key! You're building great habits.";
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your insights...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="w-full max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 flex items-center justify-center gap-3">
            <BarChart3 className="w-10 h-10" />
            Nutrition Insights
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Track your progress and discover personalized recommendations
          </p>
        </div>

        {/* Welcome Card for Non-Logged In Users */}
        <Card className="mb-8 bg-linear-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-green-100 p-4 rounded-full">
                <User className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-green-800 mb-2">
                  Welcome to Nutrition Insights!
                </h3>
                <p className="text-green-600 text-lg">
                  Sign in to unlock personalized insights and track your nutrition journey
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Levels Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Achievement Levels
            </CardTitle>
            <CardDescription>
              Track your progress through different achievement levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Badge className="bg-blue-600 mb-2">Beginner</Badge>
                <p className="text-blue-700 text-sm">
                  Start your journey with your first meal plan
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <Badge className="bg-green-600 mb-2">Intermediate</Badge>
                <p className="text-green-700 text-sm">
                  Build consistency with multiple plans and goals
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <Badge className="bg-purple-600 mb-2">Expert</Badge>
                <p className="text-purple-700 text-sm">
                  Master your nutrition with advanced tracking
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What You'll Unlock */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-6 h-6" />
              What You'll Unlock
            </CardTitle>
            <CardDescription>
              Personalized insights waiting for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-800">Progress Tracking</h4>
                  <p className="text-gray-600 text-sm">Monitor your meal plans and goal achievements</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-800">Goal Analytics</h4>
                  <p className="text-gray-600 text-sm">Track your fitness and nutrition goals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Utensils className="w-6 h-6 text-orange-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-orange-800">Meal Patterns</h4>
                  <p className="text-gray-600 text-sm">Discover your eating habits and preferences</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-red-800">Favorite Meals</h4>
                  <p className="text-gray-600 text-sm">Build your personalized recipe collection</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6" />
              Nutrition Tips
            </CardTitle>
            <CardDescription>
              Expert advice for your health journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.slice(0, 6).map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Star className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-yellow-800 text-sm leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sign In CTA */}
        <div className="text-center mt-8">
          <Button 
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold"
            onClick={() => window.location.href = '/auth/signin'}
          >
            Sign In to Get Started
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-800 flex items-center justify-center gap-3">
          <BarChart3 className="w-10 h-10" />
          Nutrition Insights
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Track your progress and discover personalized recommendations
        </p>
      </div>

      {/* Achievement Card */}
      <Card className="mb-8 bg-linear-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="bg-green-100 p-3 rounded-full">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-800">
                  {getAchievementLevel()} Level
                </h3>
                <p className="text-green-600">{getMotivationalMessage()}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-green-700">{insightData?.streak || 0}</div>
                <div className="text-sm text-green-600">Day Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{insightData?.completedGoals || 0}</div>
                <div className="text-sm text-blue-600">Goals Completed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Plans</p>
                <p className="text-2xl font-bold text-green-800">{insightData?.totalPlans || 0}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Meals Generated</p>
                <p className="text-2xl font-bold text-blue-800">{insightData?.totalMeals || 0}</p>
              </div>
              <Utensils className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Favorite Meals</p>
                <p className="text-2xl font-bold text-purple-800">{insightData?.favoriteMeals || 0}</p>
              </div>
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Calories</p>
                <p className="text-2xl font-bold text-orange-800">{insightData?.averageCalories || 0}</p>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Goals Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Goals Progress
            </CardTitle>
            <CardDescription>
              Track your goal achievement and progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active Goals</span>
              <Badge variant="outline">{insightData?.activeGoals || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Completed Goals</span>
              <Badge variant="default">{insightData?.completedGoals || 0}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Weekly Progress</span>
                <span>{insightData?.weeklyProgress || 0}%</span>
              </div>
              <Progress value={insightData?.weeklyProgress || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Dietary Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              Dietary Preferences
            </CardTitle>
            <CardDescription>
              Your most common dietary choices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(insightData?.dietaryPreferences || {}).map(([preference, count]) => (
                <div key={preference} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{preference}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
              {Object.keys(insightData?.dietaryPreferences || {}).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No dietary preference data yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Meal Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Meal Time Distribution
            </CardTitle>
            <CardDescription>
              When you typically eat your meals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(insightData?.mealTimeDistribution || {}).map(([mealTime, count]) => (
                <div key={mealTime} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{mealTime}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${(count / (insightData?.totalMeals || 1)) * 100}%` }}
                    ></div>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                </div>
              ))}
              {Object.keys(insightData?.mealTimeDistribution || {}).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No meal time data yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Most Common Goal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Primary Focus
            </CardTitle>
            <CardDescription>
              Your main health and wellness goal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="text-3xl font-bold text-green-800 mb-2">
                {formatGoalName(insightData?.mostCommonGoal || 'weight_loss')}
              </div>
              <p className="text-gray-600 text-sm">
                This is your most frequently selected goal across all plans
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nutrition Tips */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Nutrition Tips
          </CardTitle>
          <CardDescription>
            Expert advice for your health journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.slice(0, 6).map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <Star className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-yellow-800 text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Your Recommendations
          </CardTitle>
          <CardDescription>
            Suggestions to enhance your nutrition journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insightData?.totalPlans === 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Get Started</h4>
                <p className="text-blue-700 text-sm">
                  Generate your first meal plan to unlock personalized insights and recommendations!
                </p>
              </div>
            )}
            
            {insightData?.favoriteMeals === 0 && insightData && insightData.totalPlans > 0 && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Save Your Favorites</h4>
                <p className="text-purple-700 text-sm">
                  Start saving your favorite meals to build a personalized recipe collection.
                </p>
              </div>
            )}

            {insightData?.activeGoals === 0 && insightData && insightData.totalPlans > 0 && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Set Goals</h4>
                <p className="text-green-700 text-sm">
                  Create specific goals to track your progress and stay motivated.
                </p>
              </div>
            )}

            {insightData && insightData.totalPlans >= 3 && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">Consistency Champion</h4>
                <p className="text-orange-700 text-sm">
                  Great job maintaining consistency! Consider exploring new recipes to keep your meals exciting.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-center mt-8">
        <Button 
          onClick={loadInsightData}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Insights
        </Button>
      </div>
    </div>
  );
}