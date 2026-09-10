---
tipo: proyecto
actualizado: 2026-09-10
aliases: [Visión y alcance, Alcance]
---

# Visión y alcance

## Qué es
**Sapientiam** es el Semillero de Investigación en Seguridad Informática de la **ETITC** (Escuela Tecnológica Instituto Técnico Central, Bogotá). Ya existe una web informativa (sapientiam-etitc.org). Este proyecto es la **nueva plataforma**.

## Visión a largo plazo
- Usuarios con cuenta.
- **Retos semanales** ofensivos y defensivos.
- **Sistema de niveles** con títulos según el progreso.
- **Organización de CTFs** (con scoreboard en vivo).

Es un proyecto grande, así que se partió en fases. Ver [[Roadmap]].

## Alcance de la primera entrega
> [!important] Primera entrega ("el primer sábado")
> Solo un **sitio informativo** del semillero más **3 ejercicios básicos** de práctica.
> **Sin backend, sin base de datos y sin usuarios.** Es frontend 100% estático.

Según las fechas del repo, ese sábado sería probablemente el **2026-09-12**. ⚠️ *Confirmar con el equipo.*

Rutas de la entrega:

| Ruta | Issue | Estado |
|---|---|---|
| `/` (inicio) | #2 | ✅ Hecha |
| `/nosotros` | #3 | 🚧 Placeholder |
| `/ejercicios` y `/ejercicios/:slug` | #4 | 🚧 Placeholder |

## Fuera de alcance por ahora
Backend (NestJS), auth, BD (PostgreSQL + Prisma), retos dinámicos, CTFs, hosting definitivo.

Relacionado: [[Arquitectura actual]] · [[DEC-001 Monorepo con frontend estatico primero]]
