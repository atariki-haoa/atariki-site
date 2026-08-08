---
shaping: true
---

# Sistema de Blog con Ingesta de Notas y Revisión LLM — Slices

Ver [Shaping doc](./blog-system.md) para R, Shape A y el breadboard completo (Detail A). Este documento corta ese breadboard en incrementos verticales, cada uno demo-able.

**Solo planificación — nada de esto está implementado todavía.**

## Slice Summary

| # | Slice | Mechanism (Shape) | Demo |
|---|-------|--------------------|------|
| V1 | Almacenamiento + páginas públicas | A4, A5, A6 | Post de prueba insertado a mano aparece en `/blog`, se puede abrir el detalle y descargar el `.md` |
| V2 | Tool MCP funcionando de punta a punta (auth simple, temporal) | A3, A1 (solo Resource Server) | Un cliente MCP de prueba llama `publish_post` con un token estático; el post nuevo aparece en `/blog` (V1) |
| V3 | Authorization Server completo (conector real de Claude.ai) | A1 (Authorization Server) | En Claude.ai → Settings → Connectors, se agrega la URL de `/mcp`, se loguea con la contraseña de admin, y el conector queda "Connected" |
| V4 | Skill de Claude.ai (experiencia conversacional completa) | A2 | Conversación real en Claude.ai (teléfono): compartís la nota, Claude corrige + da feedback de inglés, iterás, confirmás, y la entrada aparece publicada en `/blog` |

El objetivo final (R0) queda demostrado recién al cerrar V4 — cada slice previo es una pieza real y verificable del camino hasta ahí, no trabajo "de relleno".

---

## V1: Almacenamiento + páginas públicas

**Mecanismo:** A4 (SQLite + volume en `docker-compose.yml`), A5 (`/blog`, `/blog/[slug]`), A6 (descarga `.md`).

**Demo:** Se inserta un post de prueba directo en SQLite (script de seed manual). Se visita `/blog`, se ve el listado, se entra al detalle, se ve el Markdown renderizado, y se descarga el `.md`.

| # | Place | Affordance | Control | Wires Out | Returns To |
|---|-------|------------|---------|-----------|------------|
| S1 | P3 | `posts` (con fila de prueba insertada a mano) | store | — | — |
| N20 | P3 | `postsRepo.list(locale?)` | call | reads S1 | → U9 |
| N21 | P3 | `postsRepo.getBySlug(slug)` | call | reads S1 | → U12 |
| N22 | P5 | `GET /blog/[slug]/download` | call | reads S1 | → U14 |
| U8 | P4 | carga de página `/blog` | render | → N20 | — |
| U9 | P4 | listado de posts (título, fecha, tipo, extracto) | render | — | ← N20 |
| U10 | P4 | click en tarjeta de post | click | → P5 | — |
| U11 | P5 | carga de página `/blog/[slug]` | render | → N21 | — |
| U12 | P5 | contenido renderizado (react-markdown) | render | — | ← N21 |
| U13 | P5 | botón "Descargar .md" | click | → N22 | — |
| U14 | P5 | descarga de archivo `.md` en el navegador | render | — | ← N22 |

**Trabajo adicional (no-afordancia):** agregar `volume` en `docker-compose.yml` para persistir el archivo SQLite entre rebuilds (A4.2) — sin esto, V1 se pierde en el primer redeploy.

---

## V2: Tool MCP funcionando de punta a punta (auth simple, temporal)

**Mecanismo:** A3 (acción de publicar) + A1, solo la mitad *Resource Server* (sin el Authorization Server real todavía — se usa un bearer token estático en variable de entorno como placeholder de desarrollo, reemplazado en V3).

**Demo:** Con un cliente MCP de prueba (ej. el MCP Inspector oficial) se llama `publish_post` contra `/mcp` con el token estático de dev. El post nuevo se ve reflejado en `/blog` al recargar (V1).

