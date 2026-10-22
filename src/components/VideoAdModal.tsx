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
      
      // Simular progreso del video
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 / VIDEO_DURATION);
          if (newProgress >= 100) {
            // Video completado
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            setCanClose(true);
            onVideoComplete();
            return 100;
          }
          return newProgress;
        });
      }, 1000);
    } else {
      // Limpiar intervalo al cerrar
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
  }, [isOpen, onVideoComplete]);

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
        {/* Botón de cerrar (solo habilitado después de ver el video) */}
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

        {/* Contenedor del video */}
        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
          {/* Video placeholder (reemplazar con video real del patrocinador) */}
          <div className="relative aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
            {/* Contenido del video patrocinado */}
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🎬</div>
              <div className="text-white text-2xl font-bold">Video Patrocinado</div>
              <div className="text-gray-400 text-sm">
                {isPlaying && progress < 100 ? (
                  <span>Reproduciendo... {remainingSeconds}s restantes</span>
                ) : (
                  <span className="text-green-400">✓ Video completado</span>
                )}
              </div>
              
              {/* Información del patrocinador */}
              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-xs text-gray-500 mb-2">PATROCINADO POR</div>
                <div className="text-white font-semibold">Tu Empresa Aquí</div>
                <div className="text-gray-400 text-sm mt-1">
                  Visita: www.tuempresa.com
                </div>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Indicador de tiempo */}
            <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-1 rounded text-white text-sm font-mono">
              {Math.floor(progress / (100 / VIDEO_DURATION))}s / {VIDEO_DURATION}s
            </div>
          </div>
        </div>

        {/* Mensaje inferior */}
        <div className="mt-4 text-center">
          {canClose ? (
            <div className="text-green-400 text-sm">
              ✓ ¡Gracias por ver el anuncio! No tendrás anuncios durante 24 horas.
            </div>
          ) : (
            <div className="text-gray-400 text-sm">
              Por favor, espera {remainingSeconds} segundos para cerrar el anuncio
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
