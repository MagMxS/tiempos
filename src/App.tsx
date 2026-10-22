import { useState, useEffect } from 'react';
import { useStopwatches } from './hooks/useStopwatches';
import StopwatchCard from './components/StopwatchCard';
import StopwatchDetail from './components/StopwatchDetail';
import { exportToExcel } from './utils/excel';
import { Plus, Timer, Download, Film, CheckCircle } from 'lucide-react';
import AdBanner from './components/AdBanner';
import VideoAdModal from './components/VideoAdModal';

const ADS_DISABLED_KEY = 'adsDisabledUntil';
const ADS_DISABLED_DURATION = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

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
  const [showVideoAd, setShowVideoAd] = useState(false);
  const [adsDisabledUntil, setAdsDisabledUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<string>('');

  const selectedStopwatch = stopwatches.find((sw) => sw.id === selectedId);

  // Cargar estado de anuncios desde localStorage
  useEffect(() => {
    const disabledUntil = localStorage.getItem(ADS_DISABLED_KEY);
    if (disabledUntil) {
      const timestamp = parseInt(disabledUntil);
      if (timestamp > Date.now()) {
        setAdsDisabledUntil(timestamp);
      } else {
        // Expiró, limpiar
        localStorage.removeItem(ADS_DISABLED_KEY);
      }
    }
  }, []);

  // Actualizar countdown cada segundo
  useEffect(() => {
    if (adsDisabledUntil) {
      const interval = setInterval(() => {
        const remaining = adsDisabledUntil - Date.now();
        if (remaining <= 0) {
          setAdsDisabledUntil(null);
          localStorage.removeItem(ADS_DISABLED_KEY);
          setCountdown('');
        } else {
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [adsDisabledUntil]);

  // Control por teclas de volumen / flechas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowUp' || e.key === 'VolumeUp') {
        e.preventDefault();
        const runningSw = stopwatches.find(sw => sw.isRunning);
        if (runningSw) {
          addLap(runningSw.id);
        }
      }

      if (e.key === 'ArrowDown' || e.key === 'VolumeDown') {
        e.preventDefault();
        const runningSw = stopwatches.find(sw => sw.isRunning);
        if (runningSw) {
          pauseStopwatch(runningSw.id);
        } else if (stopwatches.length > 0) {
          startStopwatch(stopwatches[0].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stopwatches, addLap, pauseStopwatch, startStopwatch]);

  const handleVideoComplete = () => {
    const until = Date.now() + ADS_DISABLED_DURATION;
    setAdsDisabledUntil(until);
    localStorage.setItem(ADS_DISABLED_KEY, until.toString());
  };

  const isAdsDisabled = adsDisabledUntil !== null && adsDisabledUntil > Date.now();

  // Vista detalle
  if (selectedStopwatch) {
    return (
      <>
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
        <VideoAdModal
          isOpen={showVideoAd}
          onClose={() => setShowVideoAd(false)}
          onVideoComplete={handleVideoComplete}
        />
      </>
    );
  }

  // Vista grid
  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#333] px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Timer size={24} className="text-orange-400" />
            <h1 className="text-lg md:text-xl font-bold text-white">
              Multi-Stopwatch Dashboard
            </h1>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* Botón de video / estado de anuncios */}
            {isAdsDisabled ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-600/20 border border-green-500/30 rounded-lg">
                <CheckCircle size={16} className="text-green-400" />
                <div className="hidden sm:block text-xs text-green-400">
                  <div className="font-semibold">Sin anuncios</div>
                  <div className="text-[10px] text-green-400/70">{countdown}</div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowVideoAd(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                title="Ver video para desactivar anuncios por 24 horas"
              >
                <Film size={16} />
                <span className="hidden sm:inline">Ver Video - Sin anuncios 24h</span>
                <span className="sm:hidden">Video</span>
              </button>
            )}

            {/* Botón de exportar */}
            <button
              onClick={() => exportToExcel(stopwatches)}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
              title="Descargar datos en Excel"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Excel</span>
            </button>

            {/* Atajos de teclado */}
            <div className="hidden lg:flex items-center gap-3 text-xs text-gray-500">
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
          <>
            {/* Banner superior de AdSense (solo si los anuncios están habilitados) */}
            {!isAdsDisabled && <AdBanner slot="top-banner" format="horizontal" />}

            {/* Grid de cronómetros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {stopwatches.map((sw, index) => (
                <div key={sw.id}>
                  <StopwatchCard
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
                  
                  {/* Banner de AdSense cada 3 cronómetros (solo si los anuncios están habilitados) */}
                  {!isAdsDisabled && (index + 1) % 3 === 0 && index < stopwatches.length - 1 && (
                    <div className="col-span-full my-4">
                      <AdBanner slot={`inline-${Math.floor(index / 3)}`} format="horizontal" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Banner inferior de AdSense (solo si los anuncios están habilitados) */}
            {!isAdsDisabled && <AdBanner slot="bottom-banner" format="horizontal" />}
          </>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => addStopwatch()}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-400 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
      >
        <Plus size={28} />
      </button>

      {/* Modal de video publicitario */}
      <VideoAdModal
        isOpen={showVideoAd}
        onClose={() => setShowVideoAd(false)}
        onVideoComplete={handleVideoComplete}
      />
    </div>
  );
}
