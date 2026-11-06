import React, { useState, useEffect } from 'react';
import {
  PenTool,
  Clock,
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  History,
  Send,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { api } from '../services/api.js';
import { EssayTopic, EssayEvaluation } from '../types.js';
import { useAuth } from '../context/AuthContext.js';
import { useThemeLanguage } from '../context/ThemeLanguageContext.js';

export const EssayLabPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useThemeLanguage();

  const [topics, setTopics] = useState<EssayTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<EssayTopic | null>(null);
  const [essayText, setEssayText] = useState('');
  const [essayLanguage, setEssayLanguage] = useState<'English' | 'Urdu'>('English');

  // Timer: 35 minutes default for USAT Part 2
  const [secondsRemaining, setSecondsRemaining] = useState<number>(35 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Evaluation & Results
  const [isGrading, setIsGrading] = useState(false);
  const [evaluation, setEvaluation] = useState<EssayEvaluation | null>(null);
  const [history, setHistory] = useState<EssayEvaluation[]>([]);
  const [activeTab, setActiveTab] = useState<'write' | 'history'>('write');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getEssayTopics(), api.getEssayHistory(user?.id)])
      .then(([topicList, pastList]) => {
        setTopics(topicList);
        if (topicList.length > 0) {
          setSelectedTopic(topicList[0]);
          setEssayLanguage(topicList[0].language === 'Urdu' ? 'Urdu' : 'English');
        }
        setHistory(pastList);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  // Timer tick
  useEffect(() => {
    if (!timerRunning || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, secondsRemaining]);

  // Topic change handler
  const handleSelectTopic = (t: EssayTopic) => {
    setSelectedTopic(t);
    setEssayLanguage(t.language === 'Urdu' ? 'Urdu' : 'English');
    setSecondsRemaining(t.timeLimitMinutes * 60);
    setTimerRunning(false);
    setEvaluation(null);
    setError(null);
  };

  const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = essayText.length;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGradeEssay = async () => {
    if (!selectedTopic) return;
    if (wordCount < 30) {
      setError('Please write at least 30 words before requesting AI grading.');
      return;
    }

    setIsGrading(true);
    setError(null);

    const timeSpent = Math.max(
      1,
      Math.round((selectedTopic.timeLimitMinutes * 60 - secondsRemaining) / 60)
    );

    try {
      const result = await api.gradeEssay({
        topicId: selectedTopic.id,
        topicTitle: selectedTopic.title,
        userId: user?.id || 'usr-student-1',
        userName: user?.name || 'Student',
        language: essayLanguage,
        essayText,
        timeSpentMinutes: timeSpent,
      });

      setEvaluation(result);
      setHistory((prev) => [result, ...prev]);
      setTimerRunning(false);
    } catch (err: any) {
      setError(err.message || 'AI Essay evaluation service temporary issue.');
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>USAT Part 2 & University Admission Essay Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            AI Essay Writing & Examiner Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Write timed essays in English or Urdu and receive instant HEC rubric grading out of 25 marks.
          </p>
        </div>

        {/* Tab Switch: Write vs History */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <button
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
              activeTab === 'write'
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Writing Console</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Past Essays ({history.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'write' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Topic Bank & Instructions (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Topic Selector */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Official Essay Topic Bank
              </h3>

              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {topics.map((t) => {
                  const isSelected = selectedTopic?.id === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTopic(t)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 font-semibold text-blue-900 dark:text-blue-200'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {t.language}
                        </span>
                        <span className="text-[10px] text-slate-400">{t.recommendedWords}</span>
                      </div>
                      <p className="leading-snug">{t.title}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prompt Instructions & Hints */}
            {selectedTopic && (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Syllabus Hints & Structure:</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedTopic.instructions}
                </p>

                {selectedTopic.hints?.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Recommended Outline:</p>
                    <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                      {selectedTopic.hints.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Writing Editor & Evaluator (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-6 sm:p-7 space-y-4">
              {/* Selected Topic Title & Timer Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Assigned Prompt
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                    {selectedTopic?.title}
                  </h2>
                </div>

                {/* Exam Timer & Language Selector */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <select
                    value={essayLanguage}
                    onChange={(e) => setEssayLanguage(e.target.value as 'English' | 'Urdu')}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 outline-hidden"
                  >
                    <option value="English">English</option>
                    <option value="Urdu">Urdu (اردو)</option>
                  </select>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTimer(secondsRemaining)}</span>
                  </div>

                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    {timerRunning ? 'Pause' : 'Start'}
                  </button>
                </div>
              </div>

              {/* Text Area Editor */}
              <div className="relative">
                <textarea
                  rows={13}
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  dir={essayLanguage === 'Urdu' ? 'rtl' : 'ltr'}
                  placeholder={
                    essayLanguage === 'Urdu'
                      ? 'یہاں اپنا جامع اور مدلل مضمون تحریر کریں۔ مناسب پیراگراف، اعداد و شمار، اور ربط کا خیال رکھیں۔۔۔'
                      : 'Draft your essay here. Structure your response into an Introduction, 2-3 body paragraphs with concrete arguments and evidence, and a forward-looking Conclusion...'
                  }
                  className={`w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm leading-relaxed outline-hidden focus:ring-2 focus:ring-blue-500 transition ${
                    essayLanguage === 'Urdu' ? 'font-urdu text-base' : 'font-sans'
                  }`}
                />
              </div>

              {/* Live Status Bar: Word Counter & Target Indicator */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
                <div className="flex items-center gap-3">
                  <span>
                    Words:{' '}
                    <strong
                      className={
                        wordCount >= 400
                          ? 'text-emerald-600 font-black'
                          : wordCount >= 200
                          ? 'text-amber-500 font-bold'
                          : 'text-slate-700 dark:text-slate-300 font-bold'
                      }
                    >
                      {wordCount}
                    </strong>{' '}
                    / 400-500 Target
                  </span>
                  <span>·</span>
                  <span>Characters: {charCount}</span>
                </div>

                <button
                  disabled={isGrading || wordCount < 20}
                  onClick={handleGradeEssay}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isGrading ? 'AI Examiner Evaluating...' : 'Submit for Instant AI Grading'}</span>
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* AI Evaluation Result Card */}
            {evaluation && (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900/80 shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                        AI Examiner Evaluation Report
                      </h3>
                      <p className="text-xs text-slate-500">HEC USAT Part 2 Rubric Benchmark</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                      {evaluation.scaledScore} / 25
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Scaled Score ({evaluation.overallScore}/10 Overall)
                    </span>
                  </div>
                </div>

                {/* 5-Criteria Rubric Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(evaluation.rubric).map(([crit, data]) => {
                    const titles: Record<string, string> = {
                      contentIdeas: 'Content & Ideas',
                      structureOrg: 'Structure & Flow',
                      grammarVocab: 'Grammar & Vocab',
                      coherence: 'Coherence & Logic',
                      conclusion: 'Conclusion',
                    };

                    return (
                      <div
                        key={crit}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-1.5"
                      >
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-800 dark:text-slate-200">{titles[crit] || crit}</span>
                          <span className="text-blue-600 dark:text-blue-400 font-black">
                            {data.score} / 10
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${(data.score / 10) * 100}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                          {data.feedback}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Strengths */}
                {evaluation.strengths && evaluation.strengths.length > 0 && (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Key Strengths Observed:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                      {evaluation.strengths.map((str, i) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Specific Mistakes & Corrections */}
                {evaluation.mistakes && evaluation.mistakes.length > 0 && (
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-300">
                      <AlertCircle className="w-4 h-4" />
                      <span>Errors & Recommended Rewrites:</span>
                    </div>
                    <div className="space-y-2">
                      {evaluation.mistakes.map((m, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/60">
                          <p className="text-slate-700 dark:text-slate-300 font-semibold mb-1">
                            Issue: {m.issue}
                          </p>
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                            Fix: {m.fix}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvement Tips */}
                {evaluation.improvementTips && evaluation.improvementTips.length > 0 && (
                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-blue-800 dark:text-blue-300">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>Actionable Advice for Next Attempt:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                      {evaluation.improvementTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Essay History View */
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Your Submitted Essays & Evaluations
          </h3>

          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>You haven't submitted any essays yet. Select a topic and start practicing!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {item.language}
                      </span>
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mt-1">
                        {item.topicTitle}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {new Date(item.submittedAt).toLocaleDateString()} · {item.wordCount} words · {item.timeSpentMinutes} mins
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                        {item.scaledScore} / 25
                      </p>
                      <span className="text-[10px] font-bold text-slate-500">
                        Overall {item.overallScore}/10
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 font-mono">
                    {item.essayText}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
