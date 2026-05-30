import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { encImg } from '../../utils/encImg'

const PH = [
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
]
function ph(id,i=0){ const h=id?id.split('').reduce((a,c)=>a+c.charCodeAt(0),0):0; return PH[(h+i)%PH.length] }

const A_ICON  = { wifi:'📶', ac:'❄️', outlet:'🔌', parking:'🅿️', pet:'🐾', outdoor:'🌿' }
const A_LABEL = { wifi:'Wi-Fi', ac:'Máy lạnh', outlet:'Ổ cắm', parking:'Đỗ xe', pet:'Pet-friendly', outdoor:'Ngoài trời' }
const TAG_COLORS = [
  'from-cyan-500 to-blue-600','from-fuchsia-600 to-pink-600',
  'from-rose-500 to-red-600','from-amber-500 to-orange-600',
  'from-emerald-500 to-teal-600','from-violet-600 to-indigo-600',
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

/* ══ Lightbox — simple & clean ══ */
function Lightbox({ images, index, onClose }) {
  const [cur, setCur] = useState(index)

  useEffect(() => {
    function handler(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft')  setCur(i => (i-1+images.length)%images.length)
      if (e.key === 'ArrowRight') setCur(i => (i+1)%images.length)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [images.length, onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(0,0,0,0.5)',
      }}>

      {/* Counter */}
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, padding: '4px 14px', borderRadius: 999,
        background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
        color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
      }}>
        {cur+1} / {images.length}
      </div>

      {/* Close */}
      <button
        onClick={e => { e.stopPropagation(); onClose() }}
        style={{
          position: 'absolute', top: 12, right: 12, zIndex: 10,
          width: 36, height: 36, borderRadius: '50%', cursor: 'pointer',
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      {/* Image — strictly contained */}
      <div
        onClick={e => e.stopPropagation()}
        style={{ padding: '52px 52px 44px', width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={images[cur]} alt=""
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: 12,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            display: 'block',
          }}
          onError={e => { e.target.src = PH[0] }}
        />
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button onClick={e=>{e.stopPropagation();setCur(i=>(i-1+images.length)%images.length)}}
          style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
            width: 40, height: 40, borderRadius: '50%', cursor: 'pointer',
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
      )}

      {/* Next */}
      {images.length > 1 && (
        <button onClick={e=>{e.stopPropagation();setCur(i=>(i+1)%images.length)}}
          style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
            width: 40, height: 40, borderRadius: '50%', cursor: 'pointer',
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: 6 }}>
          {images.map((_,i) => (
            <button key={i} onClick={e=>{e.stopPropagation();setCur(i)}}
              style={{
                height: 6, width: i===cur ? 20 : 6, borderRadius: 999, cursor: 'pointer', border: 'none', padding: 0,
                background: i===cur ? '#fff' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.3s',
              }}/>
          ))}
        </div>
      )}
    </div>
  )
}

