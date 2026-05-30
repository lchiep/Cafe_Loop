import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
// encImg inline
function encImg(p) { if (!p) return null; if (p.startsWith('http')) return p; return p.split('/').map((s,i) => i===0&&s===''?'':encodeURIComponent(s)).join('/') }

const PH = [
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
]

/* Mock data — thay bằng API sau */
const MOCK_REVIEWS = [
  { _id:'1', stars:5, text:'Quán rất đẹp, view thoáng, cà phê thơm ngon. Nhân viên thân thiện. Sẽ quay lại lần sau!', createdAt:'2026-05-20', cafe:{ _id:'abc', name:'Lofi Lab', address:'Cầu Giấy, Hà Nội', images:['/img/Lofi Lab/0.jpg'] } },
  { _id:'2', stars:4, text:'Không gian yên tĩnh, phù hợp để làm việc. WiFi nhanh, đồ uống ngon. Hơi đắt một chút nhưng xứng đáng.', createdAt:'2026-05-15', cafe:{ _id:'def', name:'Bonjour Café', address:'Tây Hồ, Hà Nội', images:['/img/Bonjour Cafe/0.jpg'] } },
  { _id:'3', stars:5, text:'View rooftop cực đẹp, chụp ảnh rất oke. Đồ uống ngon, giá hợp lý.', createdAt:'2026-05-10', cafe:{ _id:'ghi', name:'Aries Rooftop', address:'Đống Đa, Hà Nội', images:[] } },
]

function StarRow({ stars }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({length:5}).map((_,i) => (
        <svg key={i} className={`w-4 h-4 ${i < stars ? 'fill-amber-400' : 'fill-white/15'}`} viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

/* ── Modal Glassmorphism ── */
function ReviewModal({ review, onClose }) {
  const img = encImg(review.cafe.images?.[0]) || PH[review._id.charCodeAt(0) % PH.length]
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" style={{ backdropFilter: 'blur(12px)' }}/>

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(15,23,42,0.6)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
        onClick={e => e.stopPropagation()}>

        {/* Hero image */}
        <div className="relative h-52 lg:h-64 overflow-hidden">
          <img src={img} alt={review.cafe.name}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = PH[0] }}/>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"/>

          {/* Liquid glass orbs */}
          <div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-cyan-400/10 blur-2xl"/>
          <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl"/>

          {/* Close */}
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
            style={{ background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.2)', backdropFilter:'blur(8px)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          {/* Cafe name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-xl font-black text-white">{review.cafe.name}</p>
            <p className="text-xs text-white/55 mt-0.5">📍 {review.cafe.address}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 lg:p-6">
          {/* Stars + date */}
          <div className="flex items-center justify-between mb-4">
            <StarRow stars={review.stars}/>
            <span className="text-xs text-white/35">
              {new Date(review.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>

          {/* Review text */}
          <div className="rounded-2xl p-4"
            style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-sm text-white/80 leading-relaxed">{review.text}</p>
          </div>

          <Link to={`/cafe/${review.cafe._id}`}
            className="mt-4 w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:brightness-110"
            style={{ background:'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow:'0 4px 16px rgba(6,182,212,0.4)' }}>
            Xem quán này →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function MyReviewsPage() {
  const { user } = useAuth()
  const [selected, setSelected] = useState(null)
  const reviews = user ? MOCK_REVIEWS : []

  return (
    <div className="min-h-screen fade-in"
      style={{
        background: 'radial-gradient(ellipse at 20% 30%, rgba(245,158,11,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(59,130,246,0.12) 0%, transparent 50%), linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f2744 100%)',
      }}>
      <div className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/profile" className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-white">Đánh giá của tôi</h1>
            <p className="text-sm text-white/40 mt-0.5">{reviews.length} nhận xét đã viết</p>
          </div>
        </div>

        {!user ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">⭐</div>
            <p className="text-xl font-bold text-white mb-2">Chưa đăng nhập</p>
            <p className="text-sm text-white/40 mb-8">Đăng nhập để xem các đánh giá của bạn</p>
            <Link to="/login" className="px-8 py-3.5 rounded-xl text-sm font-bold text-white"
              style={{ background:'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow:'0 4px 20px rgba(6,182,212,0.4)' }}>
              Đăng nhập
            </Link>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">✍️</div>
            <p className="text-xl font-bold text-white mb-2">Chưa có đánh giá nào</p>
            <p className="text-sm text-white/40 mb-8">Hãy ghé thăm và đánh giá các quán cafe bạn đã đến</p>
            <Link to="/results" className="px-8 py-3.5 rounded-xl text-sm font-bold text-white"
              style={{ background:'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow:'0 4px 20px rgba(6,182,212,0.4)' }}>
              Khám phá ngay
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reviews.map((review, i) => {
              const img = encImg(review.cafe.images?.[0]) || PH[i % PH.length]
              return (
                <button key={review._id}
                  onClick={() => setSelected(review)}
                  className="fade-up text-left w-full group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    animationDelay: `${i * 70}ms`,
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                  }}>
                  <div className="flex gap-0">
                    {/* Image strip */}
                    <div className="w-24 lg:w-32 flex-shrink-0 relative overflow-hidden">
                      <img src={img} alt={review.cafe.name} loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={e => { e.target.src = PH[0] }}/>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/50"/>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 lg:p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-[14px] lg:text-base font-bold text-white leading-tight">{review.cafe.name}</p>
                        <span className="text-[10px] text-white/30 flex-shrink-0">
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <StarRow stars={review.stars}/>
                      <p className="text-[12px] lg:text-sm text-white/55 mt-2 leading-relaxed line-clamp-2">{review.text}</p>
                      <p className="text-[11px] text-cyan-400/70 mt-2 font-medium">Nhấn để xem chi tiết →</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {selected && <ReviewModal review={selected} onClose={() => setSelected(null)}/>}
    </div>
  )
}
