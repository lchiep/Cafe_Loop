import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { favoriteApi } from '../../services/api'

/* Ảnh placeholder đẹp từ Unsplash — cafe aesthetics */
const PLACEHOLDER_IMGS = [
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80',
  'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=600&q=80',
  'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&q=80',
]

function getPlaceholder(id) {
  const hash = id ? id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 0
  return PLACEHOLDER_IMGS[hash % PLACEHOLDER_IMGS.length]
}

export default function CafeCard({ cafe, size = 'normal' }) {
  const navigate = useNavigate()
  const [fav, setFav] = useState(cafe.isFavorite ?? false)

  const imageUrl = cafe.images?.[0] || getPlaceholder(cafe._id)
  const isOpen   = checkOpen(cafe)

  async function toggleFav(e) {
    e.stopPropagation()
    setFav(f => !f)
    try { await favoriteApi.toggle(cafe._id) }
    catch { setFav(f => !f) }
  }

  const isWide = size === 'wide'
  const height = isWide ? 'h-[320px]' : 'h-[260px] min-w-[200px] w-[200px]'

  return (
    <article
      onClick={() => navigate(`/cafe/${cafe._id}`)}
      className={`
        relative ${height} flex-shrink-0 rounded-3xl overflow-hidden
        cursor-pointer group card-shine
        shadow-card hover:shadow-hover
        transition-all duration-300 hover:-translate-y-1.5
        border border-white/60
      `}
    >
      {/* Image */}
      <img
        src={imageUrl} alt={cafe.name} loading="lazy"
        className="absolute inset-0 w-full h-full object-cover
                   transition-transform duration-500 group-hover:scale-[1.04]"
        onError={e => { e.target.src = PLACEHOLDER_IMGS[0] }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t
        from-slate-900/90 via-slate-900/20 to-transparent" />

      {/* Top badges */}
      <div className="absolute top-3 left-3 flex gap-1.5 z-10">
        {cafe.featured && (
          <span className="px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wide
            bg-amber-400/90 text-amber-900 backdrop-blur-sm">
            ✦ Nổi bật
          </span>
        )}
        {isOpen !== null && (
          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold backdrop-blur-sm
            ${isOpen
              ? 'bg-emerald-500/85 text-white'
              : 'bg-slate-700/80 text-slate-300'
            }`}>
            {isOpen ? '● Đang mở' : '● Đóng'}
          </span>
        )}
      </div>

      {/* Heart */}
      <button onClick={toggleFav} aria-label="Yêu thích"
        className={`
          absolute top-3 right-3 z-10
          w-8 h-8 rounded-full flex items-center justify-center
          backdrop-blur-md border transition-all duration-200
          hover:scale-110 active:scale-95
          ${fav
            ? 'bg-rose-500 border-rose-400 text-white'
            : 'bg-white/15 border-white/25 text-white hover:bg-white/25'
          }
        `}
      >
        <svg className={`w-3.5 h-3.5 ${fav ? 'fill-current' : 'fill-none'}`}
          stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      </button>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <p className="text-[14px] font-bold text-white leading-tight mb-1 drop-shadow">
          {cafe.name}
        </p>
        <p className="text-[10px] text-white/70 truncate mb-2.5">
          📍 {cafe.address}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-[13px] font-bold text-white">{cafe.rating?.toFixed(1) || '—'}</span>
            {cafe.ratingCount > 0 && (
              <span className="text-[10px] text-white/50">({cafe.ratingCount})</span>
            )}
          </div>
          {cafe.minPrice > 0 && (
            <span className="text-[10px] font-medium
              px-2.5 py-1 rounded-full
              bg-white/15 text-white/90 backdrop-blur-sm border border-white/15">
              từ {(cafe.minPrice/1000).toFixed(0)}k
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
