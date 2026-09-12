---
tipo: guia
actualizado: 2026-09-11
aliases: [Guía: crear un reto, Cómo crear un reto]
---

# Guía: crear un reto

Paso a paso para agregar un reto nuevo a `/ejercicios`. Un reto es **contenido** (un JSON y dos markdown) más, a veces, un archivo extra (un `.log` o respuestas de red). Si usas un tipo de artefacto que ya existe, **no hay que tocar componentes ni páginas**: el listado, el detalle, las pistas y la validación se arman solos.

Referencias: [[2026-09-10 Diseno pagina ejercicios]] (diseño completo) · [[DEC-006 Retos en JSON y markdown con react-markdown]] · [[DEC-007 Validacion de flags por hash y flags en el vault]] · [[Flags de los retos]]

> [!important] Reglas de oro
> - **Todo se resuelve con el navegador.** No hay backend: nada de servidores vulnerables, máquinas virtuales ni herramientas que el estudiante tenga que instalar.
> - **La flag nunca va en claro en el código.** En el repo solo va su hash SHA-256. El enunciado, la explicación y las pruebas tampoco la escriben.
> - **Nada real.** IPs de documentación (RFC 5737: `192.0.2.x`, `198.51.100.x`, `203.0.113.x`), correos `@example.com`, nombres inventados. Ningún reto apunta a sitios de terceros. **Única excepción:** en retos de OSINT se puede usar una IP pública de un proveedor de nube (como la de Azure del reto 04) para que whois/RDAP y VirusTotal funcionen; nunca datos de una organización real (sus IPs, seriales o nombres). Si partes de un log real, anonimiza todo lo del lado de la víctima.
> - **El equipo no aparece en la plataforma.** Ni nuestros nombres, usuarios de GitHub ni correos personales en retos, logs, tokens o textos. Los escenarios usan organizaciones y personas ficticias (por ejemplo, "una empresa de logística" y usuarios como `mgarcia`).
> - **Un reto, una idea.** Cada reto enseña una cosa concreta y la explica al final.

---

## 1. Diseña el reto (antes de tocar código)

Llena esta tabla, idealmente en un issue de GitHub o en un acta:

| Campo | Qué decidir | Ejemplo (reto 01) |
|---|---|---|
| Slug | Identificador en la URL, en minúsculas, con guiones, sin tildes ni `ñ` | `mensaje-interceptado` |
| Número | El siguiente libre, con dos dígitos | `01` |
| Título | Corto y con gancho | Mensaje interceptado |
| Categoría | `cripto`, `web` o `defensa` (o una nueva, ver paso 7) | `cripto` |
| Dificultad | `basico` o `intermedio` (o una nueva, ver paso 7) | `basico` |
| Resumen | Una línea para la tarjeta del listado | Un mensaje extraño viajó por la red… |
| Qué enseña | La idea que el estudiante se lleva | Base64 no es cifrado |
| Cómo se resuelve | Los pasos exactos, uno por uno | Decodificar Base64 → César −3 |
| Artefacto | Qué material recibe el estudiante (ver sección siguiente) | `text` |
| Flag | `SAPIENTIAM{...}` en minúsculas y con `_`, idealmente con relación a la lección | `SAPIENTIAM{codificar_no_es_cifrar}` |
| 3 pistas | De la más vaga a la más directa, sin regalar la flag | ¿Por qué termina en `==`? |

## 2. Elige el tipo de artefacto

El artefacto es el material del reto que aparece debajo del enunciado.

| Tipo | Qué ve el estudiante | Dónde va el contenido | Campos en el JSON | Usado en |
|---|---|---|---|---|
| `text` | Un bloque de texto con botón "Copiar" | En el propio JSON | `label`, `value` | Reto 01 |
| `network` | Un panel "Sesión"; la página pide archivos al cargar y el reto se resuelve en DevTools → Network | `apps/frontend/public/...` (se sirven tal cual, no pasan por el bundle) | `requests`: lista de rutas que empiezan con `/` | Reto 02 |
| `log` | Un log con scroll y botón "Descargar". Con `"format": "kv"` (logs `clave=valor`, como FortiGate) la línea se ajusta al ancho y aparecen los botones **Crudo / Campos**; Campos muestra una tabla campo → valor | `apps/frontend/src/content/exercises/<archivo>.log` | `file`, `downloadName`, `format` opcional (`"kv"`) | Retos 03 y 04 |

