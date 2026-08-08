---
shaping: true
---

# Separar Frontend y Backend en dos subproyectos — Frame

## Source

> Me gustaria iterar un poco mas la idea aca: actualmente no tenemos un "backend" como tal en el sitio entonces?

> Ya perfecto, quizas me gustaria pasar ese server.js a una estructura con typescript + express mas robusta. Quizas necesitemos hacer un refactor del sitio para separar el frontend y el backend en dos carpetas distintas, teniendo como 2 subproyectos dentro de este proyecto grande

> Claro lo q pasa es q mi idea es tener el frontend con nextjs totalmente separado, con su propia api y etc y tener una segunda api, que seria el backend real, donde la api del frontend se comunioca y esta segunda api es la que hace la logica de backend realmente

> Hagamos el punto 1, creo que vale la pena shapear antes

## Problem

El sitio no tiene hoy un backend independiente. `server.js` es Express plano (CommonJS) envolviendo Next.js, y toda la lógica de servidor — SQLite vía `src/server/`, las API routes en `src/pages/api/` — corre dentro del mismo proceso y del mismo deploy que el frontend.

Esto se volvió un problema concreto al construir el sistema de blog con ingesta vía MCP (`docs/shaping/blog-system.md`). ATA-2 (V1: storage SQLite + páginas públicas `/blog`) ya está en `dev`. Al planificar ATA-3 (V2: servidor MCP exponiendo `publish_post`), quedó claro que `/mcp` no es como el resto de las rutas del sitio: no lo llama el propio frontend para renderizar algo, lo llama un cliente externo (Claude.ai) que quiere ejecutar lógica de negocio directamente. Hoy no hay un lugar natural para esa lógica que no sea "adentro del mismo proceso de Next.js", y páginas como `/blog` ya acoplan su render server-side directo a `postsRepo` (`getServerSideProps` → `postsRepo.list()` en el mismo proceso), sin ninguna frontera real entre "lo que necesita el frontend para pintar una página" y "lo que necesita un sistema externo para ejecutar una acción".

## Outcome

Una frontera clara y real entre frontend y backend, tal que la lógica de backend (acceso a datos, reglas de negocio, y cualquier API pensada para clientes que no son las propias páginas del sitio — como el futuro servidor MCP) se pueda construir, razonar y potencialmente desplegar de forma independiente del frontend de Next.js — sin asumir más complejidad operacional de la que un sitio de portfolio personal, de un solo desarrollador, puede justificar hoy.
