import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

/**
 * SearchBar — chỉ search khi bấm Enter hoặc nút "Tìm ngay"
 * KHÔNG auto-navigate khi gõ
 */
export default function SearchBar({
  placeholder = 'Tên quán, khu vực, tiện ích...',
  compact = false,
}) {
  const navigate  = useNavigate()
  const [params]  = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [locLoading, setLocLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (query.trim()) navigate(`/results?q=${encodeURIComponent(query.trim())}`)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit(e)
  }

  function handleGeo() {
    if (!navigator.geolocation) return
    setLocLoading(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        navigate(`/results?lat=${coords.latitude}&lng=${coords.longitude}`)
        setLocLoading(false)
      },
      () => setLocLoading(false),
      { timeout: 6000 }
    )
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="
        flex items-center gap-2
        bg-white/12 border border-white/30
        rounded-full px-3 py-2
        backdrop-blur-lg flex-1
      ">
        <svg className="w-3.5 h-3.5 text-sky flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[12px] text-white placeholder-white/50 outline-none font-medium"
        />
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="
      flex items-center gap-2
      bg-white/12 border border-white/25
      rounded-2xl px-4 py-3
      backdrop-blur-xl
      shadow-[0_4px_24px_rgba(28,167,236,0.15)]
    ">
      <svg className="w-4 h-4 text-teal2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Tìm kiếm quán cafe"
        className="
          flex-1 bg-transparent
          text-[13px] text-white placeholder-white/50
          outline-none font-medium
        "
      />

      {/* Geo button */}
      <button type="button" onClick={handleGeo} aria-label="Tìm quán gần tôi"
        className="w-8 h-8 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 transition-all flex-shrink-0"
      >
        {locLoading ? (
          <div className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>

      <button type="submit" className="
        gradient-teal text-navy text-[11px] font-black
        px-4 py-2 rounded-xl shadow-teal
        hover:brightness-105 transition-all whitespace-nowrap flex-shrink-0
      ">
        Tìm ngay
      </button>
    </form>
  )
}
