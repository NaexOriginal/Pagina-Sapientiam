---
tipo: plan
issue: 4
estado: listo
responsable: Joseph
fecha: 2026-09-10
aliases: [Plan página ejercicios, Plan ejercicios]
---

# Página /ejercicios: plan de implementación

> **Para agentes:** SUB-SKILL REQUERIDA: usa superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos usan checkboxes (`- [ ]`) para el seguimiento.

**Objetivo:** construir `/ejercicios` (listado) y `/ejercicios/:slug` (detalle) con 3 retos tipo CTF que se validan en el navegador.

**Arquitectura:**
- `src/features/exercises/` contiene la lógica: hash, validación de flags, progreso y carga de contenido.
- `api/exercises.ts` es el **único** módulo que lee `src/content/exercises/`.
- Las páginas en `src/pages/ejercicios/` componen los componentes del feature.
- El contenido es un JSON con los datos más un `.md` por texto largo y un `.log`, todo cargado con `import.meta.glob` como texto.

**Stack:** React 19, React Router 8.3, TypeScript 6, Vite 8, Tailwind 4, Bun. Se agregan react-markdown 10, remark-gfm 4 y Vitest 5.

**Spec:** [[2026-09-10 Diseno pagina ejercicios]]. Flags en claro: [[Flags de los retos]].

## Restricciones globales

- Todos los comandos se corren desde `apps/frontend` con Bun: `bun run test`, `bun run lint`, `bun run build`. Si no hay Node instalado, usa `bun run --bun lint`.
- Rama: `feature/4-pagina-ejercicios`, que sale de `feature/5-vault-obsidian` porque la spec vive en el vault. El PR va hacia `main`.
- TypeScript usa `verbatimModuleSyntax`: los imports que son solo de tipos se escriben `import type { X }` o `import { type X }`. También están activos `noUnusedLocals` y `noUnusedParameters`.
- Las únicas dependencias nuevas permitidas son `react-markdown@^10`, `remark-gfm@^4` y `vitest@^5` (esta última como dev).
- Colores: solo los tokens del tema (`background`, `foreground`, `muted`, `line`, `panel`, `lime`, `cyan`, `purple`). Nada de hex sueltos.
- Contenedor de página, exacto: `mx-auto w-[calc(100%-40px)] sm:w-[min(1180px,calc(100%-72px))]`.
- La interfaz está en español. El copy de las páginas va en `src/content/ejercicios.json`. Los datos de los retos solo los lee `features/exercises/api`.
- Formato de flag: `SAPIENTIAM{...}`. Se validan después de quitar los espacios de los extremos y **distinguiendo mayúsculas**, comparando SHA-256 hex en minúsculas.
- Clave de localStorage, exacta: `sapientiam:ejercicios:resueltos` (un JSON con un `string[]` de slugs).
- Las pruebas **nunca** escriben las flags reales. Las pruebas solver las **deducen** del contenido.
- Commits en español con prefijo convencional, `Refs #4` y la línea `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`. Pasa el mensaje con varios `-m`, **nunca con heredoc**.
- Finales de línea LF (`.gitattributes` ya lo impone).

## Mapa de archivos

| Archivo | Responsabilidad | Tarea |
|---|---|---|
| `package.json` | Script `test` y las dependencias nuevas | 1, 6 |
| `src/features/exercises/lib/sha256.ts` (+ `.test.ts`) | SHA-256 hex con `crypto.subtle` y respaldo en JS | 1 |
| `src/features/exercises/lib/checkFlag.ts` (+ `.test.ts`) | Quitar espacios, calcular el hash y comparar | 2 |
| `src/features/exercises/progress.ts` (+ `.test.ts`) | Retos resueltos en localStorage | 3 |
| `src/features/exercises/types.ts` | Tipos `Exercise` y `Artifact` | 4 |
| `src/features/exercises/api/exercises.ts` (+ `.test.ts`) | Cargar y armar los retos desde `content/` | 4 |
| `src/features/exercises/solvers.test.ts` | Demostrar que los 3 retos se pueden resolver | 4, 5 |
| `src/content/exercises/*` | Datos, enunciados, explicaciones y log | 4, 5 |
| `src/features/exercises/components/Markdown.tsx` | Markdown con estilos del tema | 6 |
| `src/features/exercises/components/Artifact.tsx` | Artefacto según su tipo (text, hidden, log) | 6 |
| `src/features/exercises/components/Hints.tsx` | Pistas progresivas | 6 |
| `src/features/exercises/components/FlagForm.tsx` | Formulario y estados de validación | 6 |
| `src/features/exercises/labels.ts` | Etiquetas de categoría y dificultad | 7 |
| `src/features/exercises/components/ExerciseCard.tsx` | Tarjeta del listado | 7 |
| `src/content/ejercicios.json` | Copy de las páginas | 7 |
| `src/pages/ejercicios/EjerciciosPage.tsx` | Listado | 7 |
| `src/pages/ejercicios/EjercicioPage.tsx` | Detalle y "no existe" | 7 |
| `src/app/router.tsx` | Ruta `/ejercicios/:slug` | 7 |

---

### Task 1: Vitest + SHA-256

**Files:**
- Modify: `apps/frontend/package.json` (script `test` y la dev dependency `vitest`; `bun.lock` se actualiza solo)
- Create: `apps/frontend/src/features/exercises/lib/sha256.ts`
- Test: `apps/frontend/src/features/exercises/lib/sha256.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `sha256Hex(text: string): Promise<string>`: 64 caracteres hex en minúsculas.
  - `sha256Fallback(text: string): string`: la versión síncrona en JS.

- [ ] **Step 1: Instalar Vitest y agregar el script**

```bash
cd apps/frontend
bun add -d vitest@^5
```
En `package.json`, deja el bloque `scripts` así:
```json
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "oxlint",
    "test": "vitest run",
    "preview": "vite preview"
  },
```

- [ ] **Step 2: Escribir la prueba que falla**

`src/features/exercises/lib/sha256.test.ts`:
```ts
import { afterEach, describe, expect, it, vi } from 'vitest'
import { sha256Fallback, sha256Hex } from './sha256'

// Vectores oficiales de NIST (FIPS 180-4). El tercero ocupa dos bloques de 64 bytes.
const vectors: Array<[string, string]> = [
  ['', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
  ['abc', 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'],
  [
    'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq',
    '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1',
  ],
]

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('sha256Fallback', () => {
  it.each(vectors)('hashea %j correctamente', (input, expected) => {
    expect(sha256Fallback(input)).toBe(expected)
  })

  it('coincide con crypto.subtle en los límites de relleno y con UTF-8', async () => {
    const inputs = ['a'.repeat(55), 'a'.repeat(56), 'a'.repeat(64), 'a'.repeat(1000), 'Sapientiam ñ áé 🔐']
    for (const input of inputs) {
      expect(sha256Fallback(input)).toBe(await sha256Hex(input))
    }
  })
})

describe('sha256Hex', () => {
  it.each(vectors)('hashea %j con crypto.subtle', async (input, expected) => {
    expect(await sha256Hex(input)).toBe(expected)
  })

  it('usa la implementación JS cuando no hay crypto.subtle (sitio sin HTTPS)', async () => {
    vi.stubGlobal('crypto', {})
    expect(globalThis.crypto.subtle).toBeUndefined()
    expect(await sha256Hex('abc')).toBe(vectors[1][1])
  })
})
```

- [ ] **Step 3: Correr la prueba y comprobar que falla**

Run: `bun run test`
Expected: FAIL con un error de resolución, del estilo `Failed to resolve import "./sha256"`.

- [ ] **Step 4: Implementar**

`src/features/exercises/lib/sha256.ts`:
```ts
// Constantes de ronda de SHA-256 (FIPS 180-4, sección 4.2.2)
const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
])

const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n))

const toHex = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')

