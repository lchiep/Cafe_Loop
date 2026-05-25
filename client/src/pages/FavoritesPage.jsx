import { Link } from 'react-router-dom'
import { useCafes } from '../hooks/useCafes'
import { SkeletonList } from '../components/ui/Skeleton'

export default function FavoritesPage() {
  // TODO: wire to real favorites API when auth is set up
  // const { data, isLoading } = useFavorites()

  return (
    <div className="px-4 py-6 max-w-xl mx-auto fade-in">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-black text-[22px] text-accent">Yêu thích</h1>
        <p className="text-[12px] text-muted font-medium mt-0.5">Quán cafe bạn đã lưu</p>
      </div>

      {/* Empty state */}
      <div className="
        py-16 text-center rounded-3xl
        bg-white border border-primary/12
        shadow-card
      ">
        <div className="
          w-16 h-16 rounded-2xl gradient-teal
          flex items-center justify-center
          mx-auto mb-4 shadow-teal
        ">
          <svg className="w-8 h-8 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <p className="text-[15px] font-black text-accent mb-1">Chưa có quán yêu thích</p>
        <p className="text-[12px] text-muted mb-6">
          Nhấn vào biểu tượng ❤️ trên thẻ quán để lưu lại
        </p>
        <Link
          to="/results"
          className="
            inline-block gradient-teal text-navy
            px-8 py-3 rounded-full
            text-[13px] font-black shadow-teal
            hover:brightness-105 transition-all
          "
        >
          Khám phá quán cafe
        </Link>
      </div>

    </div>
  )
}
