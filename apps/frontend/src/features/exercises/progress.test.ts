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
