import { Link } from 'react-router'
import logoIcon from '../../assets/brand/logo-icon.webp'
import content from '../../content/site.json'

export function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-3">
      <img src={logoIcon} alt="" aria-hidden="true" className="h-[29px] w-auto" />
      <span className="flex flex-col leading-tight">
        <strong className="font-mono text-sm font-bold tracking-[0.13em]">
          {content.brand.name}
        </strong>
        <small className="font-mono text-[9px] font-normal tracking-normal text-muted">
          {content.brand.tagline}
        </small>
      </span>
    </Link>
  )
}
