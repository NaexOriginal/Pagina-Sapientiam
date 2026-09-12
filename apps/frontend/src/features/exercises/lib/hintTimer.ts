// Espera antes de cada pista: la 1 cuenta desde que se abre el reto, las demás desde la pista anterior
export const HINT_DELAYS_MS = [2 * 60_000, 4 * 60_000, 6 * 60_000]

export interface HintClock {
  openedAt: number
  revealedAt: number[]
}

export function nextHintAvailableAt({ openedAt, revealedAt }: HintClock): number {
  const index = revealedAt.length
  const base = index === 0 ? openedAt : revealedAt[index - 1]
  return base + HINT_DELAYS_MS[Math.min(index, HINT_DELAYS_MS.length - 1)]
}

export function canRevealNext(clock: HintClock, now: number, totalHints: number): boolean {
  return clock.revealedAt.length < totalHints && now >= nextHintAvailableAt(clock)
}

export function remainingMs(clock: HintClock, now: number): number {
  return Math.max(0, nextHintAvailableAt(clock) - now)
}
