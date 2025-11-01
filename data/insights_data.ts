import { 
  InsightStat, 
  SuccessStory, 
  NutritionTip, 
  ResearchReport,
  UserProgress 
} from '@/types/insights';

export const insightStats: InsightStat[] = [
  { number: "85%", label: "Users achieved their nutrition goals" },
  { number: "2.5kg", label: "Average weight loss in first month" },
  { number: "94%", label: "User satisfaction rate" },
  { number: "30+", label: "Supported diet types" }
];

export const successStories: SuccessStory[] = [
  {
    name: "Sarah Ahmed",
    achievement: "Lost 15kg in 3 months",
    story: "Personalized plans helped me achieve my dream weight and maintain healthy habits."
  },
  {
    name: "Mohammed Al Khalid",
    achievement: "Improved blood sugar levels",
    story: "Better control over my diabetes through customized meal planning and nutrition tracking."
  },
  {
    name: "Emily Johnson",
    achievement: "Gained 5kg muscle mass",
    story: "The fitness-focused meal plans perfectly complemented my workout routine for optimal results."
  }
];

export const nutritionTips: NutritionTip[] = [
  {
    id: "tip-1",
    tip: "Drink a glass of water before each meal to reduce appetite",
    category: "Hydration"
  },
  {
    id: "tip-2",
    category: "Protein",
    tip: "Get 30g of protein at breakfast for sustained energy"
  },
  {
    id: "tip-3",
    category: "Timing",
    tip: "Avoid eating after 8 PM for better digestion and sleep"
  },
  {
    id: "tip-4",
    category: "Variety",
    tip: "Eat colorful foods to ensure diverse nutrient intake"
  },
  {
    id: "tip-5",
    category: "Planning",
    tip: "Meal prep on weekends saves time and reduces unhealthy choices"
  },
  {
    id: "tip-6",
    category: "Portion",
    tip: "Use smaller plates to naturally control portion sizes"
  }
];

export const researchReports: ResearchReport[] = [
  {
    title: "Study: Meal Planning Reduces Calorie Intake by 20%",
    summary: "Research shows that planned meals lead to more conscious eating choices and reduced overall calorie consumption.",
    source: "Journal of Nutrition & Dietetics"
  },
  {
    title: "Report: Plant-Based Diets Lower Chronic Disease Risk",
    summary: "Evidence indicates significant health benefits from plant-forward eating patterns across multiple health markers.",
    source: "American Heart Association"
  },
  {
    title: "Research: Food Color Diversity Enhances Overall Health",
    summary: "Different colored fruits and vegetables provide unique phytonutrients that support various bodily functions.",
    source: "International Food Research"
  }
];

export const userProgressData: UserProgress[] = [
  { period: "Week 1", improvement: "5%", metric: "Energy Levels" },
  { period: "Month 1", improvement: "12%", metric: "Sleep Quality" },
  { period: "Month 3", improvement: "25%", metric: "Overall Wellbeing" },
  { period: "Month 6", improvement: "40%", metric: "Health Metrics" }
];