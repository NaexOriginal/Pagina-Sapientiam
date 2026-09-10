import { describe, expect, it } from 'vitest'
import { getExercise, getExercises } from './exercises'

const exercises = getExercises()

describe('contenido de los retos', () => {
  it('los slugs no se repiten', () => {
    const slugs = exercises.map((exercise) => exercise.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it.each(exercises)('$slug tiene enunciado, explicación, hash y 3 pistas', (exercise) => {
    expect(exercise.statement.trim()).not.toBe('')
    expect(exercise.explanation.trim()).not.toBe('')
    expect(exercise.flagHash).toMatch(/^[0-9a-f]{64}$/)
    expect(exercise.hints).toHaveLength(3)
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
