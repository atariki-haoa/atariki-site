# Arquitectura de Componentes - Projects

## Estructura de Separación

### 🎨 Componentes UI (Pure UI)
Componentes puros sin lógica de negocio, solo presentación:

- **`StatsCard`**: Tarjeta individual para mostrar estadísticas
- **`FilterSection`**: Sección de filtros con controles de UI
- **`ProjectGrid`**: Grid responsivo para mostrar proyectos
- **`ProjectsHeader`**: Encabezado con título y descripción

### 🧠 Componentes Lógicos (Business Logic)
Componentes que manejan estado y lógica de negocio:

- **`ProjectStats`**: Calcula y muestra estadísticas de proyectos
- **`ProjectFilters`**: Maneja filtrado y ordenamiento de proyectos
- **`ProjectManager`**: Gestiona el estado de expansión de tarjetas

### 📄 Componentes de Sección (Complete Sections)
Componentes que representan secciones completas de la aplicación:

- **`ProjectsSection`**: Sección completa de proyectos con todos los subcomponentes
- **`Projects`**: Componente principal de la página

## Autoescalabilidad

### ✅ Características Implementadas

1. **Tipos Compartidos**: `src/types/project.ts` define interfaces reutilizables
2. **Hook Personalizado**: `useProjects` centraliza la lógica de estado
3. **Componentes Modulares**: Cada componente tiene una responsabilidad específica
4. **Datos Dinámicos**: Los filtros y estadísticas se generan automáticamente desde los datos

### 🔄 Cómo Agregar Nuevos Proyectos

1. **Agregar al JSON**: Simplemente añade el proyecto a `src/data/projects.json`
2. **Auto-actualización**: 
   - Las categorías se generan automáticamente
   - Los estados se detectan dinámicamente
   - Las estadísticas se recalculan automáticamente
   - Los filtros se actualizan sin código adicional

### 📊 Beneficios de la Arquitectura

- **Mantenibilidad**: Cada componente tiene una responsabilidad clara
- **Reutilización**: Los componentes UI pueden usarse en otras secciones
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Testabilidad**: Componentes pequeños y enfocados son más fáciles de testear
- **Performance**: Uso de `useMemo` y `useCallback` para optimización

## Estructura de Archivos

```
src/
├── components/
│   ├── ui/                    # Componentes UI puros
│   │   ├── StatsCard.tsx
│   │   ├── FilterSection.tsx
│   │   ├── ProjectGrid.tsx
│   │   └── ProjectsHeader.tsx
│   ├── logical/               # Componentes con lógica
│   │   ├── ProjectStats.tsx
│   │   ├── ProjectFilters.tsx
│   │   └── ProjectManager.tsx
│   └── sections/              # Secciones completas
│       ├── Projects.tsx
│       └── ProjectsSection.tsx
├── types/
│   └── project.ts             # Tipos compartidos
└── hooks/
    └── useProjects.ts         # Hook personalizado
```
