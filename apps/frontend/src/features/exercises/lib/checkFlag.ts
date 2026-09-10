import { sha256Hex } from './sha256'

export async function checkFlag(input: string, flagHash: string): Promise<boolean> {
  const candidate = input.trim()
  if (candidate === '') return false
  return (await sha256Hex(candidate)) === flagHash
}
