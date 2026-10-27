import { useEffect } from 'react';
import { getAdClient, getAdSlot, ADMOB_CONFIG } from '../config/admob';

interface AdBannerProps {
  slot?: 'TOP_BANNER' | 'INLINE_BANNER_1' | 'INLINE_BANNER_2' | 'INLINE_BANNER_3' | 'BOTTOM_BANNER';
  format?: 'horizontal' | 'vertical' | 'rectangle';
}

export default function AdBanner({ slot = 'TOP_BANNER', format = 'horizontal' }: AdBannerProps) {
  // Dimensiones según formato
  const dimensions = {
    horizontal: { width: '728px', height: '45px', label: '728x45' },
    vertical: { width: '160px', height: '600px', label: '160x600' },
    rectangle: { width: '300px', height: '250px', label: '300x250' },
  };

  const { width, height, label } = dimensions[format];
  const adClient = getAdClient();
  const adSlot = getAdSlot(slot);

  useEffect(() => {
    try {
      // Empujar el anuncio a AdSense
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error('Error loading AdSense ad:', e);
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-4">
      <div
        className="relative overflow-hidden"
        style={{ width, maxWidth: '100%', minHeight: height }}
      >
        {/* Anuncio real de Google AdSense */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
        
        {/* Placeholder mientras carga (solo en modo prueba) */}
        {ADMOB_CONFIG.TEST_MODE && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-dashed border-blue-500/30 rounded-lg flex items-center justify-center pointer-events-none">
            <div className="text-center p-4">
              <div className="text-xs text-gray-500 mb-1">📢 Anuncio de prueba</div>
              <div className="text-[10px] text-gray-600">Formato: {label}</div>
              <div className="text-[10px] text-gray-600">Slot: {adSlot}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
