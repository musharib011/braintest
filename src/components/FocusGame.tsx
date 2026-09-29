import React, { useState, useEffect, useRef } from 'react';
import { Difficulty, PlayerData } from '../game/types';
import { createFocusGameState, generateFocusTargets, calculateFocusRewards, FocusGameState, FocusTarget } from '../game/focusLogic';

interface FocusGameProps {
  difficulty: Difficulty;
  playerData: PlayerData;
  onGameComplete: (result: {
    score: number;
    correctHits: number;
    falseHits: number;
    missedTargets: number;
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

export const FocusGame: React.FC<FocusGameProps> = ({
  difficulty, playerData, onGameComplete, onBack, onNotification, soundEnabled
}) => {
  const [gameState, setGameState] = useState<FocusGameState>(() => createFocusGameState(difficulty));
  const [gameFinished, setGameFinished] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const roundTimerRef = useRef<number | null>(null);

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

  // Generate new targets every few seconds
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameFinished) {
      const generateRound = () => {
        const rules = [
          { rule: 'Tap all RED circles', targetColor: 'red', targetShape: 'circle' as const },
          { rule: 'Tap all BLUE squares', targetColor: 'blue', targetShape: 'square' as const },
          { rule: 'Tap all GREEN triangles', targetColor: 'green', targetShape: 'triangle' as const },
          { rule: 'Tap all YELLOW circles', targetColor: 'yellow', targetShape: 'circle' as const },
        ];
        const rule = rules[Math.floor(Math.random() * rules.length)];
        const targets = generateFocusTargets(difficulty, rule);
        
        setGameState(prev => ({
          ...prev,
          targets,
          currentRule: rule.rule,
          round: prev.round + 1,
        }));
      };

      // Initial generation
      if (gameState.targets.length === 0) {
        generateRound();
      }

      // Generate new targets every 4 seconds
      roundTimerRef.current = window.setInterval(generateRound, 4000);
    }

    return () => {
      if (roundTimerRef.current !== null) {
        clearInterval(roundTimerRef.current);
        roundTimerRef.current = null;
      }
    };
  }, [gameState.gameStarted, gameState.gameFinished, difficulty]);

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
    if (roundTimerRef.current !== null) {
      clearInterval(roundTimerRef.current);
      roundTimerRef.current = null;
    }
    
    const perfectRun = gameState.falseHits === 0 && gameState.missedTargets === 0 && gameState.correctHits > 0;
    const rewards = calculateFocusRewards(gameState.correctHits, gameState.score, difficulty, gameState.maxCombo, perfectRun);
    
    onGameComplete({
      score: gameState.score,
      correctHits: gameState.correctHits,
      falseHits: gameState.falseHits,
      missedTargets: gameState.missedTargets,
      maxCombo: gameState.maxCombo,
      timeElapsed: gameState.timeElapsed,
      perfectRun,
      fastestReaction: gameState.fastestReaction,
      coinsEarned: rewards.coins,
      xpEarned: rewards.xp,
    });
  };

  const handleTargetClick = (target: FocusTarget) => {
    if (gameState.gameFinished) return;

    if (!gameState.gameStarted) {
      setGameState(prev => ({ ...prev, gameStarted: true }));
    }

    const reactionTime = (Date.now() - target.appearedAt) / 1000;

    if (target.isTarget) {
      // Correct hit
      const newCombo = gameState.combo + 1;
      const newMaxCombo = Math.max(gameState.maxCombo, newCombo);
      const points = Math.round(10 * (1 + (newCombo - 1) * 0.1));
      
      setGameState(prev => ({
        ...prev,
        targets: prev.targets.filter(t => t.id !== target.id),
        score: prev.score + points,
        combo: newCombo,
        maxCombo: newMaxCombo,
        correctHits: prev.correctHits + 1,
        fastestReaction: prev.fastestReaction === null || reactionTime < prev.fastestReaction ? reactionTime : prev.fastestReaction,
      }));

      if (newCombo >= 3) {
        onNotification('combo', `Combo x${newCombo}!`, '🔥');
      }
    } else {
      // False hit
      setGameState(prev => ({
        ...prev,
        combo: 0,
        falseHits: prev.falseHits + 1,
        perfectRun: false,
        score: Math.max(0, prev.score - 5),
      }));
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getShapeStyle = (shape: string, color: string) => {
    const colorMap: Record<string, string> = {
      red: '#ef4444',
      blue: '#3b82f6',
      green: '#22c55e',
      yellow: '#eab308',
      purple: '#a855f7',
      orange: '#f97316',
    };
    
    const bgColor = colorMap[color] || '#6b7280';
    
    switch (shape) {
      case 'circle':
        return { backgroundColor: bgColor, borderRadius: '50%' };
      case 'square':
        return { backgroundColor: bgColor, borderRadius: '8px' };
      case 'triangle':
        return {
          width: 0,
          height: 0,
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderBottom: `35px solid ${bgColor}`,
          backgroundColor: 'transparent',
        };
      default:
        return { backgroundColor: bgColor };
    }
  };

  if (gameFinished) {
    const perfectRun = gameState.falseHits === 0 && gameState.missedTargets === 0 && gameState.correctHits > 0;
    const rewards = calculateFocusRewards(gameState.correctHits, gameState.score, difficulty, gameState.maxCombo, perfectRun);
    
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
              <span className="text-gray-600 dark:text-gray-300">Correct Hits</span>
              <span className="font-bold text-green-600 dark:text-green-400">{gameState.correctHits}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">False Hits</span>
              <span className="font-bold text-red-600 dark:text-red-400">{gameState.falseHits}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Best Combo</span>
              <span className="font-bold text-orange-600 dark:text-orange-400">x{gameState.maxCombo}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Time</span>
              <span className="font-bold">{formatTime(gameState.timeElapsed)}</span>
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
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl shadow transition-all"
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
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">🎯 FOCUS GAME</h2>
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
            <div className="text-xs text-gray-500 dark:text-gray-400">Hits</div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">{gameState.correctHits}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">Combo</div>
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">x{gameState.combo}</div>
          </div>
        </div>

        {/* Rule */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mb-4 text-center">
          <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{gameState.currentRule}</p>
        </div>

        {/* Game Area */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700" style={{ height: '400px' }}>
          {gameState.targets.map(target => (
            <button
              key={target.id}
              onClick={() => handleTargetClick(target)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                ...getShapeStyle(target.shape, target.color),
                width: target.shape !== 'triangle' ? `${target.size}px` : '0',
                height: target.shape !== 'triangle' ? `${target.size}px` : '0',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
