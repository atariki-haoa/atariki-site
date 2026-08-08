---
shaping: true
---

# Separar Frontend y Backend en dos subproyectos — Slices

Ver [Shaping doc](./frontend-backend-split.md) para R, Shape A y el breadboard completo (Detail A).

**Solo planificación — nada de esto está implementado todavía.**

## Slice Summary

| # | Slice | Mechanism (Shape) | Demo |
|---|-------|--------------------|------|
| V1 | Backend real: datos + `/mcp` | A1, A2.1 (parcial), A2.2, A2.3 (parcial), A3.1, A3.2, A6, A4 | Un cliente MCP de prueba llama `publish_post` contra el backend nuevo; el post aparece en `/blog`, que ahora lee del backend por HTTP en vez de importar `postsRepo` en proceso. Descargar el `.md` también sigue funcionando, vía el backend. |
| V2 | Contacto y cotizador migrados | A2.1 (resto) | Enviar el formulario de contacto y pedir una cotización siguen funcionando igual que hoy — la lógica ahora corre en el backend, el frontend solo hace de proxy |

Con V1 cerrado, R1 y R7 ya quedan demostrados de punta a punta, y ATA-3 (V2 del sistema de blog) puede retomarse sin esperar a V2 de este split — eso es lo que resuelve R6.

---

## V1: Backend real — datos + `/mcp`

**Mecanismo:** A1 (workspace pnpm), A2.1 parcial (el backend absorbe `src/server/` + lo de ATA-3, todavía no `/api/contact`/`/api/quote`), A2.2 (`/mcp` directo), A2.3 parcial (solo `GET /posts` y `GET /posts/:slug`), A3.1/A3.2 (`/blog` y la descarga migrados a fetch), A6 (API key), A4 (docker-compose con dos servicios).

**Demo:** Se llama `publish_post` con un cliente MCP de prueba contra el backend nuevo (su propio puerto/proceso). El post aparece en `/blog` — que ya no importa `postsRepo` en el proceso del frontend, sino que hace `fetch` al backend. El botón "Descargar .md" también sigue funcionando, ahora servido por el backend.

| # | Place | Affordance | Control | Wires Out | Returns To |
|---|-------|------------|---------|-----------|------------|
| U5 | P1 | Carga de página `/blog` | render | → N7 | — |
| U6 | P1 | Listado de posts | render | — | ← N7 |
| U7 | P1 | Carga de página `/blog/[slug]` | render | → N9 | — |
| U8 | P1 | Contenido renderizado (Markdown) | render | — | ← N9 |
| U9 | P1 | Botón "Descargar .md" | click | → N11 | — |
| U10 | P1 | Descarga de archivo `.md` | render | — | ← N11 |
| N7 | P2 | `getServerSideProps` de `/blog` — pasa de `postsRepo.list()` en proceso a `fetch` contra el backend | call | → N19 → N22 | → U6 |
| N9 | P2 | `getServerSideProps` de `/blog/[slug]` — mismo cambio | call | → N19 → N23 | → U8 |
| N11 | P3 | `GET /api/blog/[slug]/download` — pasa a proxy hacia el backend | call | → N19 → N24 | → U10 |
| N19 | P4 | `verifyApiKey()` — middleware, valida `BACKEND_API_KEY` | call | → N22/N23/N24 (ok) / → 401 (falla) | — |
| N22 | P4 | `GET /posts` — `postsRepo.list()` (movido al backend) | call | reads S1 | → N7 |
| N23 | P4 | `GET /posts/:slug` — `postsRepo.getBySlug()` (movido al backend) | call | reads S1 | → N9 |
| N24 | P4 | `GET /posts/:slug` (reutilizado para la descarga) | call | reads S1 | → N11 |
| N30 | P6 | Claude.ai llama tool `publish_post()` | call | → N31 | — |
| N31 | P7 | `verifyBearerToken()` — token MCP (ATA-3) | call | → N32 (ok) / → error (falla) | — |
| N32 | P7 | `generateSlug(title, date)` | call | → N33 | — |
| N33 | P7 | `postsRepo.create()` (movido al backend) | write | → S1 | → N34 |
| N34 | P7 | respuesta `{slug, publishedAt, mdDownloadUrl}` | return | — | → N30 |
| S1 | P5 | `posts` (SQLite, movida al proceso backend junto con su volumen Docker) | store | — | — |

**Trabajo adicional (no-afordancia):**
- `pnpm-workspace.yaml` en la raíz + reorganizar `apps/frontend`/`apps/backend`.
- `docker-compose.yml` con dos servicios (`frontend`, `backend`) en la misma red interna; el volumen `blog-data` pasa a montarse solo en `backend`.
- Borrar `src/server/db.ts`/`postsRepo.ts` del frontend (no duplicar — el backend es la única copia).
- Dev local: alcanza con dos scripts de pnpm workspace corridos en paralelo (`pnpm --filter backend dev` + `pnpm --filter frontend dev`, o un `concurrently` simple) — no hace falta más que eso para V1.

---

## V2: Contacto y cotizador migrados

**Mecanismo:** A2.1 (resto — `/api/contact` y `/api/quote` se mudan al backend, reusando A6/N19 ya construido en V1).

**Demo:** Enviar el formulario de contacto y pedir una cotización se comportan exactamente igual que hoy desde el browser — la lógica de Mailgun y de `quoteCalculator` ahora corre en el backend; las API routes del frontend quedan como proxies delgados.

| # | Place | Affordance | Control | Wires Out | Returns To |
|---|-------|------------|---------|-----------|------------|
| U1 | P1 | Formulario de contacto — submit | click | → N1 | — |
| U2 | P1 | Formulario de contacto — mensaje éxito/error | render | — | ← N1 |
| U3 | P1 | Calculadora de cotización — submit | click | → N4 | — |
| U4 | P1 | Calculadora — resultado de estimación | render | — | ← N4 |
| N1 | P3 | `POST /api/contact` — pasa a proxy hacia el backend | call | → N19 → N20 | → U2 |
| N4 | P3 | `POST /api/quote` — pasa a proxy hacia el backend | call | → N19 → N21 | → U4 |
| N20 | P4 | `POST /contact` — envía email vía Mailgun (lógica existente, reubicada) | call | — | → N1 |
| N21 | P4 | `POST /quote` — corre `quoteCalculator` (lógica existente, reubicada) | call | — | → N4 |

**Nota:** V2 no tiene apuro — nada de R1/R7 depende de ella. Puede hacerse en paralelo o después de retomar ATA-3, cuando convenga.
