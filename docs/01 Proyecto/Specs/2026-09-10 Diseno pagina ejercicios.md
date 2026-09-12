---
tipo: spec
issue: 4
estado: aprobado
responsable: Joseph
fecha: 2026-09-10
actualizado: 2026-09-11
aliases: [Diseño página ejercicios, Spec ejercicios]
---

# Diseño: página /ejercicios (#4)

## Objetivo
Construir `/ejercicios` (listado) y `/ejercicios/:slug` (detalle) con **3 retos tipo CTF** que se resuelven solo con el navegador. Todo es frontend estático, sin backend, con el contenido en `src/content/`. Criterios del issue #4: listado y detalle funcionando, y los 3 ejercicios como contenido markdown dentro de `content/`.

Decisiones: [[DEC-006 Retos en JSON y markdown con react-markdown]] · [[DEC-007 Validacion de flags por hash y flags en el vault]]
Plan de implementación: [[2026-09-10 Plan pagina ejercicios]]

> [!note] Cambio 2026-09-11
> El reto 02 dejaba la flag en un elemento `hidden` del DOM y resultaba demasiado fácil. Ahora la flag viaja dentro de un JWT en una respuesta de red, y el reto pasa a dificultad **intermedio**.

## Retos

Formato de flag: `SAPIENTIAM{...}`. Al validar se quitan los espacios de los extremos y se distingue entre mayúsculas y minúsculas. Las flags en claro están en [[Flags de los retos]].

| # | Slug | Categoría | Dificultad | Título | Artefacto | Cómo se resuelve |
|---|---|---|---|---|---|---|
| 01 | `mensaje-interceptado` | CRIPTO | básico | Mensaje interceptado | `text`: cadena Base64 copiable | Decodificar Base64 y aplicar César −3 |
| 02 | `nada-es-lo-que-parece` | WEB | intermedio | Nada es lo que parece | `network`: la página pide 3 JSON a `public/api/v1/` al cargar | DevTools → Network: la respuesta de `sesion.json` trae un JWT; la flag está en su payload (Base64URL) |
| 03 | `quien-toco-la-puerta` | DEFENSA | básico | ¿Quién tocó la puerta? | `log`: extracto de `auth.log` (35 líneas), visible y descargable | Encontrar la IP con varios `Failed password` seguidos de un `Accepted password`. La flag es `SAPIENTIAM{<ip>}` |
| 04 | `alerta-desde-corea` | DEFENSA | intermedio | ¿Ataque desde Corea del Norte? | `log`: una línea de tráfico de FortiGate | Contexto SOC con análisis crítico: país ISO (`Korea, Republic of` = `kr`, no `kp`) y dueño de la IP por whois/RDAP o VirusTotal (`microsoft`, Azure). La flag es `SAPIENTIAM{pais_dueño}`; el servidor interno tras el DNAT (`tranip`) queda como análisis extra en la explicación |

Cada reto tiene 3 pistas progresivas. Al resolver cada uno se muestra una explicación:
- **01:** Base64 es codificación, no cifrado. César se rompe probando 25 desplazamientos. Por eso existe AES.
- **02:** DevTools → Network muestra la respuesta completa de cada petición. El payload de un JWT está firmado, no cifrado: no hay que poner secretos en tokens ni devolver datos de más en una API (exposición excesiva de datos, OWASP API Security Top 10).
- **03:** defensas contra fuerza bruta en SSH: fail2ban, llaves en vez de contraseñas, `PermitRootLogin no`.

**Reglas del reto 02:**
- Las 3 peticiones son `/api/v1/config.json`, `/api/v1/metricas.json` y `/api/v1/sesion.json`, sin caché (`cache: 'no-store'`) para que aparezcan en cada recarga.
- Solo `sesion.json` tiene un campo `token`: un JWT HS256 cuyo payload lleva la flag en el campo `debug`.
- La flag **no** está en el DOM, ni en `exercises.json`, ni en el bundle JS: los JSON de `public/` se copian tal cual al build.
- En pantalla solo se ve un panel de estado de la sesión (conectando, activa o error).

