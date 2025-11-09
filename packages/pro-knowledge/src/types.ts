export interface ProPlayer {
  id: string;
  name: string;
  nickname?: string;
  country: string;
  totalWinnings: number;
  braceletCount: number;
  playStyle: string;
  specialty: string[];
  bio: string;
  photoUrl?: string;
}

export interface ProTip {
  title: string;
  content: string;
  category: string;
  situation: string;
  source?: string;
  difficulty: number;
}

export interface ProComparison {
  handId: string;
  playerAction: string;
  proAction: string;
  proName: string;
  reasoning: string;
  evDifference: number;
  isPlayerBetter: boolean;
}

export interface LearningPath {
  proId: string;
  proName: string;
  totalLessons: number;
  lessons: Lesson[];
  estimatedDuration: number; // heures
  difficulty: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  examples: any[];
  quiz?: Quiz;
  order: number;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
