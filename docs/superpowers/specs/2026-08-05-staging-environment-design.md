# Entorno de staging (rama `dev`)

## Contexto

Hoy el sitio corre en un único stack Docker (`docker-compose.yml`), deployado
automáticamente por `.github/workflows/deploy.yml` en cada push a `master`. No existe
ningún entorno intermedio: para ver cambios de `dev` en un dominio real hay que
mergear a `master` primero.

Se quiere un entorno de **staging** en `staging.atariki.com`, que siempre refleje el
HEAD de la rama `dev`, corriendo aislado de producción en el mismo servidor
self-hosted.

## Arquitectura

`docker-compose.yml` no distingue ramas — buildea lo que haya en disco en ese momento.
Como el workflow actual hace `git reset --hard` sobre un único checkout, staging
necesita su **propio checkout, en un directorio separado**, además de su propio
archivo compose, sus propios puertos y su propio volumen de datos.

```
Servidor self-hosted
├── /home/atariki/atariki-site           (checkout master, PROD)
│   ├── .env                              (secretos PROD)
│   └── docker-compose.yml
│       ├── atariki-site-frontend  → 127.0.0.1:3000
│       └── atariki-site-backend   → 127.0.0.1:4000
│
├── /home/atariki/atariki-site-staging   (checkout dev, STAGING)
│   ├── .env                              (secretos STAGING, propios)
│   └── docker-compose.staging.yml
│       ├── atariki-site-staging-frontend → 127.0.0.1:15001
│       └── atariki-site-staging-backend  → 127.0.0.1:15002
│
└── cloudflared (un solo túnel, dos hostnames)
    ├── atariki.dev         → localhost:3000
    └── staging.atariki.com → localhost:15001
```

Cada stack tiene su propio volumen (`blog-data` vs `blog-data-staging`): las DBs
SQLite de blog/OAuth quedan completamente separadas, sin riesgo de que una prueba en
staging toque datos de producción.

## Componentes

### `docker-compose.staging.yml` (nuevo, versionado en el repo)

Calco de `docker-compose.yml` con:
- `container_name` e `image` con sufijo `-staging`, para no chocar en el mismo Docker
  daemon.
- Puertos de host `15001`/`15002` en vez de `3000`/`4000`. Se descartó el rango
  `50001`/`50002` inicialmente propuesto por caer dentro del rango de puertos
  efímeros del kernel Linux (`32768-60999`), que puede causar fallos intermitentes de
  bind. `15001`/`15002` están fuera de ese rango y no colisionan con ningún otro
  servicio detectado en el servidor de desarrollo (Gitea, Postgres, n8n, Plane, etc.).
- Volumen `blog-data-staging` en vez de `blog-data`.
- Puertos internos de los contenedores sin cambios (`3000`/`4000`) — la app no
  necesita saber que está en staging.

Ya creado en esta sesión, ver `docker-compose.staging.yml`.

### `.github/workflows/deploy-staging.yml` (nuevo)

Calco de `deploy.yml` con:
- Dispara en `push` a `dev` en vez de `master`.
- `concurrency.group: deploy-staging` (grupo separado del de prod, para que un
  deploy de staging no bloquee ni sea bloqueado por uno de prod).
- Sincroniza `/home/atariki/atariki-site-staging` contra `origin/dev`.
- Levanta con `docker compose -f docker-compose.staging.yml up -d --build`.
- Health check contra `http://localhost:15001`.

Ya creado en esta sesión, ver `.github/workflows/deploy-staging.yml`.

### Túnel de Cloudflare (fuera del repo, gestionado en el servidor)

`atariki.dev` ya se sirve a través de un túnel de Cloudflare existente en el mismo
servidor (`cloudflared` corre localmente, conexión saliente hacia Cloudflare, sin
necesidad de exponer puertos — consistente con que `docker-compose.yml` bindea a
`127.0.0.1`, no a `0.0.0.0`).

Se agrega `staging.atariki.com` como **hostname nuevo en ese mismo túnel** (no un
túnel separado), apuntando a `localhost:15001`:

```yaml
ingress:
  - hostname: atariki.dev
    service: http://localhost:3000
  - hostname: staging.atariki.com
    service: http://localhost:15001
  - service: http_status:404
```

Esto queda fuera del alcance de este spec (no está versionado en el repo) — lo
gestiona el admin directamente en la config de `cloudflared` del servidor, junto con
el registro DNS correspondiente en Cloudflare.

## Setup inicial (manual, una sola vez, en el servidor)

El workflow de `deploy-staging.yml` asume que `/home/atariki/atariki-site-staging` ya
existe como checkout de `dev`. Pasos a correr a mano antes del primer push a `dev`
que dispare el workflow:

```bash
# 1. Clonar el repo en un directorio separado, en la rama dev
git clone -b dev <url-del-repo> /home/atariki/atariki-site-staging
cd /home/atariki/atariki-site-staging

# 2. Crear el .env de staging con secretos propios (no compartidos con prod):
#    BACKEND_API_KEY, ADMIN_PASSWORD, OAUTH_JWT_SECRET, MAILGUN_API_KEY,
#    MAILGUN_DOMAIN, CSRF_SECRET, BACKEND_PUBLIC_URL (https://staging.atariki.com
#    o el subpath del backend), FRONTEND_PUBLIC_URL (https://staging.atariki.com),
#    BACKEND_URL (http://backend:4000, ya fijado en el compose)

# 3. Primer levantamiento manual (los siguientes los dispara el workflow)
docker compose -f docker-compose.staging.yml up -d --build

# 4. Agregar el hostname staging.atariki.com al túnel de Cloudflare existente
#    y el registro DNS correspondiente (fuera de este repo).
```

## Fuera de alcance

- Configuración de `cloudflared` y del registro DNS (gestionados directamente en el
  servidor / panel de Cloudflare, no versionados en este repo).
- Exponer el backend de staging públicamente. En prod, el backend además de servir
  al frontend expone `/mcp` directamente a clientes MCP externos vía
  `BACKEND_PUBLIC_URL`. Este diseño **no** agrega un hostname público para el backend
  de staging (queda solo en `127.0.0.1:15002`, alcanzable desde el frontend de
  staging pero no desde internet). Si más adelante se quiere probar el flujo
  OAuth/MCP en staging, hay que agregar un hostname adicional al túnel (ej.
  `api-staging.atariki.com → localhost:15002`) y setear `BACKEND_PUBLIC_URL` acorde
  en el `.env` de staging — no incluido aquí porque no fue parte del pedido original.
- Cualquier diferencia de comportamiento de la app entre entornos (staging corre
  exactamente el mismo código que prod correría si se mergeara `dev` a `master`).
- CI/CD para PRs individuales (este spec cubre solo el push continuo a `dev`).

## Verificación

- Push a `dev` dispara `deploy-staging.yml` sin afectar el workflow de `master`.
- `docker ps` en el servidor muestra ambos stacks corriendo simultáneamente sin
  conflicto de nombres, puertos o volúmenes.
- `curl http://localhost:15001` y `http://localhost:15002/posts` (con la API key de
  staging) responden desde el stack de staging.
- `staging.atariki.com` resuelve al stack de staging una vez agregado el hostname al
  túnel.
