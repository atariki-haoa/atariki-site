# Entorno de staging (rama `dev`)

## Contexto

Hoy el sitio corre en un único stack Docker (`docker-compose.yml`), deployado
automáticamente por `.github/workflows/deploy.yml` en cada push a `master`. No existe
ningún entorno intermedio: para ver cambios de `dev` en un dominio real hay que
mergear a `master` primero.

Se quiere un entorno de **staging** en `staging.atariki.dev`, que siempre refleje el
HEAD de la rama `dev`, corriendo aislado de producción.

**Corrección de topología (post-aprobación inicial):** el diseño original asumía que
staging correría en el mismo servidor físico que producción (`atariki.com`). Se
confirmó que **no es así** — staging vive en una máquina distinta (la máquina de
desarrollo/homelab del usuario, `atariki-optiplex`), sin ningún runner de GitHub
Actions ni contenedor `atariki-site-*` corriendo hoy. Esto cambia dos piezas del
diseño respecto a la primera versión: el runner de CI y el túnel de Cloudflare (ver
más abajo). El resto (compose separado, puertos, volumen propio) se mantiene igual.

**Corrección de dominio y túnel (segunda ronda):** además, esta máquina ya tenía un
túnel de Cloudflare propio corriendo (`plane`, usado para Plane/n8n/Gitea) con
entradas de un trabajo previo (ticket ATA-5) para `api-staging.atariki.dev` y
`staging.atariki.dev` en puertos `40001`/`40002`. Se decidió: reusar ese túnel
existente (no crear uno nuevo), usar el dominio `.dev` de esas entradas viejas, pero
con los puertos `15001`/`15002` ya levantados y verificados en esta sesión. Las dos
entradas viejas se reemplazaron por una sola (ver sección de Cloudflare).

## Arquitectura

`docker-compose.yml` no distingue ramas — buildea lo que haya en disco en ese momento.
Como el workflow actual hace `git reset --hard` sobre un único checkout, staging
necesita su **propio checkout, en un directorio separado**, además de su propio
archivo compose, sus propios puertos y su propio volumen de datos. Al estar en una
máquina física distinta, también necesita su **propio runner de GitHub Actions**. El
túnel de Cloudflare, en cambio, se resuelve reusando el que ya corre en esta máquina
(no hace falta uno nuevo — ver sección de Cloudflare más abajo).

```
Servidor de PRODUCCIÓN (atariki.com)
├── /home/atariki/atariki-site           (checkout master, PROD)
│   ├── .env                              (secretos PROD)
│   └── docker-compose.yml
│       ├── atariki-site-frontend  → 127.0.0.1:3000
│       └── atariki-site-backend   → 127.0.0.1:4000
├── Runner de GitHub Actions (label: self-hosted)
└── cloudflared (túnel propio de prod) → atariki.dev → localhost:3000

Máquina de STAGING (atariki-optiplex, esta máquina — host físico distinto)
├── /home/atariki/atariki-site-staging   (checkout dev, STAGING)
│   ├── .env                              (secretos STAGING, propios)
│   └── docker-compose.staging.yml
│       ├── atariki-site-staging-frontend → 127.0.0.1:15001
│       └── atariki-site-staging-backend  → 127.0.0.1:15002
├── Runner de GitHub Actions nuevo (labels: self-hosted, staging)
└── cloudflared (túnel "plane", ya existente, con una entrada nueva)
    → staging.atariki.dev → localhost:15001
```

Cada stack tiene su propio volumen (`blog-data` vs `blog-data-staging`): las DBs
SQLite de blog/OAuth quedan completamente separadas, sin riesgo de que una prueba en
staging toque datos de producción. Al estar en máquinas distintas, esto queda
garantizado también a nivel de sistema operativo, no solo de Docker.

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
- `runs-on: [self-hosted, staging]` — **no** `runs-on: self-hosted` a secas. Como
  ahora sabemos que hay (o puede haber en el futuro) más de un runner self-hosted
  registrado al repo — uno en el servidor de prod, otro en la máquina de staging —
  una label genérica dejaría a GitHub libre de asignar el job a cualquiera de los
  dos. La label `staging` fuerza a que el job caiga siempre en el runner correcto.
- `concurrency.group: deploy-staging` (grupo separado del de prod, para que un
  deploy de staging no bloquee ni sea bloqueado por uno de prod).
- Sincroniza `/home/atariki/atariki-site-staging` contra `origin/dev`.
- Levanta con `docker compose -f docker-compose.staging.yml up -d --build`.
- Health check contra `http://localhost:15001`.

Ya actualizado en esta sesión, ver `.github/workflows/deploy-staging.yml`.

### Runner de GitHub Actions nuevo (en la máquina de staging)

La máquina de staging no tiene ningún runner de GitHub Actions instalado hoy (se
confirmó con `find` y `systemctl` — el runner que corre `deploy.yml` para prod vive
únicamente en el servidor de producción). Hace falta instalar el runner ahí y
registrarlo con la label adicional `staging` (además de la label `self-hosted` que
trae por defecto), para que `deploy-staging.yml` pueda dirigirse específicamente a
él.

### Túnel de Cloudflare (fuera del repo, gestionado en cada servidor)

