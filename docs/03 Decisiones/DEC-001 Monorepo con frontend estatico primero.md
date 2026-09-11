---
tipo: decision
id: DEC-001
estado: aceptada
fecha: 2026-09-06
responsable: Piedrahita
---

# DEC-001 Monorepo con frontend estático primero

## Contexto
La visión completa (usuarios, retos semanales, niveles, CTFs) es grande y la primera entrega es en días.

## Decisión
- **Monorepo**: frontend y backend en el mismo repo (`apps/frontend`, `apps/backend`, `packages/shared-types`).
- **Primera entrega 100% estática**: sitio informativo + 3 ejercicios. Sin backend, BD ni usuarios.
- Hosting sin definir, así que todo tiene que ser portable/containerizable.

## Consecuencias
- Por ahora solo existe `apps/frontend`.
- El diseño del backend (NestJS hexagonal) queda documentado en `ARCHITECTURE.md` para fases futuras. Ver [[Roadmap]].

Fuente: `ARCHITECTURE.md`, commit `a2db840`.
