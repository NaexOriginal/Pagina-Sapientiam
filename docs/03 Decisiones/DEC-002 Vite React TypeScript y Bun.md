---
tipo: decision
id: DEC-002
estado: aceptada
fecha: 2026-09-06
responsable: Piedrahita
---

# DEC-002 Vite + React + TypeScript con Bun

## Decisión
- SPA con **Vite + React + TypeScript**, Bun como package manager y runtime de scripts.
- **React Router** para el ruteo (`createBrowserRouter`). Hoy se usa la **v8** aunque el doc dice v7 (P-09).
- Sin SSR: igual que TryHackMe/HackTheBox. El SEO no es prioridad (la audiencia es la comunidad ETITC). Si hace falta, se agrega prerender solo para las rutas públicas.

## Alternativas descartadas
- SSR/Next.js: no hace falta por ahora y complica el hosting.

## Consecuencias
- Usar `bun` siempre (hay `bun.lock`).
- Hosting estático con fallback SPA a `index.html` (P-14).

Relacionado: [[Stack y comandos]]
