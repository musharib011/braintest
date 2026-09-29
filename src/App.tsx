import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, GameState, BestScore } from './game/types';
import { createInitialGameState, calculateScore, calculateAccuracy } from './game/logic';
import { loadBestScore, saveBestScore, isNewBestScore, loadSoundEnabled, saveSoundEnabled, loadTheme, saveTheme } from './game/storage';
import { playFlipSound, playMatchSound, playMismatchSound, playWinSound, playClickSound } from './game/sounds';
import { GameMenu } from './components/GameMenu';
import { GameBoard } from './components/GameBoard';
import { GameHUD } from './components/GameHUD';
import { GameOverScreen } from './components/GameOverScreen';
import { PauseOverlay } from './components/PauseOverlay';
import { HowToPlay } from './components/HowToPlay';

type Screen = 'menu' | 'game';

function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState('easy'));
  const [soundEnabled, setSoundEnabled] = useState<boolean>(loadSoundEnabled);
  const [theme, setTheme] = useState<'light' | 'dark'>(loadTheme);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);
  const [bestScore, setBestScore] = useState<BestScore | null>(null);
  
  const timerRef = useRef<number | null>(null);
  const mismatchTimeoutRef = useRef<number | null>(null);
  const soundEnabledRef = useRef(soundEnabled);

  // Keep ref in sync
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  const playSoundIfEnabled = useCallback((soundFn: () => void) => {
    if (soundEnabledRef.current) soundFn();
  }, []);

  // Timer logic
  useEffect(() => {
    if (screen !== 'game') return;
    
    if (gameState.gameStarted && !gameState.gameFinished && !gameState.paused) {
      timerRef.current = window.setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1,
        }));
      }, 1000);
    }
    
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [screen, gameState.gameStarted, gameState.gameFinished, gameState.paused]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
      if (mismatchTimeoutRef.current !== null) clearTimeout(mismatchTimeoutRef.current);
    };
  }, []);

  const clearMismatchTimeout = useCallback(() => {
    if (mismatchTimeoutRef.current !== null) {
      clearTimeout(mismatchTimeoutRef.current);
      mismatchTimeoutRef.current = null;
    }
  }, []);

  const handleStartGame = useCallback(() => {
    playSoundIfEnabled(playClickSound);
    const newState = createInitialGameState(difficulty);
    setGameState(newState);
    setScreen('game');
    setIsNewBest(false);
    setBestScore(loadBestScore(difficulty));
  }, [difficulty, playSoundIfEnabled]);

  const handleRestart = useCallback(() => {
    playSoundIfEnabled(playClickSound);
    clearMismatchTimeout();
    const newState = createInitialGameState(difficulty);
    setGameState(newState);
    setIsNewBest(false);
    setBestScore(loadBestScore(difficulty));
  }, [difficulty, playSoundIfEnabled, clearMismatchTimeout]);

  const handleQuitToMenu = useCallback(() => {
    playSoundIfEnabled(playClickSound);
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    clearMismatchTimeout();
    setScreen('menu');
  }, [playSoundIfEnabled, clearMismatchTimeout]);

  const handlePause = useCallback(() => {
    playSoundIfEnabled(playClickSound);
    setGameState(prev => ({ ...prev, paused: true }));
  }, [playSoundIfEnabled]);

  const handleResume = useCallback(() => {
    playSoundIfEnabled(playClickSound);
    setGameState(prev => ({ ...prev, paused: false }));
  }, [playSoundIfEnabled]);

  const handleCardClick = useCallback((cardId: number) => {
    setGameState(prev => {
      if (prev.locked || prev.paused || prev.gameFinished) return prev;
      
      const clickedCard = prev.cards.find(c => c.id === cardId);
      if (!clickedCard || clickedCard.state === 'matched' || clickedCard.state === 'revealed') return prev;
      
      // Reveal the clicked card
      const newCards = prev.cards.map(c => 
        c.id === cardId ? { ...c, state: 'revealed' as const } : c
      );
      
      if (prev.firstCard === null) {
        // First card selected - play flip sound
        playSoundIfEnabled(playFlipSound);
        return {
          ...prev,
          cards: newCards,
          firstCard: cardId,
          gameStarted: true,
        };
      }
      
      // Second card selected
      const firstCardObj = prev.cards.find(c => c.id === prev.firstCard);
      if (!firstCardObj) return prev;
      
      // Can't click same card
      if (prev.firstCard === cardId) return prev;
      
      const newMoves = prev.moves + 1;
      const newAttempts = prev.totalAttempts + 1;
      
      if (firstCardObj.pairId === clickedCard.pairId) {
        // MATCH!
        playSoundIfEnabled(playMatchSound);
        
        const matchedCards = newCards.map(c => 
          c.id === prev.firstCard || c.id === cardId 
            ? { ...c, state: 'matched' as const } 
            : c
        );
        
        const newMatchedPairs = prev.matchedPairs + 1;
        const isGameFinished = newMatchedPairs === prev.totalPairs;
        
        if (isGameFinished) {
          const finalScore = calculateScore(newMatchedPairs, newMoves, prev.timeElapsed, prev.difficulty);
          const finalAccuracy = calculateAccuracy(newMatchedPairs, newAttempts);
          
          const newBest = isNewBestScore(prev.difficulty, finalScore);
          if (newBest) {
            saveBestScore(prev.difficulty, {
              score: finalScore,
              time: prev.timeElapsed,
              moves: newMoves,
              accuracy: finalAccuracy,
            });
          }
          setIsNewBest(newBest);
          setBestScore(loadBestScore(prev.difficulty));
          
          setTimeout(() => playSoundIfEnabled(playWinSound), 300);
          
          return {
            ...prev,
            cards: matchedCards,
            score: finalScore,
            moves: newMoves,
            matchedPairs: newMatchedPairs,
            totalAttempts: newAttempts,
            firstCard: null,
            secondCard: null,
            locked: false,
            gameStarted: true,
            gameFinished: true,
          };
        }
        
        return {
          ...prev,
          cards: matchedCards,
          moves: newMoves,
          matchedPairs: newMatchedPairs,
          totalAttempts: newAttempts,
          firstCard: null,
          secondCard: null,
          locked: false,
          gameStarted: true,
        };
      } else {
        // MISMATCH
        playSoundIfEnabled(playMismatchSound);
        
        // Schedule flip-back
        clearMismatchTimeout();
        mismatchTimeoutRef.current = window.setTimeout(() => {
          setGameState(prevState => {
            const hiddenCards = prevState.cards.map(c => 
              (c.id === prevState.firstCard || c.id === prevState.secondCard) && c.state === 'revealed'
                ? { ...c, state: 'hidden' as const }
                : c
            );
            return {
              ...prevState,
              cards: hiddenCards,
              firstCard: null,
              secondCard: null,
              locked: false,
            };
          });
          mismatchTimeoutRef.current = null;
        }, 900);
        
        return {
          ...prev,
          cards: newCards,
          moves: newMoves,
          totalAttempts: newAttempts,
          secondCard: cardId,
          locked: true,
          gameStarted: true,
        };
      }
    });
  }, [playSoundIfEnabled, clearMismatchTimeout]);

  const handleToggleSound = useCallback(() => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    saveSoundEnabled(newValue);
  }, [soundEnabled]);

  const handleToggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const handleDifficultyChange = useCallback((d: Difficulty) => {
    playSoundIfEnabled(playClickSound);
    setDifficulty(d);
  }, [playSoundIfEnabled]);

  const accuracy = gameState.totalAttempts > 0 
    ? calculateAccuracy(gameState.matchedPairs, gameState.totalAttempts) 
    : 0;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-indigo-50'}`}>
      {screen === 'menu' && (
        <GameMenu
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          onStartGame={handleStartGame}
          onShowHowToPlay={() => setShowHowToPlay(true)}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      )}
      
      {screen === 'game' && (
        <div className="min-h-screen flex flex-col items-center p-3 sm:p-4 pt-4 sm:pt-6">
          <GameHUD
            score={gameState.score}
            moves={gameState.moves}
            timeElapsed={gameState.timeElapsed}
            matchedPairs={gameState.matchedPairs}
            totalPairs={gameState.totalPairs}
            accuracy={accuracy}
            difficulty={gameState.difficulty}
            onPause={handlePause}
            onRestart={handleRestart}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
          
          <GameBoard
            cards={gameState.cards}
            difficulty={gameState.difficulty}
            locked={gameState.locked}
            onCardClick={handleCardClick}
            paused={gameState.paused}
          />
        </div>
      )}
      
      {/* Overlays */}
      {gameState.gameFinished && screen === 'game' && (
        <GameOverScreen
          score={gameState.score}
          timeElapsed={gameState.timeElapsed}
          moves={gameState.moves}
          accuracy={accuracy}
          difficulty={gameState.difficulty}
          isNewBest={isNewBest}
          bestScore={bestScore}
          onPlayAgain={handleRestart}
          onChangeDifficulty={handleQuitToMenu}
        />
      )}
      
      {gameState.paused && !gameState.gameFinished && screen === 'game' && (
        <PauseOverlay
          onResume={handleResume}
          onRestart={handleRestart}
          onQuitToMenu={handleQuitToMenu}
        />
      )}
      
      {showHowToPlay && (
        <HowToPlay onClose={() => setShowHowToPlay(false)} />
      )}
    </div>
  );
}

export default App;
