"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserInput, MealPlan } from "@/types/meal";
import { getMealsByTime } from "@/data/meals";

interface GeneratePlanFormProps {
  onPlanGenerated: (plan: MealPlan, userInput: UserInput) => void;
}

export default function GeneratePlanForm({ onPlanGenerated }: GeneratePlanFormProps) {
  const { data: session } = useSession();
  const user = session?.user?.name || "Guest";

  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<UserInput>();

  // Generate personalized meal plan based on user input
  const generateMealPlan = async (userInput: UserInput): Promise<MealPlan> => {
    const response = await fetch('/api/generate-meal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInput),
    });

    if (!response.ok) {
      throw new Error('Failed to generate meal plan');
    }

    return response.json();
  };

  const onSubmit = async (data: UserInput) => {
    setLoading(true);
    try {
      console.log("Form data:", data);
      const mealPlan = await generateMealPlan(data);
      onPlanGenerated(mealPlan, data); // Pass both plan and userInput
    } catch (error) {
      console.error("Error generating meal plan:", error);
      alert("Something went wrong while generating your plan.");
    } finally {
      setLoading(false);
    }
  };

  // Watch form values for real-time preview
  const watchedValues = watch();

  return (
    <div className="w-full max-w-4xl mx-auto pb-12">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 text-green-800">
          Generate Your Personalized Plan,{" "}
          <span className="capitalize">{user}</span> 🌿
        </h2>
        <p className="text-gray-600">
          Fill in your details below and we'll create a plan tailored to your lifestyle and goals.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-green-50 rounded-xl shadow-lg p-6 space-y-6 border border-gray-200"
      >
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800 border-b border-green-200 pb-2">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-green-800 font-semibold text-sm">
                Age *
              </label>
              <Input
                type="number"
                min={10}
                max={100}
                {...register("age", { 
                  required: "Age is required",
                  min: { value: 10, message: "Age must be at least 10" },
                  max: { value: 100, message: "Age must be less than 100" }
                })}
                placeholder="e.g. 25"
                className="border-green-300 focus:border-green-500 focus:ring-green-200"
              />
              {errors.age && (
                <span className="text-red-500 text-xs">{errors.age.message}</span>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-green-800 font-semibold text-sm">
                Weight (kg) *
              </label>
              <Input
                type="number"
                step="0.1"
                {...register("weight", { 
                  required: "Weight is required",
                  min: { value: 30, message: "Weight must be at least 30kg" },
                  max: { value: 300, message: "Weight must be less than 300kg" }
                })}
                placeholder="e.g. 70"
                className="border-green-300 focus:border-green-500 focus:ring-green-200"
              />
              {errors.weight && (
                <span className="text-red-500 text-xs">{errors.weight.message}</span>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-green-800 font-semibold text-sm">
                Height (cm) *
              </label>
              <Input
                type="number"
                {...register("height", { 
                  required: "Height is required",
                  min: { value: 100, message: "Height must be at least 100cm" },
                  max: { value: 250, message: "Height must be less than 250cm" }
                })}
                placeholder="e.g. 170"
                className="border-green-300 focus:border-green-500 focus:ring-green-200"
              />
              {errors.height && (
                <span className="text-red-500 text-xs">{errors.height.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800 border-b border-green-200 pb-2">
            Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-green-800 font-semibold text-sm">
                Activity Level *
              </label>
              <Select 
                onValueChange={(val: string) => setValue("activityLevel", val, { shouldValidate: true })}
              >
                <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-200">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Sedentary)</SelectItem>
                  <SelectItem value="moderate">Moderate (Light Exercise)</SelectItem>
                  <SelectItem value="high">High (Active Lifestyle)</SelectItem>
                </SelectContent>
              </Select>
              {errors.activityLevel && (
                <span className="text-red-500 text-xs">Activity level is required</span>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-green-800 font-semibold text-sm">
                Goal *
              </label>
              <Select 
                onValueChange={(val: string) => setValue("goal", val, { shouldValidate: true })}
              >
                <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-200">
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight_loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                </SelectContent>
              </Select>
              {errors.goal && (
                <span className="text-red-500 text-xs">Goal is required</span>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-green-800 font-semibold text-sm">
                Dietary Preference *
              </label>
              <Select 
                onValueChange={(val: string) => setValue("dietaryPreference", val, { shouldValidate: true })}
              >
                <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-200">
                  <SelectValue placeholder="Select dietary preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="pescatarian">Pescatarian</SelectItem>
                </SelectContent>
              </Select>
              {errors.dietaryPreference && (
                <span className="text-red-500 text-xs">Dietary preference is required</span>
              )}
            </div>
          </div>
        </div>

        {/* Plan Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800 border-b border-green-200 pb-2">
            Plan Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-green-800 font-semibold text-sm">
                Meals per Day *
              </label>
              <Input
                type="number"
                min={1}
                max={6}
                {...register("mealsPerDay", { 
                  required: "Meals per day is required",
                  min: { value: 1, message: "At least 1 meal per day" },
                  max: { value: 6, message: "Maximum 6 meals per day" },
                  valueAsNumber: true
                })}
                placeholder="e.g. 3"
                className="border-green-300 focus:border-green-500 focus:ring-green-200"
              />
              {errors.mealsPerDay && (
                <span className="text-red-500 text-xs">{errors.mealsPerDay.message}</span>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-green-800 font-semibold text-sm">
                Plan Duration *
              </label>
              <Select 
                onValueChange={(val: string) => setValue("planDuration", val, { shouldValidate: true })}
              >
                <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-200">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1_week">1 Week</SelectItem>
                  <SelectItem value="2_weeks">2 Weeks</SelectItem>
                  <SelectItem value="1_month">1 Month</SelectItem>
                </SelectContent>
              </Select>
              {errors.planDuration && (
                <span className="text-red-500 text-xs">Plan duration is required</span>
              )}
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800 border-b border-green-200 pb-2">
            Available Ingredients
          </h3>
          <div className="flex flex-col space-y-2">
            <Textarea
              placeholder="e.g. chicken, rice, vegetables, eggs, oats, quinoa..."
              {...register("ingredients")}
              className="border-green-300 focus:border-green-500 focus:ring-green-200 min-h-24"
            />
            <p className="text-gray-500 text-xs">
              List ingredients you have available (optional) - we'll incorporate them into your meals
            </p>
          </div>
        </div>

        {/* Meal Time Preview */}
        {watchedValues.mealsPerDay && (
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3">
              Your Daily Meal Structure
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {['breakfast', 'lunch', 'dinner', 'snack'].map((mealTime) => (
                <div key={mealTime} className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-700 capitalize">{mealTime}</div>
                  <div className="text-green-600">
                    {getMealsByTime(mealTime).length} options
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Your Personalized Plan...
              </div>
            ) : (
              "Generate My Plan"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}