/* ══ FeaturedCard ══ */
export default function FeaturedCard({ cafe }) {
  const { user, isFavorite, toggleFavorite } = useAuth()
  const navigate    = useNavigate()
  const [imgIdx,    setImgIdx]    = useState(0)
  const [drinkIdx,  setDrinkIdx]  = useState(0)
  const [lightbox,  setLightbox]  = useState(null)

  const isFav = isFavorite(cafe._id)

  const images = cafe.images?.length ? cafe.images.map(encImg) : [ph(cafe._id)]
  const drinks = cafe.drinks?.length  ? cafe.drinks.map(encImg) : []
  const isOpen = checkOpen(cafe)

  useEffect(() => {
    if (images.length <= 1) return
    const t = setTimeout(() => setImgIdx(i=>(i+1)%images.length), 4000)
    return () => clearTimeout(t)
  }, [imgIdx, images.length])

  useEffect(() => {
    if (drinks.length <= 1) return
    const t = setTimeout(() => setDrinkIdx(i=>(i+1)%drinks.length), 3000)
    return () => clearTimeout(t)
  }, [drinkIdx, drinks.length])

  async function toggleFav(e) {
    e.preventDefault(); e.stopPropagation()
    if (!user) { navigate('/login'); return }
    await toggleFavorite(cafe._id)
  }

  function openMaps(e) {
    e.preventDefault(); e.stopPropagation()
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.address||cafe.name)}`, '_blank')
  }

  return (
    <>
      <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-0.5 bg-white group w-full">
        <div className="flex flex-col sm:flex-row">

          {/* ══ TRÁI: Slideshow ảnh quán ══ */}
          <div className="relative sm:w-[55%] flex-shrink-0 overflow-hidden"
            style={{ minHeight: "700px" }}>

            {images.map((src,i) => (
              <img key={i} src={src} alt={cafe.name}
                loading={i===0?'eager':'lazy'}
                onClick={() => setLightbox(i)}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 cursor-zoom-in ${
                  i===imgIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
                onError={e => { e.target.src = PH[0] }}/>
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent pointer-events-none"/>

            {/* Status badge */}
            <div className="absolute top-3 left-3 pointer-events-none">
              {isOpen !== null && (
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${isOpen?'bg-emerald-500 text-white':'bg-slate-700/80 text-white/80'}`}>
                  {isOpen ? '● Đang mở' : '● Đóng'}
                </span>
              )}
            </div>

            {/* Counter */}
            {images.length > 1 && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-black/45 backdrop-blur-sm border border-white/20 pointer-events-none">
                {imgIdx+1}/{images.length}
              </div>
            )}

            {/* Prev/Next */}
            {images.length > 1 && (
              <>
                <button onClick={e=>{e.stopPropagation();setImgIdx(i=>(i-1+images.length)%images.length)}}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/35 border border-white/20 text-white flex items-center justify-center text-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/55">‹</button>
                <button onClick={e=>{e.stopPropagation();setImgIdx(i=>(i+1)%images.length)}}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/35 border border-white/20 text-white flex items-center justify-center text-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/55">›</button>
              </>
            )}

            {/* Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
                {images.map((_,i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i===imgIdx?'w-4 bg-white':'w-1 bg-white/50'}`}/>
                ))}
              </div>
            )}

            {/* Tên + ♡ + 📍 */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-3.5 flex items-end justify-between">
              <Link to={`/cafe/${cafe._id}`} className="flex-1 min-w-0 mr-3">
                <p className="text-[17px] font-bold text-white leading-tight drop-shadow-md">{cafe.name}</p>
                <p className="text-[11px] text-white/70 truncate mt-0.5">📍 {cafe.address?.split(',').slice(-2).join(',')}</p>
              </Link>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={toggleFav} 
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                    isFav ? 'bg-rose-500 border-rose-400 text-white' : 'bg-black/45 border-white/25 text-white backdrop-blur-sm hover:bg-rose-500/80'
                  }`}>
                  <svg className="w-4 h-4" fill={isFav?'currentColor':'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
                <button onClick={openMaps}
                  className="h-8 px-2.5 rounded-full bg-black/45 border border-white/25 text-white text-[10px] font-bold backdrop-blur-sm flex items-center gap-1 hover:bg-blue-500/80 transition-all hover:scale-105 active:scale-95">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Đường đi
                </button>
              </div>
            </div>
          </div>

          {/* ══ PHẢI: Info ══ */}
          <Link to={`/cafe/${cafe._id}`} className="flex-1 flex flex-col p-5 gap-4 min-w-0">

            {/* Rating + giá — redesigned */}
            <div className="flex items-stretch gap-3">
              {/* Rating block */}
              <div className="flex-1 rounded-2xl p-3 flex flex-col items-center justify-center gap-1"
                style={{ background: 'linear-gradient(135deg,#fffbeb,#fef3c7)', border: '1px solid #fde68a' }}>
                <div className="flex items-center gap-1.5">
                  <svg className="w-5 h-5 fill-amber-400" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="text-[22px] font-black text-amber-600 leading-none">{cafe.rating?.toFixed(1)||'—'}</span>
                </div>
                {cafe.ratingCount > 0 && (
                  <span className="text-[11px] text-amber-500 font-semibold">{cafe.ratingCount.toLocaleString()} đánh giá</span>
                )}
              </div>

              {/* Price block */}
              {cafe.minPrice > 0 && (
                <div className="flex-1 rounded-2xl p-3 flex flex-col items-center justify-center gap-1"
                  style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1px solid #bbf7d0' }}>
                  <div className="flex items-center gap-1">
                    <span className="text-[13px]">💰</span>
                    <span className="text-[20px] font-black text-emerald-600 leading-none">{(cafe.minPrice/1000).toFixed(0)}k</span>
                  </div>
                  <span className="text-[11px] text-emerald-500 font-semibold">giá từ</span>
                </div>
              )}

              {/* Giờ mở */}
              <div className="flex-1 rounded-2xl p-3 flex flex-col items-center justify-center gap-1"
                style={isOpen
                  ? { background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #86efac' }
                  : { background:'linear-gradient(135deg,#f8fafc,#f1f5f9)', border:'1px solid #e2e8f0' }}>
                <span className="text-[16px]">{isOpen ? '🟢' : '🔴'}</span>
                <span className={`text-[12px] font-black ${isOpen?'text-emerald-600':'text-slate-400'}`}>
                  {isOpen ? 'Đang mở' : 'Đã đóng'}
                </span>
                {cafe.openTime && cafe.closeTime && !cafe.isOpen24h && (
                  <span className="text-[10px] text-slate-400">{cafe.openTime}–{cafe.closeTime}</span>
                )}
                {cafe.isOpen24h && <span className="text-[10px] text-emerald-500 font-bold">24/7</span>}
              </div>
            </div>

            {/* Tiện ích */}
            {cafe.amenities?.length > 0 && (
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Tiện ích</p>
                <div className="flex flex-wrap gap-1.5">
                  {cafe.amenities.slice(0,5).map((a,i) => (
                    <span key={a} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-gradient-to-r ${
                      ['from-cyan-400/15 to-blue-500/15 border-cyan-200 text-cyan-700',
                       'from-violet-400/15 to-purple-500/15 border-violet-200 text-violet-700',
                       'from-emerald-400/15 to-teal-400/15 border-emerald-200 text-emerald-700',
                       'from-amber-400/15 to-orange-400/15 border-amber-200 text-amber-700',
                       'from-rose-400/15 to-pink-400/15 border-rose-200 text-rose-700'][i%5]
                    }`}>{A_ICON[a]||'•'} {A_LABEL[a]||a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Đặc điểm */}
            {cafe.tags?.length > 0 && (
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Đặc điểm</p>
                <div className="flex flex-wrap gap-1.5">
                  {cafe.tags.slice(0,4).map((t,i) => (
                    <span key={t} className={`px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r ${TAG_COLORS[i%TAG_COLORS.length]}`}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Đồ uống — slideshow 1 ô, chiếm phần còn lại */}
            {drinks.length > 0 && (
              <div className="flex-1 flex flex-col min-h-0"
                onClick={e=>{e.preventDefault();e.stopPropagation();setLightbox(images.length+drinkIdx)}}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Đồ uống</p>
                <div className="relative flex-1 rounded-xl overflow-hidden cursor-zoom-in group/drink" style={{ minHeight: '430px' }}>
                  {drinks.map((src,i) => (
                    <img key={i} src={src} alt={`drink-${i}`} loading="lazy"
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover/drink:scale-105 ${i===drinkIdx?'opacity-100':'opacity-0'}`}
                      onError={e=>{e.target.src=PH[i%PH.length]}}/>
                  ))}
                  <div className="absolute inset-0 bg-black/0 group-hover/drink:bg-black/15 transition-colors"/>
                  {drinks.length > 1 && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-black/55 backdrop-blur-sm pointer-events-none">
                      {drinkIdx+1}/{drinks.length}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/drink:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Link>
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox images={[...images,...drinks]} index={lightbox} onClose={()=>setLightbox(null)}/>
      )}
    </>
  )
}
