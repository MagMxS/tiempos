# 📺 Guía de Integración: Google AdSense Video

## 🎯 ¿Qué es Google AdSense Video?

Google AdSense Video permite mostrar anuncios de video en tu sitio web. Hay varias formas de implementarlo:

---

## 📋 Opciones de Video Ads de Google

### **Opción 1: Google AdSense Video (Requiere Aprobación Especial)** ⭐

**Requisitos:**
- Cuenta de AdSense aprobada
- Sitio web con tráfico significativo (mínimo 10,000 visitas/mes)
- Contenido original de calidad
- Cumplir con políticas de AdSense

**Cómo funciona:**
- Google sirve videos de anunciantes automáticamente
- Ingresos: $5-20 por cada 1000 vistas de video
- Duración: 15-30 segundos típicamente

**Implementación:**

1. **Solicitar acceso a video ads en AdSense**
   - Ve a tu cuenta de AdSense
   - Contacta soporte para habilitar video ads
   - Espera aprobación (puede tomar semanas)

2. **Crear unidad de anuncio de video**
   ```html
   <ins 
     class="adsbygoogle"
     style="display:block; width:640px; height:360px"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="1234567890"
     data-ad-format="video"
     data-full-width-responsive="true"
   ></ins>
   <script>
     (adsbygoogle = window.adsbygoogle || []).push({});
   </script>
   ```

3. **Integrar en `VideoAdModal.tsx`**
   ```tsx
   useEffect(() => {
     if (isOpen) {
       try {
         (window.adsbygoogle = window.adsbygoogle || []).push({});
       } catch (e) {
         console.error('AdSense Video error:', e);
       }
     }
   }, [isOpen]);

   return (
     <div className="w-full h-full">
       <ins 
         className="adsbygoogle"
         style={{ display: 'block', width: '100%', height: '100%' }}
         data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
         data-ad-slot="1234567890"
         data-ad-format="video"
       />
     </div>
   );
   ```

---

### **Opción 2: YouTube Video Ads (Más Fácil)** ⭐⭐⭐ Recomendada

**Requisitos:**
- Canal de YouTube (puede ser nuevo)
- Video subido a YouTube (puede ser "No listado")
- Monetización activada en YouTube

**Cómo funciona:**
- Subes un video a YouTube
- Activas monetización (anuncios pre-roll)
- Embeds el video en tu app
- Google paga por las vistas del video

**Ingresos:**
- $1-5 por cada 1000 vistas
- Requiere 1000 suscriptores + 4000 horas vistas para monetizar

**Implementación:**

1. **Crear video y subirlo a YouTube**
   - Duración: 15-30 segundos
   - Contenido: Puede ser genérico o de un patrocinador
   - Configuración: "No listado" (para que no aparezca en búsquedas)
   - Activar monetización

2. **Obtener el ID del video**
   ```
   URL: https://www.youtube.com/watch?v=VIDEO_ID
   ID: VIDEO_ID
   ```

