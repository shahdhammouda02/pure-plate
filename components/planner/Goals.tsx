// components/planner/Goals.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Target,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  RefreshCw
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";

interface Goal {
  id: string;
  title: string;
  description: string;
  type: "weight_loss" | "muscle_gain" | "fitness" | "nutrition" | "other";
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  progress: number;
  createdAt: string;
  completed: boolean;
}

const formatGoalName = (goal: string) => {
  return goal.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function GoalsPage() {
  const { data: session } = useSession();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: "",
    description: "",
    type: "weight_loss",
    targetValue: 0,
    currentValue: 0,
    unit: "kg",
    deadline: "",
    progress: 0
  });

  // Load goals from localStorage
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const saved = localStorage.getItem('userGoals');
    if (saved) {
      try {
        const parsedGoals = JSON.parse(saved);
        setGoals(parsedGoals);
        console.log('Loaded goals:', parsedGoals.length);
      } catch (error) {
        console.error('Error loading goals:', error);
        setGoals([]);
      }
    } else {
      console.log('No goals found in localStorage');
      setGoals([]);
    }
  };

  // Reload goals when the page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadGoals();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Auto-create goals from user inputs if none exist
  useEffect(() => {
    if (goals.length === 0) {
      createGoalsFromHistory();
    }
  }, [goals.length]);

  const createGoalsFromHistory = () => {
    const savedPlans = JSON.parse(localStorage.getItem('mealPlanHistory') || '[]');
    
    if (savedPlans.length > 0) {
      const latestPlan = savedPlans[0];
      const userInput = latestPlan.userInput;
      
      const autoGoals: Goal[] = [
        {
          id: `auto-${Date.now()}-1`,
          title: `${formatGoalName(userInput.goal)} Goal`,
          description: `Achieve your ${userInput.goal.replace('_', ' ')} goal through personalized meal planning and exercise`,
          type: userInput.goal as any,
          targetValue: userInput.goal === 'weight_loss' ? userInput.weight - 5 : 
                      userInput.goal === 'muscle_gain' ? userInput.weight + 5 : userInput.weight,
          currentValue: userInput.weight,
          unit: "kg",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          progress: 0,
          createdAt: new Date().toISOString().split('T')[0],
          completed: false
        },
        {
          id: `auto-${Date.now()}-2`,
          title: `Follow ${userInput.mealsPerDay} Meals Daily`,
          description: `Maintain a consistent ${userInput.mealsPerDay}-meal daily eating schedule`,
          type: "nutrition",
          targetValue: 30,
          currentValue: 0,
          unit: "days",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          progress: 0,
          createdAt: new Date().toISOString().split('T')[0],
          completed: false
        }
      ];

      setGoals(autoGoals);
      localStorage.setItem('userGoals', JSON.stringify(autoGoals));
      console.log('Auto-created goals from history');
    }
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetValue) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title!,
      description: newGoal.description || "",
      type: newGoal.type as any,
      targetValue: newGoal.targetValue!,
      currentValue: newGoal.currentValue || 0,
      unit: newGoal.unit || "kg",
      deadline: newGoal.deadline!,
      progress: newGoal.currentValue && newGoal.targetValue ? 
        Math.min(100, Math.round((newGoal.currentValue / newGoal.targetValue) * 100)) : 0,
      createdAt: new Date().toISOString().split('T')[0],
      completed: false
    };

    const updatedGoals = [goal, ...goals];
    setGoals(updatedGoals);
    localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
    
    setNewGoal({
      title: "",
      description: "",
      type: "weight_loss",
      targetValue: 0,
      currentValue: 0,
      unit: "kg",
      deadline: "",
      progress: 0
    });
    setIsAdding(false);
  };

  const handleUpdateGoal = (id: string, updates: Partial<Goal>) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === id) {
        const updated = { ...goal, ...updates };
        // Recalculate progress if currentValue or targetValue changed
        if (updates.currentValue !== undefined || updates.targetValue !== undefined) {
          updated.progress = Math.min(100, Math.round((updated.currentValue / updated.targetValue) * 100));
        }
        return updated;
      }
      return goal;
    });
    setGoals(updatedGoals);
    localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
  };

  const handleDeleteGoal = (id: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
  };

  const handleCompleteGoal = (id: string) => {
    const updatedGoals = goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed, progress: 100 } : goal
    );
    setGoals(updatedGoals);
    localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
  };

  const getGoalTypeColor = (type: string) => {
    switch (type) {
      case "weight_loss": return "bg-blue-100 text-blue-800";
      case "muscle_gain": return "bg-green-100 text-green-800";
      case "fitness": return "bg-purple-100 text-purple-800";
      case "nutrition": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatGoalType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const completedGoals = goals.filter(goal => goal.completed);
  const activeGoals = goals.filter(goal => !goal.completed);

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const targetDate = new Date(deadline);
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-800 flex items-center justify-center gap-2">
          <Target className="w-8 h-8" />
          My Goals
        </h2>
        <p className="text-gray-600 mt-2">
          Set and track your fitness and nutrition goals, {session?.user?.name || "User"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Goals</p>
                <p className="text-2xl font-bold text-green-800">{goals.length}</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-blue-800">{completedGoals.length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-800">{activeGoals.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-green-800">My Goals</h3>
        <div className="flex gap-2">
          <Button
            onClick={loadGoals}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </Button>
        </div>
      </div>

      {/* Add Goal Form */}
      {isAdding && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Goal Title</label>
                <Input
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="e.g., Lose 5kg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Goal Type</label>
                <Select
                  value={newGoal.type}
                  onValueChange={(value) => setNewGoal({ ...newGoal, type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                placeholder="Describe your goal..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Current</label>
                <Input
                  type="number"
                  value={newGoal.currentValue}
                  onChange={(e) => setNewGoal({ ...newGoal, currentValue: Number(e.target.value) })}
                  placeholder="e.g., 80"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Target</label>
                <Input
                  type="number"
                  value={newGoal.targetValue}
                  onChange={(e) => setNewGoal({ ...newGoal, targetValue: Number(e.target.value) })}
                  placeholder="e.g., 75"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Unit</label>
                <Select
                  value={newGoal.unit}
                  onValueChange={(value) => setNewGoal({ ...newGoal, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="lb">lb</SelectItem>
                    <SelectItem value="cm">cm</SelectItem>
                    <SelectItem value="min">min</SelectItem>
                    <SelectItem value="days">days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Deadline</label>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddGoal} className="bg-green-600 hover:bg-green-700">
                Add Goal
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Goals */}
      <div className="space-y-4 mb-8">
        <h4 className="text-lg font-semibold text-green-800">Active Goals</h4>
        {activeGoals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No active goals. Add one to get started!</p>
            </CardContent>
          </Card>
        ) : (
          activeGoals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-semibold text-green-800">
                          {goal.title}
                        </h4>
                        <Badge className={getGoalTypeColor(goal.type)}>
                          {formatGoalType(goal.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCompleteGoal(goal.id)}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Complete
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setNewGoal(goal);
                            setIsAdding(true);
                            handleDeleteGoal(goal.id);
                          }}
                          className="flex items-center gap-1"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{goal.description}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                        {getDaysRemaining(goal.deadline) > 0 && (
                          <span className="text-orange-600 ml-1">
                            ({getDaysRemaining(goal.deadline)} days left)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        Progress: {goal.currentValue}{goal.unit} → {goal.targetValue}{goal.unit}
                      </div>
                    </div>

                    <Progress value={goal.progress} className="h-2" />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>{goal.progress}% complete</span>
                      <span>
                        {goal.progress < 100 ? `${Math.round(goal.targetValue - goal.currentValue)}${goal.unit} to go` : 'Goal achieved!'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-green-800">Completed Goals</h4>
          {completedGoals.map((goal) => (
            <Card key={goal.id} className="bg-gray-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <h5 className="font-semibold text-green-800 line-through">
                        {goal.title}
                      </h5>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Completed
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}