import React, { useState, useEffect } from 'react';
import {
  Clock,
  Flag,
  Maximize2,
  Minimize2,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../services/api.js';
import { MockTest, Question, TestAttempt, QuestionAnswer } from '../types.js';
import { LatexMath } from '../components/LatexMath.js';
import { useAuth } from '../context/AuthContext.js';
import { useThemeLanguage } from '../context/ThemeLanguageContext.js';

interface MockExamRunnerProps {
  testId: string;
  onFinishTest: (attemptId: string) => void;
  onCancelTest: () => void;
}

export const MockExamRunnerPage: React.FC<MockExamRunnerProps> = ({
  testId,
  onFinishTest,
  onCancelTest,
}) => {
  const { user } = useAuth();
  const { language } = useThemeLanguage();

  const [test, setTest] = useState<MockTest | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Student Answers map: questionId -> QuestionAnswer
  const [answersMap, setAnswersMap] = useState<Record<string, QuestionAnswer>>({});

  // Countdown timer
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Anti-cheat tab switch detector
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState<number>(0);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Confirm submit modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load Test and its Questions
  useEffect(() => {
    api
      .getTestById(testId)
      .then(async (mockTest) => {
        setTest(mockTest);
        setSecondsRemaining(mockTest.durationMinutes * 60);

        // Fetch the exact questions belonging to this test
        const allQuestions = await api.getQuestions();
        const testQuestions = mockTest.questionIds
          .map((id) => allQuestions.find((q) => q.id === id))
          .filter(Boolean) as Question[];

        // If somehow list is short, complement with general pool
        if (testQuestions.length === 0) {
          setQuestions(allQuestions.slice(0, 15));
        } else {
          setQuestions(testQuestions);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [testId]);

  // Anti-Cheat Tab-Switch Listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchWarnings((prev) => {
          const next = prev + 1;
          setShowWarningModal(true);
          return next;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Timer Countdown & Auto-Submit
  useEffect(() => {
    if (loading || secondsRemaining <= 0) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit(); // Auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, secondsRemaining]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    const q = questions[currentIndex];
    if (!q) return;

    setAnswersMap((prev) => ({
      ...prev,
      [q.id]: {
        questionId: q.id,
        selectedOption: key,
        isCorrect: key === q.correctAnswer,
        timeSpentSeconds: 20,
        flagged: prev[q.id]?.flagged || false,
      },
    }));
  };

  const toggleFlagCurrent = () => {
    const q = questions[currentIndex];
    if (!q) return;

    setAnswersMap((prev) => {
      const current = prev[q.id] || {
        questionId: q.id,
        selectedOption: null,
        isCorrect: false,
        timeSpentSeconds: 0,
        flagged: false,
      };
      return {
        ...prev,
        [q.id]: {
          ...current,
          flagged: !current.flagged,
        },
      };
    });
  };

  const clearCurrentAnswer = () => {
    const q = questions[currentIndex];
    if (!q) return;
    setAnswersMap((prev) => {
      const current = prev[q.id];
      if (!current) return prev;
      return {
        ...prev,
        [q.id]: {
          ...current,
          selectedOption: null,
          isCorrect: false,
        },
      };
    });
  };

  const handleFinalSubmit = async () => {
    if (!test || isSubmitting) return;
    setIsSubmitting(true);

    const answersList: QuestionAnswer[] = questions.map((q) => {
      return (
        answersMap[q.id] || {
          questionId: q.id,
          selectedOption: null,
          isCorrect: false,
          timeSpentSeconds: 0,
          flagged: false,
        }
      );
    });

    const correctCount = answersList.filter((a) => a.isCorrect).length;
    const answeredCount = answersList.filter((a) => a.selectedOption !== null).length;
    const wrongCount = answeredCount - correctCount;
    const skippedCount = questions.length - answeredCount;

    const penaltyPerWrong = test.negativeMarking || 0;
    const rawScore = correctCount * (test.marksPerCorrect || 1) - wrongCount * penaltyPerWrong;
    const finalScore = Math.max(0, Math.round(rawScore * 10) / 10);
    const maxScore = questions.length * (test.marksPerCorrect || 1);
    const percentage = Math.round((finalScore / maxScore) * 1000) / 10;

    // Subject breakdown calculation
    const subjectMap: Record<
      string,
      { correct: number; wrong: number; skipped: number; total: number; score: number }
    > = {};
    const weakChaptersSet = new Set<string>();

    questions.forEach((q) => {
      const sId = q.subjectId || 'General';
      if (!subjectMap[sId]) {
        subjectMap[sId] = { correct: 0, wrong: 0, skipped: 0, total: 0, score: 0 };
      }
      subjectMap[sId].total += 1;
      const ans = answersMap[q.id];
      if (ans && ans.selectedOption) {
        if (ans.isCorrect) {
          subjectMap[sId].correct += 1;
          subjectMap[sId].score += test.marksPerCorrect || 1;
        } else {
          subjectMap[sId].wrong += 1;
          subjectMap[sId].score -= penaltyPerWrong;
          if (q.chapterId) weakChaptersSet.add(q.chapterId);
        }
      } else {
        subjectMap[sId].skipped += 1;
      }
    });

    const subjectBreakdown = Object.entries(subjectMap).map(([sId, stats]) => ({
      subjectId: sId,
      subjectName: sId.replace('sub-', '').toUpperCase(),
      correct: stats.correct,
      wrong: stats.wrong,
      skipped: stats.skipped,
      total: stats.total,
      score: Math.max(0, Math.round(stats.score * 10) / 10),
    }));

    const durationTaken = test.durationMinutes * 60 - secondsRemaining;

    try {
      const savedAttempt = await api.saveAttempt({
        testId: test.id,
        testTitle: test.title,
        categoryCode: test.categoryId.replace('cat-', '').toUpperCase(),
        userId: user?.id || 'usr-student-1',
        userName: user?.name || 'Hamza Khan',
        startedAt: new Date(Date.now() - durationTaken * 1000).toISOString(),
        durationSeconds: durationTaken,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        skippedAnswers: skippedCount,
        score: finalScore,
        maxScore,
        percentage,
        negativeMarkingApplied: wrongCount * penaltyPerWrong,
        answers: answersList,
        subjectBreakdown,
        weakChapters: Array.from(weakChaptersSet).slice(0, 3),
      });

      // Exit fullscreen if active
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      onFinishTest(savedAttempt.id);
    } catch (err) {
      console.error('Failed to submit exam:', err);
      setIsSubmitting(false);
    }
  };

  if (loading || !test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold">Initializing Secure Exam Environment...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const currentAnswer = answersMap[currentQ?.id];

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.values(answersMap).filter((a) => a.selectedOption !== null).length;
  const flaggedCount = Object.values(answersMap).filter((a) => a.flagged).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      {/* Top Test Navigation & Timer Bar */}
      <div className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Exam Title & Subject info */}
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                {test.title}
              </h2>
              <p className="text-[11px] text-slate-500">
                Question {currentIndex + 1} of {questions.length} · Marked:{' '}
                <span className="text-emerald-600 font-bold">+{test.marksPerCorrect}</span>
                {test.negativeMarking > 0 && (
                  <span className="text-rose-500 font-bold ml-1">(-{test.negativeMarking})</span>
                )}
              </p>
            </div>
          </div>

          {/* Center Countdown Clock */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-mono font-bold shadow-xs ${
              secondsRemaining < 300
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 animate-pulse'
                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          {/* Right Tools: Fullscreen & Submit Test */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
            </button>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body: Question on left, Palette on right */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Question Console (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-6 sm:p-8">
              {/* Question metadata row */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-black px-2.5 py-1 rounded-lg bg-blue-600 text-white">
                    Q {currentIndex + 1}
                  </span>
                  <span className="text-slate-500 font-semibold">
                    Category: {test.categoryId.replace('cat-', '').toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {currentAnswer?.selectedOption && (
                    <button
                      onClick={clearCurrentAnswer}
                      className="text-xs text-slate-400 hover:text-rose-500 hover:underline"
                    >
                      Clear Selection
                    </button>
                  )}

                  <button
                    onClick={toggleFlagCurrent}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold border transition ${
                      currentAnswer?.flagged
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Flag className={`w-3.5 h-3.5 ${currentAnswer?.flagged ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span>{currentAnswer?.flagged ? 'Flagged' : 'Flag for Review'}</span>
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-3 mb-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentQ?.questionText}
                </h3>
                {currentQ?.questionTextUrdu && (
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 font-urdu dir-rtl text-right">
                    {currentQ.questionTextUrdu}
                  </p>
                )}
                {currentQ?.formula && <LatexMath formula={currentQ.formula} />}
              </div>

              {/* 4 Options Radio Style */}
              <div className="space-y-3 mb-6">
                {(['A', 'B', 'C', 'D'] as const).map((key) => {
                  const optionText = currentQ?.options[key];
                  const optionTextUrdu = currentQ?.optionsUrdu?.[key];
                  const isSelected = currentAnswer?.selectedOption === key;

                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectOption(key)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {key}
                        </span>
                        <div className="space-y-0.5">
                          <span className="text-sm block">{optionText}</span>
                          {optionTextUrdu && (
                            <span className="text-xs text-slate-500 block text-right font-urdu">
                              {optionTextUrdu}
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next controls */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setCurrentIndex((p) => Math.min(questions.length - 1, p + 1))}
                  disabled={currentIndex === questions.length - 1}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm disabled:opacity-30 transition"
                >
                  <span>Save & Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Question Palette Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                Question Palette
              </h4>

              {/* Status Legend */}
              <div className="grid grid-cols-3 gap-2 text-[11px] mb-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span>Flagged ({flaggedCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span>Left ({unansweredCount})</span>
                </div>
              </div>

              {/* Palette Buttons Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-[360px] overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const ans = answersMap[q.id];
                  const isCurrent = idx === currentIndex;
                  const isAnswered = ans && ans.selectedOption !== null;
                  const isFlagged = ans?.flagged;

                  let colorClass =
                    'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

                  if (isFlagged) {
                    colorClass = 'bg-amber-400 text-slate-950 font-bold border-amber-500';
                  } else if (isAnswered) {
                    colorClass = 'bg-emerald-600 text-white font-bold border-emerald-700';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-lg border text-xs font-bold flex items-center justify-center transition relative ${colorClass} ${
                        isCurrent ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 scale-105' : ''
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 absolute top-1 right-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Progress Summary Bar */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>Exam Progress</span>
                  <span>
                    {Math.round((answeredCount / questions.length) * 100)}% Completed
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Anti-Cheat Tab Switch Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border-2 border-rose-500 p-6 shadow-2xl text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center mx-auto animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Anti-Cheat Warning: Tab Switch Detected!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              You navigated away from the exam window. Under official HEC USAT computerized test rules, multiple tab switches can result in paper disqualification.
            </p>
            <div className="py-2 px-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-700 dark:text-rose-300 font-bold">
              Recorded Offense: {tabSwitchWarnings} time(s)
            </div>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
            >
              I Understand & Resume Exam
            </button>
          </div>
        </div>
      )}

      {/* Confirm Submission Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Send className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-lg">Confirm Final Exam Submission</h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to end your exam? You cannot modify your answers once submitted.
            </p>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-center text-xs">
              <div>
                <p className="font-black text-emerald-600 text-lg">{answeredCount}</p>
                <p className="text-slate-500">Answered</p>
              </div>
              <div>
                <p className="font-black text-amber-500 text-lg">{flaggedCount}</p>
                <p className="text-slate-500">Flagged</p>
              </div>
              <div>
                <p className="font-black text-slate-400 text-lg">{unansweredCount}</p>
                <p className="text-slate-500">Left Blank</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Return to Exam
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
              >
                {isSubmitting ? 'Evaluating Score...' : 'Submit & View Card'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
