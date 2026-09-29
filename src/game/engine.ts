// TRAFFIC ESCAPE - Game Engine
// A top-down traffic dodging game rendered on HTML Canvas

export type GameScreen = 'menu' | 'playing' | 'paused' | 'gameover';

interface Vec2 {
  x: number;
  y: number;
}

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  targetX: number;
  speed: number;
  color: string;
  accentColor: string;
  invincible: boolean;
  invincibleTimer: number;
}

interface TrafficCar {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
  accentColor: string;
  type: 'sedan' | 'truck' | 'sports';
  lane: number;
}

interface PowerUp {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'shield' | 'slow' | 'multiplier';
  speed: number;
  pulsePhase: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface RoadLine {
  y: number;
}

interface ActiveEffect {
  type: 'shield' | 'slow' | 'multiplier';
  timer: number;
  maxTimer: number;
}

interface GameState {
  screen: GameScreen;
  score: number;
  distance: number;
  bestScore: number;
  difficulty: number;
  speed: number;
  baseSpeed: number;
  spawnTimer: number;
  spawnInterval: number;
  powerUpTimer: number;
  powerUpInterval: number;
  effects: ActiveEffect[];
  combo: number;
  comboTimer: number;
  shakeTimer: number;
  shakeIntensity: number;
  flashTimer: number;
  scorePopups: ScorePopup[];
}

interface ScorePopup {
  x: number;
  y: number;
  value: number;
  life: number;
  maxLife: number;
}

// Constants
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 700;
const ROAD_WIDTH = 320;
const LANE_COUNT = 4;
const LANE_WIDTH = ROAD_WIDTH / LANE_COUNT;
const ROAD_LEFT = (CANVAS_WIDTH - ROAD_WIDTH) / 2;
const ROAD_RIGHT = ROAD_LEFT + ROAD_WIDTH;
const SHOULDER_WIDTH = 20;

const PLAYER_WIDTH = 46;
const PLAYER_HEIGHT = 82;
const PLAYER_Y = CANVAS_HEIGHT - 140;
const PLAYER_SPEED = 6;

const TRAFFIC_COLORS = [
  { color: '#e74c3c', accent: '#c0392b' },
  { color: '#3498db', accent: '#2980b9' },
  { color: '#2ecc71', accent: '#27ae60' },
  { color: '#f39c12', accent: '#e67e22' },
  { color: '#9b59b6', accent: '#8e44ad' },
  { color: '#1abc9c', accent: '#16a085' },
  { color: '#e67e22', accent: '#d35400' },
  { color: '#34495e', accent: '#2c3e50' },
];

export type GameCallbacks = {
  onScoreChange: (score: number) => void;
  onDistanceChange: (distance: number) => void;
  onGameOver: (score: number, distance: number, isNewBest: boolean) => void;
  onEffectChange: (effects: ActiveEffect[]) => void;
  onScreenChange: (screen: GameScreen) => void;
};

export class TrafficEscapeEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Player;
  private traffic: TrafficCar[] = [];
  private powerUps: PowerUp[] = [];
  private particles: Particle[] = [];
  private roadLines: RoadLine[] = [];
  private state: GameState;
  private callbacks: GameCallbacks;
  private animFrameId: number | null = null;
  private deathRenderId: number | null = null;
  private gameOverTimeout: number | null = null;
  private lastTime: number = 0;
  private keys: Set<string> = new Set();
  private touchLeft: boolean = false;
  private touchRight: boolean = false;
  private soundEnabled: boolean = true;
  private audioCtx: AudioContext | null = null;
  private scale: number = 1;
  private dpr: number = 1;

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.callbacks = callbacks;
    
    this.player = this.createPlayer();
    this.state = this.createInitialState();
    
