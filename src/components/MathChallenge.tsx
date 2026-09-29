import React, { useState, useEffect, useRef } from 'react';
import { Difficulty, PlayerData } from '../game/types';
import { generateMathQuestion, calculateMathRewards, MathQuestion } from '../game/mathDatabase';

interface MathChallengeProps {
  difficulty: Difficulty;
  playerData: PlayerData;
  onGameComplete: (result: {
    score: number;
    questionsAnswered: number;
    correctAnswers: number;
    highestCombo: number;
    timeElapsed: number;
    perfectRun: boolean;
    fastestAnswer: number | null;
    coinsEarned: number;
    xpEarned: number;
  }) => void;
  onBack: () => void;
  onNotification: (type: 'xp' | 'coins' | 'combo' | 'achievement' | 'levelup' | 'streak' | 'perfect' | 'daily', message: string, icon?: string) => void;
  soundEnabled: boolean;
}

export const MathChallenge: React.FC<MathChallengeProps> = ({
  difficulty, playerData, onGameComplete, onBack, onNotification, soundEnabled
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion>(() => generateMathQuestion(difficulty));
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong' | null; message: string }>({ type: null, message: '' });
  const [fastestAnswer, setFastestAnswer] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  // Timer
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

  // Focus input
  useEffect(() => {
    if (!gameFinished) {
      inputRef.current?.focus();
    }
  }, [currentQuestion, gameFinished]);

  // End game after 20 questions
  useEffect(() => {
    if (questionsAnswered >= 20 && !gameFinished) {
      finishGame();
    }
  }, [questionsAnswered, gameFinished]);

  const finishGame = () => {
    setGameFinished(true);
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const perfectRun = correctAnswers === questionsAnswered && questionsAnswered > 0;
    const rewards = calculateMathRewards(questionsAnswered, correctAnswers, difficulty, maxCombo, timeElapsed);
    
    onGameComplete({
      score,
      questionsAnswered,
      correctAnswers,
      highestCombo: maxCombo,
      timeElapsed,
      perfectRun,
      fastestAnswer,
      coinsEarned: rewards.coins,
      xpEarned: rewards.xp,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameFinished || !userInput.trim()) return;

    if (!gameStarted) {
      setGameStarted(true);
    }

    const answer = parseFloat(userInput);
    const isCorrect = !isNaN(answer) && answer === currentQuestion.answer;
    const answerTime = (Date.now() - questionStartTime) / 1000;

    if (isCorrect) {
      const newCombo = combo + 1;
      const newMaxCombo = Math.max(maxCombo, newCombo);
      const points = Math.round(10 * (1 + (newCombo - 1) * 0.1));
      
      setScore(prev => prev + points);
      setCombo(newCombo);
      setMaxCombo(newMaxCombo);
      setCorrectAnswers(prev => prev + 1);
      setFeedback({ type: 'correct', message: `✓ Correct! +${points} points` });
      
      if (fastestAnswer === null || answerTime < fastestAnswer) {
        setFastestAnswer(answerTime);
      }
      
      if (newCombo >= 3) {
        onNotification('combo', `Combo x${newCombo}!`, '🔥');
      }
    } else {
      setCombo(0);
      setFeedback({ type: 'wrong', message: `✗ The answer was ${currentQuestion.answer}` });
    }

    setQuestionsAnswered(prev => prev + 1);
    setUserInput('');
    
    setTimeout(() => {
      setFeedback({ type: null, message: '' });
      if (questionsAnswered + 1 < 20) {
        setCurrentQuestion(generateMathQuestion(difficulty));
        setQuestionStartTime(Date.now());
      }
    }, 1500);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameFinished) {
    const perfectRun = correctAnswers === questionsAnswered && questionsAnswered > 0;
    const rewards = calculateMathRewards(questionsAnswered, correctAnswers, difficulty, maxCombo, timeElapsed);
    
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
              <span className="font-bold">{correctAnswers}/{questionsAnswered}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Accuracy</span>
              <span className="font-bold">{questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0}%</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Best Combo</span>
              <span className="font-bold text-orange-600 dark:text-orange-400">x{maxCombo}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Time</span>
              <span className="font-bold">{formatTime(timeElapsed)}</span>
            </div>
            {fastestAnswer && (
              <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">Fastest Answer</span>
                <span className="font-bold text-green-600 dark:text-green-400">{fastestAnswer.toFixed(1)}s</span>
              </div>
            )}
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
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow transition-all"
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
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">🧮 MATH CHALLENGE</h2>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {questionsAnswered}/20
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

        {/* Question */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-4">
          <div className="text-center mb-4">
            <div className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">
              {currentQuestion.question} = ?
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="number"
              step="any"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Your answer..."
              className="w-full p-3 text-center text-2xl font-bold rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
              autoComplete="off"
            />
            
            {feedback.message && (
              <div className={`mt-2 text-center text-sm font-medium ${feedback.type === 'correct' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {feedback.message}
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-3 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow transition-all"
            >
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
