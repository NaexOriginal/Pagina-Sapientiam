---
tipo: error
id: ERR-002
estado: abierto
severidad: baja
reportado_por: Joseph
fecha: 2026-09-10
---

# ERR-002 Rutas inexistentes sin página 404

## Síntoma (esperado según el código, ⚠️ no verificado en navegador)
Si entras a una URL que no existe (ej. `/ejercicios/xss` antes de #4, o `/inicio`), React Router muestra su pantalla de error por defecto ("Unexpected Application Error! 404 Not Found"), sin el Header ni el Footer del sitio.

## Causa
`src/app/router.tsx` no define una ruta comodín (`path: '*'`) ni un `errorElement` en la ruta del `Layout`.

## Solución propuesta
- Crear `pages/not-found/NotFoundPage.tsx` con el mismo estilo del sitio.
- Registrar `{ path: '*', element: <NotFoundPage /> }` dentro de los `children` del Layout, y opcionalmente un `errorElement` para errores de render.
- Considerar `/inicio → /` ([[Deuda tecnica#DT-11]]).
- En producción, el hosting debe hacer rewrite de todas las rutas a `index.html` (P-14). Si no, recargar `/nosotros` da un 404 del servidor.

→ [[Pendientes|P-06]]
