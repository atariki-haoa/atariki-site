---
shaping: true
---

# Sistema de Blog con Ingesta de Notas y Revisión LLM — Frame

## Source

> Creo que me gustaria cambiar esto: mi idea es exportar notas de audio que haga tanto en ingles como en español, desde mi telefono con mi aplicacion de google de recorder (que hace las transcripciones) y que puedo compartirlas o subirlas posteriormente. Creo que lo mejor seria tener una parte donde pueda subir esto, que mediante api de algun LLM lo revise. Quizas ocupar el mismo gemini? no se que sea mas conveniente en este caso, creo que hay que explorarlo.
>
> Mi output final de todo es tener un sistema de blog donde la nota la pueda subir, escrita, quede bien formateada, con una revision buena (yo no soy hablante ingles nativo, seria bueno iterar esa parte tambien para tener un buen feedback de la correcion y mejorar mi nivel de ingles) y que esta se suba como una entrada de blog con fecha y en un formato tipo .md para descargar si es necesario.
>
> Considerar tambien que estas entradas no son solamente entradas de una conversacion, a veces pueden ser guias, pueden tener referencias a links externos, etc. A veces puede que suba conocimiento mio nada mas.

> **Nota (evolución durante el shaping):** la idea original de grabar con Google Recorder y subir la transcripción se reemplazó por conversar directamente con Claude.ai — ver Shape A en el [shaping doc](./blog-system.md). El Source de arriba se conserva verbatim como registro histórico de la idea inicial.

## Problem

El usuario quiere producir entradas de blog bien formateadas y revisadas a partir de notas propias, conversando directamente con Claude.ai (incluida la app de teléfono). Hoy no tiene una forma de convertir esas conversaciones (u otro texto/conocimiento propio) en entradas de blog publicadas: bien formateadas, revisadas y con fecha.

Como no es hablante nativo de inglés, una corrección silenciosa no es suficiente — necesita entender *qué* se corrigió y *por qué*, para ir mejorando su nivel real de inglés con cada entrada que publica.

Además, el contenido de origen no es homogéneo: a veces nace de una conversación hablada con el asistente, a veces es una guía técnica con referencias a links externos, y a veces es simplemente conocimiento propio escrito directamente.

## Outcome

- Conversa con Claude.ai (vía una Skill dedicada) para redactar y corregir el contenido de una entrada, incluso desde el teléfono.
- Si el contenido está en inglés, recibe feedback explicativo de las correcciones aplicadas (no solo el texto corregido), como ayuda para mejorar su nivel de inglés.
- Cuando confirma en el chat, la entrada se publica con fecha en el blog.
- La entrada queda disponible también como archivo `.md` descargable.
- El sistema admite distintos tipos de entrada: conversación, guía con referencias externas, o nota de conocimiento propio.
