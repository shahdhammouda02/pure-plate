export interface InsightStat {
  number: string;
  label: string;
}

export interface SuccessStory {
  name: string;
  achievement: string;
  story: string;
}

export interface NutritionTip {
  id: string;
  tip: string;
  category: string;
}

export interface ResearchReport {
  title: string;
  summary: string;
  source: string;
}

export interface UserProgress {
  period: string;
  improvement: string;
  metric: string;
}