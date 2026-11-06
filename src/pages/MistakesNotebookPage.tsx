import React, { useState, useEffect } from 'react';
import {
  BookX,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Trash2,
  Sparkles,
  Bookmark,
  Filter,
} from 'lucide-react';
import { Question } from '../types.js';
import { LatexMath } from '../components/LatexMath.js';
import { api } from '../services/api.js';

export const MistakesNotebookPage: React.FC = () => {
  const [mistakes, setMistakes] = useState<Question[]>([]);
  const [reAttemptState, setReAttemptState] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | null>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [filterSubject, setFilterSubject] = useState<string>('all');

  useEffect(() => {
    // Load from localStorage or seed with a couple of high-yield revision items if empty
    try {
      const stored = localStorage.getItem('pakprep_mistakes');
      if (stored) {
        setMistakes(JSON.parse(stored));
      } else {
        // Fetch 3 questions as initial notebook entries
        api.getQuestions().then((qs) => {
          const sample = qs.slice(0, 3);
          setMistakes(sample);
          localStorage.setItem('pakprep_mistakes', JSON.stringify(sample));
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleRemove = (id: string) => {
    const updated = mistakes.filter((m) => m.id !== id);
    setMistakes(updated);
    localStorage.setItem('pakprep_mistakes', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setMistakes([]);
    localStorage.removeItem('pakprep_mistakes');
  };

  const handleSelectOption = (qId: string, opt: 'A' | 'B' | 'C' | 'D') => {
    setReAttemptState((prev) => ({ ...prev, [qId]: opt }));
    setShowExplanation((prev) => ({ ...prev, [qId]: true }));
  };

  const filtered = filterSubject === 'all'
    ? mistakes
    : mistakes.filter((m) => m.subjectId === filterSubject);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider mb-1">
            <BookX className="w-4 h-4" />
            <span>Targeted Mistake Remediation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Mistakes Notebook
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Every question you missed in practice or mock exams is archived here for targeted re-attempts.
          </p>
        </div>

        {mistakes.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition self-start sm:self-center"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Notebook</span>
          </button>
        )}
      </div>

      {/* Filter Row */}
      {mistakes.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          <span className="font-bold text-slate-500 shrink-0">Filter by Subject:</span>
          {['all', 'sub-phy', 'sub-math', 'sub-chem', 'sub-eng', 'sub-iq'].map((sub) => {
            const label = sub === 'all' ? 'All Mistakes' : sub.replace('sub-', '').toUpperCase();
            return (
              <button
                key={sub}
                onClick={() => setFilterSubject(sub)}
                className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                  filterSubject === sub
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Questions List */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Your Mistakes Notebook is empty!
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Great job! When you encounter tricky questions during practice or mock tests, they will automatically collect here for active recall practice.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((q, idx) => {
            const reAttempt = reAttemptState[q.id];
            const isShown = showExplanation[q.id];

            return (
              <div
                key={q.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-black px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      Mistake #{idx + 1}
                    </span>
                    <span className="font-bold text-slate-500 uppercase">{q.subjectId}</span>
                    <span className="text-slate-400">· {q.difficulty}</span>
                  </div>

                  <button
                    onClick={() => handleRemove(q.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition"
                    title="Remove from notebook"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                  {q.questionText}
                </p>

                {q.formula && <LatexMath formula={q.formula} />}

                {/* 4 Interactive Re-Attempt Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(['A', 'B', 'C', 'D'] as const).map((key) => {
                    const isSelected = reAttempt === key;
                    const isCorrect = key === q.correctAnswer;

                    let optStyle =
                      'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800';
                    if (isShown) {
                      if (isCorrect) {
                        optStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                      } else if (isSelected) {
                        optStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={key}
                        onClick={() => handleSelectOption(q.id, key)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${optStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 font-bold flex items-center justify-center">
                            {key}
                          </span>
                          <span>{q.options[key]}</span>
                        </div>
                        {isShown && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {isShown && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isShown && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Correct Solution & Rationale:</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