// Implementación en JS para cuando no hay crypto.subtle (sitio servido sin HTTPS)
export function sha256Fallback(text: string): string {
  const bytes = new TextEncoder().encode(text)
  const paddedLength = Math.ceil((bytes.length + 9) / 64) * 64
  const data = new Uint8Array(paddedLength)
  data.set(bytes)
  data[bytes.length] = 0x80
  const view = new DataView(data.buffer)
  const bitLength = bytes.length * 8
  view.setUint32(paddedLength - 8, Math.floor(bitLength / 2 ** 32))
  view.setUint32(paddedLength - 4, bitLength >>> 0)

  const hash = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ])
  const w = new Uint32Array(64)

  for (let offset = 0; offset < paddedLength; offset += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(offset + i * 4)
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3)
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10)
      w[i] = w[i - 16] + s0 + w[i - 7] + s1
    }

    let [a, b, c, d, e, f, g, h] = hash
    for (let i = 0; i < 64; i++) {
      const t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) >>> 0
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0
      h = g
      g = f
      f = e
      e = (d + t1) >>> 0
      d = c
      c = b
      b = a
      a = (t1 + t2) >>> 0
    }

    hash[0] += a
    hash[1] += b
    hash[2] += c
    hash[3] += d
    hash[4] += e
    hash[5] += f
    hash[6] += g
    hash[7] += h
  }

  return Array.from(hash, (word) => word.toString(16).padStart(8, '0')).join('')
}

export async function sha256Hex(text: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle
  if (!subtle) return sha256Fallback(text)
  const digest = await subtle.digest('SHA-256', new TextEncoder().encode(text))
  return toHex(new Uint8Array(digest))
}
```

- [ ] **Step 5: Correr las pruebas y comprobar que pasan**

Run: `bun run test`
Expected: PASS, 8 pruebas en `sha256.test.ts` (4 de `sha256Fallback` y 4 de `sha256Hex`).

- [ ] **Step 6: Lint y build**

Run: `bun run lint && bun run build`
Expected: oxlint sin hallazgos y `✓ built`.

- [ ] **Step 7: Commit**

```bash
git add package.json bun.lock src/features/exercises/lib/sha256.ts src/features/exercises/lib/sha256.test.ts
git commit -m "feat: sha256 con respaldo en JS y Vitest para los retos" -m "Refs #4" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: checkFlag

**Files:**
- Create: `apps/frontend/src/features/exercises/lib/checkFlag.ts`
- Test: `apps/frontend/src/features/exercises/lib/checkFlag.test.ts`

**Interfaces:**
- Consumes: `sha256Hex(text: string): Promise<string>` de `./sha256` (Task 1).
- Produces: `checkFlag(input: string, flagHash: string): Promise<boolean>`.

- [ ] **Step 1: Escribir la prueba que falla**

`src/features/exercises/lib/checkFlag.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { checkFlag } from './checkFlag'

// SHA-256 de "SAPIENTIAM{prueba}": flag solo para pruebas, no es de ningún reto
const TEST_HASH = '7a1a4be367d93489fb58dcd97afa3e43eb0188e9112754019351c9f5d429a53a'

describe('checkFlag', () => {
  it('acepta la flag exacta', async () => {
    expect(await checkFlag('SAPIENTIAM{prueba}', TEST_HASH)).toBe(true)
  })

  it('ignora espacios y saltos de línea en los extremos', async () => {
    expect(await checkFlag('  SAPIENTIAM{prueba}\n', TEST_HASH)).toBe(true)
  })

  it('distingue mayúsculas y minúsculas', async () => {
    expect(await checkFlag('sapientiam{prueba}', TEST_HASH)).toBe(false)
    expect(await checkFlag('SAPIENTIAM{PRUEBA}', TEST_HASH)).toBe(false)
  })

  it('rechaza una flag distinta', async () => {
    expect(await checkFlag('SAPIENTIAM{otra}', TEST_HASH)).toBe(false)
  })

  it('rechaza texto vacío o solo espacios', async () => {
    expect(await checkFlag('', TEST_HASH)).toBe(false)
    expect(await checkFlag('   ', TEST_HASH)).toBe(false)
  })
})
```

- [ ] **Step 2: Correr la prueba y comprobar que falla**

Run: `bun run test`
Expected: FAIL en `checkFlag.test.ts` con `Failed to resolve import "./checkFlag"`.

- [ ] **Step 3: Implementar**

`src/features/exercises/lib/checkFlag.ts`:
```ts
import { sha256Hex } from './sha256'

export async function checkFlag(input: string, flagHash: string): Promise<boolean> {
  const candidate = input.trim()
  if (candidate === '') return false
  return (await sha256Hex(candidate)) === flagHash
}
```

- [ ] **Step 4: Correr las pruebas y comprobar que pasan**

Run: `bun run test`
Expected: PASS, con 5 pruebas nuevas en `checkFlag.test.ts`.

- [ ] **Step 5: Commit**

```bash
git add src/features/exercises/lib/checkFlag.ts src/features/exercises/lib/checkFlag.test.ts
git commit -m "feat: validación de flags por hash" -m "Refs #4" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Progreso en localStorage

**Files:**
- Create: `apps/frontend/src/features/exercises/progress.ts`
- Test: `apps/frontend/src/features/exercises/progress.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `getSolved(): string[]`
  - `isSolved(slug: string): boolean`
  - `markSolved(slug: string): void`

  Ninguna de las tres lanza error aunque localStorage no exista o falle.

Node 24 **no** tiene `localStorage` global. Las pruebas lo simulan con `vi.stubGlobal`.

- [ ] **Step 1: Escribir la prueba que falla**

`src/features/exercises/progress.test.ts`:
```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getSolved, isSolved, markSolved } from './progress'

const STORAGE_KEY = 'sapientiam:ejercicios:resueltos'

function createMemoryStorage(): Storage {
  const data = new Map<string, string>()
  return {
    get length() {
      return data.size
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => {
      data.delete(key)
    },
    setItem: (key, value) => {
      data.set(key, value)
    },
  }
}

describe('progreso con localStorage disponible', () => {
  let storage: Storage

  beforeEach(() => {
    storage = createMemoryStorage()
    vi.stubGlobal('localStorage', storage)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('empieza sin retos resueltos', () => {
    expect(getSolved()).toEqual([])
    expect(isSolved('mensaje-interceptado')).toBe(false)
  })

  it('guarda y recuerda un reto resuelto', () => {
    markSolved('mensaje-interceptado')
    expect(isSolved('mensaje-interceptado')).toBe(true)
    expect(getSolved()).toEqual(['mensaje-interceptado'])
    expect(storage.getItem(STORAGE_KEY)).toBe('["mensaje-interceptado"]')
  })

  it('no duplica un reto resuelto dos veces', () => {
    markSolved('mensaje-interceptado')
    markSolved('mensaje-interceptado')
    expect(getSolved()).toEqual(['mensaje-interceptado'])
  })

  it('ignora datos corruptos o con otra forma', () => {
    storage.setItem(STORAGE_KEY, '{no es json')
    expect(getSolved()).toEqual([])
    storage.setItem(STORAGE_KEY, '{"a":1}')
    expect(getSolved()).toEqual([])
    storage.setItem(STORAGE_KEY, '["ok", 42, null]')
    expect(getSolved()).toEqual(['ok'])
  })
})

describe('progreso sin localStorage usable', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('no falla si localStorage no existe', () => {
    vi.stubGlobal('localStorage', undefined)
    expect(getSolved()).toEqual([])
    expect(() => markSolved('mensaje-interceptado')).not.toThrow()
    expect(isSolved('mensaje-interceptado')).toBe(false)
  })

  it('no falla si localStorage lanza errores (modo privado o bloqueado)', () => {
    const throwing = createMemoryStorage()
    throwing.getItem = () => {
      throw new Error('bloqueado')
    }
    throwing.setItem = () => {
      throw new Error('bloqueado')
    }
    vi.stubGlobal('localStorage', throwing)
    expect(getSolved()).toEqual([])
    expect(() => markSolved('mensaje-interceptado')).not.toThrow()
  })
})
```

