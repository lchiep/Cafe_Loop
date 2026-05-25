import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { favoriteApi } from '../../services/api'

export default function CafeCard({ cafe, size = 'normal' }) {
  const navigate      = useNavigate()
  const [fav, setFav] = useState(cafe.isFavorite ?? false)
  const [favLoading, setFavLoading] = useState(false)

  const imageUrl = cafe.images?.[0] || cafe.imageUrl || null
  const isOpen   = checkOpen(cafe)

  async function toggleFav(e) {
    e.stopPropagation()
    if (favLoading) return
    setFavLoading(true)
    setFav(f => !f)
    try { await favoriteApi.toggle(cafe._id) }
    catch { setFav(f => !f) }
    finally { setFavLoading(false) }
  }

  /* size: normal = mobile scroll, wide = desktop grid */
  const sizeClass = size === 'wide'
    ? 'w-full h-[300px]'
    : 'min-w-[200px] w-[200px] h-[280px]'

  return (
    <article
      onClick={() => navigate(`/cafe/${cafe._id}`)}
      className={`
        relative ${sizeClass} flex-shrink-0
        rounded-3xl overflow-hidden cursor-pointer
        shadow-[0_8px_32px_rgba(31,47,152,0.18)]
        hover:shadow-[0_16px_48px_rgba(28,167,236,0.30)]
        transition-all duration-300 hover:-translate-y-2
        group border border-white/20
      `}
    >
      {/* Background */}
      {imageUrl ? (
        <img
          src={imageUrl} alt={cafe.name} loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
        />
      ) : (
        <div className="absolute inset-0 mesh-bg" />
      )}

      {/* Gradient overlay — stronger for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b6e]/90 via-[#1a2fa0]/30 to-transparent" />

      {/* Shimmer edge — glassmorphism highlight */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-white/15 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

      {/* Top badges */}
      <div className="absolute top-3 left-3 z-10 flex gap-1.5 flex-wrap">
        {cafe.featured && (
          <span className="
            px-2.5 py-1 rounded-full text-[9px] font-black tracking-wide
            bg-gradient-to-r from-teal-400/80 to-cyan-400/80
            text-navy backdrop-blur-md border border-white/25
          ">✦ Nổi bật</span>
        )}
        {isOpen !== null && (
          <span className={`
            px-2.5 py-1 rounded-full text-[9px] font-black backdrop-blur-md border border-white/20
            ${isOpen ? 'bg-emerald-500/75 text-white' : 'bg-rose-500/75 text-white'}
          `}>
            {isOpen ? '● Mở' : '● Đóng'}
          </span>
        )}
      </div>

      {/* Heart */}
      <button
        onClick={toggleFav}
        aria-label={fav ? 'Bỏ yêu thích' : 'Yêu thích'}
        className="
          absolute top-3 right-3 z-10
          w-9 h-9 rounded-full
          bg-white/15 border border-white/30
          backdrop-blur-md
          flex items-center justify-center
          transition-transform duration-150 hover:scale-110 active:scale-90
          shadow-[0_2px_8px_rgba(0,0,0,0.2)]
        "
      >
        <svg
          className={`w-4 h-4 transition-colors ${fav ? 'fill-rose-400 text-rose-400' : 'fill-none text-white'}`}
          stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Bottom glass info panel */}
      <div className="
        absolute bottom-0 left-0 right-0 z-10
        px-4 py-4
        bg-gradient-to-t from-[#0d1b6e]/80 to-transparent
        backdrop-blur-[2px]
        border-t border-white/10
      ">
        <p className="
          text-[14px] font-black text-white truncate mb-1
          [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]
        ">{cafe.name}</p>

        <p className="text-[10px] font-medium text-white/70 truncate mb-2">
          📍 {cafe.address}
        </p>

        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-[13px] font-black text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]">
              {cafe.rating?.toFixed(1) || '—'}
            </span>
            {cafe.ratingCount > 0 && (
              <span className="text-[9px] text-white/50">({cafe.ratingCount})</span>
            )}
          </div>

          {/* Distance pill */}
          {cafe.distance !== undefined && (
            <span className="
              px-2.5 py-1 rounded-full text-[10px] font-bold text-white/90
              bg-white/15 border border-white/20 backdrop-blur-sm
            ">
              {formatDistance(cafe.distance)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

function checkOpen(cafe) {
  if (cafe.isOpen24h) return true
  if (!cafe.openTime || !cafe.closeTime) return null
  const now = new Date()
  const [oh, om] = cafe.openTime.split(':').map(Number)
  const [ch, cm] = cafe.closeTime.split(':').map(Number)
  const mins = now.getHours() * 60 + now.getMinutes()
  return mins >= oh * 60 + om && mins <= ch * 60 + cm
}

function formatDistance(m) {
  if (typeof m !== 'number') return m
  return m < 1000 ? `${Math.round(m)} m` : `${(m/1000).toFixed(1)} km`
}
