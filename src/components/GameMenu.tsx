import React from 'react';
import { Difficulty, DIFFICULTY_CONFIGS, BestScore } from '../game/types';
import { formatScore } from '../game/logic';
import { loadBestScore } from '../game/storage';

interface GameMenuProps {
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onStartGame: () => void;
  onShowHowToPlay: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({
  difficulty, onDifficultyChange, onStartGame, onShowHowToPlay, soundEnabled, onToggleSound, theme, onToggleTheme
}) => {
  const bestScores: Record<Difficulty, BestScore | null> = {
    easy: loadBestScore('easy'),
    medium: loadBestScore('medium'),
    hard: loadBestScore('hard'),
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full text-center">
        {/* Title */}
        <div className="mb-8">
          <div className="animate-float inline-block mb-4">
            <span className="text-6xl">🧠</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 title-shimmer">
            MEMORY FLIP
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base italic">
            How good is your memory?
          </p>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 uppercase tracking-wide">
            Select Difficulty
          </p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {(Object.keys(DIFFICULTY_CONFIGS) as Difficulty[]).map((d) => {
              const config = DIFFICULTY_CONFIGS[d];
              const isSelected = difficulty === d;
              const best = bestScores[d];
              return (
                <button
                  key={d}
                  onClick={() => onDifficultyChange(d)}
                  className={`
                    p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden
                    ${isSelected 
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg scale-105' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 bg-white dark:bg-gray-800 hover:shadow-md'
                    }
                  `}
                >
                  <div className={`text-lg sm:text-xl font-bold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-200'}`}>
                    {config.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {config.cols}×{config.rows}
                  </div>
                  {best && (
                    <div className="text-[10px] text-indigo-500 dark:text-indigo-400 mt-1 font-medium">
                      🏆 {formatScore(best.score)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStartGame}
          className="w-full py-4 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mb-4"
        >
          ▶ START GAME
        </button>

        {/* How to Play */}
        <button
          onClick={onShowHowToPlay}
          className="w-full py-3 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition-all duration-200 mb-6"
        >
          ❓ HOW TO PLAY
        </button>

        {/* Settings row */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onToggleSound}
            className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xl"
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            title={soundEnabled ? 'Sound ON' : 'Sound OFF'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button
            onClick={onToggleTheme}
            className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xl"
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </div>
  );
};
