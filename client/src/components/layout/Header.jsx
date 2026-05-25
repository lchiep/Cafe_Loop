import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useDebounce } from '../../hooks/useDebounce'
import { useAuth } from '../../context/AuthContext'
import { useMediaQuery } from '../../hooks/useMediaQuery'

export default function Header() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user }  = useAuth()
  const [query, setQuery] = useState('')
  const debounced = useDebounce(query, 300)

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) navigate(`/results?q=${encodeURIComponent(query)}`)
  }

  const isHome = location.pathname === '/'

  return (
    <header className="
      sticky top-0 z-50
      flex items-center justify-between
      px-4 lg:px-6 h-14
      bg-white/90 border-b border-primary/15
      backdrop-blur-xl
      shadow-[0_1px_16px_rgba(28,167,236,0.10)]
    ">

      {/* ── Logo ── */}
      <Link to="/" className="flex items-center gap-2 flex-shrink-0">
        {/* Logo mark */}
        <div className="
          w-7 h-7 rounded-lg gradient-teal
          flex items-center justify-center
          shadow-teal
        ">
          <span className="text-white font-black text-[13px]">C</span>
        </div>
        <span className="font-display text-[16px] font-black tracking-tight">
          <span className="text-accent">Cafe</span>
          <span className="text-primary">Loop</span>
        </span>
      </Link>

      {/* ── Desktop nav links ── */}
      {isDesktop && (
        <nav className="flex gap-0.5 absolute left-1/2 -translate-x-1/2">
          {[
            { label: 'Trang chủ', to: '/' },
            { label: 'Khám phá',  to: '/results' },
            { label: 'Yêu thích', to: '/favorites' },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`
                px-4 py-1.5 rounded-full text-[12px] font-bold
                transition-all duration-150
                ${location.pathname === to
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted hover:text-accent hover:bg-surface-2'
                }
              `}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}

      {/* ── Right: search + profile ── */}
      <div className="flex items-center gap-2">

        {/* Desktop search */}
        {isDesktop && (
          <form onSubmit={handleSearch} className="
            flex items-center gap-2
            bg-surface-2 border border-primary/20
            rounded-full px-3 py-1.5 w-52
            focus-within:border-primary/50 focus-within:bg-white
            transition-all duration-200
          ">
            <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm quán cafe..."
              className="
                flex-1 bg-transparent text-[12px]
                text-accent placeholder-muted
                outline-none font-medium
              "
            />
          </form>
        )}

        {/* Profile avatar */}
        <Link
          to="/profile"
          className="
            flex items-center justify-center
            w-8 h-8 rounded-full overflow-hidden
            border-2 border-primary/30
            bg-gradient-to-br from-teal2 to-primary
            text-white font-black text-[12px]
            hover:border-primary transition-colors
            flex-shrink-0
          "
        >
          {user?.name?.[0]?.toUpperCase() || '?'}
        </Link>

      </div>
    </header>
  )
}
