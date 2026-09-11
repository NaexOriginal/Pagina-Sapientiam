import { describe, expect, it } from 'vitest'
import { decodeHint, encodeHint } from './hintCodec'

describe('hintCodec', () => {
  it('decodifica Base64 de texto UTF-8 con tildes y signos', () => {
    expect(decodeHint('wr9Qb3IgcXXDqT8=')).toBe('¿Por qué?')
  })

  it('codifica y decodifica sin perder nada', () => {
    const hint = 'Un token con dos puntos (xxx.yyy.zzz) es un JWT: su parte central está en Base64URL → ñ "=="'
    expect(decodeHint(encodeHint(hint))).toBe(hint)
  })

  it('el texto codificado no contiene la pista en claro', () => {
    expect(encodeHint('Revisa la pestaña Network')).not.toContain('Network')
  })

  it('lanza error si el texto no es Base64 válido', () => {
    expect(() => decodeHint('esto no es base64 ¿?')).toThrow()
  })
})
