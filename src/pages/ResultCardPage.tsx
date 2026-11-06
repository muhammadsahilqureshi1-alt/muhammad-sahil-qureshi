import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Share2,
  ArrowRight,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api.js';
import { TestAttempt, Question } from '../types.js';
import { LatexMath } from '../components/LatexMath.js';
import { useAuth } from '../context/AuthContext.js';

interface ResultCardProps {
  attemptId: string;
  onRetake: () => void;
  onNavigate: (page: string) => void;
}

export const ResultCardPage: React.FC<ResultCardProps> = ({
  attemptId,
  onRetake,
  onNavigate,
}) => {
  const { user } = useAuth();
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'review'>('overview');
  const [filterReview, setFilterReview] = useState<'all' | 'wrong' | 'correct'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getAttemptById(attemptId), api.getQuestions()])
      .then(([att, qs]) => {
        setAttempt(att);
        setQuestions(qs);
        // Confetti celebration if passed (>= 50%)
        if (att && att.percentage >= 50) {
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (e) {
            console.error(e);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading || !attempt) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Compiling Official Result Card...</p>
      </div>
    );
  }

  const isPassed = attempt.percentage >= 50; // Standard USAT passing cutoff is 50/100

  // Format time taken
  const mins = Math.floor(attempt.durationSeconds / 60);
  const secs = attempt.durationSeconds % 60;
  const timeTakenStr = `${mins}m ${secs}s`;

  // Filtered review questions
  const reviewQuestions = questions.filter((q) => {
    const studentAns = attempt.answers.find((a) => a.questionId === q.id);
    if (!studentAns) return false;
    if (filterReview === 'correct') return studentAns.isCorrect;
    if (filterReview === 'wrong') return studentAns.selectedOption && !studentAns.isCorrect;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Official Performance Evaluation
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Exam Result Card
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs transition"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print PDF Card</span>
          </button>

          <button
            onClick={onRetake}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Exam</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Style Result Card */}
      <div
        id="result-card-container"
        className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-10 relative overflow-hidden print:border-none print:shadow-none"
      >
        {/* Top watermark seal */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 opacity-10 dark:opacity-5 pointer-events-none">
          <Trophy className="w-36 h-36" />
        </div>

        {/* Header Information */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-black text-xl text-blue-600 dark:text-blue-400">PakPrep Portal</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                Verified Evaluation
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {attempt.testTitle}
            </h2>
            <p className="text-xs text-slate-500">
              Exam Date: {new Date(attempt.completedAt).toLocaleDateString()} · Attempt ID: {attempt.id}
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate Name</p>
            <p className="text-base font-extrabold text-slate-900 dark:text-white">{attempt.userName}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{user?.targetExam || 'USAT 2026'}</p>
          </div>
        </div>

        {/* Primary Score & Status Hero */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-8 items-center">
          {/* Big Score Radial / Box */}
          <div className="md:col-span-5 text-center p-6 rounded-2xl bg-linear-to-b from-blue-50 to-indigo-50/50 dark:from-slate-800 dark:to-slate-800/60 border border-blue-100 dark:border-slate-700">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 ${
                isPassed
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
              }`}
            >
              {isPassed ? '✓ USAT QUALIFIED (PASS)' : '✗ NEEDS IMPROVEMENT'}
            </span>

            <div className="flex items-baseline justify-center gap-1 my-2">
              <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white">
                {attempt.score}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-400">/{attempt.maxScore}</span>
            </div>

            <p className="text-lg font-black text-blue-600 dark:text-blue-400">
              {attempt.percentage}% Overall Accuracy
            </p>

            <p className="text-xs text-slate-500 mt-2">
              Official HEC qualifying threshold is 50%. You scored {attempt.percentage >= 50 ? 'above' : 'below'} standard.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold">Correct</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{attempt.correctAnswers}</p>
              <p className="text-[10px] text-slate-400">Questions</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-rose-500 mb-1">
                <XCircle className="w-4 h-4" />
                <span className="text-xs font-bold">Wrong</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{attempt.wrongAnswers}</p>
              <p className="text-[10px] text-slate-400">
                {attempt.negativeMarkingApplied > 0 ? `-${attempt.negativeMarkingApplied} Marks` : 'No Penalty'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold">Skipped</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{attempt.skippedAnswers}</p>
              <p className="text-[10px] text-slate-400">Unanswered</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold">Time</span>
              </div>
              <p className="text-lg font-black text-slate-900 dark:text-white mt-1">{timeTakenStr}</p>
              <p className="text-[10px] text-slate-400">Duration</p>
            </div>
          </div>
        </div>

        {/* Subject-Wise Performance Breakdown */}
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Subject-Wise Marks & Accuracy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {attempt.subjectBreakdown?.map((sub) => {
              const pct = sub.total > 0 ? Math.round((sub.correct / sub.total) * 100) : 0;
              return (
                <div
                  key={sub.subjectId}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-xs space-y-2"
                >
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-800 dark:text-slate-200">{sub.subjectName}</span>
                    <span className="text-blue-600 dark:text-blue-400">{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>
                      {sub.correct}/{sub.total} Correct
                    </span>
                    <span>Score: {sub.score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weak Topics Diagnostic Alert */}
        {attempt.weakChapters && attempt.weakChapters.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Recommended Remedial Focus Areas:</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              You encountered repeated mistakes in: <span className="font-semibold">{attempt.weakChapters.join(', ')}</span>. Practice these specific chapters to cross the 85+ marks bracket.
            </p>
          </div>
        )}

        {/* Verification footer seal */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Digital Certificate Hash: {attempt.id.toUpperCase()}-VERIFIED</span>
          </div>
          <p>© 2026 PakPrep Admissions Engine · Education Testing Council Standard</p>
        </div>
      </div>

      {/* Question Review Section (Togglable) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-6 sm:p-8 space-y-6 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Question-by-Question Solution Review
            </h3>
            <p className="text-xs text-slate-500">
              Understand why each answer was correct and study step-by-step logic.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            {(['all', 'wrong', 'correct'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterReview(filter)}
                className={`px-3 py-1.5 rounded-lg capitalize transition ${
                  filterReview === filter
                    ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {reviewQuestions.map((q, idx) => {
            const studentAns = attempt.answers.find((a) => a.questionId === q.id);
            const isCorrect = studentAns?.isCorrect;
            const selectedOpt = studentAns?.selectedOption;

            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs px-2.5 py-0.5 rounded bg-blue-600 text-white">
                      Q {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {q.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold">
                    {selectedOpt ? (
                      isCorrect ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Correct (+{q.difficulty === 'Hard' ? '1' : '1'})
                        </span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Incorrect
                        </span>
                      )
                    ) : (
                      <span className="text-slate-400">Skipped</span>
                    )}
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                  {q.questionText}
                </p>

                {q.formula && <LatexMath formula={q.formula} inline />}

                {/* Options Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                    const isSelected = selectedOpt === optKey;
                    const isOfficialCorrect = q.correctAnswer === optKey;

                    let optClass = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900';
                    if (isOfficialCorrect) {
                      optClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold';
                    } else if (isSelected && !isOfficialCorrect) {
                      optClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 line-through';
                    }

                    return (
                      <div
                        key={optKey}
                        className={`p-2.5 rounded-lg border flex items-center justify-between ${optClass}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{optKey}.</span>
                          <span>{q.options[optKey]}</span>
                        </div>
                        {isOfficialCorrect && (
                          <span className="text-[10px] font-bold text-emerald-600 uppercase">Correct</span>
                        )}
                        {isSelected && !isOfficialCorrect && (
                          <span className="text-[10px] font-bold text-rose-500 uppercase">Your Choice</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs space-y-1">
                  <div className="flex items-center gap-1 font-bold text-blue-700 dark:text-blue-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Explanation:</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
