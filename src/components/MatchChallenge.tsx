import React, { useState, useEffect, useRef } from 'react';
import { Difficulty, PlayerData } from '../game/types';
import { createMatchChallengeState, calculateMatchRewards, MatchChallengeState } from '../game/matchLogic';

interface MatchChallengeProps {
  difficulty: Difficulty;
  playerData: PlayerData;
  onGameComplete: (result: {
    score: number;
    matchesFound: number;
    attempts: number;
    maxCombo: number;
    timeElapsed: number;
    perfectRun: boolean;
    fastestReaction: number | null;
    coinsEarned: number;
    xpEarned: number;
  }) => void;
  onBack: () => void;
  onNotification: (type: 'xp' | 'coins' | 'combo' | 'achievement' | 'levelup' | 'streak' | 'perfect' | 'daily', message: string, icon?: string) => void;
  soundEnabled: boolean;
}

export const MatchChallenge: React.FC<MatchChallengeProps> = ({
  difficulty, playerData, onGameComplete, onBack, onNotification, soundEnabled
}) => {
  const [gameState, setGameState] = useState<MatchChallengeState>(() => createMatchChallengeState(difficulty));
  const [gameFinished, setGameFinished] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameFinished) {
      timerRef.current = window.setInterval(() => {
        setGameState(prev => {
          const newTime = prev.timeElapsed + 1;
          if (newTime >= prev.timeLimit) {
            return { ...prev, timeElapsed: newTime, gameFinished: true };
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
  }, [gameState.gameStarted, gameState.gameFinished]);

  useEffect(() => {
    if (gameState.matchesFound === gameState.totalMatches && gameState.totalMatches > 0 && !gameFinished) {
      finishGame();
    }
  }, [gameState.matchesFound, gameState.totalMatches, gameFinished]);

  useEffect(() => {
    if (gameState.gameFinished && !gameFinished) {
      finishGame();
    }
  }, [gameState.gameFinished, gameFinished]);

  const finishGame = () => {
    setGameFinished(true);
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const rewards = calculateMatchRewards(
      gameState.matchesFound,
      gameState.score,
      difficulty,
      gameState.maxCombo,
      gameState.attempts,
      gameState.perfectRun
    );
    
    onGameComplete({
      score: gameState.score,
      matchesFound: gameState.matchesFound,
      attempts: gameState.attempts,
      maxCombo: gameState.maxCombo,
      timeElapsed: gameState.timeElapsed,
      perfectRun: gameState.perfectRun,
      fastestReaction: gameState.fastestReaction,
      coinsEarned: rewards.coins,
      xpEarned: rewards.xp,
    });
  };

  const handleItemClick = (itemId: number) => {
    if (gameState.gameFinished) return;

    if (!gameState.gameStarted) {
      setGameState(prev => ({ ...prev, gameStarted: true }));
    }

    const clickedItem = gameState.items.find(i => i.id === itemId);
    if (!clickedItem || clickedItem.matched) return;

    const reactionTime = (Date.now() - gameState.lastSelectionTime) / 1000;

    if (gameState.selected === null) {
      setGameState(prev => ({ ...prev, selected: itemId, lastSelectionTime: Date.now() }));
    } else {
      const selectedItem = gameState.items.find(i => i.id === gameState.selected);
      if (!selectedItem) return;

      const newAttempts = gameState.attempts + 1;
      
      if (selectedItem.matchId === clickedItem.matchId && selectedItem.id !== clickedItem.id) {
        // Match!
        const newCombo = gameState.combo + 1;
        const newMaxCombo = Math.max(gameState.maxCombo, newCombo);
        const points = Math.round(20 * (1 + (newCombo - 1) * 0.1));
        
        setGameState(prev => ({
          ...prev,
          items: prev.items.map(i => 
            i.matchId === selectedItem.matchId ? { ...i, matched: true } : i
          ),
          selected: null,
          matchesFound: prev.matchesFound + 1,
          attempts: newAttempts,
          score: prev.score + points,
          combo: newCombo,
          maxCombo: newMaxCombo,
          fastestReaction: prev.fastestReaction === null || reactionTime < prev.fastestReaction ? reactionTime : prev.fastestReaction,
          lastSelectionTime: Date.now(),
        }));

        if (newCombo >= 3) {
          onNotification('combo', `Combo x${newCombo}!`, '🔥');
        }
      } else {
        // No match
        setGameState(prev => ({
          ...prev,
          selected: null,
          attempts: newAttempts,
          combo: 0,
          perfectRun: false,
          lastSelectionTime: Date.now(),
        }));
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameFinished) {
    const rewards = calculateMatchRewards(
      gameState.matchesFound,
      gameState.score,
      difficulty,
      gameState.maxCombo,
      gameState.attempts,
      gameState.perfectRun
    );
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl animate-scale-in text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Challenge Complete!</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Score</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{gameState.score}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Matches</span>
              <span className="font-bold">{gameState.matchesFound}/{gameState.totalMatches}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Attempts</span>
              <span className="font-bold">{gameState.attempts}</span>
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
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow transition-all"
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

  const timeRemaining = gameState.timeLimit - gameState.timeElapsed;

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <span className="text-xl">←</span>
          </button>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">🔗 MATCH CHALLENGE</h2>
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
            <div className="text-xs text-gray-500 dark:text-gray-400">Matches</div>
            <div className="text-lg font-bold">{gameState.matchesFound}/{gameState.totalMatches}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">Combo</div>
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">x{gameState.combo}</div>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {gameState.items.map(item => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                disabled={item.matched}
                className={`
                  aspect-square rounded-xl font-bold text-sm sm:text-base transition-all
                  ${item.matched 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 opacity-50 cursor-not-allowed' 
                    : gameState.selected === item.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-2 border-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                {item.content}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
