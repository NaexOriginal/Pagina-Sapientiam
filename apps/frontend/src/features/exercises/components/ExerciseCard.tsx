import { Check } from 'lucide-react'
import { Link } from 'react-router'
import { categoryLabels, difficultyLabels } from '../labels'
import type { Exercise } from '../types'

export function ExerciseCard({ exercise, solved }: { exercise: Exercise; solved: boolean }) {
  return (
    <Link
      to={`/ejercicios/${exercise.slug}`}
      className="group flex flex-col gap-4 border border-line bg-panel p-6 transition-colors hover:border-lime"
    >
      <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.12em]">
        <span className="text-lime">
          {exercise.number} · {categoryLabels[exercise.category]}
        </span>
        {solved ? (
          <span className="flex items-center gap-1 text-lime">
            <Check size={14} aria-hidden="true" /> RESUELTO
          </span>
        ) : (
          <span className="text-muted">{difficultyLabels[exercise.difficulty]}</span>
        )}
      </div>
      <h2 className="font-serif text-2xl leading-tight transition-colors group-hover:text-lime">{exercise.title}</h2>
      <p className="text-sm leading-relaxed text-muted">{exercise.summary}</p>
      <span className="mt-auto font-mono text-xs text-foreground">
        Resolver <span className="ml-2 text-lime">→</span>
      </span>
    </Link>
  )
}
