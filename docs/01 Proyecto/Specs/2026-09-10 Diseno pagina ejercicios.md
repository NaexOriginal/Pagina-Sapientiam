---
tipo: spec
issue: 4
estado: aprobado
responsable: Joseph
fecha: 2026-09-10
aliases: [Diseño página ejercicios, Spec ejercicios]
---

# Diseño: página /ejercicios (#4)

## Objetivo
Construir `/ejercicios` (listado) y `/ejercicios/:slug` (detalle) con **3 retos básicos tipo CTF** que se resuelven solo con el navegador. Todo es frontend estático, sin backend, con el contenido en `src/content/`. Criterios del issue #4: listado y detalle funcionando, y los 3 ejercicios como contenido markdown dentro de `content/`.

Decisiones: [[DEC-006 Retos en JSON y markdown con react-markdown]] · [[DEC-007 Validacion de flags por hash y flags en el vault]]
Plan de implementación: [[2026-09-10 Plan pagina ejercicios]]

## Retos

Formato de flag: `SAPIENTIAM{...}`. Al validar se quitan los espacios de los extremos y se distingue entre mayúsculas y minúsculas. Las flags en claro están en [[Flags de los retos]].

| # | Slug | Categoría | Título | Artefacto | Cómo se resuelve |
|---|---|---|---|---|---|
| 01 | `mensaje-interceptado` | CRIPTO | Mensaje interceptado | `text`: cadena Base64 copiable | Decodificar Base64 y aplicar César −3 |
| 02 | `nada-es-lo-que-parece` | WEB | Nada es lo que parece | `hidden`: elemento con `hidden` en el DOM del reto | Inspeccionar elemento en DevTools (Ctrl+U no sirve porque es una SPA) |
| 03 | `quien-toco-la-puerta` | DEFENSA | ¿Quién tocó la puerta? | `log`: extracto de `auth.log` (35 líneas), visible y descargable | Encontrar la IP con varios `Failed password` seguidos de un `Accepted password`. La flag es `SAPIENTIAM{<ip>}` |

Todos los retos tienen dificultad **básico** y 3 pistas progresivas. Al resolver cada uno se muestra una explicación:
- **01:** Base64 es codificación, no cifrado. César se rompe probando 25 desplazamientos. Por eso existe AES.
- **02:** nunca pongas secretos en el frontend: todo lo que llega al navegador es legible.
- **03:** defensas contra fuerza bruta en SSH: fail2ban, llaves en vez de contraseñas, `PermitRootLogin no`.

**Reglas del log (reto 03):**
- Todas las IPs son de rangos de documentación (RFC 5737: `192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`).
- Solo **una** IP tiene 5 o más `Failed password` y, **después** de ellos, un `Accepted password` de esa misma IP. Los intentos no tienen que estar en líneas consecutivas: puede haber tráfico de otras IPs en medio.
- Hay distractores: 2 o 3 IPs con 1 o 2 fallos y sin acceso, y logins legítimos.

## Modelo de datos (`features/exercises/types.ts`)
```ts
type Category = 'cripto' | 'web' | 'defensa'
type Difficulty = 'basico'

type Artifact =
  | { type: 'text'; label: string; value: string }        // se muestra copiable
  | { type: 'hidden'; value: string }                     // se renderiza con el atributo hidden
  | { type: 'log'; file: string; downloadName: string }   // .log en content/, se muestra y se descarga

interface ExerciseMeta {          // una entrada de exercises.json
  slug: string
  number: string                  // "01"
  title: string
  category: Category
  difficulty: Difficulty
  summary: string                 // una línea para la tarjeta del listado
  flagHash: string                // SHA-256 hex (64 caracteres) de la flag exacta
  hints: string[]                 // en orden de desbloqueo
  artifact: Artifact
}

interface Exercise extends ExerciseMeta {
  statement: string               // contenido de <slug>.md
  explanation: string             // contenido de <slug>.explicacion.md
  artifactContent?: string        // contenido del .log si artifact.type === 'log'
}
```

