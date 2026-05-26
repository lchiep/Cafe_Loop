import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCafe, useCafes } from '../hooks/useCafes'
import { useReviews } from '../hooks/useReviews'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { favoriteApi } from '../services/api'
import { SkeletonDetail } from '../components/ui/Skeleton'

const PLACEHOLDER_IMGS = [
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
  'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=800&q=80',
]
function getImg(id, i=0) {
  const h = id ? id.split('').reduce((a,c)=>a+c.charCodeAt(0),0) : 0
  return PLACEHOLDER_IMGS[(h+i) % PLACEHOLDER_IMGS.length]
}

const AMENITY_ICONS = { wifi:'📶', ac:'❄️', outlet:'🔌', parking:'🅿️', pet:'🐾', outdoor:'🌿' }
const AMENITY_LABELS = { wifi:'Wi-Fi', ac:'Máy lạnh', outlet:'Ổ cắm', parking:'Đỗ xe', pet:'Pet-friendly', outdoor:'Ngoài trời' }

export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [fav, setFav] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)
  const [tab, setTab] = useState('Tổng quan')

  const { data: cafe, isLoading, isError } = useCafe(id)
  const { data: reviews = [] } = useReviews(id)
  const { data: nearbyData } = useCafes({ limit: 8, sort: 'rating' })
  const nearby = nearbyData?.cafes || []

  async function toggleFav(e) {
    e.stopPropagation()
    setFav(f => !f)
    try { await favoriteApi.toggle(id) } catch { setFav(f => !f) }
  }

  if (isLoading) return <SkeletonDetail/>
  if (isError || !cafe) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="text-5xl mb-4">😕</div>
      <p className="text-[15px] font-bold text-slate-700 mb-4">Không tìm thấy quán</p>
      <button onClick={() => navigate(-1)} className="bg-blue-500 text-white px-6 py-2.5 rounded-xl text-[13px] font-semibold shadow-blue">← Quay lại</button>
    </div>
  )

  const images = cafe.images?.length ? cafe.images : [getImg(cafe._id,0), getImg(cafe._id,1)]
  const isOpen = checkOpen(cafe)

  const detail = (
    <div className="flex-1 overflow-y-auto no-scrollbar">

      {/* Hero image */}
      <div className="relative h-56 lg:h-64 overflow-hidden bg-slate-900">
        <img src={images[imgIdx]} alt={cafe.name}
          className="w-full h-full object-cover"
          onError={e => e.target.src = PLACEHOLDER_IMGS[0]}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/15 to-transparent"/>

        {/* Controls */}
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 z-10 w-9 h-9 glass border border-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button onClick={toggleFav} className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${fav ? 'bg-rose-500 border-rose-400' : 'glass border-white/20'}`}>
          <svg className={`w-4 h-4 ${fav ? 'fill-white text-white' : 'fill-none text-white'}`} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>

        {/* Image nav */}
        {images.length > 1 && (
          <>
            <button onClick={() => setImgIdx(i => (i-1+images.length)%images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 glass border border-white/20 w-8 h-8 rounded-full flex items-center justify-center text-white text-lg backdrop-blur-md">‹</button>
            <button onClick={() => setImgIdx(i => (i+1)%images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 glass border border-white/20 w-8 h-8 rounded-full flex items-center justify-center text-white text-lg backdrop-blur-md">›</button>
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_,i) => <div key={i} className={`h-1 rounded-full transition-all ${i===imgIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`}/>)}
            </div>
          </>
        )}

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h1 className="text-[20px] font-bold text-white leading-tight drop-shadow">{cafe.name}</h1>
              <p className="text-[11px] text-white/65 mt-0.5">📍 {cafe.address}</p>
            </div>
            {isOpen !== null && (
              <span className={`flex-shrink-0 text-[10px] font-bold px-3 py-1 rounded-full mb-0.5 ${isOpen ? 'bg-emerald-500/90 text-white' : 'bg-slate-600/90 text-slate-200'}`}>
                {isOpen ? '● Đang mở' : '● Đóng cửa'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="mx-4 -mt-5 relative z-10 bg-white rounded-2xl border border-slate-100 shadow-card px-4 py-4 flex justify-around">
        {[
          { v: cafe.rating?.toFixed(1)||'—', l:'Đánh giá', c:'text-amber-500' },
          { v: cafe.ratingCount||0, l:'Lượt review', c:'text-blue-500' },
          { v: cafe.isOpen24h?'24h':cafe.closeTime||'—', l: cafe.isOpen24h?'Giờ mở':'Đóng lúc', c:'text-slate-700' },
          { v: cafe.minPrice?(cafe.minPrice/1000).toFixed(0)+'k':'Miễn phí', l:'Giá từ', c:'text-teal-500' },
        ].map(({v,l,c}) => (
          <div key={l} className="text-center">
            <p className={`text-[16px] font-bold ${c}`}>{v}</p>
            <p className="text-[9px] text-slate-400 font-medium mt-0.5">{l}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 py-4 border-b border-slate-100 overflow-x-auto no-scrollbar">
        {['Tổng quan','Đánh giá','Ảnh'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`
            px-4 py-2 rounded-full text-[12px] font-semibold flex-shrink-0 transition-all
            ${tab===t ? 'bg-blue-500 text-white shadow-blue' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
          `}>
            {t}{t==='Đánh giá'&&reviews.length>0&&<span className="ml-1.5 text-[9px] bg-white/25 px-1.5 py-0.5 rounded-full">{reviews.length}</span>}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-4 pb-6 pt-5">

        {tab==='Tổng quan' && (
          <div className="fade-in">
            {/* Hours */}
            <div className="flex items-center gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-lg flex-shrink-0 shadow-blue">🕐</div>
              <div>
                <p className="text-[12px] font-semibold text-slate-700">Giờ mở cửa</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {cafe.isOpen24h ? '24/7 — Mở cả ngày lẫn đêm' : `${cafe.openTime||'07:00'} – ${cafe.closeTime||'22:00'}`}
                </p>
              </div>
            </div>

            {/* Amenities */}
            {cafe.amenities?.length>0 && (
              <>
                <p className="text-[13px] font-bold text-slate-800 mb-3">Tiện ích</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {cafe.amenities.map(a => (
                    <span key={a} className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-150 rounded-xl text-[12px] font-medium text-slate-700 shadow-sm">
                      {AMENITY_ICONS[a]||'✓'} {AMENITY_LABELS[a]||a}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Tags */}
            {cafe.tags?.length>0 && (
              <>
                <p className="text-[13px] font-bold text-slate-800 mb-3">Đặc điểm</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {cafe.tags.map(t => <span key={t} className="tag-teal">{t}</span>)}
                </div>
              </>
            )}

            {/* Preview reviews */}
            {reviews.length>0 && (
              <>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[13px] font-bold text-slate-800">Đánh giá gần đây</p>
                  <button onClick={()=>setTab('Đánh giá')} className="text-[11px] font-semibold text-blue-500">Xem tất cả →</button>
                </div>
                <div className="flex flex-col gap-2.5">
                  {reviews.slice(0,2).map((r,i) => <ReviewCard key={i} review={r}/>)}
                </div>
              </>
            )}
          </div>
        )}

        {tab==='Đánh giá' && (
          <div className="fade-in flex flex-col gap-3">
            {reviews.length===0
              ? <div className="py-10 text-center"><div className="text-3xl mb-2">💬</div><p className="text-[13px] text-slate-400">Chưa có đánh giá nào</p></div>
              : reviews.map((r,i) => <ReviewCard key={i} review={r}/>)
            }
          </div>
        )}

        {tab==='Ảnh' && (
          <div className="fade-in grid grid-cols-2 gap-2">
            {images.map((url,i) => (
              <button key={i} onClick={()=>{setImgIdx(i);setTab('Tổng quan')}} className="aspect-square rounded-2xl overflow-hidden hover:opacity-90 transition-opacity">
                <img src={url} alt={`${cafe.name} ${i+1}`} loading="lazy" className="w-full h-full object-cover"
                  onError={e => e.target.src = PLACEHOLDER_IMGS[0]}/>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-4 pb-8 flex gap-3">
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.name+' '+cafe.address)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-bold py-4 rounded-2xl text-center shadow-blue transition-all hover:-translate-y-0.5">
          🗺 Xem đường đi
        </a>
        <button onClick={toggleFav} className={`w-14 rounded-2xl border-2 flex items-center justify-center transition-all ${fav ? 'border-rose-300 bg-rose-50 text-rose-500' : 'border-slate-200 text-slate-400 hover:border-rose-200 hover:bg-rose-50'}`}>
          <svg className={`w-5 h-5 ${fav?'fill-rose-500 text-rose-500':'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>
    </div>
  )

  if (isDesktop) return (
    <div className="flex h-[calc(100vh-64px)]">
      <aside className="w-[280px] flex-shrink-0 border-r border-slate-100 bg-white overflow-y-auto no-scrollbar">
        <div className="px-4 py-4 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
          <p className="text-[13px] font-bold text-slate-800">Quán khác</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Hà Nội</p>
        </div>
        {nearby.map(item => (
          <Link key={item._id} to={`/cafe/${item._id}`} className={`flex items-center gap-3 px-4 py-3.5 border-b border-slate-50 transition-colors ${item._id===id?'bg-blue-50 border-l-2 border-l-blue-500':'hover:bg-slate-50'}`}>
            <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
              <img src={item.images?.[0]||getImg(item._id)} alt={item.name} loading="lazy" className="w-full h-full object-cover"
                onError={e=>e.target.src=PLACEHOLDER_IMGS[0]}/>
            </div>
            <div className="min-w-0">
              <p className={`text-[12px] font-semibold truncate ${item._id===id?'text-blue-600':'text-slate-800'}`}>{item.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">⭐ {item.rating?.toFixed(1)} · {item.district||'HN'}</p>
            </div>
          </Link>
        ))}
      </aside>
      {detail}
    </div>
  )

  return detail
}

function ReviewCard({ review }) {
  const name = review.author?.name || review.author || 'Ẩn danh'
  const stars = review.stars || 5
  return (
    <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-card">
      <div className="flex items-center gap-3 mb-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0">
          {name[0]?.toUpperCase()||'?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-slate-800 truncate">{name}</p>
          <div className="flex gap-0.5 mt-0.5">
            {Array.from({length:5}).map((_,i) => (
              <svg key={i} className={`w-3 h-3 ${i<stars?'fill-amber-400':'fill-slate-200'}`} viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
        </div>
        {review.createdAt && <span className="text-[9px] text-slate-400">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>}
      </div>
      <p className="text-[12px] text-slate-600 leading-relaxed">{review.text}</p>
    </div>
  )
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
