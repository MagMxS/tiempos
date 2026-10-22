import { useState } from 'react';
import { Stopwatch } from '../types';
import { formatTime } from '../utils/time';
import { ArrowLeft, Play, Pause, RotateCcw, Flag, Target, BarChart3, Check, X } from 'lucide-react';

interface StopwatchDetailProps {
  stopwatch: Stopwatch;
  elapsed: number;
  onBack: () => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onLap: () => void;
  onSetGoal: (goal: number | null) => void;
}

export default function StopwatchDetail({
  stopwatch,
  elapsed,
  onBack,
  onStart,
  onPause,
  onReset,
  onLap,
  onSetGoal,
}: StopwatchDetailProps) {
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [goalMinutes, setGoalMinutes] = useState('');
  const [goalSeconds, setGoalSeconds] = useState('');

  const { minutes, seconds, millis } = formatTime(elapsed);
  const lapTimes = stopwatch.laps.map((l) => l.splitTime);
  const maxLap = lapTimes.length > 0 ? Math.max(...lapTimes) : 0;
  const minLap = lapTimes.length > 0 ? Math.min(...lapTimes) : 0;
  const avgLap =
    lapTimes.length > 0
      ? lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length
      : 0;

  const presets = [
    { label: '30s', value: 30000 },
    { label: '1m', value: 60000 },
    { label: '1:30', value: 90000 },
    { label: '2m', value: 120000 },
    { label: '3m', value: 180000 },
    { label: '5m', value: 300000 },
    { label: '10m', value: 600000 },
  ];

  const handleSaveGoal = () => {
    const m = parseInt(goalMinutes) || 0;
    const s = parseInt(goalSeconds) || 0;
    const totalMs = m * 60000 + s * 1000;
    if (totalMs > 0) {
      onSetGoal(totalMs);
      setShowGoalEditor(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 md:p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
      >
        <ArrowLeft size={20} />
        <span>Volver al panel</span>
      </button>

      <h1 className="text-xl md:text-2xl font-bold mb-6">{stopwatch.name}</h1>

      {/* Time Display */}
      <div className="text-center py-6">
        <div className="font-mono text-5xl md:text-7xl tracking-tight">
          <span className="text-white">{minutes}</span>
          <span className="text-gray-500">:</span>
          <span className="text-orange-400">{seconds}</span>
          <span className="text-gray-600">.</span>
          <span className="text-green-400 text-4xl md:text-5xl">{millis}</span>
        </div>
        {stopwatch.goal && (
          <div className="mt-3">
            <span
              className={`font-mono text-sm font-bold px-3 py-1 rounded-lg ${
                elapsed <= stopwatch.goal
                  ? 'text-green-400 bg-green-500/10 border border-green-500/30'
                  : 'text-red-400 bg-red-500/10 border border-red-500/30'
              }`}
            >
              {elapsed <= stopwatch.goal ? '✓ En tiempo' : '✗ Fuera de tiempo'}
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={stopwatch.isRunning ? onPause : onStart}
          className={`flex items-center justify-center w-14 h-14 rounded-full transition-all ${
            stopwatch.isRunning
              ? 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/40'
              : 'bg-green-500/20 text-green-400 border-2 border-green-500/40'
          }`}
        >
          {stopwatch.isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        {stopwatch.isRunning && (
          <button
            onClick={onLap}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/20 text-blue-400 border-2 border-blue-500/40"
          >
            <Flag size={24} />
          </button>
        )}
        {elapsed > 0 && (
          <button
            onClick={onReset}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-red-500/20 text-red-400 border-2 border-red-500/40"
          >
            <RotateCcw size={24} />
          </button>
        )}
      </div>

      {/* Goal Section */}
      <div className="bg-[#1e1e1e] rounded-xl border border-[#333] p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-yellow-400" />
            <h2 className="text-base font-bold text-gray-200">Objetivo</h2>
          </div>
          {stopwatch.goal && (
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg text-yellow-400 font-bold">
                {formatTime(stopwatch.goal).minutes}:
                {formatTime(stopwatch.goal).seconds}
              </span>
              <button
                onClick={() => onSetGoal(null)}
                className="text-gray-500 hover:text-red-400"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {showGoalEditor ? (
          <div className="bg-[#2a2a2a] rounded-lg p-4 border border-yellow-500/30">
            <div className="flex flex-wrap gap-2 mb-4">
              {presets.map((p) => (
                <button
                  key={p.value}
                  onClick={() => {
                    onSetGoal(p.value);
                    setShowGoalEditor(false);
                  }}
                  className="px-4 py-2 text-sm bg-[#1a1a1a] border border-[#444] text-gray-400 rounded-lg hover:border-yellow-500/50 hover:text-yellow-400"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">
                  Minutos
                </label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  placeholder="00"
                  value={goalMinutes}
                  onChange={(e) => setGoalMinutes(e.target.value)}
                  className="w-full bg-[#1a1a1a] text-white text-center font-mono text-lg px-3 py-2 rounded-lg border border-[#444] outline-none focus:border-yellow-500"
                />
              </div>
              <span className="text-gray-500 font-mono text-2xl mt-5">:</span>
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">
                  Segundos
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="00"
                  value={goalSeconds}
                  onChange={(e) => setGoalSeconds(e.target.value)}
                  className="w-full bg-[#1a1a1a] text-white text-center font-mono text-lg px-3 py-2 rounded-lg border border-[#444] outline-none focus:border-yellow-500"
                />
              </div>
            </div>
            <button
              onClick={handleSaveGoal}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 border border-green-500/30 font-semibold"
            >
              <Check size={16} /> Guardar Objetivo
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowGoalEditor(true)}
            className={`w-full py-3 rounded-lg border-2 border-dashed transition-all flex items-center justify-center gap-2 ${
              stopwatch.goal
                ? 'border-yellow-500/30 bg-yellow-500/5'
                : 'border-[#555] bg-[#2a2a2a]/50 hover:border-yellow-500/50'
            }`}
          >
            <Target
              size={18}
              className={stopwatch.goal ? 'text-yellow-400' : 'text-gray-500'}
            />
            <span
              className={`text-sm font-semibold ${
                stopwatch.goal ? 'text-yellow-400' : 'text-gray-400'
              }`}
            >
              {stopwatch.goal ? '✏️ Editar objetivo' : '⚙️ Configurar objetivo'}
            </span>
          </button>
        )}
      </div>

      {/* Bar Chart */}
      {stopwatch.laps.length > 0 && (
        <div className="bg-[#1e1e1e] rounded-xl border border-[#333] p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-400" />
              <h2 className="text-base font-bold text-gray-200">
                Gráfica de Vueltas
              </h2>
              <span className="text-xs text-gray-400 bg-[#2a2a2a] px-2 py-0.5 rounded-full">
                {stopwatch.laps.length} vueltas
              </span>
            </div>
            {stopwatch.goal && (
              <div className="text-sm">
                <span className="text-gray-500">Cumpl: </span>
                <span
                  className={`font-bold text-lg ${
                    lapTimes.filter((t) => t <= stopwatch.goal!).length /
                      lapTimes.length >=
                    0.8
                      ? 'text-green-400'
                      : lapTimes.filter((t) => t <= stopwatch.goal!).length /
                          lapTimes.length >=
                        0.5
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }`}
                >
                  {Math.round(
                    (lapTimes.filter((t) => t <= stopwatch.goal!).length /
                      lapTimes.length) *
                      100
                  )}
                  %
                </span>
              </div>
            )}
          </div>

          <div className="relative bg-[#1a1a1a] rounded-lg p-4 border border-[#333]">
            <div className="flex gap-3">
              {/* Y-axis scale */}
              <div className="relative w-12 flex-shrink-0">
                {(() => {
                  const maxTime = Math.max(maxLap, stopwatch.goal || 0) * 1.1;
                  const ticks = 6;
                  return Array.from({ length: ticks + 1 }, (_, i) => {
                    const timeValue = (maxTime * i) / ticks;
                    const bottomPercent = (i / ticks) * 100;
                    return (
                      <div
                        key={i}
                        className="absolute right-0 text-[10px] text-gray-400 font-mono"
                        style={{ bottom: `${bottomPercent}%`, transform: 'translateY(50%)' }}
                      >
                        {formatTime(timeValue).minutes}:{formatTime(timeValue).seconds}
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Chart area */}
              <div className="flex-1 relative">
                {/* Goal line */}
                {stopwatch.goal && (
                  <div
                    className="absolute left-0 right-0 border-t-2 border-dashed border-yellow-400 z-10 pointer-events-none"
                    style={{
                      bottom: `${Math.min(100, (stopwatch.goal / (Math.max(maxLap, stopwatch.goal) * 1.1)) * 100)}%`,
                    }}
                  >
                    <span className="absolute right-0 -top-5 text-xs text-yellow-400 font-bold bg-[#1a1a1a] px-2">
                      🎯 META
                    </span>
                  </div>
                )}

                {/* Grid lines */}
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 border-t border-[#333]"
                    style={{ bottom: `${(i / 6) * 100}%` }}
                  />
                ))}

                {/* Bars */}
                <div className="relative h-48 md:h-64 flex items-end gap-1 px-2">
                  {stopwatch.laps.map((lap) => {
                    const maxTime = Math.max(maxLap, stopwatch.goal || 0) * 1.1;
                    const heightPercent = (lap.splitTime / maxTime) * 100;
                    let bgColor = 'bg-green-500';
                    if (stopwatch.goal) {
                      bgColor =
                        lap.splitTime > stopwatch.goal
                          ? 'bg-red-500'
                          : 'bg-green-500';
                    }
                    const isFastest = lap.splitTime === minLap;
                    const isSlowest = lap.splitTime === maxLap;

                    return (
                      <div
                        key={lap.id}
                        className="flex-1 flex flex-col items-center gap-1"
                      >
                        <span className="text-[10px] text-gray-400 font-mono">
                          {formatTime(lap.splitTime).minutes}:
                          {formatTime(lap.splitTime).seconds}
                        </span>
                        <div
                          className={`w-full ${bgColor} rounded-t-md transition-all ${
                            isFastest ? 'ring-2 ring-green-400' : ''
                          } ${isSlowest ? 'ring-2 ring-red-400' : ''}`}
                          style={{
                            height: `${heightPercent}%`,
                            minHeight: '8px',
                            opacity: 0.85,
                          }}
                        >
                          {isFastest && (
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs">
                              ⚡
                            </span>
                          )}
                          {isSlowest && (
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs">
                              🐢
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 font-semibold">
                          V{lap.number}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

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
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-[#2a2a2a] rounded-lg py-3 text-center border border-[#333]">
              <div className="text-xs text-gray-500 uppercase mb-1">
                Más Rápida
              </div>
              <div className="text-lg font-mono text-green-400 font-bold">
                {formatTime(minLap).minutes}:{formatTime(minLap).seconds}
              </div>
            </div>
            <div className="bg-[#2a2a2a] rounded-lg py-3 text-center border border-[#333]">
              <div className="text-xs text-gray-500 uppercase mb-1">
                Promedio
              </div>
              <div className="text-lg font-mono text-blue-400 font-bold">
                {formatTime(avgLap).minutes}:{formatTime(avgLap).seconds}
              </div>
            </div>
            <div className="bg-[#2a2a2a] rounded-lg py-3 text-center border border-[#333]">
              <div className="text-xs text-gray-500 uppercase mb-1">
                Más Lenta
              </div>
              <div className="text-lg font-mono text-red-400 font-bold">
                {formatTime(maxLap).minutes}:{formatTime(maxLap).seconds}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Laps Table */}
      {stopwatch.laps.length > 0 && (
        <div className="bg-[#1e1e1e] rounded-xl border border-[#333] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#333]">
            <h2 className="text-sm font-semibold text-gray-300">
              Vueltas ({stopwatch.laps.length})
            </h2>
          </div>
          <div className="max-h-[50vh] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#1e1e1e]">
                <tr className="text-xs text-gray-500 border-b border-[#333]">
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-right">Parcial</th>
                  <th className="px-4 py-2 text-right">Acumulado</th>
                  <th className="px-4 py-2 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {[...stopwatch.laps].reverse().map((lap) => {
                  const isFastest = lap.splitTime === minLap;
                  const isSlowest = lap.splitTime === maxLap;
                  const { minutes: m, seconds: s, millis: ms } = formatTime(
                    lap.splitTime
                  );
                  return (
                    <tr
                      key={lap.id}
                      className={`border-b border-[#2a2a2a] ${
                        isFastest
                          ? 'bg-green-500/5'
                          : isSlowest
                            ? 'bg-red-500/5'
                            : ''
                      }`}
                    >
                      <td className="px-4 py-2 text-sm text-gray-400">
                        Vuelta {lap.number}
                      </td>
                      <td
                        className={`px-4 py-2 text-right font-mono text-sm ${
                          isFastest
                            ? 'text-green-400'
                            : isSlowest
                              ? 'text-red-400'
                              : 'text-white'
                        }`}
                      >
                        {m}:{s}.{ms}
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-sm text-gray-400">
                        {formatTime(lap.totalTime).minutes}:
                        {formatTime(lap.totalTime).seconds}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {isFastest && (
                          <span className="text-xs text-green-400">
                            ⚡ Rápida
                          </span>
                        )}
                        {isSlowest && (
                          <span className="text-xs text-red-400">
                            🐢 Lenta
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
