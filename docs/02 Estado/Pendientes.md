---
tipo: pendientes
actualizado: 2026-09-10
---

# Pendientes

Estados: `abierto` · `en progreso` · `bloqueado` · `hecho`. Prioridad: `alta` (bloquea la entrega) · `media` · `baja`.
Agrega filas **al final** con el siguiente `P-##`. Cuando algo se termine, cambia el estado a `hecho` en vez de borrar la fila.

| ID | Tarea | Responsable | Prioridad | Estado | Origen |
|---|---|---|---|---|---|
| P-01 | `/ejercicios`: listado + detalle `/ejercicios/:slug`, 3 ejercicios en markdown dentro de `content/`, idealmente vía `features/exercises/api`. Diseño: [[2026-09-10 Diseno pagina ejercicios]] | Joseph | alta | en progreso | #4 |
| P-02 | `/nosotros`: integrantes, historia breve, contacto, con contenido en `content/` | Ronald | alta | abierto | #3 |
| P-03 | Vault de Obsidian + `.obsidian/` en `.gitignore` → abrir PR y cerrar #5 | Joseph | media | en progreso | #5 |
| P-04 | Normalizar finales de línea (`.gitattributes`) | Joseph | media | hecho | [[ERR-001 Finales de linea CRLF marcan todo como modificado]] |
| P-05 | Reemplazar `public/favicon.svg` (logo de Vite) por el logo del semillero | sin asignar | media | abierto | [[Deuda tecnica#DT-01]] |
| P-06 | Página 404 / `errorElement` en el router | sin asignar | media | abierto | [[ERR-002 Rutas inexistentes sin pagina 404]] |
| P-07 | README en la raíz: qué es y cómo correrlo | sin asignar | media | abierto | Análisis 2026-09-10 |
| P-08 | Confirmar la fecha exacta de la primera entrega | todos | alta | abierto | [[Vision y alcance]] |
| P-09 | Actualizar `ARCHITECTURE.md`: React Router v8 (no v7), oxlint (no Biome) | sin asignar | baja | abierto | [[Arquitectura actual]] |
| P-10 | Confirmar redes del footer: hoy apuntan a las cuentas de la **ETITC**, no a las del semillero | Piedrahita | baja | abierto | [[Deuda tecnica#DT-07]] |
| P-11 | Stat "03 ejercicios" hardcodeado → derivarlo del número real de ejercicios cuando exista #4 | Joseph | baja | abierto | [[Deuda tecnica#DT-08]] |
| P-12 | Decidir tipografías (hoy se usan las serif/mono por defecto del sistema) | sin asignar | baja | abierto | [[Deuda tecnica#DT-06]] |
| P-13 | CI con GitHub Actions: lint + build en cada PR | sin asignar | baja | abierto | ARCHITECTURE.md |
| P-14 | Definir hosting (VPS vs PaaS) y fallback SPA (rewrite a `index.html`) | todos | baja | abierto | ARCHITECTURE.md |
| P-15 | Confirmar el usuario de GitHub de Ronald (¿`solutionsdevelopm-byte`?) | Ronald | baja | abierto | [[Equipo]] |
