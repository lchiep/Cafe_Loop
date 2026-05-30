import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { encImg } from '../utils/encImg'

const PH = [
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80',
]
function ph(id) {
  const h = id ? id.split('').reduce((a,c)=>a+c.charCodeAt(0),0) : 0
  return PH[h % PH.length]
}

const TIME_LABELS = ['Hôm nay','Hôm qua','3 ngày trước','Tuần trước']

function BentoCard({ cafe, size = 'normal', delay = 0 }) {
  const img = encImg(cafe.images?.[0]) || ph(cafe._id)
  const big = size === 'big'
  return (
    <Link to={`/cafe/${cafe._id}`}
      className="group relative overflow-hidden rounded-2xl lg:rounded-3xl block"
      style={{
        animationDelay: `${delay}ms`,
        height: big ? '280px' : '200px',
      }}>
      {/* BG image */}
      <img src={img} alt={cafe.name} loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={e => { e.target.src = PH[0] }}
      />
      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"/>

      {/* Glass overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'rgba(6,182,212,0.08)', backdropFilter: 'blur(2px)' }}/>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className={`font-bold text-white leading-tight mb-1 ${big ? 'text-xl' : 'text-[14px]'}`}>{cafe.name}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-white/60 truncate">📍 {cafe.address?.split(',').slice(-2).join(',')}</span>
          {cafe.rating > 0 && (
            <span className="text-[11px] font-bold text-amber-400 flex-shrink-0">⭐ {cafe.rating.toFixed(1)}</span>
          )}
        </div>
      </div>

      {/* Time badge */}
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
        {TIME_LABELS[Math.floor(Math.random() * TIME_LABELS.length)]}
      </div>
    </Link>
  )
}

export default function HistoryPage() {
  const [cafes, setCafes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load từ localStorage history
    const raw = localStorage.getItem('cafeloop_history')
    if (raw) {
      try { setCafes(JSON.parse(raw)) } catch { setCafes([]) }
    }
    setLoading(false)
  }, [])

  return (
    <div className="min-h-screen fade-in"
      style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.15) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(6,182,212,0.12) 0%, transparent 50%), linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f2744 100%)',
      }}>
      <div className="max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/profile" className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-white">Đã xem gần đây</h1>
            <p className="text-sm text-white/40 mt-0.5">{cafes.length} quán đã ghé thăm</p>
          </div>
        </div>

        {loading ? (
          /* Skeleton */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="rounded-2xl skeleton" style={{ height: i % 3 === 0 ? '280px' : '200px' }}/>
            ))}
          </div>
        ) : cafes.length === 0 ? (
          /* Empty */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 text-4xl"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              🕐
            </div>
            <p className="text-xl font-bold text-white mb-2">Chưa có lịch sử</p>
            <p className="text-sm text-white/40 mb-8">Khám phá các quán cafe để xem lịch sử tại đây</p>
            <Link to="/results"
              className="px-8 py-3.5 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow: '0 4px 20px rgba(6,182,212,0.4)' }}>
              Khám phá ngay
            </Link>
          </div>
        ) : (
          /* Bento Grid */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {cafes.map((cafe, i) => (
              <div key={cafe._id}
                className={`fade-up ${i % 5 === 0 ? 'col-span-2 lg:col-span-1' : ''}`}
                style={{ animationDelay: `${i * 50}ms` }}>
                <BentoCard cafe={cafe} size={i % 5 === 0 ? 'big' : 'normal'} delay={i * 50}/>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

