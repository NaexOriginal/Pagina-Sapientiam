export type Category = 'cripto' | 'web' | 'defensa'

export type Difficulty = 'basico'

export type Artifact =
  | { type: 'text'; label: string; value: string }
  | { type: 'hidden'; value: string }
  | { type: 'log'; file: string; downloadName: string }

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
