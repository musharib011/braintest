import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, GameState, BestScore, PlayerData, GameMode } from './game/types';
import { createInitialGameState, calculateScore, calculateAccuracy, addXP, calculateMatchReward, calculateGameCompleteReward, checkDailyChallengeCompletion, updateStreak, getDailyChallenge, isBoosterActive } from './game/logic';
import { calculateScrambleRewards, calculateBuilderRewards } from './game/wordLogic';
import { getTodayString } from './game/storage';
import { loadGameData, saveGameData, resetGameData, loadBestScore, saveBestScore, isNewBestScore } from './game/storage';
import { playFlipSound, playMatchSound, playMismatchSound, playWinSound, playClickSound, playLevelUpSound, playAchievementSound, playComboSound } from './game/sounds';
import { ACHIEVEMENTS, SKINS } from './game/content';
import { GameHub } from './components/GameHub';
import { GameBoard } from './components/GameBoard';
import { GameHUD } from './components/GameHUD';
import { GameOverScreen } from './components/GameOverScreen';
import { PauseOverlay } from './components/PauseOverlay';
import { HowToPlay } from './components/HowToPlay';
import { Shop } from './components/Shop';
import { Achievements } from './components/Achievements';
import { Profile } from './components/Profile';
import { Statistics } from './components/Statistics';
import { DailyChallenge } from './components/DailyChallenge';
import { Notifications, Notification } from './components/Notifications';
import { WordScramble } from './components/WordScramble';
import { WordBuilder } from './components/WordBuilder';
import { SettingsPanel } from './components/SettingsPanel';
import { MathChallenge } from './components/MathChallenge';
import { LogicPuzzles } from './components/LogicPuzzles';
import { MatchChallenge } from './components/MatchChallenge';
import { FocusGame } from './components/FocusGame';
import { PatternRecognition } from './components/PatternRecognition';
import { KnowledgeQuiz } from './components/KnowledgeQuiz';
import { calculateMathRewards } from './game/mathDatabase';
import { calculateLogicRewards } from './game/logicPuzzleLogic';
import { calculateMatchRewards } from './game/matchLogic';
import { calculateFocusRewards } from './game/focusLogic';
import { calculatePatternRewards } from './game/patternLogic';
import { calculateKnowledgeRewards } from './game/knowledgeDatabase';

type Screen = 'hub' | 'memoryFlip' | 'wordScramble' | 'wordBuilder' | 'mathChallenge' | 'logicPuzzles' | 'matchChallenge' | 'focusGame' | 'patternRecognition' | 'knowledgeQuiz';
type Modal = null | 'shop' | 'achievements' | 'profile' | 'statistics' | 'daily' | 'howToPlay' | 'settings';

