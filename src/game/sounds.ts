// Web Audio API sound effects - no external files needed

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
  } catch {
    return null;
  }
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // silently fail
  }
}

export function playFlipSound() {
  playTone(800, 0.1, 'sine', 0.2);
}

export function playMatchSound() {
  playTone(523, 0.15, 'sine', 0.3);
  setTimeout(() => playTone(659, 0.15, 'sine', 0.3), 100);
  setTimeout(() => playTone(784, 0.2, 'sine', 0.3), 200);
}

export function playMismatchSound() {
  playTone(300, 0.15, 'square', 0.15);
  setTimeout(() => playTone(250, 0.2, 'square', 0.15), 120);
}

export function playWinSound() {
  const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
  notes.forEach((note, i) => {
    setTimeout(() => playTone(note, 0.2, 'sine', 0.25), i * 80);
  });
}

export function playClickSound() {
  playTone(600, 0.05, 'sine', 0.15);
}
