let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

export function playBeep(frequency: number = 800, duration: number = 50, volume: number = 0.15) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.value = volume;
    oscillator.start(ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    oscillator.stop(ctx.currentTime + duration / 1000);
  } catch (e) {}
}

export function playLapSound() { playBeep(1200, 40, 0.12); }
export function playStartSound() { playBeep(600, 80, 0.15); }
export function playStopSound() { playBeep(400, 80, 0.15); }
