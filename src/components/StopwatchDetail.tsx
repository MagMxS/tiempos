import { useState, useRef, useEffect } from 'react';
import { Stopwatch } from '../types';
import { formatTime } from '../utils/time';
import { ArrowLeft, Play, Pause, RotateCcw, Flag, Star, Target, BarChart3, Check, X } from 'lucide-react';
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

  // Goal editor state
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [goalMinutes, setGoalMinutes] = useState('');
  const [goalSeconds, setGoalSeconds] = useState('');
  const goalRef = useRef<HTMLDivElement>(null);

  const presets = [
    { label: '30s', value: 30000 },
    { label: '1m', value: 60000 },
    { label: '1:30', value: 90000 },
    { label: '2m', value: 120000 },
    { label: '3m', value: 180000 },
    { label: '5m', value: 300000 },
    { label: '10m', value: 600000 },
  ];

  useEffect(() => {
    if (stopwatch.goal) {
      const { minutes: m, seconds: s } = formatTime(stopwatch.goal);
      setGoalMinutes(m);
      setGoalSeconds(s);
    }
  }, [stopwatch.goal, showGoalEditor]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (goalRef.current && !goalRef.current.contains(e.target as Node)) {
        setShowGoalEditor(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLap = () => { playLapSound(); onLap(); };

  const handleSaveGoal = () => {
    const m = parseInt(goalMinutes) || 0;
    const s = parseInt(goalSeconds) || 0;
    const totalMs = m * 60000 + s * 1000;
    if (totalMs > 0) {
      onSetGoal(totalMs);
      setShowGoalEditor(false);
    }
  };

  const handlePresetGoal = (value: number) => {
    onSetGoal(value);
    setShowGoalEditor(false);
  };

  const handleClearGoal = () => {
    onSetGoal(null);
    setShowGoalEditor(false);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 md:p-6">
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
        <ArrowLeft size={20} />
        <span>Volver al panel</span>
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold">{stopwatch.name}</h1>
          <button onClick={onToggleFavorite} className="text-gray-400 hover:text-yellow-400 transition-colors">
            <Star size={20} className={stopwatch.isFavorite ? 'text-yellow-400 fill-yellow-400' : ''} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {stopwatch.isRunning && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-400">Corriendo</span>
            </div>
          )}
          {!stopwatch.isRunning && elapsed > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-xs text-yellow-400">Pausado</span>
            </div>
          )}
        </div>
      </div>

      {/* Large Time Display */}
      <div className="text-center py-6 md:py-8">
        <div className="font-mono text-5xl md:text-7xl lg:text-8xl tracking-tight">
          <span className="text-white">{minutes}</span>
          <span className="text-gray-500">:</span>
          <span className="text-orange-400">{seconds}</span>
          <span className="text-gray-600">.</span>
          <span className="text-green-400 text-4xl md:text-5xl lg:text-6xl">{millis}</span>
        </div>
        {stopwatch.goal && (
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="text-xs text-gray-500">vs Objetivo:</span>
            <span className={`font-mono text-sm font-bold px-3 py-1 rounded-lg ${
              elapsed <= stopwatch.goal 
                ? 'text-green-400 bg-green-500/10 border border-green-500/30' 
                : 'text-red-400 bg-red-500/10 border border-red-500/30'
            }`}>
              {elapsed <= stopwatch.goal ? '✓ En tiempo' : '✗ Fuera de tiempo'}
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={stopwatch.isRunning ? onPause : onStart}
          className={`flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full transition-all ${
            stopwatch.isRunning
              ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-2 border-yellow-500/40'
              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-2 border-green-500/40'
          }`}
        >
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

      {/* ============================================ */}
      {/* GOAL SETTER - Visible in detail view */}
      {/* ============================================ */}
      <div className="mb-6" ref={goalRef}>
        <div className="bg-[#1e1e1e] rounded-xl border border-[#333] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-yellow-400" />
              <h2 className="text-base font-bold text-gray-200">Objetivo / Meta</h2>
            </div>
            {stopwatch.goal && (
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg text-yellow-400 font-bold">
                  {formatTime(stopwatch.goal).minutes}:{formatTime(stopwatch.goal).seconds}.{formatTime(stopwatch.goal).millis}
                </span>
                <button
                  onClick={handleClearGoal}
                  className="text-gray-500 hover:text-red-400 transition-colors p-1"
                  title="Quitar objetivo"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {showGoalEditor ? (
            <div className="bg-[#2a2a2a] rounded-lg p-4 border border-yellow-500/30">
              <p className="text-xs text-gray-400 mb-3">Selecciona un preset o ingresa tiempo personalizado:</p>
              
              {/* Presets */}
              <div className="flex flex-wrap gap-2 mb-4">
                {presets.map(p => (
                  <button
                    key={p.value}
                    onClick={() => handlePresetGoal(p.value)}
                    className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                      stopwatch.goal === p.value
                        ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 font-bold'
                        : 'bg-[#1a1a1a] border-[#444] text-gray-400 hover:border-yellow-500/50 hover:text-yellow-400'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block mb-1">Minutos</label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    placeholder="00"
                    value={goalMinutes}
                    onChange={e => setGoalMinutes(e.target.value)}
                    className="w-full bg-[#1a1a1a] text-white text-center font-mono text-lg px-3 py-2 rounded-lg border border-[#444] outline-none focus:border-yellow-500"
                  />
                </div>
                <span className="text-gray-500 font-mono text-2xl mt-5">:</span>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block mb-1">Segundos</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="00"
                    value={goalSeconds}
                    onChange={e => setGoalSeconds(e.target.value)}
                    className="w-full bg-[#1a1a1a] text-white text-center font-mono text-lg px-3 py-2 rounded-lg border border-[#444] outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveGoal}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors border border-green-500/30 font-semibold"
                >
                  <Check size={16} /> Guardar Objetivo
                </button>
                <button
                  onClick={() => setShowGoalEditor(false)}
                  className="px-4 py-2.5 text-sm bg-[#1a1a1a] text-gray-400 rounded-lg hover:bg-[#333] transition-colors border border-[#444]"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowGoalEditor(true)}
              className={`w-full py-3 rounded-lg border-2 border-dashed transition-all flex items-center justify-center gap-2 ${
                stopwatch.goal
                  ? 'border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50'
                  : 'border-[#555] bg-[#2a2a2a]/50 hover:border-yellow-500/50 hover:bg-yellow-500/5'
              }`}
            >
              <Target size={18} className={stopwatch.goal ? 'text-yellow-400' : 'text-gray-500'} />
              <span className={`text-sm font-semibold ${stopwatch.goal ? 'text-yellow-400' : 'text-gray-400'}`}>
                {stopwatch.goal ? '✏️ Editar objetivo' : '⚙️ Configurar objetivo'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* BAR CHART - Visible in detail view */}
      {/* ============================================ */}
      {stopwatch.laps.length > 0 && (
        <div className="mb-6">
          <div className="bg-[#1e1e1e] rounded-xl border border-[#333] p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 size={20} className="text-blue-400" />
                <h2 className="text-base font-bold text-gray-200">Gráfica de Vueltas</h2>
                <span className="text-xs text-gray-400 bg-[#2a2a2a] px-2 py-0.5 rounded-full font-semibold">
                  {stopwatch.laps.length} vueltas
                </span>
              </div>
              {stopwatch.goal && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Cumplimiento:</span>
                  <span className={`font-bold text-lg ${
                    lapTimes.filter(t => t <= stopwatch.goal!).length / lapTimes.length >= 0.8
                      ? 'text-green-400'
                      : lapTimes.filter(t => t <= stopwatch.goal!).length / lapTimes.length >= 0.5
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}>
                    {Math.round((lapTimes.filter(t => t <= stopwatch.goal!).length / lapTimes.length) * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Chart */}
            <div className="relative bg-[#1a1a1a] rounded-lg p-4 border border-[#333]">
              <div className="relative h-48 md:h-64 flex items-end gap-2 px-2">
                {/* Goal line */}
                {stopwatch.goal && (
                  <div
                    className="absolute left-0 right-0 border-t-2 border-dashed border-yellow-400 z-10 pointer-events-none"
                    style={{
                      bottom: `${Math.min(100, (stopwatch.goal / Math.max(...lapTimes, stopwatch.goal)) * 100)}%`,
                    }}
                  >
                    <span className="absolute right-0 -top-5 text-xs text-yellow-400 font-bold bg-[#1a1a1a] px-2 py-0.5 rounded">
                      🎯 META: {formatTime(stopwatch.goal).minutes}:{formatTime(stopwatch.goal).seconds}
                    </span>
                  </div>
                )}

                {/* Bars */}
                {stopwatch.laps.map((lap, i) => {
                  const maxTime = Math.max(...lapTimes, stopwatch.goal || 0);
                  const heightPercent = (lap.splitTime / maxTime) * 100;
                  let bgColor = 'bg-green-500';
                  if (stopwatch.goal) {
                    bgColor = lap.splitTime > stopwatch.goal ? 'bg-red-500' : 'bg-green-500';
                  }
                  const isFastest = lap.splitTime === fastestLap && lapTimes.filter(t => t === fastestLap).length === 1;
                  const isSlowest = lap.splitTime === slowestLap && lapTimes.filter(t => t === slowestLap).length === 1;

                  return (
                    <div key={lap.id} className="flex-1 flex flex-col items-center gap-1 group">
                      {/* Time label */}
                      <span className="text-[10px] md:text-xs text-gray-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        {formatTime(lap.splitTime).minutes}:{formatTime(lap.splitTime).seconds}.{formatTime(lap.splitTime).millis}
                      </span>

                      {/* Bar */}
                      <div
                        className={`w-full ${bgColor} rounded-t-md transition-all duration-300 relative ${
                          isFastest ? 'ring-2 ring-green-400' : isSlowest ? 'ring-2 ring-red-400' : ''
                        } hover:opacity-100`}
                        style={{
                          height: `${heightPercent}%`,
                          minHeight: '10px',
                          opacity: 0.85,
                        }}
                      >
                        {isFastest && (
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm">⚡</span>
                        )}
                        {isSlowest && (
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm">🐢</span>
                        )}
                      </div>

                      {/* Lap number */}
                      <span className="text-xs text-gray-500 font-semibold">V{lap.number}</span>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[#333]">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-green-500" />
                  <span className="text-sm text-gray-400">Bajo meta</span>
                </div>
                {stopwatch.goal && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm bg-red-500" />
                    <span className="text-sm text-gray-400">Sobre meta</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-yellow-400 border-t-2 border-dashed" />
                  <span className="text-sm text-gray-400">Objetivo</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-[#2a2a2a] rounded-lg py-3 px-3 text-center border border-[#333]">
                <div className="text-xs text-gray-500 uppercase mb-1">Más Rápida</div>
                <div className="text-lg font-mono text-green-400 font-bold">
                  {formatTime(fastestLap).minutes}:{formatTime(fastestLap).seconds}
                </div>
              </div>
              <div className="bg-[#2a2a2a] rounded-lg py-3 px-3 text-center border border-[#333]">
                <div className="text-xs text-gray-500 uppercase mb-1">Promedio</div>
                <div className="text-lg font-mono text-blue-400 font-bold">
                  {formatTime(avgLap).minutes}:{formatTime(avgLap).seconds}
                </div>
              </div>
              <div className="bg-[#2a2a2a] rounded-lg py-3 px-3 text-center border border-[#333]">
                <div className="text-xs text-gray-500 uppercase mb-1">Más Lenta</div>
                <div className="text-lg font-mono text-red-400 font-bold">
                  {formatTime(slowestLap).minutes}:{formatTime(slowestLap).seconds}
                </div>
              </div>
            </div>

            {/* Compliance bar */}
            {stopwatch.goal && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400">Cumplimiento del objetivo</span>
                  <span className={`font-bold ${
                    lapTimes.filter(t => t <= stopwatch.goal!).length / lapTimes.length >= 0.8
                      ? 'text-green-400'
                      : lapTimes.filter(t => t <= stopwatch.goal!).length / lapTimes.length >= 0.5
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}>
                    {Math.round((lapTimes.filter(t => t <= stopwatch.goal!).length / lapTimes.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-[#333] rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      lapTimes.filter(t => t <= stopwatch.goal!).length / lapTimes.length >= 0.8
                        ? 'bg-green-500'
                        : lapTimes.filter(t => t <= stopwatch.goal!).length / lapTimes.length >= 0.5
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${(lapTimes.filter(t => t <= stopwatch.goal!).length / lapTimes.length) * 100}%` }}
                  />
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  {lapTimes.filter(t => t <= stopwatch.goal!).length} de {lapTimes.length} vueltas bajo el objetivo
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Laps Table */}
      {stopwatch.laps.length > 0 && (
        <div className="bg-[#1e1e1e] rounded-xl border border-[#333] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#333] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-300">
              Vueltas ({stopwatch.laps.length})
            </h2>
            <span className="text-xs text-gray-500">
              Total: {formatTime(elapsed).minutes}:{formatTime(elapsed).seconds}.{formatTime(elapsed).millis}
            </span>
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
                    <tr
                      key={lap.id}
                      className={`border-b border-[#2a2a2a] ${
                        isFastest ? 'bg-green-500/5' : isSlowest ? 'bg-red-500/5' : ''
                      }`}
                    >
                      <td className="px-4 py-2 text-sm text-gray-400">Vuelta {lap.number}</td>
                      <td className={`px-4 py-2 text-right font-mono text-sm ${
                        isFastest ? 'text-green-400' : isSlowest ? 'text-red-400' : 'text-white'
                      }`}>
                        {m}:{s}.{ms}
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-sm text-gray-400">
                        {am}:{as2}.{ams}
                      </td>
                      {stopwatch.goal && (
                        <td className={`px-4 py-2 text-right font-mono text-sm ${
                          lap.splitTime <= stopwatch.goal ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {lap.splitTime <= stopwatch.goal ? '-' : '+'}
                          {formatTime(Math.abs(lap.splitTime - stopwatch.goal)).minutes}:
                          {formatTime(Math.abs(lap.splitTime - stopwatch.goal)).seconds}
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
