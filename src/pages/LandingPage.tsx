import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  FileCheck2,
  PenTool,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext.js';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { language } = useThemeLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Quick Demo Interactive MCQ on Landing Page
  const [demoSelected, setDemoSelected] = useState<string | null>(null);
  const [demoChecked, setDemoChecked] = useState(false);

  const categories = [
    {
      code: 'USAT-E',
      name: 'Pre-Engineering',
      nameUrdu: 'پری انجینئرنگ',
      subjects: 'Physics, Chemistry, Math, English, Analytical',
      color: 'from-blue-600 to-indigo-600',
      badge: 'Popular',
    },
    {
      code: 'USAT-M',
      name: 'Pre-Medical',
      nameUrdu: 'پری میڈیکل',
      subjects: 'Biology, Physics, Chemistry, English, Analytical',
      color: 'from-emerald-600 to-teal-600',
      badge: 'High Yield',
    },
    {
      code: 'USAT-CS',
      name: 'Computer Science',
      nameUrdu: 'کمپیوٹر سائنس',
      subjects: 'Computer Science, Math, Physics, English, Analytical',
      color: 'from-purple-600 to-indigo-600',
      badge: 'Trending',
    },
    {
      code: 'MDCAT',
      name: 'PMDC National MDCAT',
      nameUrdu: 'ایم ڈی کیٹ میڈیکل',
      subjects: 'Biology, Chemistry, Physics, English, Logical Reasoning',
      color: 'from-rose-600 to-pink-600',
      badge: 'MBBS / BDS',
    },
    {
      code: 'ECAT',
      name: 'UET Lahore / Punjab',
      nameUrdu: 'ای کیٹ انجینئرنگ',
      subjects: 'Math, Physics, Chemistry / CS, English',
      color: 'from-amber-600 to-orange-600',
      badge: 'Engineering',
    },
    {
      code: 'NUST-NET',
      name: 'NUST Entry Test',
      nameUrdu: 'نسٹ اینٹری ٹیسٹ',
      subjects: 'Math, Physics, Chemistry/CS, English, Intelligence',
      color: 'from-cyan-600 to-blue-700',
      badge: 'NET 1, 2, 3 & 4',
    },
  ];

  const faqs = [
    {
      q: 'What is HEC USAT and who is required to take it?',
      a: 'The Universal Admission Test (USAT) is conducted by the Higher Education Commission (HEC) of Pakistan through the Education Testing Council (ETC). It serves as the standardized undergraduate admission test for universities across Pakistan across disciplines like Engineering (USAT-E), Medical/Allied Health (USAT-M), Computer Science (USAT-CS), General Science (USAT-GS), Commerce, and Arts.',
    },
    {
      q: 'What is the exact paper pattern of USAT 2026?',
      a: 'USAT has a total of 100 marks divided into two parts: Part 1 consists of 75 multiple-choice questions (MCQs) to be solved in 100 minutes. Part 2 consists of an Essay writing test worth 25 marks (400-500 words, English or Urdu) with a time duration of 40 minutes. Qualifying marks are 50/100.',
    },
    {
      q: 'How does the AI Essay Evaluator grade our essays?',
      a: 'Our AI Essay Lab is fine-tuned on the official HEC USAT rubric out of 25 marks (5 core dimensions: Content & Ideas, Structure & Organization, Grammar & Vocabulary, Coherence, and Conclusion). It provides an instant score, points out grammar and syntax flaws, and provides exact rewritten sentence improvements.',
    },
    {
      q: 'Is negative marking applied on PakPrep mock exams?',
      a: 'USAT by HEC currently does not penalize incorrect answers (+1 for correct, 0 for wrong). However, for ECAT, FAST NU, and custom tests where negative marking (e.g. -0.25) is mandatory, PakPrep accurately simulates the exact marking formula with score deductions.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200 dark:border-slate-800 bg-linear-to-b from-blue-50/70 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>
                  {language === 'ur'
                    ? 'ہائیر ایجوکیشن کمیشن (HEC) سلیبس 2026 کے عین مطابق'
                    : 'Aligned with Official HEC ETC 2026 Curriculum'}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {language === 'ur' ? (
                  <>
                    <span className="text-blue-600 dark:text-blue-400">یو ایس اے ٹی</span> اور تمام یونیورسٹی داخلہ ٹیسٹس میں کامیابی یقینی بنائیں
                  </>
                ) : (
                  <>
                    Crack <span className="text-blue-600 dark:text-blue-400">USAT & Entry Tests</span> with AI-Powered Precision.
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                {language === 'ur'
                  ? 'سبجیکٹ وار ایم سی کیو پریکٹس، ریئل ٹائم ٹائمڈ ماک ایگزامز، اور یو ایس اے ٹی پارٹ 2 مضمون نگاری کی فوری اے آئی چیکنگ۔ 15,000 سے زائد سوالات اور جامع تفصیلی حل۔'
                  : 'Master chapter-wise MCQs, simulate full-length computerized entrance exams with negative marking, and get instant HEC rubric grading on your essays.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => onNavigate('practice')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition transform hover:-translate-y-0.5"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>{language === 'ur' ? 'ایم سی کیو پریکٹس شروع کریں' : 'Start Free MCQ Practice'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('mock-tests')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm sm:text-base border border-slate-300 dark:border-slate-700 shadow-sm transition"
                >
                  <FileCheck2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>{language === 'ur' ? 'فل ماک ٹیسٹ دیں' : 'Simulate Mock Exam'}</span>
                </button>

                <button
                  onClick={() => onNavigate('essay-lab')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold text-sm border border-amber-300 dark:border-amber-800/80 transition"
                >
                  <PenTool className="w-4 h-4 text-amber-600" />
                  <span>AI Essay Lab</span>
                </button>
              </div>

              {/* Highlights & Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-center lg:text-left">
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">15,000+</p>
                  <p className="text-xs text-slate-500">Verified MCQs & Formulas</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">98.2%</p>
                  <p className="text-xs text-slate-500">USAT Qualifying Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">30+ Mins</p>
                  <p className="text-xs text-slate-500">Daily Study Streak</p>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive MCQ Tester Widget */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-5 sm:p-6 relative">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Interactive Live Question
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    USAT-E Physics
                  </span>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                    A projectile is launched with speed <span className="font-mono text-blue-600 font-bold">v</span> at an angle of 45° to the horizontal. At the highest point of its trajectory, what is its velocity?
                  </p>

                  <div className="space-y-2">
                    {[
                      { key: 'A', text: 'Zero (0)' },
                      { key: 'B', text: 'v / √2 (Horizontal component only)', correct: true },
                      { key: 'C', text: 'v (Initial speed)' },
                      { key: 'D', text: 'v / 2' },
                    ].map((opt) => {
                      const isSelected = demoSelected === opt.key;
                      let btnStyle = 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50';
                      if (demoChecked) {
                        if (opt.correct) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300';
                        }
                      } else if (isSelected) {
                        btnStyle = 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold';
                      }

                      return (
                        <button
                          key={opt.key}
                          onClick={() => {
                            setDemoSelected(opt.key);
                            setDemoChecked(false);
                          }}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
                              {opt.key}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          {demoChecked && opt.correct && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {!demoChecked ? (
                    <button
                      disabled={!demoSelected}
                      onClick={() => setDemoChecked(true)}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition disabled:opacity-40"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        {demoSelected === 'B' ? '✓ Correct Answer!' : '✗ Option B is correct.'}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 leading-normal">
                        At the peak, vertical velocity <span className="font-mono">v_y = 0</span>. The horizontal velocity remains constant throughout flight: <span className="font-mono">v_x = v cos(45°) = v / √2</span>.
                      </p>
                    </div>
                  )}

                  <div className="pt-2 text-center">
                    <button
                      onClick={() => onNavigate('practice')}
                      className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Practice 500+ more Physics questions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Categories Section */}
      <section className="py-16 bg-white dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {language === 'ur' ? 'داخلہ امتحانات اور سبجیکٹ کیٹیگریز' : 'All Pakistan Admission Tests Covered'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Select your specific engineering, medical, computing, or general aptitude category. Admin configurable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.code}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 shadow-sm hover:shadow-md transition group hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-black text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {cat.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-1">
                    {language === 'ur' ? cat.nameUrdu : cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {cat.subjects}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('practice')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Practice MCQs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('mock-tests')}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                  >
                    Mock Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Pillars: MCQ Practice + Real Exam Simulation + AI Essay Lab */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Smart MCQ Practice</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Filter questions by difficulty (Easy / Medium / Hard) with instant step-by-step reasoning, bookmarking, and automatic addition to your "Mistakes Notebook".
              </p>
              <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Instant or post-test explanation toggle</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Per-question timer to boost speed</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Exam Simulator</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                100% authentic USAT & entry test screen with interactive question palette, answered/unanswered counts, tab-switch cheat alerts, and printable PDF cards.
              </p>
              <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Configurable negative marking (-0.25)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Subject & chapter weak-area diagnostics</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Essay Examiner</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Write English or Urdu essays within a timed 35-minute exam console. Receive instant HEC rubric scores, strengths, mistakes, and sentence rewrites.
              </p>
              <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>5-point rubric evaluated out of 10 & 25</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Full essay evaluation history saved</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Everything you need to know about USAT syllabus, registration, and preparation.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-700/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
