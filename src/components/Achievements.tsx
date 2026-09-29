import React from 'react';
import { PlayerData } from '../game/types';
import { ACHIEVEMENTS } from '../game/content';

interface AchievementsProps {
  data: PlayerData;
  onClose: () => void;
}

export const Achievements: React.FC<AchievementsProps> = ({ data, onClose }) => {
  const unlockedCount = data.achievementsUnlocked.length;
  const totalCount = ACHIEVEMENTS.length;

  const getProgress = (achievement: typeof ACHIEVEMENTS[0]): number => {
    const stats = data.statistics;
    switch (achievement.statKey) {
      case 'gamesWon': return stats.gamesWon;
      case 'perfectRuns': return stats.perfectRuns;
      case 'totalPairsMatched': return stats.totalPairsMatched;
      case 'highestCombo': return stats.highestCombo;
      case 'totalCoinsEarned': return stats.totalCoinsEarned;
      case 'dailyChallengesCompleted': return stats.dailyChallengesCompleted;
      case 'totalMoves': return stats.totalMoves;
      case 'bestTimeEasy': return stats.bestTimeEasy !== null ? Math.max(0, achievement.requirement - stats.bestTimeEasy) > 0 ? 0 : achievement.requirement : 0;
      case 'bestTimeMedium': return stats.bestTimeMedium !== null ? Math.max(0, achievement.requirement - stats.bestTimeMedium) > 0 ? 0 : achievement.requirement : 0;
      case '_level': return data.level;
      case '_streak': return data.streak.longest;
      case '_accuracy': return 0; // tracked separately
      case '_hardModeWins': return 0; // tracked separately
      default: return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl animate-scale-in my-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">🏆 ACHIEVEMENTS</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-xl">✕</button>
        </div>

        <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-center">
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            Unlocked: {unlockedCount} / {totalCount}
          </span>
        </div>

        <div className="space-y-3">
          {ACHIEVEMENTS.map(achievement => {
            const unlocked = data.achievementsUnlocked.includes(achievement.id);
            const progress = getProgress(achievement);
            const progressPercent = Math.min(100, (progress / achievement.requirement) * 100);

            return (
              <div
                key={achievement.id}
                className={`p-3 rounded-xl border-2 transition-all ${
                  unlocked 
                    ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-2xl ${unlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-bold text-sm ${unlocked ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-200'}`}>
                        {achievement.name}
                      </h3>
                      {unlocked && <span className="text-green-500 text-sm">✓</span>}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{achievement.description}</p>
                    
                    {!unlocked && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{Math.min(progress, achievement.requirement)} / {achievement.requirement}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 mt-2 text-[10px]">
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">🪙 {achievement.rewardCoins}</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">✨ {achievement.rewardXP} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
