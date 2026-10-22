import { BarChart3, Target } from 'lucide-react';

export default function ChartDemo() {
  // Datos de ejemplo para demostración
  const demoStopwatch1 = {
    name: 'Grabado 1',
    goal: 60000, // 1 minuto
    laps: [
      { number: 1, splitTime: 55000 }, // 55s - bajo meta
      { number: 2, splitTime: 65000 }, // 65s - sobre meta
      { number: 3, splitTime: 58000 }, // 58s - bajo meta
      { number: 4, splitTime: 70000 }, // 70s - sobre meta
      { number: 5, splitTime: 52000 }, // 52s - bajo meta (mejor)
    ],
  };

  const demoStopwatch2 = {
    name: 'Ensamble',
    goal: 120000, // 2 minutos
    laps: [
      { number: 1, splitTime: 110000 },
      { number: 2, splitTime: 115000 },
      { number: 3, splitTime: 105000 },
      { number: 4, splitTime: 125000 },
      { number: 5, splitTime: 118000 },
      { number: 6, splitTime: 130000 },
    ],
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return { minutes: String(minutes).padStart(2, '0'), seconds: String(seconds).padStart(2, '0') };
  };

  return (
    <div className="min-h-screen bg-[#121212] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          📊 Demostración: Gráficas en Cada Cronómetro
        </h1>
        <p className="text-gray-400 mb-8">
          Así es como debería verse el gráfico de barras en cada tarjeta de cronómetro
        </p>

        {/* Ejemplo 1 */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-orange-400 mb-4">
            Ejemplo 1: Cronómetro con 5 vueltas (Meta: 1:00)
          </h2>
          <div className="bg-[#1e1e1e] rounded-xl border border-[#333] p-6">
            {/* Header del cronómetro */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">#1</span>
                <span className="text-lg font-semibold text-gray-300">{demoStopwatch1.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target size={14} className="text-yellow-400" />
                <span className="font-mono text-sm text-yellow-400 font-bold">
                  {formatTime(demoStopwatch1.goal).minutes}:{formatTime(demoStopwatch1.goal).seconds}.000
                </span>
              </div>
            </div>

            {/* Tiempo actual */}
            <div className="text-center mb-6">
              <div className="font-mono text-4xl tracking-tight">
                <span className="text-white">04</span>
                <span className="text-gray-500">:</span>
                <span className="text-orange-400">32</span>
                <span className="text-gray-600">.</span>
                <span className="text-green-400 text-3xl">156</span>
              </div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-400">Corriendo</span>
              </div>
            </div>

            {/* Sección de Objetivo */}
            <div className="border-t border-[#333] pt-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Target size={14} className="text-yellow-400" />
                  <span className="text-xs font-semibold text-gray-300">Objetivo</span>
                </div>
                <span className="font-mono text-sm text-yellow-400 font-bold">
                  {formatTime(demoStopwatch1.goal).minutes}:{formatTime(demoStopwatch1.goal).seconds}.000
                </span>
              </div>
              <div className="bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg py-1.5 text-center text-xs font-bold">
                ✓ En tiempo (00:27 restantes)
              </div>
            </div>

            {/* SECCIÓN DE GRÁFICA DE BARRAS */}
            <div className="border-t border-[#333] pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-blue-400" />
                  <span className="text-sm font-bold text-gray-200">
                    Gráfica de Vueltas
                  </span>
                  <span className="text-xs text-gray-400 bg-[#2a2a2a] px-2 py-0.5 rounded-full font-semibold">
                    {demoStopwatch1.laps.length} vueltas
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-gray-500">Cumpl:</span>
                  <span className="font-bold text-sm text-yellow-400">
                    60%
                  </span>
                </div>
              </div>

              {/* Contenedor del gráfico */}
              <div className="relative bg-[#1a1a1a] rounded-lg p-4 border border-[#333]">
                {/* Línea de meta */}
                <div 
                  className="absolute left-0 right-0 border-t-2 border-dashed border-yellow-400 z-10 pointer-events-none"
                  style={{ bottom: '60%' }}
                >
                  <span className="absolute right-0 -top-4 text-[10px] text-yellow-400 font-bold bg-[#1a1a1a] px-1">
                    🎯 META
                  </span>
                </div>

                {/* Barras */}
                <div className="relative h-32 flex items-end gap-1 px-2">
                  {demoStopwatch1.laps.map((lap, i) => {
                    const maxTime = Math.max(...demoStopwatch1.laps.map(l => l.splitTime), demoStopwatch1.goal);
                    const heightPercent = (lap.splitTime / maxTime) * 100;
                    const isUnderGoal = lap.splitTime <= demoStopwatch1.goal;
                    const isFastest = lap.splitTime === Math.min(...demoStopwatch1.laps.map(l => l.splitTime));
                    const isSlowest = lap.splitTime === Math.max(...demoStopwatch1.laps.map(l => l.splitTime));
                    
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[9px] text-gray-400 font-mono">
                          {formatTime(lap.splitTime).minutes}:{formatTime(lap.splitTime).seconds}
                        </span>
                        <div 
                          className={`w-full rounded-t-sm transition-all duration-300 relative ${
                            isUnderGoal ? 'bg-green-500' : 'bg-red-500'
                          } ${isFastest ? 'ring-2 ring-green-400' : ''} ${isSlowest ? 'ring-2 ring-red-400' : ''}`}
                          style={{ 
                            height: `${heightPercent}%`,
                            minHeight: '8px',
                            opacity: 0.85,
                          }}
                        >
                          {isFastest && (
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs">⚡</span>
                          )}
                          {isSlowest && (
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs">🐢</span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500 font-semibold">
                          V{lap.number}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Leyenda */}
                <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-[#333]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-green-500" />
                    <span className="text-xs text-gray-400">Bajo meta</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-red-500" />
                    <span className="text-xs text-gray-400">Sobre meta</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-0.5 bg-yellow-400 border-t border-dashed" />
                    <span className="text-xs text-gray-400">Objetivo</span>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="bg-[#2a2a2a] rounded py-2 px-2 text-center">
                  <div className="text-[10px] text-gray-500 uppercase">Mejor</div>
                  <div className="text-sm font-mono text-green-400 font-bold">00:52</div>
                </div>
                <div className="bg-[#2a2a2a] rounded py-2 px-2 text-center">
                  <div className="text-[10px] text-gray-500 uppercase">Promedio</div>
                  <div className="text-sm font-mono text-blue-400 font-bold">01:00</div>
                </div>
                <div className="bg-[#2a2a2a] rounded py-2 px-2 text-center">
                  <div className="text-[10px] text-gray-500 uppercase">Peor</div>
                  <div className="text-sm font-mono text-red-400 font-bold">01:10</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ejemplo 2 */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-orange-400 mb-4">
            Ejemplo 2: Cronómetro con 6 vueltas (Meta: 2:00)
          </h2>
          <div className="bg-[#1e1e1e] rounded-xl border border-[#333] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">#2</span>
                <span className="text-lg font-semibold text-gray-300">{demoStopwatch2.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target size={14} className="text-yellow-400" />
                <span className="font-mono text-sm text-yellow-400 font-bold">
                  {formatTime(demoStopwatch2.goal).minutes}:{formatTime(demoStopwatch2.goal).seconds}.000
                </span>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="font-mono text-4xl tracking-tight">
                <span className="text-white">12</span>
                <span className="text-gray-500">:</span>
                <span className="text-orange-400">45</span>
                <span className="text-gray-600">.</span>
                <span className="text-green-400 text-3xl">892</span>
              </div>
            </div>

            {/* Gráfica simplificada */}
            <div className="border-t border-[#333] pt-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 size={16} className="text-blue-400" />
                <span className="text-sm font-bold text-gray-200">Gráfica de Vueltas</span>
                <span className="text-xs text-gray-400 bg-[#2a2a2a] px-2 py-0.5 rounded-full font-semibold">
                  {demoStopwatch2.laps.length} vueltas
                </span>
              </div>

              <div className="relative bg-[#1a1a1a] rounded-lg p-4 border border-[#333]">
                <div 
                  className="absolute left-0 right-0 border-t-2 border-dashed border-yellow-400 z-10 pointer-events-none"
                  style={{ bottom: '70%' }}
                >
                  <span className="absolute right-0 -top-4 text-[10px] text-yellow-400 font-bold bg-[#1a1a1a] px-1">
                    🎯 META
                  </span>
                </div>

                <div className="relative h-32 flex items-end gap-1 px-2">
                  {demoStopwatch2.laps.map((lap, i) => {
                    const maxTime = Math.max(...demoStopwatch2.laps.map(l => l.splitTime), demoStopwatch2.goal);
                    const heightPercent = (lap.splitTime / maxTime) * 100;
                    const isUnderGoal = lap.splitTime <= demoStopwatch2.goal;
                    
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[9px] text-gray-400 font-mono">
                          {formatTime(lap.splitTime).minutes}:{formatTime(lap.splitTime).seconds}
                        </span>
                        <div 
                          className={`w-full rounded-t-sm ${isUnderGoal ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ 
                            height: `${heightPercent}%`,
                            minHeight: '8px',
                            opacity: 0.85,
                          }}
                        />
                        <span className="text-[10px] text-gray-500 font-semibold">
                          V{lap.number}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-400 mb-3">
            💡 ¿Cómo debería funcionar en tu app?
          </h3>
          <ol className="space-y-2 text-gray-300">
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold">1.</span>
              <span>Cada tarjeta de cronómetro debe mostrar la sección "Gráfica de Vueltas" debajo del tiempo</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold">2.</span>
              <span>Cuando NO hay vueltas: Muestra un mensaje "📊 Sin vueltas registradas"</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold">3.</span>
              <span>Cuando SÍ hay vueltas: Muestra barras verticales con colores (verde/rojo)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold">4.</span>
              <span>Si configuraste un objetivo: Aparece una línea amarilla punteada "🎯 META"</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold">5.</span>
              <span>Debajo del gráfico: Estadísticas (Mejor, Promedio, Peor)</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
