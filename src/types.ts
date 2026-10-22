export interface Lap {
  id: string;
  number: number;
  splitTime: number;
  totalTime: number;
}

export interface Stopwatch {
  id: string;
  name: string;
  isRunning: boolean;
  startTime: number;
  elapsed: number;
  laps: Lap[];
  goal: number | null;
  createdAt: number;
}
