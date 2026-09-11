import { describe, expect, it } from 'vitest'
import { getExercise } from './api/exercises'
import { parseKeyValueLog } from './lib/parseKeyValueLog'
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

// Respuestas que el reto 02 pide por red: se sirven desde public/ y no pasan por el bundle
const publicApiFiles = import.meta.glob<string>('../../../public/api/v1/*.json', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function readPublicJson(path: string): unknown {
  const content = publicApiFiles[`../../../public${path}`]
  if (content === undefined) throw new Error(`No existe public${path}`)
  return JSON.parse(content)
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')))
}

// Campos de una línea de log de FortiGate, como objeto para leerlos por nombre
function parseFortigate(line: string): Record<string, string> {
  return Object.fromEntries(parseKeyValueLog(line))
}

// Nombres de país tal como los escribe FortiGate → código ISO 3166-1 alfa-2
const ISO_CODES: Record<string, string> = {
  'Korea, Republic of': 'kr',
  "Korea, Democratic People's Republic of": 'kp',
  Colombia: 'co',
}

describe('los retos se pueden resolver', () => {
  it('01 mensaje-interceptado: Base64 y luego César −3', async () => {
    const exercise = getExercise('mensaje-interceptado')
    expect(exercise?.artifact.type).toBe('text')
    if (exercise?.artifact.type !== 'text') return
    const flag = caesarShift(atob(exercise.artifact.value), -3)
    expect(await sha256Hex(flag)).toBe(exercise.flagHash)
  })

  it('02 nada-es-lo-que-parece: la flag viaja dentro del JWT de una respuesta de red', async () => {
    const exercise = getExercise('nada-es-lo-que-parece')
    expect(exercise?.artifact.type).toBe('network')
    if (exercise?.artifact.type !== 'network') return
    const tokens = exercise.artifact.requests
      .map(readPublicJson)
      .flatMap((body) =>
        body && typeof body === 'object' && 'token' in body && typeof body.token === 'string' ? [body.token] : [],
      )
    expect(tokens).toHaveLength(1)
    const flag = Object.values(decodeJwtPayload(tokens[0])).find(
      (value) => typeof value === 'string' && value.startsWith('SAPIENTIAM{'),
    )
    expect(await sha256Hex(String(flag))).toBe(exercise.flagHash)
  })

  it('02 no deja ninguna flag en el contenido que va al bundle', () => {
    const exercise = getExercise('nada-es-lo-que-parece')
    expect(JSON.stringify(exercise)).not.toMatch(/SAPIENTIAM\{[a-z0-9_]+\}/)
  })

  it('03 quien-toco-la-puerta: una sola IP hizo fuerza bruta y entró', async () => {
    const exercise = getExercise('quien-toco-la-puerta')
    expect(exercise?.artifact.type).toBe('log')
    const intruders = findBruteForceIntruders(exercise?.artifactContent ?? '')
    expect(intruders).toHaveLength(1)
    expect(await sha256Hex(`SAPIENTIAM{${intruders[0]}}`)).toBe(exercise?.flagHash)
  })

  it('04 alerta-desde-corea: código ISO del país y dueño de la IP de origen', async () => {
    const exercise = getExercise('alerta-desde-corea')
    expect(exercise?.artifact.type).toBe('log')
    const fields = parseFortigate(exercise?.artifactContent ?? '')
    const country = ISO_CODES[fields.srccountry]
    const owner = (fields.srcinetsvc ?? '').split('-')[0].toLowerCase()
    expect(await sha256Hex(`SAPIENTIAM{${country}_${owner}}`)).toBe(exercise?.flagHash)
  })

  it('04 no expone la infraestructura real del destino', () => {
    const fields = parseFortigate(getExercise('alerta-desde-corea')?.artifactContent ?? '')
    expect(fields.dstip).toMatch(/^(192\.0\.2|198\.51\.100|203\.0\.113)\.\d{1,3}$/)
    expect(fields.tranip).toMatch(/^10\./)
    expect(fields.devid).toMatch(/^FG\w+0{8}$/)
  })

  it('03 usa solo IPs de documentación (RFC 5737)', () => {
    const log = getExercise('quien-toco-la-puerta')?.artifactContent ?? ''
    const ips = [...log.matchAll(/\b(\d{1,3}(?:\.\d{1,3}){3})\b/g)].map((match) => match[1])
    expect(ips.length).toBeGreaterThan(0)
    for (const ip of ips) expect(ip).toMatch(/^(192\.0\.2|198\.51\.100|203\.0\.113)\.\d{1,3}$/)
  })
})
