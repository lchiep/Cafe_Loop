import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCafe, useCafes } from '../hooks/useCafes'
import { useReviews } from '../hooks/useReviews'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useAuth } from '../context/AuthContext'
import { favoriteApi } from '../services/api'
import { SkeletonDetail } from '../components/ui/Skeleton'
import { encImg as enc } from '../utils/encImg'

/* ── Placeholder images ── */
const PH = [
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
]

const getImg = (id, i = 0) => {
  const h = id ? id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 0
  return PH[(h + i) % PH.length]
}

/* ── Amenity maps ── */
const A_ICON  = { wifi:'📶', ac:'❄️', outlet:'🔌', parking:'🅿️', pet:'🐾', outdoor:'🌿' }
const A_LABEL = { wifi:'Wi-Fi', ac:'Máy lạnh', outlet:'Ổ cắm', parking:'Đỗ xe', pet:'Pet-friendly', outdoor:'Ngoài trời' }

/* ── Tag colors (Aurora) ── */
const TAG_COLORS = [
  { bg: 'bg-gradient-to-r from-cyan-500 to-blue-600',     sh: 'shadow-[0_2px_14px_rgba(6,182,212,0.55)]'   },
  { bg: 'bg-gradient-to-r from-fuchsia-600 to-pink-600',  sh: 'shadow-[0_2px_14px_rgba(192,38,211,0.55)]'  },
  { bg: 'bg-gradient-to-r from-rose-500 to-red-600',      sh: 'shadow-[0_2px_14px_rgba(244,63,94,0.55)]'   },
  { bg: 'bg-gradient-to-r from-amber-500 to-orange-600',  sh: 'shadow-[0_2px_14px_rgba(245,158,11,0.55)]'  },
  { bg: 'bg-gradient-to-r from-emerald-500 to-teal-600',  sh: 'shadow-[0_2px_14px_rgba(16,185,129,0.55)]'  },
  { bg: 'bg-gradient-to-r from-violet-600 to-indigo-600', sh: 'shadow-[0_2px_14px_rgba(124,58,237,0.55)]'  },
]

/* ── Amenity tag colors ── */
const AM_COLORS = [
  'from-cyan-400/25 to-blue-500/25 border-cyan-400/60 text-cyan-700',
  'from-violet-400/25 to-purple-500/25 border-violet-400/60 text-violet-700',
  'from-emerald-400/25 to-teal-500/25 border-emerald-400/60 text-emerald-700',
  'from-amber-400/25 to-orange-400/25 border-amber-400/60 text-amber-700',
  'from-rose-400/25 to-pink-400/25 border-rose-400/60 text-rose-700',
  'from-blue-400/25 to-indigo-500/25 border-blue-400/60 text-blue-700',
]

/* ── checkOpen helper ── */
function checkOpen(cafe) {
  if (cafe.isOpen24h) return true
  if (!cafe.openTime || !cafe.closeTime) return null
  const now = new Date()
  const [oh, om] = cafe.openTime.split(':').map(Number)
  const [ch, cm] = cafe.closeTime.split(':').map(Number)
  const mins = now.getHours() * 60 + now.getMinutes()
  return mins >= oh * 60 + om && mins <= ch * 60 + cm
}

