import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Database,
  PlusCircle,
  UploadCloud,
  FileCheck2,
  Users,
  Flag,
  Trash2,
  Edit2,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  AlertCircle,
  Eye,
  PenTool,
  Search,
} from 'lucide-react';
import { api } from '../services/api.js';
import {
  Category,
  Subject,
  Chapter,
  Question,
  MockTest,
  User,
  QuestionReport,
  EssayTopic,
} from '../types.js';
import { LatexMath } from '../components/LatexMath.js';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'questions' | 'bulk' | 'tests' | 'categories' | 'essays' | 'reports' | 'users'
  >('questions');

  // Entities
  const [categories, setCategories] = useState<Category[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tests, setTests] = useState<MockTest[]>([]);
  const [reports, setReports] = useState<QuestionReport[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [essayTopics, setEssayTopics] = useState<EssayTopic[]>([]);

  // Filter / Search for questions
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat] = useState('');

  // Modals / Form States
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddEssayModal, setShowAddEssayModal] = useState(false);

  // New Question Form state
  const [newQ, setNewQ] = useState({
    categoryId: '',
    subjectId: '',
    chapterId: '',
    questionText: '',
    questionTextUrdu: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A' as 'A' | 'B' | 'C' | 'D',
    explanation: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    formula: '',
    tags: 'USAT-E, Physics',
  });

  // Bulk Upload Form state
  const [csvText, setCsvText] = useState('');
  const [bulkCategory, setBulkCategory] = useState('');
  const [bulkSubject, setBulkSubject] = useState('');
  const [bulkStatus, setBulkStatus] = useState<string | null>(null);

  // New Mock Test Form state
  const [newTest, setNewTest] = useState({
    title: '',
    titleUrdu: '',
    categoryId: '',
    type: 'full_length' as 'full_length' | 'subject_wise',
    description: '',
    durationMinutes: 60,
    totalMarks: 30,
    marksPerCorrect: 1,
    negativeMarking: 0,
    isPremium: false,
    selectedQuestionIds: [] as string[],
  });

  // New Category Form state
  const [newCat, setNewCat] = useState({
    code: '',
    name: '',
    nameUrdu: '',
    description: '',
    badgeColor: 'blue',
  });

  // New Essay Topic Form state
  const [newEssay, setNewEssay] = useState({
    title: '',
    titleUrdu: '',
    categoryId: '',
    language: 'English' as 'English' | 'Urdu' | 'Both',
    recommendedWords: '400 - 500 words',
    timeLimitMinutes: 35,
    instructions: '',
    hints: '',
  });

  const [loading, setLoading] = useState(true);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [cats, subs, chaps, qs, testList, repList, usrList, essays] = await Promise.all([
        api.getCategories(),
        api.getSubjects(),
        api.getChapters(),
        api.getQuestions(),
        api.getTests(),
        api.getReports(),
        api.getUsers(),
        api.getEssayTopics(),
      ]);

      setCategories(cats);
      setSubjects(subs);
      setChapters(chaps);
      setQuestions(qs);
      setTests(testList);
      setReports(repList);
      setUsers(usrList);
      setEssayTopics(essays);

      if (cats.length > 0) {
        setNewQ((prev) => ({ ...prev, categoryId: cats[0].id }));
        setBulkCategory(cats[0].id);
        setNewTest((prev) => ({ ...prev, categoryId: cats[0].id }));
        setNewEssay((prev) => ({ ...prev, categoryId: cats[0].id }));
      }
      if (subs.length > 0) {
        setNewQ((prev) => ({ ...prev, subjectId: subs[0].id }));
        setBulkSubject(subs[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Question creation
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createQuestion({
        categoryId: newQ.categoryId || categories[0]?.id,
        subjectId: newQ.subjectId || subjects[0]?.id,
        chapterId: newQ.chapterId || chapters[0]?.id,
        questionText: newQ.questionText,
        questionTextUrdu: newQ.questionTextUrdu || undefined,
        options: {
          A: newQ.optionA,
          B: newQ.optionB,
          C: newQ.optionC,
          D: newQ.optionD,
        },
        correctAnswer: newQ.correctAnswer,
        explanation: newQ.explanation,
        difficulty: newQ.difficulty,
        formula: newQ.formula || undefined,
        tags: newQ.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });

      setQuestions((prev) => [created, ...prev]);
      setShowAddQuestionModal(false);
      setNewQ({
        categoryId: categories[0]?.id || '',
        subjectId: subjects[0]?.id || '',
        chapterId: '',
        questionText: '',
        questionTextUrdu: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        explanation: '',
        difficulty: 'Medium',
        formula: '',
        tags: 'USAT-E, Physics',
      });
    } catch (err: any) {
      alert(err.message || 'Failed to create question');
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this question?')) return;
    await api.deleteQuestion(id);
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Bulk CSV Upload
  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setBulkStatus('Parsing CSV text...');

    try {
      const lines = csvText.trim().split('\n');
      if (lines.length === 0) throw new Error('Empty CSV data');

      const parsedQuestions: any[] = [];
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));

        if (cols.length >= 6) {
          parsedQuestions.push({
            categoryId: bulkCategory || 'cat-usat-e',
            subjectId: bulkSubject || 'sub-phy',
            questionText: cols[0],
            optionA: cols[1],
            optionB: cols[2],
            optionC: cols[3],
            optionD: cols[4],
            correctAnswer: (cols[5] || 'A').toUpperCase(),
            explanation: cols[6] || 'Textbook verification step.',
            difficulty: cols[7] || 'Medium',
          });
        }
      }

      if (parsedQuestions.length === 0) {
        throw new Error('Could not parse any valid rows. Please check CSV format.');
      }

      const res = await api.bulkUploadQuestions(parsedQuestions);
      setBulkStatus(`Successfully uploaded ${res.count} questions into Question Bank!`);
      setQuestions((prev) => [...res.questions, ...prev]);
      setCsvText('');
    } catch (err: any) {
      setBulkStatus(`Error: ${err.message}`);
    }
  };

  // Download Sample CSV template
  const handleDownloadTemplate = () => {
    const template = `questionText,optionA,optionB,optionC,optionD,correctAnswer,explanation,difficulty
"What is the SI unit of electric flux?","Volt-meter","Newton-meter","Tesla","Ohm",A,"Electric flux is phi = E . A = (V/m) * m^2 = Volt-meter",Easy
"Which organelle synthesizes ATP via oxidative phosphorylation?","Ribosome","Mitochondria","Lysosome","Golgi",B,"Mitochondria produces ATP",Medium`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pakprep_mcq_upload_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Save new Mock Test
  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const qIds =
        newTest.selectedQuestionIds.length > 0
          ? newTest.selectedQuestionIds
          : questions.slice(0, newTest.totalMarks).map((q) => q.id);

      const created = await api.createTest({
        title: newTest.title,
        titleUrdu: newTest.titleUrdu || newTest.title,
        categoryId: newTest.categoryId || categories[0]?.id,
        type: newTest.type,
        description: newTest.description || 'Full-Length Simulation Exam',
        durationMinutes: Number(newTest.durationMinutes),
        totalMarks: Number(newTest.totalMarks),
        marksPerCorrect: Number(newTest.marksPerCorrect),
        negativeMarking: Number(newTest.negativeMarking),
        isPremium: Boolean(newTest.isPremium),
        questionIds: qIds,
      });

      setTests((prev) => [created, ...prev]);
      setShowAddTestModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create test');
    }
  };

  // Category addition
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createCategory({
        code: newCat.code,
        name: newCat.name,
        nameUrdu: newCat.nameUrdu || newCat.name,
        description: newCat.description,
        badgeColor: newCat.badgeColor,
      });
      setCategories((prev) => [...prev, created]);
      setShowAddCategoryModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Essay topic addition
  const handleSaveEssayTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createEssayTopic({
        title: newEssay.title,
        titleUrdu: newEssay.titleUrdu || newEssay.title,
        categoryId: newEssay.categoryId || categories[0]?.id,
        language: newEssay.language,
        recommendedWords: newEssay.recommendedWords,
        timeLimitMinutes: Number(newEssay.timeLimitMinutes),
        instructions: newEssay.instructions,
        hints: newEssay.hints.split('\n').filter(Boolean),
      });
      setEssayTopics((prev) => [created, ...prev]);
      setShowAddEssayModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Resolve question report
  const handleResolveReport = async (id: string) => {
    await api.updateReportStatus(id, 'resolved');
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r))
    );
  };

  // Toggle user block / role
  const handleToggleUserStatus = async (u: User) => {
    const updated = await api.updateUser(u.id, { isBlocked: !u.isBlocked });
    setUsers((prev) => prev.map((item) => (item.id === u.id ? updated : item)));
  };

  const handleToggleUserRole = async (u: User) => {
    const nextRole = u.role === 'admin' ? 'student' : 'admin';
    const updated = await api.updateUser(u.id, { role: nextRole });
    setUsers((prev) => prev.map((item) => (item.id === u.id ? updated : item)));
  };

  const filteredQuestions = questions.filter((q) => {
    if (filterCat && q.categoryId !== filterCat) return false;
    if (
      searchQuery &&
      !q.questionText.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>PakPrep Administration Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Content, Tests & User Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Full control over exam questions, CSV bulk upload, syllabus structure, and student reports.
          </p>
        </div>

        {/* Quick Analytics Counters */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold">
            {questions.length} Questions
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold">
            {tests.length} Mock Tests
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold">
            {users.length} Users
          </div>
        </div>
      </div>

      {/* Admin Sub-Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold scrollbar-none">
        {[
          { id: 'questions', label: `Question Bank (${questions.length})`, icon: Database },
          { id: 'bulk', label: 'CSV Bulk Upload', icon: UploadCloud },
          { id: 'tests', label: `Mock Tests (${tests.length})`, icon: FileCheck2 },
          { id: 'categories', label: `Categories & Syllabus`, icon: Database },
          { id: 'essays', label: `Essay Topics (${essayTopics.length})`, icon: PenTool },
          { id: 'reports', label: `Student Reports (${reports.filter((r) => r.status === 'pending').length} New)`, icon: Flag },
          { id: 'users', label: `User Directory (${users.length})`, icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: QUESTIONS BANK */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search questions by keyword or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-hidden"
                />
              </div>

              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-hidden"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAddQuestionModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition self-start sm:self-center"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Single Question</span>
            </button>
          </div>

          {/* Questions Table */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Question & Formula</th>
                    <th className="p-3.5">Category / Subject</th>
                    <th className="p-3.5">Difficulty</th>
                    <th className="p-3.5">Answer</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredQuestions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 max-w-md">
                        <p className="font-bold text-slate-900 dark:text-white line-clamp-2">
                          {q.questionText}
                        </p>
                        {q.formula && <LatexMath formula={q.formula} inline />}
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-blue-600 dark:text-blue-400 block">
                          {q.categoryId.replace('cat-', '').toUpperCase()}
                        </span>
                        <span className="text-[11px] text-slate-400">{q.subjectId}</span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            q.difficulty === 'Easy'
                              ? 'bg-emerald-100 text-emerald-800'
                              : q.difficulty === 'Medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-emerald-600">
                        Option {q.correctAnswer}
                      </td>
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BULK CSV UPLOAD */}
      {activeTab === 'bulk' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Bulk Question Ingestion
              </h3>
              <p className="text-xs text-slate-500">
                Paste comma-separated questions or load from our verified Excel/CSV template.
              </p>
            </div>

            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Download CSV Template</span>
            </button>
          </div>

          <form onSubmit={handleBulkUpload} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assign to Category
                </label>
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-hidden"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assign to Subject
                </label>
                <select
                  value={bulkSubject}
                  onChange={(e) => setBulkSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-hidden"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.categoryId})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                CSV Data (Headers: questionText, optionA, optionB, optionC, optionD, correctAnswer, explanation, difficulty)
              </label>
              <textarea
                rows={8}
                required
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder={`"What is Newton's third law?","Action = Reaction","F = ma","Inertia","Gravitation",A,"Forces occur in equal and opposite pairs",Easy\n"What is the charge on an electron?","-1.6 x 10^-19 C","+1.6 x 10^-19 C","0 C","1 C",A,"Standard fundamental charge",Medium`}
                className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-900 dark:text-white outline-hidden"
              />
            </div>

            {bulkStatus && (
              <div
                className={`p-3 rounded-xl text-xs font-bold ${
                  bulkStatus.startsWith('Error')
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {bulkStatus}
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
            >
              Parse & Ingest Questions
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: MOCK TESTS */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Scheduled Simulation Exams
            </h3>
            <button
              onClick={() => setShowAddTestModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Mock Exam</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 uppercase">
                    {t.categoryId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      t.isPremium
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {t.isPremium ? 'Pro Locked' : 'Free Exam'}
                  </span>
                </div>

                <h4 className="font-black text-sm text-slate-900 dark:text-white">{t.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{t.description}</p>

                <div className="grid grid-cols-3 gap-2 text-[11px] p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="text-slate-400 block">Questions:</span>
                    <strong className="text-slate-900 dark:text-white">{t.questionIds.length}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Duration:</span>
                    <strong className="text-slate-900 dark:text-white">{t.durationMinutes}m</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Attempts:</span>
                    <strong className="text-blue-600 font-bold">{t.attemptsCount}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CATEGORIES & SYLLABUS */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Test Categories & USAT Variants
            </h3>
            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Entrance Test Variant</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-black text-base text-blue-600">{c.code}</span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold">
                    ID: {c.id}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{c.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ESSAYS TOPICS */}
      {activeTab === 'essays' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              USAT Part 2 Essay Topic Bank
            </h3>
            <button
              onClick={() => setShowAddEssayModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Essay Topic</span>
            </button>
          </div>

          <div className="space-y-3">
            {essayTopics.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-amber-100 text-amber-800">
                      {item.language}
                    </span>
                    <span className="text-xs text-slate-400">{item.recommendedWords} · {item.timeLimitMinutes} mins</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{item.instructions}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: STUDENT REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Student Question Flags & Feedback
          </h3>

          {reports.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-2xl border">
              No reported errors pending review.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        {rep.reason.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        From: {rep.userName}
                      </span>
                      <span className="text-[11px] text-slate-400">Question ID: {rep.questionId}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">"{rep.comment}"</p>
                  </div>

                  {rep.status === 'pending' ? (
                    <button
                      onClick={() => handleResolveReport(rep.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shrink-0"
                    >
                      Mark Resolved
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-600 font-bold shrink-0">✓ Resolved</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Registered Student & Staff Accounts
          </h3>

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3.5">Candidate</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Target Exam</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Plan</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="p-3.5 text-slate-500">{u.email}</td>
                    <td className="p-3.5 font-semibold text-blue-600">{u.targetExam}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.plan === 'pro'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {u.plan}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleToggleUserRole(u)}
                        className="text-xs text-blue-600 hover:underline font-bold"
                      >
                        Switch Role
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(u)}
                        className={`text-xs font-bold hover:underline ${
                          u.isBlocked ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Single Question */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4">
            <h3 className="font-black text-lg text-slate-900 dark:text-white">
              Add New Question with LaTeX & Options
            </h3>

            <form onSubmit={handleSaveQuestion} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newQ.categoryId}
                    onChange={(e) => setNewQ({ ...newQ, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={newQ.subjectId}
                    onChange={(e) => setNewQ({ ...newQ, subjectId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Question Text (English)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. What is the value of gravitational acceleration at the center of the Earth?"
                  value={newQ.questionText}
                  onChange={(e) => setNewQ({ ...newQ, questionText: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Optional Formula (LaTeX, e.g. R = \sqrt(A² + B²))
                </label>
                <input
                  type="text"
                  placeholder="e.g. g = 0 m/s^2"
                  value={newQ.formula}
                  onChange={(e) => setNewQ({ ...newQ, formula: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden font-mono"
                />
                {newQ.formula && <LatexMath formula={newQ.formula} />}
              </div>

              {/* 4 Options */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Option A</label>
                  <input
                    type="text"
                    required
                    value={newQ.optionA}
                    onChange={(e) => setNewQ({ ...newQ, optionA: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Option B</label>
                  <input
                    type="text"
                    required
                    value={newQ.optionB}
                    onChange={(e) => setNewQ({ ...newQ, optionB: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Option C</label>
                  <input
                    type="text"
                    required
                    value={newQ.optionC}
                    onChange={(e) => setNewQ({ ...newQ, optionC: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Option D</label>
                  <input
                    type="text"
                    required
                    value={newQ.optionD}
                    onChange={(e) => setNewQ({ ...newQ, optionD: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Correct Answer</label>
                  <select
                    value={newQ.correctAnswer}
                    onChange={(e) => setNewQ({ ...newQ, correctAnswer: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Difficulty</label>
                  <select
                    value={newQ.difficulty}
                    onChange={(e) => setNewQ({ ...newQ, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Detailed Explanation & Solution</label>
                <textarea
                  rows={2}
                  required
                  value={newQ.explanation}
                  onChange={(e) => setNewQ({ ...newQ, explanation: e.target.value })}
                  placeholder="Explain why the answer is correct for the student result review..."
                  className="w-full p-2.5 rounded-xl border bg-white dark:bg-slate-800"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="flex-1 py-2.5 rounded-xl border font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Mock Test */}
      {showAddTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border p-6 space-y-4 text-xs">
            <h3 className="font-black text-base">Schedule New Entrance Mock Exam</h3>
            <form onSubmit={handleSaveTest} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Test Title</label>
                <input
                  type="text"
                  required
                  placeholder="USAT-E Mock Simulation Exam 2"
                  value={newTest.title}
                  onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Category</label>
                <select
                  value={newTest.categoryId}
                  onChange={(e) => setNewTest({ ...newTest, categoryId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={newTest.durationMinutes}
                    onChange={(e) => setNewTest({ ...newTest, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Negative Marking</label>
                  <select
                    value={newTest.negativeMarking}
                    onChange={(e) => setNewTest({ ...newTest, negativeMarking: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800"
                  >
                    <option value={0}>0 (No Penalty)</option>
                    <option value={0.25}>-0.25 Marks</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="premium-toggle"
                  checked={newTest.isPremium}
                  onChange={(e) => setNewTest({ ...newTest, isPremium: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="premium-toggle" className="font-bold">
                  Mark as Premium (USAT Pro Pass Required)
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTestModal(false)}
                  className="flex-1 py-2.5 rounded-xl border font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Create Mock Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Category */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border p-6 space-y-4 text-xs">
            <h3 className="font-black text-base">Add New Admission Test Variant</h3>
            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Code (e.g. GIKI-ET, USAT-Arts)</label>
                <input
                  type="text"
                  required
                  placeholder="GIKI-ET"
                  value={newCat.code}
                  onChange={(e) => setNewCat({ ...newCat, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Name</label>
                <input
                  type="text"
                  required
                  placeholder="GIKI Engineering Entrance Test"
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newCat.description}
                  onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-800"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="flex-1 py-2.5 rounded-xl border font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Essay Topic */}
      {showAddEssayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border p-6 space-y-4 text-xs">
            <h3 className="font-black text-base">Add New Essay Topic</h3>
            <form onSubmit={handleSaveEssayTopic} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Topic Title</label>
                <input
                  type="text"
                  required
                  value={newEssay.title}
                  onChange={(e) => setNewEssay({ ...newEssay, title: e.target.value })}
                  placeholder="Renewable Energy Transition in Pakistan"
                  className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Language</label>
                  <select
                    value={newEssay.language}
                    onChange={(e) => setNewEssay({ ...newEssay, language: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800"
                  >
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Both">Both (English / Urdu)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Time Limit (Mins)</label>
                  <input
                    type="number"
                    value={newEssay.timeLimitMinutes}
                    onChange={(e) => setNewEssay({ ...newEssay, timeLimitMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Instructions</label>
                <textarea
                  rows={2}
                  value={newEssay.instructions}
                  onChange={(e) => setNewEssay({ ...newEssay, instructions: e.target.value })}
                  placeholder="Outline key economic and environmental arguments..."
                  className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-800"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEssayModal(false)}
                  className="flex-1 py-2.5 rounded-xl border font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Save Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
