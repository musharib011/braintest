import React from 'react';
import { PlayerData } from '../game/types';
import { formatTime, formatScore } from '../game/logic';

interface StatisticsProps {
  data: PlayerData;
  onClose: () => void;
}

export const Statistics: React.FC<StatisticsProps> = ({ data, onClose }) => {
  const { statistics, streak } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl animate-scale-in my-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">📊 STATISTICS</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-xl">✕</button>
        </div>

        <div className="space-y-2">
          <StatRow icon="🎮" label="Games Played" value={String(statistics.gamesPlayed)} />
          <StatRow icon="🏆" label="Games Won" value={String(statistics.gamesWon)} />
          <StatRow icon="✨" label="Perfect Runs" value={String(statistics.perfectRuns)} />
          <StatRow icon="🃏" label="Pairs Matched" value={formatScore(statistics.totalPairsMatched)} />
          <StatRow icon="🎯" label="Total Moves" value={formatScore(statistics.totalMoves)} />
          <StatRow icon="🔥" label="Highest Combo" value={`x${statistics.highestCombo}`} />
          <StatRow icon="🪙" label="Total Coins Earned" value={formatScore(statistics.totalCoinsEarned)} />
          <StatRow icon="⏱️" label="Best Time (Easy)" value={statistics.bestTimeEasy !== null ? formatTime(statistics.bestTimeEasy) : '—'} />
          <StatRow icon="⏱️" label="Best Time (Medium)" value={statistics.bestTimeMedium !== null ? formatTime(statistics.bestTimeMedium) : '—'} />
          <StatRow icon="⏱️" label="Best Time (Hard)" value={statistics.bestTimeHard !== null ? formatTime(statistics.bestTimeHard) : '—'} />
          <StatRow icon="📅" label="Daily Challenges" value={String(statistics.dailyChallengesCompleted)} />
          <StatRow icon="🔥" label="Current Streak" value={`${streak.current} days`} />
          <StatRow icon="🔥" label="Longest Streak" value={`${streak.longest} days`} />
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all duration-200"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};

const StatRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
    </div>
    <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{value}</span>
  </div>
);
