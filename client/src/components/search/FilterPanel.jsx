import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const SORT_OPTIONS = [
  { value: 'nearest',  label: '📍 Gần nhất' },
  { value: 'rating',   label: '⭐ Đánh giá cao' },
  { value: 'price',    label: '💰 Giá rẻ nhất' },
  { value: 'open',     label: '🕐 Đang mở cửa' },
]

const AMENITIES = [
  { value: 'wifi',       label: '📶 Wi-Fi' },
  { value: 'ac',         label: '❄️ Máy lạnh' },
  { value: 'outlet',     label: '🔌 Ổ cắm' },
  { value: 'parking',    label: '🅿️ Đỗ xe' },
  { value: 'pet',        label: '🐾 Pet-friendly' },
  { value: 'outdoor',    label: '🌿 Ngoài trời' },
]

const DISTANCES = [
  { value: '1000',  label: '< 1 km' },
  { value: '3000',  label: '< 3 km' },
  { value: '5000',  label: '< 5 km' },
]

const PRICE_RANGES = [
  { value: '0-50000',    label: '< 50k' },
  { value: '50000-100000', label: '50–100k' },
  { value: '100000+',    label: '> 100k' },
]

export default function FilterPanel({ onClose }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [params, setParams] = useSearchParams()

  const [sort,      setSort]      = useState(params.get('sort') || 'nearest')
  const [amenities, setAmenities] = useState(
    params.get('amenities') ? params.get('amenities').split(',') : []
  )
  const [distance,  setDistance]  = useState(params.get('maxDist') || '3000')
  const [price,     setPrice]     = useState(params.get('price') || '')

  function toggleAmenity(val) {
    setAmenities(prev =>
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    )
  }

  function applyFilters() {
    const next = new URLSearchParams(params)
    next.set('sort', sort)
    next.set('maxDist', distance)
    if (amenities.length) next.set('amenities', amenities.join(','))
    else next.delete('amenities')
    if (price) next.set('price', price)
    else next.delete('price')
    setParams(next)
    onClose?.()
  }

  function resetFilters() {
    setSort('nearest')
    setAmenities([])
    setDistance('3000')
    setPrice('')
  }

  /* ── Section header ── */
  const SectionLabel = ({ children }) => (
    <p className="text-[10px] font-black tracking-[1.6px] uppercase text-muted mb-2.5">
      {children}
    </p>
  )

  /* ── Toggle chip ── */
  const Chip = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`
        py-2 px-3 rounded-xl text-[11px] font-semibold
        border transition-all duration-150 text-left
        ${active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-primary/20 bg-white/60 text-muted hover:border-primary/40 hover:text-accent'
        }
      `}
    >
      {label}
    </button>
  )

  const content = (
    <div className="flex flex-col gap-5">

      {/* Sort */}
      <div>
        <SectionLabel>Sắp xếp theo</SectionLabel>
        <div className="grid grid-cols-2 gap-1.5">
          {SORT_OPTIONS.map(({ value, label }) => (
            <Chip
              key={value}
              label={label}
              active={sort === value}
              onClick={() => setSort(value)}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-primary/10" />

      {/* Amenities */}
      <div>
        <SectionLabel>Tiện ích</SectionLabel>
        <div className="grid grid-cols-2 gap-1.5">
          {AMENITIES.map(({ value, label }) => (
            <Chip
              key={value}
              label={label}
              active={amenities.includes(value)}
              onClick={() => toggleAmenity(value)}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-primary/10" />

      {/* Distance */}
      <div>
        <SectionLabel>Khoảng cách</SectionLabel>
        <div className="flex flex-col gap-1.5">
          {DISTANCES.map(({ value, label }) => (
            <Chip
              key={value}
              label={label}
              active={distance === value}
              onClick={() => setDistance(value)}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-primary/10" />

      {/* Price range */}
      <div>
        <SectionLabel>Mức giá</SectionLabel>
        <div className="flex flex-col gap-1.5">
          {PRICE_RANGES.map(({ value, label }) => (
            <Chip
              key={value}
              label={label}
              active={price === value}
              onClick={() => setPrice(price === value ? '' : value)}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={resetFilters}
          className="
            flex-1 py-2.5 rounded-xl text-[12px] font-bold
            border border-primary/20 text-muted
            hover:border-primary/40 hover:text-accent
            transition-all
          "
        >
          Xóa lọc
        </button>
        <button
          onClick={applyFilters}
          className="
            flex-1 py-2.5 rounded-xl text-[12px] font-black
            gradient-teal text-navy shadow-teal
            hover:brightness-105 transition-all
          "
        >
          Áp dụng
        </button>
      </div>
    </div>
  )

  /* ── Desktop: inline ── */
  if (isDesktop) return content

  /* ── Mobile: bottom sheet ── */
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" />
      <div
        className="
          absolute bottom-0 left-0 right-0
          bg-white rounded-t-3xl
          px-5 pt-4 pb-8
          shadow-deep
          max-h-[85vh] overflow-y-auto no-scrollbar
          fade-up
        "
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-primary/20 rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-5">
          <p className="text-[15px] font-black text-accent">Bộ lọc</p>
          <button onClick={onClose} className="text-muted hover:text-accent">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {content}
      </div>
    </div>
  )
}
