import { Mail, MapPin } from 'lucide-react'
import content from '../../content/site.json'
import { Brand } from './Brand'

export function Footer() {
  const year = new Date().getFullYear()
  const { footer } = content

  return (
    <footer className="mx-auto flex w-[calc(100%-40px)] flex-col flex-wrap items-start gap-6 border-t border-line py-8 font-mono text-xs text-muted sm:w-[min(1180px,calc(100%-72px))] sm:flex-row sm:items-center sm:justify-between">
      <Brand />

      <p className="m-0">{footer.description}</p>

      <div
        aria-label="Información de contacto"
        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5"
      >
        <a
          href={footer.address.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 transition-colors hover:text-lime"
        >
          <MapPin size={16} aria-hidden="true" />
          <span>{footer.address.label}</span>
        </a>
        <a
          href={`mailto:${footer.email}`}
          className="flex items-center gap-2 transition-colors hover:text-lime"
        >
          <Mail size={16} aria-hidden="true" />
          <span>{footer.email}</span>
        </a>
      </div>

      <div aria-label="Redes sociales" className="flex items-center gap-3">
        {footer.social.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={item.label}
            className="grid h-8 w-8 place-items-center border border-line transition-colors hover:border-lime hover:text-lime"
          >
            <span aria-hidden="true">{item.glyph}</span>
          </a>
        ))}
      </div>

      <span>© {year}</span>
    </footer>
  )
}
