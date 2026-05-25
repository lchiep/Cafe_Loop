import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user, logout } = useAuth()

  const MENU_ITEMS = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      label: 'Quán yêu thích',
      sub:   'Danh sách đã lưu',
      badge: null,
      to:    '/favorites',
      color: 'text-rose-400',
      bg:    'bg-rose-50',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Đã xem gần đây',
      sub:   'Lịch sử duyệt quán',
      badge: null,
      to:    '/history',
      color: 'text-primary',
      bg:    'bg-primary/8',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      label: 'Đánh giá của tôi',
      sub:   'Nhận xét đã viết',
      badge: null,
      to:    '/my-reviews',
      color: 'text-amber-500',
      bg:    'bg-amber-50',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Cài đặt tài khoản',
      sub:   'Thông tin cá nhân',
      badge: null,
      to:    '/settings',
      color: 'text-muted',
      bg:    'bg-surface-2',
    },
  ]

  return (
    <div className="px-4 py-6 max-w-xl mx-auto fade-in">

      {/* ── User card ── */}
      <div className="
        relative overflow-hidden
        rounded-3xl mb-6
        mesh-bg p-5
        shadow-deep
      ">
        {/* Decorative blobs */}
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-teal2/20 blur-xl pointer-events-none" />

        <div className="relative flex items-center gap-4">
          {/* Avatar */}
          <div className="
            w-16 h-16 rounded-2xl
            gradient-teal flex items-center justify-center
            text-navy font-display font-black text-[26px]
            shadow-teal flex-shrink-0
          ">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-display font-black text-[20px] text-white leading-tight truncate">
              {user?.name || 'Khách'}
            </p>
            <p className="text-[12px] text-white/65 font-medium mt-0.5 truncate">
              {user?.email || 'Chưa đăng nhập'}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mt-4">
          {[
            { val: '0',  lbl: 'Yêu thích' },
            { val: '0',  lbl: 'Đánh giá' },
            { val: '0',  lbl: 'Đã xem' },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="glass rounded-xl px-4 py-2 text-center flex-1">
              <p className="text-teal2 font-black text-[16px]">{val}</p>
              <p className="text-white/60 text-[9px] font-bold mt-0.5">{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Menu items ── */}
      <div className="flex flex-col gap-2 mb-6">
        {MENU_ITEMS.map(({ icon, label, sub, badge, to, color, bg }) => (
          <Link
            key={to}
            to={to}
            className="
              flex items-center gap-3.5 px-4 py-3.5
              bg-white border border-primary/12
              rounded-2xl shadow-card
              hover:shadow-hover hover:-translate-y-0.5
              transition-all duration-200
            "
          >
            <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center flex-shrink-0`}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-accent">{label}</p>
              <p className="text-[10px] text-muted font-medium mt-0.5">{sub}</p>
            </div>
            {badge !== null && (
              <span className="badge-teal">{badge}</span>
            )}
            <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {/* ── Logout ── */}
      {user && (
        <button
          onClick={logout}
          className="
            w-full py-3.5 rounded-2xl
            border-2 border-rose-200 text-rose-500
            text-[13px] font-bold
            hover:bg-rose-50 transition-colors
          "
        >
          Đăng xuất
        </button>
      )}

      {!user && (
        <div className="text-center">
          <p className="text-[12px] text-muted mb-3">Đăng nhập để lưu quán yêu thích</p>
          <Link
            to="/login"
            className="
              inline-block gradient-teal text-navy
              px-8 py-3 rounded-full
              text-[13px] font-black shadow-teal
              hover:brightness-105 transition-all
            "
          >
            Đăng nhập
          </Link>
        </div>
      )}

    </div>
  )
}
