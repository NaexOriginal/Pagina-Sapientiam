import { Check, Copy, Download } from 'lucide-react'
import { useState } from 'react'
import type { Exercise } from '../types'

export function Artifact({ exercise }: { exercise: Exercise }) {
  const { artifact } = exercise
  if (artifact.type === 'text') return <TextArtifact label={artifact.label} value={artifact.value} />
  if (artifact.type === 'hidden') return <HiddenArtifact value={artifact.value} />
  return <LogArtifact content={exercise.artifactContent ?? ''} downloadName={artifact.downloadName} />
}

function TextArtifact({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Sin portapapeles (sitio sin HTTPS o permiso denegado): el texto se puede seleccionar a mano
    }
  }

  return (
    <div className="border border-line bg-panel">
      <div className="flex items-center justify-between border-b border-line px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-muted">
        <span>{label.toUpperCase()}</span>
        <button
          type="button"
          onClick={() => void copy()}
          className="flex items-center gap-1.5 text-lime transition-colors hover:text-foreground"
        >
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <code className="block p-4 font-mono text-sm break-all text-foreground select-all">{value}</code>
    </div>
  )
}

function HiddenArtifact({ value }: { value: string }) {
  return (
    <div className="border border-dashed border-line bg-panel p-8 text-center font-mono text-xs text-muted">
      <p>// nada que ver aquí 👀</p>
      <p hidden data-reto="nada-es-lo-que-parece">
        {value}
      </p>
    </div>
  )
}

function LogArtifact({ content, downloadName }: { content: string; downloadName: string }) {
  return (
    <div className="border border-line bg-panel">
      <div className="flex items-center justify-between border-b border-line px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-muted">
        <span>{downloadName}</span>
        <a
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(content)}`}
          download={downloadName}
          className="flex items-center gap-1.5 text-lime transition-colors hover:text-foreground"
        >
          <Download size={14} aria-hidden="true" /> Descargar
        </a>
      </div>
      <pre tabIndex={0} className="max-h-80 overflow-auto p-4 font-mono text-[11px] leading-relaxed whitespace-pre text-foreground">
        {content}
      </pre>
    </div>
  )
}
