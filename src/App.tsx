import { useState, useEffect, useCallback } from 'react';
import { ViewMode } from './types';
import { useStopwatches } from './hooks/useStopwatches';
import { exportToCSV } from './utils/csv';
import { playStartSound, playStopSound } from './utils/audio';
import Header from './components/Header';
import StopwatchCard from './components/StopwatchCard';
import StopwatchDetail from './components/StopwatchDetail';
import ChartDemo from './components/ChartDemo';
import { Plus } from 'lucide-react';

export default function App() {
  // Verificar si estamos en modo demo
  const isDemoMode = window.location.search.includes('demo=true');
  
  if (isDemoMode) {
    return <ChartDemo />;
  }

  const {
    stopwatches,
    getElapsed,
    addStopwatch,
    removeStopwatch,
    duplicateStopwatch,
    startStopwatch,
    pauseStopwatch,
    resetStopwatch,
    addLap,
    renameStopwatch,
    toggleFavorite,
    setGoal,
    startAll,
    pauseAll,
    resetAll,
  } = useStopwatches();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  // Filter stopwatches
  const filteredStopwatches = stopwatches.filter(sw =>
    sw.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Sort: favorites first, then by creation date
  const sortedStopwatches = [...filteredStopwatches].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return a.createdAt - b.createdAt;
  });

  const selectedStopwatch = stopwatches.find(sw => sw.id === selectedId);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        const anyRunning = stopwatches.some(sw => sw.isRunning);
        if (anyRunning) {
          pauseAll();
          playStopSound();
        } else {
          startAll();
          playStartSound();
        }
      }

      if (e.code === 'KeyN') {
        e.preventDefault();
        addStopwatch();
      }

      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) {
        const runningStopwatches = sortedStopwatches.filter(sw => sw.isRunning);
        if (runningStopwatches[num - 1]) {
          addLap(runningStopwatches[num - 1].id);
        }
      }

      if (e.code === 'Escape' && viewMode === 'detail') {
        setViewMode('grid');
        setSelectedId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stopwatches, sortedStopwatches, viewMode, addStopwatch, addLap, pauseAll, startAll]);

  const handleStartAll = useCallback(() => {
    playStartSound();
    startAll();
  }, [startAll]);

  const handlePauseAll = useCallback(() => {
    playStopSound();
    pauseAll();
  }, [pauseAll]);

  const handleExport = useCallback(() => {
    exportToCSV(stopwatches);
  }, [stopwatches]);

  const handleCardClick = useCallback((id: string) => {
    setSelectedId(id);
    setViewMode('detail');
  }, []);

  // Detail view
  if (viewMode === 'detail' && selectedStopwatch) {
    return (
      <StopwatchDetail
        stopwatch={selectedStopwatch}
        elapsed={getElapsed(selectedStopwatch)}
        onBack={() => { setViewMode('grid'); setSelectedId(null); }}
        onStart={() => { playStartSound(); startStopwatch(selectedStopwatch.id); }}
        onPause={() => { playStopSound(); pauseStopwatch(selectedStopwatch.id); }}
        onReset={() => resetStopwatch(selectedStopwatch.id)}
        onLap={() => addLap(selectedStopwatch.id)}
        onToggleFavorite={() => toggleFavorite(selectedStopwatch.id)}
        onSetGoal={(goal) => setGoal(selectedStopwatch.id, goal)}
      />
    );
  }

  // Grid view
  return (
    <div className="min-h-screen bg-[#121212]">
      <Header
        filter={filter}
        onFilterChange={setFilter}
        onStartAll={handleStartAll}
        onPauseAll={handlePauseAll}
        onResetAll={resetAll}
        onExport={handleExport}
        stopwatchCount={stopwatches.length}
      />

      <main className="max-w-7xl mx-auto p-4 pb-24">
        {sortedStopwatches.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏱️</div>
            <h2 className="text-xl text-gray-400 mb-2">
              {filter ? 'No se encontraron cronómetros' : 'Sin cronómetros'}
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              {filter
                ? 'Intenta con otro término de búsqueda'
                : 'Presiona el botón + para agregar tu primer cronómetro'
              }
            </p>
            {!filter && (
              <button
                onClick={() => addStopwatch()}
                className="px-6 py-3 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors border border-orange-500/30"
              >
                Crear primer cronómetro
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedStopwatches.map((sw, idx) => (
              <StopwatchCard
                key={sw.id}
                stopwatch={sw}
                elapsed={getElapsed(sw)}
                index={idx}
                onStart={() => { playStartSound(); startStopwatch(sw.id); }}
                onPause={() => { playStopSound(); pauseStopwatch(sw.id); }}
                onReset={() => resetStopwatch(sw.id)}
                onLap={() => addLap(sw.id)}
                onRename={(name) => renameStopwatch(sw.id, name)}
                onToggleFavorite={() => toggleFavorite(sw.id)}
                onDuplicate={() => duplicateStopwatch(sw.id)}
                onRemove={() => removeStopwatch(sw.id)}
                onSetGoal={(goal) => setGoal(sw.id, goal)}
                onClick={() => handleCardClick(sw.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB - Floating Action Button */}
      <button
        onClick={() => addStopwatch()}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-400 text-white rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-50"
        title="Agregar Cronómetro (N)"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}
