---
tipo: proyecto
actualizado: 2026-09-10
---

# Flujo de trabajo

## Repositorio
- Remoto: `github.com/NaexOriginal/Pagina-Sapientiam` (dueño: Piedrahita)
- Rama principal: `main`

## Ciclo de una tarea (así se ha trabajado hasta ahora)
1. **Issue** en GitHub, numerado y con título `N. Descripción`, labels (`frontend`, `docs`, `route:<ruta>`), un responsable asignado y criterios de aceptación.
2. **Rama** desde `main`: `feature/<n>-<slug>` (ej. `feature/1-layout-base`, `feature/2-pagina-inicio`).
3. **Commits** pequeños, en español, con prefijo tipo *conventional commits*:
   - `feat:` funcionalidad · `fix:` bug · `style:` visual/formato · `docs:` documentación · `refactor:` · `chore:`
4. **PR** hacia `main` que referencia el issue (`Closes #N`), con `bun run lint && bun run build` en verde.
5. **Merge commit** (no squash) → mensaje `merge: ...`.
6. Registrar en [[Historial de cambios]] y actualizar [[Pendientes]].

> [!note] Inconsistencia menor
> La rama `feature/logo-y-contacto-footer` (PR #9) no lleva número de issue. Propuesta: siempre `feature/<issue>-<slug>`.

## Reglas del vault
- **Nombres de archivo** sin tildes ni `ñ` (usa `aliases` en el frontmatter para el nombre bonito).
- **Frontmatter** mínimo en cada nota: `tipo`, `fecha` o `actualizado`, `responsable` si aplica, `estado` si aplica.
- **IDs**: `DEC-###` para decisiones, `ERR-###` para errores, `P-##` para pendientes, `DT-##` para deuda técnica. Toma el siguiente número libre del índice. Si dos personas usan el mismo número a la vez, la que mergea después renumera.
- **Bitácora personal**: `Equipo/<Nombre>/Bitacora/AAAA-MM-DD.md` con la plantilla *Bitacora diaria*.
- **Actas**: `05 Reuniones/AAAA-MM-DD Tema.md` con la plantilla *Acta de reunion*.
- El vault se versiona con el código: los cambios del vault pueden ir en el mismo PR de la tarea (así la documentación viaja con el cambio) o en PRs `docs:` aparte.
- `.obsidian/` y `.trash/` están en `.gitignore`.

## Cuándo escribir qué
| Pasó esto… | …registra en |
|---|---|
| Terminé o avancé algo | Mi bitácora del día y, si se mergeó, [[Historial de cambios]] |
| Encontré un bug o algo raro | Nota `ERR-###` en `04 Errores` y fila en [[Errores]] |
| Elegimos una librería, patrón o convención | Nota `DEC-###` en `03 Decisiones` |
| Algo queda por hacer | Fila en [[Pendientes]] (y, si es grande, un issue en GitHub) |
| Algo funciona pero está mal hecho | Entrada en [[Deuda tecnica]] |
| Nos reunimos | Acta en `05 Reuniones` |
