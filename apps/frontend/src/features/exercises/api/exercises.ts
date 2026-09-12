import metadata from '../../../content/exercises/exercises.json'
import type { Exercise, ExerciseMeta } from '../types'

// Único módulo que sabe de dónde vienen los retos. Cuando exista el backend, solo cambia este archivo.
const markdownFiles = import.meta.glob<string>('../../../content/exercises/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const logFiles = import.meta.glob<string>('../../../content/exercises/*.log', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const byFileName = (files: Record<string, string>) =>
  Object.fromEntries(Object.entries(files).map(([path, content]) => [path.split('/').pop() as string, content]))

const markdown = byFileName(markdownFiles)
const logs = byFileName(logFiles)

const exercises: Exercise[] = (metadata as ExerciseMeta[]).map((meta) => ({
  ...meta,
  statement: markdown[`${meta.slug}.md`] ?? '',
  explanation: markdown[`${meta.slug}.explicacion.md`] ?? '',
  artifactContent: meta.artifact.type === 'log' ? logs[meta.artifact.file] : undefined,
}))

export function getExercises(): Exercise[] {
  return exercises
}

export function getExercise(slug: string): Exercise | undefined {
  return exercises.find((exercise) => exercise.slug === slug)
}