/* ══════════════════════════════════════════
   Lightbox
══════════════════════════════════════════ */
function Lightbox({ images, index, onClose }) {
  const [cur, setCur] = useState(index)
  const prev = (e) => { e.stopPropagation(); setCur(i => (i - 1 + images.length) % images.length) }
  const next = (e) => { e.stopPropagation(); setCur(i => (i + 1) % images.length) }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

      {/* Close */}
      <button onClick={onClose}
        className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full text-white text-[10px] font-semibold">
        {cur + 1} / {images.length}
      </div>

      {/* Image */}
      <div className="relative z-10 max-w-5xl max-h-[88vh] w-full mx-6" onClick={e => e.stopPropagation()}>
        <img src={images[cur]} alt="" style={{ maxHeight: '88vh' }}
          className="w-full h-full object-contain rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
          onError={e => { e.target.src = PH[0] }} />
      </div>

      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl hover:bg-white/20 transition-all">‹</button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl hover:bg-white/20 transition-all">›</button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setCur(i) }}
                className={`h-1.5 rounded-full transition-all ${i === cur ? 'w-6 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/60'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════
   ReviewCard
══════════════════════════════════════════ */
function ReviewCard({ review }) {
  const name  = review.author?.name || review.author || 'Ẩn danh'
  const stars = review.stars || 5
  return (
    <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-2.5">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0">
          {name[0]?.toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-slate-800 truncate">{name}</p>
          <div className="flex gap-0.5 mt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className={`w-3 h-3 ${i < stars ? 'fill-amber-400' : 'fill-slate-200'}`} viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
        </div>
        {review.createdAt && (
          <span className="text-[9px] text-slate-400">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
        )}
      </div>
      <p className="text-[10px] text-slate-600 leading-relaxed">{review.text}</p>
    </div>
  )
}

/* ══════════════════════════════════════════
   DetailPage (main)
══════════════════════════════════════════ */
export default function DetailPage() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const [favAnim,  setFavAnim]  = useState(false)
  const [imgIdx,   setImgIdx]   = useState(0)
  const [drinkIdx, setDrinkIdx] = useState(0)
  const [tab,      setTab]      = useState('Tổng quan')
  const [lightbox, setLightbox] = useState(null)

  const { data: cafe,       isLoading, isError } = useCafe(id)
  const { data: reviews = [] }                   = useReviews(id)
  const { data: nearbyData }                     = useCafes({ limit: 12, sort: 'rating' })
  const nearby = nearbyData?.cafes || []

  const { user, toggleFavorite, isFavorite } = useAuth()
  const fav = isFavorite(id)

  /* ── Lưu lịch sử xem vào localStorage ── */
  useEffect(() => {
    if (!cafe) return
    try {
      const raw      = localStorage.getItem('cafeloop_history')
      const history  = raw ? JSON.parse(raw) : []
      const filtered = history.filter(c => c._id !== cafe._id)
      localStorage.setItem('cafeloop_history', JSON.stringify([cafe, ...filtered].slice(0, 30)))
    } catch {}
  }, [cafe?._id])

  async function toggleFav(e) {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    setFavAnim(true)
    setTimeout(() => setFavAnim(false), 600)
    await toggleFavorite(id)
  }

  /* ── Loading / Error ── */
  if (isLoading) return <SkeletonDetail />
  if (isError || !cafe) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="text-5xl mb-4">😕</div>
      <p className="text-[13px] font-bold text-slate-700 mb-4">Không tìm thấy quán</p>
      <button onClick={() => navigate(-1)}
        className="bg-blue-500 text-white px-6 py-2.5 rounded-xl text-[11px] font-semibold shadow-blue">
        ← Quay lại
      </button>
    </div>
  )

  const images  = cafe.images?.length  ? cafe.images  : [getImg(cafe._id, 0), getImg(cafe._id, 1)]
  const drinks  = cafe.drinks  || []
  const allImgs = [...images, ...drinks]
  const isOpen  = checkOpen(cafe)

  /* ════════════════════════════════════════
     Detail Panel (shared mobile + desktop)
  ════════════════════════════════════════ */
  const detail = (
    <div className="flex-1 overflow-y-auto no-scrollbar">

      {/* ── Hero ── */}
      <div className="relative h-80 lg:h-[480px] overflow-hidden bg-slate-900">
        <img
          src={enc(images[imgIdx])} alt={cafe.name}
          className="w-full h-full object-cover transition-transform duration-700 scale-105 hover:scale-100"
          onError={e => { e.target.src = PH[0] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/30 via-transparent to-transparent" />

        {/* Top controls */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
          <button onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-black/30 border border-white/20 flex items-center justify-center text-white backdrop-blur-md hover:bg-black/50 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Heart */}
          <div className="relative">
            <button onClick={toggleFav} aria-label={fav ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center
                border-2 backdrop-blur-md transition-all duration-300
                hover:scale-110 active:scale-90
                ${fav
                  ? 'bg-rose-500 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)]'
                  : 'bg-black/30 border-white/30 hover:bg-rose-500/20 hover:border-rose-400/60'
                }
              `}>
              <svg className={`w-5 h-5 transition-all duration-300 ${fav ? 'fill-white text-white scale-110' : 'fill-none text-white'}`}
                stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            {favAnim && fav && <span className="absolute inset-0 rounded-full bg-rose-400/40 animate-ping pointer-events-none" />}
            {favAnim && fav && (
              <div className="absolute inset-0 pointer-events-none">
                {['❤️', '💕', '✨'].map((em, i) => (
                  <span key={i} className="absolute text-[12px]"
                    style={{ left: `${20 + i * 25}%`, top: '-8px', animation: `floatUp 0.6s ease-out ${i * 0.08}s forwards` }}>
                    {em}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image nav */}
        {images.length > 1 && (
          <>
            <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 border border-white/20 flex items-center justify-center text-white text-xl backdrop-blur-sm hover:bg-black/50 transition-all">‹</button>
            <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 border border-white/20 flex items-center justify-center text-white text-xl backdrop-blur-sm hover:bg-black/50 transition-all">›</button>
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
              {images.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`h-1 rounded-full transition-all ${i === imgIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
              ))}
            </div>
          </>
        )}

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h1 className="text-[24px] font-bold text-white leading-tight drop-shadow-lg mb-2">{cafe.name}</h1>
              <p className="text-[10px] text-white/65">📍 {cafe.address}</p>
            </div>
            {isOpen !== null && (
              <span className={`flex-shrink-0 text-[9px] font-bold px-4 py-1.5 rounded-full backdrop-blur-sm border mb-1
                ${isOpen ? 'bg-emerald-500/80 border-emerald-400/50 text-white' : 'bg-slate-700/80 border-slate-500/50 text-slate-700'}`}>
                {isOpen ? '● Đang mở' : '● Đóng cửa'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats — liquid glass ── */}
      <div className="mx-4 -mt-8 relative z-20">
        <div className="bg-white/15 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.20),inset_0_1px_0_rgba(255,255,255,0.4)] px-5 py-5 flex justify-around">
          {[
            { v: cafe.rating?.toFixed(1) || '—', l: 'Đánh giá', c: 'text-amber-600',   icon: '⭐' },
            { v: cafe.ratingCount || 0,           l: 'Review',   c: 'text-cyan-600',    icon: '💬' },
            { v: cafe.isOpen24h ? '24h' : (cafe.closeTime || '—'), l: cafe.isOpen24h ? 'Giờ mở' : 'Đóng lúc', c: 'text-slate-100', icon: '🕐' },
            { v: cafe.minPrice ? `${(cafe.minPrice / 1000).toFixed(0)}k` : 'Free', l: 'Giá từ', c: 'text-emerald-600', icon: '💰' },
          ].map(({ v, l, c, icon }, i) => (
            <div key={l} className="text-center px-3 relative">
              {i > 0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-10 bg-white/20" />}
              <p className="text-[26px] mb-1 leading-none">{icon}</p>
              <p className={`text-[22px] font-black ${c} drop-shadow-lg leading-none`}>{v}</p>
              <p className="text-[10px] text-slate-700 font-semibold mt-1.5 tracking-wide">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 px-4 py-4 border-b border-slate-100 overflow-x-auto no-scrollbar mt-4">
        {['Tổng quan', 'Đánh giá', 'Ảnh'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`
            px-5 py-2 rounded-full text-[10px] font-semibold flex-shrink-0 transition-all duration-200
            ${tab === t ? 'bg-blue-500 text-white shadow-[0_4px_12px_rgba(59,130,246,0.4)]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}
          `}>
            {t}
            {t === 'Ảnh' && <span className="ml-1.5 text-[9px] opacity-60">({allImgs.length})</span>}
            {t === 'Đánh giá' && reviews.length > 0 && <span className="ml-1.5 text-[9px] bg-white/30 px-1.5 py-0.5 rounded-full">{reviews.length}</span>}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className="px-4 pb-6 pt-5">

        {/* ══════════════════════════════
            Tab: Tổng quan — Bento Grid
        ══════════════════════════════ */}
        {tab === 'Tổng quan' && (
          <div className="fade-in">

            {/* ══ BENTO GRID ══
                Left 50%  : 🥤 Drink (ảnh menu)
                Right 50% : top 15% Tiện ích | mid 20% Tags | bottom 15% Map
            ══════════════ */}
            <div className="flex gap-3 h-[600px] mb-3">

              {/* ── LEFT: Drink carousel ── */}
              <div className="flex-1 relative overflow-hidden rounded-2xl
                bg-white/10 backdrop-blur-xl
                border border-white/25
                shadow-[0_4px_24px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.3)]
                group
              ">
                {drinks.length > 0 ? (
                  <>
                    {/* Main image — clickable → lightbox */}
                    <button
                      onClick={() => setLightbox({ list: drinks, index: drinkIdx })}
                      className="absolute inset-0 w-full h-full"
                    >
                      <img
                        src={enc(drinks[drinkIdx])} alt={`Đồ uống ${drinkIdx + 1}`}
                        className="w-full h-full object-cover transition-all duration-500"
                        onError={e => { e.target.src = PH[0] }}
                      />
                    </button>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none"/>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"/>

                    {/* Label top-left */}
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-full text-[8px] font-black text-white
                        bg-black/30 backdrop-blur-md border border-white/20">
                        🥤 Menu ảnh
                      </span>
                    </div>

                    {/* Counter top-right */}
                    <div className="absolute top-3 right-3 z-10 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-full text-[8px] font-bold text-white
                        bg-black/30 backdrop-blur-md border border-white/20">
                        {drinkIdx + 1} / {drinks.length}
                      </span>
                    </div>

                    {/* Prev / Next arrows */}
                    {drinks.length > 1 && (
                      <>
                        <button
                          onClick={e => { e.stopPropagation(); setDrinkIdx(i => (i - 1 + drinks.length) % drinks.length) }}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20
                            w-9 h-9 rounded-full bg-black/35 border border-white/20
                            flex items-center justify-center text-white text-lg
                            backdrop-blur-md hover:bg-black/55 transition-all">
                          ‹
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); setDrinkIdx(i => (i + 1) % drinks.length) }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20
                            w-9 h-9 rounded-full bg-black/35 border border-white/20
                            flex items-center justify-center text-white text-lg
                            backdrop-blur-md hover:bg-black/55 transition-all">
                          ›
                        </button>
                      </>
                    )}

                    {/* Bottom: dot nav + thumbnail strip */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 px-3 pb-3">
                      {/* Dot indicators */}
                      <div className="flex justify-center gap-1 mb-2">
                        {drinks.map((_, i) => (
                          <button key={i}
                            onClick={e => { e.stopPropagation(); setDrinkIdx(i) }}
                            className={`h-1 rounded-full transition-all duration-200
                              ${i === drinkIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`}
                          />
                        ))}
                      </div>

                      {/* Thumbnail strip */}
                      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                        {drinks.map((url, i) => (
                          <button key={i}
                            onClick={e => { e.stopPropagation(); setDrinkIdx(i) }}
                            className={`
                              flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden
                              border-2 transition-all duration-200
                              ${i === drinkIdx
                                ? 'border-white scale-105 shadow-[0_2px_8px_rgba(255,255,255,0.3)]'
                                : 'border-white/30 opacity-60 hover:opacity-90'
                              }
                            `}>
                            <img src={enc(url)} alt="" loading="lazy" className="w-full h-full object-cover"
                              onError={e => { e.target.src = PH[0] }}/>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl mb-3 opacity-40">🥤</div>
                    <p className="text-[10px] text-white/40 font-medium">Chưa có ảnh menu</p>
                  </div>
                )}
              </div>

              {/* ── RIGHT: 3 stacked cards ── */}
              <div className="flex flex-col gap-3" style={{ width: '46%' }}>

                {/* TOP: Tiện ích */}
                <div className="relative overflow-hidden rounded-2xl p-3.5 flex-1
                  bg-white/10 backdrop-blur-xl
                  border border-white/25
                  shadow-[0_4px_24px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.3)]
                  hover:bg-white/16 transition-all duration-300 group
                ">
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl"/>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-400/15 rounded-full blur-lg"/>
                  </div>
                  <p className="relative text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2.5">
                    📡 Tiện ích
                  </p>
                  <div className="relative flex flex-wrap gap-2">
                    {cafe.amenities?.length > 0 ? cafe.amenities.map((a, i) => (
                      <span key={a} className={`
                        flex items-center gap-2 px-3 py-2 rounded-xl
                        text-[11px] font-bold
                        bg-gradient-to-r ${AM_COLORS[i % AM_COLORS.length]}
                        border backdrop-blur-sm
                        hover:scale-105 transition-all duration-150
                      `}>
                        <span className="text-[20px] leading-none">{A_ICON[a] || '✓'}</span>
                        <span>{A_LABEL[a] || a}</span>
                      </span>
                    )) : (
                      <p className="text-[9px] text-white/30">Chưa cập nhật</p>
                    )}
                  </div>
                </div>

                {/* MID: Tags */}
                <div className="relative overflow-hidden rounded-2xl p-3.5
                  bg-white/10 backdrop-blur-xl
                  border border-white/25
                  shadow-[0_4px_24px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.3)]
                  hover:bg-white/16 transition-all duration-300
                " style={{ flex: '1.4' }}>
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-6 -left-6 w-24 h-24 bg-violet-400/20 rounded-full blur-2xl"/>
                    <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-rose-400/15 rounded-full blur-xl"/>
                  </div>
                  <p className="relative text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2.5">
                    ✨ Đặc điểm
                  </p>
                  <div className="relative flex flex-wrap gap-2">
                    {cafe.tags?.length > 0 ? cafe.tags.map((t, i) => {
                      const { bg, sh } = TAG_COLORS[i % TAG_COLORS.length]
                      return (
                        <span key={t} className={`
                          px-3 py-2 rounded-full
                          text-[11px] font-bold text-white
                          ${bg} ${sh}
                          hover:scale-105 hover:brightness-110
                          transition-all duration-150
                        `}>
                          {t}
                        </span>
                      )
                    }) : (
                      <p className="text-[9px] text-white/30">Chưa cập nhật</p>
                    )}
                  </div>
                </div>

                {/* BOTTOM: Map CTA + Heart */}
                <div className="flex gap-2 flex-1">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.name + ' ' + cafe.address)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="relative overflow-hidden rounded-2xl p-3.5
                      bg-gradient-to-r from-blue-500/80 to-cyan-500/80
                      backdrop-blur-xl
                      border border-white/25
                      shadow-[0_4px_24px_rgba(59,130,246,0.35),inset_0_1px_0_rgba(255,255,255,0.3)]
                      hover:from-blue-500 hover:to-cyan-500
                      hover:shadow-[0_6px_28px_rgba(59,130,246,0.5)]
                      transition-all duration-300
                      flex items-center justify-center gap-2
                      flex-[3]
                    "
                  >
                    <span className="text-lg">🗺</span>
                    <span className="relative text-[16px] font-black text-white drop-shadow">Xem đường đi</span>
                  </a>

                  {/* Heart button — liquid glass */}
                  <div className="relative flex-1">
                    <button onClick={toggleFav}
                      className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 hover:scale-105 active:scale-95"
                      style={fav ? {
                        background: 'linear-gradient(135deg, rgba(244,63,94,0.85), rgba(251,113,133,0.85))',
                        border: '1px solid rgba(251,113,133,0.5)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(244,63,94,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
                      } : {
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
                      }}>
                      <svg
                        className={`transition-all duration-300 ${fav ? 'fill-white text-white scale-110' : 'fill-none text-slate-700'}`}
                        style={{ width: 36, height: 36 }}
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                      <span className="text-[10px] font-bold text-slate-700 leading-none">
                        {fav ? 'Đã lưu' : 'Yêu thích'}
                      </span>
                    </button>
                    {favAnim && fav && <span className="absolute inset-0 rounded-2xl bg-rose-400/30 animate-ping pointer-events-none"/>}
                    {favAnim && fav && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        {['❤️','💕','✨'].map((em, i) => (
                          <span key={i} className="absolute text-[12px]"
                            style={{ top: '-8px', left: `${25 + i*20}%`, animation: `floatUp 0.6s ease-out ${i*0.08}s forwards` }}>
                            {em}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* ── Reviews preview (below bento) ── */}
            {reviews.length > 0 && (
              <div className="rounded-2xl overflow-hidden
                bg-white/8 backdrop-blur-xl
                border border-white/20
                shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
                <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
                  <p className="text-[10px] font-bold text-white/80">💬 Đánh giá gần đây</p>
                  <button onClick={() => setTab('Đánh giá')}
                    className="text-[9px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                    Xem tất cả →
                  </button>
                </div>
                <div className="flex flex-col divide-y divide-white/8">
                  {reviews.slice(0, 2).map((r, i) => <ReviewCard key={i} review={r} />)}
                </div>
              </div>
            )}

          </div>
        )}


        {/* ── Đánh giá ── */}
        {tab === 'Đánh giá' && (
          <div className="fade-in flex flex-col gap-3">
            {reviews.length === 0
              ? <div className="py-10 text-center"><div className="text-3xl mb-2">💬</div><p className="text-[11px] text-slate-400">Chưa có đánh giá nào</p></div>
              : reviews.map((r, i) => <ReviewCard key={i} review={r} />)
            }
          </div>
        )}

        {/* ── Ảnh ── */}
        {tab === 'Ảnh' && (
          <div className="fade-in flex flex-col gap-6">
            {images.length > 0 && (
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-3">🖼 Ảnh quán ({images.length})</p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {images.map((url, i) => (
                    <button key={i} onClick={() => setLightbox({ list: allImgs, index: i })}
                      className="aspect-square rounded-2xl overflow-hidden hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-md">
                      <img src={enc(url)} alt="" loading="lazy" className="w-full h-full object-cover"
                        onError={e => { e.target.src = PH[0] }} />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {drinks.length > 0 && (
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-3">🥤 Đồ uống & Menu ({drinks.length})</p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {drinks.map((url, i) => (
                    <button key={i} onClick={() => setLightbox({ list: drinks, index: i })}
                      className="aspect-square rounded-2xl overflow-hidden hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-md">
                      <img src={enc(url)} alt="" loading="lazy" className="w-full h-full object-cover"
                        onError={e => { e.target.src = PH[0] }} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {lightbox && <Lightbox images={lightbox.list} index={lightbox.index} onClose={() => setLightbox(null)} />}
    </div>
  )

  /* ── Desktop: sidebar + detail ── */
  if (isDesktop) return (
    <div className="flex h-[calc(100vh-64px)]">
      <aside className="w-[300px] flex-shrink-0 border-r border-slate-100 bg-white/80 backdrop-blur-sm overflow-y-auto no-scrollbar">
        <div className="px-5 py-4 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
          <p className="text-[12px] font-bold text-slate-800">Quán khác</p>
          <p className="text-[9px] text-slate-400 mt-0.5">Hà Nội</p>
        </div>
        {nearby.map(item => (
          <Link key={item._id} to={`/cafe/${item._id}`}
            className={`flex items-center gap-4 px-5 py-4 border-b border-slate-100 transition-all duration-150
              ${item._id === id ? 'bg-blue-50 border-l-2 border-l-blue-500' : 'hover:bg-slate-50'}`}>
            <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 shadow-sm">
              <img src={enc(item.images?.[0] || getImg(item._id))} alt={item.name} loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={e => { e.target.src = PH[0] }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-[11px] font-bold truncate ${item._id === id ? 'text-blue-600' : 'text-slate-800'}`}>{item.name}</p>
              <p className="text-[10px] text-amber-500 font-semibold mt-1">⭐ {item.rating?.toFixed(1)}</p>
              <p className="text-[9px] text-slate-400 mt-0.5">📍 {item.district || 'Hà Nội'}</p>
            </div>
          </Link>
        ))}
      </aside>
      {detail}
    </div>
  )

  return detail
}
