import {
  User,
  Category,
  Subject,
  Chapter,
  Question,
  MockTest,
  TestAttempt,
  EssayTopic,
  EssayEvaluation,
  QuestionReport,
  LeaderboardEntry,
} from '../types.js';

const API_BASE = '/api';

export const api = {
  // Auth
  async login(email: string, password?: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async signup(name: string, email: string, targetExam: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, targetExam }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Signup failed');
    }
    return res.json();
  },

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  // Categories & Subjects & Chapters
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },

  async createCategory(cat: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat),
    });
    return res.json();
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async getSubjects(categoryId?: string): Promise<Subject[]> {
    const url = categoryId ? `${API_BASE}/subjects?categoryId=${categoryId}` : `${API_BASE}/subjects`;
    const res = await fetch(url);
    return res.json();
  },

  async createSubject(sub: Partial<Subject>): Promise<Subject> {
    const res = await fetch(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub),
    });
    return res.json();
  },

  async getChapters(subjectId?: string): Promise<Chapter[]> {
    const url = subjectId ? `${API_BASE}/chapters?subjectId=${subjectId}` : `${API_BASE}/chapters`;
    const res = await fetch(url);
    return res.json();
  },

  async createChapter(ch: Partial<Chapter>): Promise<Chapter> {
    const res = await fetch(`${API_BASE}/chapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ch),
    });
    return res.json();
  },

  // Questions
  async getQuestions(filters?: {
    categoryId?: string;
    subjectId?: string;
    chapterId?: string;
    difficulty?: string;
  }): Promise<Question[]> {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.subjectId) params.append('subjectId', filters.subjectId);
    if (filters?.chapterId) params.append('chapterId', filters.chapterId);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);

    const res = await fetch(`${API_BASE}/questions?${params.toString()}`);
    return res.json();
  },

  async createQuestion(q: Partial<Question>): Promise<Question> {
    const res = await fetch(`${API_BASE}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(q),
    });
    return res.json();
  },

  async bulkUploadQuestions(questions: any[]): Promise<{ count: number; questions: Question[] }> {
    const res = await fetch(`${API_BASE}/questions/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions }),
    });
    return res.json();
  },

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question> {
    const res = await fetch(`${API_BASE}/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async deleteQuestion(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/questions/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Tests & Attempts
  async getTests(categoryId?: string): Promise<MockTest[]> {
    const url = categoryId ? `${API_BASE}/tests?categoryId=${categoryId}` : `${API_BASE}/tests`;
    const res = await fetch(url);
    return res.json();
  },

  async getTestById(id: string): Promise<MockTest> {
    const res = await fetch(`${API_BASE}/tests/${id}`);
    return res.json();
  },

  async createTest(test: Partial<MockTest>): Promise<MockTest> {
    const res = await fetch(`${API_BASE}/tests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(test),
    });
    return res.json();
  },

  async getAttempts(userId?: string): Promise<TestAttempt[]> {
    const url = userId ? `${API_BASE}/attempts?userId=${userId}` : `${API_BASE}/attempts`;
    const res = await fetch(url);
    return res.json();
  },

  async getAttemptById(id: string): Promise<TestAttempt> {
    const res = await fetch(`${API_BASE}/attempts/${id}`);
    return res.json();
  },

  async saveAttempt(attempt: Partial<TestAttempt>): Promise<TestAttempt> {
    const res = await fetch(`${API_BASE}/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attempt),
    });
    return res.json();
  },

  // Essays
  async getEssayTopics(categoryId?: string): Promise<EssayTopic[]> {
    const url = categoryId ? `${API_BASE}/essays/topics?categoryId=${categoryId}` : `${API_BASE}/essays/topics`;
    const res = await fetch(url);
    return res.json();
  },

  async createEssayTopic(topic: Partial<EssayTopic>): Promise<EssayTopic> {
    const res = await fetch(`${API_BASE}/essays/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topic),
    });
    return res.json();
  },

  async gradeEssay(data: {
    topicId: string;
    topicTitle: string;
    userId: string;
    userName: string;
    language: 'English' | 'Urdu';
    essayText: string;
    timeSpentMinutes: number;
  }): Promise<EssayEvaluation> {
    const res = await fetch(`${API_BASE}/essays/grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to grade essay');
    }
    return res.json();
  },

  async getEssayHistory(userId?: string): Promise<EssayEvaluation[]> {
    const url = userId ? `${API_BASE}/essays/history?userId=${userId}` : `${API_BASE}/essays/history`;
    const res = await fetch(url);
    return res.json();
  },

  // Reports
  async getReports(): Promise<QuestionReport[]> {
    const res = await fetch(`${API_BASE}/reports`);
    return res.json();
  },

  async reportQuestion(data: {
    questionId: string;
    userId: string;
    userName: string;
    reason: string;
    comment: string;
  }): Promise<QuestionReport> {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateReportStatus(id: string, status: 'resolved' | 'dismissed'): Promise<QuestionReport> {
    const res = await fetch(`${API_BASE}/reports/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Leaderboard & Announcements & Users & Plans
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const res = await fetch(`${API_BASE}/leaderboard`);
    return res.json();
  },

  async getAnnouncements(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/announcements`);
    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`);
    return res.json();
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async subscribePlan(data: {
    userId: string;
    plan: 'free' | 'pro';
    paymentMethod: string;
    transactionRef: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/plans/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
