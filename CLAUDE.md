# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This is a **pnpm workspace** with two apps: `apps/frontend` (Next.js) and `apps/backend`
(Express + TypeScript). Run everything from the repo root:

```bash
pnpm dev           # Start both apps together (frontend :3000, backend :4000)
pnpm build         # Build both apps (backend first, then frontend)
pnpm seed:post     # Insert a test blog post directly via the backend

pnpm --filter frontend dev    # Run only the frontend
pnpm --filter backend dev     # Run only the backend (tsx watch)
```

There are no tests configured for the backend. The frontend has a handful of Jest tests
(`pnpm --filter frontend test`).

## Git Workflow

- Base branch for all work is `dev`, not `master`. Branch off `dev`, and open PRs targeting `dev`.
- Never target `master` directly — no branching from it, no PRs into it — unless the user explicitly asks for it in that conversation.

## Architecture

The site is split into two independently-deployable apps in the same pnpm workspace (see
`docs/shaping/frontend-backend-split.md` for the shaping/rationale behind this split):

- **`apps/frontend`** — Next.js 14 portfolio site, TypeScript, Tailwind CSS, bilingual (ES/EN).
  Renders all pages; talks to the backend over REST for anything data-backed.
- **`apps/backend`** — Express + TypeScript API. Owns the SQLite data and the MCP server.
  Nothing in the frontend touches the database directly anymore.

They communicate over plain REST, authenticated with a shared static API key
(`BACKEND_API_KEY`) — see Environment Variables below. The one exception is `/mcp`, which
the backend exposes directly to external MCP clients (e.g. Claude.ai); the frontend is
never involved in that path.

### Frontend (`apps/frontend`)

#### Custom Server (`server.js`)

Custom Express server wrapping Next.js:
- **Locale detection**: IP-based language detection on first visit, stored as a cookie (1-year expiry). Falls back to Spanish.
- **CSRF protection**: Generates tokens via `GET /api/csrf`; validates them on POST/PUT/DELETE requests.

#### Component Architecture

Components in `src/components/` are split into three categories — keep this separation:
- `ui/` — Pure presentational components with no business logic
- `logical/` — Stateful components handling business logic
- `functional/` — Layout components (Header, Layout)

#### Data Layer

All content (projects, experience, skills) lives in `src/data/` as TypeScript files. Data is bilingual — keyed by locale (`es`/`en`). Never hardcode content data directly in components.

Blog posts are the one exception: they're fetched from the backend's REST API
(`src/server/backendClient.ts`), not stored in `src/data/` or in any local database — the
frontend has no direct database access (see `docs/shaping/blog-system.md`, R8, and
`docs/shaping/frontend-backend-split.md`). Posts are always in English — `/blog` does not
filter by site locale.

#### Localization

- `LanguageContext` in `src/context/LanguageContext.tsx` manages global locale state
- Supported locales configured in `src/locales/config.json`
- Language toggle in Header, persisted via cookie

#### API Routes (`src/pages/api/`)

These are thin proxies for anything the browser calls directly — the real logic lives in
the backend. The frontend's own API layer exists to keep the backend's address/key out of
the browser (obfuscation), not to hold business logic.

- `GET /api/csrf` — Returns a CSRF token
- `POST /api/contact` — Proxies to the backend, which sends email via Mailgun (rate-limited: 3/hour per IP, CSRF required)
- `POST /api/quote` — Proxies to the backend, which generates the cost estimate
- `GET /api/blog/[slug]/download` — Proxies to the backend and serves `content_md` as a downloadable `.md` file

### Backend (`apps/backend`)

Plain Express + TypeScript (ESM, `NodeNext` module resolution), no framework beyond that.

- `src/db.ts` — SQLite connection (`node:sqlite`, no native deps) and schema migration
- `src/postsRepo.ts` — `list()`, `getBySlug()`, `create()` over the `posts` table
- `src/routes/posts.ts` — `GET /posts`, `GET /posts/:slug`, behind `verifyApiKey()`
- `src/mcp/` — the MCP server: `auth.ts` (`verifyMcpBearerToken`, a separate secret from
  the internal API key) and `server.ts` (`McpServer` + the `publish_post` tool)
- `src/generateSlug.ts`, `src/extractTitle.ts` — pure helpers used by `publish_post`
  (the post's title is derived from the first `# heading` in `content_md`, since the tool
  doesn't take a separate `title` param)

### Environment Variables

**Frontend** (`apps/frontend/.env`):
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — Email sending
- `CSRF_SECRET` — CSRF token signing
- `NEXT_PUBLIC_BASE_URL` — Public base URL (optional, defaults to `https://atariki.dev`)
- `BACKEND_URL` — Base URL of the backend (e.g. `http://localhost:4000` locally, `http://backend:4000` in Docker)
- `BACKEND_API_KEY` — Shared secret sent as `Authorization: Bearer <key>` on every backend call. Must match the backend's copy.

**Backend** (`apps/backend/.env`):
- `BACKEND_API_KEY` — Same value as the frontend's copy; validated by `verifyApiKey()` on every `/posts` request.
- `MCP_BEARER_TOKEN` — Separate secret for `/mcp` (used by MCP clients like Claude.ai, not by the frontend). Temporary until a full OAuth Authorization Server replaces it.
- `BACKEND_PORT` — Optional, defaults to `4000`.
- `FRONTEND_PUBLIC_URL` — Public frontend URL, used to build `mdDownloadUrl` in the `publish_post` response.
- `BLOG_DB_PATH` — Optional, defaults to `./data/blog.db`. In Docker this should stay under `/app/data`, the mount point of the `blog-data` volume (owned by the `backend` service in `docker-compose.yml`).

In Docker, both services read from the same root `.env` (via `env_file` in
`docker-compose.yml`) — there's one shared copy of these secrets, not one per service.

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
