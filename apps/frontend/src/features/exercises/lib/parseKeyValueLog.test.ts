import { describe, expect, it } from 'vitest'
import { parseKeyValueLog } from './parseKeyValueLog'

describe('parseKeyValueLog', () => {
  it('separa los pares clave=valor en su orden original', () => {
    expect(parseKeyValueLog('a=1 b=dos c=3')).toEqual([
      ['a', '1'],
      ['b', 'dos'],
      ['c', '3'],
    ])
  })

  it('respeta los valores entre comillas con espacios y comas', () => {
    expect(parseKeyValueLog('srccountry="Korea, Republic of" action="accept"')).toEqual([
      ['srccountry', 'Korea, Republic of'],
      ['action', 'accept'],
    ])
  })

  it('ignora el prefijo de prioridad syslog', () => {
    expect(parseKeyValueLog('<189>date=2026-04-27 time=14:04:08')).toEqual([
      ['date', '2026-04-27'],
      ['time', '14:04:08'],
    ])
  })

  it('acepta valores vacíos entre comillas', () => {
    expect(parseKeyValueLog('a="" b=1')).toEqual([
      ['a', ''],
      ['b', '1'],
    ])
  })

  it('devuelve una lista vacía si no hay pares', () => {
    expect(parseKeyValueLog('')).toEqual([])
    expect(parseKeyValueLog('texto sin pares')).toEqual([])
  })
})
