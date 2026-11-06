import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Flame,
  Award,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Target,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api.js';
import { TestAttempt, Category, Subject } from '../types.js';
import { useAuth } from '../context/AuthContext.js';
import { useThemeLanguage } from '../context/ThemeLanguageContext.js';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onViewResult: (attemptId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onViewResult }) => {
  const { user } = useAuth();
  const { language } = useThemeLanguage();

  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Daily goal mock state
  const dailyGoalTarget = 50;
  const [dailyCompleted, setDailyCompleted] = useState(28);

  useEffect(() => {
    Promise.all([api.getAttempts(user?.id), api.getCategories()])
      .then(([attList, catList]) => {
        setAttempts(attList);
        setCategories(catList);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const totalAttempts = attempts.length;
  const avgAccuracy =
    totalAttempts > 0
      ? Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / totalAttempts)
      : 74;

  const totalQuestionsSolved = attempts.reduce((acc, a) => acc + a.totalQuestions, 0) + 120; // plus practice baseline

  // Aggregated weak chapters
  const allWeak = Array.from(new Set(attempts.flatMap((a) => a.weakChapters || [])));
  const weakTopics = allWeak.length > 0 ? allWeak : ['Vectors and Equilibrium', 'Quadratic Equations', 'Stoichiometry'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-linear-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
                Candidate Portal
              </span>
              <span className="text-xs text-blue-200">Exam: {user?.targetExam || 'USAT-E 2026'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              You are currently preparing for Universal Admission Test (USAT). Maintain your daily streak to rank in the top 1% percentile!
            </p>
          </div>

          {/* Quick Streak Widget */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 self-start md:self-center">
            <div className="p-3 rounded-xl bg-amber-400 text-slate-900 font-black shadow-md">
              <Flame className="w-6 h-6 fill-slate-900" />
            </div>
            <div>
              <p className="text-xs text-blue-200 font-semibold uppercase tracking-wider">Study Streak</p>
              <p className="text-2xl font-black">{user?.streakDays || 7} Days Strong</p>
              <p className="text-[10px] text-emerald-300 font-semibold">Active Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Mock Tests Taken</span>
            <FileCheck2 className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{totalAttempts}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">+2 this week</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average Accuracy</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {avgAccuracy}%
          </p>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">Cutoff pass is 50%</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">MCQs Practiced</span>
            <BookOpen className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalQuestionsSolved}
          </p>
          <span className="text-[11px] text-purple-600 font-semibold mt-1 inline-block">Across all subjects</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Daily Goal</span>
            <Target className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{dailyCompleted}</p>
            <span className="text-xs text-slate-400 font-bold">/{dailyGoalTarget} MCQs</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-2 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${(dailyCompleted / dailyGoalTarget) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recommended Practice & Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Weak Topic Alerts & Recommended Practice (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Targeted Revision Recommendations
                </h3>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                AI Diagnostic
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Based on your recent incorrect answers, these chapters require immediate reinforcement:
            </p>

            <div className="space-y-2.5">
              {weakTopics.map((topic, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center justify-center">
                      !
                    </span>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">{topic}</p>
                      <p className="text-[11px] text-slate-400">Accuracy rate ~48%</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('practice')}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>Practice Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Mastery Radar / Progress Bars */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Subject Mastery Index
            </h3>

            <div className="space-y-3">
              {[
                { subject: 'Physics (Mechanics, Waves, Modern)', pct: 78, color: 'bg-blue-600' },
                { subject: 'Mathematics (Calculus, Trigonometry)', pct: 84, color: 'bg-purple-600' },
                { subject: 'Chemistry (Stoichiometry, Bonding)', pct: 62, color: 'bg-emerald-600' },
                { subject: 'English (Vocabulary & Correction)', pct: 90, color: 'bg-amber-500' },
                { subject: 'Analytical Reasoning & Logic', pct: 71, color: 'bg-indigo-600' },
              ].map((item) => (
                <div key={item.subject} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">{item.subject}</span>
                    <span className="text-slate-900 dark:text-white">{item.pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Attempts & Quick Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Recent Test Runs</h3>
              <button
                onClick={() => onNavigate('mock-tests')}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                All Exams
              </button>
            </div>

            {attempts.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <FileCheck2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No tests taken yet. Start a simulated mock test to generate insights.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {attempts.map((att) => (
                  <div
                    key={att.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-extrabold text-xs text-slate-900 dark:text-white leading-snug">
                          {att.testTitle}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(att.completedAt).toLocaleDateString()} · {Math.floor(att.durationSeconds / 60)} mins
                        </p>
                      </div>

                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                          att.percentage >= 50
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                        }`}
                      >
                        {att.percentage}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                      <span className="text-slate-500">
                        Score: {att.score}/{att.maxScore}
                      </span>
                      <button
                        onClick={() => onViewResult(att.id)}
                        className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <span>View Card</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Box */}
          <div className="rounded-2xl bg-linear-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/60 border border-blue-200 dark:border-slate-700 p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Next Recommended Action</span>
            </div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
              Practice USAT Part 2 Essay Writing
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Did you know 25% of the total USAT merit depends on your essay? Submit a 400-word draft to get instant AI grading.
            </p>
            <button
              onClick={() => onNavigate('essay-lab')}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
            >
              Open AI Essay Lab
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
