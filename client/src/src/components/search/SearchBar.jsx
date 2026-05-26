import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function SearchBar({ placeholder = 'Tên quán, khu vực, tiện ích...', compact = false }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [geoLoading, setGeoLoading] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (query.trim()) navigate(`/results?q=${encodeURIComponent(query.trim())}`)
  }

  function handleGeo() {
    if (!navigator.geolocation) return
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { navigate(`/results?lat=${coords.latitude}&lng=${coords.longitude}`); setGeoLoading(false) },
      () => setGeoLoading(false), { timeout: 6000 }
    )
  }

  return (
    <form onSubmit={submit} className="
      flex items-center gap-2
      bg-white/12 border border-white/25 rounded-2xl
      px-4 py-3.5 backdrop-blur-xl
      focus-within:bg-white/18 focus-within:border-white/40
      transition-all duration-200
      shadow-[0_8px_32px_rgba(0,0,0,0.12)]
    ">
      <svg className="w-4 h-4 text-white/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <input
        value={query} onChange={e => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[14px] text-white placeholder-white/45 outline-none font-medium"
      />
      <button type="button" onClick={handleGeo}
        className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors flex-shrink-0"
      >
        {geoLoading
          ? <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
          : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
        }
      </button>
      <button type="submit" className="
        bg-blue-500 hover:bg-blue-400 text-white
        text-[12px] font-bold px-5 py-2 rounded-xl
        shadow-[0_4px_12px_rgba(59,130,246,0.4)]
        hover:shadow-[0_4px_16px_rgba(59,130,246,0.55)]
        transition-all duration-200 flex-shrink-0
        hover:-translate-y-0.5 active:translate-y-0
      ">
        Tìm ngay
      </button>
    </form>
  )
}
