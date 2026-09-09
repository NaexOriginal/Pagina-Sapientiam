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
  visual: { prompt: string; note: string }
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

      <div aria-hidden="true" className="hidden lg:block">
        <div className="-rotate-2 border border-[#334260] bg-[#070b13] shadow-[25px_25px_0_rgba(33,18,61,0.45)]">
          <div className="flex h-10 items-center gap-1.5 border-b border-[#26334b] px-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#40506a]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#40506a]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#40506a]" />
            <small className="ml-auto font-mono text-[10px] text-[#65728a]">
              {hero.visual.prompt}
            </small>
          </div>

          <div className="px-8 py-7 font-mono text-sm leading-loose text-[#c6d6d1]">
            <p>
              <b className="inline-block w-7 font-normal text-[#43516a]">01</b>{' '}
              <span className="text-cyan">const</span> <span className="text-lime">curiosity</span> ={' '}
              <span className="text-purple">true</span>;
            </p>
            <p>
              <b className="inline-block w-7 font-normal text-[#43516a]">02</b>{' '}
              <span className="text-cyan">while</span> (<span className="text-lime">learning</span>) {'{'}
            </p>
            <p>
              <b className="inline-block w-7 font-normal text-[#43516a]">03</b>
              &nbsp;&nbsp;explore(<span className="text-purple">"the unknown"</span>);
            </p>
            <p>
              <b className="inline-block w-7 font-normal text-[#43516a]">04</b>
              &nbsp;&nbsp;build(<span className="text-purple">"at ETITC"</span>);
            </p>
            <p>
              <b className="inline-block w-7 font-normal text-[#43516a]">05</b> {'}'}
            </p>
            <p>
              <b className="inline-block w-7 font-normal text-[#43516a]">06</b>{' '}
              <span className="inline-block h-4 w-2 animate-blink bg-lime align-middle" />
            </p>
          </div>
        </div>

        <span className="mt-10 block text-right font-mono text-[10px] tracking-[0.12em] text-[#65728a]">
          {hero.visual.note}
        </span>
      </div>
    </section>
  )
}