> [!note] ¿Ninguno te sirve?
> Un tipo nuevo sí requiere código: agregarlo a la unión `Artifact` en `apps/frontend/src/features/exercises/types.ts`, crear su componente en `components/Artifact.tsx` y, si carga archivos de `content/`, extender `api/exercises.ts`. Coméntalo con el equipo y regístralo como una DEC nueva antes de hacerlo.

---

## 3. Paso a paso

Todos los comandos se corren desde `apps/frontend` salvo los de git. Tabla de referencia de rutas:

| Qué | Ruta |
|---|---|
| Datos de todos los retos | `apps/frontend/src/content/exercises/exercises.json` |
| Enunciado y explicación | `apps/frontend/src/content/exercises/<slug>.md` y `<slug>.explicacion.md` |
| Pruebas | `apps/frontend/src/features/exercises/solvers.test.ts` y `api/exercises.test.ts` |
| Tipos y etiquetas | `apps/frontend/src/features/exercises/types.ts` y `labels.ts` |

### Paso 1. Crea la rama
Crea antes un issue con la tabla del diseño. Luego:
```bash
git switch main && git pull
git switch -c feature/<issue>-reto-<slug>
```

### Paso 2. Escribe el enunciado
Archivo `apps/frontend/src/content/exercises/<slug>.md`. Es markdown normal (negritas, listas, `código`, tablas). El HTML crudo **no** se muestra.
```md
<Contexto corto: qué pasó y por qué importa.>

**Tu misión:** <qué tiene que encontrar>. La flag tiene el formato `SAPIENTIAM{...}`.

> <Un tip opcional: qué herramienta alcanza, sin revelar el camino.>
```
No escribas la flag ni el paso a paso de la solución.

### Paso 3. Escribe la explicación
Archivo `apps/frontend/src/content/exercises/<slug>.explicacion.md`. Se muestra **solo** al resolver el reto.
```md
## Qué aprendiste

- <La idea central, en una o dos frases.>
- <Un detalle técnico que la refuerza.>

## Cómo se defiende

- <Qué hace un equipo de seguridad para evitar o detectar esto.>
```
Ojo: aunque se muestre al final, la explicación va dentro del JavaScript del sitio. Tampoco escribas la flag aquí.

### Paso 4. Crea los archivos del artefacto (si aplica)
- **`text`:** no hace falta archivo; el valor va en el JSON (paso 6).
- **`log`:** guarda el archivo en `apps/frontend/src/content/exercises/<archivo>.log`. El `.gitignore` de la raíz ignora los `*.log`, pero tiene una excepción solo para esa carpeta: si lo guardas en otro lugar, git no lo versiona.
- **`network`:** guarda las respuestas en `apps/frontend/public/<ruta>` (por ejemplo `public/api/v1/algo.json`). En el JSON del reto, `requests` lleva la ruta **sin** `public` y empezando con `/` (por ejemplo `"/api/v1/algo.json"`). Cualquiera puede abrir esos archivos por su URL: úsalo solo cuando inspeccionar la red sea la lección.

### Paso 5. Calcula el hash de la flag
```bash
printf '%s' 'SAPIENTIAM{tu_flag}' | sha256sum
```
Copia los 64 caracteres (sin el `-` del final).
- Usa `printf '%s'` y **no** `echo`: `echo` agrega un salto de línea y el hash sale distinto.
- La validación quita los espacios de los extremos de lo que escribe el estudiante, pero **distingue mayúsculas**. Escribe la flag exactamente como la esperas.

