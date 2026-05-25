import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useCafes } from '../hooks/useCafes'
import CafeCard from '../components/cafe/CafeCard'
import FilterPanel from '../components/search/FilterPanel'
import { SkeletonCard, SkeletonWide, SkeletonList } from '../components/ui/Skeleton'

const SORT_LABELS = {
  nearest: '📍 Gần nhất',
  rating:  '⭐ Đánh giá cao',
  price:   '💰 Giá rẻ nhất',
  open:    '🕐 Đang mở',
}

export default function ResultsPage() {
  const isDesktop  = useMediaQuery('(min-width: 1024px)')
  const [params]   = useSearchParams()
  const query      = params.get('q') || ''
  const lat        = params.get('lat')
  const lng        = params.get('lng')
  const sort       = params.get('sort') || (lat ? 'nearest' : 'rating')
  const amenities  = params.get('amenities') || ''
  const maxDist    = params.get('maxDist') || ''
  const price      = params.get('price') || ''

  const [viewMode,   setViewMode]   = useState('list')
  const [showFilter, setShowFilter] = useState(false)
  const [page,       setPage]       = useState(1)
  const LIMIT = 12

  /* Reset page khi filter thay đổi */
  useEffect(() => { setPage(1) }, [query, sort, amenities, maxDist, price])

  /* ── API call ── */
  const filters = {
    ...(query     && { q: query }),
    ...(lat && lng && { lat, lng }),
    ...(sort      && { sort }),
    ...(amenities && { amenities }),
    ...(maxDist   && { maxDist }),
    ...(price     && { price }),
    limit: LIMIT,
    page,
  }

  const { data, isLoading, isError, isFetching } = useCafes(filters)
  const cafes     = data?.cafes || []
  const total     = data?.total || cafes.length
  const totalPages = Math.ceil(total / LIMIT)

  /* ── Active filter count for badge ── */
  const filterCount = [amenities, maxDist, price].filter(Boolean).length

  return (
    <div className="fade-in">

      {/* ── Sticky top bar ── */}
      <div className="
        sticky top-0 z-30
        mesh-bg px-4 py-3
        border-b border-white/10
      ">
        <div className="flex items-center gap-2">

          {/* Compact search display */}
          <div className="
            flex-1 flex items-center gap-2
            bg-white/12 border border-white/25
            rounded-full px-3 py-2
            backdrop-blur-lg
          ">
            <svg className="w-3.5 h-3.5 text-teal2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Link to="/" className="text-[12px] font-medium text-white/70 truncate flex-1 text-left">
              {query || (lat ? 'Quán gần bạn' : 'Tất cả quán cafe')}
            </Link>
          </div>

          {/* Count badge */}
          <span className="
            glass px-3 py-1.5 rounded-full
            text-[11px] font-black text-white
            whitespace-nowrap flex-shrink-0
          ">
            {isLoading ? '...' : `${total} quán`}
          </span>

          {/* Filter button — mobile */}
          {!isDesktop && (
            <button
              onClick={() => setShowFilter(true)}
              className="
                glass text-white
                w-9 h-9 rounded-full flex-shrink-0
                flex items-center justify-center
                relative
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {filterCount > 0 && (
                <span className="
                  absolute -top-1 -right-1
                  w-4 h-4 gradient-teal rounded-full
                  text-[8px] font-black text-navy
                  flex items-center justify-center
                ">
                  {filterCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Sort chips row */}
        <div className="flex gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <SortChip
              key={value}
              label={label}
              active={sort === value}
              href={`/results?${buildParams(params, { sort: value, page: '1' })}`}
            />
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex">

        {/* Desktop filter sidebar */}
        {isDesktop && (
          <aside className="
            w-[220px] xl:w-[240px] flex-shrink-0
            border-r border-primary/10
            bg-white/70 backdrop-blur-sm
            px-4 py-5
            h-[calc(100vh-120px)] sticky top-[120px]
            overflow-y-auto no-scrollbar
          ">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] font-black text-accent">Bộ lọc</p>
              {filterCount > 0 && (
                <span className="badge-teal">{filterCount} đang bật</span>
              )}
            </div>
            <FilterPanel />
          </aside>
        )}

        {/* Main results area */}
        <div className="flex-1 px-4 py-4 min-w-0">

          {/* Controls bar */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-[14px] font-black text-accent">
                {isLoading ? 'Đang tải...' : `${total} quán`}
                {query && <span className="font-normal text-muted"> · "{query}"</span>}
              </p>
              {isFetching && !isLoading && (
                <p className="text-[10px] text-primary font-medium mt-0.5">Đang cập nhật...</p>
              )}
            </div>

            {/* View toggle — desktop */}
            {isDesktop && (
              <div className="flex gap-1 p-1 bg-surface-2 rounded-xl">
                {[
                  { mode: 'grid', icon: '⊞' },
                  { mode: 'list', icon: '☰' },
                ].map(({ mode, icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`
                      px-3 py-1.5 rounded-lg text-[12px] font-bold
                      transition-all duration-150
                      ${viewMode === mode
                        ? 'bg-white text-primary shadow-card'
                        : 'text-muted hover:text-accent'
                      }
                    `}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Error state */}
          {isError && (
            <div className="py-12 text-center rounded-2xl border border-rose-200 bg-rose-50">
              <div className="text-3xl mb-2">😕</div>
              <p className="text-[13px] font-bold text-rose-500">Không thể tải dữ liệu</p>
              <p className="text-[11px] text-rose-400 mt-1">Kiểm tra kết nối và thử lại</p>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            isDesktop && viewMode === 'grid' ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                {[1,2,3,4,5,6].map(i => <SkeletonWide key={i} />)}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {[1,2,3,4,5,6].map(i => <SkeletonList key={i} />)}
              </div>
            )
          )}

          {/* Results */}
          {!isLoading && !isError && (
            <>
              {cafes.length === 0 ? (
                <EmptyResults query={query} />
              ) : isDesktop && viewMode === 'grid' ? (
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                  {cafes.map((cafe, i) => (
                    <div
                      key={cafe._id}
                      className="fade-up"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <CafeCard cafe={cafe} size="wide" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {cafes.map((cafe, i) => (
                    <div
                      key={cafe._id}
                      className="fade-up"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <ResultListRow cafe={cafe} />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="
                      px-4 py-2 rounded-xl text-[12px] font-bold
                      border border-primary/20 text-primary
                      disabled:opacity-40 disabled:cursor-not-allowed
                      hover:bg-primary/5 transition-all
                    "
                  >
                    ← Trước
                  </button>
                  <span className="text-[12px] font-bold text-accent px-3">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="
                      px-4 py-2 rounded-xl text-[12px] font-bold
                      gradient-teal text-navy shadow-teal
                      disabled:opacity-40 disabled:cursor-not-allowed
                      hover:brightness-105 transition-all
                    "
                  >
                    Tiếp →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      {showFilter && <FilterPanel onClose={() => setShowFilter(false)} />}

    </div>
  )
}

/* ── List row card ── */
function ResultListRow({ cafe }) {
  const imageUrl = cafe.images?.[0] || cafe.imageUrl || null
  const isOpen   = checkOpen(cafe)

  return (
    <Link
      to={`/cafe/${cafe._id}`}
      className="
        flex items-center gap-3
        bg-white border border-primary/12
        rounded-2xl px-3 py-3
        shadow-card hover:shadow-hover
        transition-all duration-200 hover:-translate-y-0.5
      "
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={cafe.name} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full mesh-bg flex items-center justify-center text-white font-black text-xl">
            {cafe.name?.[0] || '☕'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-black text-accent truncate">{cafe.name}</p>
          {isOpen !== null && (
            <span className={`
              text-[9px] font-black px-2 py-0.5 rounded-full flex-shrink-0
              ${isOpen ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'}
            `}>
              {isOpen ? 'Mở' : 'Đóng'}
            </span>
          )}
        </div>

        <p className="text-[11px] text-muted font-medium mt-0.5 truncate">
          📍 {cafe.address}
        </p>

        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {cafe.rating?.toFixed(1) || '—'}
            {cafe.ratingCount > 0 && (
              <span className="text-muted font-normal">({cafe.ratingCount})</span>
            )}
          </span>

          {cafe.distance !== undefined && (
            <span className="text-[10px] text-primary font-semibold bg-primary/8 px-2 py-0.5 rounded-full">
              {typeof cafe.distance === 'number'
                ? cafe.distance < 1000 ? `${Math.round(cafe.distance)} m` : `${(cafe.distance/1000).toFixed(1)} km`
                : cafe.distance}
            </span>
          )}

          {cafe.minPrice > 0 && (
            <span className="text-[10px] text-muted font-medium">
              từ {(cafe.minPrice/1000).toFixed(0)}k
            </span>
          )}
        </div>

        {/* Tag pills */}
        {cafe.amenities?.length > 0 && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {cafe.amenities.slice(0, 3).map(tag => (
              <span key={tag} className="
                text-[9px] font-bold px-2 py-0.5 rounded-full
                bg-primary/8 text-primary border border-primary/15
              ">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}

function SortChip({ label, active, href }) {
  return (
    <Link
      to={href}
      className={`
        whitespace-nowrap px-3 py-1.5 rounded-full
        text-[10px] font-bold flex-shrink-0
        border transition-all duration-150
        ${active
          ? 'bg-white text-primary border-white shadow-sm'
          : 'border-white/25 text-white/70 hover:border-white/50 hover:text-white'
        }
      `}
    >
      {label}
    </Link>
  )
}

function EmptyResults({ query }) {
  return (
    <div className="py-16 text-center">
      <div className="text-5xl mb-4">☕</div>
      <p className="text-[15px] font-black text-accent mb-1">
        {query ? `Không tìm thấy "${query}"` : 'Chưa có quán nào'}
      </p>
      <p className="text-[12px] text-muted">
        {query ? 'Thử từ khóa khác hoặc điều chỉnh bộ lọc' : 'Hãy thử tìm kiếm hoặc thay đổi bộ lọc'}
      </p>
      <Link
        to="/"
        className="
          inline-block mt-5 px-6 py-2.5
          gradient-teal text-navy text-[12px] font-black
          rounded-full shadow-teal hover:brightness-105
          transition-all
        "
      >
        Về trang chủ
      </Link>
    </div>
  )
}

/* ── Helpers ── */
function checkOpen(cafe) {
  if (cafe.isOpen24h) return true
  if (!cafe.openTime || !cafe.closeTime) return null
  const now  = new Date()
  const [oh, om] = cafe.openTime.split(':').map(Number)
  const [ch, cm] = cafe.closeTime.split(':').map(Number)
  const mins = now.getHours() * 60 + now.getMinutes()
  return mins >= oh * 60 + om && mins <= ch * 60 + cm
}

function buildParams(current, overrides) {
  const next = new URLSearchParams(current)
  Object.entries(overrides).forEach(([k, v]) => {
    if (v) next.set(k, v)
    else next.delete(k)
  })
  return next.toString()
}
