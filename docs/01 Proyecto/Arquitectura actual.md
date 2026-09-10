---
tipo: proyecto
actualizado: 2026-09-10
fuente: ARCHITECTURE.md + revisión del código
---

# Arquitectura actual

El documento de diseño completo está en `ARCHITECTURE.md`, en la raíz del repo. Esta nota compara **lo planeado** con **lo que existe hoy** en el código (revisado el 2026-09-10).

## Planeado vs. real

| Pieza | Planeado (ARCHITECTURE.md) | Real hoy |
|---|---|---|
| Monorepo | `apps/frontend`, `apps/backend`, `packages/shared-types` con Bun workspaces | Solo existe `apps/frontend`. No hay `package.json` raíz ni workspaces |
| Frontend | Vite + React + TS + Bun | ✅ Vite 8, React 19, TS 6, Bun |
| Router | React Router **v7** | React Router **^8.3.1** (el doc quedó desactualizado) |
| Estilos | Tailwind CSS | ✅ Tailwind v4 vía `@tailwindcss/vite`, tokens en `@theme` |
| Lint | Biome (sugerido) | **oxlint** (`.oxlintrc.json`) |
| `src/app/` | `router.tsx` + `providers.tsx` | Solo `router.tsx` (todavía no hay providers) |
| `src/features/<dominio>/api` | Único lugar que sabe de dónde vienen los datos | ❌ No existe. Las secciones importan el JSON directo |
| `src/lib/` | Utilidades | ❌ No existe |
| `src/content/` | Info + ejercicios (MD/JSON) | ✅ `home.json`, `site.json`. Aún no hay ejercicios |
| Testing | Vitest + RTL (futuro) | Nada |
| CI | Lint + build en PRs (futuro) | Nada |
| Backend | NestJS hexagonal (fase futura) | Nada (esperado) |

## Principio clave para los ejercicios
> `features/exercises/api` debería ser la única capa que lee `content/`. Cuando exista el backend, solo cambia esa capa (fetch a NestJS) y `pages/` y `components/` no se tocan.

Conviene que #4 cree `src/features/exercises/` siguiendo esto. Es el primer feature real y deja el patrón para lo que venga después.

## Flujo de renderizado
```
index.html → main.tsx → RouterProvider(router)
                         └─ Layout (Header + <Outlet/> + Footer)
                              ├─ /           → HomePage (Hero, Intro, Stats, Gallery, Practice)
                              ├─ /nosotros   → NosotrosPage (placeholder)
                              └─ /ejercicios → EjerciciosPage (placeholder)
```

Detalle archivo por archivo en [[Mapa del codigo]]. Discrepancias pendientes en [[Deuda tecnica]].
