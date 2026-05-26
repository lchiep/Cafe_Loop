import { NavLink } from 'react-router-dom'

const NAV = [
  { label: 'Trang chủ', to: '/',         icon: (a) => a ? '🏠' : '🏠' },
  { label: 'Khám phá',  to: '/results',  icon: (a) => '🔍' },
  { label: 'Yêu thích', to: '/favorites',icon: (a) => a ? '❤️' : '♡' },
  { label: 'Hồ sơ',     to: '/profile',  icon: (a) => '👤' },
]

export default function BottomNav() {
  return (
    <nav className="
      lg:hidden fixed bottom-0 left-0 right-0 z-50
      flex justify-around items-center h-16 px-2
      bg-white/95 backdrop-blur-xl
      border-t border-slate-100
      shadow-[0_-4px_24px_rgba(0,0,0,0.08)]
    ">
      {NAV.map(({ label, to, icon }) => (
        <NavLink key={to} to={to} end={to==='/'} className={({ isActive }) => `
          flex flex-col items-center gap-1 flex-1 py-1.5
          text-[9px] font-semibold tracking-wide transition-colors
          ${isActive ? 'text-blue-600' : 'text-slate-400'}
        `}>
          {({ isActive }) => (
            <>
              <span className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                {icon(isActive)}
              </span>
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
