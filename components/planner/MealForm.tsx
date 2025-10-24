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
  onGenerate: (values: UserInput & { name: string; age: number }) => void;
  loading: boolean;
}

export default function MealForm({ onGenerate, loading }: MealFormProps) {
  const { register, handleSubmit, setValue } = useForm<
    UserInput & { name: string; age: number }
  >({
    defaultValues: {
      name: "",
      age: 18,
      goal: "",
      ingredients: "",
      mealsPerDay: 3,
    },
  });

  const onSubmit = (data: UserInput & { name: string; age: number }) =>
    onGenerate(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-beige-50 dark:bg-neutral-900 rounded-2xl shadow-xl p-8 space-y-6 flex flex-col"
    >
      {/* Name */}
      <div className="flex flex-col space-y-1">
        <label className="text-green-800 font-semibold">Name</label>
        <Input
          placeholder="Your name"
          {...register("name", { required: true })}
          className="border-green-300 focus:border-green-500 focus:ring-green-200"
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
          className="border-green-300 focus:border-green-500 focus:ring-green-200"
        />
      </div>

      {/* Goal */}
      <div className="flex flex-col space-y-1">
        <label className="text-green-800 font-semibold">Your Goal</label>
        <Select onValueChange={(val) => setValue("goal", val)}>
          <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-200">
            <SelectValue placeholder="Select your goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weight_loss">Weight Loss</SelectItem>
            <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
            <SelectItem value="balanced">Balanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ingredients */}
      <div className="flex flex-col space-y-1">
        <label className="text-green-800 font-semibold">Favorite Ingredients</label>
        <Textarea
          placeholder="e.g. chicken, rice, vegetables..."
          {...register("ingredients", { required: true })}
          className="border-green-300 focus:border-green-500 focus:ring-green-200"
        />
      </div>

      {/* Meals per day */}
      <div className="flex flex-col space-y-1">
        <label className="text-green-800 font-semibold">Meals Per Day</label>
        <Input
          type="number"
          min={1}
          max={5}
          {...register("mealsPerDay", { required: true, valueAsNumber: true })}
          className="border-green-300 focus:border-green-500 focus:ring-green-200"
        />
      </div>

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
