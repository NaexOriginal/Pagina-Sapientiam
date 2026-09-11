---
tipo: decision
id: DEC-005
estado: aceptada
fecha: 2026-09-10
responsable: Joseph
issue: 5
---

# DEC-005 Vault de Obsidian dentro del repo

## Contexto
El issue #5 pide una carpeta de documentación del equipo dentro del repo (actas, decisiones, notas de arquitectura), con `.obsidian/` en `.gitignore`. Somos 3 personas editando al mismo tiempo.

## Decisión
- El vault es la carpeta **`docs/`** del repo, así viaja con el código y se sincroniza con git.
- `.obsidian/` y `.trash/` no se versionan. Cada quien configura su Obsidian.
- Para evitar conflictos de merge:
  - **una entrada = un archivo** (DEC, ERR, actas, bitácoras),
  - **carpetas personales** en `Equipo/<Nombre>/`, que solo edita su dueño,
  - las tablas compartidas solo crecen agregando filas al final.
- Nombres de archivo sin tildes, con `aliases` para el nombre con tildes.
- Sin plugins de comunidad obligatorios (sin Dataview): todo se lee bien en Obsidian, GitHub o VS Code.

## Alternativas descartadas
- Vault fuera del repo (Obsidian Sync / Drive): cuesta dinero o se desincroniza del código.
- Wiki de GitHub: no se revisa en PRs ni queda junto al cambio.

Relacionado: [[Flujo de trabajo#Reglas del vault]] · [[00 Inicio]]
