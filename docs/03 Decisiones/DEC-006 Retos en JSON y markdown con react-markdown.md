---
tipo: decision
id: DEC-006
estado: aceptada
fecha: 2026-09-10
responsable: Joseph
issue: 4
---

# DEC-006 Retos en JSON + markdown con react-markdown

## Contexto
El #4 pide 3 ejercicios como markdown dentro de `content/`, sin backend. Cada reto tiene datos estructurados (hash de la flag, pistas, artefacto) además de texto largo (enunciado y explicación).

## Decisión
- `src/content/exercises/exercises.json` guarda los datos tipados de los 3 retos.
- Cada reto tiene `<slug>.md` (enunciado) y `<slug>.explicacion.md`.
- Se cargan con `import.meta.glob('...', { query: '?raw', import: 'default', eager: true })` desde `features/exercises/api`, que es el único módulo que lee `content/` (como plantea ARCHITECTURE.md).
- El markdown se muestra con **react-markdown 10 + remark-gfm 4** (compatibles con React 19), con estilos Tailwind propios. No se usa el plugin typography.
- Las pruebas de lógica usan **Vitest 5** (compatible con Vite 8).

## Alternativas descartadas
- **Un `.md` por reto con frontmatter YAML:** necesita un parser de YAML (`gray-matter` está hecho para Node).
- **Convertir el markdown a HTML en el build con un plugin de Vite:** más herramientas en el build, sin ganancia real para 3 retos.

## Consecuencias
- Agregar un reto nuevo implica una entrada en el JSON y dos `.md`. Las pruebas de integridad avisan si falta alguno.
- `react-markdown` no muestra HTML crudo, así que los retos que necesitan el DOM (como el 02) usan un artefacto con su propio componente.

Relacionado: [[DEC-004 Textos en JSON dentro de content]] · [[2026-09-10 Diseno pagina ejercicios]]
