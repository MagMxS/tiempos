import { useState, useEffect } from 'react';
import { useStopwatches } from './hooks/useStopwatches';
import StopwatchCard from './components/StopwatchCard';
import StopwatchDetail from './components/StopwatchDetail';
import { Plus, Timer } from 'lucide-react';

export default function App() {
  const {
    stopwatches,
    getElapsed,
    addStopwatch,
    removeStopwatch,
    startStopwatch,
    pauseStopwatch,
    resetStopwatch,
    addLap,
    setGoal,
  } = useStopwatches();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const selectedStopwatch = stopwatches.find((sw) => sw.id === selectedId);

  // Control por teclas de volumen / flechas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // No interceptar si está escribiendo en un input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Flecha arriba o Volume Up = registrar vuelta
      if (e.key === 'ArrowUp' || e.key === 'VolumeUp') {
        e.preventDefault();
        const runningSw = stopwatches.find(sw => sw.isRunning);
        if (runningSw) {
          addLap(runningSw.id);
          setActionFeedback('🚩 Vuelta registrada');
          setTimeout(() => setActionFeedback(null), 1500);
        }
      }

      // Flecha abajo o Volume Down = pausar/reanudar
      if (e.key === 'ArrowDown' || e.key === 'VolumeDown') {
        e.preventDefault();
        const runningSw = stopwatches.find(sw => sw.isRunning);
        if (runningSw) {
          pauseStopwatch(runningSw.id);
          setActionFeedback('⏸️ Pausado');
          setTimeout(() => setActionFeedback(null), 1500);
        } else if (stopwatches.length > 0) {
          // Si no hay ninguno corriendo, iniciar el primero
          startStopwatch(stopwatches[0].id);
          setActionFeedback('▶️ Iniciado');
          setTimeout(() => setActionFeedback(null), 1500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stopwatches, addLap, pauseStopwatch, startStopwatch]);

  // Vista detalle
  if (selectedStopwatch) {
    return (
      <StopwatchDetail
        stopwatch={selectedStopwatch}
        elapsed={getElapsed(selectedStopwatch)}
        onBack={() => setSelectedId(null)}
        onStart={() => startStopwatch(selectedStopwatch.id)}
        onPause={() => pauseStopwatch(selectedStopwatch.id)}
        onReset={() => resetStopwatch(selectedStopwatch.id)}
        onLap={() => addLap(selectedStopwatch.id)}
        onSetGoal={(goal) => setGoal(selectedStopwatch.id, goal)}
      />
    );
  }

  // Vista grid
  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#333] px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer size={24} className="text-orange-400" />
            <h1 className="text-lg md:text-xl font-bold text-white">
              Multi-Stopwatch Dashboard
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-[#2a2a2a] rounded border border-[#444]">↑</kbd>
              <span>Vuelta</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-[#2a2a2a] rounded border border-[#444]">↓</kbd>
              <span>Pausa</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 pb-24">
        {stopwatches.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏱️</div>
            <h2 className="text-xl text-gray-400 mb-2">Sin cronómetros</h2>
            <p className="text-gray-600 text-sm mb-6">
              Presiona el botón + para agregar tu primer cronómetro
            </p>
            <button
              onClick={() => addStopwatch()}
              className="px-6 py-3 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 border border-orange-500/30"
            >
              Crear primer cronómetro
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stopwatches.map((sw) => (
              <StopwatchCard
                key={sw.id}
                stopwatch={sw}
                elapsed={getElapsed(sw)}
                onStart={() => startStopwatch(sw.id)}
                onPause={() => pauseStopwatch(sw.id)}
                onReset={() => resetStopwatch(sw.id)}
                onLap={() => addLap(sw.id)}
                onRemove={() => removeStopwatch(sw.id)}
                onSetGoal={(goal) => setGoal(sw.id, goal)}
                onViewDetail={() => setSelectedId(sw.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => addStopwatch()}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-400 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
      >
        <Plus size={28} />
      </button>

      {/* Action Feedback Toast */}
      {actionFeedback && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#2a2a2a] border border-orange-500/50 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce">
          <span className="text-sm font-semibold">{actionFeedback}</span>
        </div>
      )}
    </div>
  );
}
