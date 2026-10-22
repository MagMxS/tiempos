import { useState } from 'react';
import { Stopwatch } from '../types';
import { formatTime } from '../utils/time';
import { Play, Pause, RotateCcw, Flag, Target, BarChart3, Check, X, Trash2 } from 'lucide-react';

interface StopwatchCardProps {
  stopwatch: Stopwatch;
  elapsed: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onLap: () => void;
  onRemove: () => void;
  onSetGoal: (goal: number | null) => void;
  onViewDetail: () => void;
}

export default function StopwatchCard({
  stopwatch,
  elapsed,
  onStart,
  onPause,
  onReset,
  onLap,
  onRemove,
  onSetGoal,
  onViewDetail,
}: StopwatchCardProps) {
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

  const handleSaveGoal = () => {
    const m = parseInt(goalMinutes) || 0;
    const s = parseInt(goalSeconds) || 0;
    const totalMs = m * 60000 + s * 1000;
    if (totalMs > 0) {
      onSetGoal(totalMs);
      setShowGoalEditor(false);
    }
  };

  const presets = [
    { label: '30s', value: 30000 },
    { label: '1m', value: 60000 },
    { label: '2m', value: 120000 },
    { label: '3m', value: 180000 },
    { label: '5m', value: 300000 },
  ];

  return (
    <div className="bg-[#1e1e1e] rounded-xl border border-[#333] p-4 hover:border-orange-500/50 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-300 truncate">
          {stopwatch.name}
        </h3>
        <button
          onClick={onRemove}
          className="text-gray-600 hover:text-red-400 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Time Display */}
      <div className="text-center mb-4">
        <div className="font-mono text-3xl tracking-tight">
          <span className="text-white">{minutes}</span>
          <span className="text-gray-500">:</span>
          <span className="text-orange-400">{seconds}</span>
          <span className="text-gray-600">.</span>
          <span className="text-green-400 text-2xl">{millis}</span>
        </div>
        {stopwatch.isRunning && (
          <div className="flex items-center justify-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400">Corriendo</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={stopwatch.isRunning ? onPause : onStart}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
            stopwatch.isRunning
              ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
          }`}
        >
          {stopwatch.isRunning ? <Pause size={18} /> : <Play size={18} />}
        </button>

        {stopwatch.isRunning && (
          <button
            onClick={onLap}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
          >
            <Flag size={18} />
          </button>
        )}

        {elapsed > 0 && (
          <button
            onClick={onReset}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
          >
            <RotateCcw size={18} />
          </button>
        )}
      </div>

      {/* Goal Section */}
      <div className="border-t border-[#333] pt-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Target size={14} className="text-yellow-400" />
            <span className="text-xs font-semibold text-gray-300">
              Objetivo
            </span>
          </div>
          {stopwatch.goal && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-yellow-400 font-bold">
                {formatTime(stopwatch.goal).minutes}:
                {formatTime(stopwatch.goal).seconds}
              </span>
              <button
                onClick={() => onSetGoal(null)}
                className="text-gray-600 hover:text-red-400"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>

        {showGoalEditor ? (
          <div className="bg-[#2a2a2a] rounded-lg p-3 border border-yellow-500/30">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {presets.map((p) => (
                <button
                  key={p.value}
                  onClick={() => {
                    onSetGoal(p.value);
                    setShowGoalEditor(false);
                  }}
                  className="px-2 py-1 text-xs bg-[#1a1a1a] border border-[#444] text-gray-400 rounded hover:border-yellow-500/50 hover:text-yellow-400"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <input
                type="number"
                min="0"
                max="99"
                placeholder="MM"
                value={goalMinutes}
                onChange={(e) => setGoalMinutes(e.target.value)}
                className="w-14 bg-[#1a1a1a] text-white text-center font-mono text-sm px-2 py-1 rounded border border-[#444] outline-none focus:border-yellow-500"
              />
              <span className="text-gray-500 font-mono">:</span>
              <input
                type="number"
                min="0"
                max="59"
                placeholder="SS"
                value={goalSeconds}
                onChange={(e) => setGoalSeconds(e.target.value)}
                className="w-14 bg-[#1a1a1a] text-white text-center font-mono text-sm px-2 py-1 rounded border border-[#444] outline-none focus:border-yellow-500"
              />
            </div>
            <button
              onClick={handleSaveGoal}
              className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
            >
              <Check size={12} /> Guardar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowGoalEditor(true)}
            className={`w-full py-2 rounded-lg border-2 border-dashed transition-all flex items-center justify-center gap-2 ${
              stopwatch.goal
                ? 'border-yellow-500/30 bg-yellow-500/5'
                : 'border-[#444] bg-[#2a2a2a]/50 hover:border-yellow-500/50'
            }`}
          >
            <Target
              size={14}
              className={stopwatch.goal ? 'text-yellow-400' : 'text-gray-500'}
            />
            <span
              className={`text-xs ${
                stopwatch.goal ? 'text-yellow-400' : 'text-gray-500'
              }`}
            >
              {stopwatch.goal ? 'Editar objetivo' : '⚙️ Configurar objetivo'}
            </span>
          </button>
        )}
      </div>

      {/* Bar Chart Section */}
      <div className="border-t border-[#333] pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <BarChart3 size={14} className="text-blue-400" />
            <span className="text-xs font-semibold text-gray-300">
              Gráfica
            </span>
            <span className="text-[10px] text-gray-500 bg-[#2a2a2a] px-1.5 py-0.5 rounded">
              {stopwatch.laps.length}
            </span>
          </div>
        </div>

        {stopwatch.laps.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-lg p-4 border-2 border-dashed border-[#444]">
            <div className="flex flex-col items-center justify-center py-4">
              <BarChart3 size={32} className="text-gray-600 mb-2" />
              <p className="text-xs text-gray-500 text-center">
                Registra vueltas para ver la gráfica
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="relative bg-[#1a1a1a] rounded-lg p-3 border border-[#333]">
            <div className="flex gap-2">
              {/* Y-axis scale */}
              <div className="relative w-10 flex-shrink-0 h-24">
                {(() => {
                  const maxTime = Math.max(maxLap, stopwatch.goal || 0) * 1.1;
                  const ticks = 5;
                  return Array.from({ length: ticks + 1 }, (_, i) => {
                    const timeValue = (maxTime * i) / ticks;
                    const bottomPercent = (i / ticks) * 100;
                    return (
                      <div
                        key={i}
                        className="absolute right-0 text-[8px] text-gray-500 font-mono"
                        style={{ bottom: `${bottomPercent}%`, transform: 'translateY(50%)' }}
                      >
                        {formatTime(timeValue).minutes}:{formatTime(timeValue).seconds}
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Chart area */}
              <div className="flex-1 relative h-24">
                {/* Goal line */}
                {stopwatch.goal && (
                  <div
                    className="absolute left-0 right-0 border-t-2 border-dashed border-yellow-400 z-10 pointer-events-none"
                    style={{
                      bottom: `${(stopwatch.goal / (Math.max(maxLap, stopwatch.goal) * 1.1)) * 100}%`,
                    }}
                  >
                    <span className="absolute right-1 -top-3 text-[8px] text-yellow-400 font-bold bg-[#1a1a1a] px-1">
                      🎯 META
                    </span>
                  </div>
                )}

                {/* Grid lines */}
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 border-t border-[#333]"
                    style={{ bottom: `${(i / 5) * 100}%` }}
                  />
                ))}

                {/* Bars */}
                <div className="absolute bottom-0 left-0 right-0 top-0 flex items-end gap-0.5">
                  {stopwatch.laps.slice(-10).map((lap) => {
                    const maxTime = Math.max(maxLap, stopwatch.goal || 0) * 1.1;
                    const heightPercent = (lap.splitTime / maxTime) * 100;
                    let bgColor = 'bg-green-500';
                    if (stopwatch.goal) {
                      bgColor =
                        lap.splitTime > stopwatch.goal
                          ? 'bg-green-500'
                          : 'bg-red-500';
                    }
                    const isFastest = lap.splitTime === minLap;
                    const isSlowest = lap.splitTime === maxLap;

                    return (
                      <div
                        key={lap.id}
                        className="flex-1 flex flex-col items-center justify-end h-full"
                      >
                        <div
                          className={`w-full ${bgColor} rounded-t-sm transition-all ${
                            isFastest ? 'ring-1 ring-green-400' : ''
                          } ${isSlowest ? 'ring-1 ring-red-400' : ''}`}
                          style={{
                            height: `${heightPercent}%`,
                            minHeight: '2px',
                            opacity: 0.85,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* X-axis labels */}
            <div className="flex gap-0.5 mt-1 ml-10">
              {stopwatch.laps.slice(-10).map((lap) => (
                <div key={lap.id} className="flex-1 text-center">
                  <span className="text-[8px] text-gray-500">V{lap.number}</span>
                </div>
              ))}
            </div>            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-1 mt-2">
              <div className="bg-[#2a2a2a] rounded py-1 text-center">
                <div className="text-[8px] text-gray-500">Mejor</div>
                <div className="text-[10px] font-mono text-green-400 font-bold">
                  {formatTime(minLap).minutes}:{formatTime(minLap).seconds}
                </div>
              </div>
              <div className="bg-[#2a2a2a] rounded py-1 text-center">
                <div className="text-[8px] text-gray-500">Prom</div>
                <div className="text-[10px] font-mono text-blue-400 font-bold">
                  {formatTime(avgLap).minutes}:{formatTime(avgLap).seconds}
                </div>
              </div>
              <div className="bg-[#2a2a2a] rounded py-1 text-center">
                <div className="text-[8px] text-gray-500">Peor</div>
                <div className="text-[10px] font-mono text-red-400 font-bold">
                  {formatTime(maxLap).minutes}:{formatTime(maxLap).seconds}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Detail Button */}
      <button
        onClick={onViewDetail}
        className="w-full mt-3 py-2 text-xs text-gray-400 hover:text-orange-400 bg-[#2a2a2a] hover:bg-[#333] rounded-lg transition-colors"
      >
        Ver detalle completo →
      </button>
    </div>
  );
}
