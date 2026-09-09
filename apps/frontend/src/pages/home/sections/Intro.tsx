import { Link } from 'react-router'
import content from '../../../content/home.json'

interface IntroContent {
  sectionNumber: string
  sectionLabel: string
  heading: { line: string; emphasis: string }
  paragraphs: string[]
  cta: { label: string; to: string }
}

const intro = content.intro as IntroContent

export function Intro() {
  return (
    <section
      id="conoce"
      className="mx-auto w-[calc(100%-40px)] border-t border-line py-24 sm:w-[min(1180px,calc(100%-72px))] lg:py-32"
    >
      <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-lime">
        <span>{intro.sectionNumber}</span>
        <i className="h-px w-8 bg-line not-italic" />
        <span>{intro.sectionLabel}</span>
      </div>

      <div className="mt-9 grid gap-12 lg:grid-cols-2 lg:gap-[120px]">
        <h2 className="font-serif text-4xl leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
          {intro.heading.line}
          <br />
          <span className="italic text-cyan">{intro.heading.emphasis}</span>
        </h2>

        <div className="flex max-w-[430px] flex-col gap-5 pt-1 text-[15px] leading-loose text-muted">
          {intro.paragraphs.map((paragraph, index) => (
            <p key={index} className="m-0">
              {paragraph}
            </p>
          ))}
          <Link to={intro.cta.to} className="inline-flex items-center font-mono text-xs text-foreground">
            {intro.cta.label} <span className="ml-3 text-lime">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
