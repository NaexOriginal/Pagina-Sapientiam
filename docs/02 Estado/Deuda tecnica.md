---
tipo: deuda-tecnica
actualizado: 2026-09-10
aliases: [Deuda técnica, Hallazgos del análisis]
---

# Deuda técnica

Hallazgos de la revisión completa del código del 2026-09-10 (commit `0f242a4`). Nada de esto rompe la app hoy. Son cosas para mejorar sin apuro, y algunas conviene resolverlas antes de la entrega (marcadas 🔥).
Agrega nuevas al final con el siguiente `DT-##`.

## DT-01
🔥 **Favicon por defecto de Vite.** `public/favicon.svg` es el rayo morado de Vite. Se ve en la pestaña del navegador. → [[Pendientes|P-05]]

## DT-02
**Sin página 404.** El router no tiene ruta `*` ni `errorElement`. → [[ERR-002 Rutas inexistentes sin pagina 404]]

## DT-03
**Clases repetidas.** El contenedor `mx-auto w-[calc(100%-40px)] sm:w-[min(1180px,calc(100%-72px))]` aparece en ~10 lugares, y el encabezado "número · línea · label" está copiado en Intro, Gallery y Practice. Si cambia el ancho del sitio hay que tocar todos los archivos. Opción: un componente `Container` y un `SectionHeading` en `components/`, o un `@utility` en `index.css`. *No es urgente; mejor hacerlo cuando haya una 3.ª página que lo necesite.*

## DT-04
**Tipos del contenido con `as`.** Cada sección castea el JSON (`content.hero as HeroContent`). Si alguien escribe mal una clave en el JSON, TypeScript no avisa y el texto sale vacío. Opción: usar `satisfies` o mover los tipos a `features/*/types`.

## DT-05
**Estructura planeada vs. real.** `features/`, `lib/` y `app/providers.tsx` todavía no existen. #4 es buen momento para crear `features/exercises/` (ver [[Arquitectura actual#Principio clave para los ejercicios]]).

## DT-06
**Tipografías.** `font-serif` y `font-mono` usan las fuentes por defecto de cada sistema operativo, así que el diseño se ve distinto en Windows, macOS y Linux. Si hay una tipografía de marca, habría que cargarla (self-hosted en `assets/` mejor que Google Fonts). → P-12

## DT-07
**Redes sociales del footer.** Apuntan a `facebook.com/etitc`, `x.com/etitc`, etc. (cuentas institucionales). Si el semillero tiene cuentas propias, cambiarlas en `site.json`. → P-10

## DT-08
**Stats fijos.** "03 ejercicios para comenzar" está escrito a mano en `home.json`. Si se agregan ejercicios, queda desactualizado. → P-11

## DT-09
**Galería.**
- Las `<img>` no tienen `loading="lazy"` ni `width`/`height`, lo que puede causar saltos de layout (CLS).
- `2015.webp` pesa 248 KB (el resto < 110 KB). Conviene recomprimirla.
- `key={index}` en las figuras. El `alt` se repite en fotos del mismo evento.
- Al cambiar de slide no se anuncia nada a lectores de pantalla (`aria-live`).

## DT-10
**Accesibilidad del Header.** El botón hamburguesa no tiene `aria-controls` y el menú no se cierra con `Escape`. El `<nav>` no está envuelto en un `<header>`. `HomePage` no usa `<main>` (Nosotros y Ejercicios sí), así que los landmarks no son consistentes.

## DT-11
**Ruta `/inicio` vs `/`.** Los issues #1 y #2 hablan de `/inicio`, pero la app usa `/` y el nav no tiene link "Inicio" (se llega por el logo). Decidir si se agrega una redirección `/inicio → /` o si se deja así, y documentarlo.

## DT-12
**Documentación desactualizada.** `ARCHITECTURE.md` dice React Router v7 y sugiere Biome, pero hoy se usa v8 y oxlint. → P-09

## DT-13
**Sin README, tests ni CI.** Previsto para más adelante en ARCHITECTURE.md. → P-07, P-13
