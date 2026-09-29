import React, { useState, useEffect, useRef } from 'react';
import { Difficulty, PlayerData } from '../game/types';
import { getPatternPuzzle, calculatePatternRewards, PatternPuzzle } from '../game/patternLogic';

interface PatternRecognitionProps {
  difficulty: Difficulty;
  playerData: PlayerData;
  onGameComplete: (result: {
    score: number;
    puzzlesSolved: number;
    correctAnswers: number;
    highestCombo: number;
    timeElapsed: number;
    perfectRun: boolean;
    coinsEarned: number;
    xpEarned: number;
  }) => void;
  onBack: () => void;
  onNotification: (type: 'xp' | 'coins' | 'combo' | 'achievement' | 'levelup' | 'streak' | 'perfect' | 'daily', message: string, icon?: string) => void;
  soundEnabled: boolean;
}

export const PatternRecognition: React.FC<PatternRecognitionProps> = ({
  difficulty, playerData, onGameComplete, onBack, onNotification, soundEnabled
}) => {
  const [currentPuzzle, setCurrentPuzzle] = useState<PatternPuzzle>(() => getPatternPuzzle(difficulty));
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong' | null; message: string }>({ type: null, message: '' });
  const [showExplanation, setShowExplanation] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (gameStarted && !gameFinished) {
      timerRef.current = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameStarted, gameFinished]);

  useEffect(() => {
    if (puzzlesSolved >= 10 && !gameFinished) {
      finishGame();
    }
  }, [puzzlesSolved, gameFinished]);

  const finishGame = () => {
    setGameFinished(true);
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const perfectRun = correctAnswers === puzzlesSolved && puzzlesSolved > 0;
    const rewards = calculatePatternRewards(puzzlesSolved, correctAnswers, difficulty, maxCombo);
    
    onGameComplete({
      score,
      puzzlesSolved,
      correctAnswers,
      highestCombo: maxCombo,
      timeElapsed,
      perfectRun,
      coinsEarned: rewards.coins,
      xpEarned: rewards.xp,
    });
  };

  const handleAnswer = (answer: string) => {
    if (gameFinished) return;

    if (!gameStarted) {
      setGameStarted(true);
    }

    const isCorrect = answer === currentPuzzle.answer;
    
    if (isCorrect) {
      const newCombo = combo + 1;
      const newMaxCombo = Math.max(maxCombo, newCombo);
      const points = Math.round(12 * (1 + (newCombo - 1) * 0.1));
      
      setScore(prev => prev + points);
      setCombo(newCombo);
      setMaxCombo(newMaxCombo);
      setCorrectAnswers(prev => prev + 1);
      setFeedback({ type: 'correct', message: `✓ Correct! +${points} points` });
      
      if (newCombo >= 3) {
        onNotification('combo', `Combo x${newCombo}!`, '🔥');
      }
    } else {
      setCombo(0);
      setFeedback({ type: 'wrong', message: `✗ The answer was ${currentPuzzle.answer}` });
    }

    setShowExplanation(true);
    setPuzzlesSolved(prev => prev + 1);
    
    setTimeout(() => {
      setFeedback({ type: null, message: '' });
      setShowExplanation(false);
      if (puzzlesSolved + 1 < 10) {
        setCurrentPuzzle(getPatternPuzzle(difficulty));
      }
    }, 2000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameFinished) {
    const perfectRun = correctAnswers === puzzlesSolved && puzzlesSolved > 0;
    const rewards = calculatePatternRewards(puzzlesSolved, correctAnswers, difficulty, maxCombo);
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl animate-scale-in text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Challenge Complete!</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Score</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{score}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Correct</span>
              <span className="font-bold">{correctAnswers}/{puzzlesSolved}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Accuracy</span>
              <span className="font-bold">{puzzlesSolved > 0 ? Math.round((correctAnswers / puzzlesSolved) * 100) : 0}%</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Best Combo</span>
              <span className="font-bold text-orange-600 dark:text-orange-400">x{maxCombo}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Time</span>
              <span className="font-bold">{formatTime(timeElapsed)}</span>
            </div>
            {perfectRun && (
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400 font-bold">
                ✨ Perfect Run!
              </div>
            )}
          </div>

          <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl mb-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Rewards</p>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">+{rewards.coins}</div>
                <div className="text-xs text-gray-500">🪙 Coins</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">+{rewards.xp}</div>
                <div className="text-xs text-gray-500">✨ XP</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold rounded-xl shadow transition-all"
            >
              🔄 PLAY AGAIN
            </button>
            <button
              onClick={onBack}
              className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all"
            >
              ← GAME MODES
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <span className="text-xl">←</span>
          </button>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">🔷 PATTERNS</h2>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {puzzlesSolved}/10
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{score}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">Time</div>
            <div className="text-lg font-bold">{formatTime(timeElapsed)}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">Combo</div>
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">x{combo}</div>
          </div>
        </div>

        {/* Pattern */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-4">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">What comes next?</p>
            <div className="flex justify-center items-center gap-2 flex-wrap text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              {currentPuzzle.pattern.map((item, i) => (
                <span key={i}>{item}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {currentPuzzle.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(option)}
                disabled={feedback.type !== null}
                className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-white font-bold text-xl rounded-xl transition-all"
              >
                {option}
              </button>
            ))}
          </div>

          {feedback.message && (
            <div className={`mt-3 text-center text-sm font-medium ${feedback.type === 'correct' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {feedback.message}
            </div>
          )}

          {showExplanation && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-700 dark:text-blue-300">
              💡 {currentPuzzle.explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
