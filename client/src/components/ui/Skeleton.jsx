/** SkeletonCard — placeholder cho CafeCard horizontal scroll */
export function SkeletonCard() {
  return (
    <div className="relative min-w-[175px] lg:min-w-[220px] h-[250px] flex-shrink-0 rounded-3xl overflow-hidden border border-primary/15">
      <div className="skeleton w-full h-full" />
    </div>
  )
}

/** SkeletonWide — placeholder cho desktop 3-col grid card */
export function SkeletonWide() {
  return (
    <div className="relative h-[260px] rounded-3xl overflow-hidden border border-primary/15">
      <div className="skeleton w-full h-full" />
    </div>
  )
}

/** SkeletonList — placeholder cho list row */
export function SkeletonList() {
  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-primary/15 rounded-2xl">
      <div className="skeleton w-16 h-16 rounded-xl flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="skeleton h-3.5 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="flex gap-1.5">
          <div className="skeleton h-5 w-14 rounded-full" />
          <div className="skeleton h-5 w-18 rounded-full" />
        </div>
      </div>
    </div>
  )
}

/** SkeletonDetail — placeholder cho DetailPage hero */
export function SkeletonDetail() {
  return (
    <div>
      <div className="skeleton h-44 w-full" />
      <div className="mx-4 -mt-4 bg-white rounded-2xl p-4 border border-primary/15 shadow-card">
        <div className="flex justify-around">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="skeleton h-5 w-10 rounded" />
              <div className="skeleton h-3 w-14 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 pt-4 flex flex-col gap-3">
        {[1,2,3].map(i => (
          <div key={i} className="skeleton h-12 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
