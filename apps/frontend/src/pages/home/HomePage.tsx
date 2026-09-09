import { Gallery } from './sections/Gallery'
import { Hero } from './sections/Hero'
import { Intro } from './sections/Intro'
import { Practice } from './sections/Practice'
import { Stats } from './sections/Stats'

export function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <Stats />
      <Gallery />
      <Practice />
    </>
  )
}
