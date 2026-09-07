# Arquitectura — Sapientiam (semillero ETITC)

## Contexto
Sapientiam (semillero de seguridad de la ETITC) ya tiene una web informativa (sapientiam-etitc.org). El objetivo a largo plazo es manejar un sistema usuarios con cuenta, retos semanales (ofensivos/defensivos), sistema de niveles con títulos, y organización de CTFs. Es un proyecto grande, así que se decidió partirlo en fases.

**Entregable del primer sábado**: solo un sitio informativo del semillero + 3 ejercicios básicos de práctica, **sin backend, sin base de datos, sin usuarios**. El backend/hexagonal es diseño para las fases siguientes, no para esta primera entrega.

Decisiones ya confirmadas:
- Monorepo (frontend + backend en el mismo repo).
- Frontend en **Vite + React + TypeScript**, gestionado con **Bun**.
- Hosting aún no definido → mantener todo portable/containerizable.
- Primera entrega: **frontend 100% estático**, sin backend corriendo.

## Frontend: Vite + React + TS + Bun

- **Vite + React + TypeScript**, usando Bun como package manager y runtime de scripts (`bun install`, `bun run dev/build`).
- **React Router** (v7) para el ruteo — páginas informativas + rutas de los ejercicios, y más adelante rutas protegidas del dashboard/retos/perfil cuando exista login.
- SPA pura, igual que el estilo real de TryHackMe/HackTheBox (ambos son SPAs detrás de login, no sitios SSR).
- SEO: el sitio no tiene requisitos fuertes de SEO temporalmente (la audiencia es la comunidad ETITC, no tráfico de búsqueda masivo). Si más adelante se necesita mejor indexación para las páginas públicas, se puede añadir un paso de prerender (ej. `vite-plugin-prerender` o un prerender manual con Puppeteer solo para las rutas públicas) sin cambiar el resto de la app — no se resuelve ahora para no sobre-diseñar.

Para la primera entrega: contenido informativo como componentes/rutas de React, y los 3 ejercicios como contenido local (Markdown/JSON en una carpeta `content/`, parseado en build time o cargado como módulos estáticos de Vite) renderizado en rutas dinámicas — sin ningún backend.

### Boceto de estructura (dentro de `apps/frontend`)
```
src/
  app/                     <- shell de la app: setup de React Router, providers globales, layout base
    router.tsx
    providers.tsx
  pages/                   <- componentes de ruta (1:1 con URLs): home, about, exercises/, exercises/:slug
  features/                <- lógica de negocio de frontend agrupada por dominio, en espejo con los módulos del backend (users, challenges, submissions, levels...)
    exercises/
      components/          <- UI específica de este feature
      hooks/                <- lógica/estado propio del feature
      api/                  <- acceso a datos: hoy lee `content/` local, mañana llama al backend NestJS (mismo contrato, cambia la implementación)
      types/
    auth/                  <- (futuro) login, sesión
    levels/                <- (futuro) progreso, títulos
  components/              <- UI genérica/reutilizable (botones, cards, layout), sin lógica de negocio
  content/                 <- contenido estático de la primera entrega: info del semillero + los 3 ejercicios (Markdown/JSON)
  lib/                     <- utilidades transversales (fetcher, formatters, config)
  main.tsx
```
Idea central: `features/<dominio>/api` es el único lugar que sabe *de dónde* vienen los datos. La primera entrega lee de `content/` local; cuando exista el backend, ese mismo módulo cambia a hacer `fetch`/React Query contra NestJS sin tocar `pages/` ni `components/` — el mismo principio de "cambiar el adaptador, no el resto" que se usa en el backend hexagonal, aplicado al frontend.

### Otras piezas recomendadas (frontend)
- **Estilos**: Tailwind CSS — utility-first, bundle final pequeño (purga clases no usadas), encaja con la prioridad de mantener el frontend ligero.
- **Estado de servidor futuro**: TanStack Query (React Query) para cuando existan llamadas al backend (cache, refetch, loading states) — no hace falta para la primera entrega (contenido estático).
- **Estado de UI/sesión futuro**: Context API o Zustand (algo ligero) para auth/sesión — evitar Redux.
- **Testing futuro**: Vitest + React Testing Library (Vitest se integra directo con Vite, sin config adicional).

