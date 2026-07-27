# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build production bundle
npm run start    # Start production server
npm run lint     # Run Next.js linter
npm run export   # Export static site
```

There are no tests configured.

## Git Workflow

- Base branch for all work is `dev`, not `master`. Branch off `dev`, and open PRs targeting `dev`.
- Never target `master` directly — no branching from it, no PRs into it — unless the user explicitly asks for it in that conversation.

## Architecture

This is a **Next.js 14 portfolio site** with a custom Express server, TypeScript, Tailwind CSS, and bilingual (ES/EN) support.

### Custom Server (`server.js`)

The app uses a custom Express server wrapping Next.js that handles:
- **Locale detection**: IP-based language detection on first visit, stored as a cookie (1-year expiry). Falls back to Spanish.
- **CSRF protection**: Generates tokens via `GET /api/csrf`; validates them on POST/PUT/DELETE requests.

### Component Architecture

Components in `src/components/` are split into three categories — keep this separation:
- `ui/` — Pure presentational components with no business logic
- `logical/` — Stateful components handling business logic
- `functional/` — Layout components (Header, Layout)

### Data Layer

All content (projects, experience, skills) lives in `src/data/` as TypeScript files. Data is bilingual — keyed by locale (`es`/`en`). Never hardcode content data directly in components.

Blog posts are the one exception: they live in SQLite (`src/server/db.ts`, `src/server/postsRepo.ts`), not `src/data/`, since they're written at runtime rather than committed to git (see `docs/shaping/blog-system.md`, R8). Posts are always in English — `/blog` does not filter by site locale.

### Localization

- `LanguageContext` in `src/context/LanguageContext.tsx` manages global locale state
- Supported locales configured in `src/locales/config.json`
- Language toggle in Header, persisted via cookie

### API Routes (`src/pages/api/`)

- `GET /api/csrf` — Returns a CSRF token
- `POST /api/contact` — Sends email via Mailgun (rate-limited: 3/hour per IP, CSRF required)
- `POST /api/quote` — Generates project cost estimate using `src/utils/quoteCalculator.ts`
- `GET /api/blog/[slug]/download` — Serves a post's `content_md` as a downloadable `.md` file

### Environment Variables

Required in `.env` (see `next.config.js`):
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — Email sending
- `CSRF_SECRET` — CSRF token signing
- `NEXT_PUBLIC_BASE_URL` — Public base URL

Optional:
- `BLOG_DB_PATH` — Path to the SQLite file backing the blog. Defaults to `./data/blog.db`. In Docker this should stay under `/app/data`, the mount point of the `blog-data` volume in `docker-compose.yml`.

### Key Rules (from `.cursor/rules/`)

- Do not add code comments unless explicitly requested
- Avoid inline styles on HTML tags
- Always pull content from `src/data/` files — do not hardcode data in components

## Skills disponibles

Usa estos skills según el tipo de tarea:

| Skill | Cuándo usar |
|-------|-------------|
| `/dev` | Nueva feature, página o sección |
| `/fix` | Corregir un bug o error |
| `/refactor` | Reorganizar código sin cambiar comportamiento |
| `/frontend` | Cambios de UI, estilos, animaciones o componentes |
| `/content` | Agregar/editar proyectos, experiencia o skills en `src/data/` |
| `/jira-atk` | Revisar Jira ATK por tickets con label `automation` y procesarlos |

## Agentes disponibles

| Agente | Cuándo usar |
|--------|-------------|
| `build-check` | Verificar que build y lint pasan antes de un PR |
| `pr-prep` | Checklist completo antes de abrir un Pull Request |
| `explore` | Buscar código, patrones o archivos sin modificar nada |
