# /content — Agregar o modificar contenido del sitio

## Cuándo usar

Cuando se pide actualizar proyectos, experiencia, skills, o cualquier dato que vive en `src/data/`.

## Estructura de datos

| Archivo | Contenido |
|---------|-----------|
| `src/data/projects.ts` | Catálogo de proyectos con soporte bilingüe |
| `src/data/experience.ts` | Timeline de experiencia laboral |
| `src/data/skills.ts` / `skills.json` | Habilidades técnicas y metadatos |

## Workflow

### 1. Leer el archivo correspondiente
- Entender la estructura del tipo TypeScript antes de agregar entradas.
- Verificar qué campos son obligatorios vs. opcionales.

### 2. Agregar / modificar la entrada
- Todo contenido textual debe tener versión `es` y `en`.
- Respetar los tipos definidos en `src/types/` (Project, Locale, etc.).
- Para proyectos: incluir `status`, `category`, fechas, y URLs si aplica.

### 3. Verificar
- `npm run build` para confirmar que TypeScript acepta los cambios.
- Revisar en el browser que el contenido aparece correctamente en ambos idiomas.
