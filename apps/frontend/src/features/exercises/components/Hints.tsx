import { Lightbulb, Lock } from 'lucide-react'
import { useState } from 'react'

export function Hints({ hints }: { hints: string[] }) {
  const [revealed, setRevealed] = useState(0)

  return (
    <section aria-label="Pistas" className="flex flex-col gap-3">
      <h2 className="font-mono text-[11px] tracking-[0.12em] text-lime">
        PISTAS · {revealed}/{hints.length}
      </h2>
      <ol className="flex flex-col gap-2">
        {hints.map((hint, index) => (
          <li key={hint} className="border border-line bg-panel p-4 text-sm">
            {index < revealed && (
              <p className="flex gap-3 text-muted">
                <Lightbulb size={16} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />
                {hint}
              </p>
            )}
            {index === revealed && (
              <button
                type="button"
                onClick={() => setRevealed(revealed + 1)}
                className="font-mono text-xs text-foreground transition-colors hover:text-lime"
              >
                Ver pista {index + 1} <span className="ml-2 text-lime">→</span>
              </button>
            )}
            {index > revealed && (
              <span className="flex items-center gap-2 font-mono text-xs text-muted">
                <Lock size={14} aria-hidden="true" /> Pista {index + 1} bloqueada
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
