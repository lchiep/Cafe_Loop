import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    label: 'Trang chủ', to: '/'
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    label: 'Khám phá', to: '/results'
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    label: 'Yêu thích', to: '/favorites', badge: null
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    label: 'Hồ sơ', to: '/profile'
  },
]

const QUICK_FILTERS = [
  { label: 'Tất cả',        color: 'primary' },
  { label: 'Gần đây',       color: 'teal' },
  { label: 'Yên tĩnh',      color: 'violet' },
  { label: 'Có Wi-Fi',      color: 'azure' },
  { label: 'Ngoài trời',    color: 'sky' },
  { label: 'Mở 24h',        color: 'teal' },
  { label: 'Pet-friendly',  color: 'violet' },
]

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="
      hidden lg:flex flex-col
      w-[220px] xl:w-[240px] flex-shrink-0
      glass-panel
      py-5 px-3 gap-0.5
      overflow-y-auto no-scrollbar
    ">

      {/* ── Nav section ── */}
      <p className="
        text-[10px] font-black tracking-widest
        uppercase text-muted/70 px-3 pt-1 pb-2
      ">
        Điều hướng
      </p>

      {NAV_ITEMS.map(({ icon, label, to, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2.5
            rounded-xl text-[13px] font-semibold
            transition-all duration-150
            ${isActive
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'text-muted hover:bg-white/70 hover:text-accent'
            }
          `}
        >
          {({ isActive }) => (
            <>
              <span className={isActive ? 'text-primary' : 'text-muted'}>{icon}</span>
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="badge-teal">{badge}</span>
              )}
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </>
          )}
        </NavLink>
      ))}

      {/* ── Divider ── */}
      <div className="my-3 h-px bg-primary/10" />

      {/* ── Quick filters ── */}
      <p className="text-[10px] font-black tracking-widest uppercase text-muted/70 px-3 pb-2">
        Lọc nhanh
      </p>

      <div className="flex flex-col gap-1 px-1">
        {QUICK_FILTERS.map(({ label }, i) => (
          <button
            key={label}
            className={`
              py-2 px-3 rounded-xl text-[12px] font-semibold text-left
              transition-all duration-150
              ${i === 0
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted hover:bg-white/70 hover:text-accent'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── User card at bottom ── */}
      <div className="mt-auto pt-4">
        <div className="
          rounded-xl p-3
          bg-gradient-to-br from-primary/5 to-teal2/5
          border border-primary/15
        ">
          <div className="flex items-center gap-2.5">
            <div className="
              w-8 h-8 rounded-full
              gradient-teal
              flex items-center justify-center
              text-white font-black text-[12px]
              flex-shrink-0
            ">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-accent truncate">
                {user?.name || 'Khách'}
              </p>
              <p className="text-[10px] text-muted truncate">
                {user?.email || 'Đăng nhập ngay'}
              </p>
            </div>
          </div>
        </div>
      </div>

    </aside>
  )
}
