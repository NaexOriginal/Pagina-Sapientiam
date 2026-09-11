import { Outlet, ScrollRestoration } from 'react-router'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <Header />
      <Outlet />
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
