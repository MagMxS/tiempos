import { useState } from 'react';
import { Search, Play, Pause, RotateCcw, Download, Timer } from 'lucide-react';

interface HeaderProps {
  filter: string;
  onFilterChange: (value: string) => void;
  onStartAll: () => void;
  onPauseAll: () => void;
  onResetAll: () => void;
  onExport: () => void;
  stopwatchCount: number;
}

export default function Header({ filter, onFilterChange, onStartAll, onPauseAll, onResetAll, onExport, stopwatchCount }: HeaderProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <header className="bg-[#1a1a1a] border-b border-[#333] px-4 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Timer size={24} className="text-orange-400" />
            <h1 className="text-lg md:text-xl font-bold text-white hidden sm:block">Multi-Stopwatch</h1>
          </div>

          <div className="flex-1 max-w-xs">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar cronómetro..."
                value={filter}
                onChange={e => onFilterChange(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white text-sm pl-9 pr-3 py-2 rounded-lg border border-[#444] outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="hidden md:flex items-center gap-1">
              <button onClick={onStartAll} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors" title="Iniciar Todos">
                <Play size={12} /><span>Iniciar</span>
              </button>
              <button onClick={onPauseAll} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors" title="Pausar Todos">
                <Pause size={12} /><span>Pausar</span>
              </button>
              <button onClick={onResetAll} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors" title="Reiniciar Todos">
                <RotateCcw size={12} /><span>Reset</span>
              </button>
              <button onClick={onExport} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors" title="Exportar CSV">
                <Download size={12} /><span>CSV</span>
              </button>
            </div>

            <button className="md:hidden text-gray-400 hover:text-white p-2" onClick={() => setShowActions(!showActions)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
              </svg>
            </button>
          </div>
        </div>

        {showActions && (
          <div className="md:hidden mt-3 flex flex-wrap gap-2">
            <button onClick={() => { onStartAll(); setShowActions(false); }} className="flex items-center gap-1 px-3 py-2 text-xs bg-green-500/20 text-green-400 rounded-lg">
              <Play size={12} /> Iniciar Todos
            </button>
            <button onClick={() => { onPauseAll(); setShowActions(false); }} className="flex items-center gap-1 px-3 py-2 text-xs bg-yellow-500/20 text-yellow-400 rounded-lg">
              <Pause size={12} /> Pausar Todos
            </button>
            <button onClick={() => { onResetAll(); setShowActions(false); }} className="flex items-center gap-1 px-3 py-2 text-xs bg-red-500/20 text-red-400 rounded-lg">
              <RotateCcw size={12} /> Reset Todos
            </button>
            <button onClick={() => { onExport(); setShowActions(false); }} className="flex items-center gap-1 px-3 py-2 text-xs bg-blue-500/20 text-blue-400 rounded-lg">
              <Download size={12} /> Exportar CSV
            </button>
          </div>
        )}

        <div className="hidden lg:flex items-center gap-4 mt-2 text-[10px] text-gray-600">
          <span>Espacio: Pausa global</span>
          <span>1-9: Vuelta en cronómetro</span>
          <span>N: Nuevo cronómetro</span>
        </div>
      </div>
    </header>
  );
}