- [ ] **Step 2: Correr la prueba y comprobar que falla**

Run: `bun run test`
Expected: FAIL en `progress.test.ts` con `Failed to resolve import "./progress"`.

- [ ] **Step 3: Implementar**

`src/features/exercises/progress.ts`:
```ts
const STORAGE_KEY = 'sapientiam:ejercicios:resueltos'

export function getSolved(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

export function isSolved(slug: string): boolean {
  return getSolved().includes(slug)
}

export function markSolved(slug: string): void {
  const solved = getSolved()
  if (solved.includes(slug)) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...solved, slug]))
  } catch {
    // Sin almacenamiento disponible: el reto funciona igual, solo no se recuerda
  }
}
```

- [ ] **Step 4: Correr las pruebas y comprobar que pasan**

Run: `bun run test`
Expected: PASS, con 6 pruebas nuevas en `progress.test.ts`.

- [ ] **Step 5: Commit**

```bash
git add src/features/exercises/progress.ts src/features/exercises/progress.test.ts
git commit -m "feat: progreso de retos en localStorage" -m "Refs #4" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Tipos, API de contenido y reto 01

**Files:**
- Create: `apps/frontend/src/features/exercises/types.ts`
- Create: `apps/frontend/src/features/exercises/api/exercises.ts`
- Create: `apps/frontend/src/content/exercises/exercises.json`
- Create: `apps/frontend/src/content/exercises/mensaje-interceptado.md`
- Create: `apps/frontend/src/content/exercises/mensaje-interceptado.explicacion.md`
- Test: `apps/frontend/src/features/exercises/api/exercises.test.ts`
- Test: `apps/frontend/src/features/exercises/solvers.test.ts`

**Interfaces:**
- Consumes: `sha256Hex` de `../lib/sha256` (Task 1), usado solo en las pruebas.
- Produces:
  - Los tipos `Category`, `Difficulty`, `Artifact`, `ExerciseMeta` y `Exercise` (definidos abajo).
  - `getExercises(): Exercise[]`: en el orden de `exercises.json`.
  - `getExercise(slug: string): Exercise | undefined`

- [ ] **Step 1: Escribir las pruebas que fallan**

`src/features/exercises/api/exercises.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { getExercise, getExercises } from './exercises'

const exercises = getExercises()

