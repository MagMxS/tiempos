# 🎬 Sistema de Monetización - Guía de Implementación

## ✅ Sistema Implementado

Se ha implementado un sistema completo de monetización con:

### 🎯 Características Principales

1. **Video Opt-out de 24 horas**
   - Botón "🎬 Ver Video - Sin anuncios 24h" en el header
   - Video de 15 segundos que no se puede saltar
   - Al completar el video, se desactivan todos los anuncios por 24 horas
   - Countdown en tiempo real mostrando el tiempo restante
   - Persistencia en localStorage (sobrevive recargas de página)

2. **Google AdSense (Banners)**
   - Banner superior (728x90)
   - Banners inline cada 3 cronómetros
   - Banner inferior (728x90)
   - Se ocultan automáticamente cuando el usuario ve el video

3. **Estados del Sistema**
   - **Anuncios activos**: Muestra botón azul "Ver Video" + banners de AdSense
   - **Video completado**: Muestra botón verde "Sin anuncios" con countdown
   - **24 horas después**: Vuelve al estado inicial

---

## 📋 Cómo Integrar Anuncios Reales

### 🔧 Paso 1: Configurar Google AdSense

1. **Crear cuenta en Google AdSense**
   - Ve a https://www.google.com/adsense/
   - Registra tu sitio web
   - Espera aprobación (puede tardar 1-2 semanas)

