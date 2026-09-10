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