## Archivos
```
src/content/exercises/
  exercises.json                         ← ExerciseMeta[] en orden de aparición
  <slug>.md, <slug>.explicacion.md       ← uno por reto
  quien-toco-la-puerta.auth.log
src/features/exercises/
  types.ts
  api/exercises.ts        ← getExercises(): Exercise[] · getExercise(slug): Exercise | undefined
                            (único módulo que lee content/; usa import.meta.glob con query '?raw' y eager)
  lib/sha256.ts           ← sha256Hex(text): Promise<string>. Usa crypto.subtle si existe
                            (solo hay en contexto seguro); si no, implementación JS propia
  lib/checkFlag.ts        ← checkFlag(input, flagHash): Promise<boolean> (trim + sha256 + comparar)
  progress.ts             ← getSolved(): string[] · markSolved(slug) · isSolved(slug)
                            clave localStorage "sapientiam:ejercicios:resueltos" (JSON string[]),
                            todo dentro de try/catch
  components/ExerciseCard.tsx · Markdown.tsx · Hints.tsx · FlagForm.tsx · Artifact.tsx
src/pages/ejercicios/
  EjerciciosPage.tsx      ← listado + contador "N/3 resueltos" (reemplaza el placeholder)
  EjercicioPage.tsx       ← detalle (useParams → getExercise)
src/app/router.tsx        ← + { path: '/ejercicios/:slug', element: <EjercicioPage /> }
```

**Dependencias nuevas:**
- `react-markdown` ^10 y `remark-gfm` ^4 (runtime).
- `vitest` ^5 (dev), con el script `"test": "vitest run"`.

El markdown **no** usa `@tailwindcss/typography`: `Markdown.tsx` asigna clases Tailwind a cada elemento (h2, p, ul, code, pre, a) con los tokens del tema.

## Comportamiento

**Listado:** tarjetas con número, categoría, título y resumen. Las resueltas llevan ✓ y el contador muestra "N/3 resueltos". Cada tarjeta enlaza a su detalle.

**Detalle**, en este orden:
1. Encabezado: número, categoría, dificultad y título.
2. Enunciado en markdown.
3. Artefacto.
4. Pistas: botón "Ver pista N". Solo se puede abrir la siguiente pista y quedan abiertas mientras estés en la página (no se guardan).
5. Formulario de la flag:
   - el botón queda deshabilitado si el campo está vacío;
   - mientras calcula el hash muestra "validando…";
   - si la flag es incorrecta, muestra un mensaje genérico;
   - si es correcta, muestra "✓ ¡Correcto!", llama a `markSolved` y muestra la explicación.
6. Si el reto ya estaba resuelto al entrar, la explicación sale directo y el formulario indica "Ya resolviste este reto".

**Estilo:** el mismo patrón visual de las secciones de inicio (contenedor, encabezado número · línea · label en mono lima, título serif, paneles `border-line bg-panel`, CTA lima).

## Errores y casos borde
| Caso | Comportamiento |
|---|---|
| Slug inexistente | "Este reto no existe" y enlace a `/ejercicios` (no es la 404 global) |
| localStorage bloqueado o lanza error | El reto funciona igual, pero no se recuerda el progreso |
| Sin HTTPS (no hay `crypto.subtle`) | Se usa el SHA-256 en JS; el resultado es idéntico |
| Espacios alrededor de la flag | Se ignoran |
| Mayúsculas o minúsculas distintas | Se rechaza |

## Pruebas (Vitest, lógica pura)
- `sha256`: vectores conocidos (`""` y `"abc"`). La ruta de respaldo y la de `crypto.subtle` dan el mismo resultado.
- `checkFlag`: acepta con espacios en los extremos y rechaza si cambian las mayúsculas.
- `progress`: guarda y lee, ignora duplicados, y no falla si localStorage lanza error.
- **Pruebas solver:** cada una resuelve su reto **a partir del contenido cargado por la api** y comprueba que el SHA-256 coincida con `flagHash`:
  - 01: `atob` y César −3;
  - 02: el `value` del artefacto hidden;
  - 03: analiza el log y toma la única IP con 5 o más `Failed password` y un `Accepted password` posterior.
- **Integridad:** cada entrada tiene su `.md` y su `.explicacion.md`, un `flagHash` de 64 caracteres hex, 3 pistas, y los slugs no se repiten.
- Antes del PR: `bun run test`, `bun run lint` y `bun run build` en verde, más una revisión manual en el navegador (los 3 retos resueltos, recarga con progreso guardado, slug inválido, vista móvil).

## Fuera de alcance
- Derivar el "03" de la sección Stats (P-11).
- Favicon (P-05) y la 404 global (P-06).
- Cuentas de usuario, puntaje, ranking y guardar el progreso en un servidor.
- Tests de UI con Testing Library.
