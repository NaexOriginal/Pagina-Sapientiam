import { useState } from 'react'
import { Link, useParams } from 'react-router'
import content from '../../content/ejercicios.json'
import { getExercise } from '../../features/exercises/api/exercises'
import { Artifact } from '../../features/exercises/components/Artifact'
import { FlagForm } from '../../features/exercises/components/FlagForm'
import { Hints } from '../../features/exercises/components/Hints'
import { Markdown } from '../../features/exercises/components/Markdown'
import { categoryLabels, difficultyLabels } from '../../features/exercises/labels'
import { isSolved, markSolved } from '../../features/exercises/progress'
import type { Exercise } from '../../features/exercises/types'

const { detail } = content

export function EjercicioPage() {
  const { slug = '' } = useParams()
  const exercise = getExercise(slug)

  return (
    <main className="mx-auto w-[calc(100%-40px)] py-16 sm:w-[min(1180px,calc(100%-72px))] lg:py-20">
      <Link to="/ejercicios" className="font-mono text-xs text-muted transition-colors hover:text-lime">
        {detail.backLabel}
      </Link>
      {/* key: al pasar de un reto a otro se reinician pistas y formulario */}
      {exercise ? <ExerciseDetail key={exercise.slug} exercise={exercise} /> : <NotFound />}
    </main>
  )
}

function ExerciseDetail({ exercise }: { exercise: Exercise }) {
  const [initiallySolved] = useState(() => isSolved(exercise.slug))
  const [solved, setSolved] = useState(initiallySolved)

  const handleSolved = () => {
    markSolved(exercise.slug)
    setSolved(true)
  }

  return (
    <article className="mt-10 flex max-w-3xl flex-col gap-10">
      <header>
        <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-lime">
          <span>{exercise.number}</span>
          <i className="h-px w-8 bg-line not-italic" />
          <span>{categoryLabels[exercise.category]}</span>
          <span className="text-muted">· {difficultyLabels[exercise.difficulty]}</span>
        </div>
        <h1 className="mt-6 font-serif text-4xl leading-[1.04] tracking-tight sm:text-5xl">{exercise.title}</h1>
      </header>

      <div>
        <Markdown>{exercise.statement}</Markdown>
      </div>

      <Artifact exercise={exercise} />
      <Hints hints={exercise.hints} />
      <FlagForm flagHash={exercise.flagHash} alreadySolved={initiallySolved} onSolved={handleSolved} />

      {solved && (
        <section aria-label={detail.explanationLabel} className="border-t border-line pt-8">
          <h2 className="font-mono text-[11px] tracking-[0.12em] text-lime">{detail.explanationLabel}</h2>
          <Markdown>{exercise.explanation}</Markdown>
        </section>
      )}
    </article>
  )
}

function NotFound() {
  return (
    <section className="mt-10 flex max-w-xl flex-col gap-5">
      <h1 className="font-serif text-4xl leading-[1.04] tracking-tight">{detail.notFound.title}</h1>
      <p className="text-[15px] leading-relaxed text-muted">{detail.notFound.description}</p>
      <Link
        to="/ejercicios"
        className="inline-flex w-fit items-center bg-lime px-5 py-4 font-mono text-xs tracking-wide text-background transition-transform hover:-translate-y-0.5"
      >
        {detail.notFound.cta} <span className="ml-3">→</span>
      </Link>
    </section>
  )
}
