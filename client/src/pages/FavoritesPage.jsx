import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { encImg } from '../utils/encImg'

const PH = [
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80',
]

function checkOpen(cafe) {
  if (cafe.isOpen24h) return true
  if (!cafe.openTime || !cafe.closeTime) return null
  const now = new Date()
  const [oh, om] = cafe.openTime.split(':').map(Number)
  const [ch, cm] = cafe.closeTime.split(':').map(Number)
  const mins = now.getHours() * 60 + now.getMinutes()
  return mins >= oh * 60 + om && mins <= ch * 60 + cm
}

function CafeCard({ cafe, onRemove, index }) {
  const hash   = cafe._id?.split('').reduce((a,c) => a+c.charCodeAt(0), 0) || 0
  const imgUrl = encImg(cafe.images?.[0]) || PH[hash % PH.length]
  const isOpen = checkOpen(cafe)
  const isBig  = false // tắt bento big để tránh mất card

  return (
    <div className={`relative group fade-up ${isBig ? 'md:col-span-2' : ''}`}
      style={{ animationDelay: `${index * 60}ms` }}>
      <Link to={`/cafe/${cafe._id}`}
        className="block relative overflow-hidden rounded-2xl"
        style={{ height: isBig ? '280px' : '200px' }}>
        <img src={imgUrl} alt={cafe.name} loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={e => { e.target.src = PH[0] }}/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>

        {/* Status */}
        {isOpen !== null && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${
            isOpen ? 'bg-emerald-500 text-white' : 'bg-black/50 text-white/70'
          }`}>{isOpen ? '● Mở' : '● Đóng'}</span>
        )}

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-[14px] font-bold text-white leading-tight truncate">{cafe.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] text-white/60 truncate flex-1">📍 {cafe.address?.split(',').slice(-2).join(',')}</span>
            {cafe.rating > 0 && <span className="text-[11px] font-bold text-amber-400 flex-shrink-0">⭐ {cafe.rating.toFixed(1)}</span>}
          </div>
          {cafe.minPrice > 0 && (
            <p className="text-[10px] text-white/50 mt-0.5">từ {(cafe.minPrice/1000).toFixed(0)}k</p>
          )}
        </div>
      </Link>

      {/* Remove button */}
      <button onClick={e => { e.preventDefault(); onRemove(cafe._id) }}
        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
        style={{ background:'rgba(244,63,94,0.85)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.2)' }}>
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      </button>
    </div>
  )
}

export default function FavoritesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toggleFavorite, favorites } = useAuth()
  const [cafes,   setCafes]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    // Dùng global favorites từ AuthContext thay vì gọi API riêng
    import('../services/api').then(({ favoriteApi }) => {
      favoriteApi.list()
        .then(data => setCafes(data.cafes || []))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false))
    })
  }, [user])

  // Sync khi global favorites thay đổi (remove từ trang khác)
  useEffect(() => {
    if (cafes.length === 0) return
    setCafes(prev => prev.filter(c => favorites.has(c._id.toString())))
  }, [favorites])

  async function handleRemove(cafeId) {
    await toggleFavorite(cafeId)
    // setCafes sẽ tự sync qua useEffect trên
  }

  if (!user && !loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background:'linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f2744 100%)' }}>
      <div className="text-6xl mb-5">🔒</div>
      <h2 className="text-2xl font-bold text-white mb-2">Đăng nhập để xem yêu thích</h2>
      <p className="text-sm text-white/40 mb-8">Lưu và quản lý các quán cafe yêu thích của bạn</p>
      <Link to="/login" className="px-8 py-3.5 rounded-xl text-sm font-bold text-white"
        style={{ background:'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow:'0 4px 20px rgba(6,182,212,0.4)' }}>
        Đăng nhập ngay
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen fade-in"
      style={{ background:'radial-gradient(ellipse at 30% 20%, rgba(244,63,94,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(59,130,246,0.10) 0%, transparent 50%), linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f2744 100%)' }}>
      <div className="max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/profile" className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-white">Quán yêu thích</h1>
            <p className="text-sm text-white/40 mt-0.5">
              {loading ? 'Đang tải...' : `${cafes.length} quán đã lưu`}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl p-4 mb-6 text-sm text-rose-300"
            style={{ background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.2)' }}>
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className={`rounded-2xl skeleton-dark ${i===1?'md:col-span-2':''}`}
                style={{ height: i===1?'280px':'200px', background:'rgba(255,255,255,0.06)' }}/>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && cafes.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 text-4xl"
              style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}>
              🤍
            </div>
            <p className="text-xl font-bold text-white mb-2">Chưa có quán yêu thích</p>
            <p className="text-sm text-white/40 mb-8">Bấm vào ❤️ trên bất kỳ quán nào để lưu lại</p>
            <Link to="/results" className="px-8 py-3.5 rounded-xl text-sm font-bold text-white"
              style={{ background:'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow:'0 4px 20px rgba(6,182,212,0.4)' }}>
              Khám phá ngay
            </Link>
          </div>
        )}

        {/* Bento grid */}
        {!loading && cafes.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {cafes.map((cafe, i) => (
              <CafeCard key={cafe._id} cafe={cafe} onRemove={handleRemove} index={i}/>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
