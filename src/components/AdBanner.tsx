interface AdBannerProps {
  slot?: string;
  format?: 'horizontal' | 'vertical' | 'rectangle';
}

export default function AdBanner({ slot = 'default', format = 'horizontal' }: AdBannerProps) {
  // Dimensiones según formato
  const dimensions = {
    horizontal: { width: '728px', height: '90px', label: '728x90' },
    vertical: { width: '160px', height: '600px', label: '160x600' },
    rectangle: { width: '300px', height: '250px', label: '300x250' },
  };

  const { width, height, label } = dimensions[format];

  return (
    <div className="w-full flex justify-center my-4">
      <div
        className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-dashed border-blue-500/30 rounded-lg flex items-center justify-center relative overflow-hidden"
        style={{ width, height, maxWidth: '100%' }}
      >
        {/* Placeholder para Google AdSense */}
        <div className="text-center p-4">
          <div className="text-xs text-gray-500 mb-1">📢 Espacio publicitario</div>
          <div className="text-[10px] text-gray-600">Google AdSense</div>
          <div className="text-[10px] text-gray-600">Formato: {label}</div>
          
          {/* Aquí irá el código real de AdSense */}
          {/* 
          <ins 
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
          */}
        </div>

        {/* Efecto visual de "anuncio" */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
      </div>
    </div>
  );
}
