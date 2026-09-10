---
tipo: roadmap
actualizado: 2026-09-10
fuente: ARCHITECTURE.md
---

# Roadmap

## Fase 1: Sitio informativo + 3 ejercicios (actual)
Frontend estático, sin backend. Ver [[Vision y alcance]].
- [x] Scaffold Vite + React + TS + Bun
- [x] Layout base (#1)
- [x] Página de inicio (#2)
- [x] Logo oficial (#7)
- [ ] /nosotros (#3)
- [ ] /ejercicios + detalle (#4)
- [ ] Vault de documentación (#5)
- [ ] Hosting (aún sin definir; mantener todo portable/containerizable)

## Fase 2: Backend y usuarios
- `apps/backend` con **NestJS** y arquitectura **hexagonal** (domain / ports / application / infrastructure).
- **PostgreSQL + Prisma**, detrás de puertos de repositorio.
- Auth con Passport/JWT. Rutas protegidas en el frontend (`ProtectedRoute` / loaders).
- `packages/shared-types` para compartir DTOs entre frontend y backend. Bun workspaces.
- Frontend: TanStack Query para datos del servidor y Zustand o Context para la sesión.
- Backend dockerizado desde el inicio.

## Fase 3: Retos semanales y niveles
- Módulo `challenges` + scheduler (`@nestjs/schedule`) para publicar y despublicar retos cada semana.
- Módulo `submissions` y módulo `levels` (progreso y títulos calculados desde las submissions).
- Posibles jobs en segundo plano con BullMQ (ej. levantar contenedores de retos por usuario).

## Fase 4: CTFs
- Módulo `ctf-events`, con scoreboard en vivo vía WebSockets (Gateways de Nest).
- Reutiliza el dominio de challenges/submissions (un reto puede pertenecer a un evento).

## Decisiones abiertas
- Hosting final (VPS vs PaaS: Railway, Render, Fly.io…).
- Prerender para SEO de páginas públicas (solo si hace falta).
- Turborepo: no por ahora.
