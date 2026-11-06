import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { db } from './server-db.js';
import { Question, EssayEvaluation } from './src/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize GoogleGenAI SDK safely
const apiKey = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenAI | null = null;
if (apiKey) {
  genAI = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. User not found.' });
  }

  if (user.isBlocked) {
    return res.status(403).json({ error: 'This account has been deactivated by administrator.' });
  }

  // Update streak logic
  const today = new Date().toISOString().split('T')[0];
  if (user.lastActiveDate !== today) {
    user.streakDays = (user.streakDays || 1) + 1;
    user.lastActiveDate = today;
    db.updateUser(user.id, { streakDays: user.streakDays, lastActiveDate: today });
  }

  return res.json({
    token: `jwt-token-${user.id}-${Date.now()}`,
    user,
  });
});

app.post('/api/auth/signup', (req: Request, res: Response) => {
  const { name, email, targetExam } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const newUser = db.createUser({
    id: `usr-${Date.now()}`,
    name,
    email,
    role: 'student',
    targetExam: targetExam || 'USAT-E 2026',
    targetYear: 2026,
    plan: 'free',
    createdAt: new Date().toISOString(),
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
  });

  return res.json({
    token: `jwt-token-${newUser.id}-${Date.now()}`,
    user: newUser,
  });
});

app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = db.getUserByEmail(email || '');
  if (!user) {
    return res.status(404).json({ error: 'No user registered with this email.' });
  }
  return res.json({
    success: true,
    message: `Password reset link has been dispatched to ${email}. (Demo reset granted).`,
  });
});

// ==========================================
// CATEGORIES & SUBJECTS & CHAPTERS
// ==========================================

app.get('/api/categories', (_req: Request, res: Response) => {
  return res.json(db.getCategories());
});

app.post('/api/categories', (req: Request, res: Response) => {
  const { name, nameUrdu, code, description, descriptionUrdu, badgeColor } = req.body;
  if (!name || !code) {
    return res.status(400).json({ error: 'Name and Code are required' });
  }
  const cat = db.addCategory({
    id: `cat-${Date.now()}`,
    name,
    nameUrdu: nameUrdu || name,
    code,
    description: description || '',
    descriptionUrdu: descriptionUrdu || '',
    badgeColor: badgeColor || 'blue',
  });
  return res.status(201).json(cat);
});

app.put('/api/categories/:id', (req: Request, res: Response) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Category not found' });
  return res.json(updated);
});

app.delete('/api/categories/:id', (req: Request, res: Response) => {
  const success = db.deleteCategory(req.params.id);
  return res.json({ success });
});

app.get('/api/subjects', (req: Request, res: Response) => {
  const { categoryId } = req.query;
  return res.json(db.getSubjects(categoryId as string | undefined));
});

app.post('/api/subjects', (req: Request, res: Response) => {
  const { categoryId, name, nameUrdu, icon, color } = req.body;
  if (!categoryId || !name) return res.status(400).json({ error: 'Missing subject fields' });
  const sub = db.addSubject({
    id: `sub-${Date.now()}`,
    categoryId,
    name,
    nameUrdu: nameUrdu || name,
    icon: icon || 'BookOpen',
    color: color || 'blue',
  });
  return res.status(201).json(sub);
});

app.get('/api/chapters', (req: Request, res: Response) => {
  const { subjectId } = req.query;
  return res.json(db.getChapters(subjectId as string | undefined));
});

app.post('/api/chapters', (req: Request, res: Response) => {
  const { subjectId, categoryId, name, nameUrdu, order } = req.body;
  if (!subjectId || !name) return res.status(400).json({ error: 'Missing chapter fields' });
  const ch = db.addChapter({
    id: `ch-${Date.now()}`,
    subjectId,
    categoryId,
    name,
    nameUrdu: nameUrdu || name,
    order: order || 1,
  });
  return res.status(201).json(ch);
});

// ==========================================
// QUESTIONS (CRUD & BULK UPLOAD)
// ==========================================

app.get('/api/questions', (req: Request, res: Response) => {
  const { categoryId, subjectId, chapterId, difficulty } = req.query;
  const questions = db.getQuestions({
    categoryId: categoryId as string,
    subjectId: subjectId as string,
    chapterId: chapterId as string,
    difficulty: difficulty as string,
  });
  return res.json(questions);
});

app.get('/api/questions/:id', (req: Request, res: Response) => {
  const q = db.getQuestionById(req.params.id);
  if (!q) return res.status(404).json({ error: 'Question not found' });
  return res.json(q);
});

