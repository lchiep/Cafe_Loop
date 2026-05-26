import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useMediaQuery } from '../../hooks/useMediaQuery'

export default function Header() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const [q, setQ] = useState('')

  const NAV = [
    { label: 'Trang chủ', to: '/' },
    { label: 'Khám phá',  to: '/results' },
    { label: 'Yêu thích', to: '/favorites' },
  ]

  return (
    <header className="
      sticky top-0 z-50 h-16
      bg-white/90 backdrop-blur-xl
      border-b border-slate-100
      shadow-[0_1px_0_rgba(0,0,0,0.04)]
    ">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-full flex items-center gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-blue group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm">C</span>
          </div>
          <span className="font-display text-[17px] font-bold text-slate-900">
            Cafe<span className="text-blue-500">Loop</span>
          </span>
        </Link>

        {/* Nav — desktop */}
        {isDesktop && (
          <nav className="flex gap-1 ml-2">
            {NAV.map(({ label, to }) => (
              <Link key={to} to={to} className={`
                px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-150
                ${location.pathname === to
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }
              `}>{label}</Link>
            ))}
          </nav>
        )}

        {/* Search — desktop */}
        {isDesktop && (
          <form onSubmit={e => { e.preventDefault(); if(q.trim()) navigate(`/results?q=${encodeURIComponent(q)}`) }}
            className="flex-1 max-w-xs ml-auto"
          >
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3.5 py-2 focus-within:border-blue-300 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all">
              <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input value={q} onChange={e => setQ(e.target.value)}
                placeholder="Tìm quán cafe..."
                className="flex-1 bg-transparent text-[13px] text-slate-700 placeholder-slate-400 outline-none"
              />
            </div>
          </form>
        )}

        {/* Avatar */}
        <Link to="/profile" className="
          flex-shrink-0 w-8 h-8 rounded-full
          bg-gradient-to-br from-blue-500 to-cyan-400
          flex items-center justify-center
          text-white font-bold text-[12px]
          hover:scale-105 transition-transform shadow-sm
        ">
          {user?.name?.[0]?.toUpperCase() || '?'}
        </Link>

      </div>
    </header>
  )
}
