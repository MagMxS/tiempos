import { useState, useRef, useEffect } from 'react';
import { Stopwatch } from '../types';
import { formatTime } from '../utils/time';
import { playLapSound } from '../utils/audio';
import { Play, Pause, RotateCcw, Flag, MoreVertical, Star, Copy, Trash2, Edit3, Check, X, Target, BarChart3 } from 'lucide-react';

interface StopwatchCardProps {
  stopwatch: Stopwatch;
  elapsed: number;
  index: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onLap: () => void;
  onRename: (name: string) => void;
  onToggleFavorite: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onSetGoal: (goal: number | null) => void;
  onClick: () => void;
}

export default function StopwatchCard({ stopwatch, elapsed, index, onStart, onPause, onReset, onLap, onRename, onToggleFavorite, onDuplicate, onRemove, onSetGoal, onClick }: StopwatchCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(stopwatch.name);
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [goalMinutes, setGoalMinutes] = useState('');
  const [goalSeconds, setGoalSeconds] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const goalRef = useRef<HTMLDivElement>(null);

  const { minutes, seconds, millis } = formatTime(elapsed);
  const lapTimes = stopwatch.laps.map(l => l.splitTime);
  const fastestLap = lapTimes.length > 0 ? Math.min(...lapTimes) : -1;
  const slowestLap = lapTimes.length > 0 ? Math.max(...lapTimes) : -1;
  const avgLap = lapTimes.length > 0 ? lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length : 0;
  const recentLaps = stopwatch.laps.slice(-3).reverse();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
      if (goalRef.current && !goalRef.current.contains(e.target as Node)) setShowGoalEditor(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (stopwatch.goal) {
      const { minutes: m, seconds: s } = formatTime(stopwatch.goal);
      setGoalMinutes(m);
      setGoalSeconds(s);
    }
  }, [stopwatch.goal, showGoalEditor]);

  const handleLap = (e: React.MouseEvent) => { e.stopPropagation(); playLapSound(); onLap(); };
  const handleStartPause = (e: React.MouseEvent) => { e.stopPropagation(); stopwatch.isRunning ? onPause() : onStart(); };
  const handleReset = (e: React.MouseEvent) => { e.stopPropagation(); onReset(); };
  const handleSaveName = () => { if (editName.trim()) onRename(editName.trim()); setIsEditing(false); };

  const handleSaveGoal = (e: React.MouseEvent) => {
    e.stopPropagation();
    const m = parseInt(goalMinutes) || 0;
    const s = parseInt(goalSeconds) || 0;
    const totalMs = m * 60000 + s * 1000;
    if (totalMs > 0) { onSetGoal(totalMs); setShowGoalEditor(false); }
  };

  const handlePresetGoal = (value: number, e: React.MouseEvent) => { e.stopPropagation(); onSetGoal(value); setShowGoalEditor(false); };
  const handleClearGoal = (e: React.MouseEvent) => { e.stopPropagation(); onSetGoal(null); setShowGoalEditor(false); };

  const presets = [
    { label: '30s', value: 30000 },
    { label: '1m', value: 60000 },
    { label: '2m', value: 120000 },
    { label: '3m', value: 180000 },
    { label: '5m', value: 300000 },
  ];

  return (
    <div className="relative bg-[#1e1e1e] rounded-xl border border-[#333] p-4 cursor-pointer hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200 group" onClick={onClick} title="Click para ver detalle completo">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {stopwatch.isFavorite && <Star size={14} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />}
          {isEditing ? (
            <div className="flex items-center gap-1 flex-1" onClick={e => e.stopPropagation()}>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveName()} className="bg-[#2a2a2a] text-white text-sm px-2 py-1 rounded border border-[#555] flex-1 min-w-0 outline-none focus:border-orange-500" autoFocus />
              <button onClick={handleSaveName} className="text-green-400 hover:text-green-300"><Check size={14} /></button>
              <button onClick={() => setIsEditing(false)} className="text-red-400 hover:text-red-300"><X size={14} /></button>
            </div>
          ) : (
            <span className="text-sm text-gray-300 truncate font-medium" onDoubleClick={(e) => { e.stopPropagation(); setEditName(stopwatch.name); setIsEditing(true); }} title={stopwatch.name}>
              <span className="text-gray-500 mr-1">#{index + 1}</span>{stopwatch.name}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <div className="text-gray-600 group-hover:text-orange-400 transition-colors opacity-0 group-hover:opacity-100">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </div>
          
          <div className="relative" ref={menuRef} onClick={e => e.stopPropagation()}>
            <button className="text-gray-500 hover:text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setShowMenu(!showMenu)}>
              <MoreVertical size={16} />
            </button>
              
            {showMenu && (
              <div className="absolute right-0 top-8 bg-[#2a2a2a] border border-[#444] rounded-lg shadow-xl z-50 py-1 min-w-[160px]">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#333] flex items-center gap-2" onClick={() => { setEditName(stopwatch.name); setIsEditing(true); setShowMenu(false); }}>
                  <Edit3 size={14} /> Renombrar
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#333] flex items-center gap-2" onClick={() => { onToggleFavorite(); setShowMenu(false); }}>
                  <Star size={14} /> {stopwatch.isFavorite ? 'Quitar favorito' : 'Marcar favorito'}
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#333] flex items-center gap-2" onClick={() => { onDuplicate(); setShowMenu(false); }}>
                  <Copy size={14} /> Duplicar
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#333] flex items-center gap-2" onClick={() => { onReset(); setShowMenu(false); }}>
                  <RotateCcw size={14} /> Reiniciar
                </button>
                <hr className="border-[#444] my-1" />
                <button className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-[#333] flex items-center gap-2" onClick={() => { onRemove(); setShowMenu(false); }}>
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Time Display */}
      <div className="text-center mb-4">
        <div className="font-mono text-3xl md:text-4xl tracking-tight">
          <span className="text-white">{minutes}</span>
          <span className="text-gray-500">:</span>
          <span className="text-orange-400">{seconds}</span>
          <span className="text-gray-600">.</span>
          <span className="text-green-400 text-2xl md:text-3xl">{millis}</span>
        </div>
        {stopwatch.isRunning && (
          <div className="flex items-center justify-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400">Corriendo</span>
          </div>
        )}
        {!stopwatch.isRunning && elapsed > 0 && (
          <div className="flex items-center justify-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-xs text-yellow-400">Pausado</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button onClick={handleStartPause} className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${stopwatch.isRunning ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`} title={stopwatch.isRunning ? 'Pausar' : 'Iniciar'}>
          {stopwatch.isRunning ? <Pause size={18} /> : <Play size={18} />}
        </button>
        {stopwatch.isRunning && (
          <button onClick={handleLap} className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all" title="Vuelta">
            <Flag size={18} />
          </button>
        )}
        {elapsed > 0 && (
          <button onClick={handleReset} className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all" title="Reiniciar">
            <RotateCcw size={18} />
          </button>
        )}
      </div>

      {/* GOAL SECTION */}
      <div className="border-t border-[#333] pt-3 mb-3" ref={goalRef}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Target size={14} className="text-yellow-400" />
            <span className="text-xs font-semibold text-gray-300">Objetivo</span>
          </div>
          {stopwatch.goal && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-yellow-400 font-bold">
                {formatTime(stopwatch.goal).minutes}:{formatTime(stopwatch.goal).seconds}.{formatTime(stopwatch.goal).millis}
              </span>
              <button onClick={handleClearGoal} className="text-gray-600 hover:text-red-400 transition-colors" title="Quitar objetivo">
                <X size={12} />
              </button>
            </div>
          )}
        </div>

        {showGoalEditor ? (
          <div className="bg-[#2a2a2a] rounded-lg p-3 border border-yellow-500/30">
            <p className="text-[10px] text-gray-500 mb-2">Selecciona un preset o ingresa tiempo personalizado:</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {presets.map(p => (
                <button key={p.value} onClick={(e) => handlePresetGoal(p.value, e)} className={`px-2.5 py-1 text-xs rounded border transition-colors ${stopwatch.goal === p.value ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 font-bold' : 'bg-[#1a1a1a] border-[#444] text-gray-400 hover:border-yellow-500/50 hover:text-yellow-400'}`}>
                  {p.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex-1">
                <label className="text-[9px] text-gray-500 block mb-0.5">Minutos</label>
                <input type="number" min="0" max="99" placeholder="00" value={goalMinutes} onChange={e => setGoalMinutes(e.target.value)} className="w-full bg-[#1a1a1a] text-white text-center font-mono text-sm px-2 py-1.5 rounded border border-[#444] outline-none focus:border-yellow-500" />
              </div>
              <span className="text-gray-500 font-mono text-lg mt-4">:</span>
              <div className="flex-1">
                <label className="text-[9px] text-gray-500 block mb-0.5">Segundos</label>
                <input type="number" min="0" max="59" placeholder="00" value={goalSeconds} onChange={e => setGoalSeconds(e.target.value)} className="w-full bg-[#1a1a1a] text-white text-center font-mono text-sm px-2 py-1.5 rounded border border-[#444] outline-none focus:border-yellow-500" />
              </div>
            </div>
            <button onClick={handleSaveGoal} className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors border border-green-500/30">
              <Check size={12} /> Guardar Objetivo
            </button>
          </div>
        ) : (
          <button onClick={() => setShowGoalEditor(true)} className={`w-full py-2 rounded-lg border-2 border-dashed transition-all flex items-center justify-center gap-2 ${stopwatch.goal ? 'border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50' : 'border-[#444] bg-[#2a2a2a]/50 hover:border-yellow-500/50 hover:bg-yellow-500/5'}`}>
            <Target size={14} className={stopwatch.goal ? 'text-yellow-400' : 'text-gray-500'} />
            <span className={`text-xs ${stopwatch.goal ? 'text-yellow-400' : 'text-gray-500'}`}>
              {stopwatch.goal ? 'Editar objetivo' : '⚙️ Configurar objetivo'}
            </span>
          </button>
        )}

        {stopwatch.goal && elapsed > 0 && (
          <div className={`mt-2 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold ${elapsed <= stopwatch.goal ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
            {elapsed <= stopwatch.goal ? (
              <><span>✓</span><span>En tiempo ({formatTime(stopwatch.goal - elapsed).minutes}:{formatTime(stopwatch.goal - elapsed).seconds} restantes)</span></>
            ) : (
              <><span>✗</span><span>Fuera de tiempo (+{formatTime(elapsed - stopwatch.goal).minutes}:{formatTime(elapsed - stopwatch.goal).seconds})</span></>
            )}
          </div>
        )}
      </div>

      {/* BAR CHART SECTION */}
      <div className="border-t border-[#333] pt-3 mt-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-400" />
            <span className="text-sm font-bold text-gray-200">Gráfica de Vueltas</span>
            <span className="text-xs text-gray-400 bg-[#2a2a2a] px-2 py-0.5 rounded-full font-semibold">{stopwatch.laps.length} vueltas</span>
          </div>
          {stopwatch.goal && stopwatch.laps.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-500">Cumpl:</span>
              <span className={`font-bold text-sm ${lapTimes.filter(t => t <= stopwatch.goal!).length / lapTimes.length >= 0.8 ? 'text-green-400' : lapTimes.filter(t => t <= stopwatch.goal!).length / lapTimes.length >= 0.5 ? 'text-yellow-400' : 'text-red-400'}`}>
                {Math.round((lapTimes.filter(t => t <= stopwatch.goal!).length / lapTimes.length) * 100)}%
              </span>
            </div>
          )}
        </div>

        {stopwatch.laps.length === 0 ? (
          <div className="relative bg-[#1a1a1a] rounded-lg p-4 border-2 border-dashed border-[#444]">
            <div className="flex flex-col items-center justify-center py-6">
              <BarChart3 size={48} className="text-gray-600 mb-3" />
              <p className="text-sm text-gray-400 font-semibold mb-1">📊 Sin vueltas registradas</p>
              <p className="text-xs text-gray-600 text-center">Inicia el cronómetro y presiona 🚩 para registrar vueltas</p>
            </div>
          </div>
        ) : (
          <>
            <div className="relative bg-[#1a1a1a] rounded-lg p-4 border border-[#333]">
              <div className="relative h-32 flex items-end gap-1 px-2">
                {stopwatch.goal && (
                  <div className="absolute left-0 right-0 border-t-2 border-dashed border-yellow-400 z-10 pointer-events-none" style={{ bottom: `${Math.min(100, (stopwatch.goal / Math.max(...lapTimes, stopwatch.goal)) * 100)}%` }}>
                    <span className="absolute right-0 -top-4 text-[10px] text-yellow-400 font-bold bg-[#1a1a1a] px-1">🎯 META</span>
                  </div>
                )}
                
                {stopwatch.laps.slice(-15).map((lap, i) => {
                  const maxTime = Math.max(...lapTimes, stopwatch.goal || 0);
                  const heightPercent = (lap.splitTime / maxTime) * 100;
                  let bgColor = 'bg-green-500';
                  if (stopwatch.goal) bgColor = lap.splitTime > stopwatch.goal ? 'bg-red-500' : 'bg-green-500';
                  const isFastest = lap.splitTime === fastestLap && lapTimes.filter(t => t === fastestLap).length === 1;
                  const isSlowest = lap.splitTime === slowestLap && lapTimes.filter(t => t === slowestLap).length === 1;
                  
                  return (
                    <div key={lap.id} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[9px] text-gray-400 font-mono">{formatTime(lap.splitTime).minutes}:{formatTime(lap.splitTime).seconds}</span>
                      <div className={`w-full ${bgColor} rounded-t-sm transition-all duration-300 relative ${isFastest ? 'ring-2 ring-green-400' : isSlowest ? 'ring-2 ring-red-400' : ''}`} style={{ height: `${heightPercent}%`, minHeight: '8px', opacity: 0.85 }}>
                        {isFastest && <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs">⚡</span>}
                        {isSlowest && <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs">🐢</span>}
                      </div>
                      <span className="text-[10px] text-gray-500 font-semibold">V{lap.number}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-[#333]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-green-500" />
                  <span className="text-xs text-gray-400">Bajo meta</span>
                </div>
                {stopwatch.goal && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-red-500" />
                    <span className="text-xs text-gray-400">Sobre meta</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-0.5 bg-yellow-400 border-t border-dashed" />
                  <span className="text-xs text-gray-400">Objetivo</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="bg-[#2a2a2a] rounded py-2 px-2 text-center">
                <div className="text-[10px] text-gray-500 uppercase">Mejor</div>
                <div className="text-sm font-mono text-green-400 font-bold">{formatTime(fastestLap).minutes}:{formatTime(fastestLap).seconds}</div>
              </div>
              <div className="bg-[#2a2a2a] rounded py-2 px-2 text-center">
                <div className="text-[10px] text-gray-500 uppercase">Promedio</div>
                <div className="text-sm font-mono text-blue-400 font-bold">{formatTime(avgLap).minutes}:{formatTime(avgLap).seconds}</div>
              </div>
              <div className="bg-[#2a2a2a] rounded py-2 px-2 text-center">
                <div className="text-[10px] text-gray-500 uppercase">Peor</div>
                <div className="text-sm font-mono text-red-400 font-bold">{formatTime(slowestLap).minutes}:{formatTime(slowestLap).seconds}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
