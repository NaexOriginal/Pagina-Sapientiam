import { describe, expect, it } from 'vitest'
import { categoryLabels, difficultyLabels } from '../labels'
import { getExercise, getExercises } from './exercises'

const exercises = getExercises()

describe('contenido de los retos', () => {
  it('tiene los 4 retos en orden', () => {
    expect(exercises.map((exercise) => exercise.slug)).toEqual([
      'mensaje-interceptado',
      'nada-es-lo-que-parece',
      'quien-toco-la-puerta',
      'alerta-desde-corea',
    ])
  })

  it('los slugs no se repiten', () => {
    const slugs = exercises.map((exercise) => exercise.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it.each(exercises)('$slug tiene enunciado, explicación, hash y 3 pistas', (exercise) => {
    expect(exercise.statement.trim()).not.toBe('')
    expect(exercise.explanation.trim()).not.toBe('')
    expect(exercise.flagHash).toMatch(/^[0-9a-f]{64}$/)
    expect(exercise.hints).toHaveLength(3)
    expect(new Set(exercise.hints).size).toBe(exercise.hints.length)
    expect(Object.keys(categoryLabels)).toContain(exercise.category)
    expect(Object.keys(difficultyLabels)).toContain(exercise.difficulty)
    if (exercise.artifact.type === 'log') expect(exercise.artifactContent?.trim()).toBeTruthy()
  })
})

describe('getExercise', () => {
  it('devuelve el reto por slug', () => {
    expect(getExercise('mensaje-interceptado')?.title).toBe('Mensaje interceptado')
  })

  it('devuelve undefined si el slug no existe', () => {
    expect(getExercise('no-existe')).toBeUndefined()
  })
})
