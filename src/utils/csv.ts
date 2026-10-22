import { Stopwatch } from '../types';
import { formatTimeFull } from './time';

export function exportToCSV(stopwatches: Stopwatch[]): void {
  const rows: string[][] = [];
  rows.push(['Cronómetro', 'Objetivo', 'Vuelta', 'Tiempo Parcial', 'Tiempo Acumulado', 'Δ vs Objetivo', 'Estado', 'Tiempo Total']);

  stopwatches.forEach((sw) => {
    const totalTime = sw.elapsed + (sw.isRunning ? Date.now() - sw.startTime : 0);
    const goalText = sw.goal ? formatTimeFull(sw.goal) : '-';
    
    if (sw.laps.length === 0) {
      rows.push([sw.name, goalText, '-', '-', '-', '-', sw.isRunning ? 'Corriendo' : totalTime > 0 ? 'Pausado' : 'Detenido', formatTimeFull(totalTime)]);
    } else {
      sw.laps.forEach((lap, idx) => {
        let delta = '-';
        if (sw.goal) {
          const diff = lap.splitTime - sw.goal;
          const sign = diff <= 0 ? '-' : '+';
          delta = `${sign}${formatTimeFull(Math.abs(diff))}`;
        }
        rows.push([idx === 0 ? sw.name : '', idx === 0 ? goalText : '', `Vuelta ${lap.number}`, formatTimeFull(lap.splitTime), formatTimeFull(lap.totalTime), delta, idx === 0 ? (sw.isRunning ? 'Corriendo' : 'Pausado') : '', idx === 0 ? formatTimeFull(totalTime) : '']);
      });
    }
  });

  const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `stopwatches_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
