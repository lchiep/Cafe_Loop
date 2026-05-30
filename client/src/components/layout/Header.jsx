import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useMediaQuery } from '../../hooks/useMediaQuery'

export default function Header() {
  const isDesktop          = useMediaQuery('(min-width: 1024px)')
  const location           = useLocation()
  const navigate           = useNavigate()
  const [params, setParams] = useSearchParams()
  const { user }           = useAuth()

  const isHome = location.pathname === '/'
  const [q, setQ] = useState(() => isHome ? (params.get('q') || '') : '')
  const timerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!isHome) setQ('')
  }, [location.pathname])

  const NAV = [
    { label: 'Trang chủ', to: '/' },
    { label: 'Khám phá',  to: '/results' },
    { label: 'Yêu thích', to: '/favorites' },
  ]

  function handleChange(e) {
    const val = e.target.value
    setQ(val)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (isHome) {
        if (val.trim()) setParams({ q: val.trim() }, { replace: true })
        else setParams({}, { replace: true })
      } else if (val.trim()) {
        navigate(`/?q=${encodeURIComponent(val.trim())}`)
      }
    }, 300)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && q.trim()) {
      clearTimeout(timerRef.current)
      if (isHome) setParams({ q: q.trim() }, { replace: true })
      else navigate(`/?q=${encodeURIComponent(q.trim())}`)
      inputRef.current?.blur()
    }
    if (e.key === 'Escape') {
      clearSearch()
      inputRef.current?.blur()
    }
  }

  function clearSearch() {
    setQ('')
    clearTimeout(timerRef.current)
    if (isHome) setParams({}, { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-full flex items-center gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm">C</span>
          </div>
          <span className="font-display text-[17px] font-bold text-slate-900 hidden sm:block">
            Cafe<span className="text-blue-500">Loop</span>
          </span>
        </Link>

        {/* Nav */}
        {isDesktop && (
          <nav className="flex gap-1 ml-2">
            {NAV.map(({ label, to }) => (
              <Link key={to} to={to} className={`
                px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-150
                ${location.pathname === to
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
              `}>{label}</Link>
            ))}
          </nav>
        )}

        {/* Search */}
        <div className="flex-1 max-w-sm ml-auto">
          <div className={`flex items-center gap-2 bg-slate-50 border rounded-full px-3.5 py-2 transition-all duration-200 ${
            q
              ? 'border-blue-300 bg-white shadow-[0_0_0_3px_rgba(59,130,246,0.10)]'
              : 'border-slate-200 focus-within:border-blue-300 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]'
          }`}>
            <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              ref={inputRef}
              value={q}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Tìm quán cafe..."
              className="flex-1 bg-transparent text-[13px] text-slate-700 placeholder-slate-400 outline-none"
            />
            {q && (
              <button onClick={clearSearch}
                className="w-4 h-4 rounded-full bg-slate-300 flex items-center justify-center hover:bg-slate-400 transition-colors flex-shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Avatar */}
        <Link to="/profile"
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-[12px] hover:scale-105 transition-transform shadow-sm">
          {user?.name?.[0]?.toUpperCase() || (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          )}
        </Link>

      </div>
    </header>
  )
}
