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
