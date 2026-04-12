# /fix — Corregir un bug o error

## Cuándo usar

Cuando algo no funciona como se espera: error de consola, comportamiento incorrecto, estilo roto, etc.

## Workflow

### 1. Reproducir y entender
- Clarificar: ¿qué comportamiento se espera vs. qué ocurre?
- Localizar el componente, página o utilidad involucrada.

### 2. Diagnosticar la causa raíz
- Leer el archivo afectado completamente antes de proponer cambios.
- Rastrear el flujo: props → componente → render / API route → handler → respuesta.
- No asumir: confirmar con Grep/Read dónde está el problema real.

### 3. Evaluar impacto
- Si el fix modifica un componente compartido (Header, Layout, utilidades), verificar qué otras páginas lo usan.
- Si el alcance es amplio, notificar al usuario antes de proceder.

### 4. Aplicar el fix mínimo necesario
- Cambiar solo lo que resuelve el problema; no refactorizar código circundante.
- No agregar manejo de errores para escenarios imposibles.
- No agregar comentarios al código.

### 5. Verificar
- `npm run lint` sin errores.
- Confirmar que el comportamiento original funciona y que no se rompió nada adyacente.
