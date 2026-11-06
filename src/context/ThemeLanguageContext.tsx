import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ur';
type Theme = 'light' | 'dark';

interface ThemeLanguageContextType {
  language: Language;
  theme: Theme;
  isRTL: boolean;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  t: (key: string) => string;
}

const translations: Record<string, { en: string; ur: string }> = {
  // Navigation
  'nav.home': { en: 'Home', ur: 'ہوم' },
  'nav.practice': { en: 'MCQ Practice', ur: 'ایم سی کیو مشق' },
  'nav.mocktests': { en: 'Mock Exams', ur: 'ماک امتحانات' },
  'nav.essaylab': { en: 'Essay Lab (AI)', ur: 'مضمون نگاری (AI)' },
  'nav.dashboard': { en: 'Dashboard', ur: 'ڈیش بورڈ' },
  'nav.leaderboard': { en: 'Leaderboard', ur: 'لیڈر بورڈ' },
  'nav.mistakes': { en: 'Mistakes Notebook', ur: 'غلطیوں کی ڈائری' },
  'nav.pricing': { en: 'Pro Plans', ur: 'پلانز و فیس' },
  'nav.admin': { en: 'Admin Panel', ur: 'ایڈمن پینل' },
  'nav.login': { en: 'Login', ur: 'لاگ ان' },
  'nav.signup': { en: 'Register', ur: 'رجسٹریشن' },
  'nav.logout': { en: 'Logout', ur: 'لاگ آؤٹ' },

  // General
  'app.name': { en: 'PakPrep', ur: 'پاک پریپ' },
  'app.tagline': { en: 'USAT & University Entry Test Portal', ur: 'یو ایس اے ٹی اور یونیورسٹی داخلہ ٹیسٹ پورٹل' },
  'btn.startPractice': { en: 'Start Practice', ur: 'مشق شروع کریں' },
  'btn.takeMock': { en: 'Take Mock Test', ur: 'ماک ٹیسٹ دیں' },
  'btn.writeEssay': { en: 'Write Essay', ur: 'مضمون لکھیں' },
  'btn.submit': { en: 'Submit Test', ur: 'ٹیسٹ جمع کرائیں' },
  'btn.save': { en: 'Save', ur: 'محفوظ کریں' },
  'btn.cancel': { en: 'Cancel', ur: 'منسوخ' },
  'btn.next': { en: 'Next Question', ur: 'اگلا سوال' },
  'btn.previous': { en: 'Previous', ur: 'پچھلا سوال' },
  'btn.flag': { en: 'Flag for Review', ur: 'نشان زد کریں' },
  'btn.unflag': { en: 'Remove Flag', ur: 'نشان ہٹائیں' },
  'btn.report': { en: 'Report Error', ur: 'خرابی رپورٹ کریں' },

  // Exam labels
  'exam.question': { en: 'Question', ur: 'سوال' },
  'exam.timeRemaining': { en: 'Time Remaining', ur: 'باقی وقت' },
  'exam.answered': { en: 'Answered', ur: 'جواب دیا' },
  'exam.unanswered': { en: 'Unanswered', ur: 'بغیر جواب' },
  'exam.flagged': { en: 'Flagged for Review', ur: 'زیر غور' },
  'exam.explanation': { en: 'Explanation & Concept', ur: 'حل اور وضاحت' },
  'exam.yourAnswer': { en: 'Your Answer', ur: 'آپ کا جواب' },
  'exam.correctAnswer': { en: 'Correct Answer', ur: 'درست جواب' },
};

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('pakprep_lang') as Language) || 'en';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('pakprep_theme') as Theme) || 'light';
  });

  const isRTL = language === 'ur';

  useEffect(() => {
    localStorage.setItem('pakprep_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  useEffect(() => {
    localStorage.setItem('pakprep_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ur' : 'en'));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key].en;
    }
    return key;
  };

  return (
    <ThemeLanguageContext.Provider value={{ language, theme, isRTL, toggleLanguage, toggleTheme, t }}>
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext);
  if (!context) throw new Error('useThemeLanguage must be used within ThemeLanguageProvider');
  return context;
};
