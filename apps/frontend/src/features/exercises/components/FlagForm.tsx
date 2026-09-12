import { Check } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { checkFlag } from '../lib/checkFlag'

type Status = 'idle' | 'checking' | 'wrong' | 'correct'

interface FlagFormProps {
  flagHash: string
  alreadySolved: boolean
  onSolved: () => void
}

export function FlagForm({ flagHash, alreadySolved, onSolved }: FlagFormProps) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  if (alreadySolved || status === 'correct') {
    return (
      <p role="status" className="flex items-center gap-2 border border-lime bg-panel p-4 font-mono text-sm text-lime">
        <Check size={16} aria-hidden="true" />
        {alreadySolved ? 'Ya resolviste este reto.' : '¡Correcto! Reto resuelto.'}
      </p>
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('checking')
    try {
      const correct = await checkFlag(value, flagHash)
      setStatus(correct ? 'correct' : 'wrong')
      if (correct) onSolved()
    } catch {
      setStatus('wrong')
    }
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-col gap-3">
      <label htmlFor="flag" className="font-mono text-[11px] tracking-[0.12em] text-lime">
        TU FLAG
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="flag"
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            if (status === 'wrong') setStatus('idle')
          }}
          placeholder="SAPIENTIAM{...}"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 border border-line bg-panel px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted focus:border-lime focus:outline-none"
        />
        <button
          type="submit"
          disabled={value.trim() === '' || status === 'checking'}
          className="bg-lime px-5 py-3 font-mono text-xs tracking-wide text-background transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {status === 'checking' ? 'Validando…' : 'Enviar flag'}
        </button>
      </div>
      {status === 'wrong' && (
        <p role="alert" className="font-mono text-xs text-purple">
          ✗ Flag incorrecta. Revisa el formato y vuelve a intentarlo.
        </p>
      )}
    </form>
  )
}