describe('contenido de los retos', () => {
  it('los slugs no se repiten', () => {
    const slugs = exercises.map((exercise) => exercise.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it.each(exercises)('$slug tiene enunciado, explicación, hash y 3 pistas', (exercise) => {
    expect(exercise.statement.trim()).not.toBe('')
    expect(exercise.explanation.trim()).not.toBe('')
    expect(exercise.flagHash).toMatch(/^[0-9a-f]{64}$/)
    expect(exercise.hints).toHaveLength(3)
    if (exercise.artifact.type === 'log') expect(exercise.artifactContent?.trim()).toBeTruthy()
  })
})

describe('getExercise', () => {
  it('devuelve el reto por slug', () => {
    expect(getExercise('mensaje-interceptado')?.title).toBe('Mensaje interceptado')
  })

  it('devuelve undefined si el slug no existe', () => {
    expect(getExercise('no-existe')).toBeUndefined()
  })
})
```

`src/features/exercises/solvers.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { getExercise } from './api/exercises'
import { sha256Hex } from './lib/sha256'

// Estas pruebas resuelven cada reto a partir de su contenido, igual que un estudiante.
// Así garantizan que los retos se pueden resolver, sin escribir ninguna flag aquí.

function caesarShift(text: string, shift: number): string {
  return text.replace(/[a-z]/gi, (char) => {
    const base = char <= 'Z' ? 65 : 97
    return String.fromCharCode(((((char.charCodeAt(0) - base + shift) % 26) + 26) % 26) + base)
  })
}

describe('los retos se pueden resolver', () => {
  it('01 mensaje-interceptado: Base64 y luego César −3', async () => {
    const exercise = getExercise('mensaje-interceptado')
    expect(exercise?.artifact.type).toBe('text')
    if (exercise?.artifact.type !== 'text') return
    const flag = caesarShift(atob(exercise.artifact.value), -3)
    expect(await sha256Hex(flag)).toBe(exercise.flagHash)
  })
})
```

- [ ] **Step 2: Correr las pruebas y comprobar que fallan**

Run: `bun run test`
Expected: FAIL en `exercises.test.ts` y `solvers.test.ts` con `Failed to resolve import "./exercises"` / `"./api/exercises"`.

- [ ] **Step 3: Crear los tipos**

`src/features/exercises/types.ts`:
```ts
export type Category = 'cripto' | 'web' | 'defensa'

export type Difficulty = 'basico'

export type Artifact =
  | { type: 'text'; label: string; value: string }
  | { type: 'hidden'; value: string }
  | { type: 'log'; file: string; downloadName: string }

export interface ExerciseMeta {
  slug: string
  number: string
  title: string
  category: Category
  difficulty: Difficulty
  summary: string
  flagHash: string
  hints: string[]
  artifact: Artifact
}

export interface Exercise extends ExerciseMeta {
  statement: string
  explanation: string
  artifactContent?: string
}
```

- [ ] **Step 4: Crear la API de contenido**

`src/features/exercises/api/exercises.ts`:
```ts
import metadata from '../../../content/exercises/exercises.json'
import type { Exercise, ExerciseMeta } from '../types'

// Único módulo que sabe de dónde vienen los retos. Cuando exista el backend, solo cambia este archivo.
const markdownFiles = import.meta.glob<string>('../../../content/exercises/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const logFiles = import.meta.glob<string>('../../../content/exercises/*.log', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const byFileName = (files: Record<string, string>) =>
  Object.fromEntries(Object.entries(files).map(([path, content]) => [path.split('/').pop() as string, content]))

const markdown = byFileName(markdownFiles)
const logs = byFileName(logFiles)

const exercises: Exercise[] = (metadata as ExerciseMeta[]).map((meta) => ({
  ...meta,
  statement: markdown[`${meta.slug}.md`] ?? '',
  explanation: markdown[`${meta.slug}.explicacion.md`] ?? '',
  artifactContent: meta.artifact.type === 'log' ? logs[meta.artifact.file] : undefined,
}))

export function getExercises(): Exercise[] {
  return exercises
}

export function getExercise(slug: string): Exercise | undefined {
  return exercises.find((exercise) => exercise.slug === slug)
}
```

- [ ] **Step 5: Crear el contenido del reto 01**

`src/content/exercises/exercises.json`:
```json
[
  {
    "slug": "mensaje-interceptado",
    "number": "01",
    "title": "Mensaje interceptado",
    "category": "cripto",
    "difficulty": "basico",
    "summary": "Un mensaje extraño viajó por la red del laboratorio. ¿Qué dice en realidad?",
    "flagHash": "a7322899f4a22b4d0b3c2332f72d66c942b3ce375c879d4bb02a64fbb2ff3ddc",
    "hints": [
      "¿Por qué el mensaje termina en \"==\"? Ese relleno es típico de una codificación muy común.",
      "Lo que obtienes ya tiene forma de flag, pero las letras están corridas.",
      "Julio César movía cada letra 3 posiciones en el alfabeto."
    ],
    "artifact": {
      "type": "text",
      "label": "Mensaje interceptado",
      "value": "VkRTTEhRV0xEUHtmcmdsaWxmZHVfcXJfaHZfZmxpdWR1fQ=="
    }
  }
]
```

`src/content/exercises/mensaje-interceptado.md`:
```md
Nuestro equipo interceptó este mensaje mientras viajaba por la red del laboratorio. A simple vista no dice nada, pero sospechamos que esconde una flag.

**Tu misión:** recupera el mensaje original. La flag tiene el formato `SAPIENTIAM{...}`.

> No necesitas instalar nada: con el navegador (o una terminal) alcanza.
```

`src/content/exercises/mensaje-interceptado.explicacion.md`:
```md
## Qué aprendiste

- **Base64 no es cifrado.** Es una *codificación*: convierte bytes en texto imprimible y cualquiera la revierte sin clave. Se reconoce por su alfabeto (`A-Z`, `a-z`, `0-9`, `+`, `/`) y por el relleno `=` al final.
- **César tampoco protege.** Solo hay 25 desplazamientos posibles: se rompe probándolos todos en segundos (fuerza bruta).

## Cómo se defiende

Para proteger información de verdad se usan algoritmos modernos como **AES** o **ChaCha20**, con claves largas y aleatorias. Si alguien te dice que sus datos están "cifrados en Base64", ya sabes que no lo están.
```

- [ ] **Step 6: Correr las pruebas y comprobar que pasan**

Run: `bun run test`
Expected: PASS. Además de las anteriores, entran la integridad de `mensaje-interceptado`, los 2 casos de `getExercise`, el de slugs y el solver 01.

- [ ] **Step 7: Lint y build**

Run: `bun run lint && bun run build`
Expected: sin hallazgos y `✓ built`. Esto confirma que el cast `metadata as ExerciseMeta[]` compila.

- [ ] **Step 8: Commit**

```bash
git add src/features/exercises/types.ts src/features/exercises/api src/features/exercises/solvers.test.ts src/content/exercises
git commit -m "feat: API de contenido de retos y reto 01 (cripto)" -m "Refs #4" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Retos 02 (web) y 03 (defensa)

**Files:**
- Modify: `apps/frontend/src/content/exercises/exercises.json` (agrega 2 entradas)
- Create: `apps/frontend/src/content/exercises/nada-es-lo-que-parece.md`
- Create: `apps/frontend/src/content/exercises/nada-es-lo-que-parece.explicacion.md`
- Create: `apps/frontend/src/content/exercises/quien-toco-la-puerta.md`
- Create: `apps/frontend/src/content/exercises/quien-toco-la-puerta.explicacion.md`
- Create: `apps/frontend/src/content/exercises/quien-toco-la-puerta.auth.log`
- Modify: `apps/frontend/src/features/exercises/api/exercises.test.ts` (prueba de los 3 retos en orden)
- Modify: `apps/frontend/src/features/exercises/solvers.test.ts` (solvers 02 y 03, y rangos de IP)

**Interfaces:**
- Consumes: `getExercise`/`getExercises` (Task 4) y `sha256Hex` (Task 1).
- Produces: el contenido final de los 3 retos. No agrega código nuevo a `src/` fuera de las pruebas.

- [ ] **Step 1: Escribir las pruebas que fallan**

En `src/features/exercises/api/exercises.test.ts`, dentro de `describe('contenido de los retos', ...)`, agrega:
```ts
  it('tiene los 3 retos en orden', () => {
    expect(exercises.map((exercise) => exercise.slug)).toEqual([
      'mensaje-interceptado',
      'nada-es-lo-que-parece',
      'quien-toco-la-puerta',
    ])
  })
```

Reemplaza `src/features/exercises/solvers.test.ts` completo por:
```ts
import { describe, expect, it } from 'vitest'
import { getExercise } from './api/exercises'
import { sha256Hex } from './lib/sha256'

// Estas pruebas resuelven cada reto a partir de su contenido, igual que un estudiante.
// Así garantizan que los retos se pueden resolver, sin escribir ninguna flag aquí.

function caesarShift(text: string, shift: number): string {
  return text.replace(/[a-z]/gi, (char) => {
    const base = char <= 'Z' ? 65 : 97
    return String.fromCharCode(((((char.charCodeAt(0) - base + shift) % 26) + 26) % 26) + base)
  })
}

// IPs con 5 o más "Failed password" y un "Accepted password" posterior de esa misma IP
function findBruteForceIntruders(log: string): string[] {
  const failures = new Map<string, number>()
  const intruders: string[] = []
  for (const line of log.split('\n')) {
    const match = line.match(/(Failed|Accepted) password for (?:invalid user )?\S+ from (\S+) port/)
    if (!match) continue
    const [, result, ip] = match
    if (result === 'Failed') failures.set(ip, (failures.get(ip) ?? 0) + 1)
    else if ((failures.get(ip) ?? 0) >= 5 && !intruders.includes(ip)) intruders.push(ip)
  }
  return intruders
}

describe('los retos se pueden resolver', () => {
  it('01 mensaje-interceptado: Base64 y luego César −3', async () => {
    const exercise = getExercise('mensaje-interceptado')
    expect(exercise?.artifact.type).toBe('text')
    if (exercise?.artifact.type !== 'text') return
    const flag = caesarShift(atob(exercise.artifact.value), -3)
    expect(await sha256Hex(flag)).toBe(exercise.flagHash)
  })

  it('02 nada-es-lo-que-parece: la flag es el valor oculto en el DOM', async () => {
    const exercise = getExercise('nada-es-lo-que-parece')
    expect(exercise?.artifact.type).toBe('hidden')
    if (exercise?.artifact.type !== 'hidden') return
    expect(await sha256Hex(exercise.artifact.value)).toBe(exercise.flagHash)
  })

  it('03 quien-toco-la-puerta: una sola IP hizo fuerza bruta y entró', async () => {
    const exercise = getExercise('quien-toco-la-puerta')
    expect(exercise?.artifact.type).toBe('log')
    const intruders = findBruteForceIntruders(exercise?.artifactContent ?? '')
    expect(intruders).toHaveLength(1)
    expect(await sha256Hex(`SAPIENTIAM{${intruders[0]}}`)).toBe(exercise?.flagHash)
  })

  it('03 usa solo IPs de documentación (RFC 5737)', () => {
    const log = getExercise('quien-toco-la-puerta')?.artifactContent ?? ''
    const ips = [...log.matchAll(/from (\d+\.\d+\.\d+\.\d+)/g)].map((match) => match[1])
    expect(ips.length).toBeGreaterThan(0)
    for (const ip of ips) expect(ip).toMatch(/^(192\.0\.2|198\.51\.100|203\.0\.113)\.\d{1,3}$/)
  })
})
```

- [ ] **Step 2: Correr las pruebas y comprobar que fallan**

Run: `bun run test`
Expected: FAIL en:
- `tiene los 3 retos en orden` (solo hay 1);
- el solver 02 (`expected undefined to be 'hidden'`);
- el solver 03 (`expected undefined to be 'log'`);
- el de rangos de IP (`expected 0 to be greater than 0`).

- [ ] **Step 3: Agregar el contenido del reto 02**

En `src/content/exercises/exercises.json`, agrega esta entrada **después** de la de `mensaje-interceptado` (el array queda de 2 elementos):
```json
  {
    "slug": "nada-es-lo-que-parece",
    "number": "02",
    "title": "Nada es lo que parece",
    "category": "web",
    "difficulty": "basico",
    "summary": "Esta página esconde algo. ¿Sabes dónde mirar?",
    "flagHash": "e0fa55158156b5e99a60c26578fb58063f32326a29fab58abb86f139e924db32",
    "hints": [
      "Lo que ves no es todo lo que el navegador recibió.",
      "Prueba clic derecho → Inspeccionar (o F12). Ctrl+U no te va a servir aquí.",
      "Busca elementos con el atributo hidden cerca del panel del reto."
    ],
    "artifact": {
      "type": "hidden",
      "value": "SAPIENTIAM{inspecciona_el_dom}"
    }
  }
```

`src/content/exercises/nada-es-lo-que-parece.md`:
```md
Esta página parece un reto vacío... pero **lo que ves no es todo lo que el navegador recibió**.

Encuentra la flag escondida en esta misma página. Formato: `SAPIENTIAM{...}`.
```

`src/content/exercises/nada-es-lo-que-parece.explicacion.md`:
```md
## Qué aprendiste

- El navegador recibe **mucho más** de lo que muestra: elementos ocultos, atributos, comentarios y scripts. Con **DevTools** (F12 o clic derecho → *Inspeccionar*) todo eso queda a la vista.
- En una SPA como esta, *Ver código fuente* (Ctrl+U) solo muestra el `index.html` inicial, casi vacío. El contenido real lo construye JavaScript, por eso hay que inspeccionar el **DOM** ya renderizado.

## Cómo se defiende

**Nunca pongas secretos en el frontend**: claves de API, contraseñas, flags o reglas de permisos. Todo lo que llega al navegador lo puede leer el usuario. Los secretos se quedan en el servidor.
```

- [ ] **Step 4: Agregar el contenido del reto 03**

En `src/content/exercises/exercises.json`, agrega esta entrada **al final** (el array queda de 3 elementos):
```json
  {
    "slug": "quien-toco-la-puerta",
    "number": "03",
    "title": "¿Quién tocó la puerta?",
    "category": "defensa",
    "difficulty": "basico",
    "summary": "Alguien entró anoche al servidor SSH del laboratorio. Encuentra su rastro en el log.",
    "flagHash": "f46ff9bcfe8bab345bc4f3e5efb79b17ba3652e5a4af15421390cab68d75d72a",
    "hints": [
      "Cuenta cuántos intentos fallidos (Failed password) hay por cada IP.",
      "Una persona se equivoca una o dos veces; un programa automático, muchas más.",
      "No basta con fallar mucho: fíjate cuál de esas IPs terminó logrando entrar (Accepted password)."
    ],
    "artifact": {
      "type": "log",
      "file": "quien-toco-la-puerta.auth.log",
      "downloadName": "auth.log"
    }
  }
```

`src/content/exercises/quien-toco-la-puerta.md`:
```md
El servidor SSH del laboratorio anda raro desde anoche. El equipo de infraestructura te pasó un extracto de `/var/log/auth.log`.

Analízalo y responde: **¿desde qué IP entró el atacante?**

La flag es esa IP dentro del formato `SAPIENTIAM{...}`. Por ejemplo: `SAPIENTIAM{192.0.2.1}`.
```

`src/content/exercises/quien-toco-la-puerta.explicacion.md`:
```md
## Qué aprendiste

- Esto fue un ataque de **fuerza bruta**: la misma IP probó un usuario y una contraseña tras otra (`root`, `admin`, `test`...) hasta que una funcionó.
- La señal clave en un log es el **patrón**: muchos `Failed password` seguidos de un `Accepted password` desde la misma IP. Una persona real se equivoca una o dos veces, no catorce.

## Cómo se defiende

- **fail2ban** (o similar): bloquea automáticamente las IPs con muchos intentos fallidos.
- **Llaves SSH en vez de contraseñas**: `PasswordAuthentication no` en `/etc/ssh/sshd_config`.
- **Sin login directo de root**: `PermitRootLogin no`.
- Revisar los logs con regularidad (o centralizarlos en un SIEM) para detectarlo a tiempo.
```

`src/content/exercises/quien-toco-la-puerta.auth.log` (35 líneas, exactas):
```
Sep  9 01:58:12 lab-sapientiam sshd[2101]: Accepted publickey for ronald from 192.0.2.10 port 50412 ssh2: ED25519 SHA256:q3Vx8mW2cKp1LzT9sRf0bN7yHd4gJa6uE5oYiXvC2kM
Sep  9 01:58:12 lab-sapientiam sshd[2101]: pam_unix(sshd:session): session opened for user ronald(uid=1001) by (uid=0)
Sep  9 02:03:47 lab-sapientiam sshd[2130]: Failed password for piedrahita from 192.0.2.34 port 51022 ssh2
Sep  9 02:03:55 lab-sapientiam sshd[2130]: Accepted password for piedrahita from 192.0.2.34 port 51022 ssh2
Sep  9 02:03:55 lab-sapientiam sshd[2130]: pam_unix(sshd:session): session opened for user piedrahita(uid=1002) by (uid=0)
Sep  9 02:11:02 lab-sapientiam sshd[2177]: Failed password for invalid user admin from 198.51.100.23 port 40022 ssh2
Sep  9 02:11:05 lab-sapientiam sshd[2177]: Failed password for invalid user admin from 198.51.100.23 port 40022 ssh2
Sep  9 02:11:07 lab-sapientiam sshd[2177]: Connection closed by invalid user admin 198.51.100.23 port 40022 [preauth]
Sep  9 02:14:31 lab-sapientiam sshd[2203]: Failed password for root from 203.0.113.47 port 55110 ssh2
Sep  9 02:14:33 lab-sapientiam sshd[2203]: Failed password for root from 203.0.113.47 port 55110 ssh2
Sep  9 02:14:36 lab-sapientiam sshd[2203]: Failed password for root from 203.0.113.47 port 55110 ssh2
Sep  9 02:14:39 lab-sapientiam sshd[2205]: Failed password for invalid user admin from 203.0.113.47 port 55124 ssh2
Sep  9 02:14:41 lab-sapientiam sshd[2205]: Failed password for invalid user admin from 203.0.113.47 port 55124 ssh2
Sep  9 02:14:44 lab-sapientiam sshd[2207]: Failed password for invalid user test from 203.0.113.47 port 55131 ssh2
Sep  9 02:14:46 lab-sapientiam sshd[2207]: Failed password for invalid user test from 203.0.113.47 port 55131 ssh2
Sep  9 02:14:49 lab-sapientiam sshd[2209]: Failed password for invalid user ubuntu from 203.0.113.47 port 55140 ssh2
Sep  9 02:14:52 lab-sapientiam sshd[2211]: Failed password for invalid user pi from 203.0.113.47 port 55147 ssh2
Sep  9 02:15:10 lab-sapientiam sshd[2215]: Accepted publickey for joseph from 192.0.2.11 port 50430 ssh2: ED25519 SHA256:Zt7pL2wQx9Vn4cRk8mJs1bH6yFd3gTa0uE5oYiXvK2Q
Sep  9 02:15:10 lab-sapientiam sshd[2215]: pam_unix(sshd:session): session opened for user joseph(uid=1003) by (uid=0)
Sep  9 02:15:18 lab-sapientiam sshd[2219]: Failed password for root from 203.0.113.47 port 55162 ssh2
Sep  9 02:15:21 lab-sapientiam sshd[2219]: Failed password for root from 203.0.113.47 port 55162 ssh2
Sep  9 02:15:24 lab-sapientiam sshd[2219]: Failed password for root from 203.0.113.47 port 55162 ssh2
Sep  9 02:15:29 lab-sapientiam sshd[2223]: Failed password for invalid user oracle from 198.51.100.88 port 33510 ssh2
Sep  9 02:15:34 lab-sapientiam sshd[2223]: Connection closed by invalid user oracle 198.51.100.88 port 33510 [preauth]
Sep  9 02:15:40 lab-sapientiam sshd[2226]: Failed password for root from 203.0.113.47 port 55177 ssh2
Sep  9 02:15:43 lab-sapientiam sshd[2226]: Failed password for root from 203.0.113.47 port 55177 ssh2
Sep  9 02:15:47 lab-sapientiam sshd[2226]: Accepted password for root from 203.0.113.47 port 55177 ssh2
Sep  9 02:15:47 lab-sapientiam sshd[2226]: pam_unix(sshd:session): session opened for user root(uid=0) by (uid=0)
Sep  9 02:16:05 lab-sapientiam sshd[2226]: Received disconnect from 203.0.113.47 port 55177:11: disconnected by user
Sep  9 02:16:05 lab-sapientiam sshd[2226]: pam_unix(sshd:session): session closed for user root
Sep  9 02:20:13 lab-sapientiam sshd[2240]: Failed password for invalid user git from 203.0.113.99 port 60001 ssh2
Sep  9 02:20:16 lab-sapientiam sshd[2240]: Connection closed by invalid user git 203.0.113.99 port 60001 [preauth]
Sep  9 02:31:44 lab-sapientiam sshd[2101]: pam_unix(sshd:session): session closed for user ronald
Sep  9 02:47:02 lab-sapientiam sshd[2130]: pam_unix(sshd:session): session closed for user piedrahita
Sep  9 03:02:19 lab-sapientiam sshd[2215]: pam_unix(sshd:session): session closed for user joseph
```

- [ ] **Step 5: Correr las pruebas y comprobar que pasan**

Run: `bun run test`
Expected: PASS en todo:
- integridad de los 3 retos;
- los 3 en orden;
- los solvers 01, 02 y 03 (con **una sola** IP intrusa);
- los rangos RFC 5737.

- [ ] **Step 6: Commit**

```bash
git add src/content/exercises src/features/exercises/api/exercises.test.ts src/features/exercises/solvers.test.ts
git commit -m "feat: retos 02 (web) y 03 (defensa)" -m "Refs #4" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Componentes del detalle

**Files:**
- Modify: `apps/frontend/package.json` (dependencias `react-markdown` y `remark-gfm`; `bun.lock` se actualiza solo)
- Create: `apps/frontend/src/features/exercises/components/Markdown.tsx`
- Create: `apps/frontend/src/features/exercises/components/Artifact.tsx`
- Create: `apps/frontend/src/features/exercises/components/Hints.tsx`
- Create: `apps/frontend/src/features/exercises/components/FlagForm.tsx`

**Interfaces:**
- Consumes:
  - el tipo `Exercise` (Task 4);
  - `checkFlag(input, flagHash): Promise<boolean>` (Task 2).
- Produces:
  - `<Markdown>{text: string}</Markdown>`
  - `<Artifact exercise={Exercise} />`
  - `<Hints hints={string[]} />`
  - `<FlagForm flagHash={string} alreadySolved={boolean} onSolved={() => void} />`

La spec deja las pruebas de interfaz fuera de alcance. Esta tarea se verifica con `lint` y `build`, que incluye `tsc`; la revisión visual se hace en la Task 7.

- [ ] **Step 1: Instalar dependencias**

```bash
cd apps/frontend
bun add react-markdown@^10 remark-gfm@^4
```

- [ ] **Step 2: Crear Markdown.tsx**

`src/features/exercises/components/Markdown.tsx`:
```tsx
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Estilos del tema asignados elemento por elemento (sin @tailwindcss/typography)
const components: Components = {
  h2: ({ children }) => <h2 className="mt-8 mb-3 font-serif text-2xl text-foreground">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-6 mb-2 font-serif text-xl text-foreground">{children}</h3>,
  p: ({ children }) => <p className="my-3 leading-relaxed text-muted">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic text-cyan">{children}</em>,
  ul: ({ children }) => (
    <ul className="my-3 flex list-disc flex-col gap-2 pl-5 text-muted marker:text-lime">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 flex list-decimal flex-col gap-2 pl-5 text-muted marker:text-lime">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-lime underline underline-offset-4">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-2 border-lime pl-4 text-muted">{children}</blockquote>
  ),
  code: ({ children }) => (
    <code className="border border-line bg-panel px-1.5 py-0.5 font-mono text-[0.85em] text-lime">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto border border-line bg-panel p-4 font-mono text-sm [&>code]:border-0 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-foreground">
      {children}
    </pre>
  ),
}

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  )
}
```

- [ ] **Step 3: Crear Artifact.tsx**

`src/features/exercises/components/Artifact.tsx`:
```tsx
import { Check, Copy, Download } from 'lucide-react'
import { useState } from 'react'
import type { Exercise } from '../types'

export function Artifact({ exercise }: { exercise: Exercise }) {
  const { artifact } = exercise
  if (artifact.type === 'text') return <TextArtifact label={artifact.label} value={artifact.value} />
  if (artifact.type === 'hidden') return <HiddenArtifact value={artifact.value} />
  return <LogArtifact content={exercise.artifactContent ?? ''} downloadName={artifact.downloadName} />
}

function TextArtifact({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Sin portapapeles (sitio sin HTTPS o permiso denegado): el texto se puede seleccionar a mano
    }
  }

  return (
    <div className="border border-line bg-panel">
      <div className="flex items-center justify-between border-b border-line px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-muted">
        <span>{label.toUpperCase()}</span>
        <button
          type="button"
          onClick={() => void copy()}
          className="flex items-center gap-1.5 text-lime transition-colors hover:text-foreground"
        >
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <code className="block p-4 font-mono text-sm break-all text-foreground select-all">{value}</code>
    </div>
  )
}

function HiddenArtifact({ value }: { value: string }) {
  return (
    <div className="border border-dashed border-line bg-panel p-8 text-center font-mono text-xs text-muted">
      <p>// nada que ver aquí 👀</p>
      <p hidden data-reto="nada-es-lo-que-parece">
        {value}
      </p>
    </div>
  )
}

function LogArtifact({ content, downloadName }: { content: string; downloadName: string }) {
  return (
    <div className="border border-line bg-panel">
      <div className="flex items-center justify-between border-b border-line px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-muted">
        <span>{downloadName}</span>
        <a
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(content)}`}
          download={downloadName}
          className="flex items-center gap-1.5 text-lime transition-colors hover:text-foreground"
        >
          <Download size={14} aria-hidden="true" /> Descargar
        </a>
      </div>
      <pre className="max-h-80 overflow-auto p-4 font-mono text-[11px] leading-relaxed whitespace-pre text-foreground">
        {content}
      </pre>
    </div>
  )
}
```

- [ ] **Step 4: Crear Hints.tsx**

`src/features/exercises/components/Hints.tsx`:
```tsx
import { Lightbulb, Lock } from 'lucide-react'
import { useState } from 'react'

export function Hints({ hints }: { hints: string[] }) {
  const [revealed, setRevealed] = useState(0)

  return (
    <section aria-label="Pistas" className="flex flex-col gap-3">
      <h2 className="font-mono text-[11px] tracking-[0.12em] text-lime">
        PISTAS · {revealed}/{hints.length}
      </h2>
      <ol className="flex flex-col gap-2">
        {hints.map((hint, index) => (
          <li key={hint} className="border border-line bg-panel p-4 text-sm">
            {index < revealed && (
              <p className="flex gap-3 text-muted">
                <Lightbulb size={16} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />
                {hint}
              </p>
            )}
            {index === revealed && (
              <button
                type="button"
                onClick={() => setRevealed(revealed + 1)}
                className="font-mono text-xs text-foreground transition-colors hover:text-lime"
              >
                Ver pista {index + 1} <span className="ml-2 text-lime">→</span>
              </button>
            )}
            {index > revealed && (
              <span className="flex items-center gap-2 font-mono text-xs text-muted">
                <Lock size={14} aria-hidden="true" /> Pista {index + 1} bloqueada
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
```

- [ ] **Step 5: Crear FlagForm.tsx**

`src/features/exercises/components/FlagForm.tsx`:
```tsx
import { Check } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { checkFlag } from '../lib/checkFlag'

type Status = 'idle' | 'checking' | 'wrong' | 'correct'

interface FlagFormProps {
  flagHash: string
  alreadySolved: boolean
  onSolved: () => void
}

export function FlagForm({ flagHash, alreadySolved, onSolved }: FlagFormProps) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  if (alreadySolved || status === 'correct') {
    return (
      <p role="status" className="flex items-center gap-2 border border-lime bg-panel p-4 font-mono text-sm text-lime">
        <Check size={16} aria-hidden="true" />
        {alreadySolved ? 'Ya resolviste este reto.' : '¡Correcto! Reto resuelto.'}
      </p>
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('checking')
    const correct = await checkFlag(value, flagHash)
    setStatus(correct ? 'correct' : 'wrong')
    if (correct) onSolved()
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-col gap-3">
      <label htmlFor="flag" className="font-mono text-[11px] tracking-[0.12em] text-lime">
        TU FLAG
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="flag"
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            if (status === 'wrong') setStatus('idle')
          }}
          placeholder="SAPIENTIAM{...}"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 border border-line bg-panel px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted focus:border-lime focus:outline-none"
        />
        <button
          type="submit"
          disabled={value.trim() === '' || status === 'checking'}
          className="bg-lime px-5 py-3 font-mono text-xs tracking-wide text-background transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {status === 'checking' ? 'Validando…' : 'Enviar flag'}
        </button>
      </div>
      {status === 'wrong' && (
        <p role="alert" className="font-mono text-xs text-purple">
          ✗ Flag incorrecta. Revisa el formato y vuelve a intentarlo.
        </p>
      )}
    </form>
  )
}
```

- [ ] **Step 6: Pruebas, lint y build**

Run: `bun run test && bun run lint && bun run build`
Expected: todas las pruebas en verde, oxlint sin hallazgos y `✓ built`, sin errores de `tsc`.

- [ ] **Step 7: Commit**

```bash
git add package.json bun.lock src/features/exercises/components
git commit -m "feat: componentes del detalle de un reto (markdown, artefacto, pistas, flag)" -m "Refs #4" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Páginas y rutas

**Files:**
- Create: `apps/frontend/src/features/exercises/labels.ts`
- Create: `apps/frontend/src/features/exercises/components/ExerciseCard.tsx`
- Create: `apps/frontend/src/content/ejercicios.json`
- Modify: `apps/frontend/src/pages/ejercicios/EjerciciosPage.tsx` (se reemplaza el placeholder)
- Create: `apps/frontend/src/pages/ejercicios/EjercicioPage.tsx`
- Modify: `apps/frontend/src/app/router.tsx`

**Interfaces:**
- Consumes:
  - `getExercises`, `getExercise` (Task 4);
  - `getSolved`, `isSolved`, `markSolved` (Task 3);
  - `Markdown`, `Artifact`, `Hints`, `FlagForm` (Task 6).
- Produces:
  - la ruta `/ejercicios/:slug`;
  - `categoryLabels: Record<Category, string>`;
  - `difficultyLabels: Record<Difficulty, string>`.

- [ ] **Step 1: Crear las etiquetas**

`src/features/exercises/labels.ts`:
```ts
import type { Category, Difficulty } from './types'

export const categoryLabels: Record<Category, string> = {
  cripto: 'CRIPTO',
  web: 'WEB',
  defensa: 'DEFENSA',
}

export const difficultyLabels: Record<Difficulty, string> = {
  basico: 'Básico',
}
```

- [ ] **Step 2: Crear ExerciseCard.tsx**

`src/features/exercises/components/ExerciseCard.tsx`:
```tsx
import { Check } from 'lucide-react'
import { Link } from 'react-router'
import { categoryLabels, difficultyLabels } from '../labels'
import type { Exercise } from '../types'

export function ExerciseCard({ exercise, solved }: { exercise: Exercise; solved: boolean }) {
  return (
    <Link
      to={`/ejercicios/${exercise.slug}`}
      className="group flex flex-col gap-4 border border-line bg-panel p-6 transition-colors hover:border-lime"
    >
      <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.12em]">
        <span className="text-lime">
          {exercise.number} · {categoryLabels[exercise.category]}
        </span>
        {solved ? (
          <span className="flex items-center gap-1 text-lime">
            <Check size={14} aria-hidden="true" /> RESUELTO
          </span>
        ) : (
          <span className="text-muted">{difficultyLabels[exercise.difficulty]}</span>
        )}
      </div>
      <h2 className="font-serif text-2xl leading-tight transition-colors group-hover:text-lime">{exercise.title}</h2>
      <p className="text-sm leading-relaxed text-muted">{exercise.summary}</p>
      <span className="mt-auto font-mono text-xs text-foreground">
        Resolver <span className="ml-2 text-lime">→</span>
      </span>
    </Link>
  )
}
```

- [ ] **Step 3: Crear el copy de las páginas**

`src/content/ejercicios.json`:
```json
{
  "list": {
    "sectionLabel": "PRÁCTICA",
    "heading": { "line": "Retos para", "emphasis": "empezar." },
    "description": "Tres retos cortos para entrenar tu mirada de seguridad. Todo se resuelve desde el navegador, sin instalar nada ni crear cuentas. Tu progreso se guarda en este dispositivo.",
    "solvedLabel": "RESUELTOS"
  },
  "detail": {
    "backLabel": "← Todos los retos",
    "explanationLabel": "EXPLICACIÓN",
    "notFound": {
      "title": "Este reto no existe.",
      "description": "Puede que el enlace esté mal escrito o que el reto ya no esté disponible.",
      "cta": "Ver todos los retos"
    }
  }
}
```

- [ ] **Step 4: Reemplazar EjerciciosPage.tsx**

`src/pages/ejercicios/EjerciciosPage.tsx` (reemplaza todo el archivo):
```tsx
import { useState } from 'react'
import content from '../../content/ejercicios.json'
import { getExercises } from '../../features/exercises/api/exercises'
import { ExerciseCard } from '../../features/exercises/components/ExerciseCard'
import { getSolved } from '../../features/exercises/progress'

export function EjerciciosPage() {
  const exercises = getExercises()
  const [solved] = useState(getSolved)
  const solvedCount = exercises.filter((exercise) => solved.includes(exercise.slug)).length
  const { list } = content

  return (
    <main className="mx-auto w-[calc(100%-40px)] py-20 sm:w-[min(1180px,calc(100%-72px))] lg:py-28">
      <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-lime">
        <span>{list.sectionLabel}</span>
        <i className="h-px w-8 bg-line not-italic" />
        <span>
          {solvedCount}/{exercises.length} {list.solvedLabel}
        </span>
      </div>

      <h1 className="mt-6 font-serif text-4xl leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
        {list.heading.line}
        <br />
        <span className="italic text-cyan">{list.heading.emphasis}</span>
      </h1>

      <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">{list.description}</p>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {exercises.map((exercise) => (
          <ExerciseCard key={exercise.slug} exercise={exercise} solved={solved.includes(exercise.slug)} />
        ))}
      </div>
    </main>
  )
}
```

- [ ] **Step 5: Crear EjercicioPage.tsx**

`src/pages/ejercicios/EjercicioPage.tsx`:
```tsx
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import content from '../../content/ejercicios.json'
import { getExercise } from '../../features/exercises/api/exercises'
import { Artifact } from '../../features/exercises/components/Artifact'
import { FlagForm } from '../../features/exercises/components/FlagForm'
import { Hints } from '../../features/exercises/components/Hints'
import { Markdown } from '../../features/exercises/components/Markdown'
import { categoryLabels, difficultyLabels } from '../../features/exercises/labels'
import { isSolved, markSolved } from '../../features/exercises/progress'
import type { Exercise } from '../../features/exercises/types'

const { detail } = content

export function EjercicioPage() {
  const { slug = '' } = useParams()
  const exercise = getExercise(slug)

  return (
    <main className="mx-auto w-[calc(100%-40px)] py-16 sm:w-[min(1180px,calc(100%-72px))] lg:py-20">
      <Link to="/ejercicios" className="font-mono text-xs text-muted transition-colors hover:text-lime">
        {detail.backLabel}
      </Link>
      {/* key: al pasar de un reto a otro se reinician pistas y formulario */}
      {exercise ? <ExerciseDetail key={exercise.slug} exercise={exercise} /> : <NotFound />}
    </main>
  )
}

function ExerciseDetail({ exercise }: { exercise: Exercise }) {
  const [initiallySolved] = useState(() => isSolved(exercise.slug))
  const [solved, setSolved] = useState(initiallySolved)

  const handleSolved = () => {
    markSolved(exercise.slug)
    setSolved(true)
  }

  return (
    <article className="mt-10 flex max-w-3xl flex-col gap-10">
      <header>
        <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-lime">
          <span>{exercise.number}</span>
          <i className="h-px w-8 bg-line not-italic" />
          <span>{categoryLabels[exercise.category]}</span>
          <span className="text-muted">· {difficultyLabels[exercise.difficulty]}</span>
        </div>
        <h1 className="mt-6 font-serif text-4xl leading-[1.04] tracking-tight sm:text-5xl">{exercise.title}</h1>
      </header>

      <div>
        <Markdown>{exercise.statement}</Markdown>
      </div>

      <Artifact exercise={exercise} />
      <Hints hints={exercise.hints} />
      <FlagForm flagHash={exercise.flagHash} alreadySolved={initiallySolved} onSolved={handleSolved} />

      {solved && (
        <section aria-label={detail.explanationLabel} className="border-t border-line pt-8">
          <h2 className="font-mono text-[11px] tracking-[0.12em] text-lime">{detail.explanationLabel}</h2>
          <Markdown>{exercise.explanation}</Markdown>
        </section>
      )}
    </article>
  )
}

function NotFound() {
  return (
    <section className="mt-10 flex max-w-xl flex-col gap-5">
      <h1 className="font-serif text-4xl leading-[1.04] tracking-tight">{detail.notFound.title}</h1>
      <p className="text-[15px] leading-relaxed text-muted">{detail.notFound.description}</p>
      <Link
        to="/ejercicios"
        className="inline-flex w-fit items-center bg-lime px-5 py-4 font-mono text-xs tracking-wide text-background transition-transform hover:-translate-y-0.5"
      >
        {detail.notFound.cta} <span className="ml-3">→</span>
      </Link>
    </section>
  )
}
```

- [ ] **Step 6: Registrar la ruta**

`src/app/router.tsx` (reemplaza todo el archivo):
```tsx
import { createBrowserRouter } from 'react-router'
import { Layout } from '../components/layout/Layout'
import { EjercicioPage } from '../pages/ejercicios/EjercicioPage'
import { EjerciciosPage } from '../pages/ejercicios/EjerciciosPage'
import { HomePage } from '../pages/home/HomePage'
import { NosotrosPage } from '../pages/nosotros/NosotrosPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/nosotros', element: <NosotrosPage /> },
      { path: '/ejercicios', element: <EjerciciosPage /> },
      { path: '/ejercicios/:slug', element: <EjercicioPage /> },
    ],
  },
])
```

- [ ] **Step 7: Pruebas, lint y build**

Run: `bun run test && bun run lint && bun run build`
Expected: todo en verde y `✓ built`.

- [ ] **Step 8: Revisión manual en el navegador**

Run: `bun run dev` y abre `http://localhost:5173/ejercicios`.

