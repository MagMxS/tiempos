import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Stopwatch, Lap } from '../types';

const STORAGE_KEY = 'multi-stopwatch-data';

function loadFromStorage(): Stopwatch[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}
  return [];
}

function saveToStorage(stopwatches: Stopwatch[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stopwatches));
  } catch (e) {}
}

export function useStopwatches() {
  const [stopwatches, setStopwatches] = useState<Stopwatch[]>(loadFromStorage);
  const animFrameRef = useRef<number>(0);
  const [, forceUpdate] = useState(0);

  useEffect(() => { saveToStorage(stopwatches); }, [stopwatches]);

  const hasRunning = stopwatches.some(sw => sw.isRunning);
  
  useEffect(() => {
    if (hasRunning) {
      const tick = () => {
        forceUpdate(n => n + 1);
        animFrameRef.current = requestAnimationFrame(tick);
      };
      animFrameRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [hasRunning]);

  const getElapsed = useCallback((sw: Stopwatch): number => {
    if (sw.isRunning) return sw.elapsed + (Date.now() - sw.startTime);
    return sw.elapsed;
  }, []);

  const addStopwatch = useCallback((name?: string) => {
    const newSw: Stopwatch = {
      id: uuidv4(),
      name: name || `Cronómetro ${stopwatches.length + 1}`,
      isRunning: false,
      isFavorite: false,
      startTime: 0,
      elapsed: 0,
      laps: [],
      createdAt: Date.now(),
      goal: null,
    };
    setStopwatches(prev => [...prev, newSw]);
    return newSw.id;
  }, [stopwatches.length]);

  const removeStopwatch = useCallback((id: string) => {
    setStopwatches(prev => prev.filter(sw => sw.id !== id));
  }, []);

  const duplicateStopwatch = useCallback((id: string) => {
    setStopwatches(prev => {
      const sw = prev.find(s => s.id === id);
      if (!sw) return prev;
      const newSw: Stopwatch = { ...sw, id: uuidv4(), name: `${sw.name} (copia)`, isRunning: false, startTime: 0, laps: [], createdAt: Date.now() };
      return [...prev, newSw];
    });
  }, []);

  const startStopwatch = useCallback((id: string) => {
    setStopwatches(prev => prev.map(sw => sw.id !== id ? sw : { ...sw, isRunning: true, startTime: Date.now() }));
  }, []);

  const pauseStopwatch = useCallback((id: string) => {
    setStopwatches(prev => prev.map(sw => {
      if (sw.id !== id) return sw;
      const elapsed = sw.elapsed + (Date.now() - sw.startTime);
      return { ...sw, isRunning: false, elapsed, startTime: 0 };
    }));
  }, []);

  const resetStopwatch = useCallback((id: string) => {
    setStopwatches(prev => prev.map(sw => sw.id !== id ? sw : { ...sw, isRunning: false, elapsed: 0, startTime: 0, laps: [] }));
  }, []);

  const addLap = useCallback((id: string) => {
    setStopwatches(prev => prev.map(sw => {
      if (sw.id !== id || !sw.isRunning) return sw;
      const totalTime = sw.elapsed + (Date.now() - sw.startTime);
      const lastLapTotal = sw.laps.length > 0 ? sw.laps[sw.laps.length - 1].totalTime : 0;
      const splitTime = totalTime - lastLapTotal;
      const newLap: Lap = { id: uuidv4(), number: sw.laps.length + 1, splitTime, totalTime };
      return { ...sw, laps: [...sw.laps, newLap] };
    }));
  }, []);

  const renameStopwatch = useCallback((id: string, name: string) => {
    setStopwatches(prev => prev.map(sw => sw.id !== id ? sw : { ...sw, name }));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setStopwatches(prev => prev.map(sw => sw.id !== id ? sw : { ...sw, isFavorite: !sw.isFavorite }));
  }, []);

  const setGoal = useCallback((id: string, goal: number | null) => {
    setStopwatches(prev => prev.map(sw => sw.id !== id ? sw : { ...sw, goal }));
  }, []);

  const startAll = useCallback(() => {
    setStopwatches(prev => prev.map(sw => sw.isRunning ? sw : { ...sw, isRunning: true, startTime: Date.now() }));
  }, []);

  const pauseAll = useCallback(() => {
    setStopwatches(prev => prev.map(sw => {
      if (!sw.isRunning) return sw;
      const elapsed = sw.elapsed + (Date.now() - sw.startTime);
      return { ...sw, isRunning: false, elapsed, startTime: 0 };
    }));
  }, []);

  const resetAll = useCallback(() => {
    setStopwatches(prev => prev.map(sw => ({ ...sw, isRunning: false, elapsed: 0, startTime: 0, laps: [] })));
  }, []);

  return {
    stopwatches, getElapsed, addStopwatch, removeStopwatch, duplicateStopwatch,
    startStopwatch, pauseStopwatch, resetStopwatch, addLap, renameStopwatch,
    toggleFavorite, setGoal, startAll, pauseAll, resetAll,
  };
}
