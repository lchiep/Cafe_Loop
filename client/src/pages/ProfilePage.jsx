import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/* ── Liquid Glass menu items ── */
const MENU = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
    ),
    label: 'Quán yêu thích', sub: 'Danh sách đã lưu', to: '/favorites',
    grad: 'from-rose-400 to-pink-500', glow: 'rgba(244,63,94,0.35)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    label: 'Đã xem gần đây', sub: 'Lịch sử duyệt quán', to: '/history',
    grad: 'from-blue-400 to-cyan-500', glow: 'rgba(59,130,246,0.35)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
      </svg>
    ),
    label: 'Đánh giá của tôi', sub: 'Nhận xét đã viết', to: '/my-reviews',
    grad: 'from-amber-400 to-orange-500', glow: 'rgba(245,158,11,0.35)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
    label: 'Cài đặt', sub: 'Thông tin cá nhân', to: '/settings',
    grad: 'from-violet-400 to-purple-500', glow: 'rgba(139,92,246,0.35)',
  },
]

/* ── User SVG icon ── */
function UserIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

export default function ProfilePage() {
  const { user, logout } = useAuth()

  return (
    <div
      className="min-h-screen w-full fade-in"
      style={{
        background: 'radial-gradient(ellipse at 20% 10%, rgba(59,130,246,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(6,182,212,0.15) 0%, transparent 50%), linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f2744 100%)',
      }}
    >
      <div className="max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

        {/* ── Hero card ── */}
        <div className="relative overflow-hidden rounded-3xl mb-8"
          style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18)',
          }}
        >
          {/* Decorative orbs */}
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none"/>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"/>

          <div className="relative p-6 lg:p-8">
            {/* Avatar + info */}
            <div className="flex items-center gap-5 mb-6">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center text-white"
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                    boxShadow: '0 4px 24px rgba(6,182,212,0.45)',
                  }}>
                  {user?.name
                    ? <span className="font-black text-[32px] lg:text-[38px] leading-none">{user.name[0].toUpperCase()}</span>
                    : <UserIcon size={40}/>
                  }
                </div>
                {/* Online dot */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900"/>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-2xl lg:text-3xl font-black text-white leading-tight truncate">
                  {user?.name || 'Khách'}
                </p>
                <p className="text-sm text-white/50 mt-1 truncate">
                  {user?.email || 'Chưa đăng nhập'}
                </p>
                {!user && (
                  <Link to="/login"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                    Đăng nhập ngay →
                  </Link>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: '0', l: 'Yêu thích', color: 'text-rose-400' },
                { v: '0', l: 'Đánh giá',  color: 'text-amber-400' },
                { v: '0', l: 'Đã xem',    color: 'text-cyan-400' },
              ].map(({ v, l, color }) => (
                <div key={l} className="text-center py-3 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }}>
                  <p className={`text-2xl lg:text-3xl font-black ${color} leading-none`}>{v}</p>
                  <p className="text-[10px] lg:text-xs text-white/45 font-medium mt-1.5 tracking-wide">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Menu items — Liquid Glass ── */}
        <div className="flex flex-col gap-3 mb-8">
          {MENU.map(({ icon, label, sub, to, grad, glow }, i) => (
            <Link key={to} to={to}
              className="group flex items-center gap-4 lg:gap-5 p-4 lg:p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.10)',
                animationDelay: `${i * 60}ms`,
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${glow}, inset 0 1px 0 rgba(255,255,255,0.15)` }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.10)' }}
            >
              {/* Icon */}
              <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br ${grad} transition-transform duration-300 group-hover:scale-110`}
                style={{ boxShadow: `0 4px 16px ${glow}` }}>
                {icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-[15px] lg:text-base font-bold text-white leading-tight">{label}</p>
                <p className="text-[12px] lg:text-sm text-white/45 mt-0.5">{sub}</p>
              </div>

              {/* Arrow */}
              <svg className="w-5 h-5 text-white/25 group-hover:text-white/70 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </Link>
          ))}
        </div>

        {/* ── Auth action ── */}
        {user ? (
          <button onClick={logout}
            className="w-full py-4 rounded-2xl text-sm font-bold text-rose-400 transition-all duration-200 hover:bg-rose-500/10"
            style={{
              background: 'rgba(244,63,94,0.06)',
              border: '1px solid rgba(244,63,94,0.2)',
            }}>
            Đăng xuất
          </button>
        ) : (
          <div className="text-center flex flex-col items-center gap-3">
            <Link to="/login"
              className="w-full py-4 rounded-2xl text-sm font-black text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                boxShadow: '0 4px 24px rgba(6,182,212,0.4)',
              }}>
              Đăng ký / Đăng nhập
            </Link>
            <p className="text-xs text-white/30">Đăng ký để lưu quán yêu thích</p>
          </div>
        )}
      </div>
    </div>
  )
}
