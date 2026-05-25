export function SkeletonCard() {
  return (
    <div className="relative min-w-[200px] w-[200px] h-[280px] flex-shrink-0 rounded-3xl overflow-hidden border border-primary/10">
      <div className="skeleton w-full h-full" />
    </div>
  )
}
export function SkeletonWide() {
  return (
    <div className="relative w-full h-[300px] rounded-3xl overflow-hidden border border-primary/10">
      <div className="skeleton w-full h-full" />
    </div>
  )
}
export function SkeletonList() {
  return (
    <div className="flex items-center gap-3.5 px-4 py-3.5 bg-white border border-primary/10 rounded-2xl">
      <div className="skeleton w-16 h-16 rounded-xl flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="skeleton h-3.5 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="flex gap-1.5">
          <div className="skeleton h-5 w-12 rounded-full" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}
export function SkeletonDetail() {
  return (
    <div>
      <div className="skeleton h-52 w-full" />
      <div className="mx-4 -mt-4 bg-white rounded-2xl p-4 border border-primary/12 shadow-card">
        <div className="flex justify-around">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="skeleton h-5 w-10 rounded" />
              <div className="skeleton h-3 w-14 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