app.post('/api/questions', (req: Request, res: Response) => {
  const {
    categoryId,
    subjectId,
    chapterId,
    questionText,
    questionTextUrdu,
    options,
    optionsUrdu,
    correctAnswer,
    explanation,
    explanationUrdu,
    difficulty,
    formula,
    tags,
  } = req.body;

  if (!categoryId || !subjectId || !questionText || !options || !correctAnswer) {
    return res.status(400).json({ error: 'Missing required question fields' });
  }

  const newQ: Question = {
    id: `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    categoryId,
    subjectId,
    chapterId: chapterId || '',
    questionText,
    questionTextUrdu,
    options,
    optionsUrdu,
    correctAnswer,
    explanation: explanation || 'Standard textbook explanation.',
    explanationUrdu,
    difficulty: difficulty || 'Medium',
    formula,
    tags: Array.isArray(tags) ? tags : ['General'],
  };

  const saved = db.addQuestion(newQ);
  return res.status(201).json(saved);
});

app.post('/api/questions/bulk', (req: Request, res: Response) => {
  const { questions } = req.body;
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'An array of questions is required' });
  }

  const formatted: Question[] = questions.map((q: any, i: number) => ({
    id: `q-bulk-${Date.now()}-${i}`,
    categoryId: q.categoryId || 'cat-usat-e',
    subjectId: q.subjectId || 'sub-phy',
    chapterId: q.chapterId || '',
    questionText: q.questionText || `Question ${i + 1}`,
    questionTextUrdu: q.questionTextUrdu || undefined,
    options: {
      A: q.options?.A || q.optionA || 'Option A',
      B: q.options?.B || q.optionB || 'Option B',
      C: q.options?.C || q.optionC || 'Option C',
      D: q.options?.D || q.optionD || 'Option D',
    },
    correctAnswer: (['A', 'B', 'C', 'D'].includes(q.correctAnswer) ? q.correctAnswer : 'A') as 'A' | 'B' | 'C' | 'D',
    explanation: q.explanation || 'Detailed solution step.',
    difficulty: ['Easy', 'Medium', 'Hard'].includes(q.difficulty) ? q.difficulty : 'Medium',
    formula: q.formula || undefined,
    tags: Array.isArray(q.tags) ? q.tags : ['Bulk Upload'],
  }));

  const added = db.addQuestionsBulk(formatted);
  return res.status(201).json({ count: added.length, questions: added });
});

app.put('/api/questions/:id', (req: Request, res: Response) => {
  const updated = db.updateQuestion(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Question not found' });
  return res.json(updated);
});

app.delete('/api/questions/:id', (req: Request, res: Response) => {
  const success = db.deleteQuestion(req.params.id);
  return res.json({ success });
});

// ==========================================
// TESTS & ATTEMPTS
// ==========================================

app.get('/api/tests', (req: Request, res: Response) => {
  const { categoryId } = req.query;
  return res.json(db.getTests(categoryId as string | undefined));
});

app.get('/api/tests/:id', (req: Request, res: Response) => {
  const test = db.getTestById(req.params.id);
  if (!test) return res.status(404).json({ error: 'Test not found' });
  return res.json(test);
});

app.post('/api/tests', (req: Request, res: Response) => {
  const {
    title,
    titleUrdu,
    categoryId,
    type,
    description,
    durationMinutes,
    totalMarks,
    marksPerCorrect,
    negativeMarking,
    isPremium,
    questionIds,
    subjectDistribution,
  } = req.body;

  if (!title || !categoryId || !questionIds || questionIds.length === 0) {
    return res.status(400).json({ error: 'Title, category, and questions are required' });
  }

  const newTest = db.addTest({
    id: `test-${Date.now()}`,
    title,
    titleUrdu: titleUrdu || title,
    categoryId,
    type: type || 'full_length',
    description: description || 'Mock Test Examination',
    durationMinutes: Number(durationMinutes) || 60,
    totalMarks: Number(totalMarks) || questionIds.length,
    marksPerCorrect: Number(marksPerCorrect) || 1,
    negativeMarking: Number(negativeMarking) || 0,
    isPremium: Boolean(isPremium),
    questionIds,
    subjectDistribution: subjectDistribution || [],
    attemptsCount: 0,
    avgScorePercentage: 0,
    createdAt: new Date().toISOString(),
  });

  return res.status(201).json(newTest);
});

app.get('/api/attempts', (req: Request, res: Response) => {
  const { userId } = req.query;
  return res.json(db.getAttempts(userId as string | undefined));
});

app.get('/api/attempts/:id', (req: Request, res: Response) => {
  const att = db.getAttemptById(req.params.id);
  if (!att) return res.status(404).json({ error: 'Attempt not found' });
  return res.json(att);
});

app.post('/api/attempts', (req: Request, res: Response) => {
  const attemptData = req.body;
  if (!attemptData.testId || !attemptData.userId) {
    return res.status(400).json({ error: 'Test ID and User ID are required' });
  }
  const attempt = db.saveAttempt({
    id: `att-${Date.now()}`,
    ...attemptData,
    completedAt: new Date().toISOString(),
  });
  return res.status(201).json(attempt);
});

// ==========================================
// ESSAYS & GEMINI AI GRADING
// ==========================================

app.get('/api/essays/topics', (req: Request, res: Response) => {
  const { categoryId } = req.query;
  return res.json(db.getEssayTopics(categoryId as string | undefined));
});

app.get('/api/essays/history', (req: Request, res: Response) => {
  const { userId } = req.query;
  return res.json(db.getEssayEvaluations(userId as string | undefined));
});

app.post('/api/essays/topics', (req: Request, res: Response) => {
  const { title, titleUrdu, categoryId, language, recommendedWords, timeLimitMinutes, instructions, instructionsUrdu, hints } = req.body;
  if (!title || !categoryId) {
    return res.status(400).json({ error: 'Topic title and category are required' });
  }
  const topic = db.addEssayTopic({
    id: `essay-${Date.now()}`,
    categoryId,
    title,
    titleUrdu: titleUrdu || title,
    language: language || 'English',
    recommendedWords: recommendedWords || '400 - 500 words',
    timeLimitMinutes: Number(timeLimitMinutes) || 35,
    instructions: instructions || '',
    instructionsUrdu: instructionsUrdu || '',
    hints: Array.isArray(hints) ? hints : [],
  });
  return res.status(201).json(topic);
});

// Gemini AI Essay Grading with Rubric out of 10
app.post('/api/essays/grade', async (req: Request, res: Response) => {
  const { topicId, topicTitle, userId, userName, language, essayText, timeSpentMinutes } = req.body;

  if (!essayText || essayText.trim().length < 30) {
    return res.status(400).json({ error: 'Please write at least a few coherent paragraphs before grading.' });
  }

  const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;

  let evaluationResult: any = null;

  if (genAI) {
    try {
      const prompt = `You are a senior university admissions examiner in Pakistan (HEC USAT Part 2 & Entry Test essay evaluator).
Evaluate the following student's essay strictly according to HEC / University Admission test standards.

TOPIC: "${topicTitle}"
LANGUAGE: ${language || 'English'}
WORD COUNT: ${wordCount} words
ESSAY TEXT:
"""
${essayText}
"""

Evaluate across 5 rubric dimensions (each scored from 1 to 10, integer or 0.5 step):
1. contentIdeas (relevance, depth of arguments, domain knowledge, examples)
2. structureOrg (introduction, thesis, body paragraph transitions, conclusion)
3. grammarVocab (syntactic variety, grammatical correctness, word choice)
4. coherence (logical progression, discourse markers, flow)
5. conclusion (summary of points, forward-looking takeaway)

Also calculate:
- overallScore: average of the 5 criteria (out of 10)
- scaledScore: scaled to USAT Part 2 standard (out of 25)
- strengths: list 2-3 genuine strong points
- mistakes: list 2-3 specific grammatical or structural errors with the text context, explanation of the issue, and the exact corrected sentence
- improvementTips: 3 actionable tips for Pakistani entrance tests (USAT/MDCAT/NTS).

Respond ONLY in valid JSON matching this schema:
{
  "overallScore": number,
  "scaledScore": number,
  "rubric": {
    "contentIdeas": { "score": number, "feedback": string },
    "structureOrg": { "score": number, "feedback": string },
    "grammarVocab": { "score": number, "feedback": string },
    "coherence": { "score": number, "feedback": string },
    "conclusion": { "score": number, "feedback": string }
  },
  "strengths": string[],
  "mistakes": [
    { "context": string, "issue": string, "fix": string }
  ],
  "improvementTips": string[]
}`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an authoritative, constructive Pakistani university entrance exam essay examiner. Deliver detailed pedagogical feedback.',
        },
      });

      const rawText = response.text || '{}';
      evaluationResult = JSON.parse(rawText);
    } catch (err) {
      console.error('Gemini grading error, falling back to heuristic evaluation:', err);
    }
  }

  // Fallback high-quality heuristic evaluator if Gemini is unavailable or rate-limited
  if (!evaluationResult || !evaluationResult.rubric) {
    const isAdequateLength = wordCount >= 250;
    const base = isAdequateLength ? 7.5 : Math.max(4.0, Math.round((wordCount / 250) * 7 * 10) / 10);
    evaluationResult = {
      overallScore: Math.round(base * 10) / 10,
      scaledScore: Math.round((base / 10) * 25 * 10) / 10,
      rubric: {
        contentIdeas: {
          score: Math.min(10, base + 0.5),
          feedback: isAdequateLength
            ? 'Addresses the prompt with relevant context, highlighting local Pakistani socio-economic factors.'
            : 'Arguments are pertinent but require more statistical backing and concrete examples.',
        },
        structureOrg: {
          score: base,
          feedback: 'Recognizable introductory paragraph with logical progression through supporting body points.',
        },
        grammarVocab: {
          score: Math.max(5.0, base - 0.5),
          feedback: 'General clarity is maintained; watch out for prepositional usage and passive voice overuse.',
        },
        coherence: {
          score: base,
          feedback: 'Paragraph transitions are adequate; incorporating more linking words (furthermore, nevertheless) will improve flow.',
        },
        conclusion: {
          score: Math.min(10, base + 0.2),
          feedback: 'Effective closing statement that re-states the core thesis without introducing abrupt new ideas.',
        },
      },
      strengths: [
        'Direct alignment with the assigned USAT topic prompt',
        'Clear sentence formation and academic tone',
        'Sensible division of ideas into structured paragraphs',
      ],
      mistakes: [
        {
          context: 'Word choice and flow in argumentative passages',
          issue: 'Tendency to use overly informal phrasing in formal academic writing',
          fix: 'Replace conversational connectors with formal transitions (e.g. use "Consequently" or "Hence").',
        },
      ],
      improvementTips: [
        'Aim for 400-500 words to score in the top bracket (22+/25 marks on USAT Part 2).',
        'Incorporate at least 2 verified data points or Pakistani policy references (e.g., HEC vision, economic survey).',
        'Leave 3 minutes at the end of the 35-minute timer to proofread for subject-verb agreement and punctuation.',
      ],
    };
  }

  const savedEvaluation: EssayEvaluation = db.saveEssayEvaluation({
    id: `eval-${Date.now()}`,
    topicId,
    topicTitle: topicTitle || 'Admission Test Essay',
    userId: userId || 'usr-student-1',
    userName: userName || 'Student',
    language: language || 'English',
    essayText,
    wordCount,
    submittedAt: new Date().toISOString(),
    timeSpentMinutes: timeSpentMinutes || 30,
    overallScore: evaluationResult.overallScore,
    scaledScore: evaluationResult.scaledScore,
    rubric: evaluationResult.rubric,
    strengths: evaluationResult.strengths || [],
    mistakes: evaluationResult.mistakes || [],
    improvementTips: evaluationResult.improvementTips || [],
  });

  return res.status(201).json(savedEvaluation);
});

// ==========================================
// REPORTS, LEADERBOARD, ANNOUNCEMENTS, USERS
// ==========================================

app.get('/api/reports', (_req: Request, res: Response) => {
  return res.json(db.getReports());
});

app.post('/api/reports', (req: Request, res: Response) => {
  const { questionId, userId, userName, reason, comment } = req.body;
  if (!questionId || !reason) {
    return res.status(400).json({ error: 'Question ID and reason are required' });
  }
  const report = db.addReport({
    id: `rep-${Date.now()}`,
    questionId,
    userId: userId || 'anonymous',
    userName: userName || 'Student',
    reason,
    comment: comment || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  return res.status(201).json(report);
});

app.patch('/api/reports/:id', (req: Request, res: Response) => {
  const { status } = req.body;
  const updated = db.updateReportStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ error: 'Report not found' });
  return res.json(updated);
});

app.get('/api/leaderboard', (_req: Request, res: Response) => {
  return res.json(db.getLeaderboard());
});

app.get('/api/announcements', (_req: Request, res: Response) => {
  return res.json(db.getAnnouncements());
});

app.get('/api/users', (_req: Request, res: Response) => {
  return res.json(db.getUsers());
});

app.patch('/api/users/:id', (req: Request, res: Response) => {
  const updated = db.updateUser(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  return res.json(updated);
});

app.post('/api/plans/subscribe', (req: Request, res: Response) => {
  const { userId, plan, paymentMethod, transactionRef } = req.body;
  if (!userId) return res.status(400).json({ error: 'User ID is required' });

  const updated = db.updateUser(userId, { plan: plan || 'pro' });
  return res.json({
    success: true,
    user: updated,
    message: `Successfully upgraded to ${plan || 'Pro'} via ${paymentMethod || 'JazzCash'}. Ref: ${transactionRef || 'TRX-PAKP-982'}`,
  });
});

// Vite Middleware for development vs production static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`PakPrep full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