function App() {
  const [screen, setScreen] = useState<Screen>('hub');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState('easy'));
  const [playerData, setPlayerData] = useState<PlayerData>(() => loadGameData());
  const [modal, setModal] = useState<Modal>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [bestScore, setBestScore] = useState<BestScore | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastGameRewards, setLastGameRewards] = useState({ coins: 0, xp: 0 });
  
  const timerRef = useRef<number | null>(null);
  const mismatchTimeoutRef = useRef<number | null>(null);
  const notifIdRef = useRef(0);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(playerData.settings.theme);
    document.documentElement.setAttribute('data-theme', playerData.settings.theme);
  }, [playerData.settings.theme]);

  // Save player data on change
  useEffect(() => {
    saveGameData(playerData);
  }, [playerData]);

  // Timer
  useEffect(() => {
    if (screen !== 'memoryFlip') return;
    if (gameState.gameStarted && !gameState.gameFinished && !gameState.paused) {
      timerRef.current = window.setInterval(() => {
        setGameState(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 1000);
    }
    return () => {
      if (timerRef.current !== null) { clearInterval(timerRef.current); timerRef.current = null; }
    };
  }, [screen, gameState.gameStarted, gameState.gameFinished, gameState.paused]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
      if (mismatchTimeoutRef.current !== null) clearTimeout(mismatchTimeoutRef.current);
    };
  }, []);

  // Auto-pause on tab hidden
  useEffect(() => {
    if (screen !== 'memoryFlip') return;
    const handleVisibility = () => {
      if (document.hidden && gameState.gameStarted && !gameState.gameFinished && !gameState.paused) {
        setGameState(prev => ({ ...prev, paused: true }));
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [screen, gameState.gameStarted, gameState.gameFinished, gameState.paused]);

  const addNotification = useCallback((type: Notification['type'], message: string, icon?: string) => {
    const id = ++notifIdRef.current;
    setNotifications(prev => [...prev.slice(-4), { id, type, message, icon }]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const playSoundIfEnabled = useCallback((soundFn: () => void) => {
    if (playerData.settings.soundEnabled) soundFn();
  }, [playerData.settings.soundEnabled]);

  const clearMismatchTimeout = useCallback(() => {
    if (mismatchTimeoutRef.current !== null) {
      clearTimeout(mismatchTimeoutRef.current);
      mismatchTimeoutRef.current = null;
    }
  }, []);

  // Check achievements
  const checkAchievements = useCallback((data: PlayerData): PlayerData => {
    const newData = { ...data, achievementsUnlocked: [...data.achievementsUnlocked] };
    let coinsEarned = 0;
    let xpEarned = 0;

    for (const achievement of ACHIEVEMENTS) {
      if (newData.achievementsUnlocked.includes(achievement.id)) continue;

      let current = 0;
      switch (achievement.statKey) {
        case 'totalMoves': current = newData.statistics.totalMoves; break;
        case 'gamesWon': current = newData.statistics.gamesWon; break;
        case 'perfectRuns': current = newData.statistics.perfectRuns; break;
        case 'totalPairsMatched': current = newData.statistics.totalPairsMatched; break;
        case 'highestCombo': current = newData.statistics.highestCombo; break;
        case 'totalCoinsEarned': current = newData.statistics.totalCoinsEarned; break;
        case 'dailyChallengesCompleted': current = newData.statistics.dailyChallengesCompleted; break;
        case 'bestTimeEasy': current = newData.statistics.bestTimeEasy !== null && newData.statistics.bestTimeEasy <= achievement.requirement ? achievement.requirement : 0; break;
        case 'bestTimeMedium': current = newData.statistics.bestTimeMedium !== null && newData.statistics.bestTimeMedium <= achievement.requirement ? achievement.requirement : 0; break;
        case '_level': current = newData.level; break;
        case '_streak': current = newData.streak.longest; break;
        // Word Scramble stats
        case 'scrambleGamesPlayed': current = newData.statistics.scrambleGamesPlayed; break;
        case 'scrambleWordsSolved': current = newData.statistics.scrambleWordsSolved; break;
        case 'scramblePerfectRuns': current = newData.statistics.scramblePerfectRuns; break;
        case 'scrambleHighestCombo': current = newData.statistics.scrambleHighestCombo; break;
        // Word Builder stats
        case 'builderGamesPlayed': current = newData.statistics.builderGamesPlayed; break;
        case 'builderWordsCreated': current = newData.statistics.builderWordsCreated; break;
        case 'builderPerfectRuns': current = newData.statistics.builderPerfectRuns; break;
        case 'builderHighestCombo': current = newData.statistics.builderHighestCombo; break;
        case '_builderLongestWord': current = newData.statistics.builderLongestWord.length; break;
        // Math Challenge stats
        case 'mathGamesPlayed': current = newData.statistics.mathGamesPlayed; break;
        case 'mathQuestionsAnswered': current = newData.statistics.mathQuestionsAnswered; break;
        case 'mathCorrectAnswers': current = newData.statistics.mathCorrectAnswers; break;
        case 'mathHighestCombo': current = newData.statistics.mathHighestCombo; break;
        case '_mathPerfectRun': current = newData.statistics.mathCorrectAnswers > 0 && newData.statistics.mathCorrectAnswers === newData.statistics.mathQuestionsAnswered ? 1 : 0; break;
        // Logic Puzzles stats
        case 'logicGamesPlayed': current = newData.statistics.logicGamesPlayed; break;
        case 'logicPuzzlesSolved': current = newData.statistics.logicPuzzlesSolved; break;
        case 'logicHighestCombo': current = newData.statistics.logicHighestCombo; break;
        case '_logicPerfectRun': current = newData.statistics.logicPuzzlesSolved > 0 ? 1 : 0; break;
        // Match Challenge stats
        case 'matchGamesPlayed': current = newData.statistics.matchGamesPlayed; break;
        case 'matchMatchesMade': current = newData.statistics.matchMatchesMade; break;
        case '_matchFastestReaction': current = newData.statistics.matchFastestReaction !== null && newData.statistics.matchFastestReaction <= achievement.requirement ? 1 : 0; break;
        // Focus Game stats
        case 'focusGamesPlayed': current = newData.statistics.focusGamesPlayed; break;
        case '_focusFastestReaction': current = newData.statistics.focusFastestReaction !== null && newData.statistics.focusFastestReaction <= achievement.requirement ? 1 : 0; break;
        // Pattern Recognition stats
        case 'patternGamesPlayed': current = newData.statistics.patternGamesPlayed; break;
        case 'patternPuzzlesSolved': current = newData.statistics.patternPuzzlesSolved; break;
        case '_patternPerfectRun': current = newData.statistics.patternPuzzlesSolved > 0 ? 1 : 0; break;
        // Knowledge Quiz stats
        case 'knowledgeGamesPlayed': current = newData.statistics.knowledgeGamesPlayed; break;
        case 'knowledgeQuestionsAnswered': current = newData.statistics.knowledgeQuestionsAnswered; break;
        case 'knowledgeCorrectAnswers': current = newData.statistics.knowledgeCorrectAnswers; break;
        case '_knowledgePerfectRun': current = newData.statistics.knowledgeCorrectAnswers > 0 && newData.statistics.knowledgeCorrectAnswers === newData.statistics.knowledgeQuestionsAnswered ? 1 : 0; break;
        // Cross-game stats
        case '_gamesPlayedByMode': {
          const modes = newData.statistics.gamesPlayedByMode;
          current = Object.values(modes).filter(v => v > 0).length;
          break;
        }
        case '_totalGamesAllModes': {
          const m = newData.statistics.gamesPlayedByMode;
          const totalGames = Object.values(m).reduce((sum, val) => sum + val, 0);
          const modesPlayed = Object.values(m).filter(v => v > 0).length;
          current = modesPlayed >= 2 ? totalGames : 0;
          break;
        }
        default: continue;
      }

      if (current >= achievement.requirement) {
        newData.achievementsUnlocked.push(achievement.id);
        coinsEarned += achievement.rewardCoins;
        xpEarned += achievement.rewardXP;
        addNotification('achievement', `${achievement.name} unlocked!`, achievement.icon);
        playSoundIfEnabled(playAchievementSound);
      }
    }

    if (coinsEarned > 0) {
      newData.coins += coinsEarned;
      newData.statistics.totalCoinsEarned += coinsEarned;
      addNotification('coins', `+${coinsEarned} coins`, '🪙');
    }
    if (xpEarned > 0) {
      const result = addXP(newData, xpEarned);
      newData.coins = result.newData.coins;
      newData.xp = result.newData.xp;
      newData.level = result.newData.level;
      newData.totalXPEarned = result.newData.totalXPEarned;
      addNotification('xp', `+${xpEarned} XP`, '✨');
      if (result.levelsGained > 0) {
        addNotification('levelup', `Level ${newData.level}!`, '🎉');
        playSoundIfEnabled(playLevelUpSound);
      }
    }

    return newData;
  }, [addNotification, playSoundIfEnabled]);

  const handleStartGame = useCallback(() => {
    playSoundIfEnabled(playClickSound);
    const newState = createInitialGameState(difficulty);
    setGameState(newState);
    setScreen('memoryFlip');
    setIsNewBest(false);
    setBestScore(loadBestScore(difficulty));
    
    // Game started XP
    setPlayerData(prev => {
      const result = addXP(prev, 5);
      return {
        ...result.newData,
        statistics: { 
          ...result.newData.statistics, 
          gamesPlayed: result.newData.statistics.gamesPlayed + 1,
          gamesPlayedByMode: {
            ...result.newData.statistics.gamesPlayedByMode,
            memoryFlip: result.newData.statistics.gamesPlayedByMode.memoryFlip + 1,
          },
        },
      };
    });
    addNotification('xp', '+5 XP', '✨');
  }, [difficulty, playSoundIfEnabled, addNotification]);

  const handleRestart = useCallback(() => {
    playSoundIfEnabled(playClickSound);
    clearMismatchTimeout();
    const newState = createInitialGameState(difficulty);
    setGameState(newState);
    setIsNewBest(false);
    setBestScore(loadBestScore(difficulty));
    
    setPlayerData(prev => {
      const result = addXP(prev, 5);
      return {
        ...result.newData,
        statistics: { 
          ...result.newData.statistics, 
          gamesPlayed: result.newData.statistics.gamesPlayed + 1,
          gamesPlayedByMode: {
            ...result.newData.statistics.gamesPlayedByMode,
            memoryFlip: result.newData.statistics.gamesPlayedByMode.memoryFlip + 1,
          },
        },
      };
    });
  }, [difficulty, playSoundIfEnabled, clearMismatchTimeout]);

  const handleQuitToMenu = useCallback(() => {
    playSoundIfEnabled(playClickSound);
    if (timerRef.current !== null) { clearInterval(timerRef.current); timerRef.current = null; }
    clearMismatchTimeout();
    setScreen('hub');
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
      
      const newCards = prev.cards.map(c => c.id === cardId ? { ...c, state: 'revealed' as const } : c);
      
      if (prev.firstCard === null) {
        playSoundIfEnabled(playFlipSound);
        return { ...prev, cards: newCards, firstCard: cardId, gameStarted: true };
      }
      
      const firstCardObj = prev.cards.find(c => c.id === prev.firstCard);
      if (!firstCardObj) return prev;
      if (prev.firstCard === cardId) return prev;
      
      const newMoves = prev.moves + 1;
      const newAttempts = prev.totalAttempts + 1;
      
      if (firstCardObj.pairId === clickedCard.pairId) {
        // MATCH
        playSoundIfEnabled(playMatchSound);
        const matchedCards = newCards.map(c => 
          c.id === prev.firstCard || c.id === cardId ? { ...c, state: 'matched' as const } : c
        );
        
        const newMatchedPairs = prev.matchedPairs + 1;
        const newCombo = prev.combo + 1;
        const newMaxCombo = Math.max(prev.maxCombo, newCombo);
        
        // Calculate rewards
        const reward = calculateMatchReward(newCombo);
        
        // Update player data
        setPlayerData(prevData => {
          let newData = {
            ...prevData,
            coins: prevData.coins + reward.coins,
            statistics: {
              ...prevData.statistics,
              totalPairsMatched: prevData.statistics.totalPairsMatched + 1,
              totalMoves: prevData.statistics.totalMoves + 2,
              highestCombo: Math.max(prevData.statistics.highestCombo, newMaxCombo),
              totalCoinsEarned: prevData.statistics.totalCoinsEarned + reward.coins,
            },
          };
          
          const xpResult = addXP(newData, reward.xp);
          newData = xpResult.newData;
          
          if (newCombo >= 2) {
            addNotification('combo', `Combo x${newCombo}!`, '🔥');
            playSoundIfEnabled(() => playComboSound(newCombo));
          }
          if (reward.coins > 0) addNotification('coins', `+${reward.coins}`, '🪙');
          if (reward.xp > 0) addNotification('xp', `+${reward.xp} XP`, '✨');
          if (xpResult.levelsGained > 0) {
            addNotification('levelup', `Level ${newData.level}!`, '🎉');
            playSoundIfEnabled(playLevelUpSound);
          }
          
          return newData;
        });
        
        const isGameFinished = newMatchedPairs === prev.totalPairs;
        
        if (isGameFinished) {
          const finalScore = calculateScore(newMatchedPairs, newMoves, prev.timeElapsed, prev.difficulty);
          const finalAccuracy = calculateAccuracy(newMatchedPairs, newAttempts);
          const perfectRun = prev.perfectRun;
          
          const gameReward = calculateGameCompleteReward(prev.difficulty, finalAccuracy, prev.timeElapsed, perfectRun);
          
          // Update best score
          const newBest = isNewBestScore(prev.difficulty, finalScore);
          if (newBest) {
            saveBestScore(prev.difficulty, { score: finalScore, time: prev.timeElapsed, moves: newMoves, accuracy: finalAccuracy });
          }
          setIsNewBest(newBest);
          setBestScore(loadBestScore(prev.difficulty));
          setLastGameRewards({ coins: gameReward.coins, xp: gameReward.xp });
          
          // Update player data for game completion
          setPlayerData(prevData => {
            let newData = {
              ...prevData,
              coins: prevData.coins + gameReward.coins,
              statistics: {
                ...prevData.statistics,
                gamesWon: prevData.statistics.gamesWon + 1,
                totalCoinsEarned: prevData.statistics.totalCoinsEarned + gameReward.coins,
                perfectRuns: prevData.statistics.perfectRuns + (perfectRun ? 1 : 0),
              },
            };
            
            // Update best times
            const timeKey = `bestTime${prev.difficulty.charAt(0).toUpperCase() + prev.difficulty.slice(1)}` as 'bestTimeEasy' | 'bestTimeMedium' | 'bestTimeHard';
            const currentBest = newData.statistics[timeKey];
            if (currentBest === null || prev.timeElapsed < currentBest) {
              newData.statistics = { ...newData.statistics, [timeKey]: prev.timeElapsed };
            }
            
            // Add XP
            const xpResult = addXP(newData, gameReward.xp);
            newData = xpResult.newData;
            
            if (perfectRun) {
              addNotification('perfect', 'PERFECT RUN!', '✨');
            }
            addNotification('coins', `+${gameReward.coins} coins`, '🪙');
            addNotification('xp', `+${gameReward.xp} XP`, '✨');
            if (xpResult.levelsGained > 0) {
              addNotification('levelup', `Level ${newData.level}!`, '🎉');
              playSoundIfEnabled(playLevelUpSound);
            }
            
            // Check daily challenge
            const gameResult = {
              difficulty: prev.difficulty,
              accuracy: finalAccuracy,
              timeElapsed: prev.timeElapsed,
              moves: newMoves,
              matchedPairs: newMatchedPairs,
              combo: newMaxCombo,
              perfectRun,
              won: true,
            };
            
            // Ensure daily challenge date is set for today
            if (!newData.dailyChallenge.date || newData.dailyChallenge.date !== getTodayString()) {
              newData.dailyChallenge = { date: getTodayString(), challengeId: getDailyChallenge().id, completed: false, progress: 0 };
            }
            
            if (checkDailyChallengeCompletion(newData, gameResult)) {
              const challenge = getDailyChallenge();
              newData.dailyChallenge = { ...newData.dailyChallenge, completed: true };
              newData.coins += challenge.rewardCoins;
              newData.statistics.totalCoinsEarned += challenge.rewardCoins;
              newData.statistics.dailyChallengesCompleted += 1;
              const dailyXpResult = addXP(newData, challenge.rewardXP);
              newData = dailyXpResult.newData;
              addNotification('daily', 'Daily Challenge Complete!', '📅');
              addNotification('coins', `+${challenge.rewardCoins} coins`, '🪙');
              addNotification('xp', `+${challenge.rewardXP} XP`, '✨');
              
              // Update streak
              const streakResult = updateStreak(newData);
              newData = streakResult.newData;
              if (streakResult.streakIncreased) {
                addNotification('streak', `${newData.streak.current} day streak!`, '🔥');
              }
              if (streakResult.milestoneReached) {
                const milestoneCoins = streakResult.milestoneReached * 100;
                newData.coins += milestoneCoins;
                newData.statistics.totalCoinsEarned += milestoneCoins;
                addNotification('coins', `Streak milestone: +${milestoneCoins}`, '🪙');
              }
            }
            
            // Check achievements
            newData = checkAchievements(newData);
            
            return newData;
          });
          
          setTimeout(() => playSoundIfEnabled(playWinSound), 300);
          
          return {
            ...prev, cards: matchedCards, score: finalScore, moves: newMoves,
            matchedPairs: newMatchedPairs, totalAttempts: newAttempts,
            firstCard: null, secondCard: null, locked: false,
            gameStarted: true, gameFinished: true, combo: newCombo,
            maxCombo: newMaxCombo, mismatchedIds: [],
          };
        }
        
        return {
          ...prev, cards: matchedCards, moves: newMoves,
          matchedPairs: newMatchedPairs, totalAttempts: newAttempts,
          firstCard: null, secondCard: null, locked: false,
          gameStarted: true, combo: newCombo, maxCombo: newMaxCombo,
          mismatchedIds: [],
        };
      } else {
        // MISMATCH
        playSoundIfEnabled(playMismatchSound);
        
        clearMismatchTimeout();
        mismatchTimeoutRef.current = window.setTimeout(() => {
          setGameState(prevState => {
            const hiddenCards = prevState.cards.map(c =>
              (c.id === prevState.firstCard || c.id === prevState.secondCard) && c.state === 'revealed'
                ? { ...c, state: 'hidden' as const } : c
            );
            return { ...prevState, cards: hiddenCards, firstCard: null, secondCard: null, locked: false, mismatchedIds: [] };
          });
          mismatchTimeoutRef.current = null;
        }, 900);
        
        // Update stats for moves
        setPlayerData(prevData => ({
          ...prevData,
          statistics: { ...prevData.statistics, totalMoves: prevData.statistics.totalMoves + 2 },
        }));
        
        return {
          ...prev, cards: newCards, moves: newMoves, totalAttempts: newAttempts,
          secondCard: cardId, locked: true, gameStarted: true,
          combo: 0, perfectRun: false, mismatchedIds: [prev.firstCard!, cardId],
        };
      }
    });
  }, [playSoundIfEnabled, clearMismatchTimeout, addNotification, checkAchievements]);

  const handleToggleSound = useCallback(() => {
    setPlayerData(prev => ({
      ...prev,
      settings: { ...prev.settings, soundEnabled: !prev.settings.soundEnabled },
    }));
  }, []);

  const handleToggleTheme = useCallback(() => {
    setPlayerData(prev => ({
      ...prev,
      settings: { ...prev.settings, theme: prev.settings.theme === 'light' ? 'dark' : 'light' },
    }));
  }, []);

  const handleDifficultyChange = useCallback((d: Difficulty) => {
    playSoundIfEnabled(playClickSound);
    setDifficulty(d);
  }, [playSoundIfEnabled]);

  const handleBuySkin = useCallback((skinId: string): boolean => {
    const skin = SKINS.find(s => s.id === skinId);
    if (!skin) return false;
    if (playerData.skinsOwned.includes(skinId)) return false;
    if (playerData.coins < skin.price) return false;
    
    setPlayerData(prev => ({
      ...prev,
      coins: prev.coins - skin.price,
      skinsOwned: [...prev.skinsOwned, skinId],
    }));
    addNotification('coins', `Bought ${skin.name}!`, skin.icon);
    return true;
  }, [playerData, addNotification]);

  const handleEquipSkin = useCallback((skinId: string) => {
    if (!playerData.skinsOwned.includes(skinId)) return;
    setPlayerData(prev => ({ ...prev, equippedSkin: skinId }));
  }, [playerData]);

  const handleBuyBooster = useCallback((multiplier: number, durationMinutes: number, cost: number): boolean => {
    if (playerData.coins < cost) return false;
    const expiresAt = Date.now() + durationMinutes * 60 * 1000;
    setPlayerData(prev => ({
      ...prev,
      coins: prev.coins - cost,
      booster: { multiplier, expiresAt },
    }));
    return true;
  }, [playerData]);

  const handleResetProgress = useCallback(() => {
    const fresh = resetGameData();
    setPlayerData(fresh);
    addNotification('xp', 'Progress reset', '🗑️');
  }, [addNotification]);

  // Word Scramble completion handler
  const handleWordScrambleComplete = useCallback((result: {
    score: number;
    wordsSolved: number;
    maxCombo: number;
    timeElapsed: number;
    perfectRun: boolean;
    coinsEarned: number;
    xpEarned: number;
  }) => {
    setPlayerData(prev => {
      let newData = {
        ...prev,
        coins: prev.coins + result.coinsEarned,
        statistics: {
          ...prev.statistics,
          scrambleGamesPlayed: prev.statistics.scrambleGamesPlayed + 1,
          scrambleWordsSolved: prev.statistics.scrambleWordsSolved + result.wordsSolved,
          scrambleBestScore: Math.max(prev.statistics.scrambleBestScore, result.score),
          scrambleHighestCombo: Math.max(prev.statistics.scrambleHighestCombo, result.maxCombo),
          scramblePerfectRuns: prev.statistics.scramblePerfectRuns + (result.perfectRun ? 1 : 0),
          totalCoinsEarned: prev.statistics.totalCoinsEarned + result.coinsEarned,
          gamesPlayedByMode: {
            ...prev.statistics.gamesPlayedByMode,
            wordScramble: prev.statistics.gamesPlayedByMode.wordScramble + 1,
          },
        },
      };

      const xpResult = addXP(newData, result.xpEarned);
      newData = xpResult.newData;

      if (result.coinsEarned > 0) addNotification('coins', `+${result.coinsEarned} coins`, '🪙');
      if (result.xpEarned > 0) addNotification('xp', `+${result.xpEarned} XP`, '✨');
      if (xpResult.levelsGained > 0) {
        addNotification('levelup', `Level ${newData.level}!`, '🎉');
        playSoundIfEnabled(playLevelUpSound);
      }
      if (result.perfectRun) {
        addNotification('perfect', 'Perfect Run!', '✨');
      }

      // Check achievements
      newData = checkAchievements(newData);

      return newData;
    });
  }, [addNotification, playSoundIfEnabled, checkAchievements]);

  // Word Builder completion handler
  const handleWordBuilderComplete = useCallback((result: {
    score: number;
    wordsFound: number;
    maxCombo: number;
    longestWord: string;
    timeElapsed: number;
    perfectRun: boolean;
    coinsEarned: number;
    xpEarned: number;
  }) => {
    setPlayerData(prev => {
      let newData = {
        ...prev,
        coins: prev.coins + result.coinsEarned,
        statistics: {
          ...prev.statistics,
          builderGamesPlayed: prev.statistics.builderGamesPlayed + 1,
          builderWordsCreated: prev.statistics.builderWordsCreated + result.wordsFound,
          builderBestScore: Math.max(prev.statistics.builderBestScore, result.score),
          builderHighestCombo: Math.max(prev.statistics.builderHighestCombo, result.maxCombo),
          builderPerfectRuns: prev.statistics.builderPerfectRuns + (result.perfectRun ? 1 : 0),
          builderLongestWord: result.longestWord.length > prev.statistics.builderLongestWord.length ? result.longestWord : prev.statistics.builderLongestWord,
          totalCoinsEarned: prev.statistics.totalCoinsEarned + result.coinsEarned,
          gamesPlayedByMode: {
            ...prev.statistics.gamesPlayedByMode,
            wordBuilder: prev.statistics.gamesPlayedByMode.wordBuilder + 1,
          },
        },
      };

      const xpResult = addXP(newData, result.xpEarned);
      newData = xpResult.newData;

      if (result.coinsEarned > 0) addNotification('coins', `+${result.coinsEarned} coins`, '🪙');
      if (result.xpEarned > 0) addNotification('xp', `+${result.xpEarned} XP`, '✨');
      if (xpResult.levelsGained > 0) {
        addNotification('levelup', `Level ${newData.level}!`, '🎉');
        playSoundIfEnabled(playLevelUpSound);
      }
      if (result.perfectRun) {
        addNotification('perfect', 'Perfect Run!', '✨');
      }

      // Check achievements
      newData = checkAchievements(newData);

      return newData;
    });
  }, [addNotification, playSoundIfEnabled, checkAchievements]);

  // Math Challenge completion handler
  const handleMathComplete = useCallback((result: {
    score: number;
    questionsAnswered: number;
    correctAnswers: number;
    highestCombo: number;
    timeElapsed: number;
    perfectRun: boolean;
    fastestAnswer: number | null;
    coinsEarned: number;
    xpEarned: number;
  }) => {
    setPlayerData(prev => {
      let newData = {
        ...prev,
        coins: prev.coins + result.coinsEarned,
        statistics: {
          ...prev.statistics,
          mathGamesPlayed: prev.statistics.mathGamesPlayed + 1,
          mathQuestionsAnswered: prev.statistics.mathQuestionsAnswered + result.questionsAnswered,
          mathCorrectAnswers: prev.statistics.mathCorrectAnswers + result.correctAnswers,
          mathBestScore: Math.max(prev.statistics.mathBestScore, result.score),
          mathHighestCombo: Math.max(prev.statistics.mathHighestCombo, result.highestCombo),
          mathFastestAnswer: result.fastestAnswer !== null && (prev.statistics.mathFastestAnswer === null || result.fastestAnswer < prev.statistics.mathFastestAnswer) ? result.fastestAnswer : prev.statistics.mathFastestAnswer,
          totalCoinsEarned: prev.statistics.totalCoinsEarned + result.coinsEarned,
          gamesPlayedByMode: {
            ...prev.statistics.gamesPlayedByMode,
            mathChallenge: prev.statistics.gamesPlayedByMode.mathChallenge + 1,
          },
        },
      };

      const xpResult = addXP(newData, result.xpEarned);
      newData = xpResult.newData;

      if (result.coinsEarned > 0) addNotification('coins', `+${result.coinsEarned} coins`, '🪙');
      if (result.xpEarned > 0) addNotification('xp', `+${result.xpEarned} XP`, '✨');
      if (xpResult.levelsGained > 0) {
        addNotification('levelup', `Level ${newData.level}!`, '🎉');
        playSoundIfEnabled(playLevelUpSound);
      }
      if (result.perfectRun) {
        addNotification('perfect', 'Perfect Run!', '✨');
      }

      newData = checkAchievements(newData);
      return newData;
    });
  }, [addNotification, playSoundIfEnabled, checkAchievements]);

  // Logic Puzzles completion handler
  const handleLogicComplete = useCallback((result: {
    score: number;
    puzzlesSolved: number;
    correctAnswers: number;
    highestCombo: number;
    timeElapsed: number;
    perfectRun: boolean;
    coinsEarned: number;
    xpEarned: number;
  }) => {
    setPlayerData(prev => {
      let newData = {
        ...prev,
        coins: prev.coins + result.coinsEarned,
        statistics: {
          ...prev.statistics,
          logicGamesPlayed: prev.statistics.logicGamesPlayed + 1,
          logicPuzzlesSolved: prev.statistics.logicPuzzlesSolved + result.puzzlesSolved,
          logicBestScore: Math.max(prev.statistics.logicBestScore, result.score),
          logicHighestCombo: Math.max(prev.statistics.logicHighestCombo, result.highestCombo),
          totalCoinsEarned: prev.statistics.totalCoinsEarned + result.coinsEarned,
          gamesPlayedByMode: {
            ...prev.statistics.gamesPlayedByMode,
            logicPuzzles: prev.statistics.gamesPlayedByMode.logicPuzzles + 1,
          },
        },
      };

      const xpResult = addXP(newData, result.xpEarned);
      newData = xpResult.newData;

      if (result.coinsEarned > 0) addNotification('coins', `+${result.coinsEarned} coins`, '🪙');
      if (result.xpEarned > 0) addNotification('xp', `+${result.xpEarned} XP`, '✨');
      if (xpResult.levelsGained > 0) {
        addNotification('levelup', `Level ${newData.level}!`, '🎉');
        playSoundIfEnabled(playLevelUpSound);
      }
      if (result.perfectRun) {
        addNotification('perfect', 'Perfect Run!', '✨');
      }

      newData = checkAchievements(newData);
      return newData;
    });
  }, [addNotification, playSoundIfEnabled, checkAchievements]);

  // Match Challenge completion handler
  const handleMatchComplete = useCallback((result: {
    score: number;
    matchesFound: number;
    attempts: number;
    maxCombo: number;
    timeElapsed: number;
    perfectRun: boolean;
    fastestReaction: number | null;
    coinsEarned: number;
    xpEarned: number;
  }) => {
    setPlayerData(prev => {
      let newData = {
        ...prev,
        coins: prev.coins + result.coinsEarned,
        statistics: {
          ...prev.statistics,
          matchGamesPlayed: prev.statistics.matchGamesPlayed + 1,
          matchMatchesMade: prev.statistics.matchMatchesMade + result.matchesFound,
          matchBestScore: Math.max(prev.statistics.matchBestScore, result.score),
          matchFastestReaction: result.fastestReaction !== null && (prev.statistics.matchFastestReaction === null || result.fastestReaction < prev.statistics.matchFastestReaction) ? result.fastestReaction : prev.statistics.matchFastestReaction,
          totalCoinsEarned: prev.statistics.totalCoinsEarned + result.coinsEarned,
          gamesPlayedByMode: {
            ...prev.statistics.gamesPlayedByMode,
            matchChallenge: prev.statistics.gamesPlayedByMode.matchChallenge + 1,
          },
        },
      };

      const xpResult = addXP(newData, result.xpEarned);
      newData = xpResult.newData;

      if (result.coinsEarned > 0) addNotification('coins', `+${result.coinsEarned} coins`, '🪙');
      if (result.xpEarned > 0) addNotification('xp', `+${result.xpEarned} XP`, '✨');
      if (xpResult.levelsGained > 0) {
        addNotification('levelup', `Level ${newData.level}!`, '🎉');
        playSoundIfEnabled(playLevelUpSound);
      }
      if (result.perfectRun) {
        addNotification('perfect', 'Perfect Run!', '✨');
      }

      newData = checkAchievements(newData);
      return newData;
    });
  }, [addNotification, playSoundIfEnabled, checkAchievements]);

  // Focus Game completion handler
  const handleFocusComplete = useCallback((result: {
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
  }) => {
    setPlayerData(prev => {
      let newData = {
        ...prev,
        coins: prev.coins + result.coinsEarned,
        statistics: {
          ...prev.statistics,
          focusGamesPlayed: prev.statistics.focusGamesPlayed + 1,
          focusBestScore: Math.max(prev.statistics.focusBestScore, result.score),
          focusFastestReaction: result.fastestReaction !== null && (prev.statistics.focusFastestReaction === null || result.fastestReaction < prev.statistics.focusFastestReaction) ? result.fastestReaction : prev.statistics.focusFastestReaction,
          totalCoinsEarned: prev.statistics.totalCoinsEarned + result.coinsEarned,
          gamesPlayedByMode: {
            ...prev.statistics.gamesPlayedByMode,
            focusGame: prev.statistics.gamesPlayedByMode.focusGame + 1,
          },
        },
      };

      const xpResult = addXP(newData, result.xpEarned);
      newData = xpResult.newData;

      if (result.coinsEarned > 0) addNotification('coins', `+${result.coinsEarned} coins`, '🪙');
      if (result.xpEarned > 0) addNotification('xp', `+${result.xpEarned} XP`, '✨');
      if (xpResult.levelsGained > 0) {
        addNotification('levelup', `Level ${newData.level}!`, '🎉');
        playSoundIfEnabled(playLevelUpSound);
      }
      if (result.perfectRun) {
        addNotification('perfect', 'Perfect Run!', '✨');
      }

      newData = checkAchievements(newData);
      return newData;
    });
  }, [addNotification, playSoundIfEnabled, checkAchievements]);

  // Pattern Recognition completion handler
  const handlePatternComplete = useCallback((result: {
    score: number;
    puzzlesSolved: number;
    correctAnswers: number;
    highestCombo: number;
    timeElapsed: number;
    perfectRun: boolean;
    coinsEarned: number;
    xpEarned: number;
  }) => {
    setPlayerData(prev => {
      let newData = {
        ...prev,
        coins: prev.coins + result.coinsEarned,
        statistics: {
          ...prev.statistics,
          patternGamesPlayed: prev.statistics.patternGamesPlayed + 1,
          patternPuzzlesSolved: prev.statistics.patternPuzzlesSolved + result.puzzlesSolved,
          patternBestScore: Math.max(prev.statistics.patternBestScore, result.score),
          totalCoinsEarned: prev.statistics.totalCoinsEarned + result.coinsEarned,
          gamesPlayedByMode: {
            ...prev.statistics.gamesPlayedByMode,
            patternRecognition: prev.statistics.gamesPlayedByMode.patternRecognition + 1,
          },
        },
      };

      const xpResult = addXP(newData, result.xpEarned);
      newData = xpResult.newData;

      if (result.coinsEarned > 0) addNotification('coins', `+${result.coinsEarned} coins`, '🪙');
      if (result.xpEarned > 0) addNotification('xp', `+${result.xpEarned} XP`, '✨');
      if (xpResult.levelsGained > 0) {
        addNotification('levelup', `Level ${newData.level}!`, '🎉');
        playSoundIfEnabled(playLevelUpSound);
      }
      if (result.perfectRun) {
        addNotification('perfect', 'Perfect Run!', '✨');
      }

      newData = checkAchievements(newData);
      return newData;
    });
  }, [addNotification, playSoundIfEnabled, checkAchievements]);

  // Knowledge Quiz completion handler
  const handleKnowledgeComplete = useCallback((result: {
    score: number;
    questionsAnswered: number;
    correctAnswers: number;
    highestCombo: number;
    timeElapsed: number;
    perfectRun: boolean;
    coinsEarned: number;
    xpEarned: number;
  }) => {
    setPlayerData(prev => {
      let newData = {
        ...prev,
        coins: prev.coins + result.coinsEarned,
        statistics: {
          ...prev.statistics,
          knowledgeGamesPlayed: prev.statistics.knowledgeGamesPlayed + 1,
          knowledgeQuestionsAnswered: prev.statistics.knowledgeQuestionsAnswered + result.questionsAnswered,
          knowledgeCorrectAnswers: prev.statistics.knowledgeCorrectAnswers + result.correctAnswers,
          knowledgeBestScore: Math.max(prev.statistics.knowledgeBestScore, result.score),
          totalCoinsEarned: prev.statistics.totalCoinsEarned + result.coinsEarned,
          gamesPlayedByMode: {
            ...prev.statistics.gamesPlayedByMode,
            knowledgeQuiz: prev.statistics.gamesPlayedByMode.knowledgeQuiz + 1,
          },
        },
      };

      const xpResult = addXP(newData, result.xpEarned);
      newData = xpResult.newData;

      if (result.coinsEarned > 0) addNotification('coins', `+${result.coinsEarned} coins`, '🪙');
      if (result.xpEarned > 0) addNotification('xp', `+${result.xpEarned} XP`, '✨');
      if (xpResult.levelsGained > 0) {
        addNotification('levelup', `Level ${newData.level}!`, '🎉');
        playSoundIfEnabled(playLevelUpSound);
      }
      if (result.perfectRun) {
        addNotification('perfect', 'Perfect Run!', '✨');
      }

      newData = checkAchievements(newData);
      return newData;
    });
  }, [addNotification, playSoundIfEnabled, checkAchievements]);

  const accuracy = gameState.totalAttempts > 0 ? calculateAccuracy(gameState.matchedPairs, gameState.totalAttempts) : 0;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${playerData.settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-indigo-50'}`}>
      <Notifications notifications={notifications} onRemove={removeNotification} />
      
      {screen === 'hub' && (
        <GameHub
          playerData={playerData}
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          onSelectGame={(mode: GameMode) => {
            if (mode === 'memoryFlip') {
              handleStartGame();
            } else if (mode === 'wordScramble') {
              setScreen('wordScramble');
            } else if (mode === 'wordBuilder') {
              setScreen('wordBuilder');
            }
          }}
          onOpenShop={() => setModal('shop')}
          onOpenAchievements={() => setModal('achievements')}
          onOpenProfile={() => setModal('profile')}
          onOpenStatistics={() => setModal('statistics')}
          onOpenDaily={() => setModal('daily')}
          onOpenSettings={() => setModal('settings')}
          onOpenHowToPlay={() => setModal('howToPlay')}
          soundEnabled={playerData.settings.soundEnabled}
          onToggleSound={handleToggleSound}
          theme={playerData.settings.theme}
          onToggleTheme={handleToggleTheme}
        />
      )}
      
      {screen === 'memoryFlip' && (
        <div className="min-h-screen flex flex-col items-center p-3 sm:p-4 pt-4 sm:pt-6">
          <GameHUD
            score={gameState.score}
            moves={gameState.moves}
            timeElapsed={gameState.timeElapsed}
            matchedPairs={gameState.matchedPairs}
            totalPairs={gameState.totalPairs}
            accuracy={accuracy}
            difficulty={gameState.difficulty}
            combo={gameState.combo}
            onPause={handlePause}
            onRestart={handleRestart}
            soundEnabled={playerData.settings.soundEnabled}
            onToggleSound={handleToggleSound}
          />
          <GameBoard
            cards={gameState.cards}
            difficulty={gameState.difficulty}
            locked={gameState.locked}
            onCardClick={handleCardClick}
            paused={gameState.paused}
            mismatchedIds={gameState.mismatchedIds}
            skinId={playerData.equippedSkin}
          />
        </div>
      )}
      
      {gameState.gameFinished && screen === 'memoryFlip' && (
        <GameOverScreen
          score={gameState.score}
          timeElapsed={gameState.timeElapsed}
          moves={gameState.moves}
          accuracy={accuracy}
          difficulty={gameState.difficulty}
          isNewBest={isNewBest}
          bestScore={bestScore}
          perfectRun={gameState.perfectRun}
          maxCombo={gameState.maxCombo}
          coinsEarned={lastGameRewards.coins}
          xpEarned={lastGameRewards.xp}
          onPlayAgain={handleRestart}
          onChangeDifficulty={handleQuitToMenu}
        />
      )}
      
      {gameState.paused && !gameState.gameFinished && screen === 'memoryFlip' && (
        <PauseOverlay onResume={handleResume} onRestart={handleRestart} onQuitToMenu={handleQuitToMenu} />
      )}

      {screen === 'wordScramble' && (
        <WordScramble
          difficulty={difficulty}
          playerData={playerData}
          onGameComplete={handleWordScrambleComplete}
          onBack={() => setScreen('hub')}
          onNotification={addNotification}
          soundEnabled={playerData.settings.soundEnabled}
        />
      )}

      {screen === 'wordBuilder' && (
        <WordBuilder
          difficulty={difficulty}
          playerData={playerData}
          onGameComplete={handleWordBuilderComplete}
          onBack={() => setScreen('hub')}
          onNotification={addNotification}
          soundEnabled={playerData.settings.soundEnabled}
        />
      )}

      {screen === 'mathChallenge' && (
        <MathChallenge
          difficulty={difficulty}
          playerData={playerData}
          onGameComplete={handleMathComplete}
          onBack={() => setScreen('hub')}
          onNotification={addNotification}
          soundEnabled={playerData.settings.soundEnabled}
        />
      )}

      {screen === 'logicPuzzles' && (
        <LogicPuzzles
          difficulty={difficulty}
          playerData={playerData}
          onGameComplete={handleLogicComplete}
          onBack={() => setScreen('hub')}
          onNotification={addNotification}
          soundEnabled={playerData.settings.soundEnabled}
        />
      )}

      {screen === 'matchChallenge' && (
        <MatchChallenge
          difficulty={difficulty}
          playerData={playerData}
          onGameComplete={handleMatchComplete}
          onBack={() => setScreen('hub')}
          onNotification={addNotification}
          soundEnabled={playerData.settings.soundEnabled}
        />
      )}

      {screen === 'focusGame' && (
        <FocusGame
          difficulty={difficulty}
          playerData={playerData}
          onGameComplete={handleFocusComplete}
          onBack={() => setScreen('hub')}
          onNotification={addNotification}
          soundEnabled={playerData.settings.soundEnabled}
        />
      )}

      {screen === 'patternRecognition' && (
        <PatternRecognition
          difficulty={difficulty}
          playerData={playerData}
          onGameComplete={handlePatternComplete}
          onBack={() => setScreen('hub')}
          onNotification={addNotification}
          soundEnabled={playerData.settings.soundEnabled}
        />
      )}

      {screen === 'knowledgeQuiz' && (
        <KnowledgeQuiz
          difficulty={difficulty}
          playerData={playerData}
          onGameComplete={handleKnowledgeComplete}
          onBack={() => setScreen('hub')}
          onNotification={addNotification}
          soundEnabled={playerData.settings.soundEnabled}
        />
      )}
      
      {modal === 'howToPlay' && <HowToPlay onClose={() => setModal(null)} />}
      {modal === 'shop' && <Shop data={playerData} onClose={() => setModal(null)} onBuySkin={handleBuySkin} onEquipSkin={handleEquipSkin} onBuyBooster={handleBuyBooster} />}
      {modal === 'achievements' && <Achievements data={playerData} onClose={() => setModal(null)} />}
      {modal === 'profile' && <Profile data={playerData} onClose={() => setModal(null)} />}
      {modal === 'statistics' && <Statistics data={playerData} onClose={() => setModal(null)} />}
      {modal === 'daily' && <DailyChallenge data={playerData} onClose={() => setModal(null)} onStartChallenge={() => { setModal(null); handleStartGame(); }} />}
      {modal === 'settings' && <SettingsPanel playerData={playerData} onClose={() => setModal(null)} onToggleSound={handleToggleSound} onToggleTheme={handleToggleTheme} onResetProgress={handleResetProgress} />}
    </div>
  );
}

export default App;
