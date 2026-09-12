import { describe, expect, it } from 'vitest'
import { canRevealNext, HINT_DELAYS_MS, nextHintAvailableAt, remainingMs } from './hintTimer'

const MINUTE = 60_000

describe('HINT_DELAYS_MS', () => {
  it('escalona las pistas en 2, 4 y 6 minutos', () => {
    expect(HINT_DELAYS_MS).toEqual([2 * MINUTE, 4 * MINUTE, 6 * MINUTE])
  })
})

describe('nextHintAvailableAt', () => {
  it('habilita la primera pista 2 minutos después de abrir el reto', () => {
    expect(nextHintAvailableAt({ openedAt: 1_000, revealedAt: [] })).toBe(1_000 + 2 * MINUTE)
  })

  it('cuenta la segunda pista desde que se reveló la primera', () => {
    expect(nextHintAvailableAt({ openedAt: 0, revealedAt: [150_000] })).toBe(150_000 + 4 * MINUTE)
  })

  it('cuenta la tercera pista desde que se reveló la segunda', () => {
    expect(nextHintAvailableAt({ openedAt: 0, revealedAt: [2 * MINUTE, 7 * MINUTE] })).toBe(7 * MINUTE + 6 * MINUTE)
  })

  it('usa el último tiempo si hay más pistas que tiempos', () => {
    expect(nextHintAvailableAt({ openedAt: 0, revealedAt: [1, 2, 3] })).toBe(3 + 6 * MINUTE)
  })
})

describe('canRevealNext', () => {
  const clock = { openedAt: 0, revealedAt: [] }

  it('bloquea la pista antes de tiempo', () => {
    expect(canRevealNext(clock, 2 * MINUTE - 1, 3)).toBe(false)
  })

  it('la habilita justo al cumplirse el tiempo', () => {
    expect(canRevealNext(clock, 2 * MINUTE, 3)).toBe(true)
  })

  it('no habilita nada cuando ya se revelaron todas las pistas', () => {
    expect(canRevealNext({ openedAt: 0, revealedAt: [1, 2, 3] }, 100 * MINUTE, 3)).toBe(false)
  })
})

describe('remainingMs', () => {
  it('devuelve el tiempo que falta', () => {
    expect(remainingMs({ openedAt: 0, revealedAt: [] }, 30_000)).toBe(2 * MINUTE - 30_000)
  })

  it('devuelve 0 cuando la pista ya está disponible', () => {
    expect(remainingMs({ openedAt: 0, revealedAt: [] }, 5 * MINUTE)).toBe(0)
  })
})
