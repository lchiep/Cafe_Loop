import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MENU = [
  { icon:'♡', label:'Quán yêu thích', sub:'Danh sách đã lưu', to:'/favorites', color:'text-rose-500', bg:'bg-rose-50' },
  { icon:'🕐', label:'Đã xem gần đây', sub:'Lịch sử duyệt quán', to:'/history', color:'text-blue-500', bg:'bg-blue-50' },
  { icon:'⭐', label:'Đánh giá của tôi', sub:'Nhận xét đã viết', to:'/my-reviews', color:'text-amber-500', bg:'bg-amber-50' },
  { icon:'⚙️', label:'Cài đặt', sub:'Thông tin cá nhân', to:'/settings', color:'text-slate-500', bg:'bg-slate-50' },
]

export default function ProfilePage() {
  const { user, logout } = useAuth()
  return (
    <div className="max-w-lg mx-auto px-4 py-8 fade-in">

      {/* User card */}
      <div className="hero-bg rounded-3xl p-6 mb-6 relative overflow-hidden shadow-hero">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-blue-400/10 blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none"/>
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-[24px] shadow-teal flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-[20px] font-bold text-white leading-tight">{user?.name || 'Khách'}</p>
            <p className="text-[12px] text-white/55 mt-0.5">{user?.email || 'Chưa đăng nhập'}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          {[['0','Yêu thích'],['0','Đánh giá'],['0','Đã xem']].map(([v,l]) => (
            <div key={l} className="flex-1 glass rounded-xl px-3 py-3 text-center border border-white/10">
              <p className="text-cyan-400 font-bold text-[18px] leading-none">{v}</p>
              <p className="text-white/50 text-[9px] font-medium mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-2 mb-6">
        {MENU.map(({ icon, label, sub, to, color, bg }) => (
          <Link key={to} to={to} className="flex items-center gap-4 px-4 py-4 bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-hover transition-all duration-200 hover:-translate-y-0.5 group">
            <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center text-[18px] flex-shrink-0`}>{icon}</div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-slate-800">{label}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
            </div>
            <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        ))}
      </div>

      {user
        ? <button onClick={logout} className="w-full py-3.5 rounded-2xl border-2 border-red-100 text-red-400 text-[13px] font-semibold hover:bg-red-50 transition-colors">Đăng xuất</button>
        : <div className="text-center">
            <p className="text-[13px] text-slate-400 mb-4">Đăng nhập để lưu quán yêu thích</p>
            <Link to="/login" className="inline-block bg-blue-500 text-white px-8 py-3 rounded-xl text-[13px] font-semibold shadow-blue hover:bg-blue-600 transition-all">Đăng nhập</Link>
          </div>
      }
    </div>
  )
}
