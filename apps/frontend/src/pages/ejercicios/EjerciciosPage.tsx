import { useState } from 'react'
import content from '../../content/ejercicios.json'
import { getExercises } from '../../features/exercises/api/exercises'
import { ExerciseCard } from '../../features/exercises/components/ExerciseCard'
import { getSolved } from '../../features/exercises/progress'

export function EjerciciosPage() {
  const exercises = getExercises()
  const [solved] = useState(getSolved)
  const solvedCount = exercises.filter((exercise) => solved.includes(exercise.slug)).length
  const { list } = content

  return (
    <main className="mx-auto w-[calc(100%-40px)] py-20 sm:w-[min(1180px,calc(100%-72px))] lg:py-28">
      <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-lime">
        <span>{list.sectionLabel}</span>
        <i className="h-px w-8 bg-line not-italic" />
        <span>
          {solvedCount}/{exercises.length} {list.solvedLabel}
        </span>
      </div>

      <h1 className="mt-6 font-serif text-4xl leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
        {list.heading.line}
        <br />
        <span className="italic text-cyan">{list.heading.emphasis}</span>
      </h1>

      <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">{list.description}</p>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {exercises.map((exercise) => (
          <ExerciseCard key={exercise.slug} exercise={exercise} solved={solved.includes(exercise.slug)} />
        ))}
      </div>
    </main>
  )
}
