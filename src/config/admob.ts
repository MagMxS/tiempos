// ============================================
// CONFIGURACIÓN DE ADMOB / ADSENSE
// ============================================
// 
// INSTRUCCIONES:
// 1. Ve a https://admob.google.com
// 2. Copia tu ID de publicador (ejemplo: ca-pub-1234567890123456)
// 3. Reemplaza "ca-pub-XXXXXXXXXXXXXXXX" con tu ID real
// 4. Crea unidades de anuncio en AdMob y copia los IDs de slot
// 5. Reemplaza los valores de abajo con tus IDs reales
//
// IMPORTANTE: 
// - El AD_CLIENT es tu ID de publicador (empieza con "ca-pub-")
// - Los AD_SLOT son los IDs de cada unidad de anuncio (solo números)
// - Usa los IDs de prueba mientras desarrollas:
//   - AD_CLIENT de prueba: ca-pub-3940256099942544
//   - AD_SLOT de prueba: 3940256099 (banner)
// ============================================

export const ADMOB_CONFIG = {
  // Tu ID de publicador de AdMob
  // ⚠️ CAMBIA ESTO con tu ID real de AdMob
  AD_CLIENT: 'ca- pub-4955051379520060', // Ejemplo real: 'ca-pub-1234567890123456'
  
  // IDs de unidades de anuncio (slots)
  // ⚠️ CAMBIA ESTOS con tus IDs reales de unidades de anuncio
  AD_SLOTS: {
    // Banner superior (728x90)
    TOP_BANNER: '8302243331', // ID de prueba de Google
    
    // Banner entre cronómetros (728x90)
    INLINE_BANNER_1: '5436406845', // ID de prueba de Google
    INLINE_BANNER_2: '8302243331', // ID de prueba de Google
    INLINE_BANNER_3: '4428331527', // ID de prueba de Google
    
    // Banner inferior (728x90)
    BOTTOM_BANNER: '1690275519', // ID de prueba de Google
  },
  
  // Configuración del video de opt-out
  VIDEO_AD: {
    // ID del slot para video ad (si tienes uno)
    SLOT: '3940256099', // ID de prueba de Google
    
    // Duración del video en segundos
    DURATION: 15,
  },
  
  // Modo de prueba (true = usa anuncios de prueba, false = usa anuncios reales)
  // ⚠️ CAMBIA A false CUANDO ESTÉS LISTO PARA PRODUCCIÓN
  TEST_MODE: true,
};

// IDs de prueba de Google (úsalos mientras desarrollas)
export const TEST_IDS = {
  AD_CLIENT: 'ca-pub-3940256099942544',
  BANNER: '3940256099',
};

// Función helper para obtener el ID correcto según el modo
export function getAdClient(): string {
  return ADMOB_CONFIG.TEST_MODE ? TEST_IDS.AD_CLIENT : ADMOB_CONFIG.AD_CLIENT;
}

export function getAdSlot(slotName: keyof typeof ADMOB_CONFIG.AD_SLOTS): string {
  return ADMOB_CONFIG.TEST_MODE ? TEST_IDS.BANNER : ADMOB_CONFIG.AD_SLOTS[slotName];
}
