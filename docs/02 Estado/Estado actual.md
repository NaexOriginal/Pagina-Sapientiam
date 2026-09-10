---
tipo: estado
actualizado: 2026-09-10
responsable: Joseph
---

# Estado actual (2026-09-10)

> [!summary] Resumen
> El **layout** y la **página de inicio** están terminados y mergeados en `main`. Faltan **/nosotros** (#3, Ronald) y **/ejercicios** (#4, Joseph) para completar la primera entrega. El vault (#5) se crea con esta nota.

## Issues de GitHub
| # | Tarea | Responsable | Estado |
|---|---|---|---|
| 1 | Layout base: Navbar/Footer | Piedrahita | ✅ Cerrado (PR #6) |
| 2 | Página /inicio | Piedrahita | ✅ Cerrado (PR #8) |
| 7 | Reemplazo del ícono genérico por el logo | Piedrahita | ✅ Cerrado (PR #9) |
| 3 | Página /nosotros | Ronald | 🔴 Abierto (placeholder) |
| 4 | Página /ejercicios (listado + `/:slug`, contenido en markdown) | Joseph | 🟡 Implementado en feature/4-pagina-ejercicios (PR pendiente) |
| 5 | Vault de Obsidian | Joseph | 🟡 En progreso (este vault) |

## Qué funciona
- Layout compartido con Header responsive (hamburguesa en móvil) y Footer con dirección, email y redes.
- `/` completa: Hero, Intro, Stats, Galería (carrusel de 10 fotos) y Práctica.
- Textos centralizados en `src/content/*.json`.
- Logo oficial en Header y Footer.

## Qué falta para la primera entrega
- [ ] `/nosotros` con quiénes somos, historia y contacto (#3)
- [x] `/ejercicios`: listado de los 3 ejercicios y detalle `/ejercicios/:slug`, en markdown dentro de `content/` (#4)
- [ ] Favicon propio (hoy es el de Vite)
- [ ] Página 404
- [ ] Verificar `bun run build` y `lint` en limpio antes de entregar (en `main` al 2026-09-10 ambos pasan: ver abajo)

## Salud del repo
- Historial limpio y lineal por PR. Todo lo mergeado hasta hoy es de Piedrahita.
- No hay tests, CI ni README en la raíz.
- ✅ Finales de línea normalizados con `.gitattributes` (pendiente de llegar a `main`). Ver [[ERR-001 Finales de linea CRLF marcan todo como modificado]].
- ✅ Build y lint verificados sobre `0f242a4` (2026-09-10, Bun 1.4.2 + Node v24.21.0). `bun run lint` pasa con Node, y sin Node pasa `bun run --bun lint`:
  - `bun run build`: OK, 1932 módulos. JS 302 KB (95 KB gzip), CSS 18 KB (4.5 KB gzip).
  - `bun run --bun lint`: 0 hallazgos.
  - El asset más pesado es `2015.webp` (251 KB). Ver [[Deuda tecnica#DT-09]].

Siguiente: [[Pendientes]] · [[Deuda tecnica]] · [[Roadmap]]
