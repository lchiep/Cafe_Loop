import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { icon: '🏠', label: 'Trang chủ',  to: '/' },
  { icon: '🔍', label: 'Khám phá',   to: '/results' },
  { icon: '♡',  label: 'Yêu thích',  to: '/favorites' },
  { icon: '👤', label: 'Hồ sơ',      to: '/profile' },
]

const FILTERS = [
  { label: 'Tất cả',      icon: '✦', params: {} },
  { label: 'Gần đây',     icon: '📍', params: { sort: 'nearest' } },
  { label: 'Yên tĩnh',    icon: '🤫', params: { amenities: 'outdoor' } },
  { label: 'Có Wi-Fi',    icon: '📶', params: { amenities: 'wifi' } },
  { label: 'Ngoài trời',  icon: '🌿', params: { amenities: 'outdoor' } },
  { label: 'Mở 24h',      icon: '🕐', params: { open24h: 'true' } },
  { label: 'Pet-friendly', icon: '🐾', params: { amenities: 'pet' } },
]

export default function Sidebar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('Tất cả')

  function handleFilter(filter) {
    setActiveFilter(filter.label)
    const p = new URLSearchParams(filter.params)
    navigate(filter.label === 'Tất cả' ? '/results' : `/results?${p.toString()}`)
  }

  return (
    <aside className="
      hidden lg:flex flex-col w-[220px] xl:w-[240px] flex-shrink-0
      bg-white border-r border-slate-100
      py-6 px-3 gap-0.5 overflow-y-auto no-scrollbar
    ">
      <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 px-3 pb-2">Điều hướng</p>
      {NAV.map(({ icon, label, to }) => (
        <NavLink key={to} to={to} end={to === '/'}
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150
            ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
          `}
        >
          <span className="text-base w-5 text-center">{icon}</span>
          <span className="flex-1">{label}</span>
        </NavLink>
      ))}

      <div className="my-4 h-px bg-slate-100 mx-3" />

      <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 px-3 pb-2">Lọc nhanh</p>
      {FILTERS.map((filter) => (
        <button key={filter.label}
          onClick={() => handleFilter(filter)}
          className={`
            flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium text-left
            transition-all duration-150
            ${activeFilter === filter.label
              ? 'bg-blue-50 text-blue-600 font-semibold'
              : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
            }
          `}>
          <span className="text-sm">{filter.icon}</span>{filter.label}
        </button>
      ))}

      {/* User card */}
      <div className="mt-auto pt-4">
        <div className="rounded-2xl p-3.5 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-slate-800 truncate">{user?.name || 'Khách'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'Chưa đăng nhập'}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
