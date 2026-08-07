# Staging Environment Setup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Nota especial para este plan:** las tareas corren en la máquina de staging, que
> es la misma máquina donde se ejecuta esta sesión de Claude Code (no el servidor de
> producción). No hay tests automatizados que correr — la "verificación" de cada
> tarea es un comando de shell cuyo output confirma el resultado esperado. Los pasos
> marcados **[Ejecutable en sesión]** los corre Claude directamente vía Bash. Los
> marcados **[Requiere el usuario]** necesitan una credencial, un login interactivo
> o una decisión que Claude no puede generar ni obtener por su cuenta.

**Goal:** Dejar `staging.atariki.dev` sirviendo el HEAD de la rama `dev`, corriendo
en un stack Docker aislado de producción, en la máquina de staging (distinta a la
de producción).

**Architecture:** Checkout propio del repo (`/home/atariki/atariki-site-staging`,
rama `dev`) en la máquina de staging + `docker-compose.staging.yml` (ya comiteado)
+ `.env` propio con secretos de staging + runner de GitHub Actions nuevo (label
`staging`) + una entrada nueva en el túnel de Cloudflare **ya existente** en esta
máquina (túnel `plane`, usado también por Plane/n8n/Gitea — no se crea un túnel
nuevo). Ver `docs/superpowers/specs/2026-08-05-staging-environment-design.md` para
el diseño completo, incluidas ambas correcciones (topología de dos máquinas físicas,
y reúso del túnel existente con dominio `.dev`).

**Tech Stack:** Docker Compose, GitHub Actions (self-hosted runner), Cloudflare
Tunnel (`cloudflared`).

## Global Constraints

- Directorio del checkout de staging: `/home/atariki/atariki-site-staging`
- Rama del checkout de staging: `dev`
- Archivo compose de staging: `docker-compose.staging.yml` (ya en el repo, en la raíz)
- Puertos de host: `15001` (frontend), `15002` (backend) — ya verificados sin
  colisión en esta máquina (Gitea, Postgres ×3, n8n, Plane, VM Windows)
- Nombres de contenedor: `atariki-site-staging-frontend`,
  `atariki-site-staging-backend`
- Volumen de datos: `blog-data-staging` (independiente de `blog-data` de prod, y en
  un host físico distinto)
- Hostname público: `staging.atariki.dev`, servido por el túnel de Cloudflare
  `plane` ya existente en esta máquina (no el mismo túnel que usa `atariki.dev` de
  prod, que corre en el otro servidor)
- Label del runner de GitHub Actions: `staging` (además de `self-hosted`) —
  `deploy-staging.yml` ya usa `runs-on: [self-hosted, staging]`
- El backend de staging **no** se expone públicamente en este plan (ver spec,
  sección "Fuera de alcance") — `BACKEND_PUBLIC_URL` queda sin setear en el `.env`
  de staging, usando el fallback `http://localhost:4000` del propio proceso

---

### Task 1: Clonar el repositorio en un checkout separado para staging

**[Ejecutable en sesión]**

**Files:**
- `/home/atariki/atariki-site-staging` (nuevo directorio, fuera de este repo,
  hermano de `/home/atariki/codes/atariki-site`)

**Interfaces:**
- Produces: el directorio de checkout que usarán todas las tareas siguientes y el
  workflow `deploy-staging.yml`

- [x] **Step 1: Clonar el repo en la rama `dev`, en un directorio separado**

```bash
git clone -b dev git@github.com:atariki-haoa/atariki-site.git /home/atariki/atariki-site-staging
```

- [x] **Step 2: Verificar que el checkout apunta a `dev`**

Run: `cd /home/atariki/atariki-site-staging && git branch --show-current`
Expected: `dev`

- [x] **Step 3: Verificar que incluye los commits del diseño de staging**

Run: `cd /home/atariki/atariki-site-staging && git log --oneline -3`
Expected: aparece el commit `5a6b6e8` (o su equivalente tras rebase/push) con
`docker-compose.staging.yml` y `deploy-staging.yml`

---

### Task 2: Crear el `.env` de staging con secretos propios

**[Ejecutable en sesión, con inputs del usuario para Steps 2 y 3]**

**Files:**
- Create (fuera de git): `/home/atariki/atariki-site-staging/.env`

**Interfaces:**
- Consumes: nada (es config pura)
- Produces: las variables que leen `docker-compose.staging.yml` (`env_file: .env`
  en ambos servicios)