`atariki.dev` se sirve a través de un túnel de Cloudflare que corre en el servidor
de prod (`cloudflared` corre localmente ahí, conexión saliente hacia Cloudflare, sin
necesidad de exponer puertos — consistente con que `docker-compose.yml` bindea a
`127.0.0.1`, no a `0.0.0.0`). Ese proceso solo puede alcanzar puertos de `localhost`
de su propia máquina — no puede enrutar hacia la máquina de staging, así que no se
comparte con prod.

En la máquina de staging, sin embargo, **ya corría un túnel de Cloudflare propio**
(`cloudflared`, túnel llamado `plane`, config en `/home/atariki/.cloudflared/config.yml`,
gestionado como los servicios systemd `cloudflared` y `cloudflared-plane`), usado
para exponer Plane, n8n y Gitea. Ese `config.yml` ya tenía además dos entradas de un
trabajo previo (ticket ATA-5) apuntando a puertos `40001`/`40002` que nunca se
levantaron. Se reemplazaron esas dos entradas por una sola, con los puertos
`15001`/`15002` reales de esta sesión:

```yaml
# entrada agregada a /home/atariki/.cloudflared/config.yml (túnel "plane" ya existente)
ingress:
  # ... entradas previas de Plane/n8n/Gitea sin cambios ...
  - hostname: staging.atariki.dev
    service: http://localhost:15001
  - service: http_status:404   # catch-all, debe quedar último
```

No hizo falta crear un túnel nuevo ni hacer login OAuth de nuevo — solo editar el
`config.yml` y reiniciar los servicios (`sudo systemctl restart cloudflared
cloudflared-plane`). El registro DNS de `staging.atariki.dev` puede ya existir de
ATA-5; si no, hay que darlo de alta igual que cualquier hostname de un túnel
existente (`cloudflared tunnel route dns plane staging.atariki.dev`).

## Setup inicial (manual, una sola vez, en la máquina de staging)

El workflow de `deploy-staging.yml` asume que ya existen, en la máquina de staging:
un checkout de `dev` en `/home/atariki/atariki-site-staging`, un runner de GitHub
Actions registrado con la label `staging`, y la entrada de `staging.atariki.dev` en
el túnel de Cloudflare ya existente. El plan de implementación
(`docs/superpowers/plans/2026-08-05-staging-environment.md`) tiene el detalle paso a
paso; a alto nivel:

1. Clonar el repo en `dev` en un directorio separado de cualquier otro checkout de
   este repo que exista en la máquina.
2. Crear el `.env` de staging con secretos propios (no compartidos con prod):
   `BACKEND_API_KEY`, `ADMIN_PASSWORD`, `OAUTH_JWT_SECRET`, `MAILGUN_API_KEY`,
   `MAILGUN_DOMAIN`, `CSRF_SECRET`, `FRONTEND_PUBLIC_URL`
   (`https://staging.atariki.dev`). `BACKEND_PUBLIC_URL` queda sin setear (ver
   "Fuera de alcance").
3. Primer levantamiento manual (`docker compose -f docker-compose.staging.yml up -d
   --build`) — los siguientes los dispara el workflow.
4. Instalar y registrar el runner de GitHub Actions con las labels `self-hosted,
   staging`.
5. Agregar la entrada de `staging.atariki.dev → localhost:15001` al `config.yml` del
   túnel `plane` ya existente y reiniciar `cloudflared`/`cloudflared-plane`.

## Fuera de alcance

- Contenido detallado del login OAuth de Cloudflare (no aplicó — se reusó un túnel
  ya autenticado).
- Exponer el backend de staging públicamente. En prod, el backend además de servir
  al frontend expone `/mcp` directamente a clientes MCP externos vía
  `BACKEND_PUBLIC_URL`. Este diseño **no** agrega un hostname público para el backend
  de staging (queda solo en `127.0.0.1:15002`, alcanzable desde el frontend de
  staging pero no desde internet). Si más adelante se quiere probar el flujo
  OAuth/MCP en staging, hay que agregar una regla de `ingress` adicional al túnel
  (ej. `api-staging.atariki.dev → localhost:15002`, como existía en la versión vieja
  de ATA-5) y setear `BACKEND_PUBLIC_URL` acorde en el `.env` de staging — no
  incluido aquí porque no fue parte del pedido original.
- Cualquier diferencia de comportamiento de la app entre entornos (staging corre
  exactamente el mismo código que prod correría si se mergeara `dev` a `master`).
- CI/CD para PRs individuales (este spec cubre solo el push continuo a `dev`).

## Verificación

- Push a `dev` dispara `deploy-staging.yml` en el runner de la máquina de staging
  (label `staging`), sin afectar el workflow ni el runner de `master`.
- `docker ps` en la máquina de staging muestra el stack de staging corriendo junto a
  los demás servicios de esa máquina (Gitea, Postgres, n8n, Plane) sin conflicto de
  nombres ni puertos.
- `curl http://localhost:15001` y `http://localhost:15002/posts` (con la API key de
  staging) responden desde el stack de staging.
- `staging.atariki.dev` resuelve al stack de staging una vez agregado el hostname al
  túnel.
