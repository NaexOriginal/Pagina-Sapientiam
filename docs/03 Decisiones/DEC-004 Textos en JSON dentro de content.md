---
tipo: decision
id: DEC-004
estado: aceptada
fecha: 2026-09-07
responsable: Piedrahita
---

# DEC-004 Textos en JSON dentro de `content/`

## Contexto
El issue #2 pide: *"Contenido en content/ (markdown/json), no hardcodeado en el componente."* Lo mismo se pide para #3 y #4.

## Decisión
- Los textos de cada página van en `src/content/<pagina>.json`. `site.json` guarda lo global (marca y footer).
- Los componentes importan el JSON y lo tipan con una interfaz local.
- Para los ejercicios (#4), el issue pide **markdown** en `content/`.

## Consecuencias
- Cambiar un texto no requiere tocar JSX.
- Los tipos se aplican con `as`, sin validación real ([[Deuda tecnica#DT-04]]).
- Para renderizar markdown en #4 hará falta decidir cómo (import `?raw` de Vite + un parser como `react-markdown`, o `import.meta.glob`). Registrar esa decisión como DEC nueva.
