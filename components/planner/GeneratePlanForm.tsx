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

export default function GeneratePlanForm() {
  const { data: session } = useSession();
  const user = session?.user?.name || "Guest";

  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      age: 18,
      activityLevel: "",
      goal: "",
      dietaryPreference: "",
      ingredients: "",
      weight: "",
      height: "",
      mealsPerDay: "",
      planDuration: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      console.log("Form data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Your personalized plan has been generated!");
      reset();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while generating your plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-4 md:mb-6 lg:mb-8">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2 md:mb-3 lg:mb-4 text-green-800">
          Generate Your Personalized Plan,{" "}
          <span className="capitalize">{user}</span> 🌿
        </h2>
        <p className="text-gray-600 text-xs md:text-sm lg:text-base px-2 md:px-0">
          Fill in your details below and we'll create a plan tailored to your
          lifestyle and goals.
        </p>
      </div>

      {/* Form with scroll */}
      <div className="max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-250px)] overflow-y-auto pr-1 md:pr-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-green-50 rounded-lg md:rounded-xl lg:rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 lg:space-y-8 border border-gray-200"
        >
          {/* Row 1 - Age, Weight, Height */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            <div className="flex flex-col space-y-1 md:space-y-2">
              <label className="text-green-800 font-semibold text-xs md:text-sm lg:text-base">
                Age
              </label>
              <Input
                type="number"
                min={10}
                max={100}
                {...register("age", { required: true })}
                placeholder="e.g. 25"
                className="border-green-300 focus:border-green-500 focus:ring-green-200 w-full text-sm md:text-base"
              />
            </div>

            <div className="flex flex-col space-y-1 md:space-y-2">
              <label className="text-green-800 font-semibold text-xs md:text-sm lg:text-base">
                Weight (kg)
              </label>
              <Input
                type="number"
                {...register("weight")}
                placeholder="e.g. 70"
                className="border-green-300 focus:border-green-500 focus:ring-green-200 w-full text-sm md:text-base"
              />
            </div>

            <div className="flex flex-col space-y-1 md:space-y-2">
              <label className="text-green-800 font-semibold text-xs md:text-sm lg:text-base">
                Height (cm)
              </label>
              <Input
                type="number"
                {...register("height")}
                placeholder="e.g. 170"
                className="border-green-300 focus:border-green-500 focus:ring-green-200 w-full text-sm md:text-base"
              />
            </div>
          </div>

          {/* Row 2 - Activity Level, Goal, Dietary Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            <div className="flex flex-col space-y-1 md:space-y-2">
              <label className="text-green-800 font-semibold text-xs md:text-sm lg:text-base">
                Activity Level
              </label>
              <Select onValueChange={(val) => setValue("activityLevel", val)}>
                <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-200 w-full text-sm md:text-base">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Sedentary)</SelectItem>
                  <SelectItem value="moderate">
                    Moderate (Light Exercise)
                  </SelectItem>
                  <SelectItem value="high">High (Active Lifestyle)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1 md:space-y-2">
              <label className="text-green-800 font-semibold text-xs md:text-sm lg:text-base">
                Goal
              </label>
              <Select onValueChange={(val) => setValue("goal", val)}>
                <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-200 w-full text-sm md:text-base">
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight_loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1 md:space-y-2">
              <label className="text-green-800 font-semibold text-xs md:text-sm lg:text-base">
                Dietary Preference
              </label>
              <Select
                onValueChange={(val) => setValue("dietaryPreference", val)}
              >
                <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-200 w-full text-sm md:text-base">
                  <SelectValue placeholder="Select dietary preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="pescatarian">Pescatarian</SelectItem>
                  <SelectItem value="none">No Restrictions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3 - Meals per Day, Plan Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            <div className="flex flex-col space-y-1 md:space-y-2">
              <label className="text-green-800 font-semibold text-xs md:text-sm lg:text-base">
                Meals per Day
              </label>
              <Input
                type="number"
                {...register("mealsPerDay")}
                placeholder="e.g. 3"
                className="border-green-300 focus:border-green-500 focus:ring-green-200 w-full text-sm md:text-base"
              />
            </div>

            <div className="flex flex-col space-y-1 md:space-y-2">
              <label className="text-green-800 font-semibold text-xs md:text-sm lg:text-base">
                Plan Duration
              </label>
              <Select onValueChange={(val) => setValue("planDuration", val)}>
                <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-200 w-full text-sm md:text-base">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1_week">1 Week</SelectItem>
                  <SelectItem value="2_weeks">2 Weeks</SelectItem>
                  <SelectItem value="1_month">1 Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden sm:block">
              {/* Empty space for alignment */}
            </div>
          </div>

          {/* Ingredients (Full Width) */}
          <div className="flex flex-col space-y-1 md:space-y-2">
            <label className="text-green-800 font-semibold text-xs md:text-sm lg:text-base">
              Ingredients You Have
            </label>
            <Textarea
              placeholder="e.g. chicken, rice, vegetables..."
              {...register("ingredients")}
              className="border-green-300 focus:border-green-500 focus:ring-green-200 min-h-20 md:min-h-24 lg:min-h-[100px] text-sm md:text-base"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 md:pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg md:rounded-xl py-2 md:py-3 text-sm md:text-base lg:text-lg font-medium"
            >
              {loading ? "Generating..." : "Generate My Plan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}