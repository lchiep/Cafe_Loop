import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const SORT_OPTS   = [{v:'nearest',l:'📍 Gần nhất'},{v:'rating',l:'⭐ Đánh giá'},{v:'price',l:'💰 Giá thấp'}]
const AMENITIES   = [{v:'wifi',l:'📶 Wi-Fi'},{v:'ac',l:'❄️ Máy lạnh'},{v:'outlet',l:'🔌 Ổ cắm'},{v:'parking',l:'🅿️ Đỗ xe'},{v:'pet',l:'🐾 Pet-friendly'},{v:'outdoor',l:'🌿 Ngoài trời'}]
const DISTANCES   = [{v:'1000',l:'< 1 km'},{v:'3000',l:'< 3 km'},{v:'5000',l:'< 5 km'}]
const PRICES      = [{v:'0-50000',l:'Dưới 50k'},{v:'50000-100000',l:'50 – 100k'},{v:'100000+',l:'Trên 100k'}]

const Label = ({children}) => (
  <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2.5">{children}</p>
)
const Opt = ({label, active, onClick}) => (
  <button onClick={onClick} className={`
    w-full text-left px-3.5 py-2.5 rounded-xl text-[12px] font-medium
    border transition-all duration-150
    ${active
      ? 'border-blue-300 bg-blue-50 text-blue-700 font-semibold'
      : 'border-slate-150 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'
    }
  `}>{label}</button>
)

export default function FilterPanel({ onClose }) {
  const [params, setParams] = useSearchParams()
  const [sort,      setSort]      = useState(params.get('sort') || 'nearest')
  const [amenities, setAmenities] = useState(params.get('amenities') ? params.get('amenities').split(',') : [])
  const [distance,  setDistance]  = useState(params.get('maxDist') || '3000')
  const [price,     setPrice]     = useState(params.get('price') || '')

  function toggleAmenity(v) {
    setAmenities(p => p.includes(v) ? p.filter(x=>x!==v) : [...p,v])
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
  function reset() { setSort('nearest'); setAmenities([]); setDistance('3000'); setPrice('') }

  const body = (
    <div className="flex flex-col gap-5">
      <div><Label>Sắp xếp</Label><div className="flex flex-col gap-1.5">{SORT_OPTS.map(({v,l}) => <Opt key={v} label={l} active={sort===v} onClick={()=>setSort(v)}/>)}</div></div>
      <div className="h-px bg-slate-100"/>
      <div><Label>Tiện ích</Label><div className="grid grid-cols-2 gap-1.5">{AMENITIES.map(({v,l}) => <Opt key={v} label={l} active={amenities.includes(v)} onClick={()=>toggleAmenity(v)}/>)}</div></div>
      <div className="h-px bg-slate-100"/>
      <div><Label>Khoảng cách</Label><div className="flex flex-col gap-1.5">{DISTANCES.map(({v,l}) => <Opt key={v} label={l} active={distance===v} onClick={()=>setDistance(v)}/>)}</div></div>
      <div className="h-px bg-slate-100"/>
      <div><Label>Mức giá</Label><div className="flex flex-col gap-1.5">{PRICES.map(({v,l}) => <Opt key={v} label={l} active={price===v} onClick={()=>setPrice(price===v?'':v)}/>)}</div></div>
      <div className="flex gap-2 pt-1">
        <button onClick={reset} className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-500 hover:border-slate-300 transition-all">Xóa lọc</button>
        <button onClick={apply} className="flex-1 py-2.5 rounded-xl text-[12px] font-bold bg-blue-500 text-white shadow-blue hover:bg-blue-600 transition-all">Áp dụng</button>
      </div>
    </div>
  )

  if (onClose) {
    return (
      <div className="fixed inset-0 z-50" onClick={onClose}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"/>
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl px-5 pt-4 pb-10 shadow-hero max-h-[85vh] overflow-y-auto no-scrollbar fade-up" onClick={e=>e.stopPropagation()}>
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5"/>
          <div className="flex justify-between items-center mb-5">
            <p className="text-[15px] font-bold text-slate-900">Bộ lọc</p>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          {body}
        </div>
      </div>
    )
  }
  return body
}
