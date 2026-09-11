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
    const ips = [...log.matchAll(/\b(\d{1,3}(?:\.\d{1,3}){3})\b/g)].map((match) => match[1])
    expect(ips.length).toBeGreaterThan(0)
    for (const ip of ips) expect(ip).toMatch(/^(192\.0\.2|198\.51\.100|203\.0\.113)\.\d{1,3}$/)
  })
})
