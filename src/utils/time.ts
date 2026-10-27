export function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds;
  const centiseconds = Math.floor((ms % 1000) / 10);
  return {
    seconds: String(seconds),
    millis: String(centiseconds).padStart(2, '0'),
  };
}

export function formatSeconds(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${totalSeconds}.${String(centiseconds).padStart(2, '0')}s`;
}