Comprueba cada punto:
1. **Listado:**
   - se ven 3 tarjetas (01 CRIPTO, 02 WEB, 03 DEFENSA) y el contador dice "0/3 RESUELTOS";
   - el link "Ejercicios" del header queda activo.
2. **Reto 01:**
   - "Copiar" copia la cadena;
   - las pistas se abren de a una;
   - con el campo vacío, el botón está deshabilitado;
   - con una flag incorrecta aparece el mensaje de error, y al escribir de nuevo desaparece;
   - con la flag correcta de [[Flags de los retos]] aparece "¡Correcto!" y la explicación.
3. **Reto 02:** la flag está en DevTools → Elements, en un `<p hidden data-reto="nada-es-lo-que-parece">`, y la acepta.
4. **Reto 03:**
   - el log se ve completo;
   - "Descargar" baja `auth.log`;
   - la flag con la IP la acepta.
5. **Recarga en `/ejercicios`:**
   - el contador dice "3/3 RESUELTOS" y las tarjetas tienen ✓;
   - al entrar a un reto resuelto se ve "Ya resolviste este reto." y la explicación.
6. **`/ejercicios/no-existe`:** muestra "Este reto no existe." y el botón vuelve al listado.
7. **Vista móvil** (DevTools, ~390 px): no hay scroll horizontal y el log se desplaza dentro de su caja.
8. **Limpieza:** en DevTools → Application → Local Storage, borra `sapientiam:ejercicios:resueltos`; al recargar vuelve a "0/3".

