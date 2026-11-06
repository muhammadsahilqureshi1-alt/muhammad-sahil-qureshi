import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Flame, Star, Award, TrendingUp, Users } from 'lucide-react';
import { api } from '../services/api.js';
import { LeaderboardEntry } from '../types.js';
import { useAuth } from '../context/AuthContext.js';

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [timeframe, setTimeframe] = useState<'weekly' | 'alltime'>('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getLeaderboard()
      .then((data) => setEntries(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const topThree = entries.slice(0, 3);
  const remaining = entries.slice(3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-500 font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>National University Aspirants Ranking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Pakistan Entry Test Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Top performers across HEC USAT, MDCAT, ECAT, and NUST NET exams.
          </p>
        </div>

        {/* Weekly vs All-Time Filter */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-2 rounded-lg transition ${
              timeframe === 'weekly'
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeframe('alltime')}
            className={`px-4 py-2 rounded-lg transition ${
              timeframe === 'alltime'
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All-Time Merit
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold">Computing live student ranks...</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {/* Rank 2 (Silver) */}
            {topThree[1] && (
              <div className="md:order-1 order-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm text-center space-y-3 relative overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-black mx-auto text-lg shadow-sm">
                  2
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    {topThree[1].userName}
                  </h3>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                    {topThree[1].targetExam}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-xs">
                  <p className="font-black text-slate-900 dark:text-white text-lg">
                    {topThree[1].avgPercentage}%
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {topThree[1].testsCompleted} Exams · 🔥 {topThree[1].streakDays}d Streak
                  </p>
                </div>
              </div>
            )}

            {/* Rank 1 (Gold) - Elevated */}
            {topThree[0] && (
              <div className="md:order-2 order-1 md:-mt-4 rounded-3xl bg-linear-to-b from-amber-500/10 via-amber-500/5 to-white dark:to-slate-900 border-2 border-amber-400 p-7 shadow-xl text-center space-y-3 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Medal className="w-3.5 h-3.5" />
                  <span>Rank #1 Pakistan</span>
                </div>
                <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black mx-auto text-2xl shadow-lg shadow-amber-500/25">
                  1
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white">
                    {topThree[0].userName}
                  </h3>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                    {topThree[0].targetExam}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
                  <p className="font-black text-amber-700 dark:text-amber-300 text-2xl">
                    {topThree[0].avgPercentage}%
                  </p>
                  <p className="text-[11px] text-amber-600/80">
                    {topThree[0].testsCompleted} Full Mocks · 🔥 {topThree[0].streakDays}d Streak
                  </p>
                </div>
              </div>
            )}

            {/* Rank 3 (Bronze) */}
            {topThree[2] && (
              <div className="md:order-3 order-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm text-center space-y-3 relative overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-amber-700/20 text-amber-800 dark:text-amber-300 flex items-center justify-center font-black mx-auto text-lg shadow-sm">
                  3
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    {topThree[2].userName}
                  </h3>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                    {topThree[2].targetExam}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-xs">
                  <p className="font-black text-slate-900 dark:text-white text-lg">
                    {topThree[2].avgPercentage}%
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {topThree[2].testsCompleted} Exams · 🔥 {topThree[2].streakDays}d Streak
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Remaining Ranks Table */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-extrabold uppercase tracking-wider text-slate-500">
              <span>National Aspirant List</span>
              <span>Sorted by Accuracy</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {entries.map((entry) => {
                const isCurrentUser = user && user.name.toLowerCase() === entry.userName.toLowerCase();
                return (
                  <div
                    key={entry.userId}
                    className={`p-4 flex items-center justify-between transition ${
                      isCurrentUser
                        ? 'bg-blue-50 dark:bg-blue-950/40 font-bold border-l-4 border-blue-600'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                          entry.rank === 1
                            ? 'bg-amber-400 text-slate-950'
                            : entry.rank === 2
                            ? 'bg-slate-300 text-slate-800'
                            : entry.rank === 3
                            ? 'bg-amber-700/30 text-amber-900 dark:text-amber-200'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {entry.rank}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {entry.userName}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-600 text-white font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{entry.targetExam}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-right">
                      <div className="hidden sm:block">
                        <p className="font-bold text-slate-700 dark:text-slate-300">{entry.testsCompleted}</p>
                        <p className="text-[10px] text-slate-400">Exams Taken</p>
                      </div>

                      <div className="hidden sm:block">
                        <p className="font-bold text-amber-600 flex items-center gap-0.5 justify-end">
                          <Flame className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{entry.streakDays}d</span>
                        </p>
                        <p className="text-[10px] text-slate-400">Streak</p>
                      </div>

                      <div className="min-w-[65px]">
                        <p className="text-sm font-black text-blue-600 dark:text-blue-400">
                          {entry.avgPercentage}%
                        </p>
                        <p className="text-[10px] text-slate-400">Accuracy</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
