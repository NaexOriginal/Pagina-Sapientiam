const STORAGE_KEY = 'sapientiam:ejercicios:resueltos'

export function getSolved(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

export function isSolved(slug: string): boolean {
  return getSolved().includes(slug)
}

export function markSolved(slug: string): void {
  const solved = getSolved()
  if (solved.includes(slug)) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...solved, slug]))
  } catch {
    // Sin almacenamiento disponible: el reto funciona igual, solo no se recuerda
  }
}
