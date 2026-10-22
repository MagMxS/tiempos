import { Stopwatch } from '../types';
import { formatTime } from '../utils/time';
import { ArrowLeft, Play, Pause, RotateCcw, Flag, Star, Target } from 'lucide-react';
import { playLapSound } from '../utils/audio';

interface StopwatchDetailProps {
  stopwatch: Stopwatch;
  elapsed: number;
  onBack: () => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onLap: () => void;
  onToggleFavorite: () => void;
  onSetGoal: (goal: number | null) => void;
}

export default function StopwatchDetail({ stopwatch, elapsed, onBack, onStart, onPause, onReset, onLap, onToggleFavorite, onSetGoal }: StopwatchDetailProps) {
  const { minutes, seconds, millis } = formatTime(elapsed);
  const lapTimes = stopwatch.laps.map(l => l.splitTime);
  const fastestLap = lapTimes.length > 0 ? Math.min(...lapTimes) : -1;
  const slowestLap = lapTimes.length > 0 ? Math.max(...lapTimes) : -1;
  const avgLap = lapTimes.length > 0 ? lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length : 0;

  const handleLap = () => { playLapSound(); onLap(); };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 md:p-6">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
        <ArrowLeft size={20} /><span>Volver al panel</span>
      </button>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold">{stopwatch.name}</h1>
          <button onClick={onToggleFavorite} className="text-gray-400 hover:text-yellow-400 transition-colors">
            <Star size={20} className={stopwatch.isFavorite ? 'text-yellow-400 fill-yellow-400' : ''} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {stopwatch.isRunning && <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><span className="text-xs text-green-400">Corriendo</span></div>}
          {!stopwatch.isRunning && elapsed > 0 && <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500" /><span className="text-xs text-yellow-400">Pausado</span></div>}
        </div>
      </div>

      <div className="text-center py-6 md:py-8">
        <div className="font-mono text-5xl md:text-7xl lg:text-8xl tracking-tight">
          <span className="text-white">{minutes}</span>
          <span className="text-gray-500">:</span>
          <span className="text-orange-400">{seconds}</span>
          <span className="text-gray-600">.</span>
          <span className="text-green-400 text-4xl md:text-5xl lg:text-6xl">{millis}</span>
        </div>
        {stopwatch.goal && (
          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="text-xs text-gray-500">vs Objetivo:</span>
            <span className={`font-mono text-sm font-bold ${elapsed <= stopwatch.goal ? 'text-green-400' : 'text-red-400'}`}>
              {elapsed <= stopwatch.goal ? '✓ En tiempo' : '✗ Fuera de tiempo'}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 mb-8">
        <button onClick={stopwatch.isRunning ? onPause : onStart} className={`flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full transition-all ${stopwatch.isRunning ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-2 border-yellow-500/40' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-2 border-green-500/40'}`}>
          {stopwatch.isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        {stopwatch.isRunning && (
          <button onClick={handleLap} className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all border-2 border-blue-500/40">
            <Flag size={24} />
          </button>
        )}
        {elapsed > 0 && (
          <button onClick={onReset} className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all border-2 border-red-500/40">
            <RotateCcw size={24} />
          </button>
        )}
      </div>

      {stopwatch.laps.length > 0 && (
        <div className="bg-[#1e1e1e] rounded-xl border border-[#333] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#333] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-300">Vueltas ({stopwatch.laps.length})</h2>
            <span className="text-xs text-gray-500">Total: {formatTime(elapsed).minutes}:{formatTime(elapsed).seconds}.{formatTime(elapsed).millis}</span>
          </div>
          <div className="max-h-[50vh] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#1e1e1e]">
                <tr className="text-xs text-gray-500 border-b border-[#333]">
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-right">Parcial</th>
                  <th className="px-4 py-2 text-right">Acumulado</th>
                  {stopwatch.goal && <th className="px-4 py-2 text-right">Δ vs Meta</th>}
                  <th className="px-4 py-2 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {[...stopwatch.laps].reverse().map((lap) => {
                  const isFastest = lap.splitTime === fastestLap && lapTimes.filter(t => t === fastestLap).length === 1;
                  const isSlowest = lap.splitTime === slowestLap && lapTimes.filter(t => t === slowestLap).length === 1;
                  const { minutes: m, seconds: s, millis: ms } = formatTime(lap.splitTime);
                  const { minutes: am, seconds: as2, millis: ams } = formatTime(lap.totalTime);
                  
                  return (
                    <tr key={lap.id} className={`border-b border-[#2a2a2a] ${isFastest ? 'bg-green-500/5' : isSlowest ? 'bg-red-500/5' : ''}`}>
                      <td className="px-4 py-2 text-sm text-gray-400">Vuelta {lap.number}</td>
                      <td className={`px-4 py-2 text-right font-mono text-sm ${isFastest ? 'text-green-400' : isSlowest ? 'text-red-400' : 'text-white'}`}>{m}:{s}.{ms}</td>
                      <td className="px-4 py-2 text-right font-mono text-sm text-gray-400">{am}:{as2}.{ams}</td>
                      {stopwatch.goal && (
                        <td className={`px-4 py-2 text-right font-mono text-sm ${lap.splitTime <= stopwatch.goal ? 'text-green-400' : 'text-red-400'}`}>
                          {lap.splitTime <= stopwatch.goal ? '-' : '+'}{formatTime(Math.abs(lap.splitTime - stopwatch.goal)).minutes}:{formatTime(Math.abs(lap.splitTime - stopwatch.goal)).seconds}
                        </td>
                      )}
                      <td className="px-4 py-2 text-center">
                        {isFastest && <span className="text-xs text-green-400">⚡ Rápida</span>}
                        {isSlowest && <span className="text-xs text-red-400">🐢 Lenta</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {stopwatch.laps.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Flag size={48} className="mx-auto mb-3 opacity-30" />
          <p>No hay vueltas registradas</p>
          <p className="text-sm mt-1">Presiona el botón de bandera para registrar vueltas</p>
        </div>
      )}
    </div>
  );
}