### Paso 6. Agrega la entrada en `exercises.json`
Agrégala **al final** del array; el orden del archivo es el orden del listado. No olvides la coma después de la entrada anterior.
```json
  {
    "slug": "<slug>",
    "number": "04",
    "title": "<Título>",
    "category": "cripto",
    "difficulty": "basico",
    "summary": "<Una línea para la tarjeta>",
    "flagHash": "<64 caracteres del paso 5>",
    "hints": [
      "<Pista 1 en Base64: la más vaga>",
      "<Pista 2 en Base64: señala dónde mirar>",
      "<Pista 3 en Base64: casi el método, sin la respuesta>"
    ],
    "artifact": { "type": "text", "label": "<Nombre del material>", "value": "<contenido>" }
  }
```
Formas del campo `artifact` según el tipo:
```json
{ "type": "text", "label": "Mensaje interceptado", "value": "VkRT..." }
{ "type": "network", "requests": ["/api/v1/config.json", "/api/v1/sesion.json"] }
{ "type": "log", "file": "<archivo>.log", "downloadName": "auth.log" }
{ "type": "log", "file": "<archivo>.log", "downloadName": "firewall.log", "format": "kv" }
```
Deben ser **exactamente 3 pistas** y distintas entre sí (lo verifica una prueba).

**Las pistas van codificadas en Base64**, para que no se puedan leer en el código del sitio antes de tiempo. Escríbelas en claro y codifica cada una así:
```bash
printf '%s' 'Lee srccountry despacio. ¿Cómo se llama oficialmente cada una de las dos Coreas?' | base64 -w0
```
Pega el resultado entre comillas en `hints`. La página las decodifica solo al revelarlas. Para leer una pista ya codificada: `printf '%s' '<base64>' | base64 -d`.

**Temporizador:** cada pista se desbloquea sola tras una espera, contada desde que se abre el reto (pista 1) o desde la pista anterior (2 y 3): **2, 4 y 6 minutos** (`HINT_DELAYS_MS` en `features/exercises/lib/hintTimer.ts`). Escribe las pistas pensando en eso: la primera llega a quien ya lo intentó un rato, no a quien acaba de entrar.

### Paso 7. Categoría o dificultad nueva (solo si hace falta)
Agrégala al tipo en `apps/frontend/src/features/exercises/types.ts` y su etiqueta en `labels.ts`:
```ts
// types.ts
export type Category = 'cripto' | 'web' | 'defensa' | 'forense'

// labels.ts
export const categoryLabels: Record<Category, string> = {
  cripto: 'CRIPTO',
  web: 'WEB',
  defensa: 'DEFENSA',
  forense: 'FORENSE',
}
```
TypeScript avisa si falta una etiqueta, y la prueba de integridad falla si el JSON usa un valor que no existe.

### Paso 8. Escribe la prueba solver
En `apps/frontend/src/features/exercises/solvers.test.ts`, dentro del `describe`, agrega una prueba que **resuelva el reto a partir de su contenido**, igual que un estudiante, y compare el hash. Así se garantiza que el reto tiene solución sin escribir la flag en el repo.
```ts
  it('04 <slug>: <cómo se resuelve en pocas palabras>', async () => {
    const exercise = getExercise('<slug>')
    expect(exercise?.artifact.type).toBe('text')
    if (exercise?.artifact.type !== 'text') return
    const flag = resolverMiReto(exercise.artifact.value) // función tuya que hace los pasos de la solución
    expect(await sha256Hex(flag)).toBe(exercise.flagHash)
  })
```
- Para un `log`, el contenido está en `exercise.artifactContent` (mira la prueba del reto 03).
- Para `network`, usa `readPublicJson(ruta)` que ya existe en el archivo (mira la prueba del reto 02).

En `apps/frontend/src/features/exercises/api/exercises.test.ts`, agrega tu slug a la lista de la prueba "tiene los 3 retos en orden" y actualiza el número del título.

La prueba de integridad (`it.each(exercises)`) revisa sola que existan los dos markdown, que el hash tenga 64 caracteres hex, que haya 3 pistas únicas y que la categoría y la dificultad sean válidas.

