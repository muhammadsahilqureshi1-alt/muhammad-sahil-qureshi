import React from 'react';
import { GraduationCap, ShieldCheck, HelpCircle, Mail, MapPin, Heart } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext.js';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language } = useThemeLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Pak<span className="text-blue-400">Prep</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ur'
                ? 'پاکستان کی نمبر 1 ٹیسٹ تیاری ویب سائٹ برائے یو ایس اے ٹی (HEC USAT)، ایم ڈی کیٹ، ای کیٹ اور نسٹ داخلہ امتحانات۔'
                : 'Pakistan’s dedicated admissions portal for HEC USAT, MDCAT, ECAT, and top university entry tests with instant AI evaluations.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>HEC ETC Syllabus 2026 Aligned</span>
            </div>
          </div>

          {/* Test Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              {language === 'ur' ? 'داخلہ امتحانات' : 'Exam Categories'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('practice')} className="hover:text-blue-400 transition">
                  USAT-E (Pre-Engineering)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('practice')} className="hover:text-blue-400 transition">
                  USAT-M (Pre-Medical)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('practice')} className="hover:text-blue-400 transition">
                  USAT-CS (Computer Science)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('practice')} className="hover:text-blue-400 transition">
                  PMDC MDCAT & ECAT
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('practice')} className="hover:text-blue-400 transition">
                  NUST NET & FAST NU Test
                </button>
              </li>
            </ul>
          </div>

          {/* Test Pattern & Marking Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              {language === 'ur' ? 'یو ایس اے ٹی پیٹرن' : 'USAT Test Blueprint'}
            </h4>
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Part 1 (MCQs):</span>
                <span className="font-bold text-amber-300">75 Marks (100 Mins)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Part 2 (Essay):</span>
                <span className="font-bold text-emerald-300">25 Marks (40 Mins)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Score:</span>
                <span className="font-bold text-white">100 Marks (50 Pass)</span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-700">
                Negative marking applies only on designated exams (e.g. 0.25).
              </p>
            </div>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              {language === 'ur' ? 'رابطہ و مدد' : 'Help & Support'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>support@pakprep.pk</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Islamabad / Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>24/7 Student Forum & AI Mentor</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 PakPrep Portal. All rights reserved. Built for Pakistani University Aspirants.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Education in Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
