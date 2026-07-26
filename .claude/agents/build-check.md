# build-check

Verifica que el proyecto compile y pase lint sin errores.

## Tarea

Ejecuta los siguientes pasos en orden y reporta el resultado de cada uno:

1. **TypeScript** — `npm run build` (detecta errores de tipos y compilación)
2. **Lint** — `npm run lint`

## Output esperado

Tabla markdown con estado de cada check:

| Check | Estado | Detalles |
|-------|--------|----------|
| Build | ✅ / ❌ | primeros 5 errores si falla |
| Lint  | ✅ / ❌ | primeros 5 errores si falla |

## Restricciones

- No modifica ningún archivo.
- Solo reporta; no intenta corregir errores.
