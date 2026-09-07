import { Link } from 'react-router'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mx-auto flex w-[calc(100%-40px)] flex-col items-start gap-4 border-t border-line py-7 font-mono text-xs text-muted sm:w-[min(1180px,calc(100%-72px))] sm:flex-row sm:items-center sm:justify-between">
      <Link to="/" className="flex items-center gap-3">
        {/* placeholder: reemplazar por el ícono del semillero cuando esté listo */}
        <span className="grid h-[29px] w-[29px] place-items-center border border-lime font-serif text-lg italic text-lime">
          S
        </span>
        <span>SAPIENTIAM</span>
      </Link>
      <p className="m-0">Semillero de seguridad · ETITC</p>
      <span>© {year}</span>
    </footer>
  )
}
