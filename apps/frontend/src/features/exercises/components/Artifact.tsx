import { Check, Copy, Download } from 'lucide-react'
import { Fragment, useEffect, useState, type ReactNode } from 'react'
import { parseKeyValueLog } from '../lib/parseKeyValueLog'
import type { Exercise } from '../types'

export function Artifact({ exercise }: { exercise: Exercise }) {
  const { artifact } = exercise
  if (artifact.type === 'text') return <TextArtifact label={artifact.label} value={artifact.value} />
  if (artifact.type === 'network') return <NetworkArtifact requests={artifact.requests} />
  return (
    <LogArtifact content={exercise.artifactContent ?? ''} downloadName={artifact.downloadName} format={artifact.format} />
  )
}

function PanelHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-line px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-muted">
      {children}
    </div>
  )
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
      <PanelHeader>
        <span>{label.toUpperCase()}</span>
        <button
          type="button"
          onClick={() => void copy()}
          className="flex items-center gap-1.5 text-lime transition-colors hover:text-foreground"
        >
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </PanelHeader>
      <code className="block p-4 font-mono text-sm break-all text-foreground select-all">{value}</code>
    </div>
  )
}

type SessionStatus = 'loading' | 'ready' | 'error'

// Hace peticiones reales a public/: el reto se resuelve leyendo sus respuestas en DevTools → Network
function NetworkArtifact({ requests }: { requests: string[] }) {
  const [status, setStatus] = useState<SessionStatus>('loading')

  useEffect(() => {
    let active = true
    Promise.all(
      requests.map(async (path) => {
        const response = await fetch(`${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`, { cache: 'no-store' })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      }),
    )
      .then(() => {
        if (active) setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })
    return () => {
      active = false
    }
  }, [requests])

  return (
    <div className="border border-line bg-panel">
      <PanelHeader>
        <span>SESIÓN</span>
        <span className={status === 'error' ? 'text-purple' : 'text-lime'}>
          {status === 'loading' ? 'CONECTANDO…' : status === 'ready' ? 'ACTIVA' : 'ERROR'}
        </span>
      </PanelHeader>
      <p role="status" className="p-4 font-mono text-sm text-foreground">
        {status === 'loading' && 'Conectando con el servidor del laboratorio…'}
        {status === 'ready' && 'Sesión iniciada como invitado. Nada más que ver aquí… ¿o sí?'}
        {status === 'error' && 'No se pudo cargar la sesión. Recarga la página para intentarlo de nuevo.'}
      </p>
    </div>
  )
}

type LogView = 'raw' | 'fields'

const logViewLabels: Record<LogView, string> = { raw: 'Crudo', fields: 'Campos' }

function LogArtifact({ content, downloadName, format }: { content: string; downloadName: string; format?: 'kv' }) {
  const [view, setView] = useState<LogView>('raw')
  const isKeyValue = format === 'kv'

  return (
    <div className="border border-line bg-panel">
      <PanelHeader>
        <span>{downloadName}</span>
        <div className="flex items-center gap-4">
          {isKeyValue && (
            <div role="group" aria-label="Vista del log" className="flex border border-line">
              {(Object.keys(logViewLabels) as LogView[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={view === option}
                  onClick={() => setView(option)}
                  className={`px-2 py-0.5 transition-colors ${
                    view === option ? 'bg-lime text-background' : 'text-muted hover:text-foreground'
                  }`}
                >
                  {logViewLabels[option]}
                </button>
              ))}
            </div>
          )}
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(content)}`}
            download={downloadName}
            className="flex items-center gap-1.5 text-lime transition-colors hover:text-foreground"
          >
            <Download size={14} aria-hidden="true" /> Descargar
          </a>
        </div>
      </PanelHeader>
      {isKeyValue && view === 'fields' ? (
        <dl
          tabIndex={0}
          className="grid max-h-80 grid-cols-[auto_1fr] gap-x-6 gap-y-1 overflow-auto p-4 font-mono text-[11px] leading-relaxed"
        >
          {parseKeyValueLog(content).map(([key, value], index) => (
            <Fragment key={`${key}-${index}`}>
              <dt className="text-muted">{key}</dt>
              <dd className="m-0 break-all text-foreground">{value}</dd>
            </Fragment>
          ))}
        </dl>
      ) : (
        <pre
          tabIndex={0}
          className={`max-h-80 overflow-auto p-4 font-mono text-[11px] leading-relaxed text-foreground ${
            isKeyValue ? 'break-all whitespace-pre-wrap' : 'whitespace-pre'
          }`}
        >
          {content}
        </pre>
      )}
    </div>
  )
}
