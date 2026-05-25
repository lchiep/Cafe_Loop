import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useCafes } from '../hooks/useCafes'
import SearchBar from '../components/search/SearchBar'
import CafeCard from '../components/cafe/CafeCard'
import { SkeletonCard, SkeletonWide, SkeletonList } from '../components/ui/Skeleton'

const CHIPS = [
  { label: 'Tất cả',     filter: {} },
  { label: '📍 Gần đây', filter: { sort: 'nearest' } },
  { label: '🤫 Yên tĩnh', filter: { amenities: 'outdoor' } },
  { label: '📶 Wi-Fi',   filter: { amenities: 'wifi' } },
  { label: '🌿 Ngoài trời', filter: { amenities: 'outdoor' } },
  { label: '🕐 24h',     filter: { open24h: true } },
]

export default function HomePage() {
  const isDesktop  = useMediaQuery('(min-width: 1024px)')
  const [chip, setChip] = useState(0)

  /* ── Real API calls ── */
  const featured = useCafes({ sort: 'rating',   limit: isDesktop ? 3 : 6, featured: true })
  const nearby   = useCafes({ sort: 'nearest',  limit: 6, ...CHIPS[chip].filter })

  return (
    <div className="fade-in">

      {/* ── Hero section ── */}
      <section className="mesh-bg px-4 lg:px-8 pt-6 pb-6 relative overflow-hidden">

        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-teal2/20 blur-2xl pointer-events-none" />
        <div className="absolute top-12 -left-6 w-32 h-32 rounded-full bg-violet2/15 blur-xl pointer-events-none" />

        {/* Location pill */}
        <div className="inline-flex items-center gap-1.5 glass px-3 py-1 rounded-full mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-teal2 animate-pulse" />
          <p className="text-[10px] font-bold text-white/80 tracking-wide">📍 Hà Nội</p>
        </div>

        {/* Headline */}
        <h1 className="font-display text-[26px] lg:text-[34px] font-black text-white leading-[1.15] mb-1">
          Tìm quán <span className="text-teal2">cafe</span><br />
          hoàn hảo cho bạn
        </h1>
        <p className="text-[12px] text-white/60 font-medium mb-5">
          Khám phá 240+ quán cafe tại Hà Nội
        </p>

        {/* Stats — desktop only */}
        {isDesktop && (
          <div className="flex gap-3 mb-5">
            {[
              { val: '240+', lbl: 'Quán cafe' },
              { val: '18',   lbl: 'Quận/Huyện' },
              { val: '4.7',  lbl: 'Rating TB' },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="glass rounded-2xl px-5 py-3 text-center">
                <p className="text-teal2 font-black text-[20px] font-display">{val}</p>
                <p className="text-white/60 text-[9px] font-bold tracking-wide mt-0.5">{lbl}</p>
              </div>
            ))}
          </div>
        )}

        <SearchBar />
      </section>

      {/* ── Filter chips ── */}
      <div className="flex gap-2 px-4 py-3.5 overflow-x-auto no-scrollbar bg-bg border-b border-primary/10">
        {CHIPS.map(({ label }, i) => (
          <button
            key={label}
            onClick={() => setChip(i)}
            className={`chip ${i === chip ? 'chip-active' : 'chip-inactive'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Featured section ── */}
      <section className="px-4 pt-5 pb-2">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-[15px] lg:text-[17px] font-black text-accent">Nổi bật hôm nay</h2>
            <p className="text-[10px] text-muted font-medium mt-0.5">Được đánh giá cao nhất</p>
          </div>
          <Link to="/results?sort=rating" className="
            text-[11px] font-bold text-primary
            hover:text-primary-dk transition-colors
          ">
            Xem thêm →
          </Link>
        </div>

        {isDesktop ? (
          /* Desktop: 3-col grid */
          <div className="grid grid-cols-3 gap-3">
            {featured.isLoading
              ? [1,2,3].map(i => <SkeletonWide key={i} />)
              : featured.data?.cafes?.slice(0, 3).map(cafe => (
                  <CafeCard key={cafe._id} cafe={cafe} size="wide" />
                ))
            }
            {featured.isError && <ErrorCard />}
          </div>
        ) : (
          /* Mobile: horizontal scroll */
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
            {featured.isLoading
              ? [1,2,3].map(i => <SkeletonCard key={i} />)
              : featured.data?.cafes?.map(cafe => (
                  <CafeCard key={cafe._id} cafe={cafe} />
                ))
            }
            {featured.isError && <ErrorCard />}
          </div>
        )}
      </section>

      {/* ── Nearby / filtered section ── */}
      <section className="px-4 pt-5 pb-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-[15px] lg:text-[17px] font-black text-accent">
              {CHIPS[chip].label === 'Tất cả' ? 'Gợi ý cho bạn' : CHIPS[chip].label}
            </h2>
            <p className="text-[10px] text-muted font-medium mt-0.5">
              {nearby.data?.cafes?.length || 0} quán gần khu vực của bạn
            </p>
          </div>
          <Link to="/results" className="text-[11px] font-bold text-primary hover:text-primary-dk transition-colors">
            Xem tất cả →
          </Link>
        </div>

        <div className="flex flex-col gap-2.5">
          {nearby.isLoading
            ? [1,2,3,4].map(i => <SkeletonList key={i} />)
            : nearby.data?.cafes?.map(cafe => (
                <SuggestRow key={cafe._id} cafe={cafe} />
              ))
          }
          {nearby.isError && <ErrorCard />}
          {!nearby.isLoading && !nearby.data?.cafes?.length && !nearby.isError && (
            <EmptyState />
          )}
        </div>
      </section>

    </div>
  )
}

/* ── List row card ── */
function SuggestRow({ cafe }) {
  const imageUrl = cafe.images?.[0] || cafe.imageUrl || null

  return (
    <Link
      to={`/cafe/${cafe._id}`}
      className="
        flex items-center gap-3
        bg-white border border-primary/15
        rounded-2xl px-3 py-3
        shadow-card hover:shadow-hover
        transition-all duration-200
        hover:-translate-y-0.5
      "
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={cafe.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full mesh-bg flex items-center justify-center text-white font-black text-lg">
            {cafe.name?.[0] || '☕'}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-black text-accent truncate">{cafe.name}</p>
        <p className="text-[11px] text-muted font-medium mt-0.5 truncate">📍 {cafe.address}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {cafe.rating?.toFixed(1) || '—'}
          </span>
          {cafe.distance !== undefined && (
            <span className="text-[10px] text-muted">·</span>
          )}
          {cafe.distance !== undefined && (
            <span className="text-[10px] text-muted font-medium">
              {typeof cafe.distance === 'number'
                ? cafe.distance < 1000 ? `${Math.round(cafe.distance)} m` : `${(cafe.distance/1000).toFixed(1)} km`
                : cafe.distance
              }
            </span>
          )}
          {cafe.minPrice > 0 && (
            <>
              <span className="text-[10px] text-muted">·</span>
              <span className="text-[10px] text-muted font-medium">từ {(cafe.minPrice/1000).toFixed(0)}k</span>
            </>
          )}
        </div>
        {/* Amenity tags */}
        {cafe.amenities?.length > 0 && (
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {cafe.amenities.slice(0, 3).map(tag => (
              <span key={tag} className="
                text-[9px] font-bold px-2 py-0.5 rounded-full
                bg-primary/8 text-primary border border-primary/20
              ">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Arrow */}
      <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}

function ErrorCard() {
  return (
    <div className="
      py-8 text-center rounded-2xl
      border border-rose-200 bg-rose-50
    ">
      <p className="text-[13px] font-bold text-rose-500">😕 Không thể tải dữ liệu</p>
      <p className="text-[11px] text-rose-400 mt-1">Vui lòng thử lại sau</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="py-10 text-center">
      <div className="text-4xl mb-3">☕</div>
      <p className="text-[13px] font-bold text-muted">Chưa có quán nào ở đây</p>
      <p className="text-[11px] text-muted/70 mt-1">Thử tìm theo khu vực khác nhé</p>
    </div>
  )
}