    this.initRoadLines();
    this.resize();
    this.bindEvents();
  }

  private createPlayer(): Player {
    return {
      x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: PLAYER_Y,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      targetX: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
      speed: PLAYER_SPEED,
      color: '#4fc3f7',
      accentColor: '#0288d1',
      invincible: false,
      invincibleTimer: 0,
    };
  }

  private createInitialState(): GameState {
    return {
      screen: 'menu',
      score: 0,
      distance: 0,
      bestScore: this.loadBestScore(),
      difficulty: 1,
      speed: 3,
      baseSpeed: 3,
      spawnTimer: 0,
      spawnInterval: 60,
      powerUpTimer: 0,
      powerUpInterval: 600,
      effects: [],
      combo: 0,
      comboTimer: 0,
      shakeTimer: 0,
      shakeIntensity: 0,
      flashTimer: 0,
      scorePopups: [],
    };
  }

  private initRoadLines() {
    this.roadLines = [];
    for (let y = -40; y < CANVAS_HEIGHT + 40; y += 80) {
      this.roadLines.push({ y });
    }
  }

  private loadBestScore(): number {
    try {
      const saved = localStorage.getItem('trafficEscapeBest');
      if (saved) {
        const val = parseInt(saved, 10);
        return isNaN(val) ? 0 : val;
      }
    } catch {}
    return 0;
  }

  private saveBestScore(score: number) {
    try {
      localStorage.setItem('trafficEscapeBest', String(score));
    } catch {}
  }

  resize() {
    const container = this.canvas.parentElement;
    if (!container) return;
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    const scaleX = containerWidth / CANVAS_WIDTH;
    const scaleY = containerHeight / CANVAS_HEIGHT;
    this.scale = Math.min(scaleX, scaleY);
    
    this.dpr = window.devicePixelRatio || 1;
    
    const displayWidth = CANVAS_WIDTH * this.scale;
    const displayHeight = CANVAS_HEIGHT * this.scale;
    
    this.canvas.style.width = `${displayWidth}px`;
    this.canvas.style.height = `${displayHeight}px`;
    this.canvas.width = CANVAS_WIDTH * this.dpr;
    this.canvas.height = CANVAS_HEIGHT * this.dpr;
    
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private bindEvents() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('resize', this.handleResize);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys.add(e.key.toLowerCase());
    
    if (e.key === 'Escape' || e.key === 'p') {
      if (this.state.screen === 'playing') {
        this.pause();
      } else if (this.state.screen === 'paused') {
        this.resume();
      }
    }
    
    if (e.key === ' ' || e.key === 'Enter') {
      if (this.state.screen === 'menu') {
        this.start();
      } else if (this.state.screen === 'gameover') {
        this.restart();
      }
    }
    
    // Prevent scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.key.toLowerCase());
  };

  private handleResize = () => {
    this.resize();
  };

  setTouchLeft(active: boolean) {
    this.touchLeft = active;
  }

  setTouchRight(active: boolean) {
    this.touchRight = active;
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  // Audio
  private getAudioCtx(): AudioContext | null {
    if (!this.soundEnabled) return null;
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.2) {
    const ctx = this.getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  private playEngine() {
    this.playTone(80, 0.1, 'sawtooth', 0.03);
  }

  private playCrash() {
    const ctx = this.getAudioCtx();
    if (!ctx) return;
    try {
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    } catch {}
  }

  private playPowerUp() {
    this.playTone(523, 0.1, 'sine', 0.25);
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.25), 80);
    setTimeout(() => this.playTone(784, 0.15, 'sine', 0.25), 160);
  }

  private playClick() {
    this.playTone(600, 0.05, 'sine', 0.15);
  }

  // Game flow
  start() {
    this.playClick();
    this.resetGame();
    this.state.screen = 'playing';
    this.callbacks.onScreenChange('playing');
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  pause() {
    if (this.state.screen !== 'playing') return;
    this.state.screen = 'paused';
    this.callbacks.onScreenChange('paused');
    this.cleanupLoops();
  }

  resume() {
    if (this.state.screen !== 'paused') return;
    this.state.screen = 'playing';
    this.callbacks.onScreenChange('playing');
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  restart() {
    this.playClick();
    this.cleanupLoops();
    this.start();
  }

  returnToMenu() {
    this.playClick();
    this.cleanupLoops();
    this.state.screen = 'menu';
    this.callbacks.onScreenChange('menu');
    // Render menu background
    this.renderMenuBackground();
  }

  private cleanupLoops() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.deathRenderId) {
      cancelAnimationFrame(this.deathRenderId);
      this.deathRenderId = null;
    }
    if (this.gameOverTimeout) {
      clearTimeout(this.gameOverTimeout);
      this.gameOverTimeout = null;
    }
  }

  private resetGame() {
    this.player = this.createPlayer();
    this.traffic = [];
    this.powerUps = [];
    this.particles = [];
    this.state = this.createInitialState();
    this.state.screen = 'playing';
    this.state.bestScore = this.loadBestScore();
    this.initRoadLines();
    this.callbacks.onScoreChange(0);
    this.callbacks.onDistanceChange(0);
    this.callbacks.onEffectChange([]);
  }

  // Main loop
  private loop = (timestamp: number) => {
    if (this.state.screen !== 'playing') return;
    
    const deltaTime = Math.min((timestamp - this.lastTime) / 16.667, 3); // normalize to ~60fps, cap at 3x
    this.lastTime = timestamp;
    
    this.update(deltaTime);
    this.render();
    
    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    // Update difficulty
    this.state.difficulty = 1 + this.state.distance / 2000;
    this.state.baseSpeed = 3 + this.state.difficulty * 0.8;
    
    // Check for slow effect
    const slowEffect = this.state.effects.find(e => e.type === 'slow');
    const speedMultiplier = slowEffect ? 0.5 : 1;
    this.state.speed = this.state.baseSpeed * speedMultiplier;
    
    // Update score
    const scoreEffect = this.state.effects.find(e => e.type === 'multiplier');
    const scoreMultiplier = scoreEffect ? 2 : 1;
    this.state.distance += this.state.speed * dt;
    this.state.score += Math.round(this.state.speed * dt * scoreMultiplier * 0.5);
    
    this.callbacks.onScoreChange(this.state.score);
    this.callbacks.onDistanceChange(Math.floor(this.state.distance));
    
    // Update spawn interval based on difficulty
    this.state.spawnInterval = Math.max(20, 60 - this.state.difficulty * 5);
    
    // Update player
    this.updatePlayer(dt);
    
    // Spawn traffic
    this.state.spawnTimer += dt;
    if (this.state.spawnTimer >= this.state.spawnInterval) {
      this.state.spawnTimer = 0;
      this.spawnTraffic();
    }
    
    // Spawn power-ups
    this.state.powerUpTimer += dt;
    if (this.state.powerUpTimer >= this.state.powerUpInterval) {
      this.state.powerUpTimer = 0;
      this.spawnPowerUp();
    }
    
    // Update traffic
    this.updateTraffic(dt);
    
    // Update power-ups
    this.updatePowerUps(dt);
    
    // Update particles
    this.updateParticles(dt);
    
    // Update road lines
    this.updateRoadLines(dt);
    
    // Update effects
    this.updateEffects(dt);
    
    // Update score popups
    this.updateScorePopups(dt);
    
    // Update shake
    if (this.state.shakeTimer > 0) {
      this.state.shakeTimer -= dt;
    }
    if (this.state.flashTimer > 0) {
      this.state.flashTimer -= dt;
    }
    
    // Combo timer
    if (this.state.comboTimer > 0) {
      this.state.comboTimer -= dt;
      if (this.state.comboTimer <= 0) {
        this.state.combo = 0;
      }
    }
    
    // Collision detection
    this.checkCollisions();
    
    // Engine sound (occasional)
    if (Math.random() < 0.02) {
      this.playEngine();
    }
  }

  private updatePlayer(dt: number) {
    let moveDir = 0;
    
    if (this.keys.has('arrowleft') || this.keys.has('a') || this.touchLeft) {
      moveDir -= 1;
    }
    if (this.keys.has('arrowright') || this.keys.has('d') || this.touchRight) {
      moveDir += 1;
    }
    
    this.player.targetX += moveDir * this.player.speed * dt;
    
    // Clamp to road
    const minX = ROAD_LEFT + 8;
    const maxX = ROAD_RIGHT - this.player.width - 8;
    this.player.targetX = Math.max(minX, Math.min(maxX, this.player.targetX));
    
    // Smooth movement
    this.player.x += (this.player.targetX - this.player.x) * 0.2 * dt;
    
    // Invincibility timer
    if (this.player.invincible) {
      this.player.invincibleTimer -= dt;
      if (this.player.invincibleTimer <= 0) {
        this.player.invincible = false;
      }
    }
  }

  private spawnTraffic() {
    // Find available lanes (no car too close in that lane near spawn)
    const laneOccupied = new Array(LANE_COUNT).fill(false);
    for (const car of this.traffic) {
      if (car.y < 150) {
        const lane = Math.floor((car.x - ROAD_LEFT) / LANE_WIDTH);
        if (lane >= 0 && lane < LANE_COUNT) {
          laneOccupied[lane] = true;
        }
      }
    }
    
    const availableLanes: number[] = [];
    for (let i = 0; i < LANE_COUNT; i++) {
      if (!laneOccupied[i]) availableLanes.push(i);
    }
    
    if (availableLanes.length === 0) return;
    
    // Pick random lane
    const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
    const laneCenter = ROAD_LEFT + lane * LANE_WIDTH + LANE_WIDTH / 2;
    
    // Random car type
    const types: Array<'sedan' | 'truck' | 'sports'> = ['sedan', 'sedan', 'sedan', 'truck', 'sports'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let width: number, height: number;
    switch (type) {
      case 'truck':
        width = 50;
        height = 100;
        break;
      case 'sports':
        width = 44;
        height = 76;
        break;
      default:
        width = 46;
        height = 84;
    }
    
    const colorSet = TRAFFIC_COLORS[Math.floor(Math.random() * TRAFFIC_COLORS.length)];
    // Car's own speed contribution (how fast it approaches relative to road)
    const carOwnSpeed = 0.5 + Math.random() * 2;
    
    this.traffic.push({
      x: laneCenter - width / 2,
      y: -height - 20,
      width,
      height,
      speed: carOwnSpeed,
      color: colorSet.color,
      accentColor: colorSet.accent,
      type,
      lane,
    });
  }

  private spawnPowerUp() {
    const types: Array<'shield' | 'slow' | 'multiplier'> = ['shield', 'slow', 'multiplier'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const lane = Math.floor(Math.random() * LANE_COUNT);
    const laneCenter = ROAD_LEFT + lane * LANE_WIDTH + LANE_WIDTH / 2;
    
    // Don't spawn if there's already a power-up
    if (this.powerUps.length > 0) return;
    
    this.powerUps.push({
      x: laneCenter - 17,
      y: -40,
      width: 34,
      height: 34,
      type,
      speed: 0,
      pulsePhase: 0,
    });
  }

  private updateTraffic(dt: number) {
    for (let i = this.traffic.length - 1; i >= 0; i--) {
      const car = this.traffic[i];
      // Traffic moves down: road scroll speed + car's own approach speed
      car.y += (this.state.speed + car.speed) * dt;
      
      // Remove if off screen
      if (car.y > CANVAS_HEIGHT + 50) {
        this.traffic.splice(i, 1);
        // Increment combo for dodging
        this.state.combo++;
        this.state.comboTimer = 120;
        if (this.state.combo > 0 && this.state.combo % 5 === 0) {
          const bonus = this.state.combo * 10;
          this.state.score += bonus;
          this.addScorePopup(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, bonus);
        }
      }
    }
  }

  private updatePowerUps(dt: number) {
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const pu = this.powerUps[i];
      pu.y += this.state.speed * dt;
      pu.pulsePhase += 0.1 * dt;
      
      if (pu.y > CANVAS_HEIGHT + 50) {
        this.powerUps.splice(i, 1);
        continue;
      }
      
      // Check collision with player
      if (this.rectsOverlap(
        this.player.x + 5, this.player.y + 5, this.player.width - 10, this.player.height - 10,
        pu.x, pu.y, pu.width, pu.height
      )) {
        this.collectPowerUp(pu);
        this.powerUps.splice(i, 1);
      }
    }
  }

  private collectPowerUp(pu: PowerUp) {
    this.playPowerUp();
    
    let duration: number;
    switch (pu.type) {
      case 'shield':
        duration = 300; // ~5 seconds
        this.player.invincible = true;
        this.player.invincibleTimer = duration;
        break;
      case 'slow':
        duration = 300;
        break;
      case 'multiplier':
        duration = 480; // ~8 seconds
        break;
    }
    
    // Remove existing effect of same type
    this.state.effects = this.state.effects.filter(e => e.type !== pu.type);
    this.state.effects.push({
      type: pu.type,
      timer: duration,
      maxTimer: duration,
    });
    
    this.callbacks.onEffectChange([...this.state.effects]);
    
    // Spawn particles
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 / 12) * i;
      this.particles.push({
        x: pu.x + pu.width / 2,
        y: pu.y + pu.height / 2,
        vx: Math.cos(angle) * 3,
        vy: Math.sin(angle) * 3,
        life: 30,
        maxLife: 30,
        color: this.getPowerUpColor(pu.type),
        size: 4,
      });
    }
  }

  private getPowerUpColor(type: string): string {
    switch (type) {
      case 'shield': return '#4fc3f7';
      case 'slow': return '#ffd54f';
      case 'multiplier': return '#69f0ae';
      default: return '#ffffff';
    }
  }

  private updateEffects(dt: number) {
    let changed = false;
    for (let i = this.state.effects.length - 1; i >= 0; i--) {
      this.state.effects[i].timer -= dt;
      if (this.state.effects[i].timer <= 0) {
        this.state.effects.splice(i, 1);
        changed = true;
        if (this.state.effects.find(e => e.type === 'shield') === undefined) {
          this.player.invincible = false;
        }
      }
    }
    if (changed) {
      this.callbacks.onEffectChange([...this.state.effects]);
    }
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private updateRoadLines(dt: number) {
    for (const line of this.roadLines) {
      line.y += this.state.speed * dt;
      if (line.y > CANVAS_HEIGHT + 40) {
        line.y -= (this.roadLines.length) * 80;
      }
    }
  }

  private updateScorePopups(dt: number) {
    for (let i = this.state.scorePopups.length - 1; i >= 0; i--) {
      const popup = this.state.scorePopups[i];
      popup.y -= 1 * dt;
      popup.life -= dt;
      if (popup.life <= 0) {
        this.state.scorePopups.splice(i, 1);
      }
    }
  }

  private addScorePopup(x: number, y: number, value: number) {
    this.state.scorePopups.push({
      x, y, value,
      life: 60,
      maxLife: 60,
    });
  }

  private checkCollisions() {
    if (this.player.invincible) return;
    
    for (const car of this.traffic) {
      // Tighter hitbox for fairness
      const px = this.player.x + 6;
      const py = this.player.y + 8;
      const pw = this.player.width - 12;
      const ph = this.player.height - 16;
      
      const cx = car.x + 4;
      const cy = car.y + 6;
      const cw = car.width - 8;
      const ch = car.height - 12;
      
      if (this.rectsOverlap(px, py, pw, ph, cx, cy, cw, ch)) {
        this.gameOver();
        return;
      }
    }
  }

  private rectsOverlap(
    x1: number, y1: number, w1: number, h1: number,
    x2: number, y2: number, w2: number, h2: number
  ): boolean {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  }

  private gameOver() {
    this.playCrash();
    
    // Screen shake
    this.state.shakeTimer = 20;
    this.state.shakeIntensity = 8;
    this.state.flashTimer = 10;
    
    // Explosion particles
    const cx = this.player.x + this.player.width / 2;
    const cy = this.player.y + this.player.height / 2;
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      this.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 40 + Math.random() * 20,
        maxLife: 60,
        color: ['#ff6b6b', '#ffd93d', '#ff8c42', '#ffffff'][Math.floor(Math.random() * 4)],
        size: 3 + Math.random() * 4,
      });
    }
    
    // Check best score
    const isNewBest = this.state.score > this.state.bestScore;
    if (isNewBest) {
      this.state.bestScore = this.state.score;
      this.saveBestScore(this.state.score);
    }
    
    // Stop main game loop
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    
    // Continue rendering particles during death animation
    const renderDeath = () => {
      if (this.state.screen === 'gameover') {
        this.deathRenderId = null;
        return;
      }
      this.updateParticles(1);
      if (this.state.shakeTimer > 0) this.state.shakeTimer -= 1;
      if (this.state.flashTimer > 0) this.state.flashTimer -= 1;
      this.render();
      this.deathRenderId = requestAnimationFrame(renderDeath);
    };
    this.deathRenderId = requestAnimationFrame(renderDeath);
    
    // Transition to game over screen after delay
    this.gameOverTimeout = window.setTimeout(() => {
      this.gameOverTimeout = null;
      if (this.deathRenderId) {
        cancelAnimationFrame(this.deathRenderId);
        this.deathRenderId = null;
      }
      this.state.screen = 'gameover';
      this.callbacks.onScreenChange('gameover');
      this.callbacks.onGameOver(this.state.score, Math.floor(this.state.distance), isNewBest);
    }, 800);
  }

  // RENDERING
  private render() {
    const ctx = this.ctx;
    
    // Apply screen shake
    ctx.save();
    if (this.state.shakeTimer > 0) {
      const intensity = this.state.shakeIntensity * (this.state.shakeTimer / 20);
      ctx.translate(
        (Math.random() - 0.5) * intensity,
        (Math.random() - 0.5) * intensity
      );
    }
    
    // Clear
    ctx.fillStyle = '#2d5a27';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw grass texture
    this.drawGrass(ctx);
    
    // Draw road
    this.drawRoad(ctx);
    
    // Draw power-ups
    for (const pu of this.powerUps) {
      this.drawPowerUp(ctx, pu);
    }
    
    // Draw traffic
    for (const car of this.traffic) {
      this.drawCar(ctx, car, false);
    }
    
    // Draw player
    this.drawCar(ctx, this.player as any, true);
    
    // Draw particles
    this.drawParticles(ctx);
    
    // Draw score popups
    this.drawScorePopups(ctx);
    
    // Flash effect
    if (this.state.flashTimer > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.state.flashTimer / 10 * 0.5})`;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    
    ctx.restore();
  }

  private drawGrass(ctx: CanvasRenderingContext2D) {
    // Simple grass pattern
    ctx.fillStyle = '#3d7a35';
    ctx.fillRect(0, 0, ROAD_LEFT - SHOULDER_WIDTH, CANVAS_HEIGHT);
    ctx.fillRect(ROAD_RIGHT + SHOULDER_WIDTH, 0, CANVAS_WIDTH - ROAD_RIGHT - SHOULDER_WIDTH, CANVAS_HEIGHT);
    
    // Grass stripes
    ctx.fillStyle = '#357a2e';
    for (let y = 0; y < CANVAS_HEIGHT; y += 30) {
      const offset = (this.state.distance * 0.5) % 30;
      const yPos = y + offset;
      if (yPos > 0 && yPos < CANVAS_HEIGHT) {
        ctx.fillRect(0, yPos, ROAD_LEFT - SHOULDER_WIDTH, 15);
        ctx.fillRect(ROAD_RIGHT + SHOULDER_WIDTH, yPos, CANVAS_WIDTH, 15);
      }
    }
  }

  private drawRoad(ctx: CanvasRenderingContext2D) {
    // Road surface
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(ROAD_LEFT, 0, ROAD_WIDTH, CANVAS_HEIGHT);
    
    // Road texture - subtle fixed pattern (seeded by position to avoid flicker)
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    const seed = Math.floor(this.state.distance * 0.1);
    for (let y = 0; y < CANVAS_HEIGHT; y += 12) {
      for (let x = ROAD_LEFT; x < ROAD_RIGHT; x += 12) {
        const hash = ((x * 7 + (y + seed) * 13) % 97);
        if (hash < 15) {
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }
    
    // Shoulders
    ctx.fillStyle = '#ff6b35';
    ctx.fillRect(ROAD_LEFT - SHOULDER_WIDTH, 0, SHOULDER_WIDTH, CANVAS_HEIGHT);
    ctx.fillRect(ROAD_RIGHT, 0, SHOULDER_WIDTH, CANVAS_HEIGHT);
    
    // Shoulder stripes
    ctx.fillStyle = '#ffffff';
    for (const line of this.roadLines) {
      ctx.fillRect(ROAD_LEFT - SHOULDER_WIDTH + 2, line.y, SHOULDER_WIDTH - 4, 30);
      ctx.fillRect(ROAD_RIGHT + 2, line.y, SHOULDER_WIDTH - 4, 30);
    }
    
    // Lane markings (dashed)
    ctx.fillStyle = '#ffffff';
    for (let lane = 1; lane < LANE_COUNT; lane++) {
      const laneX = ROAD_LEFT + lane * LANE_WIDTH;
      for (const line of this.roadLines) {
        ctx.fillRect(laneX - 2, line.y, 4, 40);
      }
    }
    
    // Road edges (solid white lines)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(ROAD_LEFT - 2, 0, 3, CANVAS_HEIGHT);
    ctx.fillRect(ROAD_RIGHT - 1, 0, 3, CANVAS_HEIGHT);
  }

  private drawCar(ctx: CanvasRenderingContext2D, car: Player | TrafficCar, isPlayer: boolean) {
    const { x, y, width, height } = car;
    const color = car.color;
    const accent = car.accentColor;
    
    ctx.save();
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(x + width / 2 + 3, y + height - 5, width / 2 - 2, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Car body
    ctx.fillStyle = color;
    this.roundRect(ctx, x, y + 10, width, height - 15, 8);
    ctx.fill();
    
    // Car roof (darker)
    ctx.fillStyle = accent;
    this.roundRect(ctx, x + 5, y + height * 0.3, width - 10, height * 0.35, 5);
    ctx.fill();
    
    // Windshield
    ctx.fillStyle = isPlayer ? '#87ceeb' : '#a8d8ea';
    if (isPlayer) {
      // Player faces up
      this.roundRect(ctx, x + 8, y + 15, width - 16, 20, 4);
    } else {
      // Traffic faces down
      this.roundRect(ctx, x + 8, y + height - 35, width - 16, 20, 4);
    }
    ctx.fill();
    
    // Rear window
    ctx.fillStyle = '#5a7a8a';
    if (isPlayer) {
      this.roundRect(ctx, x + 10, y + height - 30, width - 20, 15, 3);
    } else {
      this.roundRect(ctx, x + 10, y + 15, width - 20, 15, 3);
    }
    ctx.fill();
    
    // Headlights / taillights
    if (isPlayer) {
      // Headlights (front = top for player)
      ctx.fillStyle = '#fff9c4';
      ctx.fillRect(x + 4, y + 8, 8, 5);
      ctx.fillRect(x + width - 12, y + 8, 8, 5);
      // Taillights
      ctx.fillStyle = '#ef5350';
      ctx.fillRect(x + 4, y + height - 10, 8, 5);
      ctx.fillRect(x + width - 12, y + height - 10, 8, 5);
    } else {
      // Traffic headlights (front = bottom since they face toward player)
      ctx.fillStyle = '#fff9c4';
      ctx.fillRect(x + 4, y + height - 12, 8, 5);
      ctx.fillRect(x + width - 12, y + height - 12, 8, 5);
      // Taillights (top)
      ctx.fillStyle = '#ef5350';
      ctx.fillRect(x + 4, y + 10, 8, 5);
      ctx.fillRect(x + width - 12, y + 10, 8, 5);
    }
    
    // Shield effect
    if (isPlayer && this.player.invincible) {
      ctx.strokeStyle = `rgba(79, 195, 247, ${0.5 + Math.sin(Date.now() * 0.01) * 0.3})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(x + width / 2, y + height / 2, width / 2 + 6, height / 2 + 4, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.strokeStyle = `rgba(79, 195, 247, ${0.2 + Math.sin(Date.now() * 0.015) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(x + width / 2, y + height / 2, width / 2 + 10, height / 2 + 8, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  private drawPowerUp(ctx: CanvasRenderingContext2D, pu: PowerUp) {
    const pulse = 1 + Math.sin(pu.pulsePhase) * 0.1;
    const cx = pu.x + pu.width / 2;
    const cy = pu.y + pu.height / 2;
    const size = pu.width / 2 * pulse;
    
    ctx.save();
    
    // Glow
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 2);
    gradient.addColorStop(0, this.getPowerUpColor(pu.type) + '60');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(cx - size * 2, cy - size * 2, size * 4, size * 4);
    
    // Circle background
    ctx.fillStyle = this.getPowerUpColor(pu.type);
    ctx.beginPath();
    ctx.arc(cx, cy, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Icon
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.floor(size)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let icon: string;
    switch (pu.type) {
      case 'shield': icon = '🛡'; break;
      case 'slow': icon = '⏱'; break;
      case 'multiplier': icon = '×2'; break;
    }
    ctx.fillText(icon, cx, cy);
    
    ctx.restore();
  }

  private drawParticles(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  private drawScorePopups(ctx: CanvasRenderingContext2D) {
    for (const popup of this.state.scorePopups) {
      const alpha = popup.life / popup.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`+${popup.value}`, popup.x, popup.y);
    }
    ctx.globalAlpha = 1;
  }

  private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  private renderMenuBackground() {
    // Render a static background for the menu
    const ctx = this.ctx;
    ctx.fillStyle = '#2d5a27';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.drawGrass(ctx);
    this.drawRoad(ctx);
  }

  // Cleanup
  destroy() {
    this.cleanupLoops();
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('resize', this.handleResize);
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}
