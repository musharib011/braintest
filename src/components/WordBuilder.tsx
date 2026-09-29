import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, PlayerData } from '../game/types';
import { BuilderGameState, createBuilderGameState, validateBuilderWord, calculateBuilderWordScore, calculateBuilderRewards } from '../game/wordLogic';
import { formatTime } from '../game/logic';
import { getSkinById } from '../game/content';

interface WordBuilderProps {
  difficulty: Difficulty;
  playerData: PlayerData;
  onGameComplete: (result: {
    score: number;
    wordsFound: number;
    maxCombo: number;
    longestWord: string;
    timeElapsed: number;
    perfectRun: boolean;
    coinsEarned: number;
    xpEarned: number;
  }) => void;
  onBack: () => void;
  onNotification: (type: 'xp' | 'coins' | 'combo' | 'achievement' | 'levelup' | 'streak' | 'perfect' | 'daily', message: string, icon?: string) => void;
  soundEnabled: boolean;
}

export const WordBuilder: React.FC<WordBuilderProps> = ({
  difficulty, playerData, onGameComplete, onBack, onNotification, soundEnabled
}) => {
  const [gameState, setGameState] = useState<BuilderGameState>(() => createBuilderGameState(difficulty));
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [showResult, setShowResult] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  // Timer
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameFinished) {
      timerRef.current = window.setInterval(() => {
        setGameState(prev => {
          const newTime = prev.timeElapsed + 1;
          if (newTime >= prev.timeLimit) {
            // Time's up
            if (timerRef.current !== null) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            const perfectRun = prev.foundWords.length >= prev.validWords.length * 0.8;
            const rewards = calculateBuilderRewards(prev.foundWords.length, prev.score, difficulty, perfectRun);
            
            setTimeout(() => {
              setShowResult(true);
              onGameComplete({
                score: prev.score,
                wordsFound: prev.foundWords.length,
                maxCombo: prev.maxCombo,
                longestWord: prev.longestWord,
                timeElapsed: prev.timeLimit,
                perfectRun,
                coinsEarned: rewards.coins,
                xpEarned: rewards.xp,
              });
            }, 500);
            
            return { ...prev, timeElapsed: prev.timeLimit, gameFinished: true, perfectRun };
          }
          return { ...prev, timeElapsed: newTime };
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState.gameStarted, gameState.gameFinished, difficulty, onGameComplete]);

  // Focus input
  useEffect(() => {
    if (!gameState.gameFinished && !showResult) {
      inputRef.current?.focus();
    }
  }, [gameState.gameFinished, showResult]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (gameState.gameFinished || !userInput.trim()) return;

    if (!gameState.gameStarted) {
      setGameState(prev => ({ ...prev, gameStarted: true }));
    }

    const validation = validateBuilderWord(
      userInput,
      gameState.letters,
      gameState.foundWords,
      gameState.validWords
    );

    if (validation.valid) {
      const word = userInput.trim().toUpperCase();
      const newCombo = gameState.combo + 1;
      const newMaxCombo = Math.max(gameState.maxCombo, newCombo);
      const wordScore = calculateBuilderWordScore(word, newCombo);
      const newLongestWord = word.length > gameState.longestWord.length ? word : gameState.longestWord;
      
      setFeedback({ type: 'success', message: `✓ ${word}! +${wordScore} points` });
      
      setGameState(prev => ({
        ...prev,
        foundWords: [...prev.foundWords, word],
        score: prev.score + wordScore,
        combo: newCombo,
        maxCombo: newMaxCombo,
        longestWord: newLongestWord,
        attempts: prev.attempts + 1,
      }));

      setUserInput('');

      // Bonus notifications
      if (word.length >= 7) {
        onNotification('combo', `MEGA WORD! ${word}`, '🎉');
      } else if (word.length >= 5) {
        onNotification('combo', `Long word! ${word}`, '⭐');
      }
      if (newCombo >= 3) {
        onNotification('combo', `Combo x${newCombo}!`, '🔥');
      }

      setTimeout(() => setFeedback({ type: null, message: '' }), 1500);
    } else {
      setFeedback({ type: 'error', message: validation.message });
      setGameState(prev => ({
        ...prev,
        combo: 0,
        attempts: prev.attempts + 1,
        perfectRun: false,
      }));
      setUserInput('');
      setTimeout(() => setFeedback({ type: null, message: '' }), 1500);
    }
  }, [gameState, userInput, onNotification]);

  const handleHint = useCallback(() => {
    if (playerData.coins < 25) {
      onNotification('coins', 'Not enough coins!', '🪙');
      return;
    }

    // Find an unfound word
    const unfound = gameState.validWords.filter(w => !gameState.foundWords.includes(w));
    if (unfound.length === 0) return;

    const randomWord = unfound[Math.floor(Math.random() * unfound.length)];
    const hint = `${randomWord[0]}${'_'.repeat(randomWord.length - 1)} (${randomWord.length} letters)`;
    
    onNotification('coins', `Hint: ${hint}`, '💡');
    setGameState(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
  }, [gameState, playerData.coins, onNotification]);

  const skin = getSkinById(playerData.equippedSkin);
  const timeRemaining = gameState.timeLimit - gameState.timeElapsed;
  const progressPercent = (gameState.foundWords.length / Math.max(1, gameState.validWords.length)) * 100;

  if (showResult) {
    const rewards = calculateBuilderRewards(gameState.foundWords.length, gameState.score, difficulty, gameState.perfectRun);
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
              <span className="text-gray-600 dark:text-gray-300">Words Found</span>
              <span className="font-bold">{gameState.foundWords.length}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Longest Word</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">{gameState.longestWord || '—'}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Best Combo</span>
              <span className="font-bold text-orange-600 dark:text-orange-400">x{gameState.maxCombo}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Possible Words</span>
              <span className="font-bold">{gameState.validWords.length}</span>
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
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">+{rewards.coins}</div>
                <div className="text-xs text-gray-500">🪙 Coins</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">+{rewards.xp}</div>
                <div className="text-xs text-gray-500">✨ XP</div>
              </div>
            </div>
          </div>

          {/* Found words list */}
          <div className="mb-4 max-h-32 overflow-y-auto">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Words Found:</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {gameState.foundWords.map((word, i) => (
                <span key={i} className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                  {word}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                setGameState(createBuilderGameState(difficulty));
                setShowResult(false);
                setUserInput('');
                setFeedback({ type: null, message: '' });
              }}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl shadow transition-all"
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
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">🔤 WORD BUILDER</h2>
          <div className={`text-sm font-bold ${timeRemaining <= 10 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-gray-500 dark:text-gray-400'}`}>
            ⏱️ {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{gameState.score}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">Words</div>
            <div className="text-lg font-bold">{gameState.foundWords.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">Combo</div>
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">x{gameState.combo}</div>
          </div>
        </div>

        {/* Letters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 mb-4">
          <div className="flex justify-center gap-2 mb-4 flex-wrap">
            {gameState.letters.map((letter, i) => (
              <div
                key={i}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg font-bold text-lg sm:text-xl border-2 transition-all"
                style={{
                  background: skin?.cardBack || 'linear-gradient(135deg, #f97316, #f59e0b)',
                  borderColor: skin?.accent || '#f97316',
                  color: '#ffffff',
                }}
              >
                {letter}
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Found: {gameState.foundWords.length}</span>
              <span>Possible: {gameState.validWords.length}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
              placeholder="Type a word..."
              className="w-full p-3 text-center text-lg font-bold rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-orange-500 focus:outline-none transition-colors"
              autoComplete="off"
              autoCapitalize="off"
            />
            
            {/* Feedback */}
            {feedback.message && (
              <div className={`mt-2 text-center text-sm font-medium ${feedback.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {feedback.message}
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl shadow transition-all"
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
            </div>
          </form>
        </div>

        {/* Found Words */}
        {gameState.foundWords.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Words Found:</p>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {gameState.foundWords.map((word, i) => (
                <span key={i} className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
