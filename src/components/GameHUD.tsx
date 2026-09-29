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
  onPause: () => void;
  onRestart: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score, moves, timeElapsed, matchedPairs, totalPairs, accuracy, difficulty, onPause, onRestart, soundEnabled, onToggleSound
}) => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  
  return (
    <div className="w-full max-w-4xl mx-auto mb-4">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-medium px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button
            onClick={onPause}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Pause game"
          >
            ⏸️
          </button>
          <button
            onClick={onRestart}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Restart game"
          >
            🔄
          </button>
        </div>
      </div>
      
      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        <StatBox label="Score" value={formatScore(score)} icon="⭐" />
        <StatBox label="Time" value={formatTime(timeElapsed)} icon="⏱️" />
        <StatBox label="Moves" value={String(moves)} icon="🎯" />
        <StatBox label="Pairs" value={`${matchedPairs}/${totalPairs}`} icon="✅" />
      </div>
      
      {/* Accuracy bar */}
      <div className="mt-2 text-center">
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Accuracy: {accuracy > 0 ? `${accuracy}%` : '—'}
        </span>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-2 sm:p-3 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
    <div className="text-base sm:text-lg mb-0.5">{icon}</div>
    <div className="text-sm sm:text-lg font-bold text-gray-800 dark:text-gray-100 truncate">{value}</div>
    <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</div>
  </div>
);
