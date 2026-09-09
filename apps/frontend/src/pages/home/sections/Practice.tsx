import { Link } from 'react-router'
import content from '../../../content/home.json'

interface PracticeContent {
  sectionNumber: string
  sectionLabel: string
  heading: { line: string; emphasis: string }
  description: string
  cta: { label: string; to: string }
}

const practice = content.practice as PracticeContent

export function Practice() {
  return (
    <section className="mx-auto grid w-[calc(100%-40px)] gap-12 border-t border-line py-20 sm:w-[min(1180px,calc(100%-72px))] lg:grid-cols-2 lg:gap-[120px] lg:py-24">
      <div>
        <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-lime">
          <span>{practice.sectionNumber}</span>
          <i className="h-px w-8 bg-line not-italic" />
          <span>{practice.sectionLabel}</span>
        </div>
        <h2 className="mt-6 font-serif text-4xl leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
          {practice.heading.line}
          <br />
          <span className="italic text-cyan">{practice.heading.emphasis}</span>
        </h2>
      </div>

      <div className="flex flex-col justify-center gap-6">
        <p className="max-w-sm text-[15px] leading-relaxed text-muted">{practice.description}</p>
        <Link
          to={practice.cta.to}
          className="inline-flex w-fit items-center bg-lime px-5 py-4 font-mono text-xs tracking-wide text-background transition-transform hover:-translate-y-0.5"
        >
          {practice.cta.label} <span className="ml-3">→</span>
        </Link>
      </div>
    </section>
  )
}
