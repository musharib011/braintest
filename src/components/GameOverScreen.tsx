import React from 'react';
import { Difficulty, DIFFICULTY_CONFIGS, BestScore } from '../game/types';
import { formatTime, formatScore } from '../game/logic';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface GameOverScreenProps {
  score: number;
  timeElapsed: number;
  moves: number;
  accuracy: number;
  difficulty: Difficulty;
  isNewBest: boolean;
  bestScore: BestScore | null;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score, timeElapsed, moves, accuracy, difficulty, isNewBest, bestScore, onPlayAgain, onChangeDifficulty
}) => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  
  useEffect(() => {
    // Fire confetti
    const duration = 2000;
    const end = Date.now() + duration;
    
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#8b5cf6', '#ec4899'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#8b5cf6', '#ec4899'],
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-scale-in">
        <div className="text-center">
          <div className="text-5xl mb-2">🎉</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1">
            YOU WON!
          </h2>
          
          {isNewBest && (
            <div className="inline-block mt-2 px-4 py-1 bg-yellow-100 dark:bg-yellow-900/50 rounded-full">
              <span className="text-yellow-700 dark:text-yellow-300 font-bold text-sm">
                🏆 NEW BEST SCORE!
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-6 space-y-3">
          <ResultRow label="Score" value={formatScore(score)} highlight />
          <ResultRow label="Time" value={formatTime(timeElapsed)} />
          <ResultRow label="Moves" value={String(moves)} />
          <ResultRow label="Accuracy" value={`${accuracy}%`} />
          <ResultRow label="Difficulty" value={config.label} />
          
          {bestScore && !isNewBest && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <ResultRow label="Best Score" value={formatScore(bestScore.score)} />
            </div>
          )}
        </div>
        
        <div className="mt-6 space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            PLAY AGAIN
          </button>
          <button
            onClick={onChangeDifficulty}
            className="w-full py-3 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all duration-200"
          >
            CHANGE DIFFICULTY
          </button>
        </div>
      </div>
    </div>
  );
};

const ResultRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-500 dark:text-gray-400 text-sm">{label}</span>
    <span className={`font-bold text-lg ${highlight ? 'text-indigo-600 dark:text-indigo-400 text-xl' : 'text-gray-800 dark:text-gray-100'}`}>
      {value}
    </span>
  </div>
);
