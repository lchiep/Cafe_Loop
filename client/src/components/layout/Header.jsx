import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { cafeApi } from '../../services/api'

function enc(p) {
  if (!p) return null
  if (p.startsWith('http')) return p
  return p.split('/').map((s,i) => i===0&&s===''?'':encodeURIComponent(s)).join('/')
}

const PH = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=120&q=60'

export default function Header() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user }  = useAuth()

  const [q,        setQ]        = useState('')
  const [results,  setResults]  = useState([])
  const [open,     setOpen]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [hiIdx,    setHiIdx]    = useState(-1)

  const inputRef   = useRef(null)
  const dropRef    = useRef(null)
  const timerRef   = useRef(null)

  const NAV = [
    { label: 'Trang chủ', to: '/' },
    { label: 'Khám phá',  to: '/results' },
    { label: 'Yêu thích', to: '/favorites' },
  ]

  /* ── Debounced search ── */
  useEffect(() => {
    if (!q.trim()) { setResults([]); setOpen(false); return }
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await cafeApi.list({ q: q.trim(), limit: 6 })
        setResults(data.cafes || [])
        setOpen(true)
        setHiIdx(-1)
      } catch { setResults([]) }
      setLoading(false)
    }, 280)
    return () => clearTimeout(timerRef.current)
  }, [q])

  /* ── Close on outside click ── */
  useEffect(() => {
    function handler(e) {
      if (!dropRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* ── Keyboard nav ── */
  function handleKey(e) {
    if (!open || !results.length) {
      if (e.key === 'Enter' && q.trim()) { navigate(`/results?q=${encodeURIComponent(q.trim())}`); setOpen(false) }
      return
    }
    if (e.key === 'ArrowDown')  { e.preventDefault(); setHiIdx(i => Math.min(i+1, results.length-1)) }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setHiIdx(i => Math.max(i-1, -1)) }
    if (e.key === 'Escape')     { setOpen(false); inputRef.current?.blur() }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (hiIdx >= 0) {
        navigate(`/cafe/${results[hiIdx]._id}`); setOpen(false); setQ('')
      } else if (q.trim()) {
        navigate(`/results?q=${encodeURIComponent(q.trim())}`); setOpen(false)
      }
    }
  }

  function selectCafe(cafe) {
    navigate(`/cafe/${cafe._id}`)
    setQ(''); setOpen(false)
  }

  function submitSearch(e) {
    e.preventDefault()
    if (q.trim()) { navigate(`/results?q=${encodeURIComponent(q.trim())}`); setOpen(false) }
  }

  function checkOpen(cafe) {
    if (cafe.isOpen24h) return true
    if (!cafe.openTime || !cafe.closeTime) return null
    const now = new Date()
    const [oh,om] = cafe.openTime.split(':').map(Number)
    const [ch,cm] = cafe.closeTime.split(':').map(Number)
    const mins = now.getHours()*60+now.getMinutes()
    return mins >= oh*60+om && mins <= ch*60+cm
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

        {/* ── Search with dropdown ── */}
        <div ref={dropRef} className="flex-1 max-w-sm ml-auto relative">
          <form onSubmit={submitSearch}>
            <div className={`flex items-center gap-2 bg-slate-50 border rounded-full px-3.5 py-2 transition-all duration-200 ${
              open ? 'border-blue-300 bg-white shadow-[0_0_0_3px_rgba(59,130,246,0.12)] rounded-b-none rounded-t-2xl border-b-slate-100' : 'border-slate-200 focus-within:border-blue-300 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
            }`}>
              {loading
                ? <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0"/>
                : <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
              }
              <input
                ref={inputRef}
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={handleKey}
                onFocus={() => { if (results.length) setOpen(true) }}
                placeholder="Tìm quán cafe..."
                className="flex-1 bg-transparent text-[13px] text-slate-700 placeholder-slate-400 outline-none"
              />
              {q && (
                <button type="button" onClick={() => { setQ(''); setOpen(false); setResults([]) }}
                  className="w-4 h-4 rounded-full bg-slate-300 flex items-center justify-center hover:bg-slate-400 transition-colors flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* ── Dropdown ── */}
          {open && (
            <div className="absolute top-full left-0 right-0 bg-white border border-blue-200 border-t-slate-100 rounded-b-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden z-50">

              {results.length === 0 && !loading && (
                <div className="px-4 py-5 text-center text-[12px] text-slate-400">
                  Không tìm thấy quán nào cho "<span className="font-semibold text-slate-600">{q}</span>"
                </div>
              )}

              {results.map((cafe, i) => {
                const img    = enc(cafe.images?.[0]) || PH
                const isOpen = checkOpen(cafe)
                return (
                  <button key={cafe._id} onClick={() => selectCafe(cafe)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors border-b border-slate-50 last:border-0 ${
                      i === hiIdx ? 'bg-blue-50' : 'hover:bg-slate-50'
                    }`}>
                    {/* Thumbnail */}
                    <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                      <img src={img} alt={cafe.name} loading="lazy"
                        className="w-full h-full object-cover"
                        onError={e => { e.target.src = PH }}/>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[13px] font-bold text-slate-800 truncate">{cafe.name}</p>
                        {isOpen !== null && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                            isOpen ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                          }`}>{isOpen ? '● Mở' : '● Đóng'}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        📍 {cafe.address?.split(',').slice(-2).join(',')}
                      </p>
                    </div>

                    {/* Rating */}
                    {cafe.rating > 0 && (
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <svg className="w-3 h-3 fill-amber-400" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="text-[12px] font-bold text-slate-600">{cafe.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </button>
                )
              })}

              {/* Footer: xem tất cả */}
              {results.length > 0 && (
                <button onClick={() => { navigate(`/results?q=${encodeURIComponent(q)}`); setOpen(false) }}
                  className="w-full px-4 py-3 text-center text-[12px] font-semibold text-blue-500 hover:bg-blue-50 transition-colors border-t border-slate-100">
                  Xem tất cả kết quả cho "{q}" →
                </button>
              )}
            </div>
          )}
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
