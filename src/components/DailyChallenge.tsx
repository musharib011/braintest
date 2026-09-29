import React from 'react';
import { PlayerData } from '../game/types';
import { getDailyChallenge } from '../game/logic';
import { getTodayString } from '../game/storage';
import { formatScore } from '../game/logic';

interface DailyChallengeProps {
  data: PlayerData;
  onClose: () => void;
  onStartChallenge: () => void;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({ data, onClose, onStartChallenge }) => {
  const challenge = getDailyChallenge();
  const today = getTodayString();
  const isCompletedToday = data.dailyChallenge.date === today && data.dailyChallenge.completed;
  const streakMilestones = [3, 7, 14, 30];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl animate-scale-in my-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">📅 DAILY</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-xl">✕</button>
        </div>

        {/* Challenge */}
        <div className={`p-4 rounded-2xl mb-4 ${isCompletedToday ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{isCompletedToday ? '✅' : '🎯'}</span>
            <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wide">
              {isCompletedToday ? 'COMPLETED' : "TODAY'S CHALLENGE"}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">{challenge.description}</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-yellow-600 dark:text-yellow-400 font-bold">🪙 +{formatScore(challenge.rewardCoins)}</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">✨ +{challenge.rewardXP} XP</span>
          </div>
          
          {!isCompletedToday && (
            <button
              onClick={() => { onStartChallenge(); onClose(); }}
              className="w-full mt-3 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              START CHALLENGE
            </button>
          )}
        </div>

        {/* Streak */}
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">🔥 STREAK</span>
            <span className="text-lg font-black text-orange-600 dark:text-orange-400">{data.streak.current} days</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full ${i < data.streak.current % 7 || (data.streak.current >= 7 && i < 7) ? 'bg-orange-400' : 'bg-orange-200 dark:bg-orange-800'}`}
              />
            ))}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
            Longest: {data.streak.longest} days
          </div>
        </div>

        {/* Milestones */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Milestone Rewards</p>
          <div className="grid grid-cols-2 gap-2">
            {streakMilestones.map(m => {
              const claimed = data.streak.milestonesClaimed.includes(m);
              const reached = data.streak.longest >= m;
              return (
                <div key={m} className={`p-2 rounded-lg text-center ${claimed ? 'bg-green-100 dark:bg-green-900/30' : reached ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gray-100 dark:bg-gray-600/50'}`}>
                  <div className="text-xs font-bold text-gray-700 dark:text-gray-200">{m} days</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">
                    {claimed ? '✓ Claimed' : reached ? '🎁 Ready!' : '🔒 Locked'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all duration-200"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};
