import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Clock,
  Award,
  AlertTriangle,
  Play,
  Lock,
  PlusCircle,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Category, MockTest } from '../types.js';
import { useAuth } from '../context/AuthContext.js';
import { useThemeLanguage } from '../context/ThemeLanguageContext.js';

interface MockTestsPageProps {
  onStartTest: (testId: string) => void;
  onNavigate: (page: string) => void;
}

export const MockTestsPage: React.FC<MockTestsPageProps> = ({ onStartTest, onNavigate }) => {
  const { user } = useAuth();
  const { language } = useThemeLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tests, setTests] = useState<MockTest[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Custom Test Builder state
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customQuestionCount, setCustomQuestionCount] = useState<number>(30);
  const [customDuration, setCustomDuration] = useState<number>(40);
  const [customNegativeMarking, setCustomNegativeMarking] = useState<number>(0);

  useEffect(() => {
    Promise.all([api.getCategories(), api.getTests()])
      .then(([cats, testList]) => {
        setCategories(cats);
        setTests(testList);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredTests = selectedCat
    ? tests.filter((t) => t.categoryId === selectedCat)
    : tests;

  const handleLaunchCustomTest = async () => {
    try {
      // Fetch available questions from selected category or all
      const qs = await api.getQuestions({
        categoryId: selectedCat || 'cat-usat-e',
      });
      const chosenIds = qs.slice(0, customQuestionCount).map((q) => q.id);

      const customTest: MockTest = await api.createTest({
        title: `Custom Adaptive Challenge (${customQuestionCount} Qs)`,
        titleUrdu: 'کسٹم منتخب ٹیسٹ',
        categoryId: selectedCat || 'cat-usat-e',
        type: 'daily_quiz',
        description: `Student custom configured exam with ${customDuration} mins and ${
          customNegativeMarking > 0 ? 'negative marking (-0.25)' : 'zero negative marking'
        }.`,
        durationMinutes: customDuration,
        totalMarks: customQuestionCount,
        marksPerCorrect: 1,
        negativeMarking: customNegativeMarking,
        isPremium: false,
        questionIds: chosenIds.length > 0 ? chosenIds : ['q-phy-101', 'q-phy-102', 'q-math-201', 'q-math-202'],
        subjectDistribution: [],
      });

      setShowCustomModal(false);
      onStartTest(customTest.id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">
            <FileCheck2 className="w-4 h-4" />
            <span>HEC USAT & University Entrance Exam Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Timed Mock Examinations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real exam patterns, question palette, anti-cheat tab monitors, and instant rank cards.
          </p>
        </div>

        {/* Custom Test Creator Button */}
        <button
          onClick={() => setShowCustomModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
        >
          <Sliders className="w-4 h-4" />
          <span>Build Custom Test</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        <button
          onClick={() => setSelectedCat('')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            selectedCat === ''
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          All Categories ({tests.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCat(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCat === c.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {c.code}
          </button>
        ))}
      </div>

      {/* Mock Tests Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 mx-auto border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-semibold">Loading mock test simulations...</p>
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No mock tests listed under this category yet.
          </p>
          <button
            onClick={() => setShowCustomModal(true)}
            className="mt-3 text-xs text-blue-600 font-bold hover:underline"
          >
            Create a custom mock test right now →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const isLocked = test.isPremium && user?.plan !== 'pro';

            return (
              <div
                key={test.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                      {test.type.replace('_', ' ')}
                    </span>
                    {test.isPremium ? (
                      <span className="flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                        <Lock className="w-3 h-3" />
                        <span>USAT Pro</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                        Free Access
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug mb-2">
                    {language === 'ur' ? test.titleUrdu : test.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                    {test.description}
                  </p>

                  {/* Test Specs Badge Row */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 text-xs mb-4">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>{test.durationMinutes} Minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{test.questionIds.length} Questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>{test.totalMarks} Marks</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      <span>
                        {test.negativeMarking > 0 ? `-${test.negativeMarking} Neg.` : 'No Neg. Marking'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {test.attemptsCount}
                    </span>{' '}
                    Attempts · Avg:{' '}
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {test.avgScorePercentage}%
                    </span>
                  </div>

                  {isLocked ? (
                    <button
                      onClick={() => onNavigate('pricing')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock Pro</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onStartTest(test.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start Exam</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Test Builder Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-1">
              Build Custom Entry Test
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Select question count, time limit, and negative marking to fit your study session.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Number of Questions
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 50, 75].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setCustomQuestionCount(cnt)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        customQuestionCount === cnt
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {cnt} Qs
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Time Limit (Minutes)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[20, 40, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setCustomDuration(mins)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        customDuration === mins
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Negative Marking
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomNegativeMarking(0)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      customNegativeMarking === 0
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    No Negative Marking
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomNegativeMarking(0.25)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      customNegativeMarking === 0.25
                        ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    -0.25 Marks per Wrong
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLaunchCustomTest}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                >
                  Start Custom Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
