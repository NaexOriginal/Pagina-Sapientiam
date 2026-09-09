import { useState } from 'react'
import content from '../../../content/home.json'

interface GalleryEvent {
  title: string
  date: string
  image: string
}

interface GalleryContent {
  sectionNumber: string
  sectionLabel: string
  heading: { line: string; emphasis: string }
  description: string
  visibleCount: number
  events: GalleryEvent[]
}

const gallery = content.gallery as GalleryContent

const galleryImageModules = import.meta.glob('../../../assets/gallery/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const galleryImagesByFile = Object.fromEntries(
  Object.entries(galleryImageModules).map(([path, url]) => [path.split('/').pop() as string, url]),
)

export function Gallery() {
  const [slide, setSlide] = useState(0)
  const total = gallery.events.length
  const visibleEvents = Array.from(
    { length: gallery.visibleCount },
    (_, index) => gallery.events[(slide + index) % total],
  )
  const rangeStart = slide + 1
  const rangeEnd = ((slide + gallery.visibleCount - 1) % total) + 1

  return (
    <section className="mx-auto w-[calc(100%-40px)] border-t border-line py-24 sm:w-[min(1180px,calc(100%-72px))] lg:py-32">
      <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-lime">
            <span>{gallery.sectionNumber}</span>
            <i className="h-px w-8 bg-line not-italic" />
            <span>{gallery.sectionLabel}</span>
          </div>
          <h2 className="mt-6 font-serif text-4xl leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
            {gallery.heading.line}
            <br />
            <span className="italic text-cyan">{gallery.heading.emphasis}</span>
          </h2>
        </div>
        <p className="max-w-[275px] text-sm leading-relaxed text-muted">{gallery.description}</p>
      </div>

      <div className="mt-11 border border-line bg-panel">
        <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-3">
          {visibleEvents.map((event, index) => (
            <figure key={index} className="border border-line bg-background">
              <img
                src={galleryImagesByFile[event.image]}
                alt={event.title}
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="flex flex-col gap-1.5 p-3">
                <strong className="text-xs font-semibold text-foreground">{event.title}</strong>
                <span className="font-mono text-[8px] tracking-wide text-muted">{event.date}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="flex flex-col items-start gap-3 border-t border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[10px] text-muted">
            Mostrando {gallery.visibleCount} momentos del semillero
          </span>
          <div className="flex items-center gap-3 font-mono text-xs text-muted">
            <button
              type="button"
              onClick={() => setSlide((current) => (current + total - 1) % total)}
              aria-label="Imagen anterior"
              className="grid h-8 w-8 place-items-center border border-line text-lime hover:border-lime"
            >
              ←
            </button>
            <span>
              {String(rangeStart).padStart(2, '0')} — {String(rangeEnd).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => setSlide((current) => (current + 1) % total)}
              aria-label="Imagen siguiente"
              className="grid h-8 w-8 place-items-center border border-line text-lime hover:border-lime"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
