import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface VideoAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoComplete: () => void;
}

export default function VideoAdModal({ isOpen, onClose, onVideoComplete }: VideoAdModalProps) {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const VIDEO_DURATION = 15; // 15 segundos

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      setProgress(0);
      setCanClose(false);
      
      // Simular progreso del video de Google AdSense
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 / VIDEO_DURATION);
          if (newProgress >= 100) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            setCanClose(true);
            onVideoComplete();
            
            // Cerrar automáticamente después de 2 segundos
            setTimeout(() => {
              onClose();
            }, 2000);
            
            return 100;
          }
          return newProgress;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setProgress(0);
      setIsPlaying(false);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isOpen, onVideoComplete, onClose]);

  const handleClose = () => {
    if (canClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const remainingSeconds = Math.ceil((100 - progress) / (100 / VIDEO_DURATION));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl mx-4">
        {/* Botón de cerrar */}
        <button
          onClick={handleClose}
          disabled={!canClose}
          className={`absolute -top-12 right-0 p-2 rounded-full transition-all ${
            canClose
              ? 'bg-white/20 hover:bg-white/30 text-white cursor-pointer'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
        >
          <X size={24} />
        </button>

        {/* Contenedor del video de Google AdSense */}
        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-blue-500/30">
          {/* Header del video */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-white font-bold text-sm">📺 Google AdSense Video</div>
              <div className="text-white/70 text-xs">Anuncio</div>
            </div>
            <div className="text-white text-xs font-mono">
              {Math.floor(progress / (100 / VIDEO_DURATION))}s / {VIDEO_DURATION}s
            </div>
          </div>

          {/* Área del video */}
          <div className="relative aspect-video bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center">
            
            {/* 
              AQUÍ VA EL VIDEO REAL DE GOOGLE ADSENSE
              
              OPCIÓN 1: Google AdSense Video (requiere aprobación especial)
              <div id="google-ad-video" className="w-full h-full">
                <ins 
                  className="adsbygoogle"
                  style={{ display: 'block', width: '100%', height: '100%' }}
                  data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                  data-ad-slot="VIDEO_SLOT_ID"
                  data-ad-format="video"
                />
              </div>

              OPCIÓN 2: YouTube Video Ad (más fácil)
              <iframe
                src="https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1&controls=0&modestbranding=1"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />

              OPCIÓN 3: Video MP4 directo
              <video
                ref={videoRef}
                src="/ads/google-ad-video.mp4"
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            */}

            {/* Placeholder visual mientras configuras el video real */}
            <div className="text-center space-y-4 p-8">
              <div className="text-7xl mb-4 animate-pulse">🎬</div>
              <div className="text-white text-2xl font-bold">Video Ad de Google AdSense</div>
              <div className="text-blue-400 text-sm font-semibold">
                {isPlaying && progress < 100 ? (
                  <span>Reproduciendo anuncio... {remainingSeconds}s restantes</span>
                ) : (
                  <span className="text-green-400">✓ ¡Anuncio completado!</span>
                )}
              </div>
              
              {/* Información del anuncio */}
              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10 max-w-md mx-auto">
                <div className="text-xs text-gray-400 mb-2">ANUNCIO DE</div>
                <div className="text-white font-semibold text-lg">Google AdSense</div>
                <div className="text-gray-400 text-sm mt-1">
                  Video publicitario de 15 segundos
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Al completar este video, no verás anuncios durante 24 horas
                </div>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-linear shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Indicador de "Anuncio" */}
            <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 rounded text-white text-xs font-bold border border-white/20">
              ANUNCIO
            </div>
          </div>
        </div>

        {/* Mensaje inferior */}
        <div className="mt-4 text-center">
          {canClose ? (
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
              <div className="text-green-400 text-lg font-bold mb-1">
                ✓ ¡Gracias por ver el anuncio!
              </div>
              <div className="text-green-400/80 text-sm">
                No tendrás anuncios durante 24 horas
              </div>
              <div className="text-green-400/60 text-xs mt-2">
                Cerrando automáticamente...
              </div>
            </div>
          ) : (
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
              <div className="text-blue-400 text-sm font-semibold mb-1">
                ⏱️ Por favor, espera el anuncio completo
              </div>
              <div className="text-blue-400/70 text-xs">
                Faltan {remainingSeconds} segundos para desactivar anuncios por 24h
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
