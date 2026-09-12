import content from '../../../content/nosotros.json'

interface HistoryContent {
  sectionNumber: string
  sectionLabel: string
  heading: { line: string; emphasis: string }
  paragraphs: string[]
}

const history = content.history as HistoryContent

export function History() {
  return (
    <section className="mx-auto w-[calc(100%-40px)] border-t border-line py-20 sm:w-[min(1180px,calc(100%-72px))] lg:py-28">
      <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-lime">
        <span>{history.sectionNumber}</span>
        <i className="h-px w-8 bg-line not-italic" />
        <span>{history.sectionLabel}</span>
      </div>

      <div className="mt-9 grid gap-12 lg:grid-cols-2 lg:gap-[120px]">
        <h2 className="font-serif text-4xl leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
          {history.heading.line}
          <br />
          <span className="italic text-cyan">{history.heading.emphasis}</span>
        </h2>

        <div className="flex max-w-[430px] flex-col gap-5 pt-1 text-[15px] leading-loose text-muted">
          {history.paragraphs.map((paragraph, index) => (
            <p key={index} className="m-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
