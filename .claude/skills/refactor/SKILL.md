# /refactor — Refactorizar código existente

## Cuándo usar

Cuando se quiere mejorar la estructura del código sin cambiar su comportamiento observable.

## Workflow

### 1. Analizar el alcance
- Leer todos los archivos involucrados antes de proponer cambios.
- Identificar qué cambia y qué debe quedar igual.

### 2. Describir el plan
- Presentar al usuario: qué se va a reorganizar y por qué.
- Esperar aprobación antes de ejecutar si el alcance es amplio (múltiples archivos).

### 3. Ejecutar el refactor
- Mantener la separación UI/Logical/Functional.
- Si hay contenido hardcodeado en componentes, moverlo a `src/data/`.
- Si hay lógica de negocio en componentes UI, moverla a `logical/`.
- No agregar comentarios al código.
- No cambiar estilos ni comportamiento visual como efecto secundario.

### 4. Verificar
- `npm run build` y `npm run lint` sin errores.
- Confirmar visualmente que el resultado es idéntico al original.
