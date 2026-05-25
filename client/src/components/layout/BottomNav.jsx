import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  {
    icon: (active) => (
      <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    label: 'Trang chủ', to: '/'
  },
  {
    icon: (active) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    label: 'Tìm', to: '/results'
  },
  {
    icon: (active) => (
      <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    label: 'Yêu thích', to: '/favorites'
  },
  {
    icon: (active) => (
      <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    label: 'Hồ sơ', to: '/profile'
  },
]

export default function BottomNav() {
  return (
    <nav className="
      lg:hidden
      fixed bottom-0 left-0 right-0 z-50
      flex justify-around items-center
      h-[60px] px-2
      bg-white/85 border-t border-primary/15
      backdrop-blur-xl
      shadow-[0_-4px_24px_rgba(28,167,236,0.12)]
    ">
      {NAV_ITEMS.map(({ icon, label, to }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `
            flex flex-col items-center gap-0.5
            text-[9px] font-bold flex-1 py-1
            transition-colors duration-150
            ${isActive ? 'text-primary' : 'text-muted'}
          `}
        >
          {({ isActive }) => (
            <>
              <div className={`
                p-1 rounded-lg transition-all duration-200
                ${isActive ? 'bg-primary/10' : ''}
              `}>
                {icon(isActive)}
              </div>
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
