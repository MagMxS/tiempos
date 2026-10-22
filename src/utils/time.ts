export function formatTime(ms: number): { minutes: string; seconds: string; millis: string } {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millis = Math.floor(ms % 1000);

  return {
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    millis: String(millis).padStart(3, '0'),
  };
}

export function formatTimeFull(ms: number): string {
  const { minutes, seconds, millis } = formatTime(ms);
  return `${minutes}:${seconds}.${millis}`;
}
