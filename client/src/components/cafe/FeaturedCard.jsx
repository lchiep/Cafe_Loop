import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { favoriteApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { encImg } from '../../utils/encImg'

/* ── helpers ── */

const PH = [
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
]
function ph(id, i=0) {
  const h = id ? id.split('').reduce((a,c)=>a+c.charCodeAt(0),0) : 0
  return PH[(h+i)%PH.length]
}

const A_ICON  = { wifi:'📶', ac:'❄️', outlet:'🔌', parking:'🅿️', pet:'🐾', outdoor:'🌿' }
const A_LABEL = { wifi:'Wi-Fi', ac:'Máy lạnh', outlet:'Ổ cắm', parking:'Đỗ xe', pet:'Pet-friendly', outdoor:'Ngoài trời' }

const TAG_COLORS = [
  'from-cyan-500 to-blue-600',
  'from-fuchsia-600 to-pink-600',
  'from-rose-500 to-red-600',
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-teal-600',
  'from-violet-600 to-indigo-600',
]

function checkOpen(cafe) {
  if (cafe.isOpen24h) return true
  if (!cafe.openTime || !cafe.closeTime) return null
  const now = new Date()
  const [oh,om] = cafe.openTime.split(':').map(Number)
  const [ch,cm] = cafe.closeTime.split(':').map(Number)
  const mins = now.getHours()*60+now.getMinutes()
  return mins >= oh*60+om && mins <= ch*60+cm
}

/* ══ Lightbox ══ */
function Lightbox({ images, index, onClose }) {
  const [cur, setCur] = useState(index)
  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft')  setCur(i => (i-1+images.length)%images.length)
      if (e.key === 'ArrowRight') setCur(i => (i+1)%images.length)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [images.length, onClose])

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/92 backdrop-blur-md"/>

      {/* Close */}
      <button onClick={onClose}
        className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full text-white text-[12px] font-semibold">
        {cur+1} / {images.length}
      </div>

      {/* Image */}
      <div className="relative z-10 max-w-5xl max-h-[88vh] w-full mx-6" onClick={e=>e.stopPropagation()}>
        <img src={images[cur]} alt="" style={{maxHeight:'88vh'}}
          className="w-full h-full object-contain rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
          onError={e=>{e.target.src=PH[0]}}/>
      </div>

      {images.length > 1 && (
        <>
          <button onClick={e=>{e.stopPropagation();setCur(i=>(i-1+images.length)%images.length)}}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl hover:bg-white/20 transition-all">‹</button>
          <button onClick={e=>{e.stopPropagation();setCur(i=>(i+1)%images.length)}}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl hover:bg-white/20 transition-all">›</button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {images.map((_,i) => (
              <button key={i} onClick={e=>{e.stopPropagation();setCur(i)}}
                className={`h-1.5 rounded-full transition-all ${i===cur?'w-6 bg-white':'w-1.5 bg-white/35 hover:bg-white/60'}`}/>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ══ FeaturedCard ══ */
export default function FeaturedCard({ cafe }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [imgIdx,    setImgIdx]    = useState(0)
  const [lightbox,  setLightbox]  = useState(null) // null | number
  const [isFav,     setIsFav]     = useState(false)
  const [favLoading,setFavLoading]= useState(false)

  const images = cafe.images?.length ? cafe.images.map(encImg) : [ph(cafe._id)]
  const drinks = cafe.drinks?.length  ? cafe.drinks.map(encImg) : []
  const isOpen = checkOpen(cafe)

  /* Auto-advance slideshow every 4s */
  useEffect(() => {
    if (images.length <= 1) return
    const t = setTimeout(() => setImgIdx(i => (i+1)%images.length), 4000)
    return () => clearTimeout(t)
  }, [imgIdx, images.length])

  async function toggleFav(e) {
    e.preventDefault(); e.stopPropagation()
    if (!user) { navigate('/login'); return }
    setFavLoading(true)
    try {
      if (isFav) { await favoriteApi.remove(cafe._id); setIsFav(false) }
      else        { await favoriteApi.add(cafe._id);    setIsFav(true)  }
    } catch {}
    setFavLoading(false)
  }

  function openMaps(e) {
    e.preventDefault(); e.stopPropagation()
    const q = encodeURIComponent(cafe.address || cafe.name)
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank')
  }

  return (
    <>
      <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-0.5 bg-white group">
        <div className="flex flex-col lg:flex-row h-full">

          {/* ══ LEFT: Slideshow ══ */}
          <div className="relative lg:w-[58%] h-52 lg:h-72 flex-shrink-0 overflow-hidden">

            {/* Images */}
            {images.map((src,i) => (
              <img key={i} src={src} alt={cafe.name} loading={i===0?'eager':'lazy'}
                onClick={() => setLightbox(i)}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 cursor-pointer ${
                  i===imgIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
                onError={e => { e.target.src = PH[0] }}
              />
            ))}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"/>

            {/* Top-left: open status */}
            <div className="absolute top-3 left-3 flex gap-1.5 pointer-events-none">
              {isOpen !== null && (
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  isOpen ? 'bg-emerald-500 text-white' : 'bg-slate-600/80 text-white/80'
                }`}>
                  {isOpen ? '● Đang mở' : '● Đóng'}
                </span>
              )}
            </div>

            {/* Top-right: counter */}
            {images.length > 1 && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-black/40 backdrop-blur-sm border border-white/20 pointer-events-none">
                {imgIdx+1}/{images.length}
              </div>
            )}

            {/* Prev/Next arrows */}
            {images.length > 1 && (
              <>
                <button onClick={e=>{e.stopPropagation();setImgIdx(i=>(i-1+images.length)%images.length)}}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/35 border border-white/20 text-white flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/55">‹</button>
                <button onClick={e=>{e.stopPropagation();setImgIdx(i=>(i+1)%images.length)}}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/35 border border-white/20 text-white flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/55">›</button>
              </>
            )}

            {/* Dot indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
                {images.map((_,i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i===imgIdx?'w-4 bg-white':'w-1 bg-white/45'}`}/>
                ))}
              </div>
            )}

            {/* Bottom bar: name + FAV + MAP buttons */}
            <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 flex items-end justify-between">
              <Link to={`/cafe/${cafe._id}`} className="flex-1 min-w-0 mr-2">
                <p className="text-[15px] font-bold text-white leading-tight truncate drop-shadow">{cafe.name}</p>
                <p className="text-[11px] text-white/70 truncate mt-0.5">📍 {cafe.address?.split(',').slice(-2).join(',')}</p>
              </Link>

              {/* Action buttons */}
              <div className="flex gap-1.5 flex-shrink-0">
                {/* Yêu thích */}
                <button onClick={toggleFav} disabled={favLoading}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${
                    isFav
                      ? 'bg-rose-500 border-rose-400 text-white'
                      : 'bg-black/40 border-white/25 text-white backdrop-blur-sm hover:bg-rose-500/80'
                  }`}>
                  <svg className="w-4 h-4" fill={isFav?'currentColor':'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>

                {/* Xem đường đi */}
                <button onClick={openMaps}
                  className="h-8 px-2.5 rounded-full bg-black/40 border border-white/25 text-white text-[10px] font-bold backdrop-blur-sm flex items-center gap-1 hover:bg-blue-500/80 transition-all duration-200 hover:scale-105 active:scale-95">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Đường đi
                </button>
              </div>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 h-0 overflow-visible">
                {/* hidden — shown on hover via group */}
              </div>
            )}
          </div>

          {/* ══ RIGHT panel ══ */}
          <Link to={`/cafe/${cafe._id}`} className="flex-1 flex flex-col p-4 gap-3 min-h-0">

            {/* Rating row */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 fill-amber-400" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="text-[15px] font-black text-slate-800">{cafe.rating?.toFixed(1)||'—'}</span>
                {cafe.ratingCount > 0 && (
                  <span className="text-[11px] text-slate-400">({cafe.ratingCount.toLocaleString()})</span>
                )}
              </div>
              {cafe.minPrice > 0 && (
                <span className="text-[11px] text-slate-500 ml-auto">từ {(cafe.minPrice/1000).toFixed(0)}k</span>
              )}
            </div>

            {/* Tiện ích + Đặc điểm — cùng 1 hàng */}
            <div className="flex flex-wrap gap-1.5">
              {cafe.amenities?.slice(0,3).map((a,i) => (
                <span key={a} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-gradient-to-r ${
                  ['from-cyan-400/15 to-blue-500/15 border-cyan-200 text-cyan-700',
                   'from-violet-400/15 to-purple-500/15 border-violet-200 text-violet-700',
                   'from-emerald-400/15 to-teal-400/15 border-emerald-200 text-emerald-700'][i%3]
                }`}>
                  {A_ICON[a]||'•'} {A_LABEL[a]||a}
                </span>
              ))}
              {cafe.tags?.slice(0,2).map((t,i) => (
                <span key={t} className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${TAG_COLORS[(i+2)%TAG_COLORS.length]}`}>
                  {t}
                </span>
              ))}
            </div>

            {/* Drinks — lớn hơn, chiếm nhiều diện tích */}
            {drinks.length > 0 ? (
              <div className="flex-1 grid grid-cols-2 gap-1.5 min-h-0">
                {drinks.slice(0,4).map((src,i) => (
                  <div key={i}
                    onClick={e => { e.preventDefault(); e.stopPropagation(); setLightbox(images.length + i) }}
                    className={`relative overflow-hidden rounded-xl cursor-pointer group/drink ${
                      i === 0 && drinks.length >= 3 ? 'row-span-2' : ''
                    }`}
                    style={{ minHeight: i===0 && drinks.length>=3 ? '120px' : '56px' }}>
                    <img src={src} alt={`drink-${i}`} loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/drink:scale-110"
                      onError={e => { e.target.src = PH[i%PH.length] }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/drink:bg-black/20 transition-colors"/>
                    {/* Expand icon on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/drink:opacity-100 transition-opacity">
                      <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 text-[12px]">
                Chưa có ảnh đồ uống
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <Lightbox
          images={[...images, ...drinks]}
          index={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  )
}
