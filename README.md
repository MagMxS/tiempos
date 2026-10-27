# Multi-Stopwatch Dashboard

Aplicación web de cronómetros múltiples con gráficas de barras y objetivos configurables.

## 🚀 Modo Demostración

Para ver ejemplos visuales de cómo se ven las gráficas en cada cronómetro, agrega `?demo=true` a la URL:

```
https://tu-dominio.com/?demo=true
```

O localmente:
```
http://localhost:5173/?demo=true
```

Esto mostrará ejemplos de cronómetros con:
- Gráficas de barras con colores (verde/rojo según meta)
- Línea de objetivo punteada
- Estadísticas (mejor, promedio, peor)
- Porcentaje de cumplimiento

## 📊 Características

### Por cada cronómetro:
- ⏱️ **Tiempo en tiempo real** con precisión de milisegundos
- 🎯 **Objetivo configurable** con presets rápidos (30s, 1m, 2m, 3m, 5m)
- 📊 **Gráfica de barras** que muestra:
  - Barras verdes = bajo la meta
  - Barras rojas = sobre la meta
  - Línea amarilla punteada = objetivo
  - Indicadores ⚡ (mejor) y 🐢 (peor)
- 📈 **Estadísticas**: Mejor, Promedio, Peor
- 📋 **Lista de vueltas** con tiempos parciales y acumulados

### Controles globales:
- ▶️ Iniciar/Pausar todos
- 🔄 Reiniciar todos
- 📥 Exportar a CSV
- 🔍 Buscar por nombre
- ⌨️ Atajos de teclado (Espacio, N, 1-9)

## 🎨 Uso

1. **Crear cronómetro**: Click en botón + naranja
2. **Configurar objetivo**: Click en "⚙️ Configurar objetivo" → seleccionar preset o escribir tiempo
3. **Iniciar**: Click en ▶️
4. **Registrar vueltas**: Click en 🚩 mientras corre
5. **Ver gráfica**: Aparece automáticamente debajo del cronómetro
6. **Ver detalle**: Click en cualquier parte de la tarjeta

## 💾 Persistencia

Todos los datos se guardan automáticamente en localStorage. No pierdes nada al recargar la página.

## 📱 PWA

La app es instalable como Progressive Web App en dispositivos móviles.