### Paso 9. Actualiza los textos que mencionan la cantidad de retos
- `apps/frontend/src/content/ejercicios.json` → `list.description` dice "Tres retos cortos…".
- `apps/frontend/src/content/home.json` → el stat `"value": "03"` ("ejercicios para comenzar") y `practice.description` ("Tres ejercicios…"). Ver P-11 en [[Pendientes]].
- `apps/frontend/src/pages/ejercicios/EjerciciosPage.tsx` usa `md:grid-cols-3`: con 4 retos, la cuarta tarjeta queda sola en otra fila. Decide si cambiar la grilla (por ejemplo `md:grid-cols-2`).

El contador "N/M resueltos" del listado se calcula solo.

### Paso 10. Verifica
```bash
cd apps/frontend
bun run test     # todas en verde, incluida tu prueba solver
bun run lint     # 0 hallazgos
bun run build    # ✓ built
bun run dev      # http://localhost:5173/ejercicios
```
En el navegador:
- [ ] La tarjeta aparece en el listado con número, categoría, dificultad y resumen.
- [ ] El detalle muestra enunciado, artefacto, pistas (se abren de a una) y el campo de la flag.
- [ ] Una flag incorrecta muestra el error; la correcta muestra "¡Correcto!" y la explicación.
- [ ] Al recargar, el reto sigue resuelto y el contador sube.
- [ ] En móvil (~390 px) no hay scroll horizontal.
- [ ] Resuelve el reto de verdad, siguiendo solo el enunciado y las pistas, como si no supieras la respuesta. Si te cuesta demasiado, mejora las pistas.

### Paso 11. Registra en el vault
- Agrega la fila en [[Flags de los retos]] (número, slug, flag y hash) y, si tiene cadenas especiales, cómo se construyen. Recuerda que el repo es público.
- Anota el avance en tu bitácora del día.
- Quien mergee el PR lo agrega a [[Historial de cambios]].

### Paso 12. Commit y PR
```bash
git add apps/frontend docs
git commit -m "feat: reto <número> <título corto>" -m "Refs #<issue>"
git push -u origin feature/<issue>-reto-<slug>
```
Abre el PR hacia `main` con `Closes #<issue>`. Sigue el formato de [[Flujo de trabajo]].

---

## Checklist rápido

- [ ] Diseño con slug, número, categoría, dificultad, lección, solución, flag y 3 pistas
- [ ] `<slug>.md` y `<slug>.explicacion.md`, sin la flag
- [ ] Archivos del artefacto en su lugar (`content/exercises/` o `public/`)
- [ ] Hash calculado con `printf '%s' … | sha256sum`
- [ ] Las 3 pistas codificadas con `printf '%s' … | base64 -w0`
- [ ] Entrada al final de `exercises.json`
- [ ] Tipo y etiqueta nuevos (solo si hacía falta)
- [ ] Prueba solver y lista de slugs en `exercises.test.ts`
- [ ] Textos con la cantidad de retos y grilla del listado
- [ ] `test`, `lint`, `build` y revisión en el navegador
- [ ] Fila en [[Flags de los retos]] y bitácora

## Errores comunes

| Síntoma | Causa probable |
|---|---|
| La prueba solver falla aunque la flag es correcta | Hash calculado con `echo` (salto de línea extra) o con otra mayúscula/minúscula |
| Falla "tiene enunciado, explicación, hash y 3 pistas codificadas" | El nombre del `.md` no coincide con el slug, hay 2 o 4 pistas, hay dos pistas iguales, o alguna pista quedó en claro (sin codificar en Base64) |
| Falla "tiene los N retos en orden" | Falta agregar el slug nuevo a la lista de `exercises.test.ts` |
| El `.log` no aparece en `git status` | Está fuera de `apps/frontend/src/content/exercises/`, donde el `.gitignore` lo ignora |
| El panel del reto dice "No se pudo cargar la sesión" | La ruta en `requests` no empieza con `/`, o el archivo no está en `public/` con ese nombre exacto |
| La tarjeta muestra una categoría vacía | La categoría del JSON no existe en `labels.ts` (la prueba de integridad también lo avisa) |
| La flag aparece en el JavaScript del sitio | Quedó escrita en el enunciado, la explicación o un artefacto `text`/`log` en claro |
