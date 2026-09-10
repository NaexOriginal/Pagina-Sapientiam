import { useState } from 'react'
import { NavLink } from 'react-router'
import { Brand } from './Brand'

const navItems = [
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/ejercicios', label: 'Ejercicios' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <nav
      aria-label="Navegación principal"
      className="mx-auto flex h-[72px] w-[calc(100%-40px)] items-center justify-between border-b border-line sm:h-[86px] sm:w-[min(1180px,calc(100%-72px))]"
    >
      <Brand onClick={close} />

      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex flex-col gap-1 sm:hidden"
      >
        <span className="h-px w-[22px] bg-lime" />
        <span className="h-px w-[22px] bg-lime" />
        <span className="h-px w-[22px] bg-lime" />
        <span className="sr-only">Abrir menú</span>
      </button>

      <div
        className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-[72px] z-10 flex-col items-stretch gap-[18px] border-b border-line bg-panel p-5 sm:static sm:z-auto sm:flex sm:w-auto sm:flex-row sm:items-center sm:gap-[35px] sm:border-none sm:bg-transparent sm:p-0`}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={close}
            className={({ isActive }) =>
              `text-sm text-muted transition-colors hover:text-lime ${isActive ? 'text-lime' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
