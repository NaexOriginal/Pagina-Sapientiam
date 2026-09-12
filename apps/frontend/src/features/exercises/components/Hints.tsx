import { Clock, Lightbulb, Lock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { decodeHint } from '../lib/hintCodec'
import { canRevealNext, remainingMs, type HintClock } from '../lib/hintTimer'

// Reloj monotónico: no cambia aunque alguien modifique la hora del sistema
const now = () => performance.now()

function formatRemaining(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`
}

// `hints` llegan codificadas (Base64); cada una se decodifica solo al revelarla
export function Hints({ hints }: { hints: string[] }) {
  const [clock, setClock] = useState<HintClock>(() => ({ openedAt: now(), revealedAt: [] }))
  const [currentTime, setCurrentTime] = useState(now)
  const revealed = clock.revealedAt.length

  useEffect(() => {
    if (revealed >= hints.length) return
    const interval = setInterval(() => setCurrentTime(now()), 1000)
    return () => clearInterval(interval)
  }, [revealed, hints.length])

  const reveal = () => {
    // El tiempo se vuelve a comprobar aquí: forzar el botón desde DevTools no adelanta la pista
    const time = now()
    setClock((current) =>
      canRevealNext(current, time, hints.length) ? { ...current, revealedAt: [...current.revealedAt, time] } : current,
    )
  }

  const waiting = remainingMs(clock, currentTime)

  return (
    <section aria-label="Pistas" className="flex flex-col gap-3">
      <h2 className="font-mono text-[11px] tracking-[0.12em] text-lime">
        PISTAS · {revealed}/{hints.length}
      </h2>
      <ol aria-live="polite" className="flex flex-col gap-2">
        {hints.map((hint, index) => (
          <li key={hint} className="border border-line bg-panel p-4 text-sm">
            {index < revealed && (
              <p className="flex gap-3 text-muted">
                <Lightbulb size={16} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />
                {decodeHint(hint)}
              </p>
            )}
            {index === revealed &&
              (waiting > 0 ? (
                <span aria-live="off" className="flex items-center gap-2 font-mono text-xs text-muted">
                  <Clock size={14} aria-hidden="true" /> Pista {index + 1} disponible en {formatRemaining(waiting)}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={reveal}
                  className="font-mono text-xs text-foreground transition-colors hover:text-lime"
                >
                  Ver pista {index + 1} <span className="ml-2 text-lime">→</span>
                </button>
              ))}
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
