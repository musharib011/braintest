import React from 'react';
import { Difficulty, DIFFICULTY_CONFIGS } from '../game/types';
import { formatTime, formatScore } from '../game/logic';

interface GameHUDProps {
  score: number;
  moves: number;
  timeElapsed: number;
  matchedPairs: number;
  totalPairs: number;
  accuracy: number;
  difficulty: Difficulty;
  combo: number;
  onPause: () => void;
  onRestart: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score, moves, timeElapsed, matchedPairs, totalPairs, accuracy, difficulty, combo, onPause, onRestart, soundEnabled, onToggleSound
}) => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const progress = totalPairs > 0 ? (matchedPairs / totalPairs) * 100 : 0;
  
  return (
    <div className="w-full max-w-4xl mx-auto mb-3 sm:mb-4">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold">
            {config.label}
          </span>
          {combo >= 2 && (
            <span className="text-xs sm:text-sm font-bold px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300 animate-pulse">
              🔥 x{combo}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-lg"
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button
            onClick={onPause}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-lg"
            aria-label="Pause game"
          >
            ⏸️
          </button>
          <button
            onClick={onRestart}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-lg"
            aria-label="Restart game"
          >
            🔄
          </button>
        </div>
      </div>
      
      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
        <StatBox label="Score" value={formatScore(score)} icon="⭐" />
        <StatBox label="Time" value={formatTime(timeElapsed)} icon="⏱️" />
        <StatBox label="Moves" value={String(moves)} icon="🎯" />
        <StatBox label="Accuracy" value={accuracy > 0 ? `${accuracy}%` : '—'} icon="📊" />
      </div>
      
      {/* Progress bar */}
      <div className="mt-2 sm:mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
            Pairs: {matchedPairs}/{totalPairs}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-1.5 sm:p-3 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
    <div className="text-sm sm:text-base mb-0.5">{icon}</div>
    <div className="text-xs sm:text-lg font-bold text-gray-800 dark:text-gray-100 truncate">{value}</div>
    <div className="text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</div>
  </div>
);
