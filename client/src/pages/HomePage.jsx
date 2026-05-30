import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useCafes } from '../hooks/useCafes'
import SearchBar from '../components/search/SearchBar'
import CafeCard from '../components/cafe/CafeCard'
import FeaturedCard from '../components/cafe/FeaturedCard'
import { SkeletonCard, SkeletonWide, SkeletonList } from '../components/ui/Skeleton'

const CHIPS = [
  { label: 'Tất cả',     filter: {},                       icon: '✦' },
  { label: 'Gần đây',    filter: { sort: 'nearest' },      icon: '📍' },
  { label: 'Yên tĩnh',   filter: { amenities: 'outdoor' }, icon: '🤫' },
  { label: 'Wi-Fi',      filter: { amenities: 'wifi' },    icon: '📶' },
  { label: 'Ngoài trời', filter: { amenities: 'outdoor' }, icon: '🌿' },
  { label: 'Mở 24h',     filter: { open24h: true },        icon: '🕐' },
]

/* ── Skeleton cho FeaturedCard ── */
function SkeletonFeatured() {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-100 bg-white">
      <div className="flex flex-col lg:flex-row h-72">
        <div className="lg:w-[58%] skeleton h-52 lg:h-full"/>
        <div className="flex-1 p-4 flex flex-col gap-3">
          <div className="skeleton h-4 w-24 rounded"/>
          <div className="flex gap-1.5">
            <div className="skeleton h-5 w-16 rounded-full"/>
            <div className="skeleton h-5 w-14 rounded-full"/>
            <div className="skeleton h-5 w-20 rounded-full"/>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-1.5">
            <div className="skeleton row-span-2 rounded-xl"/>
            <div className="skeleton rounded-xl"/>
            <div className="skeleton rounded-xl"/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const navigate  = useNavigate()
  const [chip, setChip] = useState(0)

  const featured = useCafes({ sort: 'rating', limit: 3, featured: true })
  const nearby   = useCafes({ sort: 'nearest', limit: 8, ...CHIPS[chip].filter })

  function handleChip(i) {
    setChip(i)
    const f = CHIPS[i].filter
    if (f.amenities) navigate(`/results?amenities=${f.amenities}`)
    else if (f.sort && f.sort !== 'nearest') navigate(`/results?sort=${f.sort}`)
  }

  return (
    <div className="fade-in">

      {/* ── Hero ── */}
      <section className="hero-bg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"/>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none"/>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-10 pb-12 relative z-10">
          <div className="inline-flex items-center gap-2 glass px-3.5 py-1.5 rounded-full mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"/>
            <span className="text-[11px] font-semibold text-white/75 tracking-wide">📍 Hà Nội, Việt Nam</span>
          </div>

          <div className={`${isDesktop ? 'flex items-end justify-between mb-8' : 'mb-6'}`}>
            <div>
              <h1 className="font-display text-[32px] lg:text-[44px] font-bold text-white leading-[1.18] mb-3">
                Tìm quán <em className="not-italic text-cyan-400">cafe</em><br/>
                hoàn hảo cho bạn
              </h1>
              <p className="text-[14px] text-white/55 font-medium">
                Khám phá 240+ quán cafe chất lượng tại Hà Nội
              </p>
            </div>
            {isDesktop && (
              <div className="flex gap-3 flex-shrink-0">
                {[['240+','Quán cafe'],['18','Quận/Huyện'],['4.7★','Rating TB']].map(([v,l]) => (
                  <div key={l} className="glass rounded-2xl px-6 py-4 text-center border border-white/10">
                    <p className="text-cyan-400 font-bold text-[22px] leading-none">{v}</p>
                    <p className="text-white/50 text-[10px] font-medium mt-1.5 tracking-wide">{l}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <SearchBar/>

          {!isDesktop && (
            <div className="flex gap-3 mt-5">
              {[['240+','Quán'],['18','Quận'],['4.7★','Rating']].map(([v,l]) => (
                <div key={l} className="flex-1 glass rounded-xl px-3 py-2.5 text-center border border-white/10">
                  <p className="text-cyan-400 font-bold text-[16px] leading-none">{v}</p>
                  <p className="text-white/50 text-[9px] font-medium mt-1">{l}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Filter chips ── */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
          {CHIPS.map(({ label, icon }, i) => (
            <button key={label} onClick={() => handleChip(i)}
              className={`chip ${i === chip ? 'chip-active' : 'chip-inactive'}`}>
              <span className="text-[12px]">{icon}</span>{label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        {/* ── Featured — layout mới ── */}
        <section className="pt-8 pb-6">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h2 className="text-[18px] lg:text-[20px] font-bold text-slate-900">Nổi bật hôm nay</h2>
              <p className="text-[12px] text-slate-400 mt-0.5">Được đánh giá cao nhất tuần này</p>
            </div>
            <Link to="/results?sort=rating" className="text-[12px] font-semibold text-blue-500 hover:text-blue-600 transition-colors">
              Xem thêm →
            </Link>
          </div>

          {isDesktop ? (
            <div className="grid grid-cols-3 gap-4">
              {featured.isLoading
                ? [1,2,3].map(i => <SkeletonFeatured key={i}/>)
                : featured.data?.cafes?.slice(0,3).map((cafe,i) => (
                    <div key={cafe._id} className="fade-up" style={{animationDelay:`${i*80}ms`}}>
                      <FeaturedCard cafe={cafe}/>
                    </div>
                  ))
              }
            </div>
          ) : (
            /* Mobile: scroll ngang */
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
              {featured.isLoading
                ? [1,2,3].map(i => (
                    <div key={i} className="w-[300px] flex-shrink-0">
                      <SkeletonFeatured/>
                    </div>
                  ))
                : featured.data?.cafes?.map(cafe => (
                    <div key={cafe._id} className="w-[300px] flex-shrink-0">
                      <FeaturedCard cafe={cafe}/>
                    </div>
                  ))
              }
            </div>
          )}
        </section>

        <div className="h-px bg-slate-100"/>

        {/* ── Suggest list ── */}
        <section className="py-8">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h2 className="text-[18px] lg:text-[20px] font-bold text-slate-900">
                {chip === 0 ? 'Gợi ý cho bạn' : CHIPS[chip].icon + ' ' + CHIPS[chip].label}
              </h2>
              <p className="text-[12px] text-slate-400 mt-0.5">
                {nearby.data?.cafes?.length || 0} quán trong khu vực
              </p>
            </div>
            <Link to="/results" className="text-[12px] font-semibold text-blue-500 hover:text-blue-600 transition-colors">
              Xem tất cả →
            </Link>
          </div>

          <div className={`${isDesktop ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3'}`}>
            {nearby.isLoading
              ? [1,2,3,4].map(i => <SkeletonList key={i}/>)
              : nearby.data?.cafes?.map((cafe,i) => (
                  <div key={cafe._id} className="fade-up" style={{animationDelay:`${i*35}ms`}}>
                    <SuggestRow cafe={cafe}/>
                  </div>
                ))
            }
          </div>
        </section>

      </div>
    </div>
  )
}

function SuggestRow({ cafe }) {
  const PH_IMGS = [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&q=80',
    'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=200&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&q=80',
  ]
  const hash   = cafe._id ? cafe._id.split('').reduce((a,c)=>a+c.charCodeAt(0),0) : 0
  const imgUrl = cafe.images?.[0] || PH_IMGS[hash % PH_IMGS.length]
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
          onError={e => e.target.src = PH_IMGS[0]}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <p className="text-[14px] font-bold text-slate-900 truncate">{cafe.name}</p>
          {isOpen !== null && (
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
              isOpen ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                     : 'bg-slate-50 text-slate-400 border border-slate-200'
            }`}>{isOpen ? '● Mở' : '● Đóng'}</span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 font-medium truncate mb-2">📍 {cafe.address}</p>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 fill-amber-400" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-[12px] font-bold text-slate-700">{cafe.rating?.toFixed(1)||'—'}</span>
            {cafe.ratingCount > 0 && <span className="text-[10px] text-slate-400">({cafe.ratingCount})</span>}
          </span>
          {cafe.minPrice > 0 && (
            <span className="text-[10px] text-slate-400">từ {(cafe.minPrice/1000).toFixed(0)}k</span>
          )}
          <div className="flex gap-1 ml-auto">
            {cafe.amenities?.slice(0,2).map(a => <span key={a} className="tag">{a}</span>)}
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

function checkOpen(cafe) {
  if (cafe.isOpen24h) return true
  if (!cafe.openTime || !cafe.closeTime) return null
  const now = new Date()
  const [oh,om] = cafe.openTime.split(':').map(Number)
  const [ch,cm] = cafe.closeTime.split(':').map(Number)
  const mins = now.getHours()*60+now.getMinutes()
  return mins >= oh*60+om && mins <= ch*60+cm
}
