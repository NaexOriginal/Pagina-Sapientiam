import { Link } from 'react-router'
import content from '../../../content/home.json'

interface HeroHeadingSegment {
  text: string
  emphasis?: 'em' | 'strong'
}

interface HeroContent {
  eyebrow: string
  heading: HeroHeadingSegment[]
  description: string
  primaryCta: { label: string; to: string }
  secondaryCta: { label: string; href: string }
}

const hero = content.hero as HeroContent

export function Hero() {
  return (
    <section
      id="inicio"
      className="mx-auto grid w-[calc(100%-40px)] items-center gap-14 py-20 sm:w-[min(1180px,calc(100%-72px))] lg:grid-cols-2 lg:gap-16 lg:py-28"
    >
      <div className="flex flex-col">
        <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-lime">
          <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_10px_var(--color-lime)]" />
          {hero.eyebrow}
        </p>

        <h1 className="mt-6 font-serif text-5xl leading-none tracking-tight sm:text-6xl lg:text-7xl">
          {hero.heading.map((segment, index) => (
            <span key={`${segment.text}-${index}`}>
              {segment.emphasis === 'em' && <em className="italic text-lime">{segment.text}</em>}
              {segment.emphasis === 'strong' && (
                <strong className="font-normal text-cyan">{segment.text}</strong>
              )}
              {!segment.emphasis && segment.text}
              {index < hero.heading.length - 1 && <br />}
            </span>
          ))}
        </h1>

        <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted">{hero.description}</p>

        <div className="mt-9 flex flex-wrap items-center gap-8">
          <Link
            to={hero.primaryCta.to}
            className="inline-flex items-center bg-lime px-5 py-4 font-mono text-xs tracking-wide text-background transition-transform hover:-translate-y-0.5"
          >
            {hero.primaryCta.label} <span className="ml-3">→</span>
          </Link>
          <a href={hero.secondaryCta.href} className="inline-flex items-center font-mono text-xs">
            {hero.secondaryCta.label} <span className="ml-3 text-lime">↓</span>
          </a>
        </div>
      </div>

      {/* placeholder: parte visual (terminal simulada) pendiente de la siguiente sección */}
      <div className="hidden lg:block" />
    </section>
  )
}
