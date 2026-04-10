# /frontend — Implementar o modificar una vista o componente

## Cuándo usar

Cuando se pide cambiar la UI: estilos, layout, animaciones, interactividad, o estructura de componentes.

## Stack

- **Estilos:** Tailwind CSS — nunca inline styles
- **Animaciones:** Framer Motion (si la sección ya lo usa)
- **Íconos:** react-icons
- **Localización:** `useLanguage()` de `LanguageContext` para contenido bilingüe
- **Tipos:** TypeScript estricto

## Workflow

### 1. Descomponer la vista
- Identificar qué partes son UI pura vs. qué partes tienen lógica o estado.
- Mapear qué componentes existentes en `src/components/ui/` se pueden reutilizar.

### 2. Analizar estado y datos
- ¿El componente necesita estado local (`useState`)? → puede vivir en el mismo componente o en `logical/`.
- ¿El contenido es estático y bilingüe? → viene de `src/data/`, no hardcodeado.
- ¿Hay filtrado, búsqueda o interacción compleja? → separar en componente `logical/`.

### 3. Implementar
- Componentes UI en `src/components/ui/` — sin props de lógica de negocio.
- No agregar comentarios al código.
- Clases Tailwind directamente en JSX; no crear archivos CSS adicionales salvo que sea absolutamente necesario.
- Respetar los colores custom del proyecto: `blue-pastel-dark` (`#1e3a8a`), `yellow-accent` (`#fbbf24`).

### 4. Verificar
- `npm run lint` sin errores.
- Revisar que el componente se ve correctamente en ambos idiomas (ES/EN).
- Confirmar que no rompe otras vistas que usen los mismos componentes.
