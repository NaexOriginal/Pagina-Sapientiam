import content from '../../../content/nosotros.json'

interface TeamRole {
  title: string
  description: string
}

interface TeamContent {
  sectionNumber: string
  sectionLabel: string
  heading: { line: string; emphasis: string }
  description: string
  roles: TeamRole[]
}

const team = content.team as TeamContent

export function Team() {
  return (
    <section className="mx-auto w-[calc(100%-40px)] border-t border-line py-20 sm:w-[min(1180px,calc(100%-72px))] lg:py-28">
      <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-lime">
            <span>{team.sectionNumber}</span>
            <i className="h-px w-8 bg-line not-italic" />
            <span>{team.sectionLabel}</span>
          </div>
          <h2 className="mt-6 font-serif text-4xl leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
            {team.heading.line}
            <br />
            <span className="italic text-cyan">{team.heading.emphasis}</span>
          </h2>
        </div>
        <p className="max-w-[275px] text-sm leading-relaxed text-muted">{team.description}</p>
      </div>

      <div className="mt-11 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {team.roles.map((role) => (
          <article key={role.title} className="flex flex-col gap-3 border border-line bg-panel p-6">
            <h3 className="font-serif text-xl text-lime">{role.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{role.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