| # | Place | Affordance | Control | Wires Out | Returns To |
|---|-------|------------|---------|-----------|------------|
| N10 | P2 | `/mcp` tool `publish_post()` | call | → N11 | — |
| N11 | P2 | `verifyBearerToken()` — versión temporal: compara contra un token estático de env var (constant-time). Se reemplaza en V3 por la validación del JWT real emitido por el Authorization Server | call | → N12 (ok) / → error (falla) | — |
| N12 | P2 | `generateSlug(title, date)` | call | → N13 | — |
| N13 | P2 | `postsRepo.create()` | write | → S1 | → N14 |
| N14 | P2 | respuesta de la tool `{slug, publishedAt, mdDownloadUrl}` | return | — | (visto en el cliente MCP de prueba; en V4 esto llega a `U6`) |

**Nota:** este slice de-riesga la parte más nueva del sistema (¿un servidor MCP con Streamable HTTP funciona bien montado sobre el `server.js` Express existente?) antes de invertir en el Authorization Server completo.

---

## V3: Authorization Server completo (conector real de Claude.ai)

**Mecanismo:** A1.3 — reemplaza el token estático de V2 por el flujo OAuth real que Claude.ai espera al agregar un conector personalizado (ver [spike](./spike-mcp-connector-auth.md)).

**Demo:** En Claude.ai → Settings → Connectors → Add custom connector, se pega la URL de `/mcp`. Claude.ai se auto-registra (DCR), redirige a `/authorize`, se ingresa la contraseña de admin, se auto-aprueba, y el conector queda "Connected" en Claude.ai — listo para que V4 lo use.

| # | Place | Affordance | Control | Wires Out | Returns To |
|---|-------|------------|---------|-----------|------------|
| P0 | — | Dynamic Client Registration (Claude.ai se auto-registra) | call | → S2 | — |
| P0 | — | `/authorize` — pide la contraseña de admin, auto-aprueba, redirige con authorization code | call | — | — |
| P0 | — | `/token` — intercambia code + PKCE por access token (JWT) + refresh token | call | → S3 | — |
| S2 | P3 | `oauth_clients` (client_id, redirect_uris) | store | — | — |
| S3 | P3 | `refresh_tokens` | store | — | → N11 (validación/refresh) |
| N11 | P2 | *(actualizado)* `verifyBearerToken()` ahora valida el JWT real emitido acá, en vez del token estático de V2 | call | → N12 (ok) / → U7 (falla) | — |

**Nota:** este es el slice más nuevo en términos de superficie de riesgo (implementar un Authorization Server, aunque sea mínimo y de un solo usuario) — por eso queda aislado del resto en vez de mezclado con V2.

---

## V4: Skill de Claude.ai (experiencia conversacional completa)

**Mecanismo:** A2 — la Skill que guía la conversación de punta a punta.

**Demo:** Conversación real en Claude.ai, desde el teléfono. Se comparte/dicta el contenido de una nota, Claude (siguiendo la Skill) pregunta el tipo de entrada si falta, corrige y formatea el texto, da feedback explicado si es inglés, permite iterar, y al confirmar llama `publish_post` (ya construido en V2/V3). La entrada aparece publicada en `/blog`.

| # | Place | Affordance | Control | Wires Out | Returns To |
|---|-------|------------|---------|-----------|------------|
| U1 | P1 | operador comparte/dicta la nota | type | → N1 | — |
| N1 | P1 | Skill — clasifica tipo de entrada / idioma (pregunta si falta) | call | → U2 / → N2 | — |
| U2 | P1 | Claude pregunta tipo/idioma faltante | render | — | ← N1 |
| N2 | P1 | Skill — corrige y formatea el texto a Markdown | call | → N3 | → U3 |
| N3 | P1 | Skill — si locale=en, genera feedback explicado de correcciones | call | — | → U3 |
| U3 | P1 | Claude muestra Markdown corregido + feedback | render | — | ← N2, ← N3 |
| U4 | P1 | operador pide más cambios (iterar) | type | → N2 | — |
| U5 | P1 | operador confirma "publicar" | type | → N4 | — |
| N4 | P1 | Skill — arma parámetros finales y llama la tool | call | → N10 | — |
| U6 | P1 | Claude confirma publicación (con link) | render | — | ← N14 |
| U7 | P1 | Claude muestra error si el token del conector es inválido | render | — | ← N11 |

**Nota:** con V4 cerrado, R0 (el objetivo core) queda demostrado de punta a punta por primera vez.
