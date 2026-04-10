# pr-prep

Verifica que la rama esté lista para abrir un Pull Request.

## Checks

1. **Nombre de rama** — no es `master`/`main`
2. **Cambios sin commitear** — `git status` limpio
3. **Conflictos con master** — `git merge --no-commit --no-ff master` (abortar si falla)
4. **Build** — `npm run build` sin errores
5. **Lint** — `npm run lint` sin errores

## Output esperado

Checklist markdown con ✅/❌ por cada check. Si alguno falla, describir qué hay que resolver.

## Restricciones

- No corrige problemas; solo reporta.
- No hace commits ni push.