3. **Integrar en `VideoAdModal.tsx`**
   ```tsx
   return (
     <div className="w-full h-full">
       <iframe
         src={`https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
         className="w-full h-full"
         allow="autoplay; encrypted-media"
         allowFullScreen
         style={{ border: 'none' }}
       />
     </div>
   );
   ```

4. **Detectar fin del video** (requiere YouTube IFrame API)
   ```html
   <!-- Agregar en index.html -->
   <script src="https://www.youtube.com/iframe_api"></script>
   ```

   ```tsx
   useEffect(() => {
     if (isOpen && window.YT) {
       const player = new window.YT.Player('youtube-player', {
         events: {
           'onStateChange': (event) => {
             if (event.data === window.YT.PlayerState.ENDED) {
               setCanClose(true);
               onVideoComplete();
             }
           }
         }
       });
     }
   }, [isOpen]);

   return (
     <div id="youtube-player" className="w-full h-full"></div>
   );
   ```

---

### **Opción 3: Google Ad Manager (Para Publishers Grandes)** ⭐⭐⭐⭐

**Requisitos:**
- Cuenta de Google Ad Manager
- Tráfico significativo (100,000+ visitas/mes)
- Equipo técnico para integración

**Cómo funciona:**
- Plataforma profesional de gestión de anuncios
- Soporte completo para video ads
- Integración con múltiples redes de anuncios

**Ingresos:**
- $10-50 por cada 1000 vistas de video
- Control total sobre qué anuncios mostrar

**Implementación:**
- Requiere integración con Google Publisher Tag (GPT)
- Documentación: https://developers.google.com/publisher-tag

---

### **Opción 4: Video Ads de Terceros (Más Rápido)** ⭐⭐

**Plataformas:**
- **AdCash**: https://www.adcash.com
- **PropellerAds**: https://www.propellerads.com
- **AdMaven**: https://www.ad-maven.com

**Cómo funciona:**
- Te registras en la plataforma
- Subes o seleccionas videos de anunciantes
- Embeds el video en tu app
- La plataforma paga por vistas

**Ingresos:**
- $2-10 por cada 1000 vistas
- Aprobación más rápida que AdSense

**Implementación:**
```tsx
// Ejemplo con AdCash
<iframe
  src="https://www.adcash.com/video/AD_ID"
  className="w-full h-full"
  allow="autoplay"
/>
```

---

## 🎯 Mi Recomendación: YouTube Video Ads

**¿Por qué YouTube?**
1. ✅ **Fácil de implementar**: Solo necesitas un video en YouTube
2. ✅ **Aprobación rápida**: No requiere aprobación especial
3. ✅ **Control total**: Tú subes el video
4. ✅ **Pagos confiables**: Google paga puntualmente
5. ✅ **Escalable**: Puedes crecer con tu canal

**Pasos para implementar YouTube Video Ads:**

### **Paso 1: Crear canal de YouTube**
1. Ve a https://www.youtube.com
2. Crea un canal (puede ser con tu cuenta personal)
3. Nombre sugerido: "Multi-Stopwatch Ads"

### **Paso 2: Crear video de 15 segundos**
- **Opción A**: Video genérico
  - Usa Canva o CapCut para crear un video simple
  - Texto: "Anuncio publicitario"
  - Música de fondo libre de derechos
  
- **Opción B**: Video de patrocinador
  - Contacta empresas
  - Cobra $50-150 por mostrar su video
  - Sube el video a tu canal

### **Paso 3: Subir video a YouTube**
1. Ve a YouTube Studio
2. Sube el video
3. Configuración:
   - Título: "Video Ad 1"
   - Visibilidad: "No listado"
   - Descripción: "Anuncio publicitario"
4. Copia el ID del video (ej: `dQw4w9WgXcQ`)

### **Paso 4: Activar monetización**
**Requisitos para monetizar:**
- 1000 suscriptores
- 4000 horas de visualización en los últimos 12 meses

**Mientras no cumples los requisitos:**
- Puedes mostrar el video sin monetización
- O usar videos de patrocinadores directamente

### **Paso 5: Integrar en tu app**
Actualiza `src/components/VideoAdModal.tsx`:

```tsx
// Reemplaza el placeholder con:
<iframe
  src={`https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0`}
  className="w-full h-full absolute inset-0"
  allow="autoplay; encrypted-media"
  allowFullScreen
  style={{ border: 'none' }}