## Backend (para fases futuras): NestJS + TypeScript

Dado que el proyecto requiere un crecimiento para actualizaciones de mayor implementación, ya se decidió TS en el frontend, se recomienda **NestJS** en vez de Express/Fastify a mano o un lenguaje distinto (Go/Java/Python), porque:
- Sus módulos + inyección de dependencias encajan de forma natural con arquitectura hexagonal (cada módulo = un contexto acotado: `users`, `challenges`, `submissions`, `ctf-events`, `leaderboard`).
- TypeScript de punta a punta permite compartir DTOs/tipos entre frontend y backend vía un paquete `packages/shared-types` en el monorepo.
- Su ecosistema cubre lo que ya está en el roadmap: Passport/JWT (auth + niveles), Prisma/TypeORM detrás de puertos de repositorio, BullMQ (jobs en segundo plano, ej. levantar contenedores de retos por usuario), Gateways/WebSockets (marcador en vivo para CTFs).
- Como el hosting aún no está definido, se recomienda dejar el backend dockerizado desde el inicio para poder moverlo entre VPS, Railway, Render, Fly.io, etc. sin rehacer nada.

### Boceto de estructura hexagonal (dentro de `apps/backend`)
```
src/
  <contexto>/              (ej. challenges)
    domain/                <- entidades, value objects, reglas de negocio (sin dependencias de framework)
    ports/                 <- interfaces: ChallengeRepository, NotificationPort, etc.
    application/           <- casos de uso/servicios que orquestan el dominio a través de los puertos
    infrastructure/
      http/                <- controllers de Nest (adaptador de entrada)
      persistence/         <- repositorio Prisma/TypeORM que implementa el puerto (adaptador de salida)
  shared/                  <- auth, config, logging transversales
```
Beneficio clave para el roadmap: cuando llegue el momento de tener retos "reales" antes de tener base de datos definitiva, se puede implementar `ChallengeRepository` con un adaptador en memoria o basado en JSON; al migrar a Postgres solo se cambia el adaptador de `infrastructure/persistence`, sin tocar dominio/aplicación/controllers.

### Persistencia futura
PostgreSQL + Prisma (mejor inferencia de tipos TS y migraciones más simples que TypeORM).

## Monorepo y tooling
- Bun workspaces: `apps/frontend`, `apps/backend`, `packages/shared-types`.
- Turborepo: no de entrada — evitar tooling prematuro; reconsiderar si el build/test se vuelve pesado.
- Lint/format compartido en la raíz — Biome es buena opción para mantener consistencia con Bun por velocidad.
- CI (GitHub Actions u otro) para lint+build en PRs, una vez el repo esté en git/GitHub.

## Cómo esto encaja con las fases futuras
- **Auth + niveles/títulos**: Guards de Nest + módulo `levels` que calcula progreso desde `submissions`; el frontend protege rutas con un wrapper/guard de React Router (ej. loader o componente `ProtectedRoute`) revisando sesión/JWT.
- **Actividades semanales**: módulo `challenges` + scheduler (`@nestjs/schedule` o cron) para publicar/despublicar contenido cada semana.
- **CTFs**: módulo `ctf-events` separado, posible gateway de WebSockets para scoreboard; puede reusar el dominio de challenges/submissions si desde el inicio se modela un reto como perteneciente opcionalmente a un "evento".

## Alcance concreto de la primera entrega
Solo `apps/frontend` (Vite + React + TS): contenido informativo del semillero + 3 ejercicios como contenido estático, sin backend, sin BD, sin auth. Se puede dejar ya el esqueleto de carpetas del monorepo (`apps/backend` vacío) para que la estructura esté lista para crecer, pero no se implementa lógica de backend todavía.

## Pendientes a resolver más adelante (no bloquean esta fase)
- Definir hosting final (VPS vs. PaaS) — mientras tanto, mantener frontend y backend desplegables de forma independiente.