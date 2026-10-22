export interface Lap {
  id: string;
  number: number;
  splitTime: number; // tiempo parcial en ms
  totalTime: number;  // tiempo acumulado en ms
}

export interface Stopwatch {
  id: string;
  name: string;
  isRunning: boolean;
  isFavorite: boolean;
  startTime: number;
  elapsed: number;
  laps: Lap[];
  createdAt: number;
  goal: number | null;
}

export type ViewMode = 'grid' | 'detail';