**Reglas del log (reto 03):**
- Todas las IPs son de rangos de documentación (RFC 5737: `192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`).
- Solo **una** IP tiene 5 o más `Failed password` y, **después** de ellos, un `Accepted password` de esa misma IP. Los intentos no tienen que estar en líneas consecutivas: puede haber tráfico de otras IPs en medio.
- Hay distractores: 2 o 3 IPs con 1 o 2 fallos y sin acceso, y logins legítimos.

**Reglas del reto 04 (agregado el 2026-09-11):**
- Basado en un log real de una entrevista SOC, **anonimizado**: el destino original pertenecía a una organización real. Se conserva la IP de origen `4.230.8.104` (Microsoft, Azure Korea Central) para que el whois/RDAP y VirusTotal funcionen; `dstip`, `tranip`, `devid`, `devname`, UUIDs, MAC y `sessionid` son inventados.
- La flag no depende del veredicto de VirusTotal (cambia con el tiempo), solo del registrante de la IP, que es estable.
- `srcreputation=5` es el nivel más alto de FortiGuard ("Known and verified safe sites"); la explicación lo usa para enseñar que reputación no es inocencia.
- El artefacto usa `"format": "kv"`: la vista **Crudo** ajusta la línea al ancho y la vista **Campos** la muestra como tabla campo → valor (`lib/parseKeyValueLog.ts`, con pruebas). El archivo descargable es el original.

## Modelo de datos (`features/exercises/types.ts`)
```ts
type Category = 'cripto' | 'web' | 'defensa'
type Difficulty = 'basico' | 'intermedio'

type Artifact =
  | { type: 'text'; label: string; value: string }        // se muestra copiable
  | { type: 'network'; requests: string[] }               // rutas en public/ que la página pide al cargar
  | { type: 'log'; file: string; downloadName: string; format?: 'kv' }   // .log en content/, se muestra y se descarga;
                                                                        // 'kv' = clave=valor con vista Crudo / Campos

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
public/api/v1/
  config.json, metricas.json, sesion.json ← respuestas de red del reto 02 (sesion.json lleva el JWT)
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
| Falla una petición del reto 02 (red, 404, o el hosting responde `index.html`) | El panel muestra "No se pudo cargar la sesión" |
| Espacios alrededor de la flag | Se ignoran |
| Mayúsculas o minúsculas distintas | Se rechaza |

## Pruebas (Vitest, lógica pura)
- `sha256`: vectores conocidos (`""` y `"abc"`). La ruta de respaldo y la de `crypto.subtle` dan el mismo resultado.
- `checkFlag`: acepta con espacios en los extremos y rechaza si cambian las mayúsculas.
- `progress`: guarda y lee, ignora duplicados, y no falla si localStorage lanza error.
- **Pruebas solver:** cada una resuelve su reto **a partir del contenido** y comprueba que el SHA-256 coincida con `flagHash`:
  - 01: `atob` y César −3;
  - 02: lee los JSON de `public/api/v1/`, toma el único `token`, decodifica el payload del JWT y busca el valor con formato de flag; además comprueba que ninguna flag quede en el contenido que va al bundle;
  - 03: analiza el log y toma la única IP con 5 o más `Failed password` y un `Accepted password` posterior.
- **Integridad:** cada entrada tiene su `.md` y su `.explicacion.md`, un `flagHash` de 64 caracteres hex, 3 pistas únicas, categoría y dificultad conocidas, y los slugs no se repiten.
- Antes del PR: `bun run test`, `bun run lint` y `bun run build` en verde, más una revisión manual en el navegador (los 3 retos resueltos, recarga con progreso guardado, slug inválido, vista móvil).

## Fuera de alcance
- Derivar el "03" de la sección Stats (P-11).
- Favicon (P-05) y la 404 global (P-06).
- Cuentas de usuario, puntaje, ranking y guardar el progreso en un servidor.
- Tests de UI con Testing Library.
