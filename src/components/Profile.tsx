import React from 'react';
import { PlayerData } from '../game/types';
import { getXPForLevel, formatScore, isBoosterActive, getBoosterTimeRemaining, formatTime } from '../game/logic';

interface ProfileProps {
  data: PlayerData;
  onClose: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ data, onClose }) => {
  const xpForNext = getXPForLevel(data.level);
  const xpPercent = (data.xp / xpForNext) * 100;
  const boosterActive = isBoosterActive(data);
  const boosterRemaining = getBoosterTimeRemaining(data);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl animate-scale-in my-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">👤 PROFILE</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-xl">✕</button>
        </div>

        {/* Level & XP */}
        <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs opacity-80">LEVEL</div>
              <div className="text-3xl font-black">{data.level}</div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-80">XP</div>
              <div className="text-lg font-bold">{data.xp} / {xpForNext}</div>
            </div>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${xpPercent}%` }} />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center">
            <div className="text-2xl mb-1">🪙</div>
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{formatScore(data.coins)}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Coins</div>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{data.streak.current}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Day Streak</div>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
            <div className="text-2xl mb-1">🎮</div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">{data.statistics.gamesWon}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Games Won</div>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
            <div className="text-2xl mb-1">✨</div>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{data.statistics.perfectRuns}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Perfect Runs</div>
          </div>
        </div>

        {/* Booster */}
        {boosterActive && (
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl mb-4 text-center">
            <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              ⚡ {data.booster!.multiplier}× XP ACTIVE
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatTime(Math.floor(boosterRemaining / 1000))} remaining
            </div>
          </div>
        )}

        {/* Achievements */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
            🏆 {data.achievementsUnlocked.length} Achievements Unlocked
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
