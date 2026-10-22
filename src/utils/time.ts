export function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds;
  const millis = Math.floor(ms % 1000);
  return {
    seconds: String(seconds),
    millis: String(millis).padStart(3, '0'),
  };
}

export function formatSeconds(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const millis = Math.floor(ms % 1000);
  return `${totalSeconds}.${String(millis).padStart(3, '0')}s`;
}
