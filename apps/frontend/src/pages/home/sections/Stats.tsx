import content from '../../../content/home.json'

interface StatItem {
  value: string
  label: string
}

const stats = content.stats as StatItem[]

export function Stats() {
  return (
    <section className="mx-auto grid w-[calc(100%-40px)] grid-cols-3 border-y border-line sm:w-[min(1180px,calc(100%-72px))]">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`flex flex-col gap-1 py-5 sm:py-7 ${index === 0 ? '' : 'pl-3 sm:pl-[30px]'} ${
            index === stats.length - 1 ? '' : 'border-r border-line'
          }`}
        >
          <strong className="font-serif text-2xl font-normal text-lime sm:text-4xl">{stat.value}</strong>
          <span className="font-mono text-[9px] text-muted sm:text-[11px]">{stat.label}</span>
        </div>
      ))}
    </section>
  )
}