- [ ] **Step 9: Commit**

```bash
git add src/features/exercises/labels.ts src/features/exercises/components/ExerciseCard.tsx src/content/ejercicios.json src/pages/ejercicios src/app/router.tsx
git commit -m "feat: páginas /ejercicios y /ejercicios/:slug" -m "Refs #4" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Cierre, vault y PR

**Files:**
- Modify: `docs/02 Estado/Estado actual.md` (fila del #4)
- Modify: `docs/02 Estado/Pendientes.md` (P-01)
- Create: `docs/Equipo/Joseph/Bitacora/<AAAA-MM-DD>.md` (fecha del día en que se ejecuta; usa la plantilla `_plantillas/Bitacora diaria.md`)
- Modify: `docs/Equipo/Joseph/Joseph.md` (tareas)

**Interfaces:**
- Consumes: todo lo anterior.
- Produces: la rama lista para el PR.

- [ ] **Step 1: Verificación completa**

Run (en `apps/frontend`): `bun run test && bun run lint && bun run build`
Expected: todas las pruebas en verde, 0 hallazgos y `✓ built`. Anota en la bitácora el número de pruebas y el tamaño del bundle que imprime el build.

- [ ] **Step 2: Actualizar el vault**

- `docs/02 Estado/Estado actual.md`: en la tabla de issues, la fila del #4 pasa a `🟡 En revisión (PR abierto)`. En "Qué falta para la primera entrega", marca `[x]` en la línea de `/ejercicios`.
- `docs/02 Estado/Pendientes.md`: en P-01, cambia el estado `en progreso` por `en revisión`.
- `docs/Equipo/Joseph/Joseph.md`: marca `[x]` en la tarea del #4.
- La bitácora del día debe incluir:
  - qué se implementó;
  - el resultado de las pruebas;
  - lo aprendido: stub de `localStorage`/`crypto` en Vitest, y que `react-markdown` no muestra HTML crudo.

Luego verifica los wikilinks con el script que se usó al crear el vault: 0 rotos.

- [ ] **Step 3: Commit**

```bash
git add docs
git commit -m "docs: estado y bitácora del #4" -m "Refs #4" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

