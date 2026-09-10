---
tipo: decision
id: DEC-003
estado: aceptada
fecha: 2026-09-06
responsable: Piedrahita
---

# DEC-003 Tailwind v4 con tokens de tema

## Decisión
- Estilos con **Tailwind CSS v4** (plugin `@tailwindcss/vite`, sin `tailwind.config.js`).
- La paleta se define como tokens en `@theme` dentro de `src/index.css`: `background`, `foreground`, `muted`, `line`, `panel`, `lime`, `cyan`, `purple`.
- Estética de terminal oscura: acento lima, énfasis cian y `font-mono` para metadatos.

## Reglas que salen de esto
- Usar tokens (`text-lime`, `border-line`) en vez de hex sueltos. Hoy el terminal del Hero tiene varios hex fijos (`#334260`, `#43516a`…), algo aceptable por ser decorativo.
- Nada de CSS aparte por componente. Utilidades propias van en `@layer utilities` de `index.css`.

Relacionado: [[Stack y comandos#Theme (src/index.css)]]
