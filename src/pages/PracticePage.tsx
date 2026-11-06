import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Filter,
  CheckCircle2,
  XCircle,
  Bookmark,
  BookmarkCheck,
  Flag,
  RotateCcw,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Category, Subject, Chapter, Question } from '../types.js';
import { LatexMath } from '../components/LatexMath.js';
import { useAuth } from '../context/AuthContext.js';
import { useThemeLanguage } from '../context/ThemeLanguageContext.js';
import { ReportModal } from '../components/ReportModal.js';

export const PracticePage: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useThemeLanguage();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Filter selections
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Mixed');

  // Question navigation and interaction state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Settings & Toggles
  const [practiceMode, setPracticeMode] = useState<'instant' | 'exam'>('instant'); // instant feedback vs exam style
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);

  // Bookmarks and Mistakes
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('pakprep_bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  const [reportModalQuestionId, setReportModalQuestionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load Categories on mount
  useEffect(() => {
    api
      .getCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) {
          setSelectedCategory(cats[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Load Subjects when Category changes
  useEffect(() => {
    if (!selectedCategory) return;
    api
      .getSubjects(selectedCategory)
      .then((subs) => {
        setSubjects(subs);
        if (subs.length > 0) {
          setSelectedSubject(subs[0].id);
        } else {
          setSelectedSubject('');
        }
      })
      .catch(console.error);
  }, [selectedCategory]);

  // Load Chapters when Subject changes
  useEffect(() => {
    if (!selectedSubject) {
      setChapters([]);
      setSelectedChapter('');
      return;
    }
    api
      .getChapters(selectedSubject)
      .then((chaps) => {
        setChapters(chaps);
        setSelectedChapter(''); // default to all chapters
      })
      .catch(console.error);
  }, [selectedSubject]);

  // Load Questions when filters change
  useEffect(() => {
    if (!selectedCategory) return;
    setLoading(true);
    api
      .getQuestions({
        categoryId: selectedCategory,
        subjectId: selectedSubject || undefined,
        chapterId: selectedChapter || undefined,
        difficulty: selectedDifficulty,
      })
      .then((qs) => {
        setQuestions(qs);
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
        setTimeRemaining(60);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedSubject, selectedChapter, selectedDifficulty]);

  // Question Timer Countdown
  useEffect(() => {
    if (!timerEnabled || isAnswerSubmitted || questions.length === 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsAnswerSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerEnabled, isAnswerSubmitted, currentIndex, questions.length]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswerSubmitted && practiceMode === 'instant') return;
    setSelectedOption(opt);
    if (practiceMode === 'instant') {
      setIsAnswerSubmitted(true);
      // If wrong, add to mistakes notebook in localStorage
      if (currentQ && opt !== currentQ.correctAnswer) {
        saveMistake(currentQ);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTimeRemaining(60);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTimeRemaining(60);
    }
  };

  const toggleBookmark = (qId: string) => {
    let updated: string[];
    if (bookmarkedIds.includes(qId)) {
      updated = bookmarkedIds.filter((id) => id !== qId);
    } else {
      updated = [...bookmarkedIds, qId];
    }
    setBookmarkedIds(updated);
    localStorage.setItem('pakprep_bookmarks', JSON.stringify(updated));
  };

  const saveMistake = (q: Question) => {
    try {
      const existing: Question[] = JSON.parse(localStorage.getItem('pakprep_mistakes') || '[]');
      if (!existing.some((item) => item.id === q.id)) {
        existing.unshift(q);
        localStorage.setItem('pakprep_mistakes', JSON.stringify(existing));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & Breadcrumbs */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>HEC USAT & Entry Test Practice Mode</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Topic & Chapter-wise MCQs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real questions with detailed explanations, bookmarking, and timer assistance.
          </p>
        </div>

        {/* Practice vs Exam mode toggle & Timer toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Practice vs Exam toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setPracticeMode('instant')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                practiceMode === 'instant'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Instant Feedback</span>
            </button>
            <button
              onClick={() => setPracticeMode('exam')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                practiceMode === 'exam'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Exam Mode</span>
            </button>
          </div>

          {/* Timer Toggle */}
          <button
            onClick={() => {
              setTimerEnabled(!timerEnabled);
              setTimeRemaining(60);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              timerEnabled
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Timer: {timerEnabled ? `${timeRemaining}s` : 'Off'}</span>
          </button>
        </div>
      </div>

      {/* Filter Selection Card */}
      <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5" />
          <span>Custom Filter Bank:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Test Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white outline-hidden"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white outline-hidden"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.nameUrdu})
                </option>
              ))}
            </select>
          </div>

          {/* Chapter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Chapter / Topic
            </label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white outline-hidden"
            >
              <option value="">All Chapters</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white outline-hidden"
            >
              <option value="Mixed">Mixed (All Levels)</option>
              <option value="Easy">Easy (Basic Concepts)</option>
              <option value="Medium">Medium (Application)</option>
              <option value="Hard">Hard (High-Yield Tricky)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Question Display */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 mx-auto border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-semibold">Loading authentic questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">No questions found for this filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try switching the chapter or difficulty back to 'Mixed' or choose another subject from the selector above.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Question Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-6 sm:p-8">
            {/* Question Header & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-black text-xs">
                  Q {currentIndex + 1} of {questions.length}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    currentQ.difficulty === 'Easy'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : currentQ.difficulty === 'Medium'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                >
                  {currentQ.difficulty}
                </span>
                {currentQ.tags?.map((t) => (
                  <span
                    key={t}
                    className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Action buttons: Bookmark & Report */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleBookmark(currentQ.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    bookmarkedIds.includes(currentQ.id)
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                      : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                  title="Bookmark question for review"
                >
                  {bookmarkedIds.includes(currentQ.id) ? (
                    <BookmarkCheck className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {bookmarkedIds.includes(currentQ.id) ? 'Bookmarked' : 'Bookmark'}
                  </span>
                </button>

                <button
                  onClick={() => setReportModalQuestionId(currentQ.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  title="Report question error"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-3 mb-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.questionText}
              </h2>

              {currentQ.questionTextUrdu && (
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed font-urdu dir-rtl text-right">
                  {currentQ.questionTextUrdu}
                </p>
              )}

              {currentQ.formula && <LatexMath formula={currentQ.formula} />}
            </div>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {(['A', 'B', 'C', 'D'] as const).map((key) => {
                const optionText = currentQ.options[key];
                const optionTextUrdu = currentQ.optionsUrdu?.[key];
                const isSelected = selectedOption === key;
                const isCorrect = key === currentQ.correctAnswer;

                let stateClasses =
                  'border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800/80';

                if (isAnswerSubmitted && practiceMode === 'instant') {
                  if (isCorrect) {
                    stateClasses =
                      'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                  } else if (isSelected) {
                    stateClasses =
                      'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                  }
                } else if (isSelected) {
                  stateClasses =
                    'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold';
                }

                return (
                  <button
                    key={key}
                    onClick={() => handleSelectOption(key)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition flex items-start justify-between gap-3 ${stateClasses}`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {key}
                      </span>
                      <div className="space-y-1">
                        <span className="text-sm block">{optionText}</span>
                        {optionTextUrdu && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 block text-right font-urdu">
                            {optionTextUrdu}
                          </span>
                        )}
                      </div>
                    </div>

                    {isAnswerSubmitted && practiceMode === 'instant' && (
                      <div className="shrink-0 mt-0.5">
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Explanation Box */}
            {isAnswerSubmitted && practiceMode === 'instant' && (
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Answer Rationale & Concept:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {currentQ.explanation}
                </p>
                {currentQ.explanationUrdu && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-urdu text-right pt-1 border-t border-slate-200 dark:border-slate-700">
                    {currentQ.explanationUrdu}
                  </p>
                )}
              </div>
            )}

            {/* Navigation Bar */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="text-xs text-slate-400 font-semibold">
                {currentIndex + 1} / {questions.length} Questions
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition disabled:opacity-30"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        questionId={reportModalQuestionId}
        isOpen={Boolean(reportModalQuestionId)}
        onClose={() => setReportModalQuestionId(null)}
      />
    </div>
  );
};