- [x] **Step 1: Generar valores aleatorios para los secretos que deben ser únicos
  por entorno [Ejecutable en sesión]**

```bash
openssl rand -hex 32   # BACKEND_API_KEY
openssl rand -hex 32   # OAUTH_JWT_SECRET
openssl rand -hex 32   # CSRF_SECRET
```

- [x] **Step 2: Definir `ADMIN_PASSWORD` [Requiere el usuario]**

Pedirle a Ariel una contraseña de admin propia para staging, distinta a la de prod
(protege el login de `/authorize` del Authorization Server OAuth).

- [x] **Step 3: Obtener credenciales de Mailgun [Requiere el usuario]**

Preguntarle a Ariel si reusa `MAILGUN_API_KEY`/`MAILGUN_DOMAIN` de prod o si va a
crear un sending domain/API key separado para staging.

- [x] **Step 4: Escribir el archivo `.env` completo [El usuario prefirió manejar
  este archivo directamente, en vez de que Claude lo escriba/edite]**

```bash
cat > /home/atariki/atariki-site-staging/.env <<'EOF'
# --- Compartido entre frontend y backend ---
BACKEND_API_KEY=<valor generado en el Step 1>

# --- Frontend ---
MAILGUN_API_KEY=<valor del Step 3>
MAILGUN_DOMAIN=<valor del Step 3>
CSRF_SECRET=<valor generado en el Step 1>
NEXT_PUBLIC_BASE_URL=https://staging.atariki.dev
BACKEND_URL=http://backend:4000

# --- Backend ---
ADMIN_PASSWORD=<valor del Step 2>
OAUTH_JWT_SECRET=<valor generado en el Step 1>
FRONTEND_PUBLIC_URL=https://staging.atariki.dev
EOF
chmod 600 /home/atariki/atariki-site-staging/.env
```

`BACKEND_PUBLIC_URL` y `BACKEND_PORT` quedan sin setear a propósito (ver Global
Constraints). Ojo: `NEXT_PUBLIC_BASE_URL` y `FRONTEND_PUBLIC_URL` deben apuntar a
`staging.atariki.dev` (dominio `.dev`, no `.com` — corregido tras encontrar el túnel
ya existente).

- [x] **Step 5: Verificar permisos del archivo [Ejecutable en sesión]**

Run: `ls -l /home/atariki/atariki-site-staging/.env`
Expected: `-rw------- ... .env`

---

### Task 3: Primer levantamiento del stack de staging

**[Ejecutable en sesión]**

**Files:**
- Ninguno del repo — opera sobre lo creado en Task 1 y Task 2

**Interfaces:**
- Consumes: `/home/atariki/atariki-site-staging/.env` (Task 2),
  `docker-compose.staging.yml` (commit `5a6b6e8`)
- Produces: los contenedores `atariki-site-staging-frontend` y
  `atariki-site-staging-backend` corriendo, y el volumen `blog-data-staging`

- [x] **Step 1: Build y levantamiento**

```bash
cd /home/atariki/atariki-site-staging
docker compose -f docker-compose.staging.yml up -d --build
```

Expected: build de ambas imágenes sin errores, ambos contenedores `running`.
(Nota: el primer intento falló con `ERR_PNPM_DEPLOY_NONINJECTED_WORKSPACE` — bug
real en ambos Dockerfiles, arreglado agregando `--legacy` al `pnpm deploy`, commit
`e3b8ea9`. No era específico de staging, afectaba también a un futuro rebuild sin
caché de prod.)

- [x] **Step 2: Verificar que ambos contenedores están corriendo**

Run: `docker compose -f docker-compose.staging.yml ps`
Expected: `atariki-site-staging-frontend` y `atariki-site-staging-backend`, ambos
`Up`.

- [x] **Step 3: Verificar que el frontend responde**

Run: `curl -sf http://localhost:15001 -o /dev/null -w '%{http_code}\n'`
Expected: `200`

- [x] **Step 4: Verificar que el backend responde (autenticado)**

```bash
curl -sf http://localhost:15002/posts \
  -H "Authorization: Bearer $(grep BACKEND_API_KEY /home/atariki/atariki-site-staging/.env | cut -d= -f2)" \
  -o /dev/null -w '%{http_code}\n'
```

Expected: `200`

---

### Task 4: Verificar convivencia con el resto de los servicios de esta máquina

**[Ejecutable en sesión]**

