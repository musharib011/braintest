import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TrafficEscapeEngine, GameScreen } from './game/engine';

type ActiveEffectType = 'shield' | 'slow' | 'multiplier';

interface ActiveEffect {
  type: ActiveEffectType;
  timer: number;
  maxTimer: number;
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<TrafficEscapeEngine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const [effects, setEffects] = useState<ActiveEffect[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [finalScore, setFinalScore] = useState(0);
  const [finalDistance, setFinalDistance] = useState(0);

  // Initialize engine
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const engine = new TrafficEscapeEngine(canvasRef.current, {
      onScoreChange: setScore,
      onDistanceChange: setDistance,
      onGameOver: (s, d, isNew) => {
        setFinalScore(s);
        setFinalDistance(d);
        setIsNewBest(isNew);
        if (isNew) setBestScore(s);
      },
      onEffectChange: setEffects,
      onScreenChange: setScreen,
    });
    
    engineRef.current = engine;
    
    // Load best score
    try {
      const saved = localStorage.getItem('trafficEscapeBest');
      if (saved) setBestScore(parseInt(saved, 10) || 0);
    } catch {}
    
    // Render initial background
    engine.returnToMenu();
    
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      engineRef.current?.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sound toggle
  useEffect(() => {
    engineRef.current?.setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  const handleStart = useCallback(() => {
    engineRef.current?.start();
  }, []);

  const handleRestart = useCallback(() => {
    engineRef.current?.restart();
  }, []);

  const handlePause = useCallback(() => {
    engineRef.current?.pause();
  }, []);

  const handleResume = useCallback(() => {
    engineRef.current?.resume();
  }, []);

  const handleMenu = useCallback(() => {
    engineRef.current?.returnToMenu();
  }, []);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  // Touch controls
  const handleTouchLeftStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    engineRef.current?.setTouchLeft(true);
  }, []);

  const handleTouchLeftEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    engineRef.current?.setTouchLeft(false);
  }, []);

  const handleTouchRightStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    engineRef.current?.setTouchRight(true);
  }, []);

  const handleTouchRightEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    engineRef.current?.setTouchRight(false);
  }, []);

  const getEffectIcon = (type: ActiveEffectType) => {
    switch (type) {
      case 'shield': return '🛡️';
      case 'slow': return '⏱️';
      case 'multiplier': return '×2';
    }
  };

  const getEffectColor = (type: ActiveEffectType) => {
    switch (type) {
      case 'shield': return 'bg-blue-500';
      case 'slow': return 'bg-yellow-500';
      case 'multiplier': return 'bg-green-500';
    }
  };

  const formatDistance = (d: number) => {
    if (d >= 1000) return `${(d / 1000).toFixed(1)}km`;
    return `${d}m`;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Game Container */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-[400px] mx-auto flex flex-col items-center"
        style={{ height: 'min(100vh, 100dvh, 750px)' }}
      >
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="rounded-lg shadow-2xl block"
          style={{ touchAction: 'none' }}
        />

        {/* HUD - visible during gameplay */}
        {screen === 'playing' && (
          <div className="absolute top-0 left-0 right-0 p-3 pointer-events-none">
            <div className="flex items-center justify-between">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <div className="text-yellow-400 font-bold text-sm">⭐ {score.toLocaleString()}</div>
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <div className="text-white font-medium text-sm">📏 {formatDistance(distance)}</div>
              </div>
              <button
                onClick={handlePause}
                className="pointer-events-auto bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 hover:bg-black/80 transition-colors"
              >
                <span className="text-white text-sm">⏸️</span>
              </button>
            </div>
            
            {/* Active effects */}
            {effects.length > 0 && (
              <div className="flex gap-2 mt-2 justify-center">
                {effects.map((effect, i) => (
                  <div key={i} className={`${getEffectColor(effect.type)} rounded-full px-2 py-0.5 flex items-center gap-1 shadow-lg`}>
                    <span className="text-xs">{getEffectIcon(effect.type)}</span>
                    <div className="w-12 h-1.5 bg-black/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white/80 rounded-full transition-all duration-200"
                        style={{ width: `${(effect.timer / effect.maxTimer) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Menu Screen */}
        {screen === 'menu' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg animate-fade-in">
            <div className="text-center px-6">
              <div className="text-5xl mb-3 animate-bounce">🏎️</div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-1 tracking-tight">
                TRAFFIC
              </h1>
              <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-3">
                ESCAPE
              </h1>
              <p className="text-gray-300 text-sm mb-6">Dodge traffic. Survive. Set records.</p>
              
              {bestScore > 0 && (
                <div className="bg-white/10 rounded-xl px-4 py-2 mb-4 inline-block">
                  <div className="text-yellow-400 text-xs font-medium">🏆 BEST SCORE</div>
                  <div className="text-white text-xl font-bold">{bestScore.toLocaleString()}</div>
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={handleStart}
                  className="w-full py-3.5 px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white text-lg font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all transform hover:scale-105 active:scale-95"
                >
                  ▶ PLAY
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleToggleSound}
                    className="flex-1 py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
                  >
                    {soundEnabled ? '🔊 Sound' : '🔇 Muted'}
                  </button>
                </div>
              </div>
              
              <div className="mt-6 text-gray-400 text-xs space-y-1">
                <p>🎮 Arrow keys / WASD to move</p>
                <p>📱 Touch buttons on mobile</p>
                <p>⏸️ ESC or P to pause</p>
              </div>
            </div>
          </div>
        )}

        {/* Pause Screen */}
        {screen === 'paused' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg animate-fade-in">
            <div className="text-center px-6">
              <div className="text-4xl mb-3">⏸️</div>
              <h2 className="text-2xl font-bold text-white mb-6">PAUSED</h2>
              
              <div className="space-y-3 w-full max-w-[200px] mx-auto">
                <button
                  onClick={handleResume}
                  className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  ▶ RESUME
                </button>
                <button
                  onClick={handleRestart}
                  className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                >
                  🔄 RESTART
                </button>
                <button
                  onClick={handleMenu}
                  className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                >
                  🏠 MENU
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {screen === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg animate-fade-in">
            <div className="text-center px-6 w-full max-w-[300px]">
              <div className="text-4xl mb-2">💥</div>
              <h2 className="text-2xl font-bold text-white mb-1">GAME OVER</h2>
              
              {isNewBest && (
                <div className="inline-block mb-3 px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full">
                  <span className="text-white font-bold text-sm">🏆 NEW BEST!</span>
                </div>
              )}
              
              <div className="bg-white/10 rounded-xl p-4 mb-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Score</span>
                  <span className="text-yellow-400 font-bold text-lg">{finalScore.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Distance</span>
                  <span className="text-white font-bold">{formatDistance(finalDistance)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-gray-300 text-sm">Best</span>
                  <span className="text-yellow-400 font-bold">{bestScore.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleRestart}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white text-lg font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all transform hover:scale-105 active:scale-95"
                >
                  🔄 PLAY AGAIN
                </button>
                <button
                  onClick={handleMenu}
                  className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                >
                  🏠 MENU
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Touch Controls */}
      {screen === 'playing' && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-between p-4 pb-6 pointer-events-none sm:hidden">
          <button
            onTouchStart={handleTouchLeftStart}
            onTouchEnd={handleTouchLeftEnd}
            onMouseDown={handleTouchLeftStart}
            onMouseUp={handleTouchLeftEnd}
            onMouseLeave={handleTouchLeftEnd}
            className="pointer-events-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-white/40 transition-colors border-2 border-white/30"
            aria-label="Move left"
          >
            <span className="text-3xl text-white">◀</span>
          </button>
          <button
            onTouchStart={handleTouchRightStart}
            onTouchEnd={handleTouchRightEnd}
            onMouseDown={handleTouchRightStart}
            onMouseUp={handleTouchRightEnd}
            onMouseLeave={handleTouchRightEnd}
            className="pointer-events-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-white/40 transition-colors border-2 border-white/30"
            aria-label="Move right"
          >
            <span className="text-3xl text-white">▶</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
