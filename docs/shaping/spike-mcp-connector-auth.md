## A3-C Spike: Auth de conector MCP remoto para Claude.ai

### Context

Se eligió A3-C (conector MCP remoto) como canal de interacción para el sistema de blog: en vez de curl o un bot de Telegram, el operador chatea directo con Claude.ai (Pro/Max/Team/Enterprise), y Claude llama tools (`publish_post`, `list_posts`, `get_post`) expuestas por un servidor MCP remoto que corre junto al sitio. El único part flagged en el shape es A3-C.2: el mecanismo de autenticación del conector — no sabíamos si es OAuth completo o un header auth simple en beta (que requiere acceso anticipado de Anthropic, no garantizado).

### Goal

Saber concretamente qué hay que implementar en `atariki-site` para que Claude.ai pueda conectarse de forma segura a un servidor MCP remoto propio, y con qué esfuerzo/mecanismo — para decidir si seguimos con A3-C tal cual o ajustamos el shape.

### Questions

| # | Question |
|---|----------|
| **Q1** | ¿Qué endpoints/mecanismos concretos exige el spec de MCP para que un servidor remoto soporte auth vía OAuth (discovery, authorization, token, registro de cliente)? |
| **Q2** | ¿Qué provee el SDK oficial de MCP (TypeScript) ya resuelto vs. qué queda por implementar a mano nosotros? |
| **Q3** | ¿El header auth en beta es realmente inaccesible sin contactar a Anthropic, o hay alguna vía self-serve? |
| **Q4** | ¿Dónde encaja el servidor MCP en la arquitectura actual (`server.js` con Express + Next.js) — mismo proceso, misma ruta base, o servicio aparte? |
| **Q5** | ¿Qué transporte hay que usar hoy (Streamable HTTP vs SSE) y qué implica para nuestro servidor Express existente? |

### Acceptance

El spike está completo cuando podemos describir, con referencias concretas a la documentación oficial, los pasos exactos para implementar auth en un servidor MCP remoto en este proyecto (qué endpoints, qué librería, qué queda a mano), y si el header auth beta es una opción realista hoy o no.

### Findings

**Q1 — Qué exige el spec:** Un servidor MCP remoto con auth necesita, del lado *Resource Server*: metadata de RFC 9728 (protected resource) y RFC 8414 (authorization server, aunque sea espejada). Del lado *Authorization Server* (que Claude.ai como cliente MCP espera encontrar): Dynamic Client Registration (RFC 7591 — Claude.ai se auto-registra como client la primera vez que agregás el conector), endpoint `/authorize` (authorization_code + PKCE), endpoint `/token`.

**Q2 — Qué da el SDK oficial (`@modelcontextprotocol/typescript-sdk`) vs. qué queda a mano:**
- ✅ **Resource Server (lado `/mcp`):** completamente resuelto — `requireBearerAuth()` + una función `verifyAccessToken(token)` que escribimos nosotros (puede ser tan simple como verificar un JWT propio), más helpers para publicar la metadata (`mcpAuthMetadataRouter`, `getOAuthProtectedResourceMetadataUrl`).
- ❌ **Authorization Server (DCR + `/authorize` + `/token` + discovery):** **no viene como librería lista para producción.** El repo del SDK trae solo *ejemplos de referencia* (`examples/oauth/` — flujo `authorization_code` completo con auto-consent; `examples/oauth-client-credentials/` — AS mínimo solo para `client_credentials`). La docs lo dice explícito: *"The SDK itself does not issue tokens."* Hay que adaptar uno de esos ejemplos a mano.

**Q3 — Header auth beta:** Confirmado por búsqueda previa — el rollout es gradual y el acceso temprano requiere contactar a Anthropic directamente. No es self-serve hoy. No podemos depender de esta vía.

**Q4 — Dónde encaja en `atariki-site`:** Todo puede vivir como rutas Express adicionales dentro del mismo `server.js` (mismo proceso): `/mcp` (Resource Server), `/oauth/authorize`, `/oauth/token`, `/oauth/register` (DCR), `/.well-known/oauth-authorization-server`. No hace falta un servicio aparte.

**Q5 — Transporte:** Streamable HTTP (SSE está deprecado desde el spec de marzo 2025). El SDK monta esto directo sobre una ruta Express (`createMcpExpressApp` / `toNodeHandler`), compatible con el server actual.

### Conclusión

A3-C.2 deja de ser un unknown — ya sabemos *qué* hay que construir: un mini Authorization Server de un solo usuario (DCR + `/authorize` con auto-aprobación tras validar tu contraseña, reusando la idea original de login + `/token` que emite un JWT firmado) **además** del Resource Server (que el SDK resuelve casi entero). Es más trabajo que un JWT simple tipo curl, pero es acotado y con ejemplos oficiales para adaptar — no es una apuesta a ciegas.