**Files:**
- Ninguno — tarea de verificación pura

**Interfaces:**
- Consumes: el stack de staging (Task 3) y todo lo demás que ya corre en esta
  máquina (Gitea, Postgres ×3, n8n, Plane, VM Windows)

- [x] **Step 1: Confirmar que no hay puertos ni nombres de contenedor duplicados**

Run: `docker ps --format '{{.Names}}\t{{.Ports}}' | sort`
Expected: `atariki-site-staging-frontend` en `127.0.0.1:15001->3000` y
`atariki-site-staging-backend` en `127.0.0.1:15002->4000`, sin pisar ningún puerto
de los servicios ya listados (Gitea `3000`/`2222`, Postgres `5432`-`5434`, n8n
`5678`, Plane `80`/`443`/`8000`-etc, Windows `3389`/`8006`).

- [x] **Step 2: Confirmar que Gitea (que también usa el puerto host 3000) sigue
  respondiendo sin interferencia**

Run: `curl -sf http://localhost:3000 -o /dev/null -w '%{http_code}\n'`
Expected: `200` o `30x` (viene de Gitea, no del stack de staging — el frontend de
staging está en `15001`, no en `3000`)

- [x] **Step 3: Confirmar que el volumen de staging es independiente de cualquier
  otro volumen del host**

Run: `docker volume ls | grep blog-data`
Expected: una sola línea, `atariki-site-staging_blog-data-staging` (no existe
`blog-data` a secas en esta máquina, porque prod no corre acá)

---

### Task 5: Instalar y registrar el runner de GitHub Actions para staging

**[El usuario prefirió ejecutar toda esta tarea directamente, con este plan como
guía, en vez de que Claude corra los comandos con `sudo`]**

**Files:**
- `/home/atariki/actions-runner-staging/` (nuevo directorio de instalación del
  runner, fuera del repo)

**Interfaces:**
- Consumes: nada
- Produces: un runner de GitHub Actions activo en esta máquina, con las labels
  `self-hosted, staging`, que es lo que `deploy-staging.yml` necesita para
  ejecutarse acá (`runs-on: [self-hosted, staging]`)

- [ ] **Step 1: Obtener el token de registro [Requiere el usuario]**

Pedirle a Ariel que genere el token desde GitHub: repo → Settings → Actions →
Runners → "New self-hosted runner" → copiar el token que aparece en el comando
`config.sh --url ... --token <TOKEN>` (expira a los 60 minutos, no se puede generar
por API sin un permiso de administración que la sesión actual no tiene garantizado).

- [ ] **Step 2: Descargar e instalar el binario del runner [Ejecutable en sesión]**

```bash
mkdir -p /home/atariki/actions-runner-staging && cd /home/atariki/actions-runner-staging
curl -o actions-runner-linux-x64.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.321.0/actions-runner-linux-x64-2.321.0.tar.gz
tar xzf actions-runner-linux-x64.tar.gz
```

(Confirmar la versión más reciente en la página de releases si `2.321.0` ya no es
la última al momento de ejecutar este paso.)

- [ ] **Step 3: Configurar el runner con las labels correctas [Ejecutable en
  sesión, con el token del Step 1]**

```bash
cd /home/atariki/actions-runner-staging
./config.sh --url https://github.com/atariki-haoa/atariki-site \
  --token <TOKEN-DEL-STEP-1> \
  --name staging-runner \
  --labels staging \
  --work _work
```

`--labels staging` se suma a la label `self-hosted` que el runner trae por
defecto — el resultado final es exactamente `[self-hosted, staging]`, lo que
`deploy-staging.yml` espera.

- [ ] **Step 4: Instalar el runner como servicio y arrancarlo [Ejecutable en
  sesión]**

```bash
cd /home/atariki/actions-runner-staging
sudo ./svc.sh install
sudo ./svc.sh start
sudo ./svc.sh status
```

Expected: `active (running)`

- [ ] **Step 5: Verificar que GitHub ve el runner activo**

```bash
gh api repos/atariki-haoa/atariki-site/actions/runners --jq '.runners[] | {name, status, labels: [.labels[].name]}'
```

Expected: una entrada con `"name": "staging-runner"`, `"status": "online"`, y
`"labels"` incluyendo `"staging"`.

---

### Task 6: Agregar `staging.atariki.dev` al túnel de Cloudflare ya existente

**[Corregido en sesión — no hacía falta crear un túnel nuevo]**

