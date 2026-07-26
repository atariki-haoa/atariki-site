# /dev — Implementar nueva funcionalidad

## Cuándo usar

Cuando se pide agregar una nueva feature, página, sección o componente al sitio.

## Workflow

### 1. Entender el requerimiento
- Clarificar qué debe hacer la feature y dónde se ubica en el sitio.
- Identificar si es una nueva página (`src/pages/`), una nueva sección en una página existente, o un componente reutilizable.

### 2. Revisar el contexto existente
- Leer los archivos relacionados en `src/data/` si la feature involucra contenido nuevo.
- Revisar componentes existentes en `src/components/` para reutilizar antes de crear nuevos.
- Verificar si el contenido debe ser bilingüe (ES/EN) — si es así, agregar ambas versiones en `src/data/`.

### 3. Decidir dónde va cada pieza
- **`src/components/ui/`** — componentes puramente visuales sin estado ni lógica de negocio.
- **`src/components/logical/`** — componentes con estado o lógica.
- **`src/components/functional/`** — componentes de layout (Header, Layout, etc.).
- **`src/data/`** — todo contenido/datos estáticos; nunca hardcodear en componentes.
- **`src/pages/`** — solo si es una nueva ruta.

### 4. Implementar
- Seguir la separación UI/Logical/Functional estrictamente.
- Usar Tailwind CSS para estilos; no agregar estilos inline.
- Usar Framer Motion para animaciones si la sección ya las usa.
- Consumir `LanguageContext` para contenido bilingüe.
- No agregar comentarios al código a menos que se pida explícitamente.

### 5. Verificar coherencia
- Correr `npm run lint` y corregir cualquier error.
- Verificar en el browser que la feature funciona en ES y EN.
- Confirmar que no rompe otras páginas.