- [ ] **Step 4: Subir la rama**

```bash
git push -u origin feature/4-pagina-ejercicios
```
El push va por SSH (ya está configurado `remote.origin.pushurl`).

- [ ] **Step 5: Abrir el PR hacia `main`**

**Título:** `feat: página /ejercicios con 3 retos tipo CTF`

**Cuerpo:**
```markdown
## Summary
- `/ejercicios`: listado de 3 retos con progreso ("N/3 resueltos") guardado en el navegador
- `/ejercicios/:slug`: enunciado en markdown, artefacto (texto, elemento oculto o log descargable), pistas progresivas, validación de flag por SHA-256 y explicación al resolver
- Retos: 01 Cripto (Base64 + César), 02 Web (DOM oculto), 03 Defensa (fuerza bruta en auth.log)
- Nuevo `src/features/exercises/` (api, lib, components); react-markdown, remark-gfm y Vitest

## Notas
- Depende del #11 (vault): la spec y el plan están en `docs/`. Mergear primero el #11.
- Solo se guardan hashes en el código; las flags están en `docs/01 Proyecto/Flags de los retos.md` (DEC-007).

## Test plan
- [x] `bun run test`: sha256, checkFlag, progress, integridad del contenido y solvers de los 3 retos
- [x] `bun run lint` y `bun run build`
- [x] Revisión manual: los 3 retos resueltos, progreso tras recargar, slug inexistente, vista móvil

Closes #4

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```
