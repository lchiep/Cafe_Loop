import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useCafe, useCafes } from '../hooks/useCafes'
import { useReviews } from '../hooks/useReviews'
import { favoriteApi } from '../services/api'
import { SkeletonDetail } from '../components/ui/Skeleton'

const TABS = ['Tổng quan', 'Đánh giá', 'Ảnh']

const AMENITY_ICONS = {
  wifi:    '📶',
  ac:      '❄️',
  outlet:  '🔌',
  parking: '🅿️',
  pet:     '🐾',
  outdoor: '🌿',
}

export default function DetailPage() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const [tab,       setTab]       = useState('Tổng quan')
  const [fav,       setFav]       = useState(false)
  const [imgIndex,  setImgIndex]  = useState(0)

  /* ── Real data ── */
  const { data: cafe, isLoading, isError } = useCafe(id)
  const { data: reviews = [] }             = useReviews(id)

  /* Nearby cafes for desktop list */
  const { data: nearbyData } = useCafes({ limit: 8, sort: 'rating' })
  const nearby = nearbyData?.cafes || []

  async function toggleFav(e) {
    e.stopPropagation()
    setFav(f => !f)
    try { await favoriteApi.toggle(id) }
    catch { setFav(f => !f) }
  }

  const images = cafe?.images?.length ? cafe.images : []
  const isOpen = cafe ? checkOpen(cafe) : null

  /* ── Loading ── */
  if (isLoading) {
    const panel = <SkeletonDetail />
    return isDesktop ? (
      <div className="flex h-[calc(100vh-56px)]">
        <aside className="w-[280px] flex-shrink-0 border-r border-primary/10 bg-white" />
        <div className="flex-1">{panel}</div>
      </div>
    ) : panel
  }

  /* ── Error ── */
  if (isError || !cafe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-[15px] font-black text-accent mb-1">Không tìm thấy quán</p>
        <p className="text-[12px] text-muted mb-5">Quán này có thể đã bị xóa hoặc không tồn tại</p>
        <button
          onClick={() => navigate(-1)}
          className="gradient-teal text-navy px-6 py-2.5 rounded-full text-[12px] font-black shadow-teal"
        >
          ← Quay lại
        </button>
      </div>
    )
  }

  /* ── Detail panel (shared mobile/desktop) ── */
  const detailPanel = (
    <div className="flex-1 overflow-y-auto no-scrollbar">

      {/* ── Hero image ── */}
      <div className="relative h-48 lg:h-52 overflow-hidden bg-navy">
        {images.length > 0 ? (
          <>
            <img
              src={images[imgIndex]}
              alt={cafe.name}
              className="w-full h-full object-cover"
            />
            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-3 right-3 glass px-2.5 py-1 rounded-full text-[10px] font-bold text-white">
                {imgIndex + 1}/{images.length}
              </div>
            )}
            {/* Left/right arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 glass w-8 h-8 rounded-full flex items-center justify-center text-white"
                >‹</button>
                <button
                  onClick={() => setImgIndex(i => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 glass w-8 h-8 rounded-full flex items-center justify-center text-white"
                >›</button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full mesh-bg" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-3 z-10 glass w-9 h-9 rounded-full flex items-center justify-center text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Fav button */}
        <button
          onClick={toggleFav}
          aria-label={fav ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
          className="absolute top-3 right-3 z-10 glass w-9 h-9 rounded-full flex items-center justify-center"
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

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 z-10">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <h1 className="text-[19px] lg:text-[21px] font-black text-white leading-tight">
                {cafe.name}
              </h1>
              <p className="text-[11px] text-white/75 mt-0.5">📍 {cafe.address}</p>
            </div>
            {isOpen !== null && (
              <span className={`
                flex-shrink-0 text-[10px] font-black px-3 py-1 rounded-full mb-0.5
                ${isOpen ? 'bg-emerald-400/90 text-white' : 'bg-rose-400/90 text-white'}
              `}>
                {isOpen ? '● Đang mở' : '● Đóng cửa'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats card ── */}
      <div className="
        mx-3.5 -mt-4 relative z-20
        bg-white border border-primary/15
        rounded-2xl px-4 py-3.5
        shadow-glass
        flex justify-around
      ">
        {[
          {
            val:  cafe.rating?.toFixed(1) || '—',
            lbl:  'Đánh giá',
            icon: '⭐',
            color: 'text-amber-500',
          },
          {
            val:  cafe.ratingCount || 0,
            lbl:  'Lượt đánh giá',
            icon: '💬',
            color: 'text-primary',
          },
          {
            val:  cafe.isOpen24h ? '24h' : cafe.closeTime || '—',
            lbl:  cafe.isOpen24h ? 'Giờ mở' : 'Đóng cửa',
            icon: '🕙',
            color: 'text-accent',
          },
          {
            val:  cafe.minPrice ? `${(cafe.minPrice/1000).toFixed(0)}k` : 'Miễn phí',
            lbl:  'Giá từ',
            icon: '💰',
            color: 'text-teal2',
          },
        ].map(({ val, lbl, icon, color }) => (
          <div key={lbl} className="text-center px-1">
            <p className={`text-[16px] font-black ${color}`}>{val}</p>
            <p className="text-[9px] font-bold text-muted mt-0.5">{lbl}</p>
          </div>
        ))}
      </div>

      {/* ── Tab bar ── */}
      <div className="flex gap-2 px-4 py-3.5 overflow-x-auto no-scrollbar border-b border-primary/10">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`
              px-4 py-2 rounded-full text-[11px] font-bold
              border-2 flex-shrink-0 transition-all
              ${tab === t
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-primary/20 text-muted hover:border-primary/40 hover:text-accent'
              }
            `}
          >
            {t}
            {t === 'Đánh giá' && reviews.length > 0 && (
              <span className="ml-1.5 badge-teal">{reviews.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className="px-4 pb-6">

        {/* Tổng quan */}
        {tab === 'Tổng quan' && (
          <div className="pt-4 fade-in">

            {/* Giờ mở cửa */}
            <div className="
              bg-surface-2 border border-primary/15
              rounded-2xl px-4 py-3 mb-4
              flex items-center gap-3
            ">
              <div className="w-9 h-9 gradient-teal rounded-xl flex items-center justify-center text-navy text-lg flex-shrink-0">
                🕐
              </div>
              <div>
                <p className="text-[12px] font-black text-accent">Giờ mở cửa</p>
                <p className="text-[11px] text-muted font-medium mt-0.5">
                  {cafe.isOpen24h ? '24/7 — Mở cả ngày lẫn đêm' : `${cafe.openTime || '07:00'} – ${cafe.closeTime || '22:00'}`}
                </p>
              </div>
            </div>

            {/* Tiện ích */}
            {cafe.amenities?.length > 0 && (
              <>
                <h3 className="text-[13px] font-black text-accent mb-2.5">Tiện ích</h3>
                <div className="flex flex-wrap gap-2 mb-5">
                  {cafe.amenities.map(a => (
                    <span key={a} className="
                      flex items-center gap-1.5
                      text-[11px] font-semibold px-3 py-2 rounded-xl
                      bg-white border border-primary/15 text-accent
                      shadow-sm
                    ">
                      <span>{AMENITY_ICONS[a] || '✓'}</span>
                      {formatAmenity(a)}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Tags */}
            {cafe.tags?.length > 0 && (
              <>
                <h3 className="text-[13px] font-black text-accent mb-2.5">Đặc điểm</h3>
                <div className="flex flex-wrap gap-2 mb-5">
                  {cafe.tags.map(tag => (
                    <span key={tag} className="badge-teal">{tag}</span>
                  ))}
                </div>
              </>
            )}

            {/* Recent reviews preview */}
            {reviews.length > 0 && (
              <>
                <div className="flex justify-between items-center mb-2.5">
                  <h3 className="text-[13px] font-black text-accent">Đánh giá gần đây</h3>
                  <button
                    onClick={() => setTab('Đánh giá')}
                    className="text-[11px] font-bold text-primary hover:text-primary-dk"
                  >
                    Xem tất cả →
                  </button>
                </div>
                <div className={isDesktop ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-2.5'}>
                  {reviews.slice(0, 2).map((r, i) => (
                    <ReviewCard key={i} review={r} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Đánh giá */}
        {tab === 'Đánh giá' && (
          <div className="pt-4 fade-in">
            {reviews.length === 0 ? (
              <div className="py-10 text-center">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-[13px] font-bold text-muted">Chưa có đánh giá nào</p>
                <p className="text-[11px] text-muted/70 mt-1">Hãy là người đầu tiên đánh giá!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {reviews.map((r, i) => (
                  <ReviewCard key={i} review={r} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ảnh */}
        {tab === 'Ảnh' && (
          <div className="pt-4 fade-in">
            {images.length === 0 ? (
              <div className="py-10 text-center">
                <div className="text-4xl mb-3">📷</div>
                <p className="text-[13px] font-bold text-muted">Chưa có ảnh nào</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => { setImgIndex(i); setTab('Tổng quan') }}
                    className="aspect-square rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
                  >
                    <img src={url} alt={`${cafe.name} ${i+1}`} loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── CTA ── */}
      <div className="px-4 pb-6 flex gap-2.5">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.name + ' ' + cafe.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex-1 gradient-hero text-white
            py-3.5 rounded-2xl text-[13px] font-black text-center
            shadow-azure hover:brightness-105
            transition-all
          "
        >
          🗺 Xem đường đi
        </a>
        <button
          onClick={toggleFav}
          className="
            w-14 border-2 border-primary/20
            rounded-2xl flex items-center justify-center
            hover:bg-primary/5 transition-colors
          "
        >
          <svg
            className={`w-5 h-5 ${fav ? 'fill-rose-400 text-rose-400' : 'fill-none text-muted'}`}
            stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

    </div>
  )

  /* ── Desktop: split view ── */
  if (isDesktop) {
    return (
      <div className="flex h-[calc(100vh-56px)]">

        {/* Left: nearby list */}
        <aside className="
          w-[280px] flex-shrink-0
          border-r border-primary/10
          overflow-y-auto no-scrollbar
          bg-white/80
        ">
          <div className="px-4 py-3 border-b border-primary/10 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
            <h2 className="text-[13px] font-black text-accent">Quán gần đây</h2>
            <p className="text-[10px] font-medium text-muted mt-0.5">Hà Nội</p>
          </div>

          {nearby.map(item => (
            <Link
              key={item._id}
              to={`/cafe/${item._id}`}
              className={`
                flex items-center gap-3 px-4 py-3
                border-b border-primary/8 text-left
                transition-colors duration-150
                ${item._id === id
                  ? 'bg-primary/8 border-l-2 border-l-primary'
                  : 'hover:bg-surface-2'
                }
              `}
            >
              <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full mesh-bg flex items-center justify-center text-white font-black">
                    {item.name?.[0]}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-black text-accent truncate">{item.name}</p>
                <p className="text-[10px] font-semibold text-primary mt-0.5">
                  ⭐ {item.rating?.toFixed(1)} · {item.district || 'Hà Nội'}
                </p>
              </div>
            </Link>
          ))}
        </aside>

        {/* Right: detail */}
        {detailPanel}
      </div>
    )
  }

  return detailPanel
}

/* ── ReviewCard subcomponent ── */
function ReviewCard({ review }) {
  const authorName = review.author?.name || review.author || 'Ẩn danh'
  const stars      = review.stars || 5
  const initial    = authorName?.[0]?.toUpperCase() || '?'

  return (
    <div className="
      bg-white border border-primary/12
      rounded-2xl p-3.5
      shadow-sm
    ">
      <div className="flex items-center gap-2.5 mb-2">
        {/* Avatar */}
        <div className="
          w-8 h-8 rounded-full flex-shrink-0
          gradient-violet flex items-center justify-center
          text-white font-black text-[11px]
        ">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-black text-accent truncate">{authorName}</p>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < stars ? 'fill-amber-400 text-amber-400' : 'fill-muted/30 text-muted/30'}`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
        </div>
        {review.createdAt && (
          <span className="text-[9px] text-muted flex-shrink-0">
            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
          </span>
        )}
      </div>
      <p className="text-[11px] font-medium text-muted leading-relaxed">{review.text}</p>
    </div>
  )
}

/* ── Helpers ── */
function checkOpen(cafe) {
  if (cafe.isOpen24h) return true
  if (!cafe.openTime || !cafe.closeTime) return null
  const now  = new Date()
  const [oh, om] = cafe.openTime.split(':').map(Number)
  const [ch, cm] = cafe.closeTime.split(':').map(Number)
  const mins = now.getHours() * 60 + now.getMinutes()
  return mins >= oh * 60 + om && mins <= ch * 60 + cm
}

function formatAmenity(key) {
  const map = {
    wifi: 'Wi-Fi', ac: 'Máy lạnh', outlet: 'Ổ cắm điện',
    parking: 'Đỗ xe', pet: 'Pet-friendly', outdoor: 'Ngoài trời',
  }
  return map[key] || key
}
