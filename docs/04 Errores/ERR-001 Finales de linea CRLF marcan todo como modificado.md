---
tipo: error
id: ERR-001
estado: resuelto
severidad: media
reportado_por: Joseph
fecha: 2026-09-10
---

# ERR-001 Finales de línea CRLF marcan todo como modificado

## Síntoma
En el clon de Joseph (WSL, `~/semillero/Pagina-Sapientiam`), `git status` muestra los **27 archivos del repo como modificados** sin que nadie los haya tocado. `git diff --stat` da 1141 inserciones y 1141 borrados.

## Diagnóstico
```bash
git diff --ignore-cr-at-eol --stat   # → vacío: no hay cambios reales
git ls-files --eol                   # → i/lf  w/crlf  en todos los archivos
```
En el repo (index) los archivos están en **LF**, pero en el disco quedaron en **CRLF**. Lo más probable es que los archivos pasaran por Windows (Explorer, un editor o un clon con `core.autocrlf=true`) antes de llegar a WSL. `core.autocrlf` no está configurado en WSL.

## Riesgo
Si alguien hace `git add .` y commitea, el diff de ese commit reescribe **todas** las líneas de todos los archivos, lo que genera conflictos con el trabajo de los demás y ensucia el historial.

## Solución propuesta
1. **Para todo el equipo:** agregar `.gitattributes` en la raíz:
   ```
   * text=auto eol=lf
   *.webp binary
   *.png binary
   *.jpg binary
   ```
2. **Para el clon afectado** (sin cambios propios pendientes):
   ```bash
   git config core.autocrlf input
   git stash list   # confirmar que no hay nada que perder
   git checkout -- .   # restaura los archivos en LF
   ```
3. No commitear hasta que `git status` salga limpio.

→ [[Pendientes|P-04]]

## Solución aplicada (2026-09-10)
- Se agregó `.gitattributes` en la raíz (`* text=auto eol=lf` más la lista de binarios).
- En el clon de Joseph: `git config core.autocrlf input`.
- ⚠️ `git checkout -- <archivo>` **no alcanza**. Con el `.gitattributes`, git ya considera "sin cambios" los archivos en CRLF y no los reescribe. Hay que borrarlos y volver a sacarlos del repo:
  ```bash
  git ls-files --eol | grep 'w/crlf' | cut -f2 | while IFS= read -r f; do rm -- "$f" && git checkout -- "$f"; done
  ```
  (Antes, revisa `git diff --ignore-cr-at-eol --name-only`: si algún archivo tiene cambios reales, conviértelo con `sed -i 's/\r$//' archivo` en vez de borrarlo, como se hizo con `.gitignore`.)
- Verificación: `git ls-files --eol` → los 27 archivos de texto quedan en `i/lf w/lf`, y `git status` solo muestra cambios reales.

**Para los demás:** cuando el `.gitattributes` llegue a `main` y hagan pull, si les aparecen archivos modificados sin haberlos tocado, apliquen el mismo procedimiento.

## Registro
- 2026-09-10: detectado durante el análisis inicial del proyecto (Joseph).
- 2026-09-10: resuelto en el clon de Joseph y `.gitattributes` agregado (Joseph).
