import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { favoriteApi } from '../../services/api'

/**
 * CafeCard — Glassmorphism / Blue-Teal design
 *
 * Props:
 *   cafe: { _id, name, address, rating, distance, images[], isFavorite, featured, amenities[], tags[], minPrice, openTime, closeTime, isOpen24h }
 *   size: 'normal' | 'wide'
 */
export default function CafeCard({ cafe, size = 'normal' }) {
  const navigate      = useNavigate()
  const [fav, setFav] = useState(cafe.isFavorite ?? false)
  const [favLoading, setFavLoading] = useState(false)

  /* Primary image — Cloudinary URL or placeholder gradient */
  const imageUrl = cafe.images?.[0] || cafe.imageUrl || null

  /* Is the cafe currently open? */
  const isOpen = checkOpen(cafe)

  /* Optimistic favorite toggle */
  async function toggleFav(e) {
    e.stopPropagation()
    if (favLoading) return
    setFavLoading(true)
    setFav(f => !f)
    try {
      await favoriteApi.toggle(cafe._id)
    } catch {
      setFav(f => !f)   // revert on error
    } finally {
      setFavLoading(false)
    }
  }

  const sizeClass = size === 'wide'
    ? 'min-w-[220px] lg:min-w-0 w-full h-[265px]'
    : 'min-w-[175px] lg:min-w-[195px] h-[250px]'

  return (
    <article
      onClick={() => navigate(`/cafe/${cafe._id}`)}
      className={`
        relative ${sizeClass} flex-shrink-0
        rounded-3xl overflow-hidden cursor-pointer
        shadow-card hover:shadow-hover
        transition-all duration-250 hover:-translate-y-1
        group
      `}
    >
      {/* ── Background image or gradient ── */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={cafe.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        /* Placeholder: mesh gradient */
        <div className="absolute inset-0 mesh-bg" />
      )}

      {/* ── Dark gradient overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />

      {/* ── Top badges ── */}
      <div className="absolute top-2.5 left-2.5 z-10 flex gap-1.5">
        {cafe.featured ? (
          <span className="badge-teal">✦ Nổi bật</span>
        ) : (
          <span className="
            glass px-2.5 py-0.5 rounded-full
            text-[10px] font-black text-white
          ">
            ⭐ {cafe.rating?.toFixed(1) || '—'}
          </span>
        )}
        {isOpen !== null && (
          <span className={`
            px-2 py-0.5 rounded-full text-[9px] font-black
            ${isOpen ? 'bg-emerald-400/90 text-white' : 'bg-rose-400/90 text-white'}
          `}>
            {isOpen ? 'Mở' : 'Đóng'}
          </span>
        )}
      </div>

      {/* ── Heart button ── */}
      <button
        onClick={toggleFav}
        aria-label={fav ? 'Bỏ yêu thích' : 'Yêu thích'}
        className="
          absolute top-2.5 right-2.5 z-10
          w-8 h-8 rounded-full
          glass flex items-center justify-center
          transition-transform duration-150
          hover:scale-110 active:scale-90
        "
      >
        <svg
          className={`w-4 h-4 transition-colors ${fav ? 'fill-rose-400 text-rose-400' : 'fill-none text-white'}`}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* ── Glassmorphism info strip ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-3 py-3 glass">
        <p className="
          text-[13px] font-black text-white truncate
          [text-shadow:0_1px_6px_rgba(31,47,152,0.5)]
        ">
          {cafe.name}
        </p>

        <p className="
          text-[10px] font-medium text-white/80 truncate mt-0.5
          [text-shadow:0_1px_4px_rgba(31,47,152,0.4)]
        ">
          📍 {cafe.address}
        </p>

        <div className="flex items-center justify-between mt-2">
          {/* Stars + rating */}
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 fill-amber-400" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-[12px] font-black text-white [text-shadow:0_1px_4px_rgba(31,47,152,0.5)]">
              {cafe.rating?.toFixed(1) || '—'}
            </span>
            {cafe.ratingCount > 0 && (
              <span className="text-[9px] text-white/60">({cafe.ratingCount})</span>
            )}
          </div>

          {/* Distance pill */}
          {cafe.distance !== undefined && (
            <span className="
              glass px-2.5 py-1 rounded-full
              text-[10px] font-bold text-white/90
            ">
              {formatDistance(cafe.distance)}
            </span>
          )}
        </div>
      </div>

    </article>
  )
}

/* ── Helpers ── */
function checkOpen(cafe) {
  if (cafe.isOpen24h) return true
  if (!cafe.openTime || !cafe.closeTime) return null
  const now    = new Date()
  const [oh, om] = cafe.openTime.split(':').map(Number)
  const [ch, cm] = cafe.closeTime.split(':').map(Number)
  const mins   = now.getHours() * 60 + now.getMinutes()
  const open   = oh * 60 + om
  const close  = ch * 60 + cm
  return mins >= open && mins <= close
}

function formatDistance(meters) {
  if (typeof meters !== 'number') return meters   // already formatted string
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}
