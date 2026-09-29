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
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score, timeElapsed, moves, accuracy, difficulty, isNewBest, bestScore, onPlayAgain, onChangeDifficulty
}) => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  
  useEffect(() => {
    // Fire confetti celebration
    const duration = 2500;
    const end = Date.now() + duration;
    
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'],
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    // Initial burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
    });
    
    frame();
  }, []);

  // Calculate star rating based on accuracy
  const stars = accuracy >= 80 ? 3 : accuracy >= 50 ? 2 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-scale-in">
        <div className="text-center">
          <div className="text-5xl mb-2">🎉</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1">
            YOU WON!
          </h2>
          
          {/* Star rating */}
          <div className="flex justify-center gap-1 my-2">
            {[1, 2, 3].map(i => (
              <span key={i} className={`text-2xl ${i <= stars ? '' : 'opacity-30'}`}>⭐</span>
            ))}
          </div>
          
          {isNewBest && (
            <div className="inline-block mt-2 px-4 py-1.5 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/50 dark:to-amber-900/50 rounded-full shadow-sm">
              <span className="text-yellow-700 dark:text-yellow-300 font-bold text-sm">
                🏆 NEW BEST SCORE!
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-6 space-y-2.5">
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
