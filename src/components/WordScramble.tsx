import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, PlayerData } from '../game/types';
import { ScrambleGameState, createScrambleGameState, validateAnswer, calculateScrambleScore, calculateScrambleRewards, scrambleWord, getRandomWord } from '../game/wordLogic';
import { formatTime } from '../game/logic';
import { getSkinById } from '../game/content';

interface WordScrambleProps {
  difficulty: Difficulty;
  playerData: PlayerData;
  onGameComplete: (result: {
    score: number;
    wordsSolved: number;
    maxCombo: number;
    timeElapsed: number;
    perfectRun: boolean;
    coinsEarned: number;
    xpEarned: number;
  }) => void;
  onBack: () => void;
  onNotification: (type: 'xp' | 'coins' | 'combo' | 'achievement' | 'levelup' | 'streak' | 'perfect' | 'daily', message: string, icon?: string) => void;
  soundEnabled: boolean;
}

export const WordScramble: React.FC<WordScrambleProps> = ({
  difficulty, playerData, onGameComplete, onBack, onNotification, soundEnabled
}) => {
  const [gameState, setGameState] = useState<ScrambleGameState>(() => createScrambleGameState(difficulty));
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong' | null; message: string }>({ type: null, message: '' });
  const [showResult, setShowResult] = useState(false);
  const [wordsInRound, setWordsInRound] = useState(5); // Number of words per round
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  // Timer
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameFinished) {
      timerRef.current = window.setInterval(() => {
        setGameState(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 1000);
    }
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState.gameStarted, gameState.gameFinished]);

  // Focus input
  useEffect(() => {
    if (!gameState.gameFinished && !showResult) {
      inputRef.current?.focus();
    }
  }, [gameState.currentWord, gameState.gameFinished, showResult]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!gameState.currentWord || gameState.gameFinished) return;

    if (!gameState.gameStarted) {
      setGameState(prev => ({ ...prev, gameStarted: true }));
    }

    const isCorrect = validateAnswer(gameState.userInput, gameState.currentWord.word);
    const newAttempts = gameState.attempts + 1;

    if (isCorrect) {
      const newCombo = gameState.combo + 1;
      const newMaxCombo = Math.max(gameState.maxCombo, newCombo);
      const wordScore = calculateScrambleScore(
        gameState.currentWord,
        gameState.timeElapsed,
        newAttempts,
        gameState.hintsUsed,
        newCombo
      );

      setFeedback({ type: 'correct', message: `🎉 Correct! +${wordScore} points` });
      
      const newWordsSolved = gameState.wordsSolved + 1;
      const newIndex = currentWordIndex + 1;

      if (newIndex >= wordsInRound) {
        // Round complete
        const finalScore = gameState.score + wordScore;
        const perfectRun = gameState.perfectRun && newAttempts === 1;
        const rewards = calculateScrambleRewards(newWordsSolved, finalScore, difficulty, perfectRun);

        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            score: finalScore,
            combo: newCombo,
            maxCombo: newMaxCombo,
            wordsSolved: newWordsSolved,
            attempts: 0,
            gameFinished: true,
            perfectRun,
          }));
          setShowResult(true);
          onGameComplete({
            score: finalScore,
            wordsSolved: newWordsSolved,
            maxCombo: newMaxCombo,
            timeElapsed: gameState.timeElapsed,
            perfectRun,
            coinsEarned: rewards.coins,
            xpEarned: rewards.xp,
          });
        }, 1000);
      } else {
        // Next word
        setTimeout(() => {
          const nextWord = getRandomWord(difficulty);
          setGameState(prev => ({
            ...prev,
            score: prev.score + wordScore,
            combo: newCombo,
            maxCombo: newMaxCombo,
            wordsSolved: newWordsSolved,
            attempts: 0,
            currentWord: nextWord,
            scrambledLetters: scrambleWord(nextWord.word),
            userInput: '',
            revealedLetters: new Array(nextWord.word.length).fill(false),
            showDefinition: false,
          }));
          setCurrentWordIndex(newIndex);
          setFeedback({ type: null, message: '' });
        }, 1000);
      }
    } else {
      setFeedback({ type: 'wrong', message: '❌ Not quite! Try again.' });
      const newPerfectRun = false;
      
      if (newAttempts >= gameState.maxAttempts) {
        // Skip this word
        const newIndex = currentWordIndex + 1;
        if (newIndex >= wordsInRound) {
          const rewards = calculateScrambleRewards(gameState.wordsSolved, gameState.score, difficulty, false);
          setTimeout(() => {
            setGameState(prev => ({
              ...prev,
              attempts: 0,
              combo: 0,
              gameFinished: true,
              perfectRun: false,
            }));
            setShowResult(true);
            onGameComplete({
              score: gameState.score,
              wordsSolved: gameState.wordsSolved,
              maxCombo: gameState.maxCombo,
              timeElapsed: gameState.timeElapsed,
              perfectRun: false,
              coinsEarned: rewards.coins,
              xpEarned: rewards.xp,
            });
          }, 1000);
        } else {
          setTimeout(() => {
            const nextWord = getRandomWord(difficulty);
            setGameState(prev => ({
              ...prev,
              attempts: 0,
              combo: 0,
              currentWord: nextWord,
              scrambledLetters: scrambleWord(nextWord.word),
              userInput: '',
              revealedLetters: new Array(nextWord.word.length).fill(false),
              showDefinition: false,
              perfectRun: false,
            }));
            setCurrentWordIndex(newIndex);
            setFeedback({ type: null, message: '' });
          }, 1000);
        }
      } else {
        setGameState(prev => ({
          ...prev,
          attempts: newAttempts,
          userInput: '',
          perfectRun: newPerfectRun,
        }));
      }
    }
  }, [gameState, difficulty, currentWordIndex, wordsInRound, onGameComplete]);

  const handleHint = useCallback(() => {
    if (!gameState.currentWord || playerData.coins < 25) {
      onNotification('coins', 'Not enough coins!', '🪙');
      return;
    }

    const word = gameState.currentWord.word;
    const unrevealed = gameState.revealedLetters
      .map((revealed, i) => (!revealed ? i : -1))
      .filter(i => i >= 0);

    if (unrevealed.length === 0) return;

    const randomIndex = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    const newRevealed = [...gameState.revealedLetters];
    newRevealed[randomIndex] = true;

    setGameState(prev => ({
      ...prev,
      revealedLetters: newRevealed,
      hintsUsed: prev.hintsUsed + 1,
    }));

    onNotification('coins', '-25 coins', '💡');
  }, [gameState, playerData.coins, onNotification]);

  const handleSkip = useCallback(() => {
    if (!gameState.currentWord) return;
    
    const newIndex = currentWordIndex + 1;
    if (newIndex >= wordsInRound) {
      const rewards = calculateScrambleRewards(gameState.wordsSolved, gameState.score, difficulty, false);
      setGameState(prev => ({
        ...prev,
        combo: 0,
        gameFinished: true,
        perfectRun: false,
      }));
      setShowResult(true);
      onGameComplete({
        score: gameState.score,
        wordsSolved: gameState.wordsSolved,
        maxCombo: gameState.maxCombo,
        timeElapsed: gameState.timeElapsed,
        perfectRun: false,
        coinsEarned: rewards.coins,
        xpEarned: rewards.xp,
      });
    } else {
      const nextWord = getRandomWord(difficulty);
      setGameState(prev => ({
        ...prev,
        attempts: 0,
        combo: 0,
        currentWord: nextWord,
        scrambledLetters: scrambleWord(nextWord.word),
        userInput: '',
        revealedLetters: new Array(nextWord.word.length).fill(false),
        showDefinition: false,
        perfectRun: false,
      }));
      setCurrentWordIndex(newIndex);
      setFeedback({ type: null, message: '' });
    }
  }, [gameState, difficulty, currentWordIndex, wordsInRound, onGameComplete]);

  const skin = getSkinById(playerData.equippedSkin);

  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl animate-scale-in text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Round Complete!</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Score</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{gameState.score}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Words Solved</span>
              <span className="font-bold">{gameState.wordsSolved}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Best Combo</span>
              <span className="font-bold text-orange-600 dark:text-orange-400">x{gameState.maxCombo}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Time</span>
              <span className="font-bold">{formatTime(gameState.timeElapsed)}</span>
            </div>
            {gameState.perfectRun && (
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400 font-bold">
                ✨ Perfect Run!
              </div>
            )}
          </div>

          <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl mb-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Rewards</p>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">+{calculateScrambleRewards(gameState.wordsSolved, gameState.score, difficulty, gameState.perfectRun).coins}</div>
                <div className="text-xs text-gray-500">🪙 Coins</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">+{calculateScrambleRewards(gameState.wordsSolved, gameState.score, difficulty, gameState.perfectRun).xp}</div>
                <div className="text-xs text-gray-500">✨ XP</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                setGameState(createScrambleGameState(difficulty));
                setShowResult(false);
                setCurrentWordIndex(0);
                setFeedback({ type: null, message: '' });
              }}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow transition-all"
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
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">🔀 WORD SCRAMBLE</h2>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {currentWordIndex + 1}/{wordsInRound}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{gameState.score}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">Time</div>
            <div className="text-lg font-bold">{formatTime(gameState.timeElapsed)}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">Combo</div>
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">x{gameState.combo}</div>
          </div>
        </div>

        {/* Scrambled Letters */}
        {gameState.currentWord && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-4">
            <div className="flex justify-center gap-2 mb-4 flex-wrap">
              {gameState.scrambledLetters.map((letter, i) => (
                <div
                  key={i}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg font-bold text-lg sm:text-xl border-2 transition-all"
                  style={{
                    background: skin?.cardBack || 'linear-gradient(135deg, #6366f1, #9333ea)',
                    borderColor: skin?.accent || '#6366f1',
                    color: '#ffffff',
                  }}
                >
                  {letter}
                </div>
              ))}
            </div>

            {/* Revealed letters hint */}
            <div className="flex justify-center gap-1 mb-4">
              {gameState.currentWord.word.split('').map((letter, i) => (
                <div key={i} className="w-8 h-8 flex items-center justify-center rounded border-2 border-gray-300 dark:border-gray-600 text-sm font-bold">
                  {gameState.revealedLetters[i] ? letter : '_'}
                </div>
              ))}
            </div>

            {/* Category hint */}
            {gameState.currentWord.category && (
              <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                Category: {gameState.currentWord.category}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                value={gameState.userInput}
                onChange={(e) => setGameState(prev => ({ ...prev, userInput: e.target.value.toUpperCase() }))}
                placeholder="Type your answer..."
                className="w-full p-3 text-center text-lg font-bold rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-indigo-500 focus:outline-none transition-colors"
                autoComplete="off"
                autoCapitalize="off"
              />
              
              {/* Feedback */}
              {feedback.message && (
                <div className={`mt-2 text-center text-sm font-medium ${feedback.type === 'correct' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {feedback.message}
                </div>
              )}

              <div className="flex gap-2 mt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow transition-all"
                >
                  SUBMIT
                </button>
                <button
                  type="button"
                  onClick={handleHint}
                  className="py-3 px-4 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 font-bold rounded-xl transition-colors"
                  title="Hint (-25 coins)"
                >
                  💡
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-bold rounded-xl transition-colors"
                  title="Skip"
                >
                  ⏭️
                </button>
              </div>
            </form>

            {/* Attempts */}
            <div className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
              Attempts: {gameState.attempts}/{gameState.maxAttempts}
            </div>
          </div>
        )}

        {/* Definition (shown after correct answer) */}
        {feedback.type === 'correct' && gameState.currentWord?.definition && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-700 animate-fade-in">
            <div className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-1">
              📖 {gameState.currentWord.word}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {gameState.currentWord.definition}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
