---
tipo: persona
github: Josephqaz
actualizado: 2026-09-10
---

# Joseph

- **GitHub:** `Josephqaz`
- **Rol:** página /ejercicios y vault de documentación.

## Tareas actuales
- [ ] #5 Vault de Obsidian: creado en `docs/`. Falta abrir el PR
- [x] #4 Página /ejercicios: listado + `/ejercicios/:slug`, 3 ejercicios en markdown dentro de `content/`
  - Crear `src/features/exercises/{api,components,types}` según [[Arquitectura actual]]
  - Decidir cómo renderizar markdown y registrarlo como DEC
  - Al terminar: actualizar el stat "03" (P-11)
- [x] Arreglar los finales de línea de mi clon: [[ERR-001 Finales de linea CRLF marcan todo como modificado]]
- [x] Instalar Bun en WSL

## Entorno
- Windows + WSL (Kali), shell bash, repo en `~/semillero/Pagina-Sapientiam`, rama local `Joseph`.
- Bun 1.4.2 en `~/.bun/bin` (agregado al PATH en `~/.bashrc`).
- Node v24.21.0 LTS (npm 11.19.0) con **nvm v0.40.7** en `~/.nvm` (cargado en `~/.bashrc`, alias `default → lts/*`).
- ⚠️ Windows también tiene Node (`/mnt/c/Program Files/nodejs`), que entra al PATH por la interoperabilidad de WSL. Con nvm cargado gana el de Linux. Si `which node` apunta a `/mnt/c/...`, falta cargar nvm (`source ~/.bashrc`).
- `git config core.autocrlf input` en este clon.

## Notas
*(espacio personal)*

## Bitácora
- [[2026-09-10]]: análisis inicial y creación del vault
