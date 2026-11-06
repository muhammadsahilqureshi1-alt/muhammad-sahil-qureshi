import React, { useState } from 'react';
import {
  Check,
  Crown,
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';

export const PricingPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'master' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'JazzCash' | 'Easypaisa' | 'Card'>('JazzCash');
  const [accountNumber, setAccountNumber] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setSuccessMsg(null);

    try {
      await api.subscribePlan({
        userId: user.id,
        plan: 'pro',
        paymentMethod,
        transactionRef: transactionRef || `TXN-${Math.floor(Math.random() * 900000 + 100000)}`,
      });

      await updateProfile({ plan: 'pro' });
      setSuccessMsg(
        `🎉 Congratulations ${user.name}! Your USAT Pro Pass has been activated via ${paymentMethod}.`
      );
      setTimeout(() => {
        setSelectedPlan(null);
      }, 2500);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-700">
          <Crown className="w-3.5 h-3.5" />
          <span>Transparent Student Pricing in PKR</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Invest in Your University Future
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Unlock unlimited full-length computerized mock tests, detailed analytics, and instant HEC AI essay reviews with Pakistan's most affordable portal.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-bold text-center max-w-2xl mx-auto flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Free Plan */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Starter</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Free Access</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Essential practice to test our platform and prepare core topics.
            </p>
            <div className="pt-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white">PKR 0</span>
              <span className="text-xs text-slate-400 ml-1">/ forever</span>
            </div>

            <ul className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Access to 500+ Practice MCQs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1 Full-Length Simulation Exam</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1 AI Essay Review</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Mistakes Notebook Archive</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              disabled
              className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold text-xs"
            >
              Current Active Free Tier
            </button>
          </div>
        </div>

        {/* USAT Pro Plan (Featured) */}
        <div className="rounded-3xl border-2 border-blue-600 bg-white dark:bg-slate-900 p-8 shadow-xl flex flex-col justify-between relative transform md:-translate-y-2">
          <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Most Recommended</span>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              USAT Pro Pass
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Full Admission Pass</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete access to your target USAT variant with unlimited mocks.
            </p>
            <div className="pt-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white">PKR 1,999</span>
              <span className="text-xs text-slate-400 ml-1">/ single season</span>
            </div>

            <ul className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Unlimited Full-Length USAT Mock Tests</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>30 AI Essay Evaluator Submissions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>15,000+ Verified MCQs with Step Solutions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Negative Marking Exam Simulator (-0.25)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Printable Official PDF Result Card</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={() => setSelectedPlan('pro')}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition"
            >
              Upgrade via JazzCash / EasyPaisa
            </button>
          </div>
        </div>

        {/* All-Access Master Plan */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Master Bundle
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">All Pakistan Tests</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Includes USAT, MDCAT, ECAT, NUST NET, FAST NU, and GIKI portals.
            </p>
            <div className="pt-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white">PKR 3,499</span>
              <span className="text-xs text-slate-400 ml-1">/ full year</span>
            </div>

            <ul className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>All USAT Variants (E, M, CS, GS, Arts)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>MDCAT & ECAT & NUST NET Mock Series</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Unlimited AI Essay Marking</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Priority 1-on-1 Academic Support</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={() => setSelectedPlan('master')}
              className="w-full py-3.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 shadow-sm transition"
            >
              Get Master Bundle
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  Payment Checkout
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedPlan === 'pro' ? 'USAT Pro Pass (PKR 1,999)' : 'Master Bundle (PKR 3,499)'}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Cancel
              </button>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'JazzCash', label: 'JazzCash', icon: Smartphone },
                { id: 'Easypaisa', label: 'EasyPaisa', icon: Smartphone },
                { id: 'Card', label: 'Debit Card', icon: CreditCard },
              ].map((pm) => {
                const Icon = pm.icon;
                const isSelected = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-3 rounded-xl border text-center transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 font-bold text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs block">{pm.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleCheckout} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {paymentMethod === 'Card' ? 'Card Number' : `${paymentMethod} Mobile Account Number`}
                </label>
                <input
                  type="text"
                  required
                  placeholder={paymentMethod === 'Card' ? '0000 0000 0000 0000' : '0300 1234567'}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Transaction / TID Reference (Optional demo)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9821443219"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-hidden"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                🔒 Safe 256-bit payment gateway. Instant activation of mock exams upon confirmation.
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : `Pay & Activate (${selectedPlan === 'pro' ? 'PKR 1,999' : 'PKR 3,499'})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
