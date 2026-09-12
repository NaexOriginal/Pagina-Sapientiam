export type Category = 'cripto' | 'web' | 'defensa'

export type Difficulty = 'basico' | 'intermedio'

export type Artifact =
  | { type: 'text'; label: string; value: string }
  | { type: 'network'; requests: string[] }
  | { type: 'log'; file: string; downloadName: string; format?: 'kv' }

export interface ExerciseMeta {
  slug: string
  number: string
  title: string
  category: Category
  difficulty: Difficulty
  summary: string
  flagHash: string
  hints: string[]
  artifact: Artifact
}

export interface Exercise extends ExerciseMeta {
  statement: string
  explanation: string
  artifactContent?: string
}
