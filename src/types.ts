export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  targetExam: string;
  targetYear: number;
  plan: 'free' | 'pro';
  createdAt: string;
  avatarUrl?: string;
  streakDays: number;
  lastActiveDate: string;
  isBlocked?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameUrdu: string;
  code: string; // e.g. "USAT-E", "MDCAT"
  description: string;
  descriptionUrdu: string;
  badgeColor: string;
  isPopular?: boolean;
}

export interface Subject {
  id: string;
  categoryId: string;
  name: string;
  nameUrdu: string;
  icon: string;
  color: string;
  questionCount?: number;
}

export interface Chapter {
  id: string;
  subjectId: string;
  categoryId: string;
  name: string;
  nameUrdu: string;
  order: number;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: string;
  categoryId: string;
  subjectId: string;
  chapterId: string;
  questionText: string;
  questionTextUrdu?: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  optionsUrdu?: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  explanationUrdu?: string;
  difficulty: Difficulty;
  formula?: string; // math formula if applicable
  tags: string[];
  imageUrl?: string;
  reported?: boolean;
}

export interface MockTest {
  id: string;
  title: string;
  titleUrdu: string;
  categoryId: string;
  type: 'full_length' | 'subject_wise' | 'chapter_wise' | 'daily_quiz';
  description: string;
  durationMinutes: number;
  totalMarks: number;
  marksPerCorrect: number;
  negativeMarking: number; // e.g. 0 or 0.25
  isPremium: boolean;
  questionIds: string[];
  subjectDistribution: {
    subjectId: string;
    count: number;
  }[];
  attemptsCount: number;
  avgScorePercentage: number;
  createdAt: string;
}

export interface QuestionAnswer {
  questionId: string;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
  flagged?: boolean;
}

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  categoryCode: string;
  userId: string;
  userName: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  score: number;
  maxScore: number;
  percentage: number;
  negativeMarkingApplied: number;
  answers: QuestionAnswer[];
  subjectBreakdown: {
    subjectId: string;
    subjectName: string;
    correct: number;
    wrong: number;
    skipped: number;
    total: number;
    score: number;
  }[];
  weakChapters: string[];
}

export interface EssayTopic {
  id: string;
  categoryId: string;
  title: string;
  titleUrdu: string;
  language: 'English' | 'Urdu' | 'Both';
  recommendedWords: string;
  timeLimitMinutes: number;
  instructions: string;
  instructionsUrdu: string;
  hints: string[];
}

export interface EssayEvaluation {
  id: string;
  topicId: string;
  topicTitle: string;
  userId: string;
  userName: string;
  language: 'English' | 'Urdu';
  essayText: string;
  wordCount: number;
  submittedAt: string;
  timeSpentMinutes: number;
  overallScore: number; // out of 10
  scaledScore: number; // out of 25 (USAT standard)
  rubric: {
    contentIdeas: { score: number; feedback: string };
    structureOrg: { score: number; feedback: string };
    grammarVocab: { score: number; feedback: string };
    coherence: { score: number; feedback: string };
    conclusion: { score: number; feedback: string };
  };
  strengths: string[];
  mistakes: { context: string; issue: string; fix: string }[];
  improvementTips: string[];
}

export interface QuestionReport {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  reason: 'wrong_answer' | 'typo' | 'bad_explanation' | 'other';
  comment: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatarUrl?: string;
  targetExam: string;
  testsCompleted: number;
  avgPercentage: number;
  totalScore: number;
  streakDays: number;
}