/>
```

### **Paso 6: Detectar fin del video**
Agrega en `index.html`:
```html
<script src="https://www.youtube.com/iframe_api"></script>
```

Actualiza `VideoAdModal.tsx`:
```tsx
useEffect(() => {
  if (isOpen && window.YT) {
    const player = new window.YT.Player('youtube-player', {
      events: {
        'onStateChange': (event) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            setCanClose(true);
            onVideoComplete();
          }
        }
      }
    });
  }
}, [isOpen]);
```

---

## 💰 Comparativa de Ingresos

| Método | Ingreso/1000 vistas | Dificultad | Control |
|--------|---------------------|------------|---------|
| **AdSense Video** | $5-20 | ⭐⭐⭐⭐⭐ Muy alta | ⭐⭐ Bajo |
| **YouTube Video Ads** | $1-5 | ⭐⭐ Baja | ⭐⭐⭐⭐⭐ Total |
| **Google Ad Manager** | $10-50 | ⭐⭐⭐⭐⭐ Muy alta | ⭐⭐⭐⭐ Alto |
| **Video Ads terceros** | $2-10 | ⭐⭐ Baja | ⭐⭐⭐ Medio |

---

## 📊 Estrategia Recomendada

### **Fase 1: Lanzamiento (0-1000 usuarios)**
- **Método**: YouTube Video Ads (sin monetización aún)
- **Ingresos**: $0 (pero construyes audiencia)
- **Acción**: Subir videos de patrocinadores directamente

### **Fase 2: Crecimiento (1000-10000 usuarios)**
- **Método**: YouTube Video Ads + Patrocinios directos
- **Ingresos**: $50-500/mes
- **Acción**: Activar monetización en YouTube, contactar patrocinadores

### **Fase 3: Escala (10000+ usuarios)**
- **Método**: AdSense Video + YouTube + Patrocinios
- **Ingresos**: $500-5000/mes
- **Acción**: Solicitar AdSense Video, diversificar ingresos

---

## 🎬 Ejemplo de Video para YouTube

**Estructura del video (15 segundos):**

```
0-3s:   Logo + "Anuncio publicitario"
3-10s:  Mensaje del patrocinador
10-13s: Call-to-action ("Visita www.ejemplo.com")
13-15s: Logo final + "Gracias por ver este anuncio"
```

**Herramientas para crear el video:**
- **Canva**: https://www.canva.com (gratis, fácil)
- **CapCut**: https://www.capcut.com (gratis, móvil)
- **Adobe Premiere**: Profesional (pago)

---

## ✅ Checklist de Implementación

### Para YouTube Video Ads:
- [ ] Crear canal de YouTube
- [ ] Crear video de 15-30 segundos
- [ ] Subir video a YouTube (No listado)
- [ ] Copiar ID del video
- [ ] Actualizar `VideoAdModal.tsx` con el iframe
- [ ] Agregar YouTube IFrame API en `index.html`
- [ ] Implementar detección de fin de video
- [ ] Probar que el video se reproduce
- [ ] Verificar que el opt-out funciona (24h)

### Para AdSense Video:
- [ ] Tener cuenta de AdSense aprobada
- [ ] Solicitar acceso a video ads
- [ ] Crear unidad de anuncio de video
- [ ] Obtener ad-slot del video
- [ ] Actualizar `VideoAdModal.tsx` con el código de AdSense
- [ ] Agregar script de AdSense en `index.html`
- [ ] Probar que el video se muestra
- [ ] Monitorear ingresos en AdSense

---

## 🔗 Recursos Útiles

- **YouTube Partner Program**: https://www.youtube.com/howyoutubeworks/user-settings/monetization/
- **AdSense Video**: https://support.google.com/adsense/answer/1705952
- **YouTube IFrame API**: https://developers.google.com/youtube/iframe_api_reference
- **Google Ad Manager**: https://admanager.google.com

---

## 💡 Consejos para Maximizar Ingresos

1. **Crear videos atractivos**
   - Calidad visual profesional
   - Mensaje claro y conciso
   - Call-to-action fuerte

2. **Optimizar para conversión**
   - Botón visible "Ver Video"
   - Explicar beneficios (24h sin anuncios)
   - Mostrar countdown atractivo

3. **Diversificar fuentes de video**
   - YouTube para escalabilidad
   - Patrocinios directos para control
   - AdSense para automatización

4. **Monitorear métricas**
   - Tasa de videos vistos
   - Tiempo promedio de visualización
   - Ingresos por video
   - Conversión a premium (si aplica)

---

**¡Listo! Ahora tienes todas las opciones para integrar video ads de Google en tu app.** 🎬💰
