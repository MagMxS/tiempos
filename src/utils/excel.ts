import { Stopwatch } from '../types';
import { formatTime } from './time';

export function exportToExcel(stopwatches: Stopwatch[]): void {
  const rows: string[][] = [];

  // Header principal
  rows.push(['REPORTE DE CRONÓMETROS']);
  rows.push(['Fecha de exportación:', new Date().toLocaleString('es-ES')]);
  rows.push(['']);

  // Encabezados de columnas
  rows.push([
    'Cronómetro',
    'Objetivo (s)',
    'Tiempo Total (s)',
    'Estado',
    'Número de Vueltas',
    'Mejor Vuelta (s)',
    'Peor Vuelta (s)',
    'Promedio (s)',
    '% Cumplimiento'
  ]);

  // Datos de cada cronómetro
  stopwatches.forEach((sw) => {
    const totalTime = sw.elapsed + (sw.isRunning ? Date.now() - sw.startTime : 0);
    const lapTimes = sw.laps.map(l => l.splitTime);
    
    const bestLap = lapTimes.length > 0 ? Math.min(...lapTimes) : 0;
    const worstLap = lapTimes.length > 0 ? Math.max(...lapTimes) : 0;
    const avgLap = lapTimes.length > 0 ? lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length : 0;
    
    const compliance = sw.goal && lapTimes.length > 0
      ? Math.round((lapTimes.filter(t => t > sw.goal!).length / lapTimes.length) * 100)
      : 0;

    const status = sw.isRunning ? 'Corriendo' : totalTime > 0 ? 'Pausado' : 'Detenido';

    rows.push([
      sw.name,
      sw.goal ? formatTime(sw.goal).seconds + '.' + formatTime(sw.goal).millis : '-',
      formatTime(totalTime).seconds + '.' + formatTime(totalTime).millis,
      status,
      String(sw.laps.length),
      lapTimes.length > 0 ? formatTime(bestLap).seconds + '.' + formatTime(bestLap).millis : '-',
      lapTimes.length > 0 ? formatTime(worstLap).seconds + '.' + formatTime(worstLap).millis : '-',
      lapTimes.length > 0 ? formatTime(avgLap).seconds + '.' + formatTime(avgLap).millis : '-',
      sw.goal ? `${compliance}%` : '-'
    ]);
  });

  // Separador
  rows.push(['']);
  rows.push(['']);

  // Detalle de vueltas por cronómetro
  rows.push(['DETALLE DE VUELTAS']);
  rows.push(['']);

  stopwatches.forEach((sw) => {
    if (sw.laps.length > 0) {
      rows.push([`Cronómetro: ${sw.name}`]);
      rows.push(['']);
      rows.push(['Vuelta', 'Tiempo Parcial (s)', 'Tiempo Acumulado (s)', 'Estado vs Meta']);
      
      sw.laps.forEach((lap) => {
        const status = sw.goal 
          ? (lap.splitTime > sw.goal ? 'Sobre meta' : 'Bajo meta')
          : '-';
        
        rows.push([
          `Vuelta ${lap.number}`,
          formatTime(lap.splitTime).seconds + '.' + formatTime(lap.splitTime).millis,
          formatTime(lap.totalTime).seconds + '.' + formatTime(lap.totalTime).millis,
          status
        ]);
      });
      
      rows.push(['']);
      rows.push(['']);
    }
  });

  // Convertir a CSV con BOM para Excel
  const csvContent = rows.map(row => 
    row.map(cell => `"${cell}"`).join(',')
  ).join('\n');
  
  // Agregar BOM UTF-8 para que Excel reconozca correctamente los caracteres
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Crear enlace de descarga
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  link.download = `cronometros_${timestamp}.csv`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
