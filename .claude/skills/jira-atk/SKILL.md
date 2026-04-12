# /jira-atk — Poll Jira ATK para tickets de automatización

## Cuándo usar

Cuando se quiere revisar el backlog de Jira del proyecto ATK en busca de tickets etiquetados para automatización. Diseñado para correr en loop: `/loop 15m /jira-atk`.

## Workflow

### 1. Buscar tickets pendientes

Usa el MCP de Atlassian para buscar tickets con esta JQL:

```
project = ATK AND labels = automation AND status != "Done" AND status != "Pull Request"
```

- Cloud ID: `7ac51e03-86ac-4ff2-a4e1-9e825437efc1`
- Campos requeridos: summary, description, status, issuetype, priority, labels, created
- Formato: markdown

Si no hay tickets, reporta "Sin tickets pendientes" y termina.

### 2. Para cada ticket encontrado

Lee el ticket completo (descripción, criterios de aceptación, comentarios).

#### 2a. Si los requisitos son ambiguos

- Agrega un comentario en Jira listando todas las dudas o puntos indefinidos.
- Cambia el label de `automation` a `questions`.
- Mueve el ticket a "En curso".
- **No implementes nada.** Reporta el ticket como "pausado por dudas" y continúa al siguiente.

#### 2b. Si los requisitos son claros

- Clasifica el tipo de tarea:
  - Nueva feature, página o sección → usa el workflow de `/dev`
  - Bug o error → usa el workflow de `/fix`
  - Refactor → usa el workflow de `/refactor`
  - Cambio de UI, estilos o componentes → usa el workflow de `/frontend`
  - Agregar/editar datos en `src/data/` → usa el workflow de `/content`

- Crea una rama desde master con nombre descriptivo (ej: `feat/atk-42-nueva-seccion`).
- Implementa el cambio siguiendo el skill correspondiente y las reglas de CLAUDE.md.
- Haz commit con formato conventional-commit (ej: `feat(projects): add new portfolio entry`).
- Push la rama y abre un PR en GitHub via `mcp__github__create_pull_request`.
- Mueve el ticket en Jira a "Pull Request".

### 3. Reportar resultado

Al final de cada ciclo, reporta:

| Ticket | Acción | Estado |
|--------|--------|--------|
| ATK-XX | implementado / pausado por dudas / error | PR #N / en curso / fallo |

## Restricciones

- Procesa un ticket a la vez, nunca en paralelo.
- No modifiques tests sin autorización explícita.
- No agregues comentarios al código a menos que el ticket lo pida.
- Todo contenido textual debe tener versión ES y EN en `src/data/`.
- Sigue la separación de componentes: `ui/`, `logical/`, `functional/`.
