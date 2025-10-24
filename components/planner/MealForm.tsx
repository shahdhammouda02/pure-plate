"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { UserInput } from "@/types/meal";

interface MealFormProps {
  onGenerate: (values: UserInput) => void;
  loading: boolean;
}

export default function MealForm({ onGenerate, loading }: MealFormProps) {
  const { register, handleSubmit, setValue } = useForm<UserInput>({
    defaultValues: {
      name: "",
      age: 18,
      gender: "",
      activityLevel: "",
      goal: "",
      dietaryPreference: "",
      ingredients: "",
    },
  });

  const onSubmit = (data: UserInput) => onGenerate(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center space-y-8 p-6 
                 rounded-xl shadow-xl backdrop-blur-md border border-gray-200 bg-white/0"
    >
      {/* Grid for 2-per-row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Name */}
        <div className="flex flex-col space-y-1">
          <label className="text-green-800 font-semibold">Name</label>
          <Input
            placeholder="Your name"
            {...register("name", { required: true })}
            className="border-green-300 focus:border-green-500 focus:ring-green-200 bg-white/20"
          />
        </div>

        {/* Age */}
        <div className="flex flex-col space-y-1">
          <label className="text-green-800 font-semibold">Age</label>
          <Input
            type="number"
            min={1}
            max={120}
            {...register("age", { required: true, valueAsNumber: true })}
            className="border-green-300 focus:border-green-500 focus:ring-green-200 bg-white/20"
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col space-y-1">
          <label className="text-green-800 font-semibold">Gender</label>
          <Select onValueChange={(val) => setValue("gender", val)}>
            <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-200 bg-white/20">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activity Level */}
        <div className="flex flex-col space-y-1">
          <label className="text-green-800 font-semibold">Activity Level</label>
          <Select onValueChange={(val) => setValue("activityLevel", val)}>
            <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-200 bg-white/20">
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Goal */}
        <div className="flex flex-col space-y-1">
          <label className="text-green-800 font-semibold">Goal</label>
          <Select onValueChange={(val) => setValue("goal", val)}>
            <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-200 bg-white/20">
              <SelectValue placeholder="Select your goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight_loss">Weight Loss</SelectItem>
              <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dietary Preference */}
        <div className="flex flex-col space-y-1">
          <label className="text-green-800 font-semibold">Dietary Preference</label>
          <Select onValueChange={(val) => setValue("dietaryPreference", val)}>
            <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-200 bg-white/20">
              <SelectValue placeholder="Select dietary preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="pescatarian">Pescatarian</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ingredients (full-width last one) */}
      <div className="flex flex-col space-y-1 w-full">
        <label className="text-green-800 font-semibold">Ingredients You Have</label>
        <Textarea
          placeholder="e.g. chicken, rice, vegetables..."
          {...register("ingredients", { required: true })}
          className="border-green-300 focus:border-green-500 focus:ring-green-200 bg-white/20"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg py-3 rounded-xl shadow-md transition-all"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Plan"}
      </Button>
    </form>
  );
}
