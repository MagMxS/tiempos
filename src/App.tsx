import { useState } from 'react';
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
  const selectedStopwatch = stopwatches.find((sw) => sw.id === selectedId);

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
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Timer size={24} className="text-orange-400" />
          <h1 className="text-lg md:text-xl font-bold text-white">
            Multi-Stopwatch Dashboard
          </h1>
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
    </div>
  );
}