2. **Obtener tu código de editor**
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   ```

3. **Agregar el script en `index.html`**
   ```html
   <!doctype html>
   <html lang="es">
     <head>
       <!-- Otros meta tags -->
       <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
     </head>
     <body>
       <!-- Contenido -->
     </body>
   </html>
   ```

4. **Crear unidades de anuncio en AdSense**
   - Banner superior: 728x90
   - Banner inline: 728x90
   - Banner inferior: 728x90
   - Anota los "ad-slot" de cada unidad

5. **Actualizar `src/components/AdBanner.tsx`**
   ```tsx
   // Descomenta y actualiza esta sección:
   <ins 
     className="adsbygoogle"
     style={{ display: 'block', width: '100%', height: '90px' }}
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="1234567890"  // Tu slot real
     data-ad-format="horizontal"
     data-full-width-responsive="true"
   />
   
   // Agrega este useEffect para inicializar AdSense:
   useEffect(() => {
     try {
       (window.adsbygoogle = window.adsbygoogle || []).push({});
     } catch (e) {
       console.error('AdSense error:', e);
     }
   }, []);
   ```

6. **Declarar tipo en TypeScript**
   Crea `src/types/global.d.ts`:
   ```ts
   export {};
   
   declare global {
     interface Window {
       adsbygoogle: any[];
     }
   }
   ```

---

### 🎥 Paso 2: Integrar Video de Patrocinio

#### Opción A: Video Local (Recomendado para control total)

1. **Preparar el video**
   - Formato: MP4 (H.264)
   - Duración: 15-30 segundos
   - Resolución: 1920x1080 o 1280x720
   - Tamaño máximo recomendado: 5MB

2. **Agregar el video al proyecto**
   ```
   public/
   └── ads/
       └── sponsor-video.mp4
   ```

3. **Actualizar `src/components/VideoAdModal.tsx`**
   ```tsx
   // Reemplaza el placeholder con el video real:
   <video
     ref={videoRef}
     src="/ads/sponsor-video.mp4"
     autoPlay
     muted
     playsInline
     className="w-full h-full object-cover"
     onTimeUpdate={() => {
       if (videoRef.current) {
         const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
         setProgress(progress);
         if (progress >= 100) {
           setCanClose(true);
           onVideoComplete();
         }
       }
     }}
   />
   ```

4. **Agregar botón de sonido** (opcional)
   ```tsx
   <button
     onClick={() => {
       if (videoRef.current) {
         videoRef.current.muted = !videoRef.current.muted;
       }
     }}
     className="absolute bottom-4 left-4 bg-black/80 p-2 rounded-full text-white"
   >
     {videoRef.current?.muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
   </button>
   ```

#### Opción B: Video de YouTube/Vimeo

1. **Subir video a YouTube**
   - Crear canal
   - Subir video del patrocinador
   - Configurar como "No listado" (para que no aparezca en búsquedas)
   - Copiar el ID del video

2. **Actualizar `src/components/VideoAdModal.tsx`**
   ```tsx
   // Reemplaza el placeholder con el iframe:
   <iframe
     src={`https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1&controls=0&modestbranding=1`}
     className="w-full h-full"
     allow="autoplay; encrypted-media"
     allowFullScreen
   />
   ```

3. **Detectar fin del video** (requiere YouTube IFrame API)
   ```tsx
   // Agregar script de YouTube API en index.html:
   <script src="https://www.youtube.com/iframe_api"></script>
   
   // Implementar detección de fin de video
   useEffect(() => {
     const player = new YT.Player('video-player', {
       events: {
         'onStateChange': (event) => {
           if (event.data === YT.PlayerState.ENDED) {
             setCanClose(true);
             onVideoComplete();
           }
         }
       }
     });
   }, []);
   ```

---

### 💰 Paso 3: Buscar Patrocinadores

#### Dónde encontrar patrocinadores:

1. **Empresas relacionadas con tu nicho**
   - Software de gestión de tiempo
   - Herramientas de productividad
   - Apps de cronometraje deportivo
   - Equipos industriales (si tu app es para manufactura)

2. **Plataformas de patrocinio**
   - **FameBit** (YouTube): https://www.famebit.com
   - ** Grapevine Logic**: https://www.grapevinelogic.com
   - **Shoutcart**: https://www.shoutcart.com

3. **Contacto directo**
   - Crea un media kit con:
     - Número de usuarios
     - Demografía
     - Tasas de engagement
     - Opciones de patrocinio
   - Contacta empresas por email/LinkedIn

#### Precios sugeridos:

| Duración del video | Precio sugerido |
|-------------------|-----------------|
| 15 segundos | $50-150 |
| 30 segundos | $100-300 |
| 60 segundos | $200-500 |
| Campaña mensual | $500-2000 |

---

## 📊 Métricas y Analytics

### Implementar tracking:

1. **Google Analytics**
   ```html
   <!-- Agregar en index.html -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

2. **Trackear eventos importantes**
   ```ts
   // En VideoAdModal.tsx:
   const handleVideoComplete = () => {
     // Google Analytics
     gtag('event', 'video_completed', {
       'event_category': 'ads',
       'event_label': 'sponsor_video'
     });
     
     // Tu lógica existente
     onVideoComplete();
   };
   ```

3. **Métricas clave a trackear**
   - Videos vistos por día
   - Tasa de conversión (usuarios que ven video / usuarios totales)
   - Tiempo promedio en la app
   - Ingresos por AdSense
   - Ingresos por patrocinios

---

## 🎨 Personalización del Sistema

### Cambiar duración del video:
```ts
// En VideoAdModal.tsx:
const VIDEO_DURATION = 30; // Cambiar a 30 segundos
```

### Cambiar duración del opt-out:
```ts
// En App.tsx:
const ADS_DISABLED_DURATION = 48 * 60 * 60 * 1000; // 48 horas
```

### Cambiar frecuencia de banners:
```tsx
// En App.tsx, cambiar el módulo:
{!isAdsDisabled && (index + 1) % 2 === 0 && index < stopwatches.length - 1 && (
  // Mostrar banner cada 2 cronómetros en vez de 3
)}
```

### Agregar más posiciones de banners:
```tsx
{/* Banner lateral (para pantallas grandes) */}
<div className="hidden xl:block fixed left-4 top-1/2 -translate-y-1/2">
  <AdBanner slot="sidebar" format="vertical" />
</div>
```

---

## 🚀 Estrategia de Monetización

### Fase 1: Lanzamiento (0-1000 usuarios)
- **Objetivo**: Validar el modelo
- **Acciones**:
  - Contactar 5-10 empresas para patrocinios directos
  - Cobrar $50-100 por video de 15 segundos
  - Ingreso esperado: $250-1000/mes

### Fase 2: Crecimiento (1000-10000 usuarios)
- **Objetivo**: Maximizar ingresos
- **Acciones**:
  - Solicitar aprobación de AdSense
  - Mantener patrocinios directos
  - Agregar más posiciones de banners
  - Ingreso esperado: $500-3000/mes

### Fase 3: Escala (10000+ usuarios)
- **Objetivo**: Diversificar ingresos
- **Acciones**:
  - Considerar modelo Freemium
  - Negociar patrocinios más grandes
  - Explorar suscripciones premium
  - Ingreso esperado: $3000-10000/mes

---

## 📝 Checklist de Implementación

### Configuración básica:
- [ ] Crear cuenta en Google AdSense
- [ ] Esperar aprobación de AdSense
- [ ] Crear unidades de anuncio
- [ ] Actualizar código con ad-slots reales
- [ ] Probar que los anuncios se muestran

### Video de patrocinio:
- [ ] Conseguir video del patrocinador (15-30s)
- [ ] Optimizar video (MP4, <5MB)
- [ ] Agregar video a `public/ads/`
- [ ] Actualizar VideoAdModal para usar video real
- [ ] Probar que el video se reproduce correctamente
- [ ] Verificar que el opt-out funciona (24h)

### Analytics:
- [ ] Configurar Google Analytics
- [ ] Trackear eventos de video
- [ ] Monitorear métricas de AdSense
- [ ] Configurar alertas de ingresos

### Legal:
- [ ] Agregar política de privacidad
- [ ] Agregar términos de servicio
- [ ] Divulgar uso de cookies/anuncios
- [ ] Cumplir con GDPR (si aplica)

---

## 💡 Consejos para Maximizar Ingresos

1. **Optimizar placement de anuncios**
   - No saturar con demasiados anuncios
   - Mantener UX limpia
   - A/B testear posiciones

2. **Mejorar tasa de videos vistos**
   - Hacer el botón más llamativo
   - Explicar beneficios claramente
   - Mostrar countdown atractivo

3. **Negociar mejores patrocinios**
   - Mostrar métricas de usuarios
   - Ofrecer paquetes mensuales
   - Dar reportes de rendimiento

4. **Considerar modelo Freemium**
   - Versión gratuita con anuncios
   - Versión premium ($4.99/mes) sin anuncios
   - Típica conversión: 2-5% de usuarios

---

## 🆘 Soporte y Recursos

- **Documentación AdSense**: https://support.google.com/adsense
- **Políticas de AdSense**: https://support.google.com/adsense/answer/48182
- **YouTube Partner Program**: https://www.youtube.com/howyoutubeworks/user-settings/monetization/
- **GDPR Compliance**: https://gdpr-info.eu/

---

## 📞 Contacto para Patrocinios

Crea una página de contacto o email dedicado:
```
patrocinios@tudominio.com
```

Incluye:
- Descripción de la app
- Número de usuarios activos
- Demografía de usuarios
- Opciones de patrocinio disponibles
- Precios y paquetes

---

**¡Listo! Tu sistema de monetización está implementado y listo para generar ingresos.** 💰
