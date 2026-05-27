import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const SORT_OPTS = [
  { v: 'nearest', l: '📍 Gần nhất'    },
  { v: 'rating',  l: '⭐ Đánh giá cao' },
  { v: 'price',   l: '💰 Giá thấp nhất'},
]
const AMENITIES = [
  { v: 'wifi',    l: '📶 Wi-Fi'       },
  { v: 'ac',      l: '❄️ Máy lạnh'    },
  { v: 'outlet',  l: '🔌 Ổ cắm'       },
  { v: 'parking', l: '🅿️ Đỗ xe'       },
  { v: 'pet',     l: '🐾 Pet-friendly' },
  { v: 'outdoor', l: '🌿 Ngoài trời'  },
]
const DISTANCES = [
  { v: '1000', l: '< 1 km' },
  { v: '3000', l: '< 3 km' },
  { v: '5000', l: '< 5 km' },
]
const PRICES = [
  { v: '0-50000',       l: 'Dưới 50k'   },
  { v: '50000-100000',  l: '50 – 100k'  },
  { v: '100000+',       l: 'Trên 100k'  },
]

const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-black tracking-widest uppercase text-white/50 mb-2.5 px-1">
    {children}
  </p>
)

const Opt = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full text-left px-4 py-2.5 rounded-xl text-[12px] font-semibold
      border transition-all duration-150
      ${active
        ? 'bg-white/20 border-white/40 text-white shadow-[0_2px_12px_rgba(255,255,255,0.1)]'
        : 'bg-white/5 border-white/10 text-white/65 hover:bg-white/12 hover:text-white hover:border-white/25'
      }
    `}
  >
    {label}
  </button>
)

/* ── Toggle button — nút [===v===] ── */
export function FilterToggleButton({ onClick, filterCount }) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center gap-2 px-4 py-2
        bg-white/10 border border-white/20
        backdrop-blur-md rounded-full
        text-white text-[12px] font-semibold
        hover:bg-white/18 transition-all duration-200
        relative
      "
    >
      {/* Lines icon */}
      <div className="flex flex-col gap-[3px]">
        <div className="w-3.5 h-[1.5px] bg-white rounded-full"/>
        <div className="w-2.5 h-[1.5px] bg-white/70 rounded-full"/>
        <div className="w-3.5 h-[1.5px] bg-white rounded-full"/>
      </div>
      <span>Lọc</span>
      {filterCount > 0 && (
        <span className="
          w-4 h-4 rounded-full bg-cyan-400 text-slate-900
          text-[9px] font-black flex items-center justify-center
          absolute -top-1 -right-1
        ">
          {filterCount}
        </span>
      )}
    </button>
  )
}

export default function FilterPanel({ open, onClose, inline = false }) {
  const isDesktop   = useMediaQuery('(min-width: 1024px)')
  const [params, setParams] = useSearchParams()

  const [sort,      setSort]      = useState(params.get('sort') || 'nearest')
  const [amenities, setAmenities] = useState(
    params.get('amenities') ? params.get('amenities').split(',') : []
  )
  const [distance,  setDistance]  = useState(params.get('maxDist') || '3000')
  const [price,     setPrice]     = useState(params.get('price') || '')

  function toggle(val) {
    setAmenities(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val])
  }

  function apply() {
    const next = new URLSearchParams(params)
    next.set('sort', sort)
    next.set('maxDist', distance)
    amenities.length ? next.set('amenities', amenities.join(',')) : next.delete('amenities')
    price ? next.set('price', price) : next.delete('price')
    setParams(next)
    onClose?.()
  }

  function reset() {
    setSort('nearest')
    setAmenities([])
    setDistance('3000')
    setPrice('')
  }

  const content = (
    <div className="flex flex-col gap-5 h-full">

      {/* Sắp xếp */}
      <div>
        <SectionLabel>Sắp xếp</SectionLabel>
        <div className="flex flex-col gap-1.5">
          {SORT_OPTS.map(({ v, l }) => (
            <Opt key={v} label={l} active={sort === v} onClick={() => setSort(v)} />
          ))}
        </div>
      </div>

      <div className="h-px bg-white/10" />

      {/* Tiện ích */}
      <div>
        <SectionLabel>Tiện ích</SectionLabel>
        <div className="grid grid-cols-2 gap-1.5">
          {AMENITIES.map(({ v, l }) => (
            <Opt key={v} label={l} active={amenities.includes(v)} onClick={() => toggle(v)} />
          ))}
        </div>
      </div>

      <div className="h-px bg-white/10" />

      {/* Khoảng cách */}
      <div>
        <SectionLabel>Khoảng cách</SectionLabel>
        <div className="flex flex-col gap-1.5">
          {DISTANCES.map(({ v, l }) => (
            <Opt key={v} label={l} active={distance === v} onClick={() => setDistance(v)} />
          ))}
        </div>
      </div>

      <div className="h-px bg-white/10" />

      {/* Mức giá */}
      <div>
        <SectionLabel>Mức giá</SectionLabel>
        <div className="flex flex-col gap-1.5">
          {PRICES.map(({ v, l }) => (
            <Opt key={v} label={l} active={price === v} onClick={() => setPrice(price === v ? '' : v)} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2">
        <button
          onClick={reset}
          className="
            flex-1 py-2.5 rounded-xl text-[12px] font-semibold
            bg-white/8 border border-white/15 text-white/70
            hover:bg-white/15 hover:text-white transition-all
          "
        >
          Xóa lọc
        </button>
        <button
          onClick={apply}
          className="
            flex-1 py-2.5 rounded-xl text-[12px] font-bold
            bg-gradient-to-r from-cyan-400 to-blue-500
            text-white shadow-[0_4px_16px_rgba(6,182,212,0.4)]
            hover:brightness-105 transition-all
          "
        >
          Áp dụng
        </button>
      </div>
    </div>
  )

  /* ── Inline (desktop sidebar ResultsPage) ── */
  if (inline) return content

  /* ── Slide-in panel từ trái ── */
  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-40 transition-opacity duration-300
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          bg-slate-900/40 backdrop-blur-[2px]
        `}
        onClick={onClose}
      />

      {/* Panel trượt từ trái */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-[280px]
        transition-transform duration-300 ease-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Liquid glass background */}
        <div className="
          h-full px-5 py-6 flex flex-col
          bg-gradient-to-b from-slate-900/95 to-slate-800/95
          backdrop-blur-2xl
          border-r border-white/10
          shadow-[4px_0_40px_rgba(0,0,0,0.4)]
        ">
          {/* Shimmer top edge */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[16px] font-bold text-white">Bộ lọc</p>
              <p className="text-[10px] text-white/40 mt-0.5">Tìm quán phù hợp với bạn</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {content}
          </div>
        </div>
      </div>
    </>
  )
}
