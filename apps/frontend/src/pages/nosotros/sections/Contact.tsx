import { Mail, MapPin } from 'lucide-react'
import nosotrosContent from '../../../content/nosotros.json'
import siteContent from '../../../content/site.json'

interface ContactContent {
  sectionNumber: string
  sectionLabel: string
  heading: { line: string; emphasis: string }
  description: string
  cta: { label: string }
}

const contact = nosotrosContent.contact as ContactContent
const { footer } = siteContent

export function Contact() {
  return (
    <section className="mx-auto grid w-[calc(100%-40px)] gap-12 border-t border-line py-20 sm:w-[min(1180px,calc(100%-72px))] lg:grid-cols-2 lg:gap-[120px] lg:py-24">
      <div>
        <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-lime">
          <span>{contact.sectionNumber}</span>
          <i className="h-px w-8 bg-line not-italic" />
          <span>{contact.sectionLabel}</span>
        </div>
        <h2 className="mt-6 font-serif text-4xl leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
          {contact.heading.line}
          <br />
          <span className="italic text-cyan">{contact.heading.emphasis}</span>
        </h2>
      </div>

      <div className="flex flex-col justify-center gap-6">
        <p className="max-w-sm text-[15px] leading-relaxed text-muted">{contact.description}</p>

        <a
          href={`mailto:${footer.email}`}
          className="inline-flex w-fit items-center bg-lime px-5 py-4 font-mono text-xs tracking-wide text-background transition-transform hover:-translate-y-0.5"
        >
          {contact.cta.label} <span className="ml-3">→</span>
        </a>

        <div className="flex flex-col gap-3 pt-2 font-mono text-xs text-muted">
          <a
            href={`mailto:${footer.email}`}
            className="flex items-center gap-2 transition-colors hover:text-lime"
          >
            <Mail size={16} aria-hidden="true" />
            <span>{footer.email}</span>
          </a>
          <a
            href={footer.address.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 transition-colors hover:text-lime"
          >
            <MapPin size={16} aria-hidden="true" />
            <span>{footer.address.label}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
