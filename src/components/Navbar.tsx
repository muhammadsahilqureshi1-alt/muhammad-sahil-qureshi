import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  FileCheck2,
  PenTool,
  LayoutDashboard,
  Trophy,
  BookX,
  Crown,
  ShieldAlert,
  Moon,
  Sun,
  Languages,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useThemeLanguage } from '../context/ThemeLanguageContext.js';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenAuthModal }) => {
  const { user, logout, switchDemoRole } = useAuth();
  const { language, theme, toggleLanguage, toggleTheme, t, isRTL } = useThemeLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'practice', label: t('nav.practice'), icon: BookOpen },
    { id: 'mock-tests', label: t('nav.mocktests'), icon: FileCheck2 },
    { id: 'essay-lab', label: t('nav.essaylab'), icon: PenTool, badge: 'AI' },
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'mistakes', label: t('nav.mistakes'), icon: BookX },
    { id: 'leaderboard', label: t('nav.leaderboard'), icon: Trophy },
    { id: 'pricing', label: t('nav.pricing'), icon: Crown, highlight: true },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ id: 'admin', label: t('nav.admin'), icon: ShieldAlert });
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
        <span>
          {language === 'ur'
            ? 'یو ایس اے ٹی 2026 اور ایم ڈی کیٹ ماک ٹیسٹ اب دستیاب ہیں - اے آئی سے فوری نتیجہ حاصل کریں!'
            : 'HEC USAT 2026 & MDCAT Mock Tests Active — Free practice with instant AI Essay Grading!'}
        </span>
        <button
          onClick={() => onNavigate('mock-tests')}
          className="underline font-bold text-amber-200 hover:text-white transition ml-1"
        >
          {language === 'ur' ? 'ٹیسٹ شروع کریں' : 'Take Exam'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Pak<span className="text-blue-600 dark:text-blue-400">Prep</span>
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  USAT 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none hidden sm:block">
                Universal Admission Test Portal
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-amber-300 dark:border-amber-700">
                      {link.badge}
                    </span>
                  )}
                  {link.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Language, Theme, Role Switcher, Profile */}
          <div className="flex items-center gap-2">
            {/* Quick Demo Switcher (Student / Admin) */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => switchDemoRole('student')}
                className={`px-2 py-1 rounded transition ${
                  user?.role === 'student'
                    ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
                title="Switch to Student view"
              >
                Student Demo
              </button>
              <button
                onClick={() => switchDemoRole('admin')}
                className={`px-2 py-1 rounded transition ${
                  user?.role === 'admin'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
                title="Switch to Admin panel"
              >
                Admin Demo
              </button>
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle English / Urdu"
            >
              <Languages className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* User Profile / Auth Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-blue-400"
                  />
                  <div className="hidden sm:block text-left text-xs">
                    <p className="font-bold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[90px]">
                      {user.name.split(' ')[0]}
                    </p>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase">
                      {user.role} {user.plan === 'pro' ? '★ Pro' : ''}
                    </span>
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                          {user.targetExam}
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 px-1.5 py-0.5 rounded font-bold">
                          🔥 {user.streakDays} Day Streak
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>{t('nav.dashboard')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigate('pricing');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-amber-600 dark:text-amber-400 font-semibold hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>Upgrade to USAT Pro</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t('nav.login')}</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => {
                switchDemoRole('student');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-1.5 text-xs text-center font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded"
            >
              Student Demo
            </button>
            <button
              onClick={() => {
                switchDemoRole('admin');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-1.5 text-xs text-center font-bold bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded"
            >
              Admin Demo
            </button>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-blue-600" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
