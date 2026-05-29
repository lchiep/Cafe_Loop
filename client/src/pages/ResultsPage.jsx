import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useCafes } from '../hooks/useCafes'
import CafeCard from '../components/cafe/CafeCard'
import FilterPanel, { FilterToggleButton } from '../components/search/FilterPanel'
import WeatherClock from '../components/ui/WeatherClock'
import { SkeletonList } from '../components/ui/Skeleton'

/* ── Encode path with spaces ── */
function enc(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return path.split('/').map(s => encodeURIComponent(s)).join('/')
}


const SORT_OPTS = [
  { value: 'rating',  label: '⭐ Đánh giá' },
  { value: 'nearest', label: '📍 Gần nhất'  },
  { value: 'price',   label: '💰 Giá thấp'  },
]

const PLACEHOLDER_IMGS = [
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=200&q=80',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&q=80',
  'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=200&q=80',
]
function getImg(id) {
  const h = id ? id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 0
  return PLACEHOLDER_IMGS[h % PLACEHOLDER_IMGS.length]
}

export default function ResultsPage() {
  const isDesktop  = useMediaQuery('(min-width: 1024px)')
  const [params, setParams] = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const LIMIT = 12

  const q         = params.get('q') || ''
  const sort      = params.get('sort') || 'rating'
  const amenities = params.get('amenities') || ''
  const maxDist   = params.get('maxDist') || ''
  const price     = params.get('price') || ''
  const lat       = params.get('lat')
  const lng       = params.get('lng')

  useEffect(() => setPage(1), [q, sort, amenities, maxDist, price])

  const { data, isLoading, isError, isFetching } = useCafes({
    ...(q && { q }),
    ...(lat && lng && { lat, lng }),
    sort, amenities, maxDist, price,
    limit: LIMIT, page,
  })

  const cafes      = data?.cafes || []
  const total      = data?.total || cafes.length
  const totalPages = Math.ceil(total / LIMIT)
  const filterCount = [amenities, maxDist, price].filter(Boolean).length

  function setSort(v) {
    const next = new URLSearchParams(params)
    next.set('sort', v)
    next.delete('page')
    setParams(next)
  }

  return (
    <div className="fade-in">

      {/* ══ 1 KHỐI LIỀN: Weather + Search ══ */}
      <div className="hero-bg border-b border-white/10">
        {/* Weather clock */}
        <WeatherClock />
        {/* Divider nhẹ */}
        <div className="h-px bg-white/8 mx-4"/>
        {/* Search + filter bar */}
        <div className="sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center gap-3">

          {/* Search input */}
          <form onSubmit={e => {
            e.preventDefault()
            const v = e.target.q.value.trim()
            const n = new URLSearchParams(params)
            if (v) n.set('q', v)
            else n.delete('q')
            setParams(n)
          }}
            className="flex-1 flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 backdrop-blur-sm focus-within:bg-white/15 focus-within:border-white/35 transition-colors">
            <svg className="w-3.5 h-3.5 text-white/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input name="q" defaultValue={q}
              key={q} /* re-render khi q thay đổi từ bên ngoài */
              placeholder="Tìm quán cafe..."
              onChange={e => {
                /* Xóa hết → reset ngay lập tức */
                if (e.target.value === '') {
                  const n = new URLSearchParams(params)
                  n.delete('q')
                  setParams(n)
                }
              }}
              className="flex-1 bg-transparent text-[13px] text-white placeholder-white/40 font-medium outline-none"
            />
            {/* Clear button */}
            {q && (
              <button type="button" onClick={() => {
                const n = new URLSearchParams(params)
                n.delete('q')
                setParams(n)
              }} className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            )}
          </form>

          {/* Count */}
          <span className="glass px-3 py-2 rounded-xl text-[12px] font-bold text-white whitespace-nowrap border border-white/15">
            {isLoading ? '...' : `${total} quán`}
          </span>

          {/* Filter toggle button */}
          <FilterToggleButton
            onClick={() => setFilterOpen(true)}
            filterCount={filterCount}
          />
        </div>

        {/* Sort chips */}
        <div className="max-w-7xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {SORT_OPTS.map(({ value, label }) => (
            <button key={value} onClick={() => setSort(value)}
              className={`
                chip flex-shrink-0 transition-all duration-150
                ${sort === value
                  ? 'bg-white text-primary border-white shadow-sm'
                  : 'border-white/25 text-white/70 bg-white/8 hover:bg-white/15 hover:text-white'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      </div>{/* end 1 khối liền */}

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Status bar */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-[13px] font-semibold text-slate-500">
            {isLoading ? 'Đang tải...' : `${total} kết quả`}
            {q && <span className="text-slate-800"> · "{q}"</span>}
            {isFetching && !isLoading && <span className="text-blue-500 ml-2 animate-spin inline-block">↻</span>}
          </p>
          {filterCount > 0 && (
            <button onClick={() => setFilterOpen(true)}
              className="text-[11px] font-semibold text-blue-500 hover:text-blue-600">
              {filterCount} bộ lọc đang bật ✕
            </button>
          )}
        </div>

        {/* Error */}
        {isError && (
          <div className="py-12 text-center rounded-2xl border border-red-100 bg-red-50">
            <p className="text-[14px] font-semibold text-red-500">😕 Không thể tải dữ liệu</p>
            <p className="text-[12px] text-red-400 mt-1">Kiểm tra kết nối và thử lại</p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col gap-3">
            {[1,2,3,4,5,6].map(i => <SkeletonList key={i} />)}
          </div>
        )}

        {/* Results */}
        {!isLoading && !isError && (
          <>
            {cafes.length === 0 ? (
              <EmptyResults q={q} />
            ) : (
              <div className="flex flex-col gap-3">
                {cafes.map((cafe, i) => (
                  <div key={cafe._id} className="fade-up" style={{ animationDelay: `${i * 30}ms` }}>
                    <ResultRow cafe={cafe} getImg={getImg} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-5 py-2.5 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 disabled:opacity-40 hover:border-blue-300 hover:text-blue-500 transition-all">
                  ← Trước
                </button>
                <span className="text-[13px] font-bold text-slate-700 px-2">{page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-5 py-2.5 rounded-xl text-[12px] font-semibold bg-blue-500 text-white shadow-blue disabled:opacity-40 hover:bg-blue-600 transition-all">
                  Tiếp →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter panel — slide từ trái */}
      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
      />
    </div>
  )
}

function ResultRow({ cafe, getImg }) {
  const imgUrl = cafe.images?.[0] || getImg(cafe._id)
  const isOpen = checkOpen(cafe)
  return (
    <Link to={`/cafe/${cafe._id}`} className="
      flex items-center gap-4 p-4
      bg-white rounded-2xl border border-slate-100
      shadow-card hover:shadow-hover
      transition-all duration-250 hover:-translate-y-0.5 group
    ">
      <div className="w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0">
        <img src={enc(imgUrl)} alt={cafe.name} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => e.target.src = PLACEHOLDER_IMGS[0]}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-0.5">
          <p className="text-[14px] font-bold text-slate-900 truncate flex-1">{cafe.name}</p>
          {isOpen !== null && (
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0
              ${isOpen ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                       : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
              {isOpen ? '● Mở' : '● Đóng'}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 truncate mb-2">📍 {cafe.address}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 fill-amber-400" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-[12px] font-bold text-slate-700">{cafe.rating?.toFixed(1) || '—'}</span>
            {cafe.ratingCount > 0 && <span className="text-[10px] text-slate-400">({cafe.ratingCount})</span>}
          </span>
          {cafe.minPrice > 0 && (
            <span className="text-[10px] text-slate-400">từ {(cafe.minPrice / 1000).toFixed(0)}k</span>
          )}
          <div className="flex gap-1 ml-auto">
            {cafe.amenities?.slice(0, 2).map(a => (
              <span key={a} className="tag">{a}</span>
            ))}
          </div>
        </div>
      </div>
      <svg className="w-4 h-4 text-slate-300 flex-shrink-0 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all"
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
      </svg>
    </Link>
  )
}

function EmptyResults({ q }) {
  return (
    <div className="py-20 text-center">
      <div className="text-5xl mb-4">☕</div>
      <p className="text-[16px] font-bold text-slate-700 mb-1">
        {q ? `Không tìm thấy "${q}"` : 'Chưa có quán nào'}
      </p>
      <p className="text-[13px] text-slate-400 mb-6">Thử từ khóa khác hoặc điều chỉnh bộ lọc</p>
      <Link to="/" className="inline-block bg-blue-500 text-white px-6 py-2.5 rounded-xl text-[13px] font-semibold shadow-blue hover:bg-blue-600 transition-all">
        Về trang chủ
      </Link>
    </div>
  )
}

function checkOpen(cafe) {
  if (cafe.isOpen24h) return true
  if (!cafe.openTime || !cafe.closeTime) return null
  const now = new Date()
  const [oh, om] = cafe.openTime.split(':').map(Number)
  const [ch, cm] = cafe.closeTime.split(':').map(Number)
  const mins = now.getHours() * 60 + now.getMinutes()
  return mins >= oh * 60 + om && mins <= ch * 60 + cm
}
