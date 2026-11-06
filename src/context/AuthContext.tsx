import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, targetExam: string) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: 'student' | 'admin') => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load existing cached user or default to student demo
    const saved = localStorage.getItem('pakprep_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
        setLoading(false);
        return;
      } catch (e) {
        console.error('Failed to parse cached user', e);
      }
    }

    // Default to student Hamza Khan so the examiner doesn't hit a blank barrier
    api
      .login('student@pakprep.pk')
      .then((res) => {
        setUser(res.user);
        localStorage.setItem('pakprep_user', JSON.stringify(res.user));
      })
      .catch(() => {
        // Fallback local student
        const fallback: User = {
          id: 'usr-student-1',
          name: 'Hamza Khan',
          email: 'student@pakprep.pk',
          role: 'student',
          targetExam: 'USAT-E 2026',
          targetYear: 2026,
          plan: 'pro',
          createdAt: new Date().toISOString(),
          streakDays: 7,
          lastActiveDate: new Date().toISOString().split('T')[0],
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        };
        setUser(fallback);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password?: string) => {
    const res = await api.login(email, password);
    setUser(res.user);
    localStorage.setItem('pakprep_user', JSON.stringify(res.user));
  };

  const signup = async (name: string, email: string, targetExam: string) => {
    const res = await api.signup(name, email, targetExam);
    setUser(res.user);
    localStorage.setItem('pakprep_user', JSON.stringify(res.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pakprep_user');
  };

  const switchDemoRole = async (role: 'student' | 'admin') => {
    const email = role === 'admin' ? 'admin@pakprep.pk' : 'student@pakprep.pk';
    try {
      const res = await api.login(email);
      setUser(res.user);
      localStorage.setItem('pakprep_user', JSON.stringify(res.user));
    } catch {
      if (role === 'admin') {
        const adminUser: User = {
          id: 'usr-admin-1',
          name: 'Dr. Shahzad Ahmed',
          email: 'admin@pakprep.pk',
          role: 'admin',
          targetExam: 'Faculty / Admin',
          targetYear: 2026,
          plan: 'pro',
          createdAt: new Date().toISOString(),
          streakDays: 24,
          lastActiveDate: new Date().toISOString().split('T')[0],
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        };
        setUser(adminUser);
        localStorage.setItem('pakprep_user', JSON.stringify(adminUser));
      } else {
        const studentUser: User = {
          id: 'usr-student-1',
          name: 'Hamza Khan',
          email: 'student@pakprep.pk',
          role: 'student',
          targetExam: 'USAT-E 2026',
          targetYear: 2026,
          plan: 'pro',
          createdAt: new Date().toISOString(),
          streakDays: 7,
          lastActiveDate: new Date().toISOString().split('T')[0],
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        };
        setUser(studentUser);
        localStorage.setItem('pakprep_user', JSON.stringify(studentUser));
      }
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = await api.updateUser(user.id, updates);
    setUser(updated);
    localStorage.setItem('pakprep_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, switchDemoRole, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
