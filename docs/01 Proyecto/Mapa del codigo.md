---
tipo: proyecto
actualizado: 2026-09-10
---

# Mapa del código

```
Pagina-Sapientiam/
├── ARCHITECTURE.md          ← diseño completo (fases, backend futuro)
├── docs/                    ← este vault
└── apps/frontend/
    ├── index.html           ← lang="es", título "Sapientiam", favicon.svg
    ├── public/favicon.svg   ← ⚠️ todavía es el logo por defecto de Vite
    ├── vite.config.ts       ← plugins: react + tailwindcss
    ├── .oxlintrc.json
    └── src/
        ├── main.tsx         ← monta RouterProvider en #root
        ├── index.css        ← Tailwind + tokens @theme
        ├── app/router.tsx   ← definición de rutas
        ├── components/layout/
        │   ├── Layout.tsx   ← Header + Outlet + Footer
        │   ├── Header.tsx   ← nav + menú hamburguesa móvil
        │   ├── Footer.tsx   ← marca, dirección, email, redes
        │   └── Brand.tsx    ← logo + nombre (usado en Header y Footer)
        ├── content/
        │   ├── site.json    ← marca y footer
        │   └── home.json    ← textos de todas las secciones de /
        ├── assets/
        │   ├── brand/logo-icon.webp
        │   └── gallery/*.webp   ← 10 fotos de Hacking Days 2015-2019
        └── pages/
            ├── home/HomePage.tsx + sections/{Hero,Intro,Stats,Gallery,Practice}.tsx
            ├── nosotros/NosotrosPage.tsx     ← placeholder (#3)
            └── ejercicios/EjerciciosPage.tsx ← placeholder (#4)
```

## Rutas
| Path | Componente | Notas |
|---|---|---|
| `/` | `HomePage` | Los issues dicen "/inicio", pero la ruta real es `/`. El logo lleva a `/` y no hay link "Inicio" en el nav |
| `/nosotros` | `NosotrosPage` | Placeholder |
| `/ejercicios` | `EjerciciosPage` | Placeholder. Falta `/ejercicios/:slug` |
| *(otra)* | — | No hay 404 ni `errorElement`. Ver [[ERR-002 Rutas inexistentes sin pagina 404]] |

## Patrón de contenido
Cada sección hace `import content from '../../../content/home.json'` y lo castea con `as XxxContent` (la interfaz está definida dentro del mismo componente). El texto **nunca** va hardcodeado en el componente, así lo pidió el issue #2.

**Para editar textos**, cambia el JSON, no el `.tsx`.

## Cómo agregar una foto a la galería
1. Guarda la imagen en `.webp` en `src/assets/gallery/` (idealmente < 100 KB).
2. Agrega `{ "title": "...", "date": "AAAA", "image": "archivo.webp" }` a `gallery.events` en `home.json`.
3. ⚠️ El nombre en `image` tiene que coincidir **exactamente** con el archivo. Si no coincide, la imagen sale rota y no aparece ningún error (se resuelve con `import.meta.glob` por nombre de archivo).

## Secciones de `/`
| Sección | id / ancla | Qué hace |
|---|---|---|
| Hero | `#inicio` | Título por segmentos (`em` = lima itálica, `strong` = cian) + terminal decorativa (solo en `lg`) |
| Intro | `#conoce` | "01 · EL SEMILLERO". El CTA secundario del hero apunta a este ancla |
| Stats | — | 3 cifras (valores fijos en el JSON) |
| Gallery | — | "02 · MEMORIA": carrusel circular que muestra `visibleCount` (3) de 10 fotos |
| Practice | — | "03 · PRÁCTICA": CTA a `/ejercicios` |

## Clases que se repiten
- Contenedor: `mx-auto w-[calc(100%-40px)] sm:w-[min(1180px,calc(100%-72px))]` (en casi todas las secciones, Header y Footer)
- Encabezado de sección: número + línea + label en `font-mono text-[11px] tracking-[0.12em] text-lime`
- CTA primario: `bg-lime px-5 py-4 font-mono text-xs ... text-background`

Si haces una página nueva, **copia estos patrones** para que se vea igual. Ver [[Deuda tecnica#DT-03]].
