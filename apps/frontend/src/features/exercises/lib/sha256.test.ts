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