Esta tarea cambió por completo respecto a la versión original del plan. Al revisar
esta máquina se encontró un túnel de Cloudflare ya corriendo (`plane`, usado para
Plane/n8n/Gitea), gestionado por los servicios systemd `cloudflared` y
`cloudflared-plane`, con config en `/home/atariki/.cloudflared/config.yml`. Ese
archivo ya tenía además dos entradas de un trabajo previo (ticket ATA-5) apuntando a
puertos `40001`/`40002` que nunca se habían levantado — se reemplazaron por una sola
entrada, con los puertos reales `15001`/`15002` de esta sesión.

**Files:**
- `/home/atariki/.cloudflared/config.yml` (existente, editado en esta sesión)

**Interfaces:**
- Consumes: el stack de staging respondiendo en `localhost:15001` (Task 3)
- Produces: resolución pública de `staging.atariki.dev` hacia esta máquina

- [x] **Step 1: Ubicar la config y el túnel ya existente [Ejecutable en sesión]**

```bash
ps aux | grep cloudflared
systemctl list-units --all | grep -i cloudflared
```

Resultado: dos procesos `cloudflared --config /home/atariki/.cloudflared/config.yml
tunnel run plane`, gestionados por los servicios systemd `cloudflared` y
`cloudflared-plane` (ambos activos).

- [x] **Step 2: Reemplazar las entradas viejas de ATA-5 por la entrada real
  [Ejecutable en sesión]**

Editar `/home/atariki/.cloudflared/config.yml`: quitar las dos entradas de
`api-staging.atariki.dev`/`staging.atariki.dev` apuntando a `40001`/`40002`, y
agregar una sola, **antes del catch-all final**:

```yaml
ingress:
  # ... entradas existentes de Plane/n8n/Gitea sin tocar ...
  - hostname: staging.atariki.dev
    service: http://localhost:15001
  - service: http_status:404   # catch-all, debe quedar último
```

El backend de staging (`15002`) no se expone acá a propósito (ver Global
Constraints / spec).

- [x] **Step 3: Reiniciar los servicios para aplicar la config [Requiere el
  usuario — requiere `sudo`]**

```bash
sudo systemctl restart cloudflared cloudflared-plane
sudo systemctl status cloudflared cloudflared-plane --no-pager
```

Expected: ambos `active (running)`, sin errores de parseo del YAML en
`journalctl -u cloudflared -n 50`.

- [x] **Step 4: Verificar que el registro DNS de `staging.atariki.dev` existe**

Ya existía de ATA-5 — no hizo falta darlo de alta de nuevo.

- [x] **Step 5: Verificar resolución pública end-to-end**

Run: `curl -sI https://staging.atariki.dev | head -n 1`
Expected: `HTTP/2 200`
Resultado real: `HTTP/2 200`.

---

### Task 7: Verificar el pipeline de CI/CD automático

**[Ejecutable en sesión]**

**Files:**
- Ninguno nuevo — ejercita `.github/workflows/deploy-staging.yml`

**Interfaces:**
- Consumes: todo lo de las tareas 1-6 ya en pie

- [ ] **Step 1: Confirmar que el workflow existe y el runner está disponible**

```bash
gh workflow list --repo atariki-haoa/atariki-site
gh api repos/atariki-haoa/atariki-site/actions/runners --jq '.runners[] | {name, status}'
```

Expected: `Deploy Staging` en la lista de workflows; `staging-runner` con
`"status": "online"`.

- [ ] **Step 2: Hacer un cambio trivial en `dev` y pushearlo**

```bash
cd /home/atariki/codes/atariki-site
git commit --allow-empty -m "chore: trigger staging deploy check"
git push origin dev
```

- [ ] **Step 3: Verificar que el run de `Deploy Staging` corrió en el runner de
  staging y pasó**

```bash
gh run list --repo atariki-haoa/atariki-site --workflow=deploy-staging.yml --limit 1
```

Expected: el run más reciente en estado `completed` / `success`.

- [ ] **Step 4: Verificar que el checkout de staging se actualizó**

Run: `cd /home/atariki/atariki-site-staging && git log -1 --oneline`
Expected: el mismo commit vacío del Step 2 como HEAD.

- [ ] **Step 5: Confirmar que `staging.atariki.dev` sigue respondiendo después del
  redeploy automático**

Run: `curl -sI https://staging.atariki.dev | head -n 1`
Expected: `HTTP/2 200`
