import React, { useEffect } from 'react';
import { Difficulty, DIFFICULTY_CONFIGS, BestScore } from '../game/types';
import { formatTime, formatScore } from '../game/logic';
import confetti from 'canvas-confetti';

interface GameOverScreenProps {
  score: number;
  timeElapsed: number;
  moves: number;
  accuracy: number;
  difficulty: Difficulty;
  isNewBest: boolean;
  bestScore: BestScore | null;
  perfectRun: boolean;
  maxCombo: number;
  coinsEarned: number;
  xpEarned: number;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score, timeElapsed, moves, accuracy, difficulty, isNewBest, bestScore, perfectRun, maxCombo, coinsEarned, xpEarned, onPlayAgain, onChangeDifficulty
}) => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  
  useEffect(() => {
    const duration = 2500;
    const end = Date.now() + duration;
    
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'] });
    frame();
  }, []);

  const stars = accuracy >= 80 ? 3 : accuracy >= 50 ? 2 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl animate-scale-in my-4">
        <div className="text-center">
          <div className="text-5xl mb-2">🎉</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1">YOU WON!</h2>
          
          <div className="flex justify-center gap-1 my-2">
            {[1, 2, 3].map(i => (
              <span key={i} className={`text-2xl ${i <= stars ? '' : 'opacity-30'}`}>⭐</span>
            ))}
          </div>
          
          {isNewBest && (
            <div className="inline-block mt-2 px-4 py-1.5 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/50 dark:to-amber-900/50 rounded-full shadow-sm">
              <span className="text-yellow-700 dark:text-yellow-300 font-bold text-sm">🏆 NEW BEST SCORE!</span>
            </div>
          )}
          
          {perfectRun && (
            <div className="inline-block mt-2 ml-2 px-4 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-full shadow-sm">
              <span className="text-purple-700 dark:text-purple-300 font-bold text-sm">✨ PERFECT RUN!</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 space-y-2">
          <ResultRow label="Score" value={formatScore(score)} highlight />
          <ResultRow label="Time" value={formatTime(timeElapsed)} />
          <ResultRow label="Moves" value={String(moves)} />
          <ResultRow label="Accuracy" value={`${accuracy}%`} />
          <ResultRow label="Difficulty" value={config.label} />
          {maxCombo >= 2 && <ResultRow label="Max Combo" value={`🔥 x${maxCombo}`} />}
          
          {bestScore && !isNewBest && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <ResultRow label="Best Score" value={formatScore(bestScore.score)} />
            </div>
          )}
        </div>
        
        {/* Rewards */}
        <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide text-center">Rewards Earned</p>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">+{coinsEarned}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">🪙 Coins</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">+{xpEarned}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">✨ XP</div>
            </div>
          </div>
        </div>
        
        <div className="mt-5 space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            🔄 PLAY AGAIN
          </button>
          <button
            onClick={onChangeDifficulty}
            className="w-full py-3 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all duration-200"
          >
            🏠 CHANGE DIFFICULTY
          </button>
        </div>
      </div>
    </div>
  );
};

const ResultRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center px-2">
    <span className="text-gray-500 dark:text-gray-400 text-sm">{label}</span>
    <span className={`font-bold ${highlight ? 'text-indigo-600 dark:text-indigo-400 text-xl' : 'text-gray-800 dark:text-gray-100 text-lg'}`}>
      {value}
    </span>
  </div>
);
